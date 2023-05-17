import MathExpression from "../calc/expression.js";

export var functions = [];

const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');

const functionCanvas = document.createElement('canvas');

// Give buffer for function to be hidden and will only redraw once panned far enough
functionCanvas.width = canvas.width * 2;
functionCanvas.height = canvas.height * 2;

const functionCtx = functionCanvas.getContext('2d');

const gridSize = 100;
const gridColor = '#fff';
const backgroundColor = '#333';

const increment = 0.1;
const panSensitivity = 1;

var xRange = {
    start: -((canvas.width / 2) / gridSize),
    end: ((canvas.width / 2) / gridSize)
};

var yRange = {
    start: -((canvas.height / 2) / gridSize),
    end: ((canvas.height / 2) / gridSize)
};

var function_xRange = {
    start: -((functionCanvas.width / 2) / gridSize),
    end: ((functionCanvas.width / 2) / gridSize)
}

var function_yRange = {
    start: -((functionCanvas.height / 2) / gridSize),
    end: ((functionCanvas.height / 2) / gridSize)
}

var function_xOffset = 0;
var function_yOffset = 0;


var zoomScale = 1;
var xScale = canvas.width / (xRange.end - xRange.start) * zoomScale;
var yScale = canvas.height / (yRange.end - yRange.start) * zoomScale;


var posX = 0;
var posY = 0;
var lastX = 0;
var lastY = 0;

var isDragging = false;

canvas.addEventListener('mousedown', (event) => {
    isDragging = true;
    var coords = canvasToGraphCoordinate(event.clientX, event.clientY)
    lastX = coords.x;
    lastY = coords.y;
});

canvas.addEventListener('mouseup', () => {
    isDragging = false;
});

canvas.addEventListener('mouseleave',() => {
    isDragging = false
});

canvas.addEventListener('mousemove', event => {
    if (isDragging) {
        var coords = canvasToGraphCoordinate(event.clientX, event.clientY);
        var deltaX = (coords.x - lastX) * panSensitivity * gridSize;
        var deltaY = (coords.y - lastY) * panSensitivity * gridSize;

        posX += deltaX;
        posY -= deltaY;

        
        
        updateRanges(deltaX, deltaY);
        render();

        lastX = coords.x;
        lastY = coords.y;
    }
});

canvas.addEventListener('wheel', event => {
    event.preventDefault();

    var rect = canvas.getBoundingClientRect();
    var mouseX = event.clientX - rect.left;
    var mouseY = event.clientY - rect.top;

    var zoomFactor = event.deltaY > 0 ? 0.95 : 1.05;
    zoomScale *= zoomFactor;

    posX = (posX - mouseX) * zoomFactor + mouseX;
    posY = (posY - mouseY) * zoomFactor + mouseY;
    render(); 
  
});

export function render() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(posX, posY);
    ctx.scale(zoomScale, zoomScale);
    drawGrid();
    drawLabels();
    ctx.drawImage(functionCanvas, -(canvas.width / 2) - function_xOffset, -(canvas.height / 2) - function_yOffset);
    ctx.restore();
}


function updateRanges(deltaX, deltaY) {
    var canvasStartRange = graphToCanvasCoordinate(xRange.start, yRange.start);
    var canvasEndRange = graphToCanvasCoordinate(xRange.end, yRange.end);

    canvasStartRange.x -= deltaX;
    canvasEndRange.x -= deltaX;

    canvasStartRange.y += deltaY;
    canvasEndRange.y += deltaY;

    var newStartRange = canvasToGraphCoordinate(canvasStartRange.x, canvasStartRange.y);
    var newEndRange = canvasToGraphCoordinate(canvasEndRange.x, canvasEndRange.y);

    xRange.start = newStartRange.x;
    xRange.end = newEndRange.x;
    yRange.start = newStartRange.y;
    yRange.end = newEndRange.y;

    if (xRange.start <= function_xRange.start) {
        function_xRange.start -= (xScale / 10);
        function_xRange.end -= (xScale / 10);
        function_xOffset += functionCanvas.width / 4;
        drawFunctions();
    } else if (xRange.end >=  function_xRange.end) {
        function_xRange.start += (xScale / 10);
        function_xRange.end += (xScale / 10);
        function_xOffset -= functionCanvas.width / 4;
        drawFunctions();
    }

    if (yRange.start <= function_yRange.start) {
        function_yRange.start -= (yScale / 10);
        function_yRange.end -= (yScale / 10);
        function_yOffset -= functionCanvas.height / 4;
        drawFunctions();
    } else if (yRange.end >= function_yRange.end) {
        function_yRange.start += (yScale / 10);
        function_yRange.end += (yScale / 10);
        function_yOffset += functionCanvas.height / 4;
        drawFunctions();
    }
}

