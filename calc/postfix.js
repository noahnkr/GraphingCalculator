import { tokenTypes, createToken } from './token.js';


/* Makes infix to postfix conversion VASTLY easier */
class Stack {

    constructor() {
        this.items = [];
        this.length = 0;
    }

    push(element) {
        this.items.push(element);
        this.length++;
    }

    pop() {
        if (this.items.length == 0) {
            throw new Error('Empty Stack.')
        }

        this.length--;
        return this.items.pop();
    }

    peek() {
        return this.items[this.items.length - 1];
    }

    isEmpty() {
        return this.length == 0;
    }

}


/* Converts a list of infix tokens into postfix format. */
export function infixToPostfix(infix) {
    var postfix = []; // return value
    var functionStack = new Stack();;
    var operatorStacks = new Stack();
    // Base Operator stack
    operatorStacks.push(new Stack());

    var hasCoefficient = false;

    for (var i = 0; i < infix.length; i++) {
        var curToken = infix[i];

        // Space
        if (curToken.type == tokenTypes.SPACE.type) {
            continue;
        
        // Operand
        } else if (curToken.isOperand()) {
            let seperator = false;
            if (i + 1 < infix.length) {
                // Next token is either: variable, opening parentehsis, constant, or function. 
                // Thus, it is a coefficient.
                if (infix[i + 1].isVariable() || 
                        infix[i + 1].type == tokenTypes.OPEN_PARENTHESIS.type ||
                        infix[i + 1].isConstant() ||
                        infix[i + 1].isFunction()) {
                    hasCoefficient = true;
                }

                // Next token is not an operand or decimal. Seperator added to distinguish multi-digit numbers.
                if (!infix[i + 1].isOperand() && infix[i + 1].type != tokenTypes.DECIMAL.type) {
                    seperator = true;
                }
            }

            if (!functionStack.isEmpty()) {
                functionStack.peek().subtokens.push(curToken);
            } else {
                postfix.push(curToken);
            }

            if (seperator) {
                if (!functionStack.isEmpty()) {
                    functionStack.peek().subtokens.push(tokenTypes.SPACE);
                } else {
                    postfix.push(tokenTypes.SPACE);
                }
            }

        // Operator or Negative
        } else if (curToken.isOperator()) {
        
            // Negative number
            if (curToken.type == tokenTypes.SUBTRACTION.type && infix[i + 1].isOperand()) {
                if (!functionStack.isEmpty()) {
                    functionStack.peek().subtokens.push(tokenTypes.NEGATIVE);
                } else {
                    postfix.push(tokenTypes.NEGATIVE);
                }
            
            // Multiplied by -1
            } else if (curToken.type == tokenTypes.SUBTRACTION.type && 
                                         (infix[i + 1].isFunction() ||
                                          infix[i + 1].isConstant() ||
                                          infix[i + 1].isVariable() ||
                                          infix[i + 1].type == tokenTypes.OPEN_PARENTHESIS.type)) {
                
                if (!functionStack.isEmpty()) {
                    functionStack.peek().subtokens.push(tokenTypes.NEGATIVE);
                    functionStack.peek().subtokens.push(tokenTypes.ONE);
                    functionStack.peek().subtokens.push(tokenTypes.SPACE);
                } else {
                    postfix.push(tokenTypes.NEGATIVE);
                    postfix.push(tokenTypes.ONE);
                    postfix.push(tokenTypes.SPACE);
                }

                if (operatorStacks.length != 0) {
                    operatorStacks.peek().push(tokenTypes.MULTIPLICATION);
                } else {
                    operatorStacks[0].push(tokenTypes.MULTIPLICATION);
                }
                
            
            // Operator
            } else {
                while (!operatorStacks.peek().isEmpty() && 
                        curToken.precedence() <= operatorStacks.peek().peek().precedence()) {
                    if (!functionStack.isEmpty()) {
                        functionStack.peek().subtokens.push(operatorStacks.peek().pop());
                    } else {
                        postfix.push(operatorStacks.peek().pop());
                    }
                }
                operatorStacks.peek().push(curToken);
            }
        
        // Function
        } else if (curToken.isFunction()) {
            if (hasCoefficient) {
                operatorStacks.peek().push(tokenTypes.MULTIPLICATION);
                hasCoefficient = false;
            }

            if (!functionStack.isEmpty()) {
                functionStack.peek().subtokens.push(curToken);
            } else {
                postfix.push(curToken);
            }

            functionStack.push(curToken);
        
        // Constant or Variable
        } else if (curToken.isConstant() || curToken.isVariable()) {
            if (hasCoefficient) {
                operatorStacks.peek().push(tokenTypes.MULTIPLICATION);
                hasCoefficient = false;
            }

            if (!functionStack.isEmpty()) {
                functionStack.peek().subtokens.push(curToken);
            } else {
                postfix.push(curToken);
            }
        
        // Decimal
        } else if (curToken.type == tokenTypes.DECIMAL.type) {
            if (!functionStack.isEmpty()) {
                functionStack.peek().subtokens.push(curToken);
            } else {
                postfix.push(curToken);
            }
        
        // Open Parenthesis
        } else if (curToken.type == tokenTypes.OPEN_PARENTHESIS.type) {
            if (hasCoefficient) {
                operatorStacks.peek().push(tokenTypes.MULTIPLICATION);
                hasCoefficient = false;
            }
            operatorStacks.peek().push(tokenTypes.OPEN_PARENTHESIS);

        // Close Parentehsis
        } else if (curToken.type == tokenTypes.CLOSE_PARENTHESIS.type) {
            while (!operatorStacks.peek().isEmpty() && 
                   operatorStacks.peek().peek().type != tokenTypes.OPEN_PARENTHESIS.type) {
                if (!functionStack.isEmpty()) {
                    functionStack.peek().subtokens.push(operatorStacks.peek().pop());
                } else {
                    postfix.push(operatorStacks.peek().pop());
                }
            }
            operatorStacks.peek().pop();
        
        // Function Open Parenthesis
        } else if (curToken.type == tokenTypes.FUNCTION_OPEN.type) {
            operatorStacks.push(new Stack());

        // Function Close Parenthesis
        } else if (curToken.type == tokenTypes.FUNCTION_CLOSE.type) {
            while (!operatorStacks.peek().length().isEmpty() && 
                   operatorStacks.peek().peek().type != tokenTypes.OPEN_PARENTHESIS.type) {
                if (!functionStack.isEmpty()) {
                    functionStack.peek().subtokens.push(operatorStacks.peek().pop());
                } else {
                    postfix.push(operatorStacks.peek().pop());
                }
            }

            functionStack.pop();
            operatorStacks.pop();
        } else {
            throw new Error('Unknown Token: \'', curToken.show,'\'');
        }
    }

    // Should only be base operator stack left, otherwise invalid operator 
    if (operatorStacks.length != 1) {
        throw new Error('Invalid Expression Format');
    }

    // Pop all operators from base stack
    while (!operatorStacks.peek().isEmpty()) {
        if (operatorStacks.peek().peek().type == tokenTypes.OPEN_PARENTHESIS.type) {
            throw new Error('Invalid Parenthesis Format');
        }
        postfix.push(operatorStacks.peek().pop());
    }

    operatorStacks.pop();

    return postfix;
}

