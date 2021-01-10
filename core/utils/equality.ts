export function equalWithTolerance(a: number, b: number, tolerance: number): boolean {
    if (a === b) return true;

    let val = a - b;
    if (a - b < 0) val = -val;

    return val < tolerance;
}
