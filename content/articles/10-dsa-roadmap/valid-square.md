---
title: Valid Square
description: Master Valid Square in the Maths / Geometry module. Comprehensive
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

Given the coordinates of four points in 2D space `p1`, `p2`, `p3` and `p4`, return `true` _if the four points construct a square_\.

The coordinate of a point `p``i` is represented as **\[x****i****, y****i****\]**\. The input is **not** given in any order\.

A **valid square** has four equal sides with positive length and four equal angles \(90\-degree angles\)\.

##### **Example 1:**

**Input:** p1 = \[0,0\], p2 = \[1,1\], p3 = \[1,0\], p4 = \[0,1\]

**Output:** true

##### **Example 2:**

**Input:** p1 = \[0,0\], p2 = \[1,1\], p3 = \[1,0\], p4 = \[0,12\]

**Output:** false

##### **Example 3:**

**Input:** p1 = \[1,0\], p2 = \[\-1,0\], p3 = \[0,1\], p4 = \[0,\-1\]

**Output:** true

##### **Constraints:**

*   **p1\.length == p2\.length == p3\.length == p4\.length == 2**
*   **\-10****4** **<= x****i****, y****i** **<= 10****4**

#### [Solve it on LeetCode](https://leetcode.com/problems/valid-square)

# Approaches

## 1\. Brute Force

#### Intuition:

The problem of detecting whether four points can form a square boils down to ensuring that there are two unique distances: the side of the square and the diagonal \(which is the hypotenuse of the two sides of a right angle triangle formed by two consecutive sides\)\.

For four points to form a square:

*   The shortest distances \(there should be 4 of them\) are the sides of the square\.
*   The longest distances \(there should be 2 of them\) are the diagonals\.

To solve this brute force, we calculate the distance between each pair of given points and then check the distribution of these distances\.

#### Code:

Java

```java
class Solution {
   public boolean validSquare(int[] p1, int[] p2, int[] p3, int[] p4) {
       // Use a set to store the unique squared distances.
       Set<Integer> distances = new HashSet<>();
       
       // Calculate the squared distances between all pairs of points.
       distances.add(distanceSquared(p1, p2));
       distances.add(distanceSquared(p1, p3));
       distances.add(distanceSquared(p1, p4));
       distances.add(distanceSquared(p2, p3));
       distances.add(distanceSquared(p2, p4));
       distances.add(distanceSquared(p3, p4));
       
       // For a valid square, there should be exactly 2 distinct distances:
       // - The side (occurs 4 times)
       // - The diagonal (occurs 2 times)
       return distances.size() == 2 && !distances.contains(0);
   }

   private int distanceSquared(int[] p1, int[] p2) {
       // Calculate the squared Euclidean distance.
       return (p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]);
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(1\)\. Simple calculations with a constant amount of data \(fixed number of operations for distance calculation\)\.
*   **Space Complexity:** O\(1\)\. A constant number of data structures used\.

## 2\. Sorting and Comparison

#### Intuition:

We can simplify the check by sorting the points and then analyzing the ordered sequence of distances\. The key observation is:

*   If you sort points based on their x\-coordinate \(and secondarily upon y\-coordinate if x's are equal\), a square’s points will have inherent order allowing easy direct pairwise comparison\.

We can calculate squared distances from a fixed reference, then check fixed positions' conditions of distances\.

#### Code:

Java

```java
class Solution {
   public boolean validSquare(int[] p1, int[] p2, int[] p3, int[] p4) {
       // Create an array of the points for easy sorting by their coordinates.
       int[][] points = {p1, p2, p3, p4};
       
       // Sort points by x-coordinate, and by y if the x's are the same.
       Arrays.sort(points, new Comparator<int[]>() {
           public int compare(int[] a, int[] b) {
               if (a[0] != b[0]) {
                   return a[0] - b[0];
               }
               return a[1] - b[1];
           }
       });
       
       // After sorting, check the properties of the square by calculating distances.
       return distanceSquared(points[0], points[1]) == distanceSquared(points[1], points[3]) &&
              distanceSquared(points[1], points[3]) == distanceSquared(points[3], points[2]) &&
              distanceSquared(points[0], points[2]) == distanceSquared(points[1], points[3]) &&
              distanceSquared(points[0], points[3]) == distanceSquared(points[1], points[2]) &&
              distanceSquared(points[0], points[1]) > 0;
   }

   private int distanceSquared(int[] p1, int[] p2) {
       return (p1[0] - p2[0]) * (p1[0] - p2[0]) + (p1[1] - p2[1]) * (p1[1] - p2[1]);
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(1\), primarily due to the fixed nature of point sorting and distance parsing, despite operationally implementing a constant array flow\.
*   **Space Complexity:** O\(1\), since limited data\-consuming structures are wielded\.