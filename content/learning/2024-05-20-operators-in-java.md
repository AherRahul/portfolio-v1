---
title: "2. Operators in JAVA"
date: "2024-05-20"
eventName: "MODULE 1: Introduction to Programming"
location: ""
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/learning/2024-05-20-operators-in-java.md"
type: "lecture-notes"
language: "en"
topics:
  - java
  - beginner-programming
---

Java provides many types of operators which can be used according to the need. They are classified based on the functionality they provide. In this article, we will learn about Java Operators and learn all their types.

## Agenda

- Operators
- Basic Rules
- Quizzes
- Concatenation
- Intro to variable

## Operators

> What are the Java Operators?

Operators in Java are the symbols used for performing specific operations in Java. Operators make tasks like addition, multiplication, etc which look easy although the implementation of these tasks is quite complex.


> Types of Operators in Java

There are multiple types of operators in Java all are mentioned below:
- Arithmetic Operators
- Unary Operators
- Assignment Operator
- Relational Operators
- Logical Operators
- Ternary Operator
- Bitwise Operators
- Shift Operators
- instance of operator

> ## 1. Arithmetic Operators
They are used to perform simple arithmetic operations on primitive data types. 
- '*' : Multiplication
- / : Division
- % : Modulo
- '+' : Addition
- – : Subtraction

# Example:

```
// Java Program to implement
// Arithmetic Operators
import java.io.*;

// Drive Class
class Test {
      // Main Function
    public static void main (String[] args) {
          
        // Arithmetic operators
        int a = 10;
        int b = 3;
      
        System.out.println("a + b = " + (a + b));
        System.out.println("a - b = " + (a - b));
        System.out.println("a * b = " + (a * b));
        System.out.println("a / b = " + (a / b));
        System.out.println("a % b = " + (a % b));
          
    }
}
```

# Output
```
a + b = 13
a - b = 7
a * b = 30
a / b = 3
a % b = 1
```

> ## 2. Unary Operators

Unary operators need only one operand. They are used to increment, decrement, or negate a value. 

- **– : Unary minus**, used for negating the values.
- **+ : Unary plus** indicates the positive value (numbers are positive without this, however). It performs an automatic conversion to int when the type of its operand is the byte, char, or short. This is called unary numeric promotion.
- **++ : Increment operator**, used for incrementing the value by 1. There are two varieties of increment operators. 
    - **Post-Increment**: Value is first used for computing the result and then incremented.
    - **Pre-Increment**: Value is incremented first, and then the result is computed.
- **– –  : Decrement operator**, used for decrementing the value by 1. There are two varieties of decrement operators. 
    - **Post-decrement**: Value is first used for computing the result and then decremented.
    - **Pre-Decrement**: The value is decremented first, and then the result is computed.
- **! : Logical not operator**, used for inverting a boolean value.

# Example:
```
// Java Program to implement
// Unary Operators
import java.io.*;

// Driver Class
class Test {
      // main function
    public static void main(String[] args)
    {
        // Interger declared
        int a = 10;
        int b = 10;

        // Using unary operators
        System.out.println("Postincrement : " + (a++));
        System.out.println("Preincrement : " + (++a));

        System.out.println("Postdecrement : " + (b--));
        System.out.println("Predecrement : " + (--b));
    }
}
```

# Output
```
Postincrement : 10
Preincrement : 12
Postdecrement : 10
Predecrement : 8
```

>  ## 3. Assignment Operator

‘=’ Assignment operator is used to assign a value to any variable. It has right-to-left associativity, i.e. value given on the right-hand side of the operator is assigned to the variable on the left, and therefore right-hand side value must be declared before using it or should be a constant. 

The general format of the assignment operator is:

```
variable = value;
```

In many cases, the assignment operator can be combined with other operators to build a shorter version of the statement called a **Compound Statement**. For example, instead of a = a+5, we can write a += 5. 

- +=, for adding the left operand with the right operand and then assigning it to the variable on the left.
- -=, for subtracting the right operand from the left operand and then assigning it to the variable on the left.
- *=, for multiplying the left operand with the right operand and then assigning it to the variable on the left.
- /=, for dividing the left operand by the right operand and then assigning it to the variable on the left.
- %=, for assigning the modulo of the left operand by the right operand and then assigning it to the variable on the left.

