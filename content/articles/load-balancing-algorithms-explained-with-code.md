---
title: "Load Balancing Algorithms Explained with Code"
description: "Load balancing is the process of distributing incoming network traffic across multiple servers to ensure that no single server is overwhelmed."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/load-balancing-algorithms-explained-with-code.md"
dateModified: "2024-06-02"
datePublished: "2024-06-02"
showOnArticles: true
topics:
  - system-design
---

Load balancing is the process of  **distributing incoming network traffic**  across multiple servers to ensure that no single server is overwhelmed.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/a5215d10-fcd8-4c50-acb6-ccbb36dea24f_832x1000.png)](https://substackcdn.com/image/fetch/$s_!QKkY!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa5215d10-fcd8-4c50-acb6-ccbb36dea24f_832x1000.png)

By evenly spreading the workload, load balancing aims to  **prevent overload**  on a single server,  **enhance performance**  by reducing response times and  **improve availability**  by rerouting traffic in case of server failures.

There are several algorithms to achieve load balancing, each with its pros and cons.

In this article, we will dive into the most commonly used load balancing algorithms, how they work, when to use them, their benefits/drawbacks and how to implement them in code.

If you’re enjoying this newsletter and want to get even more value, consider becoming a  **[paid subscriber](https://blog.algomaster.io/subscribe)** .

As a paid subscriber, you'll unlock all  **premium articles**  and gain full access to all  **[premium courses](https://algomaster.io/newsletter/paid/resources)**  on  **[algomaster.io](https://algomaster.io)** .

# **Algorithm 1: Round Robin**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/54114fcc-cce5-4f0d-a678-47f8f0339fd4_1304x1076.png)](https://substackcdn.com/image/fetch/$s_!jpjg!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F54114fcc-cce5-4f0d-a678-47f8f0339fd4_1304x1076.png)

#### **How it Works:**

1. A request is sent to the first server in the list.
2. The next request is sent to the second server, and so on.
3. After the last server in the list, the algorithm loops back to the first server.

#### **When to Use** :

- When all servers have similar processing capabilities and are equally capable of handling requests.
- When simplicity and even distribution of load is more critical.

#### **Benefits** :

- Simple to implement and understand.
- Ensures even distribution of traffic.

#### **Drawbacks** :

- Does not consider server load or response time.
- Can lead to inefficiencies if servers have different processing capabilities.

#### **Implementation:**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/ea11f328-dd14-43d9-adb4-967651f8c4f3_2912x1716.png)](https://substackcdn.com/image/fetch/$s_!8xw6!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fea11f328-dd14-43d9-adb4-967651f8c4f3_2912x1716.png)

In this implementation, the RoundRobin class maintains a  **list of servers**  and keeps track of the  **current index** .

The get_next_server() updates the index and returns the next server in the cycle.

# Algorithm 2: Weighted Round Robin

[![image](https://substack-post-media.s3.amazonaws.com/public/images/db12546e-4905-46b0-89e6-80ab007a6aa2_1570x1110.png)](https://substackcdn.com/image/fetch/$s_!v6Dt!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fdb12546e-4905-46b0-89e6-80ab007a6aa2_1570x1110.png)

#### **How it Works:**

1. Each server is assigned a  **weight**  based on their processing power or available resources.
2. Servers with higher weights receive a proportionally larger share of incoming requests.

#### When to use:

- When servers have different processing capabilities or available resources.
- When you want to distribute the load based on the capacity of each server.

#### **Benefits** :

- Balances load according to server capacity.
- More efficient use of server resources.

#### **Drawbacks** :

- Slightly more complex to implement than simple Round Robin.
- Does not consider current server load or response time.

#### **Implementation:**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/7c138f0a-d1e6-463d-be1f-dfa06cb8a402_3060x2528.png)](https://substackcdn.com/image/fetch/$s_!C6xU!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F7c138f0a-d1e6-463d-be1f-dfa06cb8a402_3060x2528.png)


In this implementation, the WeightedRoundRobin class takes a list of servers and their corresponding weights.

The get_next_server() method runs an infinite loop to find a suitable server based on the weights, ensuring that servers with higher weights receive more requests.

The algorithm keeps track of the current weight and adjusts it in each iteration to maintain the desired distribution ratio.

**Example:**  if the weights are [5, 1, 1], Server 1 will be selected 5 times more often than Server 2 or Server 3.

# **Algorithm 3: Least Connections**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/c42a1db9-75b4-4a52-9e9b-dfcc0118c235_1728x1118.png)](https://substackcdn.com/image/fetch/$s_!MRhR!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc42a1db9-75b4-4a52-9e9b-dfcc0118c235_1728x1118.png)

#### **How it Works:**

1. Monitor the  **number of active connections**  on each server.
2. Assigns incoming requests to the server with the least number of active connections.

#### When to use:

- When you want to distribute the load based on the current number of active connections.
- When servers have similar processing capabilities but may have different levels of concurrent connections.

#### **Benefits** :

- Balances load more dynamically based on current server load.
- Helps prevent any server from becoming overloaded with a high number of active connections.

#### **Drawbacks** :

- May not be optimal if servers have different processing capabilities.
- Requires tracking active connections for each server.

#### **Implementation:**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/21a93e0e-f38c-4c12-9dc1-c537a10bbf65_3680x2888.png)](https://substackcdn.com/image/fetch/$s_!SyrO!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F21a93e0e-f38c-4c12-9dc1-c537a10bbf65_3680x2888.png)


In this example, the LeastConnections class maintains a map of servers and the number of active connections for each server.

The get_next_server() method selects a random server with the least number of connections and increments the connection count for that server.

The release_connection() method is called when a connection is closed, decrementing the connection count for the corresponding server.

# **Algorithm 4: Least Response Time**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/13178f62-358e-4717-83e9-f404bf9f91e5_1710x1120.png)](https://substackcdn.com/image/fetch/$s_!WU5I!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F13178f62-358e-4717-83e9-f404bf9f91e5_1710x1120.png)

#### **How It Works** :

- Monitors the response time of each server
- Assigns incoming requests to the server with the fastest response time.

#### **When to Use** :

- When you have servers with varying response times and want to route requests to the fastest server.

#### **Benefits** :

- Minimizes overall latency by selecting the server with the fastest response time.
- Can adapt dynamically to changes in server response times.
- Helps improve the user experience by providing quick responses.

#### **Drawbacks** :

- Requires accurate measurement of server response times, which can be challenging in distributed systems.
- May not consider other factors such as server load or connection count.

#### **Implementation:**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/1b35e86a-239e-4633-a1e0-89aa38324389_2584x3336.png)](https://substackcdn.com/image/fetch/$s_!NNqg!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F1b35e86a-239e-4633-a1e0-89aa38324389_2584x3336.png)


In this example, the LeastResponseTime class maintains a list of servers and keeps track of the response time for each server.

The get_next_server() method selects the server with the least response time. The update_response_time() method is called after each request to update the response time for the corresponding server.

To simulate the response time, we use a simulate_response_time() function that introduces a random delay to mimic the server's response time.

In a real-world scenario, you would measure the actual response time of each server.

# **Algorithm 5: IP Hash**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/c38a5648-bcdf-487c-9fe6-a0a179eb5f72_1304x1098.png)](https://substackcdn.com/image/fetch/$s_!qMbL!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc38a5648-bcdf-487c-9fe6-a0a179eb5f72_1304x1098.png)

#### **How It Works** :

- Calculates a hash value from the client’s IP address and uses it to determine the server to route the request.

#### **When to Use** :

- When you need session persistence, as requests from the same client are always directed to the same server.

#### **Benefits** :

- Simple to implement.
- Useful for applications that require sticky sessions.

#### **Drawbacks** :

- Can lead to uneven load distribution if certain IP addresses generate more traffic than others.
- Lacks flexibility if a server goes down, as the hash mapping may need to be reconfigured.

#### **Implementation:**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/b6dfb1f4-34f2-4eac-aa1f-7468d2e88fdf_2912x1988.png)](https://substackcdn.com/image/fetch/$s_!JKRt!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb6dfb1f4-34f2-4eac-aa1f-7468d2e88fdf_2912x1988.png)

In this implementation, the IPHash class takes a list of servers.

The get_next_server() method calculates the MD5 hash of the client's IP address and uses the modulo operator to determine the index of the server to which the request should be routed.

This ensures that  **requests from the same IP address are always directed to the same server.**

# **Summary:**

- **Round Robin** : Simple and even distribution, best for homogeneous servers.
- **Weighted Round Robin** : Distributes based on server capacity, good for heterogeneous environments.
- **Least Connections** : Dynamically balances based on load, ideal for varying workloads.
- **Least Response Time** : Optimizes for fastest response, best for environments with varying server performance.
- **IP Hash** : Ensures session persistence, useful for stateful applications.

Choosing the right load balancing algorithm depends on the specific needs and characteristics of your system, including server capabilities, workload distribution, and performance requirements.



Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
