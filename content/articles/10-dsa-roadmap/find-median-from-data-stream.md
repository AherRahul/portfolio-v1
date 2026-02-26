---
title: Find Median from Data Stream
description: Master Find Median from Data Stream in the Heaps module.
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

The **median** is the middle value in an ordered integer list\. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values\.

*   For example, for `arr = [2,3,4]`, the median is `3`\.
*   For example, for `arr = [2,3]`, the median is `(2 + 3) / 2 = 2.5`\.

Implement the MedianFinder class:

*   `MedianFinder()` initializes the `MedianFinder` object\.
*   `void addNum(int num)` adds the integer `num` from the data stream to the data structure\.
*   `double findMedian()` returns the median of all elements so far\. Answers within **10****\-5** of the actual answer will be accepted\.

##### **Example 1:**

**Input**

\["MedianFinder", "addNum", "addNum", "findMedian", "addNum", "findMedian"\]

\[\[\], \[1\], \[2\], \[\], \[3\], \[\]\]

**Output**

\[null, null, null, 1\.5, null, 2\.0\]

**Explanation**

```java
MedianFinder medianFinder = new MedianFinder();
medianFinder.addNum(1);    // arr = [1]
medianFinder.addNum(2);    // arr = [1, 2]
medianFinder.findMedian(); // return 1.5 (i.e., (1 + 2) / 2)
medianFinder.addNum(3);    // arr[1, 2, 3]
medianFinder.findMedian(); // return 2.0
```

##### **Constraints:**

*   **\-10****5** **<= num <= 10****5**
*   There will be at least one element in the data structure before calling `findMedian`\.
*   At most **5 \* 10****4** calls will be made to `addNum` and `findMedian`\. 

**Follow up:**

*   If all integer numbers from the stream are in the range `[0, 100]`, how would you optimize your solution?
*   If `99%` of all integer numbers from the stream are in the range `[0, 100]`, how would you optimize your solution?

#### [Solve it on LeetCode](https://leetcode.com/problems/find-median-from-data-stream)

# Approaches

## 1\. Brute Force Approach

#### Intuition:

In the brute force approach, every time we add a new number to our data structure, we will insert it into an existing list and sort it\. This will allow us to easily compute the median by accessing the middle element\(s\) of the sorted list\.

#### Approach:

1.  Use a dynamic array to store the numbers\.
2.  `addNum(int num)`: Insert the incoming number into this array and then sort it\.
3.  `findMedian()`: Access the middle element or the average of two middle elements to get the median\.

#### Code:

Java

```java
class MedianFinder {
   private List<Integer> numbers;

   /** initialize your data structure here. */
   public MedianFinder() {
       numbers = new ArrayList<>();
   }
   
   public void addNum(int num) {
       // Add the number to the list
       numbers.add(num);
       // Sort the list to have numbers ordered
       Collections.sort(numbers);
   }
   
   public double findMedian() {
       int size = numbers.size();
       // If the size is odd, return the middle element
       if (size % 2 == 1) {
           return numbers.get(size / 2);
       } 
       // If the size is even, return the average of the two middle elements
       return (numbers.get(size / 2 - 1) + numbers.get(size / 2)) / 2.0;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the length of the array\.
*   **Space Complexity:** O\(n\), due to the use of additional array\.

## 2\. Two Heaps Approach

#### Intuition:

To optimize the process, we can use two heaps:

*   A max heap for the left part
*   A min heap for the right part

The median can be quickly found by:

*   Taking the top of one or both heaps, depending on the number of elements\.

#### Approach:

1.  Maintain two heaps:

*   A max heap to store the smaller half of the numbers\.
*   A min heap to store the larger half of the numbers\.

3.  `addNum(int num)`:

*   If the new number is less than the max in max heap, add to max heap; otherwise, add to the min heap\.
*   Balance the heaps so they contain equal numbers, or max heap has one extra\.

5.  `findMedian()`:

*   If both heaps have the same size, the median is the average of the tops of both heaps\.
*   If max heap has one more element, the median is its top\.

#### Code:

Java

```java
class MedianFinder {
   // Max heap for the lower half
   private PriorityQueue<Integer> maxHeap;
   // Min heap for the upper half
   private PriorityQueue<Integer> minHeap;

   /** initialize your data structure here. */
   public MedianFinder() {
       // Max heap for values lower than the median
       maxHeap = new PriorityQueue<>((a, b) -> b - a);
       // Min heap for values greater than or equal to the median
       minHeap = new PriorityQueue<>();
   }
   
   public void addNum(int num) {
       // Add to max heap
       if (maxHeap.isEmpty() || num <= maxHeap.peek()) {
           maxHeap.add(num);
       } else {
           // Add to min heap if greater than the maximum of max heap
           minHeap.add(num);
       }
       
       // Balance heaps: max heap can have one more element than min heap
       if (maxHeap.size() > minHeap.size() + 1) {
           minHeap.add(maxHeap.poll());
       } else if (minHeap.size() > maxHeap.size()) {
           maxHeap.add(minHeap.poll());
       }
   }
   
   public double findMedian() {
       // If max heap has one extra element, it's the median
       if (maxHeap.size() > minHeap.size()) {
           return maxHeap.peek();
       } 
       // Otherwise, the median is the average of the tops of maxHeap and minHeap
       return (maxHeap.peek() + minHeap.peek()) / 2.0;
   }
}
```

Complexity Analysis

*   **Time Complexity:** Adding a number: O\(log n\) due to the insertion operation in heaps\. Finding median: O\(1\)\.
*   **Space Complexity:** O\(n\) to store the numbers in the heaps\.