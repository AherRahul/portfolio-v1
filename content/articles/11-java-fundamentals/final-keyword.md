---
title: final Keyword
description: Learn about Final Keyword in Java programming.
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

When you think about how we define things in Java, the keyword **final** often comes up. It's a small word but carries significant weight in controlling how our Java programs behave.

Imagine you're constructing a building: you want to ensure some walls are load-bearing and cannot be changed later. In a similar way, the final keyword in Java helps you define elements that should remain constant, be it variables, methods, or classes.

Let’s dive into the depths of the final keyword, unpacking its various roles and how it helps us maintain the integrity of our object-oriented designs.

# What is the final Keyword?

The final keyword can be applied to variables, methods, and classes. Each application serves a unique purpose, but they all revolve around the core idea of immutability or the restriction of modification.

### Final Variables

When you declare a variable as final, you are essentially saying that once it’s initialized, its value cannot be changed. This can be particularly useful when you want to define constants.

#### Example of Final Variables

```java
public class Constants {
    public static final double PI = 3.14159; // This value cannot change

    public static void main(String[] args) {
        System.out.println("The value of PI is: " + PI);
        // PI = 3.14; // This line would cause a compilation error
    }
}
```


In this example, `PI` is a constant. Attempting to reassign it will result in a compile-time error, preventing accidental changes. This is not just good practice; it enhances readability and maintainability of code.

```java
class Parent {
    public final void display() {
        System.out.println("This is a final method.");
    }
}

class Child extends Parent {
    // This would cause a compilation error
    // public void display() {
    //     System.out.println("Trying to override.");
    // }
}
```


### Why Use Final Variables?

Using final variables helps in defining constants throughout your application. It can also lead to better optimization by the Java compiler since it knows the value won’t change.

# Final Methods

When you declare a method as final, you prevent it from being overridden in subclasses. This can be valuable in ensuring that the method's behavior stays consistent across different implementations.

### Example of Final Methods

```java
final class ImmutableClass {
    private final int value;

    public ImmutableClass(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}

// The following would cause a compilation error:
// class ExtendedClass extends ImmutableClass {}
```


Here, the `display` method in the `Parent` class is final. The `Child` class cannot override this method, ensuring that whatever functionality it provides remains intact.

### Why Use Final Methods?

Defining methods as final is especially significant in frameworks or libraries where you want to ensure specific functionalities remain unchanged. It guarantees that critical behavior is not altered inadvertently.

# Final Classes

Declaring a class as final prevents it from being subclassed. This is particularly useful when you want to create a class that should not be extended, ensuring its implementation remains intact and secure.

### Example of Final Classes

```java
class Person {
    private final String name;

    public Person(String name) {
        this.name = name; // Final variable initialized here
    }

    public String getName() {
        return name;
    }
}

public class Main {
    public static void main(String[] args) {
        Person person = new Person("Alice");
        System.out.println("Person's name is: " + person.getName());
    }
}
```


In this case, `ImmutableClass` is marked as final. Any attempt to extend it will result in a compile-time error, protecting its intended structure and functionality.

### Why Use Final Classes?

Using final classes is a way to enforce design decisions and safeguard the integrity of your classes. This is particularly common in utility classes, where inheritance doesn’t make sense or could lead to misuse.

# Final with Variables and Constructor

One interesting aspect of final variables is their interaction with constructors. A final variable must be initialized once, and it can be done through a constructor if it has not been initialized at the point of declaration.

### Example of Final Variables in Constructor

```java
final List<String> list = new ArrayList<>();
list.add("Hello"); // This is valid
// list = new ArrayList<>(); // This would cause a compile-time error
```


In this example, the `name` variable is final and is set during the object construction. This illustrates how final variables can enforce immutability while still allowing for flexibility in their initialization.

```java
public final class Singleton {
    private static final Singleton instance = new Singleton();

    private Singleton() {} // Private constructor

    public static Singleton getInstance() {
        return instance;
    }
}
```


### Why is This Important?

Using final with constructor parameters promotes the concept of immutability in your classes. This can lead to safer multi-threaded code, as immutable objects are inherently thread-safe.

# Edge Cases and Common Mistakes

Even though the final keyword seems straightforward, there are some nuances and common pitfalls to be aware of.

### Common Mistakes

**Final Reference, Not Final Object**: Declaring a final variable only prevents reassignment of the reference, not the object it points to. This means you can still change the internal state of the object.

**Static Final Variables**: When using static final variables, they should be initialized at the declaration or in a static block. Failing to do so will lead to a compilation error.

**Final Methods in Interfaces**: Starting with Java 8, interface methods can have default implementations. However, if a method is declared in an interface, it can't be final because interfaces are meant to be implemented and extended.

### Nuances to Consider

*   When using final in multi-threaded environments, remember that final fields can help create thread-safe immutable objects, but mutable objects referenced by final variables do not share this guarantee.
*   Be cautious when using final classes. While they enforce a clear design, they can also limit extensibility.

# Real-World Applications

Now that we’ve covered the basics, let’s look at some real-world scenarios where the final keyword shines.

### Using Final in Java Libraries

In popular libraries like Java Collections Framework, you’ll often see final classes and methods to protect the integrity of core functionalities. For instance, the classes in `java.lang.String` are final, ensuring that string functionality remains consistent and optimized.

### Security and Design Patterns

In security-sensitive applications, using final classes can prevent subclassing, which could introduce vulnerabilities. For example, in implementing the Singleton pattern, marking the class as final ensures that no subclass can alter its behavior.

#### Example of Singleton Pattern with Final

In this case, the Singleton class is final, preventing any subclassing and ensuring that the instance remains consistent throughout the application.

Now that you have a solid understanding of the final keyword in Java, you can use it effectively to enforce immutability and protect your code’s integrity. Remember to think critically about where you apply final, as it can enhance both the design and functionality of your applications.

In the next chapter, we will look at how initializer blocks can help streamline your object initialization process and provide insights into execution order during object creation.