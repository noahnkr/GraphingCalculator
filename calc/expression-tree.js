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

export function solve(node, x) {
    if (node.token.isOperand() || node.token.isConstant()) {
        return node.token.value;
    }

    if (node.token.isOperator()) {
        return node.token.math(solve(node.left, x),
                               solve(node.right, x));
    }

    if (node.token.isFunction()) {
        return node.token.math(solve(node.left, x), 0);
    }

    if (node.token.isVariable()) {
        return x;
    }

    throw new Error('Unkown operation or function.');
}


class Node {
    constructor(token, left, right) {
        this.token = token;
        this.left = left;
        this.right = right;
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