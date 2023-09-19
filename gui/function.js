import Expression from '../calc/expression.js';
import { canvas, ctx } from './graph.js';
import { xRange, xScale, yScale, xOffset, yOffset } from './graph.js';
import { graphToCanvasCoordinate } from './util.js';
import { functionCache } from './cache.js';
import { selectedFunction } from './sidebar.js';
import { render } from './grapher.js';

export let functions = [];
export let variables = [];
const increment = 0.01;

export function drawFunctions() {
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