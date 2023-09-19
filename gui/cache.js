import { shiftAndDelete } from "./util.js";

export const functionCache = [];

export function shiftCache(shiftAmount) {
    for (let i = 0; i < functionCache.length; i++) {
        functionCache[i] = shiftAndDelete(functionCache[i], shiftAmount);
    }
}

export function scaleCache(scaleFactor) {
    
}

export function clearCache(index) {
    functionCache[index] = [];
}
