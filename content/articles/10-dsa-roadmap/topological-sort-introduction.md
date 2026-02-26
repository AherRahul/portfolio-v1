---
title: Topological Sort
description: Master Topological Sort in the Graphs module. Comprehensive guide
  and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

**Topological Sort is** a powerful graph algorithm that helps arrange elements in a sequence when some of the elements depend on others\.

Imagine you're building a **task scheduler**—you have got multiple tasks to complete, but some tasks can’t start until others are finished\.

How do you determine the correct order to execute them?

This is exactly the type of problem that Topological sort solves\.

And if you’re preparing for **coding interviews**, this is a **must\-know algorithm**\!

In this video, I’ll break down:

*   What topological sort is
*   how it works
*   when to use it?
*   Two different ways to implement it

So, let’s jump in\!

# What is Topological Sort?

Topological sort answers a simple but powerful question: **In what order should we process a set of elements when some of them depend on others?**

It applies to problems that can be modeled as a **Directed Acyclic Graph \(DAG\)**—a graph with directed edges and **no cycles**\.

The goal is to produce a **linear ordering** of vertices such that: **for every directed edge** `**u → v**`**, vertex** `**u**` **appears before vertex** `**v**` **in the final sequence\.**

For example, consider this dependency graph:

*   A depends on B
*   B depends on C
*   D has no dependencies

A valid topological ordering would be: C→B→A→D\.

Two important things to keep in mind:

*   Topological sort works only on DAGs\. If the graph has even one cycle, a valid ordering cannot exist\.
*   **and There may be more than one valid topological order** for the same graph\.

# When to use Topological Sorting?

Topological sort is used whenever you need to process items **in an order that respects dependencies**\.

Common examples include:

*   **Task Scheduling \-** When some tasks cannot start until others are finished\.
*   **Course planning \-** where you need to determine a valid order to take courses when some of them have prerequisites\.
*   **Compilers \-** Compilers use topological sorting to analyze dependencies between functions, modules, and files to determine execution order\.
*   **Package Managers:** Libraries like NPM and pip use topological sorting to install dependencies in the correct order\.

# How to Implement Topological Sorting

There are two common ways to implement topological sort:

*   **Using Depth\-First Search \(DFS\)**
*   **and Using Breadth\-First Search \(Kahn’s Algorithm\)**

Let’s start with the DFS approach\.

*   **Depth First Search** works by exploring each path to its **deepest point** before backtracking\. This guarantees that all dependencies of a node are fully processed **before** the node itself\.
*   When we **finish exploring a node**, **we record it**\.
*   The order in which nodes are recorded **determines a valid topological order**\.

DFS\-based implementation can be done **recursively** or **iteratively using stack**\. In this video, we’ll discuss the **recursive approach**\.

### METHOD 1: DFS Approach

