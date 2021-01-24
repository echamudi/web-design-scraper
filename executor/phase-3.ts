import { alignmentPointsScoreCalculate, AlignmentPointsScoreCalculateConfig, AlignmentPointsScoreCalculateResult } from 'Core/evaluator/score-calculator/alignment-points';
import { blockDensityScoreCalculate, BlockDensityScoreCalculateConfig, BlockDensityScoreCalculateResult } from 'Core/evaluator/score-calculator/block-density';
import { consistencyScoreCalculate, ConsistencyScoreCalculateConfig, ConsistencyScoreCalculateResult } from 'Core/evaluator/score-calculator/consistency';
import { GenericElement, ImageElement, TextElement } from 'Core/types/feature-extractor';
import { ElementPosition, Phase2Result } from 'Core/types/types';
import { plotter, PlotterConfig } from 'Core/utils/canvas';
import { filterVisibleElements, getElementPositions } from 'Core/utils/elements';
import {
    configCohesionImageDom,
    configComplexityTextDom,
    configDensityMajorDom,
    configEconomyImageDom,
    configEconomyTextDom,
    configSimplicityHorizontal,
    configSimplicityVertical,
} from './default-configs';

export class Phase3 {
    private phase2Features: Phase2Result;

    // common plotter config for element distributions
    public plotterConfig: PlotterConfig;

    // Visible detected DOM elements
    public imageElements: ImageElement[];
    public imageElementPositions: ElementPosition[];
    public textElements: TextElement[];
    public textElementPositions: ElementPosition[];
    public majorElements: GenericElement[];
    public majorElementPositions: ElementPosition[];

    // Element distributions
    public textElementDistribution: number[][];
    public imageElementDistribution: number[][];
    public majorElementDistribution: number[][];

    // Scores (Based on unique id in the Web Design Usability Components table)
    public complexityTextDom: BlockDensityScoreCalculateResult | undefined;
    public densityMajorDom: BlockDensityScoreCalculateResult | undefined;
    public cohesionImageDom: ConsistencyScoreCalculateResult | undefined;
    public economyImageDom: ConsistencyScoreCalculateResult | undefined;
    public economyTextDom: ConsistencyScoreCalculateResult | undefined;
    public simplicityHorizontal: AlignmentPointsScoreCalculateResult | undefined;
    public simplicityVertical: AlignmentPointsScoreCalculateResult | undefined;

    // Display Canvas
    // public displayCanvas: HTMLCanvasElement | undefined;

    constructor(doc: Document, features: Phase2Result) {
        // Save features to the object
        this.phase2Features = features;

        // Construct config for plotter
        const tileSize = Math.floor(features.browserInfo.viewportWidth / 6);
        const { pageHeight } = features.browserInfo;
        const { pageWidth } = features.browserInfo;
        this.plotterConfig = { pageHeight, pageWidth, tileSize };

        // Text Elements
        const textPlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
        this.textElements = filterVisibleElements(features.textElements.elements);
        this.textElementPositions = getElementPositions(this.textElements);;
        this.textElementDistribution = plotter(
            textPlotCanvas,
            this.textElementPositions,
            this.plotterConfig,
        ).distribution;

        // Image Elements
        const imagePlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
        this.imageElements = filterVisibleElements(features.imageElements.elements);
        this.imageElementPositions = getElementPositions(this.imageElements);
        this.imageElementDistribution = plotter(
            imagePlotCanvas,
            this.imageElementPositions,
            this.plotterConfig,
        ).distribution;

        // Major Elements
        const majorPlotCanvas: HTMLCanvasElement = doc.createElement('canvas');
        this.majorElements = filterVisibleElements(features.majorElements.elements);
        this.majorElementPositions = getElementPositions(this.majorElements);
        this.majorElementDistribution = plotter(
            majorPlotCanvas,
            this.majorElementPositions,
            this.plotterConfig
        ).distribution;

        // Display canvas is just for visualization view (TEMP)

        // const displayCanvas: HTMLCanvasElement = doc.createElement('canvas');
        // plotter(displayCanvas, imageElementPositions, { ...this.plotterConfig, backgroundColor: '#FFFFFF', blockColor: 'rgba(242, 120, 75, 0.7)' });
        // plotter(displayCanvas, textElementPositions, { ...this.plotterConfig, blockColor: 'rgba(25, 181, 254, 0.7)', skipResizingCanvas: true });

        // this.displayCanvas = displayCanvas;

        this.calculateAllScores();
    }

