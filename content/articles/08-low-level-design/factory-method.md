---
title: "Factory Method Design Pattern"
description: "Learn how the Factory Method Design Pattern improves scalable object creation by delegating instantiation to subclasses, enhancing maintainability and adhering to SOLID principles."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

## Understanding the Factory Method Design Pattern for Scalable Object Creation

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)

## Introduction to Factory Method Design Pattern

> The **Factory Method Design Pattern** is a fundamental **creational pattern** in software engineering that provides an interface for creating objects within a superclass but allows subclasses to alter the type of objects that will be instantiated. 

This pattern is particularly beneficial when the exact type of object required is unknown until runtime, or when the creation logic is complex, repetitive, or needs encapsulation.

- The exact type of object to be created isn't known until runtime.
- Object creation logic is complex, repetitive, or needs encapsulation.
- You want to follow the Open/Closed Principle, open for extension, closed for modification.

When you have multiple objects of similar type, you might start with basic conditional logic (like `if-else` or `switch` statements) to decide which object to create.

But as your application grows, this approach becomes rigid, harder to test, and tightly couples your code to specific classes, violating key design principles.

Factory method lets you create different objects without tightly coupling your code to specific classes.

Let’s walk through a real-world example to see how we can apply the Factory Method Pattern to build a more scalable and maintainable object creation workflow.

Utilizing the Factory Method helps developers adhere to the **Open/Closed Principle**—a core tenet of SOLID design principles—which states that software entities should be open for extension but closed for modification.


## Why Object Creation Matters in Software Design

### The Problem with Conditional Object Creation

In many real-world applications, developers initially rely on simple conditional logic (such as `if-else` or `switch` statements) to decide which object to create. For example, a notification system might start by sending only email notifications:

```java
class EmailNotification {
    public void send(String message) {
        System.out.println("Sending an Email notification: " + message);
    }
}
```

This approach works well when the system is simple, but issues arise as new notification types (SMS, Push, Slack, WhatsApp) are added. Developers typically extend the notification service with multiple conditional branches:

```java
class NotificationService {
    public void sendNotification(String type, String message) {
        if (type.equals("EMAIL")) {
            new EmailNotification().send(message);
        } else if (type.equals("SMS")) {
            new SMSNotification().send(message);
        } else if (type.equals("PUSH")) {
            new PushNotification().send(message);
        } // ... and so on
    }
}
```

Such code soon becomes:

- Hard to maintain and test.
- Tightly coupled with specific classes.
- Violative of the **Open/Closed Principle** because modifications are required to add new types.

#### The Consequences

This "conditional explosion" leads to a codebase that is rigid, error-prone, and difficult to extend. Each addition requires changes to the same core logic, increasing the risk of bugs and making testing cumbersome.


### Step 1: Introducing the Simple Factory Pattern

To improve maintainability, developers often refactor the conditional logic into a **Simple Factory** — a separate class responsible for creating objects based on the input type.

```java
class SimpleNotificationFactory {
    public static Notification createNotification(String type) {
        switch (type) {
            case "EMAIL": return new EmailNotification();
            case "SMS": return new SMSNotification();
            case "PUSH": return new PushNotification();
            default: throw new IllegalArgumentException("Unknown type");
        }
    }
}
```

With this factory, the notification service becomes cleaner:

```java
class NotificationService {
    public void sendNotification(String type, String message) {
        Notification notification = SimpleNotificationFactory.createNotification(type);
        notification.send(message);
    }
}
```

#### Benefits of Simple Factory

- Centralizes object creation.
- Simplifies the notification service.
- Makes it easier to add new notification types by modifying only the factory.

#### Limitations of Simple Factory

However, as the number of notification types grows, the factory itself becomes bloated with conditionals, resembling the problem it was designed to solve. Every new notification type demands modification of the factory, which breaks the **Open/Closed Principle**.


### Step 2: Embracing the Factory Method Pattern

The **Factory Method Pattern** expands on the idea of object creation by delegating the instantiation responsibility to **subclasses** rather than a single centralized factory. This decentralizes creation, allowing each subclass to decide which object to create.

#### Key Concepts

- **Product Interface:** Defines the interface for objects created by the factory method (e.g., `Notification`).
- **Concrete Products:** Classes implementing the Product interface (e.g., `EmailNotification`, `SMSNotification`).
- **Creator (Abstract Class):** Declares the factory method that returns a Product. It may also provide default implementation and common behaviors.
- **Concrete Creators:** Subclasses of the Creator that override the factory method to instantiate specific Concrete Products.

#### Real-World Analogy

Imagine a food delivery platform. Instead of a single kitchen deciding what to prepare, each restaurant (Pizza Place, Sushi Bar) has its own kitchen that knows how to make its dishes. The platform delegates the order to the appropriate restaurant.

### Class Diagram

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770539784/6130e8f3-692e-4287-92d1-a1a07ba1e7e2.png)

