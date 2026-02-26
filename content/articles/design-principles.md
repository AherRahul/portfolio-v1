---
title: "Design Principles Every Developer Should Know"
description: "In software development, certain principles stand as the bedrock for writing code that is not only functional but also clean, maintainable, and efficient."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/design-principles.md"
dateModified: "2024-08-25"
datePublished: "2024-08-25"
showOnArticles: true
topics:
  - dsa
---

In software development, certain principles stand as the bedrock for writing code that is not only functional but also  **clean, maintainable, and efficient** .

In this article, we will explore  **9 such software design principles**  every developer should have in their toolkit.

## **1. Keep It Simple, Stupid (KISS)**

The KISS principle advocates for  **simplicity**  in design and implementation.

Complex code is harder to understand, maintain, and debug. By keeping your code simple, you make it more readable and reduce the likelihood of errors.

**Example:**  Consider a function that checks if a number is even:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/715ac582-08be-4b8f-bd49-a6296e89be24_3912x1704.png)](https://substackcdn.com/image/fetch/$s_!3XjM!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F715ac582-08be-4b8f-bd49-a6296e89be24_3912x1704.png)

The simplified version is easier to read and understand.

## **2. Don't Repeat Yourself (DRY)**

The DRY principle advocates for  **reducing repetition**  in code.

When you find yourself writing similar code in multiple places, it's a sign that you should refactor your code to eliminate redundancy.

By abstracting similar code into a single location, such as a function or class, you make your code more  **maintainable**  and reduce the risk of introducing bugs when changes are needed.

**Example:** Imagine you're writing a program that needs to greet different types of users visiting your website.

Without applying the DRY principle, you might write something like this:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/1f70a00d-6878-49f6-8d29-a6611fa65a9f_2255x1602.png)](https://substackcdn.com/image/fetch/$s_!lm9_!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1f70a00d-6878-49f6-8d29-a6611fa65a9f_2255x1602.png)

In this code, we're repeating the first two lines in each function.

Applying the DRY principle, we can refactor this to:

[![image](https://substack-post-media.s3.amazonaws.com/public/images/c7fc8a12-98d8-4013-8ad0-b62326a46d70_2143x1602.png)](https://substackcdn.com/image/fetch/$s_!LRA7!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc7fc8a12-98d8-4013-8ad0-b62326a46d70_2143x1602.png)

By creating a basic_greeting function, we've eliminated the repetition of the common greeting lines.

## **3. You Aren't Gonna Need It (YAGNI)**

YAGNI is a principle that warns against  **over-engineering** .

Developers often anticipate future requirements and add unnecessary functionality, which increases complexity and maintenance overhead.

YAGNI advises you to implement only what you need now, not what you might need later.

> **Example:**  Suppose you're building a simple calculator app, and you're tempted to add features for advanced scientific calculations. YAGNI would suggest focusing on the basic arithmetic operations until there's a clear requirement for advanced features.

## **4. Encapsulate What Varies**

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
