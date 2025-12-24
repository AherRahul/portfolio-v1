---
title: "Check Bit"
description: "Check if a specific bit is set or unset using bitwise operations. Master bit testing technique."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Check Bit
----------------------------

### Problem Statement:

Given integer `N` and position `i`, check if bit at position i is set (1) or unset (0).

### Examples:

#### Example 1:

**Input:** N = 13 (binary: 1101), i = 2

**Output:** true (bit is set)

### Approach:

Use AND with mask: `(N & (1 << i)) !== 0`

### Time Complexity:

* **Time = O(1)**, **Space = O(1)**

### JavaScript Code:

```javascript
function checkBit(N, i) {
    return (N & (1 << i)) !== 0;
}
```

### Key Takeaways:

1. Create mask with 1 at position i
2. AND isolates that bit
3. Check if result is non-zero
4. Essential for bit testing
5. Used in many bit manipulation algorithms

