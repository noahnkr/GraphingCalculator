import Expression from '../calc/expression.js';

export let functions = [];
export let variables = [];

export let selectedFunction = -1;

const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');

let gridSize = 100;
const gridColor = '#fff';
const backgroundColor = '#333';

const increment = 0.01;
const panSensitivity = 1;

let xRange = {
    start: -((canvas.width / 2) / gridSize),
    end: ((canvas.width / 2) / gridSize)
};

let yRange = {
    start: -((canvas.height / 2) / gridSize),
    end: ((canvas.height / 2) / gridSize)
};

let xScale = canvas.width / (xRange.end - xRange.start);
let yScale = canvas.height / (yRange.end - yRange.start);

let xOffset = 0;
let yOffset = 0;

let posX = 0;
let posY = 0;
let lastX = 0;
let lastY = 0;

let isDragging = false;

let functionCache = [];

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
        updateCache(deltaX);
        render();

        lastX = coords.x;
        lastY = coords.y;
    }
});

canvas.addEventListener('wheel', event => {
    event.preventDefault();
    let zoomFactor = event.deltaY < 0 ? 0.95 : 1.05;
    xRange.start *= zoomFactor;
    xRange.end *= zoomFactor;
    yRange.start *= zoomFactor;
    yRange.end *= zoomFactor;
    gridSize *= zoomFactor;

    updateRanges(0, 0);
    clearCache();
    render(); 
});

export function render() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(posX, posY);
    drawGrid();
    //drawLabels();
    ctx.restore();
    drawFunctions();
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

    xScale = canvas.width / (xRange.end - xRange.start);
    yScale = canvas.height / (yRange.end - yRange.start);
}

function updateCache(deltaX) {
    for (let i = 0; i < functionCache.length; i++) {
        functionCache[i] = shiftAndDelete(functionCache[i], deltaX);
    }
}

export function clearCache(index) {
    functionCache[index] = [];
}

// Performs a non-circular array shift the amount given. Shifts left if the amount is negative, 
// shifts right if positive. Empty indices after shift are undefined and the length is unchanged.
function shiftAndDelete(arr, amount) {
    let newArr = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
        let newIndex = i + amount;
        if (newIndex >= 0 && newIndex < arr.length) {
            newArr[newIndex] = arr[i];
        }
    }
  return newArr;
}

function drawGrid() {
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;

    let startCoord = graphToCanvasCoordinate(xRange.start, yRange.start);
    let endCoord = graphToCanvasCoordinate(xRange.end, yRange.end);

    // Calculate the number of grid ticks for x and y axes
    let tickCountX = canvas.width / gridSize;
    let tickCountY = canvas.height / gridSize;

    // Calculate the tick increment for x and y axes based on the current zoom level
    let tickIncrementX = (xRange.end - xRange.start) / tickCountX;
    let tickIncrementY = (yRange.end - yRange.start) / tickCountY;

    // Set a threshold to reset the tick count if it goes beyond a certain limit
    const maxTickCount = 20; // Maximum number of ticks
    const minTickCount = 10; // Minimum number of ticks

    // If the tick count is greater than the maximum threshold, reset it to the maximum
    if (tickCountX > maxTickCount || tickCountY > maxTickCount) {
        tickCountX = maxTickCount;
        tickCountY = maxTickCount;
        tickIncrementX = (xRange.end - xRange.start) / tickCountX;
        tickIncrementY = (yRange.end - yRange.start) / tickCountY;
    }
    // If the tick count is less than the minimum threshold, reset it to the minimum
    else if (tickCountX < minTickCount || tickCountY < minTickCount) {
        tickCountX = minTickCount;
        tickCountY = minTickCount;
        tickIncrementX = (xRange.end - xRange.start) / tickCountX;
        tickIncrementY = (yRange.end - yRange.start) / tickCountY;
    }

    // Draw x axes
    for (let i = 0; i < tickCountX; i++) {
        let drawCoord = graphToCanvasCoordinate(xRange.start + i * tickIncrementX, 0);
        ctx.beginPath();
        ctx.moveTo(drawCoord.x, startCoord.y);
        ctx.lineTo(drawCoord.x, endCoord.y);
        ctx.stroke();
        ctx.closePath();
    }

    // Draw y axes
    for (let i = 0; i < tickCountY; i++) {
        let drawCoord = graphToCanvasCoordinate(0, yRange.start + i * tickIncrementY);
        ctx.beginPath();
        ctx.moveTo(startCoord.x, drawCoord.y);
        ctx.lineTo(endCoord.x, drawCoord.y);
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


function drawLabels() {
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

 function drawFunctions() {
    for (let i in functions) {
        // Don't draw function if the expression is empty or is a variable
        if (functions[i].expression !== '' && !/=/.test(functions[i].expression)) {
            drawFunction(i);
            if (i == selectedFunction) {
                //drawRoots(i);
                //drawIntersects(i);
            }
        }
    }
}


function drawFunction(index) { 
    try {
        ctx.strokeStyle = functions[index].color.function;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 1;

        ctx.beginPath();
        let startCoord = null
        let prevCoord = null;

        let f = Expression.makeFunction(functions[index].expression);
        let i = 0; // index of cached y value
        
        for (let x = xRange.start; x <= xRange.end; x += increment) {
                let y;
                // if value is already cached
                if (functionCache[index][i] !== undefined) {
                    y = functionCache[index][i];
                } else {
                    y = f(x, variables); // expensive calculation
                    functionCache[index][i] = y;
                }
                
                if (isFinite(y)) {
                    let coord = graphToCanvasCoordinate(x + (xOffset / xScale), y + (yOffset / yScale));

                    // Check if next coordinate is not too far away or is not a real number
                    if (prevCoord !== null && Math.abs(coord.y - prevCoord.y) < canvas.height / 2) {
                        ctx.lineTo(coord.x, coord.y);

                    // Otherwise, start a new stoke
                    } else {
                        ctx.stroke();
                        ctx.closePath();
                        ctx.beginPath();
                        ctx.moveTo(coord.x, coord.y);
                    }
                    prevCoord = coord;
                    // Save starting point for closing path
                    if (startCoord === null) {
                        startCoord = coord;
                    }
                }
            i++;
        }

        ctx.stroke();
        ctx.lineTo(startCoord.x, startCoord.y);
        ctx.closePath();

    } catch (err) {
        console.log('Error drawing function: ' + functions[index].expression);
    }
}

    
function drawRoots(index) {
    let func = functions[index];
    let f = Expression.makeFunction(func.expression);
    let color = func.color.function;
    let roots = Expression.calculateRoots(f, xRange.start, xRange.end, variables);
    
    roots.forEach(root => {
        let coord = graphToCanvasCoordinate(root + (xOffset * xScale), yOffset * yScale);
        ctx.beginPath();
		ctx.fillStyle = color;
		ctx.arc(coord.x, coord.y, 8, 0, Math.PI*2, false);
		ctx.fill();
    });
}

function drawIntersects(index) {

}

export function addFunction(expression, color) {
    functions.push({
        expression: expression,
        color: color
    });
    functionCache.push(new Array(400));
    render();
}

export function setSelectedFunction(index) {
    selectedFunction = index;
}

function canvasToGraphCoordinate(x, y) {
    let graphX = (x - (canvas.width / 2)) / xScale;
    let graphY = (y - (canvas.height / 2)) / -yScale;
    return { x: graphX, y: graphY };
}

function graphToCanvasCoordinate(x, y) {
    let coordX = (canvas.width / 2) + (x * xScale);
    let coordY = (canvas.height / 2) - (y * yScale);
    return { x: coordX, y: coordY };
}

render();