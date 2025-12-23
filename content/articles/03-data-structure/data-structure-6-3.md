---
title: "Subarray Sums"
description: "Calculate sums of all subarrays efficiently. Master the technique to avoid redundant calculations using running sum approach."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Subarray Sums
----------------------------

### Problem Statement:

Given an array `A` of size `N`, return an array containing the sum of each possible subarray.

### Examples:

#### Example 1:

**Input:** A = [1, 2, 3]

**Output:** [1, 3, 6, 2, 5, 3]

**Explanation:** Subarrays: [1]=1, [1,2]=3, [1,2,3]=6, [2]=2, [2,3]=5, [3]=3

### Approach:

Use nested loops with running sum to avoid O(N³).

### Time Complexity:

* **Time = O(N²)**, **Space = O(N²)**

### JavaScript Code:

```javascript
function subarraySums(A) {
    const N = A.length;
    const sums = [];
    
    for (let start = 0; start < N; start++) {
        let sum = 0;
        for (let end = start; end < N; end++) {
            sum += A[end];
            sums.push(sum);
        }
    }
    
    return sums;
}
```

### Key Takeaways:

1. Running sum avoids recalculating from scratch.
2. O(N²) optimal for generating all sums.
3. Pattern for optimizing subarray problems.
4. Store or process sums as needed.
5. Foundation for maximum subarray sum.

