import { colorCountExtract } from './color-count';
import { colorDistributionExtract } from './color-distribution';
import imageToBase64 from 'image-to-base64';
import path from 'path';
import { imageToImageData } from 'Core/utils/image-canvas';

test('colorDistributionExtract', async () => {
    const img = await imageToBase64(path.join(__dirname, '../../../test/fixtures/small-imgs/four-colors.png'));
    const colorCountExtractResult = await colorCountExtract('data:image/png;base64,' + img);
    const imgData = await imageToImageData('data:image/png;base64,' + img);

    const colorDistributionExtractResult = await colorDistributionExtract(
        imgData,
        colorCountExtractResult
    );

    expect(colorDistributionExtractResult).toEqual(
        {
            mostUsedColor: { r: 0, g: 255, b: 0 },
            totalPixels: 100,
            colorPercentageOfTheTop1: 0.42,
            colorPercentageOfTheTop5: 1,
            colorPercentageOfTheTop10: 1
        }
    );
});
