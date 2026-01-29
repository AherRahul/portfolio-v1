---
title: "Continuous Sum Query"
description: "Handle range update queries efficiently using difference array technique. Learn how to update ranges in O(1) time."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Continuous Sum Query
----------------------------

### Problem Statement:

Given an array `A` of size `N` and `Q` queries of form `[L, R, val]`, add `val` to all elements in range [L, R]. Return final array after all queries.

### Examples:

#### Example 1:

**Input:** A = [0,0,0,0,0], Queries = [[1,3,2], [2,4,3]]

**Output:** [0,2,5,5,3]

### Approach:

Use difference array: mark start and end+1 positions, then compute prefix sum.

### Time Complexity:

* **Time = O(N + Q)**, **Space = O(N)**

### JavaScript Code:

```javascript
function continuousSumQuery(A, queries) {
    const N = A.length;
    const diff = new Array(N + 1).fill(0);
    
    for (const [L, R, val] of queries) {
        diff[L] += val;
        diff[R + 1] -= val;
    }
    
    let sum = 0;
    for (let i = 0; i < N; i++) {
        sum += diff[i];
        A[i] += sum;
    }
    
    return A;
}
```

### Key Takeaways:

1. **Difference array** optimizes range updates.
2. O(1) per update query.
3. Single prefix sum pass to get final values.
4. Essential for bulk update problems.
5. Inverse of prefix sum technique.

