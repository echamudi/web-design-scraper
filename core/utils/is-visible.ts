/**
 * Source: https://stackoverflow.com/questions/49751396/determine-if-element-is-behind-another
 * @author Niklas E. (https://stackoverflow.com/users/1027902/niklas-e)
 *
 * Modified by
 * @author Ezzat Chamudi (https://github.com/echamudi)
 */

/** */
export function isVisible(element: HTMLElement | SVGSVGElement): boolean {
  if (!isVisibleByStyles(element)) return false;
  // if (isBehindOtherElement(element)) return false;

  const bound = element.getBoundingClientRect();
  if (bound.width === 0 && bound.height === 0) return false;

  return true;
}

export function isVisibleByStyles(element: HTMLElement | SVGSVGElement): boolean {
  const styles = window.getComputedStyle(element);
  return styles.visibility !== 'hidden' && styles.display !== 'none' && styles.opacity !== '0';
}

export function isBehindOtherElement(element: HTMLElement | SVGSVGElement): boolean {
  const boundingRect = element.getBoundingClientRect();

  // adjust coordinates to get more accurate results
  const left = boundingRect.left + 1;
  const right = boundingRect.right - 1;
  const top = boundingRect.top + 1;
  const bottom = boundingRect.bottom - 1;

  // Check if the center of element is covered by something
  if (document.elementFromPoint((right + left) / 2, (top + bottom) / 2) !== element) return true;

  return false;
}
