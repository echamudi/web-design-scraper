// Feature EXTRACTOR

import { ElementPosition } from "./types";
import { Palette } from "@vibrant/color";
import { TextSizeExtractResult, DominantColorsExtractResult, ColorCountExtractResult } from "./factors";

// All Results

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

// Phase 2 is the phase 1 result + results from the extension side
export interface FeatureExtractorResultPhase2 extends FeatureExtractorResultPhase1 {
    vibrantColors: VibrantColorsExtractResult,
    dominantColors: DominantColorsExtractResult,
    colorCount: ColorCountExtractResult
}

// browser-info

export interface BrowserInfoExtractResult {
    url: string,
    userAgent: string,
    viewportWidth: number,
    viewportHeight: number,
    scrollHeight: number,
    scrollWidth: number,
    pageYOffset: number,
    pageXOffset: number
}

// element-detection

export interface GenericElement {
    position: ElementPosition,

    area: number, // width x height
    visible: boolean,
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
    scrollWidth: number,
    scrollHeight: number,
}

// text-detection

export interface TextElement {
    position: ElementPosition,

    fontType: string,
    fontSize: string,
    color: string,
    backgroundColor: string | undefined,
    fontWeight: string,
    visible: boolean,
    totalCharacters: number,
    text: string,
    area: number
}

export interface TextElementsExtractResult {
    elements: TextElement[],
    /**
     * Number of elements in the page (visible + invisible)
     */
    elementCount: number,
    /**
     * Number of elements in the page (visible only)
     */
    visibleElementCount: number,
    scrollWidth: number,
    scrollHeight: number,
}

// image-detection

export interface ImageElement {
    position: ElementPosition,

    url: string,
    tagName: string,
    area: number, // width x height

    /**
     * Aspect ratio is undefined if DIV/0
     */
    aspectRatio: number | undefined,
    visible: boolean,
}

export interface ImageElementsExtractResult {
    elements: ImageElement[],
    /**
     * Number of elements in the page (visible + invisible)
     */
    elementCount: number,
    /**
     * Number of elements in the page (visible only)
     */
    visibleElementCount: number,
    scrollWidth: number,
    scrollHeight: number,
}

// video-detection

export interface VideoElement {
    position: ElementPosition,

    url: string,
    tagName: string,
    area: number, // width x height
    visible: boolean,
}

export interface VideoElementsExtractResult {
    elements: VideoElement[],
    /**
     * Number of elements in the page (visible + invisible)
     */
    elementCount: number,
    /**
     * Number of elements in the page (visible only)
     */
    visibleElementCount: number,
    scrollWidth: number,
    scrollHeight: number,
}

// anchor-detection

export interface AnchorElement {
    position: ElementPosition,

    href: string | null,
    text: string,
    area: number, // width x height
    visible: boolean,
}

export interface AnchorElementsExtractResult {
    elements: AnchorElement[],
    /**
     * Number of elements in the page (visible + invisible)
     */
    elementCount: number,
    /**
     * Number of elements in the page (visible only)
     */
    visibleElementCount: number,
    scrollWidth: number,
    scrollHeight: number,
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
