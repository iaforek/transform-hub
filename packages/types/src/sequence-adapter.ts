import { SequenceConfig } from "./runner-config";
import { Readable } from "stream";
import { InstanceId } from "./instance";

export type SequenceInfo = {
    id: string;
    config: SequenceConfig;
    instances: Set<InstanceId>;
}

export interface ISequenceAdapter {
    init(): Promise<void>;

    /**
     * Identifies existing sequences
     */
    list(): Promise<SequenceConfig[]>;

    /**
     * Identifies new sequence
     */
    identify(stream: Readable, id: string): Promise<SequenceConfig>;

    remove(conifg: SequenceConfig): Promise<void>
}
