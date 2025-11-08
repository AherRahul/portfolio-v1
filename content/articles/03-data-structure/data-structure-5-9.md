---
title: "Good Subarrays Easy"
description: "Count subarrays with specific properties. Learn conditional counting techniques for subarray problems."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Good Subarrays Easy
----------------------------

### Problem Statement:

A subarray is called "good" if its length is even and sum is even. Count all good subarrays in array `A`.

### Examples:

#### Example 1:

**Input:** A = [1, 2, 3, 4]

**Output:** 2

**Explanation:** [1,2,3,4] has even length and sum=10 (even), [2,3,4] has odd length (not good)

### Approach:

Check all subarrays with even length, calculate sum, count if even.

### Time Complexity:

* **Time = O(N²)**, **Space = O(1)**

### JavaScript Code:

```javascript
function countGoodSubarrays(A) {
    let count = 0;
    const N = A.length;
    
    for (let start = 0; start < N; start++) {
        let sum = 0;
        for (let end = start; end < N; end++) {
            sum += A[end];
            const length = end - start + 1;
            
            if (length % 2 === 0 && sum % 2 === 0) {
                count++;
            }
        }
    }
    
    return count;
}
```

### Key Takeaways:

1. Multiple conditions require careful checking.
2. Track running sum to avoid recalculation.
3. Check both length and sum properties.
4. O(N²) when checking all subarrays.
5. Optimization possible with math properties.

