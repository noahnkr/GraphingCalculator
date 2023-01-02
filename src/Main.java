import tree.ExpressionTree;

public class Main {
    public static void main(String[] args) {
        String expression = "(1 - sin(cos(pi + 2) * (1/212.5)) + 7)^4";
        ExpressionTree t = new ExpressionTree(expression);
        System.out.println(t.toString());
        System.out.println(t.printTokens());
        System.out.println(t.solve());
    }
    
} 
