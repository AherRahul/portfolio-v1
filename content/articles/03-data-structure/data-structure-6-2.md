---
title: "Generate All Subarrays"
description: "Learn to generate all possible subarrays of an array. Understand the O(N²) time complexity and nested loop pattern for subarray enumeration."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Generate All Subarrays
----------------------------

### Problem Statement:

Given an array `A` of size `N`, generate and print all possible subarrays.

A subarray is a contiguous part of an array.

### Examples:

#### Example 1:

**Input:** A = [1, 2, 3]

**Output:** 
```
[1]
[1, 2]
[1, 2, 3]
[2]
[2, 3]
[3]
```

### Constraints:

* `1 ≤ N ≤ 100`

### Approach:

Use two nested loops: outer for start index, inner for end index.

### Time Complexity:

* **Time = O(N³)** (printing), **Space = O(1)**

### JavaScript Code:

```javascript
function generateSubarrays(A) {
    const N = A.length;
    
    for (let start = 0; start < N; start++) {
        for (let end = start; end < N; end++) {
            // Print subarray from start to end
            const subarray = [];
            for (let k = start; k <= end; k++) {
                subarray.push(A[k]);
            }
            console.log(subarray);
        }
    }
}
```

### Key Takeaways:

1. **Total subarrays** = N × (N+1) / 2
2. Nested loops enumerate all start-end pairs.
3. Printing takes O(N³) total time.
4. Foundation for subarray sum problems.
5. Important pattern in competitive programming.

