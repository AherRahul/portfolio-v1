---
title: All Paths From Source to Target
description: Master All Paths From Source to Target in the Graphs module.
  Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given a directed acyclic graph \(**DAG**\) of `n` nodes labeled from `0` to `n - 1`, find all possible paths from node `0` to node `n - 1` and return them in **any order**\.

The graph is given as follows: `graph[i]` is a list of all nodes you can visit from node `i` \(i\.e\., there is a directed edge from node `i` to node `graph[i][j]`\)\.

##### **Example 1:**

**Input:** graph = \[\[1,2\],\[3\],\[3\],\[\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
    <div class="arr-viz-grid-row">
    </div>
  </div>
</div>

**Output:** \[\[0,1,3\],\[0,2,3\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">3</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">3</span></div>
    </div>
  </div>
</div>

**Explanation:** There are two paths: 0 \-> 1 \-> 3 and 0 \-> 2 \-> 3\.

##### **Example 2:**

**Input:** graph = \[\[4,3,1\],\[3,2,4\],\[3\],\[4\],\[\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
    </div>
    <div class="arr-viz-grid-row">
    </div>
  </div>
</div>

**Output:** \[\[0,4\],\[0,3,4\],\[0,1,3,4\],\[0,1,2,3,4\],\[0,1,4\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">4</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">4</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">4</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">4</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">4</span></div>
    </div>
  </div>
</div>

#### **Constraints:**

*   `n == graph.length`
*   `2 <= n <= 15`
*   `0 <= graph[i][j] < n`
*   `graph[i][j] != i` \(i\.e\., there will be no self\-loops\)\.
*   All the elements of `graph[i]` are **unique**\.
*   The input graph is **guaranteed** to be a **DAG**\.


## Approaches

### 1\. DFS Backtracking

#### **Intuition:**

The problem is essentially asking for all paths from node `0` to node `n-1` in a Directed Acyclic Graph \(DAG\)\. DFS \(Depth First Search\) is well\-suited for exploring all possibilities in the graph\. By using a backtracking approach, we can explore each path from the source to the target and backtrack once we reach the end to explore alternative paths\.

#### **Steps:**

1.  Start DFS from node `0`\. Explore each path by recursively visiting each node's neighbors\.
2.  Maintain a path list and whenever a node is visited, append it to the path\.
3.  If the current node is the target node `n-1`, add a copy of the path to the result list\.
4.  Backtrack by removing the node from the path list before exploring other neighbors\.
5.  Return all paths found once DFS exploration is complete\.

#### Code:

```java
class Solution {
   public List<List<Integer>> allPathsSourceTarget(int[][] graph) {
       List<List<Integer>> allPaths = new ArrayList<>();
       List<Integer> path = new ArrayList<>();
       path.add(0); // start from node 0
       dfs(graph, 0, path, allPaths);
       return allPaths;
   }
   
   private void dfs(int[][] graph, int currentNode, List<Integer> path, List<List<Integer>> allPaths) {
       // If current node is the last node in graph, add the path to results
       if (currentNode == graph.length - 1) {
           allPaths.add(new ArrayList<>(path));
           return;
       }
       // Explore each neighbor of the current node
       for (int neighbor : graph[currentNode]) {
           path.add(neighbor); // add neighbor to current path
           dfs(graph, neighbor, path, allPaths); // Explore path from this neighbor
           path.remove(path.size() - 1); // Backtrack: remove neighbor after exploring
       }
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(2^n \* n\), because in the worst case, there can be `2^n` paths, and each path can be of length `n`\.
*   **Space Complexity:** O\(n\), the space used by the recursion stack\.

### 2\. BFS Using a Queue

#### **Intuition:**

You can also solve this problem using BFS\. The goal of BFS is to explore all neighbors at the present depth before moving on to nodes at the next depth level\. By storing paths in the queue, at each step, when you explore a node, you construct and enqueue new paths adding each of the node's neighbors\.

#### **Steps:**

1.  Initialize a queue and add the initial path starting from node `0`\.
2.  While the queue is not empty, pop paths from the queue\.
3.  Extend each path by appending each of the current node's neighbors and enqueue the new path\.
4.  If a path reaches the target node `n-1`, add it to the results\.
5.  Continue until all paths are explored\.

#### Code:

```java
class Solution {
   public List<List<Integer>> allPathsSourceTarget(int[][] graph) {
       List<List<Integer>> allPaths = new ArrayList<>();
       Queue<List<Integer>> queue = new LinkedList<>();
       queue.add(Arrays.asList(0)); // Start with a path from node 0
       
       while (!queue.isEmpty()) {
           List<Integer> path = queue.poll();
           int currentNode = path.get(path.size() - 1);

           if (currentNode == graph.length - 1) {
               allPaths.add(new ArrayList<>(path)); // add path if it ends with target
           } else {
               for (int neighbor : graph[currentNode]) {
                   List<Integer> newPath = new ArrayList<>(path);
                   newPath.add(neighbor);
                   queue.add(newPath); // enqueue new path with neighbor
               }
           }
       }
       return allPaths;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(2^n \* n\), similar to DFS, as you are exploring every possible path\.
*   **Space Complexity:** O\(2^n \* n\), for storing all paths in the queue\.

#### [Solve it on LeetCode](https://leetcode.com/problems/all-paths-from-source-to-target)
