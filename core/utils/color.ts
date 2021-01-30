import { diff, LabColor, rgb_to_lab } from 'color-diff';
import { Color } from 'Core/types/types';
import { hex, rgb } from 'color-convert';

// export function componentToHex(c: number) {
//     var hex = c.toString(16);
//     return hex.length == 1 ? "0" + hex : hex;
// }

/**
 * Convert Color obj to hex (transparency will be ignored)
 */
export function rgbToHex(color: Color): string {
    return rgb.hex([color.r, color.g, color.b]).toLowerCase();
}

/**
 * Convert hex (no transparency) to Color obj
 * @param hexString '#abcdef' or 'abcdef'
 */
export function hexToRgb(hexString: string): Color {
    if (hexString[0] === '#') hexString = hexString.slice(1);
    if (hexString.length !== 6) throw new Error('Hex string is too long');
    const rgb = hex.rgb(hexString);
    const color: Color = {
        r: rgb[0],
        g: rgb[1],
        b: rgb[2],
    };
    return color;
}

export function colorDiff(col1: Color, col2: Color): number {
    const color1: LabColor = rgb_to_lab({ R: col1.r, G: col1.g, B: col1.b });
    const color2: LabColor = rgb_to_lab({ R: col2.r, G: col2.g, B: col2.b });

    return diff(color1, color2);
}

/**
 *
 * @param col1 Color 1. Alpha is ignored.
 * @param col2 Color 2. Alpha is ignored.
 * @param tolerance CIEDE2000 score tolerance (100 = accept all differences, 0 = strict equality)
 */
export function colorEquality(col1: Color, col2: Color, tolerance?: number): boolean {
    if (tolerance === undefined || tolerance === 0) {
        return col1.r === col2.r && col1.g === col2.g && col1.b === col2.b;
    }

    const ciede2000 = colorDiff(col1, col2);
    return ciede2000 < tolerance;
}
