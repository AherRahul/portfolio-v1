---
title: "What is Latency and How to Reduce it?"
description: "Latency is the time between a user taking an action—like clicking a button or loading a webpage—and receiving a response from the system."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/latency-and-how-to-reduce-it.md"
dateModified: "2024-12-20"
datePublished: "2024-12-20"
showOnArticles: true
topics:
  - system-design
---

Latency is the time between a user taking an action—like clicking a button or loading a webpage—and receiving a response from the system.

In simple terms, latency is the time delay between:

- When a user makes a request
- When they receive the response

[![image](https://substack-post-media.s3.amazonaws.com/public/images/23aeaa06-f9d2-4986-8062-82ee094db6f1_591x237.png)](https://substackcdn.com/image/fetch/$s_!Mwnv!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F23aeaa06-f9d2-4986-8062-82ee094db6f1_591x237.png) **Visualized using [Multiplayer](https://dub.sh/wbsMNsN)**

Lower latency means faster responses and a better user experience.

In this article, we’ll explore the causes of high latency and how to reduce latency at different layers of your system.

## 📣 [Design, develop and manage distributed software better (Sponsored)](https://dub.sh/u7vLPsh)

[![image](https://substack-post-media.s3.amazonaws.com/public/images/48b92eee-14dd-4229-92a6-49b4b79776b8_1725x1080.png)](https://substackcdn.com/image/fetch/$s_!dDAW!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F48b92eee-14dd-4229-92a6-49b4b79776b8_1725x1080.png)

**[Multiplayer's](https://dub.sh/u7vLPsh)**   **Platform Debugger**  provides deep session replays with every detail you need to find and fix a bug. From frontend screens to backend traces, metrics, and logs, all in one place. Debug faster and fix customer problems more easily, so you and your team can stay focused on building great software, not combing through APM data.

## **What Causes High Latency?**

- **Geographical Distance:**  The farther a user is from your server, the longer data takes to travel. Even though data moves close to the speed of light, crossing thousands of miles takes more time than traveling a few hundred.
- **Overloaded Servers:**  When a server receives more requests than it can handle, it slows down. This overload can happen due to sudden traffic spikes, inefficient resource usage, or inadequate server capacity. As servers struggle to keep up, each request takes longer to process, and latency spikes.
- **Slow Database:**  If your database queries take too long—due to large tables, missing indexes, or poorly written queries—responses take longer.
- **Inefficient Code Paths:**  Sometimes latency hides in the application’s code. Overly complex code, unnecessary calculations, and complicated logic can introduce small delays that add up.
- **Network Congestion:**  Heavy network traffic, limited bandwidth, and busy intermediaries between the user and your server can slow requests. Employing techniques like load balancing across different network paths, using faster protocols (like HTTP/2 or HTTP/3), and minimizing payload sizes can help reduce the impact of congestion.

# **How to Reduce Latency**

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
