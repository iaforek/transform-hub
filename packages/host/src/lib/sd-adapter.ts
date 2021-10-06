import { Logger, ReadableStream, WritableStream } from "@scramjet/types";
import { getLogger } from "@scramjet/logger";
import { PassThrough, Stream } from "stream";
import { CPMConnector } from "./cpm-connector";
export type dataType = {
    topic: string;
    contentType: string;
}

export type streamType = {
    contentType: string;
    stream: Stream;
}

export class ServiceDiscovery {
    dataMap = new Map<
        string,
        {
            contentType: string,
            stream: ReadableStream<any> | WritableStream<any>,
            localProvider?: string,
            cpmRequest?: boolean
        }
    >();
    logger: Logger = getLogger(this);
    cpmConnector?: CPMConnector;

    setConnector(cpmConnector: CPMConnector) {
        this.cpmConnector = cpmConnector;
    }

    addData(config: dataType, end: boolean, localProvider?: string) {
        if (!this.dataMap.has(config.topic)) {
            this.logger.log("Adding data:", config, "end:", end);
            const topicStream = new PassThrough();

            this.dataMap.set(config.topic, {
                contentType: config.contentType,
                stream: topicStream,
                localProvider
            });
        } else {
            this.logger.log("Routing data:", config, "end:", end);
        }

        if (localProvider) {
            this.logger.log(`Local provider added topic:${config.topic}, provider:${localProvider}`);

            if (this.cpmConnector) {
                this.cpmConnector
                    .sendTopic(config.topic, this.dataMap.get(config.topic)!);

                this.logger.log("Sending data to cpm");
            }
        }

        return this.dataMap.get(config.topic);
    }

    getTopics() {
        const o: any = [];

        return o;
    }

    getByTopic(topic: string): streamType | undefined {
        if (this.dataMap.has(topic)) {
            return this.dataMap.get(topic);
        }

        return undefined;
    }

    removeLocalProvider(topic: string) {
        const d = this.dataMap.get(topic);

        if (d) {
            this.dataMap.set(topic, { ...d, localProvider: undefined });
        }
    }

    getData(dataType: dataType, end?: boolean):
        ReadableStream<any> | WritableStream<any> | undefined {
        this.logger.log("Get data:", dataType);

        if (this.dataMap.has(dataType.topic)) {
            const topicData = this.dataMap.get(dataType.topic)!;

            this.logger.log("Topic exists");

            if (topicData?.localProvider) {
                this.logger.log(`LocalProvider found topic:${dataType.topic}, provider:${topicData.localProvider}`);
            } else {
                this.logger.log("Local topic provider not found for:", dataType.topic);

                if (this.cpmConnector) {
                    this.logger.log("Requesting CPM for:", dataType);

                    this.cpmConnector?.getTopic(dataType.topic)
                        .then(stream => {
                            this.logger.log("CPM connected for:", dataType);

                            stream.pipe(topicData?.stream as WritableStream<any>);
                        });

                    this.dataMap.set(dataType.topic, { ...topicData, cpmRequest: true });
                }
            }

            return topicData?.stream.on("end", () => this.logger.debug("Topic ended:", dataType));
        }

        this.addData(dataType, !!end);

        return this.getData(dataType, end);
    }

    removeData(topic: string) {
        if (this.dataMap.has(topic)) {
            // eslint-disable-next-line no-extra-parens
            (this.dataMap.get(topic)?.stream as ReadableStream<any>).unpipe();
            this.dataMap.delete(topic);
        }
    }
}