---
title: Do-While Loop
description: Learn about Do While Loop in Java programming.
datePublished: 2026-02-27
dateModified: 2026-02-27
topics:
  - java
courseName: 11-java-fundamentals
showOnArticles: false
featured: false
published: true
---

![hero image](https://algomaster.io/og-image.png)

When we think about loops in Java, we often picture them executing a block of code repeatedly based on some condition.

The **do-while loop** is a unique player in this game because it guarantees that the code block will run at least once. This characteristic makes it particularly useful in scenarios where an initial action is necessary before checking a condition.

Let’s dive into the details of how this loop works, its syntax, practical applications, and some common pitfalls.

# Do-While Loop Syntax

The syntax of a do-while loop is straightforward. Here’s how it looks:

Notice the structure: you start with the `do` keyword, followed by a block of code wrapped in braces. After that, you specify the `while` keyword along with a condition. This condition is checked **after** the block of code executes. If the condition evaluates to true, the loop will repeat.

It's crucial to keep in mind that the condition must evaluate to a boolean value, just like in other control flow statements.

Let’s see a simple example:

```java
do {
    // Code to execute
} while (condition);
```


In this example, the loop prints the count from 1 to 5. Even if the initial value of `count` were greater than 5, the message would still print once, demonstrating the do-while loop's guarantee that the block runs at least once.

```java
int count = 1;

do {
    System.out.println("Count: " + count);
    count++;
} while (count <= 5);
```


# Practical Applications

### User Input Validation

One common use case for a do-while loop is user input validation. Imagine you want to prompt a user for a password but ensure they enter it correctly before proceeding. Here’s how you might implement that:

In this scenario, the user is prompted to enter their password. If they enter the wrong password, they are immediately asked to try again, ensuring that they only gain access when they've entered the correct password.

### Menu-Driven Programs

Another common application is in menu-driven programs where the user is presented with options continuously until they choose to exit. For example:

```java
import java.util.Scanner;

public class PasswordCheck {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        String correctPassword = "secret";
        String userInput;

        do {
            System.out.print("Enter your password: ");
            userInput = scanner.nextLine();
            if (!userInput.equals(correctPassword)) {
                System.out.println("Incorrect password, please try again.");
            }
        } while (!userInput.equals(correctPassword));

        System.out.println("Access granted!");
        scanner.close();
    }
}
```


In this menu example, the program keeps displaying the menu until the user decides to exit by entering option 3. This way, the user is guaranteed to see the menu at least once.

```java
import java.util.Scanner;

public class MenuExample {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        int choice;

        do {
            System.out.println("Menu:");
            System.out.println("1. Option A");
            System.out.println("2. Option B");
            System.out.println("3. Exit");
            System.out.print("Enter your choice: ");
            choice = scanner.nextInt();

            switch (choice) {
                case 1:
                    System.out.println("You selected Option A.");
                    break;
                case 2:
                    System.out.println("You selected Option B.");
                    break;
                case 3:
                    System.out.println("Exiting...");
                    break;
                default:
                    System.out.println("Invalid choice. Please try again.");
            }
        } while (choice != 3);

        scanner.close();
    }
}
```


# Key Differences from While Loop

Understanding the distinction between the do-while loop and the while loop is essential. While both loops can be used for repeated execution, their key difference lies in when the condition is evaluated.

*   **Do-While Loop**: The block executes first; the condition is checked after execution. The code block runs at least once.
*   **While Loop**: The condition is evaluated first. If it's false on the first check, the block may not execute at all.

Here's a quick example to illustrate:

```java
int a = 10;

// Using a while loop
while (a < 10) {
    System.out.println("This won't print.");
}

// Using a do-while loop
do {
    System.out.println("This will print once.");
} while (a < 10);
```


In this example, the while loop condition is false from the start, so its code block doesn't execute. However, the do-while loop executes its block once, demonstrating its effectiveness when you want to ensure an action takes place.

```java
int number = 10;

do {
    System.out.println("This will run forever.");
} while (number > 0);
```


# Edge Cases and Nuances

While do-while loops are handy, there are some edge cases and nuances to be aware of:

### Infinite Loops

If you're not careful, you can easily create an infinite loop with a do-while. For instance:

In this case, unless the value of `number` changes inside the loop, it will run indefinitely. Always ensure that the condition will eventually become false to avoid infinite loops.

### Combining with Break and Continue

You can also use `break` and `continue` statements within a do-while loop. For example, if you want to exit the loop based on a specific condition, you might do something like this:

```java
int number = 0;

do {
    if (number == 5) {
        break;  // Exit the loop when number is 5
    }
    System.out.println("Number: " + number);
    number++;
} while (number < 10);
```


In this example, the loop will stop executing when `number` reaches 5, demonstrating how you can have more control over loop execution.

# Real-World Scenarios

Let’s consider a few more real-world scenarios where a do-while loop shines.

### Data Processing

When processing data, you might need to perform operations until you reach the end of a dataset. A do-while loop ensures that you process at least the first piece of data before checking if more data exists.

### Game Logic

In game development, a do-while loop can be used to enforce repeated actions. For example, asking a player if they want to continue playing after each game round.

### Continuous Service Requests

If you’re building a server that handles requests, a do-while loop could be beneficial to keep listening for requests until a shutdown command is received.

# Summary

To wrap up, the do-while loop is a powerful tool in Java that ensures your code block executes at least once, which can be particularly useful in scenarios requiring user input or repetitive tasks until a certain condition is met.

Now that you understand the nuances and applications of the do-while loop, you are ready to explore the **Enhanced For Loop**. In the next chapter, we will look at how this loop simplifies iterating over collections and arrays, making data handling even more efficient and intuitive.