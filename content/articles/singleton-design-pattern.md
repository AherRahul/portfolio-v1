---
title: "Singleton Design Pattern and 7 Ways to Implement it"
description: "In software development, we often require classes that can only have one object. For example: thread pools, caches, loggers etc."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/singleton-design-pattern.md"
dateModified: "2024-06-24"
datePublished: "2024-06-24"
showOnArticles: true
topics:
  - dsa
  - design-patterns
---

In software development, we often require classes that can only have  **one object** . For example: thread pools, caches, loggers etc.

Creating more than one objects of these could lead to issues such as incorrect program behavior, overuse of resources, or inconsistent results.

This is where  **Singleton Design Pattern**  comes into play.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/0da4290e-7157-4ecf-9b88-806d61bd5c09_916x634.png)](https://substackcdn.com/image/fetch/$s_!AMpe!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F0da4290e-7157-4ecf-9b88-806d61bd5c09_916x634.png)

It is one of the simplest design patterns, yet  **challenging**   **to implement**  correctly.

In this article, we will explore what it is, different ways you can implement it Java, real-world examples where it’s used and it’s pros and cons.

If you’re enjoying this newsletter and want to get even more value, consider becoming a  **[paid subscriber](https://blog.algomaster.io/subscribe)** .

As a paid subscriber, you'll unlock all  **premium articles**  and gain full access to all  **[premium courses](https://algomaster.io/newsletter/paid/resources)**  on  **[algomaster.io](https://algomaster.io)** .

# What is Singleton Design Pattern?

> Singleton Pattern is a creational design pattern that guarantees a class has only one instance and provides a global point of access to it.

It involves only one class which is responsible for instantiating itself, making sure it creates not more than one instance.

### Implementation

To implement the singleton pattern, we must prevent external objects from creating instances of the singleton class. Only the singleton class should be permitted to create its own objects.

Additionally, we need to provide a method for external objects to access the singleton object.

This can be achieved by making the  **constructor private**  and providing a  **static method**  for external objects to access it.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/8aa7de88-ea0c-4ee9-9e72-84c88bac6ef8_2005x734.png)](https://substackcdn.com/image/fetch/$s_!NJqk!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8aa7de88-ea0c-4ee9-9e72-84c88bac6ef8_2005x734.png)

The instance class variable holds the one and only instance of the Singleton class.

The Singleton() constructor is declared as private, preventing external objects from creating new instances.

The getInstance() method is a static class method, making  it accessible to the external world.

There are several ways to implement the Singleton Pattern, each with its own advantages and disadvantages.

# 1. Lazy Initialization

This approach creates the singleton instance only when it is needed, saving resources if the singleton is never used in the application.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/1d56ca84-5af6-4cc0-b3e5-bcb56c21f507_2624x1896.png)](https://substackcdn.com/image/fetch/$s_!Zhjn!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1d56ca84-5af6-4cc0-b3e5-bcb56c21f507_2624x1896.png)


- Checks if an instance already exists (instance == null).
- If not, it creates a new instance.
- If an instance already exists, it skips the creation step.

This implementation is not thread-safe. If multiple threads call getInstance() simultaneously when instance is null, it's possible to create multiple instances.

# 2. Thread-Safe Singleton

This approach is similar to lazy initialization but also ensures that the singleton is thread-safe.

This is achieved by making the getInstance() method  **synchronized**  ensuring only one thread can execute this method at a time.

When a thread enters the synchronized method, it acquires a lock on the class object. Other threads must wait until the method is executed.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/bd0e9e2c-ea4e-4221-99ef-f7ede9e0a680_2696x1896.png)](https://substackcdn.com/image/fetch/$s_!vUKT!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fbd0e9e2c-ea4e-4221-99ef-f7ede9e0a680_2696x1896.png)


- The  **synchronization**  keyword ensures that only one thread can perform the (instance == null) check and create the object.

If calling the getInstance() method isn’t causing substantial overhead, this approach is straightforward and effective.

But, using synchronized can decrease performance, which can be a bottleneck if called frequently.

# 3. Double-Checked Locking

This approach minimizes performance overhead from synchronization by only synchronizing when the object is first created.

It uses the volatile keyword to ensure that changes to the instance variable are immediately visible to other threads.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/606ee906-7dab-46fe-a98a-915ba76a38d3_2624x2436.png)](https://substackcdn.com/image/fetch/$s_!CWsv!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F606ee906-7dab-46fe-a98a-915ba76a38d3_2624x2436.png)


- If the first check (instance == null) passes, we synchronize on the class object.
- We check the same condition one more time because multiple threads may have passed the first check.
- The instance is created only if both checks pass.

Although this method is a bit complex to implement, it can drastically reduce the performance overhead.

# 4. Eager Initialization

In this method, we rely on the JVM to create the singleton instance when the class is loaded. The JVM guarantees that the instance will be created before any thread access the instance variable.

This implementation is one of the simplest and inherently thread-safe without needing explicit synchronization.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/c739f82c-d674-417a-9136-c834b1e984c3_2876x1356.png)](https://substackcdn.com/image/fetch/$s_!RD--!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc739f82c-d674-417a-9136-c834b1e984c3_2876x1356.png)


- static variable ensures there's only one instance shared across all instances of the class.
- final prevents the instance from being reassigned after initialization.

This approach is suitable if your application always creates and uses the singleton instance, or the overhead of creating it is minimal.

While it is inherently thread-safe, it could potentially waste resources if the singleton instance is never used by the client application.

# 5. Bill Pugh Singleton

This implementation uses a static inner helper class to hold the singleton instance. The inner class is not loaded into memory until it's referenced for the first time in the getInstance() method.

It is thread-safe without requiring explicit synchronization.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/7f667e03-738a-4721-91e7-5f0efbe73341_3240x1536.png)](https://substackcdn.com/image/fetch/$s_!x58a!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7f667e03-738a-4721-91e7-5f0efbe73341_3240x1536.png)


- When the getInstance() method is called for the first time, it triggers the loading of the SingletonHelper class.
- When the inner class is loaded, it creates the INSTANCE of BillPughSingleton.
- The final keyword ensures that the INSTANCE cannot be reassigned.

The Bill Pugh Singleton implementation, while more complex than Eager Initialization provides a perfect balance of lazy initialization, thread safety, and performance, without the complexities of some other patterns like double-checked locking.

# 6. Enum Singleton

In this method, the singleton is declared as an enum rather than a class.

Java ensures that only one instance of an enum value is created, even in a multithreaded environment.

The Enum Singleton pattern is the most robust and concise way to implement a singleton in Java.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/9df35ce5-34c5-4da7-85dd-f1d28b089642_2080x996.png)](https://substackcdn.com/image/fetch/$s_!1aYJ!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9df35ce5-34c5-4da7-85dd-f1d28b089642_2080x996.png)


Many Java experts, including  **[Joshua Bloch](https://en.wikipedia.org/wiki/Joshua_Bloch)** , recommend Enum Singleton as the best singleton implementation in Java.

However, it's not always suitable, especially if you need to extend a class or if lazy initialization is a strict requirement.

# 7. Static Block Initialization

This is similar to eager initialization, but the instance is created in a static block.

It provides the ability to handle exceptions during instance creation, which is not possible with simple eager initialization.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/e1196645-204f-40f6-b965-00112c80dc82_3604x2168.png)](https://substackcdn.com/image/fetch/$s_!NtMh!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe1196645-204f-40f6-b965-00112c80dc82_3604x2168.png)


- The static block is executed when the class is loaded by the JVM.
- If an exception occurs, it's wrapped in a RuntimeException.

It is thread safe but not lazy-loaded, which might be a drawback if the initialization is resource-intensive or time-consuming.

# Real-World Examples of Singleton Design Pattern

Singleton is useful in scenarios like:

- **Managing Shared Resources**  (database connections, thread pools, caches, configuration settings)
- **Coordinating System-Wide Actions**  (logging, print spoolers, file managers)
- **Managing State (** user session, application state **)**

#### Specific Examples:

- **Logger Classes** : Many logging frameworks use the Singleton pattern to provide a global logging object. This ensures that log messages are consistently handled and written to the same output stream.
- **Database Connection Pools** : Connection pools help manage and reuse database connections efficiently. A Singleton can ensure that only one pool is created and used throughout the application.
- **Cache Objects** : In-memory caches are often implemented as Singletons to provide a single point of access for cached data across the application.
- **Thread Pools:** Thread pools manage a collection of worker threads. A Singleton ensures that the same pool is used throughout the application, preventing resource overuse.
- **File System** : File systems often use Singleton objects to represent the file system and provide a unified interface for file operations.
- **Print Spooler** : In operating systems, print spoolers manage printing tasks. A single instance coordinates all print jobs to prevent conflicts.

# Pros and Cons of Singleton Design Pattern

[![image](https://substack-post-media.s3.amazonaws.com/public/images/f47f0ad9-a144-493f-a78a-e5e99a1154c0_1952x928.png)](https://substackcdn.com/image/fetch/$s_!TjlN!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff47f0ad9-a144-493f-a78a-e5e99a1154c0_1952x928.png)

It's important to note that the Singleton pattern should be used judiciously, as it introduces global state and can make testing and maintenance more challenging. Consider alternative approaches like  **dependency injection**  when possible to promote loose coupling and testability.


Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
