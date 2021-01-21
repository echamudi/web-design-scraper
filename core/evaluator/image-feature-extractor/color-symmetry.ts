import { ColorSymmetryExtractResult } from "Core/types/feature-extractor";
import { colorDiff } from "Core/utils/color";
import { getPixelImageData, setPixelImageData } from "Core/utils/image-canvas";
import { scaleValue } from "Core/utils/math";

/**
 * Check image symmetry with CIEDE2000 algorithm
 * @param imageData 
 */
export function colorSymmetryExtract(imageData: ImageData): ColorSymmetryExtractResult {
    const { width, height } = imageData;
    const halfWidth = Math.floor(width / 2);
    const halfHeight = Math.floor(height / 2);

    const diffScale: [number, number] = [0, 100];
    const byteScale: [number, number] = [0, 255];

    const horizontal: ColorSymmetryExtractResult['horizontal'] = (() => {
        const totalPixelPairs = width * halfHeight;
        const visualization = new ImageData(width, halfHeight);
        let ciede2000average = 0;

        for (let y = 0; y < halfHeight; y++) {
            const counterY = height - y - 1;

            for (let x = 0; x < width; x++) {
                const colorAtTopSide = getPixelImageData(imageData, x, y);
                const colorAtBottomSide = getPixelImageData(imageData, x, counterY);

                const diff = colorDiff(colorAtTopSide, colorAtBottomSide);
                // console.log(x, y, 'vs', x, counterY, '=', diff);

                ciede2000average += diff;

                const diffScaled = Math.floor(scaleValue(diff, diffScale, byteScale));

                setPixelImageData(visualization, x, y, {r: diffScaled, g: 0, b: 0, a: 0});
            }
        }

        ciede2000average /= totalPixelPairs;
        ciede2000average = scaleValue(ciede2000average, diffScale, diffScale);

        return {
            visualization,
            ciede2000average,
            totalPixelPairs
        };
    })();

    const vertical: ColorSymmetryExtractResult['vertical'] = (() => {
        const totalPixelPairs = halfWidth * height;
        const visualization = new ImageData(halfWidth, height);
        let ciede2000average = 0;

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < halfWidth; x++) {
                const counterX = width - x - 1;

                const colorAtLeftSide = getPixelImageData(imageData, x, y);
                const colorAtRightSide = getPixelImageData(imageData, counterX, y);

                const diff = colorDiff(colorAtLeftSide, colorAtRightSide);

                ciede2000average += diff;

                const diffScaled = Math.floor(scaleValue(diff, diffScale, byteScale));

                setPixelImageData(visualization, x, y, {r: diffScaled, g: 0, b: 0, a: 0});
            }
        }

        ciede2000average /= totalPixelPairs;
        ciede2000average = scaleValue(ciede2000average, diffScale, diffScale);

        return {
            visualization,
            ciede2000average,
            totalPixelPairs
        }
    })();

    return {
        horizontal,
        vertical
    };
}
