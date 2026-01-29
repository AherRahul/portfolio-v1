---
title: "Unset i-th Bit"
description: "Learn to unset (turn off) a specific bit position using bitwise AND operation. Master fundamental bit manipulation technique."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Unset i-th Bit
----------------------------

### Problem Statement:

Given integer `N` and position `i`, unset (turn off/make 0) the bit at position i (0-indexed from right).

### Examples:

#### Example 1:

**Input:** N = 13 (binary: 1101), i = 2

**Output:** 9 (binary: 1001)

**Explanation:** Bit at position 2 was 1, now becomes 0

### Approach:

Use AND operation with complement of mask: `N & ~(1 << i)`

### Time Complexity:

* **Time = O(1)**, **Space = O(1)**

### JavaScript Code:

```javascript
function unsetBit(N, i) {
    return N & ~(1 << i);
}
```

### Key Takeaways:

1. Create mask with 1 at position i: `(1 << i)`
2. Complement mask to get all 1s except position i: `~(1 << i)`
3. AND with N to unset bit: `N & ~(1 << i)`
4. Works regardless of current bit value
5. Foundation bit manipulation operation

