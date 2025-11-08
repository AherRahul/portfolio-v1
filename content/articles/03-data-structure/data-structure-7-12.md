---
title: "Matrix Subtraction"
description: "Subtract two matrices element-wise. Master matrix subtraction operation."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Matrix Subtraction
----------------------------

### Problem Statement:

Given two matrices `A` and `B` of same size, return their difference (A - B, element-wise subtraction).

### Examples:

#### Example 1:

**Input:** A = [[5,6],[7,8]], B = [[1,2],[3,4]]

**Output:** [[4,4],[4,4]]

### Approach:

Subtract corresponding elements.

### Time Complexity:

* **Time = O(N×M)**, **Space = O(N×M)**

### JavaScript Code:

```javascript
function subtractMatrices(A, B) {
    return A.map((row, i) => 
        row.map((val, j) => val - B[i][j])
    );
}
```

### Key Takeaways:

1. Element-wise subtraction.
2. Order matters (A-B ≠ B-A).
3. Requires same dimensions.
4. Foundation for matrix arithmetic.
5. Complement to matrix addition.

