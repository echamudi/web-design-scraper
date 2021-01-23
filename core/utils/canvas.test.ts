import { plotter } from './canvas';

test('plotter produces correct distribution sizes', () => {
    const canvas1 = document.createElement('canvas');

    const { distribution: d1 } = plotter(canvas1, [], {
        pageWidth: 1024,
        pageHeight: 1024,
        tileSize: 256,
    });

    expect(d1).toStrictEqual([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ]);

    const canvas2 = document.createElement('canvas');
    const { distribution: d2 } = plotter(canvas2, [], {
        pageWidth: 505,
        pageHeight: 1009,
        tileSize: 10,
    });

    const canvas2cols = d2?.[0]?.length;
    const canvas2rows = d2?.length;

    expect(canvas2cols).toStrictEqual(50);
    expect(canvas2rows).toStrictEqual(100);
});

test('plotter produces correct percentages', () => {
    const canvas1 = document.createElement('canvas');
    const components = [
        {
            x: 0, y: 0, w: 200, h: 50,
        },
        {
            x: 250, y: 25, w: 100, h: 50,
        },
        {
            x: 40, y: 115, w: 20, h: 20,
        },
        {
            x: 0, y: 200, w: 200, h: 200,
        },
    ];

    const { distribution: d1 } = plotter(canvas1, components, {
        pageWidth: 400,
        pageHeight: 400,
        tileSize: 100,
    });

    expect(d1).toStrictEqual([
        [0.5, 0.5, 0.25, 0.25],
        [0.04, 0, 0, 0],
        [1, 1, 0, 0],
        [1, 1, 0, 0],
    ]);
});

test('plotter with shifting', () => {
    const canvas1 = document.createElement('canvas');
    const components = [
        {
            x: 0, y: 0, w: 150, h: 25,
        },
        {
            x: 0, y: 125, w: 150, h: 25,
        },
        {
            x: 0, y: 0, w: 25, h: 150,
        },
        {
            x: 125, y: 0, w: 25, h: 150,
        },
    ];

    const { distribution: d1 } = plotter(canvas1, components, {
        pageWidth: 150,
        pageHeight: 150,
        tileSize: 100,
    });

    expect(d1).toStrictEqual([[0]]);

    const canvas2 = document.createElement('canvas');
    const { distribution: d2 } = plotter(canvas2, components, {
        pageWidth: 150,
        pageHeight: 150,
        tileSize: 50,
    });

    expect(d2).toStrictEqual([[0.75, 0.5, 0.75], [0.5, 0, 0.5], [0.75, 0.5, 0.75]]);
});
