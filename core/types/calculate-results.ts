interface GraphicPicturesScoreCalculateResult {
    /**
     * Pixel count of page area that is covered with image
     */
    imageArea: number;
    /**
     * Page Width * Height
     */
    pageArea: number;
    /**
     * Total graphic area percentage over the entire page [0,1]
     */
    imagePercentage: number;
}

interface TextFontTypeScoreCalculateResult {
    /**
     * How many number of characters for each font stack
     */
    fontStacks: Record<string, number>;
}