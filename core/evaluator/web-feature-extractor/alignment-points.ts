import { ElementPosition } from 'Core/types/types';
import { AlignmentPointsExtractResult, BrowserInfoExtractResult } from 'Core/types/feature-extractor';

export function alignmentPointsExtract(elementPositions: ElementPosition[], browserInfo: BrowserInfoExtractResult): AlignmentPointsExtractResult {
    const mapX: Record<number, number> = {};
    const mapY: Record<number, number> = {};

    const {
        viewportHeight: vh, viewportWidth: vw, pageXOffset, pageYOffset,
    } = browserInfo;

    elementPositions.forEach((elPos) => {
        // Skip if elPos is outside the viewport
        if (elPos.x > (pageXOffset + vw)) return;
        if (elPos.y > (pageYOffset + vh)) return;
        if (elPos.x + elPos.w < pageXOffset) return;
        if (elPos.y + elPos.h < pageYOffset) return;

        const area = elPos.w * elPos.h;

        // Left Border
        if (mapX[elPos.x] === undefined) {
            mapX[elPos.x] = area;
        } else {
            mapX[elPos.x] += area;
        }

        // Right Border
        if (mapX[elPos.x + elPos.w] === undefined) {
            mapX[elPos.x + elPos.w] = area;
        } else {
            mapX[elPos.x + elPos.w] += area;
        }

        // Top Border
        if (mapY[elPos.y] === undefined) {
            mapY[elPos.y] = area;
        } else {
            mapY[elPos.y] += area;
        }

        // Bottom Border
        if (mapY[elPos.y + elPos.h] === undefined) {
            mapY[elPos.y + elPos.h] = area;
        } else {
            mapY[elPos.y + elPos.h] += area;
        }
    });

    const totalXAlignmentPoints = Object.keys(mapX).length;
    const totalYAlignmentPoints = Object.keys(mapY).length;
    const totalAlignmentPoints = totalXAlignmentPoints + totalYAlignmentPoints;

    return {
        xAlignmentPoints: mapX,
        yAlignmentPoints: mapY,
        totalXAlignmentPoints,
        totalYAlignmentPoints,
        totalAlignmentPoints,
    };
}
