import java.util.ArrayList;
import java.util.Map;
import java.util.Stack;

public class ExpressionTree {

    /**
     * A list of Token objects
     */
    private ArrayList<Token> tokens;

    private Node<Token> root;

    /**
     * Maps digits 0-9 to its respective type.
     */
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

    /**
     * Maps a string of a unary function to its respective type.
     */
    private static Map<String, Type> unaryFunctionMap = Map.ofEntries(
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

    /**
     * Maps a binary operation to its respective type.
     */
    private static Map<Character, Type> binaryOperationMap = Map.of(
        '+', Type.ADDITION,
        '-', Type.SUBTRACTION,
        '*', Type.MULTIPLICATION,
        '/', Type.DIVISION,
        '^', Type.EXP
    );

    /**
     * Maps the type of a token to its respective mathematical operation/function.
     */
    private static Map<Type, Evaluable> functionMap = Map.ofEntries(
        Map.entry(Type.ADDITION,       (double x, double y) -> { return x + y; }),
        Map.entry(Type.SUBTRACTION,    (double x, double y) -> { return x - y; }),
        Map.entry(Type.MULTIPLICATION, (double x, double y) -> { return x * y; }),
        Map.entry(Type.DIVISION,       (double x, double y) -> { return x / y; }),
        Map.entry(Type.EXP,            (double x, double y) -> { return Math.pow(x, y); }),
        Map.entry(Type.SIN,            (double x, double y) -> { return Math.sin(x); }),
        Map.entry(Type.COS,            (double x, double y) -> { return Math.cos(x); }),
        Map.entry(Type.TAN,            (double x, double y) -> { return Math.sin(x); }),
        Map.entry(Type.ASIN,           (double x, double y) -> { return Math.asin(x); }),
        Map.entry(Type.ACOS,           (double x, double y) -> { return Math.acos(x); }),
        Map.entry(Type.ATAN,           (double x, double y) -> { return Math.atan(x); }),
        Map.entry(Type.SINH,           (double x, double y) -> { return Math.sinh(x); }),
        Map.entry(Type.COSH,           (double x, double y) -> { return Math.cosh(x); }),
        Map.entry(Type.TANH,           (double x, double y) -> { return Math.tanh(x); }),
        Map.entry(Type.SQRT,           (double x, double y) -> { return Math.sqrt(x); }),
        Map.entry(Type.CBRT,           (double x, double y) -> { return Math.cbrt(x); }),
        Map.entry(Type.LOG,            (double x, double y) -> { return Math.log10(x); }),
        Map.entry(Type.LN,             (double x, double y) -> { return Math.log(x); })
    );

    private static final char X_VARIABLE = 'x';

    private static interface Evaluable {
        public double evaluate(double x, double y);
    }

    private enum Type {
        // Digits
        ZERO, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE,
        // Binary Operations
        ADDITION, SUBTRACTION, MULTIPLICATION, DIVISION, EXP,
        // Unary Functions
        SIN, COS, TAN, 
        ASIN, ACOS, ATAN, 
        SINH, COSH, TANH,
        SQRT, CBRT,
        LOG, LN,
        // Constants
        PI, E,
        // Other
        OPEN_PARENTHESIS, CLOSE_PARENTHESIS,
        OPERAND, VARIABLE, DECIMAL, SPACE
    }

    private static class Token {

        public Type type;

        public Double value;

        public String show;

        public Token(Type type, Double value, String show) {
            this.type = type;
            this.value = value;
            this.show = show;
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
            } else if(curChar == X_VARIABLE) { 
                if (hasCoeff) {
                    stack.push(new Token(Type.MULTIPLICATION, null, "*"));
                    hasCoeff = false;
                }
                tokens.add(new Token(Type.VARIABLE, null, String.valueOf(curChar)));

            // unary function
            } else if (Character.isLetter(curChar) && (curChar != X_VARIABLE)) {
                Type curType;
                String show;

                if (infix.substring(i, i + 2) == "ln") {
                    curType = Type.LN;
                    show = "ln";
                    i += 1;
                } else if (unaryFunctionMap.containsKey(infix.substring(i, i + 3))) {
                    curType = unaryFunctionMap.get(infix.substring(i, i + 3));
                    show = infix.substring(i, i + 3);
                    i += 2;
                } else {
                    curType = unaryFunctionMap.get(infix.substring(i, i + 4));
                    show = infix.substring(i, i + 4);
                    i += 3;
                }
                
                tokens.add(new Token(curType, null, show));
                
            // digit or decimal
            } else if (Character.isDigit(curChar)) {
                boolean seperator = false;
                if (i + 1 < infix.length()) {
                    // next character is a variable, this digit is a coefficient
                    if (infix.charAt(i + 1) == X_VARIABLE) {
                        hasCoeff = true;
                    // next character is not a digit or decimal, seperator added to distinguish multi-digit numbers
                    } else if (!Character.isDigit(infix.charAt(i + 1)) && infix.charAt(i + 1) != '.') {
                        seperator = true;
                    }
                }
                int val = Character.getNumericValue(curChar);
                Type curType = digitMap.get(val);
                tokens.add(new Token(curType, (double) val, String.valueOf(curChar)));     
                if (seperator)
                    tokens.add(new Token(Type.SPACE, null, " "));

            // open parenthesis
            } else if (curChar == '(') {
                stack.push(new Token(Type.OPEN_PARENTHESIS, null, "("));

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
                tokens.add(new Token(Type.DECIMAL, null, "."));

            // euler's constant
            } else if (curChar == 'e') {
                tokens.add(new Token(Type.E, Math.E, "e"));
            
            // pi
            } else if (curChar == 'P') {
                if (i + 1 < infix.length()) {
                    if (infix.charAt(i + 1) == 'I') {
                        tokens.add(new Token(Type.PI, Math.PI, "PI"));
                    }
                }

            // binary operator
            } else {
                Type curType = binaryOperationMap.get(curChar);
                while (!stack.isEmpty() && 
                        precedence(curType) <= precedence(stack.peek().type)) {
                    tokens.add(stack.peek());
                    stack.pop();
                }
                stack.push(new Token(curType, null, String.valueOf(curChar)));
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
     * TODO: Fix build with space token and multi-digit numbers
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
            ret += t.show;
        }

        return ret;
    }

}