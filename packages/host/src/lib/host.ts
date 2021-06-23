import { LifecycleDockerAdapterSequence } from "@scramjet/adapters";
import { addLoggerOutput, getLogger } from "@scramjet/logger";
import { CommunicationHandler, HostError, IDProvider } from "@scramjet/model";
import { APIExpose, AppConfig, HostConfiguration, IComponent, Logger, NextCallback, ParsedMessage, RunnerConfig } from "@scramjet/types";

import { CSIController } from "./csi-controller";
import { SequenceStore } from "./sequence-store";
import { Sequence } from "./sequence";
import { SocketServer } from "./socket-server";

import { unlink } from "fs/promises";
import { IncomingMessage, ServerResponse } from "http";
import { Readable } from "stream";
import { InstanceStore } from "./instance-store";

import { loadCheck } from "./load-check";
import { ReasonPhrases } from "http-status-codes";
import { configService } from "@scramjet/csi-config";

import * as findPackage from "find-package-json";

const version = findPackage().next().value?.version || "unknown";

export type HostOptions = Partial<{
    identifyExisiting: boolean
}>;

export class Host implements IComponent {
    config: HostConfiguration;

    api: APIExpose;

    apiBase: string;
    instanceBase: string;

    socketServer: SocketServer;

    instancesStore = InstanceStore;
    sequencesStore: SequenceStore = new SequenceStore();

    logger: Logger;

    private attachListeners() {
        this.socketServer.on("connect", async ({ id, streams }) => {
            this.logger.log("Supervisor connected:", id);

            await this.instancesStore[id].handleSupervisorConnect(streams);
        });
    }

    constructor(apiServer: APIExpose, socketServer: SocketServer) {
        this.config = configService.getConfig();

        this.logger = getLogger(this);

        this.socketServer = socketServer;
        this.api = apiServer;

        this.apiBase = this.config.host.apiBase;
        this.instanceBase = `${this.config.host.apiBase}/instance`;

        if (this.config.host.apiBase.includes(":")) {
            throw new HostError("API_CONFIGURATION_ERROR", "Can't expose an API on paths including a semicolon...");
        }
    }

    async main({ identifyExisiting = true }: HostOptions = {}) {
        addLoggerOutput(process.stdout);

        this.logger.info("Host main called.");

        try {
            await unlink("/tmp/socket-server-path");
        } catch (error) {
            console.error(error.stack);
        }

        if (identifyExisiting)
            await this.identifyExistingSequences();

        await this.socketServer.start();

        this.api.server.listen(this.config.host.port);

        await new Promise<void>(res => {
            this.api?.server.once("listening", () => {
                this.logger.info("API listening on port:", this.config.host.port);
                res();
            });
        });

        this.attachListeners();
        this.attachHostAPIs();
    }

    /**
     * Setting up handlers for general Host API endpoints:
     * - creating Sequence (passing stream with the compressed package)
     * - starting Instance (based on a given Sequence ID passed in the HTTP request body)
     * - getting sequence details
     * - listing all instances running on the CSH
     * - listing all sequences saved on the CSH
     * - intance
     */
    attachHostAPIs() {
        this.api.downstream(`${this.apiBase}/sequence`,
            async (req) => this.handleNewSequence(req), { end: true }
        );

        this.api.get(`${this.apiBase}/sequence/:id`, (req) => this.getSequence(req.params?.id));
        this.api.get(`${this.apiBase}/sequence/:id/instances`, (req) => this.getSequenceInstances(req.params?.id));

        this.api.op("post",
            `${this.apiBase}/sequence/:id/start`, async (req) => this.handleStartSequence(req));
        this.api.op("delete", `${this.apiBase}/sequence/:id`, (req: ParsedMessage) => this.handleDeleteSequence(req));

        this.api.get(`${this.apiBase}/sequences`, () => this.getSequences());
        this.api.get(`${this.apiBase}/instances`, () => this.getCSIControllers());
        this.api.get(`${this.apiBase}/load-check`, () => loadCheck.getLoadCheck());
        this.api.get(`${this.apiBase}/version`, () => ({ version }));

        this.api.use(`${this.instanceBase}/:id`, (req, res, next) => this.instanceMiddleware(req as ParsedMessage, res, next));
    }

