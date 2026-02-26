---
title: "First Java Program"
description: "Learn about First Java Program in Java programming."
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - java
courseName: "10-java-fundamentals"
showOnArticles: false
featured: false
---

![hero image](https://algomaster.io/og-image.png)

# The Hello, World! Program

The quintessential first program in any programming language is often "Hello, World!". This simple program serves as a gentle introduction to the syntax and structure of the language, and it’s a great way to ensure your setup is working properly.

Here's what the code looks like:

Let’s break this down:

*   **public class HelloWorld**: This is declaring a class named `HelloWorld`. In Java, everything resides within classes.
*   **public static void main(String\[\] args)**: This is the main method where program execution begins. It must be exactly as specified, or the Java Virtual Machine (JVM) won't recognize it.
*   **System.out.println("Hello, World!");**: This line prints the text "Hello, World!" to the console. It’s a method call that outputs the string, followed by a newline.

### Running Your Program

To run this program, you’ll need to:

1.  Save the code in a file named `HelloWorld.java`.
2.  Open your terminal or command prompt and navigate to the directory where you saved the file.
3.  Compile the program using the command:

This creates a `HelloWorld.class` file, which contains the bytecode that the JVM understands.

Now, run the program with:

You should see the output:

Understanding this process is crucial because it lays the groundwork for how Java programs are structured and executed.

# Structure of a Java Program

Now that you’ve run your first program, let’s delve deeper into the structure of a Java program. This is where you’ll start to appreciate Java's object-oriented principles and syntax rules.

### Basic Components

Every Java program has several key components:

*   **Classes**: The building blocks of Java. Each Java application is made up of at least one class.
*   **Methods**: Blocks of code that perform specific tasks. The `main` method we saw earlier is a special method.
*   **Variables**: Used to store data values. You define them with a type and a name, such as `int number`.

Here’s a more complex program that incorporates these elements:

### Explanation

*   Here, we've defined a class called `Calculator`.
*   The `main` method calls another method, `add`, which takes two integers, adds them, and returns the result.

### Why Structure Matters

Understanding the structure helps you in the following ways:

*   It reinforces the concept of reusability. Methods can be called multiple times with different arguments.
*   It encourages better organization of code, making it easier to debug and maintain.

# Variables and Data Types

Next up, let’s take a closer look at variables and data types. These are foundational concepts in any programming language, and Java is no exception.

### Java Data Types

Java has two main categories of data types: **primitive types** and **reference types**.

#### Primitive Types

These include:

*   **int**: For integers.
*   **double**: For decimal numbers.
*   **char**: For single characters.
*   **boolean**: For true/false values.

Here’s an example program that uses different primitive data types:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```


#### Reference Types

These include objects, strings, and arrays. For example, strings are widely used in Java:

```java
javac HelloWorld.java
```


### Understanding Variable Scope

Variables have a scope, which determines where they can be accessed. For instance, a variable declared inside a method is local to that method and cannot be accessed outside of it.

### Common Gotchas

One common mistake is not initializing variables before use. Java requires that local variables be initialized before they are used. Here’s an example that would throw an error:

```java
java HelloWorld
```


Understanding these nuances will help you avoid common pitfalls as you start writing more complex Java applications.

# Control Flow Statements

As you build more complex programs, you’ll need to control the flow of execution. Java provides several control flow statements, including conditionals and loops.

### Conditionals

Conditionals allow your program to make decisions. The `if` statement is the most common:

### Loops

Loops allow you to execute a block of code multiple times. The `for` loop and `while` loop are widely used.

#### For Loop Example

```java
Hello, World!
```


#### While Loop Example

```java
public class Calculator {
    public static void main(String[] args) {
        int sum = add(5, 10);
        System.out.println("The sum is: " + sum);
    }

    public static int add(int a, int b) {
        return a + b;
    }
}
```


### Best Practices

*   Keep your loops simple. Complex conditions can lead to bugs.
*   Always ensure your loops will terminate. Infinite loops can crash your program.

# Error Handling Basics

As a developer, you will inevitably face errors, whether they are syntax errors, runtime exceptions, or logical errors. Java provides a robust way to handle errors through exceptions.

### Try-Catch Block

You can use `try-catch` blocks to gracefully handle exceptions:

### Why Handle Exceptions?

Proper error handling makes your program more robust and user-friendly. Instead of crashing, your program can provide meaningful feedback and continue operating in a controlled manner.

### Common Pitfalls

*   Catching general exceptions without specifying the type can hide bugs and make debugging difficult. Always be as specific as possible with your exceptions.

Now that you understand how to create and run Java programs, you are ready to explore how Java works under the hood.

In the next chapter, we will look at the inner workings of the Java language, including the role of the Java Virtual Machine and how it executes your code efficiently.

```java
public class DataTypesExample {
    public static void main(String[] args) {
        int age = 25;
        double height = 5.9;
        char initial = 'J';
        boolean isStudent = false;

        System.out.println("Age: " + age);
        System.out.println("Height: " + height);
        System.out.println("Initial: " + initial);
        System.out.println("Is Student: " + isStudent);
    }
}
```


```java
public class StringExample {
    public static void main(String[] args) {
        String greeting = "Hello, Java!";
        System.out.println(greeting);
    }
}
```


```java
public class ErrorExample {
    public static void main(String[] args) {
        int value; // declared but not initialized
        System.out.println(value); // error: variable value might not have been initialized
    }
}
```


```java
public class ConditionalExample {
    public static void main(String[] args) {
        int score = 85;

        if (score >= 90) {
            System.out.println("Grade: A");
        } else if (score >= 80) {
            System.out.println("Grade: B");
        } else {
            System.out.println("Grade: C");
        }
    }
}
```


```java
public class LoopExample {
    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            System.out.println("Iteration: " + i);
        }
    }
}
```


```java
public class WhileLoopExample {
    public static void main(String[] args) {
        int count = 0;
        while (count < 5) {
            System.out.println("Count: " + count);
            count++;
        }
    }
}
```


```java
public class ExceptionExample {
    public static void main(String[] args) {
        try {
            int[] numbers = {1, 2, 3};
            System.out.println(numbers[5]); // This will cause an ArrayIndexOutOfBoundsException
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Array index is out of bounds!");
        }
    }
}
```
