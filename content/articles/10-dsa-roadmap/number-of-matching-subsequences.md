---
title: Number of Matching Subsequences
description: Master Number of Matching Subsequences in the Hash Tables module.
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

Given a string `s` and an array of strings `words`, return _the number of_ `words[i]` _that is a subsequence of_ `s`\.

A **subsequence** of a string is a new string generated from the original string with some characters \(can be none\) deleted without changing the relative order of the remaining characters\.

*   For example, `"ace"` is a subsequence of `"abcde"`\. 

##### **Example 1:**

**Input:** s = "abcde", words = \["a","bb","acd","ace"\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">a</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">bb</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">acd</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">ace</span></div>
  </div>
</div>

**Output:** 3

**Explanation:** There are three strings in words that are a subsequence of s: "a", "acd", "ace"\.

##### **Example 2:**

**Input:** s = "dsahjpjauf", words = \["ahjpjau","ja","ahbwzgqnuk","tnmlanowax"\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">ahjpjau</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">ja</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">ahbwzgqnuk</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">tnmlanowax</span></div>
  </div>
</div>

**Output:** 2 

##### **Constraints:**

*   **1 <= s\.length <= 5 \* 10****4**
*   **1 <= words\.length <= 5000**
*   **1 <= words\[i\]\.length <= 50**
*   `s` and `words[i]` consist of only lowercase English letters\.


## Approaches

### 1\. Brute Force

The brute force approach involves checking if each word in the list of words is a subsequence of the string `s` by iterating over both the string and the word\.

#### **Intuition:**

For each word, use two pointers to check if it's a subsequence of `s`\. One pointer iterates over the string `s` and the other iterates over the current word\. By using these pointers, we can check if all characters of the word appear in the same order in `s`\.

#### Code:

```java
class Solution {
   public int numMatchingSubseq(String s, String[] words) {
       int count = 0;
       
       for (String word : words) {
           if (isSubsequence(s, word)) {
               count++; // Increment count if the word is a subsequence
           }
       }
       
       return count;
   }
   
   private boolean isSubsequence(String s, String word) {
       int i = 0, j = 0;
       
       while (i < s.length() && j < word.length()) {
           if (s.charAt(i) == word.charAt(j)) {
               j++; // Move the pointer for word if we have a match
           }
           i++; // Always move the pointer for s
       }
       
       return j == word.length(); // If we reached the end of word
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n \* m\) where `n` is the length of the string `s` and `m` is the total length of all words combined\.
*   **Space Complexity:** O\(1\), apart from input space\.

### 2\. HashMap

Instead of checking each word one by one, we can preprocess the string `s` to speed up the lookup of subsequence verification\. We record the indices of each character in `s`, and for each word, we use this information to see if the characters appear in order\.

#### **Intuition:**

Create a mapping from each character in `s` to the list of indices where that character occurs\. For each word, check each character in order, using binary search to find a valid position for the next character\.

#### Code:

```java
class Solution {
   public int numMatchingSubseq(String s, String[] words) {
       Map<Character, List<Integer>> charIndexMap = new HashMap<>();
       
       for (int i = 0; i < s.length(); i++) {
           char c = s.charAt(i);
           charIndexMap.computeIfAbsent(c, x -> new ArrayList<>()).add(i);
       }
       
       int count = 0;
       for (String word : words) {
           if (isSubsequenceWithMap(charIndexMap, word)) {
               count++;
           }
       }
       
       return count;
   }
   
   private boolean isSubsequenceWithMap(Map<Character, List<Integer>> charIndexMap, String word) {
       int prevIndex = -1;
       
       for (char c : word.toCharArray()) {
           if (!charIndexMap.containsKey(c)) {
               return false; // If the character is not present in `s`
           }
           
           List<Integer> indices = charIndexMap.get(c);
           // Use binary search to find the smallest index greater than prevIndex
           int index = Collections.binarySearch(indices, prevIndex + 1);
           if (index < 0) {
               index = -index - 1;
           }
           
           if (index == indices.size()) {
               return false; // No valid position found
           }
           
           prevIndex = indices.get(index); // Update prevIndex
       }
       
       return true;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n \+ m \* log k\) where `n` is the length of the string `s`, `m` is the total length of all words combined, and `k` is the maximum length of indices lists\.
*   **Space Complexity:** O\(n\) for storing index lists\.

### 3\. Binary Search

This approach involves using a binary search strategy to locate the next character of each word in `s`, optimizing the search for characters using a mapping similar to the Efficient Dictionary Approach\.

#### **Intuition:**

For each word, leverage binary search to efficiently decide if the sequence of characters can be found in order by navigating the index list of each character in `s`\.

#### Code:

```java
class Solution {
   public int numMatchingSubseq(String s, String[] words) {
       Map<Character, List<Integer>> charIndexMap = new HashMap<>();
       
       for (int i = 0; i < s.length(); i++) {
           char c = s.charAt(i);
           charIndexMap.computeIfAbsent(c, x -> new ArrayList<>()).add(i);
       }
       
       int count = 0;
       for (String word : words) {
           if (isSubsequenceUsingBinarySearch(charIndexMap, word)) {
               count++;
           }
       }
       
       return count;
   }
   
   private boolean isSubsequenceUsingBinarySearch(Map<Character, List<Integer>> charIndexMap, String word) {
       int prevIndex = -1;
       
       for (char c : word.toCharArray()) {
           if (!charIndexMap.containsKey(c)) {
               return false;
           }
           
           List<Integer> indices = charIndexMap.get(c);
           int index = binarySearch(indices, prevIndex + 1);
           
           if (index == indices.size()) {
               return false;
           }
           
           prevIndex = indices.get(index);
       }
       
       return true;
   }
   
   private int binarySearch(List<Integer> indices, int target) {
       int low = 0, high = indices.size();
       
       while (low < high) {
           int mid = low + (high - low) / 2;
           
           if (indices.get(mid) < target) {
               low = mid + 1;
           } else {
               high = mid;
           }
       }
       
       return low;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n \+ m \* log k\), where `n` is the length of `s`, `m` is the total length of the words, and `k` is the length of the indices list for a character\.
*   **Space Complexity:** O\(n\), due to storage of character indices\.

#### [Solve it on LeetCode](https://leetcode.com/problems/number-of-matching-subsequences)
