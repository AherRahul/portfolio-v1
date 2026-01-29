---
title: "Toggle i-th Bit"
description: "Toggle (flip) a specific bit using XOR operation. Master bit flipping technique."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Toggle i-th Bit
----------------------------

### Problem Statement:

Given integer `N` and position `i`, toggle (flip) the bit at position i (0→1 or 1→0).

### Examples:

#### Example 1:

**Input:** N = 13 (binary: 1101), i = 1

**Output:** 15 (binary: 1111)

### Approach:

Use XOR operation: `N ^ (1 << i)`

### Time Complexity:

* **Time = O(1)**, **Space = O(1)**

### JavaScript Code:

```javascript
function toggleBit(N, i) {
    return N ^ (1 << i);
}
```

### Key Takeaways:

1. XOR with 1 flips the bit
2. XOR with 0 keeps the bit same
3. Create mask with 1 at position i
4. XOR toggles that bit
5. Essential for many bit tricks

