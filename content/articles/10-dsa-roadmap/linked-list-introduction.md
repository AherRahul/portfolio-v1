---
title: LIS
description: Master LIS in the Dynamic Programming module. Comprehensive guide
  and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

**Linked List** is one of the most fundamental data structures in computer science and a must\-know topic for coding interviews\.

Unlike arrays, linked lists don’t require you to predefine a size\.

They allocate memory dynamically as elements are added\. And because each element points to the next, you can **insert or remove nodes** without shifting anything which makes them extremely flexible for certain use cases\.

In this chapter, I’ll break down:

*   What a linked list is and how it works internally
*   The different types of linked lists
*   Most common linked list operations and their time complexities
*   And the most common interview patterns built around linked lists

# What is a Linked List?

So… **what exactly is a linked list?**

A **linked list** is a linear data structure made up of **nodes**\.

Each node contains two parts:

null

1.  A **value \- the actual data you want to store**
2.  and A **pointer** or **reference** to the **next node** in the sequence

The last node points to null, indicating end of the list\.

Unlike arrays, where all elements are stored together in a single, continuous block of memory, the nodes in a linked list can be **scattered across memory**\.

**Arrays \(Contiguous Memory Allocation\)**

1000

1004

1008

1012

1016

**Linked List \(Dynamic Memory Allocation\)**

1000

2016

3236

1604

4412

null

What keeps them connected are those pointers linking one node to the next\.

This structure makes linked lists **highly flexible**\. You can grow or shrink them dynamically, and insertions or deletions don’t require shifting large chunks of memory like arrays do\.

But this flexibility comes with a trade\-off\.

*   Since the elements aren't stored together, you **can’t jump directly** to a specific item like you can with arrays\.

Instead, to access the 5th or 10th element, you may have to **traverse the list from the beginning**, one node at a time, which takes **linear time**\.

# Types of Linked Lists

Not all linked lists are the same\. Depending on how the nodes are connected, we can categorize them into three common types:

*   **Singly linked lists**
*   **Doubly linked lists**
*   **Circular linked lists\.**

Let’s break them down one by one\.

### **1\. Singly Linked List**

In a **singly linked list**, each node contains a value and a pointer to the **next node** and that’s it\.

```java
class ListNode {
   int val;
   ListNode next;

   ListNode(int val) {
       this.val = val;
       this.next = null;
   }
}
```

You can only move in **one direction**, from the head toward the tail\.

*   It’s simple to implement and memory\-efficient\.
*   But there’s a downside: if you need to go **backwards**, there's no easy way\. You’d have to **start from the head and traverse again** until you reach the previous node\.

Singly linked lists are great for problems where you only need forward traversal\.

### **2\. Doubly Linked List**

A **doubly linked list** takes things one step further\.

Each node has **two pointers**:

*   One pointing to the **next** node
*   One pointing to the **previous** node

```java
class DoublyListNode {
   int val;
   DoublyListNode next;
   DoublyListNode prev;

   DoublyListNode(int val) {
       this.val = val;
       this.next = null;
       this.prev = null;
   }
}
```

This means you can move **forward and backward**, which makes certain operations much more efficient\.

But the trade\-off is that it uses **extra memory** to store the additional pointer and it introduces a bit more complexity in updating links during insertions or deletions\.

Doubly linked lists are widely used in real\-world systems like: **LRU caches, text editors for undo/redo functionality, and browser history navigation\.**

### **3\. Circular Linked List**

and finally, circular linked list\.

A **circular linked list** is a variation where the **last node points back to the first node**, instead of `null`\.

This forms a **loop**\. You can start at any node and keep going until you're back where you started\.

```java
class CircularListNode {
   int val;
   CircularListNode next;

   CircularListNode(int val) {
       this.val = val;
       this.next = this; // initially points to itself
   }
}
```

It’s great for problems where you need cyclical behavior like round\-robin scheduling, or multiplayer games where turns cycle through players

