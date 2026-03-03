---
title: Top K Frequent Elements
description: Master Top K Frequent Elements in the Heaps module. Comprehensive
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

Given an integer array `nums` and an integer `k`, return _the_ `k` _most frequent elements_\. You may return the answer in **any order**\.

##### **Example 1:**

**Input:** nums = \[1,1,1,2,2,3\], k = 2

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">3</span></div>
  </div>
</div>

**Output:** \[1,2\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
  </div>
</div>

##### **Example 2:**

**Input:** nums = \[1\], k = 1

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
  </div>
</div>

**Output:** \[1\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
  </div>
</div>

##### **Example 3:**

**Input:** nums = \[1,2,1,2,1,2,3,1,3,2\], k = 2

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">2</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">6</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">7</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">8</span><span class="arr-val">3</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">9</span><span class="arr-val">2</span></div>
  </div>
</div>

**Output:** \[1,2\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">2</span></div>
  </div>
</div>

##### **Constraints:**

*   **1 <= nums\.length <= 10****5**
*   **\-10****4** **<= nums\[i\] <= 10****4**
*   `k` is in the range `[1, the number of unique elements in the array]`\.
*   It is **guaranteed** that the answer is **unique**\.

**Follow up:** Your algorithm's time complexity must be better than `O(n log n)`, where n is the array's size\.


## Approaches

### 1\. Sorting

#### Intuition:

The most straightforward way to find the top `k` frequent elements is to count the frequency of each element using a hashmap, then sort the elements based on their frequency in descending order, and finally pick the first `k` elements from this sorted list\.

#### Steps:

1.  Create a hashmap to count the frequency of each element\.
2.  Transform hashmap entries into a list of pairs and sort it based on frequency\.
3.  Extract the first `k` elements from the sorted list\.

#### Code:

```java
class Solution {
   public int[] topKFrequent(int[] nums, int k) {
       // Step 1: Frequency mapping
       HashMap<Integer, Integer> freqMap = new HashMap<>();
       for (int num : nums) {
           freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
       }

       // Step 2: Convert entries to a list and sort it
       List<Map.Entry<Integer, Integer>> sortedEntries = new ArrayList<>(freqMap.entrySet());
       sortedEntries.sort((a, b) -> b.getValue().compareTo(a.getValue()));

       // Step 3: Extract top k elements
       int[] topK = new int[k];
       for (int i = 0; i < k; i++) {
           topK[i] = sortedEntries.get(i).getKey();
       }
       return topK;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N log N\) due to sorting operation, where N is the number of elements in `nums`\.
*   **Space Complexity:** O\(N\) for storing the frequency map\.

### 2\. Priority Queue

#### Intuition:

Instead of sorting all elements, we can use a Min\-Heap \(Priority Queue\) to keep track of the top `k` elements\. As we iterate through the hashmap, we maintain the size of the heap to be at most `k` by removing the smallest element whenever the size exceeds `k`\.

#### Steps:

1.  Use a hashmap to count the frequency of each element\.
2.  Use a priority queue to keep track of the top `k` elements\.
3.  Iterate through the map and push each entry into the Min\-Heap, evicting the smallest when the heap exceeds size `k`\.

#### Code:

```java
class Solution {
   public int[] topKFrequent(int[] nums, int k) {
       // Frequency mapping
       HashMap<Integer, Integer> freqMap = new HashMap<>();
       for (int num : nums) {
           freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
       }

       // Min-Heap to maintain top k elements
       PriorityQueue<Map.Entry<Integer, Integer>> minHeap = 
           new PriorityQueue<>((a, b) -> a.getValue().compareTo(b.getValue()));

       for (Map.Entry<Integer, Integer> entry : freqMap.entrySet()) {
           minHeap.add(entry);
           if (minHeap.size() > k) {
               minHeap.poll(); // Remove the element with the smallest frequency
           }
       }

       // Extracting elements from heap
       int[] topK = new int[k];
       for (int i = 0; i < k; i++) {
           topK[i] = minHeap.poll().getKey();
       }
       return topK;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N log k\) due to the heap operations, where N is the number of elements in `nums`\.
*   **Space Complexity:** O\(N\) for the frequency map and O\(k\) for the heap\.

### 3\. Bucket Sort

#### Intuition:

We can utilize a bucket sort technique since the maximum frequency of any element can't exceed the number of elements\. We'll create an array of lists where each index corresponds to a frequency, then we'll fill each list with the numbers that have the respective frequency\.

#### Steps:

1.  Build the frequency map\.
2.  Create buckets where index corresponds to frequency, and append elements to respective buckets\.
3.  Iterate from the end of the bucket array to pick the top `k` frequent elements\.

#### Code:

```java
class Solution {
   public int[] topKFrequent(int[] nums, int k) {
       // Frequency mapping
       HashMap<Integer, Integer> freqMap = new HashMap<>();
       for (int num : nums) {
           freqMap.put(num, freqMap.getOrDefault(num, 0) + 1);
       }

       // Array of lists for bucket sort
       List<Integer>[] buckets = new List[nums.length + 1];
       
       // Filling buckets
       for (int key : freqMap.keySet()) {
           int frequency = freqMap.get(key);
           if (buckets[frequency] == null) {
               buckets[frequency] = new ArrayList<>();
           }
           buckets[frequency].add(key);
       }

       // Gathering top k frequent elements
       int[] topK = new int[k];
       int index = 0;
       for (int i = buckets.length - 1; i >= 0 && index < k; i--) {
           if (buckets[i] != null) {
               for (int num : buckets[i]) {
                   topK[index++] = num;
                   if (index == k) {
                       break;
                   }
               }
           }
       }
       return topK;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N\), where N is the number of elements in `nums`\. This is because we are only doing constant\-time operations per element\.
*   **Space Complexity:** O\(N\) for storing the frequency map and bucket list\.

#### [Solve it on LeetCode](https://leetcode.com/problems/top-k-frequent-elements)
