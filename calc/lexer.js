import { tokens, digitMap, operatorMap, functionMap } from './token.js';


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

        // Function
        } else if (curChar.match(/[a-zA-Z]/) && curChar !== 'x'
                                             && curChar !== 'e'
                                             && (curChar !== 'p' && curChar !== 'i'))  {
            // Shortest key length is 2
            let j = 2; 
            let show = expression.substring(i, i + j);

            // Look through function map until we find a match
            while (!functionMap.has(show)) {
                j++;
                show = expression.substring(i, i + j);

                // Longest key length is 4
                if (j > 4) {
                    throw new Error('Unknown function: ' + show);
                }
            }

            // Contains key!
            infix.push(functionMap.get(show));
            infix.push(tokens.FUNCTION_OPEN);
            i += (j - 1) + 1
        

        // Variable
        } else if (curChar === 'x') {
            infix.push(tokens.VARIABLE);
        
        // Open Parenthesis
        } else if (curChar === '(') {
            infix.push(tokens.OPEN_PARENTHESIS);
        
        // Close Parenthesis
        } else if (curChar === ')') {
            infix.push(tokens.CLOSE_PARENTHESIS);
        
        // Decimal
        } else if (curChar === '.') {
            infix.push(tokens.DECIMAL);
        
        // E
        } else if (curChar === 'e') {
            infix.push(tokens.E);

        // Pi
        } else if (curChar === 'p' && expression[i + 1] === 'i') {
            infix.push(tokens.PI);
            i++;
        
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