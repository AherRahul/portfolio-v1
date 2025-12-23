---
title: "Minimum Swaps"
description: "Find minimum swaps needed to bring all elements ≤ K together. Master the two-pointer window technique."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Minimum Swaps
----------------------------

### Problem Statement:

Given array `A` and integer `B`, find minimum swaps to bring all elements ≤ B together.

### Examples:

#### Example 1:

**Input:** A = [1,12,10,3,14,10,5], B = 8

**Output:** 2

**Explanation:** Bring [1,3,5] together, need 2 swaps

### Approach:

Count elements ≤ B, use sliding window of that size, find window with minimum elements > B.

### Time Complexity:

* **Time = O(N)**, **Space = O(1)**

### JavaScript Code:

```javascript
function minSwaps(A, B) {
    let goodCount = 0;
    for (const num of A) {
        if (num <= B) goodCount++;
    }
    
    if (goodCount === 0) return 0;
    
    // Count bad elements in first window
    let badCount = 0;
    for (let i = 0; i < goodCount; i++) {
        if (A[i] > B) badCount++;
    }
    
    let minSwaps = badCount;
    
    // Slide window
    for (let i = goodCount; i < A.length; i++) {
        if (A[i - goodCount] > B) badCount--;
        if (A[i] > B) badCount++;
        minSwaps = Math.min(minSwaps, badCount);
    }
    
    return minSwaps;
}
```

### Key Takeaways:

1. Window size = count of good elements.
2. Minimum swaps = minimum bad elements in any window.
3. Sliding window finds optimal position.
4. O(N) efficient solution.
5. Creative use of window technique.

