---
title: "Sum of Even Indices"
description: "Calculate sum of elements at even indices efficiently for multiple range queries using specialized prefix sums."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Sum of Even Indices
----------------------------

### Problem Statement:

Given an array `A` and queries `[L, R]`, find the sum of elements at **even indices** in the range [L, R].

### Examples:

#### Example 1:

**Input:** A = [1, 2, 3, 4, 5, 6], Query = [1, 4]

**Output:** 7

**Explanation:** Indices in range [1, 4]: elements at even indices 2, 4 → 3 + 4 = 7

### Constraints:

* `1 ≤ N ≤ 10^5`

### Approach:

Build prefix sum considering only even indices. Query uses prefix difference.

### Time Complexity:

* **Time = O(N + Q)**, **Space = O(N)**

### JavaScript Code:

```javascript
function sumEvenIndices(A, queries) {
    const N = A.length;
    const prefix = new Array(N);
    prefix[0] = A[0]; // Index 0 is even
    
    for (let i = 1; i < N; i++) {
        prefix[i] = prefix[i-1] + (i % 2 === 0 ? A[i] : 0);
    }
    
    const result = [];
    for (const [L, R] of queries) {
        let sum = prefix[R];
        if (L > 0) sum -= prefix[L-1];
        result.push(sum);
    }
    
    return result;
}
```

### Key Takeaways:

1. **Selective prefix sum** - only add elements at even indices.
2. Pattern extends to odd indices or any filter condition.
3. O(1) query after preprocessing.
4. Useful in matrix problems with row/column constraints.
5. Can combine multiple prefix arrays for complex queries.

