import { colorSymmetryExtract } from './color-symmetry';
import imageToBase64 from 'image-to-base64';
import path from 'path';
import { imageToImageData } from 'Core/utils/image-canvas';
import { ColorSymmetryExtractResult } from 'Core/types/feature-extractor';

test('colorSymmetry', async () => {
    const imgUV = await imageToBase64(path.join(__dirname, '../../../test/fixtures/small-imgs/unsymmetrical-vertical.png'));
    const imgUH = await imageToBase64(path.join(__dirname, '../../../test/fixtures/small-imgs/unsymmetrical-horizontal.png'));
    const imageDataUV = await imageToImageData('data:image/png;base64,' + imgUV);
    const imageDataUH = await imageToImageData('data:image/png;base64,' + imgUH);

    const uvHorizontalSymmetryCheckResult = colorSymmetryExtract(imageDataUV, 'horizontal');
    expect(uvHorizontalSymmetryCheckResult.ciede2000average).toStrictEqual(0);
    expect(uvHorizontalSymmetryCheckResult.visualization.height).toEqual(2);
    expect(uvHorizontalSymmetryCheckResult.visualization.width).toEqual(8);
    expect([...uvHorizontalSymmetryCheckResult.visualization.data])
        .toEqual([
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0
        ]);

    const uvVerticalSymmetryCheckResult = colorSymmetryExtract(imageDataUV, 'vertical');
    expect(uvVerticalSymmetryCheckResult.ciede2000average).toStrictEqual(100);
    expect(uvVerticalSymmetryCheckResult.visualization.height).toEqual(4);
    expect(uvVerticalSymmetryCheckResult.visualization.width).toEqual(4);
    expect([...uvVerticalSymmetryCheckResult.visualization.data])
        .toEqual([
            254, 0, 0, 0, 254, 0, 0, 0, 254, 0, 0, 0,
            254, 0, 0, 0, 254, 0, 0, 0, 254, 0, 0, 0,
            254, 0, 0, 0, 254, 0, 0, 0, 254, 0, 0, 0,
            254, 0, 0, 0, 254, 0, 0, 0, 254, 0, 0, 0,
            254, 0, 0, 0, 254, 0, 0, 0, 254, 0, 0, 0,
            254, 0, 0, 0
        ]);

    const uhHorizontalSymmetryCheckResult = colorSymmetryExtract(imageDataUH, 'horizontal');
    expect(uhHorizontalSymmetryCheckResult.ciede2000average).toStrictEqual(100);
    expect(uhHorizontalSymmetryCheckResult.visualization.height).toEqual(2);
    expect(uhHorizontalSymmetryCheckResult.visualization.width).toEqual(8);
    expect([...uhHorizontalSymmetryCheckResult.visualization.data])
        .toEqual([
            254, 0, 0, 0, 254, 0, 0, 0, 254, 0, 0, 0,
            254, 0, 0, 0, 254, 0, 0, 0, 254, 0, 0, 0,
            254, 0, 0, 0, 254, 0, 0, 0, 254, 0, 0, 0,
            254, 0, 0, 0, 254, 0, 0, 0, 254, 0, 0, 0,
            254, 0, 0, 0, 254, 0, 0, 0, 254, 0, 0, 0,
            254, 0, 0, 0
        ]);

    const uhVerticalSymmetryCheckResult = colorSymmetryExtract(imageDataUH, 'vertical');
    expect(uhVerticalSymmetryCheckResult.ciede2000average).toStrictEqual(0);
    expect(uhVerticalSymmetryCheckResult.visualization.height).toEqual(4);
    expect(uhVerticalSymmetryCheckResult.visualization.width).toEqual(4);
    expect([...uhVerticalSymmetryCheckResult.visualization.data])
        .toEqual([
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0
        ]);
});
