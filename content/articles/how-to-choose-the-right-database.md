---
title: "How to Choose the Right Database in a System Design Interview"
description: "In system design interviews, the quality of your design and its ability to scale depends heavily on the database you choose."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/how-to-choose-the-right-database.md"
dateModified: "2024-12-26"
datePublished: "2024-12-26"
showOnArticles: true
topics:
  - system-design
---

In  **system design interviews** , the quality of your design and its ability to scale depends heavily on the  **database**  you choose.

Choosing the wrong database can lead to high latency, data loss, or even system downtime.

In this article, we will cover the  **9 most common**   **use cases**  that come up often in system design interviews and explore the best databases for each scenario.

## 1. Structured Data Requiring ACID Compliance

Consider a major online marketplace like  **Amazon**  or  **Flipkart** , which processes millions of transactions daily.

Each order involves multiple interdependent operations:

- Selecting a product.
- Updating inventory.
- Deducting payment from the customer.
- Recording the sale for accounting and analytics.

These operations need  **strong consistency**  and  **ACID**  transactions to avoid any data anomalies or transaction failures.

- **Atomicity**  ensures that if you fail to charge the customer’s credit card, you won’t ship the item.
- **Consistency**  guarantees that the product count never goes negative if the system runs out of stock.
- **Isolation**  prevents two customers from purchasing the last item at the exact same time.
- **Durability**  ensures that once a payment is processed, you can’t lose that record if the server crashes the next second.

#### Recommended Database -  **Relational Database**

When you need strict data consistency and a well-defined schema,  **relational databases**  like  **MySQL**  or  **PostgreSQL**  are often the best choice.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/2ad24c6e-7bf6-4824-843f-99f2b5158533_302x263.png)](https://substackcdn.com/image/fetch/$s_!tx30!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2ad24c6e-7bf6-4824-843f-99f2b5158533_302x263.png) **Visualized using [Multiplayer](https://dub.sh/Fw9DLdZ)**

These databases are specifically designed to enforce relationships, constraints, and transactional guarantees.

## 2. Flexible Schema

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
