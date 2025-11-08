---
title: "Subarray with Least Average"
description: "Find subarray of given size with minimum average using sliding window. Master the window minimum pattern."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Subarray with Least Average
----------------------------

### Problem Statement:

Given array `A` of size `N` and integer `B`, find starting index of subarray of size `B` with minimum average.

### Examples:

#### Example 1:

**Input:** A = [1,2,3,4,5], B = 2

**Output:** 0

**Explanation:** Subarray [1,2] has minimum average 1.5

### Approach:

Use sliding window to find minimum sum (minimum sum = minimum average for fixed size).

### Time Complexity:

* **Time = O(N)**, **Space = O(1)**

### JavaScript Code:

```javascript
function findMinAverageSubarray(A, B) {
    let sum = 0;
    for (let i = 0; i < B; i++) {
        sum += A[i];
    }
    
    let minSum = sum;
    let minIndex = 0;
    
    for (let i = B; i < A.length; i++) {
        sum += A[i] - A[i - B];
        if (sum < minSum) {
            minSum = sum;
            minIndex = i - B + 1;
        }
    }
    
    return minIndex;
}
```

### Key Takeaways:

1. For fixed window, minimum sum = minimum average.
2. Sliding window tracks running sum.
3. Record index of minimum sum window.
4. O(N) single pass solution.
5. Variation of maximum subarray sum.

