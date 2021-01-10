// TEMP

// import { styleElementFactory, getStyleElement } from "Core/utils/style-tools";
import { TextSizeConfig, TextSizeExtractResult } from 'Core/types/factors';

/**
 * @param doc elements to be evaluated, ideally all elements in the page
 */
export function textSize(doc: Document): TextSizeExtractResult {
    const elements: NodeListOf<Element> = doc.querySelectorAll('body *');

    const all = elements;

    const textSizeMap: Record<number, number> = {};

    // Mark letters with too small letters
    for (let i = 0, max = all.length; i < max; i += 1) {
        const currentEl = all[i] as HTMLElement;

        let text = '';
        currentEl.childNodes.forEach((cn) => {
            if (cn.nodeType === Node.TEXT_NODE) text += cn.textContent ?? '';
        })
        text = text.trim();

        const bound = currentEl.getBoundingClientRect();
        const invisible = bound.width === 0 && bound.height === 0;

        if (text !== '' && !invisible) {
            const fontSize = parseInt(getComputedStyle(currentEl).fontSize, 10);

            if (textSizeMap[fontSize] === undefined) {
                textSizeMap[fontSize] = [...text].length;
            } else {
                textSizeMap[fontSize] += [...text].length;
            }
        }
    }

    let totalCharacters = 0;
    Object.keys(textSizeMap).forEach((key) => {
        totalCharacters += textSizeMap[key as unknown as number];
    })

    return { totalCharacters, textSizeMap };
}

// export function textSizeStyler(config: TextSizeConfig) {
//     styleElementFactory('textSize');

//     const styleElement = getStyleElement('textSize') as HTMLElement;

//     if (styleElement === null) {
//         throw new Error()
//     };

//     if (config.marking === true) {
//         styleElement.innerHTML = `
//             [data-swds-textSize='1'] {
//                 box-shadow: inset 1px 1px 0 0 red, inset -1px -1px 0 0 red !important;
//             }
//         `;
//     }

//     if (config.marking === false) {
//         styleElement.innerHTML = ``;
//     }
// }
