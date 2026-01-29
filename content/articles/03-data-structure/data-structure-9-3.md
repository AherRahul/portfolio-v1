---
title: "Sum of All Submatrices"
description: "Calculate total sum of all possible submatrices. Learn the contribution technique for matrix problems."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Sum of All Submatrices
----------------------------

### Problem Statement:

Given matrix `A`, find sum of all possible submatrices.

### Approach:

Each element A[i][j] appears in (i+1)×(j+1)×(N-i)×(M-j) submatrices.

### Time Complexity:

* **Time = O(N×M)**, **Space = O(1)**

### JavaScript Code:

```javascript
function sumOfSubmatrices(A) {
    const N = A.length, M = A[0].length;
    let total = 0;
    
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < M; j++) {
            const count = (i + 1) * (j + 1) * (N - i) * (M - j);
            total += A[i][j] * count;
        }
    }
    
    return total;
}
```

### Key Takeaways:

1. Mathematical formula avoids generating all submatrices.
2. Each element's contribution calculated independently.
3. O(N×M) vs O(N³×M³) brute force.
4. Extension of 1D subarray sum problem.
5. Demonstrates power of contribution technique.

