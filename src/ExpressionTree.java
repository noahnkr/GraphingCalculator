import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Stack;


public class ExpressionTree {

    private ArrayList<Token> tokens;

    private Node<Token> root;

    private static Map<Integer, Type> digitMap = Map.of(
        0, Type.ZERO,
        1, Type.ONE,
        2, Type.TWO,
        3, Type.THREE,
        4, Type.FOUR,
        5, Type.FIVE,
        6, Type.SIX,
        7, Type.SEVEN,
        8, Type.EIGHT,
        9, Type.NINE
    );

    private static Map<String, Type> unaryOperationMap = Map.ofEntries(
        Map.entry("sin", Type.SIN),
        Map.entry("cos", Type.COS),
        Map.entry("tan", Type.TAN),
        Map.entry("asin", Type.ASIN),
        Map.entry("acos", Type.ACOS),
        Map.entry("atan", Type.ATAN),
        Map.entry("sinh", Type.SINH),
        Map.entry("cosh", Type.COSH),
        Map.entry("tanh", Type.TANH),
        Map.entry("sqrt", Type.SQRT),
        Map.entry("cbrt", Type.CBRT),
        Map.entry("log", Type.LOG),
        Map.entry("ln", Type.LN)
    );

    private static Map<Character, Type> binaryOperationMap = Map.of(
        '+', Type.ADDITION,
        '-', Type.SUBTRACTION,
        '*', Type.MULTIPLICATION,
        '/', Type.DIVISION,
        '^', Type.EXP
    );

    

    private static final char X_VARIABLE = 'x';

    private enum Type {
        // Digits
        ZERO, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE,
        // Binary Operations
        ADDITION, SUBTRACTION, MULTIPLICATION, DIVISION, EXP,
        // Unary Operations
        SIN, COS, TAN, 
        ASIN, ACOS, ATAN, 
        SINH, COSH, TANH,
        SQRT, CBRT,
        LOG, LN,
        // Constants
        PI, E,
        // Other
        OPEN_PARENTHESIS, CLOSE_PARENTHESIS,
        DECIMAL, VARIABLE, SPACE
    }

    private interface Evaluatable {
        public double evaluate(double x, double y);
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
  
        for (int i = 0; i < infix.length(); i++) {
            char curChar = infix.charAt(i);

            // empty space
            if (curChar == ' ') {
                continue;
            
            // variable
            } else if(curChar == 'x') { 
                if (hasCoeff) {
                    stack.push(new Token(Type.MULTIPLICATION, "*"));
                    hasCoeff = false;
                }
                tokens.add(new Token(Type.VARIABLE, String.valueOf(curChar)));

            // unary operation
            } else if (Character.isLetter(curChar) && (curChar != 'x')) {
                Type curType;
                String value = infix.substring(i, i + 3);
                
                if (unaryOperationMap.containsKey(value)) {
                    curType = unaryOperationMap.get(value);
                    i += 2;
                } else {
                    value = infix.substring(i, i + 4);
                    if (!unaryOperationMap.containsKey(value))
                        throw new IllegalArgumentException("Unknown unary operation: \"" + value + "\"");
                    curType = unaryOperationMap.get(value);
                    i += 3;
                }
                tokens.add(new Token(curType, value));
                
            // digit or decimal
            } else if (Character.isDigit(curChar)) {
                boolean seperator = false;
                if (i + 1 < infix.length()) {
                    // next character is a variable, this digit is a coefficient
                    if (infix.charAt(i + 1) == 'x') {
                        hasCoeff = true;
                    // next character is not a digit or decimal, seperator added to distinguish multi-digit numbers
                    } else if (!Character.isDigit(infix.charAt(i + 1)) && infix.charAt(i + 1) != '.') {
                        seperator = true;
                    }
                        
                }
                Type curType = digitMap.get(Character.getNumericValue(curChar));
                tokens.add(new Token(curType, String.valueOf(curChar)));     
                if (seperator)
                    tokens.add(new Token(Type.SPACE, " "));

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

            // decimal    
            } else if (curChar == '.') {
                tokens.add(new Token(Type.DECIMAL, "."));

            // binary operation
            } else {
                Type curType = binaryOperationMap.get(curChar);
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
     * Helpers method for parseInfix which determines the precence of certain operators.
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
            ret += t.value;
        }

        return ret;
    }
}