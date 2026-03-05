---
title: "Consensus Algorithms"
description: "Consensus Algorithms - System Design Module 13"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Consensus Algorithms

How do distributed systems actually achieve agreement?

Over the past four decades, researchers and engineers have developed several consensus algorithms, each with different trade-offs in complexity, performance, and fault tolerance.

What makes this space fascinating is that these algorithms are solving an impossible problem. FLP tells us we cannot guarantee consensus in all cases, yet we have real systems that achieve consensus millions of times per second.

The trick lies in making the right assumptions and accepting the right trade-offs.

This chapter provides a bird's-eye view of the major consensus algorithms. We will examine their design philosophies, understand when to use each one, and see how they relate to each other.

Think of this as a map before we dive deep into the territory of specific algorithms in later chapters.

# Properties of Consensus

Before we look at specific algorithms, we need to understand what makes a consensus algorithm correct. Every consensus algorithm must satisfy three fundamental properties. These are not optional features but requirements. If an algorithm violates any of these, it is broken.

### The Three Properties

Property

Definition

Why It Matters

**Agreement**

All non-faulty nodes decide the same value

Without this, nodes diverge and coordination fails

**Validity**

The decided value was proposed by some node

Prevents trivial solutions like always returning null

**Termination**

All non-faulty nodes eventually decide

The algorithm completes rather than running forever

Let us walk through what each property really means with a concrete example.

**Agreement** says that if Node A decides the value is "X" and Node B decides the value is "Y", the algorithm has failed. This sounds obvious, but maintaining agreement when nodes crash and messages get delayed is the hard part.

**Validity** prevents cheating. Imagine a consensus algorithm that ignores all proposals and always returns "42". Technically, all nodes would agree on "42", but the algorithm would be useless. Validity ensures the decided value actually came from a participant.

**Termination** ensures progress. A consensus algorithm that never returns an answer is worthless in practice. But this is where FLP bites: we cannot guarantee termination in all cases.

### Safety vs Liveness

These properties split into two important categories that form the foundation of distributed systems reasoning:

**Safety properties** guarantee that nothing bad happens. The system never produces an incorrect result. If a consensus algorithm maintains safety, nodes will never disagree, and the chosen value will always be one that was actually proposed.

**Liveness properties** guarantee that something good eventually happens. The system makes progress and eventually produces a result.

**The crucial insight:** FLP impossibility means we cannot guarantee both in all cases. Real algorithms make a critical choice: they guarantee safety always and liveness under reasonable conditions (like bounded message delays and a stable leader).

Why prioritize safety over liveness? Consider a banking system. If the system temporarily stops making progress (violates liveness), transactions are delayed but money is not lost. If nodes disagree on account balances (violates safety), money disappears or gets duplicated. Safety violations cause data corruption. Liveness violations cause inconvenience.

Guarantee

What It Means

Consequence of Violation

Safety ALWAYS

Nodes never disagree, even during failures

Data corruption, split-brain, inconsistency

Liveness EVENTUALLY

System makes progress when conditions are right

Timeouts, retries, temporary unavailability

# The Paxos Family

Paxos is the foundational consensus algorithm. Invented by Leslie Lamport in the late 1980s (though not published until 1998), it is both brilliant and notoriously difficult to understand. Lamport originally described it as the protocol used by an ancient Greek parliament, complete with fictional names and voting procedures. Most readers found it confusing.

But understanding Paxos is valuable because its ideas underpin nearly every consensus algorithm that followed. Raft, ZAB, and even Byzantine protocols borrow concepts from Paxos.

### Why Paxos is Hard

Before diving into the protocol, let us acknowledge why Paxos has such a fearsome reputation. The algorithm handles many subtle edge cases that are not obvious at first glance:

*   What if two proposers try to propose at the same time?
*   What if a proposer crashes after Phase 1 but before Phase 2?
*   What if an acceptor has already accepted a different value?
*   What if network delays cause messages to arrive out of order?