# Example:
```
// Java Program to implement
// Assignment Operators
import java.io.*;

// Driver Class
class Test {
    // Main Function
    public static void main(String[] args)
    {
        
        // Assignment operators
        int f = 7;
        System.out.println("f += 3: " + (f += 3));
        System.out.println("f -= 2: " + (f -= 2));
        System.out.println("f *= 4: " + (f *= 4));
        System.out.println("f /= 3: " + (f /= 3));
        System.out.println("f %= 2: " + (f %= 2));
        System.out.println("f &= 0b1010: " + (f &= 0b1010));
        System.out.println("f |= 0b1100: " + (f |= 0b1100));
        System.out.println("f ^= 0b1010: " + (f ^= 0b1010));
        System.out.println("f <<= 2: " + (f <<= 2));
        System.out.println("f >>= 1: " + (f >>= 1));
        System.out.println("f >>>= 1: " + (f >>>= 1));
    }
}
```

# Output
```
f += 3: 10
f -= 2: 8
f *= 4: 32
f /= 3: 10
f %= 2: 0
f &= 0b1010: 0
f |= 0b1100: 12
f ^= 0b1010: 6
f <<= 2: 24
f >>= 1: 12
f >>>= 1: 6
```

> ## 4. Relational Operators

These operators are used to check for relations like equality, greater than, and less than. They return boolean results after the comparison and are extensively used in looping statements as well as conditional if-else statements. The general format is, 

```
variable relation_operator value
```

Some of the relational operators are- 

-  **==, Equal** to returns true if the left-hand side is equal to the right-hand side.
- **!=, Not Equal** to returns true if the left-hand side is not equal to the right-hand side.
- **<, less than**: returns true if the left-hand side is less than the right-hand side.
- **<=, less than or equal to** returns true if the left-hand side is less than or equal to the right-hand side.
- **>, Greater than**: returns true if the left-hand side is greater than the right-hand side.
- **>=, Greater than or equal to** returns true if the left-hand side is greater than or equal to the right-hand side.

# Example:
```
// Java Program to implement
// Relational Operators
import java.io.*;

// Driver Class
class Test {
    // main function
    public static void main(String[] args)
    {
        // Comparison operators
        int a = 10;
        int b = 3;
        int c = 5;

        System.out.println("a > b: " + (a > b));
        System.out.println("a < b: " + (a < b));
        System.out.println("a >= b: " + (a >= b));
        System.out.println("a <= b: " + (a <= b));
        System.out.println("a == c: " + (a == c));
        System.out.println("a != c: " + (a != c));
    }
}
```
# Output
```
a > b: true
a < b: false
a >= b: true
a <= b: false
a == c: false
a != c: true
```

> ## 5. Logical Operators
These operators are used to perform “logical AND” and “logical OR” operations, i.e., a function similar to AND gate and OR gate in digital electronics. One thing to keep in mind is the second condition is not evaluated if the first one is false, i.e., it has a short-circuiting effect. Used extensively to test for several conditions for making a decision. Java also has “Logical NOT”, which returns true when the condition is false and vice-versa

Conditional operators are:

- **&&, Logical AND**: returns true when both conditions are true.
- **||, Logical OR**: returns true if at least one condition is true.
- **!, Logical NOT**: returns true when a condition is false and vice-versa

# Example:
```
// Java Program to implemenet
// Logical operators
import java.io.*;

// Driver Class
class GFG {
      // Main Function
    public static void main (String[] args) {
        // Logical operators
        boolean x = true;
        boolean y = false;
      
        System.out.println("x && y: " + (x && y));
        System.out.println("x || y: " + (x || y));
        System.out.println("!x: " + (!x));
    }
}
```
# Output
```
x && y: false
x || y: true
!x: false
```

> ## 6. Ternary operator
The ternary operator is a shorthand version of the if-else statement. It has three operands and hence the name Ternary.

The general format is:
```
condition ? if true : if false
```

The above statement means that if the condition evaluates to true, then execute the statements after the ‘?’ else execute the statements after the ‘:’.  
# Example:
```
// Java program to illustrate
// max of three numbers using
// ternary operator.
public class operators {
    public static void main(String[] args)
    {
        int a = 20, b = 10, c = 30, result;

        // result holds max of three
        // numbers
        result
            = ((a > b) ? (a > c) ? a : c : (b > c) ? b : c);
        System.out.println("Max of three numbers = "
                           + result);
    }
}
```
# Output
```
Max of three numbers = 30
```

