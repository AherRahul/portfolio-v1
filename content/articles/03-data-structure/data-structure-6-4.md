---
title: "Maximum Subarray Sum"
description: "Find the subarray with maximum sum using Kadane's algorithm. Master the most elegant dynamic programming technique for array problems."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Maximum Subarray Sum
----------------------------

### Problem Statement:

Given an array `A` of integers, find the contiguous subarray with the largest sum.

### Examples:

#### Example 1:

**Input:** A = [-2, 1, -3, 4, -1, 2, 1, -5, 4]

**Output:** 6

**Explanation:** Subarray [4, -1, 2, 1] has sum = 6

#### Example 2:

**Input:** A = [1, 2, 3, -2, 5]

**Output:** 9

### Approach:

**Kadane's Algorithm:** Track current sum and max sum. If current becomes negative, reset to 0.

### Time Complexity:

* **Time = O(N)**, **Space = O(1)**

### JavaScript Code:

```javascript
function maxSubarraySum(A) {
    let maxSum = A[0];
    let currentSum = A[0];
    
    for (let i = 1; i < A.length; i++) {
        currentSum = Math.max(A[i], currentSum + A[i]);
        maxSum = Math.max(maxSum, currentSum);
    }
    
    return maxSum;
}
```

### Key Takeaways:

1. **Kadane's algorithm** is optimal O(N) solution.
2. At each position, decide: start fresh or continue.
3. Track both current and maximum sums.
4. Classic dynamic programming problem.
5. One of most important array algorithms.

