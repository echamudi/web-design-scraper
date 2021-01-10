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
        img.src = imageURI;
    });
};
