import Expression from "../calc/expression.js";
import { functions, variables, addFunction, drawFunctions, render, xRange } from "./grapher.js";

const functionColors = {
    red: {
        function: '#E57373',
        focus: '#FFEBEE',
    },
    magenta: {
        function: '#F06292',
        focus: '#FCE4EC',
        
    },
    purple: {
        function: '#BA68C8',
        focus: '#F3E5F5',
    },
    darkblue: {
        function: '#7986CB',
        focus: '#E8EAF6',
    },
    lightblue: {
        function: '#4FC3F7',
        focus: '#E1F5FE',
    },
    cyan: {
        function: '#4DD0E1',
        focus: '#E0F7FA',
    },
    teal: {
        function: '#009688',
        focus: '#E0F2F1',
    },
    green: {
        function: '#81C784',
        focus: '#E8F5E9',
    },
    yellow: {
        function: '#FFF176',
        focus: '#FFFDE7',
    },
    orange: {
        function: '#FFB74D',
        focus: '#FFF8E1',
    },
    amber: {
        function: '#FF8A65',
        focus: '#FBE9E7',
    },
    bluegrey: {
        function: '#90A4AE',
        focus: '#ECEFF1',
    }
}

const addInputButton = document.getElementById('add-input-button');
addInputButton.addEventListener('click', () => { addInput() });

export function updateInputValues() {
    variables.length = 0;
    let inputs = document.querySelectorAll('.function-input');
    let symbols = document.querySelectorAll('.function-symbol');
    let playButtons = document.querySelectorAll('.play-button');
    
    for (let i = 0; i < inputs.length; i++) {
        let value = inputs[i].value;

        // empty input
        if (value === '') {
            symbols[i].src = '';
            if (playButtons[i] !== undefined) {
                playButtons[i].remove();
            }
            
        // variable
        } else if (/[a-z]=[a-z0-9]/.test(value)) { 
            let variable = {};
            let name = value.split('=')[0];
            let val = parseFloat(value.split('=')[1]);
            variable[name] = val;;
            variables.push(variable);
            symbols[i].src = '../assets/variable.png';
            
            if (playButtons[i] == undefined) {
                let inputButtonsContainer = document.querySelectorAll('.input-buttons-container')[i];
                let playButton = document.createElement('button');
                playButton.innerHTML = '>';
                playButton.className = 'play-button sidebar-button';
                playButton.addEventListener('click', () => {startAnimation(i)})
                inputButtonsContainer.appendChild(playButton);
            }
        // function
        } else {
            if (playButtons[i] !== undefined) {
                playButtons[i].remove();
            }

            try {
                Expression.evaluate(value, variables);
                symbols[i].src = '../assets/function.png';
            } catch (err) {
                console.log('Error compiling function: ' + value);
                console.log(err);
                symbols[i].src = '../assets/caution.png';
            }
        }
        

        functions[i].expression = value;
    }

    drawFunctions();
    render();
}

export function addInput() {
    const index = functions.length;

    let values = Object.values(functionColors);
    let rand = Math.floor(Math.random() * values.length);
    const color = values[rand];

    addFunction('', color);

    let container = document.getElementById('functions');
    
    let functionContainer = document.createElement('div');
    functionContainer.id = index;
    functionContainer.className = 'function-container';

    let functionSymbol = document.createElement('img');
    functionSymbol.className = 'function-symbol';
    functionSymbol.src = '';

    let functionLabel = document.createElement('div');
    functionLabel.className = 'function-label';
    functionLabel.appendChild(functionSymbol);

    let functionInput = document.createElement('input');
    functionInput.className = 'function-input';
    functionInput.value = functions[index].expression;
    functionInput.oninput = updateInputValues;
    functionContainer.style.backgroundColor = color.focus;
    
    let removeInputButton = document.createElement('button');
    removeInputButton.innerHTML = '-';
    removeInputButton.className = 'sidebar-button';

    let inputButtonsContainer = document.createElement('div');
    inputButtonsContainer.className = 'input-buttons-container';
    inputButtonsContainer.appendChild(removeInputButton);

    removeInputButton.addEventListener('click', () => {
        functions.splice(functionContainer.id, 1);
        functionLabel.removeChild(functionSymbol);
        functionContainer.removeChild(functionLabel);
        functionContainer.removeChild(functionInput);
        functionContainer.removeChild(inputButtonsContainer);
        container.removeChild(functionContainer);

        drawFunctions();
        render();
    });

    functionContainer.appendChild(functionLabel);
    functionContainer.appendChild(functionInput);
    functionContainer.appendChild(inputButtonsContainer);
    container.appendChild(functionContainer);
}

function startAnimation(index) {
    let functionContainer = document.getElementById(index);
    let value = functionContainer.querySelectorAll('input')[0].value;
    let name = value.split('=')[0];
    let variableNames = variables.map(name => Object.keys(name)[0]);
    let variiableIndex = variableNames.indexOf(name);

    for (var val = xRange.start; val < xRange.end; val += 0.25) {
        variables[variiableIndex][name] = val;
        drawFunctions();
    }

}


