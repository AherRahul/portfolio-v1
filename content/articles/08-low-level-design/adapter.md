---
title: "Adapter Design Pattern"
description: "Learn how the Adapter Design Pattern enables incompatible interfaces to work together seamlessly, enhancing flexibility and maintainability in software integration."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

## Understanding the Adapter Design Pattern: Bridging Incompatible Interfaces

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)

### Introduction

In modern software development, integrating different systems or components often involves dealing with incompatible interfaces. 

> The **Adapter Design Pattern** is a structural design pattern that solves this challenge by converting the interface of one class into another interface expected by the client. 

This pattern is especially useful when working with legacy systems or third-party libraries that don’t match the current system’s interface, allowing developers to reuse existing functionality without modifying original code.

This blog post explores the Adapter Pattern in detail, demonstrating its purpose, design, and implementation through a real-world example involving payment processing in an e-commerce system.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770558105/f135d556-d891-4a1b-8ac0-95c6132b3085.png)

It’s particularly useful in situations where:

- You’re integrating with a **legacy system** or a **third-party library** that doesn’t match your current interface.
- You want to **reuse existing functionality** without modifying its source code.
- You need to **bridge the gap between new and old code**, or between systems built with different interface designs.

When faced with incompatible interfaces, developers often resort to rewriting large parts of code or embedding conditionals like if (legacyType) to handle special cases. For example, a PaymentProcessor might use if-else logic to handle both a modern StripeService and a legacy BankTransferAPI.

But as more incompatible services or modules are introduced, this approach quickly becomes **messy, tightly coupled**, and violates the **Open/Closed Principle** making the system hard to scale or refactor.

The **Adapter Pattern** solves this by introducing a **wrapper class** that sits between your system and the incompatible component. It translates calls from your interface into calls the legacy or third-party system understands **without changing either side**.

Let’s walk through a real-world example to see how we can apply the Adapter Pattern to seamlessly integrate incompatible components and create a more flexible and maintainable architecture.

### What is the Adapter Design Pattern?

#### Definition and Purpose

The **Adapter Pattern** acts as a bridge between incompatible interfaces, enabling objects that otherwise couldn’t work together to collaborate seamlessly. Instead of rewriting large amounts of code or embedding complex conditionals to handle different interfaces, the Adapter Pattern introduces a wrapper class that translates calls from the expected interface into calls compatible with the existing, but incompatible, object.

#### When to Use the Adapter Pattern

- Integrating with **legacy systems** or outdated APIs.
- Incorporating **third-party libraries** with different interfaces.
- Reusing existing code without modification.
- Bridging the gap between new and old codebases or disparate system designs.


### The Problem: Incompatible Payment Interfaces in E-commerce

Imagine you are developing a checkout component for an e-commerce application. The checkout module expects a consistent payment interface to process payments, check payment status, and retrieve transaction IDs.

#### The Expected Payment Interface

A simple Java interface defines the contract for payment processors:

```java
interface PaymentProcessor {
    void processPayment(double amount, String currency);
    boolean isPaymentSuccessful();
    String getTransactionId();
}
```

This abstraction allows swapping different payment providers without changing the core checkout logic.

#### Existing Implementation: In-House Payment Processor

Your internal payment system implements this interface perfectly:

```java
class InHousePaymentProcessor implements PaymentProcessor {
    private String transactionId;
    private boolean isPaymentSuccessful;

    @Override
    public void processPayment(double amount, String currency) {
        System.out.println("Processing payment of " + amount + " " + currency);
        transactionId = "TXN_" + System.currentTimeMillis();
        isPaymentSuccessful = true;
    }

    @Override
    public boolean isPaymentSuccessful() {
        return isPaymentSuccessful;
    }

    @Override
    public String getTransactionId() {
        return transactionId;
    }
}
```

#### The Challenge: Integrating a Legacy Payment Provider

Management now requires integration with a **legacy third-party payment system**. This legacy class has a completely different interface:

