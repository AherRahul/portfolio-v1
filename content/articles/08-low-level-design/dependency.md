---
title: "Dependency"
description: "This lesson explains Dependency in simple terms and shows how it helps you design clear, testable code."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)

### Introduction: The Essence and Significance of Dependency in Class Relationships

In object-oriented programming, understanding *how classes interact* is crucial for designing maintainable and flexible software systems. Among various types of class relationships, **dependency** stands out as the most transient and least binding connection. Defined as the situation where one class **relies on another only briefly to accomplish a task**, dependency contrasts sharply with more permanent relationships like *association*, *aggregation*, or *composition*. Unlike these, dependency implies **no shared lifecycle**, no ownership, and no long-term connection between the classes involved.

This chapter explores the concept of dependency, its characteristics, UML representation, typical manifestations in code, and its evolution into the sophisticated technique known as **Dependency Injection (DI)**. DI is a cornerstone of modern software design, enabling loose coupling, enhanced testability, and modularity by externally providing dependencies rather than creating them internally.

Key vocabulary and concepts to note include **dependency**, **uses-a relationship**, **method parameters**, **local variables**, **return types**, and **dependency injection**.


### 1. Defining Dependency: The Temporary Reliance Between Classes

**Dependency** occurs when one class depends on another to fulfill a specific responsibility but does not maintain a permanent reference to it. This dependency is often:

- **Short-lived**, existing only during method execution.
- **Non-ownership** based; the dependent class does not store the other class as a field.
- Categorized as a **“uses-a” relationship**, where one class uses another temporarily to complete a task.

Common scenarios where dependencies manifest include:

- Passing a class instance as a **method parameter**.
- Instantiating or using another class **within a method**.
- Returning an object of another class as a **method return type**.

**Real-world analogy:** Consider a chef who uses a knife to chop vegetables. The chef depends on the knife only during the chopping process and does not retain ownership or long-term possession of it. Once the task is done, the knife is put away or reused by others, embodying the essence of dependency.

**Key points:**

- Dependency represents the weakest form of class relationship.
- It reflects a transient, task-specific interaction, not a structural bond.
- The dependent class remains unaware of the lifecycle or state of the other class beyond the immediate operation.


### 2. UML Representation: Visualizing Dependency in Class Diagrams

In Unified Modeling Language (**UML**) class diagrams, **dependency** is represented by a **dashed arrow** pointing from the dependent class to the class it relies upon. This visual distinction emphasizes the temporary and non-ownership nature of the relationship.

For example, a **Printer** class depending on a **Document** class will have a dashed arrow from Printer to Document, indicating Printer uses Document to perform printing but does not own or maintain a lasting association with it.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770130549/Portfolio/lldSystemDesign/img/07dfa39d-c931-4c37-96c3-33cdda7df8b2.png)

**Summary highlights:**

- Dashed arrow distinguishes dependency from solid-line associations.
- Dependency arrows indicate transient, one-time usage.
- Useful for illustrating method-level interactions rather than structural connections.


### 3. Dependency in Practice: Code Examples and Patterns

A clear understanding of dependency is best cemented through practical examples. Consider the following Java classes:

**Document Class:**

```java
class Document {
    private String content;

    public Document(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }
}
```

**Printer Class:**

```java
class Printer {
    public void print(Document document) { // dependency: Document
        System.out.println("Printing: " + document.getContent());
    }
}
```

Here, the **Printer** class depends on **Document** to retrieve content and print. Crucially, Printer does **not** store the Document instance; it simply uses it temporarily within the `print` method, reflecting the nature of dependency.

#### Recognizing Dependencies in Code:

Dependencies appear in several common forms:

- **Method Parameters:** Dependency passed into a method only when needed.
  
  Example:
  
  ```java
  public void processPayment(PaymentGateway gateway, double amount) {
      gateway.charge(amount);
  }
  ```
  
