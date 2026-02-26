---
title: "Break &amp; Continue"
description: "Learn about Break Continue in Java programming."
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - java
courseName: "10-java-fundamentals"
showOnArticles: false
featured: false
---

![hero image](https://algomaster.io/og-image.png)

When you're deep in coding, you might find yourself in a situation where you want to control the flow of your loops more precisely.

That’s where the `break` and `continue` statements come into play. They help you manage what happens during each iteration of a loop, allowing you to exit loops early or skip certain iterations.

Understanding these statements can turn your loops from simple to powerful, enabling you to write cleaner and more efficient code.

# Understanding `break`

The `break` statement is a way to exit a loop prematurely. It can be used within any loop structure: `for`, `while`, or `do-while`. When `break` is executed, control immediately jumps to the statement following the loop. This is particularly useful when you want to stop processing once you've found what you're looking for, or when a certain condition is met.

### Basic Example

```java
for (int i = 0; i < 10; i++) {
    if (i == 5) {
        break; // Exit the loop when i equals 5
    }
    System.out.println(i);
}
```


Let’s start with a simple example of using `break` in a `for` loop:

```java
0
1
2
3
4
```


In this code, the output will be:

As soon as `i` reaches 5, the loop terminates. This can be very effective to avoid unnecessary iterations, especially in large data sets where you only need to find a specific value.

### Real-World Application

Consider a scenario where you’re searching for a user's data in a database represented as a list. Once you find the user, you want to stop searching:

In this example, once "Charlie" is found, we exit the loop early, saving time and resources.

```java
List<String> users = Arrays.asList("Alice", "Bob", "Charlie", "Dave");

String targetUser = "Charlie";
for (String user : users) {
    if (user.equals(targetUser)) {
        System.out.println("User found: " + user);
        break; // Stop searching once the user is found
    }
}
```


### Edge Cases

Be cautious with `break` statements, especially in nested loops. If you have multiple levels of loops, `break` will only exit the innermost loop. Here’s a quick example:

```java
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j == 1) {
            break; // Breaks only the inner loop
        }
        System.out.println("i: " + i + ", j: " + j);
    }
}
```


This outputs:

In this case, the outer loop continues running even after the inner loop breaks. If you want to exit both loops, that’s where labeled statements come into play, which we will discuss later.

# Understanding `continue`

On the other hand, the `continue` statement is used to skip the current iteration of the loop and proceed to the next one. This can be useful when you want to avoid executing certain parts of your loop based on specific conditions.

### Basic Example

```java
i: 0, j: 0
i: 1, j: 0
i: 2, j: 0
```


Let’s see a simple example using `continue` in a `while` loop:

```java
int i = 0;
while (i < 10) {
    i++;
    if (i == 5) {
        continue; // Skip the rest of the loop for i == 5
    }
    System.out.println(i);
}
```


Here, the output will be:

Notice how when `i` is equal to 5, the program skips the `System.out.println(i)`, effectively removing 5 from the output.

### Real-World Application

Imagine you are processing a list of transactions, and you want to skip any transaction that has already been flagged for review:

This example shows how `continue` allows you to focus on only the transactions you want to process, improving the efficiency of your code.

```java
1
2
3
4
6
7
8
9
10
```


### Edge Cases

Just like with `break`, be mindful of how `continue` behaves in nested loops. It only affects the innermost loop:

This will output:

Again, the outer loop continues normally, while the inner loop skips printing when `j` equals 1.

# Combining `break` and `continue`

Sometimes, you might find yourself needing both `break` and `continue` in the same loop. Here’s a scenario where you want to process a list but stop if a certain value is found while skipping others:

The output:

In this case, we both skip the even numbers and break the loop when we reach 5. It’s a good demonstration of how these statements can work together to give you finer control over your logic.

# Common Pitfalls

While using `break` and `continue`, there are a few common pitfalls to keep in mind:

*   **Accidental Infinite Loops**: If your loop condition is based on a variable that isn’t updated correctly, using `break` or `continue` can lead to infinite loops. Always double-check that your loop’s exit conditions are being met.
*   **Overusing** `**break**` **and** `**continue**`: While they can simplify logic, overusing these statements can lead to code that’s hard to read and maintain. Use them judiciously to keep your code clear.
*   **Neglecting Edge Cases**: Always consider what should happen when your conditions for `break` or `continue` aren't met. For example, if you skip all iterations or exit the loop without handling the remaining cases.

```java
List<Transaction> transactions = getTransactions(); // Assume this returns a list of transactions

for (Transaction transaction : transactions) {
    if (transaction.isFlagged()) {
        continue; // Skip flagged transactions
    }
    processTransaction(transaction); // Only process non-flagged transactions
}
```


# Summary

In this chapter, we dove deep into how to effectively use `break` and `continue` to manage loop execution in Java. We explored the mechanics of each statement, practical use cases, and edge cases to watch out for.

These tools can significantly enhance the efficiency and readability of your code when used correctly.

In the next chapter, we'll look at how labeled statements can give you even more control over nested loops, allowing for clearer and more efficient code management.

```java
for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        if (j == 1) {
            continue; // Skips to the next iteration of the inner loop
        }
        System.out.println("i: " + i + ", j: " + j);
    }
}
```


```java
i: 0, j: 0
i: 0, j: 2
i: 1, j: 0
i: 1, j: 2
i: 2, j: 0
i: 2, j: 2
```


```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

for (int number : numbers) {
    if (number == 5) {
        break; // Stop processing when we reach 5
    }
    if (number % 2 == 0) {
        continue; // Skip even numbers
    }
    System.out.println(number); // This will print only odd numbers less than 5
}
```


```java
1
3
```
