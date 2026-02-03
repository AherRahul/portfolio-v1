---
title: "Open-Closed Principle"
description: "This lesson explains Open-Closed Principle in simple terms and shows how it helps you design clear, testable code."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)

### Introduction: Understanding the Open-Closed Principle and Its Importance

Have you ever added a new feature to your codebase… only to find yourself editing dozens of existing classes, introducing bugs in places you didn’t even touch before?

Or been afraid to change something because… well, it _might_ break something else?

If yes, then your code is likely violating one of the most important principles of object-oriented design: **The Open-Closed Principle (OCP).**

Imagine you're building the checkout feature of an e-commerce platform. Initially, you only have one payment method: **Credit Card**.

Your `PaymentProcessor` class might look something like this (simplified, of course):

```java
class PaymentProcessor {
    public void processCreditCardPayment(double amount) {
        System.out.println("Processing credit card payment of $" + amount);
        // Complex logic for credit card processing
    }
}
```

and this is how you use it in your Checkout Service:

```java
class CheckoutService {
    public void processPayment() {
        PaymentProcessor processor = new PaymentProcessor();
        processor.processCreditCardPayment(100.00);
    }
}
```

So far, so good.

But then, your client comes along and says, _**"Hey, we need to add PayPal payments too."**_

No big deal, right?

You go back and modify your `PaymentProcessor` class to handle both:

```java
class PaymentProcessor {
    public void processCreditCardPayment(double amount) {
        System.out.println("Processing credit card payment of $" + amount);
        // Complex logic for credit card processing
    }

    public void processPayPalPayment(double amount) {
        System.out.println("Processing PayPal payment of $" + amount);
        // Logic for PayPal processing
    }
}
```

Then you update your `CheckoutService`:

```java
class CheckoutService {
    public void processPayment(String paymentType) {
        PaymentProcessor processor = new PaymentProcessor();

        if ("CreditCard".equals(paymentType)) {
            processor.processCreditCardPayment(100.00);
        } else if ("PayPal".equals(paymentType)) {
            processor.processPayPalPayment(100.00);
        }
    }
}
```

Now it works for two methods. But guess what happens when the client wants to add **UPI**, **Bitcoin**, or **Apple Pay**?

Each time, you're cracking open the `PaymentProcessor` class.

Each modification carries the risk of:

1.  **Introducing Bugs:** You might accidentally break the existing credit card or PayPal functionality while adding the new payment method.
2.  **Increased Testing Overhead:** Every time you change the class, you need to re-test _all_ its functionalities, not just the new one.
3.  **Reduced Readability:** The class becomes a monstrous collection of `if-else if` statements or a `switch` case that's hard to navigate and understand.
4.  **Scalability Issues:** Adding new payment types becomes progressively more difficult and error-prone.

This constant modification is a direct violation of the **Open-Closed Principle**.

## Introducing the Open-Closed Principle (OCP)

> **Software entities (classes, modules, functions, etc.) should be open for extension, but closed for modification.** — Bertrand Meyer

Let's break that down:

*   **Open for Extension:** This means the behavior of the entity can be extended. As new requirements come in (like new payment types), you should be able to add new behavior.
*   **Closed for Modification:** This means the existing, working code of the entity should not be changed. Once it's written, tested, and working, you shouldn't need to go back and alter it to add new features.

Sounds like a paradox, right? How can you add new features without changing existing code? The magic lies in **abstraction**.

## Why Does OCP Matter?

*   **Improved Maintainability:** When you add new features by adding new code rather than changing old code, you reduce the risk of breaking existing functionality. This makes your system much easier to maintain in the long run.
*   **Enhanced Scalability:** New features or variations can be added with minimal impact on the existing system. Your codebase becomes more flexible and adaptable to change.
*   **Reduced Risk:** Since you're not touching the battle-tested existing code, the chances of introducing regressions (bugs in old features) are significantly lower. This means more confidence during deployments.
*   **Better Testability:** New extensions can be tested in isolation. You don't need to re-test the entire system every time a new piece of functionality is added.
*   **Increased Reusability:** Well-designed, closed modules are often more reusable across different parts of an application or even in different projects.
*   **Clearer Code:** OCP often leads to designs where responsibilities are more clearly separated, making the code easier to understand and reason about.

## Implementing OCP

Let's revisit our `PaymentProcessor` and see how we can make it OCP-compliant.

The key is to introduce an abstraction for the payment methods.

#### Step 1: Define an Interface (or an Abstract Class)

We'll create a `PaymentMethod` interface that defines a contract for all payment types:

```java
interface PaymentMethod {
    void processPayment(double amount);
}
```

#### Step 2: Implement Concrete Strategies

Now, for each payment type, we create a separate class that implements this interface:

```java
class CreditCardPayment implements PaymentMethod {
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing credit card payment of $" + amount);
        // Complex logic for credit card processing
    }
}

class PayPalPayment implements PaymentMethod {
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing PayPal payment of $" + amount);
        // Logic for PayPal processing
    }
}

// Let's add a new one without touching existing code!
class UPIPayment implements PaymentMethod {
    @Override
    public void processPayment(double amount) {
        System.out.println("Processing UPI payment of ₹" + amount * 80); // Assuming a conversion rate for example
        // Logic for UPI processing
    }
}
```

