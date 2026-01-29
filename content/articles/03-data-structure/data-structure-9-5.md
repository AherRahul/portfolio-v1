---
title: "Maximum Submatrix"
description: "Find the maximum sum submatrix in a 2D array. Master Kadane's algorithm extension to 2D."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Maximum Submatrix
----------------------------

### Problem Statement:

Find the submatrix with maximum sum in a 2D array.

### Approach:

Fix left and right columns, apply Kadane's on compressed rows.

### Time Complexity:

* **Time = O(N²×M)**, **Space = O(N)**

### JavaScript Code:

```javascript
function maxSubmatrix(A) {
    const N = A.length, M = A[0].length;
    let maxSum = -Infinity;
    
    for (let left = 0; left < M; left++) {
        const temp = new Array(N).fill(0);
        
        for (let right = left; right < M; right++) {
            for (let i = 0; i < N; i++) {
                temp[i] += A[i][right];
            }
            
            // Apply Kadane's on temp
            let currentSum = temp[0];
            let maxKadane = temp[0];
            for (let i = 1; i < N; i++) {
                currentSum = Math.max(temp[i], currentSum + temp[i]);
                maxKadane = Math.max(maxKadane, currentSum);
            }
            
            maxSum = Math.max(maxSum, maxKadane);
        }
    }
    
    return maxSum;
}
```

### Key Takeaways:

1. Extension of 1D Kadane's to 2D.
2. Fix columns, compress to 1D problem.
3. O(N²×M) optimal without advanced data structures.
4. Combines column fixing with Kadane's.
5. Tests advanced algorithmic thinking.

