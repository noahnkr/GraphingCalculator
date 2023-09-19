import { canvas, xScale, yScale } from "./graph.js";

export function canvasToGraphCoordinate(x, y) {
    let graphX = (x - (canvas.width / 2)) / xScale;
    let graphY = (y - (canvas.height / 2)) / -yScale;
    return { x: graphX, y: graphY };
}

export function graphToCanvasCoordinate(x, y) {
    let coordX = (canvas.width / 2) + (x * xScale);
    let coordY = (canvas.height / 2) - (y * yScale);
    return { x: coordX, y: coordY };
}

// Performs a non-circular array shift the amount given. Shifts left if the amount is negative, 
// shifts right if positive. Empty indices after shift are undefined and the length is unchanged.
export function shiftAndDelete(arr, amount) {
    let newArr = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
        let newIndex = i + amount;
        if (newIndex >= 0 && newIndex < arr.length) {
            newArr[newIndex] = arr[i];
        }
    }
  return newArr;
}

export function formatDecimal(number, decimalPlaces) {
    const factor = Math.pow(10, decimalPlaces);
    return Math.round(number * factor) / factor;
}

export const functionColors = {
    red: {
        function: '#E57373',
        focus: '#FFEBEE',
    },
    magenta: {
        function: '#F06292',
        focus: '#FCE4EC',
    },
    purple: {
        function: '#BA68C8',
        focus: '#F3E5F5',
    },
    darkblue: {
        function: '#7986CB',
        focus: '#E8EAF6',
    },
    lightblue: {
        function: '#4FC3F7',
        focus: '#E1F5FE',
    },
    cyan: {
        function: '#4DD0E1',
        focus: '#E0F7FA',
    },
    teal: {
        function: '#009688',
        focus: '#E0F2F1',
    },
    green: {
        function: '#81C784',
        focus: '#E8F5E9',
    },
    yellow: {
        function: '#FFF176',
        focus: '#FFFDE7',
    },
    orange: {
        function: '#FFB74D',
        focus: '#FFF8E1',
    },
    amber: {
        function: '#FF8A65',
        focus: '#FBE9E7',
    },
    bluegrey: {
        function: '#90A4AE',
        focus: '#ECEFF1',
    }
}

