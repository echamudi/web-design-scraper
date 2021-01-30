import { hexToRgb, rgbToHex } from 'Core/utils/color';
import { ColorCountExtractResult } from 'Core/types/factors';
import { imageToCanvas } from 'Core/utils/image-canvas';

/**
 *
 * @param image base64 image uri
 */
export function colorCountExtract(imageData: ImageData): ColorCountExtractResult {
    const imagePixels = imageData.data;

    const map: {[x: string]: number} = {};

    for (let i = 0; i < imagePixels.length; i += 4) {
        const hex = rgbToHex({ r: imagePixels[i], g: imagePixels[i + 1], b: imagePixels[i + 2] });

        if (map[hex] === undefined) {
            map[hex] = 1;
        } else {
            map[hex] += 1;
        }
    }

    const rank: ColorCountExtractResult['rank'] = [];

    Object.keys(map).forEach((key) => {
        rank.push({
            color: hexToRgb(key),
            pixelCount: map[key],
        });
    });

    rank.sort((a, b) => (a.pixelCount > b.pixelCount ? -1 : 1));

    // Get 20 most used colors
    rank.splice(20, Infinity);

    return { rank };
}
