---
title: "Inheritance"
description: "This lesson explains Inheritance in simple terms and shows how it helps you design clear, testable code."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)

### Introduction: The Essence and Significance of Inheritance

Inheritance is a fundamental concept in **Object-Oriented Programming (OOP)** that enables a class—referred to as the **subclass** or **child class**—to acquire properties and behaviors from another class known as the **superclass** or **parent class**. At its core, inheritance facilitates **code reuse** by allowing developers to define common functionality in a base class and then extend or specialize it across multiple derived classes. This leads to software that is cleaner, more modular, and easier to maintain.

Key vocabulary includes:

- **Inheritance**: The mechanism by which one class inherits attributes and methods from another.
- **Subclass/Child class**: The class that inherits from another class.
- **Superclass/Parent class**: The class whose behaviors and properties are inherited.
- **Polymorphism**: The ability of different subclasses to be treated as instances of the superclass, often enabling method overriding.

The significance of inheritance lies not only in reusing code but also in modeling real-world relationships logically and hierarchically, facilitating maintainability and extensibility of software systems.


### The Core Concept of Inheritance

- Inheritance allows the subclass to **inherit all non-private fields and methods** of the superclass.
- Subclasses can **override** inherited methods to provide their own specific implementations.
- Subclasses can also **extend** the superclass by adding new fields and behaviors.
- This dual capability supports both **reuse** and **customization**, essential for flexible software design.

#### Real-World Analogy: User System in Web Applications

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770056994/Portfolio/lldSystemDesign/img/78e27e33-15f6-4e94-9265-86bc5bbea66b.png)

- A base **User** class contains common attributes such as *username* and *email*, along with methods like *login()* and *logout()*.
- Specialized subclasses such as **Admin**, **Customer**, and **Vendor** inherit from User but add role-specific behaviors.
- This analogy illustrates how inheritance models **"is-a"** relationships and organizes code logically.


### Why Inheritance Matters: Benefits and Design Advantages

1. **Code Reusability**  
   - Inheritance embodies the **DRY (Don't Repeat Yourself)** principle by centralizing common logic in a single superclass.
   - This reduces redundancy and promotes consistency across subclasses.

2. **Logical Hierarchy**  
   - It creates an intuitive structure reflecting real-world **"is-a"** relationships (e.g., *ElectricCar is a Car*, *Admin is a User*).
   - This hierarchy enhances code readability and conceptual clarity.

3. **Ease of Maintenance**  
   - Fixes or changes in shared behavior need to be applied only once in the superclass.
   - All subclasses inherit these improvements automatically, preventing duplication of effort.

4. **Polymorphism**  
   - Inheritance is a prerequisite for polymorphism, which allows objects of different subclasses to be treated uniformly as superclass instances.
   - This supports flexible and elegant code design, as discussed further in later chapters.


### How Inheritance Works: Detailed Mechanics

- The subclass inherits all accessible fields and methods (except private ones).
- It can **override** methods to change behavior while preserving the interface.
- It can **add new methods and fields** to extend functionality beyond what is defined in the superclass.



#### Code Example: Car Hierarchy

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770057024/Portfolio/lldSystemDesign/img/0c3d8d12-a138-40e2-b223-93a4fcb4077f.png)

```java

class Car {
    protected String make;
    protected String model;

    public void startEngine() {
        System.out.println("Engine started");
    }

    public void stopEngine() {
        System.out.println("Engine stopped");
    }
}

```

- The base `Car` class includes attributes like `make` and `model`, and methods such as `startEngine()` and `stopEngine()`.

```java
class ElectricCar extends Car {
    public void chargeBattery() {
        System.out.println("Battery charging");
    }
}

class GasCar extends Car {
    public void fillTank() {
        System.out.println("Filling gas tank");
    }
}
```
- Subclasses `ElectricCar` and `GasCar` extend `Car`, inheriting these attributes and behaviors, and add specialized methods (`chargeBattery()` for ElectricCar and `fillTank()` for GasCar).
- This example models a real-world hierarchy, demonstrating inheritance’s practicality in software design.
- Each subclass adds behavior specific to its type.
- This structure mirrors the real-world relationship: an electric car is a car, and so is a gas car.


### Appropriate Use Cases for Inheritance

Inheritance should be **used intentionally** and only when it models a clear **"is-a"** relationship.

**Use inheritance when:**

- There is a logical **"is-a"** relationship (e.g., *Dog is an Animal*, *Car is a Vehicle*).
- The parent class defines common behavior or data to be shared.
- The child class does not violate the parent’s expected behavior.
- You want to promote code reuse and a shared structure.

**Avoid inheritance when:**

- The relationship is more accurately described as **"has-a"** or **"uses-a"** (e.g., a *Car has an Engine*, not *is an Engine*).
- You need **dynamic behavior changes** at runtime.
- You want to avoid tight coupling between child and parent classes.
- You want to combine behaviors flexibly without rigid hierarchies.

In such cases, **composition**—where classes contain instances of other classes—is usually a superior design choice.


### Use Inheritance with Caution: Common Pitfalls

While inheritance is powerful, **overuse or misuse** can lead to fragile and complex designs:

- **Misusing inheritance for code reuse:** Inheriting from a class solely to reuse code without a true **"is-a"** relationship results in poor, hard-to-maintain designs.
- **Deep inheritance chains:** Long, complex hierarchies increase difficulty in understanding, debugging, and modifying code.
- **Tight coupling:** Subclasses overly dependent on parent class internals make future changes risky and error-prone.

Modern OOP design often **favors composition over inheritance** to achieve better modularity, flexibility, and maintainability.


### Inheritance vs. Composition: Comparing Design Strategies

| Aspect          | Inheritance                          | Composition                                   |
|-----------------|------------------------------------|-----------------------------------------------|
| Relationship    | “is-a”                             | “has-a” or “uses-a”                           |
| Coupling        | Tightly coupled                    | Loosely coupled                               |
| Flexibility     | Compile-time (fixed)               | Runtime (dynamic)                             |
| Best for        | Shared logic and hierarchy         | Reusable, pluggable components                |
| Example         | Car extends Vehicle                | Car has Engine                                |

#### Example of Composition Over Inheritance

Instead of:

```java
class Printer extends Logger {
    // bad inheritance for reusing log() method
}
```

Use:

```java
class Printer {
    private Logger logger;

    public Printer(Logger logger) {
        this.logger = logger;
    }

    public void print(String message) {
        logger.log("Printing: " + message);
    }
}
```

Here, `Printer` **has a** `Logger`, promoting modularity, loose coupling, and testability.


### Conclusion: Key Takeaways and Implications

Inheritance is a cornerstone of **object-oriented design** that enables code reuse, logical structuring of class hierarchies, and supports **polymorphism**. When properly applied, it reduces redundancy, simplifies maintenance, and models real-world relationships naturally.

However, inheritance must be used **judiciously**—only when a clear **"is-a"** relationship exists. Misapplication can cause brittle, inflexible systems. To avoid these issues, many modern designs prefer **composition**, which encourages loose coupling and runtime flexibility.

Understanding inheritance, its benefits, limitations, and alternatives like composition equips developers to create more robust, maintainable, and scalable software systems. As this chapter concludes, the next logical step is to explore **polymorphism**, which leverages inheritance to handle multiple implementations via a unified interface, enhancing code flexibility and elegance in object-oriented programming.