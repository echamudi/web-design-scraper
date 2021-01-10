import Vibrant from "node-vibrant";
import { VibrantColorsExtractResult, VibrantColorsPallete } from 'Core/types/feature-extractor';
import { equalWithTolerance } from 'Core/utils/equality';

/**
 * Get vibrant color from an image (using node-vibrant library)
 * @param image base64 image uri
 */
export async function vibrantColorsExtract(imageURI: string): Promise<VibrantColorsExtractResult> {
    const palette: VibrantColorsPallete = await new Promise<VibrantColorsPallete>((resolve, reject) => {
        Vibrant.from(imageURI).getPalette((err, palette) => {
            resolve(palette as VibrantColorsPallete)
        });
    });

    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.id = "vibrantColorsExtractCanvas";
    
        const ctx = canvas.getContext('2d');
    
        if (ctx === null) throw new Error('CTX is null');
    
        const img = new Image;

        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const imagePixels = imageData.data;

            const area = imageData.width * imageData.height;

            // console.log('area', area);
            // console.log('imageData', imageData);

            // Count Vibrant
            const rgb = [
                palette.Vibrant?.getRgb() ?? [-1,-1,-1],
                palette.Muted?.getRgb() ?? [-1,-1,-1],
                palette.DarkVibrant?.getRgb() ?? [-1,-1,-1],
                palette.DarkMuted?.getRgb() ?? [-1,-1,-1],
                palette.LightVibrant?.getRgb() ?? [-1,-1,-1],
                palette.LightMuted?.getRgb() ?? [-1,-1,-1],
            ];

            const pixelCount: [number, number, number, number, number, number] = [0,0,0,0,0,0];

            for (let i = 0; i < imagePixels.length; i += 4) {
                for (let v = 0; v < 5; v += 1) {
                    // Check with 20% tollerance
                    if (
                        equalWithTolerance(imagePixels[i], rgb[v][0], 51) &&
                        equalWithTolerance(imagePixels[i + 1], rgb[v][1], 51) &&
                        equalWithTolerance(imagePixels[i + 2], rgb[v][2], 51)
                    ) {
                        pixelCount[v] += 1;
                    };
                }
            }

            resolve({
                vibrantPalette: palette,
                pixelCountVibrant: pixelCount[0],
                pixelCountMuted: pixelCount[1],
                pixelCountDarkVibrant: pixelCount[2],
                pixelCountDarkMuted: pixelCount[3],
                pixelCountLightVibrant: pixelCount[4],
                pixelCountLightMuted: pixelCount[5],
                totalPixels: area
            });
        };
        img.src = imageURI;
    });
}
