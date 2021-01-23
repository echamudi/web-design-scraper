import { colorCountExtract } from 'Core/evaluator/image-feature-extractor/color-count';
import { colorSymmetryExtract } from 'Core/evaluator/image-feature-extractor/color-symmetry';
import { vibrantColorsExtract } from 'Core/evaluator/web-feature-extractor/vibrant-colors';
import { ColorCountExtractResult } from 'Core/types/factors';
import {
    Phase1Result,
    Phase2Result,
} from 'Core/types/types';
import {
    ViewportScreenshotExtractResult,
} from 'Core/types/feature-extractor';
import { imageToImageData } from 'Core/utils/image-canvas';

export async function executePhase2(
    phase1Result: Phase1Result,
    screenshot: string,
): Promise<Phase2Result> {
    const screenshotImageData: ImageData = await imageToImageData(screenshot);

    const [
        vibrantColorsExtractSettledResult,
    ] = await Promise.allSettled([
        vibrantColorsExtract(screenshot),
    ]);

    if (vibrantColorsExtractSettledResult.status === 'rejected') {
        throw new Error('failed to do vibrantColorsExtract');
    }

    const phase1FeatureExtractorResult = phase1Result;
    const vibrantColorsExtractResult = vibrantColorsExtractSettledResult.value;
    const colorSymmetryResult = colorSymmetryExtract(screenshotImageData);

    const [colorCountResult] = await Promise.allSettled([
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
        viewportArea,
        /**
         * (imageArea / viewportArea) / 2
         */
        pixelRatio: (screenshotImageArea / viewportArea) / 2,
    };

    // Combine content side result with extension side result
    const featureExtractorResult: Phase2Result = {
        ...phase1FeatureExtractorResult,
        vibrantColors: vibrantColorsExtractResult,
        colorCount: colorCountResult.value,
        colorSymmetry: colorSymmetryResult,
        viewportScreenshot,
        timestamp: Date.now(),
    };

    return featureExtractorResult;
}
