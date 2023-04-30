import { tokenize } from "./Lexer.js";
import { infixToPostfix, condense } from "./postfix.js";
import { buildTree, drawTree, solve } from "./expression-tree.js";

class MathExpression {

    static evaluate(equation, x) {
        let tokens = infixToPostfix(tokenize(equation));
        condense(tokens);
        let root = buildTree(tokens);
        console.log(drawTree(root));
        return solve(root, x);
    }

    static makeFunction(equation) {
        return function(x) {
            return this.evaluate(equation, x);
        }
    }
}

var f = makeFunction('sqrt(x)');
console.log(f(4));


export default MathExpression;