import { colorCountExtract } from './color-count';
import imageToBase64 from 'image-to-base64';
import path from 'path';

test('colorCountExtract', async () => {
    const img = await imageToBase64(path.join(__dirname, '../../../test/fixtures/small-imgs/four-colors.png'));
    const colorCountExtractResult = await colorCountExtract('data:image/png;base64,' + img);
    expect(colorCountExtractResult.rank).toStrictEqual([
        { color: { r: 0, g: 255, b: 0 }, pixelCount: 42 },
        { color: { r: 0, g: 0, b: 255 }, pixelCount: 24 },
        { color: { r: 255, g: 255, b: 0 }, pixelCount: 18 },
        { color: { r: 255, g: 0, b: 0 }, pixelCount: 16 }
    ]);
});
