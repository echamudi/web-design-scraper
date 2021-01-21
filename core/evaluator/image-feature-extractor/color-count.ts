import { rgbToHex } from 'Core/utils/color';
import { ColorCountExtractResult } from 'Core/types/factors';
import { imageToCanvas } from 'Core/utils/image-canvas';

/**
 * 
 * @param image base64 image uri
 */
export async function colorCountExtract(imageURI: string): Promise<ColorCountExtractResult> {
    const canvas: HTMLCanvasElement = await imageToCanvas(imageURI);
    const ctx = canvas.getContext('2d');
    if (ctx === null) throw new Error('CTX is null');

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const imagePixels = imageData.data;

    const map: {[x: string]: number} = {};

    for (let i = 0; i < imagePixels.length; i += 4) {
        const hex = rgbToHex(imagePixels[i], imagePixels[i + 1], imagePixels[i + 2]);

        if (map[hex] === undefined) {
            map[hex] = 1;
        } else {
            map[hex] += 1;
        }
    }

    const rank: ColorCountExtractResult['rank'] = [];

    Object.keys(map).forEach((key) => {
        rank.push({
            color: key,
            pixelCount: map[key]
        });
    });

    rank.sort((a, b) => a.pixelCount > b.pixelCount ? -1 : 1);

    // Get 20 most used colors
    rank.splice(20, Infinity);

    return { rank };
}
