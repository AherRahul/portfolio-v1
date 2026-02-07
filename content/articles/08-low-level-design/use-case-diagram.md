---
title: "Use Case Diagram"
description: "Use Case Diagram helps you visualize design before you write code. It is a simple way to explain structure and flow to others."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)

### Introduction: The Role and Significance of Use Case Diagrams in System Design

When tasked with designing a new software system—such as an online food delivery or ride-booking app—the initial and most critical question is: **“What exactly should this system do?”** This fundamental inquiry sets the stage for understanding the system from the user’s perspective before delving into technical details like coding or database design. To capture this user-centric view effectively, software engineers employ **Use Case Diagrams**, a pivotal tool in the early stages of system development.

A **Use Case Diagram** is a **visual representation** that illustrates how different external entities, known as **actors**, engage with a system. It offers a **bird’s-eye view** of the system’s functionalities, focusing on **what users can do** rather than how features are implemented. This distinction is crucial: use case diagrams clarify **who interacts with the system, what they aim to achieve, and how the system responds**, without delving into internal technical mechanisms.

Use Case Diagrams are especially significant during the **requirements gathering and analysis phase** of software development, laying a foundation for clear communication among stakeholders and guiding subsequent design and implementation efforts. Understanding the vocabulary and key concepts—such as **actors, use cases, system boundaries, and relationships**—is essential for interpreting or constructing these diagrams effectively.


### Defining Use Case Diagrams – Core Concepts and Purpose

- **Definition and Scope**
  - A **Use Case Diagram** visually maps the interactions between external entities (**actors**) and the system.
  - It answers the central question: **“What can users do with this system?”** without addressing the internal workings.
  - Focuses solely on **user roles, their goals, and system responses**.
  - Typically employed in the **early phases of software development** after gathering requirements.

- **Example: Ride-Booking System**

  ![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770484978/Portfolio/lldSystemDesign/img/61d448e6-1b70-41cb-b904-0e838864a011.png)

  - **Actors**: Rider, Driver
  - **Use Cases**:
    - Rider: Book Ride, Cancel Ride, Make Payment
    - Driver: Accept Ride, Mark Ride Complete
  - Illustrates how different users have distinct goals and interactions with the system.

- **Key Takeaways**
  - Use Case Diagrams provide clarity on the **functional scope** and **user expectations**.
  - They help avoid premature technical design by focusing on **requirements from the user’s perspective**.


### Building Blocks of Use Case Diagrams – Elements and Their Roles

Use Case Diagrams may appear simple — consisting of stick figures, ovals, and arrows — but each component serves a precise role. Mastery of these building blocks is essential for both reading and creating meaningful diagrams.

- **1. Actors**
  - Definition: Represent **any entity outside the system** that interacts with it.
  - Usually human users, but can also be external systems or devices.
  - **Notation**: Stick figure labeled with actor’s role.

    ![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770485001/Portfolio/lldSystemDesign/img/e0ae6f75-a558-429b-90e0-79754ece75de.png)

  - Two types of actors:
    - **Primary actors**: Initiate interactions (e.g., a user logging in).
    - **Secondary actors**: Support interactions but do not start them (e.g., payment gateway).
  - Example: In a movie ticket booking system, actors include Customer, Admin, Payment Gateway.

- **2. Use Cases**
  - Definition: **Functionalities or goals** the system offers to actors.
  - Represent the **actions** the user intends to perform.
  - **Notation**: Oval labeled with an action verb phrase.

    ![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770485013/Portfolio/lldSystemDesign/img/b37f8a9e-cc67-452a-830c-f1da79f4ffcb.png)

  - Characteristics:
    - Start with a verb (e.g., Register, Search, Make Payment).
    - Represent complete user interactions.
    - Deliver meaningful outcomes.
  - Example: Book Ticket, Cancel Booking, Add/Edit Movie Listings.

- **3. System Boundary**
  - Defines the scope by separating **what is inside the system** from what lies outside.
  - Clarifies responsibilities and scope of implementation.
  - **Notation**: Labeled rectangular box enclosing all use cases.

    ![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770485022/Portfolio/lldSystemDesign/img/ca5dd0d2-afb8-43d8-9d94-6b91294ffb39.png)

  - Example: “Online Banking System” or “Movie Ticket Booking System”.

- **4. Relationships**
  - Describe connections between actors and use cases or between use cases themselves.
  - Four primary types:
  
    - **Association**
      - Links actors to use cases they participate in.
      - **Notation**: Solid line.

        ![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770485036/Portfolio/lldSystemDesign/img/53f7da02-bf0f-4b48-b4a1-0a84cae523c4.png)

      - Example: Customer → Place Order.
    
    - **Include**
      - Indicates mandatory, reusable functionality included by other use cases.
      - **Notation**: Dashed arrow labeled `<<include>>`.

        ![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770485046/Portfolio/lldSystemDesign/img/9ee07935-9206-4515-ab9c-f503ec34f658.png)

      - Example: Checkout includes Validate Payment.
    
    - **Extend**
      - Represents optional or conditional behavior extending a base use case.
      - **Notation**: Dashed arrow labeled `<<extend>>`.

        ![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770485058/Portfolio/lldSystemDesign/img/52556655-0400-4a98-ab1b-42495a14d3fe.png)

      - Example: Search may extend to Advanced Filter.
    
    - **Generalization**
      - Shows inheritance or specialization between actors or use cases.
      - Child inherits and possibly extends parent behavior.
      - **Notation**: Directed arrow with triangle from child to parent.

        ![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770485069/Portfolio/lldSystemDesign/img/9b44aa89-4e4e-40af-af36-f7104b55e6f2.png)

      - Example: Admin is a specialized User.


