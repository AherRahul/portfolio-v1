---
title: Introduction
description: Master Introduction in the Binary Tree module. Comprehensive guide
  and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

Binary Trees are one of the most important data structures in computer science\.

At the most basic level, a binary tree is a special type of tree made up of **nodes**, where each node can have at most **two children** — a left child and a right child\.

124536

From this simple structure, we can represent a wide variety of real\-world systems like file hierarchies, expression parsing in compilers, search trees for fast lookups, and much more\.

In this chapter, we’ll cover:

*   What a binary tree is and how it works
*   Different types of binary trees
*   how to represent it in code
*   and the most common tree traversal algorithms

# **What is a Binary Tree?**

A **binary tree** is a hierarchical data structure that looks a lot like an upside\-down family tree\.

*   It’s made of nodes and each node can have at most **two children** — a **left child** and a **right child**\.
*   The very top node is called the **root**\.
*   And nodes with no children are called **leaves**\.

This simple structure is surprisingly powerful because it lets us represent **hierarchical relationships** in a natural way — something arrays and linked lists can’t do efficiently\.

Imagine we have a binary tree representing a company’s org chart:

*   The **CEO** is the root\.
*   Their **direct reports** are the children\.
*   And employees with no one reporting to them are leaves\.

When working with binary trees, there are a few terms that you must be familiar with\.

*   **Parent** → A node that has at least one child\.
*   **Child** → A node that descends from a parent\.
*   **Edge:** This is simply the _link_ that connects a parent to a child\. In trees, edges are usually directed — meaning they always point from parent to child\.
*   **Path:** A continuous sequence of nodes connected by edges\. For example, root → left → left is a path\.
*   **Subtree** → If you take _any_ node in the tree, that node and _all_ of its descendants form a smaller tree, which we call a subtree\.
*   **Depth** → This is the 'level' of a node\. It's the number of edges on the path from the root _down to_ that specific node\. The root itself has a depth of 0\.
*   **Height** → This is the total 'height' of the entire tree\. It's the length of the _longest path_ from the root to _any leaf_ in the tree\.

# Types of Binary Trees

Not all binary trees are created equal\. Their structure and rules can change, which makes them useful for different tasks\. Let's cover the most important types you'll see in interviews\.

### **1\. Full Binary Tree**

12453

*   In a **full binary tree**, every node must have either **zero** or **exactly two children**\.
*   No node is allowed to have just one child\.
*   This structure is common in things like decision trees where every question has exactly two answers, like 'yes' or 'no'\.”

### **2\. Complete Binary Tree**

124536

*   In a **complete binary tree**, all levels are completely filled, except possibly the last level\.
*   And the last level is filled **from left to right** without gaps\.
*   This property makes complete binary trees the backbone of **heap data structure**, which are used in priority queues and heap sort\.

### **3\. Perfect Binary Tree**

1245367

*   A **perfect binary tree** is even stricter:

*   All internal nodes have **exactly two children**\.
*   And all the leaves are at the **same level**\.

*   The result is a perfectly symmetrical tree\.

### **4\. Binary Search Tree \(BST\)**

4213657

*   This is the most famous type of binary tree\. A BST isn't just about structure; it's about a _rule for storing data_\.
*   For _every single node_ in the tree:

*   Its **left child's value** must be _less than_ its own value\.
*   and Its **right child's value** must be _greater than_ its own value\.

*   This single rule is what makes BSTs so powerful\. It allows you to search, insert, and delete data in O\(log n\) time on average given the tree is balanced\.
*   A **balanced** tree keeps the height as small as possible\. Famous examples are **AVL trees** and **Red\-Black trees**\. They use clever automatic 'rotations' during insertions and deletions to rebalance themselves\. This _guarantees_ that search, insert, and delete operations remain a fast O\(log n\)\.

# Binary Tree Representation

Now that we know what binary trees are and the different types, let’s talk about how we actually represent them in code\.

There are two common approaches: **array representation** and **linked representation**\.

## **1\. Array Representation**

This is a non\-intuitive but clever way\. You can store a tree, level by level, in a simple array\.

*   The root node is stored at index 0\.
*   For any node at index `i`:

*   The **left child** is at `2 * i + 1`
*   The **right child** is at `2 * i + 2`
*   And the **parent** is at `(i - 1) / 2`

```java
int[] tree = new int[7]; 
// let's store values for a simple tree
tree[0] = 1; // root
tree[1] = 2; // left child of root
tree[2] = 3; // right child of root
tree[3] = 4; // left child of node 2
tree[4] = 5; // right child of node 2
```

Array representation is space\-efficient when the tree is complete \(like heaps\) or nearly complete, because there's no wasted memory for pointers\. But if the tree is sparse, it can waste memory because unused indices remain empty\.

## **2\. Linked Representation**

This is the most flexible and common way\.

Instead of an array, each node is an object that contains:

*   The value of the node
*   A reference to the left child
*   and A reference to the right child

Java

```java
class TreeNode {
   int val;
   TreeNode left;
   TreeNode right;

   TreeNode(int val) {
       this.val = val;
       left = null;
       right = null;
   }
}
```

The entire tree is just a single variable, `root`, that points to the very first `TreeNode`

This representation is the most flexible way to represent trees\. It works well both for sparse and dense trees because we only allocate memory for the nodes that actually exist\.

# **Tree Traversals**

Traversal means visiting each node in the tree in a specific order\. This is the foundation for solving almost every tree\-related problem\.

There are four main types of binary tree traversals\. The first three are variant of 'Depth\-First Search' \(DFS\)\.

4213657

*   **Inorder \(Left → Root → Right\)**

*   `[1, 2, 3, 4, 5, 6, 7]`
*   You visit the _entire_ left subtree, _then_ visit the Root node, _then_ visit the _entire_ right subtree\.
*   This is famous because in a **Binary Search Tree**, an in\-order traversal visits the nodes in **perfectly sorted order**\.

*   **Preorder \(Root → Left → Right\)**

*   `[4, 2, 1, 3, 6, 5, 7]`
*   You visit the **Root node first**, _then_ the left subtree, _then_ the right subtree\.
*   This is often used to _copy_ or _recreate_ a tree\. If you save the nodes in pre\-order, you can rebuild the exact same tree structure\.

*   **Postorder \(Left → Right → Root\)**

*   `[1, 3, 2, 5, 7, 6, 4]`
*   You visit the left subtree, _then_ the right subtree, and visit the **Root node last**\.
*   This is essential for tasks like _deleting_ a tree\. You must delete the children before you can delete their parent\.
*   For the above example:

*   **Level Order \(Breadth\-First Search\)**

*   `[[4], [2, 6], [1, 3, 5, 7]]`
*   This one is different\. It's not recursive\. It visits the tree **level by level**, from top to bottom, left to right\.
*   It's implemented using a **Queue** and is perfect for finding the _shortest path_ from the root to any other node\.
*   For the above example:

And no matter which traversal you choose, you have to visit _every single node_ exactly once\. That means the time complexity for all four traversals is **O\(n\)**