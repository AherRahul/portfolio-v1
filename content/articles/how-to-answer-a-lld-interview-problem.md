---
title: "How to Answer a LLD Interview Problem"
description: "Low Level Design (LLD) or Object Oriented Design (OOD) interview tests your ability to translate high-level requirements into detailed class structures, methods and their interactions using object-oriented design principles."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/how-to-answer-a-lld-interview-problem.md"
dateModified: "2024-07-11"
datePublished: "2024-07-11"
showOnArticles: true
topics:
  - dsa
---

**Low Level Design (LLD)**  or  **Object Oriented Design (OOD)**  interview tests your ability to translate high-level requirements into detailed class structures, methods and their interactions using  **object-oriented design principles** .

This article will guide you through a  **step-by-step**  approach to answer LLD interview questions effectively using an example problem:  **Design Stack Overflow** .

[![image](https://substack-post-media.s3.amazonaws.com/public/images/e0a8f7e2-4c90-4149-8cc7-cae3dcea1ab5_3752x2444.png)](https://substackcdn.com/image/fetch/$s_!wcWb!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe0a8f7e2-4c90-4149-8cc7-cae3dcea1ab5_3752x2444.png)

If you’re enjoying this newsletter and want to get even more value, consider becoming a  **[paid subscriber](https://blog.algomaster.io/subscribe)** .

As a paid subscriber, you'll unlock all  **premium articles**  and gain full access to all  **[premium courses](https://algomaster.io/newsletter/paid/resources)**  on  **[algomaster.io](https://algomaster.io)** .

# Step 1: Clarify Requirements

The first step in a LLD interview is to understand the  **requirements**  and  **use-cases** .

Start by asking questions to understand what's required:

- What are the  **core features**  we need to support?
- Are there any specific features we should  **prioritize** ?
- Who are the  **primary users**  of this system?
- What  **actions**  can users take?
- Are there any specific  **constraints**  or  **limitations** ?
- Do we need to handle  **concurrency** ?
- Do we need to handle errors, edge cases, exceptions, and unexpected input?

For our  **Stack Overflow design** , we might ask:

- Do we need comments on questions and answers?
- Should we implement tagging for questions?
- Should we design the voting system for questions and answers?
- Should we include a search functionality for questions and answers?
- Should we limit the length of questions?

[![image](https://substack-post-media.s3.amazonaws.com/public/images/b0b3dab5-ee93-4c9a-8f3d-bc02c444a4d4_1908x1566.png)](https://substackcdn.com/image/fetch/$s_!CmxB!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb0b3dab5-ee93-4c9a-8f3d-bc02c444a4d4_1908x1566.png)https://stackoverflow.com/questions/49002/prefer-composition-over-inheritance

Let’s assume the interviewer wants us to focus on:

- Users can post questions, answer questions, and comment on questions and answers.
- Users can vote on questions and answers.
- Questions should have tags associated with them.
- Users can search for questions based on keywords, tags, or user profiles.
- The system should assign reputation score to users based on their activity and the quality of their contributions.

# Step 2: Identify Entities

After you are clear with the requirements, break down the problem and identify the  **core entities**  or  **objects**  you need to have in the design.

Core entities are the key objects or concepts around which your system is built.

These entities will become the classes in your object-oriented design. Think of them as the  **nouns**  in the problem description.

For Stack Overflow, different entities we can have are:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/a4f36d13-109a-494a-8810-6618cb7b54b3_2568x880.png)](https://substackcdn.com/image/fetch/$s_!dfPg!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa4f36d13-109a-494a-8810-6618cb7b54b3_2568x880.png)

# Step 3: Class Design

After identifying the core entities, the next step is to design the  **classes, enums**  and  **interfaces**  that will represent the entities in your system.

### **3.1 Define classes and relationships**

Translate entities into classes and come up with a  **list of attributes**  you want to have in those classes.

If your design consists of multiple classes, figure out how would they would relate with each other.

In our Stack Overflow example, here are some of the relationships between classes:

- A User can ask many Questions, provide many Answers and add many Comments.
- A Question can have many Answers, Comments, Tags and Votes.
- An Answer can have many Comments and Votes.
- A Comment is composed within a Question or an Answer.
- A Tag is composed within a Question.

You can draw a  **UML class diagram**  to illustrate the relationships between classes or code the class structure directly in an  **object oriented programming language**  of your choice.

> **Note:**  Drawing UML diagrams in a LLD interview is not mandatory but it’s good to check with the interviewer.

If you want to learn about UML class diagrams, check out this article:

Here’s how we might define classes, their list of attributes and relationships:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/2a5c73cd-bdc9-4c98-8c03-bea3aa5711c8_2902x1568.png)](https://substackcdn.com/image/fetch/$s_!lg9d!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2a5c73cd-bdc9-4c98-8c03-bea3aa5711c8_2902x1568.png)

### **3.2 Define interfaces and core methods**

After you've outlined the classes, their attributes and the relationship between classes, the next step is to define  **interfaces**  and  **core methods**  in each of the classes.

These methods encapsulate the  **actions or behaviors**  that each class is responsible for. Essentially, they are the  **verbs**  associated with your entities.

Since both Question and Answer classes need to support  **comments**  and  **votes** , we can define  **interfaces**  for these features.

Here are the interfaces we can have in our design:

- **Commentable:** Defines the contract for objects that can receive comments (eg. Question, Answer). **addComment(comment):** Adds a comment to this object. **getComments():** Retrieves all comments for this object.
- **addComment(comment):** Adds a comment to this object.
- **getComments():** Retrieves all comments for this object.
- **Votable:** Defines the contract for objects that can be voted on. **vote():** Registers a vote on this object. **getVoteCount():** Retrieves the total vote count for this object.
- **vote():** Registers a vote on this object.
- **getVoteCount():** Retrieves the total vote count for this object.

Each class need to have  **methods**  for the tasks it can perform.

Here are the core method for Stack Overflow classes:

- User Class: **askQuestion(title, content, tags):** Creates a new question asked by this user. **answerQuestion(question, content):** Creates a new answer by this user for the given question. **addComment(commentable, comment):** Adds a comment by this user to a question or answer. **updateReputation(value):** Updates the user's reputation score.
- **askQuestion(title, content, tags):** Creates a new question asked by this user.
- **answerQuestion(question, content):** Creates a new answer by this user for the given question.
- **addComment(commentable, comment):** Adds a comment by this user to a question or answer.
- **updateReputation(value):** Updates the user's reputation score.
- Question Class: **addAnswer(answer):** Adds an answer to this question. **addComment(comment):** Adds a comment to this question. **vote(user, value):** Registers a vote on this question. **addTag(user, value):** Adds a tag to this question.
- **addAnswer(answer):** Adds an answer to this question.
- **addComment(comment):** Adds a comment to this question.
- **vote(user, value):** Registers a vote on this question.
- **addTag(user, value):** Adds a tag to this question.
- Answer Class: **addComment(comment):** Adds a comment to this answer. **vote(user, value):** Registers a vote on this answer. **markAsAccepted():** Marks this answer as accepted.
- **addComment(comment):** Adds a comment to this answer.
- **vote(user, value):** Registers a vote on this answer.
- **markAsAccepted():** Marks this answer as accepted.

I have left the  **setter/getter**  methods to keep it short.

### 3.3 Define a central class

We don’t want to manipulate classes in our design directly from outside, that’s why we need a central class that provides a unified interface for interacting with the system.

This simplifies the API and makes it easier to use and understand the system as a whole.

For our Stack Overflow design, we can create a class called  **StackOverflow** that will serve as the central coordinator for the entire system. It manages the creation, retrieval, and interaction of all major components.

Here are some of it’s key responsibilities:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/559820ae-5bdb-4a0e-b8e4-5e415d7952cb_2152x880.png)](https://substackcdn.com/image/fetch/$s_!IqYK!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F559820ae-5bdb-4a0e-b8e4-5e415d7952cb_2152x880.png)

We can have following core methods in the  **StackOverflow** class:

- **createUser(username, email):** Creates and registers a new user in the system.
- **askQuestion(user, title, content, tags):** Allows a user to ask a new question.
- **answerQuestion(user, question, content):** Allows a user to answer an existing question.
- **addComment(user, commentable, content):** Allows a user to add a comment on an existing question/answer.
- **voteQuestion(user, question, value):** Registers a vote on a question.
- **voteAnswer(user, answer, value):** Registers a vote on an answer.
- **acceptAnswer(answer):** Mark an answer as accepted
- **searchQuestions(query):** Searches for questions based on a query string.
- **getQuestionsByUser(user):** Searches questions added by a user.

# Step 4: Implementation

Once you have defined the class structure, it’s time to start implementing the full solution.

### 4.1 Follow good coding practices

While writing the code for a LLD interview problem, you should try your best to follow good coding principles like:

- Use meaningful names for classes, methods, and variables.
- Focus on simplicity and readability.
- Favor composition over inheritance to promote flexibility and avoid tight coupling.
- Avoid duplicating code or logic.
- Use interfaces to define contracts and enable loose coupling between components.
- Only implement what is required.
- Strive for modularity and separation of concerns to make the codebase maintainable and scalable.
- Apply design principles and design patterns wherever necessary.
- Make your code scalable so that it performs well with large data sets.

### 4.2 Implement necessary methods

You may not have enough time to implement all the methods. Check with the interviewer to understand which methods are important for the interview.


### 4.3 Address concurrency

In a system that serves multiple users simultaneously, we may need to handle  **race conditions**  and other concurrency related issues.

Check with the interviewer if you need to handle concurrency in the design.

Here are few strategies to address concurrency:

- Use  **synchronization**  mechanisms to ensure that only one thread can access a shared resource at a time.
- Use  **atomic operations**  that are guaranteed to be executed as a single, indivisible unit.
- Use  **immutable objects**  where possible to eliminate the risk of concurrent modifications.
- Use  **thread-safe data structures**  that handle synchronization internally.

For Stack Overflow example, here are few concurrency considerations:

- **Voting System** : Implement atomic operations for vote counts to prevent race conditions.
- **Comment System** : Use a thread-safe data structure for storing and retrieving comments.
- **User Reputation** : Use synchronization when updating user reputation to ensure consistency.

# Step 5: Exception Handling

The problem may require you to handle  **errors** ,  **edge cases** ,  **exceptions** , and  **unexpected input** .

For the Stack Overflow example, here are some of the scenarios which you may want to handle in your design:

- What if a user tries to vote on their own question/answer?
- What is a user tries to vote multiple times on the same content?
- What if a user posts a question with empty title or content?
- Can the user reputation go negative?

## Final Note

These steps should guide you to remain on track and cover the different aspects when answering a LLD interview problem.

But you may skip some of these due to limited time in interviews.

> It’s always a good idea to check with the interviewer on what all is expected from the design.




Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
