---
title: "Observer Design Pattern"
description: "Learn how the Observer Design Pattern creates scalable, loosely coupled systems to manage dynamic updates in event-driven apps like a fitness tracker."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

## Mastering the Observer Pattern for Scalable Fitness Apps

![Smart Watch](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)

### Introduction to the Observer Design Pattern

The **Observer Design Pattern** is a behavioral design pattern that establishes a **one-to-many dependency** between objects. When one object, known as the **subject**, changes its state, **all dependent objects (observers) are automatically notified and updated**. This pattern is essential in applications where multiple components need to respond dynamically to changes in a central data source, enabling a flexible and decoupled architecture.

#### Why Use the Observer Pattern?

- Enables multiple parts of a system to react to changes in a central component.
- Decouples data publishers from subscribers, promoting modularity.
- Supports dynamic subscription/unsubscription of observers at runtime.
- Avoids hardcoding dependencies, adhering to the Open/Closed Principle.

![Smart Watch](https://res.cloudinary.com/duojkrgue/image/upload/v1770791989/Portfolio/lldSystemDesign/img/3736f90a-3b53-40de-a659-26c45e460368.png)

This pattern shines in scenarios where:

*   You have multiple parts of the system that need to react to a change in one central component.
*   You want to decouple the publisher of data from the subscribers who react to it.
*   You need a dynamic, event-driven communication model without hardcoding who is listening to whom.

A straightforward approach is to directly call update methods on other objects whenever something changes. For example, a `NewsPublisher` might call `update()` on a `MobileApp`, `EmailService`, and `WebsiteFeed` every time a new article is published.

But as the number of subscribers grows, this approach becomes rigid, **hard to scale**, and **violates the Open/Closed Principle.** Adding or removing subscribers requires modifying the publisher class. It also tightly couples the publisher to all its subscribers.

The **Observer Pattern** solves this by **decoupling the subject and its observers**, allowing them to interact through a common interface. Observers can be **added or removed at runtime**, and the subject doesn’t need to know who they are.

Let’s walk through a real-world example to see how we can apply the Observer Pattern to build a **flexible, extensible, and loosely coupled notification system** that’s perfect for event-driven applications.


### The Challenge: Broadcasting Fitness Data in a Tracker App

Imagine building a **Fitness Tracker App** connecting to a wearable device streaming real-time fitness metrics such as steps, active minutes, and calories burned. The data is managed by a central `FitnessData` object.

![Smart Watch](https://res.cloudinary.com/duojkrgue/image/upload/v1770792030/Portfolio/lldSystemDesign/img/2fc4e11f-323e-4846-a285-bfa9c90b6b01.png)

Multiple app modules rely on this data:

![Smart Watch](https://res.cloudinary.com/duojkrgue/image/upload/v1770792059/Portfolio/lldSystemDesign/img/ff1064e2-1b54-45e4-a214-b2c18619f232.png)

| Module               | Responsibility                          |
|----------------------|---------------------------------------|
| **LiveActivityDisplay** | Displays real-time fitness stats       |
| **ProgressLogger**      | Logs data for trend analysis            |
| **GoalNotifier**        | Sends alerts when goals are achieved   |

#### The Naive Approach: Tight Coupling and Limitations

In a straightforward implementation, the `FitnessData` object holds direct references to all dependent modules and manually calls their update methods whenever new data arrives.

```java
class FitnessDataNaive {
    private int steps, activeMinutes, calories;

    private LiveActivityDisplayNaive liveDisplay = new LiveActivityDisplayNaive();
    private ProgressLoggerNaive progressLogger = new ProgressLoggerNaive();
    private NotificationServiceNaive notificationService = new NotificationServiceNaive();

    public void newFitnessDataPushed(int newSteps, int newActiveMinutes, int newCalories) {
        this.steps = newSteps;
        this.activeMinutes = newActiveMinutes;
        this.calories = newCalories;

        liveDisplay.showStats(steps, activeMinutes, calories);
        progressLogger.logDataPoint(steps, activeMinutes, calories);
        notificationService.checkAndNotify(steps);
    }
}
```

###### Problems with This Design:

This works initially, but let us think about what happens as the application grows.

### Problems with This Approach

#### 1\. Tight Coupling

The `FitnessData` class now has intimate knowledge of every module that cares about its data. It holds direct references to `LiveActivityDisplay`, `ProgressLogger`, and `NotificationService`.

If any of these classes change their interface, or if you want to replace one with a different implementation, you must modify `FitnessData`.

#### 2\. Violates the Open/Closed Principle

What happens when you want to add a `WeeklySummaryGenerator`? Or a `SocialSharingService` that posts achievements to social media?

Each new feature requires you to:

*   Add a new field to `FitnessData`
*   Modify the `newFitnessDataPushed()` method
*   Potentially update the constructor

The class is open for modification when it should be closed.

#### 3\. Inflexible and Static Design

Modules like the `NotificationService` or `ProgressLogger` can’t be **added or removed at runtime**. What if the user disables notifications in their settings?

You’ll need to add even more conditionals to manually enable/disable parts of the code — making things fragile and error-prone.

#### 4\. Responsibility Bloat

The `FitnessData` class should have one job: managing fitness metrics. Instead, it is now responsible for UI updates, database logging, and notification logic. This violates the Single Responsibility Principle and makes the class difficult to test in isolation.

#### 5\. Scalability Bottlenecks

As the number of dependents grows, `newFitnessDataPushed()` becomes a lengthy sequence of method calls, each potentially with different parameters and error handling requirements. The method becomes a bottleneck that every developer must understand and modify.

### What We Really Need

We need a better, scalable way to solve this problem, something that allows:

*   `FitnessData` to **broadcast changes to multiple listeners**, without knowing who they are
*   Each module to **subscribe or unsubscribe dynamically**
*   Loose coupling between the subject and observers
*   Each module to **decide for itself how to respond** to changes

This is exactly what the **Observer pattern** provides.

This pattern shines in scenarios where:

*   You have multiple parts of the system that need to react to a change in one central component.
*   You want to decouple the publisher of data from the subscribers who react to it.
*   You need a dynamic, event-driven communication model without hardcoding who is listening to whom.

A straightforward approach is to directly call update methods on other objects whenever something changes. For example, a `NewsPublisher` might call `update()` on a `MobileApp`, `EmailService`, and `WebsiteFeed` every time a new article is published.

But as the number of subscribers grows, this approach becomes rigid, **hard to scale**, and **violates the Open/Closed Principle.** Adding or removing subscribers requires modifying the publisher class. It also tightly couples the publisher to all its subscribers.

The **Observer Pattern** solves this by **decoupling the subject and its observers**, allowing them to interact through a common interface. Observers can be **added or removed at runtime**, and the subject doesn’t need to know who they are.

Let’s walk through a real-world example to see how we can apply the Observer Pattern to build a **flexible, extensible, and loosely coupled notification system** that’s perfect for event-driven applications.


### The Observer Pattern: A Scalable Solution

The Observer Pattern solves these challenges by decoupling the subject from its observers. It enables:

- **Broadcasting changes** to multiple observers without knowing their identities.
- **Dynamic subscription management** — observers can register or unregister anytime.
- **Separation of concerns**, allowing each observer to handle updates independently.

#### Core Components of the Observer Pattern

1. **Subject Interface** — Defines methods to register, remove, and notify observers.
2. **Observer Interface** — Declares an `update()` method that observers implement.
3. **ConcreteSubject** — Maintains state and notifies observers on changes.
4. **ConcreteObservers** — Implement custom update logic based on subject state.


This pattern shines in scenarios where:

*   You have multiple parts of the system that need to react to a change in one central component.
*   You want to decouple the publisher of data from the subscribers who react to it.
*   You need a dynamic, event-driven communication model without hardcoding who is listening to whom.

But as the number of subscribers grows, this approach becomes rigid, **hard to scale**, and **violates the Open/Closed Principle.** Adding or removing subscribers requires modifying the publisher class. It also tightly couples the publisher to all its subscribers.

The **Observer Pattern** solves this by **decoupling the subject and its observers**, allowing them to interact through a common interface. Observers can be **added or removed at runtime**, and the subject doesn’t need to know who they are.

Let’s walk through a real-world example to see how we can apply the Observer Pattern to build a **flexible, extensible, and loosely coupled notification system** that’s perfect for event-driven applications.

> The **Observer Design Pattern** provides a clean and flexible solution to the problem of broadcasting changes from one central object (the **Subject**) to many dependent objects (the **Observers**) — all while keeping them **loosely coupled**.

In our **Fitness Tracker App**, the Observer Pattern allows the `FitnessData` object to notify all registered modules (like `LiveActivityDisplay`, `ProgressLogger`, and `GoalNotifier`) **automatically whenever new fitness data is received** — without needing to know what those modules are or how they respond.

### Class Diagram

![Observer Class Diagram](https://res.cloudinary.com/duojkrgue/image/upload/v1770792074/Portfolio/lldSystemDesign/img/27b33319-c639-4265-a164-a059cda65370.png)

A straightforward approach is to directly call update methods on other objects whenever something changes. For example, a `NewsPublisher` might call `update()` on a `MobileApp`, `EmailService`, and `WebsiteFeed` every time a new article is published.


#### 1\. Observer Interface (e.g., `FitnessDataObserver`)

*   Declares an `update()` method.
*   All modules that want to **listen to fitness data changes** will implement this interface.
*   Each observer defines its own logic inside `update()` to respond to updates.

#### 2\. Subject Interface (e.g., `FitnessDataSubject`)

Declares methods to:

*   `registerObserver()` – subscribe to updates
*   `removeObserver()` – unsubscribe from updates
*   `notifyObservers()` – notify all current observers of a change

The subject doesn't care **who** the observers are — it just sends updates.

#### 3\. ConcreteSubject (e.g., `FitnessData`)

*   Implements `FitnessDataSubject`.
*   Maintains an internal list of `FitnessDataObserver` objects.
*   When new data is pushed, it updates its internal state and calls `notifyObservers()` to broadcast the change.

#### 4\. ConcreteObservers (e.g., `LiveActivityDisplay`)

*   Implement the `FitnessDataObserver` interface.
*   When `update()` is called, each observer **pulls relevant data** from the subject and performs its own logic (e.g., update UI, log progress, send alerts).

# 3\. Implementing Observer Pattern

Let’s refactor our fitness tracker system using the **Observer Pattern**.


### Implementing the Observer Pattern in a Fitness Tracker

#### Step 1: Define the Observer Interface

```java
interface FitnessDataObserver {
    void update(FitnessData data);
}
```

Observers receive a reference to the subject, enabling them to pull data as needed.

#### Step 2: Define the Subject Interface

```java
interface FitnessDataSubject {
    void registerObserver(FitnessDataObserver observer);
    void removeObserver(FitnessDataObserver observer);
    void notifyObservers();
}
```

This interface lets the subject manage its observers without knowing details about them.

#### Step 3: Implement the ConcreteSubject: `FitnessData`

```java
public class FitnessData implements FitnessDataSubject {
    private int steps, activeMinutes, calories;
    private final List<FitnessDataObserver> observers = new ArrayList<>();

    @Override
    public void registerObserver(FitnessDataObserver observer) {
        observers.add(observer);
    }

    @Override
    public void removeObserver(FitnessDataObserver observer) {
        observers.remove(observer);
    }

    @Override
    public void notifyObservers() {
        for (FitnessDataObserver observer : observers) {
            observer.update(this);
        }
    }

    public void newFitnessDataPushed(int steps, int activeMinutes, int calories) {
        this.steps = steps;
        this.activeMinutes = activeMinutes;
        this.calories = calories;
        System.out.println("\nFitnessData: New data received – Steps: " + steps +
            ", Active Minutes: " + activeMinutes + ", Calories: " + calories);
        notifyObservers();
    }

    public void dailyReset() {
        this.steps = 0;
        this.activeMinutes = 0;
        this.calories = 0;
        System.out.println("\nFitnessData: Daily reset performed.");
        notifyObservers();
    }

    // Getters for observers
    public int getSteps() { return steps; }
    public int getActiveMinutes() { return activeMinutes; }
    public int getCalories() { return calories; }
}
```

#### Step 4: Implement Concrete Observers

###### LiveActivityDisplay

```java
class LiveActivityDisplay implements FitnessDataObserver {
    @Override
    public void update(FitnessData data) {
        System.out.println("Live Display → Steps: " + data.getSteps() +
            " | Active Minutes: " + data.getActiveMinutes() +
            " | Calories: " + data.getCalories());
    }
}
```

###### ProgressLogger

```java
class ProgressLogger implements FitnessDataObserver {
    @Override
    public void update(FitnessData data) {
        System.out.println("Logger → Saving to DB: Steps=" + data.getSteps() +
            ", ActiveMinutes=" + data.getActiveMinutes() +
            ", Calories=" + data.getCalories());
        // Simulate DB write here...
    }
}
```

###### GoalNotifier

```java
class GoalNotifier implements FitnessDataObserver {
    private final int stepGoal = 10000;
    private boolean goalReached = false;

    @Override
    public void update(FitnessData data) {
        if (data.getSteps() >= stepGoal && !goalReached) {
            System.out.println("Notifier → 🎉 Goal Reached! You've hit " + stepGoal + " steps!");
            goalReached = true;
        }
    }

    public void reset() {
        goalReached = false;
    }
}
```

#### Step 5: Client Code to Demonstrate the Pattern

```java
public class FitnessAppObserverDemo {
    public static void main(String[] args) {
        FitnessData fitnessData = new FitnessData();

        LiveActivityDisplay display = new LiveActivityDisplay();
        ProgressLogger logger = new ProgressLogger();
        GoalNotifier notifier = new GoalNotifier();

        // Register observers
        fitnessData.registerObserver(display);
        fitnessData.registerObserver(logger);
        fitnessData.registerObserver(notifier);

        // Simulate fitness data updates
        fitnessData.newFitnessDataPushed(500, 5, 20);
        fitnessData.newFitnessDataPushed(9800, 85, 350);
        fitnessData.newFitnessDataPushed(10100, 90, 380); // Goal notification triggered

        // Reset daily data and notifier state
        notifier.reset();
        fitnessData.dailyReset();
    }
}
```


This pattern shines in scenarios where:

*   You have multiple parts of the system that need to react to a change in one central component.
*   You want to decouple the publisher of data from the subscribers who react to it.
*   You need a dynamic, event-driven communication model without hardcoding who is listening to whom.

A straightforward approach is to directly call update methods on other objects whenever something changes. For example, a `NewsPublisher` might call `update()` on a `MobileApp`, `EmailService`, and `WebsiteFeed` every time a new article is published.

But as the number of subscribers grows, this approach becomes rigid, **hard to scale**, and **violates the Open/Closed Principle.** Adding or removing subscribers requires modifying the publisher class. It also tightly couples the publisher to all its subscribers.

The **Observer Pattern** solves this by **decoupling the subject and its observers**, allowing them to interact through a common interface. Observers can be **added or removed at runtime**, and the subject doesn’t need to know who they are.

Let’s walk through a real-world example to see how we can apply the Observer Pattern to build a **flexible, extensible, and loosely coupled notification system** that’s perfect for event-driven applications.


### Benefits of Using the Observer Pattern

- **Loose Coupling:** The subject only knows it has observers, not their details.
- **Extensibility:** New observers can be added without modifying the subject.
- **Runtime Flexibility:** Observers can subscribe or unsubscribe dynamically, e.g., based on user preferences.
- **Single Responsibility:** Each observer manages its own update logic independently.
- **Scalability:** The system gracefully handles more observers without bloating the subject.


This pattern shines in scenarios where:

*   You have multiple parts of the system that need to react to a change in one central component.
*   You want to decouple the publisher of data from the subscribers who react to it.
*   You need a dynamic, event-driven communication model without hardcoding who is listening to whom.

A straightforward approach is to directly call update methods on other objects whenever something changes. For example, a `NewsPublisher` might call `update()` on a `MobileApp`, `EmailService`, and `WebsiteFeed` every time a new article is published.

But as the number of subscribers grows, this approach becomes rigid, **hard to scale**, and **violates the Open/Closed Principle.** Adding or removing subscribers requires modifying the publisher class. It also tightly couples the publisher to all its subscribers.

The **Observer Pattern** solves this by **decoupling the subject and its observers**, allowing them to interact through a common interface. Observers can be **added or removed at runtime**, and the subject doesn’t need to know who they are.

Let’s walk through a real-world example to see how we can apply the Observer Pattern to build a **flexible, extensible, and loosely coupled notification system** that’s perfect for event-driven applications.


### When to Use the Observer Pattern

Use the Observer Pattern when:

- Multiple components must reflect changes in a central data source.
- You want to minimize dependencies between the data source and its consumers.
- Dynamic subscription and unsubscription of listeners is required.
- An event-driven or reactive programming model suits the application.


This pattern shines in scenarios where:

*   You have multiple parts of the system that need to react to a change in one central component.
*   You want to decouple the publisher of data from the subscribers who react to it.
*   You need a dynamic, event-driven communication model without hardcoding who is listening to whom.

A straightforward approach is to directly call update methods on other objects whenever something changes. For example, a `NewsPublisher` might call `update()` on a `MobileApp`, `EmailService`, and `WebsiteFeed` every time a new article is published.

But as the number of subscribers grows, this approach becomes rigid, **hard to scale**, and **violates the Open/Closed Principle.** Adding or removing subscribers requires modifying the publisher class. It also tightly couples the publisher to all its subscribers.

The **Observer Pattern** solves this by **decoupling the subject and its observers**, allowing them to interact through a common interface. Observers can be **added or removed at runtime**, and the subject doesn’t need to know who they are.

Let’s walk through a real-world example to see how we can apply the Observer Pattern to build a **flexible, extensible, and loosely coupled notification system** that’s perfect for event-driven applications.


### Summary

The Observer Design Pattern is a powerful tool to build scalable, maintainable, and loosely coupled systems—especially in event-driven applications like fitness trackers. By decoupling the subject from its observers, it supports dynamic, extensible, and cleanly separated codebases, making your software easier to evolve and maintain.


This pattern shines in scenarios where:

*   You have multiple parts of the system that need to react to a change in one central component.
*   You want to decouple the publisher of data from the subscribers who react to it.
*   You need a dynamic, event-driven communication model without hardcoding who is listening to whom.

A straightforward approach is to directly call update methods on other objects whenever something changes. For example, a `NewsPublisher` might call `update()` on a `MobileApp`, `EmailService`, and `WebsiteFeed` every time a new article is published.

But as the number of subscribers grows, this approach becomes rigid, **hard to scale**, and **violates the Open/Closed Principle.** Adding or removing subscribers requires modifying the publisher class. It also tightly couples the publisher to all its subscribers.

The **Observer Pattern** solves this by **decoupling the subject and its observers**, allowing them to interact through a common interface. Observers can be **added or removed at runtime**, and the subject doesn’t need to know who they are.

Let’s walk through a real-world example to see how we can apply the Observer Pattern to build a **flexible, extensible, and loosely coupled notification system** that’s perfect for event-driven applications.


### Frequently Asked Questions (FAQ)

**Q1: How does the Observer Pattern differ from a simple callback?**  
A: While callbacks are usually one-to-one and tightly coupled, the Observer Pattern supports one-to-many relationships and decouples the subject and observers via interfaces.

**Q2: Can observers pull data from the subject?**  
A: Yes, observers receive a reference to the subject and can pull only the data they need, keeping the interface flexible.

**Q3: What if an observer fails during update?**  
A: Typically, error handling inside `notifyObservers()` or within each observer's `update()` method ensures one failing observer doesn’t break others.

**Q4: Is the Observer Pattern suitable for multithreaded environments?**  
A: Yes, but you must synchronize access to the observer list and state updates to avoid concurrency issues.


By mastering the Observer Pattern, you unlock the ability to design reactive, modular applications that scale gracefully—key for modern software development.


## Mind Map

![Mind Map](https://res.cloudinary.com/duojkrgue/image/upload/v1770792307/Portfolio/lldSystemDesign/img/NoteGPT_MindMap_1770792283517_wjivs1.png)