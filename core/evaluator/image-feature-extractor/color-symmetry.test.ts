import { colorSymmetryExtract } from './color-symmetry';
import imageToBase64 from 'image-to-base64';
import path from 'path';
import { imageToImageData } from 'Core/utils/image-canvas';

test('colorSymmetry', async () => {
    const imgUV = await imageToBase64(path.join(__dirname, '../../../test/fixtures/small-imgs/unsymmetrical-vertical.png'));
    const imgUH = await imageToBase64(path.join(__dirname, '../../../test/fixtures/small-imgs/unsymmetrical-horizontal.png'));
    const imageDataUV = await imageToImageData('data:image/png;base64,' + imgUV);
    const imageDataUH = await imageToImageData('data:image/png;base64,' + imgUH);

    const uvSymmetryCheckResult = colorSymmetryExtract(imageDataUV);
    expect(uvSymmetryCheckResult.horizontal.ciede2000average).toStrictEqual(0);
    expect(uvSymmetryCheckResult.horizontal.visualization.height).toEqual(2);
    expect(uvSymmetryCheckResult.horizontal.visualization.width).toEqual(8);
    expect([...uvSymmetryCheckResult.horizontal.visualization.data])
        .toEqual([
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0
        ]);

    expect(uvSymmetryCheckResult.vertical.ciede2000average).toStrictEqual(100);
    expect(uvSymmetryCheckResult.vertical.visualization.height).toEqual(4);
    expect(uvSymmetryCheckResult.vertical.visualization.width).toEqual(4);
    expect([...uvSymmetryCheckResult.vertical.visualization.data])
        .toEqual([
            254, 0, 0, 0, 254, 0, 0, 0, 254, 0, 0, 0,
            254, 0, 0, 0, 254, 0, 0, 0, 254, 0, 0, 0,
            254, 0, 0, 0, 254, 0, 0, 0, 254, 0, 0, 0,
            254, 0, 0, 0, 254, 0, 0, 0, 254, 0, 0, 0,
            254, 0, 0, 0, 254, 0, 0, 0, 254, 0, 0, 0,
            254, 0, 0, 0
        ]);

    const uhSymmetryCheckResult = colorSymmetryExtract(imageDataUH);
    expect(uhSymmetryCheckResult.horizontal.ciede2000average).toStrictEqual(100);
    expect(uhSymmetryCheckResult.horizontal.visualization.height).toEqual(2);
    expect(uhSymmetryCheckResult.horizontal.visualization.width).toEqual(8);
    expect([...uhSymmetryCheckResult.horizontal.visualization.data])
        .toEqual([
            254, 0, 0, 0, 254, 0, 0, 0, 254, 0, 0, 0,
            254, 0, 0, 0, 254, 0, 0, 0, 254, 0, 0, 0,
            254, 0, 0, 0, 254, 0, 0, 0, 254, 0, 0, 0,
            254, 0, 0, 0, 254, 0, 0, 0, 254, 0, 0, 0,
            254, 0, 0, 0, 254, 0, 0, 0, 254, 0, 0, 0,
            254, 0, 0, 0
        ]);

    expect(uhSymmetryCheckResult.vertical.ciede2000average).toStrictEqual(0);
    expect(uhSymmetryCheckResult.vertical.visualization.height).toEqual(4);
    expect(uhSymmetryCheckResult.vertical.visualization.width).toEqual(4);
    expect([...uhSymmetryCheckResult.vertical.visualization.data])
        .toEqual([
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
            0, 0, 0, 0
        ]);
});
