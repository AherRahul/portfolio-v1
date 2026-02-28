---
title: Threads Basics
description: Learn about Threads Basics in Java programming.
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

The idea of running multiple threads in a program can feel a bit like hosting a dinner party. You want everyone to have a good time, and that often means juggling multiple tasks at once. But just like with dinner guests, if you don’t manage them well, things can get chaotic.

Multithreading in Java offers a powerful way to manage concurrent tasks, but understanding the basics is crucial before diving into the more advanced topics.

# Understanding Threads

At its core, a **thread** is a lightweight process. It is a sequence of code that can be executed independently from other code, allowing your program to perform multiple operations simultaneously. This is particularly useful for tasks that are I/O-bound or require waiting, such as downloading files or querying databases.

### Why Use Threads?

Using threads can significantly improve the performance of your applications, especially when dealing with tasks that can run in parallel. Here are a few reasons to consider using threads:

*   **Improved performance**: By running tasks concurrently, you can utilize CPU resources more effectively.
*   **Responsiveness**: In GUI applications, threads can keep the interface responsive while performing background tasks.
*   **Resource sharing**: Threads share the same memory space, allowing them to communicate easily and efficiently.

However, with great power comes great responsibility. Multithreading can introduce complexity into your code, leading to potential issues like race conditions, deadlocks, or increased difficulty in debugging.

# Creating a Thread in Java

Before we delve deeper into how threads work, let’s discuss how to create them. In Java, there are two primary ways to create a thread: by extending the `Thread` class or by implementing the `Runnable` interface.

### Extending the Thread Class

When you extend the `Thread` class, you override its `run` method to define the code that will execute in the new thread.

### Implementing the Runnable Interface

Alternatively, you can implement the `Runnable` interface. This approach is often more flexible, as it allows your class to extend another class as well.

### Key Takeaways

*   The `start()` method is essential for beginning the execution of a thread. Calling `run()` directly will not create a new thread.
*   Remember to handle exceptions properly to prevent your thread from crashing silently.

# Thread States

Understanding the lifecycle of a thread can help you manage its execution better. A thread can be in one of several states:

1.  **New**: The thread is created but not yet started.
2.  **Runnable**: The thread is ready to run and waiting for CPU time.
3.  **Blocked**: The thread is blocked, waiting to acquire a lock or a resource.
4.  **Waiting**: The thread is waiting indefinitely for another thread to perform a particular action.
5.  **Timed Waiting**: The thread is waiting for a specified period.
6.  **Terminated**: The thread has completed execution.

### Example of Thread States

```java
public class MyThread extends Thread {
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println("Thread: " + i);
            try {
                Thread.sleep(500); // Pause for 500 milliseconds
            } catch (InterruptedException e) {
                System.out.println("Thread interrupted");
            }
        }
    }

    public static void main(String[] args) {
        MyThread thread = new MyThread();
        thread.start(); // Start the thread
    }
}
```


### Key Insights

By understanding the various states a thread can occupy, you can make more informed decisions about managing thread execution, especially when it comes to debugging and optimizing performance.

# Thread Scheduling

Java's thread scheduling strategy is typically preemptive, meaning the operating system decides which thread runs at any given time. This can lead to differences in how threads perform in different environments.

### Thread Priorities

Java allows you to set thread priorities using the `setPriority(int priority)` method, where priority ranges from `Thread.MIN_PRIORITY` (1) to `Thread.MAX_PRIORITY` (10). However, keep in mind that thread priority is more of a suggestion to the thread scheduler than a guarantee.

### Considerations for Thread Priorities

*   Not all JVM implementations respect thread priority. The behavior can vary between different platforms.
*   Relying on thread priorities can lead to unpredictable behavior, so it's often better to design your application to work well regardless of thread priority.

# Thread Safety and Best Practices

When multiple threads access shared resources, you run the risk of encountering issues such as data corruption or inconsistencies. This is where thread safety comes into play.

### Basic Principles of Thread Safety

1.  **Immutability**: If an object cannot change, it is inherently thread-safe. Consider using immutable classes or design your classes to be immutable.
2.  **Synchronization**: Use synchronization techniques to control access to shared resources. While this can slow down your program, it ensures that only one thread can modify a resource at a time.
3.  **Avoiding Shared State**: Wherever possible, avoid shared state between threads. If each thread can work with its own data, you reduce the complexity of your program.

### Example of Synchronization

```java
public class MyRunnable implements Runnable {
    public void run() {
        for (int i = 0; i < 5; i++) {
            System.out.println("Runnable: " + i);
            try {
                Thread.sleep(500); // Pause for 500 milliseconds
            } catch (InterruptedException e) {
                System.out.println("Runnable interrupted");
            }
        }
    }

    public static void main(String[] args) {
        Thread thread = new Thread(new MyRunnable());
        thread.start(); // Start the thread
    }
}
```


### Practical Tips for Thread Safety

*   Always think about how data is shared between threads.
*   Use higher-level concurrency mechanisms provided by the Java API to avoid common pitfalls.
*   Regularly review and test your code for thread safety.

# What's Next

Now that you understand the basics of threads—how to create them, their states, scheduling, and the importance of thread safety—you are well-prepared to delve into the next chapter.

In the following section, we will explore how to create threads in more detail, including the various techniques and best practices to do so effectively.

```java
public class ThreadStatesExample {
    public static void main(String[] args) {
        Thread t1 = new Thread(() -> {
            try {
                Thread.sleep(1000); // Timed Waiting
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });

        System.out.println("State of t1: " + t1.getState()); // New
        t1.start();
        System.out.println("State of t1: " + t1.getState()); // Runnable

        try {
            Thread.sleep(500); // Wait for a while
            System.out.println("State of t1: " + t1.getState()); // Runnable or Timed Waiting
            t1.join(); // Waiting for t1 to finish
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("State of t1: " + t1.getState()); // Terminated
    }
}
```


```java
public class ThreadPriorityExample {
    public static void main(String[] args) {
        Thread lowPriorityThread = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                System.out.println("Low Priority Thread: " + i);
            }
        });

        Thread highPriorityThread = new Thread(() -> {
            for (int i = 0; i < 5; i++) {
                System.out.println("High Priority Thread: " + i);
            }
        });

        lowPriorityThread.setPriority(Thread.MIN_PRIORITY);
        highPriorityThread.setPriority(Thread.MAX_PRIORITY);
        
        lowPriorityThread.start();
        highPriorityThread.start();
    }
}
```


```java
public class Counter {
    private int count = 0;

    public synchronized void increment() {
        count++;
    }

    public int getCount() {
        return count;
    }

    public static void main(String[] args) {
        Counter counter = new Counter();
        Thread t1 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                counter.increment();
            }
        });

        Thread t2 = new Thread(() -> {
            for (int i = 0; i < 1000; i++) {
                counter.increment();
            }
        });

        t1.start();
        t2.start();

        try {
            t1.join();
            t2.join();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        System.out.println("Final Count: " + counter.getCount()); // Should be 2000
    }
}
```
