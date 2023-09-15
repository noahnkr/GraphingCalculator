import { graphToCanvasCoordinate, canvasToGraphCoordinate } from "./util.js";
import { shiftCache, clearCache } from "./cache.js";
import { render } from "./grapher.js";
 
export const canvas = document.getElementById('graph');
export const ctx = canvas.getContext('2d');

const gridColor = '#fff';
export const backgroundColor = '#333';

let gridSize = 125;
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

    // Draw left half x axes
    for (let i = canvas.width / 2; i > startCoord.x; i -= gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, startCoord.y);
        ctx.lineTo(i, endCoord.y);
        ctx.stroke();
        ctx.closePath();
    }

    // Draw right half x axes
    for (let i = canvas.width / 2; i < endCoord.x; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, startCoord.y);
        ctx.lineTo(i, endCoord.y);
        ctx.stroke();
        ctx.closePath();
    }

    // Draw top half y axes
    for (let i = canvas.height / 2; i > endCoord.y; i -= gridSize) {
        ctx.beginPath();
        ctx.moveTo(startCoord.x, i);
        ctx.lineTo(endCoord.x, i);
        ctx.stroke();
        ctx.closePath();
    }

    // Draw bottom half y axes
    for (let i = canvas.height / 2; i < startCoord.y; i += gridSize) {
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
    ctx.moveTo(startCoord.x, canvas.height / 2);
    ctx.lineTo(endCoord.x, canvas.height / 2);
    ctx.stroke();
    ctx.closePath();

    // Draw y origin
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, startCoord.y);
    ctx.lineTo(canvas.width / 2, endCoord.y);
    ctx.stroke();
    ctx.closePath();
}


export function drawLabels() {
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 1;
    ctx.font = '24px Roboto';

    let startCoord = graphToCanvasCoordinate(xRange.start, yRange.start);
    let endCoord = graphToCanvasCoordinate(xRange.end, yRange.end);

    // x labels
    for (let i = startCoord.x - xScale; i < endCoord.x; i += xScale) {
        
        let value = canvasToGraphCoordinate((xScale - (i % xScale)) + i, 0).x;

        if (value != 0) {
            ctx.fillText(value, (xScale - (i % xScale)) + i - (xScale / 16), (canvas.height / 2) - (xScale / 8));
        } else {
            ctx.fillText(value, (xScale - (i % xScale)) + i + (xScale / 16), (canvas.height / 2) - (xScale / 8));
        }
        
    }

    // y labels
    for (let i = endCoord.y - yScale; i < startCoord.y; i += yScale) {
        let value = canvasToGraphCoordinate(0, (yScale - (i % yScale)) + i).y;
        // 0 already drawn
        if (value != 0) {
            ctx.fillText(value, canvas.width / 2 + (yScale / 16), (yScale - (i % yScale)) + i + (yScale / 16))
        }
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
    event.preventDefault();
    let zoomFactor = event.deltaY > 0 ? 0.95 : 1.05;
    xRange.start *= zoomFactor;
    xRange.end *= zoomFactor;
    yRange.start *= zoomFactor;
    yRange.end *= zoomFactor;
    gridSize *= zoomFactor;

    if (gridSize > 250) {
        gridSize = 125;
    } else if (gridSize < 125) {
        gridSize = 250;
    }

    updateRanges(0, 0);
    updateScales()
    clearCache();
    render(); 
});





