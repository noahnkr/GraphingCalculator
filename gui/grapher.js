import MathExpression from "../calc/expression.js";

export var functions = [];

const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');

const functionCanvas = document.createElement('canvas');
functionCanvas.width = canvas.width;
functionCanvas.height = canvas.height;

const functionCtx = functionCanvas.getContext('2d');

const gridSize = 100;
const gridColor = '#fff';
const backgroundColor = '#333';

const increment = 0.02;
const panSensitivity = 1;

var xRange = {
    start: -((canvas.width / 2) / gridSize),
    end: ((canvas.width / 2) / gridSize)
};


var yRange = {
    start: -((canvas.height / 2) / gridSize),
    end: ((canvas.height / 2) / gridSize)
};

var xScale = canvas.width / (xRange.end - xRange.start);
var yScale = canvas.height / (yRange.end - yRange.start);

var posX = 0;
var posY = -(canvas.width / 8);
var lastX = 0;
var lastY = 0;

var isDragging = false;

canvas.addEventListener('mousedown', (event) => {
    isDragging = true;
    var coords = canvasToGraphCoordinates(event.clientX, event.clientY)
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
        var coords = canvasToGraphCoordinates(event.clientX, event.clientY);
        var deltaX = (coords.x - lastX) * panSensitivity * gridSize;
        var deltaY = (coords.y - lastY) * panSensitivity * gridSize;

        posX += deltaX;
        posY -= deltaY;

        render();

        lastX = coords.x;
        lastY = coords.y;
    }
});

canvas.addEventListener('wheel', event => {
  
});

function canvasToGraphCoordinates(x, y) {
    var graphX = ((x / xScale) - xRange.start);
    var graphY = ((canvas.height - y) / yScale) + yRange.start;
    return { x: graphX, y: graphY };
}

export function render() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(posX, posY);
    drawGrid();
    drawLabels();
    ctx.drawImage(functionCanvas, 0, 0);
    ctx.restore();
}

function drawGrid() {
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;

    // draw x axes
    for (var i = 0; i <= canvas.width; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
        ctx.closePath();
    }

    // draw y axes
    for (var i = 0; i <= canvas.height; i += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
        ctx.closePath();
    }

    ctx.lineWidth = 3;
    ctx.globalAlpha = 1;

    // draw x origin
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.closePath();

    // draw y origin
    ctx.beginPath();
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.closePath();
}

function drawLabels() {
    ctx.fillStyle = '#fff';
    ctx.globalAlpha = 1;
    ctx.font = '24px Roboto';

    // x labels
    for (var i = 0; i <= canvas.width; i += gridSize) {
        var value = xRange.start + (i / gridSize);
        if (value != 0) {
            ctx.fillText(value, i - (gridSize / 16), canvas.height / 2 - (gridSize / 8));
        } else {
            ctx.fillText(value, i + (gridSize / 16), canvas.height / 2 - (gridSize / 8));
        }
        
    }

    // y labels
    for (var i = canvas.height; i >= 0; i -= gridSize) {
        var value = yRange.end - (i / gridSize);
        // origin label already drawn
        if (value != 0) {
            ctx.fillText(value, canvas.width / 2 + (gridSize / 16), i + (gridSize / 16))
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
    functionCtx.moveTo(0, (canvas.height - (f(xRange.start) - yRange.start) * yScale));

    for (var x = xRange.start; x <= xRange.end; x += increment) {
        var y = f(x);
        functionCtx.lineTo((x - xRange.start) * xScale, canvas.height - ((y - yRange.start) * yScale));
    }

    functionCtx.stroke();
    functionCtx.closePath();
}

export function addFunction(expression, color) {
    functions.push({
        expression: expression,
        color: color
    });

    render();
}


  


