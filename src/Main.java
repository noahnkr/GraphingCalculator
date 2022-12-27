import tree.ExpressionTree;

public class Main {
    public static void main(String[] args) {
        String expression = "12.2 / 9";
        ExpressionTree t = new ExpressionTree(expression);
        System.out.println(t.toString());
        System.out.println("Actual: " + t.solve());
        
    }
    
} 