- **Class Fields / Instance Variables:** Dependency held as a field, usually for repeated or ongoing use.
  
  Example:
  
  ```java
  private PaymentGateway paymentGateway;
  ```
  
- **Constructor Parameters:** Dependency provided during object instantiation, enabling **Dependency Injection**.
  
  Example:
  
  ```java
  public PaymentService(PaymentGateway paymentGateway) {
      this.paymentGateway = paymentGateway;
  }
  ```


### 4. Dependency Injection (DI): Elevating Dependency to a Design Principle

While dependency describes a basic usage relationship, **Dependency Injection (DI)** transforms this concept into a powerful design pattern that addresses problems of tight coupling and inflexibility in software design.

When classes create their own dependencies internally, they become **tightly coupled**, which:

- Reduces **testability** by making it hard to replace real dependencies with mocks or stubs.
- Limits **modularity**, as swapping implementations requires changing the class code.
- Results in rigid, less maintainable architecture.

**Dependency Injection** reverses this by **providing dependencies from the outside**, typically through constructor parameters or setters. This method offers several advantages:

- **Loose coupling:** Classes depend on abstractions (interfaces) rather than concrete implementations.
- **Improved testability:** Mock objects can be injected during unit testing.
- **Greater modularity:** Implementations can be swapped without modifying dependent classes.
- **Open/closed principle compliance:** Classes are open to extension but closed to modification.

**Example:** A Notification system that uses an injected Sender interface.

```java
interface Sender {
    void send(String message);
}

class NotificationService {
    private final Sender sender; // Interface

    public NotificationService(Sender sender) {
        this.sender = sender; // Injected dependency
    }

    public void notifyUser(String message) {
        sender.send(message); // Uses sender temporarily
    }
}
```

In this example:

- The **NotificationService** class does not create a Sender instance itself.
- The dependency is injected externally, promoting flexibility and testability.
- The class depends only on the **Sender** interface, allowing any implementation (e.g., EmailSender, SMSSender).

**Real-world frameworks:** Tools like Spring for Java automate DI by resolving and injecting dependencies based on configuration or annotations, removing manual wiring.


### 5. Opinions and Arguments on Dependency and DI

The content presents a clear argument favoring **Dependency Injection** over traditional internal creation of dependencies. The rationale includes:

- Avoiding **tight coupling** that makes code rigid and difficult to maintain.
- Enabling **mocking and testing** by decoupling object creation from usage.
- Promoting adherence to best design principles such as **loose coupling** and **modularity**.

This argument is supported by practical evidence in code examples and real-world design patterns widely adopted in modern software engineering.


### Conclusion: The Role and Impact of Dependency and Dependency Injection

To summarize, **dependency** is the fundamental concept describing a weak, short-lived relationship where one class uses another temporarily without ownership. This principle underpins many interactions in object-oriented design, signaling the need for flexible yet clear dependency management.

Building on this foundation, **Dependency Injection** emerges as a transformative design technique that externalizes the provision of dependencies, dramatically improving code maintainability, testability, and modularity. By injecting dependencies rather than creating them internally, software systems become more adaptable to change, easier to test, and better aligned with solid design principles.

Ultimately, understanding and applying dependency and DI equips developers to create robust, scalable, and maintainable applications, reinforcing the core tenets of modern software engineering.


### Summary of Key Points

- **Dependency** is a short-lived, non-owning relationship where one class uses another temporarily.
- It commonly occurs through method parameters, local variables, or return types.
- In UML, dependency is depicted with a dashed arrow from the dependent to the depended-upon class.
- Dependencies appear in code as method parameters, instance variables, or constructor parameters.
- **Dependency Injection** externalizes dependency provision, enhancing loose coupling and testability.
- DI allows classes to depend on abstractions (interfaces), enabling flexible swapping of implementations.
- Frameworks like Spring automate DI, simplifying complex dependency management.
- DI is a best practice that avoids the pitfalls of tight coupling and rigid code.

By mastering these concepts, developers can design systems that are cleanly structured, easier to maintain, and resilient to change.