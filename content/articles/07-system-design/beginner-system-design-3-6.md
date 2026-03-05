---
title: "Consistent Hashing"
description: "Consistent Hashing - System Design Module 3"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Consistent Hashing

In a **distributed system** where nodes (servers) are frequently **added or removed**, efficiently routing requests becomes challenging.

A common approach is to use **hash the request** and assign it to a server using `Hash(key) mod N`, where N is the number of servers.

However, this method is highly dependent on the number of servers, and any change in N can lead to **significant** **rehashing**, causing a major redistribution of keys (requests).

**Consistent hashing** addresses this issue by ensuring that only a small subset of keys need to be reassigned when nodes are added or removed.

Popularized by [**Amazon’s Dynamo paper**](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf), it has now become a fundamental technique in distributed databases like DynamoDB, Cassandra and ScyllaDB.

In this chapter, we’ll explore what consistent hashing is, why it’s needed, how it works, and how to implement it in code.

# 1\. The Problem with Traditional Hashing

Before diving into consistent hashing, let us understand why the naive approach fails so badly.

Imagine you're building a **high-traffic web application** that serves millions of users daily. To handle the load efficiently, you distribute incoming requests across multiple backend servers using a **hash-based** **load balancer**.

Your system consists of **5 backend servers** (`S0, S1, S2, S3, S4`), and requests are assigned using a hash function that maps each user's **IP address to a specific server**.

![The Problem with Traditional Hashing](/_next/image?url=https%3A%2F%2Fpayload.algomaster.io%2Fapi%2Fmedia%2Ffile%2Flsd-206-1.png&w=3840&q=90)

The process works like this:

1.  The load balancer takes a user’s IP address (or session ID).
2.  A **hash function** maps the IP to one of the backend servers by taking the **sum of bytes in the IP address** and computing `mod 5` (since we have 5 servers).
3.  The request is **routed to the assigned server**, ensuring that the same user is always directed to the same server for session consistency.

**Example:**

![Example](/_next/image?url=https%3A%2F%2Fpayload.algomaster.io%2Fapi%2Fmedia%2Ffile%2Flsd-206-2.png&w=3840&q=90)

### **Everything Works Fine… Until You Scale**

This approach works **as long as the number of servers remains constant**. But what happens when you **add or remove a server**?

#### **Scenario 1: Adding a New Server (S5)**

As traffic increases, you decide to **scale up** by adding a new backend server (`S5`). Now, the hash function must be modified to use `mod 6` instead of `mod 5` since we have 6 servers now.

![Adding a New Server](/_next/image?url=https%3A%2F%2Fpayload.algomaster.io%2Fapi%2Fmedia%2Ffile%2Flsd-206-3.png&w=3840&q=90)

This seemingly simple change **completely disrupts the existing mapping**, causing **most users to be reassigned to different servers**.

This results into **massive rehashing**, leading to **high overhead, and potential downtime**.

#### **Scenario 2: Removing a Server (S4)**

Now, let’s say one of the servers (`S4`) fails or is removed. The number of servers drops to 4, forcing the hash function to switch from `mod 5` to `mod 4`.

![Removing a Server](/_next/image?url=https%3A%2F%2Fpayload.algomaster.io%2Fapi%2Fmedia%2Ffile%2Flsd-206-4.png&w=3840&q=90)

Even though only **one** server was removed, **most users are reassigned to different servers**. This can cause:

*   **Session Loss:** Active users may be logged out or disconnected.
*   **Cache invalidation:** Cached data becomes irrelevant, increasing database load.
*   **Severe performance degradation:** The system may struggle to run efficiently.

### **The Solution: Consistent Hashing**

**Consistent hashing** offers a more scalable and efficient solution by ensuring that only a **small fraction of users** are reassigned when scaling up or down.

It performs really well when operated in dynamic environments, where the system scales up and down frequently.

# 2\. How Consistent Hashing Works

Consistent hashing is a **distributed hashing technique** used to efficiently distribute data across multiple nodes (servers, caches, etc.).

It uses a **circular hash space** (hash ring) with a large and constant hash space.

Both nodes (servers, caches, or databases) and keys (data items) are mapped to positions on this hash ring using a **hash function**.

Unlike modulo-based hashing, where changes in the number of nodes cause large-scale remapping, consistent hashing ensures that only a small fraction of keys are reassigned when a node is added or removed, making it highly scalable and efficient.

> In consistent hashing, when the number of nodes changes, only `k/n` keys need to be reassigned, where `k` is the total number of keys and `n` is the total number of nodes.