> ## 7. Bitwise Operators
These operators are used to perform the manipulation of individual bits of a number. They can be used with any of the integer types. They are used when performing update and query operations of the Binary indexed trees. 

- **&, Bitwise AND operator**: returns bit by bit AND of input values.
- **|, Bitwise OR operator**: returns bit by bit OR of input values.
- **^, Bitwise XOR operator**: returns bit-by-bit XOR of input values.
- **~, Bitwise Complement Operator**: This is a unary operator which returns the one’s complement representation of the input value, i.e., with all bits inverted.

# Example
```
// Java Program to implement
// bitwise operators
import java.io.*;

// Driver class
class GFG {
    // main function
    public static void main(String[] args)
    {
        // Bitwise operators
        int d = 0b1010;
        int e = 0b1100;
        System.out.println("d & e: " + (d & e));
        System.out.println("d | e: " + (d | e));
        System.out.println("d ^ e: " + (d ^ e));
        System.out.println("~d: " + (~d));
        System.out.println("d << 2: " + (d << 2));
        System.out.println("e >> 1: " + (e >> 1));
        System.out.println("e >>> 1: " + (e >>> 1));
    }
}
```
# Output
```
d & e: 8
d | e: 14
d ^ e: 6
~d: -11
d << 2: 40
e >> 1: 6
e >>> 1: 6
```

> ## 8. Shift Operators
These operators are used to shift the bits of a number left or right, thereby multiplying or dividing the number by two, respectively. They can be used when we have to multiply or divide a number by two. General format- 

```
number shift_op number_of_places_to_shift;
```

- **<<, Left shift operator**: shifts the bits of the number to the left and fills 0 on voids left as a result. Similar effect as multiplying the number with some power of two.
- **>>, Signed Right shift operator**: shifts the bits of the number to the right and fills 0 on voids left as a result. The leftmost bit depends on the sign of the initial number. Similar effect to dividing the number with some power of two.
- **>>>, Unsigned Right shift operator**: shifts the bits of the number to the right and fills 0 on voids left as a result. The leftmost bit is set to 0.

# Example
```
// Java Program to implement
// shift operators
import java.io.*;

// Driver Class
class GFG {
    // main function
    public static void main(String[] args)
    {
        int a = 10;
    
          // using left shift
        System.out.println("a<<1 : " + (a << 1));
      
        // using right shift
        System.out.println("a>>1 : " + (a >> 1));
    }
}

```

# Output
a<<1 : 20
a>>1 : 5


> ## 9. instanceof operator
The instance of the operator is used for type checking. It can be used to test if an object is an instance of a class, a subclass, or an interface. General format- 

```
object instance of class/subclass/interface
```

# Example
```
// Java program to illustrate
// instance of operator

class operators {
    public static void main(String[] args)
    {

        Person obj1 = new Person();
        Person obj2 = new Boy();

        // As obj is of type person, it is not an
        // instance of Boy or interface
        System.out.println("obj1 instanceof Person: "
                           + (obj1 instanceof Person));
        System.out.println("obj1 instanceof Boy: "
                           + (obj1 instanceof Boy));
        System.out.println("obj1 instanceof MyInterface: "
                           + (obj1 instanceof MyInterface));

        // Since obj2 is of type boy,
        // whose parent class is person
        // and it implements the interface Myinterface
        // it is instance of all of these classes
        System.out.println("obj2 instanceof Person: "
                           + (obj2 instanceof Person));
        System.out.println("obj2 instanceof Boy: "
                           + (obj2 instanceof Boy));
        System.out.println("obj2 instanceof MyInterface: "
                           + (obj2 instanceof MyInterface));
    }
}

class Person {
}

class Boy extends Person implements MyInterface {
}

interface MyInterface {
}

```
# Output

```
obj1 instanceof Person: true
obj1 instanceof Boy: false
obj1 instanceof MyInterface: false
obj2 instanceof Person: true
obj2 instanceof Boy: true
obj2 instanceof MyInterface: true
```



## Interesting Questions about Java Operators 

> ## 1. Precedence and Associativity:
There is often confusion when it comes to hybrid equations which are equations having multiple operators. The problem is which part to solve first. There is a golden rule to follow in these situations. If the operators have different precedence, solve the higher precedence first. If they have the same precedence, solve according to associativity, that is, either from right to left or from left to right. The explanation of the below program is well written in comments within the program itself.

