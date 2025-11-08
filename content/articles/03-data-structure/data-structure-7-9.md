---
title: "Matrix Scalar Product"
description: "Multiply every element of matrix by a scalar value. Master basic matrix operations."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Matrix Scalar Product
----------------------------

### Problem Statement:

Given matrix `A` and integer `B`, return new matrix where each element is multiplied by `B`.

### Examples:

#### Example 1:

**Input:** A = [[1,2],[3,4]], B = 2

**Output:** [[2,4],[6,8]]

### Approach:

Iterate through all elements, multiply by scalar.

### Time Complexity:

* **Time = O(N×M)**, **Space = O(N×M)**

### JavaScript Code:

```javascript
function scalarMultiply(A, B) {
    return A.map(row => row.map(val => val * B));
}
```

### Key Takeaways:

1. Basic matrix operation.
2. Apply scalar to each element.
3. Can be done in-place or new matrix.
4. Foundation for matrix transformations.
5. Simple but essential operation.

