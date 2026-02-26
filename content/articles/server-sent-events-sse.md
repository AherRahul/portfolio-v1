---
title: "What are Server-Sent Events (SSE)?"
description: "Imagine you’re watching a stock market dashboard. Prices keep changing every second, sometimes multiple times in a second."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/server-sent-events-sse.md"
dateModified: "2025-09-07"
datePublished: "2025-09-07"
showOnArticles: true
topics:
  - system-design
---

Imagine you’re watching a  **stock market dashboard** . Prices keep changing every second, sometimes multiple times in a second.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/424b73b2-58ea-4ad1-8a15-7e1d0200e50d_1537x715.png)](https://substackcdn.com/image/fetch/$s_!Nyxf!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F424b73b2-58ea-4ad1-8a15-7e1d0200e50d_1537x715.png)

Would you prefer hitting refresh constantly, or having updates flow to you automatically?

That’s exactly where  **Server-Sent Events (SSE)**  shine. SSE provides a simple, reliable way for a server to  **continuously push updates**  to a client over a single HTTP connection.

In this article, we’ll break down  **what SSE is, how it works, how it compares to alternatives like WebSockets, and where you’d actually use it in real-world systems** .

# What are Server-Sent Events (SSE)?

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
