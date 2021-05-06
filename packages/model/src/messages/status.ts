import { FunctionDefinition } from "@scramjet/types";
import { RunnerMessageCode } from "@scramjet/symbols";

export type StatusMessageData = {

     /** Provides the definition of each subsequence.  */
    definition?: FunctionDefinition[];
}

/**
 * Message providing the definition of the Sequence.
 * It includes information on stream mode, name, description and scalability of each subsequence.
 * This message type is sent from Runner.
 */
export type StatusMessage = { msgCode: RunnerMessageCode.STATUS } & StatusMessageData;
