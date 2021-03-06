import { BrowserInfoExtractResult, AnchorElementsExtractResult, AnchorElement } from 'Core/types/feature-extractor';
import { isVisible } from 'Core/utils/is-visible';
import { getPositionInPage } from 'Core/utils/get-element-position';
import { numberOnly } from 'Core/utils/number-only';

export function anchorElementsExtract(win: Window, browserInfoResult: BrowserInfoExtractResult): AnchorElementsExtractResult {
  const doc = win.document;

  const { pageWidth, pageHeight } = browserInfoResult;

  const anchorElements: AnchorElement[] = [];

  // Get elements
  const htmlAnchorElements: NodeListOf<Element> = doc.querySelectorAll('body a');
  for (let i = 0; i < htmlAnchorElements.length; i += 1) {
    const currentEl = htmlAnchorElements[i] as HTMLElement;

    let text = '';
    currentEl.childNodes.forEach((cn) => {
      if (cn.nodeType === Node.TEXT_NODE) text += cn.textContent ?? '';
    });
    text = text.trim();

    const bound = currentEl.getBoundingClientRect();

    anchorElements.push({
      position: getPositionInPage(win, bound),
      href: currentEl.getAttribute('href'),
      text,
      area: currentEl.clientWidth * currentEl.clientHeight,
      visible: isVisible(currentEl),
      aspectRatio: numberOnly(currentEl.clientWidth / currentEl.clientHeight),
    });
  }

  return {
    elements: anchorElements,
    elementCount: anchorElements.length,
    visibleElementCount: anchorElements.reduce<number>((prev, curr) => {
      if (curr.visible) {
        return prev + 1;
      }
      return prev;
    }, 0),
    pageWidth,
    pageHeight,
  };
}
