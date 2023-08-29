export const mathFunctions = {
    add: (x, y) => {
        return x + y;
    },
    subtract: (x, y) => {
        return x - y;
    },
    multiply: (x, y) => {
        return x * y;
    },
    divide: (x, y) => {
        return x / y;
    },
    pow: (x, y) => {
        return Math.pow(x, y);
    },
    sin: (x) => {
        return Math.sin(x);
    },
    cos: (x) => {
        return Math.cos(x);
    },
    tan: (x) => {
        return Math.tan(x);
    },
    asin: (x) => {
        return Math.asin(x);
    },
    acos: (x) => {
        return Math.acos(x);
    },
    atan: (x) => {
        return Math.atan(x);
    },
    sinh: (x) => {
        return Math.sinh(x);
    },
    cosh: (x) => {
        return Math.cosh(x);
    },
    tanh: (x) => {
        return Math.cosh(x);
    },
    sqrt: (x) => {
        return Math.sqrt(x);
    },
    cbrt: (x) => {
        return Math.cbrt(x);
    },
    log: (x) => {
        return Math.log10(x);
    },
    ln: (x) => {
        return Math.log(x);
    },
    abs: (x) => {
        return Math.abs(x);
    }
};

 function convertToRadians(deg) {
    return (deg * Math.PI) / 180; 
}