---
title: Top K Elements
description: Master Top K Elements in the Heaps module. Comprehensive guide and
  algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

**Top K Elements** is a super useful pattern to find the K largest, k smallest or K most frequent elements in a dataset\.

This pattern can be applied to problems like:

*   Finding the top 5 highest scores in a game leaderboard\.
*   or Retrieving the 3 most frequent words in a document\.

A straightforward approach to solve these types of problems is to sort the entire dataset and take the first k or last k elements\.

But, this isn’t the most optimal approach since sorting takes O\(nlogn\) time\.

The **Top K Elements pattern** allows us to solve this problem more optimally using heaps bringing down the time complexity down from O\(nlogn\) to O\(nlogk\)

In this chapter, you'll learn:

*   When to use the Top K Elements pattern\.
*   How to implement it efficiently in code\.

# When to Use the Top K Elements Pattern?

Here are some common scenarios where this pattern can be applied:

*   Finding the K largest or smallest elements in an array\.
*   Identifying the K most frequent or least frequent elements in a dataset\.
*   Dynamically maintaining the top K elements in a real\-time data stream, like keeping track of the top 10 scores in a live competition\.

# How to Implement the Top K Elements Pattern?

Lets understand this pattern with an example: **Find the top k largest elements in an array\.**

Suppose you have an array:

You need to find the **top 3 largest elements**\. The answer would be: `[10, 15, 20]`\.

There are multiple approaches to solve this problem:

### Sorting

The simplest approach is to sort the array in **descending order** and take the first K elements\.

```java
public void List<Integer> topKSorting(int[] arr, int k) {
   Integer[] boxedArray = Arrays.stream(arr).boxed().toArray(Integer[]::new);
   Arrays.sort(boxedArray, Collections.reverseOrder());
   
   List<Integer> result = new ArrayList<>();
   for (int i = 0; i < k && i < boxedArray.length; i++) {
       result.add(boxedArray[i]);
   }
   return result;
}
```

However, sorting the array takes **O\(n log n\)** time, which can be too slow for large datasets\.

So while sorting works, it’s not the most optimal solution\.

Instead, we can use **heap** data structure to solve this problem more efficiently\.

There are two main types of heaps: **max heap** and **min heap**\.

In a max heap, the largest element is at the top and each parent node is larger than its children\.

A min heap is the opposite\.

The smallest element is at the top, and every each node is smaller than its children\.

The heap maintains this property whenever we add or remove elements from it\.

We can solve this problem using both types of heaps, but each works a bit differently\.

Let’s start with the **max heap** approach\.

### Max\-Heap

Here’s how it works:

1.  Create a max heap out of all the elements in the array\.

1.  This step, called **heapify**, takes **O\(n\)** time\.
2.  Since Python’s `heapq` module only supports min heaps, we can simulate a max heap by pushing **negative values** into the heap\.

3.  **Pop the top K elements** from the heap\.

1.  Popping an element from a heap of size `n` takes **O\(log n\)** time\.
2.  Since we’re popping K elements, this step takes **O\(K log n\)** time\.

```java
public void List<Integer> topKMaxHeap(int[] arr, int k) {
   PriorityQueue<Integer> maxHeap = new PriorityQueue<>((a, b) -> b - a);
   
   for (int num : arr) {
       maxHeap.offer(num);
   }
   
   List<Integer> result = new ArrayList<>();
   for (int i = 0; i < k && !maxHeap.isEmpty(); i++) {
       result.add(maxHeap.poll());
   }
   return result;
}
```

The **space complexity** of this approach is **O\(n\)** because we’re adding all the elements to the heap\.

Now, let’s look at the more efficient approach using a **min heap**\.

### Min\-Heap

Here’s how it works:

*   Initialize a min heap with the first K elements of the array\.
*   Iterate through the rest of the array:

*   If the current element is larger than the root of the heap \(since it’s a min heap, the root is the smallest of the K elements\)
*   Remove the root and insert the new element\.
*   This keeps the heap size at K and ensures it only contains the top K largest elements\.

*   After processing all elements, the heap will contain the k largest elements\.

```java
public void List<Integer> topKMinHeap(int[] arr, int k) {
   PriorityQueue<Integer> minHeap = new PriorityQueue<>();
   
   // Add first K elements
   for (int i = 0; i < k; i++) {
       minHeap.offer(arr[i]);
   }
   
   // Process remaining elements
   for (int i = k; i < arr.length; i++) {
       if (arr[i] > minHeap.peek()) {
           minHeap.poll();
           minHeap.offer(arr[i]);
       }
   }
   
   return new ArrayList<>(minHeap);
}
```

Let’s break down the time and space complexity of this approach:

*   **Building the initial heap** with K elements takes **O\(K\)** time\.
*   For the remaining `N-K` elements, the **heappushpop** operation takes **O\(log K\)** time\.
*   So, the overall **time complexity** is **O\(K \+ \(N\-K\) log K\)**, which simplifies to **O\(N log K\)**\.

The **space complexity** is **O\(K\)** because we’re only storing K elements in the heap\.

Let’s walk through the min heap approach with the example array and find the top 3 largest elements\.

**1\. Initialize the min heap with the first 3 elements: \[7, 10, 4\]\.**

After heapifing it becomes ➔ \[4, 10, 7\]\.

4107

**Now process the rest of the array:**

`3` is smaller than `4`, so we skip it\.

4107

`20` is greater than `4`, so we remove `4` and insert `20`\.

71020

`15` is greater than `7`, so we remove `7` and insert `15`

102015

After processing all elements, the heap contains `[10, 15, 20]`, which are the top 3 largest elements\.

For this problem, using a **min heap** is more efficient compared to a max heap, because it only keeps track of K elements at a time, instead of storing all elements in the heap\.

However, if you need to find the **K smallest elements** instead, you would use a **max heap** approach\.