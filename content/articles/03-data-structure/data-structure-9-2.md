---
title: "Sub-matrix Sum Queries"
description: "Answer sum queries for any rectangular sub-matrix using 2D prefix sum. Master the 2D cumulative sum technique."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Sub-matrix Sum Queries
----------------------------

### Problem Statement:

Given matrix `A` and queries `[r1,c1,r2,c2]`, find sum of sub-matrix from (r1,c1) to (r2,c2).

### Approach:

Build 2D prefix sum: `prefix[i][j] = sum of rectangle from (0,0) to (i,j)`. Query formula: `prefix[r2][c2] - prefix[r1-1][c2] - prefix[r2][c1-1] + prefix[r1-1][c1-1]`

### Time Complexity:

* **Preprocessing: O(N×M)**, **Query: O(1)**

### JavaScript Code:

```javascript
function subMatrixSum(A, queries) {
    const N = A.length, M = A[0].length;
    const prefix = Array(N+1).fill().map(() => Array(M+1).fill(0));
    
    for (let i = 1; i <= N; i++) {
        for (let j = 1; j <= M; j++) {
            prefix[i][j] = A[i-1][j-1] + prefix[i-1][j] + prefix[i][j-1] - prefix[i-1][j-1];
        }
    }
    
    const result = [];
    for (const [r1,c1,r2,c2] of queries) {
        const sum = prefix[r2+1][c2+1] - prefix[r1][c2+1] - prefix[r2+1][c1] + prefix[r1][c1];
        result.push(sum);
    }
    
    return result;
}
```

### Key Takeaways:

1. 2D extension of 1D prefix sum.
2. Inclusion-exclusion principle for rectangles.
3. O(1) query after O(N×M) preprocessing.
4. Essential for matrix range queries.
5. Foundation for advanced 2D problems.