function drawGrid() {
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;

    var startDraw = graphToCanvasCoordinate(xRange.start, yRange.start);
    var endDraw = graphToCanvasCoordinate(xRange.end, yRange.end);


    // draw x axes
    for (var i = startDraw.x - xScale; i < endDraw.x; i += xScale) {
        ctx.beginPath();
        ctx.moveTo((xScale - (i % xScale)) + i, startDraw.y);
        ctx.lineTo((xScale - (i % xScale)) + i, endDraw.y);
        ctx.stroke();
        ctx.closePath();
    }

    // draw y axes
    for (var i = endDraw.y - xScale; i < startDraw.y; i += yScale) {
        ctx.beginPath();
        ctx.moveTo(startDraw.x, (yScale - (i % yScale)) + i);
        ctx.lineTo(endDraw.x, (yScale - (i % yScale)) + i);
        ctx.stroke();
        ctx.closePath();
    }

    ctx.lineWidth = 3;
    ctx.globalAlpha = 1;

    // draw x origin
    ctx.beginPath();
    ctx.moveTo(startDraw.x, canvas.height / 2);
    ctx.lineTo(endDraw.x, canvas.height / 2);
    ctx.stroke();
    ctx.closePath();

    // draw y origin
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, endDraw.y);
    ctx.lineTo(canvas.width / 2, startDraw.y);
    ctx.stroke();
    ctx.closePath();
}

function drawLabels() {
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 1;
    ctx.font = '24px Roboto';

    var startDraw = graphToCanvasCoordinate(xRange.start, yRange.start);
    var endDraw = graphToCanvasCoordinate(xRange.end, yRange.end);

    // x labels
    for (var i = startDraw.x - xScale; i < endDraw.x; i += xScale) {
        
        var value = canvasToGraphCoordinate((xScale - (i % xScale)) + i, 0).x;

        if (value != 0) {
            ctx.fillText(value, (xScale - (i % xScale)) + i - (gridSize / 16), (canvas.height / 2) - (gridSize / 8));
        } else {
            ctx.fillText(value, (xScale - (i % xScale)) + i + (gridSize / 16), (canvas.height / 2) - (gridSize / 8));
        }
        
    }

    // y labels
    for (var i = endDraw.y - yScale; i < startDraw.y; i += yScale) {
        var value = canvasToGraphCoordinate(0, (yScale - (i % yScale)) + i).y;
        // 0 already drawn
        if (value != 0) {
            ctx.fillText(value, canvas.width / 2 + (gridSize / 16), (yScale - (i % yScale)) + i + (gridSize / 16))
        }
    }
}

export function drawFunctions() {
    functionCtx.clearRect(0, 0, functionCanvas.width, functionCanvas.height);
    for (var i in functions) {
        if (functions[i].expression !== '') {
            drawFunction(i);
        }
    }
}

function drawFunction(index) {
    var f = MathExpression.makeFunction(functions[index].expression);
    functionCtx.strokeStyle = functions[index].color;
    functionCtx.lineWidth = 3;
    functionCtx.globalAlpha = 1;

    functionCtx.beginPath();
    var startCoord = null
    var prevCoord = null;

    try {
        for (var x = function_xRange.start; x < function_xRange.end; x += increment) {
                var y = f(x);
                var coord = graphToFunctionCanvasCoordinate(x, y);

                if (prevCoord !== null && Math.abs(coord.y - prevCoord.y) < functionCanvas.height / 2) {
                    functionCtx.lineTo(coord.x, coord.y);
                } else {
                    functionCtx.moveTo(coord.x, coord.y);
                }

                prevCoord = coord;
                
                // Save starting point for closing path
                if (startCoord === null) {
                    startCoord = coord;
                }
        }
    
        functionCtx.stroke();
        functionCtx.lineTo(startCoord.x, startCoord.y);
        functionCtx.closePath();
        
    } catch (err) {
        console.log('Error drawing function: ' + functions[index].expression)
    }
    
  }

export function addFunction(expression, color) {
    functions.push({
        expression: expression,
        color: color
    });

    render();
}

function canvasToGraphCoordinate(x, y) {
    var graphX = (x - (canvas.width / 2)) / xScale;
    var graphY = (y - (canvas.height / 2)) / -yScale;
    return { x: graphX, y: graphY };
}

function graphToCanvasCoordinate(x, y) {
    var coordX = (canvas.width / 2) + (x * xScale);
    var coordY = (canvas.height / 2) - (y * yScale);
    return { x: coordX, y: coordY };
}

function graphToFunctionCanvasCoordinate(x, y) {
    var coordX = (functionCanvas.width / 2) + (x * xScale) + function_xOffset;
    var coordY = (functionCanvas.height / 2) - (y * yScale) + function_yOffset;
    return { x: coordX, y: coordY };
}

render();



  


