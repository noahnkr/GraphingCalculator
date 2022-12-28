import tree.ExpressionTree;

public class Main {
    public static void main(String[] args) {
        String expression = "sin(cos(tan(acos(1))) + pi)";
        ExpressionTree t = new ExpressionTree(expression);
        System.out.println(t.toString());
        System.out.println(t.solve(2));
    }
    
} 