    instanceMiddleware(req: ParsedMessage, res: ServerResponse, next: NextCallback) {
        const params = req.params;

        if (!params || !params.id) {
            return next(new HostError("UNKNOWN_INSTANCE"));
        }

        const instance = this.instancesStore[params.id];

        if (instance) {
            if (!instance.router) {
                return next(new HostError("CONTROLLER_ERROR", "Instance controller doesn't provide API."));
            }

            req.url = req.url?.substring(this.instanceBase.length + 1 + params.id.length);

            this.logger.debug(req.method, req.url);

            return instance.router.lookup(req, res, next);
        }

        res.statusCode = 404;
        res.end();

        return next();
    }

    async handleDeleteSequence(req: ParsedMessage) {
        const id = req.params?.id;

        return {
            opStatus: await this.sequencesStore.delete(id)
        };
    }

    async identifyExistingSequences() {
        this.logger.info("Listing exiting sequences");
        const ldas = new LifecycleDockerAdapterSequence();

        try {
            await ldas.init();
            this.logger.debug("LDAS initialized, listing");
            const sequences = await ldas.list();

            for (const sequenceConfig of sequences) {
                const sequence = new Sequence(
                    sequenceConfig
                );

                this.sequencesStore.add(sequence);
                this.logger.log("Sequence found:", sequence.config);
            }
        } catch (e) {
            this.logger.warn("Error while trying to identify existing sequences", e);
        }
    }

    async handleNewSequence(stream: IncomingMessage) {
        this.logger.log("New sequence incoming...");
        const id = IDProvider.generate();

        try {
            const sequenceConfig: RunnerConfig = await this.identifySequence(stream, id);
            const sequence = new Sequence(sequenceConfig);

            this.sequencesStore.add(sequence);

            this.logger.log("Sequence identified:", sequence.config);

            return {
                id: sequence.id
            };
        } catch (error) {
            return {
                opStatus: 422,
                error
            };
        }
    }

    async handleStartSequence(req: ParsedMessage) {
        if (await loadCheck.overloaded()) {
            return {
                opStatus: ReasonPhrases.INSUFFICIENT_SPACE_ON_RESOURCE,
            };
        }

        // eslint-disable-next-line no-extra-parens
        const seqId = req.params?.id;
        const payload = req.body || {};
        const sequence = this.sequencesStore.getById(seqId);

        if (sequence) {
            this.logger.log("Starting sequence", sequence.id);

            const instanceId = await this.startCSIController(sequence, payload.appConfig as AppConfig, payload.args);

            return {
                id: instanceId
            };
        }

        return undefined;
    }

    async identifySequence(stream: Readable, id: string): Promise<RunnerConfig> {
        return new Promise(async (resolve, reject) => {
            const ldas = new LifecycleDockerAdapterSequence();

            try {
                await ldas.init();
                const identifyResult = await ldas.identify(stream, id);

                if (identifyResult.error) {
                    reject(identifyResult.error);
                }

                resolve(identifyResult);
            } catch {
                reject();
            }
        });
    }

    async startCSIController(sequence: Sequence, appConfig: AppConfig, sequenceArgs?: any[]): Promise<string> {
        const communicationHandler = new CommunicationHandler();
        const id = IDProvider.generate();
        const csic = new CSIController(id, sequence, appConfig, sequenceArgs, communicationHandler, this.logger);

        this.logger.log("New CSIController created: ", id);

        this.instancesStore[id] = csic;

        await csic.start();

        sequence.instances.push(id);

        this.logger.log("CSIController started:", id);

        csic.on("end", (code) => {
            this.logger.log("CSIControlled ended, code:", code);
            delete InstanceStore[csic.id];

            const index = sequence.instances.indexOf(id);

            if (~index) {
                sequence.instances.splice(index, 1);
            }
        });

        return id;
    }

    getCSIControllers() {
        this.logger.log("List CSI controllers.");

        return Object.values(this.instancesStore).map(csiController => {
            return {
                id: csiController.id,
                sequence: csiController.sequence,
                status: csiController.status
            };
        });
    }

    getSequence(id: string) {
        return this.sequencesStore.getById(id);
    }

    getSequences(): any {
        return this.sequencesStore.getSequences();
    }

    getSequenceInstances(sequenceId: string) {
        return this.sequencesStore.getById(sequenceId).instances;
    }
}

