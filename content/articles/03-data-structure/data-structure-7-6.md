---
title: "Max Sum Contiguous Subarray"
description: "Find maximum sum of contiguous subarray using Kadane's algorithm. Master the most important subarray algorithm."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Max Sum Contiguous Subarray
----------------------------

### Problem Statement:

Find the contiguous subarray with maximum sum in an integer array.

### Examples:

#### Example 1:

**Input:** A = [-2,1,-3,4,-1,2,1,-5,4]

**Output:** 6

**Explanation:** Subarray [4,-1,2,1] has largest sum = 6

### Approach:

Kadane's Algorithm: Track current and max sum.

### Time Complexity:

* **Time = O(N)**, **Space = O(1)**

### JavaScript Code:

```javascript
function maxSubArray(A) {
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

1. Kadane's algorithm is optimal O(N).
2. Dynamic programming approach.
3. At each step: start fresh or continue.
4. One of most important array algorithms.
5. Foundation for many DP problems.

