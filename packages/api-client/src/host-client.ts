/* eslint-disable @typescript-eslint/no-unused-vars */
import { SequenceClient } from "./sequence-client";
import { clientUtils } from "./client-utils";

export class HostClient {
    apiBase: string;

    constructor(apiBase: string) {
        this.apiBase = apiBase;
        clientUtils.init(apiBase);
    }

    listSequences() {
        return clientUtils.get("sequences");
    }

    listInstances() {
        return clientUtils.get("instances");
    }

    // TODO: Dedicated log stream for host not yet implemented.
    getLogStream() {
        return clientUtils.getStream("/log");
    }

    async sendSequence(sequencePackage: Buffer): Promise<SequenceClient | undefined> {
        const response = await clientUtils.post("sequence", sequencePackage, {
            "content-type":"application/octet-stream"
        });

        if (response) {
            return SequenceClient.from(response.data.id);
        }

        return undefined;
    }

    getSequence(sequenceId: string) {
        return clientUtils.get(`sequence/${sequenceId}`);
    }

    deleteSequence(sequenceId: string) {
        return clientUtils.delete(`sequence/${sequenceId}`);
    }

    getInstance(instanceId: string) {
        return clientUtils.get(`instance/${instanceId}`);
    }

    getLoadCheck() {
        return clientUtils.get("load-check");
    }
}
