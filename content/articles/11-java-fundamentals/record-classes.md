---
title: Record Classes
description: Learn about Record Classes in Java programming.
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

In the world of Java, we often find ourselves creating classes that serve as simple data carriers. Traditionally, this meant creating a class with fields, constructors, getters, setters, and so on, which can sometimes feel tedious.

Enter **Record Classes**, introduced in Java 14 as a preview feature and made stable in Java 16. They simplify the creation of data-centric classes, allowing you to focus on the data rather than boilerplate code.

Let’s dive into how Record Classes can streamline your Java development experience.

# What Are Record Classes?

At their core, Record Classes are a special kind of class introduced to provide a compact syntax for modeling immutable data. When you define a record, Java automatically generates the following:

```java
public record Person(String name, int age) {
}
```


*   Fields for all the properties declared in the record.
*   A constructor to initialize these fields.
*   Getters for each field.
*   Implementations of `equals()`, `hashCode()`, and `toString()` methods.

This means less boilerplate code and more focus on your application's logic.

Here's a simple example of how to define a record:

```java
public class Book {
    private final String title;
    private final String author;
    private final int year;

    public Book(String title, String author, int year) {
        this.title = title;
        this.author = author;
        this.year = year;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public int getYear() {
        return year;
    }

    @Override
    public String toString() {
        return "Book{" +
               "title='" + title + '\'' +
               ", author='" + author + '\'' +
               ", year=" + year +
               '}';
    }
}
```


In this example, `Person` is a record that has two fields: `name` and `age`. With this single line, you have created a class that is immutable and provides all the necessary methods for working with the data.

```java
public record Book(String title, String author, int year) {
}
```


Record Classes are inherently final, meaning they cannot be subclassed. This guarantees the immutability of the data.

# Advantages of Using Record Classes

Record Classes come with a range of benefits that are particularly relevant to modern software development practices:

## Reduced Boilerplate

Imagine you have a class with several fields. Traditionally, you would write both the class definition and the associated methods. With records, you can achieve the same in a single line.

#### Example: Traditional Class vs. Record Class

```java
public record Point(int x, int y) {
}

// Usage
Point p = new Point(1, 2);
// p.x = 3; // This line would result in a compilation error
```


Here’s a traditional class for a Book:

Now, here’s the same class defined as a record:

```java
public record Product(String name, double price) {
}

// Usage
Product product1 = new Product("Laptop", 999.99);
Product product2 = new Product("Laptop", 999.99);

System.out.println(product1.equals(product2)); // true
System.out.println(product1); // Product[name=Laptop, price=999.99]
```


Notice how concise the record version is? You don’t have to manually create getters or the constructor.

## Immutability

Records are immutable by design. Once you create an instance of a record, you cannot change its fields. This immutability leads to safer code, especially in multi-threaded environments.

### Example: Attempting to Modify a Record

```java
public record Circle(double radius) {
    public double area() {
        return Math.PI * radius * radius;
    }
}

// Usage
Circle circle = new Circle(5);
System.out.println("Area: " + circle.area()); // Area: 78.53981633974483
```


You’ll find that enforcing immutability helps prevent bugs that can arise from unintended changes to the state of an object.

## Built-in Methods

As mentioned, Record Classes automatically generate `equals()`, `hashCode()`, and `toString()`. This saves you time and ensures that your implementations are consistent with the best practices of Java.

### Example: Using Generated Methods

```java
interface Shape {
    double area();
}

public record Rectangle(double width, double height) implements Shape {
    @Override
    public double area() {
        return width * height;
    }
}

// Usage
Shape rectangle = new Rectangle(4, 5);
System.out.println("Area: " + rectangle.area()); // Area: 20.0
```


This is a vast improvement over writing those methods manually, ensuring that they behave correctly.

# Working with Record Classes

While Record Classes simplify many tasks, working with them also requires some understanding of their limitations and best practices. Let's explore a few of these aspects.

## Extending Functionality with Methods

You can still add custom methods to a record. This can be helpful for encapsulating behavior related to the data.

### Example: Adding Custom Methods

```java
public record User(String username, String email) {
}

// Usage
User user = new User("john_doe", "john@example.com");
// user.setEmail("john.doe@example.com"); // This will not compile
```


This ability allows you to create more meaningful abstractions while benefiting from the advantages of records.

## Implementing Interfaces

Records can implement interfaces just like regular classes. This allows you to use them in contexts where polymorphism is necessary.

### Example: Implementing an Interface

```java
User updatedUser = new User(user.username(), "john.doe@example.com");
```


Here, the `Rectangle` record implements the `Shape` interface, providing a clear structure for your code.

# Limitations of Record Classes

Despite their advantages, Record Classes have certain limitations that you should be aware of.

## No Setters or Mutable State

Since records are immutable, you cannot provide setters for their fields. This may lead to challenges when you need to change data after the initial creation.

### Example: Attempting to Use a Setter

```java
public record Animal(String name) {}

// This will not compile
public record Dog(String name) extends Animal(name) {
}
```


To "modify" a record, you must create a new instance:

This can lead to more object creation than you might expect, so keep it in mind when performance is a concern.

## No Inheritance

Records cannot extend other classes, nor can they be extended themselves. While they can implement interfaces, this restriction is crucial for understanding their role in Java's type system.

### Example: Attempting Inheritance

```java
public record UserDTO(String username, String email) {
}
```


The design choice here reinforces the integrity of records as simple data carriers.

# Practical Use Cases for Record Classes

Given their features, Record Classes shine in specific scenarios. Here are a few practical use cases.

### Data Transfer Objects (DTOs)

In applications, especially those using frameworks like Spring, you often need to pass data around. Records make excellent DTOs due to their simplicity and immutability.

#### Example: A Simple DTO

```java
public record AppConfig(String appName, int maxUsers) {
}
```


Using a record as a DTO allows for concise and clear data representation when transferring between layers.

### Configuration Classes

If you’re dealing with configuration settings in your applications, records can represent these settings neatly.

#### Example: Configuration Record

```java
import com.fasterxml.jackson.databind.ObjectMapper;

public record Employee(String name, int age) {
}

// Usage
String json = "{\"name\":\"Alice\",\"age\":30}";
ObjectMapper objectMapper = new ObjectMapper();
Employee employee = objectMapper.readValue(json, Employee.class);
```


This structure keeps your configuration tidy and ensures that the settings cannot be altered once set, which enhances stability.

### JSON Serialization

Many libraries, such as Jackson or Gson, work well with records for serialization and deserialization tasks. They can automatically map JSON properties to record fields.

#### Example: JSON Serialization with Jackson

This integration allows for quick data handling with minimal overhead.

Now that you understand the power and utility of Record Classes, you can effectively apply them in your Java applications. They streamline your code, reduce boilerplate, and enhance readability, especially in data-centric designs.

In the next chapter, we will delve into how Sealed Classes allow you to control class hierarchies and provide better type safety, enhancing your modeling capabilities in Java.