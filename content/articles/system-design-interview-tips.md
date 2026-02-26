---
title: "System Design Interviews were HARD Until I Learned these 15 Tips"
description: "When I started preparing for system design interviews for the first time in 2019, I felt completely overwhelmed. It wasn’t a subject covered in college, and I had no prior experience building scalable systems."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/system-design-interview-tips.md"
dateModified: "2025-01-16"
datePublished: "2025-01-16"
showOnArticles: true
topics:
  - system-design
---

When I started preparing for  **system design interviews**  for the first time in 2019, I felt completely overwhelmed. It wasn’t a subject covered in college, and I had no prior experience building scalable systems.

But, over time, I realized that  **you don’t need professional experience with distributed systems to pass system design interviews** .

Even experienced engineers often find these interviews challenging because the format is unique and requires a specific approach.

The good news is that once you understand the  **basic concepts** , the  **building blocks** , and  **trade-offs** , and learn how to connect them effectively, system design interviews become far less intimidating.

In this article, I’ll share  **15 tips**  that improved my system design interview skills and made it significantly easier—and hopefully, they’ll do the same for you.

# 1. What Interviewers Want to See

In a system design interview, the interviewer evaluates your ability to  **think critically** ,  **design effectively** , and  **communicate clearly** .

Here’s what they are looking for:

- **Clarify Requirements:**  Can you ask the right questions to clarify functional and non-functional requirements?
- **System Architecture:**  Can you outline the main components of the system (e.g., clients, APIs, databases, caching, load balancers) and explain how they interact?

- **Scalability:**  Can your design handle increased traffic or scale with user growth?
- **Fault Tolerance:**  Can you address single points of failure and ensure fault tolerance?
- **Trade-Offs:**  Can you explain the pros and cons of your decisions and justify your choices?
- **Detailing Components:**  Can you dive into the details of critical components (e.g., database schema, caching strategy, API design)?
- **Bottlenecks and Edge Cases:**  Can you identify potential issues and propose strategies to mitigate them?
- **Clear Communication:**  Can you articulate your ideas clearly and engage in a constructive discussion with the interviewer?
- **Adaptability:**  Are you receptive to feedback and able to refine your design?
- **Time Management:**  Can you manage your time effectively and focus on high-impact components?
- **Patterns:**  Are you familiar with common system design patterns (e.g., sharding, replication, caching)?
- **Tools:**  Can you discuss tools or technologies relevant to the problem?

# 2. Allocate Time Wisely

System design interviews typically last  **45-60 minutes** , which means managing your time effectively is crucial.

A well-structured approach ensures you cover all key aspects of the design while leaving room for discussion and feedback with the interviewer.

Here’s a framework you can follow:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/abdee1ae-3577-48de-bc65-1f0945ddb78e_1608x1164.png)](https://substackcdn.com/image/fetch/$s_!FWD7!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fabdee1ae-3577-48de-bc65-1f0945ddb78e_1608x1164.png)

1. **Clarifying Requirements (5-10 minutes):**  Understand functional and non-functional needs.
2. **High-Level Design (10-15 minutes):** Outline the system's main components and overall architecture (e.g., clients, database, cache, load balancer, messaging queues).
3. **Database Design (5-8 minutes):** Choose the appropriate database type (SQL, NoSQL, or hybrid). Define schemas and discuss partitioning, indexing, replication, and caching.
4. **API Design (5-8 minutes):** Define intuitive and scalable APIs. List critical endpoints and their purpose.
5. **Deep Dive into Key Components (15-20 minutes):** Discuss 2-3 critical components in detail.
6. **Handling Trade-Offs and Edge Cases (5-10 minutes):** Highlight trade-offs, bottlenecks, and failure handling. Propose mitigation strategies.
7. **Address scalability, security and monitoring (5-10 minutes):** Explain how your design handles growth, ensures security, and incorporates monitoring.

You can adjust this framework based on the problem type and requirements.

> **Note:** I haven’t included  **capacity estimation**  here but I recommend minimal capacity estimation at the start to set context (e.g., "The system will handle 1 million requests per day").Avoid detailed calculations unless explicitly required. You don’t want to waste your precious time doing unnecessary maths calculation.

# **3. Clarify Functional Requirements First**

A common mistake many candidates make is jumping directly into designing the system without fully understanding what needs to be built.

System design questions are intentionally  **open-ended**  and often underspecified. Interviewers deliberately withhold details, expecting you to ask the right questions to uncover the information you need.

To succeed, start by clarifying the  **functional requirements** —the  **core features**  and  **use cases**  the system must support.

At this stage, avoid thinking about design, implementation, or technical specifics. The primary goal is to define  **what**  needs to be built, not  **how**  to build it or the scale it needs to support. Focus purely on understanding the "what."

Based on the problem, list down the core features and use cases and confirm them with the interviewer.

**Questions to Ask:**

- What specific features does the system need?
- Are there any must-have or optional features?
- What are the main objects and their relations?
- How the objects will interact with each other and access pattern?
- Can the system’s objects be modified after creation?
- What types of data will the system handle?

**Example:**  For a chat application:

- Users should be able to send and receive messages.
- The primary objects are users and messages.
- Users should view all messages in chronological order.
- Messages may be edited or deleted after being sent.
- Messages may include text, images, and videos.

> Your aim is to ask just enough questions to gather a clear picture of all important use cases for the system.

# **4. Consider Non-Functional Requirements**

Once functional requirements are well-defined, shift your focus to  **non-functional requirements**   **(NFRs)** .

These describe  **how**  the system should perform its functions.

The most common non-functional requirements you should consider in a system design interview are:

- **Performance:**  How quickly should the system respond to user requests?
- **Availability:**  Should the system tolerate downtime? If yes, how much?
- **Consistency:**  Is strong or eventual consistency required?
- **Security:**  Are there any special security considerations or workflows?

**Questions to Clarify NFRs:**

- What is the  **scale**  of the system?How many users should it support?How many requests per second should the server handle?
- How many users should it support?
- How many requests per second should the server handle?
- Is  **downtime**  acceptable? What is the cost of downtime for this system?
- Is the system  **read-heavy**  or  **write-heavy** ? What is the read-to-write ratio?
- Should updates be visible to users instantly, or is a delay acceptable?
- Are there any specific  **security**  concerns? **Example:**  Are there workflows involving sensitive data or code execution?
- **Example:**  Are there workflows involving sensitive data or code execution?

**Example:**  For a chat application:

- **Scale:**  1 million daily active users, with up to 10,000 concurrent users per server.
- **Availability:**  Aim for 99.99% uptime (no more than ~52 minutes of downtime per year).
- **Read-to-Write Ratio:**  High read volume as users fetch messages frequently compared to writing messages.
- **Consistency:**  Messages should appear in real-time for recipients.

# 5. 80/20 Rule in System Design Interviews

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
