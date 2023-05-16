import { functions, addFunction, drawFunctions, render } from "./grapher.js";

const functionColors = ['red', 'blue', 'lime', 'yellow', 'orange', 'purple', 'cyan'];

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
    addFunction('', functionColors[index % functionColors.length]);

    var functionContainer = document.createElement('div');
    functionContainer.className = 'function-container';
    functionContainer.id = 'function-container-' + index;

    var colorLabel = document.createElement('div');
    colorLabel.className = 'color-label';
    colorLabel.id = 'color-label-' + index;
    colorLabel.style.backgroundColor = functionColors[index % functionColors.length];

    var functionSymbol = document.createElement('span');
    functionSymbol.className = 'material-symbols-outlined function-symbol';
    functionSymbol.innerHTML = 'function';
    functionSymbol.style.fontSize = '50px';

    var functionLabel = document.createElement('div');
    functionLabel.className = 'function-label';
    functionLabel.onclick = () => {
        functionLabel.style.backgroundColor = '#999';
        functionSymbol.style.color = '#444';
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

