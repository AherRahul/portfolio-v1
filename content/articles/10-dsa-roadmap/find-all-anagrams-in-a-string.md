---
title: Find All Anagrams in a String
description: Master Find All Anagrams in a String in the Sliding Window module.
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

Given two strings `s` and `p`, return an array of all the start indices of `p`'s anagrams in `s`\. You may return the answer in **any order**\. 

##### **Example 1:**

**Input:** s = "cbaebabacd", p = "abc"

**Output:** \[0,6\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">6</span></div>
  </div>
</div>

**Explanation:**

The substring with start index = 0 is "cba", which is an anagram of "abc"\.

The substring with start index = 6 is "bac", which is an anagram of "abc"\.

##### **Example 2:**

**Input:** s = "abab", p = "ab"

**Output:** \[0,1,2\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--green"><span class="arr-idx">0</span><span class="arr-val">0</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">1</span><span class="arr-val">1</span></div>
    <div class="arr-cell arr-cell--green"><span class="arr-idx">2</span><span class="arr-val">2</span></div>
  </div>
</div>

**Explanation:**

The substring with start index = 0 is "ab", which is an anagram of "ab"\.

The substring with start index = 1 is "ba", which is an anagram of "ab"\.The substring with start index = 2 is "ab", which is an anagram of "ab"\.

##### **Constraints:**

*   **1 <= s\.length, p\.length <= 3 \* 10****4**
*   `s` and `p` consist of lowercase English letters\.


## Approaches

### 1\. Sliding Window with Two Hash Maps

### Intuition:

The problem of finding all anagrams can be interpreted as finding all starting indices of substrings in `s` that are permutations of `p`\. One direct way to approach this problem is by using a sliding window technique with the help of hash maps \(or frequency arrays\) to count character occurrences\.

The idea is to maintain two frequency maps:

*   One for the characters in the string `p`\.
*   Another for characters in the current window of `s` with the same length as `p`\.

By sliding the window across `s`, we compare the frequency of characters in the current window to those in `p`\. If they match, then the start index of this window is an anagram's starting point\.

### Code:

```java
class Solution {
   public List<Integer> findAnagrams(String s, String p) {
       List<Integer> result = new ArrayList<>();
       if (s.length() < p.length()) return result;

       // Frequency map of characters in p
       Map<Character, Integer> pCount = new HashMap<>();
       for (char c : p.toCharArray()) {
           pCount.put(c, pCount.getOrDefault(c, 0) + 1);
       }

       // Frequency map for the current window in s
       Map<Character, Integer> sCount = new HashMap<>();
       int windowSize = p.length();
       
       // Initialize the window with the first 'windowSize' characters of s
       for (int i = 0; i < windowSize; i++) {
           sCount.put(s.charAt(i), sCount.getOrDefault(s.charAt(i), 0) + 1);
       }
       
       // Iterate over s
       for (int i = 0; i < s.length() - windowSize + 1; i++) {
           // Compare frequency maps
           if (pCount.equals(sCount)) result.add(i);
           
           // Slide the window forward:
           // Remove the old character going out of the window
           char oldChar = s.charAt(i);
           sCount.put(oldChar, sCount.get(oldChar) - 1);
           if (sCount.get(oldChar) == 0) sCount.remove(oldChar);
           
           // Add the new character coming into the window
           if (i + windowSize < s.length()) {
               char newChar = s.charAt(i + windowSize);
               sCount.put(newChar, sCount.getOrDefault(newChar, 0) + 1);
           }
       }
       
       return result;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n \+ m\), where n is the length of `s` and m is the length of `p`\. We have to scan both strings completely\.
*   **Space Complexity:** O\(1\), as the size of the frequency map is constrained by the number of distinct characters \(which is fixed at 26 for lowercase English letters\)\.

### 2\. Sliding Window with Single Array

### Intuition:

By utilizing a fixed\-size frequency count array instead of hash maps, we can reduce the constant factors in our solution\. Since we're dealing only with lowercase English letters, we can use arrays of size 26 to store frequencies\.

The idea remains the same as above: maintain a sliding window of length `p` across the string `s`, but instead of using two hash maps, use two arrays to track the frequencies\. This not only brings clarity but also slightly optimizes access and modification times since operations on arrays are generally faster than on hash maps\.

### Code:

```java
class Solution {
   public List<Integer> findAnagrams(String s, String p) {
       List<Integer> result = new ArrayList<>();
       if (s.length() < p.length()) return result;

       // Frequency arrays for s and p
       int[] pCount = new int[26];
       int[] sCount = new int[26];

       // Initialize the frequency arrays
       for (int i = 0; i < p.length(); i++) {
           pCount[p.charAt(i) - 'a']++;
           sCount[s.charAt(i) - 'a']++;
       }

       // Sliding window over s
       for (int i = 0; i <= s.length() - p.length(); i++) {
           // Check if the current window is an anagram
           if (areArraysEqual(pCount, sCount)) result.add(i);

           // Slide the window
           if (i + p.length() < s.length()) {
               sCount[s.charAt(i) - 'a']--; // Remove old char from the count
               sCount[s.charAt(i + p.length()) - 'a']++; // Add new char to the count
           }
       }

       return result;
   }
   
   private boolean areArraysEqual(int[] arr1, int[] arr2) {
       for (int i = 0; i < arr1.length; i++) {
           if (arr1[i] != arr2[i]) return false;
       }
       return true;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n \+ m\), as we are still looping through both strings in their entirety\.
*   **Space Complexity:** O\(1\), due to the constant size of the frequency count arrays \(26 elements each\)\.

#### [Solve it on LeetCode](https://leetcode.com/problems/find-all-anagrams-in-a-string)
