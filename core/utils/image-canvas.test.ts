import imageToBase64 from 'image-to-base64';
import path from 'path';
import {
  getPixelImageData, imageDataToImageURI, imageToCanvas, imageToImageData, setPixelImageData,
} from 'Core/utils/image-canvas';

test('imageToCanvas', async () => {
  try {
    await imageToCanvas('not an imageURI');
  } catch (e) {
    expect(e).toEqual(new Error('Error on loading the imageURI'));
  }
});

test('imageToImageData', async () => {
  const img = await imageToBase64(path.join(__dirname, '../../test/fixtures/small-imgs/rgba.png'));
  const bufferResult = (await imageToImageData(`data:image/png;base64,${img}`)).data;
  const bufferSpec: Uint8ClampedArray = new Uint8ClampedArray([
    0, 0, 255, 255, // Blue
    0, 255, 0, 255, // Green
    255, 0, 0, 255, // Red
    255, 255, 255, 255, // White
    0, 0, 0, 255, // Black
    0, 0, 0, 128, // Black (50% opacity)
    0, 0, 0, 0, // (0% opacity)
    0, 0, 255, 255, // Blue
    0, 255, 0, 255, // Green
    255, 0, 0, 255, // Red
    255, 255, 255, 255, // White
    0, 0, 0, 255, // Black
    0, 0, 0, 128, // Black (50% opacity)
    0, 0, 0, 0, // (0% opacity)
  ]);

  expect([...bufferResult]).toEqual([...bufferSpec]);
});

test('getPixelImageData', async () => {
  const img = await imageToBase64(path.join(__dirname, '../../test/fixtures/small-imgs/four-colors.png'));
  const imageData = await imageToImageData(`data:image/png;base64,${img}`);

  expect(getPixelImageData(imageData, 0, 0)).toStrictEqual({
    r: 255, g: 0, b: 0, a: 255,
  });
  expect(getPixelImageData(imageData, 3, 3)).toStrictEqual({
    r: 255, g: 0, b: 0, a: 255,
  });
  expect(getPixelImageData(imageData, 7, 4)).toStrictEqual({
    r: 255, g: 255, b: 0, a: 255,
  });
  expect(getPixelImageData(imageData, 9, 9)).toStrictEqual({
    r: 255, g: 255, b: 0, a: 255,
  });

  const img2 = await imageToBase64(path.join(__dirname, '../../test/fixtures/small-imgs/rgba.png'));
  const imageData2 = await imageToImageData(`data:image/png;base64,${img2}`);

  expect(getPixelImageData(imageData2, 2, 1)).toStrictEqual({
    r: 255, g: 0, b: 0, a: 255,
  });
});

test('setPixelImageData', async () => {
  const imageData = new ImageData(4, 3);

  expect(getPixelImageData(imageData, 2, 1)).toStrictEqual({
    r: 0, g: 0, b: 0, a: 0,
  });
  setPixelImageData(imageData, 2, 1, {
    r: 4, g: 5, b: 6, a: 7,
  });
  expect(getPixelImageData(imageData, 2, 1)).toStrictEqual({
    r: 4, g: 5, b: 6, a: 7,
  });
  setPixelImageData(imageData, 2, 1, { r: 11, g: 12, b: 13 });
  expect(getPixelImageData(imageData, 2, 1)).toStrictEqual({
    r: 11, g: 12, b: 13, a: 255,
  });
});

test('imageDataToImageURI', async () => {
  const imgData = await new ImageData(new Uint8ClampedArray([
    0, 0, 255, 255, // Blue
    0, 255, 0, 255, // Green
    255, 0, 0, 255, // Red
    0, 0, 255, 255, // Blue
    0, 255, 0, 255, // Green
    255, 0, 0, 255, // Red
  ]), 3, 2);

  const string = imageDataToImageURI(imgData);

  expect(string).toEqual('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAYAAACddGYaAAAABmJLR0QA/wD/AP+gvaeTAAAAGUlEQVQImWNgYPj/n+E/w///DAz/mRiQAABxwgX9MQdoPgAAAABJRU5ErkJggg==');
});
