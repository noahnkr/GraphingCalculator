import { tokenize } from './lexer.js';
import { buildTree, drawTree, solve } from './expression-tree.js';
import { toPostfix, condense } from './postfix.js';

const h = 0.0001; // h, the smaller the value the higher the accuracy
const tolerance = 0.000000000001; 

export default class Expression {
    // variables should be an array of objects such as:
    // [{ a: 5 }, { b: 12 }, { c: 9.5 }]

    // Evaluates an expression for some value of a x, and/or a finite number of variables.
    static evaluate(expression, x, variables) {
        let tokens = toPostfix(tokenize(expression));
        condense(tokens);
        let root = buildTree(tokens);
        return solve(root, x, variables); 
    }

    // Returns a function that can be evaluated at some value of x
    static makeFunction(expression) {
        return function(x, variables) {
            return Expression.evaluate(expression, x, variables);
        }
    }

    // Uses Newtons difference quotient to estimate derivative of a function at some value of x
    static calculateDerivative(f, x, variables) {
        let y = f(x, variables);
        let x1 = x + h;
        let y1 = f(x1, variables);
        let dx = (y1 - y) / h; 
        return dx;
    }
 
    // Uses Newton–Raphson's method to calculate root of an expression based on an initial guess
    static calculateRoots(f, xStart, xEnd, variables) {
        let roots = [];
        for (let x = xStart; x < xEnd; x++) {
            let root = findRoot(f, x, variables);
            if (!roots.includes(root)) {
                roots.push(root);
            }
            
        }
        return roots;
    }
    
}

function findRoot(f, x, variables) {
    let delta = Infinity;
  
    while (Math.abs(delta) > tolerance) {
        let fx = f(x, variables);
        let fpx = Expression.calculateDerivative(f, x, variables);
        delta = fx / fpx;
        x -= delta;
    }
    
    // sacrifice accuracy so we can easily compare root estimates despite floating point inaccuracy
    return x.toFixed(4);
}
