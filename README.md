# GraphMath

GraphMath is a Javascript-based graphing calculator that is capable of graphing mathematical functions onto a cartesian plane. The inspiration for this project comes from the website 
[Desmos](https://www.desmos.com/). Although the most useful application for GraphMath is visualizing functions, it is also capable of evaluating complex mathematical expressions featuring 
multiple variables to a high degree of precision disregarding floating-point inaccuracy. 

![Graph](https://i.imgur.com/xk5rOMX.png)

## Overview

### Supported Functions
- ```sin```
- ```cos```
- ```tan```
- ```asin```
- ```acos```
- ```atan```
- ```sinh```
- ```cosh```
- ```tanh```
- ```sqrt```
- ```cbrt```
- ```log```
- ```ln```
- ```abs```

## How It Works

A function in mathematics is the relationship between a set of inputs and a singular output. In order to plot a function, we have to know what the output is going to be for _every_ input. 
Okay great... thanks for that refresher on Algebra 1. 

As we all know computers are great at math, but we want a user to be able to type ```sin(x)``` and then have the computer graph a sine function. Except all the computer sees is a string of 
characters ```s```, ```i```, ```n```, ```(```, ```x```, ```)```. To solve this issue we need to use a process called lexical analysis.

### Lexical Analysis

We iterate through the string of characters and convert it into a list of _tokens_. These tokens have information about what piece of a mathematical expression it is (Digit, Operator, 
Parenthesis, Variable, Function, etc). After performing lexical analysis on the input string we are left with a list of tokens in infix format. This list is much easier to manipulate when 
we are trying to convert the expression from infix to postfix.

### Postfix Conversion

The benefit of using postfix is that there is no need for the use of parenthesis and that the order of the operators can be determined using a stack. While this process works for simple expressions, 
things get more complicated whenyou introduce functions like ```sqrt```, ```sin```, and ```log```. The standard operations are called binary operators because they apply to they apply the operation 
to two operands, the left and right sides of the operator. However, when you have a function, it only applies to the operands _inside_ of the function. 

For example: ```10*sin(x+5)```

If you were to use the traditional approach of converting this to postfix, the addition operator inside the sine function would be applied incorrectly because there is no way of determining which 
operands it applies to without parenthesis.To solve this issue, I like to think of anything inside of a function as an entirely separate expression. By using _"subtokens"_, each function has its 
own separate list of tokens and operator stack. Using this new approach we can convert the aforementioned expression to postfix format by adding a new stack to the operator _stacks_ when we encounter 
```sin```, and anything inside the function will be added to the list of subtokens and stack until we reach the function's respective closing parenthesis.

### Operand Condensing

Previously, whenever we encountered a digit it would be added as a single-digit token to the list and not as the entire number. This means that the expression ```12+47``` would look like ```1247+```. 
To distinguish between multi-digit numbers,a separator is added after the end of a number so that after converting the expression to postfix it is possible to condense multiple single-digit tokens into 
one token. There were many other intricacies such as decimals, negatives, and coefficients that had to be worked out as well.

### Expression Tree

Now that we have a list of tokens in postfix format, we need to build a binary tree where each leaf node is an operand and each internal node is either an operator or a function. We iterate through the 
list of tokens and if the current token:
- Is not an operator or a function, push a new node to the stack
- Is a function, push a new node to the stack and recursively continue building the tree onto the left child of this node with the functions subtokens
- Otherwise, push a new node to the stack with its left and right children being the top two nodes of the stack

Finally, pop the last node from the stack. This is the root node of the binary tree.

### Evaluation

Now that we have created an expression tree for the given expression, we can evaluate the expression by performing a postorder traversal of the tree. The steps are as follows:
- If the node is an operand, return its value
- If the node is an operator, return the value of applying the operation to the left and right subtrees of this node
- If the node is a function, return the value of applying the function to the left subtree of this node


