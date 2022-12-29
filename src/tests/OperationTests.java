package tests;

import tree.*;
import static org.junit.Assert.fail;
import org.junit.Test;

public class OperationTests {

   /* ------------------------------ ADDITION ------------------------------ */

   @Test
   public void basicAddition_SingleDigit() {
      ExpressionTree t = new ExpressionTree("5 + 4");
      if (t.solve() != 9.0)
         fail();
   }

   @Test
   public void basicAddition_MultiDigit() {
      ExpressionTree t = new ExpressionTree("15 + 40");
      if (t.solve() != 55.0)
         fail();
   }

   @Test
   public void basicAddition_SingleDigit_Decimal_1() {
      ExpressionTree t = new ExpressionTree("5.0 + 4");
      if (t.solve() != 9.0)
         fail();
   }

   @Test
   public void basicAddition_SingleDigit_Decimal_2() {
      ExpressionTree t = new ExpressionTree("5.0 + 4.0");
      if (t.solve() != 9.0)
         fail();
   }

   @Test
   public void basicAddition_SingleDigit_Decimal_3() {
      ExpressionTree t = new ExpressionTree("5.7 + 4.63");
      if (t.solve() != 10.33)
         fail();
   }

   @Test
   public void basicAddition_MultiDigit_Decimal_1() {
      ExpressionTree t = new ExpressionTree("12.2 + 9");
      if (t.solve() != 21.2)
         fail();
   }

   @Test
   public void basicAddition_MultiDigit_Decimal_2() {
      ExpressionTree t = new ExpressionTree("12.2 + 14.8");
      if (t.solve() != 27.0)
         fail();
   }

   /* ------------------------------ SUBTRACTION ------------------------------ */

   @Test
   public void basicbasicSubtraction_SingleDigit() {
      ExpressionTree t = new ExpressionTree("5 - 4");
      if (t.solve() != 1.0)
         fail();
   }

   @Test
   public void basicbasicSubtraction_MultiDigit() {
      ExpressionTree t = new ExpressionTree("30 - 10");
      if (t.solve() != 20.0)
         fail();
   }

   @Test
   public void basicbasicSubtraction_SingleDigit_Decimal_1() {
      ExpressionTree t = new ExpressionTree("5.2 - 4");
      if (t.solve() != 1.2)
         fail();
   }

   @Test
   public void basicSubtraction_SingleDigit_Decimal_2() {
      ExpressionTree t = new ExpressionTree("11.5 - 9.4");
      if (t.solve() != 2.1)
         fail();
   }

   @Test
   public void basicSubtraction_SingleDigit_Decimal_3() {
      ExpressionTree t = new ExpressionTree("5.7 - 4.63");
      if (t.solve() != 1.07)
         fail();
   }

   @Test
   public void basicSubtraction_MultiDigit_Decimal_1() {
      ExpressionTree t = new ExpressionTree("12.2 - 9");
      if (t.solve() != 3.2)
         fail();
   }

   @Test
   public void basicSubtraction_MultiDigit_Decimal_2() {
      ExpressionTree t = new ExpressionTree("106.8 - 14.9");
      if (t.solve() != 91.9)
         fail();
   }

   @Test
   public void negativeTest_1() {
      ExpressionTree t = new ExpressionTree("-(100 - -5)");
      if (t.solve() != -105.0)
         fail();
   }

   /*
    * ------------------------------ MULTIPLICATION ------------------------------
    */

   @Test
   public void basicbasicMultiplication_SingleDigit() {
      ExpressionTree t = new ExpressionTree("5 * 4");
      if (t.solve() != 20.0)
         fail();
   }

   @Test
   public void basicbasicMultiplication_MultiDigit() {
      ExpressionTree t = new ExpressionTree("30 * 10");
      if (t.solve() != 300.0)
         fail();
   }

