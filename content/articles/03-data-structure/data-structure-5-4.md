---
title: "Equilibrium Index"
description: "Find the equilibrium index where sum of left elements equals sum of right elements using prefix sum technique."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Equilibrium Index
----------------------------

### Problem Statement:

Given an array `A`, find the **equilibrium index** where the sum of elements at lower indexes equals the sum of elements at higher indexes.

Return the smallest equilibrium index, or -1 if none exists.

### Examples:

#### Example 1:

**Input:** A = [-7, 1, 5, 2, -4, 3, 0]

**Output:** 3

**Explanation:** At index 3: Left sum = -7+1+5 = -1, Right sum = -4+3+0 = -1

#### Example 2:

**Input:** A = [1, 2, 3]

**Output:** -1

### Constraints:

* `1 ≤ N ≤ 10^5`
* `-10^9 ≤ A[i] ≤ 10^9`

### Approach:

Calculate total sum. Iterate and track left sum. At each index, check if `leftSum == totalSum - leftSum - A[i]`

### Time Complexity:

* **Time = O(N)**, **Space = O(1)**

### JavaScript Code:

```javascript
function equilibriumIndex(A) {
    const totalSum = A.reduce((sum, val) => sum + val, 0);
    let leftSum = 0;
    
    for (let i = 0; i < A.length; i++) {
        const rightSum = totalSum - leftSum - A[i];
        if (leftSum === rightSum) {
            return i;
        }
        leftSum += A[i];
    }
    
    return -1;
}
```

### Key Takeaways:

1. **Single pass** solution with running sums.
2. No need for prefix/suffix arrays.
3. Check condition: `leftSum == totalSum - leftSum - current`
4. Return first equilibrium index found.
5. Useful in load balancing problems.

