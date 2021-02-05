// Default configs

import { AlignmentPointsScoreCalculateConfig } from 'Core/evaluator/score-calculator/alignment-points';
import { BlockDensityScoreCalculateConfig } from 'Core/evaluator/score-calculator/block-density';
import { ConsistencyScoreCalculateConfig } from 'Core/evaluator/score-calculator/consistency';

export const configComplexityTextDom: BlockDensityScoreCalculateConfig = {
    failPercentage: 0.75,
};

export const configDensityMajorDom: BlockDensityScoreCalculateConfig = {};

export const configCohesionImageDom: ConsistencyScoreCalculateConfig = {
    failThreshold: 25,
    transformer: ((val) => Math.round(val * 10) / 10),
};

export const configEconomyImageDom: ConsistencyScoreCalculateConfig = {
    failThreshold: 30,
    transformer: ((val) => Math.floor(val / 10000)),
};

export const configEconomyTextDom: ConsistencyScoreCalculateConfig = {
    failThreshold: 30,
    transformer: ((val) => Math.floor(val / 10000)),
};

export const configSimplicityHorizontal: AlignmentPointsScoreCalculateConfig = {
    transformer: (val) => Math.floor(val / 10),
};

export const configSimplicityVertical: AlignmentPointsScoreCalculateConfig = {
    transformer: (val) => Math.floor(val / 10),
};
