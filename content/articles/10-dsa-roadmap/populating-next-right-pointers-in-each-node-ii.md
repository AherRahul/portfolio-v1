---
title: Populating Next Right Pointers in Each Node II
description: Master Populating Next Right Pointers in Each Node II in the Binary
  Tree module. Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given a binary tree

```cpp
struct Node {
  int val;
  Node *left;
  Node *right;
  Node *next;
}
```

Populate each next pointer to point to its next right node\. If there is no next right node, the next pointer should be set to `NULL`\.

Initially, all next pointers are set to `NULL`\.

##### **Example 1:**

**Input:** root = \[1,2,3,4,5,null,7\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">5</span><span class="arr-val">null</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">7</span></div>
  </div>
</div>

**Output:** \[1,\#,2,3,\#,4,5,7,\#\]

**Explanation:** Given the above binary tree \(Figure A\), your function should populate each next pointer to point to its next right node, just like in Figure B\. The serialized output is in level order as connected by the next pointers, with '\#' signifying the end of each level\.

##### **Example 2:**

**Input:** root = \[\]

**Output:** \[\]

##### **Constraints:**

*   The number of nodes in the tree is in the range `[0, 6000]`\.
*   `-100 <= Node.val <= 100`

##### **Follow\-up:**

*   You may only use constant extra space\.
*   The recursive approach is fine\. You may assume implicit stack space does not count as extra space for this problem\.


## Approaches

### 1\. Level Order Traversal using Queue

#### Intuition:

The basic idea is to use a queue to perform a level order traversal of the tree\. For each node at a particular level, connect it to its next right node using the queue\. This method ensures that we connect all nodes at the same level before moving to the next level\.

1.  Start by enqueuing the root node\.
2.  Iterate while the queue is not empty\. For every iteration, it represents a new level\.
3.  For each node at the current level, link node's `next` to the next node in the queue\.
4.  Enqueue the left and right children of the node if they exist\.
5.  Repeat the above steps until all levels are processed\.

#### Code:

```java
class Solution {
   public Node connect(Node root) {
       if (root == null) return null;
       
       Queue<Node> queue = new LinkedList<>();
       queue.add(root);

       while (!queue.isEmpty()) {
           int size = queue.size();
           Node prev = null;

           for (int i = 0; i < size; i++) {
               Node currentNode = queue.poll();

               if (prev != null) {
                   prev.next = currentNode;
               }
               
               prev = currentNode;

               if (currentNode.left != null) {
                   queue.add(currentNode.left);
               }

               if (currentNode.right != null) {
                   queue.add(currentNode.right);
               }
           }
       }
       return root;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the total number of nodes\. Each node is processed once\.
*   **Space Complexity:** O\(N\), the space used by the queue in the worst case\.

### 2\. Using Previously Established Next Pointers

#### Intuition:

To optimize space, we can avoid using a queue and instead leverage the `next` pointers established during the traversal\. Instead of processing nodes level by level, the idea is to build the next pointers for the next level while traversing the current level\.

1.  Use a current pointer to traverse nodes at the current level\.
2.  Use a dummy node to represent the start of the next level\.
3.  Track the last visited node in the next level using a tail pointer starting from the dummy node\.
4.  Move to the next level by setting the current pointer to `dummy.next` once the current level is completely processed\.

#### Code:

```java
class Solution {
   public Node connect(Node root) {
       Node dummyHead = new Node(0);
       Node current = root;

       while (current != null) {
           Node tail = dummyHead;  // Tail for the next level, starting from the dummy head.
           
           // Iterate over nodes in the current level
           while (current != null) {
               if (current.left != null) {
                   tail.next = current.left;
                   tail = tail.next;
               }
               
               if (current.right != null) {
                   tail.next = current.right;
                   tail = tail.next;
               }
               
               current = current.next;
           }

           // Move to the start of the next level
           current = dummyHead.next;
           dummyHead.next = null;  // Reset dummy head's next for the next iteration/level.
       }

       return root;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the total number of nodes\. Each node is processed once\.
*   **Space Complexity:** O\(1\), as we're only using a few additional pointers, not a queue\.

#### [Solve it on LeetCode](https://leetcode.com/problems/populating-next-right-pointers-in-each-node-ii)
