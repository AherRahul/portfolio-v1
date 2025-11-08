---
title: "Unset x Bits from Right"
description: "Unset the rightmost x bits in a number. Master bulk bit manipulation using masks."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Unset x Bits from Right
----------------------------

### Problem Statement:

Given integer `N` and number `x`, unset the rightmost x bits.

### Examples:

#### Example 1:

**Input:** N = 15 (binary: 1111), x = 2

**Output:** 12 (binary: 1100)

### Approach:

Create mask with 1s except rightmost x bits: `N & (~0 << x)` or `N & (-1 << x)`

### Time Complexity:

* **Time = O(1)**, **Space = O(1)**

### JavaScript Code:

```javascript
function unsetRightmostXBits(N, x) {
    return N & (-1 << x);
}
```

### Key Takeaways:

1. `-1` in binary is all 1s
2. Left shift by x creates mask
3. AND with N unsets rightmost x bits
4. Efficient bulk bit operation
5. Pattern for range bit manipulation

