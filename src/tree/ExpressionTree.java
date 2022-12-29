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
 * @version v2.2.2
 * 
 */
public class ExpressionTree {

    /**
     * Root node of this expression tree.
     */
    private Node<Token> root;

    /* 
     *  Original infix expression used for building the expression tree.
     */
    private String infix;

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
    private static Map<String, Type> functionMap = Map.ofEntries(
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
    private static Map<Character, Type> operatorMap = Map.of(
        '+', Type.ADDITION,
        '-', Type.SUBTRACTION,
        '*', Type.MULTIPLICATION,
        '/', Type.DIVISION,
        '^', Type.EXP
    );

    /**
     * Maps the type of a token to its respective mathematical operation/function.
     */
    private static Map<Type, Evaluable> evaluateMap = Map.ofEntries(
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
        OPEN_PARENTHESIS, CLOSE_PARENTHESIS,
        NEGATIVE, DISTRIBUTIVE_NEGATIVE,
        OPERAND, VARIABLE, DECIMAL, SPACE
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
        public ArrayList<Token> partial;

        /**
         * This token represented in string format.
         */
        public String show;

        
        public Token(Type type, Double value, ArrayList<Token> partial, String show) {
            this.type = type;
            this.value = value;
            this.partial = partial;
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

        public boolean isLeaf() {
            return left == null && right == null;
        }
    }

    /**
     * Creates a new expression tree based off an infix expression.
     * @param infix
     */
    public ExpressionTree(String infix) {
        this.infix = infix;
        tokens = parseInfix(infix);
        concatenateExpression(tokens);
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
     * Performs a lexical analysis of an infix expression and creates an ArrayList of 
     * tokens in postfix order.
     * 
     * @param infix
     * @return postfix list
     */
    public static ArrayList<Token> parseInfix(String infix) {
        ArrayList<Token> tokens = new ArrayList<>();
        ArrayList<Token> subtokens = new ArrayList<>();
        Stack<Token> stack = new Stack<>();
        boolean hasCoeff = false;
        boolean distributeNegative = false;

        for (int i = 0; i < infix.length(); i++) {
            char curChar = infix.charAt(i);

            // empty space
            if (curChar == ' ') {
                continue;
            
            // variable
            } else if(curChar == X_VARIABLE) { 
                if (hasCoeff) {
                    stack.push(new Token(Type.MULTIPLICATION, null, null, "*"));
                    hasCoeff = false;
                }

                tokens.add(new Token(Type.VARIABLE, null, null, String.valueOf(curChar)));
                subtokens.add(new Token(Type.VARIABLE, null, null, String.valueOf(curChar)));

            // unary function
            } else if (Character.isLetter(curChar) && (curChar != X_VARIABLE)                    // x
                                                   && (curChar != 'e')                           // e
                                                   && (curChar != 'p' && infix.charAt(i) != 'i') // pi
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
                Token newToken = new Token(functionMap.get(show), null, null, show);
                tokens.add(newToken);
                stack.push(newToken);
                i += j - 1;

            // digit
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
                
                if (i - 1 >= 0) {
                    if (!Character.isDigit(infix.charAt(i - 1)) && infix.charAt(i - 1) != '-'
                                                                && distributeNegative) {
                        tokens.add(new Token(Type.NEGATIVE, null, null, "-"));
                        subtokens.add(new Token(Type.NEGATIVE, null, null, "-"));
                    } else if (infix.charAt(i - 1) == '-' && distributeNegative) {
                        tokens.remove(tokens.size() - 1);
                        subtokens.remove(subtokens.size() - 1);
                    }
                }
                int val = Character.getNumericValue(curChar);
                Type curType = digitMap.get(val);
                tokens.add(new Token(curType, (double) val, null, String.valueOf(curChar)));
                subtokens.add(new Token(curType, (double) val, null, String.valueOf(curChar)));

                if (seperator) {
                    tokens.add(new Token(Type.SPACE, null, null, " "));
                    subtokens.add(new Token(Type.SPACE, null, null, " "));
                }
                    
            // open parenthesis
            } else if (curChar == '(') {
                stack.push(new Token(Type.OPEN_PARENTHESIS, null, null, "("));

            // close parenthesis
            } else if (curChar == ')') {
                while (!stack.isEmpty() && 
                        stack.peek().type != Type.OPEN_PARENTHESIS) {
                    tokens.add(stack.peek()); 
                    subtokens.add(stack.pop());
                }
                stack.pop();

                if (!stack.isEmpty() && stack.peek().isFunction()) {
                    stack.peek().partial = duplicateTokens(subtokens);
                    subtokens.add(0, stack.pop());
                }

                distributeNegative = false;

            // decimal    
            } else if (curChar == '.') {
                tokens.add(new Token(Type.DECIMAL, null, null, "."));
                subtokens.add(new Token(Type.E, Math.E, null, "e"));

            // euler's constant
            } else if (curChar == 'e') {
                tokens.add(new Token(Type.E, Math.E, null, "e"));
                subtokens.add(new Token(Type.E, Math.E, null, "e")); 
            
            // pi
            } else if (curChar == 'p' && (infix.charAt(i + 1) == 'i')) {
                tokens.add(new Token(Type.PI, Math.PI, null, "pi"));
                subtokens.add(new Token(Type.PI, Math.PI, null, "pi"));
                i++;
                    
            // binary operator
            } else {
                Type curType = operatorMap.get(curChar);

                // negative number
                if (curType == Type.SUBTRACTION && (Character.isDigit(infix.charAt(i + 1)))) {
                    tokens.add(new Token(Type.NEGATIVE, null, null, "-"));
                    subtokens.add(new Token(Type.NEGATIVE, null, null, "-"));

                // coefficient of -1
                } else if (curType == Type.SUBTRACTION && Character.isLetter(infix.charAt(i + 1))) {
                    tokens.add(new Token(Type.NEGATIVE, null, null, "-"));
                    tokens.add(new Token(Type.ONE, 1.0 , null, "1"));
                    tokens.add(new Token(Type.SPACE, null , null, " "));

                    if ((infix.charAt(i + 1) == 'p' && infix.charAt(i + 2) == 'i') 
                                                    || infix.charAt(i + 1) == 'e') {
                        subtokens.add(new Token(Type.NEGATIVE, null, null, "-"));
                        subtokens.add(new Token(Type.ONE, 1.0 , null, "1"));
                        subtokens.add(new Token(Type.SPACE, null , null, " "));
                    }
                    

                    stack.push(new Token(Type.MULTIPLICATION, null, null, "*"));

                // distrubutive negative
                } else if (curType == Type.SUBTRACTION && infix.charAt(i + 1) == '(') {
                    distributeNegative = true;
                    
                // operator
                } else {
                    while (!stack.isEmpty() && 
                        precedence(curType) <= precedence(stack.peek().type)) {
                    tokens.add(stack.peek());
                    subtokens.add(stack.peek());
                    stack.pop();
                    }
                    stack.push(new Token(curType, null, null, String.valueOf(curChar)));
                }
                
                
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
     * Combines multi-digit operand tokens and removes empty spaces.
     * 
     * @param tokens
     */
    public static void concatenateExpression(ArrayList<Token> tokens) {
        if (isCondensed(tokens))
            return;

        String newDigit = "";
        // combines tokens that logically read as a multi-digit number or decimal into a single token
        for (int i = 0; i < tokens.size(); i++) {
            Token t = tokens.get(i);

            if (t.isOperand() || t.type == Type.DECIMAL || t.type == Type.NEGATIVE) {
                newDigit += t.show;

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

        // remove empty spaces
        for (int i = 0; i < tokens.size(); i++) {
            if (tokens.get(i).type == Type.SPACE)
                tokens.remove(i);
        }

        // recursively perform this operation on each subtokens associated with the function
        for (int i = 0; i < tokens.size(); i++) {
            if (tokens.get(i).isFunction())
                concatenateExpression(tokens.get(i).partial);
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
    public static Node<Token> buildTree(ArrayList<Token> tokens) {
        Stack<Node<Token>> stack = new Stack<>();

        for (int i = 0; i < tokens.size(); i++) {
            Token t = tokens.get(i); 
            if (!t.isOperator() && !t.isFunction()) {
                stack.push(new Node<Token>(t));
            } else if (t.isFunction()) {
                stack.push(new Node<Token>(t, buildTree(t.partial), null));
                i += t.partial.size();
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
     * Returns infix expression this tree is build on.
     * 
     * @return infix
     */
    public String getInfix() {
        return infix;
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