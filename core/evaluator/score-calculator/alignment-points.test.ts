import { alignmentPointsScoreCalculate } from './alignment-points';

test('standard (data)', () => {
  expect(
    alignmentPointsScoreCalculate({
      1: 1000,
      2: 5000,
      3: 10000,
      4: 15000,
      5: 20000,
      6: 15000,
      7: 10000,
      8: 5000,
      9: 1000,
    }).data,
  ).toStrictEqual(
    {
      totalSignificantAPs: 3,
      transformedAPs: { 4: 15000, 5: 20000, 6: 15000 },
    },
  );

  expect(
    alignmentPointsScoreCalculate({
      1: 1000,
      2: 5000,
      3: 10000,
      4: 15000,
      5: 20000,
      6: 15000,
      7: 10000,
      8: 5000,
      9: 1000,
    }, {
      transformer: (val) => Math.floor(val / 2),
    }).data,
  ).toStrictEqual(
    {
      totalSignificantAPs: 3,
      transformedAPs: { 1: 15000, 2: 35000, 3: 25000 },
    },
  );
});
