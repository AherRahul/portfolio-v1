---
title: "Access Modifiers"
description: "Learn about Access Modifiers in Java programming."
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - java
courseName: "10-java-fundamentals"
showOnArticles: false
featured: false
---

![hero image](https://algomaster.io/og-image.png)

Understanding **access modifiers** is crucial for encapsulating your data and controlling access within your Java applications. They not only influence visibility but also help establish a solid architecture and design in your code.

Let's dive in and explore the different types of access modifiers, their use cases, and the best practices for applying them effectively.

# What Are Access Modifiers?

Access modifiers in Java define the visibility or accessibility of classes, methods, and variables. They play an essential role in encapsulation, one of the core principles of object-oriented programming (OOP). By controlling access, you can protect the integrity of your objects and make your code more maintainable.

Java provides four primary access modifiers:

*   **public**
*   **protected**
*   **default** (no modifier)
*   **private**

Each of these modifiers has distinct implications on how and where elements can be accessed in your code.

# Public Access Modifier

The **public** modifier allows a class, method, or variable to be accessible from any other class. This is the least restrictive access level. When you declare something as public, you are saying that it can be accessed from anywhere in your application.

### Code Example

```java
public class User {
    public String username;
    
    public void displayUsername() {
        System.out.println("Username: " + username);
    }
}
```


In this example, the `User` class and its `username` variable are public. Any other class can access the `username` and invoke `displayUsername()` without any restrictions.

```java
public class Animal {
    protected String sound;

    protected void makeSound() {
        System.out.println("Animal sound: " + sound);
    }
}

public class Dog extends Animal {
    public Dog() {
        sound = "Bark";
    }

    public void bark() {
        makeSound(); // Accessing protected method
    }
}
```


### Use Cases

*   Use **public** for methods and variables that need to be accessible across different packages or modules.
*   Public APIs and library classes often expose public access to their methods for widespread use.

# Protected Access Modifier

The **protected** modifier is more restrictive than public. It allows access to classes in the same package and to subclasses, even if they are in different packages. This modifier is useful for inheritance, where you want to allow subclasses to access certain properties or methods.

### Code Example

```java
class PackagePrivateClass {
    void display() {
        System.out.println("I am package-private");
    }
}
```


Here, the `sound` variable and `makeSound()` method in the `Animal` class are protected. The `Dog` class, which extends `Animal`, can access these members, allowing it to use the inherited functionality.

### Use Cases

*   Use **protected** when designing classes that are intended to be extended, allowing subclasses to use or modify the inherited properties and methods.
*   Ideal for framework or library development where you want to provide some level of access to derived classes.

# Default Access Modifier

When you don't specify an access modifier, Java uses the **default** access level. This means the class, method, or variable is accessible only within its own package. This is useful for package-private classes that should not be exposed to the outside world.

### Code Example

```java
public class BankAccount {
    private double balance;

    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }

    public double getBalance() {
        return balance; // Accessing private variable
    }
}
```


In this code, `PackagePrivateClass` is accessible only within the same package. If you try to access `display()` from a different package, you'll get a compilation error.

### Use Cases

*   Use **default** access when you want to restrict access to classes and methods that should not be visible outside their package.
*   Useful for organizing code logically within a package while keeping implementation details hidden.

# Private Access Modifier

The **private** modifier is the most restrictive access level. A private member can only be accessed within its own class. This is crucial for maintaining encapsulation, where you want to hide the internal state of an object from the outside world.

### Code Example

```java
public class Configuration {
    private static String setting;

    public static void setSetting(String value) {
        setting = value; // Accessing private variable
    }

    public static String getSetting() {
        return setting;
    }
}
```


In this example, the `balance` variable is private. It cannot be accessed directly from outside the `BankAccount` class, ensuring that the balance can only be modified through the `deposit` method. This encapsulation prevents arbitrary changes to the `balance`.

### Use Cases

*   Use **private** for variables and methods that are implementation details and should not be exposed to the outside world.
*   Protect sensitive data and maintain control over how data can be accessed or modified.

# Combining Access Modifiers

You can also combine access modifiers with other keywords like **static** and **final** to fine-tune access levels in your classes. For example, you could have a public static method that is accessible from anywhere but works with private instance variables.

### Code Example

Here, `setting` is a private static variable. It's modified and accessed through public static methods, allowing controlled access to it while keeping the actual data private.

### Use Cases

*   Combining modifiers helps in creating a clear API while maintaining the flexibility and control you need over your class's internals.
*   Use this approach to implement singleton patterns or other design patterns effectively.

# Best Practices for Using Access Modifiers

Understanding when to use each access modifier can significantly improve your code's maintainability and readability. Here are some best practices to keep in mind:

1.  **Favor Restriction**: Start with private and only increase visibility as necessary. This principle of least privilege helps prevent unintended interactions.
2.  **Keep It Simple**: Avoid using public access unless absolutely necessary. This reduces the surface area for bugs and makes your API cleaner.
3.  **Use Protected Judiciously**: While protected can be useful for inheritance, overusing it can lead to tightly coupled code and make testing harder.
4.  **Document Your Decisions**: When you choose a particular access level, document why you made that choice. This will help future developers (or even you) understand your reasoning.
5.  **Refactor When Needed**: If you find that a class or method's access level is too restrictive or too loose, don’t hesitate to refactor it. Code evolves, and so should your access modifiers.

By following these best practices, you can create a robust and maintainable codebase that leverages the power of access modifiers effectively.

Now that you understand access modifiers and how they can help you encapsulate your data and control access in your Java applications, you are ready to explore the next important topic: **Getters and Setters**.

In the next chapter, we will look at how these methods provide a controlled interface to your class's private data, enhancing encapsulation further while also maintaining flexibility.