---
title: Repeated String Match
description: Master Repeated String Match in the Advanced Topics module.
  Comprehensive guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

# Problem Description

Question

Given two strings `a` and `b`, return _the minimum number of times you should repeat string_ `a` _so that string_ `b` _is a substring of it_\. If it is impossible for `b`​​​​​​ to be a substring of `a` after repeating it, return `-1`\.

**Notice:** string `"abc"` repeated 0 times is `""`, repeated 1 time is `"abc"` and repeated 2 times is `"abcabc"`\.

##### **Example 1:**

**Input:** a = "abcd", b = "cdabcdab"

**Output:** 3

**Explanation:** We return 3 because by repeating a three times "ab**cdabcdab**cd", b is a substring of it\.

##### **Example 2:**

**Input:** a = "a", b = "aa"

**Output:** 2

**Constraints:**

*   **1 <= a\.length, b\.length <= 10****4**
*   `a` and `b` consist of lowercase English letters\.

#### [Solve it on LeetCode](https://leetcode.com/problems/repeated-string-match)

# Approaches

## 1\. Brute Force

#### Intuition:

The problem requires us to determine the minimum number of times string `A` has to be repeated such that `B` is a substring of it\. A brute force solution involves repeatedly appending `A` to itself until `B` becomes a substring or we surpass a certain reasonable limit\.

#### Steps:

1.  Start by observing that if the answer exists, the number of times we need to repeat `A` is at least `|B|/|A|` \(integer division\) and at most `|B|/|A| + 2`\.
2.  The reasoning behind the upper bound is that `B` can start appearing mid\-way within one of the copies of `A` which might require one or two more copies of `A` to cover whole of `B`\.
3.  Create a repeated string starting from a single `A`, and keep appending `A` to this string\.
4.  For each iteration, check if `B` is a substring of the current repeated string\.
5.  If `B` is found, return the count of repetitions\. If after `|B|/|A| + 2` repetitions `B` is not found, return \-1\.

#### Code:

Java

```java
class Solution {
   public int repeatedStringMatch(String A, String B) {
       StringBuilder repeatedA = new StringBuilder();
       int count = 0;
       
       // Repeat A enough times to make it at least as long as B initially
       while (repeatedA.length() < B.length()) {
           repeatedA.append(A);
           count++;
       }
       
       // Check if B is the substring of the current repeated A
       if (repeatedA.toString().contains(B)) {
           return count;
       }
       
       // Append one more A and check again
       repeatedA.append(A);
       count++;
       
       // Final check
       if (repeatedA.toString().contains(B)) {
           return count;
       }
       
       // If not found in both checks, return -1
       return -1;
   }
}
```

Complexity Analysis

*   **Time Complexity**: O\(N \* M\), where `N` is the length of `A` and `M` is the length of `B`\. This is due to the substring search operation\.
*   **Space Complexity**: O\(N \* M\), due to repeated string storage\.

## 2\. Optimal String Concatenation

#### Intuition:

The brute force solution already works fairly efficiently for most reasonable input sizes\. However, we can optimize the repeated string construction and search process slightly using intuitive bounds\.

#### Steps:

1.  Start by computing the minimum repetitions required using `ceil(|B|/|A|)`, which can be done using `(B.length() + A.length() - 1) / A.length()`\.
2.  Instead of constructing the repeated string each time from scratch, directly compute this base repeated string\.
3.  Append one more `A` to handle boundary conditions\.
4.  Check if `B` is a substring after `minRepeats` and `minRepeats + 1` repetitions and return the respective count if true\.
5.  Return \-1 if `B` is not a substring in both checks\.

#### Code:

Java

```java
class Solution {
   public int repeatedStringMatch(String A, String B) {
       int minRepeats = (B.length() + A.length() - 1) / A.length();
       StringBuilder repeatedA = new StringBuilder(A.repeat(minRepeats));
       
       if (repeatedA.toString().contains(B)) {
           return minRepeats;
       }
       
       repeatedA.append(A);
       if (repeatedA.toString().contains(B)) {
           return minRepeats + 1;
       }
       
       return -1;
   }
}
```

Complexity Analysis

*   **Time Complexity**: O\(N \+ M\), where `N` is the length of `A` and `M` is the length of `B`\. This comes from building the string and subsequent substring check\.
*   **Space Complexity**: O\(N \+ M\), due to storage of the repeated string\.