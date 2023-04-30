import MathExpression from './expression.js';

class Grapher {
    constructor(canvas) {
        this.graph = document.getElementById(canvas);
        this.width = document.getElementById('container').width;
        this.height = document.getElementById('container').height;
        this.canvasX = this.graph.offsetLeft;
        this.canvasY = this.graph.offsetTop;
        this.quality = 1;
        this.scaleFactor = 0.1;
        this.startCoord = { x1: 0, y1: 0, x2: 0, y2: 0};
        this.currCoord = { x1: -5, y1 : -5, x2: 5, y2: 5};
        this.startDrag = { x: 0, y: 0 };
        this.prevDrag = { x: 0, y: 0 };
        this.lines = [];
        this.fillPath;
    }

    initCanvas() {
        this.ctx = this.graph.getContext('2d');
        this.currCoord = { x1: -5, y1 : -5, x2: 5, y2: 5}
        this.startCoord = this.copyCoord(this.currCoord);
 
    }

    draw(equation) {
        this.initCanvas();
        this.drawGrid();
        this.drawEquation(equation);
    }

    drawGrid() {

    }

    drawEquation(equation) {
        var x1 = this.currCoord.x1;
        var y1 = this.currCoord.y1;
        var x2 = this.currCoord.x2;
        var y2 = this.currCoord.y2;

        var xRange = x2 - x1;
        var yRange = y2 - y1;

        var lineCount = 0;
        var lastPoint = 0;

        var scale = this.getScale();
        var inverseQuality = 1.0 / this.quality;
        var inverseScaleX = 1.0 / scale

        this.fillPath = []
        this.fillPath.push([0, this.heigt - ((-y1) * scale.y)])
        var xMax = this.width + inverseQuality;

        var f = MathExpression.makeFunction(equation);
        this.ctx.beginPath();
        this.ctx.strokeStyle = 'rgb(255, 0, 0)';
        this.ctx.lineWidth = 3;

        for (var x = 0; x < xMax; x += inverseQuality) {
            var xVal = x * inverseScaleX + x1;
            var yVal = f(xVal);

            var yPos = this.height - ((yVal - y1) * scale.y);
            if (yPos >= (this.height * -1) && yPos <= this.height * 2) {
                if (lineCount > 1) {
                    this.ctx.beginPath();
                }

                if (lastPoint !== false && ((lastPoint > 0 && yVal < 0) || 
                                            (lastPoint < 0 && yVal >0))) {
                
                } else {
                    this.ctx.lineTo(x, yPos);
                }

                lineCount = 0;
                lastPoint = false;
            } else if (lineCount <= 1) {
                this.ctx.lineTo(x, yPos);
                lastPoint = yVal;
                this.ctx.stroke();
                lineCount++;
            }
            this.fillPath.push([x, yPos]);
        }
        this.fillPath.push([xMax, this.height - ((-y1) * scale.y)]);
        this.ctx.stroke();
    }

    drawPath() {
        if (this.fillPath.length < 1) {
            return;
        }

        this.ctx.beginPath();

    }



    clearScreen() {
        this.ctx.fillStyle = "rgb(255,255,255)";
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    getScale() {
		return {x : (this.width / (this.startCoord.x2 - this.startCoord.x1)),
			y : (this.height / (this.startCoord.y2 - this.startCoord.y1))}
	}

    copyCoord(coord) {
        return {x1 : coord.x1, y1 : coord.y1, x2 : coord.x2, y2 : coord.y2};
    }


}

export default Grapher;


