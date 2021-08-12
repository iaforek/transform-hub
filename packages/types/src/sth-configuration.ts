export type ContainerConfiguration = {
    /**
     * Docker image to use.
     */
    image: string;
    /**
     * Maximum memory container can allocate.
     */
    maxMem: number;
}

export type HostConfig = {
    /**
     * Hostname.
     */
    hostname: string;
    /**
     * API port.
     */
    port: number;
    /**
     * API URL.
     */
    apiBase: string;
    /**
     * Socket name for connecting supervisors.
     */
    socketPath: string;
}

export type STHConfiguration = {
    cpmUrl: string;

    /**
     * Docker related configuration.
     */
    docker: {
        prerunner: ContainerConfiguration,
        runner: ContainerConfiguration,
    },

    /**
     * Host configuration.
     */
    host: HostConfig;

    instanceRequirements: {
        /**
         * Free memory required to start instance. In megabytes.
         */
        freeMem: number;
        /**
         * Required free CPU. In percentage.
         */
        cpuLoad: number;
        /**
         * Free disk space required to start instance. In megabytes.
         */
        freeSpace: number;
    },

    /**
     * The amount of memory that must remain free.
     */
    safeOperationLimit: number;

    /**
     * Should we identify existing sequences
     */
    identifyExisting: boolean;
}

export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]>; };
