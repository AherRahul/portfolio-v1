---
title: "Spiral Order Matrix II"
description: "Generate NxN matrix filled with numbers 1 to N² in spiral order. Master the spiral generation pattern."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Spiral Order Matrix II
----------------------------

### Problem Statement:

Given integer `A`, generate square matrix of size A×A filled with elements 1 to A² in spiral order.

### Examples:

#### Example 1:

**Input:** A = 3

**Output:** [[1,2,3],[8,9,4],[7,6,5]]

### Approach:

Track boundaries, fill layer by layer in spiral manner.

### Time Complexity:

* **Time = O(A²)**, **Space = O(A²)**

### JavaScript Code:

```javascript
function generateMatrix(A) {
    const matrix = Array(A).fill().map(() => Array(A));
    let num = 1;
    let top = 0, bottom = A - 1, left = 0, right = A - 1;
    
    while (top <= bottom && left <= right) {
        for (let i = left; i <= right; i++) {
            matrix[top][i] = num++;
        }
        top++;
        
        for (let i = top; i <= bottom; i++) {
            matrix[i][right] = num++;
        }
        right--;
        
        if (top <= bottom) {
            for (let i = right; i >= left; i--) {
                matrix[bottom][i] = num++;
            }
            bottom--;
        }
        
        if (left <= right) {
            for (let i = bottom; i >= top; i--) {
                matrix[i][left] = num++;
            }
            left++;
        }
    }
    
    return matrix;
}
```

### Key Takeaways:

1. Reverse of spiral traversal problem.
2. Fill instead of read layer by layer.
3. Track number counter and boundaries.
4. Handle odd/even dimensions.
5. Tests matrix construction skills.

