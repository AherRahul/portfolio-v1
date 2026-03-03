---
title: Russian Doll Envelopes
description: Master Russian Doll Envelopes in the Dynamic Programming module.
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

You are given a 2D array of integers `envelopes` where **envelopes\[i\] = \[w****i****, h****i****\]** represents the width and the height of an envelope\.

One envelope can fit into another if and only if both the width and height of one envelope are greater than the other envelope's width and height\.

Return _the maximum number of envelopes you can Russian doll \(i\.e\., put one inside the other\)_\.

**Note:** You cannot rotate an envelope\.

##### **Example 1:**

**Input:** envelopes = \[\[5,4\],\[6,4\],\[6,7\],\[2,3\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">5</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">6</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">4</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">6</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">7</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">2</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">3</span></div>
    </div>
  </div>
</div>

**Output:** 3

**Explanation:** The maximum number of envelopes you can Russian doll is `3` \(\[2,3\] => \[5,4\] => \[6,7\]\)\.

##### **Example 2:**

**Input:** envelopes = \[\[1,1\],\[1,1\],\[1,1\]\]

<div class="arr-viz-wrapper">
  <div class="arr-viz-grid">
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
    <div class="arr-viz-grid-row">
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
      <div class="arr-cell arr-cell--grid arr-cell--filled"><span class="arr-val">1</span></div>
    </div>
  </div>
</div>

**Output:** 1

##### **Constraints:**

*   **1 <= envelopes\.length <= 10****5**
*   **envelopes\[i\]\.length == 2**
*   **1 <= w****i****, h****i** **<= 10****5**


## Approaches

### 1\. Dynamic Programming

#### Intuition:

The problem resembles the "Longest Increasing Subsequence" \(LIS\) problem\. The main challenge is to properly define when one envelope can fit into another\. An envelope `(w1, h1)` can fit into another envelope `(w2, h2)` if both `w1 < w2` and `h1 < h2`\.

Dynamic programming can be used by sorting the envelopes based on width, and then computing the LIS based on the height of envelopes such that previous envelopes' width and height are both less than the current one\.

#### Steps:

1.  Sort the envelopes by width\. If two envelopes have the same width, sort by height in descending order to avoid putting envelopes of the same width one inside the other\.
2.  Use dynamic programming to find the longest increasing subsequence of heights\.

#### Code:

#### Complexity Analysis

*   **Time Complexity:** O\(n^2\) due to the double iteration to find the LIS\.
*   **Space Complexity:** O\(n\) for the `dp` array\.

### 2\. Sort and Longest Increasing Subsequence \(LIS\)

#### Intuition:

Leverage the fact that when width is sorted, the problem simplifies to finding the LIS based on height\. By sorting the second criteria \(height\) in descending order when widths are equal, we ensure no two envelopes of the same width contribute to the LIS\.

Use a more optimal approach with a binary search to find the correct position of each height in the constructed LIS\.

#### Steps:

1.  Sort envelopes based on width in ascending order, and height in descending order when widths are equal\.
2.  Use the LIS approach with binary search to efficiently build the subsequence\.

#### Code:

#### Complexity Analysis

*   **Time Complexity:** O\(n log n\) for sorting and binary search operations\.
*   **Space Complexity:** O\(n\) for storing the LIS\.

#### [Solve it on LeetCode](https://leetcode.com/problems/russian-doll-envelopes)
