package tree;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Map;
import java.util.Stack;

/**
 * This is a class representing an expression tree which is based from an input 
 * infix expression. The infix expression is first lexicaly analyzed and broken 
 * into a list of tokens that are easier to manipulate. The tokens can either be 
 * an operand, operator, function, variable, constant, or parenthesis. The list of 
 * tokens is transformed into postfix format which is used to build the expression 
 * tree. Then the function can be evaluated to a double up to three decimal places. 
 * It also can take an input double if the expression tree contains a variable.
 * 
 * @author Noah Roberts
 * @version v2.2.3
 * 
 */
public class ExpressionTree {

    /**
     * Root node of this expression tree.
     */
    private Node<Token> root;

    /* 
     *  Expression inputed from user which is used for building the expression tree.
     */
    private String expression;

    /**
     * A list of Token objects.
     */
    private ArrayList<Token> tokens;

    /**
     * Constant representing the x variable in an expression.
     */
    private static final char X_VARIABLE = 'x';


    /**
     * Maps digits 0-9 to its respective type.
     */
    private static final Map<Integer, Type> digitMap = Map.of(
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
    private static final Map<String, Type> functionMap = Map.ofEntries(
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
        Map.entry("ln", Type.LN),
        Map.entry("abs", Type.ABS)
    );

    /**
     * Maps a binary operation to its respective type.
     */
    private static final Map<Character, Type> operatorMap = Map.of(
        '+', Type.ADDITION,
        '-', Type.SUBTRACTION,
        '*', Type.MULTIPLICATION,
        '/', Type.DIVISION,
        '^', Type.EXP
    );

    /**
     * Maps the type of a token to its respective mathematical operation/function.
     */
    private static final Map<Type, Evaluable> evaluateMap = Map.ofEntries(
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
        Map.entry(Type.LN,             (double x, double y) -> { return Math.log(x); }),
        Map.entry(Type.ABS,            (double x, double y) -> { return Math.abs(x); })
    );

    

    /**
     * A function or operation that is evaluable.
     */
    private static interface Evaluable {
        public double evaluate(double x, double y);
    }

    /**
     * The type of a token.
     */
    private enum Type {
        // Digits
        ZERO, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT, NINE,
        // Operators
        ADDITION, SUBTRACTION, MULTIPLICATION, DIVISION, EXP,
        // Functions
        SIN, COS, TAN, 
        ASIN, ACOS, ATAN, 
        SINH, COSH, TANH,
        SQRT, CBRT,
        LOG, LN,
        ABS,
        // Constants
        PI, E,
        // Other
        OPEN_PARENTHESIS, CLOSE_PARENTHESIS, FUNCTION_OPEN, FUNCTION_CLOSE,
        OPERAND, VARIABLE, DECIMAL, NEGATIVE, SPACE
    }

    /**
     * A partial unit of a mathematical expression. Holds references to the type of the 
     * token, it's value (null if not an operand), a list of sub expressionsfor a function 
     * (null if not a function), and a string representation of the mathematical unit.
     */
    private static class Token {

        /**
         * The type of this token
         */
        public Type type;

        /**
         * If this Token is an operand, constant, or variable, it is equal to the numeric value 
         * of the token. Otherwise null, which is why double object instead of primitive type.
         */
        public Double value;

        /**
         * If this Token is a function it holds references to a list of tokens
         * associated with it, otherwise null.
         */
        public ArrayList<Token> subtokens;


        /**
         * This token represented in string format.
         */
        public String show;

        
        public Token(Type type, Double value, ArrayList<Token> subtokens, String show) {
            this.type = type;
            this.value = value;
            this.subtokens = subtokens;
            this.show = show;
        }

        public boolean isOperator() {
           return operatorMap.containsValue(type);
        }

        public boolean isFunction() {
            return functionMap.containsValue(type);
        }

        public boolean isOperand() {
            return digitMap.containsValue(type) || type == Type.OPERAND;
        }

        public boolean isConstant() {
            return type == Type.PI || type == Type.E;
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

        public Node(Token token) {
            this(token, null, null);
        }
    }

    /**
     * Creates a new expression tree based off an infix expression.
     * @param infix
     */
    public ExpressionTree(String expression) {
        this.expression = expression;
        tokens = lex(expression);
        System.out.println(printTokens());
        tokens = infixToPostfix(tokens);
        condense(tokens);
        root = buildTree(tokens);
        
    }

    
    public double solve() {
        return solve(0);
    }

    public double solve(double x) {
        DecimalFormat df = new DecimalFormat("#.###");
        return Double.valueOf(df.format(solveRec(root, x)));
    }

    private double solveRec(Node<Token> node, double x) {
        if (node.token.isOperand() || node.token.isConstant())
            return node.token.value;
        
        if (node.token.isOperator()) {
            return evaluateMap.get(node.token.type)
                              .evaluate(
                               solveRec(node.left, x), 
                               solveRec(node.right, x));
        }

        if (node.token.isFunction()) {
            return evaluateMap.get(node.token.type)
                              .evaluate(
                               solveRec(node.left, x), 0);
        }

        if (node.token.type == Type.VARIABLE) {
            return x;
        }

        throw new IllegalArgumentException("Unknow operation or function");
    }

    /**
     * Performs a lexical analysis of an infix expression and converts
     * it into a list of tokens.
     * @param infix
     * @return
     */
    public static ArrayList<Token> lex(String infix) {
        ArrayList<Token> tokens = new ArrayList<>();

        for (int i = 0; i < infix.length(); i++) {
            char curChar = infix.charAt(i);

            // empty space
            if (curChar == ' ') {
                tokens.add(new Token(Type.SPACE, null, null, " "));

            // digit
            } else if (Character.isDigit(curChar)) {
                int val = Character.getNumericValue(curChar);
                Type curType = digitMap.get(val);
                tokens.add(new Token(curType, (double) val, null, String.valueOf(curChar)));

            // function
            } else if (Character.isLetter(curChar) && (curChar != X_VARIABLE)                        // x
                                                   && (curChar != 'e')                               // e
                                                   && (curChar != 'p' && infix.charAt(i) != 'i')     // pi
                                                   ) {
                int j = 2; // set to 2 because shortest possible key name is "ln"
                String show = infix.substring(i, i + j);
                
                while (!functionMap.containsKey(show)) {
                    j++;
                    show = infix.substring(i, i + j);
                        
                    // longest possible length of key is 4
                    if (j > 4)
                        throw new IllegalArgumentException("Unknwon function: \"" + show + "\"");
                }

                // contains this key!
                tokens.add(new Token(functionMap.get(show), null, new ArrayList<Token>(), show));
                tokens.add(new Token(Type.FUNCTION_OPEN, null, null, "("));
                i += (j - 1) + 1; // + 1 to skip parenthesis
            
            // variable
            } else if (curChar == X_VARIABLE) {
                tokens.add(new Token(Type.VARIABLE, null, null, "x"));

            // open parenthesis
            } else if (curChar == '(') {
                tokens.add(new Token(Type.OPEN_PARENTHESIS, null, null, "("));
            // close parenthesis
            } else if (curChar == ')') {
                tokens.add(new Token(Type.CLOSE_PARENTHESIS, null, null, ")"));
            // decimal
            } else if (curChar == '.') {
                tokens.add(new Token(Type.DECIMAL, null, null, "."));

            // e
            } else if (curChar == 'e') {
                tokens.add(new Token(Type.E, Math.E, null, "e"));
                  
            // pi
            } else if (curChar == 'p' && infix.charAt(i + 1) == 'i') {
                tokens.add(new Token(Type.PI, Math.PI, null, "pi"));
                i++;
            
            // operator
            } else {
                if (operatorMap.containsKey(curChar)) {
                    Type curType = operatorMap.get(curChar);
                    tokens.add(new Token(curType, null, null, String.valueOf(curChar)));

                } else {
                    throw new IllegalArgumentException("Unkown character: \'" + curChar + "\'");
                }
            }
        }

        // finds function's closing parenthesis
        for (int i = 0; i < tokens.size(); i++) {
            Token t = tokens.get(i);
            if (t.isFunction()) {
                int parenthesisCount = 0;
                // + 2 to skip parenthesis of the function
                for (int j = i + 2; j < tokens.size(); j++) {
                    if (tokens.get(j).type == Type.OPEN_PARENTHESIS) {
                        parenthesisCount++;
                    } else if (tokens.get(j).type == Type.CLOSE_PARENTHESIS && parenthesisCount == 0) {
                        tokens.get(j).type = Type.FUNCTION_CLOSE;
                        break;
                    } else if (tokens.get(j).type == Type.CLOSE_PARENTHESIS) {
                        parenthesisCount--;
                    }
                }
            }
        }
        
        return tokens;
    }

    /**
     * Takes a list of infix tokens and returns the list in postfix order.
     * @param infixTokens
     * @return postfix
     */
    public static ArrayList<Token> infixToPostfix(ArrayList<Token> infixTokens) {
        // the list of tokens to be returned
        ArrayList<Token> postfixTokens = new ArrayList<>();

        Stack<Token> functionStack = new Stack<>();
        Stack<Stack<Token>> operatorStacks = new Stack<>();
        operatorStacks.push(new Stack<Token>());

        // if a variable, constant, or parenthesis has a coeffiecient
        boolean hasCoeff = false;

        for (int i = 0; i < infixTokens.size(); i++) {
            Token t = infixTokens.get(i);

            // space
            if (t.type == Type.SPACE) {
                continue;

            // operand
            } else if (t.isOperand()) {
                boolean seperator = false;

                if (i + 1 < infixTokens.size()) {
                    // next token is either a variable, opening parenthesis, constant, or function. this digit is a coefficient
                    if (infixTokens.get(i + 1).type == Type.VARIABLE || infixTokens.get(i + 1).type == Type.OPEN_PARENTHESIS
                                                                     || infixTokens.get(i + 1).isConstant() 
                                                                     || infixTokens.get(i + 1).isFunction()
                                                                     ) {
                        hasCoeff = true;
                    } 

                    // next token is not an operand or decimal, seperator added to distinguish multi-digit numbers
                    if (!infixTokens.get(i + 1).isOperand() && infixTokens.get(i + 1).type != Type.DECIMAL) {
                        seperator = true;
                    }
                }

                postfixTokens.add(t);
                if (!functionStack.isEmpty())
                    functionStack.peek().subtokens.add(t);

                if (seperator) {
                    postfixTokens.add(new Token(Type.SPACE, null, null, " "));
                    if (!functionStack.isEmpty())
                        functionStack.peek().subtokens.add(new Token(Type.SPACE, null, null, " "));
                } 
            
            // operator
            } else if (t.isOperator()) {

                // negative number
                if (t.type == Type.SUBTRACTION && (infixTokens.get(i + 1).isOperand())) {
                    postfixTokens.add(new Token(Type.NEGATIVE, null, null, "-"));
                    if (!functionStack.isEmpty())
                        functionStack.peek().subtokens.add(new Token(Type.NEGATIVE, null, null, "-"));
                    
                
                // multiplied by -1
                } else if (t.type == Type.SUBTRACTION && (infixTokens.get(i + 1).isFunction() 
                                                      || infixTokens.get(i + 1).isConstant() 
                                                      || infixTokens.get(i + 1).type == Type.OPEN_PARENTHESIS)
                                                      ) {
                    postfixTokens.add(new Token(Type.NEGATIVE, null, null, "-"));
                    postfixTokens.add(new Token(Type.ONE, 1.0, null, "1"));
                    postfixTokens.add(new Token(Type.SPACE, null, null, " "));

                    if (!functionStack.isEmpty()) {
                        functionStack.peek().subtokens.add(new Token(Type.NEGATIVE, null, null, "-"));
                        functionStack.peek().subtokens.add(new Token(Type.ONE, 1.0, null, "1"));
                        functionStack.peek().subtokens.add(new Token(Type.SPACE, null, null, " "));
                    }

                    operatorStacks.peek().push(new Token(Type.MULTIPLICATION, null, null, "*"));
                
                // subtraction or operator
                } else {
                    while (!operatorStacks.peek().isEmpty() && 
                    precedence(t.type) <= precedence(operatorStacks.peek().peek().type)) {
                        postfixTokens.add(operatorStacks.peek().peek());
                        if (!functionStack.isEmpty())
                            functionStack.peek().subtokens.add(operatorStacks.peek().pop());
                    }

                    operatorStacks.peek().push(t);
                } 
                                                   
            // function
            } else if (t.isFunction()) {
                if (hasCoeff) {
                    operatorStacks.peek().push(new Token(Type.MULTIPLICATION, null , null, "*"));
                    hasCoeff = false;
                }
                
                postfixTokens.add(t);
                if (!functionStack.isEmpty())
                    functionStack.peek().subtokens.add(t);

                functionStack.push(t);
             // constant or variable
            } else if (t.isConstant() || t.type == Type.VARIABLE) {
                if (hasCoeff) {
                    operatorStacks.peek().push(new Token(Type.MULTIPLICATION, null , null, "*"));
                    hasCoeff = false;
                }

                postfixTokens.add(t);
                if (!functionStack.isEmpty())
                    functionStack.peek().subtokens.add(t);
                
            // decimal
            } else if (t.type == Type.DECIMAL) {
                postfixTokens.add(t);
                if (!functionStack.isEmpty())
                    functionStack.peek().subtokens.add(t);

            // open parenthesis
            } else if (t.type == Type.OPEN_PARENTHESIS) {
                if (hasCoeff) {
                    operatorStacks.peek().push(new Token(Type.MULTIPLICATION, null, null, "*"));
                    hasCoeff = false;
                }
                operatorStacks.peek().push(new Token(Type.OPEN_PARENTHESIS, null, null, "("));

            // close parenthesis
            } else if (t.type == Type.CLOSE_PARENTHESIS) {
                while (!operatorStacks.peek().isEmpty() && 
                        operatorStacks.peek().peek().type != Type.OPEN_PARENTHESIS) {
                    postfixTokens.add(operatorStacks.peek().peek());
                    if (!functionStack.isEmpty())
                            functionStack.peek().subtokens.add(operatorStacks.peek().peek());
                    operatorStacks.peek().pop();
                }
                operatorStacks.peek().pop();

            // function open parenthesis
            } else if (t.type == Type.FUNCTION_OPEN) {
                operatorStacks.add(new Stack<Token>());

            /// function close parenthesis
            } else if (t.type == Type.FUNCTION_CLOSE) {
                while (!operatorStacks.peek().isEmpty() && 
                        operatorStacks.peek().peek().type != Type.OPEN_PARENTHESIS) {
                            postfixTokens.add(operatorStacks.peek().peek());
                            functionStack.peek().subtokens.add(operatorStacks.peek().pop()); 
                }

                functionStack.pop();
                operatorStacks.pop();

            } else {
                throw new IllegalArgumentException("Unknown token: \"" + t.show + "\"");
            }
        }

        if (operatorStacks.size() != 1)
            throw new IllegalArgumentException("Invalid Expression Format");
        
        // pop all the operators from base stack
        while (!operatorStacks.peek().isEmpty()) {
            if (operatorStacks.peek().peek().type == Type.OPEN_PARENTHESIS)
                throw new IllegalArgumentException("Invalid Expression Format");
            postfixTokens.add(operatorStacks.peek().pop());
        }

        operatorStacks.pop();
        
        return postfixTokens;
    }

    
    /**
     * Combines multi-digit operand tokens and removes empty spaces.
     * 
     * @param tokens
     */
    public static void condense(ArrayList<Token> tokens) {
        if (isCondensed(tokens))
            return;

        String newDigit = "";

        // combines tokens that logically read as a multi-digit number or decimal into a single token
        for (int i = 0; i < tokens.size(); i++) {
            Token t = tokens.get(i);

            if (t.isOperand() || t.type == Type.DECIMAL || t.type == Type.NEGATIVE) {
                newDigit += t.show;

                if (i + 1 < tokens.size()) {
                    // next token not an operand or decimal, end of digit
                    if (!tokens.get(i + 1).isOperand() && tokens.get(i + 1).type != Type.DECIMAL) {
                        int j = newDigit.length();
                        while (j > 0) {
                            tokens.remove(i - (newDigit.length() - 1));
                            j--;
                        }
                    
                        i -= newDigit.length() - 1;
                        tokens.add(i, new Token(Type.OPERAND, Double.parseDouble(newDigit), null, newDigit));
                        newDigit = "";
                    }
                }
            } 
        }

        // remove empty spaces
        for (int i = 0; i < tokens.size(); i++) {
            if (tokens.get(i).type == Type.SPACE)
                tokens.remove(i);
        }

        // recursively perform this operation on each list of subtokens associated with the function
        for (int i = 0; i < tokens.size(); i++) {
            if (tokens.get(i).isFunction())
                condense(tokens.get(i).subtokens);
        }
        
    }

    /**
     * Helper method for parseInfix which determines the precence of certain operators.
     * 
     * @param c
     * @return precedence
     */
    private static int precedence(Type type) {
        switch (type) {
            case ADDITION:
            case SUBTRACTION:
            case NEGATIVE:
                return 1;
            case MULTIPLICATION:
            case DIVISION:
                return 2;
            case EXP:
                return 3;
        }
        return -1;
    }


    /**
     * Creates an expression tree from a list of tokens.
     * 
     * @param tokens
     * @return root node
     */
    public Node<Token> buildTree(ArrayList<Token> tokens) {
        Stack<Node<Token>> stack = new Stack<>();

        for (int i = 0; i < tokens.size(); i++) {
            Token t = tokens.get(i); 
            if (!t.isOperator() && !t.isFunction()) {
                stack.push(new Node<Token>(t));
            } else if (t.isFunction()) {
                stack.push(new Node<Token>(t, buildTree(t.subtokens), null));
                i += t.subtokens.size();
            } else {
                Node<Token> newNode = new Node<>(t);
                newNode.right = stack.pop();
                newNode.left = stack.pop();
                stack.push(newNode);
            }
        }

        return stack.pop();
    }



    /**
     * Prints this node in a string format in the console.
     * 
     * @param node
     */
    public static void printNode(Node<Token> node){
        System.out.println(((Token)node.token).show);
    }

    /**
     * Returns the root of this expression tree.
     * 
     * @return root
     */
    public Node<Token> getRoot() {
        return root;
    }

    /**
     * Returns orginal expression this tree is build on.
     * 
     * @return infix
     */
    public String getExpression() {
        return expression;
    }

    /**
     * This list of tokens is condensed if it does not contain spaces,
     * otherwise it is not condesed.
     * 
     * @param tokens
     * @return true or false
     */
    public static boolean isCondensed(ArrayList<Token> tokens) {
        for (int i = 0; i < tokens.size(); i++) {
            if (tokens.get(i).type == Type.SPACE)
                return false;
        }

        return true;
    }

    /**
     * Returns a string representation of the tokens in this array 
     * in a postfix order.
     * 
     * @return string
     */
    public String printTokens() {
        String ret = "";
        for (Token t : tokens) 
            ret += t.show + " ";

        return ret;
    }

    public static ArrayList<Token> duplicateTokens(ArrayList<Token> tokens) {
        ArrayList<Token> ret = new ArrayList<>();
        for (Token t : tokens) {
            ret.add(t);
        }

        return ret;
    }

    
    /**
     * Displays the strucure of this expression tree by traversing preorder.
     */
    public String toString() {
        return traversePreOrder(root);
    }

    private String traversePreOrder(Node<Token> root) {
        if (root == null) {
            return "";
        }
    
        StringBuilder sb = new StringBuilder();
        sb.append(root.token.show);
    
        String pointerRight = "└──";
        String pointerLeft = (root.right != null) ? "├──" : "└──";
    
        traverseNodes(sb, "", pointerLeft, root.left, root.right != null);
        traverseNodes(sb, "", pointerRight, root.right, false);
    
        return sb.toString();
    }

    private void traverseNodes(StringBuilder sb, String padding, String pointer, 
                               Node<Token> node, boolean hasRightSibling) {
        if (node != null) {
            sb.append("\n");
            sb.append(padding);
            sb.append(pointer);
            sb.append(node.token.show);

            StringBuilder paddingBuilder = new StringBuilder(padding);
            if (hasRightSibling) {
                paddingBuilder.append("│  ");
            } else {
                paddingBuilder.append("   ");
            }

            String paddingForBoth = paddingBuilder.toString();
            String pointerRight = "└──";
            String pointerLeft = (node.right != null) ? "├──" : "└──";

            traverseNodes(sb, paddingForBoth, pointerLeft, node.left, node.right != null);
            traverseNodes(sb, paddingForBoth, pointerRight, node.right, false);
        }
    }
    
    

}