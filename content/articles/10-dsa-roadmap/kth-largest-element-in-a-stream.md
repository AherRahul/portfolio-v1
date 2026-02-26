---
title: Kth Largest Element in a Stream
description: Master Kth Largest Element in a Stream in the Heaps module.
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

You are part of a university admissions office and need to keep track of the `kth` highest test score from applicants in real\-time\. This helps to determine cut\-off marks for interviews and admissions dynamically as new applicants submit their scores\.

You are tasked to implement a class which, for a given integer `k`, maintains a stream of test scores and continuously returns the `k`th highest test score **after** a new score has been submitted\. More specifically, we are looking for the `k`th highest score in the sorted list of all scores\.

Implement the `KthLargest` class:

*   `KthLargest(int k, int[] nums)` Initializes the object with the integer `k` and the stream of test scores `nums`\.
*   `int add(int val)` Adds a new test score `val` to the stream and returns the element representing the **k****th** largest element in the pool of test scores so far\. 

##### **Example 1:**

**Input:**

\["KthLargest", "add", "add", "add", "add", "add"\]

\[\[3, \[4, 5, 8, 2\]\], \[3\], \[5\], \[10\], \[9\], \[4\]\]

**Output:** \[null, 4, 5, 5, 8, 8\]

**Explanation:**

```java
KthLargest kthLargest = new KthLargest(3, [4, 5, 8, 2]);
kthLargest.add(3); // return 4
kthLargest.add(5); // return 5
kthLargest.add(10); // return 5
kthLargest.add(9); // return 8
kthLargest.add(4); // return 8
```

##### **Example 2:**

**Input:**

\["KthLargest", "add", "add", "add", "add"\]

\[\[4, \[7, 7, 7, 7, 8, 3\]\], \[2\], \[10\], \[9\], \[9\]\]

**Output:** \[null, 7, 7, 7, 8\]

**Explanation:**

```java
KthLargest kthLargest = new KthLargest(4, [7, 7, 7, 7, 8, 3]);
kthLargest.add(2); // return 7
kthLargest.add(10); // return 7
kthLargest.add(9); // return 7
kthLargest.add(9); // return 8
```

##### **Constraints:**

*   **0 <= nums\.length <= 10****4**
*   **1 <= k <= nums\.length \+ 1**
*   **\-10****4** **<= nums\[i\] <= 10****4**
*   **\-10****4** **<= val <= 10****4**
*   **At most 10****4** **calls will be made to add\.**

#### [Solve it on LeetCode](https://leetcode.com/problems/kth-largest-element-in-a-stream)

# Approaches

## 1\. Brute Force with Sorting

#### **Intuition:**

For each addition of a new element into the stream, we can sort the elements and fetch the k\-th largest element directly\. This approach is straightforward but inefficient for larger inputs\.

#### **Steps:**

1.  Maintain a list of numbers that we will continually update as new numbers are added\.
2.  Every time a new number is added, insert it into the list\.
3.  Sort the list in descending order\.
4.  Retrieve the k\-th element from the sorted list\.

#### **Code:**

Java

```java
class KthLargest {
   private final int k;
   private final ArrayList<Integer> stream;

   public KthLargest(int k, int[] nums) {
       this.k = k;
       this.stream = new ArrayList<>();
       for (int num : nums) {
           stream.add(num);
       }
   }
   
   public int add(int val) {
       stream.add(val);
       // Sort the stream every time a new number is added
       Collections.sort(stream, Collections.reverseOrder());
       // Return the k-th largest element
       return stream.get(k - 1);
   }
}
```

Complexity Analysis

*   **Time Complexity:** `O(n log n)` for sorting the list each time a new element is added \(where `n` is the number of elements in the list\)\.
*   **Space Complexity:** `O(n)` for storing the elements in a list\.

## 2\. Sorted List

#### **Intuition:**

Maintain a sorted list at all times and ensure the list is sorted with each new insertion\. This results in better time complexity than re\-sorting the entire list\.

#### **Steps:**

1.  Maintain a list of numbers, sorted after each insertion\.
2.  Use binary search to find the position where the new element should be inserted to keep the list sorted\.
3.  After insertion, directly access the k\-th largest element\.

#### **Code:**

Java

```java
class KthLargest {
   private final int k;
   private final ArrayList<Integer> stream;

   public KthLargest(int k, int[] nums) {
       this.k = k;
       this.stream = new ArrayList<>();
       for (int num : nums) {
           add(num);
       }
   }
   
   public int add(int val) {
       // Insert `val` into the correct position in the sorted list using binary search
       int index = Collections.binarySearch(stream, val, Collections.reverseOrder());
       if (index < 0) {
           index = -index - 1;
       }
       stream.add(index, val);
       // Return the k-th largest element
       return stream.get(k - 1);
   }
}
```

Complexity Analysis

*   **Time Complexity:** `O(k)` for maintaining a sorted list by binary search and insertion\.
*   **Space Complexity:** `O(n)` for storing the stream of numbers\.

## 3\. Min\-Heap \(Optimal\)

#### **Intuition:**

Use a min\-heap of size `k` to efficiently manage the k\-th largest element\. The min\-heap will allow the smallest element to be on top, ensuring we can easily access the k\-th largest element by maintaining heap size\.

#### **Steps:**

1.  Use a PriorityQueue \(min\-heap\) of size `k`\.
2.  Iterate over the initial list and add each element to the heap\.
3.  If the heap exceeds size `k`, remove the smallest element \(top of the heap\)\.
4.  For a new addition, add the element and ensure the heap does not exceed size `k`\.
5.  The top element of the heap will be the k\-th largest element\.

#### **Code:**

Java

```java
class KthLargest {
   private final int k;
   private final PriorityQueue<Integer> minHeap;

   public KthLargest(int k, int[] nums) {
       this.k = k;
       this.minHeap = new PriorityQueue<>();
       for (int num : nums) {
           add(num);
       }
   }
   
   public int add(int val) {
       // Add the new value to the heap
       minHeap.offer(val);
       // If the heap size exceeds `k`, remove the smallest element
       if (minHeap.size() > k) {
           minHeap.poll();
       }
       // The root of the min-heap is the k-th largest element
       return minHeap.peek();
   }
}
```

Complexity Analysis

*   **Time Complexity:** `O(log k)` for each addition \(heap insertion and adjustment\)\.
*   **Space Complexity:** `O(k)` for maintaining the heap of size `k`\.