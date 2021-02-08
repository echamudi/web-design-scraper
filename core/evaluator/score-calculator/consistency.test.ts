import { consistencyScoreCalculate } from './consistency';

test('standard', () => {
  expect(
    consistencyScoreCalculate([1, 2, 3, 4, 5, 6, 7, 8, 9]),
  ).toStrictEqual(
    {
      data: {
        totalMembers: 9,
        transformedMembers: [
          1, 2, 3, 4, 5,
          6, 7, 8, 9,
        ],
        totalUniqueTransformedMembers: 9,
        uniqueTransformedMembers: [
          1, 2, 3, 4, 5,
          6, 7, 8, 9,
        ],
      },
      score: 0.11111111111111116,
    },
  );
  expect(
    consistencyScoreCalculate([1.11, 1.12, 1.13, 1.14, 1.15]),
  ).toStrictEqual(
    {
      data: {
        totalMembers: 5,
        transformedMembers: [1.11, 1.12, 1.13, 1.14, 1.15],
        totalUniqueTransformedMembers: 5,
        uniqueTransformedMembers: [1.11, 1.12, 1.13, 1.14, 1.15],
      },
      score: 0.5555555555555556,
    },
  );
  expect(
    consistencyScoreCalculate([1, 1, 1]),
  ).toStrictEqual(
    {
      data: {
        totalMembers: 3,
        transformedMembers: [1, 1, 1],
        totalUniqueTransformedMembers: 1,
        uniqueTransformedMembers: [1],
      },
      score: 1,
    },
  );
  expect(
    consistencyScoreCalculate([]),
  ).toStrictEqual(
    {
      data: {
        totalMembers: undefined,
        transformedMembers: undefined,
        totalUniqueTransformedMembers: undefined,
        uniqueTransformedMembers: undefined,
      },
      score: undefined,
    },
  );
});

test('for image dom consistency', () => {
  expect(
    consistencyScoreCalculate([1, 2, 3, 4, 5, 6, 7, 8, 9], {
      failThreshold: 25,
      transformer: (val) => Math.round(val * 10) / 10,
    }),
  ).toStrictEqual(
    {
      data: {
        totalMembers: 9,
        transformedMembers: [
          1, 2, 3, 4, 5,
          6, 7, 8, 9,
        ],
        totalUniqueTransformedMembers: 9,
        uniqueTransformedMembers: [
          1, 2, 3, 4, 5,
          6, 7, 8, 9,
        ],
      },
      score: 0.6666666666666667,
    },
  );

  expect(
    consistencyScoreCalculate([1.64, 1.64, 1.63, 1.62, 2.12, 2.13], {
      failThreshold: 25,
      transformer: (val) => Math.round(val * 10) / 10,
    }),
  ).toStrictEqual(
    {
      data: {
        totalMembers: 6,
        transformedMembers: [1.6, 1.6, 1.6, 1.6, 2.1, 2.1],
        totalUniqueTransformedMembers: 2,
        uniqueTransformedMembers: [1.6, 2.1],
      },
      score: 0.9583333333333334,
    },
  );

  expect(
    consistencyScoreCalculate([5, 5, 5, 5, 5, 5, 5, 5, 5], {
      failThreshold: 25,
      transformer: (val) => Math.round(val * 10) / 10,
    }),
  ).toStrictEqual(
    {
      data: {
        totalMembers: 9,
        transformedMembers: [
          5, 5, 5, 5, 5,
          5, 5, 5, 5,
        ],
        totalUniqueTransformedMembers: 1,
        uniqueTransformedMembers: [5],
      },
      score: 1,
    },
  );
});
