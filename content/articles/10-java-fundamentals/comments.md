---
title: "Comments"
description: "Learn about Comments in Java programming."
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - java
courseName: "10-java-fundamentals"
showOnArticles: false
featured: false
---

![hero image](https://algomaster.io/og-image.png)

When you’re writing code, it’s easy to get wrapped up in the logic, the syntax, and the algorithms. But what about the context, the reasoning, and the purpose behind that code?

That’s where comments come into play.

Comments are like the breadcrumbs left behind for anyone (including your future self) trying to follow the trail of thought that led to the final product. They provide clarity, enhance readability, and offer insight into the developer's intent.

# What Are Comments?

In Java, comments are pieces of text that are not executed by the Java Virtual Machine (JVM). They exist solely for the benefit of anyone reading the code. Comments can explain complex logic, clarify why certain decisions were made, and even remind future developers of the reasoning behind specific implementations.

There are three primary types of comments in Java:

1.  **Single-line comments**: Ideal for brief explanations.
2.  **Multi-line comments**: Useful for longer descriptions or for temporarily disabling blocks of code.
3.  **Javadoc comments**: Special comments used to generate documentation.

Let’s break them down.

# Single-line Comments

Single-line comments are created using two forward slashes (`//`). Everything following the slashes on that line is ignored by the compiler. This type of comment is perfect for short notes or explanations.

### Example

```java
public class Main {
    public static void main(String[] args) {
        int number = 5; // This variable holds the number 5
        System.out.println(number); // Print the number
    }
}
```


Here's a quick example to illustrate:

```java
public class Main {
    public static void main(String[] args) {
        /* 
        This program demonstrates the use of 
        multi-line comments in Java. 
        We will print a number.
        */
        int number = 10; // The number to print
        System.out.println(number); // Output the number
    }
}
```


In the example above, the comments clarify what each line of code does. They’re short, to the point, and help anyone reading the code understand its purpose without diving into complex explanations.

```java
/**
 * The Main class implements an application that
 * simply prints a number to the console.
 */
public class Main {
    /**
     * This is the main method which makes use of the printNumber method.
     * @param args Unused.
     */
    public static void main(String[] args) {
        printNumber(42);
    }

    /**
     * This method prints the given number.
     * @param number The number to print.
     */
    public static void printNumber(int number) {
        System.out.println(number);
    }
}
```


### Best Practices for Single-line Comments

*   Use them to explain "why" rather than "what." If the code is straightforward, the need for a comment might be minimal.
*   Avoid over-commenting. If your code is self-explanatory, it may not need comments.
*   Keep comments up to date. Outdated comments can be more confusing than helpful.

# Multi-line Comments

Multi-line comments start with `/*` and end with `*/`. These are beneficial for providing longer explanations or for commenting out sections of code during debugging.

### Example

Here’s how you can use multi-line comments:

In this example, the multi-line comment explains the overall purpose of the program. It can be particularly useful for providing context when working with larger chunks of code.

### Use Cases for Multi-line Comments

*   When you need to explain complex algorithms or logic that requires more than a single line.
*   For temporarily disabling blocks of code during testing or debugging without deleting them.

# Javadoc Comments

Javadoc comments are a specific type of multi-line comment that starts with `/**` and ends with `*/`. They are used to document Java classes, methods, and fields for generating API documentation.

### Example

Let’s see how Javadoc comments are structured:

In this code, Javadoc comments describe the class, the `main` method, and the `printNumber` method. They provide essential information about what each component does, which is invaluable for anyone using or maintaining the code.

### Why Use Javadoc Comments?

*   They allow for automated documentation generation using tools like Javadoc, creating a user-friendly API reference.
*   They help clarify method parameters, return types, and exceptions thrown, making it easier for other developers to integrate and use your code.

# Commenting Best Practices

While comments are essential for maintaining clear and understandable code, it’s equally important to use them effectively. Here are some best practices to keep in mind:

### 1\. Write Clear and Concise Comments

Aim for clarity. A good comment should be understandable without needing to read the code it refers to. Avoid overly complex phrases or jargon.

### 2\. Comment on the Why, Not the What

Instead of describing what the code does, focus on explaining why it was written that way. This helps provide context that may not be immediately obvious from the code itself.

### 3\. Keep Comments Up to Date

As your code evolves, so should your comments. Outdated or incorrect comments can mislead future developers and create confusion.

### 4\. Use Comments to Document Decisions

If you’ve made a particular decision that affects your code's logic, document it. This can save time for others trying to understand why a certain approach was taken.

### 5\. Don’t Overdo It

Sometimes less is more. If the code is simple and self-explanatory, excessive comments can clutter the code and detract from readability.

### 6\. Use Tools to Enforce Comment Standards

Consider using documentation tools or linters that can help enforce comment standards within your team. This ensures consistency across your codebase.

# Common Pitfalls to Avoid

While comments are helpful, there are some classic mistakes developers make that can lead to confusion or miscommunication.

### 1\. Commenting Out Code Permanently

It might be tempting to leave commented-out code in your files. However, this can lead to clutter. If you decide a piece of code is no longer needed, consider deleting it instead.

### 2\. Using Comments as a Crutch

Don’t rely on comments to explain poorly written code. If a piece of code requires extensive commenting to be understood, it might be time to refactor it.

### 3\. Ignoring Comments in Code Reviews

When reviewing code, pay attention to comments. They can provide context that’s essential for understanding the code’s intent and functionality.

# Summary

In this chapter, we explored the different types of comments in Java: single-line, multi-line, and Javadoc comments. We discussed their purposes, best practices for effective commenting, and common pitfalls to avoid.

By adhering to these principles, you can significantly enhance the readability and maintainability of your code, making it easier for others (and yourself) to understand and collaborate on future projects.

In the next chapter, we will look at the importance of naming your variables and methods clearly, and how it complements the practices we’ve discussed here.