import { rgbToHex, hexToRgb } from './color';

test('rgbToHex', () => {
    expect(rgbToHex({r: 255, g: 255, b: 255})).toStrictEqual('ffffff');
    expect(rgbToHex({r: 0, g: 0, b: 0})).toStrictEqual('000000');
    expect(rgbToHex({r: 87, g: 34, b: 8})).toStrictEqual('572208');
});

test('hexToRGB', () => {
    expect(hexToRgb('ffffff')).toStrictEqual({r: 255, g: 255, b: 255});
    expect(hexToRgb('000000')).toStrictEqual({r: 0, g: 0, b: 0});
    expect(hexToRgb('572208')).toStrictEqual({r: 87, g: 34, b: 8});
    expect(hexToRgb('#ffffff')).toStrictEqual({r: 255, g: 255, b: 255});
    expect(hexToRgb('#000000')).toStrictEqual({r: 0, g: 0, b: 0});
    expect(hexToRgb('#572208')).toStrictEqual({r: 87, g: 34, b: 8});
});
