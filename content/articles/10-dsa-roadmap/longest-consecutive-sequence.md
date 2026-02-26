---
title: Longest Consecutive Sequence
description: Master Longest Consecutive Sequence in the Hash Tables module.
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

Given an unsorted array of integers `nums`, return _the length of the longest consecutive elements sequence\._

You must write an algorithm that runs in `O(n)` time\. 

##### **Example 1:**

Input:nums=\[100,4,200,1,3,2\]

0

100

1

4

2

200

3

1

4

3

5

2

Output:4

4

**Explanation:** The longest consecutive elements sequence is `[1, 2, 3, 4]`\. Therefore its length is 4\.

##### **Example 2:**

Input:nums=\[0,3,7,2,5,8,4,6,1\]

0

0

1

3

2

7

3

2

4

5

5

8

6

4

7

6

8

1

Output:9

9

##### **Example 3:**

Input:nums=\[1,0,1,2\]

0

1

1

0

2

1

3

2

Output:3

3

##### **Constraints:**

*   **0 <= nums\.length <= 10****5**
*   **\-10****9** **<= nums\[i\] <= 10****9**

#### [Solve it on LeetCode](https://leetcode.com/problems/longest-consecutive-sequence)

# Approaches

## 1\. Sorting

#### **Intuition:**

The simplest way to find the longest consecutive sequence is to first sort the array\. Once sorted, a consecutive sequence will appear as continuous numbers in the array\. We can then iterate through the sorted array to count the lengths of consecutive sequences and return the length of the longest one\.

1.  **Sort the Array**: Sorting the array costs O\(n log n\) time\.
2.  **Initialize counters**: Use `currentStreak` to keep track of the streak length, and `longestStreak` to store the maximum length\.
3.  **Iterate through the Array**:

*   Continue the streak if consecutive numbers are found\.
*   Reset `currentStreak` if a gap is found\.

5.  **Return the longest streak**\.

#### Code:

Java

```java
class Solution {
   public int longestConsecutive(int[] nums) {
       if (nums.length == 0) return 0;

       Arrays.sort(nums);

       int longestStreak = 1;
       int currentStreak = 1;

       for (int i = 1; i < nums.length; i++) {
           // if the current element is identical to the previous,
           // just continue through the iteration
           if (nums[i] == nums[i - 1]) {
               continue;
           }
           // check for consecutive sequence
           if (nums[i] == nums[i - 1] + 1) {
               currentStreak += 1;
           } else {
               longestStreak = Math.max(longestStreak, currentStreak);
               currentStreak = 1;
           }
       }
       return Math.max(longestStreak, currentStreak);
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n log n\), where n is the length of the array due to sorting\.
*   **Space Complexity:** O\(1\), apart from the input array storage\.

## 2\. HashSet and Intelligent Search

#### **Intuition:**

We can leverage a `HashSet` to eliminate duplicates and achieve O\(n\) complexity for finding consecutive sequences by only attempting to build from numbers that are not part of any smaller sequence\.

1.  **Add numbers to HashSet**: This allows constant\-time lookups\.
2.  **Iterate over the Set**:

*   For each number, check if it is the start of a sequence\.
*   Calculate the length of that sequence by incrementing and checking the presence of subsequent numbers\.

4.  **Track the maximum sequence length**\.

#### Code:

Java

```java
class Solution {
   public int longestConsecutive(int[] nums) {
       if (nums.length == 0) return 0;

       Set<Integer> numSet = new HashSet<>();
       for (int num : nums) {
           numSet.add(num);
       }

       int longestStreak = 0;

       for (int num : numSet) {
           // Check if num is the beginning of a sequence
           if (!numSet.contains(num - 1)) {
               int currentNum = num;
               int currentStreak = 1;

               // Increment currentNum to count the length of sequence
               while (numSet.contains(currentNum + 1)) {
                   currentNum += 1;
                   currentStreak += 1;
               }

               longestStreak = Math.max(longestStreak, currentStreak);
           }
       }
       return longestStreak;
   }
}
```

Complexity Analysis

*   **Time Complexity:** O\(n\), where n is the length of the array due to one pass through the elements and constant time lookups\.
*   **Space Complexity:** O\(n\), because of the space used by the HashSet\.

## 3\. Union\-Find

#### **Intuition:**

We can use the union\-find data structure to connect numbers that are part of consecutive sequences\. Each element is a node, and paths connect consecutive numbers\. Using path compression and union, we can efficiently find the size of the largest connected component, which corresponds to the longest sequence\.

1.  **Initialization**: Treat each element in the array as its own set\.
2.  **Union by Rank**: Connect consecutive numbers\.
3.  **Find the maximum component size**\.

#### Code:

Java

```java
class Solution {
   public int longestConsecutive(int[] nums) {
       if (nums.length == 0) return 0;

       Map<Integer, Integer> parent = new HashMap<>();
       for (int num : nums) {
           parent.put(num, num);
       }

       Map<Integer, Integer> rank = new HashMap<>();
       for (int num : nums) {
           rank.put(num, 1);
       }

       for (int num : nums) {
           if (parent.containsKey(num - 1)) {
               union(num, num - 1, parent, rank);
           }
           if (parent.containsKey(num + 1)) {
               union(num, num + 1, parent, rank);
           }
       }

       int maxStreak = 0;
       for (int num : parent.keySet()) {
           if (find(num, parent) == num) {
               maxStreak = Math.max(maxStreak, rank.get(num));
           }
       }

       return maxStreak;
   }

   private int find(int num, Map<Integer, Integer> parent) {
       if (parent.get(num) != num) {
           parent.put(num, find(parent.get(num), parent));
       }
       return parent.get(num);
   }

   private void union(int num1, int num2, Map<Integer, Integer> parent, Map<Integer, Integer> rank) {
       int root1 = find(num1, parent);
       int root2 = find(num2, parent);

       if (root1 != root2) {
           if (rank.get(root1) > rank.get(root2)) {
               parent.put(root2, root1);
               rank.put(root1, rank.get(root1) + rank.get(root2));
           } else {
               parent.put(root1, root2);
               rank.put(root2, rank.get(root1) + rank.get(root2));
           }
       }
   }
}
```

Complexity Analysis

*   **Time Complexity:** Approximately O\(n\), taking into account the inverse Ackermann function in the union\-find operations\.
*   **Space Complexity:** O\(n\), for the storage in the parent and rank maps\.