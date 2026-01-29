---
title: "Subarray in Given Range"
description: "Count subarrays where both start and end indices fall within specified ranges. Learn range intersection technique."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Subarray in Given Range
----------------------------

### Problem Statement:

Given an array and two ranges [L1, R1] and [L2, R2], count subarrays where start index is in [L1, R1] and end index is in [L2, R2].

### Examples:

#### Example 1:

**Input:** N = 5, L1 = 0, R1 = 2, L2 = 2, R2 = 4

**Output:** 9

**Explanation:** Count subarrays starting from 0-2 and ending at 2-4

### Approach:

Count = (R1 - L1 + 1) × (R2 - L2 + 1), but only if R1 < L2 or overlapping handled.

### Time Complexity:

* **Time = O(1)**, **Space = O(1)**

### JavaScript Code:

```javascript
function countSubarraysInRange(N, L1, R1, L2, R2) {
    if (R1 < L2) {
        // Non-overlapping
        return (R1 - L1 + 1) * (R2 - L2 + 1);
    } else {
        // Overlapping - need careful counting
        let count = 0;
        for (let start = L1; start <= R1; start++) {
            for (let end = Math.max(start, L2); end <= R2; end++) {
                count++;
            }
        }
        return count;
    }
}
```

### Key Takeaways:

1. Handle overlapping ranges carefully.
2. Non-overlapping: simple multiplication.
3. Overlapping: ensure start ≤ end constraint.
4. Mathematical counting reduces complexity.
5. Pattern for interval problems.

