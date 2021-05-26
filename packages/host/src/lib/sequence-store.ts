import { DockerodeDockerHelper } from "@scramjet/adapters";
import { getLogger } from "@scramjet/logger";
import { HostError } from "@scramjet/model";
import { ISequence, ISequenceStore } from "@scramjet/types";
import { CSIController } from "./csi-controller";
import { ReasonPhrases } from "http-status-codes";
import { Sequence } from "./sequence";
import { InstanceStore } from "./instance-store";

/**
 *
 * An utility class for manipulation of the
 * Sequences stored on the CSH.
 *
 * Question: Patryk raised an issue that we should think of
 * saving the Sequence information in the file (for the future sprints)
 *
 * or, we could just try to reconnect instances after host restart.
 */
export class SequenceStore implements ISequenceStore {
    dockerHelper: DockerodeDockerHelper = new DockerodeDockerHelper();

    instancesStore = InstanceStore;

    private logger = getLogger(this);
    private sequences: { [key: string]: Sequence } = {}

    getSequences(): ISequence[] {
        return Object.values(this.sequences);
    }

    getById(key: string): ISequence {
        return this.sequences[key];
    }

    add(sequence: ISequence) {
        if (sequence) {
            this.sequences[sequence.id] = sequence;
        }

        this.logger.log("New sequence added:", sequence.id);
    }

    async delete(id: string): Promise<ReasonPhrases> {
        if (!id) {
            return ReasonPhrases.BAD_REQUEST;
        }

        const sequence = this.getById(id);

        if (!sequence) {
            return ReasonPhrases.NOT_FOUND;
        }

        const isRunning = !!Object.values(this.instancesStore)
            .find((instance: CSIController) => instance.sequence === sequence);

        if (isRunning) {
            this.logger.log("Can't remove sequence in use:", id);

            return ReasonPhrases.CONFLICT;
        }

        /**
         * TODO: Here we also need to check if there aren't any Instances running
         * that use this Sequence.
         */

        const volumeId = this.sequences[id].config.packageVolumeId as string;

        try {
            this.logger.log("Removing volume...", volumeId);
            await this.dockerHelper.removeVolume(volumeId);

            delete this.sequences[id];

            this.logger.log("Volume removed:", volumeId);

            return ReasonPhrases.OK;
        } catch (error) {
            this.logger.error("Error removing sequence!");
            throw new HostError("CONTROLLER_ERROR");
        }
    }

    close() {
        return Promise.all(
            Object.values(this.sequences).map(seq => {
                return this.delete(seq.id);
            })
        );
    }
}