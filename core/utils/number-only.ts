/**
 * Returns undefined if number is NaN or Infinity
 * @param x
 */
export function numberOnly(x: number): number | undefined {
    if (Object.is(x, NaN)
        || Object.is(x, -NaN)
        || Object.is(x, Infinity)
        || Object.is(x, -Infinity)) return undefined;
    return x;
}
