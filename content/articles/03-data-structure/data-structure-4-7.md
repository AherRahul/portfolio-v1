---
title: "Sum of Odd Indices"
description: "Calculate sum of elements at odd indices efficiently for multiple range queries using specialized prefix sums."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Sum of Odd Indices
----------------------------

### Problem Statement:

Given an array `A` and queries `[L, R]`, find the sum of elements at **odd indices** in the range [L, R].

### Examples:

#### Example 1:

**Input:** A = [1, 2, 3, 4, 5, 6], Query = [0, 4]

**Output:** 6

**Explanation:** Odd indices in [0, 4]: 1, 3 → elements: 2 + 4 = 6

### Constraints:

* `1 ≤ N ≤ 10^5`

### Approach:

Build prefix sum for odd indices only.

### Time Complexity:

* **Time = O(N + Q)**, **Space = O(N)**

### JavaScript Code:

```javascript
function sumOddIndices(A, queries) {
    const N = A.length;
    const prefix = new Array(N);
    prefix[0] = 0; // Index 0 is even
    
    for (let i = 1; i < N; i++) {
        prefix[i] = prefix[i-1] + (i % 2 === 1 ? A[i] : 0);
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

1. Mirror technique of even indices problem.
2. Prefix sum includes only odd-indexed elements.
3. Can maintain both even and odd prefix arrays.
4. Useful for alternating pattern problems.
5. Foundation for more complex filtering queries.

