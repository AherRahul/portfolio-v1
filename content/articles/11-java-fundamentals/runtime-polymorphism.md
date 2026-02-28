---
title: Runtime Polymorphism
description: Learn about Runtime Polymorphism in Java programming.
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

When we think about how to design our software, **runtime polymorphism** stands out as a powerful tool in our toolkit. It's like having a magic wand that lets us call methods on objects without knowing their exact type at compile time.

This flexibility can lead to cleaner, more maintainable code, enabling us to build applications that are easier to extend and modify. So, let’s dig into the heart of runtime polymorphism in Java, exploring how it works, why it matters, and how to implement it effectively.

# What is Runtime Polymorphism?

At its core, **runtime polymorphism** refers to the ability of a single interface to represent different underlying forms (data types). In Java, this is primarily achieved through method overriding, where a subclass provides a specific implementation of a method that is already defined in its superclass.

This means that, at runtime, the Java Virtual Machine (JVM) determines which method to execute based on the actual object type, not the reference type. This capability allows us to write more generic and reusable code, as we can treat different objects uniformly while ensuring that the correct method for each specific type gets called.

### Example of Runtime Polymorphism

```java
class Shape {
    void draw() {
        System.out.println("Drawing a shape");
    }
}

class Circle extends Shape {
    void draw() {
        System.out.println("Drawing a circle");
    }
}

class Square extends Shape {
    void draw() {
        System.out.println("Drawing a square");
    }
}

public class Main {
    public static void main(String[] args) {
        Shape shape1 = new Circle(); // Shape reference but Circle object
        Shape shape2 = new Square(); // Shape reference but Square object

        shape1.draw(); // Calls Circle's draw method
        shape2.draw(); // Calls Square's draw method
    }
}
```


Let’s illustrate runtime polymorphism with a simple example involving shapes.

```java
abstract class Payment {
    abstract void processPayment();
}

class CreditCardPayment extends Payment {
    void processPayment() {
        System.out.println("Processing credit card payment");
    }
}

class PayPalPayment extends Payment {
    void processPayment() {
        System.out.println("Processing PayPal payment");
    }
}

class PaymentProcessor {
    void process(Payment payment) {
        payment.processPayment();
    }
}

public class Main {
    public static void main(String[] args) {
        PaymentProcessor processor = new PaymentProcessor();
        
        Payment payment1 = new CreditCardPayment();
        Payment payment2 = new PayPalPayment();
        
        processor.process(payment1); // Outputs: Processing credit card payment
        processor.process(payment2); // Outputs: Processing PayPal payment
    }
}
```


In this example, both `Circle` and `Square` classes extend the `Shape` class and override its `draw` method. Even though `shape1` and `shape2` are declared as `Shape`, the JVM calls the overridden `draw` method based on the actual object type at runtime. This is the essence of runtime polymorphism in action.

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
}

class Cat extends Animal {
    void sound() {
        System.out.println("Cat meows");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal animal1 = new Dog();
        Animal animal2 = new Cat();
        
        animal1.sound(); // Outputs: Dog barks
        animal2.sound(); // Outputs: Cat meows
    }
}
```


# Benefits of Runtime Polymorphism

Understanding the benefits of runtime polymorphism can help us appreciate its role in software design. Here are a few key advantages:

*   **Flexibility**: You can write code that works on the superclass type, while still allowing for specific subclass behavior. This is helpful in scenarios like event handling or command pattern implementations.
*   **Extensibility**: New subclasses can be added with minimal changes to existing code, thus adhering to the Open/Closed Principle of software design.
*   **Code Reusability**: Common functionalities can be defined in a superclass and overridden as needed in subclasses, reducing code duplication.

These advantages not only enhance the maintainability of our code but also make it easier to adapt to changing requirements.

### Real-World Use Case

Consider a payment processing system where different payment methods (like credit card, PayPal, or bank transfer) can be implemented. With runtime polymorphism, you can define a common interface for payment processing and implement specific logic in each payment class.

In this example, we can easily add new payment methods without modifying the `PaymentProcessor` class, showcasing the power of runtime polymorphism.

```java
interface Strategy {
    void execute();
}

class ConcreteStrategyA implements Strategy {
    public void execute() {
        System.out.println("Executing strategy A");
    }
}

class ConcreteStrategyB implements Strategy {
    public void execute() {
        System.out.println("Executing strategy B");
    }
}

class Context {
    private Strategy strategy;

    public void setStrategy(Strategy strategy) {
        this.strategy = strategy;
    }

    public void executeStrategy() {
        strategy.execute();
    }
}

public class Main {
    public static void main(String[] args) {
        Context context = new Context();
        
        context.setStrategy(new ConcreteStrategyA());
        context.executeStrategy(); // Outputs: Executing strategy A
        
        context.setStrategy(new ConcreteStrategyB());
        context.executeStrategy(); // Outputs: Executing strategy B
    }
}
```


# Method Overriding and Its Role

The cornerstone of runtime polymorphism is **method overriding**. To effectively use runtime polymorphism, we need to understand how overriding works in Java.

When a subclass provides a specific implementation of a method that is already defined in its superclass, it overrides the method. We must ensure that the method signature (name, return type, and parameters) is the same in both classes.

### Key Points to Remember

*   The method in the subclass must have the same name and parameters as in the superclass.
*   The access modifier in the subclass method cannot be more restrictive than in the superclass.
*   **Final** methods cannot be overridden.

Here's a quick example:

```java
$5b
```


The `sound` method is defined in `Animal` and overridden in both `Dog` and `Cat`, allowing us to call the appropriate sound based on the actual object type.

# Real-World Applications of Runtime Polymorphism

In practice, runtime polymorphism shines brightest in several design patterns and software architecture principles. Let’s look at a few practical applications:

### 1\. Strategy Pattern

In the Strategy Pattern, we define a family of algorithms, encapsulate each one, and make them interchangeable. This allows the algorithm to vary independently from the clients that use it.

### 2\. Observer Pattern

In the Observer Pattern, we maintain a list of dependents (observers) so they can be notified of state changes in another object (the subject). This pattern heavily relies on runtime polymorphism.

# Common Pitfalls and Nuances

While runtime polymorphism is a powerful concept, there are some nuances and potential pitfalls that developers should be aware of.

### 1\. Type Casting

When dealing with polymorphism, you may find yourself needing to cast objects to their specific types. This can lead to `ClassCastException` if not handled properly. Always check the instance type before casting.

### 2\. Performance Considerations

While using polymorphism can lead to cleaner code, there’s a slight performance overhead due to dynamic method resolution at runtime. In most cases, this is negligible, but it’s good to be aware of when optimizing your application.

### 3\. Final Methods and Static Methods

Remember that **final methods** cannot be overridden, which means that they break the polymorphic behavior. Similarly, **static methods** are resolved at compile time, so they do not exhibit polymorphic behavior.

Now that you have a solid understanding of runtime polymorphism, how it works, and its benefits, you’re ready to explore the next concept in our journey: **Dynamic Method Dispatch**. This will deepen your knowledge of how Java resolves method calls at runtime, allowing you to make the most of the flexibility that polymorphism offers.

In the next chapter, we will look at how the JVM handles method calls dynamically, which further enhances our ability to write robust and flexible code.

```java
Shape shape = new Circle();
if (shape instanceof Circle) {
    Circle circle = (Circle) shape; // Safe casting
}
```
