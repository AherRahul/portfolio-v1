---
title: "Consistent Hashing Explained"
description: "In a distributed system where nodes (servers) are frequently added or removed, efficiently routing requests becomes challenging."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/consistent-hashing-explained.md"
dateModified: "2025-02-18"
datePublished: "2025-02-18"
showOnArticles: true
topics:
  - system-design
---

In a  **distributed system**  where nodes (servers) are frequently  **added or removed** , efficiently routing requests becomes challenging.

A common approach is to use  **hash the request**  and assign it to a server using Hash(key) mod N, where N is the number of servers.

However, this method is highly dependent on the number of servers, and any change in N can lead to  **significant**   **rehashing** , causing a major redistribution of keys (requests).

**Consistent hashing**  addresses this issue by ensuring that only a small subset of keys need to be reassigned when nodes are added or removed.

Popularized by  **[Amazon’s Dynamo paper](https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf)** , it has now become a fundamental technique in distributed databases like DynamoDB, Cassandra and ScyllaDB.

In this article, we’ll explore what consistent hashing is, why it’s needed, how it works, and how to implement it in code.

If you’re enjoying this newsletter and want to get even more value, consider becoming a  **[paid subscriber](https://blog.algomaster.io/subscribe)** .

As a paid subscriber, you'll unlock all  **premium articles**  and gain full access to all  **[premium courses](https://algomaster.io/newsletter/paid/resources)**  on  **[algomaster.io](https://algomaster.io)** .

# 1. The Problem with Traditional Hashing

Imagine you're building a  **high-traffic web application**  that serves millions of users daily. To handle the load efficiently, you distribute incoming requests across multiple backend servers using a  **hash-based**   **load balancer** .

Your system consists of  **5 backend servers**  (S0, S1, S2, S3, S4), and requests are assigned using a hash function that maps each user's  **IP address to a specific server** .

[![image](https://substack-post-media.s3.amazonaws.com/public/images/44fe7140-c84e-4be0-b3c8-7c93fd373843_1498x1422.png)](https://substackcdn.com/image/fetch/$s_!mjt2!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F44fe7140-c84e-4be0-b3c8-7c93fd373843_1498x1422.png)

The process works like this:

1. The load balancer takes a user’s IP address (or session ID).
2. A  **hash function**  maps the IP to one of the backend servers by taking the  **sum of bytes in the IP address**  and computing mod 5 (since we have 5 servers).
3. The request is  **routed to the assigned server** , ensuring that the same user is always directed to the same server for session consistency.

**Example:**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/a414e8ee-1a04-491d-9728-ba20d2b6a000_2114x1148.png)](https://substackcdn.com/image/fetch/$s_!HsWk!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa414e8ee-1a04-491d-9728-ba20d2b6a000_2114x1148.png)

### **Everything Works Fine… Until You Scale**

This approach works  **as long as the number of servers remains constant** . But what happens when you  **add or remove a server** ?

#### **Scenario 1: Adding a New Server (S5)**

As traffic increases, you decide to  **scale up**  by adding a new backend server (S5). Now, the hash function must be modified to use mod 6 instead of mod 5 since we have 6 servers now.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/9416ad7c-2854-4102-bc70-87ac3ddf7089_2118x1290.png)](https://substackcdn.com/image/fetch/$s_!eGg7!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F9416ad7c-2854-4102-bc70-87ac3ddf7089_2118x1290.png)

This seemingly simple change  **completely disrupts the existing mapping** , causing  **most users to be reassigned to different servers** .

This results into  **massive rehashing** , leading to  **high overhead, and potential downtime** .

#### **Scenario 2: Removing a Server (S4)**

Now, let’s say one of the servers (S4) fails or is removed. The number of servers drops to 4, forcing the hash function to switch from mod 5 to mod 4.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/50affff1-61f2-4d78-87e3-983b731fff08_2116x1124.png)](https://substackcdn.com/image/fetch/$s_!tKfa!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F50affff1-61f2-4d78-87e3-983b731fff08_2116x1124.png)

Even though only  **one**  server was removed,  **most users are reassigned to different servers** . This can cause:

- **Session Loss:** Active users may be logged out or disconnected.
- **Cache invalidation:** Cached data becomes irrelevant, increasing database load.
- **Severe performance degradation:** The system may struggle to run efficiently.

### **The Solution: Consistent Hashing**

**Consistent hashing**  offers a more scalable and efficient solution by ensuring that only a  **small fraction of users**  are reassigned when scaling up or down.

It performs really well when operated in dynamic environments, where the system scales up and down frequently.

# 2. How Consistent Hashing Works

Consistent hashing is a  **distributed hashing technique**  used to efficiently distribute data across multiple nodes (servers, caches, etc.).

It uses a  **circular hash space**  (hash ring) with a large and constant hash space.

Both nodes (servers, caches, or databases) and keys (data items) are mapped to positions on this hash ring using a  **hash function** .

Unlike modulo-based hashing, where changes in the number of nodes cause large-scale remapping, consistent hashing ensures that only a small fraction of keys are reassigned when a node is added or removed, making it highly scalable and efficient.

> In consistent hashing, when the number of nodes changes, only k/n keys need to be reassigned, where k is the total number of keys and n is the total number of nodes.

## **2.1 Constructing the Hash Ring**

Instead of distributing keys based on Hash(key) mod N, consistent hashing places both servers and keys on a circular hash ring.

#### Defining the Hash Space

- We use a large, fixed hash space ranging from 0 to 2^32 - 1 (assuming a 32-bit hash function).
- This creates a circular structure, where values wrap around after reaching the maximum limit.

#### **Placing Servers on the Ring**

- Each  **server (node)**  is assigned a position on the hash ring by computing Hash(server_id).
- Using the above example with  **5 servers (** S0, S1, S2, S3, S4 **)** , the hash function distributes them at different positions around the ring.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/584274f3-e135-492f-a20e-ea415d4927d3_1536x1362.png)](https://substackcdn.com/image/fetch/$s_!0zaf!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F584274f3-e135-492f-a20e-ea415d4927d3_1536x1362.png)

#### **Mapping Keys to Servers**

- When a key is added, its position is determined by computing Hash(key).Example: a user’s request is assigned a position on the ring based on the hash of their IP address: Hash(IP Address)
- Example: a user’s request is assigned a position on the ring based on the hash of their IP address: Hash(IP Address)
- We then move clockwise around the ring until we find the next available server.
- The key (or request) is assigned to this server for storage or retrieval.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/b6a01929-75d6-4885-a400-602f588b0f69_1636x1362.png)](https://substackcdn.com/image/fetch/$s_!2Bh4!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb6a01929-75d6-4885-a400-602f588b0f69_1636x1362.png)

> **Note:**  In case a key’s hash falls directly on a node’s position, it belongs to that node.

## **2.2 Adding a New Server**

Suppose we add a  **new server (** S5 **)** to the system.

- The position of S5 falls between S1 and S2 in the hash ring.
- S5 takes over all keys (requests) that fall between S1 and S5, which were previously handled by S2. **Example:**  User D’s requests which were originally assigned to S2, will now be redirected to S5.
- **Example:**  User D’s requests which were originally assigned to S2, will now be redirected to S5.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/1dd6f660-5f49-4f85-9337-b653b06d5bdb_1700x1364.png)](https://substackcdn.com/image/fetch/$s_!7Frc!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1dd6f660-5f49-4f85-9337-b653b06d5bdb_1700x1364.png)

This demonstrates how consistent hashing efficiently redistributes keys with minimal disruption, ensuring that only a small subset of keys are reassigned when new servers are added.

## **2.3 Removing a Node**

When a server, such as S4, fails or is removed from the system:

- All keys previously assigned to S4 are reassigned to the next available server in the ring (S3).
- Only the keys (requests) that were mapped to S4 need to move, while all other keys remain unaffected.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/2c2383a5-cd36-4bda-9a8c-ddef6693974b_1756x1362.png)](https://substackcdn.com/image/fetch/$s_!X8so!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2c2383a5-cd36-4bda-9a8c-ddef6693974b_1756x1362.png)

This results in  **minimal data movement** , unlike traditional hashing where removing a node would require reassigning most keys.

# 3. Virtual Nodes

In  **basic consistent hashing** , each server is assigned  **a single position**  on the hash ring. However, this can lead to  **uneven data distribution** , especially when:

- The number of servers is small.
- Some servers accidentally get clustered together, creating  **hot spots** .
- A server is  **removed** , causing a sudden load shift to its immediate neighbor.

**Virtual nodes (VNodes)**  are a technique used in consistent hashing to improve  **load balancing**  and  **fault tolerance**  by distributing data more evenly across servers.

#### **How Virtual Nodes Work**

Instead of assigning one position per server, each physical server is assigned  **multiple positions**  (virtual nodes) on the hash ring.

- Each server is hashed multiple times to different locations on the ring.
- When a request (key) is hashed, it is assigned to the next virtual node in a clockwise direction.
- The request is then routed to the actual server associated with the virtual node.

#### Example

Assume we have  **three physical servers (S1, S2, S3)** . Without virtual nodes, their positions might be:

```
S1 → Position 10
S2 → Position 50
S3 → Position 90
```

[![image](https://substack-post-media.s3.amazonaws.com/public/images/91f7ac93-93fb-4da2-a634-18d2942e6020_1660x1338.png)](https://substackcdn.com/image/fetch/$s_!Bbr2!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F91f7ac93-93fb-4da2-a634-18d2942e6020_1660x1338.png)

If  **S1 fails** , all its keys must be reassigned to  **S2** , which can create an overload.

With  **virtual nodes** , each server is hashed multiple times:

```
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

[![image](https://substack-post-media.s3.amazonaws.com/public/images/d2ba83bb-b944-4b89-97c5-ebf06314c63e_1838x1390.png)](https://substackcdn.com/image/fetch/$s_!5fde!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fd2ba83bb-b944-4b89-97c5-ebf06314c63e_1838x1390.png)

Now, instead of just one point, S1 is represented at  **multiple positions** , making the distribution  **more even** .

If  **S1 fails** , its keys are more evenly redistributed among  **S2 and S3** , rather than all going to  **S2** .

# 4. Code Implementation (Python)

[![image](https://substack-post-media.s3.amazonaws.com/public/images/1e80b7c3-3e3e-4ec6-af39-5883f771be1c_761x1076.png)](https://substackcdn.com/image/fetch/$s_!3wyU!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1e80b7c3-3e3e-4ec6-af39-5883f771be1c_761x1076.png)


#### **Explanation:**

1. **Key Components** 

- **Hash Ring (** self.ring **):** Stores hash values → server mappings. Uses  **virtual nodes**  (replicas) for better load balancing.
- **Sorted Keys (** self.sorted_keys **):** Maintains a  **sorted list**  of hash values for efficient lookups.
- **Server Set (** self.servers **):** Tracks active physical servers.
2. **Initialization (** __init__ **)** 

- Calls add_server() for each server, hashing it multiple times (based on num_replicas) to ensure even distribution.
3. **Hashing Function (** _hash **)** 

- Uses  **MD5 hashing**  to convert strings into large integers for consistent placement on the hash ring.
4. **Adding a Server (** add_server **)** 

- Generates multiple hash values for each server (server-0, server-1, etc.).
- Stores these in self.ring and maintains a sorted order in self.sorted_keys for fast lookup.
5. **Removing a Server (** remove_server **)** 

- Deletes the server’s hash values and its virtual nodes from self.ring and self.sorted_keys.
6. **Getting a Server (** get_server **)** 

- Hashes the input key and finds the closest  **clockwise**  server using bisect.bisect(). Wraps around to the first node if necessary.



Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
