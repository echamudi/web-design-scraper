import { colorCountExtract } from './color-count';
import imageToBase64 from 'image-to-base64';
import path from 'path';

test('colorCountExtract', async () => {
    const img = await imageToBase64(path.join(__dirname, '../../../test/fixtures/small-imgs/four-colors.png'));
    const colorCountExtractResult = await colorCountExtract('data:image/png;base64,' + img);
    expect(colorCountExtractResult.rank).toStrictEqual([
        { color: '00ff00', pixelCount: 42 },
        { color: '0000ff', pixelCount: 24 },
        { color: 'ffff00', pixelCount: 18 },
        { color: 'ff0000', pixelCount: 16 }
    ]);
});
