---
title: "Pick from Both Sides"
description: "Master the sliding window technique to pick elements from array ends. Learn how to maximize sum by picking K elements from either left or right side of an array."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Sliding Window"
    type: "reference"
    url: "https://www.geeksforgeeks.org/window-sliding-technique/"
    description: "Sliding window technique"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Pick from Both Sides
----------------------------

### Problem Statement:

Given an integer array `A` of size `N` and an integer `B`, you need to pick exactly `B` elements from the array. You can pick elements from the **left end** or the **right end** of the array.

Find the **maximum sum** of elements you can pick.

### Examples:

#### Example 1:

**Input:** A = [5, -2, 3, 1, 2], B = 3

**Output:** 8

**Explanation:** Pick 5, -2, 3 from left → sum = 6, OR Pick 3, 1, 2 from right → sum = 6, OR Pick 5, 1, 2 (left=1, right=2) → sum = 8 (maximum)

### Approach:

Calculate all combinations: pick i from left and (B-i) from right, where 0 ≤ i ≤ B.

### Time Complexity:

* **Time = O(B)**, **Space = O(1)**

### JavaScript Code:

```javascript
function solve(A, B) {
    let leftSum = 0;
    for (let i = 0; i < B; i++) {
        leftSum += A[i];
    }
    
    let maxSum = leftSum;
    let rightSum = 0;
    
    for (let i = 0; i < B; i++) {
        leftSum -= A[B - 1 - i];
        rightSum += A[A.length - 1 - i];
        maxSum = Math.max(maxSum, leftSum + rightSum);
    }
    
    return maxSum;
}
```

### Key Takeaways:

1. **Sliding window** approach for optimization.
2. Try all combinations of picking from left and right.
3. Precompute left sum, then adjust with right elements.
4. Time complexity O(B) is optimal.
5. Space complexity O(1) using running sums.

