import { functions, addFunction, drawFunctions, render } from "./grapher.js";

export function updateInputValues() {
    for (var i in functions) {
        var value = document.getElementById('function-input-' + i).value;
        functions[i].expression = value;
    }

    drawFunctions();
    render();
}

export function addInput() {
    var index = functions.length;
    addFunction('', 'red');

    var functionSymbol = document.createElement('span');
    functionSymbol.innerHTML = 'f(x)=';

    var functionInput = document.createElement('input');
    functionInput.className = 'function-input';
    functionInput.id = 'function-input-' + index;
    functionInput.value = functions[index].expression;
    functionInput.oninput = updateInputValues;

    var functionContainer = document.createElement('div');
    functionContainer.className = 'function-container';
    functionContainer.id = 'function-container-' + index;
    functionContainer.appendChild(functionSymbol);
    functionContainer.appendChild(functionInput);

    var container = document.getElementById('functions');
    container.appendChild(functionContainer);
}