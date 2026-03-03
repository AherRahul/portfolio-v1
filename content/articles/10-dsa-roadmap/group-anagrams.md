---
title: Group Anagrams
description: Master Group Anagrams in the Hash Tables module. Comprehensive
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

Given an array of strings `strs`, group the anagrams together\. You can return the answer in **any order**\. 

##### **Example 1:**

**Input:** strs = \["eat","tea","tan","ate","nat","bat"\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">eat</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">1</span><span class="arr-val">tea</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">2</span><span class="arr-val">tan</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">3</span><span class="arr-val">ate</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">4</span><span class="arr-val">nat</span></div>
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">5</span><span class="arr-val">bat</span></div>
  </div>
</div>

**Output:** \[\["bat"\],\["nat","tan"\],\["ate","eat","tea"\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">bat</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">nat</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">tan</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">ate</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">eat</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">tea</span></div>
    </div>
  </div>
</div>

**Explanation:**

*   There is no string in strs that can be rearranged to form `"bat"`\.
*   The strings `"nat"` and `"tan"` are anagrams as they can be rearranged to form each other\.
*   The strings `"ate"`, `"eat"`, and `"tea"` are anagrams as they can be rearranged to form each other\.

##### **Example 2:**

**Input:** strs = \[""\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val"></span></div>
  </div>
</div>

**Output:** \[\[""\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val"></span></div>
    </div>
  </div>
</div>

##### **Example 3:**

**Input:** strs = \["a"\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-row">
    <div class="arr-cell arr-cell--filled"><span class="arr-idx">0</span><span class="arr-val">a</span></div>
  </div>
</div>

**Output:** \[\["a"\]\] 

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--green"><span class="arr-val">a</span></div>
    </div>
  </div>
</div>

##### **Constraints:**

*   **1 <= strs\.length <= 10****4**
*   **0 <= strs\[i\]\.length <= 100**
*   `strs[i]` consists of lowercase English letters\.


## Approaches

### 1\. Sorting Each Word

#### **Intuition:**

The first idea is to use the property that if two strings are anagrams of each other, their sorted form will be the same\. By sorting each string and using it as a key, we can group the words that are anagrams together\.

1.  Iterate over the list of strings\.
2.  Sort each string and use it as a key in a hashmap where the value will be a list of strings\.
3.  Finally, return all the values of the hashmap that represent grouped anagrams\.

#### **Code:**

```java
class Solution {
   public List<List<String>> groupAnagrams(String[] strs) {
       // Map to store the list of anagrams
       Map<String, List<String>> anagramMap = new HashMap<>();
       
       for (String word : strs) {
           // Convert the word to an array of characters
           char[] charArray = word.toCharArray();
           // Sort the array
           Arrays.sort(charArray);
           // Convert back to string
           String sortedWord = new String(charArray);
           
           // If the sorted word is not in the map, add it with an empty list
           if (!anagramMap.containsKey(sortedWord)) {
               anagramMap.put(sortedWord, new ArrayList<>());
           }
           
           // Append the original word to the corresponding list
           anagramMap.get(sortedWord).add(word);
       }
       
       // Return the grouped list of anagrams
       return new ArrayList<>(anagramMap.values());
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(NK log K\) where N is the number of strings and K is the maximum length of a string\. Sorting each string takes O\(K log K\)\.
*   **Space Complexity:** O\(NK\), the space for storing the groups of anagrams\.

### 2\. Counting Characters

#### **Intuition:**

Instead of sorting, we can use the frequency of characters as a key\. If two strings are anagrams, they will have the same frequency distribution of characters\.

1.  Use an array of size 26 to count the frequency of each character for each string because all characters are lowercase\.
2.  Convert this frequency array to a unique string and use it as a key in a hashmap\.
3.  Group strings with the same frequency distribution together\.

#### **Code:**

```java
class Solution {
   public List<List<String>> groupAnagrams(String[] strs) {
       // Main map to track groups of anagrams
       Map<String, List<String>> anagramMap = new HashMap<>();
       
       for (String word : strs) {
           // 26 letters in the alphabet
           int[] charCount = new int[26];
           
           // Count each character's frequency in the word
           for (char c : word.toCharArray()) {
               charCount[c - 'a']++;
           }
           
           // Build key based on character counts
           StringBuilder keyBuilder = new StringBuilder();
           for (int count : charCount) {
               keyBuilder.append('#');
               keyBuilder.append(count);
           }
           String key = keyBuilder.toString();
           
           // Add the word to the relevant anagram group
           if (!anagramMap.containsKey(key)) {
               anagramMap.put(key, new ArrayList<>());
           }
           anagramMap.get(key).add(word);
       }
       
       // Return all grouped anagrams
       return new ArrayList<>(anagramMap.values());
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(N \* K\), as constructing the unique string key per word from its character count takes O\(K\)\.
*   **Space Complexity:** O\(N \*K\), storing the groups of anagrams based on their character frequency in the hashmap\.

#### [Solve it on LeetCode](https://leetcode.com/problems/group-anagrams)
