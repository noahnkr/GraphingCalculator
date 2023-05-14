import { tokenTypes, digitMap, operatorMap, functionMap } from './token.js';


/* Tokenizes an infix expression through lexical analysis */
export function tokenize(expression) {
    var tokens = [];
    var length = expression.length;

    for (var i = 0; i < length; i++) {
        var curChar = expression[i];
        
        // Empty Space
        if (curChar == ' ') {
            tokens.push(tokenTypes.SPACE);

        // Digit
        } else if (!isNaN(curChar)) {
            tokens.push(digitMap.get(parseInt(curChar)));

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
                    throw new Error('Unknown function: \'', show, '\'');
                }
            }

            // Contains key!
            tokens.push(functionMap.get(show));
            tokens.push(tokenTypes.FUNCTION_OPEN);
            i += (j - 1) + 1
        

        // Variable
        } else if (curChar === 'x') {
            tokens.push(tokenTypes.VARIABLE);
        
        // Open Parenthesis
        } else if (curChar === '(') {
            tokens.push(tokenTypes.OPEN_PARENTHESIS);
        
        // Close Parenthesis
        } else if (curChar === ')') {
            tokens.push(tokenTypes.CLOSE_PARENTHESIS);
        
        // Decimal
        } else if (curChar === '.') {
            tokens.push(tokenTypes.DECIMAL);
        
        // E
        } else if (curChar === 'e') {
            tokens.push(tokenTypes.E);

        // Pi
        } else if (curChar === 'p' && expression[i + 1] === 'i') {
            tokens.push(tokenTypes.PI);
            i++;
        
        // Operator
        } else {
            if (operatorMap.has(curChar)) {
                tokens.push(operatorMap.get(curChar));
            
            // Unknown Character
            } else {
                throw new Error('Unknown Character: ', curChar);
            }
        }
    }

    // Finds each functions respective closing parenthesis
    for (var i = 0; i < tokens.length; i++) {
        var curToken = tokens[i];
        if (curToken.isFunction()) {
            let parenthesisCount = 0;
            // Skip opening parenthesis
            for (var j = i + 2; j < tokens.length; j++) {
                if (tokens[j].type == tokenTypes.OPEN_PARENTHESIS.type) {
                    parenthesisCount++;
                } else if (tokens[j].type == tokenTypes.CLOSE_PARENTHESIS.type && 
                         parenthesisCount == 0) {
                    tokens[j] = tokenTypes.FUNCTION_CLOSE;
                    break;
                } else if (tokens[j].type == tokenTypes.CLOSE_PARENTHESIS.type) {
                    parenthesisCount--;
                }
            }
        }
    }

    return tokens;
}   