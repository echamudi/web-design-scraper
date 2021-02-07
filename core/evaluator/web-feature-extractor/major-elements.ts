import {
  GenericElementsExtractResult, ImageElementsExtractResult, TextElementsExtractResult, GenericElement, VideoElementsExtractResult, AnchorElementsExtractResult,
} from 'Core/types/feature-extractor';

/**
 * Get visible elements of major elements.
 * Currently, major elements are only text, image, and video elements.
 * @param textElements
 * @param imageElements
 */
export function majorElementsExtract(
  textElements: TextElementsExtractResult,
  imageElements: ImageElementsExtractResult,
  videoElements: VideoElementsExtractResult,
  anchorElements: AnchorElementsExtractResult,
): GenericElementsExtractResult {
  const majorElementPosition: GenericElement[] = [];

  imageElements.elements.forEach((el) => {
    if (el.visible) {
      majorElementPosition.push({
        position: el.position,
        area: el.area,
        visible: true,
        aspectRatio: el.aspectRatio,
      });
    }
  });

  textElements.elements.forEach((el) => {
    if (el.visible) {
      majorElementPosition.push({
        position: el.position,
        area: el.area,
        visible: true,
        aspectRatio: el.aspectRatio,
      });
    }
  });

  videoElements.elements.forEach((el) => {
    if (el.visible) {
      majorElementPosition.push({
        position: el.position,
        area: el.area,
        visible: true,
        aspectRatio: el.aspectRatio,
      });
    }
  });

  anchorElements.elements.forEach((el) => {
    if (el.visible) {
      majorElementPosition.push({
        position: el.position,
        area: el.area,
        visible: true,
        aspectRatio: el.aspectRatio,
      });
    }
  });

  return {
    elements: majorElementPosition,
    elementCount: majorElementPosition.length,
    visibleElementCount: majorElementPosition.length,
    pageWidth: textElements.pageWidth,
    pageHeight: textElements.pageHeight,
  };
}
