import imageToBase64 from 'image-to-base64';
import path from 'path';
import { imageToCanvas, imageToBufferArray } from 'Core/utils/image-canvas';

test('imageToCanvas', async () => {
    try {
        await imageToCanvas('not an imageURI');
    } catch (e: any) {
        expect(e).toEqual(new Error('Error on loading the imageURI'));
    }
});

test('imageToBufferArray', async () => {
    const img = await imageToBase64(path.join(__dirname, '../../test/fixtures/small-imgs/rgba.png'));
    const bufferResult = await imageToBufferArray('data:image/png;base64,' + img);
    const bufferSpec: Uint8ClampedArray = new Uint8ClampedArray([
        0,   0, 255, 255,   // Blue
        0, 255,   0, 255,   // Green
      255,   0,   0, 255,   // Red
      255, 255, 255, 255,   // White
        0,   0,   0, 255,   // Black
        0,   0,   0, 128,   // Black (50% opacity)
        0,   0,   0,   0,   // (0% opacity)
        0,   0, 255, 255,   // Blue
        0, 255,   0, 255,   // Green
      255,   0,   0, 255,   // Red
      255, 255, 255, 255,   // White
        0,   0,   0, 255,   // Black
        0,   0,   0, 128,   // Black (50% opacity)
        0,   0,   0,   0,   // (0% opacity)
    ]);

    expect([...bufferResult]).toEqual([...bufferSpec]);
});
