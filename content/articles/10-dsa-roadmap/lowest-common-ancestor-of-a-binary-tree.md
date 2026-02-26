---
title: Lowest Common Ancestor of a Binary Tree
description: Master Lowest Common Ancestor of a Binary Tree in the Binary Tree
  module. Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

# Problem Description

Question

Given a binary tree, find the lowest common ancestor \(LCA\) of two given nodes in the tree\.

According to the [definition of LCA on Wikipedia](https://en.wikipedia.org/wiki/Lowest_common_ancestor): “The lowest common ancestor is defined between two nodes `p` and `q` as the lowest node in `T` that has both `p` and `q` as descendants \(where we allow **a node to be a descendant of itself**\)\.”

##### **Example 1:**

**Input:** root = \[3,5,1,6,2,0,8,null,null,7,4\], p = 5, q = 1

356274108

**Output:** 3

##### **Example 2:**

**Input:** root = \[3,5,1,6,2,0,8,null,null,7,4\], p = 5, q = 4

356274108

**Output:** 5

##### **Example 3:**

**Input:** root = \[1,2\], p = 1, q = 2

**Output:** 1

##### **Constraints:**

*   The number of nodes in the tree is in the range **\[2, 10****5****\]**\.
*   **\-10****9** **<= Node\.val <= 10****9**
*   All `Node.val` are **unique**\.
*   `p != q`
*   `p` and `q` will exist in the tree\.

#### [Solve it on LeetCode](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree)

# Approaches

## 1\. Recursive Traversal with Multiple Returns

#### Intuition:

This approach involves recursively traversing the binary tree from the root node and returning the lowest common ancestor\. The idea is to essentially perform a post\-order traversal of the tree while returning conditions that help conclude the LCA\.

1.  If the current node is one of the target nodes `p` or `q`, we return this node as a candidate for the LCA\.
2.  Recursively search both left and right subtrees for the target nodes `p` and `q`\.
3.  If both left and right subtree calls return a non\-null value, it means `p` and `q` are found in different subtrees of the current node, making the current node the LCA\.
4.  If only one of the subtree calls returns a non\-null value, this means both nodes are located in that subtree, and we return that value upward\.

#### Code:

Java

```java
class Solution {
   public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
       // Base case: if the current node is null, return null.
       if (root == null) {
           return null;
       }

       // If the current node matches either p or q, we return the current node.
       if (root == p || root == q) {
           return root;
       }

       // Recursively search in the left subtree.
       TreeNode left = lowestCommonAncestor(root.left, p, q);

       // Recursively search in the right subtree.
       TreeNode right = lowestCommonAncestor(root.right, p, q);

       // If both left and right are not null, current node is the LCA.
       if (left != null && right != null) {
           return root;
       }

       // Otherwise, return the non-null child.
       return left != null ? left : right;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes in the binary tree\. Each node is visited once\.
*   **Space Complexity:** O\(N\) \- In the worst case, the space due to recursion stack will be N for a skewed tree\.

## 2\. Iterative using Parent Pointers

#### Intuition:

In this approach, we utilize a parent pointer for all nodes starting from the root\. Once we have parent pointers, we can track the path from each node p and q to the root\. The first common node in these two paths is the LCA\.

1.  Use a hashmap to store the parent of each node\.
2.  Traverse the tree to populate the parent pointers\.
3.  Track back from node `p` to the root and save all visited ancestors in a set\.
4.  Track back from node `q` and find the first common ancestor in the set\.

#### Code:

Java

```java
class Solution {
   public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
       // Stack for DFS
       Stack<TreeNode> stack = new Stack<>();
       // Hash map to store the parent of each node
       HashMap<TreeNode, TreeNode> parentMap = new HashMap<>();

       // Initialize the stack with the root and no parent
       stack.push(root);
       parentMap.put(root, null);

       // Iterate until we find both the nodes p and q
       while (!parentMap.containsKey(p) || !parentMap.containsKey(q)) {
           TreeNode node = stack.pop();

           // Process the left child
           if (node.left != null) {
               parentMap.put(node.left, node);
               stack.push(node.left);
           }

           // Process the right child
           if (node.right != null) {
               parentMap.put(node.right, node);
               stack.push(node.right);
           }
       }

       // Ancestors set for node p
       HashSet<TreeNode> ancestors = new HashSet<>();

       // Traverse up from p, adding all ancestors to the set
       while (p != null) {
           ancestors.add(p);
           p = parentMap.get(p);
       }

       // Traverse up from q until finding a common ancestor
       while (!ancestors.contains(q)) {
           q = parentMap.get(q);
       }

       return q;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes in the binary tree\. We traverse each node once to populate the parent pointers\.
*   **Space Complexity:** O\(N\) \- The space required for the hashmap and visited set in the worst case\.

## 3\. Optimized Recursive Traversal

#### Intuition:

This approach is a refined version of the first recursive approach\. It involves a single recursive post\-order traversal to find the LCA more clearly and concisely\.

1.  If the current node is `null`, return `null`, indicating that neither `p` nor `q` is found below\.
2.  If the current node is equal to `p` or `q`, return the current node\.
3.  Otherwise, recursively call on the left and right subtrees\.
4.  If both left and right calls return non\-null, the current node is the LCA\.
5.  Otherwise, return the non\-null value from left or right\.

#### Code:

Java

```java
class Solution {
   public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
       // Base case:
       if (root == null || root == p || root == q) {
           return root;
       }

       // Perform recursive search in the left subtree
       TreeNode left = lowestCommonAncestor(root.left, p, q);

       // Perform recursive search in the right subtree
       TreeNode right = lowestCommonAncestor(root.right, p, q);

       // If both calls returned non-null, current node is LCA
       if (left != null && right != null) {
           return root;
       }

       // If one of them is non-null, return it as potential LCA
       return left != null ? left : right;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes in the binary tree\. Each node is visited once\.
*   **Space Complexity:** O\(N\) \- In the worst case, the space due to recursion stack will be N for a skewed tree\.

View Animation