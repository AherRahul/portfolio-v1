---
title: "Prefix Maximum"
description: "Build prefix maximum array to find maximum element from start to any index. Learn cumulative maximum technique."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Prefix Maximum
----------------------------

### Problem Statement:

Given array `A`, create array `prefixMax` where `prefixMax[i]` is the maximum element from index 0 to i.

### Examples:

#### Example 1:

**Input:** A = [3, 1, 4, 1, 5]

**Output:** [3, 3, 4, 4, 5]

### Approach:

Iterate left to right, tracking max seen so far.

### Time Complexity:

* **Time = O(N)**, **Space = O(N)**

### JavaScript Code:

```javascript
function prefixMax(A) {
    const N = A.length;
    const result = [A[0]];
    
    for (let i = 1; i < N; i++) {
        result[i] = Math.max(result[i-1], A[i]);
    }
    
    return result;
}
```

### Key Takeaways:

1. Track cumulative maximum.
2. Each position stores max up to that point.
3. Useful for range maximum queries.
4. Foundation for rain water trapping.
5. Pattern extends to min, GCD, LCM.