<img 
src= "https://media.geeksforgeeks.org/wp-content/uploads/operators.png" 
alt = "" width ="700" height = "350">

```
public class operators {
    public static void main(String[] args)
    {
        int a = 20, b = 10, c = 0, d = 20, e = 40, f = 30;

        // precedence rules for arithmetic operators.
        // (* = / = %) > (+ = -)
        // prints a+(b/d)
        System.out.println("a+b/d = " + (a + b / d));

        // if same precedence then associative
        // rules are followed.
        // e/f -> b*d -> a+(b*d) -> a+(b*d)-(e/f)
        System.out.println("a+b*d-e/f = "
                           + (a + b * d - e / f));
    }
}
```

# Output
```
a+b/d = 20
a+b*d-e/f = 219
```

> ## 2. Be a Compiler: 
The compiler in our systems uses a lex tool to match the greatest match when generating tokens. This creates a bit of a problem if overlooked. For example, consider the statement a=b+++c; too many of the readers might seem to create a compiler error. But this statement is absolutely correct as the token created by lex is a, =, b, ++, +, c. Therefore, this statement has a similar effect of first assigning b+c to a and then incrementing b. Similarly, a=b+++++c; would generate an error as the tokens generated are a, =, b, ++, ++, +, c. which is actually an error as there is no operand after the second unary operand.

```
public class operators {
    public static void main(String[] args)
    {
        int a = 20, b = 10, c = 0;

        // a=b+++c is compiled as
        // b++ +c
        // a=b+c then b=b+1
        a = b++ + c;
        System.out.println("Value of a(b+c), "
                           + " b(b+1), c = " + a + ", " + b
                           + ", " + c);

        // a=b+++++c is compiled as
        // b++ ++ +c
        // which gives error.
        // a=b+++++c;
        // System.out.println(b+++++c);
    }
}

```

# Output
```
Value of a(b+c),  b(b+1), c = 10, 11, 0
```

> ## 3. Using + over (): 
When using the + operator inside system.out.println() make sure to do addition using parenthesis. If we write something before doing addition, then string addition takes place, that is, associativity of addition is left to right, and hence integers are added to a string first producing a string, and string objects concatenate when using +. Therefore it can create unwanted results.

```
public class operators {
    public static void main(String[] args)
    {
        int x = 5, y = 8;

        // concatenates x and y as
        // first x is added to "concatenation (x+y) = "
        // producing "concatenation (x+y) = 5"
        // and then 8 is further concatenated.
        System.out.println("Concatenation (x+y)= " + x + y);

        // addition of x and y
        System.out.println("Addition (x+y) = " + (x + y));
    }
}
```

# Output
```
Concatenation (x+y)= 58
Addition (x+y) = 13
```

## Advantages of Operators in Java
The advantages of using operators in Java are mentioned below:

- **Expressiveness**: Operators in Java provide a concise and readable way to perform complex calculations and logical operations.
- **Time-Saving**: Operators in Java save time by reducing the amount of code required to perform certain tasks.
- **Improved Performance**: Using operators can improve performance because they are often implemented at the hardware level, making them faster than equivalent Java code.

## Disadvantages of Operators in Java
The disadvantages of Operators in Java are mentioned below:

- **Operator Precedence**: Operators in Java have a defined precedence, which can lead to unexpected results if not used properly.
- **Type Coercion**: Java performs implicit type conversions when using operators, which can lead to unexpected results or errors if not used properly.

---


## Basic Rules

