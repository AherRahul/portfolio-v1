---
title: "1. Beginner: Data Types + Reading Input"
date: "2024-05-19"
eventName: "MODULE 1: Introduction to Programming"
location: ""
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/learning/2024-05-19-beginner-data-types-reading-input.md"
type: "lecture-notes"
language: "en"
topics:
  - java
  - beginner-programming
---

**A data type is an attribute associated with a piece of data that tells a computer system how to interpret its value.** Understanding data types ensures that data is collected in the preferred format and the value of each property is as expected.


Recap: Start the class with Revising the previous session rules:

:::success
There are a lot of quizzes in this session, please take some time to think about the solution on your own before reading further.....
:::

## Revision: Type Casting Rules

1. Int data can be stored in long and there wont be any loss of data, so there wont be any issues. 

```
int a = 10;
long b = a;
System.out.print(b); --> 10
```

2. Long data cannot be stored in int, there can be a loss of data so we will get an error

```
long a = 100;
int b = a;
System.out.print(b); Error 
```

3. If we want to still force we need to keep explicitly type cast it 
```
long a = 100;
int b = (int)a;
System.out.print(b) --> 100
```

---

> ## Q1. What is the output?


```
int a = 10000;
long b = a;
System.out.print(b);
```

- [x] 10000

- [ ] Compilation Error

- [ ] 100000.0

- [ ] 10000L

> **Explanation:** First line we create a variable of type int then we are creating a long type variable "b" and trying to store the value of "a" in it. This is Implicit Typecasting.


---

> ## Q2. What is the output?
```
long x = 10000;
System.out.print(x);
```

- [ ] 10000L

- [ ] Compilation Error

- [x] 10000

- [ ] None of the above


> **Explanation:** First line automatic typecasting is happening between Int and Long. 

---

> ## Q3. What is the output?
```
long x = 10000;
int y = x;
System.out.print(y);
```

- [ ] 10000L

- [x] Compilation Error

- [ ] 10000

- [ ] None of the above


> **Explanation:** First line we create a variable of type long then we are creating a int type variable "y" and trying to store the value of "x" in it. In this acse there is a possiblilty of Data Loss. 

` Error- Possible lossy conversion from long to int `. 

---

> ## Q4. What is the output?
```
long x = 1000;
int y = (int)x;
System.out.print(y);
```

- [x] 1000

- [ ] Compilation Error

- [ ] 1000L

- [ ] None of the above


> **Explanation:** Now with this line we are forcing the compiler to typecast it to int. It is explicit Typecasting.

 ` int y = (int)x; ` 

---

> ## Q5. What is the output?
```
long a = 10000000000L;
int b = (int)a;
System.out.print(b);
```

- [ ] 10000000000

- [x] Random Value

- [ ] 10

- [ ] None of the above

> **Explanation:** Here we are forcing the compiler to store the value 10^10 into int. Because of that overflow will happen. 
Ans= Some random value. 

`int b = (int)a;` 


---

## Taking input from the user:

Tool to take input from the user: Scanner. 

**Syntax of Scanner:**
```
Scanner scn = new Scanner(System. in);
```

> The Scanner class is used to get user input, and it is found in the java.util package.
To use the Scanner class, create an object of the class and use any of the available methods found in the Scanner class documentation. In our example, we will use the nextLine() method, which is used to read Strings:

Now in order to use scanner also we need to write one line: 

``` 
import java.util.*;
```

> Consider this like in order to play pubg we need to import some files, some packages similarly to use scanner we need to import java files. 


### Take Input and print the output:
```
int x = scn.nextInt();
System.out.print(x);
```
**Explanation:**
Here we are taking the help of scanner by using its name scn and asking the user for an integer value which we will store in "x" varaible.

> Just try to give different integer values in the custom input and explain how it got printed. 

**Take input and print twice the number:**

```
int y = scn.nextInt();
System.out.print(2 * y);
```

---

> ## Q1 Predict the output for given input:

Input: 100

```
scanner sc = new scanner(System.in);
int xyz = sc.nextInt();
System.out.print(xyz);
```

- [ ] xyz
- [x] Error
- [ ] 100
- [ ] Goodnight :)

> **Explanation:** At line 1, scanner is in small letter. Because Java is case sensitive. 

---

> ## Q2 Predict the output for given input:

Input: 594

```
Scanner sc = new Scanner(system.in);
int abc = sc.nextInt();
System.out.print(abc);
```

