import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Queue;
import java.util.Stack;

public class ExpressionTree {

    private ArrayList<Token> tokens;

    private Node<Token> root;

    private static final char X_VARIABLE = 'x';

    private enum Type {
        ADDITION, SUBTRACTION, MULTIPLICATION, DIVISION,
        EXP, SQRT,
        OPERAND, VARIABLE,
        OPEN_PARENTHESIS, CLOSE_PARENTHESIS,
        SIN, COS, TAN
    }

    private static class Token {

        public Type type;

        public String value;

        public Token(Type type, String value) {
            this.type = type;
            this.value = value;
        }

        public boolean isOperator() {
           return type == ExpressionTree.Type.ADDITION ||
                  type == ExpressionTree.Type.SUBTRACTION ||
                  type == ExpressionTree.Type.MULTIPLICATION ||
                  type == ExpressionTree.Type.DIVISION ||
                  type == ExpressionTree.Type.EXP;
        }

        public boolean isOperand() {
            return type == ExpressionTree.Type.OPERAND;
        }
    }

    /**
     * A node in the expression tree which holds references to a token
     * that represents its value and it's left and right children.
     */
    private static class Node<Token> {

        public Token token;

        public Node left;

        public Node right;

        public Node(Token token, Node left, Node right) {
            this.token = token;
            this.left = left;
            this.right = right;
        }


    }

    public ExpressionTree(String infixExpression) {
        tokens = parseInfix(infixExpression);
        root = buildTree(tokens);
    }

    /**
     * Performs a lexical analysis of an infix expression and creates an ArrayList of 
     * tokens in postfix order.
     * @param infix
     * @return postfix list
     */
    public static ArrayList<Token> parseInfix(String infix) {
        ArrayList<Token> tokens = new ArrayList<>();
        Stack<Token> stack = new Stack<>();
        boolean hasCoeff = false;
        boolean isDone = false;
        String operand = "";
        
        for (int i = 0; i < infix.length(); i++) {
            char curChar = infix.charAt(i);

            // empty space
            if (curChar == ' ') {
                continue;
            // variable, sqrt, or sin, cos, tan
            } else if (Character.isLetter(curChar)) {
                if (hasCoeff) {
                    stack.push(new Token(Type.MULTIPLICATION, "*"));
                    hasCoeff = false;
                }
                tokens.add(new Token(Type.VARIABLE, String.valueOf(curChar)));
            // operand
            } else if (Character.isDigit(curChar)) {
                operand += curChar;
                if (i + 1 < infix.length()) {
                    // if next element is a digit, not finished
                    if (Character.isDigit(infix.charAt(i + 1))) {
                        isDone = false;
                    // if next element is a variable, then there is a coefficient, finished
                    } else if (Character.isLetter(infix.charAt(i + 1))) {
                        hasCoeff = true;
                        isDone = true;
                    // next element operand, finished
                    } else {
                        isDone = true;
                    }
                }
                
                if (isDone) {    
                    tokens.add(new Token(Type.OPERAND, operand));
                    operand = "";
                } 
            // open parenthesis
            } else if (curChar == '(') {
                stack.push(new Token(Type.OPEN_PARENTHESIS, "("));
            // close parenthesis
            } else if (curChar == ')') {
                while (!stack.isEmpty() && 
                        stack.peek().type != Type.OPEN_PARENTHESIS) {
                    tokens.add(stack.peek());
                    stack.pop();
                }
                stack.pop();
            // operator
            } else {
                Type curType;
                switch(curChar) {
                    case '+':
                        curType = Type.ADDITION;
                        break;
                    case '-':
                        curType = Type.SUBTRACTION;
                        break;
                    case '*':
                        curType = Type.MULTIPLICATION;
                        break;
                    case '/':
                        curType = Type.DIVISION;
                        break;
                    case '^':
                        curType = Type.EXP;
                        break;
                    default:
                        throw new IllegalArgumentException("Unknown Character");
                }
                
                while (!stack.isEmpty() && 
                        precedence(curType) <= precedence(stack.peek().type)) {
                    tokens.add(stack.peek());
                    stack.pop();
                }
                stack.push(new Token(curType, String.valueOf(curChar)));
            }
        }

        // pop all the operators from the stack
        while (!stack.isEmpty()) {
            if (stack.peek().type == Type.OPEN_PARENTHESIS)
                throw new IllegalArgumentException("Invalid Expression Format");
            tokens.add(stack.pop());
        }

        return tokens;
    }

    /**
     * Creates an expression tree from a list of tokens.
     * 
     * @param tokens
     * @return root node
     */
    public static Node<Token> buildTree(ArrayList<Token> tokens) {
        Stack<Node<Token>> stack = new Stack<>();
        for (Token t : tokens) {
            if (!t.isOperator()) {
                stack.push(new Node<Token>(t, null, null));
            } else {
                Node<Token> right = stack.pop();
                Node<Token> left = stack.pop();
                stack.push(new Node<Token>(t, left, right));
            }
        }
        return stack.pop();
    }



    /**
     * Helpers method for parseInfix() which determines the precence of certain operators.
     * 
     * @param c
     * @return precedence
     */
    private static int precedence(Type type) {
        switch (type) {
            case ADDITION:
            case SUBTRACTION:
                return 1;
            case MULTIPLICATION:
            case DIVISION:
                return 2;
            case EXP:
                return 3;
        }
        return -1;
    }

    public String toString() {
        String ret = "";
        for (Token t : tokens) {
            ret += t.value + " ";
        }

        return ret;
    }
}