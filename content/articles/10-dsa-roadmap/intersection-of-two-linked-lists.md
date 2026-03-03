---
title: Intersection of Two Linked Lists
description: Master Intersection of Two Linked Lists in the Linked List module.
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

Given the heads of two singly linked\-lists `headA` and `headB`, return _the node at which the two lists intersect_\. If the two linked lists have no intersection at all, return `null`\.

For example, the following two linked lists begin to intersect at node `c1`:

The test cases are generated such that there are no cycles anywhere in the entire linked structure\.

**Note** that the linked lists must **retain their original structure** after the function returns\.

**Custom Judge:**

The inputs to the **judge** are given as follows \(your program is **not** given these inputs\):

*   `intersectVal` \- The value of the node where the intersection occurs\. This is `0` if there is no intersected node\.
*   `listA` \- The first linked list\.
*   `listB` \- The second linked list\.
*   `skipA` \- The number of nodes to skip ahead in `listA` \(starting from the head\) to get to the intersected node\.
*   `skipB` \- The number of nodes to skip ahead in `listB` \(starting from the head\) to get to the intersected node\.

The judge will then create the linked structure based on these inputs and pass the two heads, `headA` and `headB` to your program\. If you correctly return the intersected node, then your solution will be **accepted**\. 

##### **Example 1:**

**Input:** intersectVal = 8, listA = \[4,1,8,4,5\], listB = \[5,6,1,8,4,5\], skipA = 2, skipB = 3

**Output:** Intersected at '8'

**Explanation:** The intersected node's value is 8 \(note that this must not be 0 if the two lists intersect\)\.From the head of A, it reads as \[4,1,8,4,5\]\. From the head of B, it reads as \[5,6,1,8,4,5\]\. There are 2 nodes before the intersected node in A; There are 3 nodes before the intersected node in B\.\- Note that the intersected node's value is not 1 because the nodes with value 1 in A and B \(2nd node in A and 3rd node in B\) are different node references\. In other words, they point to two different locations in memory, while the nodes with value 8 in A and B \(3rd node in A and 4th node in B\) point to the same location in memory\.

##### **Example 2:**

**Input:** intersectVal = 2, listA = \[1,9,1,2,4\], listB = \[3,2,4\], skipA = 3, skipB = 1

**Output:** Intersected at '2'

**Explanation:** The intersected node's value is 2 \(note that this must not be 0 if the two lists intersect\)\.From the head of A, it reads as \[1,9,1,2,4\]\. From the head of B, it reads as \[3,2,4\]\. There are 3 nodes before the intersected node in A; There are 1 node before the intersected node in B\.

##### **Example 3:**

**Input:** intersectVal = 0, listA = \[2,6,4\], listB = \[1,5\], skipA = 3, skipB = 2

**Output:** No intersection

**Explanation:** From the head of A, it reads as \[2,6,4\]\. From the head of B, it reads as \[1,5\]\. Since the two lists do not intersect, intersectVal must be 0, while skipA and skipB can be arbitrary values\.Explanation: The two lists do not intersect, so return null\. 

##### **Constraints:**

*   The number of nodes of `listA` is in the `m`\.
*   The number of nodes of `listB` is in the `n`\.
*   `1 <= m, n <= 3 * 10``4`
*   `1 <= Node.val <= 10``5`
*   `0 <= skipA <= m`
*   `0 <= skipB <= n`
*   `intersectVal` is `0` if `listA` and `listB` do not intersect\.
*   `intersectVal == listA[skipA] == listB[skipB]` if `listA` and `listB` intersect\.

**Follow up:** Could you write a solution that runs in `O(m + n)` time and use only `O(1)` memory?


## Approaches

### 1\. Brute Force

#### Intuition:

The simplest method to determine if the linked lists intersect is to compare each node in one list with every node in the other list\. If there is a node that matches, then that node is the intersection node\.

#### Code:

```java
class Solution {
   public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
       ListNode a = headA;
       // Traverse each node in list A
       while (a != null) {
           ListNode b = headB;
           // Compare the current node in list A with all nodes in list B
           while (b != null) {
               // Check if they are the same node
               if (a == b) {
                   return a; // Found intersection
               }
               b = b.next;
           }
           a = a.next;
       }
       return null; // No intersection found
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(m \* n\) where m and n are the lengths of the two linked lists\.
*   **Space Complexity:** O\(1\) as we are not using any extra space except two pointers\.

### 2\. HashSet

#### Intuition:

We can use a hash set to store all the nodes of one of the linked lists, then traverse the second linked list to see if any node is already in the set\. If a node is found in the set, that node is the intersection node\.

#### Code:

```java
class Solution {
   public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
       HashSet<ListNode> nodesInB = new HashSet<>();
       
       // Traverse through the second list and add its nodes to the hashset
       ListNode b = headB;
       while (b != null) {
           nodesInB.add(b);
           b = b.next;
       }
       
       // Traverse through the first list and check if any node is in the hashset
       ListNode a = headA;
       while (a != null) {
           if (nodesInB.contains(a)) {
               return a; // Found intersection
           }
           a = a.next;
       }
       
       return null; // No intersection found
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(m \+ n\) where m and n are the lengths of the two linked lists\.
*   **Space Complexity:** O\(n\) where n is the length of the longer linked list since all its nodes are stored in a set\.

### 3\. Two Pointers

#### Intuition:

The most optimal approach uses two pointers\. Initially, set two pointers to the heads of the two linked lists\. Traverse through the linked lists, and when a pointer reaches the end of a linked list, redirect it to the head of the other linked list\. If the lists intersect, the two pointers will eventually converge at the intersection node after \(m \+ n\) \- c steps, where c is the length of the shared tail\. If they don't intersect, both pointers will eventually become null, and the loop will end\.

#### Code:

```java
class Solution {
   public ListNode getIntersectionNode(ListNode headA, ListNode headB) {
       // If either head is null, they cannot intersect
       if (headA == null || headB == null) {
           return null;
       }
       
       ListNode a = headA;
       ListNode b = headB;
       
       // Loop until the pointers meet or both reach to end
       while (a != b) {
           a = (a == null) ? headB : a.next;
           b = (b == null) ? headA : b.next;
       }
       
       // Either they met at intersection node or both are null
       return a;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(m \+ n\) where m and n are the lengths of the two linked lists\.
*   **Space Complexity:** O\(1\) as no extra space is used, just pointers are moved\.

#### [Solve it on LeetCode](https://leetcode.com/problems/intersection-of-two-linked-lists)
