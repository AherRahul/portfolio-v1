---
title: Design Linked List
description: Master Design Linked List in the Linked List module. Comprehensive
  guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Design your implementation of the linked list\. You can choose to use a singly or doubly linked list\.A node in a singly linked list should have two attributes: `val` and `next`\. `val` is the value of the current node, and `next` is a pointer/reference to the next node\.If you want to use the doubly linked list, you will need one more attribute `prev` to indicate the previous node in the linked list\. Assume all nodes in the linked list are **0\-indexed**\.

Implement the `MyLinkedList` class:

*   `MyLinkedList()` Initializes the `MyLinkedList` object\.
*   `int get(int index)` Get the value of the `index``th` node in the linked list\. If the index is invalid, return `-1`\.
*   `void addAtHead(int val)` Add a node of value `val` before the first element of the linked list\. After the insertion, the new node will be the first node of the linked list\.
*   `void addAtTail(int val)` Append a node of value `val` as the last element of the linked list\.
*   `void addAtIndex(int index, int val)` Add a node of value `val` before the `index``th` node in the linked list\. If `index` equals the length of the linked list, the node will be appended to the end of the linked list\. If `index` is greater than the length, the node **will not be inserted**\.
*   `void deleteAtIndex(int index)` Delete the `index``th` node in the linked list, if the index is valid\. 

##### **Example 1:**

**Input**

\["MyLinkedList", "addAtHead", "addAtTail", "addAtIndex", "get", "deleteAtIndex", "get"\]

\[\[\], \[1\], \[3\], \[1, 2\], \[1\], \[1\], \[1\]\]

**Output**

\[null, null, null, null, 2, null, 3\]

**Explanation**

```java
MyLinkedList myLinkedList = new MyLinkedList();
myLinkedList.addAtHead(1);
myLinkedList.addAtTail(3);
myLinkedList.addAtIndex(1, 2);    // linked list becomes 1->2->3
myLinkedList.get(1);              // return 2
myLinkedList.deleteAtIndex(1);    // now the linked list is 1->3
myLinkedList.get(1);              // return 3
```

##### **Constraints:**

*   `0 <= index, val <= 1000`
*   Please do not use the built\-in LinkedList library\.
*   At most `2000` calls will be made to `get`, `addAtHead`, `addAtTail`, `addAtIndex` and `deleteAtIndex`\.


## Approaches

### 1\. Singly Linked List

#### Intuition:

A singly linked list is a data structure that consists of a sequence of elements, where each element points to the next one\. The basic operations include adding an element, removing an element, and retrieving an element at a specific index\. The singly linked list is efficient for insertion and deletion operations as it doesn't require shifting elements like an array does\. The challenge is to efficiently handle edge cases such as indexing beyond the bounds of the list\.

#### Approach:

For a singly linked list:

*   Maintain a `ListNode` class with properties for the value and a pointer to the next node\.
*   Keep track of the head of the list and the size to manage insertion and deletion at specific points\.
*   The add operation involves traversing to the desired index and adjusting the pointers\.
*   The delete operation involves traversing and re\-linking the list to skip the deleted node\.

#### Code:

