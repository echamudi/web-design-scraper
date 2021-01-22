import { Phase1Result } from 'Core/types/types';
import { executePhase1 } from 'Executor/phases';

if ((window as any).SWDS === undefined) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        const message = request.message as string;

        if (message == "extract-features") {
            const phase1Result: Phase1Result = executePhase1(window);
            console.log('phase1Result', phase1Result);

            sendResponse(
                {
                    phase1Result,
                }
            );
        };
    });
}
