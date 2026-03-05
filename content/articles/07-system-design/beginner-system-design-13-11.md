---
title: "Paxos Algorithm"
description: "Paxos Algorithm - System Design Module 13"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Paxos Algorithm

Paxos is the most influential consensus algorithm ever developed. Invented by Leslie Lamport in the late 1980s, it laid the foundation for all subsequent work on distributed consensus.

Google built its distributed systems infrastructure on Paxos. Amazon, Microsoft, and countless others have used variations of Paxos for their most critical systems.

Yet Paxos is infamous for being difficult to understand. Lamport originally presented it as the discovery of ancient parliamentary procedures on the Greek island of Paxos, a framing that confused more than it clarified.

The algorithm was considered so impenetrable that it took years for the distributed systems community to fully appreciate its significance. As one researcher put it: "There are only two things wrong with Paxos: it is hard to understand, and it is hard to implement."

**So why bother learning it?**

Because Paxos is not just an algorithm, it is the algorithm. Every consensus protocol that came after, from Raft to ZAB to modern blockchain protocols, borrows ideas from Paxos.

The two-phase structure, proposal numbers, quorum intersection, the way information flows between proposers and acceptors: these patterns appear everywhere. Understanding Paxos is like understanding the periodic table. Once you see the underlying structure, everything else makes sense.

This chapter builds on the consensus foundations from previous chapters. If quorums and failure models are unfamiliar, review those sections first.

# The Single-Value Problem

### Premium Content

This content is for premium members only.

[Subscribe Now](/premium)

Launching soon
