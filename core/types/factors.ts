import { Palette } from "node-vibrant/lib/color";

// factor id: symmetry

export interface SymmetryConfig {
    /**
     * 0-100
     */
    acceptablePercentage: number,
}

export interface SymmetryExtractResult {
    visitedPixels: number,

    /**
     * Exact top-bottom symmetry pixels count
     */
    tbExactSymmetricalPixels: number,

    /**
     * Exact left-right symmetry pixels count
     */
    lrExactSymmetricalPixels: number
}

// factor id: pictures

export interface PicturesConfig {
    /**
     * Minimum picture area (px^2)
     */
    acceptableThreshold: number,
}

export interface PicturesExtractResult {
    /**
     * Number of pictures in the page (visible + invisible)
     */
    allCount: number,
    /**
     * Number of pictures in the page (visible)
     */
    visibleCount: number,
    data: PictureData[],
}

export type PictureData = {
    url: string,
    tagName: string,
    width: number,
    height: number,
    area: number, // width x height
    x: number,
    y: number,
    visible: boolean,
};

// factor id: videos

export interface VideosExtractResult {
    /**
     * Number of pictures in the page (visible + invisible)
     */
    allCount: number,
    /**
     * Number of pictures in the page (visible)
     */
    visibleCount: number,
    data: VideoData[],
}

export type VideoData = {
    tagName: string,
    width: number,
    height: number,
    area: number, // width x height
    x: number,
    y: number,
    visible: boolean,
};

// factor id: text-font-type

export interface TextFontTypeExtractResult {
    /**
     * all font stacks
     */
    stacks: string[],

    /**
     * The first font of each font stack in allFonts
     */
    usedFonts: string[],
}

// factor id: text-size

export interface TextSizeConfig {
    /**
     * Show or hide red markings on result screen
     */
    marking: boolean,

    /**
     * minimum font size threshold
     */
    minimumSize: number,
}

export interface TextSizeExtractResult {
    /**
     * total elements with font size under threshold
     */
    // totalElements: number,

    /**
     * total characters
     */
    totalCharacters: number,

    /**
     * total characters with font size under threshold
     */
    // totalSmallCharacters: number,

    /**
     * Characters counter for each font size
     */
    textSizeMap: Record<number, number>,

    /**
     * Score
     */
    // score: number,
}

// factor id: color-harmony

export interface DominantColorsConfig {
    /**
     * In percentage (0-100)
     */
    vibrantMaxAreaPercentage: number,
}

export interface DominantColorsExtractResult {
    vibrant: Palette | undefined,
    totalPixels: number,
    vibrantPixelCount: number,
}

export type DominantColorsPallete = Palette;

// factor id: element-count

export interface ElementCountExtractResult {
    count: number,

    /**
     * Count of each tag name
     */
    list: Record<string, number>,
}

// factor id: color-count

export interface ColorCountExtractResult {
    rank: Array<{color: string, pixelCount: number}>,
}

// factor id: density
export interface DensityConfig {
    /**
     * In percentage (0-100)
     */
    acceptableThreshold: number,
}

export interface DensityExtractResult {
    /** 
     * (all pixels other than most used divided by all pixels) * 100
     **/
    percentage: number,

    visitedPixels: number,
    bgPixels: number,
}

// factor id: negative space
export interface NegativeSpaceExtractResult {
    scrollWidth: number,
    scrollHeight: number,
    textElementCount: number,
    components: {x: number, y: number, w: number, h: number}[],
}

// Legacy types:

