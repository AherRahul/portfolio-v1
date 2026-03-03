---
title: Binary Search Tree Iterator
description: Master Binary Search Tree Iterator in the Binary Tree module.
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

Implement the `BSTIterator` class that represents an iterator over the [**in\-order traversal**](https://en.wikipedia.org/wiki/Tree_traversal#In-order_\(LNR\)) of a binary search tree \(BST\):

*   `BSTIterator(TreeNode root)` Initializes an object of the `BSTIterator` class\. The `root` of the BST is given as part of the constructor\. The pointer should be initialized to a non\-existent number smaller than any element in the BST\.
*   `boolean hasNext()` Returns `true` if there exists a number in the traversal to the right of the pointer, otherwise returns `false`\.
*   `int next()` Moves the pointer to the right, then returns the number at the pointer\.

Notice that by initializing the pointer to a non\-existent smallest number, the first call to `next()` will return the smallest element in the BST\.

You may assume that `next()` calls will always be valid\. That is, there will be at least a next number in the in\-order traversal when `next()` is called\.

##### **Example 1:**

**Input**

\["BSTIterator", "next", "next", "hasNext", "next", "hasNext", "next", "hasNext", "next", "hasNext"\]

\[\[\[7, 3, 15, null, null, 9, 20\]\], \[\], \[\], \[\], \[\], \[\], \[\], \[\], \[\], \[\]\]

**Output**

\[null, 3, 7, true, 9, true, 15, true, 20, false\]

**Explanation**

```java
BSTIterator bSTIterator = new BSTIterator([7, 3, 15, null, null, 9, 20]);
bSTIterator.next();    // return 3
bSTIterator.next();    // return 7
bSTIterator.hasNext(); // return True
bSTIterator.next();    // return 9
bSTIterator.hasNext(); // return True
bSTIterator.next();    // return 15
bSTIterator.hasNext(); // return True
bSTIterator.next();    // return 20
bSTIterator.hasNext(); // return False
```

##### **Constraints:**

*   The number of nodes in the tree is in the range **\[1, 10****5****\]\.**
*   **0 <= Node\.val <= 10****6**
*   At most **10****5** calls will be made to `hasNext`, and `next`\. 

**Follow up:**

*   Could you implement `next()` and `hasNext()` to run in average `O(1)` time and use `O(h)` memory, where `h` is the height of the tree?


## Approaches

### 1\. Basic Approach: In\-Order Traversal with List

#### **Intuition:**

The basic intuition is to leverage the property of a BST where an in\-order traversal gives nodes in a non\-decreasing order\. We can perform an in\-order traversal of the tree, store all nodes in a list, and then use this list to ensure constant time access to the next smallest node\.

#### **Approach:**

1.  Perform an in\-order traversal of the BST\.
2.  Store the elements in a list as they are visited\.
3.  Use an index to track the current element in the list\.
4.  `next()` simply retrieves the element at the current index and then increments it\.
5.  `hasNext()` checks if the current index is less than the list size\.

#### Code:

```java
class BSTIterator {
   private List<Integer> nodesSorted;
   private int index;

   public BSTIterator(TreeNode root) {
       // List to store the sorted nodes
       nodesSorted = new ArrayList<Integer>();
       index = -1;
       // Perform the inorder traversal and fill the list
       inOrderTraversal(root);
   }

   private void inOrderTraversal(TreeNode root) {
       if (root == null) {
           return;
       }
       // Traverse the left subtree
       inOrderTraversal(root.left);
       // Add the root node value
       nodesSorted.add(root.val);
       // Traverse the right subtree
       inOrderTraversal(root.right);
   }
   
   // Returns the next smallest number
   public int next() {
       return nodesSorted.get(++index);
   }
   
   // Returns whether we have a next smallest number
   public boolean hasNext() {
       return index + 1 < nodesSorted.size();
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** 

*   `Constructor`: O\(N\), where N is the number of nodes in the tree, due to the in\-order traversal\.
*   `next()`: O\(1\)\.
*   `hasNext()`: O\(1\)\.

*   **Space Complexity:** O\(N\), required for storing the in\-order traversal\.

### 2\. Optimal Approach: Controlled Recursion

#### **Intuition:**

The goal is to simulate the in\-order traversal using controlled stack\-based recursion\. The benefit is an iterative approach with a controlled stack of nodes which represents the path from the root to the next smallest node\. Thus, it uses less memory than storing all nodes\.

#### **Approach:**

1.  Use the stack to keep track of the nodes that need to be visited\.
2.  Initialize by traversing from the root to the leftmost node, pushing all the nodes on the path to the stack\.
3.  `hasNext()` is simple: check if there are any nodes left in the stack\.
4.  For `next()`, pop the top node from the stack \(the current smallest\)\.
5.  If this node has a right child, push all its left descendants onto the stack\.

#### Code:

```java
class BSTIterator {
   private Stack<TreeNode> stack;

   public BSTIterator(TreeNode root) {
       // Initialize the stack and start from the root
       stack = new Stack<TreeNode>();
       // Push the leftmost path to the stack
       pushLeft(root);
   }
   
   private void pushLeft(TreeNode node) {
       // Push all nodes from the current path to the stack
       while (node != null) {
           stack.push(node);
           node = node.left;
       }
   }
   
   // Returns the next smallest number
   public int next() {
       // Next node is the top of the stack
       TreeNode nextNode = stack.pop();
       // If it has a right subtree, push all left nodes from the right subtree
       if (nextNode.right != null) {
           pushLeft(nextNode.right);
       }
       return nextNode.val;
   }
   
   // Returns whether we have a next smallest number
   public boolean hasNext() {
       // Check if the stack is not empty
       return !stack.isEmpty();
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** 

*   `Constructor`: O\(H\), where H is the height of the tree, due to pushing nodes from the root to the leftmost leaf\.
*   `next()`: Amortized O\(1\), each node pushed or popped exactly once\.
*   `hasNext()`: O\(1\)\.

*   **Space Complexity:** O\(H\), where H is the height of the tree, for the stack\. This is optimal for very skewed trees\.

#### [Solve it on LeetCode](https://leetcode.com/problems/binary-search-tree-iterator)