Paxos handles all these cases correctly, but the interactions are subtle. As one researcher famously said, "There are only two things wrong with Paxos: it is hard to understand, and it is hard to implement."

### Basic Paxos

Basic Paxos solves the problem of agreeing on a single value. Not a sequence of values, just one. This seems limited, but it is the foundation for everything else.

The protocol has three roles:

Role

Responsibility

Typical Count

**Proposer**

Initiates consensus by proposing values

Often any node

**Acceptor**

Votes on proposals, forms quorums

Typically 3, 5, or 7

**Learner**

Observes the outcome

Often all nodes

In practice, a single node often plays all three roles simultaneously. The separation is conceptual, helping us reason about the protocol.

### The Two-Phase Protocol

Paxos operates in two phases. Each phase requires a round of communication with a majority of acceptors.

#### **Phase 1 (Prepare):**

1.  Proposer chooses a unique proposal number `n` (must be higher than any it has seen)
2.  Sends `Prepare(n)` to all acceptors
3.  Each acceptor checks: is `n` higher than any proposal I have promised to?

*   If yes: Promise not to accept any proposal with a lower number, reply with any value already accepted
*   If no: Ignore or reject the Prepare

#### **Phase 2 (Accept):**

1.  If proposer receives promises from a majority, it proceeds to Phase 2
2.  Chooses a value:

*   If any acceptor reported an already-accepted value, use the value from the highest-numbered accepted proposal
*   Otherwise, use the proposer's own value

4.  Sends `Accept(n, v)` to all acceptors
5.  Acceptors accept if they have not promised to a higher proposal

The value is **chosen** when a majority of acceptors have accepted the same proposal.

### A Concrete Paxos Example

Let us trace through a complete example with actual values. We have three acceptors (A1, A2, A3) and two proposers trying to propose different values.

**Scenario:** Proposer P1 wants to propose "Blue", Proposer P2 wants to propose "Red"

Notice how the protocol handles the race condition. P1's proposal was preempted by P2's higher proposal number. P1 did not lose data or cause inconsistency. It simply has to retry with a higher number.

### What Happens When Paxos Must Recover a Value

The most subtle part of Paxos is how it preserves a previously-chosen value. Let us see this in action.

This is the genius of Paxos. A proposer "learns" about previously-accepted values during Phase 1 and propagates them rather than overwriting them. This ensures agreement is never violated.

### Multi-Paxos

Basic Paxos decides one value. For a sequence of values (like a replicated log), we use Multi-Paxos.

The naive approach runs a separate Paxos instance for each slot. But this is expensive: four network messages per value.

**The Multi-Paxos optimization:** Elect a stable leader. Once a leader is established, it can skip Phase 1 for subsequent proposals. This reduces round trips from 4 to 2.

Approach

Messages per Value

When Used

Basic Paxos

4 (Prepare + Accept)

Each value, no stable leader

Multi-Paxos

2 (Accept only)

After leader elected

The catch is that Multi-Paxos does not specify how to elect a leader. This is left as an exercise for the implementer, and getting it right is tricky.

### Paxos Variants

Several variants address different performance and complexity trade-offs:

Variant

Innovation

Trade-off

**Fast Paxos**

Clients send directly to acceptors, skipping proposer

Lower latency when no conflicts, but more complex conflict handling

**Cheap Paxos**

Uses f+1 main replicas plus f auxiliary

Fewer machines for normal operation, but recovery is slower

**Generalized Paxos**

Non-conflicting commands proceed in parallel

Better throughput for independent operations

**EPaxos**

No designated leader, any replica can lead

Better load distribution, more complex protocol

### Paxos Strengths and Weaknesses

### Strengths

*   Mathematically proven correct
*   Minimal assumptions about network
*   Foundation for all subsequent algorithms

### Weaknesses

