---
title: "Add the Matrices"
description: "Add two matrices element-wise. Master matrix addition operation."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Add the Matrices
----------------------------

### Problem Statement:

Given two matrices `A` and `B` of same size, return their sum (element-wise addition).

### Examples:

#### Example 1:

**Input:** A = [[1,2],[3,4]], B = [[5,6],[7,8]]

**Output:** [[6,8],[10,12]]

### Approach:

Add corresponding elements from both matrices.

### Time Complexity:

* **Time = O(N×M)**, **Space = O(N×M)**

### JavaScript Code:

```javascript
function addMatrices(A, B) {
    return A.map((row, i) => 
        row.map((val, j) => val + B[i][j])
    );
}
```

### Key Takeaways:

1. Element-wise addition operation.
2. Requires same dimensions.
3. Can be done in-place or new matrix.
4. Foundation for matrix arithmetic.
5. Simple but essential operation.

