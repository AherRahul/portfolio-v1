---
title: "Challenges of Distribution"
description: "Challenges of Distribution - System Design Module 13"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Challenges of Distribution

When a program runs on a single computer, life is simple. A function call either succeeds or throws an exception. Variables maintain their values until you change them. If the machine crashes, everything stops together. There are no ambiguous states, no partial failures, no wondering whether an operation completed or not.

Distributed systems shatter this simplicity. Instead of one computer, you have many, connected by unreliable networks, each with its own clock, each capable of failing independently. What seems like a straightforward operation, like saving a user's order, becomes a dance between multiple services that may or may not be available, may or may not have received your message, and may or may not have processed it successfully.

These challenges are not edge cases you can ignore. At scale, every failure mode that can happen will happen. Networks will partition. Servers will crash at inconvenient times. Clocks will drift. Messages will be delayed, duplicated, or lost entirely. Designing distributed systems means building for a world where Murphy's Law is not pessimism but a daily reality.

Understanding these challenges is the foundation for everything else in distributed systems. You cannot design solutions until you deeply understand the problems.

# Why Distribute at All?

Before diving into the challenges, it is worth asking why we build distributed systems in the first place. The problems are real. The complexity is substantial. So why bother?

### Reasons for Distribution

Reason

Description

**Scale**

A single machine has limits: CPU cores, memory, disk space, network bandwidth. To handle millions of users, you need multiple machines.

**Availability**

Hardware fails. If your entire system runs on one machine and that machine dies, so does your service. Multiple machines mean surviving individual failures.

**Latency**

Physics limits how fast data travels. A user in Tokyo connecting to a server in New York experiences 100+ milliseconds of latency just from the speed of light. Servers closer to users reduce latency.

**Isolation**

Running everything on one machine means one bug can bring everything down. Separate services on separate machines limit blast radius.

**Organizational**

Large engineering teams cannot all work on the same monolithic codebase effectively. Distributed services allow independent development and deployment.

The benefits are compelling, which is why nearly every large-scale system is distributed. But distribution comes with a fundamental set of challenges that single-node systems never face.

# The Fundamental Difference: Partial Failure

On a single machine, failure is total. If the CPU crashes, the entire system stops. Every process on that machine fails together, at the same moment, in the same way. This is actually a good property, it means you never have to wonder about the state of the system after a failure. It is completely down.

Distributed systems introduce partial failure: some parts of the system may fail while others continue running. This seems obvious, but its implications are profound.

### Why Partial Failure Is Hard

Consider a simple operation: transfer $100 from Account A to Account B. On a single database, this is a transaction. It either completes entirely or not at all. But in a distributed system where accounts might be on different services:

What happened? You debited Account A successfully. But when you tried to credit Account B, the service crashed, or maybe it processed the request and then crashed before responding, or maybe the network dropped the response. You do not know. And not knowing is the core challenge.

**Possible states:**

*   Account A was debited, Account B was not credited (money lost)
*   Account A was debited, Account B was credited (success)
*   Account A was debited, Account B was credited twice (money created)

Without careful design, all three outcomes are possible.

### The Response Timeout Problem

When you make a request to another service and it times out, there are three possibilities:

1.  **Request never arrived:** The service never saw it
2.  **Request processed, response lost:** The service completed the work but you did not receive confirmation
3.  **Request still processing:** The service is slow but will eventually complete

You cannot distinguish between these cases from the client's perspective. This is not a bug that can be fixed with better error handling. It is a fundamental property of distributed systems.

# Challenge 1: Unreliable Networks

Distributed systems communicate over networks, and networks are fundamentally unreliable. Messages can be lost, delayed, duplicated, or delivered out of order. There is no guaranteed upper bound on how long a message takes to arrive.

### What Can Go Wrong

Failure Mode

Description

**Packet loss**

The message simply disappears, dropped by a router, lost due to congestion, or discarded due to corruption

**Delay**

The message arrives, but seconds or minutes later than expected

