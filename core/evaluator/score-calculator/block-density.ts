import { clamp } from 'Core/utils/clamp';

export interface BlockDensityScoreCalculateResult {
    data: {
        maxDensity: number | undefined,
        minDensity: number | undefined,
        average: number | undefined
        maxDensityClamped: number | undefined,
        minDensityClamped: number | undefined,
        averageClamped: number | undefined
    },
    /**
     * Final score is the reverse of averageClamped [0,1]
     */
    score: number | undefined
}

export interface BlockDensityScoreCalculateConfig {
    /**
     * Minimum percentage of a signle grid for getting full score on each grid [0,1].
     * The value must be lower than failPercentage.
     * Default: 0
     */
    passPercentage?: number
    /**
     * Maximum percentage of a signle grid for getting zero score on each grid [0,1].
     * The value must be higher passPercentage.
     * Default: 1
     */
    failPercentage?: number
}

/**
 * Calculate score based on block density distribution
 */
export function blockDensityScoreCalculate(
    distribution: number[][],
    config?: BlockDensityScoreCalculateConfig
): BlockDensityScoreCalculateResult {

    const passPercentage = config?.passPercentage ?? 0;
    const failPercentage = config?.failPercentage ?? 1;

    if (failPercentage <= passPercentage) throw new Error('failPercentage must be higher than passPercentage');

    let totalBlocks = 0;
    let maxDensity = -Infinity;
    let minDensity = Infinity;
    let average = 0;
    let maxDensityClamped = -Infinity;
    let minDensityClamped = Infinity;
    let averageClamped = 0;

    const clampedDistribution: number[][] = [];

    for (let row = 0; row < distribution.length; row++) {
        clampedDistribution.push([]);

        for (let col = 0; col < distribution[row].length; col++) {
            clampedDistribution[row].push(clamp(
                distribution[row][col],
                passPercentage,
                failPercentage
            ));

            totalBlocks += 1;
            maxDensity = Math.max(distribution[row][col], maxDensity);
            minDensity = Math.min(distribution[row][col], minDensity);
            average += distribution[row][col];
        }
    }

    for (let row = 0; row < clampedDistribution.length; row++) {
        for (let col = 0; col < clampedDistribution[row].length; col++) {
            maxDensityClamped = Math.max(clampedDistribution[row][col], maxDensityClamped);
            minDensityClamped = Math.min(clampedDistribution[row][col], minDensityClamped);
            averageClamped += clampedDistribution[row][col];
        }
    }

    if (totalBlocks === 0) {
        return {
            data: {
                maxDensity: undefined,
                minDensity: undefined,
                average: undefined,
                maxDensityClamped: undefined,
                minDensityClamped: undefined,
                averageClamped: undefined
            },
            score: undefined
        }
    }

    average /= totalBlocks;
    averageClamped /= totalBlocks;
    const score = 1 - averageClamped;

    return {
        data: {
            maxDensity,
            minDensity,
            average,
            maxDensityClamped,
            minDensityClamped,
            averageClamped
        },
        score
    };
}
