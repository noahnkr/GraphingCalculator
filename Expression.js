import { infixToPostfix, condense } from "./Postfix.js";
import { tokenize } from "./Lexer.js";
import { buildTree, drawTree, solve } from "./ExpressionTree.js";

class MathExpression {

    static evaluate(expression, x) {
        let tokens = infixToPostfix(tokenize(expression));
        condense(tokens);
        let root = buildTree(tokens);
        console.log(drawTree(root));
        return solve(root, x);
    }
}

console.log(MathExpression.evaluate('sin(0)'));


export default MathExpression;