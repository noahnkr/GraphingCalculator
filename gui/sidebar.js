import MathExpression from "../calc/expression.js";
import { functions, addFunction, drawFunctions, render } from "./grapher.js";

const functionColors = ['red', 'blue', 'lime', 'yellow', 'orange', 'purple', 'cyan'];

const addInputButton = document.getElementById('add-input-button');
addInputButton.addEventListener('click', () => { addInput() });

export function updateInputValues() {
    for (var i in functions) {
        var value = document.getElementById('function-input-' + i).value;
        functions[i].expression = value;

        if (value === '') {
            document.getElementById('function-symbol-' + i).src = '';
        } else {
            document.getElementById('function-symbol-' + i).src = '../assets/function.png';
        }

        try {
            MathExpression.evaluate(value);
        } catch(err) {
            if (value !=- '') {
                document.getElementById('function-symbol-' + i).src = '../assets/caution.png';
            }
        }
    }

    drawFunctions();
    render();
}

export function addInput() {
    var index = functions.length;
    addFunction('', functionColors[index % functionColors.length]);

    var functionContainer = document.createElement('div');
    functionContainer.className = 'function-container';
    functionContainer.id = 'function-container-' + index;

    var colorLabel = document.createElement('div');
    colorLabel.className = 'color-label';
    colorLabel.id = 'color-label-' + index;
    colorLabel.style.backgroundColor = functionColors[index % functionColors.length];

    var functionSymbol = document.createElement('img');
    functionSymbol.className = 'function-symbol';
    functionSymbol.id = 'function-symbol-' + index;
    functionSymbol.src = '';

    var functionLabel = document.createElement('div');
    functionLabel.className = 'function-label';
    functionLabel.onclick = () => {

    }
    functionLabel.appendChild(functionSymbol);

    var functionInput = document.createElement('input');
    functionInput.className = 'function-input';
    functionInput.id = 'function-input-' + index;
    functionInput.value = functions[index].expression;
    functionInput.oninput = updateInputValues;
    
    functionContainer.appendChild(colorLabel);
    functionContainer.appendChild(functionLabel);
    functionContainer.appendChild(functionInput);

    var container = document.getElementById('functions');
    container.appendChild(functionContainer);
}