```java
class LegacyGateway {
    private long transactionReference;
    private boolean isPaymentSuccessful;

    public void executeTransaction(double totalAmount, String currency) { /*...*/ }
    public boolean checkStatus(long transactionReference) { /*...*/ }
    public long getReferenceNumber() { /*...*/ }
}
```

The signatures and data types differ significantly from the expected `PaymentProcessor` interface. You cannot modify either the checkout service or the legacy gateway directly because of system constraints and vendor restrictions.


### Why Not Use Conditionals or Rewrite Code?

Without an adapter, developers might add conditional logic such as:

```java
if (paymentProvider instanceof LegacyGateway) {
    // special handling
} else {
    // normal flow
}
```

This approach quickly becomes messy, hard to maintain, and violates the **Open/Closed Principle**—systems should be open for extension but closed for modification.


### The Adapter Pattern Solution

> The Adapter acts as a bridge between an incompatible interface and what the client actually expects.

It allows your system to remain flexible, extensible, and decoupled, without having to modify existing client code or third-party libraries.

Your application expects one interface (`PaymentProcessor`), but the legacy system provides another (`LegacyGateway`). The adapter allows the two to work together without altering either side.

#### Two Types of Adapters
There are two primary ways to implement an adapter, depending on the language and use case:

1. Object Adapter (Preferred in Java)
  - Uses **composition**: the adapter holds a reference to the adaptee (the object it wraps).
  - Allows flexibility and reuse across class hierarchies.
  - This is the most common and recommended approach in Java.

2. Class Adapter (Rare in Java)
  - Uses **inheritance**: the adapter inherits from both the target interface and the adaptee.
  - Requires **multiple inheritance**, which Java doesn’t support for classes.
  - More suitable for languages like **C++**.

In our case, we’ll use the **Object Adapter pattern** to adapt the `LegacyGateway` to the `PaymentProcessor` interface.


### Class Diagram


![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770558208/6b2c9889-9911-4eab-a953-eb81bda9fd72.png)


*   **Target Interface (e.g.,** `PaymentProcessor`**)**: The interface that the client code expects and uses.
*   **Adaptee (e.g.,** `LegacyGateway`**)**: The existing class with an incompatible interface that needs adapting.
*   **Adapter**: The class that implements the Target interface and uses the Adaptee internally. It translates calls on the Target interface into calls on the Adaptee's interface.
*   **Client (e.g.,** `CheckoutService`**)**: The part of your system that uses the Target interface.


> ### Real-World Analogy
> Imagine you're traveling from the **United States** to **Europe**. Your laptop charger uses a **Type A plug** (used in the US), but European wall sockets expect a **Type C plug**.
> 
> You can’t plug your charger in directly—**the interfaces don’t match**.
> 
> Instead of buying a new charger, you use a **travel plug adapter**. This device accepts your Type A plug and converts it into a Type C shape that fits into the European socket.
> 
> *   You don’t modify the wall socket (it’s like the third-party API).
> *   You don’t modify your charger (it’s like your existing business logic).
> *   The adapter sits in between and **translates** the connection.
> 
> For our example:
> 
> *   **Charger** → your application (`CheckoutService`)
> *   **Wall socket** → third-party system (`LegacyGateway`)
> *   **Travel plug adapter** → Adapter class (`LegacyGatewayAdapter`)



### Implementing the LegacyGatewayAdapter
To integrate the legacy `LegacyGateway` class into our modern e-commerce system, we’ll create an **object adapter** called `LegacyGatewayAdapter`.

This adapter will **implement the** `PaymentProcessor` **interface**, which our `CheckoutService` already depends on. Internally, it will **translate method calls** into the appropriate operations on the `LegacyGateway` — effectively **bridging the gap** between incompatible APIs.


