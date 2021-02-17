import { WriteSequence, WritableApp } from "../runner";
import transform from "./lib/transform";

export const app: WritableApp<{x: number}, [{test: number}]> =
    function abc(_source) {
        const sequence: WriteSequence<{x: number}> = [
            _source,
            // this should fail
            function* () {
                let prev: { x: number; } | undefined = yield;
                while (prev) {
                    prev = yield { y: prev.x + 199 };
                }
            },
            function* () {
                let prev: { y: number; } | undefined = yield;
                while (prev) {
                    prev = yield { y: prev.y + 199 };
                }
            },
            function* () {
                let prev: { y: number; } | undefined = yield;
                while (prev) {
                    prev = yield { y: prev.y + 199 };
                }
            },
            transform,
            function* () {
                let prev: { z: number; } | undefined = yield;
                while (prev) {
                    prev = yield { x: prev.z + 199 };
                }
            }
        ];

        return sequence;
    };