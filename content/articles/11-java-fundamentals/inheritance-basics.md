---
title: Inheritance Basics
description: Learn about Inheritance Basics in Java programming.
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

Inheritance is a core concept in object-oriented programming that allows one class to inherit the properties and behaviors of another.

This mechanism not only promotes code reusability but also establishes a natural hierarchy among classes. If you've ever wondered how we can create a structure that reflects real-world relationships or how we can avoid redundancy in our code, inheritance is the answer.

In this chapter, we'll dig into the **basics of inheritance** in Java. We’ll explore how it works, why it’s important, and provide real-world examples to illustrate its utility.

```java
class Animal {
    void eat() {
        System.out.println("This animal eats food");
    }
}

class Dog extends Animal {
    void bark() {
        System.out.println("The dog barks");
    }
}

class Cat extends Animal {
    void meow() {
        System.out.println("The cat meows");
    }
}

public class Main {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.eat(); // Inherited method
        dog.bark(); // Dog's own method

        Cat cat = new Cat();
        cat.eat(); // Inherited method
        cat.meow(); // Cat's own method
    }
}
```


# What is Inheritance?

At its core, inheritance is a way for one class to derive properties and methods from another class. The class that inherits is called the **subclass** (or child class), while the class being inherited from is the **superclass** (or parent class). This relationship allows subclasses to reuse code from superclasses, which can make your programs easier to maintain and extend.

### Key Benefits of Inheritance

*   **Code Reusability:** You can write common functionality once in a superclass and reuse it in multiple subclasses.
*   **Method Overriding:** Subclasses can provide specific implementations of methods defined in the superclass.
*   **Polymorphism:** Treating objects of different subclasses as objects of a common superclass enhances flexibility.

### A Simple Example

```java
Animal
      /    \
    Dog    Cat
```


Let’s start with a straightforward example to illustrate inheritance. Consider a basic structure for animals.

```java
class Vehicle {
    void start() {
        System.out.println("Vehicle is starting");
    }
}

class Car extends Vehicle {
    void drive() {
        System.out.println("Car is driving");
    }
}

class Bike extends Vehicle {
    void pedal() {
        System.out.println("Bike is pedaling");
    }
}

public class Main {
    public static void main(String[] args) {
        Car car = new Car();
        car.start(); // Inherited from Vehicle
        car.drive(); // Specific to Car

        Bike bike = new Bike();
        bike.start(); // Inherited from Vehicle
        bike.pedal(); // Specific to Bike
    }
}
```


In this example, both `Dog` and `Cat` classes extend the `Animal` class. They inherit the `eat` method, which represents a common behavior for all animals. Each subclass can also define its unique methods, such as `bark` for `Dog` and `meow` for `Cat`.

```java
class Employee {
    public String name;
    protected int id;
    private double salary;

    public void showDetails() {
        System.out.println("Name: " + name + ", ID: " + id);
    }
}

class Manager extends Employee {
    void display() {
        System.out.println("Manager ID: " + id); // Accessible because it's protected
        // System.out.println("Salary: " + salary); // Not accessible, will cause an error
    }
}

public class Main {
    public static void main(String[] args) {
        Manager mgr = new Manager();
        mgr.name = "Alice"; // Accessible because it's public
        mgr.id = 101; // Accessible because it's protected
        mgr.showDetails(); // Method is public
        mgr.display(); // Display Manager's details
    }
}
```


# How Inheritance Works in Java

Java supports single inheritance, meaning a class can only inherit from one superclass. This design choice helps to avoid issues like the "Diamond Problem," which can occur in languages that support multiple inheritance.

### The Inheritance Hierarchy

You can visualize the inheritance hierarchy as a tree structure. In our previous example, the hierarchy looks like this:

```java
$58
```


### The `extends` Keyword

In Java, we use the `extends` keyword to indicate that a class is inheriting from another class. The subclass automatically gets access to all public and protected members of its superclass. This creates a clear and organized way to structure your classes.

Here’s a more detailed example that shows the concept of inheritance in a slightly different context:

This example demonstrates how both `Car` and `Bike` inherit the `start` method from the `Vehicle` superclass, allowing for a clear understanding of shared functionality among vehicles.

# Understanding Access Modifiers

When it comes to inheritance, **access modifiers** play a crucial role in determining what members of the superclass are accessible in the subclass. Here’s a quick breakdown:

*   **Public:** Members are accessible from any other class.
*   **Protected:** Members are accessible within the same package and by subclasses in different packages.
*   **Default (no modifier):** Members are accessible only within the same package.
*   **Private:** Members are not accessible in the subclass at all.

### Example of Access Modifiers

Let’s expand on our previous example to see how these modifiers work in practice:

In this code, the `Manager` class can access the `name` and `id` fields but cannot access the `salary` field, demonstrating how access levels affect inheritance.

# Real-World Applications of Inheritance

Inheritance can be particularly useful in scenarios where you have a group of related classes. For example, consider an application for managing different types of accounts in a banking system. You can create a base class, `Account`, and then derive specific account types like `SavingsAccount` and `CheckingAccount`.

### Example: Banking System

In this example, both the `SavingsAccount` and `CheckingAccount` classes inherit from the `Account` superclass. They can use the shared `deposit` and `displayBalance` methods while also implementing their unique functionalities.

# Key Takeaways and Best Practices

As you start working with inheritance, here are some best practices to keep in mind:

*   **Favor Composition Over Inheritance:** While inheritance is powerful, sometimes it's better to use composition. If one class has an "is-a" relationship with another, inheritance makes sense. If it has a "has-a" relationship, consider using composition.
*   **Keep Class Hierarchies Shallow:** Deep inheritance trees can make code hard to follow. Aim for a flatter structure when possible.
*   **Use Interfaces for Flexibility:** When you need multiple types of behavior, consider using interfaces in conjunction with inheritance.

By understanding these principles, you can effectively design your Java applications to take full advantage of inheritance while maintaining clarity and ease of maintenance.

Now that you understand the basics of inheritance, you are ready to explore the **extends keyword** in the next chapter.

This will deepen your understanding of how to create subclasses and leverage inherited functionality more effectively.