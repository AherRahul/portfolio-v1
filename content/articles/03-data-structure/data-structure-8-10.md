---
title: "Are Matrices Same?"
description: "Check if two matrices are identical. Master matrix comparison technique."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Are Matrices Same?
----------------------------

### Problem Statement:

Given two matrices `A` and `B`, check if they are identical. Return 1 if same, 0 otherwise.

### Examples:

#### Example 1:

**Input:** A = [[1,2],[3,4]], B = [[1,2],[3,4]]

**Output:** 1

### Approach:

Compare dimensions first, then each element.

### Time Complexity:

* **Time = O(N×M)**, **Space = O(1)**

### JavaScript Code:

```javascript
function areSame(A, B) {
    if (A.length !== B.length || A[0].length !== B[0].length) {
        return 0;
    }
    
    for (let i = 0; i < A.length; i++) {
        for (let j = 0; j < A[0].length; j++) {
            if (A[i][j] !== B[i][j]) {
                return 0;
            }
        }
    }
    
    return 1;
}
```

### Key Takeaways:

1. Check dimensions before element comparison.
2. Early exit on first mismatch.
3. O(N×M) necessary to verify all elements.
4. Foundation for matrix operations.
5. Tests thorough comparison logic.

