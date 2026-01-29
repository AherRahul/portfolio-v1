---
title: "Spiral Matrix 2"
description: "Print matrix elements in spiral order starting from top-left. Master the layer-by-layer traversal pattern."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Spiral Matrix 2
----------------------------

### Problem Statement:

Given NxN matrix `A`, print elements in spiral order starting from A[0][0].

### Examples:

#### Example 1:

**Input:** A = [[1,2],[3,4]]

**Output:** [1,2,4,3]

### Approach:

Track boundaries (top, bottom, left, right), traverse each layer.

### Time Complexity:

* **Time = O(N²)**, **Space = O(1)**

### JavaScript Code:

```javascript
function spiralOrder(A) {
    const result = [];
    let top = 0, bottom = A.length - 1;
    let left = 0, right = A[0].length - 1;
    
    while (top <= bottom && left <= right) {
        // Right
        for (let i = left; i <= right; i++) {
            result.push(A[top][i]);
        }
        top++;
        
        // Down
        for (let i = top; i <= bottom; i++) {
            result.push(A[i][right]);
        }
        right--;
        
        // Left
        if (top <= bottom) {
            for (let i = right; i >= left; i--) {
                result.push(A[bottom][i]);
            }
            bottom--;
        }
        
        // Up
        if (left <= right) {
            for (let i = bottom; i >= top; i--) {
                result.push(A[i][left]);
            }
            left++;
        }
    }
    
    return result;
}
```

### Key Takeaways:

1. Layer-by-layer traversal pattern.
2. Track four boundaries carefully.
3. Handle odd/even dimensions.
4. Classic matrix traversal problem.
5. Tests boundary condition handling.

