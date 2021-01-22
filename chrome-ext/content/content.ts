import { FeatureExtractorResultPhase1 } from 'Core/types/types';
import { executePhase1 } from 'Executor/phases';

if ((window as any).SWDS === undefined) {
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        const message = request.message as string;

        if (message == "extract-features") {
            const featureExtractorResultPhase1: FeatureExtractorResultPhase1 = executePhase1(window);
            console.log('featureExtractorResultPhase1', featureExtractorResultPhase1);

            sendResponse(
                {
                    featureExtractorResultPhase1,
                }
            );
        };
    });
}
