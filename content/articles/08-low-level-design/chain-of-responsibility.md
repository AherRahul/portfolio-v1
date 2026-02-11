---
title: "Chain of Responsibility Pattern"
description: "Learn how the Chain of Responsibility design pattern simplifies request handling by decoupling logic, improving modularity, and enhancing extensibility in software design."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

## Mastering Chain of Responsibility Pattern for Flexible Request Handling

![Smart Watch](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)

### Introduction to Chain of Responsibility Pattern

In modern software development, handling complex requests often involves multiple steps such as authentication, authorization, validation, and rate limiting. Managing these steps with bulky conditional statements can lead to fragile and hard-to-maintain code. The **Chain of Responsibility (CoR) design pattern** offers a powerful solution by decoupling request handling logic into modular, reusable components organized in a chain.

This blog post explores the Chain of Responsibility pattern in depth, highlighting its benefits, structure, and practical implementation through a detailed example of HTTP request processing.


![Smart Watch](https://res.cloudinary.com/duojkrgue/image/upload/v1770798071/Portfolio/lldSystemDesign/img/881f9cee-430a-469e-b4f9-999662f353ab.png)

This pattern is useful when:

*   A request must be handled by **one of many possible handlers**, and you don’t want the sender to be tightly coupled to any specific one.
*   You want to **decouple request logic** from the code that processes it.
*   You want to **flexibly add, remove, or reorder handlers** without changing the client code.

When dealing with conditional request handling, developers often resort to long chains of `if-else` or `switch` statements to determine how a request should be processed. For example, a logging system might write to the console, file, or remote server depending on configuration, or an HTTP request might need to go through validation, authentication, and rate-limiting steps.

But as the number of conditions grows, this approach becomes hard to scale, **violates the Open/Closed Principle**, and turns your logic into a tightly coupled, brittle monolith.

The **Chain of Responsibility Pattern** solves this by turning individual processing steps into standalone classes, each responsible for **one specific concern**. These handlers are linked together to form a **chain**, and the request flows through the chain until it is handled (or dropped).

Let’s walk through a real-world example to see how we can apply the Chain of Responsibility Pattern to build a **clean, modular, and extensible pipeline for request processing.**


### What is the Chain of Responsibility Pattern ?

#### Definition and Purpose

The Chain of Responsibility is a behavioral design pattern that enables passing requests along a series of handlers. Each handler can decide to:

- Process the request and terminate the chain,
- Pass the request to the next handler, or
- Process the request and then pass it along.

This pattern is particularly useful when:

- A request might be handled by one of many potential handlers,
- You want to decouple request logic from the processing code,
- Flexibility is required to add, remove, or reorder handlers without altering client code.

#### Problems it Solves

Without this pattern, requests are often handled using nested `if-else` or `switch` statements, which:

- Violate the Open/Closed Principle (OCP),
- Result in tightly coupled and monolithic code,
- Are difficult to extend or modify,
- Compromise separation of concerns and testability.


### The Problem: Handling HTTP Requests Naively

Imagine building a backend server that processes HTTP requests. Each request contains information about the user, their role, request count, and payload that must pass through multiple checks before executing business logic.

#### Naive Implementation Example
```java
class Request {
    public String user;
    public String userRole;
    public int requestCount;
    public String payload;

    public Request(String user, String role, int requestCount, String payload) {
        this.user = user;
        this.userRole = role;
        this.requestCount = requestCount;
        this.payload = payload;
    }
}
```

Before the request reaches the actual business logic, it must pass through several processing steps:

1.  **Authentication**: Is the user properly authenticated via a token or session?
2.  **Authorization**: Is the authenticated user allowed to perform this action?
3.  **Rate Limiting**: Has the user exceeded their allowed number of requests?
4.  **Data Validation**: Is the request payload well-formed and valid?


![Smart Watch](https://res.cloudinary.com/duojkrgue/image/upload/v1770798105/Portfolio/lldSystemDesign/img/f8956f80-b83b-4828-bdee-628569d585a3.png)

Only after all these checks pass should the request reach the actual business logic.

### The Naive Approach

A typical first attempt might look like this: implement all logic inside a single class using a long chain of `if-else` statements.

```java
class RequestHandler {
    public void handle(Request request) {
        if (!authenticate(request)) {
            System.out.println("Request Rejected: Authentication failed.");
            return;
        }

        if (!authorize(request)) {
            System.out.println("Request Rejected: Authorization failed.");
            return;
        }

        if (!rateLimit(request)) {
            System.out.println("Request Rejected: Rate limit exceeded.");
            return;
        }

        if (!validate(request)) {
            System.out.println("Request Rejected: Invalid payload.");
            return;
        }

        System.out.println("Request passed all checks. Executing business logic...");
        // Proceed to business logic
    }

    private boolean authenticate(Request req) {
        return req.user != null;
    }

    private boolean authorize(Request req) {
        return "ADMIN".equals(req.userRole);
    }

    private boolean rateLimit(Request req) {
        return req.requestCount < 100;
    }

    private boolean validate(Request req) {
        return req.payload != null && !req.payload.isEmpty();
    }
}
```

#### Client Code Example

```java
public class App {
    public static void main(String[] args) {
        Request req = new Request("john_doe", "ADMIN", 42, "{ 'data': 123 }");
        RequestHandler handler = new RequestHandler();
        handler.handle(req);
    }
}
```

This works fine for a simple case, but there are several problems hiding beneath the surface.

### Why This Approach Breaks Down

#### 1\. **Violates the Open/Closed Principle**

Every time you need to add a new check, say logging, caching, or metrics collection, you must modify the existing `RequestProcessor` class. The class is open for modification when it should be closed for changes and open for extension.

#### 2\. Poor Separation of Concerns

All validation and control logic is tightly coupled inside a single method. This violates the Single Responsibility Principle. The class is doing too many things: authentication, authorization, rate limiting, validation, and business logic coordination.

#### 3\. No Reusability

What if another service needs the same authentication logic? You would have to copy the code or create awkward shared methods. Neither option is clean.

#### 4\. Inflexible Configuration

What if you want to skip authorization for public APIs? Or make validation optional in development mode? You would need more if statements, and the code would become even more tangled.

### What We Really Need

We need a way to:

*   Break each processing step into its own isolated unit
*   Let each step decide whether to continue, pass, or stop the chain
*   Allow new handlers to be added, removed, or reordered without touching existing code
*   Keep our logic clean, testable, and extensible

This is exactly what the **Chain of Responsibility Pattern** provides.


### Understanding the Chain of Responsibility Pattern

#### Core Components
The Chain of Responsibility Pattern allows a request to be passed along a chain of handlers. Each handler in the chain can either:

1. **Handler Interface:** Defines a method to process requests and a method to set the next handler.
2. **Concrete Handlers:** Implement the interface to handle specific concerns (e.g., authentication, authorization).
3. **Client:** Builds the chain by linking handlers and sends requests to the first handler.
This pattern decouples the sender of the request from the receivers, giving you the flexibility to compose chains dynamically, reuse logic, and avoid rigid conditional blocks.

### Structure

The pattern consists of three main components:

![COR Class Diagram](https://res.cloudinary.com/duojkrgue/image/upload/v1770798122/Portfolio/lldSystemDesign/img/74797ca7-15a7-4ad8-8de1-5dc6058f65f1.png)

#### 1\. Handler Interface (Abstract Base Class / Interface)

*   Declares a method like `handle(request)` for processing the request.
*   Holds a reference to the **next handler** in the chain via `setNext(handler)`.
*   Defines the contract for passing the request down the chain.

#### 2\. ConcreteHandlers (e.g., `AuthHandler`, `RateLimitHandler`)

Implement the `Handler` interface.

Each handler decides if it will:

*   **Handle the request** (e.g., reject, log, transform), or
*   **Pass the request along** to the next handler in the chain.

#### 3\. Client

*   Builds and connects the chain of handlers using `setNext()`.
*   Sends the request to the **first handler** in the chain.
*   Is unaware of which handler will ultimately process the request.

#### How It Works

Requests flow through the chain until a handler processes it or the chain ends. Handlers can decide whether to handle the request or forward it.


### Implementing the Chain of Responsibility Pattern
Let’s refactor our monolithic `RequestHandler` into a **clean, extensible chain of modular handlers** using the **Chain of Responsibility Pattern**.

#### Step 1: Define the Handler InterfaceInterface

Every handler will implement this interface. Each handler should:

*   Perform its specific check
*   Decide whether to stop the chain or pass the request to the next handler

```java
interface RequestHandler {
    void setNext(RequestHandler next);
    void handle(Request request);
}
```

#### Step 2: Create an Abstract Base Handler

To avoid duplicating the `setNext()` and forwarding logic in every handler, we define an abstract base class with reusable functionality.

```java
abstract class BaseHandler implements RequestHandler {
    protected RequestHandler next;

    @Override
    public void setNext(RequestHandler next) {
        this.next = next;
    }

    protected void forward(Request request) {
        if (next != null) {
            next.handle(request);
        }
    }
}
```
> Now every concrete handler can focus solely on its logic and delegate to forward(request) when needed.


#### Step 3: Implement Concrete Handlers

Each handler implements one responsibility. They extend `BaseHandler`, implement `handle(Request)`, and determine whether to continue the chain or short-circuit it.

#### Authentication Handler

```java
class AuthHandler extends BaseHandler {
    @Override
    public void handle(Request request) {
        if (request.user == null) {
            System.out.println("AuthHandler: ❌ User not authenticated.");
            return;
        }
        System.out.println("AuthHandler: ✅ Authenticated.");
        forward(request);
    }
}
```

#### Authorization Handler

```java
class AuthorizationHandler extends BaseHandler {
    @Override
    public void handle(Request request) {
        if (!"ADMIN".equals(request.userRole)) {
            System.out.println("AuthorizationHandler: ❌ Access denied.");
            return;
        }
        System.out.println("AuthorizationHandler: ✅ Authorized.");
        forward(request);
    }
}
```

#### Rate Limiting Handler

```java
class RateLimitHandler extends BaseHandler {
    @Override
    public void handle(Request request) {
        if (request.requestCount >= 100) {
            System.out.println("RateLimitHandler: ❌ Rate limit exceeded.");
            return;
        }
        System.out.println("RateLimitHandler: ✅ Within rate limit.");
        forward(request);
    }
}
```

#### Validation Handler

```java
class ValidationHandler extends BaseHandler {
    @Override
    public void handle(Request request) {
        if (request.payload == null || request.payload.trim().isEmpty()) {
            System.out.println("ValidationHandler: ❌ Invalid payload.");
            return;
        }
        System.out.println("ValidationHandler: ✅ Payload valid.");
        forward(request);
    }
}
```

#### Business Logic Handler (Final Step)

```java
class BusinessLogicHandler extends BaseHandler {
    @Override
    public void handle(Request request) {
        System.out.println("BusinessLogicHandler: 🚀 Processing request...");
        // Execute core business logic here
    }
}
```

#### Step 4: Assemble the Chain in Client Code
This is the last handler in the chain — it assumes the request has passed all previous checks.

```java
public class RequestHandlerApp {
    public static void main(String[] args) {
        RequestHandler auth = new AuthHandler();
        RequestHandler authorization = new AuthorizationHandler();
        RequestHandler rateLimit = new RateLimitHandler();
        RequestHandler validation = new ValidationHandler();
        RequestHandler businessLogic = new BusinessLogicHandler();

        auth.setNext(authorization);
        authorization.setNext(rateLimit);
        rateLimit.setNext(validation);
        validation.setNext(businessLogic);

        Request request = new Request("john", "ADMIN", 10, "{ \"data\": \"valid\" }");
        auth.handle(request);

        System.out.println("\n--- Trying an invalid request ---");
        Request badRequest = new Request(null, "USER", 150, "");
        auth.handle(badRequest);
    }
}
```

#### Output

```bash
AuthHandler: ✅ Authenticated.
AuthorizationHandler: ✅ Authorized.
RateLimitHandler: ✅ Within rate limit.
ValidationHandler: ✅ Payload valid.
BusinessLogicHandler: 🚀 Processing request...

--- Trying an invalid request ---
AuthHandler: ❌ User not authenticated.
```

### Benefits of Using the Chain of Responsibility Pattern

* **1. Modularity:** Each handler is a self-contained unit responsible for one task, simplifying maintenance and testing.

* **2. Loose Coupling:** Handlers are unaware of the entire chain structure, only knowing their immediate successor.

* **3. Extensibility:** Adding or removing handlers requires no changes to existing code, just chain reconfiguration.

* **4. Clear Client Code:** The client builds the chain and sends the request. It does not need to know how requests are processed internally.

* **5. Compliance with SOLID Principles:**
    - **Open/Closed Principle:** Handlers can be extended without modifying existing code.
    - **Single Responsibility Principle:** Each handler has one responsibility.


### Real-World Use Cases

- **Logging Frameworks:** Handlers process logs at various levels (e.g., debug, info, error).
- **Event Processing Systems:** Events pass through handlers for filtering, transformation, and dispatch.
- **Middleware Pipelines:** HTTP requests pass through authentication, authorization, validation, and routing handlers.
- **Customer Support Systems:** Tickets flow through various departments until resolved.


### Conclusion

The Chain of Responsibility design pattern is a robust solution for handling requests that require multiple, conditional processing steps. By encapsulating each processing step as a separate, reusable handler and linking them dynamically, this pattern promotes clean, maintainable, and flexible code architecture.

Whether you are building web servers, middleware, or any system with layered processing, adopting the Chain of Responsibility pattern can greatly improve your codebase’s scalability and clarity.


### Frequently Asked Questions (FAQ)

**Q1: Can handlers modify the request before passing it along?**  
Yes, handlers can inspect and modify the request before forwarding it.

**Q2: What happens if no handler processes the request?**  
If the chain ends without handling the request, it may be dropped or handled by a default fallback handler.

**Q3: Can a handler pass the request even after handling it?**  
Yes, handlers may choose to both process and forward the request depending on the use case.

**Q4: Is Chain of Responsibility suitable for asynchronous processing?**  
Yes, but it may require additional handling to manage asynchronous flow and error propagation.


By mastering the Chain of Responsibility pattern, developers can design more robust and adaptable software systems that stand the test of evolving requirements. Start modularizing your request handling today!


## Mind Map

![Smart Watch](https://res.cloudinary.com/duojkrgue/image/upload/v1770800986/Portfolio/lldSystemDesign/img/NoteGPT_MindMap_1770800963487_fojmc9.png)

