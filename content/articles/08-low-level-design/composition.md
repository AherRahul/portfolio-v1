---
title: "Composition"
description: "This lesson explains Composition in simple terms and shows how it helps you design clear, testable code."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)

### Introduction: The Concept and Significance of Composition

In object-oriented programming (OOP), understanding the relationships between objects is crucial for designing robust and maintainable systems. Among these relationships, **Composition** stands out as the strongest form of the **“has-a” relationship**, symbolizing an exclusive ownership where the **whole** controls the existence and lifecycle of its **parts**. This chapter explores the concept of composition, its defining characteristics, practical usage, and how it contrasts with other forms of object relationships such as association and aggregation. Mastering composition enables developers to model real-world scenarios with precise control over object lifecycles, ensuring that parts cannot exist independently from their whole, thereby fostering tighter cohesion and clearer system architecture.

Key vocabulary and concepts introduced here include:

- **Composition**: A strong ownership relationship where the whole controls the lifecycle of parts.
- **Whole-Part Relationship**: The dynamic between an owning object (whole) and its dependent objects (parts).
- **Lifecycle Management**: The process by which the whole creates, manages, and destroys its parts.
- **UML (Unified Modeling Language)**: A visual notation used to represent composition with a filled diamond symbol (◆).
- **Association, Aggregation, and Composition**: Distinct types of object relationships with varying degrees of ownership and lifecycle dependency.

### 1. What is Composition?

Composition is a special type of association characterized by **strong ownership** and lifecycle dependency. In this relationship, the **whole class** is responsible for creating, managing, and ultimately destroying its **part objects**. The parts lose their identity and cannot meaningfully exist without the whole.

- **Key Characteristics:**
  - Represents a **strong “has-a” relationship**.
  - The whole **owns** the parts and fully controls their lifecycle.
  - Upon destruction of the whole, the parts are also destroyed.
  - Parts are **not shared** with other objects; they have no independent meaning.
  - If a part cannot logically exist outside the whole, composition is the appropriate model.

- **Real-World Analogy: House and Rooms**
  - A house contains rooms such as a living room, kitchen, and bedroom.
  - These rooms do not exist independently; they are an integral part of the house.
  - When the house is demolished, the rooms cease to exist.
  - Rooms are not transferred between houses.
  - This analogy illustrates the tight binding of parts to the whole in composition.

### 2. UML Representation of Composition

In UML class diagrams, composition is denoted by a **filled diamond (◆)** at the whole’s end. This symbol visually conveys the **ownership and lifecycle dependency** between the whole and its parts.


![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770124986/Portfolio/lldSystemDesign/img/add0d919-c147-4c4a-b4da-c8e6c7b92479.png)

- For example, a **House** class owning multiple **Room** objects is represented with a filled diamond connecting House to Room.
- This signifies:
  - Rooms cannot exist independently of the House.
  - Destruction of the House leads to automatic destruction of all Rooms.
  - The lifecycle of the child class (Room) is tightly coupled to that of the parent class (House).

- **Multiple compositions** can exist within a model, each representing different wholes and their parts in tightly bound relationships.


![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770125008/Portfolio/lldSystemDesign/img/7f7f983c-5b55-432d-9f82-a49374c1c351.png)

### 3. Code Example: Modeling Composition in Java

The theoretical concept of composition translates directly into code by ensuring that the whole object creates and manages its parts internally, without exposing them to external management.

- **Room Class:**
  ```java
  class Room {
      private String name;

      public Room(String name) {
          this.name = name;
      }

      public void describe() {
          System.out.println("This is the " + name);
      }
  }
  ```

- **House Class:**
  ```java
  class House {
      private List<Room> rooms;

      public House() {
          rooms = new ArrayList<>();
          rooms.add(new Room("Living Room"));
          rooms.add(new Room("Kitchen"));
          rooms.add(new Room("Bedroom"));
      }

      public void showHouseLayout() {
          for (Room room : rooms) {
              room.describe();
          }
      }
  }
  ```