#### Step 3: Modify the `PaymentProcessor` to Use the Abstraction

Our `PaymentProcessor` will now depend on the `PaymentMethod` interface, not concrete implementations. It no longer needs to know the specifics of each payment type.

```java
class PaymentProcessor {
    public void process(PaymentMethod paymentMethod, double amount) {
        // No more if-else! The processor doesn't care about the specific type.
        // It just knows it can call processPayment.
        paymentMethod.processPayment(amount);
    }
}
```

#### Step 4: Final Checkout Service Implementation

The `CheckoutService` simply passes the payment method:

```java
class CheckoutService {
    public void processPayment(PaymentMethod method, double amount) {
        PaymentProcessor processor = new PaymentProcessor();
        processor.process(method, amount);
    }
}

// Usage
CheckoutService checkout = new CheckoutService();
checkout.processPayment(new CreditCardPayment(), 100.00);
checkout.processPayment(new PayPalPayment(), 100.00);
checkout.processPayment(new UPIPayment(), 100.00);
```

Look at that! Now, if the client wants to add "Bitcoin Payments" or "Apple Pay," what do we do?

1.  Create a new class `BitcoinPayment` that implements `PaymentMethod`.
2.  Implement its `processPayment` method.

That's it! The `PaymentProcessor` class remains **unchanged**. It's closed for modification but open for extension through new classes implementing the `PaymentMethod` interface.

This is often achieved using design patterns like the **Strategy Pattern** (which we've essentially implemented here) or the **Decorator Pattern**. Inheritance is another common mechanism.

## Common Pitfalls While Applying OCP

While OCP is powerful, it's not always straightforward, and developers can stumble into a few traps:

1.  **Over-Engineering/Premature Abstraction:** Applying OCP everywhere, for every conceivable future change, can lead to overly complex designs and unnecessary abstractions. Don't abstract things that are unlikely to change. Apply OCP strategically where change is anticipated.
2.  **Misinterpreting "Closed for Modification":** "Closed for modification" doesn't mean you can _never_ change a class. If there's a bug in the existing code, you absolutely must fix it. OCP applies to extending behavior, not to bug fixing or refactoring for clarity.
3.  **Abstraction Hell:** Creating too many layers of abstraction can make the code harder to understand and debug. The goal is clarity and maintainability, not abstraction for abstraction's sake.
4.  **Forgetting the "Why":** If you're applying OCP mechanically without understanding the underlying goals (maintainability, scalability), you might create a system that follows the letter of the law but not its spirit.
5.  **Not Anticipating the Right Extension Points:** Identifying where your system is likely to change is crucial. If you create extension points in stable parts of your system and hardcode the volatile parts, OCP won't help much. This often comes with experience and good domain understanding.

## Common Questions About OCP

#### Does OCP mean I can _never_ change existing code? What about bug fixes?

No, OCP primarily applies to adding new features or behaviors. Bug fixes are an exception; if your code has a flaw, you should definitely modify it to correct the issue. The "closed for modification" part means you shouldn't have to alter existing, working code to introduce new functionality.

#### When should I apply OCP? Is it for every class?

Not necessarily for every single class from day one. OCP is most beneficial in parts of your system that you anticipate will change or have variations. If a piece of code is very stable and unlikely to have new variations, forcing OCP might be an over-complication. It's a judgment call based on requirements and experience. Think about areas like business rules, integrations with external services, or UI components that might have different themes.

#### Isn't creating new classes for every little change cumbersome?

It might seem so initially, but the long-term benefits in terms of reduced risk, easier maintenance, and clearer separation of concerns often outweigh the effort of creating a few extra classes. Modern IDEs make class creation and management very easy. The alternative is often a monolithic, tangled class that becomes a nightmare to manage.

#### How does OCP relate to other SOLID principles?

OCP works very well with other SOLID principles:

*   **Single Responsibility Principle (SRP):** Classes with a single responsibility are easier to close for modification because changes related to other responsibilities won't affect them.
*   **Liskov Substitution Principle (LSP):** When using inheritance for OCP, LSP ensures that subclasses can truly substitute their parent classes without breaking functionality, which is crucial for safe extension.
*   **Dependency Inversion Principle (DIP):** Depending on abstractions (like our `PaymentMethod` interface) rather than concrete implementations is key to achieving OCP.

#### Are there specific design patterns that help implement OCP

Yes! Several design patterns facilitate OCP:

*   **Strategy Pattern:** As seen in our example, allows algorithms to be selected at runtime.
*   **Decorator Pattern:** Allows adding responsibilities to objects dynamically.
*   **Template Method Pattern:** Defines the skeleton of an algorithm in a superclass but lets subclasses override specific steps.
*   **Factory Pattern (and Abstract Factory):** Can be used to create instances of different classes that implement a common interface, allowing new types to be added easily.
*   **Observer Pattern:** Allows objects to subscribe to events and react to them, enabling new subscribers to be added without changing the event publisher.