1. Statements end with a **semicolon ( ; )**
2. JAVA is **Case Sensitive**.
3. In order to print text, we use **double quotes ( " " )**
4. {}, (), " " --> All of these are in pairs.
5. Comments → 
    * **Single-line comments** start with two forward slashes ( // ). Any text between // and the end of the line is ignored by Java (will not be executed).
    * **Multi-line comments** start with /* and ends with \*/. Any text between /* and */ will be ignored by Java.
6. **System.out.print(); →** Just type the output
7. **System.out.println(); →** Just type the output and press Enter [cursor moves to the next line]

---

## Quizzes
Now, let's check how much they remember from the last class with the help of quizzes.

> Q1. What will be output for this ?
```
System.out.print("Welcome in playground")
```
# Choices
- [ ] Welcome Home
- [ ] Welcome in playground
- [x] Error
- [ ] All the options are correct


---


> Q2. What will be output for this ?
```
system.out.print("Hi Everyone");
```
# Choices
- [ ] Hi Everyone
- [ ] Bye Everyone
- [x] Error
- [ ] Welcome Everyone

---

> Q3. What will be output for this ?
```
System.ouT.print("Hi Guys");
```
# Choices
- [ ] Hi Guys
- [ ] Bye Guys
- [x] Error
- [ ] Welcome Guys

---


> Q4. What will be output for this ?
```
System.out.print(Good Morning Everyone);
```
# Choices
- [ ] Good Morning Everyone
- [ ] Good Afternoon Everyone
- [x] Error
- [ ] Good Night Everyone

---

> Q5. What will be output for this ?
```
System.out.print('Happy Thursday');
```
# Choices
- [ ] Happy Thursday
- [ ] Sad Thursday
- [x] Error
- [ ] All the options are correct

---
> Q6. What will be output for this ?

```
System.out.print(10 + 20); 
```
# Choices
- [x] 30
- [ ] 10+20
- [ ] Error

---

> Q7. What will be output for this ?
```
System.out.print(10 - 25);
```
# Choices
- [x] -15
- [ ] 15
- [ ] 10
- [ ] Error

---

> Q8. What will be output for this ?
```
System.out.println("Hello");
System.out.print("World);
```

# Choices
- [ ] Hello<br>World
- [ ] HelloWorld
- [x] Error
- [ ] inky pinky po

---
> Q9. What will be output for this ?
```
System.out.print("Hello");
System.out.println("World");
```

# Choices
- [ ] Hello<br>World
- [x] HelloWorld
- [ ] Error
- [ ] inky pinky po

---

> Q10. What will be output for this ?
```
System.out.println("Hello");
System.out.print("World");
System.out.println("Welcome")
```

# Choices

- [ ] Hello<br>World<br>Welcome
- [ ] HelloWorldWelcome
- [x] Error
- [ ] Hello<br>WorldWelcome

---

> Q11. What will be output for this ?
```
System.out.printLN("Hello");
System.out.println("World);
```

# Choices
- [ ] Hello<br>World
- [ ] HelloWorld
- [x] Error
- [ ] inky-pinky-po

---
> Q12. What will be output for this ?
```
Which of the follwing are operators?
```
# Choices
- [ ] ( + )
- [ ] ( - )
- [ ] ( * )
- [ ] ( / )
- [x] All of them
---

> Q13. What is the outup.?
```
10+30
In the given expression choose the operands.
```
# Choices
- [ ] (+)
- [ ] 10
- [ ] 30
- [x] Both 10 and 30

**Explanation of Quiz :** 
Operator : + 
Operands : 10 and 30

Explain using one more example if needed.

Numbers -> 2 types
1. Decimal -> Numbers that have Decimal point
Ex. 4.67, 0.986, 20.73, 2.0
2. Non Decimal / Integer -> Any +ve, -ve or 0
Ex. 7, -30, 0, -7
---

> Q14. What will be output for this ?
```
System.out.print(5 + 8);
```

# Choices
- [ ] 11
- [ ] 12
- [x] 13
- [ ] 14

---


> Q15. What will be output for this ?
```
System.out.print(5 - 8);
```

# Choices
- [ ] -1
- [ ] -2
- [x] -3
- [ ] -4

---


> Q16. What will be output for this ?
```
System.out.print(5 * 8);
```

# Choices

- [ ] 30
- [ ] 32
- [x] 40
- [ ] 42

---


> Q17 What will be output for this ?
```
System.out.print(8 / 2);
```

# Choices
- [ ] 3
- [x] 4
- [ ] 5
- [ ] 6


---


> Q18. What will be output for this ?
```
System.out.print(10 / 3);
```

# Choices

- [ ] 3.3333
- [x] 3
- [ ] Error
- [ ] None of them

**Explanation :**
In calculator, 10 / 3 = 3.33333. But in JAVA, we get 3 (round-off).


**Rule :**  In JAVA, when you divide (/) integers we only get quotient.

---


> Q19. What will be output for this ?
```
System.out.print(24 / 9);
```

# Choices

- [ ] 1
- [ ] 2.54
- [x] 2
- [ ] 3

---


> Q20. What will be output for this ?
```
System.out.print(3 / 6);
```

# Choices
- [ ] 1
- [x] 0
- [ ] Error

---


> Q21. What will be output for this ?
```
System.out.print(24 / 0);
```

# Choices
- [ ] Infinite
- [ ] 24
- [ ] 0
- [x] Error

**Rule:** Division of integers by zero is not possible in JAVA

---


> Q22. What will be output for this ?
```
System.out.print(6 * 7 / 6);
```

# Choices
- [x] 7
- [ ] 6
- [ ] None of them
- [ ] All of them


**Explanation:**
<img 
src= "https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/050/233/original/upload_62530fdedbeb3e0a6c288afc122c7b4b.png?1695416761" 
alt = "" width ="700" height = "350">

But we cannot have two answers for the same expression. So, there must be some rules in place to get the output.

---


## Priority in Operators:

   1. Rank 1 :  **()**
   2. Rank 2 : __*__ , __/__
   3. Rank 3 : __+__ , __-__ 

### Few important rules of doing operations 
 
* **Rule 1 :**<br> If we have same priority operators, whichever comes first from left to right that will be evaluated first.
* **Rule 2 :**<br> If we have different priority operators, whichever has highest priority that will be evaluated first.

**Explanation:**
Here, * and / have same priority. Because * comes first we will evaluate 6 * 7 will be evaluated first.
=> 6 * 7 / 6 
=> 42 / 6 
=> 7

---


> Q1. What will be output for this ?
```
System.out.print(4 + 3 * 6 - 7 / 2);
```

# Choices
- [ ] 16
- [ ] 17
- [ ] 18
- [x] 19

**Explanation:**
Between * and / we will be evaluating multiply first and then divide. 
=> 4 + 3 * 6 - 7 / 2 
=> 4 + 18 - 7 / 2 
=> 4 + 18 - 3 
=> 22 - 3 
=> 19

---

> Q2. What will be output for this ?

```
System.out.print(5 + 2 * 3);
```

# Choices
- [ ] 21
- [ ] 17
- [x] 11
- [ ] Error

**Explanation:**
Here, * has higher priority.
=> 5 + 2 * 3 
=> 5 + 6 
=> 11

---

> Q3. What will be output for this ?
```
System.out.print(5 + 15 / 5 + 6 * 3);
```

# Choices
- [ ] 30
- [x] 26
- [ ] 11
- [ ] Error

**Explanation:**
=> 5 + 15 / 5 + 6 * 3
=> 5 + 3 + 6 * 3 
=> 5 + 3 + 18
=> 8 + 18
=> 26

---

> Q4. What will be output for this ?
```
System.out.print(7 - 2 * 4 + 18 / 3);
```

# Choices
- [ ] 15
- [x] 5
- [ ] 30
- [ ] Error

**Explanation:**
=> 7 - 2 * 4 + 18 / 3
=> 7 - 8 + 18 / 3
=> 7 - 8 + 6
=> -1 + 6
=> 5

---

> Q5. What will be output for this ?
```
System.out.print(3 * 4 / 2 + 7 + 3 - 4 / 2);
```

# Choices
- [ ] 21
- [x] 14
- [ ] 11
- [ ] Error

**Explanation:**
=> 3 * 4 / 2 + 7 + 3 - 4 / 2
=> 12 / 2 + 7 + 3 - 4 / 2
=> 6 + 7 + 3 - 4 / 2
=> 6 + 7 + 3 - 2
=> 13 + 3 - 2
=> 16 - 2
=> 14

---

> Q6. What will be output for this ?
```
System.out.print(5 + 2 * 4 + 8 - 6 + 12 / 4);
```

# Choices
- [ ] 25
- [x] 18
- [ ] 16
- [ ] Error

**Explanation:**
=> 5 + 2 * 4 + 8 - 6 + 12 / 4
=> 5 + 8 + 8 - 6 + 12 / 4
=> 5 + 8 + 8 - 6 + 3
=> 13 + 8 - 6 + 3
=> 21 - 6 + 3
=> 15 + 3
=> 18

---

> Q7. What will be output for this ?
```
System.out.print( (5 + 2) * 3 );
```

# Choices
- [x] 21
- [ ] 17
- [ ] 11
- [ ] Error

**Explanation:**
=> (5 + 2) * 3) 
=> 7 * 3
=> 21

