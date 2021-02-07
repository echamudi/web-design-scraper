import { Palette } from 'node-vibrant/lib/color';
import { Color, ElementPosition } from './types';
import { TextSizeExtractResult, ColorCountExtractResult } from './factors';

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
     * The height of the entire page.
     * Taken from window.scrollHeight
     */
    pageHeight: number,
    /**
     * The width of the entire page.
     * Taken from window.scrollWidth
     */
    pageWidth: number,
    /**
     * How much is the page scrolled from the top
     */
    pageYOffset: number,
    /**
     * How much is the page scrolled from the left
     */
    pageXOffset: number,
    /**
     * Taken from window.devicePixelRatio
     */
    devicePixelRatio: number
}

// generic-elements

export interface GenericElement {
    position: ElementPosition,

    /**
     * Logical area
     */
    area: number, // width x height
    visible: boolean,
    /**
     * Aspect ratio is undefined if DIV/0
     */
    aspectRatio: number | undefined

    // TODO: Add property to show within viewport or not.
}

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

// text-elements

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

// image-elements

export interface ImageElement extends GenericElement {
    url: string,
    tagName: string,
}

export interface ImageElementsExtractResult extends GenericElementsExtractResult {
    elements: ImageElement[],
}

// video-elements

export interface VideoElement extends GenericElement {
    url: string,
    tagName: string,
}

export interface VideoElementsExtractResult extends GenericElementsExtractResult {
    elements: VideoElement[],
}

// anchor-elements

export interface AnchorElement extends GenericElement {
    href: string | null,
    text: string
}

export interface AnchorElementsExtractResult extends GenericElementsExtractResult {
    elements: AnchorElement[]
}

// vibrant-colors

export interface VibrantColorsExtractResult {
    /** #abcdef */
    vibrantHex: string,
    /** total pixels that's within vibrant range [0, Infinity] */
    vibrantPixelCount: number,
    /** vibrant pixels over all pixels [0, 1] */
    vibrantPixelPercentage: number,

    mutedHex: string,
    mutedPixelCount: number,
    mutedPixelPercentage: number,

    darkVibrantHex: string,
    darkVibrantPixelCount: number,
    darkVibrantPixelPercentage: number,

    darkMutedHex: string,
    darkMutedPixelCount: number,
    darkMutedPixelPercentage: number,

    lightVibrantHex: string,
    lightVibrantPixelCount: number,
    lightVibrantPixelPercentage: number,

    lightMutedHex: string,
    lightMutedPixelCount: number,
    lightMutedPixelPercentage: number,

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

// color-symmetry

export interface ColorSymmetryExtractResult {
    horizontal: {
        /**
         * Visualized symmetry result
         */
        visualization: string,
        /**
         * Average of the CIEDE2000 values [0, 100]
         */
        ciede2000average: number,
        /**
         * Total traversed pixel pairs, usually around half the size of the image resolution
         */
        totalPixelPairs: number
    },
    vertical: {
        /**
         * Visualized symmetry result
         */
        visualization: string,
        /**
         * Average of the CIEDE2000 values [0, 100]
         */
        ciede2000average: number,
        /**
         * Total traversed pixel pairs, usually around half the size of the image resolution
         */
        totalPixelPairs: number
    }
}

// color-distribution

export interface ColorDistributionExtractResult {
    mostUsedColor: Color,

    /** Total traversed pixel */
    totalPixels: number,

    colorTop1: {
        /** Base64 image */
        visualization: string,
        /** percentage [0, 1] */
        percentage: number,
    },

    colorTop5?: {
        /** Base64 image */
        visualization: string,
        /** percentage [0, 1] */
        percentage: number,
    },

    colorTop10?: {
        /** Base64 image */
        visualization: string,
        /** percentage [0, 1] */
        percentage: number,
    }
}

// viewport-screenshot

/**
 * Screenshot of the viewport only
 */
export interface ViewportScreenshotExtractResult {
    image: string,
    imageWidth: number,
    imageHeight: number,
    imageArea: number,
    viewportWidth: number,
    viewportHeight: number,
    viewportArea: number,
    /**
     * (imageArea / viewportArea) / 2
     */
    pixelRatio: number
}

// page-screenshot

/**
 * Screenshot of the entire page
 */
export interface PageScreenshotExtractResult {
    image: string,
    imageWidth: number,
    imageHeight: number,
    imageArea: number,
    pageWidth: number,
    pageHeight: number,
    pageArea: number,
    /**
     * (imageArea / viewportArea) / 2
     */
    pixelRatio: number
}
