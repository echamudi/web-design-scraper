import rgba from 'color-rgba';

/**
 * Get the background color of xy coordinate in a website
 */
export function getBackgroundColor(win: Window, x: number, y: number): string | undefined {
  const doc = win.document;

  const pointElements = doc.elementsFromPoint(x, y);
  let finalPointBgColor = '#FFFFFF';

  // If the item is out of viewport, make it undefined
  if (pointElements.length === 0) return undefined;

  // Loop through element stack
  for (let i = 0; i < pointElements.length; i++) {
    const el = pointElements[i];
    const bgColor = win.getComputedStyle(el).backgroundColor;
    const parsedColor = rgba(bgColor);

    if (parsedColor === undefined) {
      continue;
    } else if (parsedColor[3] !== 0) {
      finalPointBgColor = bgColor;
      break;
    }
  }

  return finalPointBgColor;
}
