---
title: Merge k Sorted Lists
description: Master Merge k Sorted Lists in the Heaps module. Comprehensive
  guide and algorithmic problem solving.
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

You are given an array of `k` linked\-lists `lists`, each linked\-list is sorted in ascending order\.

_Merge all the linked\-lists into one sorted linked\-list and return it\._

##### **Example 1:**

**Input:** lists = \[\[1,4,5\],\[1,3,4\],\[2,6\]\]

**Output:** \[1,1,2,3,4,4,5,6\]

**Explanation:** The linked\-lists are:\[ 1\->4\->5, 1\->3\->4, 2\->6\]

merging them into one sorted linked list:

1\->1\->2\->3\->4\->4\->5\->6

##### **Example 2:**

**Input:** lists = \[\]

**Output:** \[\]

##### **Example 3:**

**Input:** lists = \[\[\]\]

**Output:** \[\]

##### **Constraints:**

*   **k == lists\.length**
*   **0 <= k <= 10****4**
*   **0 <= lists\[i\]\.length <= 500**
*   **\-10****4** **<= lists\[i\]\[j\] <= 10****4**
*   **lists\[i\] is sorted in ascending order\.**
*   **The sum of lists\[i\]\.length will not exceed 10****4**\.

#### [Solve it on LeetCode](https://leetcode.com/problems/merge-k-sorted-lists)

# Approaches

## 1\. Naive Approach: Brute Force Merging

#### Intuition:

The simplest strategy is to flatten the k linked lists into a single list, sort it, and then reconstruct the linked list from this sorted data\. This approach is easy to implement but not efficient\.

#### Steps:

1.  Traverse each linked list and store each node’s value in a list\.
2.  Sort this list\.
3.  Use the sorted values to construct a new linked list\.

#### Code:

Java

```java
class Solution {
   public ListNode mergeKLists(ListNode[] lists) {
       List<Integer> values = new ArrayList<>();
       
       // Extract all values from the linked lists
       for (ListNode list : lists) {
           while (list != null) {
               values.add(list.val);
               list = list.next;
           }
       }
       
       // Sort all extracted values
       Collections.sort(values);
       
       // Create a new sorted linked list
       ListNode dummy = new ListNode(0);
       ListNode current = dummy;
       for (int val : values) {
           current.next = new ListNode(val);
           current = current.next;
       }
       
       return dummy.next;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N log N\), where N is the total number of nodes across all k lists\. We gather all values, and then sort them\.
*   **Space Complexity:** O\(N\), to store all node values\.

## 2\. Heap Approach: Using a Min\-Heap

#### Intuition:

Utilize a min\-heap to efficiently retrieve the smallest current head from k lists and build the final output list\. PriorityQueue in Java can manage this as a min\-heap by default\.

#### Steps:

1.  Insert the head of each list into a min\-heap\.
2.  Continuously extract the smallest element from the heap, add it to the output list, and insert its next element back into the heap\.

#### Code:

Java

```java
class Solution {
   public ListNode mergeKLists(ListNode[] lists) {
       PriorityQueue<ListNode> heap = new PriorityQueue<>((a, b) -> a.val - b.val);

       // Add the head of each list to the min-heap
       for (ListNode list : lists) {
           if (list != null) {
               heap.offer(list);
           }
       }

       ListNode dummy = new ListNode(0);
       ListNode current = dummy;

       // Continuously extract the minimum element and rebuild the list
       while (!heap.isEmpty()) {
           ListNode node = heap.poll();
           current.next = node;
           current = current.next;

           if (node.next != null) {
               heap.offer(node.next);
           }
       }

       return dummy.next;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N log k\), where N is the total number of nodes and k is the number of linked lists\. Each node insertion/extraction in the heap takes log k time\.
*   **Space Complexity:** O\(k\), for storing k nodes in the heap\.

## 3\. Optimized Approach: Divide and Conquer

#### Intuition:

Use the divide\-and\-conquer technique\. Merge lists in pairs and repeat the process until one list remains\.

#### Steps:

1.  Pair lists and merge each pair\.
2.  Repeat the pairing and merging until only one list remains\.

#### Code:

Java

```java
class Solution {
   public ListNode mergeKLists(ListNode[] lists) {
       if (lists == null || lists.length == 0) return null;
       return mergeLists(lists, 0, lists.length - 1);
   }
   
   private ListNode mergeLists(ListNode[] lists, int start, int end) {
       if (start == end) return lists[start];
       
       int mid = start + (end - start) / 2;
       ListNode left = mergeLists(lists, start, mid);
       ListNode right = mergeLists(lists, mid + 1, end);
       
       return mergeTwoLists(left, right);
   }
   
   private ListNode mergeTwoLists(ListNode l1, ListNode l2) {
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
       
       if (l1 != null) {
           current.next = l1;
       } else if (l2 != null) {
           current.next = l2;
       }
       
       return dummy.next;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N log k\), as each merge operation deals with N nodes in log k depth of recursive calls\.
*   **Space Complexity:** O\(log k\), due to the recursion stack\.