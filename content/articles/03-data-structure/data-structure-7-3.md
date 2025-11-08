---
title: "Maximum Subarray Sum of Fixed Length"
description: "Find maximum sum among all subarrays of given length using sliding window. Master the fixed window maximum pattern."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Maximum Subarray Sum of Fixed Length
----------------------------

### Problem Statement:

Given array `A` and integer `K`, find the maximum sum among all subarrays of length `K`.

### Examples:

#### Example 1:

**Input:** A = [1,2,3,4,5], K = 3

**Output:** 12

**Explanation:** Subarray [3,4,5] has maximum sum 12

### Approach:

Sliding window: compute first window sum, then slide and update.

### Time Complexity:

* **Time = O(N)**, **Space = O(1)**

### JavaScript Code:

```javascript
function maxSumSubarray(A, K) {
    let sum = 0;
    for (let i = 0; i < K; i++) {
        sum += A[i];
    }
    
    let maxSum = sum;
    
    for (let i = K; i < A.length; i++) {
        sum += A[i] - A[i - K];
        maxSum = Math.max(maxSum, sum);
    }
    
    return maxSum;
}
```

### Key Takeaways:

1. Sliding window for fixed-size subarray problems.
2. O(N) optimal vs O(N×K) brute force.
3. Maintain running sum efficiently.
4. Classic interview pattern.
5. Foundation for variable window problems.

