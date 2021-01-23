import { rgbToHex, hexToRgb, colorEquality } from './color';

test('rgbToHex', () => {
    expect(rgbToHex({ r: 255, g: 255, b: 255 })).toStrictEqual('ffffff');
    expect(rgbToHex({ r: 0, g: 0, b: 0 })).toStrictEqual('000000');
    expect(rgbToHex({ r: 87, g: 34, b: 8 })).toStrictEqual('572208');
});

test('hexToRGB', () => {
    expect(hexToRgb('ffffff')).toStrictEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('000000')).toStrictEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('572208')).toStrictEqual({ r: 87, g: 34, b: 8 });
    expect(hexToRgb('#ffffff')).toStrictEqual({ r: 255, g: 255, b: 255 });
    expect(hexToRgb('#000000')).toStrictEqual({ r: 0, g: 0, b: 0 });
    expect(hexToRgb('#572208')).toStrictEqual({ r: 87, g: 34, b: 8 });
});

test('colorEquality', () => {
    // Strict
    expect(colorEquality({ r: 255, g: 255, b: 255 }, { r: 255, g: 255, b: 255 })).toStrictEqual(true);
    expect(colorEquality({ r: 255, g: 255, b: 255 }, { r: 255, g: 255, b: 255 }, 0)).toStrictEqual(true);

    // With tolerance
    expect(colorEquality({ r: 85, g: 200, b: 150 }, { r: 80, g: 207, b: 155 }, 2)).toStrictEqual(true);
    expect(colorEquality({ r: 85, g: 200, b: 150 }, { r: 80, g: 210, b: 155 }, 2)).toStrictEqual(false);
    expect(colorEquality({ r: 85, g: 200, b: 150 }, { r: 80, g: 210, b: 155 }, 2.6)).toStrictEqual(true);

    expect(colorEquality({ r: 85, g: 200, b: 150 }, { r: 0, g: 0, b: 0 }, 100)).toStrictEqual(true);
    expect(colorEquality({ r: 85, g: 200, b: 150 }, { r: 0, g: 0, b: 0 }, 67)).toStrictEqual(true);
    expect(colorEquality({ r: 85, g: 200, b: 150 }, { r: 0, g: 0, b: 0 }, 65)).toStrictEqual(false);
});
