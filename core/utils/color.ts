import { diff, LabColor, rgb_to_lab } from "color-diff";
import { Color } from "Core/types/types";

export function componentToHex(c: number) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

export function rgbToHex(r: number, g: number, b: number) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export function colorDiff(col1: Color, col2: Color): number {
    const color1: LabColor = rgb_to_lab({R: col1.r, G: col1.g, B: col1.b});
    const color2: LabColor = rgb_to_lab({R: col2.r, G: col2.g, B: col2.b});

    return diff(color1, color2);
}
