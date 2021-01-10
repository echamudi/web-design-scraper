import { blockDensityScoreCalculate } from './block-density';
import { clamp } from 'Core/utils/clamp';

test('standard', () => {
    const density1 = blockDensityScoreCalculate([[0,0],[0,0.5]]);
    expect(density1).toStrictEqual({
        data: {
            maxDensity: 0.5,
            minDensity: 0,
            average: 0.125,
            maxDensityClamped: 0.5,
            minDensityClamped: 0,
            averageClamped: 0.125 
        },
        score: 0.875
    });

    const density2 = blockDensityScoreCalculate([[1,1],[1,1]]);
    expect(density2).toStrictEqual({
        data: {
            maxDensity: 1,
            minDensity: 1,
            average: 1,
            maxDensityClamped: 1,
            minDensityClamped: 1,
            averageClamped: 1 
        },
        score: 0
    });

    const density3 = blockDensityScoreCalculate([[0,0],[0,0]]);
    expect(density3).toStrictEqual({
        data: {
            maxDensity: 0,
            minDensity: 0,
            average: 0,
            maxDensityClamped: 0,
            minDensityClamped: 0,
            averageClamped: 0 
        },
        score: 1
    });
});

test('undefined values', () => {
    const density1 = blockDensityScoreCalculate([]);
    expect(density1).toStrictEqual({
        data: {
            maxDensity: undefined,
            minDensity: undefined,
            average: undefined,
            maxDensityClamped: undefined,
            minDensityClamped: undefined,
            averageClamped: undefined 
        },
        score: undefined
    });

    const density2 = blockDensityScoreCalculate([[]]);
    expect(density2).toStrictEqual({
        data: {
            maxDensity: undefined,
            minDensity: undefined,
            average: undefined,
            maxDensityClamped: undefined,
            minDensityClamped: undefined,
            averageClamped: undefined 
        },
        score: undefined
    });
});

test('clamped values', () => {
    const density1 = blockDensityScoreCalculate([
        [0.2, 0.25, 0.5, 0.75, 0.8]
    ], {
        failPercentage: 0.75,
        passPercentage: 0.25
    });

    expect(density1).toStrictEqual({
        data: {
            maxDensity: 0.8,
            minDensity: 0.2,
            maxDensityClamped: 1,
            minDensityClamped: 0,
            average: 0.5,
            averageClamped: 0.5
        },
        score: 0.5
    });

    const density2 = blockDensityScoreCalculate([
        [0.4, 0.45, 0.5, 0.55, 0.6]
    ], {
        failPercentage: 0.9,
        passPercentage: 0.25
    });

    expect(density2).toStrictEqual({
        data: {
          maxDensity: 0.6,
          minDensity: 0.4,
          average: 0.5,
          maxDensityClamped: 0.5384615384615384,
          minDensityClamped: 0.23076923076923078,
          averageClamped: 0.3846153846153846
        },
        score: 0.6153846153846154
    });
});
