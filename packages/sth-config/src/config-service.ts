import { PartialSTHConfiguration, STHConfiguration } from "@scramjet/types";

const merge = (objTo: any, objFrom: any) => !objTo ? objFrom : Object.keys(objTo)
    .reduce(
        ([mTo, mFrom], key) => {
            if (typeof mFrom[key] === "object" && typeof mTo[key] === "object" && !Array.isArray(mTo[key]))
                merge(mTo[key], mFrom[key] ?? {});
            else
                mTo[key] = mFrom[key] || mTo[key];
            return [mTo, mFrom];
        },
        [objTo, objFrom]
    );
//
const defaultConfig: STHConfiguration = {
    docker: {
        prerunner: {
            image: "",
            maxMem: 128
        },
        runner: {
            image: "",
            maxMem: 512
        },
    },
    identifyExisting: false,
    host: {
        hostname: "localhost",
        port: 8000,
        apiBase: "/api/v1",
        socketPath: "/tmp/scramjet-socket-server-path"
    },
    instanceRequirements: {
        freeMem: 256,
        cpuLoad: 10,
        freeSpace: 128
    },
    safeOperationLimit: 512
};

class ConfigService {
    private config: STHConfiguration;

    constructor(config?: Partial<STHConfiguration>) {
        this.config = defaultConfig;
        this.updateImages();

        if (config) merge(this.config, config);
    }

    updateImages() {
        const imageConfig = require("./image-config.json");

        this.config.docker.prerunner.image = imageConfig.prerunner;
        this.config.docker.runner.image = imageConfig.runner;
    }

    getConfig() {
        return this.config;
    }

    getDockerConfig() {
        return this.config.docker;
    }

    update(config: PartialSTHConfiguration) {
        merge(this.config, config);
    }
}

export const configService = new ConfigService();