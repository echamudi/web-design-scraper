import { BrowserInfoExtractResult, ImageElement, ImageElementsExtractResult } from 'Core/types/feature-extractor';
import { isVisible } from 'Core/utils/is-visible';
import { getAbsolutePosition } from 'Core/utils/get-absolute-position';

export function imageElementsExtract(win: Window, browserInfoResult: BrowserInfoExtractResult): ImageElementsExtractResult {
    const doc = win.document;

    const { scrollWidth, scrollHeight } = browserInfoResult;

    const imageElements: ImageElement[] = [];

    function posUtil(el: HTMLElement | SVGSVGElement) {
        const bound = el.getBoundingClientRect();
        const position = getAbsolutePosition(win, bound);
        let aspectRatio: number | undefined = position.w / position.h;
        if (Object.is(aspectRatio, NaN)) aspectRatio = undefined;

        return {
            tagName: el.tagName,
            position,
            area: position.w * position.h,
            aspectRatio,
            visible: isVisible(el)
        };
    }

    // get imgs
    const imgs: HTMLImageElement[] = Array.from(doc.images);
    imgs.forEach(el => {
        imageElements.push({
            url: el.src,
            ...posUtil(el)
        })
    });

    // get svgs
    const svgs: SVGSVGElement[] = Array.from(doc.getElementsByTagName('svg'));
    svgs.forEach(el => {
        imageElements.push({
            url: '',
            ...posUtil(el)
        })
    });

    // get all elements with image backgrounds
    const htmlElements = doc.body.getElementsByTagName("*");

    Array.prototype.forEach.call(htmlElements, function (el: HTMLElement ) {
        var style = window.getComputedStyle( el );
        if ( style.backgroundImage != "none" ) {
            imageElements.push({
                url: style.backgroundImage.slice( 4, -1 ).replace(/['"]/g, ""),
                ...posUtil(el)
            })
        }
    })

    return {
        elements: imageElements,
        elementCount: imageElements.length,
        visibleElementCount: imageElements.reduce<number>((prev, curr) => {
            if (curr.visible) {
                return prev + 1;
            } else {
                return prev;
            }
        }, 0),
        scrollWidth,
        scrollHeight
    };
}
