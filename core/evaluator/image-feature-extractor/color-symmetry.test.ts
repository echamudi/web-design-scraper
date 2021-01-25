import imageToBase64 from 'image-to-base64';
import path from 'path';
import { imageToImageData } from 'Core/utils/image-canvas';
import { colorSymmetryExtract } from './color-symmetry';

test('colorSymmetry', async () => {
    const imgUV = await imageToBase64(path.join(__dirname, '../../../test/fixtures/small-imgs/unsymmetrical-vertical.png'));
    const imgUH = await imageToBase64(path.join(__dirname, '../../../test/fixtures/small-imgs/unsymmetrical-horizontal.png'));
    const imageDataUV = await imageToImageData(`data:image/png;base64,${imgUV}`);
    const imageDataUH = await imageToImageData(`data:image/png;base64,${imgUH}`);

    const uvSymmetryCheckResult = colorSymmetryExtract(imageDataUV);
    expect(uvSymmetryCheckResult.horizontal.ciede2000average).toStrictEqual(0);
    const uvSymmetryCheckResultHorVis = await imageToImageData(uvSymmetryCheckResult.horizontal.visualization);
    expect(uvSymmetryCheckResultHorVis.height).toEqual(2);
    expect(uvSymmetryCheckResultHorVis.width).toEqual(8);
    expect([...uvSymmetryCheckResultHorVis.data])
        .toEqual([
            255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255,
            255
        ]);

    expect(uvSymmetryCheckResult.vertical.ciede2000average).toStrictEqual(100);
    const uvSymmetryCheckResultVerVis = await imageToImageData(uvSymmetryCheckResult.vertical.visualization);
    expect(uvSymmetryCheckResultVerVis.height).toEqual(4);
    expect(uvSymmetryCheckResultVerVis.width).toEqual(4);
    expect([...uvSymmetryCheckResultVerVis.data])
        .toEqual([
            255, 1, 1, 255, 255, 1, 1, 255, 255, 1, 1, 255,
            255, 1, 1, 255, 255, 1, 1, 255, 255, 1, 1, 255,
            255, 1, 1, 255, 255, 1, 1, 255, 255, 1, 1, 255,
            255, 1, 1, 255, 255, 1, 1, 255, 255, 1, 1, 255,
            255, 1, 1, 255, 255, 1, 1, 255, 255, 1, 1, 255,
            255, 1, 1, 255
        ]);

    const uhSymmetryCheckResult = colorSymmetryExtract(imageDataUH);
    expect(uhSymmetryCheckResult.horizontal.ciede2000average).toStrictEqual(100);
    const uhSymmetryCheckResultHorVis = await imageToImageData(uhSymmetryCheckResult.horizontal.visualization);
    expect(uhSymmetryCheckResultHorVis.height).toEqual(2);
    expect(uhSymmetryCheckResultHorVis.width).toEqual(8);
    expect([...uhSymmetryCheckResultHorVis.data])
        .toEqual([
            255, 1, 1, 255, 255, 1, 1, 255, 255, 1, 1, 255,
            255, 1, 1, 255, 255, 1, 1, 255, 255, 1, 1, 255,
            255, 1, 1, 255, 255, 1, 1, 255, 255, 1, 1, 255,
            255, 1, 1, 255, 255, 1, 1, 255, 255, 1, 1, 255,
            255, 1, 1, 255, 255, 1, 1, 255, 255, 1, 1, 255,
            255, 1, 1, 255
        ]);

    expect(uhSymmetryCheckResult.vertical.ciede2000average).toStrictEqual(0);
    const uhSymmetryCheckResultVerVis = await imageToImageData(uhSymmetryCheckResult.vertical.visualization);
    expect(uhSymmetryCheckResultVerVis.height).toEqual(4);
    expect(uhSymmetryCheckResultVerVis.width).toEqual(4);
    expect([...uhSymmetryCheckResultVerVis.data])
        .toEqual([
            255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255,
            255, 255, 255, 255, 255, 255, 255, 255, 255,
            255
        ]);
});
