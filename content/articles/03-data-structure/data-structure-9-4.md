---
title: "Row with Maximum Number of Ones"
description: "Find row with most 1s in binary matrix sorted row-wise. Master the staircase search for optimization."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Row with Maximum Number of Ones
----------------------------

### Problem Statement:

Given binary matrix where each row is sorted (0s before 1s), find the row with maximum number of 1s.

### Approach:

Start from top-right, move left when see 1, move down when see 0.

### Time Complexity:

* **Time = O(N+M)**, **Space = O(1)**

### JavaScript Code:

```javascript
function rowWithMax1s(A) {
    let maxRow = 0;
    let col = A[0].length - 1;
    
    for (let row = 0; row < A.length; row++) {
        while (col >= 0 && A[row][col] === 1) {
            maxRow = row;
            col--;
        }
    }
    
    return maxRow;
}
```

### Key Takeaways:

1. Staircase search from top-right.
2. O(N+M) optimal for sorted rows.
3. Track best row while moving left.
4. Better than O(N×M) brute force.
5. Classic sorted matrix optimization.

