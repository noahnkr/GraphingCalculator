class Node {
    constructor(token, left, right) {
        this.token = token;
        this.left = left;
        this.right = right;
    }
}

export function buildTree(postfix) {
    var stack = [];

    for (var i = 0; i < postfix.length; i++) {
        let curToken = postfix[i];
        if (!curToken.isOperator() && !curToken.isFunction()) {
            stack.push(new Node(curToken, null, null));
        } else if (curToken.isFunction()) {
            stack.push(new Node(curToken, buildTree(curToken.subtokens), null));
        } else {
            let newNode = new Node(curToken);
            newNode.right = stack.pop();
            newNode.left = stack.pop();
            stack.push(newNode);
        }
    }
    // Root node
    return stack.pop();
}

export function solve(root, x, variables) {
    assignVariables(root, variables);
    return solveRec(root, x);
}


function solveRec(node, x) {
    if (node.token.isOperand() || node.token.isConstant()) {
        return node.token.value;
    }
    
    if (node.token.isVariable()) {
        if (node.token.show === 'x') {
            if (x === undefined) {
                throw new Error('Unassinged variable: x');
            }
            return x;
        }

        if (node.token.value == undefined) {
            throw new Error('Unassigned variable: ' + node.token.show);
        }

        return node.token.value;
    }


    if (node.token.isOperator()) {
        return node.token.math(solveRec(node.left, x),
                                solveRec(node.right, x));
    }

    if (node.token.isFunction()) {
        return node.token.math(solveRec(node.left, x));
    }

    throw new Error('Unkown operation or function');
}

function assignVariables(node, variables) {
    if (variables === undefined) {
        return;
    }
    
    if (node.token.isVariable()) {
        let name = node.token.show;
        let variableNames = variables.map(name => Object.keys(name)[0]);
        for (var i in variableNames) {
            if (name === variableNames[i]) {
                node.token.value = variables[i][name];
            }
        }
    }

    if (node.left !== null) {
        assignVariables(node.left, variables);
    }

    if (node.right !== null) {
        assignVariables(node.right, variables);
    }
}


export function drawTree(root) {
    if (root === null) {
        return '';
    }

    let ret = [];
    ret.push(root.token.show);

    let pointerRight = '└──';
    let pointerLeft = (root.right !== null) ? '├──' : '└──';

    traverseNodes(ret, '', pointerLeft, root.left, root.right !== null);
    traverseNodes(ret, '', pointerRight, root.right, false);

    return ret.join('');
}


function traverseNodes(string, padding, pointer, node, hasRightSibling) {
    if (node !== null) {
        string.push('\n');
        string.push(padding);
        string.push(pointer);
        string.push(node.token.show);
    
        let paddingBulder = padding;
        if (hasRightSibling) {
            paddingBulder += '│  ';
        } else {
            paddingBulder += '   ';
        }

        let pointerRight = '└──';
        let pointerLeft = (node.right !== null) ? '├──' : '└──';

        traverseNodes(string, paddingBulder, pointerLeft, node.left, node.right !== null);
        traverseNodes(string, paddingBulder, pointerRight, node.right, false);
    }
}