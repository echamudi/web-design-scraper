import { alignmentPointsExtract } from 'Core/evaluator/web-feature-extractor/alignment-points';
import { anchorElementsExtract } from 'Core/evaluator/web-feature-extractor/anchor-elements';
import { browserInfoExtract } from 'Core/evaluator/web-feature-extractor/browser-info';
import { imageElementsExtract } from 'Core/evaluator/web-feature-extractor/image-elements';
import { majorElementsExtract } from 'Core/evaluator/web-feature-extractor/major-elements';
import { textElementsExtract } from 'Core/evaluator/web-feature-extractor/text-elements';
import { textSizeExtract } from 'Core/evaluator/web-feature-extractor/text-size';
import { videoElementsExtract } from 'Core/evaluator/web-feature-extractor/video-elements';
import { Phase1Result } from 'Core/types/types';

export function executePhase1(win: Window): Phase1Result {
  const browserInfo = browserInfoExtract(win);
  const textElements = textElementsExtract(win, browserInfo);
  const imageElements = imageElementsExtract(win, browserInfo);
  const videoElements = videoElementsExtract(win, browserInfo);
  const anchorElements = anchorElementsExtract(win, browserInfo);
  const majorElements = majorElementsExtract(
    textElements,
    imageElements,
    videoElements,
    anchorElements,
  );
  const alignmentPoints = alignmentPointsExtract(
    majorElements.elements.map((el) => el.position),
    browserInfo,
  );
  const textSize = textSizeExtract(textElements);

  const phase1Result: Phase1Result = {
    browserInfo,
    textElements,
    imageElements,
    videoElements,
    anchorElements,
    majorElements,
    alignmentPoints,
    textSize,
  };

  return phase1Result;
}
