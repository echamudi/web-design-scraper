import { equalWithTolerance } from './equality';

test('rgbToHex', () => {
  expect(equalWithTolerance(1, 1, 0)).toStrictEqual(true);

  expect(equalWithTolerance(1, 0.9, 0.11)).toStrictEqual(true);
  expect(equalWithTolerance(1, 1.1, 0.11)).toStrictEqual(true);
  expect(equalWithTolerance(0.9, 1, 0.11)).toStrictEqual(true);
  expect(equalWithTolerance(1.1, 1, 0.11)).toStrictEqual(true);

  expect(equalWithTolerance(0.88, 1, 0.11)).toStrictEqual(false);
  expect(equalWithTolerance(1.12, 1, 0.11)).toStrictEqual(false);
});
