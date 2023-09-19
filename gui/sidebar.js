import Expression from "../calc/expression.js";
import { functions, variables, addFunction } from "./function.js";
import { clearCache } from "./cache.js";
import { functionColors } from "./util.js";
import { render } from "./grapher.js";

export let selectedFunction = -1;

const addInputButton = document.getElementById('add-input-button');
addInputButton.addEventListener('click', () => { addInput() });

function updateInputs() {
    variables.length = 0;
    let inputs = document.querySelectorAll('.function-input');
    let symbols = document.querySelectorAll('.function-symbol');

    // assign all variables before evaluating functions
    for (let i = 0; i < inputs.length; i++) {
        clearCache(i);
        let value = inputs[i].value;
        let selected = selectedFunction == i;

        if (/[a-z]=[a-z0-9]/.test(value)) { 
            let variable = {};
            let name = value.split('=')[0];
            let val = parseFloat(value.split('=')[1]);
            variable[name] = val;
            variables.push(variable);
            symbols[i].src = selected ? '../assets/variable_selected.png' : '../assets/variable.png';
        }
    }
    
    for (let i = 0; i < inputs.length; i++) {
        let value = inputs[i].value;
        let selected = selectedFunction == i;

        // empty input
        if (value === '') {
            symbols[i].src = '';

        // function
        } else if (!/[a-z]=[a-z0-9]/.test(value)) { 
            try {
                Expression.evaluate(value, 0, variables);
                symbols[i].src = selected ? '../assets/function_selected.png' : '../assets/function.png';
            } catch (err) {
                symbols[i].src = selected ? '../assets/caution_selected.png' : '../assets/caution.png';
            }
        }

        functions[i].expression = value;
    }
    
    render();
}


function addInput() {
    let index = functions.length;
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
    functionLabel.style.backgroundColor = '#555';
    functionLabel.appendChild(functionSymbol);

    let functionInput = document.createElement('input');
    functionInput.className = 'function-input';
    functionInput.value = functions[index].expression;
    functionInput.oninput = updateInputs;
    functionInput.addEventListener('focus', () => {
        selectedFunction = index;
        functionLabel.style.backgroundColor = '#ccc';
        updateInputs();
    })
    functionInput.addEventListener('blur', () => {
        selectedFunction = -1;
        functionLabel.style.backgroundColor = '#555';
        updateInputs();
    })
    
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
        render();
    });

    functionContainer.appendChild(functionLabel);
    functionContainer.appendChild(functionInput);
    functionContainer.appendChild(inputButtonsContainer);
    container.appendChild(functionContainer);
}