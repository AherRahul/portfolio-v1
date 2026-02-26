---
title: Sort List
description: Master Sort List in the Sorting module. Comprehensive guide and
  algorithmic problem solving.
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

Given the `head` of a linked list, return _the list after sorting it in_ _**ascending order**_\.

##### **Example 1:**

Input:head=\[4,2,1,3\]

4

2

1

3

null

Output:\[1,2,3,4\]

1

2

3

4

null

##### **Example 2:**

Input:head=\[\-1,5,3,4,0\]

\-1

5

3

4

0

null

Output:\[\-1,0,3,4,5\]

\-1

0

3

4

5

null

##### **Example 3:**

Input:head=\[\]

null

Output:\[\]

null

##### **Constraints:**

*   The number of nodes in the list is in the range **\[0, 5 \* 10****4****\]**\.
*   **\-10****5** **<= Node\.val <= 10****5**

**Follow up:** Can you sort the linked list in `O(n logn)` time and `O(1)` memory \(i\.e\. constant space\)?

#### [Solve it on LeetCode](https://leetcode.com/problems/sort-list)

# Approaches

## 1\. Merge Sort \(Top\-Down\)

#### **Intuition:**

Merge Sort is an efficient and systematic way of sorting linked lists because it divides the list into halves, sorts, and then merges them back\. In a linked list, accessing middle elements directly isn't as straightforward as arrays\. However, we can find the middle using the "fast and slow pointer" strategy\.

*   **Divide**: Use the fast\-slow pointer method to divide the list into two halves\.
*   **Conquer**: Recursively sort the sublists\.
*   **Combine**: Merge the two sorted halves\.

#### **Code:**

Java

```java
class Solution {
   public ListNode sortList(ListNode head) {
       // Base case: If the list is empty or has a single node, it is already sorted
       if (head == null || head.next == null) {
           return head;
       }

       // Step 1: Split the list into halves using slow and fast pointers
       ListNode slow = head, fast = head, prev = null;
       while (fast != null && fast.next != null) {
           prev = slow;
           slow = slow.next;
           fast = fast.next.next;
       }
       // Disconnect the first half from the second half
       prev.next = null;

       // Step 2: Sort each half
       ListNode leftHalf = sortList(head);
       ListNode rightHalf = sortList(slow);

       // Step 3: Merge the sorted halves
       return merge(leftHalf, rightHalf);
   }

   // Function to merge two sorted linked lists
   private ListNode merge(ListNode l1, ListNode l2) {
       ListNode dummy = new ListNode(0);
       ListNode current = dummy;
       while (l1 != null && l2 != null) {
           if (l1.val < l2.val) {
               current.next = l1;
               l1 = l1.next;
           } else {
               current.next = l2;
               l2 = l2.next;
           }
           current = current.next;
       }
       // At the end of while, one of the lists could have remaining nodes
       current.next = l1 != null ? l1 : l2;
       return dummy.next;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n log n\), where n is the number of nodes in the linked list\. Each split divides the list into two halves, and merging takes linear time\.
*   **Space Complexity:** O\(log n\) due to the recursive stack space\.

### 2\. Merge Sort \(Bottom\-Up\)

#### **Intuition:**

The bottom\-up merge sort iteratively merges sublists of increasing size\. This approach doesn't use recursion, thus avoids the overhead of recursive function calls — potentially saving stack space and making it iterative\.

*   **Iteratively** combine sublists of size 1, 2, 4, and so forth\.
*   Start from small chunks, keep combining until the entire list is sorted\.

#### **Code:**

Java

```java
class Solution {
   public ListNode sortList(ListNode head) {
       // Base case: If the list is empty or has a single node, it is already sorted
       if (head == null || head.next == null) {
           return head;
       }

       // Step to determine the length of the list
       ListNode current = head;
       int length = 0;
       while (current != null) {
           length++;
           current = current.next; 
       }

       // Dummy node setup
       ListNode dummy = new ListNode(0);
       dummy.next = head;
       
       // Bottom-up merge sort
       for (int step = 1; step < length; step *= 2) {
           ListNode prev = dummy;
           ListNode curr = dummy.next;
           while (curr != null) {
               ListNode left = curr;
               ListNode right = split(left, step);
               curr = split(right, step);
               prev = merge(left, right, prev);
           }
       }
       return dummy.next;
   }

   // Split the list at step size and return the head of the second list
   private ListNode split(ListNode head, int step) {
       for (int i = 1; head != null && i < step; i++) {
           head = head.next;
       }
       if (head == null) return null;
       ListNode second = head.next;
       head.next = null;
       return second;
   }

   // Merging two lists and appending to prev, returning the last node after merge
   private ListNode merge(ListNode l1, ListNode l2, ListNode prev) {
       ListNode current = prev;

       while (l1 != null && l2 != null) {
           if (l1.val < l2.val) {
               current.next = l1;
               l1 = l1.next;
           } else {
               current.next = l2;
               l2 = l2.next;
           }
           current = current.next;
       }
       current.next = l1 != null ? l1 : l2;

       // Move current to the end of the new merged list
       while (current.next != null) {
           current = current.next;
       }
       return current;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n log n\), similar to the top\-down approach\. Each pass through the list doubling the size effectively achieves the merge\.
*   **Space Complexity:** O\(1\), this is an in\-place sorting algorithm with no additional space use aside from a few pointers\.