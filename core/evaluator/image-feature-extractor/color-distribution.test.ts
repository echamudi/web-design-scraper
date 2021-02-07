import imageToBase64 from 'image-to-base64';
import path from 'path';
import { imageToImageData } from 'Core/utils/image-canvas';
import { colorDistributionExtract } from './color-distribution';
import { colorCountExtract } from './color-count';

test('colorDistributionExtract', async () => {
  const img = await imageToBase64(path.join(__dirname, '../../../test/fixtures/small-imgs/four-colors.png'));
  const imageData = await imageToImageData(`data:image/png;base64,${img}`);
  const colorCountExtractResult = await colorCountExtract(imageData);

  const colorDistributionExtractResult = await colorDistributionExtract(
    imageData,
    colorCountExtractResult,
  );

  expect(colorDistributionExtractResult).toEqual(
    {
      mostUsedColor: { r: 0, g: 255, b: 0 },
      totalPixels: 100,
      colorPercentageOfTheTop1: 0.42,
      colorPercentageOfTheTop5: 1,
      colorPercentageOfTheTop10: 1,
    },
  );
});
