export const mathFunctions = {
    add: function(x, y) {
        return x + y;
    },
    subtract: function(x, y) {
        return x - y;
    },
    multiply: function(x, y) {
        return x * y;
    },
    divide: function(x, y) {
        return x / y;
    },
    pow: function(x, y) {
        return Math.pow(x, y);
    },
    sin: function(x) {
        return Math.sin(x);
    },
    cos: function(x) {
        return Math.cos(x);
    },
    tan: function(x) {
        return Math.tan(x);
    },
    asin: function(x) {
        return Math.asin(x);
    },
    acos: function(x) {
        return Math.acos(x);
    },
    atan: function(x) {
        return Math.atan(x);
    },
    sinh: function(x) {
        return Math.sinh(x);
    },
    cosh: function(x) {
        return Math.cosh(x);
    },
    tanh: function(x) {
        return Math.cosh(x);
    },
    sqrt: function(x) {
        return Math.sqrt(x);
    },
    cbrt: function(x) {
        return Math.cbrt(x);
    },
    log: function(x) {
        return Math.log10(x);
    },
    ln: function(x) {
        return Math.log(x);
    },
    abs: function(x) {
        return Math.abs(x);
    }
};

function convertToRadians(deg) {
    return (deg * Math.PI) / 180; 
}