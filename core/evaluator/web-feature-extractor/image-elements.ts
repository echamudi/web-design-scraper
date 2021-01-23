import { BrowserInfoExtractResult, ImageElement, ImageElementsExtractResult } from 'Core/types/feature-extractor';
import { isVisible } from 'Core/utils/is-visible';
import { getPositionInPage } from 'Core/utils/get-element-position';

function posUtil(el: HTMLElement | SVGSVGElement, win: Window) {
    const bound = el.getBoundingClientRect();
    const position = getPositionInPage(win, bound);
    let aspectRatio: number | undefined = position.w / position.h;
    if (Object.is(aspectRatio, NaN)) aspectRatio = undefined;

    return {
        tagName: el.tagName,
        position,
        area: position.w * position.h,
        aspectRatio,
        visible: isVisible(el),
    };
}

export function imageElementsExtract(win: Window, browserInfoResult: BrowserInfoExtractResult): ImageElementsExtractResult {
    const doc = win.document;

    const { pageWidth, pageHeight } = browserInfoResult;

    const imageElements: ImageElement[] = [];

    // get imgs
    const imgs: HTMLImageElement[] = Array.from(doc.images);
    imgs.forEach((el) => {
        imageElements.push({
            url: el.src,
            ...posUtil(el, win),
        });
    });

    // get svgs
    const svgs: SVGSVGElement[] = Array.from(doc.getElementsByTagName('svg'));
    svgs.forEach((el) => {
        imageElements.push({
            url: '',
            ...posUtil(el, win),
        });
    });

    // get all elements with image backgrounds
    const htmlElements = doc.body.getElementsByTagName('*');

    Array.prototype.forEach.call(htmlElements, (el: HTMLElement) => {
        const style = window.getComputedStyle(el);
        if (style.backgroundImage != 'none') {
            imageElements.push({
                url: style.backgroundImage.slice(4, -1).replace(/['"]/g, ''),
                ...posUtil(el, win),
            });
        }
    });

    return {
        elements: imageElements,
        elementCount: imageElements.length,
        visibleElementCount: imageElements.reduce<number>((prev, curr) => {
            if (curr.visible) {
                return prev + 1;
            }
            return prev;
        }, 0),
        pageWidth,
        pageHeight,
    };
}
