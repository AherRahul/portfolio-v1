---
title: "super Keyword"
description: "Learn about Super Keyword in Java programming."
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - java
courseName: "10-java-fundamentals"
showOnArticles: false
featured: false
---

![hero image](https://algomaster.io/og-image.png)

Understanding how the `super` keyword works is essential for mastering inheritance in Java. It acts as a bridge between parent and child classes, enabling you to access methods and constructors from the superclass.

This chapter will unpack everything you need to know about `super`, from its syntax to practical use cases. We’ll also explore common pitfalls and nuances that can trip up even seasoned developers.

# The Basics of `super`

At its core, the `super` keyword is a reference variable that allows you to refer to the immediate parent class object. This can be incredibly useful in a few scenarios:

1.  **Accessing Superclass Methods**: When a subclass overrides a method from its parent class, you might still want to call the original method from the superclass.
2.  **Constructor Calls**: You can use `super()` to invoke a parent class’s constructor, ensuring inherited properties are properly initialized.

Let’s start with a simple example to illustrate these points:

```java
class Animal {
    void sound() {
        System.out.println("Animal makes a sound");
    }
}

class Dog extends Animal {
    void sound() {
        System.out.println("Dog barks");
    }

    void callSuperSound() {
        super.sound(); // Calls the superclass method
    }
}

public class Main {
    public static void main(String[] args) {
        Dog dog = new Dog();
        dog.callSuperSound(); // Outputs: Animal makes a sound
        dog.sound(); // Outputs: Dog barks
    }
}
```


In this example, the `Dog` class overrides the `sound` method. However, we can still access the `sound` method from the `Animal` class using `super.sound()`. This allows us to retain functionality from the superclass while still having the flexibility to modify behavior in the subclass.

```java
class Vehicle {
    Vehicle(String type) {
        System.out.println("Vehicle type: " + type);
    }
}

class Car extends Vehicle {
    Car() {
        super("Car"); // Calls the Vehicle constructor with a string argument
        System.out.println("Car constructor called");
    }
}

public class Main {
    public static void main(String[] args) {
        Car car = new Car(); 
        // Output:
        // Vehicle type: Car
        // Car constructor called
    }
}
```


# Accessing Superclass Constructors

Constructor chaining is another vital use of `super`. When you create an instance of a subclass, the constructor of its superclass is called automatically. However, if you want to explicitly call a specific constructor of the superclass, you can use `super(arguments)`.

Here’s how it works:

In this snippet, the `Car` constructor explicitly calls the `Vehicle` constructor using `super("Car")`, allowing you to pass parameters to the parent constructor. This is especially useful when the superclass requires certain information during initialization.

# Using `super` in Method Overriding

When a method is overridden in a subclass, it can be beneficial to call the superclass version of that method. Using `super` in this context helps maintain a consistent behavior while also extending or modifying it in the subclass.

Consider a logging scenario:

In this case, the `FileLogger` class overrides the `log` method. By calling `super.log(message)`, we retain the logging functionality of the `Logger` class while adding additional behavior specific to `FileLogger`.

# Common Pitfalls with `super`

While the `super` keyword is powerful, there are some common pitfalls you should be aware of**.**

**Call to** `**super()**` **Must Be First**: When using `super()` in a constructor, it must be the first statement. If you try placing it after other statements, the code won’t compile.

**Static Context**: You cannot use `super` in a static context. If you try to call a superclass method using `super` from a static method, you will face a compilation error. Remember, `super` is intended for instance methods only.

**Misunderstanding Scope**: It’s easy to confuse `super` with `this`. While `this` refers to the current object, `super` explicitly refers to the parent class. Understanding this distinction is crucial when you're working with inheritance.

# Real-World Applications of `super`

Now that we’ve covered the basics and potential pitfalls, let’s look at some real-world scenarios where using `super` is beneficial.

### 1\. Extending Functionality in Libraries

If you’re using a framework like Spring or JavaFX, you often extend predefined classes. Using `super` allows you to customize behavior while still leveraging the underlying functionality.

### 2\. Maintaining Consistency in APIs

When creating an API, you might have base classes that provide foundational methods. Subclasses can use `super` to ensure that the base class methods are called, maintaining consistency in how objects behave.

### 3\. Handling Legacy Code

In many projects, you might encounter legacy code where `super` can be used to interact with inherited classes. This can help you add new features while preserving existing functionality.

# Summary

The `super` keyword is a fundamental tool in Java that allows you to navigate the complexities of inheritance. It enables you to access parent class methods and constructors, which plays a critical role in designing robust and maintainable code.

Remember its common pitfalls, and use it wisely to enhance your classes effectively.

In the next chapter, we will dive deeper into how overriding works, what you need to consider when doing so, and how it can help you create more flexible and reusable code.

```java
class Logger {
    void log(String message) {
        System.out.println("Log: " + message);
    }
}

class FileLogger extends Logger {
    void log(String message) {
        super.log(message); // Calls the superclass log method
        System.out.println("File log: " + message);
    }
}

public class Main {
    public static void main(String[] args) {
        FileLogger fileLogger = new FileLogger();
        fileLogger.log("This is a test"); 
        // Output:
        // Log: This is a test
        // File log: This is a test
    }
}
```


```java
class A {
	A() {
		System.out.println("A's constructor");
	}
}

class B extends A {
	B() {
		System.out.println("B's constructor");
		super(); // This will cause a compilation error
	}
}
```


```java
class A {
	static void display() {
		System.out.println("Display from A");
	}
}

class B extends A {
	static void display() {
		System.out.println("Display from B");
	}

	static void callSuperDisplay() {
		super.display(); // This will cause a compilation error
	}
}
```
