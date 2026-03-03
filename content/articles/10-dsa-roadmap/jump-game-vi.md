---
title: Jump Game VI
description: Master Jump Game VI in the Queues module. Comprehensive guide and
  algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

You are given a **0\-indexed** integer array `nums` and an integer `k`\.

You are initially standing at index `0`\. In one move, you can jump at most `k` steps forward without going outside the boundaries of the array\. That is, you can jump from index `i` to any index in the range `[i + 1, min(n - 1, i + k)]` **inclusive**\.

You want to reach the last index of the array \(index `n - 1`\)\. Your **score** is the **sum** of all `nums[j]` for each index `j` you visited in the array\.

Return _the_ _**maximum score**_ _you can get_\. 

##### **Example 1:**

**Input:** nums = \[1,\-1,\-2,4,\-7,3\], k = 2

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">-1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">-2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">-7</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">3</span></div>
  </div>
</div>

**Output:** 7

**Explanation:** You can choose your jumps forming the subsequence \[1,\-1,4,3\] \(underlined above\)\. The sum is 7\.

##### **Example 2:**

**Input:** nums = \[10,\-5,\-2,4,0,3\], k = 3

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">10</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">-5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">-2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--zero"><span class="arr-idx">4</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">3</span></div>
  </div>
</div>

**Output:** 17

**Explanation:** You can choose your jumps forming the subsequence \[10,4,3\] \(underlined above\)\. The sum is 17\.

##### **Example 3:**

**Input:** nums = \[1,\-5,\-20,4,\-1,3,\-6,\-3\], k = 2

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">-5</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">-20</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">4</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">-1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">-6</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">7</span><span class="arr-val">-3</span></div>
  </div>
</div>

**Output:** 0

##### **Constraints:**

*   **1 <= nums\.length, k <= 10****5**
*   **\-10****4** **<= nums\[i\] <= 10****4**


## Approaches

### 1\. Brute Force

#### Intuition:

In the brute force approach, the idea is to explore every possible path by jumping up to `k` steps forward and choose the path that yields the maximum score\. This involves recursively jumping from the current position all the way to the `n-1` index and calculating the score for each path\.

#### Code:

```java
class JumpGameVI {
   public int maxResult(int[] nums, int k) {
       return dfs(nums, 0, k);
   }

   private int dfs(int[] nums, int index, int k) {
       // If we reach the last index, we return its value
       if (index == nums.length - 1) return nums[index];
       
       int maxScore = Integer.MIN_VALUE;
       
       // Try each possible jump from current index, limited by k
       for (int jump = 1; jump <= k && index + jump < nums.length; jump++) {
           int score = nums[index] + dfs(nums, index + jump, k);
           maxScore = Math.max(maxScore, score);
       }
       
       return maxScore;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(k^n\), as each step can branch into up to `k` further recursive calls\.
*   **Space Complexity:** O\(n\), due to the recursion stack that can go as deep as `n`\.

### 2\. Dynamic Programming with Deque

#### Intuition:

To achieve better performance, we utilize a deque to maintain a sliding window of size `k` over the array and store indices\. The front of the deque will always represent the maximum possible score we can get at that point\. This allows calculating the maximum score at each step in constant time\.

#### Code:

```java
class JumpGameVI {
   public int maxResult(int[] nums, int k) {
       // Deque to keep indices of potential max scores in window
       Deque<Integer> deque = new LinkedList<>();
       deque.offer(0); // Initialize with the first element
       
       // DP array to store maximum score to reach each index
       int[] dp = new int[nums.length];
       dp[0] = nums[0];

       for (int i = 1; i < nums.length; i++) {
           // Remove indices that are out of the sliding window
           while (!deque.isEmpty() && deque.peek() < i - k) {
               deque.poll();
           }
           
           // Calculate the maximum score for current index
           dp[i] = nums[i] + dp[deque.peek()];
           
           // Maintain the deque for potential max scores, removing less useful indices
           while (!deque.isEmpty() && dp[i] >= dp[deque.peekLast()]) {
               deque.pollLast();
           }

           // Add current index to deque
           deque.offer(i);
       }

       return dp[nums.length - 1];
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), each element is processed at most twice\.
*   **Space Complexity:** O\(n\), due to the storage of the dp array and deque\.

### 3\. Dynamic Programming with Priority Queue

#### Intuition:

This approach uses a priority queue to maintain the maximum scores at each index similar to the deque strategy\. The priority queue will always allow us to peek the current maximum score in logarithmic time\.

#### Code:

```java
class JumpGameVI {
   public int maxResult(int[] nums, int k) {
       // Priority Queue to keep pairs of (score, index)
       PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> b[0] - a[0]);
       pq.offer(new int[]{nums[0], 0});
       int maxScore = nums[0];
       
       for (int i = 1; i < nums.length; i++) {
           // Remove elements that are out of bounds of the current window size `k`
           while (!pq.isEmpty() && pq.peek()[1] < i - k) {
               pq.poll();
           }

           maxScore = nums[i] + pq.peek()[0];
           
           // Add the current max score and index
           pq.offer(new int[]{maxScore, i});
       }
       
       return maxScore;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n log k\), due to the insert and remove operations on the priority queue\.
*   **Space Complexity:** O\(n\), as we store scores and their respective indices\.

#### [Solve it on LeetCode](https://leetcode.com/problems/jump-game-vi)
