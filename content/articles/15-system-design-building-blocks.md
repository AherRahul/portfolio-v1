---
title: "15 System Design Building Blocks You Should Know"
description: "System design can feel complex, but once you understand its fundamental building blocks and how to stitch them together, everything falls into place."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/15-system-design-building-blocks.md"
dateModified: "2024-10-17"
datePublished: "2024-10-17"
showOnArticles: true
topics:
  - system-design
---

System design can feel complex, but once you understand its  **fundamental building blocks**  and how to  **stitch them together** , everything falls into place.

In this post, we’re going to break down the  **top 15 building blocks**  of system design, every developer should know.

Knowing these will help you make sense of a large system and help you in answering your next system design interview problem.

## 1. Load Balancers

[![image](https://substack-post-media.s3.amazonaws.com/public/images/903575a9-fd4c-46d6-a098-e634439ae450_319x195.png)](https://substackcdn.com/image/fetch/$s_!9GG-!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F903575a9-fd4c-46d6-a098-e634439ae450_319x195.png) **Visualized using [Multiplayer](https://dub.sh/vGpRfMk)**

**Load balancers**  distribute incoming requests across  **multiple servers**  to ensure no single server bears too much load. It helps maintain  **availability**  and  **reliability**  by automatically rerouting traffic if a server fails.

Use it when your application grows beyond the capacity of a single server and needs  **horizontal scaling**  to maintain performance and availability.

**Types:**

- **Layer 4 Load Balancers:**  Operate at the transport layer (e.g., TCP, UDP).
- **Layer 7 Load Balancers:**  Operate at the application layer (e.g., HTTP, HTTPS).

> **Examples:**  Nginx, HAProxy,  **AWS ELB**

## 2. Reverse Proxy

[![image](https://substack-post-media.s3.amazonaws.com/public/images/1d503862-79ef-4093-9423-68429a80b68c_807x441.png)](https://substackcdn.com/image/fetch/$s_!gDi5!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1d503862-79ef-4093-9423-68429a80b68c_807x441.png) **Visualized using [Multiplayer](https://dub.sh/vGpRfMk)**

A  **reverse proxy**  acts as an intermediary between clients and servers. It forwards client requests to appropriate backend servers and then returns the server's response back to the client.

It  **enhances security**  by hiding the backend servers and  **optimizes performance**  through caching.

> **Example:**  Cloudflare acts as a reverse proxy for websites, securing and accelerating content delivery by caching resources and blocking malicious traffic.

## 3. Domain Name System (DNS)



Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
