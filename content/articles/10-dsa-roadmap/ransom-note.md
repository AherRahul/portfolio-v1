---
title: Ransom Note
description: Master Ransom Note in the Hash Tables module. Comprehensive guide
  and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

## Problem Description

Given two strings `ransomNote` and `magazine`, return `true` _if_ `ransomNote` _can be constructed by using the letters from_ `magazine` _and_ `false` _otherwise_\.

Each letter in `magazine` can only be used once in `ransomNote`\. 

##### **Example 1:**

**Input:** ransomNote = "a", magazine = "b"

**Output:** false

##### **Example 2:**

**Input:** ransomNote = "aa", magazine = "ab"

**Output:** false

##### **Example 3:**

**Input:** ransomNote = "aa", magazine = "aab"

**Output:** true

##### **Constraints:**

*   **1 <= ransomNote\.length, magazine\.length <= 10****5**
*   `ransomNote` and `magazine` consist of lowercase English letters\.


## Approaches

### 1\. Frequency Counting Using Arrays

#### **Intuition:**

The problem is asking whether we can construct the `ransomNote` string using the characters from the `magazine` string\. We can think of this as checking if there are enough characters available in `magazine` to cover each character requirement in `ransomNote`\.

The basic idea is to count the frequency of each character in both `ransomNote` and `magazine`\. Then, check if for every character in `ransomNote`, the count of that character in `magazine` is greater than or equal to its count in `ransomNote`\.

#### **Code:**

We can use an integer array of size 26 to count the frequency of characters since the problem guarantees lowercase English letters only\.

```java
class Solution {
   public boolean canConstruct(String ransomNote, String magazine) {
       // Create a frequency array for the magazine's characters.
       int[] magazineFreq = new int[26];
       
       // Fill the frequency array with magazine characters.
       for (char ch : magazine.toCharArray()) {
           magazineFreq[ch - 'a']++;
       }
       
       // Check each character in ransomNote against the magazine frequency.
       for (char ch : ransomNote.toCharArray()) {
           // Decrement the count in magazine frequency array for each character in ransomNote.
           if (magazineFreq[ch - 'a'] == 0) {
               // If count is zero, we can't construct the ransom note.
               return false;
           }
           magazineFreq[ch - 'a']--;
       }
       
       // All characters needed are available in the magazine.
       return true;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(m \+ n\), where `m` is the length of the `magazine` and `n` is the length of `ransomNote`, since we iterate over both strings once\.
*   **Space Complexity:** O\(1\), since the space used is constant \(26\), regardless of the input size\.

### 2\. Frequency Counting Using HashMap

#### **Intuition:**

Similar to the array\-based approach, but using a HashMap allows the solution to easily be extended to encompass a broader set of characters if constraints were to change\.

#### **Code:**

We will use a HashMap to store frequencies of characters in `magazine` and then check each character in `ransomNote` against this frequency map\.

```java
class Solution {
   public boolean canConstruct(String ransomNote, String magazine) {
       // Create a map to store character frequencies from the magazine.
       Map<Character, Integer> magazineFreq = new HashMap<>();
       
       // Fill the frequency map with characters from the magazine.
       for (char ch : magazine.toCharArray()) {
           magazineFreq.put(ch, magazineFreq.getOrDefault(ch, 0) + 1);
       }
       
       // Check against the frequency map with each character from ransomNote.
       for (char ch : ransomNote.toCharArray()) {
           // Check if the character is missing or not enough in the magazine.
           if (!magazineFreq.containsKey(ch) || magazineFreq.get(ch) == 0) {
               return false;
           }
           // Decrease the frequency count for the current character.
           magazineFreq.put(ch, magazineFreq.get(ch) - 1);
       }
       
       return true;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(m \+ n\), where `m` is the length of the `magazine` and `n` is the length of `ransomNote`, since we iterate over both strings once\.
*   **Space Complexity:** O\(1\) theoretically because the map keys are bounded by a fixed range \(26 lowercase letters\), though practically hash maps might grow depending on collisions and load\.

#### [Solve it on LeetCode](https://leetcode.com/problems/ransom-note)
