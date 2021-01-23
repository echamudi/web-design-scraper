import { ColorCountExtractResult, TextSizeExtractResult } from './factors';
import {
    AlignmentPointsExtractResult,
    AnchorElementsExtractResult,
    BrowserInfoExtractResult,
    ColorSymmetryExtractResult,
    ImageElementsExtractResult,
    TextElementsExtractResult,
    VibrantColorsExtractResult,
    VideoElementsExtractResult,
    ViewportScreenshotExtractResult,
} from './feature-extractor';

//
// Phases
//

// Phase 1 happens only in the content-side
export interface Phase1Result {
    browserInfo: BrowserInfoExtractResult,
    textElements: TextElementsExtractResult,
    imageElements: ImageElementsExtractResult,
    videoElements: VideoElementsExtractResult,
    anchorElements: AnchorElementsExtractResult,
    alignmentPoints: AlignmentPointsExtractResult,
    textSize: TextSizeExtractResult
}

// Phase 2 is the "phase 1 result" + "results from the extension side"
export interface Phase2Result extends Phase1Result {
    vibrantColors: VibrantColorsExtractResult,
    colorCount: ColorCountExtractResult,
    colorSymmetry: ColorSymmetryExtractResult,
    viewportScreenshot: ViewportScreenshotExtractResult,
    timestamp: number
}

//
// React
//

export interface AppState {
    analyzingStatus: string,
    result: Phase2Result | null,
}

//
// Others
//

export interface ElementPosition {
    x: number,
    y: number,
    w: number,
    h: number
}

export interface Color {
    /**
     * 0-255
     */
    r: number,

    /**
     * 0-255
     */
    g: number,

    /**
     * 0-255
     */
    b: number,

    /**
     * 0-255
     */
    a?: number
}
