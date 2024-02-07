# GraphMath

GraphMath is a Javascript-based graphing calculator that is capable of graphing mathematical functions onto a cartesian plane. The inspiration for this project comes from the website 
[Desmos](https://www.desmos.com/). Although the most useful application for GraphMath is visualizing functions, it is also capable of evaluating complex multi-variable mathematical expressions, calculate intercepts, roots, derivates, and more to a high degree of precision disregarding floating-point inaccuracy.

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

### Lexical Analysis

As we all know computers are great at math, but it cant understand that the string ```sqrt(16) + 5``` corresponds to the square root of 16 plus 5. By breaking each piece of an expression
into individual _tokens_ through lexical analysis, we get: ```sqrt```, ```(```, ```16```, ```)```, ```+```, ```5```. We can then assign meaning to what piece of a mathematical expression it is (Digit, Operator, 
Parenthesis, Function, etc). After performing lexical analysis on the input string we are left with a list of tokens in infix format. This list is much easier to manipulate when 
we are trying to convert the expression from infix to postfix.

### Postfix Conversion

The benefit of using postfix is that there is no need for the use of parenthesis and that the order of the operators can be determined using a stack. Using the Shunting Yard algorithm, we can
convert this list of infix tokens to postfix using an operator stack, however, this process works for simple expressions. Things get more complicated when you incorporate functions like ```sqrt```, ```sin```, or ```log```. The standard operations are called binary operators because they apply the operation to two operands, the left and right sides of the operator. When you have a function, it only applies to the _inside_ of the function. 

For example: ```10*sin(x+5)```

If you were to use the Shunting Yard algorithm to convert this expression into postfix, the addition operator inside the sine function would be applied incorrectly because there is no way of determining which 
operands it applies to without parenthesis. To solve this issue, we can recursively define a function's own list of tokens which I call _"subtokens"_ as well as changing the operator stack to a _stack of operator stacks_. Using this new approach we can convert the aforementioned expression to postfix format by adding a new stack to the operator stacks when we encounter 
```sin```, and anything inside of it will be added to the list of subtokens and stack until we reach the function's respective closing parenthesis resulting in the operator stack being popped.

### Operand Condensing

Previously, whenever we encountered a digit it would be added as a single-digit token to the list and not as the entire number. This means that the expression ```12+47``` in infix would look like ```1247+``` 
in postfix. To distinguish between multi-digit numbers, a separator is added after the end of a number so that after converting the expression to postfix it is possible to condense multiple single-digit tokens into 
one token. There were other intricacies such as decimals, negatives, and coefficients that also required attention to make sure they applied correctly.

### Expression Tree

Now that we have a list of tokens in postfix format, we need to build a binary tree where each leaf node is an operand and each internal node is either an operator or a function. A function node's left child 
is the root of the subtree created from it's subtokens and it's right child is undefined. An operator node must have both a left and a right child, the last operator popped from the stack is the root node of the expression tree. Now that we have created an expression tree for the given expression, we can evaluate the expression by performing a postorder traversal of the tree.