**Duplication**

Retry logic or network equipment causes the same message to arrive multiple times

**Reordering**

Message B arrives before Message A, even though A was sent first

**Asymmetric failures**

A can send to B, but B cannot send to A

### The Two Generals Problem

The impossibility of reliable communication over unreliable channels is formalized in the Two Generals Problem:

Two armies are on opposite sides of a valley. They must attack a city simultaneously to win. The only way to communicate is by messenger across the valley, but messengers can be captured.

General A sends: "Attack at dawn"

*   Did General B receive it?
*   General B sends acknowledgment: "Confirmed"
*   Did General A receive the confirmation?
*   General A needs to confirm the confirmation...

No finite number of messages can guarantee both generals are certain the other will attack. This is not a technical limitation that better protocols can solve. It is a fundamental impossibility when communication is unreliable.

### Practical Implications

Since you cannot guarantee message delivery, you must design for uncertainty:

*   **Timeouts:** Assume messages might never arrive. Do not wait forever.
*   **Retries:** Resend messages that might have been lost, but handle duplicates.
*   **Idempotency:** Make operations safe to repeat, since you might retry something that actually succeeded.
*   **Acknowledgments:** Confirm receipt of important messages, understanding that confirmations can also be lost.

# Challenge 2: No Shared Clock

In a single machine, all processes share a system clock. You can use timestamps to order events: if event A has timestamp 10 and event B has timestamp 20, then A happened before B.

Distributed systems have no shared clock. Each machine has its own clock, and those clocks drift apart. Even if you synchronize them with NTP (Network Time Protocol), they are only accurate to within milliseconds, sometimes tens of milliseconds. And during network partitions, clocks can drift significantly.

### The Clock Drift Problem

A 50ms difference might seem small, but consider:

*   In 50ms, a modern server can process 50,000 requests
*   In 50ms, a network round trip can complete multiple times
*   In 50ms, the entire order of events can be different on different machines

### Why Wall Clock Time Is Dangerous

Using physical time for ordering events in distributed systems leads to bugs:

**Scenario:** Two users edit the same document simultaneously

