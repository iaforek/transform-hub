import { Readable } from "stream";
import { MonitoringMessage } from "./runner";
import { MaybePromise, ReadableStream } from "./utils";

export type RunnerConfig = {
    image: string;
    version: string;
    engines: {
        [key: string]: string
    };
    config?: any;
}

export type LifeCycleConfig = {
    makeSnapshotOnError: boolean;
}

export type DockerRunnerConfig = RunnerConfig & {
    config: {volumesFrom: string};
}

type ExitCode = number;

export interface LifeCycle {
    // lifecycle operations
    idenitfy(stream: Readable): MaybePromise<RunnerConfig>;
    // resolves when 
    run(config: RunnerConfig): Promise<ExitCode>;
    cleanup(): MaybePromise<void>;
    snapshot(): MaybePromise<string>; // returns url identifier of made snapshot

    pushStdio(stream: "stdin"|0, input: ReadableStream<string>): this;
    readStdio(stream: "stdout"|1): ReadableStream<string>;
    readStdio(stream: "stderr"|2): ReadableStream<string>;

    monitorRate(rps: number): this;
    monitor(): ReadableStream<MonitoringMessage>;

    stop(): MaybePromise<void>;
    kill(): MaybePromise<void>;
}

export type LifeCycleError = any | (Error & {exitCode?: number, errorMessage?: string});