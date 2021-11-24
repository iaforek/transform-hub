import { ISequenceInfo, RunnerConfig } from "@scramjet/types";

export class SequenceInfo implements ISequenceInfo {
    private instancesSet = new Set<string>();

    constructor(private readonly config: RunnerConfig) {}

    getId(): string {
        return this.config.id;
    }
    
    getConfig(): RunnerConfig {
        return this.config;
    }

    addInstance(id: string): void {
        this.instancesSet.add(id);
    }

    removeInstance(id: string): void {
        this.instancesSet.delete(id);
    }

    hasInstances(): boolean {
        return this.instancesSet.size > 0;
    }

    get instances(): readonly string[] {
        return [...this.instancesSet.values()]
    }
}