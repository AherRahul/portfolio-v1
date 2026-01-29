---
title: "Total Number of Subarrays"
description: "Calculate the total count of all possible subarrays using mathematical formula. Understand the N×(N+1)/2 pattern."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Total Number of Subarrays
----------------------------

### Problem Statement:

Given an array of size `N`, find the total number of possible subarrays.

### Examples:

#### Example 1:

**Input:** N = 3

**Output:** 6

**Explanation:** Array [a,b,c] has subarrays: [a], [a,b], [a,b,c], [b], [b,c], [c]

#### Example 2:

**Input:** N = 4

**Output:** 10

### Approach:

Formula: N × (N + 1) / 2

### Time Complexity:

* **Time = O(1)**, **Space = O(1)**

### JavaScript Code:

```javascript
function countSubarrays(N) {
    return (N * (N + 1)) / 2;
}
```

### Key Takeaways:

1. **Mathematical formula** gives instant answer.
2. Derived from choosing 2 positions from N+1 gaps.
3. Sequence: 1, 3, 6, 10, 15, 21... (triangular numbers).
4. Important for complexity analysis.
5. Foundation for counting problems.

