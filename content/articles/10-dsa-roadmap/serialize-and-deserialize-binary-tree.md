---
title: Serialize and Deserialize Binary Tree
description: Master Serialize and Deserialize Binary Tree in the Binary Tree
  module. Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later in the same or another computer environment\.

Design an algorithm to serialize and deserialize a binary tree\. There is no restriction on how your serialization/deserialization algorithm should work\. You just need to ensure that a binary tree can be serialized to a string and this string can be deserialized to the original tree structure\.

**Clarification:** The input/output format is the same as [how LeetCode serializes a binary tree](https://support.leetcode.com/hc/en-us/articles/32442719377939-How-to-create-test-cases-on-LeetCode#h_01J5EGREAW3NAEJ14XC07GRW1A)\. You do not necessarily need to follow this format, so please be creative and come up with different approaches yourself\.

##### **Example 1:**

**Input:** root = \[1,2,3,null,null,4,5\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">3</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">4</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">5</span></div>
  </div>
</div>

12345

**Output:** \[1,2,3,null,null,4,5\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">5</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">6</span><span class="arr-val">5</span></div>
  </div>
</div>

##### **Example 2:**

**Input:** root = \[\]

**Output:** \[\]

##### **Constraints:**

*   The number of nodes in the tree is in the range **\[0, 10****4****\]**\.
*   `-1000 <= Node.val <= 1000`


## Approaches

### 1\. BFS with Queue

#### Intuition:

This approach uses a queue to perform a level\-order traversal \(BFS\) to serialize and deserialize a binary tree\. The BFS approach processes nodes level by level, which suits the serialization of nodes where it can record the tree's structure, including null children, by utilizing a delimiter\.

#### Serialize:

1.  **Start**: Initialize a queue and add the root to it\.
2.  **Traverse**: While the queue is not empty:

*   Dequeue an element\. If it is not null, add its value to the result string and enqueue its children\. If it is null, add a special marker \(e\.g\., "null"\) to the result string\.

4.  **Output**: Join all results with a comma\.

#### Deserialize:

1.  **Start**: Split the serialized string on commas and initialize a queue\.
2.  **Initialize**: Create the root node and add it to the queue\.
3.  **Reconstruct**: For each node, check its children from the serialized data:

*   If it is "null", move to the next node\.
*   Otherwise, create a new node, link it as a child, and add it to the queue\.

#### Code:

```java
class Codec {
   // Encodes a tree to a single string.
   public String serialize(TreeNode root) {
       if (root == null) return "null";
       
       StringBuilder sb = new StringBuilder();
       Queue<TreeNode> queue = new LinkedList<>();
       queue.add(root);
       
       while (!queue.isEmpty()) {
           TreeNode node = queue.poll();
           if (node == null) {
               sb.append("null,");
           } else {
               sb.append(node.val).append(",");
               queue.add(node.left);
               queue.add(node.right);
           }
       }
       
       return sb.toString();
   }

   // Decodes your encoded data to tree.
   public TreeNode deserialize(String data) {
       if (data.equals("null")) return null;
       
       String[] nodes = data.split(",");
       Queue<TreeNode> queue = new LinkedList<>();
       TreeNode root = new TreeNode(Integer.parseInt(nodes[0]));
       queue.add(root);
       
       int i = 1;
       while (!queue.isEmpty()) {
           TreeNode node = queue.poll();
           if (!nodes[i].equals("null")) {
               node.left = new TreeNode(Integer.parseInt(nodes[i]));
               queue.add(node.left);
           }
           i++;
           if (!nodes[i].equals("null")) {
               node.right = new TreeNode(Integer.parseInt(nodes[i]));
               queue.add(node.right);
           }
           i++;
       }
       
       return root;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes in the tree, as each node is processed once during serialization and deserialization\.
*   **Space Complexity:** O\(N\), due to the storage of nodes in the queue and the string building process for serialization\.

### 2\. DFS with Preorder Traversal

#### Intuition:

In this approach, the idea is to use a depth\-first search \(DFS\) technique with a recursive method that uses preorder traversal\. This involves capturing each node followed by its left and right children\. By marking null references explicitly, reconstruction is facilitated\.

#### Serialize:

1.  Use a recursive function to append node values to a `StringBuilder` in preorder \(root → left → right\)\.
2.  Append a special marker \("null"\) for null nodes to denote absent children\.
3.  Join all elements to generate the final serialized string\.

#### Deserialize:

1.  Split the serialized data using a delimiter\.
2.  Use recursive functions to construct tree nodes in preorder, consuming values sequentially:

*   Return null when a "null" string is found\.
*   Create a tree node using the current value and recursively handle its left and right subtrees\.

#### Code:

```java
class Codec {
   // Encodes a tree to a single string.
   public String serialize(TreeNode root) {
       StringBuilder sb = new StringBuilder();
       serializeHelper(root, sb);
       return sb.toString();
   }

   private void serializeHelper(TreeNode root, StringBuilder sb) {
       if (root == null) {
           sb.append("null,");
           return;
       }
       sb.append(root.val).append(",");
       serializeHelper(root.left, sb);
       serializeHelper(root.right, sb);
   }
   
   // Decodes your encoded data to tree.
   public TreeNode deserialize(String data) {
       String[] nodes = data.split(",");
       int[] index = {0};  // Mutable integer to track position in nodes array
       return deserializeHelper(nodes, index);
   }
   
   private TreeNode deserializeHelper(String[] nodes, int[] index) {
       if (nodes[index[0]].equals("null")) {
           index[0]++;
           return null;
       }
       TreeNode node = new TreeNode(Integer.parseInt(nodes[index[0]++]));
       node.left = deserializeHelper(nodes, index);
       node.right = deserializeHelper(nodes, index);
       return node;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes in the tree\. Each node is visited once\.
*   **Space Complexity:** O\(N\), due to the recursion stack in the worst case \(when the tree is skewed\) and the storage for serialization strings\.

#### [Solve it on LeetCode](https://leetcode.com/problems/serialize-and-deserialize-binary-tree)
