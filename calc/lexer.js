import { tokens, digitMap, operatorMap, functionMap, createToken } from './token.js';


/* Tokenizes an infix expression through lexical analysis */
export function tokenize(expression) {
    var infix = [];
    var length = expression.length;

    for (var i = 0; i < length; i++) {
        var curChar = expression[i];
        
        // Empty Space
        if (curChar == ' ') {
            infix.push(tokens.SPACE);

        // Digit
        } else if (!isNaN(curChar)) {
            infix.push(digitMap.get(parseInt(curChar)));

        // Character
        } else if (curChar.match(/[a-zA-Z]/))  {
            // Next character not a letter, either a variable or e
            try {
                if (!expression[i + 1].match(/[a-zA-Z]/)) {
                    if (curChar === 'e') {
                        infix.push(tokens.E);
                        continue;
                    }

                    infix.push(createToken(tokens.VARIABLE.type, null, null, curChar));
                // Either a function, or pi
                } else {
                    // Shortest key length is 2
                    let j = 2; 
                    let show = expression.substring(i, i + j);
                    let token = null;

                    // Look through function map until we find a match
                    while (!functionMap.has(show)) {
                        if (show === 'pi') {
                            token = tokens.PI;
                            break;
                        }

                        j++;
                        show = expression.substring(i, i + j);

                        // Longest key length is 4
                        if (j > 4) {
                            throw new SyntaxError('Unknown function: ' + show);
                        }
                    }

                    // Contains key!
                    if (token == null) {
                        token = functionMap.get(show);
                        infix.push(token);
                        infix.push(tokens.FUNCTION_OPEN);
                    } else {
                        infix.push(token);
                    }

                    i += (j - 1) + 1
                }
            } catch (err) {
                // Variable is at end of expression, clunky but it works. 
                if (!(err instanceof SyntaxError)) {
                    infix.push(createToken(tokens.VARIABLE.type, null, null, curChar));
                } else {
                    throw err;
                }
            }
        
        // Open Parenthesis
        } else if (curChar === '(') {
            infix.push(tokens.OPEN_PARENTHESIS);
        
        // Close Parenthesis
        } else if (curChar === ')') {
            infix.push(tokens.CLOSE_PARENTHESIS);
        
        // Decimal
        } else if (curChar === '.') {
            infix.push(tokens.DECIMAL);

        // Operator
        } else {
            if (operatorMap.has(curChar)) {
                infix.push(operatorMap.get(curChar));
            
            // Unknown Character
            } else {
                throw new Error('Unknown Character: ', curChar);
            }
        }
    }

    // Finds each functions respective closing parenthesis
    for (var i = 0; i < infix.length; i++) {
        var curToken = infix[i];
        if (curToken.isFunction()) {
            let parenthesisCount = 0;
            // Skip opening parenthesis
            for (var j = i + 2; j < infix.length; j++) {
                if (infix[j].type == tokens.OPEN_PARENTHESIS.type) {
                    parenthesisCount++;
                } else if (infix[j].type == tokens.CLOSE_PARENTHESIS.type && 
                         parenthesisCount == 0) {
                    infix[j] = tokens.FUNCTION_CLOSE;
                    break;
                } else if (infix[j].type == tokens.CLOSE_PARENTHESIS.type) {
                    parenthesisCount--;
                }
            }
        }
    }

    return infix;
}   