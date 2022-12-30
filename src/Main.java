import tree.ExpressionTree;

public class Main {
    public static void main(String[] args) {

        String expression = "(sin(x))";
        ExpressionTree t = new ExpressionTree(expression);
        System.out.println(t.toString());
        System.out.println(t.printTokens());
        System.out.println("ANSWER: " + t.solve(1));
    }
    
} 
