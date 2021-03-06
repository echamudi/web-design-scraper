import { BrowserInfoExtractResult } from 'Core/types/feature-extractor';

export function browserInfoExtract(win: Window): BrowserInfoExtractResult {
  const { userAgent } = win.navigator;
  const { body } = win.document;
  const html = win.document.documentElement;

  const url = win.location.href;
  const vw = Math.max(win.document.documentElement.clientWidth || 0, win.innerWidth || 0);
  const vh = Math.max(win.document.documentElement.clientHeight || 0, win.innerHeight || 0);
  const pageHeight = Math.max(body.scrollHeight, body.offsetHeight,
    html.clientHeight, html.scrollHeight, html.offsetHeight);
  const pageWidth = Math.max(body.scrollWidth, body.offsetWidth,
    html.clientWidth, html.scrollWidth, html.offsetWidth);
  const { pageYOffset } = win;
  const { pageXOffset } = win;

  const { devicePixelRatio } = win;

  return {
    url,
    userAgent,
    viewportWidth: vw,
    viewportHeight: vh,
    pageHeight,
    pageWidth,
    pageYOffset,
    pageXOffset,
    devicePixelRatio,
  };
}
