---
title: Inheritance Basics
description: Learn the fundamentals of inheritance in Java, its benefits, access modifiers, and best practices to write clean, reusable, and maintainable object-oriented code.
datePublished: 2026-02-27
dateModified: 2026-02-27
topics:
  - java
courseName: 11-java-fundamentals
showOnArticles: false
featured: false
published: true
---


# Mastering Java Inheritance: Basics, Benefits & Best Practices

## Introduction to Inheritance in Java

Inheritance is a fundamental concept in object-oriented programming (OOP) that allows one class to inherit properties and behaviors from another. It promotes code reusability and establishes a hierarchical relationship between classes, enabling developers to model real-world relationships efficiently. In Java, inheritance is key to writing clean, maintainable, and extensible code.

This blog post will guide you through the basics of inheritance in Java, illustrate its benefits with examples, explain how access modifiers affect inheritance, and share best practices to maximize its effectiveness in your projects.


## What is Inheritance?

Inheritance enables a class, known as the **subclass** or child class, to derive attributes and methods from another class, called the **superclass** or parent class. This relationship allows subclasses to reuse code defined in superclasses without rewriting it, facilitating easier maintenance and extension of software.

### Key Benefits of Inheritance

- **Code Reusability:** Common functionality can be written once in a superclass and shared across multiple subclasses.
- **Method Overriding:** Subclasses can modify or extend the behavior of methods inherited from the superclass.
- **Polymorphism:** Objects of different subclasses can be treated uniformly as instances of the superclass, enhancing flexibility and scalability.

### Visual Representation

```
   Animal
   /    \
Dog     Cat
```

In this hierarchy, `Dog` and `Cat` inherit from `Animal`, sharing common behaviors such as eating, while defining their unique actions like barking or meowing.


## How Inheritance Works in Java

In Java, inheritance is implemented using the `extends` keyword. A subclass inherits all accessible members (fields and methods) from its superclass, gaining base functionalities without duplication.

### Single Inheritance Model

Java supports **single inheritance**, meaning a class can extend only one superclass. This avoids complexities such as the "Diamond Problem," which can arise in languages that allow multiple inheritance.

### Example: Inheritance with Animals

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

In this example, both `Dog` and `Cat` inherit the `eat()` method from `Animal` and also define their unique behaviors.


## Understanding the `extends` Keyword

The `extends` keyword signals that a class inherits from another class. This creates a subclass-superclass relationship where the subclass automatically has access to all non-private members of the superclass, fostering an organized class hierarchy.

### Example: Vehicles Inheritance

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

Here, both `Car` and `Bike` share the `start()` method from `Vehicle` but implement their own specific behaviors.


## Role of Access Modifiers in Inheritance

Access modifiers control the visibility of class members in Java, which directly impacts how inheritance works.

### Types of Access Modifiers

| Modifier | Accessibility in Subclass            | Description                                     |
|----------|------------------------------------|-------------------------------------------------|
| `public` | Yes                                | Accessible from any class                        |
| `protected` | Yes (even in different packages) | Accessible within package and subclasses        |
| *default* (no modifier) | Yes, only within the same package | Accessible only within the same package         |
| `private` | No                                 | Not accessible outside the class, including subclasses |

### Access Modifier Example

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
        System.out.println("Manager ID: " + id); // Accessible because protected
        // System.out.println("Salary: " + salary); // Error: salary is private
    }
}

public class Main {
    public static void main(String[] args) {
        Manager mgr = new Manager();
        mgr.name = "Alice"; // public access
        mgr.id = 101;       // protected access
        mgr.showDetails();
        mgr.display();
    }
}
```

This example shows that `Manager` can access `name` and `id` but not `salary` because it is private.


## Real-World Applications of Inheritance

Inheritance is especially useful in designing systems with related entities sharing common behaviors. Let’s explore a practical example in banking.

### Example: Banking System

Imagine a base class `Account` that handles common operations like depositing money and displaying balances. Specific account types like `SavingsAccount` and `CheckingAccount` can extend `Account` to inherit these functionalities while adding their unique features.

```java
class Account {
    protected double balance;

    void deposit(double amount) {
        balance += amount;
        System.out.println("Deposited: " + amount);
    }

    void displayBalance() {
        System.out.println("Balance: " + balance);
    }
}

class SavingsAccount extends Account {
    void addInterest() {
        balance += balance * 0.05; // 5% interest
        System.out.println("Interest added.");
    }
}

class CheckingAccount extends Account {
    void deductFees() {
        balance -= 10; // Monthly fees
        System.out.println("Fees deducted.");
    }
}
```

Inheritance allows these account types to reuse deposit and display logic, reducing code duplication and improving maintainability.


## Best Practices and Key Takeaways

While inheritance is a powerful tool, applying it wisely is essential for clean, efficient design.

### Favor Composition Over Inheritance

- Use inheritance when there is a clear "is-a" relationship between classes (e.g., Dog is-an Animal).
- Use composition ("has-a" relationships) to build complex objects from simpler ones when inheritance is inappropriate.

### Keep Inheritance Hierarchies Shallow

- Deep inheritance trees can complicate code understanding and maintenance.
- Aim for flatter hierarchies to keep your design simple and clear.

### Use Interfaces for Flexibility

- When multiple behaviors are needed that don't fit neatly into a single inheritance chain, interfaces allow classes to implement multiple behavior contracts, complementing inheritance.

### Avoid Overriding Just for the Sake of It

- Override methods in subclasses only when you need to alter or extend superclass behavior.
- Unnecessary overriding can lead to confusing code and maintenance challenges.


## Conclusion

Inheritance in Java is a cornerstone of object-oriented programming that supports code reuse, logical hierarchy creation, and polymorphism. By understanding how to use the `extends` keyword, manage access modifiers, and apply best practices, you can design flexible and maintainable Java applications.

With this foundation, you are now ready to deepen your knowledge by exploring how to effectively use inheritance alongside other OOP principles such as interfaces and composition to build robust software systems.


## Frequently Asked Questions (FAQ)

**Q1: Can a Java class inherit from multiple classes?**  
No, Java supports only single inheritance to avoid complexities like the Diamond Problem.

**Q2: What happens if a subclass overrides a method from its superclass?**  
The subclass’s method is called instead of the superclass’s method when invoked on subclass objects.

**Q3: Are private members inherited by subclasses?**  
Private members are not accessible in subclasses, but they are still part of the subclass’s object.

**Q4: How does protected access differ from default?**  
Protected members are accessible to subclasses even outside the package, while default (package-private) access limits visibility to the same package only.


By mastering inheritance, you take an important step toward writing elegant, efficient, and scalable Java code. Happy coding!