import { VideoElementsExtractResult, VideoElement, BrowserInfoExtractResult } from 'Core/types/feature-extractor';
import { isVisible } from 'Core/utils/is-visible';
import { getPositionInPage } from 'Core/utils/get-element-position';
import { numberOnly } from 'Core/utils/number-only';

export function videoElementsExtract(win: Window, browserInfoResult: BrowserInfoExtractResult): VideoElementsExtractResult {
    const doc = win.document;

    const elements: VideoElement[] = [];

    const { pageWidth, pageHeight } = browserInfoResult;

    // get vids
    const videos: HTMLVideoElement[] = Array.from(doc.getElementsByTagName("video"));

    videos.forEach(el => {
        const bound = el.getBoundingClientRect();
        const pos = getPositionInPage(win, bound);

        elements.push({
            position: pos,
            tagName: el.tagName,
            area: el.clientWidth * el.clientHeight,
            visible: isVisible(el),
            url: '', 
            aspectRatio: numberOnly(pos.w / pos.h)
        })
    });

    return {
        elements,
        elementCount: elements.length,
        visibleElementCount: elements.reduce<number>((prev, curr) => {
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