   @Test
   public void basicbasicMultiplication_SingleDigit_Decimal_1() {
      ExpressionTree t = new ExpressionTree("5.2 * 4");
      if (t.solve() != 20.8)
         fail();
   }

   @Test
   public void basicMultiplication_SingleDigit_Decimal_2() {
      ExpressionTree t = new ExpressionTree("11.5 * 9.4");
      if (t.solve() != 108.1)
         fail();
   }

   @Test
   public void basicMultiplication_SingleDigit_Decimal_3() {
      ExpressionTree t = new ExpressionTree("5.7 * 4.63");
      if (t.solve() != 26.391)
         fail();
   }

   @Test
   public void basicMultiplication_MultiDigit_Decimal_1() {
      ExpressionTree t = new ExpressionTree("12.2 * 9");
      if (t.solve() != 109.8)
         fail();
   }

   @Test
   public void basicMultiplication_MultiDigit_Decimal_2() {
      ExpressionTree t = new ExpressionTree("106.8 * 14.9");
      if (t.solve() != 1591.32)
         fail();
   }

   /* ------------------------------ DIVISION ------------------------------ */

   @Test
   public void basicbasicDivision_SingleDigit_1() {
      ExpressionTree t = new ExpressionTree("5 / 4");
      if (t.solve() != 1.25)
         fail();
   }

   @Test
   public void basicbasicDivision_SingleDigit_2() {
      ExpressionTree t = new ExpressionTree("8 / 4");
      if (t.solve() != 2.0)
         fail();
   }

   @Test
   public void basicbasicDivision_MultiDigit() {
      ExpressionTree t = new ExpressionTree("30 / 12");
      if (t.solve() != 2.5)
         fail();
   }

   @Test
   public void basicbasicDivision_SingleDigit_Decimal_1() {
      ExpressionTree t = new ExpressionTree("5.2 / 4");
      if (t.solve() != 1.3)
         fail();
   }

   @Test
   public void basicDivision_SingleDigit_Decimal_2() {
      ExpressionTree t = new ExpressionTree("11.5 / 9.4");
      if (t.solve() != 1.223)
         fail();
   }

   @Test
   public void basicDivision_SingleDigit_Decimal_3() {
      ExpressionTree t = new ExpressionTree("5.7 / 4.63");
      if (t.solve() != 1.231)
         fail();
   }

   @Test
   public void basicDivision_MultiDigit_Decimal_1() {
      ExpressionTree t = new ExpressionTree("12.2 / 9");
      if (t.solve() != 1.356)
         fail();
   }

   @Test
   public void basicDivision_MultiDigit_Decimal_2() {
      ExpressionTree t = new ExpressionTree("106.8 / 14.9");
      if (t.solve() != 7.168)
         fail();
   }

   /* ------------------------------ EXPONENT ------------------------------ */

   @Test
   public void basicExponent_SingleDigit_1() {
      ExpressionTree t = new ExpressionTree("5^2");
      if (t.solve() != 25.0)
         fail();
   }

   @Test
   public void basicExponent_SingleDigit_2() {
      ExpressionTree t = new ExpressionTree("2^3.1");
      if (t.solve() != 8.574)
         fail();
   }

   @Test
   public void basicExponent_SingleDigit_3() {
      ExpressionTree t = new ExpressionTree("1.5^2.7");
      if (t.solve() != 2.988)
         fail();
   }

   @Test
   public void basicExponent_MultiDigit() {
      ExpressionTree t = new ExpressionTree("5^10");
      if (t.solve() != 9765625.0)
         fail();
   }

   @Test
   public void basicExponent_MultiDigit_Decimal_1() {
      ExpressionTree t = new ExpressionTree("12.4^3");
      if (t.solve() != 1906.624)
         fail();
   }

   @Test
   public void basicExponent_MultiDigit_Decimal_2() {
      ExpressionTree t = new ExpressionTree("2^10.1");
      if (t.solve() != 1097.496)
         fail();
   }

}
