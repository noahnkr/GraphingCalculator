import MathExpression from "../calc/expression.js";
import { functions, addFunction, drawFunctions, render } from "./grapher.js";

const functionColors = {
    red: {
        function: '#E57373',
        focus: '#FFEBEE',
        src: '../assets/functions/red.png'
    },
    magenta: {
        function: '#F06292',
        focus: '#FCE4EC',
        src: '../assets/functions/magenta.png'
        
    },
    purple: {
        function: '#BA68C8',
        focus: '#F3E5F5',
        src: '../assets/functions/purple.png'
    },
    darkblue: {
        function: '#7986CB',
        focus: '#E8EAF6',
        src: '../assets/functions/darkblue.png'
    },
    lightblue: {
        function: '#4FC3F7',
        focus: '#E1F5FE',
        src: '../assets/functions/lightblue.png'
    },
    cyan: {
        function: '#4DD0E1',
        focus: '#E0F7FA',
        src: '../assets/functions/cyan.png'
    },
    teal: {
        function: '#009688',
        focus: '#E0F2F1',
        src: '../assets/functions/teal.png'
    },
    green: {
        function: '#81C784',
        focus: '#E8F5E9',
        src: '../assets/functions/green.png'
    },
    yellow: {
        function: '#FFF176',
        focus: '#FFFDE7',
        src: '../assets/functions/yellow.png'
    },
    orange: {
        function: '#FFB74D',
        focus: '#FFF8E1',
        src: '../assets/functions/orange.png'
    },
    amber: {
        function: '#FF8A65',
        focus: '#FBE9E7',
        src: '../assets/functions/amber.png'
    },
    bluegrey: {
        function: '#90A4AE',
        focus: '#ECEFF1',
        src: '../assets/functions/bluegrey.png'
    }
}

const addInputButton = document.getElementById('add-input-button');
addInputButton.addEventListener('click', () => { addInput() });

export function updateInputValues() {
    for (var i in functions) {
        var value = document.getElementById('function-input-' + i).value;
        functions[i].expression = value;

        if (value === '') {
            document.getElementById('function-symbol-' + i).src = '';
        } else {
            document.getElementById('function-symbol-' + i).src = functions[i].color.src;
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
    const index = functions.length;

    var values = Object.values(functionColors);
    var rand = Math.floor(Math.random() * values.length);
    const color = values[rand];

    addFunction('', color);

    var functionContainer = document.createElement('div');
    functionContainer.className = 'function-container';
    functionContainer.id = 'function-container-' + index;

    var functionSymbol = document.createElement('img');
    functionSymbol.className = 'function-symbol';
    functionSymbol.id = 'function-symbol-' + index;
    functionSymbol.src = '';

    var functionLabel = document.createElement('div');
    functionLabel.className = 'function-label';
    functionLabel.appendChild(functionSymbol);

    var functionInput = document.createElement('input');
    functionInput.className = 'function-input';
    functionInput.id = 'function-input-' + index;
    functionInput.value = functions[index].expression;
    functionInput.oninput = updateInputValues;

    functionInput.addEventListener('focus', () => {
        functionContainer.style.backgroundColor = color.focus;
    });
    functionInput.addEventListener('blur', () => {
        functionContainer.style.backgroundColor =  '#ddd';
    })

    
    functionContainer.appendChild(functionLabel);
    functionContainer.appendChild(functionInput);

    var container = document.getElementById('functions');
    container.appendChild(functionContainer);
}

