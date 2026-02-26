---
title: "Top 15 Strategies to Reduce Latency"
description: "Latency is the time it takes for a system to respond to a user's action. In simple terms, it’s the delay between:"
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/top-15-strategies-to-reduce-latency.md"
dateModified: "2025-04-24"
datePublished: "2025-04-24"
showOnArticles: true
topics:
  - system-design
---

**Latency**  is the time it takes for a system to respond to a user's action. In simple terms, it’s the  **delay between** :

- When a user makes a request
- And when they receive a response

[![image](https://substack-post-media.s3.amazonaws.com/public/images/23aeaa06-f9d2-4986-8062-82ee094db6f1_591x237.png)](https://substackcdn.com/image/fetch/$s_!Mwnv!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F23aeaa06-f9d2-4986-8062-82ee094db6f1_591x237.png)

Even small delays can have a significant impact. To put it into perspective:

> Amazon estimates that every 1-second increase in latency could cost them $1.6 billion in annual sales.

On the flip side,  **low latency**  means smoother interactions, and a better overall user experience.

In this article, we’ll explore

- The **different types of latency**  that exist across your stack
- And the **top 15 strategies**  to reduce latency

# Types of Latency

## 1. Network Latency

**Network latency**  is the time it takes for data to travel across a network—from the client (e.g., a browser or mobile app) to the server and back. It’s often the  **first and most noticeable form of latency**  a user experiences.

#### What Causes High Network Latency?

1. **Physical Distance:** Data travels at near the speed of light, but if your server is in New York and your user is in Sydney, that distance adds real delay.
2. **DNS Resolution Time:** Before the request even hits your app, the domain must be resolved into an IP address. Poor DNS configuration or slow DNS providers can add 20–100ms.
3. **TCP Handshake & TLS Negotiation:** Establishing a connection (especially over HTTPS) requires multiple back-and-forth steps.
4. **Packet Routing & Congestion:** Packets may take inefficient routes or hit overloaded network segments.
5. **Firewall and Proxy Overhead:** Security appliances or proxies along the path can introduce additional hops and inspection delays.

## 2. Application Latency

**Application latency**  is the time your backend system takes to:

1. **Receive**  a request (after it hits the server)
2. **Process**  the request (run logic, call services, query databases)
3. **Generate**  a response and send it back

It’s the delay  **introduced by the backend code**  and often one of the biggest contributors to total latency in a system.

#### What Causes High Application Latency?

1. **Inefficient Business Logic:** Poorly written algorithms, redundant loops, or unoptimized code paths
2. **Blocking Operations:** Synchronous calls to databases, APIs, or file systems without using async/concurrent patterns
3. **Service-to-service Chaining (Microservices):** If one API calls another which calls another, latency compounds quickly
4. **Poor Error Handling or Retries:** Excessive retries or long timeouts can delay responses unnecessarily
5. **Lack of Caching:** Recomputing results that could have been fetched from cache
6. **Heavy Serialization/Deserialization:** Large JSON payloads, XML parsing, or inefficient marshaling

## 3. Database Latency

**Database latency**  is the  **round-trip time**  between:

1. Sending a query to the database
2. The database executing the query (compute, read, write, etc.)
3. Receiving the result back in your application

In most backend applications,  **databases are the #1 bottleneck** . A single slow query can hold up an entire request, and at scale, even small inefficiencies compound into major performance issues.

#### What Causes High Database Latency?

1. **Unindexed Queries:** Full **** table scans instead of using indexes
2. **N+1 Query Problems:** Querying inside a loop, leading to dozens or hundreds of queries per request
3. **Large Result Sets:** Fetching more data than needed (e.g., SELECT * on large tables)
4. **Poor Schema Design:** Lack of normalization or too many unnecessary relations
5. **Lock Contention or Deadlocks:** Multiple transactions competing for the same rows
6. **Resource Saturation:** High CPU, memory, or I/O usage on the database server

## 4. Client-side Latency

Once your backend has done its job and the response reaches the user’s device, there’s still one more critical step: the  **client needs to render and display the data** . That final stretch is what we call  **client-side latency** .

Client-side latency is the delay between receiving data on the client (browser, mobile app, etc.) and displaying the usable content or UI to the user.

#### What Causes High Client-side Latency?

1. **Large JavaScript Bundles:** Too much JavaScript needs to be downloaded, parsed, and executed before anything appears on screen.
2. **Slow DOM Manipulation:** Poorly optimized DOM updates or frequent reflows/repaints can choke rendering.
3. **Inefficient Rendering Logic:** Complex, deeply nested components or unoptimized React/Vue/Svelte code can slow rendering.
4. **Image & Asset Load Time:** Uncompressed or unoptimized media assets (images, fonts, videos) block the UI from displaying.
5. **Excessive Client-side Computation:** Performing heavy calculations, filtering, or formatting on the frontend delays rendering.
6. **Blocking Resources:** CSS or fonts that are render-blocking can delay the first paint or cause layout shifts.

# **Top 15 Strategies to Reduce Latency**

These strategies are not ranked in any particular order. In practice, you’ll often need to apply  **multiple techniques together** , depending on your system’s architecture, scale, and latency goals.

## 1. Caching

When users expect blazing-fast responses, hitting your backend or database for every request just doesn’t scale. That’s where  **caching**  comes in.

Caching is the process of storing a copy of data  **closer to where it’s needed** , typically in  **fast-access memory**  like RAM.

When the cache contains the required data (a  *cache hit* ), the application avoids slower downstream operations like database queries or API calls. This can cut response times from hundreds of milliseconds to  **single-digit milliseconds** .

### Client-side Caching

Client-side caching stores data on the user's device, typically in the browser or mobile app. It reduces the need to re-fetch resources from the network.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/1be7aefa-a98f-4747-8e3b-43857ca7a32a_591x394.png)](https://substackcdn.com/image/fetch/$s_!avjC!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1be7aefa-a98f-4747-8e3b-43857ca7a32a_591x394.png)

You can cache static assets like images, JavaScript, CSS, or even API responses that rarely change.

- **Browser Cache:**  When you specify proper HTTP caching headers (e.g., Cache-Control, ETag, Expires), the browser stores assets locally. On subsequent requests, it can quickly load these from the local cache rather than fetching them again from the server.
- **Local Storage / IndexedDB:**  Modern browsers offer persistent storage options. For example, you could store user preferences, profile data or application settings in localStorage or IndexedDB so that the next time the user visits, the application can load instantly without waiting for the server.

### Server-side Caching

Server-side caching stores frequently requested data on the server, reducing the load on your database and speeding up responses.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/2af5c89e-752e-4b33-8e4a-7c9ac516c379_824x385.png)](https://substackcdn.com/image/fetch/$s_!7xH3!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2af5c89e-752e-4b33-8e4a-7c9ac516c379_824x385.png)

- **In-memory Caches:**  In-memory caches (e.g., Redis) keep data in a server’s main memory (RAM) for extremely fast access. An application server can check the cache first before hitting the database.
- **Application-level Caches:**  Application level caches (e.g., [caffeine](https://github.com/ben-manes/caffeine) in java) run directly in your application’s memory, storing frequently used data like computed values, or common database query results right where requests are processed.

# 2. Content Delivery Networks (CDNs)

Every millisecond counts when a user loads your website or app. If your server is located in India but your user is in New York, every request travels halfway across the world.

**Content Delivery Networks (CDNs)**  solve this by caching your static assets (and sometimes dynamic content) in data centers around the world, so users can access them from a  **location geographically close to them** .

[![Map of globally distributed servers serving content - What is a CDN](https://substack-post-media.s3.amazonaws.com/public/images/a09696e9-f98e-47bd-9eb9-08a20c60464d_5667x2834.png)](https://substackcdn.com/image/fetch/$s_!sN05!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa09696e9-f98e-47bd-9eb9-08a20c60464d_5667x2834.png)https://www.cloudflare.com/learning/cdn/what-is-a-cdn/

A  **CDN**  is a globally distributed network of edge servers that cache and deliver content like images, JavaScript, CSS, videos, and even full page to users based on their location.

When a user requests content, the  **nearest CDN server**  delivers it instead of reaching all the way to the  **origin server** .

This significantly reduces  **latency** ,  **bandwidth usage** , and  **server load** .

# 3. Load Balancing

When your application starts receiving thousands (or millions) of concurrent requests, a single server might struggle to handle the load. To scale horizontally, you add more servers. But to ensure those requests are distributed efficiently, you need a  **load balancer** .

[![image](https://substack-post-media.s3.amazonaws.com/public/images/aebd5461-34f3-47c5-bc8e-5248bb9a92c8_1304x1050.png)](https://substackcdn.com/image/fetch/$s_!DnSE!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Faebd5461-34f3-47c5-bc8e-5248bb9a92c8_1304x1050.png)

A  **load balancer**  acts like an intelligent traffic cop. It distributes incoming requests across multiple backend servers to ensure no single server is overwhelmed. This ensures high availability and keeps response times low, even during traffic spikes.

#### Load Balancing Algorithms

1. **Round Robin:** Sends each request to the next server in a loop. Good for evenly sized tasks.
2. **Least Connections:** Chooses the server with the fewest active connections. Ideal when some requests are long-lived (e.g., WebSockets).
3. **IP Hash / Consistent Hashing:** Routes requests based on client IP or hashed key. Useful for  **session persistence**  or  **cache affinity** .
4. **Weighted Load Balancing:** Assigns more traffic to powerful servers. Great for heterogeneous infrastructure.
5. **Latency-based Routing:** Routes traffic based on server response time. Perfect for multi-region setups.

# 4. Asynchronous Processing

Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
