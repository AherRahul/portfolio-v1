---
title: "String Formatting"
description: "Learn about String Formatting in Java programming."
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - java
courseName: "10-java-fundamentals"
showOnArticles: false
featured: false
---

![hero image](https://algomaster.io/og-image.png)

String formatting allows you to create user-friendly output by controlling how strings appear.

Imagine you're building an application that displays user data—getting that output just right can make all the difference in user experience.

In this chapter, we will explore various ways to format strings in Java, covering everything from basic techniques to more advanced features.

Understanding string formatting will not only enhance your code's readability but also improve your ability to present data clearly. So let's dive in!

# Basic String Formatting with `String.format()`

Java provides a built-in method called `String.format()` that allows you to format strings in a flexible way. This method uses format specifiers, similar to those in C's `printf`, to define how you want your string to look.

Here's a simple example:

```java
String name = "Alice";
int age = 30;
String formattedString = String.format("My name is %s and I am %d years old.", name, age);
System.out.println(formattedString);
```


In this code:

*   `%s` is a placeholder for a string (in this case, `name`).
*   `%d` is a placeholder for an integer (in this case, `age`).

When you run this, the output will be:

The power of `String.format()` comes from its ability to handle various data types and formatting options. Let's look at a few more examples.

```java
My name is Alice and I am 30 years old.
```


# Formatting Numbers

When it comes to numbers, you can format them in different ways using `String.format()`. Here are a few common scenarios:

## Decimal Places

If you want to format a floating-point number to a specific number of decimal places, you can do this easily. For instance:

Here, `%.2f` specifies that we want a floating-point number rounded to two decimal places. The output will be:

## Padding Numbers

You can also control the width of the formatted output. Suppose you want to display numbers in a fixed width, padded with zeros:

The output will be:

In this case, `%05d` means the integer should occupy at least five characters, padded with zeros if necessary.

# Formatting Dates

Date formatting is another important aspect of string formatting. Java has a dedicated class for handling dates and times: `java.time.LocalDateTime` and `java.time.format.DateTimeFormatter`. Here’s how to format dates:

In this example, we create a custom date format: `dd-MM-yyyy HH:mm:ss`, which gives us the day, month, year, hours, minutes, and seconds. The output might look something like:

```java
double price = 123.456789;
String formattedPrice = String.format("The price is %.2f", price);
System.out.println(formattedPrice);
```


Using `DateTimeFormatter`, you can easily format and parse dates in a way that is readable and user-friendly.

# Advanced Formatting with `MessageFormat`

For complex string formatting scenarios, especially when you need to handle multiple parameters and languages, `java.text.MessageFormat` is a powerful tool. It allows you to define templates and insert values where needed.

Here's a typical use case:

In this code:

*   `{0}` and `{1}` are placeholders for the arguments passed to `MessageFormat.format()`.
*   This approach is particularly useful for internationalization since you can easily change the message format without altering the code structure.

The output will be:

# Handling Null and Edge Cases

When working with string formatting, you might run into null values or unexpected data types. It's crucial to handle these situations gracefully. Here's an example of how you can manage nulls:

```java
The price is 123.46
```


This code checks if `name` is null. If it is, it substitutes "unknown" in the formatted string. The result will be:

A common mistake is to forget about potential null values, which can lead to `NullPointerExceptions`. Always validate your inputs!

# Using `StringJoiner` for Concatenation

Sometimes, you may need to build strings dynamically. Java provides the `StringJoiner` class, which is handy for creating delimited strings. It works well for cases where you want to format collections of strings.

Here's how you can use it:

The output will be:

`StringJoiner` is particularly useful when you want to ensure that the correct delimiter is added between elements without worrying about trailing commas.

# Real-World Applications of String Formatting

Understanding string formatting can significantly impact the usability of applications. Here are a few real-world applications:

*   **User Interfaces**: Displaying user information, notifications, or messages with well-formatted strings creates a better user experience.
*   **Reports and Logs**: In reporting tools, formatted strings can help create readable logs and reports, making it easier to extract information quickly.
*   **Internationalization**: When developing applications for a global audience, proper formatting ensures that messages are clear and culturally appropriate.

Now that you have a solid grasp of string formatting in Java, you can present your data in a more controlled and user-friendly manner. By leveraging methods like `String.format()`, `MessageFormat`, and `StringJoiner`, you can create clear, well-structured output that enhances your applications.

In the next chapter, we will look at how to compare strings effectively, including the nuances of equality checks and the implications of string interning.

```java
int number = 42;
String paddedNumber = String.format("Number: %05d", number);
System.out.println(paddedNumber);
```


```java
Number: 00042
```


```java
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

LocalDateTime now = LocalDateTime.now();
DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");
String formattedDate = now.format(formatter);
System.out.println(formattedDate);
```


```java
15-10-2023 14:30:45
```


```java
import java.text.MessageFormat;

String template = "Welcome, {0}. You have {1} new messages.";
String formattedMessage = MessageFormat.format(template, "Bob", 5);
System.out.println(formattedMessage);
```


```java
Welcome, Bob. You have 5 new messages.
```


```java
String name = null;
String formattedString = String.format("My name is %s", name != null ? name : "unknown");
System.out.println(formattedString);
```


```java
My name is unknown
```


```java
import java.util.StringJoiner;

StringJoiner joiner = new StringJoiner(", ");
joiner.add("Apple").add("Banana").add("Cherry");
String result = joiner.toString();
System.out.println(result);
```


```java
Apple, Banana, Cherry
```
