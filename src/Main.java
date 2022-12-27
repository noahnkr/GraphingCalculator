public class Main {
    public static void main(String[] args) {
        String expression = "sin(5x) + 4";
        ExpressionTree t = new ExpressionTree(expression);
        t.levelOrderTraversal(t.getRoot());
    }
    
}
