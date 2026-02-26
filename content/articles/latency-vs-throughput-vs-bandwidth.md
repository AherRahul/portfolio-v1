---
title: "Latency vs. Throughput vs. Bandwidth"
description: "Latency, throughput, and bandwidth are the core metrics that describe the performance of a network or distributed system."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/latency-vs-throughput-vs-bandwidth.md"
dateModified: "2025-11-13"
datePublished: "2025-11-13"
showOnArticles: true
topics:
  - system-design
---

Latency, throughput, and bandwidth are the core metrics that describe the performance of a network or distributed system.

Together they determine how fast the first byte arrives, how much data you can move per second, and the maximum capacity of the path.

Let’s understand them with the  **highway analogy** .

[![image](https://substack-post-media.s3.amazonaws.com/public/images/8d4178a8-233c-4a58-9455-78c56c6dc7a1_786x747.png)](https://substackcdn.com/image/fetch/$s_!4JMb!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8d4178a8-233c-4a58-9455-78c56c6dc7a1_786x747.png)

- **Bandwidth:**  The number of lanes on the highway (e.g., 5 lanes). This is the maximum physical capacity of the road.
- **Latency:**  The time it takes one car to drive from Exit 1 to Exit 10 at the speed limit with no traffic.
- **Throughput:**  The total number of cars that pass Exit 10 per hour.

Now, consider a traffic jam (congestion).

- The  **bandwidth**  stays the same. The road still has 5 lanes.
- The  **latency**  (travel time) rises for every car because travel takes longer.
- The  **throughput**  (cars per hour) drops because fewer cars clear the exit per hour.

Networks behave the same way. Congestion increases latency and reduces throughput even when raw bandwidth does not change.

Lets now explore them in more detail.

# Understanding Latency

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
