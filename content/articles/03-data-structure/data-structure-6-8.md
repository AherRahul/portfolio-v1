---
title: "Count Subarrays Starting with 'a'"
description: "Count subarrays of a string that start with a specific character. Learn character-based subarray counting technique."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Count Subarrays Starting with 'a'
----------------------------

### Problem Statement:

Given a string `S`, count the number of subarrays (substrings) that start with the character 'a'.

### Examples:

#### Example 1:

**Input:** S = "abac"

**Output:** 6

**Explanation:** 'a' at index 0 can form 4 subarrays, 'a' at index 2 can form 2 subarrays. Total = 6

### Approach:

For each 'a' at index i, it can form (N - i) subarrays.

### Time Complexity:

* **Time = O(N)**, **Space = O(1)**

### JavaScript Code:

```javascript
function countSubarraysStartingWithA(S) {
    let count = 0;
    const N = S.length;
    
    for (let i = 0; i < N; i++) {
        if (S[i] === 'a') {
            count += N - i;
        }
    }
    
    return count;
}
```

### Key Takeaways:

1. Each starting character contributes independently.
2. Character at position i forms (N-i) subarrays.
3. O(N) single pass solution.
4. Pattern extends to any starting condition.
5. Useful in string pattern problems.

