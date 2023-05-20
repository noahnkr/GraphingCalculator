import { tokenize } from './lexer.js';
import { buildTree, drawTree, solve } from './expression-tree.js';
import { toPostfix, condense, assignVariables } from './postfix.js';

const h = 0.0001; // h, the smaller the value the higher the accuracy
const maxIterations = 100;
const tolerance = 0.0001; 

export default class Expression {

    // Evaluates an expression for some value of a x, and/or a finite number of variables.
    static evaluate(expression, x, variables) {
        let tokens = toPostfix(tokenize(expression));
        condense(tokens);
        assignVariables(tokens, variables);
        let root = buildTree(tokens);
        return solve(root, x);
    }

    // Returns a function that can be evaluated at some value of x
    static makeFunction(expression) {
        return function(x, variables) {
            return Expression.evaluate(expression, x, variables);
        }
    }

    // Uses Newtons difference quotient to estimate derivative of a function at some value of x
    static calculateDerivative(f, x) {
        let y = f(x);
        let x1 = x + h;
        let y1 = f(x1);
        let dx = (y1 - y) / h; 
        return dx;
    }
 
    // Uses Newton–Raphson's method to calculate root of an expression based on an initial guess
    static calculateRoots(f, x) {
        let iteration = 0;
        while (iteration < maxIterations) {
            let fx = f(x); // f(x)
            let fpx = this.calculateDerivative(f, x); // f'(x)
            let x1 = x - fx / fpx;
            if (Math.abs(x1 - x) < tolerance) {
                return x1
            }

            x = x1;
            iteration++
        }
        return null;
    }

    
}
