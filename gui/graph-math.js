import MathExpression from '../calc/expression.js';
import { render } from './grapher.js';
import { addInput } from './sidebar.js';

const addInputButton = document.getElementById('add-input-button');
addInputButton.addEventListener('click', () => { addInput() });

render();










