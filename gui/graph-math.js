import Grapher from './grapher.js';

const graph = new Grapher();

class Sidebar {

    constructor() {
        this.colors = [];

    }

    updateInputs() {
        var functions = graph.functions;

        var container = document.getElementById('functions');
        for (var i in functions) {

            var functionContainer = document.createElement('div');
            functionContainer.className = 'function-container';
            functionContainer.id = 'function-container-' + i;

            var functionSymbol = document.createElement('span');
            functionSymbol.innerHTML = 'f(x)=';

            var functionInput = document.createElement('input');
            functionInput.className = 'function-input';
            functionInput.id = 'function-input-' + i;
            functionInput.value = functions[i].expression;
            functionInput.oninput = this.updateInputValues;

            functionContainer.appendChild(functionSymbol);
            functionContainer.appendChild(functionInput);
            container.appendChild(functionContainer);
        }
    }

    updateInputValues() {
        graph.functions = [];
        var i = 0;
        document.getElementById('functions').querySelectorAll('.function-container').forEach(() => {
            var input = document.getElementById('function-input-' + i).value;
            graph.addFunction(input, 'red');
            i++;
        });
    }

    addInput() {
        this.updateInputValues();
        graph.addFunction('', 'red');
        this.updateInputs();
    }

    getColor(index) {
        /*switch(index) {
            case -1:
                return '#000000';
            case 0:
                return '#db2f23';
            case 1:
                return '#232cdb';
            case 2:
                return '#26db23'
            case 3:
                return '#dbd223'
            case 4:
                return '#7023db'
            case 5:
                return '#23dbd8'
            case 6:
                return '#f0831d'
            default:
                return this.getNextColor(index % 7);
        }*/
        return 'red';
    }
}

const sidebar = new Sidebar();
sidebar.addInput();


