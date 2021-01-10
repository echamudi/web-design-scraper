import { scaleValue } from "Core/utils/math";

export interface ConsistencyScoreCalculateResult {
    data: {
        totalMembers: number | undefined,
        transformedMembers: number[] | undefined;
        /**
         * Total members without duplicate
         */
        totalUniqueTransformedMembers: number | undefined,
        uniqueTransformedMembers: number[] | undefined;
    },
    score: number | undefined
}

export interface ConsistencyScoreCalculateConfig {
    /**
     * Maximum number of members that is considered as fail. [2,99]
     * Default: 10
     */
    failThreshold?: number;
    /**
     * Array map transformer
     * Default: (val) => val
     */
    transformer?(val: number): number;
}

export function consistencyScoreCalculate(members: number[], config?: ConsistencyScoreCalculateConfig): ConsistencyScoreCalculateResult {
    const failThreshold = config?.failThreshold ?? 10;
    const transformer = config?.transformer ?? ((val: number) => val);

    if (members.length === 0) return {
        data: {
            totalMembers: undefined,
            transformedMembers: undefined,
            totalUniqueTransformedMembers: undefined,
            uniqueTransformedMembers: undefined
        },
        score: undefined
    };

    // Rounding to 1 decimal place
    const transformedMembers = members.map(transformer);
    const totalMembers = transformedMembers.length;
    const uniqueTransformedMembers = [...new Set(transformedMembers)];
    const totalUniqueTransformedMembers = uniqueTransformedMembers.length;

    const scaledTotalUniqueMembers = scaleValue(totalUniqueTransformedMembers, [1, failThreshold], [0, 1]);
    const score = 1 - scaledTotalUniqueMembers;

    return {
        data: {
            totalMembers,
            transformedMembers,
            totalUniqueTransformedMembers,
            uniqueTransformedMembers
        },
        score
    }
}