- [ ] 594
- [x] Error
- [ ] abc
- [ ] Only here to watch!

> **Explanation:** Error: S in System should be capital. 

---

> ## Q3 Predict the output for given input:

Input: 5000

```
Scanner scn = new Scanner(System.in);
int a = scn.nextInt();
System.out.print(a);
```

- [ ] Error
- [x] 5000
- [ ] Watching Netflix on the side!


> **Explanation:** Here we are creating a variable "a" and taking integer from the user. 


---

> ## Q4 Predict the output for given input:

Input: 24 30
```
Scanner sc = new Scanner(System.in);
int a = sc.nextInt();
int b = sc.nextInt();
System.out.print(a);
```

- [x] 24
- [ ] 30
- [ ] Error


> **Explanation:** The first value will be stored in first variable and second value will be stored in second variable.

---

> ## Q5 Predict the output for given input:

Input: 33 11

```
Scanner sc = new Scanner(System.in);
int c = sc.nextInt();
int d = sc.nextInt();
System.out.print(c + d);
```

- [ ] 3311
- [ ] c + d
- [x] 44
- [ ] Error


> **Explanation:** "c" variable will have value 33, and "d" variablle will have value 11. 


---

> ## Q6 What will be the output for the following input?
```
Input: 15 21
Scanner sc = new Scanner(System.in); 
int a = sc.nextInt(); 
int b = sc.nextInt(); 
int c = sc.nextInt();
System.out.print(a + b + c);
```


- [ ] 36
- [ ] a + b + c
- [ ] 36c
- [x] Error


> **Explanation:** "a" variable will have value 15, then variable "b" will have value 21, but for "c" variable user is not giving any input. 

` Error, No such element exception. ` 

---


## Input for long data type:
```
Scanner scn = new Scanner(System .in);
long c = scn.nextLong();
```

> ## Q1 How to take input for a long variable?

- [ ] sc.nextlong()
- [ ] sc.nextint()
- [x] sc.nextLong()
- [ ] sc.nextInt()

---

> ## Q2 Predict the output for the following input:
Input: 10000000000
```
Scanner scn = new Scanner(System.in);
long N = scn.nextLong();
System.out.println(N);
```

- [x] 10000000000
- [ ] Error
- [ ] 10000000000L

---

> ## Q3 Predict the output for the following input:
Input: 10000000000L

```
Scanner scn = new Scanner(System.in):
long N = scn.nextLong();
System.out.println(N);
```

- [ ] 10000000000
- [x] Error
- [ ] 10000000000L

> **Explanation:** Here, when we give L in the input, then the whole input is not a number anymore. 
`Error, Input Mismatch. Do not write L in the input section to give a long value.  ` 

---

> ## Q4 3 Predict the output for the following input
```
Input: 2500
long x = scn.nextInt();
System.out.print(x);
```

- [x] 2500
- [ ] Error
- [ ] 2500L


> **Explanation:** First 2500 is considered an integer value, ans we can store an integer value into long. It is implicit typecasting. 


---

> ## Q5 Predict the output for the following input
```
Input: 2500
int x = scn.nextLong();
System.out.print(x);
```

- [ ] 2500
- [x] Error
- [ ] 2500L

> **Explanation:** Now here from long to int, it cannot happen automatically. 
`Error, possible lossy conversion from long to int.` 

---

> ## Q6 Predict the output for the following input
```
Input: 2500
int x = (int)scn.nextLong();
System.out.print(x);
```

- [x] 2500
- [ ] Error
- [ ] 2500L
---

## Float vs Double
			        
1. Non Decimal{Integers} --> Datatypes : int  long
2. Decimal --> float  double
Ex : 1.24 , 1.56 , 20.0,and soon...
			
			
**Declare a variable of any Type 
Syntax: type name = value;**


> ## Q1 Predict the output for the following input
```
double d = 6.17;
System.out.print(d);
```

- [ ] Compilation Error
- [ ] 6
- [x] 6.17
- [ ] None of the above

> **Explanation:** We are creating a variable of type double.

---

> ## Q2 Predict the output for the following input

```
float x = 3.14;
System.out.print(x);
```

- [x] Compilation Error
- [ ] 3.14f
- [ ] 3.1400001
- [ ] 3.14


> **Explanation:** `Error-> Possible lossy conversion from double to float. `

> **Rule** : In JAVA, Any decimal number is considered as double


---

> ## Q3 Predict the output for the following input
```
float a = 3.14f;
System.out.print(a);
```

