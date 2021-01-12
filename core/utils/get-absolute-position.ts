import { ElementPosition } from "Core/types/types";

export function getPositionInPage(win: Window, bound: DOMRect): ElementPosition {
    return {
        x: Math.floor(bound.x + win.scrollX),
        y: Math.floor(bound.y + win.scrollY),
        w: Math.floor(bound.width),
        h: Math.floor(bound.height)
    };
}

export function getPositionInViewport(win: Window, bound: DOMRect): ElementPosition {
    return {
        x: Math.floor(bound.x),
        y: Math.floor(bound.y),
        w: Math.floor(bound.width),
        h: Math.floor(bound.height)
    };
}
