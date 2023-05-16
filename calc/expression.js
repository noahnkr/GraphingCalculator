import { tokenize } from './lexer.js';
import { buildTree, drawTree, solve } from './expression-tree.js';
import { toPostfix, condense } from './postfix.js';

class MathExpression {

    static evaluate(equation, x) {
        let tokens = toPostfix(tokenize(equation));
        condense(tokens);
        let root = buildTree(tokens);
        return solve(root, x);
    }

    static makeFunction(equation) {
        return function(x) {
            return MathExpression.evaluate(equation, x);
        }
    }
}


export default MathExpression;