---
title: Decode Ways
description: Master Decode Ways in the Dynamic Programming module. Comprehensive
  guide and algorithmic problem solving.
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

You have intercepted a secret message encoded as a string of numbers\. The message is **decoded** via the following mapping:

`"1" -> 'A'``"2" -> 'B'``...``"25" -> 'Y'``"26" -> 'Z'`

However, while decoding the message, you realize that there are many different ways you can decode the message because some codes are contained in other codes \(`"2"` and `"5"` vs `"25"`\)\.

For example, `"11106"` can be decoded into:

*   `"AAJF"` with the grouping `(1, 1, 10, 6)`
*   `"KJF"` with the grouping `(11, 10, 6)`
*   The grouping `(1, 11, 06)` is invalid because `"06"` is not a valid code \(only `"6"` is valid\)\.

Note: there may be strings that are impossible to decode\.Given a string s containing only digits, return the **number of ways** to **decode** it\. If the entire string cannot be decoded in any valid way, return `0`\.

The test cases are generated so that the answer fits in a **32\-bit** integer\.

##### **Example 1:**

**Input:** s = "12"

**Output:** 2

**Explanation:**

"12" could be decoded as "AB" \(1 2\) or "L" \(12\)\.

##### **Example 2:**

**Input:** s = "226"

**Output:** 3

**Explanation:**

"226" could be decoded as "BZ" \(2 26\), "VF" \(22 6\), or "BBF" \(2 2 6\)\.

##### **Example 3:**

**Input:** s = "06"

**Output:** 0

**Explanation:**

"06" cannot be mapped to "F" because of the leading zero \("6" is different from "06"\)\. In this case, the string is not a valid encoding, so return 0\.

##### **Constraints:**

*   `1 <= s.length <= 100`
*   `s` contains only digits and may contain leading zero\(s\)\.

#### [Solve it on LeetCode](https://leetcode.com/problems/decode-ways)

# Approaches

## 1\. Recursive Approach

The recursive approach attempts to solve the problem by considering each character individually and tries to decode either one or two characters at a time\. This explores all possible combinations leading to a solution\.

#### **Intuition:**

*   If we encounter a single character from '1' to '9', it can be decoded to a letter from 'A' to 'I'\.
*   A pair of characters from '10' to '26' can be decoded into a letter from 'J' to 'Z'\.
*   We return 0 if the current character is '0' because it doesn't map to any letter directly\.
*   For each character, recursively calculate the number of ways to decode the subsequent string\.

#### Code:

Java

```java
class DecodeWaysRecursive {
   public int numDecodings(String s) {
       return decode(s, 0);
   }

   private int decode(String s, int index) {
       if (index == s.length()) {
           return 1; // Reached the end successfully
       }
       if (s.charAt(index) == '0') {
           return 0; // '0' can't be decoded
       }

       // Take one character and move to the next
       int ways = decode(s, index + 1);
       
       // Take two characters and ensure it's valid from '10' to '26'
       if (index + 1 < s.length() && 
           (s.charAt(index) == '1' || (s.charAt(index) == '2' && s.charAt(index + 1) <= '6'))) {
           ways += decode(s, index + 2);
       }
       
       return ways;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(2^N\), where \(N\) is the length of the string due to the branching at each step\.
*   **Space Complexity:** O\(N\) due to the recursion stack\.

## 2\. Memoization Approach

The memoization approach is an optimization over the recursive approach where we store the results of subproblems to avoid redundant calculations\.

#### **Intuition:**

*   We use an array to store results of previously computed indices, avoiding recalculations and reducing time complexity\.
*   Similar recursive structure, but check the memoized results before computing\.

#### Code:

Java

```java
class Solution {
   private Map<Integer, Integer> memo = new HashMap<>();

   public int numDecodings(String s) {
       return decode(s, 0);
   }

   private int decode(String s, int index) {
       if (index == s.length()) {
           return 1; // Reached the end successfully
       }
       if (s.charAt(index) == '0') {
           return 0; // '0' can't be decoded
       }
       if (memo.containsKey(index)) {
           return memo.get(index);
       }

       int ways = decode(s, index + 1);
       if (index + 1 < s.length() &&
           (s.charAt(index) == '1' || (s.charAt(index) == '2' && s.charAt(index + 1) <= '6'))) {
           ways += decode(s, index + 2);
       }
       
       memo.put(index, ways);
       return ways;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\), due to storing results and avoiding recomputation\.
*   **Space Complexity:** O\(N\), both for the recursion stack and memoization map\.

## 3\. Dynamic Programming Approach

The DP approach builds from the bottom up, filling an array where each position represents the number of ways to decode up to that point\.

#### **Intuition:**

*   Use a `dp` array where `dp[i]` stores the count of decode ways up to index `i`\.
*   Initialize `dp[0]` to `1` as the base case \(empty string\)\.
*   Iterate through the string, filling `dp` based on allowable single and double character decodings\.

#### Code:

Java

```java
class Solution {
   public int numDecodings(String s) {
       if (s == null || s.length() == 0 || s.charAt(0) == '0') return 0;

       int n = s.length();
       int[] dp = new int[n + 1];
       dp[0] = 1; // Base case: an empty string has one decode way
       
       for (int i = 1; i <= n; i++) {
           // Can the current single digit be decoded?
           if (s.charAt(i - 1) != '0') {
               dp[i] += dp[i - 1];
           }

           // Can the two-character string be decoded?
           if (i > 1 && (s.charAt(i - 2) == '1' || 
                        (s.charAt(i - 2) == '2' && s.charAt(i - 1) <= '6'))) {
               dp[i] += dp[i - 2];
           }
       }
       
       return dp[n];
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(N\), iterating through the string once\.
*   **Space Complexity:** O\(N\), for the `dp` array\.