---
title: Combination Sum II
description: Master Combination Sum II in the Recursion & Backtracking module.
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

Given a collection of candidate numbers \(`candidates`\) and a target number \(`target`\), find all unique combinations in `candidates` where the candidate numbers sum to `target`\.

Each number in `candidates` may only be used **once** in the combination\.

**Note:** The solution set must not contain duplicate combinations\.

##### **Example 1:**

**Input:** candidates = \[10,1,2,7,6,1,5\], target = 8

**Output:** \[\[1,1,6\],\[1,2,5\],\[1,7\],\[2,6\]\]

##### **Example 2:**

**Input:** candidates = \[2,5,2,1,2\], target = 5

**Output:** \[\[1,2,2\],\[5\]\]

##### **Constraints:**

*   `1 <= candidates.length <= 100`
*   `1 <= candidates[i] <= 50`
*   `1 <= target <= 30`

#### [Solve it on LeetCode](https://leetcode.com/problems/combination-sum-ii)

# Approaches

## 1\. Backtracking with Sorting and Skip Duplicates

#### Intuition:

The problem is to find all unique combinations of numbers that add up to a given target\. Each number in the array can be used only once\. For this, we can use a backtracking approach\. First, we sort the array to make it easier to handle duplicates and to potentially stop early when the remaining candidates are all larger than the target left to achieve\. By sorting, we also ensure that duplicates are adjacent, which allows us to easily skip over them\.

#### Steps:

1.  **Sort the Array**: Sorting helps in quickly identifying and skipping duplicates\.
2.  Use a helper function to recursively build possible combinations\.
3.  If the target equals zero, add the current combination to the results\.
4.  If the target goes below zero, exit this path as it cannot produce a valid result\.
5.  Iterate through the candidates:

*   Skip duplicate elements by checking if the current element is the same as the previous one \(to prevent duplicate combinations\)\.
*   Make a recursive call to include the current element and reduce the target by its value\.
*   Backtrack by removing the last added element from the current combination\.

#### Code:

Java

```java
class Solution {
   public List<List<Integer>> combinationSum2(int[] candidates, int target) {
       List<List<Integer>> results = new ArrayList<>();
       Arrays.sort(candidates); // Sort to handle duplicates
       backtrack(results, new ArrayList<>(), candidates, target, 0);
       return results;
   }

   private void backtrack(List<List<Integer>> results, List<Integer> currentCombination, int[] candidates, int target, int start) {
       if (target == 0) {
           results.add(new ArrayList<>(currentCombination));
           return;
       }

       for (int i = start; i < candidates.length; i++) {
           // If the value is greater than the remaining target, break the loop (because later values will be larger)
           if (candidates[i] > target) break;

           // Skip duplicates
           if (i > start && candidates[i] == candidates[i - 1]) continue;

           // Include candidates[i] in the combination
           currentCombination.add(candidates[i]);
           // Explore further with reduced target and next start index
           backtrack(results, currentCombination, candidates, target - candidates[i], i + 1);
           // Backtrack by removing candidates[i]
           currentCombination.remove(currentCombination.size() - 1);
       }
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(2^n\), where n is the number of candidates\. In the worst case, to explore all subsets\.
*   **Space Complexity:** O\(target\), for the recursion stack\.

## 2\. Backtracking Optimized with Early Exit

#### Intuition:

This approach is similar to Approach 1 but adds a further optimization to stop early in the loop\. By stopping early once we encounter candidates larger than the current remaining target \(after checking the first element due to sorted order\), we avoid unnecessary recursive calls\.

#### Steps:

*   The structure of the function remains largely the same as Approach 1\.
*   The critical change is in the loop where we stop iterating over candidates as soon as we find one greater than the remaining target\.

#### Code:

Java

```java
class Solution {
   public List<List<Integer>> combinationSum2(int[] candidates, int target) {
       List<List<Integer>> results = new ArrayList<>();
       Arrays.sort(candidates);
       backtrack(results, new ArrayList<>(), candidates, target, 0);
       return results;
   }

   private void backtrack(List<List<Integer>> results, List<Integer> currentCombination, int[] candidates, int target, int start) {
       if (target == 0) {
           results.add(new ArrayList<>(currentCombination));
           return;
       }

       for (int i = start; i < candidates.length; i++) {
           // Early stopping if current candidate > remaining target
           if (candidates[i] > target) break;
           
           if (i > start && candidates[i] == candidates[i - 1]) continue;

           currentCombination.add(candidates[i]);
           backtrack(results, currentCombination, candidates, target - candidates[i], i + 1);
           currentCombination.remove(currentCombination.size() - 1);
       }
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(2^n\), primarily dictated by the number of subsets explored\.
*   **Space Complexity:** O\(target\) due to the recursion stack\.