/* Combines tokens that read as a multi-digit operand into a single token
   and removes empty spaces. If the current token is a function, it recursively
   applies this affect to its subtokens. */
export function condense(tokens) {
    var newDigit = '';
    for (var i = 0; i < tokens.length; i++) {
        var curToken = tokens[i];

        if (curToken.isOperand() || curToken.type == tokenTypes.DECIMAL.type || 
                                    curToken.type == tokenTypes.NEGATIVE.type) {
            newDigit += curToken.show;

            if (i + 1 < tokens.length) {
                // Next token is not an operand or decimal, end of digit.
                if (!tokens[i + 1].isOperand() && tokens[i + 1].type != tokenTypes.DECIMAL.type) {
                    let j = newDigit.length;
                    // Remove old operand tokens
                    while (j > 0) {
                        tokens.splice(i - (newDigit.length - 1), 1);
                        j--;
                    }
                    // Insert new operand token
                    i -= newDigit.length - 1;

                    tokens.splice(i, 0, createToken(tokenTypes.OPERAND.type, parseFloat(newDigit), null, newDigit));
                    newDigit = '';
                }
            } 
        } else if (curToken.isFunction()) {
            condense(curToken.subtokens);
        }
    }

    // Remove empty spaces
    for (var i = 0; i < tokens.length; i++) {
        if (tokens[i].type == tokenTypes.SPACE.type) {
            tokens.splice(i, 1);
        }
    }
}