    public calculateComplexityTextDom(config?: BlockDensityScoreCalculateConfig) {
        const usedConfig = config ?? configComplexityTextDom;
        this.complexityTextDom = blockDensityScoreCalculate(this.textElementDistribution, usedConfig);
    }

    public calculateDensityMajorDom(config?: BlockDensityScoreCalculateConfig) {
        const usedConfig = config ?? configDensityMajorDom;
        this.densityMajorDom = blockDensityScoreCalculate(this.majorElementDistribution, usedConfig);
    }

    public calculateCohesionImageDom(config?: ConsistencyScoreCalculateConfig) {
        const usedConfig = config ?? configCohesionImageDom;
        const aspectRatios: number[] = [];
        this.imageElements.forEach((el) => {
            if (el.visible && typeof el.aspectRatio === 'number') aspectRatios.push(el.aspectRatio);
        });

        this.cohesionImageDom = consistencyScoreCalculate(aspectRatios, usedConfig);
    }

    public calculateEconomyImageDom(config?: ConsistencyScoreCalculateConfig) {
        const usedConfig = config ?? configEconomyImageDom;
        const areas: number[] = [];
        this.imageElements.forEach((el) => {
            if (el.visible && typeof el.area === 'number') areas.push(el.area);
        });
        this.economyImageDom = consistencyScoreCalculate(areas, usedConfig);
    }

    public calculateEconomyTextDom(config?: ConsistencyScoreCalculateConfig) {
        const usedConfig = config ?? configEconomyTextDom;
        const areas: number[] = [];
        this.textElements.forEach((el) => {
            if (el.visible && typeof el.area === 'number') areas.push(el.area);
        });
        this.economyTextDom = consistencyScoreCalculate(areas, usedConfig);
    }

    public calculateSimplicityHorizontal(config?: AlignmentPointsScoreCalculateConfig) {
        const usedConfig = config ?? configSimplicityHorizontal;
        this.simplicityHorizontal = alignmentPointsScoreCalculate(
            this.phase2Features.alignmentPoints.xAlignmentPoints,
            usedConfig,
        );
    }

    public calculateSimplicityVertical(config?: AlignmentPointsScoreCalculateConfig) {
        const usedConfig = config ?? configSimplicityVertical;
        this.simplicityVertical = alignmentPointsScoreCalculate(
            this.phase2Features.alignmentPoints.yAlignmentPoints,
            usedConfig,
        );
    }

    /**
     * Calculate all scores using the default config
     */
    public calculateAllScores() {
        this.calculateComplexityTextDom();
        this.calculateDensityMajorDom();
        this.calculateCohesionImageDom();
        this.calculateEconomyImageDom();
        this.calculateEconomyTextDom();
        this.calculateSimplicityHorizontal();
        this.calculateSimplicityVertical();
    }

    public getAllScores() {
        // TODO: implements -99
        return {
            symmetryPixelVertical: -99,
            symmetryPixelHorizontal: -99,
            complexityTextDom: this.complexityTextDom,
            densityPixel: -99,
            densityMajorDom: this.densityMajorDom,
            cohesionImageDom: this.cohesionImageDom,
            economyImageDom: this.economyImageDom,
            economyTextDom: this.economyTextDom,
            simplicityHorizontal: this.simplicityHorizontal,
            simplicityVertical: this.simplicityVertical,
            colorDominant: -99,
            graphicPictures: -99,
            graphicVideos: -99,
            textSize: -99,
            textTotalFonts: -99,
            textFontType: -99,
        };
    }
}