## **2.1 Constructing the Hash Ring**

Instead of distributing keys based on `Hash(key) mod N`, consistent hashing places both servers and keys on a circular hash ring.

#### Defining the Hash Space

*   We use a large, fixed hash space ranging from `0` to `2^32 - 1` (assuming a 32-bit hash function).
*   This creates a circular structure, where values wrap around after reaching the maximum limit.

#### **Placing Servers on the Ring**

*   Each **server (node)** is assigned a position on the hash ring by computing `Hash(server_id)`.
*   Using the above example with **5 servers (**`S0, S1, S2, S3, S4`**)**, the hash function distributes them at different positions around the ring.

![Placing Servers on the Ring](/_next/image?url=https%3A%2F%2Fpayload.algomaster.io%2Fapi%2Fmedia%2Ffile%2Flsd-206-5.png&w=3840&q=90)

#### **Mapping Keys to Servers**

*   When a key is added, its position is determined by computing `Hash(key)`.

*   Example: a user’s request is assigned a position on the ring based on the hash of their IP address: `Hash(IP Address)`

*   We then move clockwise around the ring until we find the next available server.
*   The key (or request) is assigned to this server for storage or retrieval.

> **Note:** In case a key’s hash falls directly on a node’s position, it belongs to that node.

![Mapping Keys to Servers](/_next/image?url=https%3A%2F%2Fpayload.algomaster.io%2Fapi%2Fmedia%2Ffile%2Flsd-206-6.png&w=3840&q=90)

## **2.2 Adding a New Server**

Suppose we add a **new server (**`S5`**)** to the system.

*   The position of `S5` falls between `S1` and `S2` in the hash ring.
*   `S5` takes over all keys (requests) that fall between `S1` and `S5`, which were previously handled by `S2`.
*   **Example:** `User D’s` requests which were originally assigned to `S2,` will now be redirected to `S5.`

![Adding a New Server](/_next/image?url=https%3A%2F%2Fpayload.algomaster.io%2Fapi%2Fmedia%2Ffile%2Flsd-206-7.png&w=3840&q=90)

This demonstrates how consistent hashing efficiently redistributes keys with minimal disruption, ensuring that only a small subset of keys are reassigned when new servers are added.

## **2.3 Removing a Node**

When a server, such as `S4`, fails or is removed from the system:

*   All keys previously assigned to `S4` are reassigned to the next available server in the ring (`S3`).
*   Only the keys (requests) that were mapped to `S4` need to move, while all other keys remain unaffected.

![Removing a Node](/_next/image?url=https%3A%2F%2Fpayload.algomaster.io%2Fapi%2Fmedia%2Ffile%2Flsd-206-8.png&w=3840&q=90)

This results in **minimal data movement**, unlike traditional hashing where removing a node would require reassigning most keys.

# 3\. Virtual Nodes

In **basic consistent hashing**, each server is assigned **a single position** on the hash ring. However, this can lead to **uneven data distribution**, especially when:

*   The number of servers is small.
*   Some servers accidentally get clustered together, creating **hot spots**.
*   A server is **removed**, causing a sudden load shift to its immediate neighbor.

**Virtual nodes (VNodes)** are a technique used in consistent hashing to improve **load balancing** and **fault tolerance** by distributing data more evenly across servers.

#### **How Virtual Nodes Work**

Instead of assigning one position per server, each physical server is assigned **multiple positions** (virtual nodes) on the hash ring.

*   Each server is hashed multiple times to different locations on the ring.
*   When a request (key) is hashed, it is assigned to the next virtual node in a clockwise direction.
*   The request is then routed to the actual server associated with the virtual node.

#### Example

Assume we have **three physical servers (S1, S2, S3)**. Without virtual nodes, their positions might be:

`S1 → Position 10`

`S2 → Position 50`

`S3 → Position 90`

![Virtual Nodes](/_next/image?url=https%3A%2F%2Fpayload.algomaster.io%2Fapi%2Fmedia%2Ffile%2Flsd-206-9.png&w=3840&q=90)

If **S1 fails**, all its keys must be reassigned to **S2**, which can create an overload.

With **virtual nodes**, each server is hashed multiple times:

![Virtual Nodes](/_next/image?url=https%3A%2F%2Fpayload.algomaster.io%2Fapi%2Fmedia%2Ffile%2Flsd-206-10.png&w=3840&q=90)

```python
S1-1 → Position 10
S1-2 → Position 70
S1-3 → Position 120
S2-1 → Position 50
S2-2 → Position 80
S2-3 → Position 160
S3-1 → Position 30
S3-2 → Position 90
S3-3 → Position 140
```

