---
title: "Dependency Inversion Principle (DIP)"
description: "This lesson explains Dependency Inversion Principle (DIP) in simple terms and shows how it helps you design clear, testable code."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---


![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)

## Dependency Inversion Principle (DIP)

Imagine you’re building an `EmailService`.

Your first task is to send emails using, say, Gmail.

So, you write something like this:

**Low-Level Module – Gmail**

```java
class GmailClient {
    public void sendGmail(String toAddress, String subjectLine, String emailBody) {
        System.out.println("Connecting to Gmail SMTP server...");
        System.out.println("Sending email via Gmail to: " + toAddress);
        System.out.println("Subject: " + subjectLine);
        System.out.println("Body: " + emailBody);
        // ... actual Gmail API interaction logic ...
        System.out.println("Gmail email sent successfully!");
    }
}
```

**High-Level Module – The Application's Email Service**

```java
class EmailService {
    private GmailClient gmailClient;

    public EmailService() {
        this.gmailClient = new GmailClient();
    }

    public void sendWelcomeEmail(String userEmail, String userName) {
        String subject = "Welcome, " + userName + "!";
        String body = "Thanks for signing up to our awesome platform. We're glad to have you!";
        this.gmailClient.sendGmail(userEmail, subject, body);
    }

    public void sendPasswordResetEmail(String userEmail) {
        String subject = "Reset Your Password";
        String body = "Please click the link below to reset your password...";
        this.gmailClient.sendGmail(userEmail, subject, body);
    }
}
```

At first glance, this seems totally fine. It works, it’s readable, and it sends emails.

Then one day, a product manager asks:

> “Can we switch from Gmail to Outlook for sending emails?”

Suddenly, you have a problem.

Your `EmailService` — a high-level component that handles business logic — is **tightly coupled** to `GmailClient`, a low-level implementation detail.

To switch providers, you’d have to:

*   Rewrite parts of `EmailService`
*   Replace every `gmailClient` method call with `outlookClient` ones
*   Change the constructor

And that’s just for one provider swap.

Now imagine needing to:

*   Support **multiple email providers** (Gmail, Outlook, SES, etc.)
*   Dynamically select a provider based on configuration

Your `EmailService` would quickly turn into a giant `if-else` soup.

This is exactly the kind of pain the **Dependency Inversion Principle (DIP)** helps you avoid.

## The Dependency Inversion Principle

The legendary Robert C. Martin (Uncle Bob) lays down DIP with two golden rules:

1.  **High-level modules should not depend on low-level modules. Both should depend on abstractions (e.g., interfaces).**
2.  **Abstractions should not depend on details. Details (concrete implementations) should depend on abstractions.**

In plain English:

*   Business logic should not rely directly on implementation details.
*   Instead, both should depend on a common interface or abstraction.

"Inversion? What's being inverted?". It's the direction of dependency!

With DIP, both the high-level module and the low-level module depend on a shared abstraction (an interface or abstract class). The control flow might still go from high to low, but the _source code dependency_ is inverted.

High-level modules define _what_ they need (the contract/interface), and low-level modules provide the _how_ (the implementation of that interface).

## Why Does DIP Matter?

1.  **Decoupling:** High-level modules become independent of the nitty-gritty details of low-level modules.
2.  **Flexibility & Extensibility:** Need to switch from Gmail to Outlook? Or add an SMS provider? Easy. Just create a new class that implements the shared abstraction and "plug it in." The high-level module doesn't need to change.
3.  **Enhanced Testability:** You can easily swap out real dependencies with mock objects or test doubles. Testing EmailService in isolation without hitting an actual email server becomes trivial.
4.  **Improved Maintainability:** Changes in one part of the system are less likely to break others. If GmailClient's internal API changes, it only affects GmailClient, not EmailService (as long as the abstraction remains the same).
5.  **Parallel Development:** Once the abstraction (interface) is defined, different teams can work independently. One team can build the EmailService (high-level) while other teams build different EmailClient implementations (low-level).

## Applying DIP

Let's refactor our original example step-by-step using DIP.

#### Step 1: Define the Abstraction (The Contract)

We need an interface that defines what any email sending mechanism should be able to do.

```java
interface EmailClient {
    void sendEmail(String to, String subject, String body);
}
```

#### Step 2: Concrete Implementations

Now, our specific email clients (the "details") will implement the above interface.

**Gmail implementation:**

```java
class GmailClientImpl implements EmailClient {
    @Override
    public void sendEmail(String to, String subject, String body) {
        System.out.println("Connecting to Gmail SMTP server...");
        System.out.println("Sending email via Gmail to: " + to);
        System.out.println("Subject: " + subject);
        System.out.println("Body: " + body);
        // ... actual Gmail API interaction logic ...
        System.out.println("Gmail email sent successfully!");
    }
}
```

**Outlook implementation:**

```java
class OutlookClientImpl implements EmailClient {
    @Override
    public void sendEmail(String to, String subject, String body) {
        System.out.println("Connecting to Outlook Exchange server...");
        System.out.println("Sending email via Outlook to: " + to);
        System.out.println("Subject: " + subject);
        System.out.println("Body: " + body);
        // ... actual Outlook API interaction logic ...
        System.out.println("Outlook email sent successfully!");
    }
}
```

#### Step 3: Update the High-Level Module

Our EmailService will no longer know about `GmailClientImpl` or `OutlookClientImpl`. It will only know about the `EmailClient` interface.

