/**
 * Score clamper
 * @param val the original val [0,1]
 * @param lowerLimit lower limit, any val below this will be 0 [0,1]
 * @param upperLimit upper limit, any val above this will be 1 [0,1]
 */
export function clamp(val: number, lowerLimit: number, upperLimit: number): number {
  const delta = upperLimit - lowerLimit;
  if (delta < 0) throw new Error('upperLimit must be higher than lower limit');
  if (delta === 0) return 1;

  if (val <= lowerLimit) return 0;
  if (val >= upperLimit) return 1;

  const final = ((val - lowerLimit) / delta);

  return final;
}
