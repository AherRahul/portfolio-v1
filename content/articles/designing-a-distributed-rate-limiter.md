---
title: "Designing a Distributed Rate Limiter"
description: "A rate limiter is a mechanism used to control the number of requests or operations a user, client, or system can perform within a specific time window."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/designing-a-distributed-rate-limiter.md"
dateModified: "2025-06-15"
datePublished: "2025-06-15"
showOnArticles: true
topics:
  - system-design
---

A  **rate limiter**  is a mechanism used to  **control the number of requests or operations**  a user, client, or system can perform  **within a specific time window** .

Its primary purpose is to ensure  **fair usage**  of resources,  **prevent abuse** , and  **protect backend systems**  from being overwhelmed by sudden spikes in traffic.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/4a0b1d0d-dee3-4e9f-9835-458afd804676_1704x436.png)](https://substackcdn.com/image/fetch/$s_!wrg2!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F4a0b1d0d-dee3-4e9f-9835-458afd804676_1704x436.png)

> **Example:**  If a system allows a maximum of  **100 requests per minute** , any request beyond that limit within the same minute would either be  **throttled (delayed)**  or  **rejected outright** , often with an HTTP 429 Too Many Requests response.

In this article, we will dive into the system design of a  **distributed rate limiter** , and explore the the 5 most commonly used  **rate limiting algorithms** with examples, pros and cons.

# 1. Requirements

Before diving into the architecture, lets outline the functional and non-functional requirements:

## 1.1 Functional Requirements

- **Per-User Rate Limiting:** Enforce a fixed number of requests per user or API key within a defined time window (e.g., 100 requests per minute). Excess requests should be rejected with an HTTP 429 Too Many Requests.
- **Global Enforcement:** Limits must be enforced consistently across all nodes in a distributed environment. Users shouldn't bypass limits by switching servers.
- **Multi-Window Support:** Apply limits across multiple time granularities simultaneously (e.g., per second, per minute, per hour) to prevent abuse over short and long bursts.

## 1.2 Non-Functional Requirements

To be usable at scale, our distributed rate-limiter must meet several critical non-functional goals:

- **Scalability:** The system should scale horizontally to handle massive request volumes and growing user counts.
- **Low Latency:** Rate limit checks should be fast ideally adding no more than a few milliseconds per request.
- **High Availability:** The rate-limiter should continue working  even under heavy load or node failures. There should be no single point of failure.
- **Strong Consistency:** All nodes should have a  **consistent view**  of each user’s request counts. This prevents a client from bypassing limits by routing requests through different servers.
- **High Throughput:** The system should support a large number of operations per second and serve many concurrent clients without significant performance degradation.

# 2. High-Level Architecture

[![image](https://substack-post-media.s3.amazonaws.com/public/images/549be802-c386-49ca-a3ea-5c17b147f413_1940x982.png)](https://substackcdn.com/image/fetch/$s_!ofEs!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F549be802-c386-49ca-a3ea-5c17b147f413_1940x982.png)

The  **rate limiter**  acts as a  **middleware layer**  between the client and the backend servers. Its job is to inspect incoming requests and enforce predefined usage limits (e.g., 100 requests per minute per user or IP).

To apply these limits effectively, the rate limiter must  **track request counts**  for each client. These counts are often maintained across  **multiple time windows** , such as per second, per minute, or per hour.

Using a  **traditional relational database**  for this purpose is generally unsuitable due to:

- **High latency** : Relational databases involve disk I/O, which introduces delays on every read/write.
- **Concurrency bottlenecks** : Handling thousands of concurrent updates (e.g., one per incoming request) can lead to locks and race conditions.
- **Limited throughput** : RDBMSs are not optimized for high-frequency, real-time counter updates.

An  **in-memory data store**  like  **Redis**  is a far better fit for rate limiting use cases because it offers:

- **Sub-millisecond latency**  for both reads and writes
- **Atomic operations**  like INCR, INCRBY, and EXPIRE, ensuring safe concurrent updates without race conditions
- **TTL (Time-to-Live) support** , allowing counters to reset automatically at the end of each time window (e.g., after 60 seconds for a per-minute limit)

### Request Lifecycle

Here’s how the rate limiter fits into the flow of an incoming request:

1. **Client sends request**  to an endpoint of the application.
2. The  **rate limiter middleware**  performs several checks:

- Identifies the client (via IP, token, or API key)
- Looks up the current request count in Redis (or in-memory cache)
- Applies any  **tier-specific rules**  (e.g., free vs premium users)
3. If the count  **exceeds the allowed threshold** , the request is  **rejected**  with HTTP 429 Too Many Requests.
4. If the count is  **within the limit** , the counter is incremented and the request proceeds to the backend service.
5. Periodically,  **counters expire**  via TTL or are reset based on window granularity.

> Many modern applications delegate rate limiting to  **edge components**  such as  **API gateways**  or  **reverse proxies** , which can efficiently enforce limits before traffic reaches backend services. However, for this discussion, we will focus on designing a  **standalone rate limiter**  that is integrated into or called by  **application servers**  directly.

# 3. Design Deep Dive

## 3.1 Single-Node Rate Limiting

For small-scale applications with  **low traffic and a single application server** , rate limiting can be implemented entirely  **in-memory** , without relying on external systems like Redis. This approach is lightweight, fast, and easy to set up.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/a79b0735-cbfe-4628-84d3-cbf5325ba14e_1164x498.png)](https://substackcdn.com/image/fetch/$s_!8iax!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa79b0735-cbfe-4628-84d3-cbf5325ba14e_1164x498.png)

You maintain a simple  **hash map (dictionary)**  in the application process where:

- **Keys**  represent client identifiers (e.g., user ID, API key, or IP address)
- **Values**  represent request counts within the current time window

For each incoming request:

1. Checks if the user exists in the map
2. If not, create a new entry with a count of 1
3. If the user exists, increments their counter
4. Compare the count against the defined rate limit
5. If the count is within the limit, allow the request; otherwise, reject it

You can also add a time-based mechanism (e.g., timestamps or TTL logic) to reset counters after each time window.

Despite its simplicity, this approach comes with  **critical drawbacks**  that make it unsuitable for production environments at scale:

1. **Single Point of Failure (SPOF):** If the server crashes, all in-memory counters are lost. After a restart, the system "forgets" users' recent request history potentially allowing them to exceed their limits until the counters rebuild.
2. **No Horizontal Scalability:** The rate limiter lives on a  **single node** so it doesn’t scale with traffic.
3. **Unbounded Memory Growth:** Without proper eviction or TTL logic, memory usage can grow unbounded over time, especially if you're tracking many users or long-duration windows.

Now, lets explore two common strategies to implement rate limiting in a distributed environment.

## 3.2 Distributed Rate Limiting

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