1. **Product (e.g., Notification)**: An interface or abstract class for the objects the factory method creates.
2. **ConcreteProduct (e.g., EmailNotification, SMSNotification)**: Concrete classes that implement the Product interface.
3. **Creator (e.g., NotificationCreator)**: An abstract class (or an interface) that declares the factory method, which returns an object of type Product. It might also define a default implementation of the factory method. The Creator can also have other methods that use the product created by the factory method.
4. **ConcreteCreator (e.g., EmailNotificationCreator, SMSNotificationCreator)**: Subclasses that override the factory method to return an instance of a specific ConcreteProduct.

### Step 3: Implementing the Factory Method Pattern

#### 1. Define the Product Interface

```java
interface Notification {
    void send(String message);
}
```

#### 2. Define Concrete Products

```java
class EmailNotification implements Notification {
    public void send(String message) {
        System.out.println("Sending email: " + message);
    }
}

class SMSNotification implements Notification {
    public void send(String message) {
        System.out.println("Sending SMS: " + message);
    }
}

class PushNotification implements Notification {
    public void send(String message) {
        System.out.println("Sending push notification: " + message);
    }
}
```

#### 3. Define an Abstract Creator

```java
abstract class NotificationCreator {
    // Factory method
    public abstract Notification createNotification();

    // Template method with common logic
    public void send(String message) {
        Notification notification = createNotification();
        notification.send(message);
    }
}
```

The abstract creator defines the sequence (sending a notification) but delegates the instantiation to subclasses.

#### 4. Define Concrete Creators

```java
class EmailNotificationCreator extends NotificationCreator {
    public Notification createNotification() {
        return new EmailNotification();
    }
}

class SMSNotificationCreator extends NotificationCreator {
    public Notification createNotification() {
        return new SMSNotification();
    }
}

class PushNotificationCreator extends NotificationCreator {
    public Notification createNotification() {
        return new PushNotification();
    }
}
```

Each concrete creator knows how to create its corresponding notification.

#### 5. Client Code Usage

```java
public class FactoryMethodDemo {
    public static void main(String[] args) {
        NotificationCreator creator;

        creator = new EmailNotificationCreator();
        creator.send("Welcome to our platform!");

        creator = new SMSNotificationCreator();
        creator.send("Your OTP is 123456");

        creator = new PushNotificationCreator();
        creator.send("You have a new follower!");
    }
}
```

This design eliminates conditional logic and centralizes the knowledge of object creation within specialized subclasses.


### Step 4: Extending the System with Ease

Adding new notification types is straightforward:

1. Create a new concrete product implementing `Notification`.

```java
class SlackNotification implements Notification {
    public void send(String message) {
        System.out.println("Sending SLACK: " + message);
    }
}
```

2. Create a new concrete creator subclass.

```java
class SlackNotificationCreator extends NotificationCreator {
    public Notification createNotification() {
        return new SlackNotification();
    }
}
```

3. Use the new creator in client code without modifying existing classes.

```java
NotificationCreator creator = new SlackNotificationCreator();
creator.send("Standup in 10 minutes!");
```

This process respects the **Open/Closed Principle** and avoids risks associated with modifying existing code.


### Advantages of Factory Method Pattern

- **Open for Extension:** Easily add new products without changing existing code.
- **Single Responsibility:** Each creator class handles one product creation.
- **Decoupling:** Client code depends only on abstract interfaces, not concrete classes.
- **Improved Maintainability:** Reduces conditional complexity and centralizes creation logic.
- **Enhanced Testability:** Subclasses can be tested independently.


### Conclusion

The Factory Method Design Pattern is an elegant and powerful solution to the problem of scalable and maintainable object creation. By delegating instantiation responsibilities to subclasses, it eliminates complicated conditional logic and tightly coupled code, making systems easier to extend and maintain.

For developers building applications that require flexible creation of related objects—such as notification systems, UI elements, or data parsers—adopting the Factory Method pattern ensures:

- Cleaner code architecture
- Compliance with SOLID principles
- Reduced risk of bugs during extension
- Improved clarity and separation of concerns

In summary, while simple factories provide a quick fix, the Factory Method Design Pattern offers a robust, scalable framework for building extensible software systems.


### Further Reading

- "Design Patterns: Elements of Reusable Object-Oriented Software" by Gamma et al. (GoF Book)
- SOLID Principles in Object-Oriented Design
- Comparison of Factory Method and Abstract Factory Patterns


### FAQ

#### Q1: How is Factory Method different from Simple Factory?

**A:** Simple Factory centralizes object creation in one class, often using conditionals. Factory Method delegates creation to subclasses, enabling better extensibility and adherence to design principles.

#### Q2: Can Factory Method be used with other design patterns?

**A:** Yes. Factory Method is often combined with patterns like Template Method and Abstract Factory for more complex scenarios.

#### Q3: Is Factory Method applicable only in Java?

**A:** No. It is a language-agnostic pattern applicable in any object-oriented programming language.

#### Q4: When should I avoid using Factory Method?

**A:** If your object creation logic is simple and unlikely to change, a simple factory or direct instantiation may suffice.


By adopting the Factory Method Design Pattern, you set up your codebase for growth, flexibility, and easier maintenance—key ingredients for sustainable software development.
