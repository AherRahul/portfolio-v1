---
title: Delete Nodes And Return Forest
description: Master Delete Nodes And Return Forest in the Binary Tree module.
  Comprehensive guide and algorithmic problem solving.
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

Given the `root` of a binary tree, each node in the tree has a distinct value\.

After deleting all nodes with a value in `to_delete`, we are left with a forest \(a disjoint union of trees\)\.

Return the roots of the trees in the remaining forest\. You may return the result in any order\.

##### **Example 1:**

**Input:** root = \[1,2,3,4,5,6,7\], to\_delete = \[3,5\]

**Output:** \[\[1,2,null,4\],\[6\],\[7\]\]

##### **Example 2:**

**Input:** root = \[1,2,4,null,3\], to\_delete = \[3\]

**Output:** \[\[1,2,4\]\]

##### **Constraints:**

*   The number of nodes in the given tree is at most `1000`\.
*   Each node has a distinct value between `1` and `1000`\.
*   `to_delete.length <= 1000`
*   `to_delete` contains distinct values between `1` and `1000`\.

#### [Solve it on LeetCode](https://leetcode.com/problems/delete-nodes-and-return-forest)

# Approaches

## 1\. Recursive DFS Approach

#### Intuition:

The problem requires us to return a forest of trees by deleting certain nodes from a binary tree\. We can tackle this problem using a recursive approach\. The primary idea is to traverse the tree using DFS \(Depth First Search\) and make decisions at each node whether it is to be deleted or retained\.

1.  For each node, recursively decide for its left and right children whether they need to be deleted\.
2.  If a node is to be deleted, its children are added to the result list of roots if they are non\-null\.
3.  If a node is not deleted, and it is a root \(i\.e\., the start of recursion\), add it to the result list of roots\.

#### Steps:

*   Start from the root of the tree\.
*   Use recursion to traverse the tree\.
*   At each recursive call, check if the current node is in the delete list\.
*   If it is, add its children to the forest if they exist\.
*   If not, keep traversing, possibly marking this node to remain as part of an existing tree\.

#### Code:

Java

```java
class Solution {
   public List<TreeNode> delNodes(TreeNode root, int[] to_delete) {
       List<TreeNode> forest = new ArrayList<>();
       Set<Integer> toDeleteSet = new HashSet<>();
       for (int value : to_delete) {
           toDeleteSet.add(value);
       }
       deleteNodes(root, toDeleteSet, forest, true);
       return forest;
   }

   private TreeNode deleteNodes(TreeNode node, Set<Integer> toDeleteSet, List<TreeNode> forest, boolean isRoot) {
       if (node == null) {
           return null;
       }
       
       boolean toDelete = toDeleteSet.contains(node.val);
       
       if (isRoot && !toDelete) {
           // If it's a root node and not deleted, add to forest.
           forest.add(node);
       }
       
       // Recursively check and delete nodes for its children
       node.left = deleteNodes(node.left, toDeleteSet, forest, toDelete);
       node.right = deleteNodes(node.right, toDeleteSet, forest, toDelete);
       
       // Return null if current node is to be deleted, else return the node itself
       return toDelete ? null : node;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), where \(n\) is the number of nodes in the tree\. Each node is processed once\.
*   **Space Complexity:** O\(h \+ d\), where \(h\) is the height of the tree and \(d\) is the number of nodes to delete \(to store in HashSet\)\.

## 2\. Optimized Recursive DFS with Set

#### Intuition:

This approach enhances the first solution by using a HashSet to store nodes that need to be deleted, making the check for deletions \(O\(1\)\) on average\. This makes it slightly more optimal for larger sets of nodes to be deleted\.

Same steps as above, but the check for deletion is turned into an \(O\(1\)\) operation by using a Set data structure\.

#### Code:

Java

```java
class Solution {
   public List<TreeNode> delNodes(TreeNode root, int[] to_delete) {
       List<TreeNode> forest = new ArrayList<>();
       Set<Integer> deleteSet = new HashSet<>();
       
       // Populate the HashSet with nodes to delete for an O(1) lookup.
       for (int val : to_delete) {
           deleteSet.add(val);
       }
       
       // Helper function to perform DFS and manage the forest list.
       helper(root, true, deleteSet, forest);
       
       return forest;
   }
   
   private TreeNode helper(TreeNode node, boolean isRoot, Set<Integer> deleteSet, List<TreeNode> forest) {
       if (node == null) {
           return null;
       }
       
       // Determine if the current node needs to be deleted.
       boolean deleted = deleteSet.contains(node.val);
       
       if (isRoot && !deleted) {
           forest.add(node);
       }
       
       // Recursively process child nodes, determining new roots based on 'deleted' status.
       node.left = helper(node.left, deleted, deleteSet, forest);
       node.right = helper(node.right, deleted, deleteSet, forest);

       // Return null if node is deleted, otherwise return the current node.
       return deleted ? null : node;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), as each node is visited only once\.
*   **Space Complexity:** O\(h \+ d\)\.

*   The O\(h\) is for the recursion stack \(maximum is the height of the binary tree\)\.
*   The O\(d\) is for the set containing nodes to be deleted \(if using mutable data structures for large delete lists\)\.