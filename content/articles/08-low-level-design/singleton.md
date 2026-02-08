---
title: "Singleton Pattern"
description: "Singleton is a reusable way to solve a common design problem. It gives you a proven structure so your code stays clean as it grows."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---


![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)

### Introduction: Understanding the Singleton Pattern and Its Importance

In modern **software development**, managing object creation is a critical aspect of designing robust and efficient applications. Certain classes require **only one object instance** throughout the application's lifecycle to avoid problems such as resource overuse, inconsistent behavior, or erroneous program states. Examples of such classes include **thread pools**, **caches**, and **loggers**. This necessity gives rise to the **Singleton Design Pattern**, a **creational design pattern** that ensures a class has exactly one instance and provides a **global point of access** to that instance.

The Singleton pattern is deceptively simple but notoriously challenging to implement correctly, especially in **multithreaded environments**. This chapter delves into the core concepts of the Singleton pattern, explores multiple implementation strategies primarily in Java, discusses their pros and cons, and highlights real-world applications.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770488483/Portfolio/lldSystemDesign/img/60ef764b-6b9e-4bc3-82f9-51031c242558.png)

Key vocabulary and concepts introduced here include:  
- **Singleton Pattern**: A design pattern ensuring a single instance of a class.  
- **Global Point of Access**: A way for any part of the program to access the singleton instance.  
- **Lazy Initialization**: Delaying the creation of an object until it is needed.  
- **Thread Safety**: Ensuring correct operation when multiple threads access the class simultaneously.  
- **Synchronization**: Mechanism to control concurrent access to resources.  
- **Volatile Keyword**: Ensures visibility of changes across threads.  

### What is the Singleton Pattern?

The Singleton pattern guarantees that a **class creates only one instance** and exposes this instance globally. The core principles include:

- The class is responsible for creating and managing its unique instance.
- External objects cannot create new instances directly.
- A public method allows access to this instance.

In Java, this typically involves:

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770488376/Portfolio/lldSystemDesign/img/e5ea9b72-d017-49c7-9db4-12e08e7ce5c1.png)

- Declaring the **constructor as private** to prevent external instantiation.
- Providing a **static method** (commonly named `getInstance()`) to retrieve the singleton instance.
- Maintaining a **static variable** inside the class to hold the singleton object.

The accompanying **class diagram** demonstrates these elements: the private constructor, the static instance variable, and the static accessor method.

### Implementing the Singleton Pattern in Java

There are multiple approaches to implement the Singleton pattern, each with its advantages and trade-offs concerning **thread safety**, **performance**, and **resource management**.

#### 2.1 Lazy Initialization
This approach creates the singleton instance only when it is needed, saving resources if the singleton is never used in the application.

- Creates the instance only when first accessed, saving resources if unused.
- Implementation checks if the instance exists; if not, it creates one.
> **Warning**: Not thread-safe; concurrent calls can produce multiple instances.

**Code Summary:**  
```java
class LazySingleton {
    // The single instance, initially null
    private static LazySingleton instance;

    // Private constructor to prevent instantiation
    private LazySingleton() {}

    // Public method to get the instance
    public static LazySingleton getInstance() {
        if (instance == null) {
            instance = new LazySingleton();
        }
        return instance;
    }
}
```

#### 2.2 Thread-Safe Singleton (Synchronized Method)
This approach is similar to lazy initialization but also ensures that the singleton is **thread-safe**.

This is achieved by making the getInstance() method **synchronized** ensuring only one thread can execute this method at a time.

When a thread enters the synchronized method, it acquires a lock on the class object. Other threads must wait until the method is executed.

```java
class ThreadSafeSingleton {
    private static ThreadSafeSingleton instance;

    private ThreadSafeSingleton() {}


    public static synchronized ThreadSafeSingleton getInstance() {
        if (instance == null) {
            instance = new ThreadSafeSingleton();
        }

        return instance;
    }
}
```

- Ensures thread safety by synchronizing the `getInstance()` method.
- Only one thread can create the instance at a time.
- The **synchronization** keyword ensures that only one thread can perform the (instance == null) check and create the object.
> **Warning**: Synchronization introduces performance overhead, especially if `getInstance()` is called frequently.

#### 2.3 Double-Checked Locking
This approach minimizes performance overhead from synchronization by only synchronizing when the object is first created.

It uses the volatile keyword to ensure that changes to the instance variable are immediately visible to other threads.

```java
class DoubleCheckedSingleton {
    // The single instance, initially null, marked as volatile
    private static volatile DoubleCheckedSingleton instance;

    private DoubleCheckedSingleton() {}


    public static DoubleCheckedSingleton getInstance() {
        // First check (not synchronized)
        if (instance == null) {
            // Synchronize on the class object
            synchronized (DoubleCheckedSingleton.class) {
                // Second check (synchronized)
                if (instance == null) {
                    instance = new DoubleCheckedSingleton();
                }
            }
        }
        // Return the instance (either newly created or existing)
        return instance;
    }
}
```

- Reduces synchronization cost by performing two checks on the instance: one outside and one inside a synchronized block.
- Uses the **volatile** keyword to guarantee visibility of the instance variable's updates.
- Balances thread safety and performance.
- More complex to implement but avoids unnecessary synchronization after the instance is created.

#### 2.4 Eager Initialization
This implementation is one of the simplest and inherently thread-safe without needing explicit synchronization.

```java
class EagerSingleton {
    // The single instance, created immediately
    private static final EagerSingleton instance = new EagerSingleton();

    private EagerSingleton() {}

    public static EagerSingleton getInstance() {
        return instance;
    }
}
```

- `static` variable ensures there's only one instance shared across all instances of the class.
- `final` prevents the instance from being reassigned after initialization.

