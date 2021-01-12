import { alignmentPointsExtract } from 'Core/evaluator/web-feature-extractor/alignment-points';
import { majorElementsExtract } from 'Core/evaluator/web-feature-extractor/major-elements';
import { browserInfoExtract } from 'Core/evaluator/web-feature-extractor/browser-info';
import { textElementsExtract } from 'Core/evaluator/web-feature-extractor/text-elements';
import { imageElementsExtract } from 'Core/evaluator/web-feature-extractor/image-elements';
import { videoElementsExtract } from 'Core/evaluator/web-feature-extractor/video-elements';
import { anchorElementsExtract } from 'Core/evaluator/web-feature-extractor/anchor-elements';
import { textSizeExtract } from 'Core/evaluator/web-feature-extractor/text-size';

import { FeatureExtractorResultPhase1 } from 'Core/types/feature-extractor';

if ((window as any).SWDS === undefined) {
    // (window as any).SWDS = {};
    // const SWDS = (window as any).SWDS;

    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        const message = request.message as string;

        if (message == "extract-features") {
            const browserInfo = browserInfoExtract(window);
            const textElements = textElementsExtract(window, browserInfo);
            const imageElements = imageElementsExtract(window, browserInfo);
            const videoElements = videoElementsExtract(window, browserInfo);
            const anchorElements = anchorElementsExtract(window, browserInfo);
            const majorElements = majorElementsExtract(textElements, imageElements);
            const alignmentPoints = alignmentPointsExtract(
                majorElements.elements.map((el) => el.position),
                browserInfo
            );
            const textSize = textSizeExtract(textElements);

            const featureExtractorResultPhase1: FeatureExtractorResultPhase1 = {
                browserInfo,
                textElements,
                imageElements,
                videoElements,
                anchorElements,
                alignmentPoints,
                textSize
            };

            console.log('featureExtractorResultPhase1', featureExtractorResultPhase1);

            sendResponse(
                {
                    featureExtractorResultPhase1,
                }
            );
        };
    });
}