```java
class LegacyGatewayAdapter implements PaymentProcessor {
    private final LegacyGateway legacyGateway;
    private long currentRef;

    public LegacyGatewayAdapter(LegacyGateway legacyGateway) {
        this.legacyGateway = legacyGateway;
    }

    @Override
    public void processPayment(double amount, String currency) {
        System.out.println("Adapter: Translating processPayment() call");
        legacyGateway.executeTransaction(amount, currency);
        currentRef = legacyGateway.getReferenceNumber();
    }

    @Override
    public boolean isPaymentSuccessful() {
        return legacyGateway.checkStatus(currentRef);
    }

    @Override
    public String getTransactionId() {
        return "LEGACY_TXN_" + currentRef;
    }
}
```

#### Key Points of the Implementation

- **Composition over inheritance:** The adapter holds a reference to the legacy gateway.
- **Method translation:** Each method in `PaymentProcessor` calls one or more legacy methods.
- **State management:** The adapter stores transaction references to map between interfaces.
- **Encapsulation:** Client code does not need to know about the legacy system’s complexities.


### Client Code Usage: Seamless Integration

The beauty of the Adapter Pattern is that your client code remains completely unaware of the legacy integration.

**The** `CheckoutService` **doesn’t care** whether it’s processing a modern or legacy payment, it always talks to `PaymentProcessor`.

```java
public class ECommerceAppV2 {
    public static void main(String[] args) {
        // Using modern processor
        PaymentProcessor modernProcessor = new InHousePaymentProcessor();
        CheckoutService modernCheckout = new CheckoutService(modernProcessor);
        modernCheckout.checkout(199.99, "USD");

        // Using legacy gateway through adapter
        LegacyGateway legacy = new LegacyGateway();
        PaymentProcessor legacyProcessor = new LegacyGatewayAdapter(legacy);
        CheckoutService legacyCheckout = new CheckoutService(legacyProcessor);
        legacyCheckout.checkout(75.50, "USD");
    }
}
```

The `CheckoutService` remains unchanged, oblivious to whether the payment is processed by the in-house system or the legacy gateway adapter.


### Benefits of Using the Adapter Pattern

- **1. Decoupling:** Separates the client code from the legacy or third-party system, reducing dependencies and coupling.
- **2. Flexibility and Extensibility:** Allows adding new payment providers without altering existing client code.
- **3. Reusability:** Enables reuse of legacy or third-party components without modification.
- **4. Compliance with SOLID Principles:** Adheres to the **Open/Closed Principle**, keeping the system open to extension but closed for modification.
- **5. Maintainability:** Simplifies testing and maintenance by isolating legacy code behind an adapter.

### Summary

The Adapter Design Pattern is a powerful, proven solution to integrate incompatible interfaces in software systems. By introducing an adapter layer that translates between different interfaces, developers can seamlessly incorporate legacy systems or third-party libraries without altering existing client code or third-party implementations.

Through the example of integrating a legacy payment gateway into an e-commerce checkout system, we demonstrated how the adapter pattern:

- Avoids messy conditional logic.
- Enhances code decoupling.
- Follows best practices of composition over inheritance.
- Facilitates maintainable and scalable software design.


### Frequently Asked Questions (FAQ)

#### Q1: Can the Adapter Pattern be used for more than two incompatible interfaces?

Yes, you can create multiple adapters for different interfaces, enabling your system to support various incompatible components.

#### Q2: How does the Adapter Pattern differ from the Proxy Pattern?

The Adapter Pattern changes an interface to make it compatible, while the Proxy Pattern controls access to an object, often adding security or lazy initialization.

#### Q3: Is the Adapter Pattern suitable for performance-critical applications?

Since the adapter adds a thin layer of indirection, performance impact is usually minimal, but it depends on the complexity of method translations.

#### Q4: Can the Adapter Pattern be applied in languages without interfaces?

Yes, but implementation details vary. Adapters may rely on inheritance or duck typing depending on the language capabilities.


### Final Thoughts

The Adapter Pattern remains an essential tool for software engineers facing the realities of evolving systems and legacy integrations. It fosters clean, maintainable, and scalable codebases, enabling you to build flexible applications that can adapt to changing requirements and diverse external components.

Embrace the Adapter Design Pattern to bridge incompatible interfaces effortlessly and future-proof your software architecture.