```java
class MyLinkedList {
   private class ListNode {
       int val;
       ListNode next;
       
       ListNode(int val) {
           this.val = val;
       }
   }
   
   private ListNode head;
   private int size;

   public MyLinkedList() {
       this.head = null;
       this.size = 0;
   }
   
   public int get(int index) {
       if (index < 0 || index >= size) {
           return -1;
       }
       ListNode current = head;
       for (int i = 0; i < index; i++) {
           current = current.next;
       }
       return current.val;
   }
   
   public void addAtHead(int val) {
       ListNode newNode = new ListNode(val);
       newNode.next = head;
       head = newNode;
       size++;
   }
   
   public void addAtTail(int val) {
       ListNode newNode = new ListNode(val);
       if (head == null) {
           head = newNode;
       } else {
           ListNode current = head;
           while (current.next != null) {
               current = current.next;
           }
           current.next = newNode;
       }
       size++;
   }
   
   public void addAtIndex(int index, int val) {
       if (index > size) {
           return;
       }
       if (index <= 0) {
           addAtHead(val);
       } else {
           ListNode newNode = new ListNode(val);
           ListNode current = head;
           for (int i = 0; i < index - 1; i++) {
               current = current.next;
           }
           newNode.next = current.next;
           current.next = newNode;
           size++;
       }
   }
   
   public void deleteAtIndex(int index) {
       if (index < 0 || index >= size) {
           return;
       }
       if (index == 0) {
           head = head.next;
       } else {
           ListNode current = head;
           for (int i = 0; i < index - 1; i++) {
               current = current.next;
           }
           current.next = current.next.next;
       }
       size--;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** `O(n)` for get, add, and delete operations as each requires traversal\.
*   **Space Complexity:** `O(1)` for each operation as we maintain a fixed number of references regardless of input size\.

### 2\. Doubly Linked List

#### Intuition:

The doubly linked list extends the singly linked list by adding a previous pointer to each node\. This allows for efficient bidirectional traversal\. It helps improve the deletion operation by providing direct access to the previous node, thereby avoiding full traversal for backtracking operations\.

#### Approach:

For a doubly linked list:

*   Extend the node definition to include pointers to both previous and next nodes\.
*   Maintain both head and tail pointers to easily add elements to both ends\.
*   Update operations \(add, delete\) ensure that previous pointers are maintained along with next pointers\.

#### Code:

```java
class MyDoublyLinkedList {
   private class ListNode {
       int val;
       ListNode prev, next;
       
       ListNode(int val) {
           this.val = val;
       }
   }
   
   private ListNode head, tail;
   private int size;

   public MyDoublyLinkedList() {
       this.head = null;
       this.tail = null;
       this.size = 0;
   }
   
   public int get(int index) {
       if (index < 0 || index >= size) {
           return -1;
       }
       ListNode current;
       if (index < size / 2) {
           current = head;
           for (int i = 0; i < index; i++) {
               current = current.next;
           }
       } else {
           current = tail;
           for (int i = size - 1; i > index; i--) {
               current = current.prev;
           }
       }
       return current.val;
   }
   
   public void addAtHead(int val) {
       ListNode newNode = new ListNode(val);
       newNode.next = head;
       if (head != null) {
           head.prev = newNode;
       } else {
           tail = newNode;
       }
       head = newNode;
       size++;
   }
   
   public void addAtTail(int val) {
       ListNode newNode = new ListNode(val);
       newNode.prev = tail;
       if (tail != null) {
           tail.next = newNode;
       } else {
           head = newNode;
       }
       tail = newNode;
       size++;
   }
   
   public void addAtIndex(int index, int val) {
       if (index > size) return;
       if (index <= 0) {
           addAtHead(val);
       } else if (index == size) {
           addAtTail(val);
       } else {
           ListNode newNode = new ListNode(val);
           ListNode current;
           if (index < size / 2) {
               current = head;
               for (int i = 0; i < index - 1; i++) {
                   current = current.next;
               }
           } else {
               current = tail;
               for (int i = size; i > index; i--) {
                   current = current.prev;
               }
           }
           newNode.next = current.next;
           current.next.prev = newNode;
           current.next = newNode;
           newNode.prev = current;
           size++;
       }
   }
   
   public void deleteAtIndex(int index) {
       if (index < 0 || index >= size) return;
       if (index == 0) {
           if (head.next != null) {
               head = head.next;
               head.prev = null;
           } else {
               head = tail = null;
           }
       } else if (index == size - 1) {
           if (tail.prev != null) {
               tail = tail.prev;
               tail.next = null;
           } else {
               head = tail = null;
           }
       } else {
           ListNode current;
           if (index < size / 2) {
               current = head;
               for (int i = 0; i < index; i++) {
                   current = current.next;
               }
           } else {
               current = tail;
               for (int i = size - 1; i > index; i--) {
                   current = current.prev;
               }
           }
           current.prev.next = current.next;
           current.next.prev = current.prev;
       }
       size--;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** `O(n)` for get, add, and delete operations\. The selection between forward or backward traversal provides a slight optimization\.
*   **Space Complexity:** `O(1)` for each operation; each node holds additional reference, but overall the space is linear with the number of elements\.

#### [Solve it on LeetCode](https://leetcode.com/problems/design-linked-list)