- **Explanation:**
  - The **House** class initializes and owns its **Room** instances.
  - Rooms cannot be created or exist outside the House.
  - No external entity should manage or reuse these Rooms.
  - If the House instance is destroyed (e.g., garbage collected), its Rooms are destroyed as well.
  - This code embodies the essence of composition: tight coupling of part lifecycle to the whole.

### 4. When to Use Composition

Composition is the preferred design approach under specific conditions that require strong containment and lifecycle management.

- **Use Composition When:**
  - The part **lacks meaning without the whole**.
  - The whole should **control the lifecycle** of its parts.
  - Parts **are not reused** elsewhere.
  - You want to model a **strong containment** or ownership relationship.

- **Advantages Over Inheritance:**
  - Follows the widely advocated **“Favor composition over inheritance”** principle from the Gang of Four (GoF) design patterns.
  - Enables building complex behavior by composing smaller, reusable parts.
  - Avoids tight coupling and fragility often introduced by inheritance hierarchies.
  - Facilitates dynamic behavior modification by swapping parts at runtime.

- **Example: Vehicle and Engine Composition**
  - A Vehicle can be composed of an Engine interface.
  - The Engine can be dynamically swapped among implementations: PetrolEngine, ElectricEngine, HybridEngine.
  - This leads to flexible, testable, and loosely coupled code.

### 5. Composition vs Aggregation vs Association: A Comparative Analysis

To fully grasp composition, it is essential to contrast it with other common object relationships: **association** and **aggregation**.

| Feature           | Association            | Aggregation           | Composition          |
|-------------------|-----------------------|-----------------------|----------------------|
| Ownership         | None                  | Weak “has-a”          | Strong “owns-a”      |
| Lifecycle         | Independent           | Independent           | Dependent (part dies with whole) |
| Coupling Tightness| Loose                 | Moderate              | Tight                |
| Multiplicity      | Flexible (1:1, 1:N, N:N) | Whole can group many parts | Whole composed of integral parts |
| Reusability       | High (parts reused)   | Moderate (parts reused) | Low (parts not reusable outside whole) |
| UML Symbol        | Solid line            | Hollow diamond (◊)    | Filled diamond (◆)   |
| Real-World Example| Student ↔ Course      | Department → Professor| House → Room         |

- **Association** is a general connection where objects know about each other but do not affect each other's lifecycle.
- **Aggregation** depicts a whole-part relationship with weak ownership; parts can exist independently.
- **Composition** implies strong ownership and lifecycle dependency; parts are integral to the whole.


![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770125029/Portfolio/lldSystemDesign/img/3827758d-75ca-4215-afd6-3cd216d6f8dd.png)

### 6. Transition to Dependency

While composition deals with permanent and lifecycle-bound relationships, many object interactions in software are temporary and non-owning. These short-lived relationships are modeled using **Dependency**, the weakest connection form in OOP.

- Dependency models temporary usage or interaction during method calls, without lifecycle or ownership implications.
- The upcoming chapter will explore dependency, completing the spectrum of object relationships from weakest to strongest.

### Conclusion: Key Takeaways and Implications

Composition represents a fundamental concept in object-oriented design, enabling developers to model strong ownership and lifecycle dependencies between objects. Recognizing when to use composition versus aggregation or association leads to clearer, more maintainable, and tightly cohesive system architectures. The core principles of composition include:

- The **whole owns the parts** and controls their lifecycle.
- Parts **cannot exist independently** or be shared.
- It is visually represented in UML by a **filled diamond**.
- Code implementations ensure the whole class creates and manages its parts exclusively.
- Composition encourages **flexible and decoupled designs**, favored over inheritance for complex behaviors.
- Understanding composition provides a foundation for mastering object relationships, preparing developers to use dependency and other relationships effectively.

In essence, composition captures the real-world notion that some entities are inseparable wholes made up of integral parts — a concept that, when applied in software design, strengthens the reliability and clarity of object models.
