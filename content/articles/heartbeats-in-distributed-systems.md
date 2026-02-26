---
title: "HeartBeats: How Distributed Systems Stay Alive"
description: "In a distributed system, things fail."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/heartbeats-in-distributed-systems.md"
dateModified: "2024-04-20"
datePublished: "2024-04-20"
showOnArticles: true
topics:
  - system-design
---

[![image](https://substack-post-media.s3.amazonaws.com/public/images/f2c39719-96d5-4978-86ae-ca948025a2ce_512x512.png)](https://substackcdn.com/image/fetch/$s_!r1D4!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff2c39719-96d5-4978-86ae-ca948025a2ce_512x512.png)

In a distributed system,  **things fail.**

Hardware malfunctions, software crashes, or network connections drop.

Whether you're watching your favorite show online, making an online purchase, or checking your bank balance, you're relying on a complex network of interconnected services.

But, how do we know if a particular service is alive and working as expected?

This is where  **heartbeats**  come into play.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/ce69caff-3a6e-4a0d-ba9c-97f3c07d105d_1162x808.png)](https://substackcdn.com/image/fetch/$s_!6e23!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fce69caff-3a6e-4a0d-ba9c-97f3c07d105d_1162x808.png)

In this article, we'll learn about what heartbeats are, why they're important, how they work, and real-world examples where they're used.

If you’re enjoying this newsletter and want to get even more value, consider becoming a  **[paid subscriber](https://blog.algomaster.io/subscribe)** .

As a paid subscriber, you'll unlock all  **premium articles**  and gain full access to all  **[premium courses](https://algomaster.io/newsletter/paid/resources)**  on  **[algomaster.io](https://algomaster.io)** .

## **What exactly is a Heartbeat?**

> In distributed systems, a heartbeat is a periodic message sent from one component to another to monitor each other's health and status.

Its primary purpose is to signal,  **"Hey, I'm still here and working!"**

This signal is usually a small packet of data transmitted at regular intervals, typically ranging from seconds to minutes, depending on the system's requirements.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/788bfc98-e342-4640-85bf-2f8d3ab54ceb_1320x434.png)](https://substackcdn.com/image/fetch/$s_!3LO1!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F788bfc98-e342-4640-85bf-2f8d3ab54ceb_1320x434.png)

## **Why Do We Need Heartbeats?**

Without a heartbeat mechanism, it's hard to quickly detect failures in a distributed system, leading to:

- Delayed fault detection and recovery
- Increased downtime and errors
- Decreased overall system reliability

Heartbeats can help with:

- **Monitoring** : Heartbeat messages help in monitoring the health and status of different parts of a distributed system.
- **Detecting Failures:**  Heartbeats enable a system to identify when a component becomes unresponsive. If a node misses several expected heartbeats, it's a sign that something might be wrong.
- **Triggering Recovery Actions:**  Heartbeats allow the system to take corrective actions. This could mean moving tasks to a healthy node, restarting a failed component, or letting a system administrator know that they need to step in.
- **Load Balancing** : By monitoring the heartbeats of different nodes, a load balancer can distribute tasks more effectively across the network based on the responsiveness and health of each node.

## **How Do Heartbeats Work?**

The heartbeat mechanism involves two primary components:

1. **Heartbeat sender (Node)** : This is the node that sends periodic heartbeat signals.
2. **Heartbeat receiver (Monitor)** : This component receives and monitors the heartbeat signals.

Here's a simplified overview of the process:

1. The  **node**  sends a heartbeat signal to the  **monitor**  at regular intervals (e.g., every 30 seconds).
2. The monitor receives the heartbeat signal and updates the node's status as  **"alive"**  or  **"available"** .
3. If the monitor doesn't receive a heartbeat signal within the expected timeframe, it marks the node as  **"unavailable"**  or  **"failed".**
4. The system can then take appropriate actions, such as redirecting traffic, initiating failover procedures, or alerting administrators.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/a477d5d9-99b7-4bc1-be0b-6edfea0d06e3_1246x482.png)](https://substackcdn.com/image/fetch/$s_!JKh3!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa477d5d9-99b7-4bc1-be0b-6edfea0d06e3_1246x482.png)

While conceptually simple, heartbeat implementation has a few nuances:

- **Frequency:**  How often should heartbeats be sent? There needs to be a balance. If they're sent too often, they'll use up too much network resources. If they're sent too infrequently, it might take longer to detect problems.
- **Timeout:**  How long should a node wait before it considers another node 'dead'? This depends on expected network latency and application needs. If it's too quick, it might mistake a live node for a dead one, and if it's too slow, it might take longer to recover from problems.
- **Payload:**  Heartbeats usually just contain a little bit of information like a timestamp or sequence number. But, they can also carry additional data like how much load a node is currently handling, health metrics, or version information.

#### **Types of Heartbeats**

There are two primary types of heartbeats:

1. **Push heartbeats** : Nodes actively send heartbeat signals to the monitor.
2. **Pull heartbeats** : The monitor periodically queries nodes for their status.

## **Challenges and Considerations**

While heartbeats are a fundamental part of maintaining system integrity, they are not without challenges:

- **Network Congestion** : If not managed correctly, the constant flow of heartbeat signals can contribute to network congestion.
- **False Positives** : Poorly configured heartbeat intervals might lead to false positives in failure detection, where a slow but functioning component is incorrectly identified as a failed one.
- **Resource Usage** : Continuous monitoring requires computational resources, which must be optimized to prevent undue strain on the system.
- **Split-Brain Scenarios:**  In some rare cases, a network failure can partition a system, and both sides might declare the other dead. This requires more sophisticated failure-handling mechanisms.

## **Heartbeats in Action: Real-World Examples**

- **Database Replication:**  Primary and replica databases often exchange heartbeats to ensure data is synchronized and to trigger failover if the primary becomes unresponsive.
- **Kubernetes:**  In the Kubernetes container orchestration platform, each node sends regular heartbeats to the control plane to indicate its availability. The control plane uses these heartbeats to track the health of nodes and make scheduling decisions accordingly.
- **Elasticsearch:**  In an Elasticsearch cluster, nodes exchange heartbeats to form a gossip network. This network enables nodes to discover each other, share cluster state information, and detect node failures.

Heartbeats are the invisible pulses that keep distributed systems alive and well-coordinated.

So, the next time you encounter a distributed system, take a moment to appreciate the silent guardians – the heartbeats – that work tirelessly to keep the system's pulse steady and strong.



Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
