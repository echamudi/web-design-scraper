import Vibrant from 'node-vibrant';
import { VibrantColorsExtractResult, VibrantColorsPallete } from 'Core/types/feature-extractor';
import { equalWithTolerance } from 'Core/utils/equality';
import { colorEquality } from 'Core/utils/color';
import { Color } from 'Core/types/types';

/**
 * Get vibrant color from an image (using node-vibrant library)
 * @param image base64 image uri
 */
export async function vibrantColorsExtract(imageURI: string): Promise<VibrantColorsExtractResult> {
  const palette: VibrantColorsPallete = await Vibrant.from(imageURI).getPalette();

  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    canvas.id = 'vibrantColorsExtractCanvas';

    const ctx = canvas.getContext('2d');

    if (ctx === null) throw new Error('CTX is null');

    const img = new Image();

    img.onload = function () {
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
        palette.Vibrant?.getRgb() ?? [-1, -1, -1],
        palette.Muted?.getRgb() ?? [-1, -1, -1],
        palette.DarkVibrant?.getRgb() ?? [-1, -1, -1],
        palette.DarkMuted?.getRgb() ?? [-1, -1, -1],
        palette.LightVibrant?.getRgb() ?? [-1, -1, -1],
        palette.LightMuted?.getRgb() ?? [-1, -1, -1],
      ];

      const pixelCount: [number, number, number, number, number, number] = [0, 0, 0, 0, 0, 0];

      for (let i = 0; i < imagePixels.length; i += 4) {
        const currentImagePixel: Color = { r: imagePixels[i], g: imagePixels[i + 1], b: imagePixels[i + 2] };
        for (let v = 0; v < 6; v += 1) {
          // Check with 20% tollerance
          if (
          // colorEquality(
          //     currentImagePixel,
          //     {r: rgb[v][0], g: rgb[v][1], b: rgb[v][2]},
          //     3
          // )
            equalWithTolerance(currentImagePixel.r, rgb[v][0], 51)
                        && equalWithTolerance(currentImagePixel.g, rgb[v][1], 51)
                        && equalWithTolerance(currentImagePixel.b, rgb[v][2], 51)
          ) {
            pixelCount[v] += 1;
          }
        }
      }

      resolve({
        vibrantHex: palette.Vibrant?.getHex() ?? '',
        vibrantPixelCount: pixelCount[0],
        vibrantPixelPercentage: pixelCount[0] / area,
        mutedHex: palette.Muted?.getHex() ?? '',
        mutedPixelCount: pixelCount[1],
        mutedPixelPercentage: pixelCount[1] / area,
        darkVibrantHex: palette.DarkVibrant?.getHex() ?? '',
        darkVibrantPixelCount: pixelCount[2],
        darkVibrantPixelPercentage: pixelCount[2] / area,
        darkMutedHex: palette.DarkMuted?.getHex() ?? '',
        darkMutedPixelCount: pixelCount[3],
        darkMutedPixelPercentage: pixelCount[3] / area,
        lightVibrantHex: palette.LightVibrant?.getHex() ?? '',
        lightVibrantPixelCount: pixelCount[4],
        lightVibrantPixelPercentage: pixelCount[4] / area,
        lightMutedHex: palette.LightMuted?.getHex() ?? '',
        lightMutedPixelCount: pixelCount[5],
        lightMutedPixelPercentage: pixelCount[5] / area,
        totalPixels: area,
      });
    };
    img.src = imageURI;
  });
}