---

> Q8. What will be output for this ?
```java
System.out.print("Hello" + "World");
```
# Choices
- [ ] Hello<br>World
- [x] HelloWorld
- [ ] Error
- [ ] I'm sleeping, Don't Disturb

**Explanation:** 

<img src = "https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/050/234/original/upload_9d8f2e7e5fa8e1f3b5bdd0b1c4c521c9.png?1695417058"
width = "700" height = "450">

**Rule:** With + operator, If one Operand is text then we concatenate both Operands 

---

> Q9. What will be output for this ?
```
System.out.print("Hi" + "Students" + "Namaste");
```

# Choices
- [x] HiStudentsNamaste
- [ ] HelloEveryone
- [ ] Error
- [ ] I'm Angry :(

**Explanation:**
=> "Hi" + "Students" + "Namaste"
=> "HiStudents" + "Namaste"
=> "HiStudentsNamaste"

---

> Q10. What will be output for this ?
```
System.out.print("Hi" + " " + "Namaste");
```

# Choices
- [x] Hi Namaste
- [ ] HiNamaste
- [ ] Error
- [ ] Namaste Hi

**Explanation:**
=> "Hi" + " " + "Namaste"
=> "Hi " + "Namaste"
=> "Hi Namaste" 

---

> Q11. What will be output for this ?
```
System.out.print("Hi" * "Guys");
```

