import { canvas, ctx } from "./graph.js";
import { drawGrid, drawLabels, posX, posY, backgroundColor } from "./graph.js";
import { drawFunctions } from "./function.js";

export function render() {
    ctx.save();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.translate(posX, posY);
    drawGrid();
    drawLabels();
    ctx.restore();
    drawFunctions();
}

render();