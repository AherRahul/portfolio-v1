---
title: "Subarray with Given Sum and Length"
description: "Find subarrays with specific sum and length using sliding window technique. Master fixed-size window pattern."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Subarray with Given Sum and Length
----------------------------

### Problem Statement:

Given array `A`, integer `B` (length), and integer `C` (target sum), count subarrays of length `B` with sum equal to `C`.

### Examples:

#### Example 1:

**Input:** A = [1,2,3,4,1], B = 3, C = 6

**Output:** 1

**Explanation:** Subarray [1,2,3] has length 3 and sum 6

### Approach:

Use sliding window of size B, track sum, count matches.

### Time Complexity:

* **Time = O(N)**, **Space = O(1)**

### JavaScript Code:

```javascript
function countSubarrays(A, B, C) {
    if (B > A.length) return 0;
    
    let sum = 0;
    for (let i = 0; i < B; i++) {
        sum += A[i];
    }
    
    let count = sum === C ? 1 : 0;
    
    for (let i = B; i < A.length; i++) {
        sum += A[i] - A[i - B];
        if (sum === C) count++;
    }
    
    return count;
}
```

### Key Takeaways:

1. Fixed-size sliding window pattern.
2. O(N) single pass solution.
3. Maintain running sum efficiently.
4. Add new element, remove old element.
5. Foundation for many window problems.

