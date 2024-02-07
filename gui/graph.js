import { graphToCanvasCoordinate, canvasToGraphCoordinate, formatDecimal } from "./util.js";
import { shiftCache, clearCache } from "./cache.js";
import { render } from "./grapher.js";
 
export const canvas = document.getElementById('graph');
export const ctx = canvas.getContext('2d');

const gridColor = '#fff';
export const backgroundColor = '#333';

let gridSize = 100;
let tickIncrement = 1;
const panSensitivity = 1;

export let xRange = {
    start: -((canvas.width / 2) / gridSize),
    end: ((canvas.width / 2) / gridSize)
};

export let yRange = {
    start: -((canvas.height / 2) / gridSize),
    end: ((canvas.height / 2) / gridSize)
};

export let xScale = canvas.width / (xRange.end - xRange.start);
export let yScale = canvas.height / (yRange.end - yRange.start);

export let xOffset = 0;
export let yOffset = 0;

export let posX = 0;
export let posY = 0;

let lastX = 0;
let lastY = 0;

let isDragging = false;

export function drawGrid() {
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;

    let startCoord = graphToCanvasCoordinate(xRange.start, yRange.start);
    let endCoord = graphToCanvasCoordinate(xRange.end, yRange.end);
    let originCoord = graphToCanvasCoordinate(0, 0);

    // Draw left half x axes
    for (let i = originCoord.x; i > startCoord.x; i -= gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, startCoord.y);
        ctx.lineTo(i, endCoord.y);
        ctx.stroke();
        ctx.closePath();
    }

    // Draw right half x axes
    for (let i = originCoord.x; i < endCoord.x; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, startCoord.y);
        ctx.lineTo(i, endCoord.y);
        ctx.stroke();
        ctx.closePath();
    }

    // Draw top half y axes
    for (let i = originCoord.y; i > endCoord.y; i -= gridSize) {
        ctx.beginPath();
        ctx.moveTo(startCoord.x, i);
        ctx.lineTo(endCoord.x, i);
        ctx.stroke();
        ctx.closePath();
    }

    // Draw bottom half y axes
    for (let i = originCoord.y; i < startCoord.y; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(startCoord.x, i);
        ctx.lineTo(endCoord.x, i);
        ctx.stroke();
        ctx.closePath();
    }

    ctx.lineWidth = 3;
    ctx.globalAlpha = 1;

    // Draw x origin
    ctx.beginPath();
    ctx.moveTo(startCoord.x, originCoord.y);
    ctx.lineTo(endCoord.x, originCoord.y);
    ctx.stroke();
    ctx.closePath();

    // Draw y origin
    ctx.beginPath();
    ctx.moveTo(originCoord.x, startCoord.y);
    ctx.lineTo(originCoord.x, endCoord.y);
    ctx.stroke();
    ctx.closePath();
}



export function drawLabels() {
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 1;
    ctx.font = '24px Roboto';

    let startCoord = graphToCanvasCoordinate(xRange.start, yRange.start);
    let endCoord = graphToCanvasCoordinate(xRange.end, yRange.end);
    let originCoord = graphToCanvasCoordinate(0, 0);

    // Draw left half x labels
    for (let i = originCoord.x; i > startCoord.x; i -= gridSize) {
        if (i == originCoord.x) {
            ctx.fillText('0', originCoord.x - 22, originCoord.y + 25);
            continue;
        }

        let tickIndex = (originCoord.x - i) / gridSize;
        let value = formatDecimal(-(tickIndex * tickIncrement), 5);
        let valueLength = `${value}`.length;
        ctx.fillText(value, i - (valueLength * 6), originCoord.y + 25)
    }

    // Draw right half x labels
    for (let i = originCoord.x; i < endCoord.x; i += gridSize) {
        if (i == originCoord.x) {
            continue;
        }

        let tickIndex = (i - originCoord.x) / gridSize;
        let value = formatDecimal(tickIndex * tickIncrement, 5);
        let valueLength = `${value}`.length;
        ctx.fillText(value, i - (valueLength * 6), originCoord.y + 25)
    }

    // Draw top half y labels
    for (let i = originCoord.y; i > endCoord.y; i -= gridSize) {
        if (i == originCoord.y) {
            continue;
        }

        let tickIndex = (originCoord.y - i) / gridSize;
        let value = formatDecimal(tickIndex * tickIncrement, 5);
        let valueLength = `${value}`.length;
        ctx.fillText(value, originCoord.x - 12 - (valueLength * 12),  i + 10)
    }

    // Draw bottom half y labels
    for (let i = originCoord.y; i < startCoord.y; i += gridSize) {
        if (i == originCoord.y) {
            continue;
        }

        let tickIndex = (i - originCoord.y) / gridSize;
        let value = formatDecimal(-(tickIndex * tickIncrement), 5);
        let valueLength = `${value}`.length;
        ctx.fillText(value, originCoord.x - 10 - (valueLength * 10),  i + 10)
    }

    
}

