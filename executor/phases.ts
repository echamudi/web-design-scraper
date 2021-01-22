import { colorCountExtract } from "Core/evaluator/image-feature-extractor/color-count";
import { colorSymmetryExtract } from "Core/evaluator/image-feature-extractor/color-symmetry";
import { alignmentPointsExtract } from "Core/evaluator/web-feature-extractor/alignment-points";
import { anchorElementsExtract } from "Core/evaluator/web-feature-extractor/anchor-elements";
import { browserInfoExtract } from "Core/evaluator/web-feature-extractor/browser-info";
import { imageElementsExtract } from "Core/evaluator/web-feature-extractor/image-elements";
import { majorElementsExtract } from "Core/evaluator/web-feature-extractor/major-elements";
import { textElementsExtract } from "Core/evaluator/web-feature-extractor/text-elements";
import { textSizeExtract } from "Core/evaluator/web-feature-extractor/text-size";
import { vibrantColorsExtract } from "Core/evaluator/web-feature-extractor/vibrant-colors";
import { videoElementsExtract } from "Core/evaluator/web-feature-extractor/video-elements";
import { ColorCountExtractResult } from "Core/types/factors";
import {
    FeatureExtractorResultPhase1,
    FeatureExtractorResultPhase2,
    ViewportScreenshotExtractResult
} from "Core/types/feature-extractor";
import { imageToImageData } from "Core/utils/image-canvas";

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

export async function executePhase2(
    featureExtractorResultPhase1: FeatureExtractorResultPhase1,
    screenshot: string
): Promise<FeatureExtractorResultPhase2> {
    const screenshotImageData: ImageData = await imageToImageData(screenshot);

    const [
        vibrantColorsExtractSettledResult
    ] = await Promise.allSettled([
        vibrantColorsExtract(screenshot)
    ]);

    if (vibrantColorsExtractSettledResult.status === 'rejected') {
        throw new Error('failed to do vibrantColorsExtract');
    }

    const phase1FeatureExtractorResult = featureExtractorResultPhase1;
    const vibrantColorsExtractResult = vibrantColorsExtractSettledResult.value;
    const colorSymmetryResult = colorSymmetryExtract(screenshotImageData);

    let [colorCountResult] = await Promise.allSettled([
        new Promise<ColorCountExtractResult>(async (resolve, reject) => {
            const result = await colorCountExtract(screenshotImageData);
            resolve(result);
        }),
    ]);

    if (colorCountResult.status === 'rejected') {
        throw new Error('failed to do colorCountResult');
    }

    const screenshotImageArea = screenshotImageData.width * screenshotImageData.height;
    const viewportArea = phase1FeatureExtractorResult.browserInfo.viewportWidth
        * phase1FeatureExtractorResult.browserInfo.viewportHeight;

    // TODO: move to its own function
    const viewportScreenshot: ViewportScreenshotExtractResult = {
        image: screenshot,
        imageWidth: screenshotImageData.width,
        imageHeight: screenshotImageData.height,
        imageArea: screenshotImageArea,
        viewportWidth: phase1FeatureExtractorResult.browserInfo.viewportWidth,
        viewportHeight: phase1FeatureExtractorResult.browserInfo.viewportHeight,
        viewportArea: viewportArea,
        /**
         * (imageArea / viewportArea) / 2
         */
        pixelRatio: (screenshotImageArea / viewportArea) / 2
    };

    // Combine content side result with extension side result
    const featureExtractorResult: FeatureExtractorResultPhase2 = {
        ...phase1FeatureExtractorResult,
        vibrantColors: vibrantColorsExtractResult,
        colorCount: colorCountResult.value,
        colorSymmetry: colorSymmetryResult,
        viewportScreenshot,
        timestamp: Date.now()
    };

    return featureExtractorResult;
}