Here I am using Java, but you can find the code for other popular programming languages at [algomaster\.io](http://algomaster.io)\. Link is in the description\.

Here’s how it works:

*   We use a **stack** to collect nodes **after** all of their dependencies have been processed\.

*   The reason we use a **stack** is because the correct topological order is actually **the reverse** of the order in which DFS finishes visiting nodes\.
*   The **last finished** node should come **first** in the final order\.
*   Since a **stack follows Last\-In\-First\-Out \(LIFO\)**, popping elements gives us the correct **topological order**\.

*   We run DFS from each unvisited node\.
*   After exploring all children of a node, we push it into the stack\.
*   In the end, we pop everything from the stack to get the topological order\.

Java

```java
import java.util.*;

class TopologicalSortDFS {
   static void dfs(int node, List<List<Integer>> adj, boolean[] visited, Stack<Integer> stack) {
       visited[node] = true; // Mark current node as visited
       
       // Visit all unvisited neighbors
       for (int neighbor : adj.get(node)) {
           if (!visited[neighbor]) {
               dfs(neighbor, adj, visited, stack);
           }
       }
       
       // After all dependencies are visited, push to stack
       stack.push(node);
   }

   static List<Integer> topologicalSort(int V, List<List<Integer>> adj) {
       Stack<Integer> stack = new Stack<>();
       boolean[] visited = new boolean[V];

				// Run DFS on all unvisited nodes
       for (int i = 0; i < V; i++) {
           if (!visited[i]) {
               dfs(i, adj, visited, stack);
           }
       }

				// Pop elements from stack to get the final topological order
       List<Integer> topoOrder = new ArrayList<>();
       while (!stack.isEmpty()) {
           topoOrder.add(stack.pop());
       }
       return topoOrder;
   }
}
```

For this graph, the DFS traversal might visit nodes in the order`A → B → C → D`

But the key thing is:

*   Nodes are **pushed to the stack during backtracking**, not during the first visit\.
*   That gives us the reversed finish order automatically\.
*   Popping from the stack then yields a valid topological sequence\.

Now that we understand the DFS\-based approach, let’s look at a more **intuitive and interview\-friendly** alternative —the **Breadth\-First Search approach**, also known as **Kahn’s Algorithm**\.

### METHOD 2: BFS Approach \- Kahn’s Algorithm

Kahn’s Algorithm is an **iterative, queue\-based** method for topological sorting\.

It repeatedly removes nodes with **no incoming edges** \(no unmet dependencies\), building a valid order as it goes\.

Kahn’s Algorithm is based on a simple idea:

> If a node has no incoming edges \(or prerequisites\), it can be processed first\. Removing it reduces the indegree of its neighbors; any neighbor for which indegree drops to 0 is processed in the next iteration\.

Here’s how it works step\-by\-step:

**Step 1: Compute in\-degree for each nodes**

The **indegree** of a node is **the number of incoming edges** \(or dependencies\) pointing to it\.

For example, in this graph:

```shell
→ 1 → 3
     ↓
     2 → 3
```

*   The indegree of node 0 is 0
*   For node 1 it’s 1 since it depends on node 0
*   For node 2 it’s 1 since it depends on node 1
*   and for node 3 it’s 2 since it depends on both node 1 and 2

**Step 2: Identify Nodes with 0 Indegree**

Any node with `0 indegree` **can be processed first**, since it has no dependencies\.

Add these ready\-to\-process nodes to a queue\.

**Step 3: Process Nodes using BFS**

While the queue isn't empty:

*   Remove a node from the queue and add it to our result list
*   For each of its neighbors:

*   Reduce their indegree by 1 \(since we've processed one of their dependencies\)
*   If any neighbor's indegree becomes 0, add it to the queue

This ensures each node is only processed after all its prerequisites have been handled\.

At the end, if the result contains **fewer than V nodes**, the graph isn’t a DAG \(there’s a cycle\), so **no topological order exists**\.

Here’s how to implement it in code:

Java

```java
class TopologicalSortBFS {
   static List<Integer> topologicalSort(int V, List<List<Integer>> adj) {
       int[] indegree = new int[V];
       for (List<Integer> neighbors : adj) {
           for (int neighbor : neighbors) {
               indegree[neighbor]++;
           }
       }

       Queue<Integer> queue = new LinkedList<>();
       for (int i = 0; i < V; i++) {
           if (indegree[i] == 0) queue.add(i);
       }

       List<Integer> topoOrder = new ArrayList<>();
       while (!queue.isEmpty()) {
           int node = queue.poll();
           topoOrder.add(node);
           for (int neighbor : adj.get(node)) {
               if (--indegree[neighbor] == 0) queue.add(neighbor);
           }
       }

       return topoOrder;
   }
}
```

*   Creates an `indegree` array to track how many incoming edges each vertex has
*   Iterates through the adjacency list
*   For each vertex, increments the indegree count of its neighbors
*   Initialize a queue for BFS traversal
*   Add all the vertices with indegree 0 to the queue as our starting points\.
*   While the queue isn't empty:

*   Poll a vertex from the queue
*   Add it to the result list
*   For each neighbor of the current vertex:

*   Decrement its indegree \(remove dependency\)
*   If its indegree becomes 0 \(all dependencies satisfied\), add it to the queue

*   The final list contains vertices in a valid topological order

The time complexity is O\(V \+ E\), as each vertex and edge is processed exactly once during the traversal\.

The space complexity is O\(V\), required for storing the indegree array, result list, and BFS queue\.

By the end of this process, if we have processed **all nodes**, we get a valid **topological order**\.

However, if some nodes remain unprocessed, it means the graph contains a **cycle**, making topological sorting **impossible**\.

Kahn’s Algorithm offers two clear advantages over the DFS\-based approach:

1.  It’s iterative, not recursive \- making it memory\-efficient and easier to implement in coding interviews\.
2.  It has a built\-in cycle detection\. If a cycle exists, Kahn’s algorithm **identifies it** by detecting if no node with indegree 0 is left while some nodes are still unprocessed\. The DFS approach, on the other hand, does **not** detect cycles unless you add additional tracking logic\.