*   Notoriously hard to understand
*   Many implementation pitfalls
*   No built-in leader election
*   Log gaps possible during failures

# Raft: Understandable Consensus

Raft was designed with a single goal: make consensus understandable. Diego Ongaro and John Ousterhout introduced it in 2014, explicitly motivated by the difficulty of teaching and implementing Paxos. Their paper is titled "In Search of an Understandable Consensus Algorithm", and that title captures everything about Raft's philosophy.

Raft provides the same guarantees as Multi-Paxos but is much easier to implement correctly. The Raft paper includes a complete specification in about a page, compared to the many ambiguities in Paxos descriptions.

### Design Philosophy

Raft achieves understandability through two key principles:

**1\. Decomposition:** Break consensus into three separate subproblems:

*   Leader election: How to choose a leader when the current one fails
*   Log replication: How the leader replicates its log to followers
*   Safety: How to ensure logs remain consistent

**2\. State space reduction:** Minimize the number of states and transitions:

*   Strong leader: All writes go through the leader
*   No log holes: Entries are committed in order, no gaps
*   Simple membership changes: Add or remove one server at a time

Each subproblem can be understood and implemented independently, making the whole protocol easier to reason about.

### Node States

Every Raft node is in exactly one of three states at any time:

State

Responsibility

Transitions

**Follower**

Passive. Responds to leader heartbeats and candidate votes.

Becomes candidate after election timeout

**Candidate**

Actively seeks to become leader. Requests votes.

Becomes leader with majority, or returns to follower

**Leader**

Handles all client requests. Replicates log entries.

Returns to follower if discovers higher term

### Terms: Raft's Logical Clock

Raft divides time into **terms**. Each term has at most one leader.

Terms serve as a logical clock. If a node sees a message with a higher term, it knows its information is stale. This simple mechanism handles many edge cases:

*   A leader that was partitioned away discovers the cluster moved on
*   A candidate learns that an election already completed
*   Stale messages from old terms are rejected

### Leader Election in Detail

When a follower does not hear from a leader within its election timeout, it starts an election:

#### **Key election rules:**

1.  **One vote per term:** Each server votes for at most one candidate per term (first-come-first-served)
2.  **Log completeness:** A server only votes for a candidate whose log is at least as up-to-date as its own
3.  **Majority wins:** A candidate becomes leader when it receives votes from a majority
4.  **Randomized timeouts:** Election timeouts are randomized (e.g., 150-300ms) to reduce split votes

**Why randomized timeouts?** If all followers time out simultaneously, they all become candidates and vote for themselves, causing a split vote. Random timeouts ensure one node usually times out first and wins.

### Log Replication

Once a leader is elected, it handles all client requests and replicates log entries to followers:

**Commit rule:** An entry is committed when the leader has replicated it to a majority. Once committed, the entry is durable and will not be lost.

**Log matching property:** If two logs have an entry with the same index and term, the logs are identical up to that point. The leader enforces this by including the previous entry's index and term in AppendEntries. If a follower's log does not match, the leader backs up and retries.

### A Concrete Raft Example

Let us trace through a realistic scenario showing leader election and log replication.

Notice that entry 4 was lost. This is correct behavior. Entry 4 was only on the crashed leader and was never committed. If the leader had replicated it to a majority before crashing, the new leader would have it in its log and would preserve it.

### Raft vs Paxos Comparison

Aspect

Paxos

Raft

**Understandability**

Notoriously difficult

Designed for clarity

**Leader**

Optional optimization

Required, strong leader

**Log gaps**

Possible during failures

Not allowed

**Leader election**

Not specified

Fully specified

**Reconfiguration**

Complex

Simple (one server at a time)

**Implementation**

Many subtleties and gaps

Complete specification

**Proven systems**

Google Chubby, Spanner

etcd, Consul, CockroachDB

# Viewstamped Replication

