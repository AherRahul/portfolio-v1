---
title: Sealed Classes
description: Learn about Sealed Classes in Java programming.
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

Sealed classes are a powerful feature introduced in Java 15 as a preview, and solidified in Java 17. They allow you to define a class with a limited set of subclasses.

This concept tackles the common issue of uncontrolled inheritance, where any class can extend any other class, potentially leading to unmanageable code.

By sealing a class, you can ensure that only specific known subclasses can extend it, enhancing both maintainability and security in your codebase.

Let's dive into the world of sealed classes and explore their syntax, practical use cases, and nuances.

# Sealed Class Basics

A **sealed class** is defined using the `sealed` keyword. This designation indicates that the class can only be subclassed by specified classes or interfaces. To declare a sealed class in Java, you also need to specify which classes are allowed to extend it using the `permits` clause.

Here's a basic example:

```java
public sealed class Shape permits Circle, Rectangle {
    // Common properties and methods for all shapes
}
```


In this example, `Shape` is a sealed class that can only be extended by the `Circle` and `Rectangle` classes.

```java
public sealed class Vehicle permits Car, Truck {
    private String brand;

    public Vehicle(String brand) {
        this.brand = brand;
    }

    public String getBrand() {
        return brand;
    }

    public void start() {
        System.out.println("Starting the vehicle...");
    }
}

public final class Car extends Vehicle {
    public Car(String brand) {
        super(brand);
    }

    @Override
    public void start() {
        System.out.println("Starting the car...");
    }
}

public final class Truck extends Vehicle {
    public Truck(String brand) {
        super(brand);
    }

    @Override
    public void start() {
        System.out.println("Starting the truck...");
    }
}
```


### Why Use Sealed Classes?

*   **Controlled Inheritance**: Sealed classes prevent unauthorized extensions, which can lead to a more predictable and understandable class hierarchy.
*   **Improved Performance**: The Java compiler can optimize sealed classes better since it has knowledge of the complete hierarchy.
*   **Enhanced Readability**: By explicitly listing permitted subclasses, developers can understand the relationships at a glance.

# Creating Sealed Classes

Let’s dig deeper into how you can create and utilize sealed classes effectively.

### Basic Example of Sealed Class with Subclasses

```java
public sealed class Shape permits Circle, Rectangle, Triangle {
    // Common properties and methods
}

public final class Circle extends Shape {
    // Implementation for Circle
}

public non-sealed class Rectangle extends Shape {
    // Implementation for Rectangle
}

public sealed class Triangle extends Shape permits EquilateralTriangle, ScaleneTriangle {
    // Implementation for Triangle
}

public final class EquilateralTriangle extends Triangle {
    // Implementation for EquilateralTriangle
}

public final class ScaleneTriangle extends Triangle {
    // Implementation for ScaleneTriangle
}
```


Here’s a more detailed example illustrating how to define a sealed class and its subclasses:

```java
public sealed class Payment permits CreditCardPayment, PayPalPayment, BankTransferPayment {
    // Common properties and methods
}

public final class CreditCardPayment extends Payment {
    // Implementation specific to credit card payments
}

public final class PayPalPayment extends Payment {
    // Implementation for PayPal payments
}

public final class BankTransferPayment extends Payment {
    // Implementation for bank transfers
}
```


In this example, `Vehicle` is a sealed class with `Car` and `Truck` as its permitted subclasses. Notice how both subclasses are declared as `final`. This means they cannot be further extended, which is a common practice in sealed class hierarchies to maintain control.

```java
public sealed class State permits StartState, ProcessingState, EndState {
    // Base state logic
}

public final class StartState extends State {
    // Logic for the start state
}

public final class ProcessingState extends State {
    // Logic for processing state
}

public final class EndState extends State {
    // Logic for the end state
}
```


### Permitted Subclasses

Permitted subclasses can be:

*   **Final**: Prevent any further subclassing.
*   **Non-sealed**: Allow unrestricted subclassing of that subclass.
*   **Sealed**: Limit further subclasses.

Here is how you might implement all three options:

### The `permits` Clause

The `permits` clause clearly shows which classes can extend the sealed class. This explicit relationship is crucial for understanding the code structure.

# Real-World Applications

Sealed classes shine in scenarios where you want to control the types of objects that can be created. Here are a few real-world applications:

### Domain Modeling

In domain-driven design, sealed classes can represent a finite set of types. For example, consider an application that processes different payment methods:

```java
public sealed interface PaymentMethod permits CreditCard, PayPal {
    void processPayment(double amount);
}

public final class CreditCard implements PaymentMethod {
    @Override
    public void processPayment(double amount) {
        // Logic to process credit card payment
    }
}

public final class PayPal implements PaymentMethod {
    @Override
    public void processPayment(double amount) {
        // Logic to process PayPal payment
    }
}
```


By using sealed classes, you ensure that all payment types are predefined, reducing the risk of errors introduced by unexpected implementations.

### State Machines

Sealed classes can also model state machines effectively. Each state can be a subclass that knows how to handle transitions:

This approach clarifies which states exist and prevents unauthorized states from being introduced.

# Working with Sealed Interfaces

Just like classes, you can also create **sealed interfaces**. This can be useful in scenarios where you want to define a contract with a limited set of implementations.

### Example of a Sealed Interface

### Benefits of Sealed Interfaces

*   **Contract Control**: Sealed interfaces ensure that only specific implementations can fulfill the contract, similar to sealed classes.
*   **Flexibility**: They allow you to define multiple implementations while still controlling the exposure.

# Edge Cases and Nuances

Working with sealed classes can bring some complexities. It’s essential to be aware of edge cases that can cause confusion or errors.

### Nested Sealed Classes

You can have sealed classes nested within other classes. However, the outer class must also follow the rules of sealing if it’s declared as sealed.

### Non-Subclassable Sealed Classes

If a sealed class is defined but has no permitted subclasses, it cannot be instantiated directly, which might lead to confusion.

Warning

Always ensure that your sealed classes have at least one permitted subclass. Otherwise, it could lead to unexpected situations in your code.

### Reflection and Sealed Classes

Using reflection with sealed classes can be tricky, as it may expose all subclasses, potentially violating the intent of sealing. When using reflection, ensure you maintain control over what is exposed.

# Summary and Best Practices

Sealed classes and interfaces provide a robust way to create controlled hierarchies in your Java applications. Here are some best practices to keep in mind:

*   **Use Sealed Classes for Domain Modeling**: They provide clarity and maintainability in your code.
*   **Define Clear Hierarchies**: Always specify permitted subclasses to avoid confusion.
*   **Consider Future Needs**: While sealing a class, think about whether you might need to add new subclasses later.
*   **Stay Consistent**: Use `final`, `non-sealed`, or `sealed` for subclasses as per your design requirement to maintain a clear and predictable structure.

Sealed classes are a game-changer for managing class hierarchies effectively. They not only improve the design of your application but also enhance maintainability and readability.