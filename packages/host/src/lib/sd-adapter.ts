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

    addData(outputStream: ReadableStream<any>, config: dataType, end: boolean, localProvider?: string) {
        this.logger.log("Adding data:", config);

        if (!this.dataMap.has(config.topic)) {
            const ps = new PassThrough();

            this.dataMap.set(config.topic, {
                contentType: config.contentType,
                stream: ps,
                localProvider
            });
            outputStream.pipe(ps, { end: end });
            ps.pipe(process.stdout);
            ps.resume();
        } else {
            outputStream.pipe(this.dataMap.get(config.topic)!.stream as WritableStream<any>, { end: end });
        }

        if (localProvider) {
            this.logger.log(`Local provider added data ${config.topic}, sending data to CPM`);
            this.cpmConnector?.sendTopic(config.topic, this.dataMap.get(config.topic)!.stream as ReadableStream<any>);
        }
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

            this.getData({ topic, contentType: d.contentType });
        }
    }

    getData(dataType: dataType, end?: boolean, inputStream?: WritableStream<any>):
        ReadableStream<any> | WritableStream<any> | undefined {
        this.logger.log("Get data:", dataType);

        if (this.dataMap.has(dataType.topic)) {
            const topicData = this.dataMap.get(dataType.topic)!;

            if (topicData?.localProvider) {
                this.logger.log("LocalProvider found for topic", dataType.topic);

                if (inputStream) {
                    topicData?.stream.pipe(inputStream);
                }
            } else {
                this.logger.log("LocalProvider not found for topic", dataType.topic, "requesting CPM");

                this.cpmConnector?.getTopic(dataType.topic)
                    .then(stream => {
                        this.logger.log("-------------- CPM RESPONDED");

                        if (inputStream) {
                            topicData?.stream.pipe(inputStream);
                        }

                        stream.pipe(topicData?.stream as WritableStream<any>);
                    });

                this.dataMap.set(dataType.topic, { ...topicData, cpmRequest: true });
            }

            return topicData?.stream;
        }

        this.addData(new PassThrough(), dataType, end!);

        return this.getData(dataType, end, inputStream);
    }

    removeData(topic: string) {
        if (this.dataMap.has(topic)) {
            // eslint-disable-next-line no-extra-parens
            (this.dataMap.get(topic)?.stream as ReadableStream<any>).unpipe();
            this.dataMap.delete(topic);
        }
    }
}
