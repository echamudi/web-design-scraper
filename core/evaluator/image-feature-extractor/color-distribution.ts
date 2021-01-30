import { ColorCountExtractResult } from 'Core/types/factors';
import { ColorDistributionExtractResult } from 'Core/types/feature-extractor';
import { Color } from 'Core/types/types';
import { colorEquality } from 'Core/utils/color';
import { imageDataToImageURI } from 'Core/utils/image-canvas';

/**
 * Ciede equality tolerance to consider different colors as the same
 */
const equalityTolerance = 2;

export function colorDistributionExtract(
    imageData: ImageData,
    colorCountExtractResult: ColorCountExtractResult,
): ColorDistributionExtractResult {
    const { rank } = colorCountExtractResult;
    const totalPixels = imageData.width * imageData.height;
    const { data } = imageData;

    let pixelCountOfTheTop1 = 0;
    let pixelCountOfTheTop5 = 0;
    let pixelCountOfTheTop10 = 0;

    const colorTop1Viz = new ImageData(imageData.width, imageData.height);
    // const colorTop5Viz = new ImageData(imageData.width, imageData.height);
    // const colorTop10Viz = new ImageData(imageData.width, imageData.height);

    for (let i = 0; i < totalPixels; i++) {
        const indexR = (i * 4);
        const indexG = indexR + 1;
        const indexB = indexR + 2;
        const indexA = indexR + 3;

        const colorFromData: Color = {
            r: data[indexR],
            g: data[indexG],
            b: data[indexB],
        };

        if (rank[0] && colorEquality(rank[0].color, colorFromData, equalityTolerance)) {
            pixelCountOfTheTop1 += 1;
            pixelCountOfTheTop5 += 1;
            pixelCountOfTheTop10 += 1;

            colorTop1Viz.data[indexB] = 255;
            colorTop1Viz.data[indexA] = 255;
            // colorTop5Viz.data[indexB] = 255;
            // colorTop5Viz.data[indexA] = 255;
            // colorTop10Viz.data[indexB] = 255;
            // colorTop10Viz.data[indexA] = 255;
        }

        // for (let x = 1; x < 5; x++) {
        //     if (rank[x] && colorEquality(rank[x].color, colorFromData, equalityTolerance)) {
        //         pixelCountOfTheTop5 += 1;
        //         pixelCountOfTheTop10 += 1;

        //         colorTop5Viz.data[indexB] = 255;
        //         colorTop5Viz.data[indexA] = 255;
        //         // colorTop10Viz.data[indexB] = 255;
        //         // colorTop10Viz.data[indexA] = 255;
        //     }
        // }

        // for (let x = 5; x < 10; x++) {
        //     if (rank[x] && colorEquality(rank[x].color, colorFromData, equalityTolerance)) {
        //         pixelCountOfTheTop10 += 1;

        //         colorTop10Viz.data[indexB] = 255;
        //         colorTop10Viz.data[indexA] = 255;
        //     }
        // }
    }

    return {
        mostUsedColor: rank[0]?.color,
        totalPixels,
        colorTop1: {
            visualization: imageDataToImageURI(colorTop1Viz),
            percentage: pixelCountOfTheTop1 / totalPixels,
        },
        // colorTop5: {
        //     visualization: imageDataToImageURI(colorTop5Viz),
        //     percentage: pixelCountOfTheTop5 / totalPixels,
        // },
        // colorTop10: {
        //     visualization: imageDataToImageURI(colorTop10Viz),
        //     percentage: pixelCountOfTheTop10 / totalPixels,
        // },
    };
}
