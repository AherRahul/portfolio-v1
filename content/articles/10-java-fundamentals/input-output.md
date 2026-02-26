---
title: "Input &amp; Output"
description: "Learn about Input Output in Java programming."
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - java
courseName: "10-java-fundamentals"
showOnArticles: false
featured: false
---

![hero image](https://algomaster.io/og-image.png)

Understanding how to handle **input and output (I/O)** in Java is fundamental for any developer. Whether you're building console applications, working with files, or interacting with users, mastering I/O can significantly enhance your programs' functionality.

In this chapter, we'll dive into the different techniques for reading from and writing to various sources, while also discussing some common pitfalls and best practices.

# The Basics of Input and Output

When we talk about I/O in Java, we're essentially referring to how our program communicates with the outside world. This can involve reading data entered by users, writing output to the console, or handling files on the disk.

The core of I/O in Java revolves around the `java.io` package, which provides a rich set of classes and methods for reading and writing data. At its simplest, I/O operations can be divided into two categories: **input** and **output**.

### Standard Input and Output

For console applications, standard input (stdin) and output (stdout) are your primary channels. You typically use `System.in` for input and `System.out` for output.

In this example, we use `Scanner` to read user input. The `nextLine()` method captures the entire line entered by the user until they hit Enter.

```java
import java.util.Scanner;

public class InputOutputExample {
    public static void main(String[] args) {
        // Create a Scanner object to read input
        Scanner scanner = new Scanner(System.in);
        
        System.out.print("Enter your name: ");
        String name = scanner.nextLine(); // Read user input
        
        System.out.println("Hello, " + name + "!"); // Output greeting
        
        scanner.close(); // Close the scanner
    }
}
```


### Why Use Scanner?

Using `Scanner` provides a simple and efficient way to parse primitive types and strings. It handles various input formats, such as integers, doubles, and even strings. However, it's essential to remember to close the `Scanner` once you’re done to free resources.

# Reading Input from the Console

While `Scanner` is great for basic input, there are situations where you might want to read from the console differently. For example, you might need to handle input more manually or read multiple values at once. Let's explore a couple of these scenarios.

```java
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

public class BufferedReaderExample {
    public static void main(String[] args) {
        BufferedReader reader = new BufferedReader(new InputStreamReader(System.in));
        
        try {
            System.out.print("Enter your age: ");
            String ageStr = reader.readLine(); // Read input
            int age = Integer.parseInt(ageStr); // Parse input to integer
            
            System.out.println("You are " + age + " years old.");
        } catch (IOException e) {
            System.out.println("An error occurred while reading input.");
        } catch (NumberFormatException e) {
            System.out.println("Please enter a valid number.");
        }
    }
}
```


### Using BufferedReader

If you need to read lines of text efficiently, `BufferedReader` is an excellent choice. It buffers the input, making it faster for reading large amounts of data.

### Key Benefits of BufferedReader

*   **Efficiency**: It reads data in larger chunks, which can significantly improve performance.
*   **Flexibility**: You can read lines, characters, or even sections of a file, making it versatile for various tasks.

### Error Handling

Notice how we've wrapped our input reading in a try-catch block. This is crucial for dealing with potential exceptions, such as `IOException` when there's a problem reading input or `NumberFormatException` if the input is not a valid integer.

# Writing Output to the Console

Writing output in Java is straightforward, thanks to `System.out`. However, there are techniques and nuances that can enhance your output formatting, making it more user-friendly.

### Using PrintStream

Java's `PrintStream` class, which `System.out` is an instance of, provides several methods for printing formatted text. For example, you can use `printf` for formatted output.

```java
public class OutputExample {
    public static void main(String[] args) {
        String name = "Alice";
        int age = 30;

        // Using printf to format the output
        System.out.printf("Name: %s, Age: %d%n", name, age);
    }
}
```


### Benefits of Formatted Output

*   **Readability**: Using formatted strings can greatly improve the readability of your output, especially when dealing with multiple data types.
*   **Customization**: You can control how numbers are displayed, such as specifying decimal places, padding, or alignment.

# File Input and Output

While console I/O is essential, working with files is where Java's I/O capabilities really shine. Let's look at how to read from and write to files using `FileReader`, `FileWriter`, and `BufferedReader`.

### Writing to a File

To create and write to a file, you can use `FileWriter` along with `BufferedWriter` for efficiency.

### Reading from a File

Similarly, reading from a file can be done using `FileReader` and `BufferedReader`.

### Key Takeaways for File I/O

*   Always use try-with-resources to ensure that your file streams are closed automatically.
*   Handle exceptions gracefully to prevent your program from crashing due to file access issues.

# Practical Use Cases for I/O

Understanding how to perform I/O operations opens up a world of possibilities. Here are some practical applications where I/O is essential:

### User Input for Configuration

Imagine creating a program that requires user configuration. By reading from the console or a configuration file, you can customize how your application runs.

### Data Persistence

Saving user data to files is crucial for applications that need to remember state between sessions. Whether it's user preferences or game saves, file I/O is the key.

### Logging

Implementing logging in your applications allows you to write important runtime information to a file, which is invaluable for debugging.

### Example Usage of Logger

```java
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class FileWriteExample {
    public static void main(String[] args) {
        String filename = "output.txt";
        
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(filename))) {
            writer.write("Hello, world!");
            writer.newLine(); // Move to the next line
            writer.write("Welcome to file writing in Java.");
        } catch (IOException e) {
            System.out.println("An error occurred while writing to the file.");
        }
    }
}
```


In the next chapter, we will look at how to effectively document your code, which can help you and others understand your work better.

```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class FileReadExample {
    public static void main(String[] args) {
        String filename = "output.txt";
        
        try (BufferedReader reader = new BufferedReader(new FileReader(filename))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line); // Print each line read
            }
        } catch (IOException e) {
            System.out.println("An error occurred while reading the file.");
        }
    }
}
```


```java
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;

public class Logger {
    private BufferedWriter writer;

    public Logger(String filename) throws IOException {
        writer = new BufferedWriter(new FileWriter(filename, true)); // Append mode
    }

    public void log(String message) throws IOException {
        writer.write(message);
        writer.newLine();
    }

    public void close() throws IOException {
        writer.close();
    }
}
```


```java
public class LoggerExample {
    public static void main(String[] args) {
        try {
            Logger logger = new Logger("app.log");
            logger.log("Application started.");
            logger.log("An error occurred.");
            logger.close();
        } catch (IOException e) {
            System.out.println("Could not log message.");
        }
    }
}
```
