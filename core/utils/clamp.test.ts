import { clamp } from './clamp';

test('standard values', () => {
  expect(clamp(0, 0.2, 0.9)).toStrictEqual(0);
  expect(clamp(0.2, 0.2, 0.9)).toStrictEqual(0);
  expect(clamp(0.55, 0.2, 0.9)).toStrictEqual(0.5000000000000001);
  expect(clamp(0.9, 0.2, 0.9)).toStrictEqual(1);
  expect(clamp(0.95, 0.2, 0.9)).toStrictEqual(1);
  expect(clamp(1, 0.2, 0.9)).toStrictEqual(1);
});

test('no delta', () => {
  expect(clamp(0, 0.1, 0.1)).toStrictEqual(1);
  expect(clamp(0.5, 0.5, 0.5)).toStrictEqual(1);
  expect(clamp(1, 0.7, 0.7)).toStrictEqual(1);
});

test('upperLimit is lower than lowerLimit', () => {
  expect(() => {
    clamp(0, 0.51, 0.5);
  }).toThrowError();
});
