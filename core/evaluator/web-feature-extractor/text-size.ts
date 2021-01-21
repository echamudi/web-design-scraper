//TODO: Review this file to follow the standard in other files

import { TextSizeExtractResult } from 'Core/types/factors';
import { TextElementsExtractResult } from 'Core/types/feature-extractor';

export function textSizeExtract(textElementExtractResult: TextElementsExtractResult): TextSizeExtractResult {
    const textSizeMap: Record<string, number> = {};
    let totalCharacters: number = 0;

    textElementExtractResult.elements.forEach((textElement) => {
        const fontSize = parseInt(textElement.fontSize);
        const chars = textElement.totalCharacters;

        if (textSizeMap[fontSize] === undefined) {
            textSizeMap[fontSize] = chars;
        } else {
            textSizeMap[fontSize] += chars;
        }

        totalCharacters += chars;
    });

    return { totalCharacters, textSizeMap };
}

/**
 * @param doc elements to be evaluated, ideally all elements in the page
 */
// export function textSizeExtract(doc: Document): TextSizeExtractResult {
//     const elements: NodeListOf<Element> = doc.querySelectorAll('body *');

//     // let totalElements = 0;
//     // let totalSmallCharacters = 0;
//     let totalCharacters = 0;
//     const all = elements;

//     const textSizeMap: Record<number, number> = {};

//     // Mark letters with too small letters
//     for (let i = 0, max = all.length; i < max; i += 1) {
//         const currentEl = all[i] as HTMLElement;
//         // currentEl.removeAttribute('data-swds-textSize');

//         let text = '';
//         currentEl.childNodes.forEach((cn) => {
//             if (cn.nodeType === Node.TEXT_NODE) text += cn.textContent ?? '';
//         })
//         text = text.trim();

//         // console.log(text);
//         // console.log(getComputedStyle(currentEl).fontSize);

//         totalCharacters += [...text].length;

//         const bound = currentEl.getBoundingClientRect();
//         const invisible = bound.x === 0 && bound.y === 0 && bound.width === 0 && bound.height === 0;

//         if (text !== '' && !invisible) {
//             const fontSize = parseInt(getComputedStyle(currentEl).fontSize, 10);

//             if (textSizeMap[fontSize] === undefined) {
//                 textSizeMap[fontSize] = [...text].length;
//             } else {
//                 textSizeMap[fontSize] += [...text].length;
//             }


//             // currentEl.setAttribute('data-swds-textSize', '1');
//             // totalElements += 1;
//             // totalSmallCharacters += [...text].length;
//         }
//     }

//     // const score = Math.floor((1 - (totalSmallCharacters / totalCharacters)) * 100);

//     return { totalCharacters, textSizeMap };
// }
