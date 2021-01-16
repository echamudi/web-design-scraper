import { diff, rgb_to_lab, rgba_to_lab, RGBColor, LabColor } from 'color-diff';

test('color difference', async () => {
    const black: LabColor = rgb_to_lab({R: 0, G: 0, B: 0});
    const white: LabColor = rgb_to_lab({R: 255, G: 255, B: 255});
    const blue: LabColor = rgb_to_lab({R: 0, G: 0, B: 255});
    const purplishBlue: LabColor = rgb_to_lab({R: 51, G: 11, B: 222});

    expect(Math.round(diff(black, black))).toEqual(0);
    expect(Math.round(diff(black, white))).toEqual(100);
    expect(Math.round(diff(white, blue))).toEqual(64);
    expect(Math.round(diff(blue, purplishBlue))).toEqual(3);
});
