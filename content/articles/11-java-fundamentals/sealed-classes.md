---
title: Sealed Classes
description: Learn how Java sealed classes control inheritance, improve code maintainability, and enhance performance with clear examples and best practices.
datePublished: 2026-02-27
dateModified: 2026-02-27
topics:
  - java
courseName: 11-java-fundamentals
showOnArticles: false
featured: false
published: true
---


# Mastering Java Sealed Classes for Controlled Inheritance

## Introduction to Sealed Classes in Java

Sealed classes are a significant enhancement introduced in Java 15 as a preview and officially stabilized in Java 17. They offer developers the ability to define a class hierarchy with controlled inheritance by restricting which classes can extend a particular class. This feature addresses the common problem of uncontrolled inheritance, where any class can extend any other, often leading to complex, unmanageable, and insecure codebases.

By declaring a class as sealed, you specify a limited set of permitted subclasses. This explicit control improves code maintainability, enhances security, and even allows the Java compiler to optimize performance by having complete knowledge of the class hierarchy.

This blog post explores the fundamentals of sealed classes, their syntax, practical use cases, and advanced nuances to help you embrace this powerful feature in your Java applications.


## What Are Sealed Classes?

### Definition and Purpose

A **sealed class** is a special type of class that restricts its subclassing to a predefined set of classes. Unlike traditional classes that can be subclassed by any other class, sealed classes require you to explicitly list all permitted subclasses using the `permits` clause.

This mechanism:

- Controls inheritance,
- Prevents unauthorized extensions,
- Increases code clarity,
- Helps maintain a predictable class hierarchy.

### Basic Syntax

To declare a sealed class, use the `sealed` modifier followed by the `permits` clause listing allowed subclasses:

```java
public sealed class Shape permits Circle, Rectangle {
    // Common attributes and methods
}
```

In this example, only the classes `Circle` and `Rectangle` are permitted to extend `Shape`.


## Why Use Sealed Classes?

### Controlled Inheritance  
Sealed classes ensure that only specified classes can extend a base class, preventing arbitrary and potentially harmful subclassing.

### Improved Performance  
Knowing the complete hierarchy at compile-time enables the JVM and compiler to optimize method dispatch and other operations.

### Enhanced Readability and Maintainability  
Explicitly declaring permitted subclasses makes it easier for developers to understand and navigate the class hierarchy.


## How to Create Sealed Classes

### Declaring a Sealed Class and Its Subclasses

Beyond the simple example, sealed classes can have subclasses that are:

- **final**: Cannot be subclassed further.
- **sealed**: Restricts subclassing further with its own permits clause.
- **non-sealed**: Removes the sealing restriction for that subclass.

Example illustrating these options:

```java
public sealed class Shape permits Circle, Rectangle, Triangle {
    // Common properties and methods
}

public final class Circle extends Shape {
    // Circle-specific implementation
}

public non-sealed class Rectangle extends Shape {
    // Rectangle implementation, allowing unrestricted subclassing
}

public sealed class Triangle extends Shape permits EquilateralTriangle, ScaleneTriangle {
    // Triangle implementation with further restrictions
}

public final class EquilateralTriangle extends Triangle {
    // Specific implementation
}

public final class ScaleneTriangle extends Triangle {
    // Specific implementation
}
```

### Explanation of Subclass Types

- `final` subclasses cannot be extended, ensuring the hierarchy ends there.
- `non-sealed` subclasses open the hierarchy to unrestricted subclassing.
- `sealed` subclasses continue the sealed pattern, controlling their own permitted subclasses.


## Practical Examples of Sealed Classes

### Example 1: Vehicle Hierarchy

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

This example illustrates a simple sealed class `Vehicle` that restricts its subclasses to `Car` and `Truck`. Both subclasses are `final`, preventing further extension.

### Example 2: Payment Methods in Domain Modeling

Sealed classes help model domain concepts cleanly by enumerating all possible variants explicitly.

