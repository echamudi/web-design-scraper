import imageToBase64 from 'image-to-base64';
import path from 'path';
import { imageToImageData } from 'Core/utils/image-canvas';
import { colorDistributionExtract } from './color-distribution';
import { colorCountExtract } from './color-count';

test('colorDistributionExtract', async () => {
  const img = await imageToBase64(path.join(__dirname, '../../../test/fixtures/small-imgs/four-colors.png'));
  const imageData = await imageToImageData(`data:image/png;base64,${img}`);
  const colorCountExtractResult = colorCountExtract(imageData);

  const colorDistributionExtractResult = colorDistributionExtract(
    imageData,
    colorCountExtractResult,
  );

  expect(colorDistributionExtractResult).toEqual(
    {
      mostUsedColor: { r: 0, g: 255, b: 0 },
      totalPixels: 100,
      colorTop1: {
        percentage: 0.42,
        visualization: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAABmJLR0QA/wD/AP+gvaeTAAAAHElEQVQYlWNgGPyAkYHh/3880owwFhOxJg4FhQDsNQIM6MgcDAAAAABJRU5ErkJggg==",
      },
    },
  );
});
