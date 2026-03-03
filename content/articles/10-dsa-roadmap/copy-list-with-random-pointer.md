---
title: Copy List with Random Pointer
description: Master Copy List with Random Pointer in the Linked List module.
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

A linked list of length `n` is given such that each node contains an additional random pointer, which could point to any node in the list, or `null`\.

Construct a [**deep copy**](https://en.wikipedia.org/wiki/Object_copying#Deep_copy) of the list\. The deep copy should consist of exactly `n` **brand new** nodes, where each new node has its value set to the value of its corresponding original node\. Both the `next` and `random` pointer of the new nodes should point to new nodes in the copied list such that the pointers in the original list and copied list represent the same list state\. **None of the pointers in the new list should point to nodes in the original list**\.

For example, if there are two nodes `X` and `Y` in the original list, where `X.random --> Y`, then for the corresponding two nodes `x` and `y` in the copied list, `x.random --> y`\.

Return _the head of the copied linked list_\.

The linked list is represented in the input/output as a list of `n` nodes\. Each node is represented as a pair of `[val, random_index]` where:

*   `val`: an integer representing `Node.val`
*   `random_index`: the index of the node \(range from `0` to `n-1`\) that the `random` pointer points to, or `null` if it does not point to any node\.

Your code will **only** be given the `head` of the original linked list\. 

##### **Example 1:**

**Input:** head = \[\[7,null\],\[13,0\],\[11,4\],\[10,2\],\[1,0\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">7</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">null</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">13</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">11</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">10</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
  </div>
</div>

**Output:** \[\[7,null\],\[13,0\],\[11,4\],\[10,2\],\[1,0\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">7</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">null</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">13</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">11</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">4</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">10</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">2</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
    </div>
  </div>
</div>

##### **Example 2:**

**Input:** head = \[\[1,1\],\[2,1\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
  </div>
</div>

**Output:** \[\[1,1\],\[2,1\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">1</span></div>
    </div>
  </div>
</div>

##### **Example 3:**

**Input:** head = \[\[3,null\],\[3,0\],\[3,null\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">null</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--zero"><span class="arr-val">null</span></div>
    </div>
  </div>
</div>

**Output:** \[\[3,null\],\[3,0\],\[3,null\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">null</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">0</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">3</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">null</span></div>
    </div>
  </div>
</div>

##### **Constraints:**

*   **0 <= n <= 1000**
*   **\-10****4** **<= Node\.val <= 10****4**
*   `Node.random` is `null` or is pointing to some node in the linked list\.


## Approaches

### 1\. HashMap

#### **Intuition:**

The main idea is to traverse the original linked list and copy each node\. During this traversal, a `HashMap` is used to keep track of the original nodes and their corresponding copied nodes\. By using this map, we can access the copied node of a particular original node efficiently\.

The algorithm can be summarized in two main passes over the linked list:

1.  **Copy Nodes and Fill HashMap:**

*   Create a new list node for each node in the original list,
*   Save the mapping between the original node and copied node in a `HashMap`\.

3.  **Assign Next and Random Pointers:**

*   Iterate over the original list again\. For each node, set the `next` and `random` pointers for the copied nodes using the HashMap\.

#### Code:

```java
class Solution {
   public Node copyRandomList(Node head) {
       // If the original list is empty, return null
       if (head == null) return null;
       
       // Mapping from original nodes to their corresponding copied nodes
       Map<Node, Node> nodeMap = new HashMap<>();

       // Step 1: Copy all the nodes and store the mapping in hashmap
       Node current = head;
       while (current != null) {
           nodeMap.put(current, new Node(current.val));
           current = current.next;
       }

       // Step 2: Assign the next and random pointers for the copied nodes
       current = head;
       while (current != null) {
           nodeMap.get(current).next = nodeMap.get(current.next);
           nodeMap.get(current).random = nodeMap.get(current.random);
           current = current.next;
       }
       
       // Return the deep copied head node
       return nodeMap.get(head);
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes in the linked list\. We iterate over the list twice\.
*   **Space Complexity:** O\(N\), as we store N node mappings in the HashMap\.

### 2\. Interleaved List

#### **Intuition:**

We can optimize the space used for storing node mappings by integrating the copied nodes directly into the original list\. The procedure is as follows:

1.  **First pass:** For each node in the original list, create a new node and interleaved it between the current node and the next node\.
2.  **Second pass:** Assign `random` pointers for the newly created nodes by utilizing the existing `random` pointers\.
3.  **Third pass:** Separate the original and copied list\.

This approach removes the need for a HashMap to store node mappings, thereby reducing the space complexity\.

#### Code:

```java
class Solution {
   public Node copyRandomList(Node head) {
       if (head == null) return null;
       
       // Step 1: Create new nodes and interleave them with the original nodes
       Node current = head;
       while (current != null) {
           Node newNode = new Node(current.val);
           newNode.next = current.next;
           current.next = newNode;
           current = newNode.next;
       }
       
       // Step 2: Assign random pointers for the copied nodes
       current = head;
       while (current != null) {
           if (current.random != null) {
               current.next.random = current.random.next;
           }
           current = current.next.next;
       }
       
       // Step 3: Separate the copied list from the original list
       current = head;
       Node copiedHead = head.next;
       while (current != null) {
           Node copiedNode = current.next;
           current.next = copiedNode.next;
           current = current.next;
           if (current != null) {
               copiedNode.next = current.next;
           }
       }
       
       return copiedHead;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of nodes in the linked list\. We iterate over the list twice\.
*   **Space Complexity:** O\(1\), as we don't use any extra space apart from temporary nodes\.

#### [Solve it on LeetCode](https://leetcode.com/problems/copy-list-with-random-pointer)
