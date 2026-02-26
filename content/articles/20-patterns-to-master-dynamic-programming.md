---
title: "20 Patterns to Master Dynamic Programming"
description: "Dynamic Programming (DP) is arguably the most difficult topic for coding interviews."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles/20-patterns-to-master-dynamic-programming.md"
dateModified: "2024-07-28"
datePublished: "2024-07-28"
showOnArticles: true
topics:
  - dsa
---

**Dynamic Programming (DP)**  is arguably the  **most difficult**  topic for coding interviews.

But, like any other topic, the fastest way to learn it is by understanding different  **patterns**  that can help you solve a wide variety of problems.

[![image](https://substack-post-media.s3.amazonaws.com/public/images/3e7e3556-d44e-48b4-80f1-787f73294743_7064x4178.png)](https://substackcdn.com/image/fetch/$s_!t3CU!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F3e7e3556-d44e-48b4-80f1-787f73294743_7064x4178.png)

In this article, I’ll walk you through  **20**   **patterns** that will make learning DP much easier.

I’ll share when to use each pattern and provide links to  **LeetCode**  problems you can practice to learn them better.

I have listed them from easy to hard and also linked resources to learn each pattern.

## **1. Fibonacci Sequence**

[![image](https://substack-post-media.s3.amazonaws.com/public/images/2e6c90e0-e1ab-4295-92ae-e84dfa311088_1768x1652.png)](https://substackcdn.com/image/fetch/$s_!B6N5!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2e6c90e0-e1ab-4295-92ae-e84dfa311088_1768x1652.png)

The  **[Fibonacci sequence](https://en.wikipedia.org/wiki/Fibonacci_sequence)**  pattern is useful when the solution to a problem depends on the solutions of smaller instances of the same problem.

There is a clear recursive relationship, often resembling the classic Fibonacci sequence F(n) = F(n-1) + F(n-2).

#### LeetCode Problems:

- [LeetCode 70: Climbing Stairs](https://leetcode.com/problems/climbing-stairs/description/)
- [LeetCode 509: Fibonacci Number](https://leetcode.com/problems/fibonacci-number/description/)
- [LeetCode 746. Min Cost Climbing Stairs](https://leetcode.com/problems/min-cost-climbing-stairs/description/)

## 2. Kadane's Algorithm

[![image](https://substack-post-media.s3.amazonaws.com/public/images/16ebf522-0166-434d-808f-551672e9bd59_2048x886.png)](https://substackcdn.com/image/fetch/$s_!eo7a!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F16ebf522-0166-434d-808f-551672e9bd59_2048x886.png)

**[Kadane's Algorithm](https://medium.com/@rsinghal757/kadanes-algorithm-dynamic-programming-how-and-why-does-it-work-3fd8849ed73d)**  is primarily used for solving the Maximum Subarray Problem and its variations where the problem asks to optimize a contiguous subarray within a one-dimensional numeric array

#### LeetCode Problems:

- [LeetCode 53: Maximum Subarray](https://leetcode.com/problems/maximum-subarray/description/)
- [LeetCode 918: Maximum Sum Circular Subarray](https://leetcode.com/problems/maximum-sum-circular-subarray/description/)
- [LeetCode 152: Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/description/)

## 3. 0/1 Knapsack

[![image](https://substack-post-media.s3.amazonaws.com/public/images/2202a869-3974-4e9e-8131-b2c2bb581f41_2440x1766.png)](https://substackcdn.com/image/fetch/$s_!m4bn!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F2202a869-3974-4e9e-8131-b2c2bb581f41_2440x1766.png)

The  **[0/1 Knapsack](https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/)**  pattern is useful when:

1. You have a set of items, each with a weight and a value.
2. You need to select a subset of these items.
3. There's a constraint on the total weight (or some other resource) you can use.
4. You want to maximize (or minimize) the total value of the selected items.
5. Each item can be chosen only once (hence the "0/1" - you either take it or you don't).

#### LeetCode Problems:

- [LeetCode 416: Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/description/)
- [LeetCode 494: Target Sum](https://leetcode.com/problems/target-sum/description/)
- [LeetCode 1049. Last Stone Weight II](https://leetcode.com/problems/last-stone-weight-ii/description/)

## 4. Unbounded Knapsack

The  **[Unbounded Knapsack](https://www.geeksforgeeks.org/unbounded-knapsack-repetition-items-allowed/)**  pattern is useful when:

1. You have a set of items, each with a weight and a value.
2. You need to select items to maximize total value.
3. There's a constraint on the total weight (or some other resource) you can use.
4. You can select each item multiple times (unlike 0/1 Knapsack where each item can be chosen only once).
5. The supply of each item is considered infinite.

#### LeetCode Problems:

- [LeetCode 322: Coin Change](https://leetcode.com/problems/coin-change/description/)
- [LeetCode 518: Coin Change 2](https://leetcode.com/problems/coin-change-ii/description/)
- [LeetCode 279. Perfect Squares](https://leetcode.com/problems/perfect-squares/description/)

## 5. Longest Common Subsequence (LCS)

[![image](https://substack-post-media.s3.amazonaws.com/public/images/fd1dc9bd-6284-4ed5-9ab4-f4578516e2b7_2048x1358.png)](https://substackcdn.com/image/fetch/$s_!-0OA!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ffd1dc9bd-6284-4ed5-9ab4-f4578516e2b7_2048x1358.png)

The  **[Longest Common Subsequence](https://www.youtube.com/watch?v=NnD96abizww)**  pattern is useful when you are given two sequences and need to find a subsequence that appears in the same order in both the given sequences.

#### LeetCode Problems:

- [LeetCode 1143: Longest Common Subsequence](https://leetcode.com/problems/longest-common-subsequence/description/)
- [LeetCode 583: Delete Operation for Two Strings](https://leetcode.com/problems/delete-operation-for-two-strings/description/)
- [LeetCode 1092: Shortest Common Supersequence](https://leetcode.com/problems/shortest-common-supersequence/description/)

## 6. Longest Increasing Subsequence (LIS)

[![image](https://substack-post-media.s3.amazonaws.com/public/images/f6c5abaf-00e2-4649-a592-b0776d1fef72_2048x836.png)](https://substackcdn.com/image/fetch/$s_!zYnc!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Ff6c5abaf-00e2-4649-a592-b0776d1fef72_2048x836.png)

The  **[Longest Increasing Subsequence](https://www.youtube.com/watch?v=CE2b_-XfVDk)**  pattern is used to solve problems that involve finding the longest subsequence of elements in a sequence where the elements are in increasing order.

#### LeetCode Problems:

- [LeetCode 300: Longest Increasing Subsequence](https://leetcode.com/problems/longest-increasing-subsequence/description/)
- [LeetCode 673: Number of Longest Increasing Subsequence](https://leetcode.com/problems/number-of-longest-increasing-subsequence/description/)
- [leetCode 354: Russian Doll Envelopes](https://leetcode.com/problems/russian-doll-envelopes/description/)

## 7. Palindromic Subsequence

[![image](https://substack-post-media.s3.amazonaws.com/public/images/340048a6-9e4c-447f-8685-465b44c0e586_1756x1905.png)](https://substackcdn.com/image/fetch/$s_!BdTD!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F340048a6-9e4c-447f-8685-465b44c0e586_1756x1905.png)

The  **[Palindromic Subsequence](https://www.youtube.com/watch?v=bUr8cNWI09Q)**  pattern is used when solving problems that involve finding a subsequence within a sequence (usually a string) that reads the same forwards and backwards.

#### LeetCode Problems:

- [LeetCode 516: Longest Palindromic Subsequence](https://leetcode.com/problems/longest-palindromic-subsequence/description/)
- [LeetCode 647: Palindromic Substrings](https://leetcode.com/problems/palindromic-substrings/description/)
- [LeetCode 1312: Minimum Insertion Steps to Make a String Palindrome](https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/description/)

## 8. Edit Distance

The  **[Edit Distance](https://www.geeksforgeeks.org/edit-distance-dp-5/)**  pattern is used to solve problems that involve transforming one sequence (usually a string) into another sequence using a minimum number of operations.

The allowed operations typically include insertion, deletion, and substitution.

#### LeetCode Problems:

- [LeetCode 72: Edit Distance](https://leetcode.com/problems/edit-distance/description/)
- [LeetCode 583: Delete Operation for Two Strings](https://leetcode.com/problems/delete-operation-for-two-strings/description/)
- [LeetCode 712: Minimum ASCII Delete Sum for Two Strings](https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/description/)

## 9. Subset Sum

The  **[Subset Sum](https://www.youtube.com/watch?v=s6FhG--P7z0)**  pattern is used to solve problems where you need to determine whether a subset of elements from a given set can sum up to a specific target value.

#### LeetCode Problems:

- [LeetCode 416: Partition Equal Subset Sum](https://leetcode.com/problems/partition-equal-subset-sum/description/)
- [LeetCode 494: Target Sum](https://leetcode.com/problems/target-sum/description/)
- [LeetCode 698: Partition to K Equal Sum Subsets](https://leetcode.com/problems/partition-to-k-equal-sum-subsets/)

## 10. String Partition

The  **[String Partition](https://www.youtube.com/watch?v=Sx9NNgInc3A)**  pattern is used to solve problems that involve partitioning a string into smaller substrings that satisfy certain conditions.

It’s useful when:

- You're working with problems involving strings or sequences.
- The problem requires splitting the string into substrings or subsequences.
- You need to optimize some property over these partitions (e.g., minimize cost, maximize value).
- The solution to the overall problem can be built from solutions to subproblems on smaller substrings.
- There's a need to consider different ways of partitioning the string.

#### LeetCode Problems:

- [LeetCode 139: Word Break](https://leetcode.com/problems/word-break/description/)
- [LeetCode 132. Palindrome Partitioning II](https://leetcode.com/problems/palindrome-partitioning-ii/description/)
- [LeetCode 472: Concatenated Words](https://leetcode.com/problems/concatenated-words/description/)

## 11. Catalan Numbers

The  **[Catalan Number](https://en.wikipedia.org/wiki/Catalan_number)**  pattern is used to solve combinatorial problems that can be decomposed into smaller, similar subproblems.

Some of the use-cases of this pattern include:

- Counting the number of  **valid parentheses**  expressions of a given length
- Counting the number of distinct  **binary search trees**  that can be formed with n nodes.
- Counting the number of ways to triangulate a polygon with n+2 sides.

#### LeetCode Problems:

- [LeetCode 96: Unique Binary Search Trees](https://leetcode.com/problems/unique-binary-search-trees/description/)
- [LeetCode 22: Generate Parentheses](https://leetcode.com/problems/generate-parentheses/description/)

## 12. Matrix Chain Multiplication

This pattern is used to solve problems that involve determining the optimal order of operations to minimize the cost of performing a series of operations.

It is based on the popular optimization problem:  **[Matrix Chain Multiplication](https://en.wikipedia.org/wiki/Matrix_chain_multiplication)** .

It’s useful when:

1. You're dealing with a sequence of elements that can be combined pairwise.
2. The cost of combining elements depends on the order of combination.
3. You need to find the optimal way to combine the elements.
4. The problem involves minimizing (or maximizing) the cost of operations of combining the elements.

#### LeetCode Problems:

- [LeetCode 1039: Minimum Score Triangulation of Polygon](https://leetcode.com/problems/minimum-score-triangulation-of-polygon/description/)
- [LeetCode 312: Burst Balloons](https://leetcode.com/problems/burst-balloons/description/)
- [LeetCode 1000: Minimum Cost to Merge Stones](https://leetcode.com/problems/minimum-cost-to-merge-stones/description/)

## 13. Count Distinct Ways

This  **[pattern](https://www.youtube.com/watch?v=6aEyTjOwlJU)**  is useful when:

1. You need to  **count**  the number of different ways to achieve a certain goal or reach a particular state.
2. The problem involves making a series of choices or steps to reach a target.
3. There are multiple valid paths or combinations to reach the solution.
4. The problem can be broken down into smaller subproblems with overlapping solutions.
5. You're dealing with combinatorial problems that ask  **"in how many ways"**  can something be done.

#### LeetCode Problems:

- [LeetCode 91: Decode Ways](https://leetcode.com/problems/decode-ways/description/)
- [LeetCode 2266. Count Number of Texts](https://leetcode.com/problems/count-number-of-texts/description/)

## 14. DP on Grids

[![image](https://substack-post-media.s3.amazonaws.com/public/images/e1678d80-f4fc-4d78-938a-d30f3d0d0343_1832x1726.png)](https://substackcdn.com/image/fetch/$s_!SkzX!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fe1678d80-f4fc-4d78-938a-d30f3d0d0343_1832x1726.png)

The  **[DP on Grids](https://www.youtube.com/watch?v=sdE0A2Oxofw)**  pattern is used to solve problems that involve navigating or optimizing paths within a grid (2D array).

For these problems, you need to consider multiple directions of movement (e.g., right, down, diagonal) and solution at each cell depends on the solutions of neighboring cells.

#### LeetCode Problems:

- [LeetCode 62: Unique Paths](https://leetcode.com/problems/unique-paths/description/)
- [LeetCode 64: Minimum Path Sum](https://leetcode.com/problems/minimum-path-sum/description/)
- [LeetCode 329. Longest Increasing Path in a Matrix](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/description/)

## 15. DP on Trees

The  **[DP on Trees](https://codeforces.com/blog/entry/20935)**  pattern is useful when:

1. You're working with tree-structured data represented by nodes and edges.
2. The problem can be broken down into solutions of subproblems that are themselves tree problems.
3. The problem requires making decisions at each node that affect its children or parent.
4. You need to compute values for nodes based on their children or ancestors.

#### LeetCode Problems:

- [LeetCode 337: House Robber III](https://leetcode.com/problems/house-robber-iii/description/)
- [LeetCode 124: Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/description/)
- [LeetCode 968: Binary Tree Cameras](https://leetcode.com/problems/binary-tree-cameras/description/)

## 16. DP on Graphs

The **[DP on Graphs](https://medium.com/@logicdevildotcom/dynamic-programming-applied-to-graphs-f33b6b8a8247)** pattern is useful when:

1. You're dealing with problems involving graph structures.
2. The problem requires finding optimal paths, longest paths, cycles, or other optimized properties on graphs.
3. You need to compute values for nodes or edges based on their neighbors or connected components.
4. The problem involves traversing a graph while maintaining some state.

#### LeetCode Problems:

- [LeetCode 787: Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/description/)
- [LeetCode 1334. Find the City With the Smallest Number of Neighbors at a Threshold Distance](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/description/)

## 17. Digit DP

The  **[Digit DP Pattern](https://www.geeksforgeeks.org/digit-dp-introduction/)**  is useful when:

1. You're dealing with problems involving counting or summing over a range of numbers.
2. The problem requires considering the digits of numbers individually.
3. You need to find patterns or properties related to the digits of numbers within a range.
4. The range of numbers is large (often up to 10^18 or more), making brute force approaches infeasible.
5. The problem involves constraints on the digits.

#### LeetCode Problems:

- [LeetCode 357: Count Numbers with Unique Digits](https://leetcode.com/problems/count-numbers-with-unique-digits/description/)
- [LeetCode 233: Number of Digit One](https://leetcode.com/problems/number-of-digit-one/description/)
- [LeetCode 902. Numbers At Most N Given Digit Set](https://leetcode.com/problems/numbers-at-most-n-given-digit-set/description/)

## 18. Bitmasking DP

The  **[Bitmasking DP pattern](https://www.hackerearth.com/practice/algorithms/dynamic-programming/bit-masking/tutorial/)**  is used to solve problems that involve a large number of  **states**  or  **combinations** , where each state can be efficiently represented using  **bits**  in an integer.

It’s particularly useful when:

1. You're dealing with problems involving  **subsets**  or  **combinations**  of elements.
2. The total number of elements is relatively small (typically <= 20-30).
3. You need to efficiently represent and manipulate sets of elements.
4. The problem involves making decisions for each element (include/exclude) or tracking visited/unvisited states.
5. You want to optimize space usage in DP solutions.

#### LeetCode Problems:

- [LeetCode 1986: Minimum Number of Work Sessions to Finish the Tasks](https://leetcode.com/problems/minimum-number-of-work-sessions-to-finish-the-tasks/description/)
- [LeetCode 2305. Fair Distribution of Cookies](https://leetcode.com/problems/fair-distribution-of-cookies/description/)
- [LeetCode 847: Shortest Path Visiting All Nodes](https://leetcode.com/problems/shortest-path-visiting-all-nodes/description/)

## 19. Probability DP

This pattern is useful when:

1. You're dealing with problems involving probability calculations.
2. The probability of a state depends on the probabilities of previous states.
3. You need to calculate the expected value of an outcome.
4. The problem involves random processes or games of chance.

#### LeetCode Problems:

- [LeetCode 688: Knight Probability in Chessboard](https://leetcode.com/problems/knight-probability-in-chessboard/description/)
- [LeetCode 808: Soup Servings](https://leetcode.com/problems/soup-servings/description/)
- [LeetCode 837. New 21 Game](https://leetcode.com/problems/new-21-game/description/)

## 20. State Machine DP

The  **[State Machine DP Pattern](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/solutions/108870/most-consistent-ways-of-dealing-with-the-series-of-stock-problems/)**  is useful when when:

1. The problem can be modeled as a series of states and transitions between these states.
2. There are clear rules for moving from one state to another.
3. The optimal solution depends on making the best sequence of state transitions.
4. The problem involves making decisions that affect future states.
5. There's a finite number of possible states, and each state can be clearly defined.

#### LeetCode Problems:

- [LeetCode 309: Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/description/)
- [LeetCode 123: Best Time to Buy and Sell Stock III](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/description/)


Thank you so much for reading. If you found it valuable, consider subscribing for more such content every week. If you have any questions or suggestions, please email me your comments or feel free to improve it.
