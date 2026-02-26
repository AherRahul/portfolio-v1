---
title: "Method Overriding"
description: "Learn about Method Overriding in Java programming."
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - java
courseName: "10-java-fundamentals"
showOnArticles: false
featured: false
---

![hero image](https://algomaster.io/og-image.png)

Understanding **method overriding** is crucial for mastering object-oriented programming in Java. It allows you to provide specific implementations of methods that are already defined in a parent class. This flexibility is what makes Java so powerful for creating dynamic behavior in your applications.

Let’s dive into the details of method overriding, explore its mechanics, and see how it fits into the larger picture of inheritance.

# What is Method Overriding?

Method overriding occurs when a subclass provides a specific implementation of a method that is already defined in its superclass. This allows the subclass to change or extend the behavior of that method.

For example, imagine you have a `Vehicle` class with a method `start()`. If you create a subclass `Car`, you might want to override `start()` to provide a different implementation tailored to how cars start.

```java
class Vehicle {
    void start() {
        System.out.println("Vehicle is starting");
    }
}

class Car extends Vehicle {
    @Override
    void start() {
        System.out.println("Car is starting with ignition");
    }
}
```


Here’s a quick look at the syntax:

```java
class Animal {
    void makeSound() {
        System.out.println("Animal sound");
    }
    
    final void cannotOverride() {
        System.out.println("This cannot be overridden");
    }
    
    static void staticMethod() {
        System.out.println("Static method in Animal");
    }
}

class Dog extends Animal {
    @Override
    void makeSound() {
        System.out.println("Bark");
    }

    // This will cause a compile-time error
    /*
    @Override
    void cannotOverride() {
        System.out.println("Overriding final method");
    }
    */

    // This will also cause a compile-time error
    /*
    @Override
    static void staticMethod() {
        System.out.println("This won't work");
    }
    */
}
```


In the above code, the `Car` class overrides the `start()` method of the `Vehicle` class. The `@Override` annotation is not mandatory but is highly recommended as it helps catch errors during compilation.

# The Mechanics of Method Overriding

To successfully override a method, you need to adhere to a few rules:

1.  **Same Method Signature**: The method must have the same name, return type, and parameters as the method in the superclass.
2.  **Access Modifiers**: The access level of the overriding method cannot be more restrictive than that of the overridden method. For instance, if the superclass method is public, the overridden method cannot be private.
3.  **Final and Static Methods**: You cannot override methods that are declared as `final` or `static`. Final methods are meant to be immutable, while static methods are associated with the class itself rather than instances.

Let’s see these rules in action:

Use the `@Override` annotation to make your intent clear. It helps increase code readability and catches potential mistakes at compile time.

# Real-World Applications

Method overriding is vital in real-world applications, especially when dealing with polymorphism. Consider a scenario where you have multiple types of notifications: email, SMS, and push notifications. You can create a base class called `Notification` and override a method `send()` in each subclass to handle the specifics.

In this case, you can create a method that takes a `Notification` object and calls `send()`. The appropriate implementation will be executed based on the actual object type, thanks to method overriding.

This design supports extensibility; if you want to add another notification type, you simply create a new subclass without modifying existing code.

# Overriding vs. Overloading

While both overriding and overloading involve methods, they are fundamentally different:

*   **Overriding**: Same method name and parameters, but in a subclass. It’s about changing behavior.
*   **Overloading**: Same method name but different parameters, typically within the same class. It’s about providing multiple ways to perform a similar action.

Here’s an example of overloading:

```java
abstract class Notification {
    abstract void send(String message);
}

class EmailNotification extends Notification {
    @Override
    void send(String message) {
        System.out.println("Sending Email: " + message);
    }
}

class SMSNotification extends Notification {
    @Override
    void send(String message) {
        System.out.println("Sending SMS: " + message);
    }
}

class PushNotification extends Notification {
    @Override
    void send(String message) {
        System.out.println("Sending Push Notification: " + message);
    }
}
```


In this case, `add()` is overloaded to handle both integer and double parameters.

Don't confuse method overriding with overloading. They serve different purposes and are used in different contexts.

# Edge Cases and Gotchas

Method overriding can introduce some subtle bugs if not handled correctly. Here are a few common pitfalls:

**Calling Overridden Methods**: When you call an overridden method from the superclass, it will call the superclass's version unless you use `super`. For instance:

**Null References**: If you override a method and call it on a null reference, you’ll encounter a `NullPointerException`. Always ensure your object is initialized before making calls.

**Dynamic Method Dispatch**: The method that gets called is determined at runtime based on the object type, not the reference type. This can lead to unexpected behavior if you're not careful with your object references.

# Best Practices for Overriding

To ensure that your overridden methods are effective and maintainable, consider the following best practices:

*   **Use** `**@Override**`: Always annotate overridden methods with `@Override` for clarity and error-checking.
*   **Maintain Liskov Substitution Principle**: Make sure that the overridden method behaves consistently with the original method. If a method in the superclass is supposed to return a value, the subclass should also return a value that is compatible.
*   **Document Behavior**: Clearly document any changes in behavior in the overridden method so that other developers can understand the modifications you've made.
*   **Test Thoroughly**: Write unit tests for both the superclass and the subclass to ensure that the overrides behave as expected in all scenarios.

Now that you understand method overriding and its nuances, you're ready to explore constructor chaining.

In the next chapter, we will look at how constructors work together to initialize objects effectively, providing a deeper understanding of object creation in Java.

```java
public void notifyUser(Notification notification, String message) {
    notification.send(message);
}

// Usage
notifyUser(new EmailNotification(), "Welcome to our service!");
notifyUser(new SMSNotification(), "Your code is 1234");
```


```java
class MathUtils {
    int add(int a, int b) {
        return a + b;
    }

    double add(double a, double b) {
        return a + b;
    }
}
```


```java
class Parent {
	void display() {
		System.out.println("Parent display");
	}
}

class Child extends Parent {
	@Override
	void display() {
		System.out.println("Child display");
		super.display(); // Calls Parent's display
	}
}
```


```java
Parent obj = new Child(); // Reference type is Parent
obj.display(); // Calls Child's display due to dynamic dispatch
```
