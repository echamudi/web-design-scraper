export function sigmoid(z: number) {
    return 1 / (1 + Math.exp(-z));
}

export function scaleValue(value: number, originalRange: [number, number], targetRange: [number, number]) {
    const scale = (targetRange[1] - targetRange[0]) / (originalRange[1] - originalRange[0]);
    const capped = Math.min(originalRange[1], Math.max(originalRange[0], value)) - originalRange[0];
    return capped * scale + targetRange[0];
}

export function utilArrayToChartData(theArray: number[]): { primary: string, secondary: number }[] {
    if (theArray === undefined) {
        return [];
    }

    let result: { primary: string, secondary: number }[] = [];
    const record: Record<string, number> = {};
    theArray.forEach((el) => {
        if (record[el] === undefined) record[el] = 0;
        record[el] += 1;
    });
    Object.keys(record).forEach((key) => {
        result.push({
            primary: key,
            secondary: record[key]
        });
    });
    result = result.sort((a, b) => {
        if (Number(a.primary) < Number(b.primary)) { return -1; }
        else { return 1; }
    });
    return result;
}
