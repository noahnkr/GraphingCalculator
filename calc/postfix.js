import { tokenTypes, createToken } from './token.js';


/* Converts a list of infix tokens into postfix format. */
export function infixToPostfix(infix) {
    var postfix = [];
    var functionStack = [];
    var operatorStacks = [];
    // Base stack
    operatorStacks.push([]);

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

            if (functionStack.length != 0) {
                functionStack[functionStack.length - 1].subtokens.push(curToken);
            } else {
                postfix.push(curToken);
            }

            if (seperator) {
                if (functionStack.length != 0) {
                    functionStack[functionStack.length - 1].subtokens.push(tokenTypes.SPACE);
                } else {
                    postfix.push(tokenTypes.SPACE);
                }
            }

        // Operator or Negative
        } else if (curToken.isOperator()) {
        
            // Negative number
            if (curToken.type == tokenTypes.SUBTRACTION.type && infix[i + 1].isOperand()) {
                if (functionStack.length != 0) {
                    functionStack[functionStack.length - 1].subtokens.push(tokenTypes.NEGATIVE);
                } else {
                    postfix.push(tokenTypes.NEGATIVE);
                }
            
            // Multiplied by -1
            } else if (curToken.type == tokenTypes.SUBTRACTION.type && 
                                         (infix[i + 1].isFunction() ||
                                          infix[i + 1].isConstant() ||
                                          infix[i + 1].isVariable() ||
                                          infix[i + 1].type == tokenTypes.OPEN_PARENTHESIS.type)) {
                
                if (functionStack.length != 0) {
                    functionStack[functionStack.length - 1].subtokens.push(tokenTypes.NEGATIVE);
                    functionStack[functionStack.length - 1].subtokens.push(tokenTypes.ONE);
                    functionStack[functionStack.length - 1].subtokens.push(tokenTypes.SPACE);
                } else {
                    postfix.push(tokenTypes.NEGATIVE);
                    postfix.push(tokenTypes.ONE);
                    postfix.push(tokenTypes.SPACE);
                }

                if (operatorStacks.length != 0) {
                    operatorStacks[operatorStacks.length - 1].push(tokenTypes.MULTIPLICATION);
                } else {
                    operatorStacks[0].push(tokenTypes.MULTIPLICATION);
                }
                
            
            // Operator
            } else {
                let curOperatorStack = operatorStacks[operatorStacks.length - 1];
                while (curOperatorStack.length != 0 && 
                        curToken.precedence() <= curOperatorStack[curOperatorStack.length - 1].precedence()) {
                    if (functionStack.length != 0) {
                        functionStack[functionStack.length - 1].subtokens.push(curOperatorStack.pop());
                    } else {
                        postfix.push(curOperatorStack.pop());
                    }
                }

                curOperatorStack.push(curToken);
            }
        
        // Function
        } else if (curToken.isFunction()) {
            if (hasCoefficient) {
                operatorStacks[operatorStacks.length - 1].push(tokenTypes.MULTIPLICATION);
                hasCoefficient = false;
            }

            if (functionStack.length != 0) {
                functionStack[functionStack.length - 1].subtokens.push(curToken);
            } else {
                postfix.push(curToken);
            }

            functionStack.push(curToken);
        
        // Constant or Variable
        } else if (curToken.isConstant() || curToken.isVariable()) {
            if (hasCoefficient) {
                operatorStacks[operatorStacks.length - 1].push(tokenTypes.MULTIPLICATION);
                hasCoefficient = false;
            }

            if (functionStack.length != 0) {
                functionStack[functionStack.length - 1].subtokens.push(curToken);
            } else {
                postfix.push(curToken);
            }
        
        // Decimal
        } else if (curToken.type == tokenTypes.DECIMAL.type) {
            if (functionStack.length != 0) {
                functionStack[functionStack.length - 1].subtokens.push(curToken);
            } else {
                postfix.push(curToken);
            }
        
        // Open Parenthesis
        } else if (curToken.type == tokenTypes.OPEN_PARENTHESIS.type) {
            if (hasCoefficient) {
                operatorStacks[operatorStacks.length - 1].push(tokenTypes.MULTIPLICATION);
                hasCoefficient = false;
            }
            operatorStacks[operatorStacks.length - 1].push(tokenTypes.OPEN_PARENTHESIS);

        // Close Parentehsis
        } else if (curToken.type == tokenTypes.CLOSE_PARENTHESIS.type) {
            let curOperatorStack = operatorStacks[operatorStacks.length - 1];
            while (curOperatorStack.length != 0 && 
                   curOperatorStack[curOperatorStack.length - 1].type != tokenTypes.OPEN_PARENTHESIS.type) {
                if (functionStack.length != 0) {
                    functionStack[functionStack.length - 1].subtokens.push(curOperatorStack.pop());
                } else {
                    postfix.push(curOperatorStack.pop());
                }
            }
            curOperatorStack.pop();
        
        // Function Open Parenthesis
        } else if (curToken.type == tokenTypes.FUNCTION_OPEN.type) {
            operatorStacks.push([]);

        // Function Close Parenthesis
        } else if (curToken.type == tokenTypes.FUNCTION_CLOSE.type) {
            let curOperatorStack = operatorStacks[operatorStacks.length - 1];
            while (curOperatorStack.length != 0 && 
                   curOperatorStack[curOperatorStack.length - 1].type != tokenTypes.OPEN_PARENTHESIS.type) {
                if (functionStack.length != 0) {
                    functionStack[functionStack.length - 1].subtokens.push(curOperatorStack.pop());
                } else {
                    postfix.push(curOperatorStack.pop());
                }
            }

            functionStack.pop();
            operatorStacks.pop();
        } else {
            throw new Error('Unknown Token: \'', curToken.show,'\'');
        }
    }

    if (operatorStacks.length != 1) {
        throw new Error('Invalid Expression Format');
    }

    // Pop all operators from base stack
    let curOperatorStack = operatorStacks[operatorStacks.length - 1];
    while (curOperatorStack.length != 0) {
        if (curOperatorStack[curOperatorStack.length - 1].type == tokenTypes.OPEN_PARENTHESIS.type) {
            throw new Error('Invalid Parenthesis Format');
        }
        postfix.push(curOperatorStack.pop());
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