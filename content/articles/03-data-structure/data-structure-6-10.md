---
title: "Counting Subarrays Easy"
description: "Count subarrays with sum less than K. Master the sliding window and two-pointer approach for subarray counting."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Counting Subarrays Easy
----------------------------

### Problem Statement:

Given an array `A` of positive integers and integer `K`, count the number of subarrays with sum less than `K`.

### Examples:

#### Example 1:

**Input:** A = [1, 2, 3], K = 4

**Output:** 4

**Explanation:** [1], [2], [3], [1,2] have sums < 4

### Approach:

Use two pointers/sliding window to count valid subarrays efficiently.

### Time Complexity:

* **Time = O(N)**, **Space = O(1)**

### JavaScript Code:

```javascript
function countSubarraysLessThanK(A, K) {
    let count = 0;
    let sum = 0;
    let start = 0;
    
    for (let end = 0; end < A.length; end++) {
        sum += A[end];
        
        while (sum >= K && start <= end) {
            sum -= A[start];
            start++;
        }
        
        // All subarrays ending at 'end' with start in [start, end]
        count += end - start + 1;
    }
    
    return count;
}
```

### Key Takeaways:

1. **Sliding window** for positive integers.
2. Expand right, shrink left when needed.
3. Count subarrays ending at each position.
4. O(N) optimal for positive numbers.
5. Pattern for range constraint problems.

