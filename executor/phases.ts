import { alignmentPointsExtract } from "Core/evaluator/web-feature-extractor/alignment-points";
import { anchorElementsExtract } from "Core/evaluator/web-feature-extractor/anchor-elements";
import { browserInfoExtract } from "Core/evaluator/web-feature-extractor/browser-info";
import { imageElementsExtract } from "Core/evaluator/web-feature-extractor/image-elements";
import { majorElementsExtract } from "Core/evaluator/web-feature-extractor/major-elements";
import { textElementsExtract } from "Core/evaluator/web-feature-extractor/text-elements";
import { textSizeExtract } from "Core/evaluator/web-feature-extractor/text-size";
import { videoElementsExtract } from "Core/evaluator/web-feature-extractor/video-elements";
import { FeatureExtractorResultPhase1 } from "Core/types/feature-extractor";

export function executePhase1(win: Window): FeatureExtractorResultPhase1 {
    const browserInfo = browserInfoExtract(win);
    const textElements = textElementsExtract(win, browserInfo);
    const imageElements = imageElementsExtract(win, browserInfo);
    const videoElements = videoElementsExtract(win, browserInfo);
    const anchorElements = anchorElementsExtract(win, browserInfo);
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

    return featureExtractorResultPhase1;
}
