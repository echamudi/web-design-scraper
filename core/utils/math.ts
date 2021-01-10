export function sigmoid(z: number) {
    return 1 / (1 + Math.exp(-z));
}

export function scaleValue(value: number, originalRange: [number, number], targetRange: [number, number]) {
    const scale = (targetRange[1] - targetRange[0]) / (originalRange[1] - originalRange[0]);
    const capped = Math.min(originalRange[1], Math.max(originalRange[0], value)) - originalRange[0];
    return capped * scale + targetRange[0];
}
