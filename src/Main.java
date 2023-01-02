import tree.ExpressionTree;

public class Main {
    public static void main(String[] args) {
  
        String expression = "sin(cos(x) + 4)";
        ExpressionTree t = new ExpressionTree(expression);
        System.out.println(t.toString());
        System.out.println(t.printTokens());
        System.out.println(t.solve(Math.PI));
    }
    
} 
