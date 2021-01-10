// import { VideosExtractResult, VideoData } from 'Core/types/factors';

// export function videos(doc: Document): VideosExtractResult {
//     let videosResult: VideosExtractResult = {
//         allCount: -1, // All images
//         visibleCount: -1, // All visible image in the page
//         data: [],
//     };

//     const videosData: VideoData[] = [];

//     // get vids
//     const videos: HTMLVideoElement[] = Array.from(doc.getElementsByTagName("video"));

//     videos.forEach(el => {
//         const bound = el.getBoundingClientRect();

//         videosData.push({
//             tagName: el.tagName,
//             width: el.clientWidth,
//             height: el.clientHeight,
//             area: el.clientWidth * el.clientHeight,
//             x: bound.left,
//             y: bound.top,
//             visible: el.offsetParent !== null
//         })
//     });

//     videosResult = {
//         allCount: videosData.length,
//         visibleCount: videosData.reduce<number>((prev, curr) => {
//             if (curr.visible) {
//                 return prev + 1;
//             } else {
//                 return prev;
//             }
//         }, 0),
//         data: videosData
//     }

//     return videosResult;
// }