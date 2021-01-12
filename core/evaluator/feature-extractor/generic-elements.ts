import { GenericElementsExtractResult, GenericElement, BrowserInfoExtractResult } from "Core/types/feature-extractor";
import { isVisible } from 'Core/utils/is-visible';
import { getPositionInPage } from "Core/utils/get-element-position";
import { numberOnly } from "Core/utils/number-only";

/**
 * Generic Element Detection
 */
export function genericElementsExtract(win: Window, browserInfoResult: BrowserInfoExtractResult, elementTag: string): GenericElementsExtractResult {
    const doc = win.document;

    const { pageWidth, pageHeight } = browserInfoResult;

    const genericElements: GenericElement[] = [];

    // Get html elements
    const htmlElements: NodeListOf<HTMLElement> = doc.querySelectorAll(`body ${elementTag}`);
    for (let i = 0; i < htmlElements.length; i += 1) {
        const currentEl = htmlElements[i];

        const bound = currentEl.getBoundingClientRect();

        genericElements.push({
            position: getPositionInPage(win, bound),
            area: currentEl.clientWidth * currentEl.clientHeight,
            visible: isVisible(currentEl),
            aspectRatio: numberOnly(currentEl.clientWidth / currentEl.clientHeight)
        });
    }

    return {
        elements: genericElements,
        elementCount: genericElements.length,
        visibleElementCount: genericElements.reduce<number>((prev, curr) => {
            if (curr.visible) {
                return prev + 1;
            } else {
                return prev;
            }
        }, 0),
        pageWidth,
        pageHeight
    };
}
