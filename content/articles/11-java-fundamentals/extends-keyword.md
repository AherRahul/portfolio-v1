---
title: extends Keyword
description: Learn how Java's `extends` keyword enables inheritance for code reuse, method overriding, and creating robust class hierarchies with practical examples and best practices.
datePublished: 2026-02-27
dateModified: 2026-02-27
topics:
  - java
courseName: 11-java-fundamentals
showOnArticles: false
featured: false
published: true
---


# Mastering Java’s `extends` Keyword: Inheritance & Best Practices

## Introduction to Java Inheritance and `extends`

When building software, a solid foundation is crucial—similarly, in Java programming, inheritance forms the backbone of object-oriented design. The `extends` keyword is the primary mechanism that allows one class (subclass) to inherit fields and methods from another class (superclass). This relationship enables code reuse, specialization, and polymorphism, which are fundamental to creating clean, maintainable, and scalable codebases.

This blog post explores the `extends` keyword in depth, illustrating its purpose, usage, and best practices in Java programming. Whether you’re a beginner or looking to refine your OOP skills, understanding inheritance will elevate your coding proficiency.


## What is the `extends` Keyword?

### Defining the `extends` Keyword

In Java, `extends` is used to create a subclass from a superclass, establishing an **is-a relationship**. This means the subclass inherits properties (fields) and behaviors (methods) from its superclass while allowing the addition of new features or method modifications.

### Simple Example of `extends`

```java
// Superclass
class Animal {
    void eat() {
        System.out.println("This animal eats food.");
    }
}

// Subclass
class Dog extends Animal {
    void bark() {
        System.out.println("The dog barks.");
    }
}

// Testing the classes
public class Main {
    public static void main(String[] args) {
        Dog myDog = new Dog();
        myDog.eat();  // Inherited method from Animal
        myDog.bark(); // Dog’s own method
    }
}
```

Here, `Dog` extends `Animal`, inheriting the `eat()` method but also adding its unique behavior with `bark()`.


## Creating Subclasses with `extends`

### Single Inheritance in Java

Java supports **single inheritance**, meaning a class can extend only one superclass. This design avoids complexity such as the diamond problem found in multiple inheritance models.

#### Example of Single Inheritance

```java
class Vehicle {
    void start() {
        System.out.println("Vehicle is starting");
    }
}

class Car extends Vehicle {
    void honk() {
        System.out.println("The car honks.");
    }
}

public class Main {
    public static void main(String[] args) {
        Car myCar = new Car();
        myCar.start(); // Inherited method
        myCar.honk();  // Car’s own method
    }
}
```

`Car` inherits the `start()` method from `Vehicle`, and adds its specific `honk()` method.

### Method Overriding for Polymorphism

Subclasses can override superclass methods to provide specialized behavior while preserving the original method signature.

```java
class Animal {
    void makeSound() {
        System.out.println("Some sound");
    }
}

class Cat extends Animal {
    @Override
    void makeSound() {
        System.out.println("Meow");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal myCat = new Cat();
        myCat.makeSound(); // Outputs: Meow
    }
}
```

This demonstrates polymorphism, where the method called depends on the object’s runtime type rather than its reference type.


## Understanding the Inheritance Hierarchy

### Implicit Inheritance from `Object`

All Java classes implicitly extend the base `Object` class if no superclass is specified. This means every class inherits universal methods like `toString()`, `equals()`, and `hashCode()`.

#### Overriding `toString()` Example

```java
class Person {
    String name;

    Person(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Person name: " + name;
    }
}

public class Main {
    public static void main(String[] args) {
        Person person = new Person("Alice");
        System.out.println(person); // Calls overridden toString()
    }
}
```

This override allows for a meaningful string representation of the `Person` object when printed.


## Practical Use Cases for `extends`

### 1. Code Reusability and Logical Hierarchies

Inheritance lets you extract common behaviors into a superclass to avoid duplicating code across multiple classes.

```java
class Shape {
    double area() {
        return 0.0; // Default implementation
    }
}

class Circle extends Shape {
    double radius;

    Circle(double radius) {
        this.radius = radius;
    }

    @Override
    double area() {
        return Math.PI * radius * radius;
    }
}

class Square extends Shape {
    double side;

    Square(double side) {
        this.side = side;
    }

    @Override
    double area() {
        return side * side;
    }
}
```

Both `Circle` and `Square` provide their specific `area()` implementations while sharing the `Shape` interface.

### 2. Building Frameworks and Libraries

Inheritance allows base classes to define essential functionality, while subclasses extend and customize behaviors. For example, a GUI framework might have a `Component` superclass with generic methods such as `render()` and `update()`, extended by `Button`, `TextBox`, or `Label` classes implementing specialized UI elements.

### 3. Implementing Design Patterns

Many design patterns rely on inheritance to define customizable steps or factory methods. For example, the Template Method pattern uses a base class defining the algorithm skeleton with subclasses implementing specific steps.


## Common Pitfalls and Best Practices

### 1. Avoid Overusing Inheritance

Inheritance implies an **is-a relationship**. If this relationship does not exist, consider using **composition** instead (i.e., “has-a” relationship), which often leads to more flexible and maintainable designs.

### 2. Beware of Tight Coupling

Inheritance can tightly couple subclasses to superclasses, which makes changes more risky and propagation of bugs more likely. Favor interfaces or abstract classes to reduce coupling where possible.

### 3. Method Overriding Nuances

Ensure method signatures match exactly when overriding. Changing parameters or return types results in method overloading, not overriding, which can lead to unexpected behaviors.

```java
class Base {
    void show() {
        System.out.println("Base show");
    }
}

class Derived extends Base {
    // Not overriding, but overloading
    void show(int a) {
        System.out.println("Derived show with int: " + a);
    }
}
```

In this example, `show(int a)` is an overloaded method, not an override.


## Conclusion

The `extends` keyword is a fundamental feature of Java’s inheritance system, enabling developers to reuse code, build hierarchical class structures, and implement polymorphism. Understanding how to properly apply inheritance improves software design, making your code cleaner and easier to maintain.

By mastering `extends`, you can create subclasses that build upon existing code, override methods to customize behavior, and participate in Java’s rich object-oriented ecosystem.

Next, explore the `super` keyword to learn how subclasses can invoke superclass constructors and methods, adding even more flexibility to your class designs.


## FAQ

**Q1: Can a class extend multiple classes in Java?**  
A1: No, Java supports single inheritance only. A class can extend one superclass but implement multiple interfaces.

**Q2: What happens if I don’t use `extends` in a class?**  
A2: The class implicitly extends `java.lang.Object`, inheriting its basic methods.

**Q3: How do I call a superclass method inside an overridden method?**  
A3: Use the `super` keyword, e.g., `super.methodName()`.

**Q4: When should I use inheritance vs composition?**  
A4: Use inheritance when there is an is-a relationship. Use composition when you want to include functionality without inheriting from a class.


Harness the power of Java inheritance with the `extends` keyword, and take your object-oriented programming skills to the next level!