# Choices
- [ ] HiGuys HiGuys HiGuys
- [x] Error
- [ ] abcdefghijklmnopqrstuvwxyz
- [ ] Hi Guys

**Explanation:**
We cannot use * with text operand.


**Rule:** With text operand, only + operator can be used. Any other operator gives error.

---

> Q12. What will be output for this ?
```
System.out.print("WelcomeHome" - "Home");
```

# Choices
- [ ] Welcome
- [ ] WelcomeHome-Home
- [ ] Home
- [x] Error

**Explanation:**
We cannot use - with text operand.

---

> Q13. What will be output for this ?
```
System.out.print("Hello" + 3);
```

# Choices
- [ ] Hello
- [x] Hello3
- [ ] Error
- [ ] HelloHelloHello

**Explanation:**
Operator: +
Operands:
"Hello" -> text
3  -> number
 Since, one operand is text, we concatenate both operands.

---

> Q14. What will be output for this ?
```
System.out.print("Hello" + 3 + 4);
```

# Choices
- [ ] Hello
- [x] Hello34
- [ ] Hello7
- [ ] Error

**Explanation:** 
Since, both operators are + and have same priority we will evaluate from left to right
=> "Hello" + 3 + 4
=> "Hello3" + 4
=> "Hello34"

---

> Q15. What will be output for this ?
```
System.out.print("Hello" + 10 + "World");
```

# Choices
- [ ] HelloWorld
- [x] Hello10World
- [ ] Hello10
- [ ] Error

**Explanation:** 
=> "Hello" + 10 + "World"
=> "Hello10" + "World"
=> "Hello10World"

---

> Q16. What will be output for this ?
```
System.out.print(10 + "Welcome");
```
# Choices
- [ ] Welcome10
- [x] 10Welcome
- [ ] Welcome 10 times
- [ ] inky pinky po

**Explanation:** 
=> 10 + "Welcome"
=> "10Welcome" 

---

> Q17. What will be output for this ?
```
System.out.print(10 + 20 + "WakeUp" + 3 + 2);
```

# Choices
- [ ] 1020WakeUp32
- [ ] 1020WakeUp5
- [ ] 30WakeUp5
- [x] 30WakeUp32

**Explanation:**
=> 10 + 20 + "WakeUp" + 3 + 2
=> 30 + "WakeUp" + 3 + 2
=> "30WakeUp" + 3 + 2
=> "30WakeUp3" + 2
=> "30WakeUp32" 

---

> Q18. What will be output for this ?
```
System.out.print("HiGuys" * 2);
```

# Choices
- [ ] HiGuys*2
- [ ] HiGuys2
- [ ] HiGuysHiGuys
- [x] Error

**Explanation:**
We cannot use * operator with text operand

---

> Q19. What will be output for this ?
```
System.out.print(10 + 20 + "WakeUp" + 3 * 2);
```

# Choices
- [ ] 1020WakeUp32
- [ ] 30WakeUp32
- [ ] Error
- [x] 30WakeUp6

**Explanation:**

=> 10 + 20 + "WakeUp" + 3 * 2
=> 10 + 20 + "WakeUp" + 6
=> 30 + "WakeUp" + 6
=> "30WakeUp" + 6
=> "30WakeUp6"

