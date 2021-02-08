import { GenericElement } from 'Core/types/feature-extractor';
import { ElementPosition } from 'Core/types/types';

export function filterVisibleElements<T extends GenericElement>(elements: T[]): T[] {
  const ret: T[] = [];
  elements.forEach((el) => {
    if (el.visible) {
      ret.push(el);
    }
  });

  return ret;
}

export function getElementPositions(elements: GenericElement[]): ElementPosition[] {
  const ret: ElementPosition[] = [];
  elements.forEach((el) => {
    ret.push(el.position);
  });

  return ret;
}
