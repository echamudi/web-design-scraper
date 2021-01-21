import { ColorCountExtractResult } from "Core/types/factors";
import { ColorDistributionExtractResult } from "Core/types/feature-extractor";
import { Color } from "Core/types/types";
import { colorEquality } from "Core/utils/color";

/**
 * Ciede equality tolerance to consider different colors as the same
 */
const equalityTolerance = 2;

export function colorDistributionExtract(
    imageData: ImageData,
    colorCountExtractResult: ColorCountExtractResult
): ColorDistributionExtractResult {
    const { rank } = colorCountExtractResult;
    const totalPixels = imageData.width * imageData.height;
    const { data } = imageData;

    let pixelCountOfTheTop1 = 0;
    let pixelCountOfTheTop5 = 0;
    let pixelCountOfTheTop10 = 0;

    for (let i = 0; i < totalPixels; i++) {
        const colorFromData: Color = {
            r: data[(i * 4) + 0],
            g: data[(i * 4) + 1],
            b: data[(i * 4) + 2]
        }

        if (rank[0] && colorEquality(rank[0].color, colorFromData, equalityTolerance)) {
            pixelCountOfTheTop1 += 1;
            pixelCountOfTheTop5 += 1;
            pixelCountOfTheTop10 += 1;
        }

        for (let x = 1; x < 5; x++) {
            if (rank[x] && colorEquality(rank[x].color, colorFromData, equalityTolerance)) {
                pixelCountOfTheTop5 += 1;
                pixelCountOfTheTop10 += 1;
            }
        }

        for (let x = 5; x < 10; x++) {
            if (rank[x] && colorEquality(rank[x].color, colorFromData, equalityTolerance)) {
                pixelCountOfTheTop10 += 1;
            }
        }
    }

    return {
        mostUsedColor: rank[0]?.color,
        totalPixels,
        colorPercentageOfTheTop1: pixelCountOfTheTop1 / totalPixels,
        colorPercentageOfTheTop5: pixelCountOfTheTop5 / totalPixels,
        colorPercentageOfTheTop10: pixelCountOfTheTop10 / totalPixels
    }
}