- [ ] 3.1400001
- [x] 3.14
- [ ] Compilation Error
- [ ] None of the above

> **Explanation:** Now when we add "f" in front of it, Basically we are trying to tell compiler, consider this as float. 

---

### Difference Between Float and Double?

```
float a = 10.0f;
float b = 3.0f;
float c = (a/b); 
System.out.println(c);
```

```
double x = 10.0;
double y = 3.0;
double z = x/y;
System.out.println(z);
```
**Output:**
```plaintext
3.3333333
3.3333333333333335
```
> **Explanation:**
* float -> can have upto 6 to 7 digits after decimal point.
* double -> can have upto 15 to 16 digits after decimal point.
* double is more precise [more digits after decimal point]

---

## Type Casting Float vs Double
Same Rules of int vs long apply here, 

1. When we store float to double no loss of data hence no issue
{Implicit Type Casting}.
				
2. When we store double to float there can be a loss of data, complier will raise an error. 
```
double d = 3.14
float f = d // Error 
```
3. If we want to still force we need to keep explicitly type cast it.
```
double d = 3.14
float f = (float)d; // doubtle --> Explicilty --> float 
System.out.print(f); // 3.14
```

---
> ## Q1 Predict the output for the following input

```
double x = 3.14;
float y = x;
System.out.print(y);
```

- [ ] 3.14f
- [ ] 3.14
- [x] Compilation Error
- [ ] None of the above

> **Explanation:** Here we are trying to store a double type value into float. 
`Error- Possible lossy conversion from double to float. `

---

> ## Q2 Predict the output for the following input

```
double x = 17.67;
float y = (float)x;
System.out.print(y);
```

- [x] 17.67
- [ ] 17.669999999999998
- [ ] Compilation Error
- [ ] None of the above

> **Explanation:** In this case, we are forcing the compiler to convert double to float.  This is known as Explicit Typecasting.

**No data loss -> No error**
* int (45)  ->  double   -> No error 
* double (45.6)  -> int  -> Error

---

## Type Casting Decimal vs Non Decimal
For typecasting just remember 2 rules: 
1. 	If there is is no loss of data then no error : Implicit from non-decimal to decimal  : Implicit. 					
2. 	If there is chance for loss of data then error but We can still do this type casting forcefully : Explicit from decimal to non - decimal : Explicilty. 


> ## Q1 Predict the output for the following input
```
double x = 3.45;
int y = x;
System.out.print(y);
```

- [ ] 3
- [ ] 3.45
- [x] Compilation Error
- [ ] None of the above

**Output:**
```
Error- Possible lossy conversion from double to int. 
```

---

> ## Q2 Predict the output for the following input
```
double x = 3.45;
int y = (int)x;
System.out.print(y);
```
- [x] 3
- [ ] 3.45
- [ ] Compilation Error
- [ ] None of the above


> **Explanation:** Here we are forcing the compiler to convert 3.14 to int, We will only get the integer part. 

---

> ## Q3 Predict the output for the following input
```
int x = 40;
double y = x;
System.out.print(y);
```
- [ ] 40
- [x] 40.0
- [ ] Compilation Error
- [ ] None of the above

> **Explanation:** In this example, we are trying to store a int type value into double. Double stores decimal values, and here we can easily convert 40 to 40.0, therefore it is called Implicit Typecasting. 


---


## Reading Inputs for Float and Double

> How to take input for a float variable?
```
Scanner scn = new Scanner(System.in);
float a = scn.nextFloat();
```


> How to take input for a double variable?
```
Scanner scn = new Scanner(System.in);
double a = scn.nextDouble();
```

> ## Q1 Predict the output for the following input
```
float x = sc.nextFloat();
System.out.println(x);
```

> Explain we don't need to write "f" while taking inputs for float. 

---

> ## Q2 Predict the output for the following input
```
Input : 3.14
 
Scanner sc = new Scanner(System.in); 
float a = sc.nextFloat(); 
System.out.print(2 * a);
```
- [ ] 2.0
- [ ] 3.14
- [x] 6.28
- [ ] 1.57

> **Explanation:** Now this 3.14 is stored on variable "a", Then we are trying to print 2*a-> 2* 3.14.

---

> ## Q3 Predict the output for the following input
```
Input : 3.14 20
 
Scanner sc = new Scanner(System.in); 
int a = sc.nextInt(); 
int b = sc.nextInt();
System.out.print(a + b);
```

