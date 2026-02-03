---
title: "Composing Objects"
description: "This lesson explains Composing Objects in simple terms and shows how it helps you design clear, testable code."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)


### Introduction: Understanding Object Relationships in Software Design

In object-oriented programming (OOP), a foundational concept is how objects relate to one another. This chapter delves into a critical design principle known as **"Favor Composition over Inheritance."** At the core of this discussion are two fundamental types of relationships between objects: the **"is-a"** relationship created by inheritance, and the **"has-a"** relationship created by composition. These concepts influence how software systems are structured, impacting their flexibility, maintainability, and robustness.

The principle's significance lies in guiding developers to avoid common pitfalls that arise from misusing inheritance. Instead, it advocates for building complex objects by composing smaller, independent components. This approach mirrors real-world composition, where objects are assembled from parts rather than inheriting traits inappropriately. Key terms such as **inheritance**, **composition**, **is-a relationship**, and **has-a relationship** will be explored throughout this chapter to clarify their roles and implications in software design.

### The Pitfall of Misusing Inheritance: The "Is-A" Relationship

A natural but flawed instinct for beginners is to use inheritance to model relationships where it does not semantically apply. For example, when designing a software model for a car, one might incorrectly make the `Car` class inherit from the `Engine` class because a car "needs" an engine to function.

- **Incorrect Code Example:**  
  ```java
  class Engine {
      public void start() { /* ... */ }
      public void stop() { /* ... */ }
  }

  class Car extends Engine { // A Car "is-an" Engine? No!
      // Car-specific properties
  }
  ```
- This design falsely implies that a **Car "is-an" Engine**, which is semantically incorrect.
- Inheritance implies a subtype relationship, meaning the subclass should be a specialized form of the superclass.
- Misapplication leads to code that is **rigid**, **fragile**, and **hard to maintain** because the hierarchy forces unnatural coupling.

The takeaway here is that inheritance should only be used when one class truly **is a** subtype of another, sharing a consistent interface and behavior in a hierarchy.

### Embracing Composition: The "Has-A" Relationship

In contrast, composition models a **"has-a"** relationship, where an object contains or is composed of other objects that provide specific functionality.

- For the car example, instead of inheritance, the `Car` class should **contain** an `Engine` object:
  ```java
  class Engine {
      public void start() { /* ... */ }
      public void stop() { /* ... */ }
  }

  class Car {
      private Engine engine;

      public Car() {
          this.engine = new Engine();
      }

      public void startCar() {
          engine.start();
      }

      // Other car-specific methods
  }
  ```
- This design correctly models that a **Car has an Engine**.
- Composition encourages **building complex objects** by assembling smaller, independent, and interchangeable parts.
- It promotes **flexibility**, allowing parts to be swapped or modified without affecting the whole system.
- This modularity makes the system **more maintainable** and **less prone to errors** when requirements change.

The metaphor of **building with LEGO blocks** is apt here: each block is a self-contained unit, and by combining them, one creates complex structures that can be easily modified.

### Comparing Inheritance and Composition: Strengths and Weaknesses

Understanding when to use inheritance or composition is crucial for clean code design. Each has its strengths and pitfalls:

- **Inheritance (Is-A Relationship):**
  - Creates a clear subtype hierarchy.
  - Facilitates polymorphism by sharing behavior and interface.
  - However, it creates **tight coupling** between superclass and subclass.
  - Changes in the superclass often ripple through subclasses.
  - Inheritance hierarchies can become **deep and complex**, leading to fragile code.
  - Not suitable for all relationships, especially when the subclass is not truly a specialized form of the superclass.

- **Composition (Has-A Relationship):**
  - Promotes loose coupling between components.
  - Enables **better encapsulation** by hiding component details.
  - Supports **flexibility** by allowing dynamic changes to the parts of an object.
  - Easier to test individual components in isolation.
  - Encourages **reuse of components** in different contexts.
  - Can lead to more straightforward and robust system architecture.

### Real-World Analogies and Implications

The distinction between "is-a" and "has-a" relationships extends beyond programming into everyday understanding:

- A **car is not an engine**, but a car **has an engine**.
- This linguistic distinction helps programmers model relationships more naturally and intuitively.
- Misinterpreting these relationships leads to poor design decisions that complicate software systems unnecessarily.

By applying composition, developers mimic how real-world objects are constructed, resulting in software that is easier to extend and understand.

### Opinions and Arguments Supporting Composition

The text argues strongly in favor of composition as the superior approach for many design scenarios:

- Composition is described as **more powerful and flexible** than inheritance.
- The "simple act of 'having'" is often a better abstraction than "being" something else.
- The argument is supported by the assertion that inheritance misuse results in **rigid, fragile, and tangled systems**.
- Composition, by contrast, offers **independence** and **interchangeability**, qualities essential for scalable and maintainable software.
- This viewpoint is rooted in practical experience and best practices in object-oriented design.

### Conclusion: Key Takeaways and Design Implications

In summary, this chapter emphasizes the importance of correctly modeling object relationships in software design. The main lessons are:

- **Inheritance should be used to express true "is-a" relationships** where subclassing logically fits a hierarchical model.
- **Composition should be favored when modeling "has-a" relationships**, allowing objects to be built from smaller, modular parts.
- Favoring composition leads to **flexible, maintainable, and robust software systems**.
- Misusing inheritance causes unnecessary complexity and tightly coupled code, which is harder to evolve.
- The analogy of LEGO blocks helps visualize how composition fosters modular design.
- Recognizing these principles is essential for developers aiming to create clean, scalable object-oriented software.

By internalizing the **Composing Objects Principle**, programmers can avoid common design pitfalls and craft systems that better mirror the complexity and modularity of the real world.


### Advanced Bullet-Point Summary

- **Introduction:**
  - Object-oriented design depends on understanding relationships between objects.
  - Two key relationships: **inheritance ("is-a")** and **composition ("has-a")**.
  - Principle: Favor composition over inheritance for flexible and maintainable design.

- **Inheritance and Its Misuse:**
  - Inheritance defines a subtype hierarchy ("is-a").
  - Incorrect example: `Car` inheriting from `Engine` (a car is not an engine).
  - Misuse leads to rigid and fragile systems.
  - Should only be used when subclass is a true specialized form of superclass.

- **Composition and Its Advantages:**
  - Composition defines a "has-a" relationship: objects contain other objects.
  - Example: `Car` has an `Engine` object.
  - Enables building complex objects from smaller, interchangeable parts.
  - Promotes flexibility, modularity, and encapsulation.
  - Easier to maintain and adapt to changes.

- **Comparison Between Inheritance and Composition:**
  - Inheritance: tight coupling, complex hierarchies, fragile code.
  - Composition: loose coupling, modular, flexible, reusable components.

- **Real-World Analogies:**
  - Linguistic clarity: a car "has an" engine, not "is an" engine.
  - Helps programmers model relationships naturally.

- **Supporting Opinions:**
  - Composition is more powerful and flexible.
  - Avoid tangled systems by favoring composition.
  - Practical experience supports the principle.

- **Conclusion:**
  - Use inheritance only for true "is-a" relationships.
  - Favor composition to build modular, adaptable systems.
  - Leads to better software design aligned with real-world object modeling.
  - The composing objects principle is essential for robust OOP.

This detailed exploration clarifies why composition is often the superior choice in object-oriented design, offering a pathway to cleaner, more robust software architecture.
