---
title: "Long Polling"
description: "Long Polling - System Design Module 7"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Long Polling

Lets say you are building a notification system. Users need to see new notifications the moment they arrive, not minutes later.

The traditional HTTP model does not help here. A client makes a request, the server responds, and the connection closes. If a notification arrives a millisecond later, the user has no idea until they refresh the page.

The obvious solution is polling. Have the client ask "any new notifications?" every few seconds. But this creates a painful trade-off. Poll frequently and you hammer your servers with requests that mostly return nothing. Poll infrequently and notifications feel delayed.

**Long polling** solves this elegantly. Instead of responding immediately with "nothing new," the server holds the connection open until there is actually something to send. This small change makes a big difference. You get near real-time updates while staying within the familiar HTTP paradigm.

In this chapter, we will explore:

*   What is long polling and how it differs from regular polling
*   How long polling works under the hood
*   Implementation patterns and code examples
*   Challenges and how to handle them
*   When to use long polling vs alternatives

# What is Long Polling?

Long polling is a technique where the client sends a request to the server, and instead of responding immediately, the server holds the request open until new data is available. Once the server responds, the client immediately sends another request, creating a continuous loop.

The key insight is this: instead of the client repeatedly asking "is there anything new?" and getting empty responses, it asks once and waits for the answer. The server only responds when it has something meaningful to say.

This creates the illusion of server push while using standard HTTP requests. The client always has a pending request waiting at the server, ready to receive data the moment it becomes available.

# Long Polling vs Short Polling

To understand why long polling matters, let us compare it with its simpler cousin, short polling.

**Short polling** is the naive approach. The client asks for updates at regular intervals (say, every 5 seconds), and the server responds immediately with whatever it has, even if that is nothing.

The difference becomes clear when you look at request patterns over time:

Metric

Short Polling (5s interval)

Long Polling

**Requests in 30 seconds**

6 requests

1-2 requests

**Empty responses**

Most responses are empty

Zero empty responses

**Latency to receive update**

0-5 seconds (average 2.5s)

Near-instant

**Server load**

Constant, regardless of activity

Proportional to actual events

With 100,000 connected users polling every 5 seconds, short polling generates 20,000 requests per second, most returning nothing. Long polling only generates traffic when there is actual data to deliver.

# How Long Polling Works

The mechanics of long polling involve three phases: the initial request, the waiting period, and the response cycle.

### Phase 1: Client Sends Request

The client sends a standard HTTP request asking for updates. This request looks like any other HTTP request, nothing special about it.

The `since` parameter tells the server what the client has already seen, so it only receives new data.

### Phase 2: Server Holds Connection

Here is where long polling differs from regular requests. Instead of responding immediately, the server checks if there is new data:

*   **If new data exists:** Respond immediately with the data
*   **If no new data:** Hold the connection open and wait

The server keeps the connection open until one of three things happens:

1.  New data arrives (success case)
2.  A timeout is reached (typically 30-60 seconds)
3.  The connection is interrupted

### Phase 3: Response and Reconnect

When the server responds (either with data or a timeout), the client immediately sends another request. This creates a continuous loop where the client always has a pending request waiting at the server.

The timeout serves an important purpose. It prevents connections from being held indefinitely, which could cause issues with proxies, load balancers, and firewalls that may close idle connections.

# Implementation Patterns

Implementing long polling requires careful consideration on both client and server sides.

### Client-Side Implementation

The client needs to handle three scenarios: receiving data, timeout responses, and connection errors.

### Server-Side Implementation

The server side is trickier. You cannot simply have a thread sitting in a loop checking for updates. That would waste CPU and limit concurrent connections.

Production implementations use event-driven architectures:

When a request comes in:

1.  The handler subscribes to a Redis channel (or similar pub/sub system)
2.  The handler yields control (no CPU consumed while waiting)
3.  When new data publishes to the channel, the handler wakes up
4.  The handler responds to the client and cleans up the subscription

Here is a simplified example using Node.js with Redis:

# Handling Challenges

Long polling introduces several challenges that short polling does not have. Understanding and addressing these is critical for production systems.

### Challenge 1: Connection Limits

Each long polling request holds a connection open. With thousands of users, you can hit server connection limits or exhaust file descriptors.

**Solution:** Use async/event-driven servers (Node.js, Go, Nginx) that can handle thousands of concurrent connections efficiently. Apache with thread-per-request model struggles here.

### Challenge 2: Load Balancer Configuration

Many load balancers and reverse proxies have default timeouts that are shorter than typical long polling timeouts. A proxy might close the connection before the server responds.

**Solution:** Configure proxy timeouts to be longer than your long polling timeout:

### Challenge 3: Message Ordering

When a response arrives and the client sends a new request, there is a brief window where messages could be missed or arrive out of order.

**Solution:** Use event IDs or timestamps. The client sends the last event ID it received, and the server includes any events that arrived after that ID, even if they came during the reconnection window.

### Challenge 4: Thundering Herd

If your server restarts or a network blip disconnects all clients simultaneously, they will all try to reconnect at once, potentially overwhelming the server.

**Solution:** Add jitter to reconnection delays:

### Challenge 5: Mobile and Unreliable Networks

Mobile devices frequently switch between WiFi and cellular, losing connections. Long polling connections are particularly vulnerable because the client expects responses that may never arrive.

**Solution:** Implement connection timeouts on the client side (shorter than server timeout) and handle connection state changes:

# When to Use Long Polling

Long polling occupies a useful middle ground between simple polling and more complex real-time technologies like WebSockets. Here is when it makes sense:

### Good Use Cases for Long Polling

Use Case

Why Long Polling Works

**Notification systems**

Updates are infrequent, need to arrive promptly

**Activity feeds**

Server pushes updates, client rarely sends data

**Job/task status updates**

Check if background job completed

**Chat (moderate scale)**

Works through corporate proxies that block WebSockets

**Collaborative apps**

Where WebSocket support is uncertain

### When to Choose Alternatives

Alternative

Choose When

**Short Polling**

Updates can be delayed, simplicity is paramount

**Server-Sent Events**

Browser supports SSE, one-way push is sufficient

**WebSockets**

High-frequency bidirectional communication needed

# Key Takeaways

Long polling is a pragmatic solution for real-time updates that balances capability and complexity:

1.  **The core idea is simple:** Hold the connection until there is data, then immediately reconnect. This eliminates wasted requests while staying within HTTP.
2.  **Use event-driven servers:** Thread-per-request servers cannot handle the connection load. Node.js, Go, or async Python frameworks work well.
3.  **Plan for edge cases:** Handle timeouts, reconnection storms, message ordering, and mobile network instability.
4.  **Know when to upgrade:** If you need bidirectional communication or very high message frequency, WebSockets are worth the additional complexity. Long polling is best for moderate-frequency, server-to-client updates.
5.  **Keep it as a fallback:** Even if you use WebSockets primarily, long polling makes a good fallback for restricted network environments.

Long polling is not as glamorous as WebSockets, but it solves real problems reliably. For many applications, it is exactly the right amount of complexity.

Launching soon