- [ ] 17
- [ ] 3
- [ ] 14
- [x] Error


> **Explanation:** In the first line, we are trying to take an integer type input, But the user is not giving an integer value for the first time. 
`Error-> Input mismatch.` 

---

> ## Q1 Predict the output for the following input
```
Input : 3.14
 
Scanner sc = new Scanner(System.in); 
float a = sc.nextFloat(); 
float b = sc.nextFloat()
System.out.print(2 * a);
```

- [ ] 6.28
- [ ] 3.14
- [x] Error
- [ ] None of the above

> **Explanation:**  There are 2 errors, We are only giving one input. 

`Error- No such element exeception. & semicolon is missing at float b = sc.nextFloat()` 

---

> ## Q1 Predict the output for the following input
```
Input: 3.45
int x = sc.nextDouble();
System.out.println(x);
```
> **Explanation**: According to rules of typecasting, we cannot do it there is a chance of data loss. 
`Ans = Error`

**Correct Code:**
```
Input: 3.45
int x = (int)sc.nextDouble();
System.out.println(x);
```
> **Explanation**:  In this case, we are forcing the compiler to do it, But int can only store integer value, so we will only get the integer part as output.
`Ans = 3`


> ## Q2 Predict the output for the following input
```
Input: 3
double y = sc.nextInt();
System.out.println(y);
```

> **Explanation**:  We can easily Typecast from integer to decimal. 
`Ans = 3.0`

---
## Dividing numbers by zero

```
System.out.println(4 / 0); 
Output:  Error
```

```
System.out.println(4.0 / 0);
Output: Infinity
```

```
System.out.println(4.0f / 0); 
Output: infinity
```

```
System.out.println(0 / 0); 
Output: Error.
```

```
System.out.println(0.0 / 0);
Output: NAN[Not A Number]. 
```



---
## Boolean Input

```
boolean x = false;
System.out.println(x);

Output: false.
boolean -> true / false only, it will work on True/False, but give answer in lowercase only. 
```

```
Input: true
Scanner sc = new Scanner(System.in);
boolean y = sc.nextBoolean();
System.out.println(y);

Output: true
```
We can take inputs like True/False/false also. 

---
## Arithmetic Operators

+, -, *, / are very basic arithmetic operators. Confirm whether the students know about them. And directly give the below quiz.

> ## Q1 What will be the output?
```
int a = 10;
int b = 24;
System.out.println(a+b);
System.out.println(a-b);
System.out.println(a*b);
System.out.println(b/a);
```

# Choices
- [ ] 34<br>-14<br>240<br>2.4
- [ ] 34<br>14<br>240<br>2
- [x] 34<br>-14<br>240<br>2
- [ ] None of them

> **Explanation**:  <br/> a + b -> 10 + 24 = 34 <br/> a - b -> 10 - 24 = -14 <br/> a * b -> 10 * 24 = 240 <br/> b / a -> 24 / 10 = 2  <br/>(Because both are integers, so the result should be an integer.)

One more arithmetic operator:
% -> Modulus Operator (Gives remainder of divison of two numbers as output)

### Examples
12 % 4 = 0 <br/>
9 % 7 = 2 <br/>
24 % 5 = 4 <br/>

Now, give the following quiz.


---


> ## Q2 What will be the output?
```
System.out.print(36 % 6);
```

- [ ] 3
- [ ] 6
- [x] 0
- [ ] Error


---


> ## Q3 What will be the output?
```
System.out.print(5 % 3);
```

- [ ] 1
- [x] 2
- [ ] 3
- [ ] Error

If necessary, take some more examples.


---


> ## What are Relational operators?

**Ans:** Relational operators are used to check the relations between two operands. After comparison, the relational operators return a boolean value.

### Syntax:
```
operand_1 relational_operator operand_2
```


|    Relation between a and b     | Syntax | a = 45, b = 16 | a = 5, b = 5 |
|:-------------------------------:|:------:|:--------------:|:------------:|
|       a is greater than b       | a > b  |      True      |    False     |
|        a is less than b         | a < b  |     False      |    False     |
| a is greater than or equal to b | a >= b |      True      |     True     |
|  a is less than or equal to b   | a <= b |     False      |     True     |
|         a is equal to b         | a == b |     False      |     True     |
|       a is not equal to b       | a != b |      True      |    False     |


**Note:** Explain the difference between assignment operator (=) and equality operator (==).

---

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.

