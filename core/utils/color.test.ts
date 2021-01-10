import { rgbToHex } from './color';

test('rgbToHex', () => {
    expect(rgbToHex(255, 255, 255)).toStrictEqual('ffffff');
    expect(rgbToHex(0, 0, 0)).toStrictEqual('000000');
    expect(rgbToHex(87, 34, 8)).toStrictEqual('572208');
});
