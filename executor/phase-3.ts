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
    public displayCanvas: HTMLCanvasElement | undefined;
    public complexityTextDomViz: HTMLCanvasElement | undefined;
    public densityMajorDomViz: HTMLCanvasElement | undefined;
    public simplicityHorizontalViz: HTMLCanvasElement | undefined;
    public simplicityVerticalViz: HTMLCanvasElement | undefined;

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

        this.calculateAllScores();

        // Draw display canvases
        // TODO: Seperate these functionalities out of Phase3
        this.displayCanvas = doc.createElement('canvas');
        plotter(this.displayCanvas, this.imageElementPositions, { ...this.plotterConfig, backgroundColor: '#FFFFFF', blockColor: 'rgba(242, 120, 75, 0.7)' });
        plotter(this.displayCanvas, this.textElementPositions, { ...this.plotterConfig, blockColor: 'rgba(25, 181, 254, 0.7)', skipResizingCanvas: true });

        this.complexityTextDomVizDraw();
        this.densityMajorDomVizDraw();
        this.simplicityHorizontalVizDraw();
        this.simplicityVerticalVizDraw();
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

    // TEMP: Codes below this line are temporary canvas drawing functionalities to visualize the result
    // TODO: Sepearate the codes below to its own file

    public complexityTextDomVizDraw() {
        this.complexityTextDomViz = document.createElement('canvas');

        const canvas = this.complexityTextDomViz;

        if (!canvas) { return; }
        if (!this.textElementPositions) { return; }

        const width = this.phase2Features.browserInfo.pageWidth;
        const height = this.phase2Features.browserInfo.pageHeight;
        const tileSize = this.plotterConfig.tileSize;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx === null) return;

        plotter(canvas, this.textElementPositions, { ...this.plotterConfig, backgroundColor: '#FFFFFF', blockColor: '#19b5fe' });

        // Draw Grid
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 5;

        for (let i = 0; i < width; i += tileSize) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
            ctx.closePath();
        }

        for (let i = 0; i < height; i += tileSize) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }

        return;
    }

    // drawDomElementDetectionCanvas(): false {
    //     const dedc = document.createElement('canvas');

    //     if (!dedc) { return false; }
    //     if (!this.displayCanvas) { return false; }

    //     dedc.width = this.phase2Features.browserInfo.pageWidth;
    //     dedc.height = this.phase2Features.browserInfo.pageHeight;

    //     const destCtx = dedc.getContext('2d');
    //     destCtx.drawImage(this.finalScoreObj.displayCanvas, 0, 0);

    //     return false;
    // }

    public densityMajorDomVizDraw() {
        this.densityMajorDomViz = document.createElement('canvas');

        const dedc = this.densityMajorDomViz;

        if (!dedc) { return false; }
        if (!this.displayCanvas) { return false; }

        const width = this.phase2Features.browserInfo.pageWidth;
        const height = this.phase2Features.browserInfo.pageHeight;
        const tileSize = this.plotterConfig.tileSize;

        dedc.width = width;
        dedc.height = height;

        const ctx = dedc.getContext('2d');
        if (ctx === null) return;
        ctx.drawImage(this.displayCanvas, 0, 0);

        // Draw Grid
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 5;

        for (let i = 0; i < width; i += tileSize) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, height);
            ctx.stroke();
            ctx.closePath();
        }

        for (let i = 0; i < height; i += tileSize) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(width, i);
            ctx.stroke();
        }
    }

    public simplicityHorizontalVizDraw() {
        this.simplicityHorizontalViz = document.createElement('canvas');
        const canvas = this.simplicityHorizontalViz;

        if (!canvas) { return false; }

        const browserInfo = this.phase2Features.browserInfo;

        const width = this.phase2Features.browserInfo.pageWidth;
        const height = this.phase2Features.browserInfo.pageHeight;
        const tileSize = this.plotterConfig.tileSize;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx === null) { console.log('CTX is null'); return; }
        if (this.displayCanvas === undefined) { console.log('displayCanvas is undefined'); return; }

        // Draw illustration in full page

        ctx.drawImage(this.displayCanvas, 0, 0);

        // Outer box
        // ctx.strokeStyle = 'blue';
        // ctx.lineWidth = 6;
        // ctx.beginPath();
        // ctx.moveTo(browserInfo.pageXOffset + 5, browserInfo.pageYOffset);
        // ctx.lineTo(browserInfo.pageXOffset + browserInfo.viewportWidth - 5, browserInfo.pageYOffset);
        // ctx.lineTo(browserInfo.pageXOffset + browserInfo.viewportWidth - 5, browserInfo.pageYOffset + browserInfo.viewportHeight);
        // ctx.lineTo(browserInfo.pageXOffset + 5, browserInfo.pageYOffset + browserInfo.viewportHeight);
        // ctx.closePath();
        // ctx.stroke();

        Object.keys(this.phase2Features.alignmentPoints.xAlignmentPoints).forEach((axis) => {
            if (this.phase2Features.alignmentPoints.xAlignmentPoints[Number(axis)] > 4096) {
                ctx.strokeStyle = 'blue';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(Number(axis), browserInfo.pageYOffset);
                ctx.lineTo(Number(axis), browserInfo.pageYOffset + browserInfo.viewportHeight);
                ctx.stroke();
                ctx.closePath();
            } else {
                // ctx.strokeStyle = 'rgba(255,0,0,0.1)';
                // ctx.lineWidth = 4;
                // ctx.beginPath();
                // ctx.moveTo(Number(axis), browserInfo.pageYOffset);
                // ctx.lineTo(Number(axis), browserInfo.pageYOffset + browserInfo.viewportHeight);
                // ctx.stroke();
                // ctx.closePath();
            }
        });

        // Get the viewport part only

        const viewportImageData = ctx.getImageData(browserInfo.pageXOffset, browserInfo.pageYOffset, browserInfo.viewportWidth, browserInfo.viewportHeight);

        canvas.width = viewportImageData.width;
        canvas.height = viewportImageData.height;

        ctx.putImageData(viewportImageData, 0, 0);
    }

    public simplicityVerticalVizDraw() {
        this.simplicityVerticalViz = document.createElement('canvas');
        const canvas = this.simplicityVerticalViz;

        if (!canvas) { return false; }

        const browserInfo = this.phase2Features.browserInfo;

        const width = this.phase2Features.browserInfo.pageWidth;
        const height = this.phase2Features.browserInfo.pageHeight;
        const tileSize = this.plotterConfig.tileSize;

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (ctx === null) { console.log('CTX is null'); return; }
        if (this.displayCanvas === undefined) { console.log('displayCanvas is undefined'); return; }

        // Draw illustration in full page

        ctx.drawImage(this.displayCanvas, 0, 0);

        // Outer box
        // ctx.strokeStyle = 'blue';
        // ctx.lineWidth = 6;
        // ctx.beginPath();
        // ctx.moveTo(browserInfo.pageXOffset + 5, browserInfo.pageYOffset);
        // ctx.lineTo(browserInfo.pageXOffset + browserInfo.viewportWidth - 5, browserInfo.pageYOffset);
        // ctx.lineTo(browserInfo.pageXOffset + browserInfo.viewportWidth - 5, browserInfo.pageYOffset + browserInfo.viewportHeight);
        // ctx.lineTo(browserInfo.pageXOffset + 5, browserInfo.pageYOffset + browserInfo.viewportHeight);
        // ctx.closePath();
        // ctx.stroke();

        Object.keys(this.phase2Features.alignmentPoints.yAlignmentPoints).forEach((axis) => {
            if (this.phase2Features.alignmentPoints.yAlignmentPoints[Number(axis)] > 8192) {
                ctx.strokeStyle = 'blue';
                ctx.lineWidth = 4;
                ctx.beginPath();
                ctx.moveTo(0, Number(axis));
                ctx.lineTo(browserInfo.viewportWidth, Number(axis));
                ctx.stroke();
                ctx.closePath();
            }
        });

        // Get the viewport part only

        const viewportImageData = ctx.getImageData(browserInfo.pageXOffset, browserInfo.pageYOffset, browserInfo.viewportWidth, browserInfo.viewportHeight);

        canvas.width = viewportImageData.width;
        canvas.height = viewportImageData.height;

        ctx.putImageData(viewportImageData, 0, 0);
    }
}