### Step-by-Step Guide to Drawing Use Case Diagrams

To demonstrate practical application, the process of constructing a Use Case Diagram is illustrated through the example of a **Movie Ticket Booking System**.

- **Step 1: Identify Actors**
  - Determine all external entities interacting with the system.
  - Could be human users or external systems.
  - Example actors:

    ![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770485084/Portfolio/lldSystemDesign/img/633edcc3-679a-42e2-ab4c-d204854c3214.png)

    - **Customer**: Books and cancels tickets, browses movies.
    - **Admin**: Manages movie listings and schedules.
    - **Payment Gateway**: Processes payments externally.

- **Step 2: Identify Use Cases**
  - List functionalities or goals from the perspective of each actor.
  - Use clear, verb-driven names.
  - Example use cases for customer:
    - Browse Movies, Book Ticket, Cancel Booking, Make Payment.
  - For admin:
    - Add/Edit Movie Listings.

- **Step 3: Define System Boundary**
  - Enclose all use cases within a labeled rectangle representing the system.
  - Clarifies system scope and responsibility.
  - Example label: **Movie Ticket Booking System**.

  ![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770485096/Portfolio/lldSystemDesign/img/587901d6-ae07-4871-9699-8f425f4f2ad0.png)


- **Step 4: Connect Actors to Use Cases**
  - Draw **solid lines (associations)** from each actor to the use cases they interact with.
  - Customers connect to most use cases; admins to management tasks; payment gateway to payment processing.

- **Step 5: Model Relationships Between Use Cases**
  - Use arrows and labels to depict relationships.
  
    - **Include**: Use case always includes another — e.g., Book Ticket always includes Make Payment.

      ![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770485105/Portfolio/lldSystemDesign/img/7e705b52-7e82-4e39-9c9f-b134d0c44b0b.png)

    - **Extend**: Optional behavior — e.g., Browsing movies may extend to filtering by genre.

      ![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770485119/Portfolio/lldSystemDesign/img/86354eba-4e4a-4141-ad66-c4e8e3a8732d.png)

    - **Generalization**: Actors or use cases sharing behavior but differing slightly — e.g., Registered User and Guest User as specialized Customers.

      ![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770485134/Portfolio/lldSystemDesign/img/dd0b3d39-a6a7-4fea-bee1-2ea75e7924e0.png)


- **Bringing It All Together**
  - The final diagram provides a coherent, comprehensive view of actors, their goals, system boundaries, and inter-use case relationships.
  - This visual blueprint assists in aligning stakeholders, clarifying requirements, and guiding design.

    ![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770485224/Portfolio/lldSystemDesign/img/93f4a017-4376-4c28-9238-18bc1e32ffa7.png)



### Opinions and Arguments on the Utility of Use Case Diagrams

- Use Case Diagrams are argued to be **indispensable in the early software development lifecycle** because they distill complex requirements into intuitive visuals.
- They foster **clear communication** among developers, designers, and stakeholders by focusing on user goals rather than technical implementations.
- The article emphasizes the importance of staying **user-centric**, warning that premature focus on code or data structures can lead to misaligned solutions.
- The stepwise approach to diagramming is advocated for its clarity and effectiveness in progressively elaborating system interactions.
- By applying concepts like **include** and **extend**, the diagrams encourage **reuse and modularity**, supporting maintainable and scalable system designs.


### Real-World Examples Demonstrated

- **Ride-Booking System**
  - Actors: Rider, Driver
  - Use Cases: Booking, cancellation, payment, ride acceptance, completion.
  - Demonstrates simple actor-goal relationships.

- **Movie Ticket Booking System**
  - Actors: Customer, Admin, Payment Gateway.
  - Use Cases: Browsing, booking, cancellation, payment, movie management.
  - Highlights complex relationships including **include**, **extend**, and **generalization**.
  - Provides a practical blueprint for real-world software projects involving multiple user roles and external systems.


### Conclusion: Key Takeaways and Implications for Software Development

Use Case Diagrams are a **powerful modeling tool** that deliver a clear, user-focused perspective of a system’s functional requirements. By visually mapping actors and their goals within defined system boundaries, these diagrams:

- Clarify **who interacts with the system and what they seek to accomplish**.
- Avoid premature technical design by emphasizing **user intent and system responses**.
- Facilitate **communication and alignment** among diverse stakeholders.
- Promote **reuse and modularity** through relationship modeling such as **include** and **extend**.
- Provide a structured methodology for capturing system scope and functionality early in the development lifecycle.

The step-by-step approach to constructing Use Case Diagrams — as demonstrated through the movie ticket booking example — reinforces best practices and ensures diagrams are both comprehensive and comprehensible. Ultimately, mastering Use Case Diagrams equips software professionals with a foundational skill essential for successful, user-centered system design and development.
