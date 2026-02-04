---
title: "Class Diagram"
description: "Class Diagram helps you visualize design before you write code. It is a simple way to explain structure and flow to others."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)

### Introduction

The **Unified Modeling Language (UML)** serves as a standardized approach for visualizing, specifying, constructing, and documenting the artifacts of software systems. Among its diverse diagram types, **class diagrams** stand out as a fundamental tool for illustrating the **static structure** of object-oriented systems. These diagrams provide a clear depiction of **classes**, their **attributes**, **methods**, and the various **relationships** that interconnect objects within the system.

Understanding UML class diagrams is crucial for software architects, developers, and system designers because they facilitate communication, analysis, and design consistency throughout software development. This chapter explores the core building blocks of UML class diagrams, the different types of class relationships, and presents real-world examples to elucidate these concepts, enabling readers to model complex systems with clarity and precision.


### Building Blocks of UML Class Diagrams

UML class diagrams are composed of several fundamental elements that represent the key structural components of a software system.

#### 1. Class

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770223432/Portfolio/lldSystemDesign/img/572cdb2a-5c41-4eed-a0dd-8ec727e9d3d6.png)

- A **class** is a blueprint or template defining an object’s **properties** and **behaviors**.
- Represented as a rectangle divided into three compartments:
  - **Name (top):** Unique identifier (e.g., `BankAccount`).
  - **Attributes (middle):** Data fields or properties (e.g., `accountNumber`, `balance`).
  - **Operations (bottom):** Methods or functions the class can perform (e.g., `deposit()`, `updateBalance()`).
- **Visibility markers** indicate accessibility:
  - `+` Public: accessible by any class.
  - `-` Private: accessible only within the class.
  - `#` Protected: accessible within the class and subclasses.
  - `~` Package: accessible within the same package.

**Key Points:**
- Classes serve as the foundation of UML modeling.
- Visibility controls encapsulation and access scope.


#### 2. Attributes

- Attributes denote the **properties** or **data fields** of a class.
- Written typically as:  
  > `visibility name: type [multiplicity] = defaultValue`
- Components:
  - **Name:** Identifier of the attribute.
  - **Type:** Data type (e.g., `String`, `int`).
  - **Multiplicity:** Number of instances allowed (optional).
  - **Default Value:** Initial value (optional).

**Example Insight:**
- A `Person` class might have attributes like `-name: String`, `-age: int = 30`.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770223476/Portfolio/lldSystemDesign/img/50ebcbe0-9dec-4a0d-89d9-272ab14d61bd.png)

#### 3. Methods (Operations)

- Methods define the **behaviors** or **functions** a class can perform.
- Notation format:  
  `visibility name(parameterList): returnType`
- Components:
  - **Name:** Method identifier.
  - **Parameter List:** Comma-separated parameters with their types.
  - **Return Type:** Type of value returned by method.

**Example Insight:**
- A `Person` class method could be `+getAge(): int`.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770223476/Portfolio/lldSystemDesign/img/50ebcbe0-9dec-4a0d-89d9-272ab14d61bd.png)

#### 4. Interfaces

- An **interface** defines a contract of methods without implementation.
- Classes implementing an interface must provide concrete method implementations.
- UML notation includes the keyword `«interface»` above the interface name.
- Methods are abstract and shown without body details.

**Example:**
- A `Drawable` interface defining a contract for graphical objects.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770223522/Portfolio/lldSystemDesign/img/bddcefd1-a732-4012-a64c-c8c9a04b98c0.png)


#### 5. Abstract Classes

- **Abstract classes** cannot be instantiated directly.
- They serve as templates for subclasses.
- Represented with the class name italicized and the keyword `«abstract»`.
- Abstract methods are also italicized.

**Example:**
- An abstract `Shape` class with abstract methods for subclasses like `Circle` and `Rectangle`.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770223556/Portfolio/lldSystemDesign/img/d72e071d-b7f1-4f5d-abb6-3dfc7cbac203.png)


#### 6. Enumeration

- **Enumerations** define a set of named constant values.
- Notation includes the keyword `«enumeration»`.
- Useful for representing fixed sets like colors or days of the week.

**Example:**
- A `Color` enumeration with values like `Red`, `Green`, `Blue`.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770223592/Portfolio/lldSystemDesign/img/e0c7cd20-2105-452c-91d0-cb461866d360.png)


#### 7. Multiplicity

- **Multiplicity** specifies how many instances of one class relate to a single instance of another.
- Common multiplicities:
  - `1` (exactly one)
  - `0..1` (zero or one)
  - `*` (zero or more)
  - `1..*` (one or more)
- Displayed near association ends to clarify relationships.


### Class Relationships in UML Diagrams

Classes in UML do not exist in isolation; their interactions and dependencies form the backbone of object-oriented design. Six primary relationship types articulate these connections.

#### 1. Association

