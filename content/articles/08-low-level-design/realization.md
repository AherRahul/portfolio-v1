---
title: "Realization"
description: "This lesson explains Realization in simple terms and shows how it helps you design clear, testable code."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)


### Introduction: The Significance of Realization in Payment System Design

In designing complex software systems, such as a **payment system** supporting multiple methods—credit card, PayPal, bank transfer, and cryptocurrency—developers face the challenge of managing diverse behaviors under a unified structure. Each payment method processes transactions differently but must adhere to a common **contract**: accepting an amount and returning a result. This scenario highlights a fundamental concept in object-oriented design known as **Realization**.

**Realization** is the relationship that models how a class fulfills a contract defined by an **interface** or an **abstract class**. It is an essential mechanism to ensure disparate classes adhere to the same expected behaviors without dictating how those behaviors are implemented. This chapter explores the concept of Realization in depth—its meaning, representation in UML (Unified Modeling Language), practical distinctions from inheritance, and real-world analogies—all crucial for designing flexible, maintainable systems.


### 1. What is Realization? The Contract-Fulfillment Relationship

At its core, **Realization** represents a **contract fulfillment** relationship between an interface and a class implementing it. An interface declares a set of methods—effectively a promise that any implementing class must fulfill by providing concrete behaviors.

- **Interface defines the contract:** Specifies *what* methods must exist.
- **Implementing class fulfills the contract:** Provides *how* those methods work.
- The implementing class *must* provide implementations for *all* interface methods.
- Multiple classes can realize (implement) the same interface differently, allowing diverse behaviors under a common contract.

**Real-world analogy:** Consider a job description as an interface. It lists required skills and responsibilities. Different employees (classes) can fulfill that job description uniquely but still meet all requirements.

**Key points:**

- Realization models a *promise* rather than inheritance of state or identity.
- It supports polymorphism—clients rely on the contract, not the specific implementation.
- Enables decoupling and flexibility in system design.


### 2. UML Representation of Realization

Understanding how to visualize Realization in UML diagrams is vital for clear communication among developers and stakeholders.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770130907/Portfolio/lldSystemDesign/img/891f04d5-057a-4816-baca-e38ad734ea1d.png)

- Realization is depicted by a **dashed line** with a **hollow (unfilled) triangle** pointing toward the interface.
- This contrasts with **inheritance**, which uses a **solid line** with a hollow triangle.
- The dashed line metaphorically suggests a *promise* or *contract* rather than a direct descent or structural inheritance.

**Example:**

- A class named `CreditCardPayment` realizes an interface `PaymentMethod`.
- The diagram shows a dashed line from `CreditCardPayment` to `PaymentMethod`, marking the contract fulfillment.

**Additional notes:**


![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770130931/Portfolio/lldSystemDesign/img/9b33611a-6d60-4dc1-a841-bacd219521b6.png)

- A class can implement **multiple interfaces**, gaining multiple capabilities.
- For instance, a `FileHandler` class may realize `Readable`, `Writable`, and `Closable` interfaces, each representing a distinct focused capability.


### 3. Realization vs. Inheritance: Distinguishing Identity from Capability

While both Realization and inheritance establish relationships between classes, their purposes and implications differ significantly.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770130950/Portfolio/lldSystemDesign/img/6a1aca94-accf-493c-99c3-7f0ffdcc4fa0.png)


| Aspect                | Inheritance                          | Realization (Interfaces)              |
|-----------------------|------------------------------------|-------------------------------------|
| Relationship Type     | Models **identity** (is-a)          | Models **capability** (can-do)       |
| Example               | Dog **is an** Animal                 | Bird **can** fly, Airplane **can** fly |
| Connection            | Between related classes sharing state and behavior | Between unrelated classes sharing behavior |
| Use Case              | When child classes specialize parent behavior and state | When unrelated classes share functionality contracts |
| Implementation Sharing| Shares implementation code and fields | Shares method signatures only, no implementation |
| UML Representation    | Solid line with hollow triangle      | Dashed line with hollow triangle     |

**Detailed explanation:**

- **Inheritance** implies a taxonomic relationship. For example, a `Dog` class inherits from `Animal` because a dog *is an* animal, sharing physical and behavioral traits.
- **Realization** connects classes that share common abilities but not lineage. For example, `Bird`, `Airplane`, and `Drone` classes all implement the `Flyable` interface because they share the capability to fly, despite being unrelated in class hierarchy.

**When to use inheritance:**

- There is a true "is-a" relationship.
- To share implementation code and state fields.
- When child classes specialize or extend the parent class's behavior.

**When to use realization (interfaces):**

- When unrelated classes share capabilities.
- When multiple inheritance of behavior is necessary.
- To maximize flexibility and reduce coupling.
- When the contract (method signatures) matters more than shared implementation.


### 4. Practical Application: Combining Inheritance and Realization

Real-world systems often require blending inheritance and realization to capture complex relationships.

**Example:** A `Car` class might:

- Extend a `Vehicle` superclass to inherit shared state and behavior common to all vehicles.
- Implement multiple interfaces such as `Drivable`, `Insurable`, and `Parkable` to adopt various independent capabilities.

This approach enables the `Car` to share implementation where appropriate while supporting diverse behaviors through interface contracts.


### 5. Summary of Key Takeaways and Their Implications

The concept of **Realization** is fundamental in creating modular, extensible, and maintainable software architectures. By distinguishing between **contract** (interface) and **implementation** (class), developers can design systems where:

- Multiple classes provide diverse implementations of the same behavior.
- Systems remain loosely coupled and flexible to change.
- Code reuse is maximized without rigid inheritance hierarchies.

The UML conventions reinforce these distinctions visually, aiding clear design and documentation. Understanding when to apply **Realization** versus **inheritance** critically impacts the robustness and clarity of software design.

In conclusion, Realization allows system designers to model **capabilities** independently of **identity**, facilitating polymorphism and multiple behaviors in unrelated classes. This principle underpins modern object-oriented design patterns and best practices, particularly in scenarios like payment system design, where diverse methods must conform to a unified operational contract.

