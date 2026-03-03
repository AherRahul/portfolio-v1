---
title: Sliding Window Maximum
description: Master Sliding Window Maximum in the Queues module. Comprehensive
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

You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right\. You can only see the `k` numbers in the window\. Each time the sliding window moves right by one position\.

Return _the max sliding window_\.

##### **Example 1:**

**Input:** nums = \[1,3,\-1,\-3,5,3,6,7\], k = 3

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">-1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">-3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">7</span><span class="arr-val">7</span></div>
  </div>
</div>

**Output:** \[3,3,5,5,6,7\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">3</span><span class="arr-val">5</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">4</span><span class="arr-val">6</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">5</span><span class="arr-val">7</span></div>
  </div>
</div>

**Explanation:**

Window position Max

\-\-\-\-\-\-\-\-\-\-\-\-\-\-\- \-\-\-\-\-

\[1 3 \-1\] \-3 5 3 6 7 **3**

1 \[3 \-1 \-3\] 5 3 6 7 **3**

1 3 \[\-1 \-3 5\] 3 6 7 **5**

1 3 \-1 \[\-3 5 3\] 6 7 **5**

1 3 \-1 \-3 \[5 3 6\] 7 **6**

1 3 \-1 \-3 5 \[3 6 7\] **7**

##### **Example 2:**

**Input:** nums = \[1\], k = 1

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
  </div>
</div>

**Output:** \[1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
  </div>
</div>

##### **Constraints:**

*   **1 <= nums\.length <= 10****5**
*   **\-10****4** **<= nums\[i\] <= 10****4**
*   **1 <= k <= nums\.length**


## Approaches

### 1\. Brute Force

#### **Intuition:**

The simplest way to solve the sliding window maximum problem is to compute the maximum of each window separately\. For each position in the array, consider all the elements in the sliding window starting from that position, and find the maximum element\. This method checks each sliding window one by one and finds the maximum element\.

#### Code:

```java
class Solution {
   public int[] maxSlidingWindow(int[] nums, int k) {
       if (nums == null || nums.length == 0) return new int[0];
       int[] result = new int[nums.length - k + 1];
       
       for (int i = 0; i <= nums.length - k; i++) {
           int max = Integer.MIN_VALUE;
           for (int j = i; j < i + k; j++) {
               // Find the maximum in the current window
               max = Math.max(max, nums[j]);
           }
           result[i] = max;
       }
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N \* K\): N is the number of elements in the array, and K is the size of the window\. For each of the N\-K\+1 windows, finding the maximum requires O\(K\) time\.
*   **Space Complexity:** O\(N\-K\+1\): We only need an array to store the results\.

### 2\. Deque \(Double\-Ended Queue\) Approach

#### **Intuition:**

Using a deque, we maintain the indexes of the array\. The key is to maintain the elements of the deque in a monotonically decreasing order of their values\. This means the max value for the window is at the front of the deque\. We ensure that elements outside the current window or smaller elements than the current are removed\.

#### Code:

```java
class Solution {
   public int[] maxSlidingWindow(int[] nums, int k) {
       if (nums == null || nums.length == 0) return new int[0];
       
       Deque<Integer> deque = new ArrayDeque<>();
       int[] result = new int[nums.length - k + 1];
       
       for (int i = 0; i < nums.length; i++) {
           // Remove elements not within the sliding window
           if (!deque.isEmpty() && deque.peekFirst() < i - k + 1) {
               deque.pollFirst();
           }
           
           // Remove elements smaller than the current element
           // They won't be needed as they are overshadowed by current element
           while (!deque.isEmpty() && nums[deque.peekLast()] < nums[i]) {
               deque.pollLast();
           }
           
           // Add current element at the end of deque
           deque.offerLast(i);
           
           // The first element of the deque is the largest element for current window
           // Add to result when the first window is completed
           if (i >= k - 1) {
               result[i - k + 1] = nums[deque.peekFirst()];
           }
       }
       
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\) \- Each element is added and removed from the deque at most once\.
*   **Space Complexity:** O\(K\) \- Deque holds at most K elements\.

### 3\. Max\-Heap Approach

#### **Intuition:**

This approach uses a max heap to store the elements of the current window\. The largest element in the window is always at the top of the heap\. We remove elements from the heap that are out of the window's current range\.

#### Code:

```java
class Solution {
   public int[] maxSlidingWindow(int[] nums, int k) {
       if (nums == null || nums.length == 0) return new int[0];
       
       PriorityQueue<int[]> maxHeap = new PriorityQueue<>((a, b) -> b[0] - a[0]);
       int[] result = new int[nums.length - k + 1];
       
       for (int i = 0; i < nums.length; i++) {
           // Remove elements that are out of current window range
           while (!maxHeap.isEmpty() && maxHeap.peek()[1] < i - k + 1) {
               maxHeap.poll();
           }
           
           // Add current element with its index to the heap
           maxHeap.offer(new int[] {nums[i], i});
           
           // If the window is completely filled, the max element of the window is at the root of the heap
           if (i >= k - 1) {
               result[i - k + 1] = maxHeap.peek()[0];
           }
       }
       
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N log K\) \- For each of the N elements, we insert and/or delete from the heap which has a log K time complexity\.
*   **Space Complexity:** O\(K\) \- Max heap can hold up to K elements\.

#### [Solve it on LeetCode](https://leetcode.com/problems/sliding-window-maximum)
