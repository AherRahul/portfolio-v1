---
title: "Activity Diagram"
description: "Activity Diagram helps you visualize design before you write code. It is a simple way to explain structure and flow to others."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)


# Introduction: The Significance of Activity Diagrams in System Design

In designing complex systems such as an **order processing system**, understanding the workflow and clearly communicating it is critical. When asked about the workflow of an order placement, one must consider not only the sequence of steps but also **parallel processes**, **decision points**, and **responsibility assignments**. Here, an **Activity Diagram**, a type of **UML (Unified Modeling Language) diagram**, becomes invaluable. Unlike sequence diagrams that emphasize object interactions, Activity Diagrams focus on the **flow of activities**, decision logic, and concurrent operations within a process. They offer a more powerful and detailed visualization than traditional flowcharts, making them essential for **modeling business workflows, optimizing parallel operations, and clarifying roles and responsibilities** within complex systems.

This chapter explores the concept of Activity Diagrams, outlining their components, control flows, and practical usage in system design—particularly highlighting their role in **low-level design (LLD) interviews**. By mastering Activity Diagrams, one can effectively represent processes, identify bottlenecks, and improve system design communication.


### 1. What is an Activity Diagram?

An **Activity Diagram** is a UML tool that graphically represents:

- The **sequence and order** of activities or actions within a process.
- Points where **decisions** influence the flow direction.
- Activities that can be executed **in parallel**.
- The assignment of responsibilities to different actors or components using **swimlanes**.

These diagrams are used to:

- Model and document business processes and workflows.
- Identify opportunities for parallel execution and optimization.
- Clarify decision-making logic within the process.
- Assign responsibilities to systems or actors to understand handoffs.
- Detect bottlenecks and inefficiencies in the workflow.

> *Key Concept:* Activity Diagrams provide a holistic view of how a process unfolds from start to finish and are particularly useful in complex workflows involving multiple actors and concurrent operations.


### 2. Components of an Activity Diagram

Understanding the basic symbols and nodes is essential to accurately create and interpret Activity Diagrams.

- **Initial Node (Start):** Denoted by a filled black circle (●). Marks the beginning of the workflow.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770483679/Portfolio/lldSystemDesign/img/082b0088-8b9e-41af-b04b-3a0598400b5f.png)
  
- **Activity/Action Node:** Represented by a rounded rectangle, it signifies a single step or action, e.g., *Validate Order*. Good action names should start with a verb, be clear and specific, and describe *what* happens, not *how*.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770483708/Portfolio/lldSystemDesign/img/77ea097b-cc5e-4a75-8d33-4ae1b815ca7c.png)
  
  
- **Final Node (End):** Depicted as a concentric circle (◉), indicating the workflow’s termination.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770483726/Portfolio/lldSystemDesign/img/6bdb2504-b8bc-4356-934f-9071d959e881.png)
  
  
- **Flow Final Node:** Shows termination of a specific flow within the activity without ending the entire process. Illustrated as a circle with an X.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770483742/Portfolio/lldSystemDesign/img/f784613a-68b6-438c-8200-cd3ea8a6e99a.png)
  
  
- **Decision Node:** A diamond shape (◇) representing a branching point where the flow diverges based on a condition (e.g., *Is inventory sufficient?*).

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770483757/Portfolio/lldSystemDesign/img/bdccbe0a-ceab-4349-a65c-1ca2f6218787.png)
  
  
- **Merge Node:** Also a diamond, but used to combine multiple incoming flows into one.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770483769/Portfolio/lldSystemDesign/img/c6a01d0b-c80a-4339-a013-4426acba2a27.png)
  
  
- **Fork Node:** A thick horizontal bar (▬) that splits one flow into multiple parallel flows (e.g., simultaneously updating inventory and sending email).

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770483784/Portfolio/lldSystemDesign/img/ec5cd037-0e6c-4bd6-af7a-b642595f1a93.png)
  
  
- **Join Node:** A thick horizontal bar that synchronizes multiple parallel flows back into a single flow.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770483797/Portfolio/lldSystemDesign/img/8c3277ab-7f2a-4c4b-92a4-993e2aab052c.png)
  

These elements work together to clearly visualize complex workflows with branching, concurrency, and merging.


### 3. Control Flows in Activity Diagrams

Activity Diagrams incorporate different types of flow controls that represent how activities progress:

- **Sequential Flow:** Activities follow one after another, for example, *Receive Order → Validate Order → Process Payment → Ship Order*.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770483815/Portfolio/lldSystemDesign/img/c77054ce-25f4-4420-b5ec-5a5d153e9515.png)
  
  
- **Conditional Flow (Branching):** The flow diverges based on a condition; for example, if a user is authenticated, proceed to process the request; otherwise, prompt login.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770483831/Portfolio/lldSystemDesign/img/2ed0411b-ceec-4eee-88d9-f7105bb8098f.png)
  
  
- **Parallel Flow (Concurrent Execution):** Multiple activities occur simultaneously, such as *validating the cart*, *checking inventory*, and *calculating shipping* all in parallel during checkout.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770483855/Portfolio/lldSystemDesign/img/a4c7a769-62e7-45e9-824e-3e1974b80d51.png)
  
  
- **Loop Flow:** Activities repeat until a certain condition is met, like processing items in a list until none remain.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770483867/Portfolio/lldSystemDesign/img/b9539d02-5387-4804-b558-b9b1a357d69c.png)
  

Understanding these flows allows for accurately modeling real-world processes that involve decisions, concurrency, and repetition.


### 4. Swimlanes: Assigning Responsibilities

