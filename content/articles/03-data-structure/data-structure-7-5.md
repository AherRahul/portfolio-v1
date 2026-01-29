---
title: "Rain Water Trapped"
description: "Calculate water trapped between elevation bars using prefix and suffix maximum arrays. Master the classic two-pointer optimization."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Rain Water Trapped
----------------------------

### Problem Statement:

Given `N` non-negative integers representing elevation map where width of each bar is 1, compute how much water can be trapped after raining.

### Examples:

#### Example 1:

**Input:** height = [0,1,0,2,1,0,1,3,2,1,2,1]

**Output:** 6

**Explanation:** Water trapped = 1+1+2+1+1 = 6

### Approach:

For each position, water = min(leftMax, rightMax) - height[i]

### Time Complexity:

* **Time = O(N)**, **Space = O(N)** or O(1) with two pointers

### JavaScript Code:

```javascript
function trap(height) {
    const N = height.length;
    if (N === 0) return 0;
    
    const leftMax = [height[0]];
    for (let i = 1; i < N; i++) {
        leftMax[i] = Math.max(leftMax[i-1], height[i]);
    }
    
    const rightMax = new Array(N);
    rightMax[N-1] = height[N-1];
    for (let i = N-2; i >= 0; i--) {
        rightMax[i] = Math.max(rightMax[i+1], height[i]);
    }
    
    let water = 0;
    for (let i = 0; i < N; i++) {
        water += Math.min(leftMax[i], rightMax[i]) - height[i];
    }
    
    return water;
}
```

### Key Takeaways:

1. Water level determined by min(leftMax, rightMax).
2. Requires both prefix and suffix maximum.
3. Can optimize to O(1) space with two pointers.
4. Classic interview problem.
5. Tests understanding of cumulative arrays.

