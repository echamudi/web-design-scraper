import { Color } from 'Core/types/types';

export async function imageToCanvas(imageURI: string): Promise<HTMLCanvasElement | OffscreenCanvas> {
    return new Promise((resolve, reject) => {
        let canvas: HTMLCanvasElement | OffscreenCanvas;
        if (self.document) {
            canvas = document.createElement('canvas');
        } else {
            canvas = new OffscreenCanvas(0, 0);
        }

        const ctx = canvas.getContext('2d');

        if (ctx === null) throw new Error('CTX is null');

        const img = new Image();

        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            resolve(canvas);
        };
        img.onerror = function () {
            reject(new Error('Error on loading the imageURI'));
        };
        img.src = imageURI;
    });
}

export async function imageToImageData(imageURI: string): Promise<ImageData> {
    const canvas = await imageToCanvas(imageURI);
    const ctx = canvas.getContext('2d');
    if (ctx === null) throw new Error('CTX is null');

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    return imageData;
}

export async function imageDataToImageURI(imageData: ImageData): Promise<string> {
    let canvas: HTMLCanvasElement | OffscreenCanvas;
    if (self.document) {
        canvas = document.createElement('canvas');
    } else {
        canvas = new OffscreenCanvas(0, 0);
    }

    const ctx = canvas.getContext('2d');
    if (ctx === null) return Promise.reject('CTX is null');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    ctx.putImageData(imageData, 0, 0);

    let blob: Blob | null = null;
    if (canvas instanceof HTMLCanvasElement) {
        const canv = canvas;
        await new Promise((res, rej) => {
            canv.toBlob((blobResult) => {
                blob = blobResult;
                res(true);
            })
        });
    } else {
        blob = await canvas.convertToBlob();
    }

    if (blob === null) return Promise.reject('cant get Blob');

    const reader = new FileReader();
    reader.readAsDataURL(blob);

    return new Promise((resolve, reject) => {
        reader.onloadend = function() {
            var base64data = reader.result;

            if (typeof base64data === 'string') {
                resolve(base64data);
            } else {
                reject('base64data is not a string');
            }
        }
    })
}

/**
 * Get a pixel in ImageData data
 * @param x x coordinate, counted from the left
 * @param y y coordinate, counted from the top
 */
export function getPixelImageData(imageData: ImageData, x: number, y: number): Color {
    const { data, width } = imageData;
    const index = y * width + x;
    // if (index > width * height || index < 0)
    //     throw new Error('imageDataAccessor out of bound');
    const bufferIndex = index * 4;

    return {
        r: data[bufferIndex],
        g: data[bufferIndex + 1],
        b: data[bufferIndex + 2],
        a: data[bufferIndex + 3],
    };
}

/**
 * Set a pixel in ImageData data
 * @param x x coordinate, counted from the left
 * @param y y coordinate, counted from the top
 */
export function setPixelImageData(imageData: ImageData, x: number, y: number, color: Color): boolean {
    const { data, width } = imageData;
    const index = y * width + x;
    const bufferIndex = index * 4;

    data[bufferIndex] = color.r;
    data[bufferIndex + 1] = color.g;
    data[bufferIndex + 2] = color.b;
    data[bufferIndex + 3] = color.a ?? 255;

    return true;
}
