/* eslint-disable dot-notation */
import { RunnerMessageCode } from "@scramjet/model/src/runner-message";
import { CommunicationHandler } from "@scramjet/model/src/stream-handler";
import { CSHConnector } from "@scramjet/types/src/csh-client";
import { EncodedMessage, UpstreamStreamsConfig } from "@scramjet/types/src/message-streams";
import { DelayedStream, MaybePromise } from "@scramjet/types/src/utils";
import { createReadStream } from "fs";
import { DataStream } from "scramjet";
import { Readable, Writable } from "stream";

class CSHClient implements CSHConnector {
    PATH = process.env.SEQUENCE_PATH || "";
    errors = {
        params: "Wrong number of array params",
        emptyPath: "Path is empty"
    }
    private monitorStream: DelayedStream;
    private controlStream: DelayedStream;
    private communicationHandler: CommunicationHandler;

    constructor(communicationHandler: CommunicationHandler) {
        this.monitorStream = new DelayedStream();
        this.controlStream = new DelayedStream();
        this.communicationHandler = communicationHandler;
    }

    upstreamStreamsConfig() {
        return [
            new Readable(),
            new Writable(),
            new Writable(),
            this.controlStream.getStream(),
            this.monitorStream.getStream()
        ] as UpstreamStreamsConfig;
    }

    hookCommunicationHandler() {
        this.communicationHandler.hookClientStreams(this.upstreamStreamsConfig());
        this.getMonitoringDownstream();
    }

    getMonitoringDownstream() {
        DataStream.from(this.communicationHandler["monitoringDownstream"] as Readable)
            .do((...arr: any[]) => console.log(...arr))
            .run();
    }

    getPackage(path = this.PATH): Readable {
        if (path === "") throw new Error(this.errors.emptyPath);

        return createReadStream(path);
    }

    kill(): MaybePromise<void> {
        this.communicationHandler.addControlHandler(RunnerMessageCode.KILL, this.killHandler);
    }

    killHandler(): EncodedMessage<RunnerMessageCode.KILL> {
        return [RunnerMessageCode.KILL, {}];
    }
}

export { CSHClient };