Now, instead of just one point, `S1` is represented at **multiple positions**, making the distribution **more even**.

If **S1 fails**, its keys are more evenly redistributed among **S2 and S3**, rather than all going to **S2**.

# 4\. Code Implementation

Java

Run

```java
1import java.security.MessageDigest;
2import java.security.NoSuchAlgorithmException;
3import java.util.*;
4
5class ConsistentHashing {
6    private final int numReplicas; // Number of virtual nodes per server
7    private final TreeMap<Long, String> ring; // Hash ring storing virtual nodes
8    private final Set<String> servers; // Set of physical servers
9
10    public ConsistentHashing(List<String> servers, int numReplicas) {
11        this.numReplicas = numReplicas;
12        this.ring = new TreeMap<>();
13        this.servers = new HashSet<>();
14
15        // Add each server to the hash ring
16        for (String server : servers) {
17            addServer(server);
18        }
19    }
20
21    private long hash(String key) {
22        try {
23            MessageDigest md = MessageDigest.getInstance("MD5");
24            md.update(key.getBytes());
25            byte[] digest = md.digest();
26            return ((long) (digest[0] & 0xFF) << 24) |
27                   ((long) (digest[1] & 0xFF) << 16) |
28                   ((long) (digest[2] & 0xFF) << 8) |
29                   ((long) (digest[3] & 0xFF));
30        } catch (NoSuchAlgorithmException e) {
31            throw new RuntimeException("MD5 algorithm not found", e);
32        }
33    }
34
35    public void addServer(String server) {
36        servers.add(server);
37        for (int i = 0; i < numReplicas; i++) {
38            long hash = hash(server + "-" + i); // Unique hash for each virtual node
39            ring.put(hash, server);
40        }
41    }
42
43    public void removeServer(String server) {
44        if (servers.remove(server)) {
45            for (int i = 0; i < numReplicas; i++) {
46                long hash = hash(server + "-" + i);
47                ring.remove(hash);
48            }
49        }
50    }
51
52    public String getServer(String key) {
53        if (ring.isEmpty()) {
54            return null; // No servers available
55        }
56
57        long hash = hash(key);
58        // Find the closest server in a clockwise direction
59        Map.Entry<Long, String> entry = ring.ceilingEntry(hash);
60        if (entry == null) {
61            // If we exceed the highest node, wrap around to the first node
62            entry = ring.firstEntry();
63        }
64        return entry.getValue();
65    }
66}
67
68public class Main {
69    public static void main(String[] args) {
70        List<String> servers = Arrays.asList("S0", "S1", "S2", "S3", "S4", "S5");
71        ConsistentHashing ch = new ConsistentHashing(servers, 3);
72
73        // Step 2: Assign requests (keys) to servers
74        System.out.println("UserA is assigned to: " + ch.getServer("UserA"));
75        System.out.println("UserB is assigned to: " + ch.getServer("UserB"));
76
77        // Step 3: Add a new server dynamically
78        ch.addServer("S6");
79        System.out.println("UserA is now assigned to: " + ch.getServer("UserA"));
80
81        // Step 4: Remove a server dynamically
82        ch.removeServer("S2");
83        System.out.println("UserB is now assigned to: " + ch.getServer("UserB"));
84    }
85}
86
```

### **Explanation:**

#### **Key Components**

*   **Hash Ring (**`self.ring`**):** Stores hash values → server mappings. Uses **virtual nodes** (replicas) for better load balancing.
*   **Sorted Keys (**`self.sorted_keys`**):** Maintains a **sorted list** of hash values for efficient lookups.
*   **Server Set (**`self.servers`**):** Tracks active physical servers.

#### **Initialization (**`__init__`**)**

*   Calls `add_server()` for each server, hashing it multiple times (based on `num_replicas`) to ensure even distribution.

**Hashing Function (**`_hash`**)**

*   Uses **MD5 hashing** to convert strings into large integers for consistent placement on the hash ring.

**Adding a Server (**`add_server`**)**

*   Generates multiple hash values for each server (`server-0`, `server-1`, etc.).
*   Stores these in `self.ring` and maintains a sorted order in `self.sorted_keys` for fast lookup.

**Removing a Server (**`remove_server`**)**

*   Deletes the server’s hash values and its virtual nodes from `self.ring` and `self.sorted_keys`.

**Getting a Server (**`get_server`**)**

*   Hashes the input key and finds the closest **clockwise** server using `bisect.bisect()`. Wraps around to the first node if necessary.

Launching soon
