import { imageConfig } from "@scramjet/csi-config";
import { CommunicationHandler } from "@scramjet/model";
import {
    DelayedStream,
    DownstreamStreamsConfig,
    ExitCode,
    LifeCycle,
    MaybePromise,
    RunnerConfig
} from "@scramjet/types";
import { exec } from "child_process";
import { createReadStream } from "fs";
import { chmod, mkdtemp } from "fs/promises";
import { tmpdir } from "os";
import * as path from "path";
import * as shellescape from "shell-escape";
import { PassThrough, Readable } from "stream";
import { DockerodeDockerHelper } from "./dockerode-docker-helper";
import { DockerHelper, DockerVolume } from "./types";

class LifecycleDockerAdapter implements LifeCycle {
    private dockerHelper: DockerHelper;

    // @ts-ignore
    private runnerConfig?: string;
    // @ts-ignore
    private prerunnerConfig?: string;
    // @ts-ignore
    private monitorFifoPath: string;
    // @ts-ignore
    private controlFifoPath: string;
    private imageConfig: {
        runner?: string,
        prerunner?: string
    } = {};

    private runnerStdin: PassThrough;
    private runnerStdout: PassThrough;
    private runnerStderr: PassThrough;
    private monitorStream: DelayedStream;
    private controlStream: DelayedStream;

    constructor() {
        this.runnerStdin = new PassThrough();
        this.runnerStdout = new PassThrough();
        this.runnerStderr = new PassThrough();
        this.dockerHelper = new DockerodeDockerHelper();
        this.monitorStream = new DelayedStream();
        this.controlStream = new DelayedStream();
    }

    async init(): Promise<void> {
        this.imageConfig = await imageConfig();
    }

    private async createFifo(dir: string, fifoName: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const fifoPath: string = shellescape([dir + "/" + fifoName]).replace(/\'/g, "");

            exec(`mkfifo ${fifoPath}`, async (error) => {
                if (error) {
                    console.error(`exec error: ${error}`);
                    reject(error);
                }

                await chmod(fifoPath, 0o777);

                resolve(fifoPath);
            });
        });
    }

    private async createFifoStreams(controlFifo: string, monitorFifo: string): Promise<string> {
        return new Promise(async (resolve, reject) => {
            const dirPrefix: string = "fifos";

            let createdDir: string;

            try {
                createdDir = await mkdtemp(path.join(tmpdir(), dirPrefix));

                //TODO: TBD how to allow docker user "runner" to access this directory.

                [this.controlFifoPath, this.monitorFifoPath] = await Promise.all([
                    this.createFifo(createdDir, controlFifo),
                    this.createFifo(createdDir, monitorFifo)]);

                await chmod(createdDir, 0o777);

                resolve(createdDir);
            } catch (err) {
                reject(err);
            }
        });
    }

    identify(stream: Readable): MaybePromise<RunnerConfig> {
        return new Promise(async (resolve) => {
            const volume: DockerVolume = await this.dockerHelper.createVolume();
            const { streams, wait } = await this.dockerHelper.run({
                imageName: this.imageConfig.prerunner || "",
                volumes: [
                    { mountPoint: "/package", volume }
                ],
                autoRemove: true
            });

            stream.pipe(streams.stdin);
            let preRunnerResponse = "";

            streams.stdout
                .on("data", (chunk) => {
                    preRunnerResponse += chunk.toString();
                })
                .on("end", async () => {
                    const res = JSON.parse(preRunnerResponse);

                    resolve({
                        image: this.imageConfig.runner || "",
                        version: res.version || "",
                        engines: {
                            ...res.engines
                        },
                        sequencePath: res.main,
                        packageVolumeId: volume
                    });
                });

            await wait();
        });
    }

    hookCommunicationHandler(communicationHandler: CommunicationHandler): void {
        const downstreamStreamsConfig: DownstreamStreamsConfig =
            [
                this.runnerStdin,
                this.runnerStdout,
                this.runnerStderr,
                this.controlStream.getStream(),
                this.monitorStream.getStream()
            ];

        communicationHandler.hookLifecycleStreams(downstreamStreamsConfig);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    async run(config: RunnerConfig): Promise<ExitCode> {
        let createdDir = await this.createFifoStreams("control.fifo", "monitor.fifo");

        //this.monitorStream.run(createReadStream(this.monitorFifoPath));
        //this.controlStream.run(createWriteStream(this.controlFifoPath));

        // dev - log monitoring stream
        createReadStream(this.monitorFifoPath, {
            encoding: "utf-8"
        }).pipe(process.stdout);

        return new Promise(async (resolve) => {
            const { streams, containerId } = await this.dockerHelper.run({
                imageName: this.imageConfig.runner || "",
                volumes: [
                    { mountPoint: "/package", volume: config.packageVolumeId || "" }
                ],
                binds: [
                    `${createdDir}:/pipes`
                ],
                envs: ["FIFOS_DIR=/pipes", `SEQUENCE_PATH=${config.sequencePath}`]
            });

            // dev
            streams.stdout.pipe(process.stdout);
            streams.stderr.pipe(process.stdout);

            this.runnerStdin.pipe(streams.stdin);
            streams.stdout.pipe(this.runnerStdout);
            streams.stderr.pipe(this.runnerStderr);

            await this.dockerHelper.wait(containerId, { condition: "not-running" });
            resolve(0);
        });
    }

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cleanup(): MaybePromise<void> {
    }

    // returns url identifier of made snapshot
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    snapshot(): MaybePromise<string> {
    }

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    monitorRate(rps: number): this {
    }


    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    stop(): MaybePromise<void> {
    }

    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    kill(): MaybePromise<void> {
    }
}

export { LifecycleDockerAdapter };