function updateRanges(deltaX, deltaY) {
    let canvasStartRange = graphToCanvasCoordinate(xRange.start, yRange.start);
    let canvasEndRange = graphToCanvasCoordinate(xRange.end, yRange.end);

    canvasStartRange.x -= deltaX;
    canvasEndRange.x -= deltaX;

    canvasStartRange.y += deltaY;
    canvasEndRange.y += deltaY;

    xOffset += deltaX;
    yOffset += deltaY;

    let newStartRange = canvasToGraphCoordinate(canvasStartRange.x, canvasStartRange.y);
    let newEndRange = canvasToGraphCoordinate(canvasEndRange.x, canvasEndRange.y);

    xRange.start = newStartRange.x;
    xRange.end = newEndRange.x;
    yRange.start = newStartRange.y;
    yRange.end = newEndRange.y;
}

function updateScales() {
    xScale = canvas.width / (xRange.end - xRange.start);
    yScale = canvas.height / (yRange.end - yRange.start);
}

canvas.addEventListener('mousedown', (event) => {
    isDragging = true;
    let coords = canvasToGraphCoordinate(event.clientX, event.clientY)
    lastX = coords.x;
    lastY = coords.y;
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mouseleave', () => {
    isDragging = false
});

canvas.addEventListener('mousemove', event => {
    if (isDragging) {
        let coords = canvasToGraphCoordinate(event.clientX, event.clientY);
        let deltaX = Math.round((coords.x - lastX) * panSensitivity * xScale);
        let deltaY = Math.round((coords.y - lastY) * panSensitivity * yScale);

        posX += deltaX;
        posY -= deltaY;

        updateRanges(deltaX, deltaY);
        updateScales()
        shiftCache(deltaX);
        render();

        lastX = coords.x;
        lastY = coords.y;
    }
});

canvas.addEventListener('wheel', event => {
    /*
    
    TODO: Need to fix functions moving on zoom

    event.preventDefault();
    let zoomFactor = event.deltaY > 0 ? 0.95 : 1.05;
    console.log(event.clientX, event.clientY);

    xRange.start *= zoomFactor;
    xRange.end *= zoomFactor;
    yRange.start *= zoomFactor;
    yRange.end *= zoomFactor;
    gridSize *= zoomFactor;

    // zoom in
    if (gridSize > 200) {
        gridSize = 100;
        if (tickIncrement > 1) {
            tickIncrement /= tickIncrement % 2 == 0 ? 2 : 2.5;
        } else {
            tickIncrement /= 2 % tickIncrement == 0 ? 2 : 2.5;
        }

    // zoom out
    } else if (gridSize < 100) {
        gridSize = 200;
        if (tickIncrement > 1) {
            tickIncrement *= tickIncrement % 2 == 0 ? 2.5 : 2;
        } else {
            tickIncrement *= 2 % tickIncrement == 0 ? 2 : 2.5;
        }
    }
    
    updateScales()
    render(); */
});