# Operations on Linked Lists

Now that we know what linked lists are and the different types, let’s go over the most common operations you’ll perform on them\.

### **1\. Traversal**

Traversal means moving through the list, visiting each node one by one\. You **start at the head** and move one node at a time\.

```java
ListNode current = head;
while (current != null) {
   System.out.println(current.val);
   current = current.next;
}
```

This operation takes O\(n\) time because, in the worst case, you might visit every node\.

### 2\. Search

If you want to find whether a value exists in a linked list, you must:

*   Start at the head
*   Check each node one by one until you find the value or reach the end

```java
ListNode current = head;
while (current != null) {
   if (current.val == target) return true;
   current = current.next;
}
```

Since this is a linear search, it takes O\(n\) time in the worst case\.

### 3\. Insertion

Linked lists really shine when it comes to insertion because you don’t have to shift elements like you would in an array\.

There are different cases depending on where you are inserting a node:

**Insert at the Beginning**

This is the fastest case\.

All you need to do is:

*   Create a new node
*   Point its `next` to the current head
*   Update the head to the new node

```java
newNode.next = head;
head = newNode;
```

It takes **constant time** since no traversal is needed\.

**Insert at the End**

To insert at the end, you have to:

*   Start at the head
*   Traverse the list until you reach the last node
*   Update the last node’s `next` to the new node

If you maintain a tail pointer, you can insert in constant time **O\(1\)**\. Otherwise, you’ll need to traverse the entire list to find the last node, which takes **O\(n\) time**\.

**Insert at a Given Position**

To insert at a specific position \(say after the 5th node\), you must:

*   Traverse to that position
*   Adjust the pointers to insert the new node

Again, this requires **O\(n\)** time in the worst case\.

### **4\. Deletion**

Like insertion, deletion can also vary based on position\.

**Delete from the Beginning**

This is fast\. Just move the head pointer to the next node:

```java
head = head.next;
```

This is constant time since no traversal is needed\.

**Delete from the End or Middle**

To delete the last node or a node in the middle:

*   You have to **find the previous node**
*   Update its `next` pointer to skip the node you want to delete

Since there's **no backward pointer in a singly linked list**, this means **traversing** from the head — which takes **O\(n\)** time\.

Here’s a summary of the time complexities of various operations in a linked list:

##### Operation

##### Time Complexity

**Traverse**

`O(n)`

**Search**

`O(n)`

**Insert at start**

`O(1)`

**Insert at end**

`O(n)`

**Insert at index**

`O(n)`

**Delete from start**

`O(1)`

**Delete from end**

`O(n)`

# Common Interview Patterns

Now let’s talk about some of the most frequent linked list patterns that show up in coding interviews\.

### **1\. Fast and Slow Pointers**

Also known as **Floyd’s Tortoise and Hare** algorithm\. Here’s how it works:

You use **two pointers**:

*   The **slow pointer** moves one step at a time\.
*   The **fast pointer** moves two steps at a time\.

This simple trick allows you to solve problems like:

*   **Cycle detection** — if there’s a loop, the fast and slow pointers will eventually meet\.
*   **and Finding the middle** of a linked list

### **2\. Linked List In\-Place Reversal**

This is a **must\-know** technique in interviews\.

The challenge is to reverse the direction of pointers so the last node becomes the new head\.

We can do it in\-place by maintaining three pointers at previous, current and next node\.

And then walking through the list and flipping the pointers one by one\.

### 3\. Dummy Nodes

Another common trick is using dummy nodes\. This one’s a **clean code technique** that makes your implementation simpler and less error\-prone\.

A **dummy node** is just a placeholder node that you insert _before_ the real head of the list\.

It eliminates messy special cases like:

*   “What if we delete the head?”
*   “What if insertion happens at the very beginning?”
*   “Do we need separate logic when head changes?”

With a dummy node, you treat the head like any other node — so your logic stays uniform and your code gets much cleaner\.