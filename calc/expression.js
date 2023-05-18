import { tokenize } from './lexer.js';
import { buildTree, drawTree, solve } from './expression-tree.js';
import { toPostfix, condense } from './postfix.js';

const h = 0.0001; // h, the smaller the value the higher the accuracy
const maxIterations = 100;
const tolerance = 0.0001; 

export default class Expression {

    // Evaluates an expression for some value of x, or 0 if not provided.
    static evaluate(expression, x) {
        let tokens = toPostfix(tokenize(expression));
        condense(tokens);
        let root = buildTree(tokens);
        return solve(root, x);
    }

    // Returns a function that can be evaluated at some value of x
    static makeFunction(expression) {
        return function(x) {
            return Expression.evaluate(expression, x);
        }
    }

    // Uses Newtons difference quotient to estimate derivative of a function at some value of x
    static calculateDerivative(expression, x) {
        let f = this.makeFunction(expression);
        let y = f(x);
        let x1 = x + h;
        let y1 = f(x1);
        let dx = (y1 - y) / h; 
        return dx;
    }
 
    // Uses Newton–Raphson's method to calculate root of an expression based on an initial guess
    static calculateRoots(expression, x) {
        let f = this.makeFunction(expression);
        let iteration = 0;
        while (iteration < maxIterations) {
            let fx = f(x); // f(x)
            let fpx = this.calculateDerivative(expression, x); // f'(x)
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
