---
title: Clone Graph
description: Master Clone Graph in the Graphs module. Comprehensive guide and
  algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given a reference of a node in a [**connected**](https://en.wikipedia.org/wiki/Connectivity_\(graph_theory\)#Connected_graph) undirected graph\.

Return a [**deep copy**](https://en.wikipedia.org/wiki/Object_copying#Deep_copy) \(clone\) of the graph\.

Each node in the graph contains a value \(`int`\) and a list \(`List[Node]`\) of its neighbors\.

class Node \{ public int val; public List<Node> neighbors;\} 

**Test case format:**

For simplicity, each node's value is the same as the node's index \(1\-indexed\)\. For example, the first node with `val == 1`, the second node with `val == 2`, and so on\. The graph is represented in the test case using an adjacency list\.

**An adjacency list** is a collection of unordered **lists** used to represent a finite graph\. Each list describes the set of neighbors of a node in the graph\.

The given node will always be the first node with `val = 1`\. You must return the **copy of the given node** as a reference to the cloned graph\.

##### **Example 1:**

**Input:** adjList = \[\[2,4\],\[1,3\],\[2,4\],\[1,3\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
  </div>
</div>

**Output:** \[\[2,4\],\[1,3\],\[2,4\],\[1,3\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">4</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">3</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">4</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">3</span></div>
    </div>
  </div>
</div>

**Explanation:** There are 4 nodes in the graph\.

1st node \(val = 1\)'s neighbors are 2nd node \(val = 2\) and 4th node \(val = 4\)\.

2nd node \(val = 2\)'s neighbors are 1st node \(val = 1\) and 3rd node \(val = 3\)\.

3rd node \(val = 3\)'s neighbors are 2nd node \(val = 2\) and 4th node \(val = 4\)\.

4th node \(val = 4\)'s neighbors are 1st node \(val = 1\) and 3rd node \(val = 3\)\.

##### **Example 2:**

**Input:** adjList = \[\[\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
    </div>
  </div>
</div>

**Output:** \[\[\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
    </div>
  </div>
</div>

**Explanation:** Note that the input contains one empty list\. The graph consists of only one node with val = 1 and it does not have any neighbors\.

##### **Example 3:**

**Input:** adjList = \[\]

**Output:** \[\]

**Explanation:** This an empty graph, it does not have any nodes\.

##### **Constraints:**

*   The number of nodes in the graph is in the range `[0, 100]`\.
*   `1 <= Node.val <= 100`
*   `Node.val` is unique for each node\.
*   There are no repeated edges and no self\-loops in the graph\.
*   The Graph is connected and all nodes can be visited starting from the given node\.


## Approaches

### 1\. Depth\-First Search \(DFS\)

#### Intuition:

The DFS approach involves recursively creating clone nodes and copying the connections \(neighbors\) in a depth\-first manner\. We use a hashmap to store the node's original as a key and its clone as a value to avoid creating multiple copies of the same node\.

#### Steps:

1.  A base case checks if the input node is `null`, returning `null` if true\.
2.  If the node has already been cloned \(exists in the hashmap\), return the cloned node\.
3.  Initiate a clone node and store it in the hashmap\.
4.  Recursively visit each neighbor of the node and add the cloned neighbors to the clone node's neighbors list\.
5.  Return the cloned node\.

#### Code:

```java
// Definition for a Node.
class Node {
   public int val;
   public List<Node> neighbors;
   public Node() {
       val = 0;
       neighbors = new ArrayList<Node>();
   }
   public Node(int _val) {
       val = _val;
       neighbors = new ArrayList<Node>();
   }
   public Node(int _val, ArrayList<Node> _neighbors) {
       val = _val;
       neighbors = _neighbors;
   }
}

public class Solution {
   private Map<Node, Node> visited = new HashMap<>();
   
   public Node cloneGraph(Node node) {
       // Base case
       if (node == null) {
           return null;
       }

       // If the node was already visited, return the clone from the hashmap
       if (visited.containsKey(node)) {
           return visited.get(node);
       }

       // Create a clone for the node
       Node cloneNode = new Node(node.val);
       visited.put(node, cloneNode);

       // Iterate over the neighbors to populate the cloned graph
       for (Node neighbor : node.neighbors) {
           cloneNode.neighbors.add(cloneGraph(neighbor));
       }
       return cloneNode;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes\. Each node and edge is traversed once\.
*   **Space Complexity:** O\(N\) due to the recursion stack and hashmap storage of the nodes\.

### 2\. Breadth\-First Search \(BFS\)

#### Intuition:

This approach consists of a breadth\-first traversal using a queue\. It uses a hashmap to store cloned nodes and iteratively connects neighbors by dequeuing nodes and exploring their neighbors\.

#### Steps:

1.  Handle the base case where input node is `null` by returning `null`\.
2.  Use a hashmap to store visited and cloned nodes\.
3.  Initialize a queue with the original node and clone the root node\.
4.  While the queue is not empty, process the node:

*   For each neighbor, if not cloned, clone and enqueue it\.
*   Update the current node's clone to include the clone of its neighbors\.

6.  Once traversal ends, return the clone of the original node\.

#### Code:

```java
class CloneGraph {
   public Node cloneGraph(Node node) {
       if (node == null) {
           return null;
       }

       // Map to store the visited node and its respective clone
       Map<Node, Node> visited = new HashMap<>();

       // Put the first node in the queue
       Queue<Node> queue = new LinkedList<>();
       queue.add(node);

       // Clone the node and put it in the visited map
       visited.put(node, new Node(node.val));

       // Start BFS traversal
       while (!queue.isEmpty()) {
           // Extract a node from the front of the queue
           Node n = queue.poll();

           // Iterate through its neighbors
           for (Node neighbor : n.neighbors) {
               if (!visited.containsKey(neighbor)) {
                   // Clone the neighbor and add it to the visited map
                   visited.put(neighbor, new Node(neighbor.val));
                   // Add the newly encountered node to the queue
                   queue.add(neighbor);
               }
               // Add the cloned neighbor to the current node's neighbor list
               visited.get(n).neighbors.add(visited.get(neighbor));
           }
       }
       // Return the clone of the starting node
       return visited.get(node);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes\. Each node and edge is traversed once\.
*   **Space Complexity:** O\(N\) for the hashmap and queue\.

#### [Solve it on LeetCode](https://leetcode.com/problems/clone-graph)