```java
public sealed interface PaymentMethod permits CreditCard, PayPal {
    void processPayment(double amount);
}

public final class CreditCard implements PaymentMethod {
    @Override
    public void processPayment(double amount) {
        // Process credit card payment logic
    }
}

public final class PayPal implements PaymentMethod {
    @Override
    public void processPayment(double amount) {
        // Process PayPal payment logic
    }
}
```

Using a sealed interface here ensures that only `CreditCard` and `PayPal` implement `PaymentMethod`, preventing any unexpected payment types.

### Example 3: State Machines

Sealed classes are ideal for modeling state transitions, where only a known set of states should exist:

```java
public sealed class State permits StartState, ProcessingState, EndState {
    // Base logic for states
}

public final class StartState extends State {
    // Start state logic
}

public final class ProcessingState extends State {
    // Processing state logic
}

public final class EndState extends State {
    // End state logic
}
```

This clear definition of possible states helps prevent invalid states and simplifies state management.


## Working with Sealed Interfaces

Sealed interfaces behave similarly to sealed classes by restricting which classes or interfaces can implement them.

### Benefits of Sealed Interfaces

- **Controlled Implementation**: Only specified classes can implement the interface.
- **Flexibility**: You can still define multiple implementations but in a controlled manner.

### Example:

```java
public sealed interface Notification permits EmailNotification, SMSNotification {
    void send(String message);
}

public final class EmailNotification implements Notification {
    @Override
    public void send(String message) {
        // Send email logic
    }
}

public final class SMSNotification implements Notification {
    @Override
    public void send(String message) {
        // Send SMS logic
    }
}
```


## Advanced Topics and Nuances

### Nested Sealed Classes

Sealed classes can be nested within other classes. When doing so, the outer class must also comply with sealing rules if declared sealed.

### Non-Subclassable Sealed Classes

If a sealed class has no permitted subclasses, it cannot be instantiated directly. This is a rare but important edge case to avoid.

### Reflection Limitations

Reflection can expose all subclasses of a sealed class, potentially breaking the sealing contract. Use reflection cautiously and ensure the sealed class contract is respected.


## Best Practices for Using Sealed Classes

- **Model Domain Concepts Clearly**: Use sealed classes to represent finite sets of types in your applications.
- **Specify Permitted Subclasses Explicitly**: Avoid ambiguity by declaring all subclasses in the `permits` clause.
- **Use Appropriate Modifiers**: Decide between `final`, `non-sealed`, or `sealed` for subclasses based on your design needs.
- **Plan for Extensibility**: Consider whether you might need to add subclasses in the future before sealing a class.
- **Test Edge Cases**: Ensure your sealed classes always have at least one permitted subclass to avoid instantiation issues.
- **Be Cautious with Reflection**: Avoid exposing sealed classes’ internals in ways that compromise their sealed nature.


## Summary

Java's sealed classes and interfaces bring a powerful new way to design your applications with controlled, finite class hierarchies. By limiting inheritance, they provide:

- Better maintainability,
- Improved readability,
- Enhanced performance,
- Stronger security guarantees.

Whether you are modeling domain entities, state machines, or API contracts, sealed classes allow you to create robust and predictable architectures. Embrace this feature to write cleaner, safer, and more optimized Java code.


## Frequently Asked Questions (FAQ)

#### Can sealed classes be instantiated directly?

No, sealed classes are typically abstract base classes and cannot be instantiated if they have permitted subclasses. They define a contract for subclasses.

#### Can I add new subclasses later?

You must update the `permits` clause to include any new subclasses. If the class is already sealed, adding new subclasses requires modifying the original class declaration.

#### Are sealed classes compatible with existing Java features?

Yes, sealed classes work alongside existing features like interfaces, abstract classes, and inheritance, adding an additional layer of control.

#### How do sealed classes affect performance?

Since the compiler knows all possible subclasses, it can optimize method dispatch and other operations, potentially improving performance.


Harness the power of sealed classes in Java 17 and beyond to write safer, cleaner, and more maintainable code!