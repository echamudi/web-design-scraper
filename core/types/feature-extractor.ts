import { ElementPosition } from "./types";
import { Palette } from "node-vibrant/lib/color";
import { TextSizeExtractResult, DominantColorsExtractResult, ColorCountExtractResult } from "./factors";

//
// All Results
//

// Phase 1 happens only in the content-side
export interface FeatureExtractorResultPhase1 {
    browserInfo: BrowserInfoExtractResult,
    textElements: TextElementsExtractResult,
    imageElements: ImageElementsExtractResult,
    videoElements: VideoElementsExtractResult,
    anchorElements: AnchorElementsExtractResult,
    alignmentPoints: AlignmentPointsExtractResult,
    textSize: TextSizeExtractResult
}

// Phase 2 is the "phase 1 result" + "results from the extension side"
export interface FeatureExtractorResultPhase2 extends FeatureExtractorResultPhase1 {
    vibrantColors: VibrantColorsExtractResult,
    colorCount: ColorCountExtractResult
}

//
// Web page features
//

// browser-info

export interface BrowserInfoExtractResult {
    url: string,
    userAgent: string,
    viewportWidth: number,
    viewportHeight: number,
    /**
     * The height of the entire page
     */
    pageHeight: number,
    /**
     * The width of the entire page
     */
    pageWidth: number,
    /**
     * How much is the page scrolled from the top
     */
    pageYOffset: number,
    /**
     * How much is the page scrolled from the left
     */
    pageXOffset: number
}

// element-detection

export interface GenericElement {
    position: ElementPosition,

    area: number, // width x height
    visible: boolean
};

export interface GenericElementsExtractResult {
    elements: GenericElement[],
    /**
     * Number of elements in the page (visible + invisible)
     */
    elementCount: number,
    /**
     * Number of elements in the page (visible only)
     */
    visibleElementCount: number,
    pageWidth: number,
    pageHeight: number,
}

// text-detection

export interface TextElement extends GenericElement {
    fontType: string,
    fontSize: string,
    color: string,
    backgroundColor: string | undefined,
    fontWeight: string,
    totalCharacters: number,
    text: string,
}

export interface TextElementsExtractResult extends GenericElementsExtractResult {
    elements: TextElement[],
}

// image-detection

export interface ImageElement extends GenericElement {
    url: string,
    tagName: string,
    /**
     * Aspect ratio is undefined if DIV/0
     */
    aspectRatio: number | undefined,
}

export interface ImageElementsExtractResult extends GenericElementsExtractResult {
    elements: ImageElement[],
}

// video-detection

export interface VideoElement extends GenericElement {
    url: string,
    tagName: string,
}

export interface VideoElementsExtractResult extends GenericElementsExtractResult {
    elements: VideoElement[],
}

// anchor-detection

export interface AnchorElement extends GenericElement {
    href: string | null,
    text: string
}

export interface AnchorElementsExtractResult extends GenericElementsExtractResult {
    elements: AnchorElement[]
}

// vibrant-colors

export interface VibrantColorsExtractResult {
    vibrantPalette: Palette | undefined,
    pixelCountVibrant: number,
    pixelCountMuted: number,
    pixelCountDarkVibrant: number,
    pixelCountDarkMuted: number,
    pixelCountLightVibrant: number,
    pixelCountLightMuted: number,
    totalPixels: number
}

export type VibrantColorsPallete = Palette;

// alignment-points

export type AlignmentPointWeights = {
    /**
     * Alignment point on an axis and total area of elements that have that alignment point.
     */
    [point in number]: number
}

export interface AlignmentPointsExtractResult {
    xAlignmentPoints: AlignmentPointWeights,
    yAlignmentPoints: AlignmentPointWeights,
    totalAlignmentPoints: number,
    totalXAlignmentPoints: number,
    totalYAlignmentPoints: number
}