This approach is suitable if your application always creates and uses the singleton instance, or the overhead of creating it is minimal.

> **Warning**: While it is inherently thread-safe, it could potentially waste resources if the singleton instance is never used by the client application.

#### 2.5 Bill Pugh Singleton (Static Inner Class)
This implementation uses a static inner helper class to hold the singleton instance. The inner class is not loaded into memory until it's referenced for the first time in the getInstance() method.

It is thread-safe without requiring explicit synchronization.

```java
class BillPughSingleton {
    private BillPughSingleton() {}

    // Static inner class that holds the instance
    private static class SingletonHelper {
        private static final BillPughSingleton INSTANCE = new BillPughSingleton();
    }

    public static BillPughSingleton getInstance() {
        return SingletonHelper.INSTANCE;
    }
}
```

- Uses a static inner helper class to hold the singleton instance.
- Inner class is loaded only when referenced, enabling **lazy initialization**.
- Thread-safe without explicit synchronization.
- Offers an excellent balance between lazy loading, thread safety, and performance.

#### 2.6 Static Block Initialization
This is similar to eager initialization, but the instance is created in a static block.

It provides the ability to handle exceptions during instance creation, which is not possible with simple eager initialization.

```java
class StaticBlockSingleton {
    private static StaticBlockSingleton instance;

    private StaticBlockSingleton() {}

    // Static block for initialization
    static {
        try {
            instance = new StaticBlockSingleton();
        } catch (Exception e) {
            throw new RuntimeException("Exception occurred in creating singleton instance");
        }
    }

    // Public method to get the instance
    public static StaticBlockSingleton getInstance() {
        return instance;
    }
}
```

- The static block is executed when the class is loaded by the JVM.
- If an exception occurs, it's wrapped in a RuntimeException.

> Warning: It is thread safe but not lazy-loaded, which might be a drawback if the initialization is resource-intensive or time-consuming.

#### 2.7 Enum Singleton
In this method, the singleton is declared as an enum rather than a class.

Java ensures that only one instance of an enum value is created, even in a multithreaded environment.

The Enum Singleton pattern is the most robust and concise way to implement a singleton in Java.

```java
enum EnumSingleton {
    INSTANCE;

    // Public method
    public void doSomething() {
        // Add any singleton logic here
    }
}
```

- Implements Singleton using an **enum type**.
- Java ensures a single instance per enum constant, inherently thread-safe.
- Recommended by experts like **Joshua Bloch** as the most robust approach.
- Limitations include lack of lazy loading and difficulty extending classes.

> **Warning:** It may not always be suitable especially if you need to extend a class or if lazy initialization is a strict requirement.

### Real-World Applications of the Singleton Pattern

Singleton is useful in scenarios like:

- **Managing Shared Resources** (database connections, thread pools, caches, configuration settings)
- **Coordinating System-Wide Actions** (logging, print spoolers, file managers)
- **Managing State** (user session, application state)

The Singleton pattern is widely used to manage shared resources and coordinate system-wide actions in software systems. Common use cases include:

- **Logger Classes:** Provide a single global logging object to ensure consistent logging behavior.
- **Database Connection Pools:** Manage and reuse database connections efficiently by maintaining a single pool instance.
- **Cache Objects:** Centralize in-memory caching to provide a single point of access for cached data.
- **Thread Pools:** Manage worker threads to optimize resource usage by ensuring only one pool is used.
- **File System Interfaces:** Represent the file system as a Singleton to unify file operations.
- **Print Spoolers:** Coordinate print jobs in an operating system, preventing conflicts with a single controlling instance.

These examples underscore the pattern's utility in controlling resource-intensive or state-sensitive components.

### Advantages and Disadvantages of the Singleton Pattern

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770488380/Portfolio/lldSystemDesign/img/57d20a70-093a-4725-b2bc-ee824daf10f3.png)

The pattern should be applied judiciously. When possible, prefer alternatives like **dependency injection** to promote loose coupling and improve testability.

### Conclusion: Key Takeaways and Implications

The **Singleton Design Pattern** is a fundamental creational pattern that ensures a class has a single instance with a global access point. It is essential when managing shared resources such as thread pools, caches, and loggers, where multiple instances could cause resource contention, inconsistent behavior, or errors.

Implementing Singleton correctly requires balancing **thread safety**, **performance**, and **resource management**. Various approaches exist, from simple lazy initialization to the highly recommended **Enum Singleton** and **Bill Pugh Singleton** methods. Each method offers different trade-offs between simplicity, thread safety, lazy loading, and exception handling.

While the Singleton pattern offers clear advantages in resource management and global state maintenance, it also introduces challenges in terms of **design principles**, **testability**, and **application complexity**. Developers must evaluate the need for a Singleton against these drawbacks and consider alternatives like dependency injection frameworks to maintain modular and maintainable codebases.

In sum, the Singleton pattern remains a powerful tool in the software engineer’s toolkit, but its use demands careful consideration to avoid pitfalls inherent in global state management.

### Summary of Key Points

- **Singleton Pattern** ensures a class has a single instance and provides a global access point.
- Prevent external instantiation by making constructors **private**.
- Common implementation strategies in Java include **lazy initialization**, **thread-safe synchronized methods**, **double-checked locking**, **eager initialization**, **Bill Pugh Singleton**, **static block initialization**, and **Enum Singleton**.
- **Thread safety** is paramount and requires synchronization or JVM guarantees.
- Real-world uses include management of **loggers**, **database connection pools**, **caches**, **thread pools**, **file systems**, and **print spoolers**.
- Pros include resource efficiency and global access; cons include violation of single responsibility, global state management issues, and testing challenges.
- Use Singleton judiciously and consider alternatives such as **dependency injection** for better modularity and testability.