---

> Q20. What will be output for this ?
```
System.out.print(10 + "Hello" * "World" + 3);
```

# Choices
- [ ] 10HelloWorld3
- [ ] 10HelloWorldWorldWorld3
- [x] Error
- [ ] Good Morning :)

**Explanation:**
We cannot use * operator with text operand

---

> Q21. What will be output for this ?
```
System.out.print(10 + "WelcomeHome" - "Home" + 3);
```
# Choices
- [ ] 10Welcome3
- [ ] 10WelcomeHomeHome3
- [x] Error
- [ ] Good Morning :)

**Explanation:** 
We cannot use - operator with text operand


---

> Q22. Predict the output for the following code:
```
System.out.println(10 + 20 + "Hello");
```

# Choices
- [ ] 1020Hello
- [x] 30Hello
- [ ] Hello1020
- [ ] Hello Hello Hello
**Explanation**
10 + 20 = 30, 
 Now when string is concatenated then 30 becomes as string "30" so the answer is "30Hello".
 

---
## Introduction to Variables

# Start with that numbers are of two types:
1. **Non-Decimal / Integers** 
2. **Decimals**

**Story :** Assume we have a container storing water in it And then explain the three factors of container that are : Type, Name and Value

After that take a container to store integers and explain the same three factors.


<img src = "https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/050/235/original/upload_23ef2438b9c3b2043ca7f53fffb61f9d.png?1695417557" width = "750" height = "350">

In programming, containers are known as variables.

## Creating a variable:

<img src = "https://d2beiqkhq929f0.cloudfront.net/public_assets/assets/000/050/236/original/upload_4734a0a6fd149a8b7767b1498637f82a.png?1695417585"
width = "750" height = "250">

---

> Q1. What will be output for this ?
```java
Create a variable of type int and give name as num and assign 34 in it.
```

# Choices
- [ ] num = 34
- [x] int num = 34;
- [ ] int 34 num
- [ ] num int = 34



---

> Q2. What will be output for this ?
```
int val = 30;
System.out.println(val);
```

# Choices
- [ ] val
- [x] 30
- [ ] Error
- [ ] Don't Select me, I'm wrong option

**Explanation:**
The value of variable val is 30.

**Rule :** Whenever we use variable name, the value of that variable is used.

---

> Q3. What will be output for this ?
```
int a = 10;
int b = 20;
System.out.println(a + b);
```

# Choices
- [ ] ab
- [x] 30
- [ ] Error
- [ ] Keep focus on the above option, I am wrong

---

> Q4. What will be output for this ?
```
int a = 10;
int b = 20;
System.out.println("Sum of Number is " + a + b);
 ```
 
# Choices
- [ ] Sum of Number is 30
- [x] Sum of Number is 1020
- [ ] Error
- [ ] Above Options, Not me :)

**Explanation:**

Here, both operators are + and have same priority. Hence, the exppression will be evaluated from left to right.
=> "Sum of Number is " + a + b
=> "Sum of Number is " + 10 + 20
=> "Sum of Number is 10" + 20
=> "Sum of Number is 1020"


---

> Q5. What will be output for this ?
```
int a = 10;
int b = 20;
System.out.println("Product of Number is " + a * b);
```

# Choices
- [ ] Product of Number is 1020
- [x] Product of Number is 200
- [ ] Error
- [ ] Again Above Options, Not me :)

**Explanation:**
Here, * has highest priority. So, a * b will be evaluated first.
=> "Product of Number is " + a * b
=> "Product of Number is " + 10 * 20
=> "Product of Number is " + 200
=> "Product of Number is 200"

---
## Summary
1. In Java, when we divide ( / ) integers we only get quotient.
2. We cannot divide integers by 0, we get error.
3. Priority of Operators : 
   * Rank 1 :  **()**
   * Rank 2 : __*__ , __/__
   * Rank 3 : __+__ , __-__ 
4. When two operators of different priority are there, we evaluate the one with higher priority first.
5. When two operators of same priority are there, we evaluate the one which comes first from left to right.
6. With + operator, if one of the operand is text then we concatenate both the operands.
7. Creating a variable:
    * type name = value;
    * Way 1 : 
        * int x = 30;
    * Way 2 : 
        * int y;
            y = 40;
8. When we use variable name, we use its value.

---

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.