// import { PicturesExtractResult, PictureData, ImageDetectionExtractResult } from 'Core/types/factors';

// export function pictures(doc: Document, imageDetectionExtractResult: ImageDetectionExtractResult): PicturesExtractResult {
//     const picturesResult: PicturesExtractResult = {
//         allCount: imageDetectionExtractResult.componentCount,
//         visibleCount: imageDetectionExtractResult.visibleComponentCount,
//         data: imageDetectionExtractResult.components.map((el) => {
//             const pictureData: PictureData = {
//                 url: el.url,
//                 tagName: el.tagName,
//                 width: el.position.w,
//                 height: el.position.h,
//                 area: el.area,
//                 x: el.position.x,
//                 y: el.position.y,
//                 visible: el.visible,
//             }

//             return pictureData;
//         })
//     }

//     return picturesResult;
// }