**Swimlanes** partition the diagram into columns or rows, each representing an actor, system, or component responsible for certain activities. For example:

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770483884/Portfolio/lldSystemDesign/img/da9b3eb9-87cd-41f3-954d-4f7d008aed3f.png)
  
- **Customer**: Browsing, selecting products, making payments.
- **System**: Validating orders, processing payments.
- **Warehouse**: Shipping items.

The benefits of swimlanes include:

- Clear visualization of **who is responsible** for each activity.
- Identification of **handoff points** between actors/systems.
- Recognition of **integration points** and potential bottlenecks.
- Enhancing collaboration by defining clear boundaries.

This structural clarity is vital in both system design and cross-team communication.


### 5. Steps to Create an Activity Diagram

Creating an effective Activity Diagram involves a systematic approach:

1. **Identify the Process:** Define the workflow to be modeled (e.g., order processing, payment flow).
2. **List All Activities:** Enumerate every action that occurs within the process.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770483897/Portfolio/lldSystemDesign/img/22b90c4b-9eb2-4512-a3bb-ab61f2ca6c73.png)
  
3. **Identify Decision Points:** Determine where the flow branches and the possible outcomes.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770483915/Portfolio/lldSystemDesign/img/0df98392-127c-40e0-8bdb-4f3ac5721f2a.png)
  
4. **Identify Parallel Activities:** Recognize which activities can or should occur simultaneously.
5. **Determine Responsibilities:** Assign activities to actors or systems using swimlanes.
6. **Draw the Diagram:** Connect all components with appropriate control flows, decisions, forks, and joins.

Following these steps ensures the diagram accurately reflects the real-world process and supports system design goals.


### 6. Real-World Example: ATM Withdrawal Workflow

A practical example illustrates the power and clarity of Activity Diagrams. Consider an **ATM withdrawal process** involving multiple decision points and parallel flows:

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770483931/Portfolio/lldSystemDesign/img/94899e82-9c33-43d0-a61c-e6b96f8725ee.png)
  

- The process begins with **inserting a card** (Initial Node).
- The system reads card data and validates it (Decision Node: *Is card valid?*).
- If invalid, the card is ejected and an error displayed (Flow Final Node).
- If valid, the user is prompted for a PIN, which is verified.
- Multiple attempts are tracked; after three failed attempts, the card is retained.
- Upon successful authentication, the user selects withdrawal, enters an amount, and the system checks account balance and ATM cash availability.
- If sufficient, the account is debited, cash dispensed, receipt printed, and the card ejected (Final Node).

This example showcases:

- Use of **decision nodes** for validation and error handling.
- Clear **flow final nodes** for terminating specific flows.
- Sequential and conditional flows reflecting realistic banking operations.


### 7. Activity Diagrams vs. Flowcharts

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770483934/Portfolio/lldSystemDesign/img/a154db8f-5e72-4e19-a0f1-ba817b5e19bc.png)
  

While similar to flowcharts, Activity Diagrams provide enhanced capabilities:

- Explicit representation of **parallelism** via fork and join nodes.
- Integration of **swimlanes** for responsibility assignment.
- Distinction between **final node** and **flow final node**.
- More formal notation aligned with UML standards.

This makes Activity Diagrams more suitable for modeling complex, concurrent workflows in software and business processes.


### 8. Common Mistakes to Avoid

- Omitting **final nodes**, leaving workflows incomplete.
- Overcomplicating diagrams with too many low-level details.
- Failing to use **swimlanes**, causing confusion about responsibilities.
- Ignoring **error handling paths**, which are essential for robustness.
- Using forks without matching joins, violating the concurrency model.

Avoiding these pitfalls ensures clarity, correctness, and usefulness of the diagrams.


### Conclusion: Mastering Activity Diagrams for Effective Workflow Modeling

Activity Diagrams are a powerful tool for visualizing and communicating complex workflows involving sequential, conditional, and parallel processes. By understanding their components—such as **initial and final nodes, activities, decisions, forks, joins**, and **swimlanes**—designers can clearly represent real-world business processes and system operations. They facilitate identifying optimization opportunities, clarifying responsibilities, and ensuring comprehensive process documentation.

In practical scenarios, such as order processing or ATM withdrawal systems, Activity Diagrams provide a clear roadmap of the interaction between users, systems, and external entities. Compared to flowcharts, their formal UML foundation and enhanced features make them indispensable in software engineering and systems design, especially during **low-level design interviews** where clear, precise process modeling is crucial.

By following a structured approach to creating Activity Diagrams and avoiding common errors, one can harness their full potential to improve system design clarity, efficiency, and communication. As a result, Activity Diagrams not only streamline the development process but also contribute to building robust, scalable, and maintainable systems.


### Summary of Key Points

- **Activity Diagrams** model workflows, showing activities, decision points, parallel execution, and responsibilities.
- Components include **Initial Node, Activity Nodes, Final Nodes, Decision and Merge Nodes, Fork and Join Nodes**, and **Swimlanes**.
- Control flows can be **sequential, conditional, parallel, or looping**.
- Swimlanes assign clear responsibility and highlight handoffs.
- Steps to create diagrams involve identifying processes, activities, decisions, parallelism, responsibilities, and drawing flows.
- Real-world examples, such as ATM withdrawal, demonstrate their practical utility.
- Activity Diagrams are more powerful and structured than flowcharts.
- Common mistakes include missing final nodes, no swimlanes, or unmatched forks and joins.
- Mastery of Activity Diagrams enhances workflow optimization, process clarity, and interview performance.
