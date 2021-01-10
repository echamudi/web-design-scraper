import Vibrant from "node-vibrant";
import { DominantColorsExtractResult, DominantColorsPallete } from 'Core/types/factors';
import { equalWithTolerance } from "Core/utils/equality";

/**
 * 
 * @param image base64 image uri
 */
export async function dominantColorsExtract(imageURI: string): Promise<DominantColorsExtractResult> {
    const palette: DominantColorsPallete = await new Promise<DominantColorsPallete>((resolve, reject) => {
        Vibrant.from(imageURI).getPalette((err, palette) => {
            resolve(palette as DominantColorsPallete)
        });
    });

    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
        canvas.id = "dominantColorsCanvas";
    
        const ctx = canvas.getContext('2d');
    
        if (ctx === null) throw new Error('CTX is null');
    
        const img = new Image;

        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);
            // console.log('w', canvas.width);
            // console.log('h', canvas.height);
            // console.log(canvas);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const imagePixels = imageData.data;

            const area = imageData.width * imageData.height;

            // console.log('area', area);
            // console.log('imageData', imageData);

            // Count Vibrant
            const [vibrantR, vibrantG, vibrantB] = palette.Vibrant?.getRgb() ?? [-1,-1,-1];

            console.log(vibrantR, vibrantG, vibrantB);

            let vibrantPixelCount = 0;

            for (let i = 0; i < imagePixels.length; i += 4) {
                // Check with 20% tolerance
                if (
                    equalWithTolerance(imagePixels[i], vibrantR, 51) &&
                    equalWithTolerance(imagePixels[i + 1], vibrantG, 51) &&
                    equalWithTolerance(imagePixels[i + 2], vibrantB, 51)
                ) {
                    vibrantPixelCount += 1;
                }
            }
            // console.log('vibrantPixelCount', vibrantPixelCount);

            resolve({
                vibrant: palette,
                vibrantPixelCount,
                totalPixels: area
            });
        };
        img.src = imageURI;
    });
}
