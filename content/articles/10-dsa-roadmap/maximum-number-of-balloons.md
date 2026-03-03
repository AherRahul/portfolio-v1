---
title: Maximum Number of Balloons
description: Master Maximum Number of Balloons in the Hash Tables module.
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

Given a string `text`, you want to use the characters of `text` to form as many instances of the word **"balloon"** as possible\.

You can use each character in `text` **at most once**\. Return the maximum number of instances that can be formed\. 

##### **Example 1:**

**Input:** text = "nlaebolko"

**Output:** 1

##### **Example 2:**

**Input:** text = "loonbalxballpoon"

**Output:** 2

##### **Example 3:**

**Input:** text = "leetcode"

**Output:** 0

##### **Constraints:**

*   **1 <= text\.length <= 10****4**
*   `text` consists of lower case English letters only\.


## Approaches

### 1\. Frequency Count with Maps

#### **Intuition:**

*   The word "balloon" consists of the letters: 'b', 'a', 'l', 'o', 'n'\.
*   We need to count these letters in the input string and determine how many times we can form the word "balloon"\.
*   For 'l' and 'o', we need the count divided by 2 because these letters appear twice in "balloon"\.

#### **Steps:**

1.  Create a frequency map for the characters in the input string\.
2.  Check the count of each character needed for "balloon"\.
3.  The count of possible "balloons" that can be formed is determined by the minimum ratio of available to needed instances of these characters\.

#### **Code:**

```java
class Solution {
   public int maxNumberOfBalloons(String text) {
       // Create a frequency map for the input string
       Map<Character, Integer> freqMap = new HashMap<>();
       for (char c : text.toCharArray()) {
           freqMap.put(c, freqMap.getOrDefault(c, 0) + 1);
       }
       
       // Store the required frequencies of each character in 'balloon'
       String balloon = "balloon";
       
       // Calculate the max number of "balloon" words
       int maxBalloons = Integer.MAX_VALUE;
       Map<Character, Integer> balloonFreq = new HashMap<>();
       for (char c : balloon.toCharArray()) {
           balloonFreq.put(c, balloonFreq.getOrDefault(c, 0) + 1);
       }
       
       // Calculate the max possible number of "balloon" we can form
       for (Map.Entry<Character, Integer> e : balloonFreq.entrySet()) {
           char key = e.getKey();
           int count = e.getValue();
           maxBalloons = Math.min(maxBalloons, freqMap.getOrDefault(key, 0) / count);
       }
       
       return maxBalloons;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the length of the input string; we traverse the string to build the frequency map\.
*   **Space Complexity:** O\(1\), since the frequency map only contains a fixed number of characters \(at most the size of the alphabet\)\.

### 2\. Optimized Frequency Count with Arrays

#### **Intuition:**

This approach builds on the idea of counting character frequencies, but instead of using a map or dictionary, which carries extra overhead, we use a fixed\-size array of length 26\.

Since the problem only involves lowercase English letters, each character `'a'` to `'z'` can be mapped directly to an array index \(`c - 'a'`\), making both counting and lookups extremely fast\.

Once we know how many times each required character appears in the input string, we compute how many full occurrences of the word **"balloon"** can be formed\.

### Steps:

1.  Create an integer array of size 26 to store the frequency of each lowercase letter\.
2.  Count the characters in the input string by incrementing the corresponding index in the array\.
3.  For each character in the word `"balloon"` \(`b`, `a`, `l`, `l`, `o`, `o`, `n`\), compute how many times it can contribute to forming the word\.

*   For `'l'` and `'o'`, divide counts by 2 because each appears twice\.

5.  The answer is the minimum among these available counts\.

#### **Code:**

```java
class Solution {
   public int maxNumberOfBalloons(String text) {
       // Frequency array for all lowercase characters
       int[] count = new int[26];
       for (char c : text.toCharArray()) {
           count[c - 'a']++;
       }
       
       // Calculate the minimum number of "balloon" we can form
       int minBalloons = Integer.MAX_VALUE;
       
       // Check against required characters
       minBalloons = Math.min(minBalloons, count['b' - 'a']);
       minBalloons = Math.min(minBalloons, count['a' - 'a']);
       minBalloons = Math.min(minBalloons, count['l' - 'a'] / 2);
       minBalloons = Math.min(minBalloons, count['o' - 'a'] / 2);
       minBalloons = Math.min(minBalloons, count['n' - 'a']);
       
       return minBalloons;
   }
}
```

#### Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the length of the input string; similar to approach 1 but simplified\.
*   **Space Complexity:** O\(1\), as we use a fixed\-size array independent of the input size\.

#### **Example Walkthrough:**

Imagine counting characters in `"loonbalxballpoon"`:

```shell
l → 4
o → 4
b → 2
a → 1
n → 2
```

To form `"balloon"`:

```shell
b: needs 1 → available 2
a: needs 1 → available 1
l: needs 2 → available 4 → 4 / 2 = 2
o: needs 2 → available 4 → 4 / 2 = 2
n: needs 1 → available 2
```

The limiting character is `'a'`, so the maximum balloons = **1**\.

#### [Solve it on LeetCode](https://leetcode.com/problems/maximum-number-of-balloons/)