*   User A on Machine A saves at 10:00:00.000 (Machine A's clock)
*   User B on Machine B saves at 10:00:00.030 (Machine B's clock)
*   Machine B's clock is 50ms ahead, so in real time, User B saved first
*   But timestamps show User A saved first
*   Using "last write wins" by timestamp gives wrong answer

### Logical Clocks

Since physical clocks cannot be trusted for ordering, distributed systems often use logical clocks instead:

Type

Description

**Lamport timestamps**

A simple counter that increments with each event. If A sends a message to B, B's counter is set to max(B's counter, A's counter) + 1

**Vector clocks**

Each node maintains a vector of counters, one per node. Enables detecting concurrent events

**Hybrid logical clocks**

Combines physical time with logical counters for the best of both worlds

**Interview Insight:** When discussing ordering or timestamps in distributed systems, mention that wall clock time is unreliable. Demonstrate awareness of logical clocks as an alternative.

# Challenge 3: Unbounded Latency

On a single machine, calling a function takes nanoseconds to microseconds. The time is bounded and predictable. Over a network, a request can take milliseconds to seconds, or it might never complete at all. There is no guaranteed upper bound.

### The Latency Distribution

Network latency is not constant. It follows a distribution with a long tail:

At 10,000 requests per second:

*   100 requests per second are slower than 20ms
*   10 requests per second are slower than 100ms
*   Those slow requests might block resources, causing cascading delays

### Why Latency Is Unpredictable

Cause

Description

**Network congestion**

Routers buffer packets, adding delay during peak traffic

**Garbage collection**

JVM or runtime pauses can add hundreds of milliseconds

**CPU contention**

Overloaded machines take longer to respond

**Disk I/O**

Storage access varies from microseconds to seconds

**TCP retransmits**

Lost packets trigger retransmission timeouts

**Cross-datacenter**

Geographic distance adds latency (speed of light)

### Latency Amplification

In a microservices architecture, a single user request might fan out to dozens of services:

If each service call has a p99 latency of 20ms, and you make 4 parallel calls, the probability that at least one is slow is:

At scale, this compounds. A request touching 50 services has almost a 40% chance of hitting at least one slow service at the p99 level.

# Challenge 4: No Global State

On a single machine, there is one source of truth. If you want to know the value of a variable, you read it from memory. Everyone sees the same value.

In a distributed system, state is spread across multiple machines. There is no single location you can query for "the current state of everything." Each node has its own partial view, and those views may be inconsistent.

### The Consistency Problem

Without careful coordination, different clients reading from different nodes see different values. This is not a bug, it is the reality of distributed state.

### Consistency vs. Availability Trade-off

The CAP theorem formalizes a fundamental trade-off:

*   **Consistency:** Every read returns the most recent write
*   **Availability:** Every request receives a response
*   **Partition tolerance:** The system continues operating despite network partitions

During a network partition, you can have Consistency or Availability, but not both:

Most practical systems choose availability during partitions and deal with eventual consistency, reconciling divergent data after the partition heals.

# The Fallacies of Distributed Computing

In 1994, Peter Deutsch documented the false assumptions developers make about distributed systems. These fallacies are just as relevant today:

Fallacy

Reality

The network is reliable

Packets are lost, connections drop

Latency is zero

Round trips take milliseconds to seconds

Bandwidth is infinite

Networks have capacity limits

The network is secure

Attackers exist, encryption is necessary

Topology doesn't change

Nodes join and leave, routes change

There is one administrator

Different organizations manage different parts

Transport cost is zero

Moving data has financial and performance costs

The network is homogeneous

Different technologies, protocols, and capabilities

Every distributed system bug caused by ignoring these realities eventually surfaces in production.

# The Mental Model Shift

Designing distributed systems requires a different mental model than single-machine programming:

### From Certainty to Probability

Single Machine

Distributed System

Operation succeeds or fails

Operation might succeed, fail, or be unknown

State is consistent

State may be inconsistent across nodes

Time is global

Time is local and unreliable

Failure is total

Failure is partial

### From Optimistic to Defensive

### Key Questions to Ask

When designing any distributed operation:

1.  **What happens if this message is lost?**
2.  **What happens if this message is delayed by 10 seconds?**
3.  **What happens if this message is received twice?**
4.  **What happens if nodes have different views of the current state?**
5.  **What happens if a node crashes mid-operation?**

# Summary

Distributed systems face fundamental challenges that cannot be engineered away:

*   **Partial failure** means some components fail while others continue. You cannot assume all-or-nothing behavior.
*   **Unreliable networks** lose, delay, duplicate, and reorder messages. No finite protocol can guarantee reliable delivery.
*   **Unsynchronized clocks** mean you cannot use timestamps to reliably order events across machines.
*   **Unbounded latency** means you can never know if a request is slow or has failed. There is no guaranteed upper bound.
*   **No global state** means each node has only a partial, potentially stale view of the system.

These challenges are not bugs to fix but constraints to design around. The fallacies of distributed computing remind us that networks are unreliable, latency is real, and topology changes.

Understanding these challenges is essential before attempting solutions. In the next chapter, we will dive deep into one of the most disruptive distributed systems challenges: network partitions. When the network splits a cluster in two, how do systems maintain consistency and availability? What happens when nodes that should be coordinating can no longer communicate?

### References

*   [Fallacies of Distributed Computing](https://en.wikipedia.org/wiki/Fallacies_of_distributed_computing) - Peter Deutsch's original list
*   [Time, Clocks, and the Ordering of Events in a Distributed System](https://lamport.azurewebsites.net/pubs/time-clocks.pdf) - Lamport's seminal paper
*   [Distributed Systems for Fun and Profit](http://book.mixu.net/distsys/) - Free online book covering fundamentals

Launching soon