Viewstamped Replication (VR) is older than Paxos, published by Oki and Liskov in 1988. Despite its age, VR contains many ideas that reappear in later algorithms, and it influenced Raft's design.

VR is worth studying because it shows that multiple research groups independently arrived at similar solutions, suggesting these patterns are fundamental to consensus.

### Core Concepts

VR organizes time into **views**, similar to Raft's terms. Each view has a designated **primary** (leader) that handles all client requests.

Concept

Description

Raft Equivalent

**View**

A period with a specific primary

Term

**Primary**

Node handling requests in current view

Leader

**Backup**

Replica that follows the primary

Follower

**View change**

Process to elect new primary

Leader election

### Normal Operation

During normal operation, VR works similarly to Raft:

1.  Client sends request to primary
2.  Primary assigns operation number (like Raft's log index)
3.  Primary sends `Prepare` to backups
4.  Backups acknowledge with `PrepareOK`
5.  Primary commits after majority acknowledge
6.  Primary sends `Commit` to backups and replies to client

### View Change

When a backup suspects the primary has failed (no heartbeat), it initiates a view change:

1.  Backup sends `StartViewChange` to all replicas
2.  When a replica receives f+1 `StartViewChange` messages, it sends `DoViewChange` to the new primary
3.  New primary collects `DoViewChange` messages, computes the most up-to-date log
4.  New primary broadcasts `StartView` with the committed log

The view change protocol ensures that all committed operations survive the transition.

### VR vs Raft

Aspect

VR

Raft

**Publication**

1988

2014

**Terminology**

Views, Primary, Backup

Terms, Leader, Follower

**View change**

Two-phase

Single-phase election

**Log indexing**

Operation numbers

Log index + term

**Influence**

Influenced Raft

Explicitly cited VR

The key insight is that VR, Paxos, and Raft are essentially the same algorithm expressed in different ways. They all use quorums, leaders, and numbered epochs (views/terms/proposal numbers) to achieve consensus.

# ZAB: ZooKeeper Atomic Broadcast

ZAB is the consensus protocol behind Apache ZooKeeper, one of the most widely-deployed coordination services. Unlike Paxos and Raft, which are general consensus algorithms, ZAB was designed specifically for ZooKeeper's needs: a replicated state machine with strong ordering guarantees.

### ZooKeeper's Requirements

ZooKeeper provides a hierarchical key-value store with strong consistency. It is used for:

*   Configuration management
*   Distributed locking
*   Leader election
*   Service discovery

These use cases require:

*   **Total order broadcast:** All replicas receive operations in the same order
*   **FIFO client order:** Operations from a single client are applied in the order sent
*   **Primary order:** Operations proposed by a primary are applied in proposal order

### ZAB Architecture

ZAB introduces **observers**: non-voting replicas that receive updates but do not participate in quorums. This allows read scaling without increasing coordination cost.

Role

Voting

Writes

Reads

**Leader**

Yes

Handles all

Yes

**Follower**

Yes

Forwards to leader

Yes

**Observer**

No

Forwards to leader

Yes (eventually consistent)

### Transaction Identifiers (zxid)

ZAB uses a unique identifier for each transaction called the **zxid**. It combines two parts:

This structure ensures total ordering across leader changes.

### ZAB Phases

ZAB operates in four phases:

1.  **Leader Election:** Elect a new leader (similar to Raft)
2.  **Discovery:** New leader learns about transactions from previous epochs
3.  **Synchronization:** Leader ensures all followers have the same state
4.  **Broadcast:** Normal operation, leader broadcasts transactions

The two-phase recovery (Discovery + Synchronization) is more complex than Raft's single-phase approach but ensures stricter ordering guarantees.

### ZAB vs Raft

Aspect

ZAB

Raft

**Message ordering**

Transaction IDs (zxid)

Log index + term

**Recovery**

Two-phase (discovery + sync)

Single-phase

**Observers**

Built-in

Requires extension

**Ordering guarantees**

FIFO + causal

Log matching

**Primary use**

ZooKeeper

General purpose

**Interview Insight:** If asked about ZooKeeper's consensus, mention that ZAB provides stronger ordering guarantees than basic Raft. The tradeoff is more complex recovery. In practice, Raft's guarantees are sufficient for most applications.

# Byzantine Fault Tolerant Algorithms

The algorithms we have discussed so far assume **crash failures**: nodes either work correctly or stop entirely. But what if nodes can behave arbitrarily, including maliciously? This is the realm of **Byzantine fault tolerance** (BFT).

The name comes from the "Byzantine Generals Problem," a thought experiment about generals trying to coordinate an attack when some generals might be traitors sending conflicting orders.

### When Do You Need BFT?

Byzantine failures include:

*   Nodes sending different values to different peers
*   Nodes lying about their state
*   Nodes selectively delaying or dropping messages
*   Compromised nodes actively trying to cause inconsistency

You need BFT when:

*   Participants do not fully trust each other (public blockchains)
*   Nodes might be compromised by attackers (critical infrastructure)
*   Bugs might cause arbitrary behavior (high-assurance systems)

You can skip BFT when:

*   You control all nodes (internal systems)
*   Nodes are in a trusted network
*   Performance matters more than Byzantine resilience

### The Cost of Byzantine Tolerance

BFT algorithms pay a significant price for their stronger guarantees:

Aspect

Crash Fault Tolerance

Byzantine Fault Tolerance

**Nodes for f failures**

2f + 1

3f + 1

**Message complexity**

O(n)

O(n²)

**Latency**

2-4 message delays

4-6 message delays

**Typical throughput**

10,000-50,000 ops/s

1,000-10,000 ops/s

Why 3f+1 nodes? With Byzantine failures, up to f nodes might lie, and up to f might be slow or unresponsive. You need at least f+1 honest, responsive nodes to make progress, giving a total of 3f+1.

### PBFT (Practical Byzantine Fault Tolerance)

PBFT, published by Castro and Liskov in 1999, was the first BFT algorithm practical for real systems.

**Three phases:**

1.  **Pre-prepare:** Primary assigns sequence number, broadcasts request
2.  **Prepare:** Replicas broadcast prepare messages, wait for 2f+1 matching prepares
3.  **Commit:** Replicas broadcast commit, execute after 2f+1 commits

The prepare phase ensures all honest replicas agree on the order. The commit phase ensures they all execute in that order even if the primary is Byzantine.

### Modern BFT Algorithms

PBFT's O(n²) message complexity limits scalability. Modern algorithms address this:

Algorithm

Innovation

Message Complexity

Used By

**PBFT**

First practical BFT

O(n²)

Hyperledger Fabric

**Tendermint**

BFT + proof-of-stake

O(n²)

Cosmos blockchain

**HotStuff**

Linear communication

O(n)

Meta's Diem

**SBFT**

Optimistic fast path

O(n) normal case

VMware Research

**HotStuff** is particularly notable. It achieves linear message complexity by having replicas communicate only with the leader, using threshold signatures to aggregate votes. This makes it scalable to hundreds of nodes.

# Choosing a Consensus Algorithm

With all these options, how do you choose? Here is a practical decision framework.

### Decision Framework

### Selection Criteria

If You Need

Choose

Reason

Easy implementation

Raft

Best documentation, reference implementations

Existing coordination service

etcd, Consul, or ZooKeeper

Production-tested, operational tooling

Byzantine tolerance

PBFT, Tendermint, or HotStuff

Trust model requires it

Maximum performance

Paxos variants or Multi-Raft

Optimized implementations available

Blockchain platform

Tendermint or custom

Designed for that use case

### Practical Recommendations

**For most applications:**

1.  **Do not implement consensus yourself.** Use an existing service like etcd, Consul, or ZooKeeper. These are battle-tested with years of production experience.
2.  **If you must implement consensus,** use Raft. It has the best documentation, multiple reference implementations, and is much easier to debug than Paxos.
3.  **If you need Byzantine tolerance,** consider existing frameworks like Tendermint for application-agnostic BFT or blockchain platforms that handle consensus for you.
4.  **If you need extreme performance,** consult the academic literature on Paxos variants, but be prepared for significant implementation complexity.

**Interview Insight:** When asked what consensus algorithm to use, the best answer is usually "don't implement one yourself." Demonstrate that you understand the algorithms, but also understand that production systems use existing implementations because consensus is notoriously difficult to get right.

# Real-World Systems

Let us see which consensus algorithms power real distributed systems. Understanding these mappings helps in system design interviews and architectural decisions.

### Database Systems

Modern distributed databases almost universally use Raft or Paxos for consensus.

System

Algorithm

Implementation Notes

**CockroachDB**

Raft

Per-range Raft groups. Each range (~512MB) has its own Raft group

**TiDB/TiKV**

Raft

Multi-Raft. Thousands of Raft groups per cluster

**Google Spanner**

Paxos

Custom implementation with TrueTime for global ordering

**YugabyteDB**

Raft

Inspired by Spanner, uses Raft instead of Paxos

**Multi-Raft** is a common pattern. Rather than one consensus group for all data, the data is sharded and each shard has its own Raft group. This provides horizontal scalability while maintaining strong consistency within each shard.

### Coordination Services

Coordination services provide primitives like distributed locks, configuration storage, and leader election. They are the backbone of larger distributed systems.

System

Algorithm

Primary Use Cases

**etcd**

Raft

Kubernetes, configuration, service discovery

**ZooKeeper**

ZAB

Kafka, Hadoop, HBase, distributed locking

**Consul**

Raft

Service discovery, service mesh, KV store

**Chubby**

Paxos

Google internal lock service, DNS

**Interview Insight:** Knowing which systems use which algorithms shows practical knowledge. If asked about Kafka coordination, mention ZooKeeper (ZAB). If asked about Kubernetes, mention etcd (Raft).

### Blockchain and DLT Systems

Blockchain systems have driven innovation in Byzantine fault tolerance because they operate in trustless environments.

System

Algorithm

Trust Model

**Cosmos**

Tendermint BFT

Proof-of-stake validators

**Hyperledger Fabric**

Pluggable (Raft, PBFT)

Permissioned consortium

**Ethereum 2.0**

Casper FFG

Proof-of-stake

**Solana**

Tower BFT

Proof-of-history + BFT

### Message Queues and Streaming

Even messaging systems that seem simple have consensus at their core.

System

Consensus Approach

**Kafka**

ZooKeeper for coordination, ISR for partition replication

**Pulsar**

BookKeeper (ZAB-like) for log storage

**RabbitMQ**

Raft for quorum queues

# Performance Characteristics

Understanding performance helps you make appropriate design decisions and set realistic expectations.

### Latency Comparison

Consensus latency depends on network round trips and algorithm complexity.

Scenario

Typical Latency

**Raft, same datacenter**

1-5 ms

**Multi-Paxos, same datacenter**

1-5 ms

**Raft, cross-datacenter**

50-150 ms

**PBFT, same datacenter**

10-50 ms

**Tendermint (blockchain)**

1-6 seconds

Cross-datacenter adds network RTT (50-150ms per hop). For a 5-node cluster spanning US coasts, expect ~100ms latency per consensus round.

### Throughput Comparison

Single consensus group throughput is limited by the leader and network.

Algorithm

Typical Throughput

Bottleneck

**Raft**

10,000-50,000 ops/s

Leader CPU, disk sync

**Multi-Paxos**

10,000-100,000 ops/s

Leader CPU, disk sync

**PBFT**

1,000-10,000 ops/s

O(n²) messages

For higher throughput, use multiple consensus groups (sharding). CockroachDB runs thousands of Raft groups, each handling its own shard.

### Scaling Strategies

**Scaling techniques:**

*   **Multi-Raft/Paxos:** Run multiple consensus groups, each handling different data
*   **Batching:** Combine multiple operations into a single consensus round
*   **Pipelining:** Start new rounds before previous ones complete
*   **Witnesses:** Use non-voting replicas for reads (like ZAB observers)

## Algorithm Summary Table

Algorithm

Failure Model

Nodes for f Failures

Message Complexity

Key Strength

Used By

**Paxos**

Crash

2f + 1

O(n)

Foundational, proven

Spanner, Chubby

**Raft**

Crash

2f + 1

O(n)

Understandable, well-specified

etcd, Consul, CockroachDB

**ZAB**

Crash

2f + 1

O(n)

Total order, observers

ZooKeeper

**VR**

Crash

2f + 1

O(n)

Historical significance

Academic

**PBFT**

Byzantine

3f + 1

O(n²)

First practical BFT

Hyperledger Fabric

**Tendermint**

Byzantine

3f + 1

O(n²)

Blockchain-ready

Cosmos

**HotStuff**

Byzantine

3f + 1

O(n)

Linear BFT

Diem

# Summary

The landscape of consensus algorithms can be summarized as follows:

*   **Core properties:** All consensus algorithms must satisfy agreement (nodes decide the same value), validity (decided value was proposed), and termination (eventually decide). Safety is guaranteed unconditionally; liveness requires assumptions about timing and failures.
*   **Paxos:** The foundational algorithm, proven correct but difficult to understand and implement. Its two-phase protocol (Prepare/Promise, Accept/Accepted) ensures previously-chosen values are never overwritten. Multi-Paxos extends it to logs through leader optimization.
*   **Raft:** Designed explicitly for understandability with equivalent guarantees to Multi-Paxos. Decomposes consensus into leader election, log replication, and safety. The practical choice for most implementations due to its clear specification and abundant documentation.
*   **Viewstamped Replication:** Predates Paxos and contains many of the same ideas. Shows that these patterns are fundamental to consensus, not accidents of any particular algorithm.
*   **ZAB:** The algorithm behind ZooKeeper. Provides stronger ordering guarantees (total order, FIFO client order) through a two-phase recovery protocol. Includes observer nodes for read scaling.
*   **Byzantine tolerance:** Required when nodes may be malicious. Costs more nodes (3f+1 vs 2f+1) and more messages (O(n²) vs O(n)). PBFT is the classic algorithm; modern variants like HotStuff improve scalability.
*   **Choosing an algorithm:** For internal systems, use Raft (or a system built on Raft like etcd). For Byzantine environments, consider Tendermint or existing blockchain frameworks. Avoid implementing consensus from scratch.
*   **Real-world adoption:** Raft dominates modern systems (etcd, CockroachDB, Consul). Paxos remains in Google systems (Spanner, Chubby). ZAB powers the Hadoop ecosystem through ZooKeeper.

Now that we have surveyed the landscape, it is time to dive deep. The next chapter explores Paxos in detail. Understanding Paxos is valuable not because you will implement it, but because its ideas underpin all subsequent consensus algorithms. You cannot truly understand Raft without understanding the problems Paxos solved first.

### References

*   [Paxos Made Simple](https://lamport.azurewebsites.net/pubs/paxos-simple.pdf) - Leslie Lamport's accessible explanation of Paxos
*   [In Search of an Understandable Consensus Algorithm](https://raft.github.io/raft.pdf) - The original Raft paper by Ongaro and Ousterhout
*   [ZooKeeper's Atomic Broadcast Protocol](https://www.datadoghq.com/pdf/zab.totally-ordered-broadcast-protocol.2008.pdf) - ZAB specification
*   [HotStuff: BFT Consensus with Linearity](https://arxiv.org/abs/1803.05069) - Linear BFT algorithm

Launching soon
