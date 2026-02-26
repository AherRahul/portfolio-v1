---
title: "How Load Balancers Actually Work"
description: "A load balancer is one of the most foundational building blocks in distributed systems. It sits between clients and your backend servers and spreads incoming traffic across a pool of machines, so no single server becomes the bottleneck (or the single point of failure)."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/how-load-balancers-actually-work.md"
dateModified: "2026-01-08"
datePublished: "2026-01-08"
showOnArticles: true
topics:
  - system-design
---

A  **load balancer**  is one of the most foundational building blocks in distributed systems. It sits between clients and your backend servers and  **spreads incoming traffic across a pool of machines** , so no single server becomes the bottleneck (or the single point of failure).

But the interesting questions start after the definition:

- How does the load balancer decide which server should handle a request?
- What’s the difference between L4 and L7 Load Balancers?
- What happens when a server slows down or goes offline mid-traffic?
- How can the load balancer ensure that request from the same client always go to the same server?
- And what happens if the load balancer itself goes down?

In this article, we’ll answer these questions and build an intuitive understanding of how load balancers work in real systems.

Let’s start with the basics:  **why we need load balancers in the first place.**

# 1. Why Do We Need Load Balancers?

Imagine a web app with just one server. Every user request hits the same machine.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/4fb6ba4d-93ed-4ad4-ae43-ba982907aebd_460x175.png)](https://substackcdn.com/image/fetch/$s_!iVgQ!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F4fb6ba4d-93ed-4ad4-ae43-ba982907aebd_460x175.png)

It works… until it doesn’t. This “single-server” setup has a few fundamental problems:

1. **Single Point of Failure:**  If the server crashes, your entire application goes down.
2. **Limited Scalability:**  A single server can only handle so many requests before it becomes overloaded.
3. **Poor Performance:**  As traffic increases, response times degrade for all users.
4. **No Redundancy:**  Hardware failures, software bugs, or maintenance windows cause complete outages.

A  **load balancer**  solves these problems by distributing traffic across multiple servers.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/2bce6202-ec2a-4435-a1fe-ca9119015eda_476x284.png)](https://substackcdn.com/image/fetch/$s_!iJQc!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2bce6202-ec2a-4435-a1fe-ca9119015eda_476x284.png)

With this setup, you get:

- **High Availability:**  If one server fails, traffic is automatically routed to healthy servers.
- **Horizontal Scalability:**  You can add more servers to handle increased load.
- **Better Performance:**  Requests are distributed, so no single server is overwhelmed.
- **Zero-Downtime Deployments:**  You can take servers out of rotation for maintenance without affecting users.

***But how does the load balancer decide which server should handle each request?***

# 2. Load Balancing Algorithms

The load balancer uses algorithms to distribute incoming requests. Each algorithm has different characteristics and is suited for different scenarios.

Below are the most common ones you’ll see in real systems.

## 2.1 Round Robin

The simplest algorithm. Requests are distributed to servers in sequential order.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/70cff03e-f5ac-4ce3-8ddf-158dc7530cc3_493x203.png)](https://substackcdn.com/image/fetch/$s_!Bc7a!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F70cff03e-f5ac-4ce3-8ddf-158dc7530cc3_493x203.png)

```
Request 1 → Server A
Request 2 → Server B
Request 3 → Server C
Request 4 → Server A  (cycle repeats)
Request 5 → Server B
...
```

#### Pros:

- Simple to implement
- Works well when all servers have equal capacity
- Predictable distribution

#### Cons:

- Does not account for server load or capacity differences
- A slow request on one server does not affect the distribution

**Best for:**  Homogeneous server environments where all servers have similar specs and requests have similar processing times.

## 2.2 Weighted Round Robin

An extension of Round Robin where servers are assigned weights based on their capacity.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/8327b027-1d8f-4589-9037-52428f3447ac_504x223.png)](https://substackcdn.com/image/fetch/$s_!uczx!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8327b027-1d8f-4589-9037-52428f3447ac_504x223.png)

```
Server A (weight=3): Handles 3 out of every 6 requests
Server B (weight=2): Handles 2 out of every 6 requests
Server C (weight=1): Handles 1 out of every 6 requests
```

#### Pros:

- Still simple
- Better for mixed instance sizes (e.g., 2 vCPU + 4 vCPU + 8 vCPU)

#### Cons:

- Still not load-aware in real time
- If one server becomes slow (GC pause, noisy neighbor, warm cache vs cold cache), it will still get its scheduled share

**Best for:**  Heterogeneous environments where servers have different capacities (e.g., different CPU, memory, or network bandwidth).

## 2.3 Least Connections

Routes requests to the server with the fewest active connections.

This algorithm is  **dynamic** , it considers the current state of each server rather than using a fixed rotation.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/84d04287-a773-401e-9011-87f9c15533f1_483x333.png)](https://substackcdn.com/image/fetch/$s_!D0s8!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F84d04287-a773-401e-9011-87f9c15533f1_483x333.png)

```
Server A: 10 active connections
Server B: 5 active connections  ← Next request goes here
Server C: 8 active connections
```

#### Pros:

- Adapts to varying request processing times
- Naturally balances load when some requests take longer than others

#### Cons:

- Requires tracking connection counts for each server
- Slightly more overhead than Round Robin

**Best for:**  Applications where request processing times vary significantly (e.g., database queries, file uploads).

## 2.4 Weighted Least Connections

Combines Least Connections with server weights. The algorithm considers both the number of active connections and the server’s capacity.

```
Score = Active Connections / Weight

Server A: 10 connections, weight 5 → Score = 2.0
Server B: 6 connections, weight 2  → Score = 3.0
Server C: 4 connections, weight 1  → Score = 4.0

Next request goes to Server A (lowest score)
```

#### Pros:

- Works well for mixed instance sizes  *and*  mixed request durations
- More robust than either “weighted” or “least connections” alone

#### Cons:

- Needs reliable tracking + weight tuning
- Still uses connections as a proxy for load (not always perfect)

**Best for:**  Heterogeneous environments with varying request processing times.

## 2.5 IP Hash

The client’s IP address is hashed to determine which server handles the request. The same client IP always goes to the same server.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/fabb590c-7c5e-45b0-a598-f35d9e5b66d0_488x332.png)](https://substackcdn.com/image/fetch/$s_!D4NK!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffabb590c-7c5e-45b0-a598-f35d9e5b66d0_488x332.png)

```
hash(192.168.1.10) % 3 = 1 → Server B
hash(192.168.1.20) % 3 = 0 → Server A
hash(192.168.1.30) % 3 = 2 → Server C
```

#### Pros:

- Simple session persistence without cookies
- No additional state to track

#### Cons:

- Uneven distribution if IP addresses are not uniformly distributed
- Server additions/removals cause redistribution of clients

**Best for:**  Applications requiring basic session persistence without cookie support.

## 2.6 Least Response Time

Routes requests to the server with the fastest response time and fewest active connections.

The load balancer continuously measures:

- Average response time for each server
- Number of active connections

#### Pros

- Optimizes for perceived performance
- Can avoid slow/unhealthy servers before they fully fail

#### Cons

- Highest operational complexity (needs continuous measurement and smoothing)
- Can “overreact” to noise without careful tuning (feedback loops)
- Requires good metrics and stable observation windows

**Best for:**  Latency-sensitive applications where response time is critical.

# 3. Layer 4 vs Layer 7 Load Balancing

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
