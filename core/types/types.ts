import { FeatureExtractorResultPhase2 } from "./feature-extractor";

export interface WebPageData {
    /**
     * Base64 of the viewport screenshot
     */
    screenshot: string;

    screenshotWidth: number;
    screenshotHeight: number;

    /**
     * Date.now() val when analyzing the web
     */
    timestamp: number;

    featureExtractorResult: FeatureExtractorResultPhase2;
}

export interface AppState {
    analyzingStatus: string,
    result: WebPageData | null,

    /**
     * viewport screenshot
     */
    screenshot: string | null,
}

// Helpers
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
