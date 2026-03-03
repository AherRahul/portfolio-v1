---
title: Kth Smallest Element in a Sorted Matrix
description: Master Kth Smallest Element in a Sorted Matrix in the Heaps module.
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

Given an `n x n` `matrix` where each of the rows and columns is sorted in ascending order, return _the_ **k****th** _smallest element in the matrix_\.

Note that it is the **k****th** smallest element **in the sorted order**, not the **k****th** **distinct** element\.

You must find a solution with a memory complexity better than **O\(n****2****\)**\.

##### **Example 1:**

**Input:** matrix = \[\[1,5,9\],\[10,11,13\],\[12,13,15\]\], k = 8

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">9</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">10</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">11</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">13</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">12</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">13</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">15</span></div>
    </div>
  </div>
</div>

**Output:** 13

**Explanation:** The elements in the matrix are \[1,5,9,10,11,12,13,**13**,15\], and the 8th smallest number is 13

##### **Example 2:**

**Input:** matrix = \[\[\-5\]\], k = 1

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">-5</span></div>
    </div>
  </div>
</div>

**Output:** \-5

##### **Constraints:**

*   **n == matrix\.length == matrix\[i\]\.length**
*   **1 <= n <= 300**
*   **\-10****9** **<= matrix\[i\]\[j\] <= 10****9**
*   **All the rows and columns of matrix are guaranteed to be sorted in non\-decreasing order\.**
*   **1 <= k <= n****2**

**Follow up:**

*   Could you solve the problem with a constant memory \(i\.e\., `O(1)` memory complexity\)?
*   Could you solve the problem in `O(n)` time complexity? The solution may be too advanced for an interview but you may find reading [this paper](http://www.cse.yorku.ca/~andy/pubs/X+Y.pdf) fun\.


## Approaches

### 1\. Brute Force with Sorting

#### Intuition:

The simplest approach to solve this problem is by extracting all the elements from the matrix and placing them into a list\. Once we have a list, we can sort it and then directly access the kth smallest element from this sorted list\.

#### Algorithm:

1.  Create a list to store all elements of the matrix\.
2.  Traverse the matrix and add each element to the list\.
3.  Sort the list\.
4.  Return the element at the kth index in the sorted list\.

#### Code:

```java
class Solution {
   public int kthSmallest(int[][] matrix, int k) {
       int n = matrix.length;
       // Create a list to store all elements from the matrix
       List<Integer> list = new ArrayList<>();
       
       // Traverse the matrix and add all elements to the list
       for (int i = 0; i < n; i++) {
           for (int j = 0; j < n; j++) {
               list.add(matrix[i][j]);
           }
       }
       
       // Sort the list
       Collections.sort(list);
       
       // The k-1 element in the sorted list is the kth smallest element (0-based index)
       return list.get(k - 1);
   }
}
```

#### Complexity Analysis

*   **Time Complexity**: O\(n^2 \* log n\) for sorting the list that contains all matrix elements\.
*   **Space Complexity**: O\(n^2\) for storing all elements from the matrix\.

### 2\. Min\-Heap

#### Intuition:

To improve upon the brute force sorting solution, we can make use of a min\-heap\. The idea is to store each element in a min\-heap so that we can extract the smallest element efficiently\. Since the matrix rows \(and columns\) are sorted, we start placing elements into the heap one row at a time\.

We maintain the heap for at most the size of the matrix's row by column, extract the smallest element from the heap k times, which will give us the kth smallest element\.

#### Algorithm:

1.  Create a min\-heap and add the first element of each row \(along with row and column indices\)\.
2.  Extract the smallest element from the heap k times\.
3.  For each extraction, if the extracted element's column has another element in the row, add it to the heap\.
4.  The kth extracted element is our answer\.

#### Code:

```java
class Solution {
   public int kthSmallest(int[][] matrix, int k) {
       int n = matrix.length;
       PriorityQueue<int[]> minHeap = new PriorityQueue<>((a, b) -> a[0] - b[0]);
       
       // Add the first element of each row to the heap
       for (int i = 0; i < n; i++) {
           minHeap.offer(new int[]{matrix[i][0], i, 0});
       }
       
       int count = 0;
       int result = 0;
       
       // Extract the smallest element k times
       while (count < k) {
           int[] current = minHeap.poll();
           result = current[0];
           int row = current[1];
           int col = current[2];
           
           // If there is a next element in the same row, add it to the heap
           if (col + 1 < n) {
               minHeap.offer(new int[]{matrix[row][col + 1], row, col + 1});
           }
           
           count++;
       }
       
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity**: O\(klog n\) because each insertion and extraction from the heap takes O\(log n\) and we perform the extraction k times\.
*   **Space Complexity**: O\(n\) because we store up to n elements in the heap\.

### 3\. Binary Search

#### Intuition:

The row and column sorted property of the matrix allows us to use binary search\. We search within the range of the smallest and largest element of the matrix\. For each midpoint value, count how many elements are less than or equal to it\. Adjust the search range based on this count relative to k\.

#### Algorithm:

1.  Initialize two pointers: `left` to the smallest element and `right` to the largest element in the matrix\.
2.  Perform binary search:

*   Find the midpoint between `left` and `right`\.
*   Count elements less than or equal to the midpoint\.
*   If this count is less than k, move `left` up; otherwise, move `right` down\.

4.  Once the search is complete, `left` contains the kth smallest element\.

#### Code:

```java
class Solution {
   public int kthSmallest(int[][] matrix, int k) {
       int n = matrix.length;
       int left = matrix[0][0];
       int right = matrix[n - 1][n - 1];

       while (left < right) {
           int mid = left + (right - left) / 2;
           int count = countLessEqual(matrix, mid, n);
           
           if (count < k) {
               left = mid + 1;
           } else {
               right = mid;
           }
       }
       
       return left;
   }

   // Helper function to count elements less than or equal to mid
   private int countLessEqual(int[][] matrix, int mid, int n) {
       int count = 0;
       int row = n - 1;
       int col = 0;
       
       while (row >= 0 && col < n) {
           if (matrix[row][col] <= mid) {
               count += row + 1;
               col++;
           } else {
               row--;
           }
       }
       return count;
   }
}
```

#### Complexity Analysis

*   **Time Complexity**: O\(n \* log \(max \- min\)\) where log\(max \- min\) relates to binary search range, and n to count elements\.
*   **Space Complexity**: O\(1\) as we're not using extra space beyond variables\.

#### [Solve it on LeetCode](https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix)
