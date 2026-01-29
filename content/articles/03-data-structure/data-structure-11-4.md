---
title: "Set Bit"
description: "Set (turn on) a specific bit position using bitwise OR operation. Master bit setting technique."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Set Bit
----------------------------

### Problem Statement:

Given integer `N` and position `i`, set (turn on/make 1) the bit at position i.

### Examples:

#### Example 1:

**Input:** N = 9 (binary: 1001), i = 2

**Output:** 13 (binary: 1101)

### Approach:

Use OR operation with mask: `N | (1 << i)`

### Time Complexity:

* **Time = O(1)**, **Space = O(1)**

### JavaScript Code:

```javascript
function setBit(N, i) {
    return N | (1 << i);
}
```

### Key Takeaways:

1. Create mask with 1 at position i
2. OR with N sets that bit
3. Works regardless of current bit value
4. Complement to unset operation
5. Foundation bit manipulation

