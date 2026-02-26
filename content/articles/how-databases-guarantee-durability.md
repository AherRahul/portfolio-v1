---
title: "How Databases Guarantee Durability (Even After Crashes)"
description: "One of the things that make databases truly powerful is their ability to protect your data even in the face of unexpected failures."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/how-databases-guarantee-durability.md"
dateModified: "2025-04-29"
datePublished: "2025-04-29"
showOnArticles: true
topics:
  - databases
  - system-design
---

One of the things that make databases truly powerful is their ability to  **protect your data**  even in the face of unexpected failures.

Whether the database server  **crashes** ,  **restarts** , or there’s a sudden  **power outage** , you can trust that your committed data won’t simply disappear.

This promise is known as  **Durability**  — one of the four essential  **ACID**  properties of databases.

***But, what does it actually take to make a database durable?***

In this article, we'll explore  **three key techniques**  databases use to ensure durability.

# 1. Write-Ahead Logging (WAL)

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
