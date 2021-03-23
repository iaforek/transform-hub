import { Server as NetServer } from "net";
import { Server as HttpServer } from "http";
import { EncodedMonitoringMessage } from "@scramjet/types";
import { RunnerMessageCode, HandshakeAcknowledgeMessage, MessageUtilities } from "@scramjet/model";
import { DataStream } from "scramjet";

export class HostOne {
    // @ts-ignore    
    private socketName: string;
    // @ts-ignore
    private netServer: NetServer;
    // @ts-ignore
    private httpApiServer: HttpServer;
    // @ts-ignore
    private monitorStream: DataStream;
    // @ts-ignore
    private controlStream: DataStream;

    constructor() {
        this.controlStream = new DataStream();

        this.monitorStream = new DataStream();
        this.monitorStream
            .do((...arr: any[]) => console.log("[from monitoring]", ...arr))
            .run()
            .catch(e => console.error(e));
    }

    async main(): Promise<void> {
        await this.createNetServer(this.socketName);
        await this.startSupervisor(this.socketName);
        await this.createApiServer();
        await this.hookupMonitorStream();
    }

    async createNetServer(socketName: string): Promise<void> {
        console.log(socketName);//TODO delete
        throw new Error("Method not implemented.");
    }

    async createApiServer(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    async startSupervisor(socketName: string): Promise<void> {
        console.log(socketName);//TODO delete
        throw new Error("Method not implemented.");
    }

    async hookupMonitorStream() {
        this.monitorStream
            .stringify()
            .JSONParse()
            .map(async ([code, data]: EncodedMonitoringMessage) => {
                console.log(data);//TODO delete
                switch (code) {
                case RunnerMessageCode.ACKNOWLEDGE:
                    break;
                case RunnerMessageCode.DESCRIBE_SEQUENCE:
                    break;
                case RunnerMessageCode.ALIVE:
                    break;
                case RunnerMessageCode.ERROR:
                    break;
                case RunnerMessageCode.MONITORING:
                    break;
                case RunnerMessageCode.EVENT:
                    break;
                case RunnerMessageCode.PING:
                    this.handleHandshake();
                    break;
                case RunnerMessageCode.SNAPSHOT_RESPONSE:
                    break;
                default:
                    break;
                }
            })
            .run()
            .catch(async (error) => {
                console.error("An error occurred during parsing monitoring message.", error.stack);
            });
    }

    async handleHandshake() {
        const pongMsg: HandshakeAcknowledgeMessage = {
            msgCode: RunnerMessageCode.PONG,
            appConfig: { key: "app configuration value TODO" }, //TODO
            arguments: ["../../package/data.json", "out.txt"] //TODO think how to avoid passing relative path (from runner)
        };

        await this.controlStream.whenWrote(MessageUtilities.serializeMessage<RunnerMessageCode.PONG>(pongMsg));
    }

}