- Represents a **"uses-a"** relationship.
- One class uses or interacts with another.
- Plain line connecting classes; denotes reference or interaction.
- Example: A `Car` **uses** a `Driver`.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770223631/Portfolio/lldSystemDesign/img/f2d25c3c-494b-4faa-88ed-f692cfdbd049.png)


#### 2. Aggregation

- Represents a **"has-a"** relationship where the whole contains parts.
- Parts can exist independently of the whole.
- Depicted with a hollow diamond at the whole’s end.
- Example: A `Car` contains an `Engine`, but the `Engine` can exist separately.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770223651/Portfolio/lldSystemDesign/img/0d8ddba4-3cab-4a3e-8946-8a5af1c90bc5.png)

#### 3. Composition

- A **stronger "has-a"** relationship.
- Parts cannot exist without the whole.
- If the whole is destroyed, parts are destroyed as well.
- Depicted with a filled diamond.
- Example: A `House` composed of `Rooms`—rooms cannot exist independently.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770223672/Portfolio/lldSystemDesign/img/5f181827-f53f-4ea2-8736-95b77389d3b0.png)

#### 4. Inheritance (Generalization)

- Represents an **"is-a"** relationship.
- Subclass inherits attributes and methods from superclass.
- Depicted with a solid line and hollow triangle pointing to the superclass.
- Example: `Dog` and `Cat` inherit from `Animal`.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770223707/Portfolio/lldSystemDesign/img/e9bcb751-25f8-4db2-b92d-dac9c4f1d37e.png)

#### 5. Realization (Implementation)

- Represents a class implementing an interface.
- The class provides concrete implementations for interface methods.
- Depicted with a dashed line and hollow triangle.
- Example: `Rectangle` and `Circle` implement the `Shape` interface.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770223721/Portfolio/lldSystemDesign/img/d283a0b8-6e57-404f-aa4d-2a0228ea94c9.png)

#### 6. Dependency

- Represents a **"uses"** relationship where a change in one class affects another.
- Depicted with a dashed arrow.
- Example: A `Customer` uses an `Order` class to place an order.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770223726/Portfolio/lldSystemDesign/img/123decd2-236c-43ca-aa6a-0bf3afe0d31b.png)

**Hierarchy of Relationship Strength (from strongest to weakest):**  
Inheritance → Implementation → Composition → Aggregation → Association → Dependency


### Real-World Examples and Combined Overview

To consolidate understanding, consider a UML class diagram combining multiple relationship types:

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770223790/Portfolio/lldSystemDesign/img/81e92d59-a484-4cc0-951e-e907aeaf5803.png)

- **Inheritance:** `Dog` and `Cat` inherit from `Animal`.
- **Realization:** `Dog` and `Cat` implement the `Pet` interface.
- **Aggregation:** A `Person` owns multiple `Pets`—pets exist independently.
- **Composition:** A `Person` has an `Address` that cannot exist without the person.
- **Association:** A `Person` has multiple `Phones`.
- **Dependency:** `Phone` depends on `PhoneType` enumeration for its `phoneType` attribute.

This example demonstrates how complex systems integrate different relationships to accurately model real-world scenarios.


### Conclusion

UML class diagrams form a foundational pillar in object-oriented software design by visually representing classes, attributes, methods, and the intricate relationships that bind them. Mastery of the **building blocks**—including classes, interfaces, abstract classes, enumerations, and multiplicity—enables precise modeling of system components. Moreover, understanding the six fundamental **relationships**—association, aggregation, composition, inheritance, realization, and dependency—provides clarity on how objects interact, depend on, and inherit from one another.

Recognizing the strength and nuance of these relationships—from the rigid hierarchy of inheritance to the flexible coupling of dependency—is vital for designing robust, maintainable software architectures. Real-world examples, such as cars with engines, houses with rooms, or pets owned by persons, ground these abstract concepts, making UML class diagrams an indispensable tool for software professionals.


### Summary of Key Insights

- **Class diagrams** provide a **static view** of software structure via classes and their relationships.
- Classes are depicted with three compartments: **name**, **attributes**, **methods**, with **visibility markers** controlling access.
- **Attributes** define data properties; **methods** specify behaviors.
- **Interfaces** and **abstract classes** provide contracts and blueprints; **enumerations** define fixed sets of values.
- **Multiplicity** clarifies how many instances relate to another.
- Six types of relationships characterize inter-class connections:
  - **Association:** basic usage.
  - **Aggregation:** whole-part with independent parts.
  - **Composition:** whole-part with dependent parts.
  - **Inheritance:** subclass-superclass relationship.
  - **Realization:** class-interface implementation.
  - **Dependency:** usage with potential impact.
- The **strength hierarchy** guides interpretation: inheritance is the strongest, dependency the weakest.
- Practical models combine multiple relationships to reflect real-world systems.

This comprehensive framework empowers developers and designers to create clear, scalable, and maintainable object-oriented designs using UML class diagrams.

