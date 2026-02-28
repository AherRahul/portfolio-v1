---
title: extends Keyword
description: Learn about Extends Keyword in Java programming.
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

When you think about building software, you often picture a structure that needs a strong foundation.

In Java, that foundation can be thought of as **inheritance**, which allows one class to inherit properties and behaviors from another. The `extends` keyword is the cornerstone of this inheritance mechanism, enabling you to create a hierarchy of classes that share functionality while remaining distinct.

Understanding how to use `extends` effectively can significantly impact your coding practices, leading to cleaner, more maintainable code.

Let's dive into the details of the `extends` keyword and explore its applications, nuances, and best practices.

# What is the `extends` Keyword?

The `extends` keyword in Java is used to create a subclass from a superclass. This establishes an **is-a relationship** between the two classes, meaning that the subclass is a specialized version of the superclass. By using `extends`, you can inherit fields and methods from the superclass, allowing for code reuse and the creation of more specific functionalities.

Here’s a simple example to illustrate this concept:

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

// Main class to test
public class Main {
    public static void main(String[] args) {
        Dog myDog = new Dog();
        myDog.eat(); // Inherited method
        myDog.bark(); // Dog's own method
    }
}
```


In this example, the `Dog` class extends the `Animal` class. This means that `Dog` inherits the `eat` method from `Animal`, but it also has its own method, `bark`.

```java
// Superclass
class Vehicle {
    void start() {
        System.out.println("Vehicle is starting");
    }
}

// Subclass
class Car extends Vehicle {
    void honk() {
        System.out.println("The car honks.");
    }
}

// Main class to test
public class Main {
    public static void main(String[] args) {
        Car myCar = new Car();
        myCar.start(); // Inherited method
        myCar.honk();  // Car's own method
    }
}
```


# Creating Subclasses with `extends`

Creating subclasses using `extends` allows you to build more complex and specialized types of objects. When you extend a class, the subclass can add its own fields and methods, or modify the behavior of inherited methods.

### Single Inheritance

Java supports single inheritance, meaning that a class can only extend one other class. This restriction simplifies the inheritance model and avoids the complexities associated with multiple inheritance, such as the diamond problem.

Here's a practical example showing single inheritance:

```java
// Superclass
class Animal {
    void makeSound() {
        System.out.println("Some sound");
    }
}

// Subclass
class Cat extends Animal {
    @Override
    void makeSound() {
        System.out.println("Meow");
    }
}

// Main class to test
public class Main {
    public static void main(String[] args) {
        Animal myCat = new Cat();
        myCat.makeSound(); // Outputs: Meow
    }
}
```


In this scenario, `Car` extends `Vehicle`, inheriting the `start` method while adding its own `honk` method.

### Overriding Methods

One of the powerful features of inheritance is that subclasses can override methods from their superclass. This allows you to provide a specific implementation while still maintaining the method's signature.

Here, `Cat` overrides the `makeSound()` method from `Animal`. When we call `makeSound()` on an instance of `Cat`, it outputs `Meow`, demonstrating polymorphic behavior.

# Understanding the Inheritance Hierarchy

When using the `extends` keyword, it’s important to understand how Java handles the inheritance hierarchy. Java classes implicitly extend the `Object` class if no superclass is specified. This means that all Java classes inherit certain methods, such as `toString()`, `equals()`, and `hashCode()` from the `Object` class.

In this code, the `Person` class does not explicitly extend any class, but it still inherits from `Object`. This is why we can override `toString()` to provide a more meaningful string representation of the object.

# Practical Use Cases for `extends`

Understanding how to use `extends` effectively opens up a world of possibilities in your software design. Here are a few practical use cases:

### 1\. Code Reusability

By extending classes, you can avoid code duplication. For example, if multiple classes share common behavior, you can extract that behavior into a superclass.

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

// Main class to test
public class Main {
    public static void main(String[] args) {
        Person person = new Person("Alice");
        System.out.println(person); // Calls the overridden toString method
    }
}
```


Here, both `Circle` and `Square` extend the `Shape` class, leveraging the common interface to calculate area while providing their specific implementations.

### 2\. Building Frameworks

In frameworks, inheritance allows you to create a base class with essential functionality. Subclasses can then extend this base class to implement specific features. For instance, in a GUI framework, you might have a `Component` class that provides basic methods like `render()` and `update()`, while subclasses like `Button`, `TextBox`, and `Label` extend the `Component` class to implement their specific behavior.

### 3\. Implementing Design Patterns

Many design patterns, such as the Template Method and Factory Method patterns, rely on class inheritance. The `extends` keyword helps you define base classes that encapsulate shared behavior, while subclasses provide specific implementations.

# Common Pitfalls and Best Practices

While using the `extends` keyword can be incredibly powerful, it comes with some common pitfalls and best practices to keep in mind.

### 1\. Overusing Inheritance

Inheritance should be used judiciously. Sometimes, composition (having classes reference each other) is a better pattern than inheritance. If a class needs to use another class's functionality but does not fit the is-a relationship, consider composition instead.

### 2\. Tight Coupling

Using inheritance can lead to tight coupling between classes, making changes in one class affect others. This can make your codebase harder to maintain. Aim for loose coupling by favoring interfaces or abstract classes when appropriate.

### 3\. Method Overriding Nuances

When overriding methods, always make sure the method signature matches exactly. If you change the method's return type or parameters, you may inadvertently create a new method instead of overriding the existing one.

Here, the `show(int a)` method in `Derived` does not override `show()` from `Base`; it overloads it instead.

# Conclusion

The `extends` keyword is a fundamental part of Java's inheritance mechanism, enabling you to create robust, hierarchical class structures.

By understanding how to effectively utilize `extends`, you can enhance code reusability, improve maintainability, and leverage polymorphism to create elegant solutions.

Now that you understand how to use the `extends` keyword to create subclasses and leverage inheritance effectively, you are ready to explore the `super` keyword.

In the next chapter, we will look at how `super` allows you to access superclass methods and constructors, providing even more flexibility in your class designs.

```java
class Shape {
    double area() {
        return 0.0; // Default area
    }
}

class Circle extends Shape {
    double radius;

    Circle(double radius) {
        this.radius = radius;
    }

    @Override
    double area() {
        return Math.PI * radius * radius; // Area of a circle
    }
}

class Square extends Shape {
    double side;

    Square(double side) {
        this.side = side;
    }

    @Override
    double area() {
        return side * side; // Area of a square
    }
}
```


```java
class Base {
    void show() {
        System.out.println("Base show");
    }
}

class Derived extends Base {
    // This is not overriding, but overloading
    void show(int a) {
        System.out.println("Derived show with int: " + a);
    }
}
```
