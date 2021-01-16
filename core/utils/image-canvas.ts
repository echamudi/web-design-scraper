export async function imageToCanvas(imageURI: string): Promise<HTMLCanvasElement> {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas');
    
        const ctx = canvas.getContext('2d');
    
        if (ctx === null) throw new Error('CTX is null');
    
        const img = new Image;

        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            resolve(canvas);
        };
        img.onerror = function() {
            reject(new Error('Error on loading the imageURI'));
        }
        img.src = imageURI;
    });
};

export async function imageToBufferArray(imageURI: string): Promise<Uint8ClampedArray> {
    const canvas = await imageToCanvas(imageURI);
    const ctx = canvas.getContext('2d');
    if (ctx === null) throw new Error('CTX is null');

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const imagePixels = imageData.data;

    return imagePixels;
}
