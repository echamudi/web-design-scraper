import { Phase1Result } from "Core/types/types";
import { executePhase2 } from "Executor/phases";

onmessage = function(e: MessageEvent<{phase1Result: Phase1Result, screenshot: string}>) {
    const { phase1Result, screenshot } = e.data;

    executePhase2(
      phase1Result,
      screenshot
    ).then((phase2Result) => {
        postMessage({
            workerRes: phase2Result
        }, 'phase2Worker');
    });
}
