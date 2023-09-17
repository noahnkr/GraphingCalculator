import { mathFunctions } from './math.js';

export default class Token {
    constructor(type, value, subtokens, show, math) {
        this.type = type;
        this.value = value;
        this.subtokens = subtokens;
        this.show = show;
        this.math = math;
    }

    isOperator() {
        return this.type >= 10 && this.type <= 14;
    }

    isFunction() {
        return this.type >= 15 && this.type <= 27;
    }

    isOperand() {
        return (this.type >= 0 && this.type <= 9) || this.type == tokens.OPERAND.type;
    }

    isConstant() {
        return this.type == tokens.PI.type || this.type == tokens.E.type;
    }

    isVariable() {
        return this.type == tokens.VARIABLE.type;
    }

    precedence() {
        if (this.type == tokens.ADDITION.type || this.type == tokens.SUBTRACTION.type || 
                                                     this.type == tokens.NEGATIVE.type) {
            return 1;
        } else if (this.type == tokens.MULTIPLICATION.type || this.type == tokens.DIVISION.type) {
            return 2;
        } else if (this.type == tokens.POW.type) {
            return 3;
        }
        return -1;
    }
}

export function createToken(type, value, subtokens, show, math) {
    return new Token(type, value, subtokens, show, math);
}

export const tokens = {
    // Digits
    ZERO              : new Token(0, 0, null, '0'),
    ONE               : new Token(1, 1, null, '1'),
    TWO               : new Token(2, 2, null, '2'),
    THREE             : new Token(3, 3, null, '3'),
    FOUR              : new Token(4, 4, null, '4'),
    FIVE              : new Token(5, 5, null, '5'),
    SIX               : new Token(6, 6, null, '6'),
    SEVEN             : new Token(7, 7, null, '7'), 
    EIGHT             : new Token(8, 8, null, '8'), 
    NINE              : new Token(9, 9, null, '9'),
    // Operators
    ADDITION          : new Token(10, null, null, '+', mathFunctions.add),
    SUBTRACTION       : new Token(11, null, null, '-', mathFunctions.subtract), 
    MULTIPLICATION    : new Token(12, null, null, '*', mathFunctions.multiply),
    DIVISION          : new Token(13, null, null, '/', mathFunctions.divide), 
    POW               : new Token(14, null, null, '^', mathFunctions.pow),
    // Functions
    SIN               : new Token(15, null, [], 'sin', mathFunctions.sin),
    COS               : new Token(16, null, [], 'cos', mathFunctions.cos),
    TAN               : new Token(17, null, [], 'tan', mathFunctions.tan),
    ASIN              : new Token(18, null, [], 'asin', mathFunctions.asin), 
    ACOS              : new Token(19, null, [], 'acos', mathFunctions.acos), 
    ATAN              : new Token(20, null, [], 'atan', mathFunctions.atan), 
    SINH              : new Token(21, null, [], 'sinh', mathFunctions.sinh), 
    COSH              : new Token(22, null, [], 'cosh', mathFunctions.cosh), 
    TANH              : new Token(23, null, [], 'tanh', mathFunctions.tanh),
    SQRT              : new Token(24, null, [], 'sqrt', mathFunctions.sqrt), 
    CBRT              : new Token(25, null, [], 'cbrt', mathFunctions.cbrt),
    LOG               : new Token(26, null, [], 'log', mathFunctions.log), 
    LN                : new Token(27, null, [], 'ln', mathFunctions.ln),
    ABS               : new Token(27, null, [], 'abs', mathFunctions.abs),
    // Constants
    PI                : new Token(28, Math.PI, null, 'pi'),
    E                 : new Token(29, Math.E, null, 'e'),
    // Other
    OPEN_PARENTHESIS  : new Token(30, null, null, '('), 
    CLOSE_PARENTHESIS : new Token(31, null, null, ')'), 
    FUNCTION_OPEN     : new Token(32, null, null, '('), 
    FUNCTION_CLOSE    : new Token(33, null, null, ')'),
    OPERAND           : new Token(34, null, null, '0'), 
    VARIABLE          : new Token(35, null, null, 'x'), 
    DECIMAL           : new Token(36, null, null, '.'), 
    NEGATIVE          : new Token(37, null, null, '-'), 
    SPACE             : new Token(38, null, null, ' ')
};

export const digitMap = new Map([
    [0, tokens.ZERO],
    [1, tokens.ONE],
    [2, tokens.TWO],
    [3, tokens.THREE],
    [4, tokens.FOUR],
    [5, tokens.FIVE],
    [6, tokens.SIX],
    [7, tokens.SEVEN],
    [8, tokens.EIGHT],
    [9, tokens.NINE]
]);

export const operatorMap = new Map([
    ['+', tokens.ADDITION],
    ['-', tokens.SUBTRACTION],
    ['*', tokens.MULTIPLICATION],
    ['/', tokens.DIVISION],
    ['^', tokens.POW]
]);

export const functionMap = new Map([
    ['sin', tokens.SIN],
    ['cos', tokens.COS],
    ['tan', tokens.TAN],
    ['asin', tokens.ASIN],
    ['acos', tokens.ACOS],
    ['atan', tokens.ATAN],
    ['sinh', tokens.SINH],
    ['cosh', tokens.COSH],
    ['tanh', tokens.TANH],
    ['sqrt', tokens.SQRT],
    ['cbrt', tokens.CBRT],
    ['log', tokens.LOG],
    ['ln', tokens.LN],
    ['abs', tokens.ABS]
]);
    