The actual implementation will be "injected" into it. This is **Dependency Injection (DI)** in action.

```java
class EmailService {
    private final EmailClient emailClient; // Depends on the INTERFACE!

    // Dependency is "injected" via the constructor
    public NewEmailService(EmailClient emailClient) {
        this.emailClient = emailClient;
    }

    public void sendWelcomeEmail(String userEmail, String userName) {
        String subject = "Welcome, " + userName + "!";
        String body = "Thanks for signing up to our awesome platform. We're glad to have you!";
        this.emailClient.sendEmail(userEmail, subject, body); // Calls the interface method
    }

    public void sendPasswordResetEmail(String userEmail) {
        String subject = "Your Password Reset Request";
        String body = "Please click the link below to reset your password...";
        this.emailClient.sendEmail(userEmail, subject, body);
    }
}
```

Our `EmailService` is now completely decoupled from the concrete email sending mechanisms. It's flexible, extensible, and super easy to test!

#### Step 4: Using it in Your Application

Somewhere in your application (often near the main method, or managed by a DI framework like Spring or Guice), you'll decide which concrete implementation to use and pass it to `EmailService`.

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("--- Using Gmail ---");
        EmailService gmailService = new EmailService(new GmailClientImpl());
        gmailService.sendEmail("test@example.com", "Welcome to SOLID principles!");

        System.out.println("--- Using Outlook ---");
        EmailService outlookService = new EmailService(new OutlookClientImpl());
        outlookService.sendEmail("test@example.com", "Welcome to SOLID principles!");
    }
}
```

## Common Pitfalls While Applying DIP

While DIP is powerful, watch out for these common missteps:

### 1\. Over-Abstraction

**The mistake:** Creating interfaces for everything — even for stable utility classes that aren’t likely to change.

**Why it’s a problem:**Too many unnecessary abstractions lead to clutter, boilerplate, and confusion.

**When to use interfaces:**

*   For external dependencies (APIs, email providers, databases)
*   For components that might change
*   For parts you need to mock in tests

> If something is stable and internal, **don’t abstract it just for the sake of DIP.**

### 2\. Leaky Abstractions

**The mistake:** Exposing implementation-specific logic in your interface.

**Example:**

```java
void configureGmailSpecificSetting(); // in EmailClient interface ❌
```

**Why it’s a problem:**

This defeats the purpose of abstraction — now your interface knows about Gmail, which means you're still tightly coupled.

> Interfaces should only expose **what the high-level module needs**, not what a specific implementation does behind the scenes.

### 3\. Interfaces Owned by Low-Level Modules

**The mistake:** Letting the low-level module define the interface it implements.

**Example:** `GmailClient` defines `IGmailClient`, and now `EmailService` depends on that.

**Why it’s a problem:**

Now the high-level module is still tied to the low-level module’s "namespace" and structure.

> The abstraction should be defined **by the high-level module** (or in a neutral shared module), not by the implementation.

### 4\. No Actual Injection

**The mistake:** Depending on an interface… but still creating the concrete implementation inside the class:

```java
this.emailClient = new GmailClient(); // ❌
```

**Why it’s a problem:**

You're still tightly coupled. This defeats the purpose of inversion.

Pass the dependency **from the outside**, either via:

*   Constructor injection
*   Setter injection
*   A framework (like Spring)

## Common Questions About DIP

#### Is DIP the same as Dependency Injection (DI)?

Not exactly.

*   **Dependency Inversion (DIP)** is a principle:  _“Depend on abstractions, not concrete implementations.”_
*   **Dependency Injection (DI)** is a technique used to achieve DIP: You _inject_ dependencies into a class (via constructor, setter, or method) instead of the class creating them itself.

You can follow DIP without using a DI container, and you can use DI without necessarily following DIP (though you probably should do both!).

#### Is DIP the same as Inversion of Control (IoC)?

Nope — but they’re related.

*   **Inversion of Control (IoC)** is a broader design concept where the flow of control is inverted. Instead of your code calling libraries, a framework or container calls your code (e.g., Spring controlling object creation and lifecycle).
*   **DIP** is one specific way to achieve IoC — by inverting who depends on whom (high-level modules depend on abstractions, not implementations).

Think of IoC as the big idea, and DIP as one way to implement that idea for dependencies.

#### Do I need an interface for every class?

**Definitely not.**

Use DIP **where it makes sense**, like:

*   When working with external systems (APIs, databases, email providers)
*   When building layers of your application (e.g., services calling repositories)
*   When you need flexibility or want to mock something during testing

If there’s only ever going to be one implementation and no real benefit from decoupling — skip the abstraction.

#### Doesn’t this create a lot of extra classes and interfaces?

It can — but that’s not a bad thing.

Yes, you might end up with more files. But:

*   Your code becomes easier to test
*   It's more adaptable to change
*   It's easier for teams to work on different layers independently

In short: **a few extra classes = a much more maintainable and scalable system.**

#### Where should these abstractions or interfaces live in my project?

Great question!

In most cases, the **client** (the high-level module) should define the interface — because it's the one saying:

> _“Here’s what I need.”_

For example:

*   `EmailClient` interface can live in the same package/module as `EmailService`.
*   If you're in a large codebase, you might keep all interfaces in a shared `contracts` or `api` module.

The key idea: **don’t make the high-level module depend on anything buried deep in the low-level implementation's territory** — otherwise, you’re right back to tight coupling.
