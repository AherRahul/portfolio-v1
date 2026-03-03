---
title: Binary Tree Level Order Traversal
description: Master Binary Tree Level Order Traversal in the Binary Tree module.
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

Given the `root` of a binary tree, return _the level order traversal of its nodes' values_\. \(i\.e\., from left to right, level by level\)\.

##### **Example 1:**

Input:root=\[3,9,20,null,null,15,7\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">9</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">20</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">3</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">4</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">15</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">7</span></div>
  </div>
</div>

3920157

**Output:** \[\[3\],\[9,20\],\[15,7\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">3</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">9</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">20</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">15</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">7</span></div>
    </div>
  </div>
</div>

##### **Example 2:**

Input:root=\[1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
  </div>
</div>

**Output:** \[\[1\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
    </div>
  </div>
</div>

##### **Example 3:**

**Input:** root = \[\]

**Output:** \[\]

##### **Constraints:**

*   The number of nodes in the tree is in the range `[0, 2000]`\.
*   `-1000 <= Node.val <= 1000`


## Approaches

### 1\. Iterative using Queue \(Breadth\-First Search\)

#### Intuition:

The most intuitive way to achieve level order traversal is by using a queue \(FIFO\) data structure\. The idea is to process each level of the binary tree one at a time, adding child nodes to the queue as we go\. This way, we ensure nodes are processed level by level\.

#### Steps:

1.  Initialize an empty `Queue` and an empty list `result`\.
2.  Add the root of the tree to the queue\.
3.  While the queue is not empty:

*   Determine the number of nodes at this level \(`size` of the queue\)\.
*   For each node in the current level, remove the node from the queue and add its value to a temporary list\.
*   Add the left and right children \(if they exist\) to the queue\.
*   After processing all nodes at this level, add the temporary list to the result\.

5.  Finally, return the `result` list which contains nodes level by level\.

#### Code:

```java
class Solution {
   public List<List<Integer>> levelOrder(TreeNode root) {
       List<List<Integer>> result = new ArrayList<>();
       
       // Base case: If the tree is empty
       if (root == null) {
           return result;
       }
       
       // Use a queue to facilitate level order traversal
       Queue<TreeNode> queue = new LinkedList<>();
       queue.offer(root);
       
       while (!queue.isEmpty()) {
           int levelSize = queue.size(); // Number of nodes at the current level
           List<Integer> currentLevel = new ArrayList<>();
           
           for (int i = 0; i < levelSize; i++) {
               TreeNode currentNode = queue.poll(); // Get the front node
               currentLevel.add(currentNode.val); // Add its value to the current level list
               
               // Add the node's children to the queue if they exist
               if (currentNode.left != null) {
                   queue.offer(currentNode.left);
               }
               if (currentNode.right != null) {
                   queue.offer(currentNode.right);
               }
           }
           
           result.add(currentLevel); // Add the current level list to the result
       }
       
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\) \- Each node is processed exactly once\.
*   **Space Complexity:** O\(N\) \- Holds up to N/2 nodes in the queue for the most balanced tree, which simplifies to O\(N\)\.

### 2\. Recursive using Depth\-First Search

#### Intuition:

An alternative is to use recursion to perform a depth\-first search, keeping track of the depth of the current node\. The goal is to add each node to a list that corresponds to its depth level\.

#### Steps:

1.  Define a helper function that:

*   Takes the current node, depth, and the result list\.
*   If the current node is null, return immediately\.
*   If the current depth matches the size of the result list, create a new list at that depth\.
*   Add the current node's value to its corresponding depth in the result list\.
*   Recurse deeper into the tree by calling the function for the left and right children\.

3.  Call the helper function starting with the root node at depth 0\.
4.  Return the `result` list containing the nodes level by level\.

#### Code:

```java
class Solution {
   public List<List<Integer>> levelOrder(TreeNode root) {
       List<List<Integer>> result = new ArrayList<>();
       levelOrderHelper(root, 0, result);
       return result;
   }

   private void levelOrderHelper(TreeNode node, int depth, List<List<Integer>> result) {
       // Base case: If it's a null node
       if (node == null) {
           return;
       }

       // Ensure the result list has a list for the current depth
       if (depth == result.size()) {
           result.add(new ArrayList<>());
       }

       // Add the current node's value to the corresponding depth in the result
       result.get(depth).add(node.val);

       // Recurse on the left and right children, incrementing depth
       levelOrderHelper(node.left, depth + 1, result);
       levelOrderHelper(node.right, depth + 1, result);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\) \- Each node is visited once\.
*   **Space Complexity:** O\(N\) \- Potentially O\(H\) for the recursion stack, where H is the height of the tree\. However, the result list also uses space proportional to N in the worst case\.

#### [Solve it on LeetCode](https://leetcode.com/problems/binary-tree-level-order-traversal)
