import MathExpression from "./expression.js";

class Grapher {

    /*
        Settings:
        - width
        - height
        - gridSize
        - gridColor
        - backgroundColor
        - showGrid (true/false)
        - scale

    */ 
    constructor(settings) {
        settings = settings || {};

        this.canvas = document.getElementById('graph');
        this.ctx = this.canvas.getContext('2d');

        this.canvas.width = settings.width || 1000;
        this.canvas.height = settings.height || 1000;

        this.gridSize = settings.gridSize || 50;

        this.gridColor = settings.gridColor || '#000';
        this.backgroundColor = settings.backGroundColor || '#fff';
        if (settings.showGrid === false) {
            this.showGrid = false;
        } else {
            this.showGrid = true;
        }
        
        this.xRange = {
            min: -((this.canvas.width / 2) / this.gridSize),
            max: ((this.canvas.width / 2) / this.gridSize)
        };


        this.yRange = {
            min: -((this.canvas.height / 2) / this.gridSize),
            max: ((this.canvas.height / 2) / this.gridSize)
        };

        this.xScale = this.canvas.width / (this.xRange.max - this.xRange.min);
        this.yScale = this.canvas.height / (this.yRange.max - this.yRange.min);

        this.increment = 0.02;

        this.functions = [];

        this.render();
    }

    render() {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.showGrid) {
            this.drawGrid();
            this.drawLabels();
        }

        this.drawFunctions();
    }

    drawGrid() {

        this.ctx.strokeStyle = this.gridColor;

        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 0.5;

        // draw x axes
        for (var i = 0; i < this.canvas.width; i += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        // draw y axes
        for (var i = 0; i < this.canvas.height; i += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.canvas.width, i);
            this.ctx.stroke();
            this.ctx.closePath();
        }

        this.ctx.lineWidth = 3;
        this.ctx.globalAlpha = 1;

        // draw x origin
        this.ctx.beginPath();
        this.ctx.moveTo(this.canvas.width / 2, 0);
        this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
        this.ctx.stroke();
        this.ctx.closePath();

        // draw y origin
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.canvas.height / 2);
        this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
        this.ctx.stroke();
        this.ctx.closePath();
    }

    drawLabels() {
        this.ctx.fillStyle = '#fff';
        this.ctx.globalAlpha = 0.5;
        this.ctx.font = '24px Roboto';

        // x labels
        for (var i = 0; i <= this.canvas.width; i += this.gridSize) {
            var value = (i - (this.canvas.width / 2)) / this.gridSize;
            this.ctx.fillText(value, i + (this.gridSize / 16) , this.canvas.height / 2 - (this.gridSize / 8));
        }

        // y labels
        for (var i = this.canvas.height; i >= 0; i -= this.gridSize) {
            var value = -(i - (this.canvas.height / 2)) / this.gridSize;
            // origin label already drawn
            if (value != 0) {
                this.ctx.fillText(value, this.canvas.width / 2 + (this.gridSize / 16), i - (this.gridSize / 8))
            }
        }
    }


    drawFunctions() {
        for (var i in this.functions) {
            this.drawFunction(i);
        }
    }

    drawFunction(index) {
        var f = this.functions[index].func;
        this.ctx.strokeStyle = this.functions[index].color;
        this.ctx.lineWidth = 1;
        this.ctx.globalAlpha = 1;

        this.ctx.beginPath();
        this.ctx.moveTo(0, (f(this.xRange.min) - this.yRange.min) * this.yScale);

        for (var x = this.xRange.min; x <= this.xRange.max; x += this.increment) {
            var y = f(x);
            this.ctx.lineTo((x - this.xRange.min) * this.xScale, this.canvas.height - ((y - this.yRange.min) * this.yScale));
        }

        this.ctx.stroke();
        this.ctx.closePath();
    }

    addFunction(f, color) {
        this.functions.push({
            func: f,
            color: color
        });

        this.render();
    }

}

var settings = {
    width: 2200,
    height: 1400,
    gridSize: 100,
    showGrid: true,
    gridColor: '#fff',
    backGroundColor: '#343434'
}


var g = new Grapher(settings);

g.addFunction(MathExpression.makeFunction('x^2'), 'red');
g.addFunction(MathExpression.makeFunction('0'), 'blue');



