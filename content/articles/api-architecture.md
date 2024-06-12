---
title: "API Architecture - Design Best Practices for REST APIs"
description: "REST which stands for Representational State Transfer is an architectural style that governs how APIs are designed and built. REST’s popularity and ease of implementation make it the most preferred API architectural style for modern-day software development as compared to other protocols such as SOAP (simple object access protocol). REST APIs or RESTful web services have become the backbone for efficient communication between client and server in modern-day software development. However, to build efficient and robust REST APIs, it is crucial to follow some standard best practices. In this blog, we’ll explore REST API best practices that can help you build scalable, maintainable, secure, and robust APIs."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/api-architecture.md"
dateModified: "2024-05-26"
datePublished: "2024-05-26"
topics:
  - system-design
  - aws
  - lld
---

REST which stands for Representational State Transfer is an architectural style that governs how APIs are designed and built. REST’s popularity and ease of implementation make it the most preferred API architectural style for modern-day software development as compared to other protocols such as SOAP (simple object access protocol).

REST APIs or RESTful web services have become the backbone for efficient communication between client and server in modern-day software development. However, to build efficient and robust REST APIs, it is crucial to follow some standard best practices.

In this blog, we’ll explore REST API best practices that can help you build scalable, maintainable, secure, and robust APIs.


## API Architecture - Design Best Practices for REST APIs

In general, web services have been in existence for just as long as the HTTP protocol has existed. But, since the advent of cloud computing, they have become the ubiquitous method of enabling client interaction with services and data.

As a developer, I have been lucky enough to work with some SOAP services that are still around @ work. But, I’ve largely played with REST, which is a resource-based architectural style for developing APIs and web services.

For a great chunk of my career, **I have been involved in projects either building, designing, and using APIs.**

Most of the APIs I have seen “claimed” to be **“RESTful”** — _meaning compliant with the principles and constraints of REST architecture_.

Yet, there are a few handful I have worked with that give **REST a very, very bad rep.**

Inaccurate usage of HTTP status codes, plain text responses, inconsistent schemas, verbs inserted in the endpoints… **I feel like I’ve seen it all** (or at least, a good chunk).

So, I decided to write up a piece describing what I personally think are some **best practices when it comes to designing REST APIs.**

Just so we’re clear…

I do not claim to be the authority, or mean to infer that the following practices are 100% in sync with any “holy REST principles” (_if there even is such a thing in existence_). I have pieced these thoughts from my own experiences building, and working with different APIs throughout my career.

Also, I do not pretend to have mastered REST API design, either! I believe it is an **art/sport** — the more you practice, the better you get.

I will list out some code snippets as “examples of bad design”. If they look like something you would write, that’s fine! 🙂 The only thing that matters is that we learn together.

Here are some tips, advice, and guidance to designing great REST APIs that will make your consumers (and developers) happy.



## 1. Learn the basics of HTTP

If you aspire to build a well-designed **REST API**, you must know the basics of the **HTTP protocol**. I firmly believe **this will help you make good design choices.**

I find the Overview of HTTP on the Mozilla Developer Network docs to be a pretty comprehensive reference for this topic.

Although, as far as REST API design is concerned, here is a TLDR of HTTP applied to RESTful Design:

HTTP has verbs (actions or methods): GET, POST, PUT, PATCH and DELETE are most common.
REST is resource-oriented and a resource is represented by an URI: /library/
An endpoint is the combination of a verb and an URI, example: GET: /books/
An endpoint can be interpreted as an action performed on a resource. Example: POST: /books/ may mean "Create a new book".
At a high-level, verbs map to CRUD operations: GET means Read, POST means Create, PUT and PATCH mean Update, and DELETE means Delete
A response’s status is specified by its status code: 1xx for information, 2xx for success, 3xx for redirection, 4xx for client errors and 5xx for server errors
Of course you can use other things the HTTP protocol offers for REST API design, but these are the basic things I believe you must keep in mind.

## 2. Do not return plain text


























---

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.

