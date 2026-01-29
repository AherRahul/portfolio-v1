---
title: "Subsequence-Sum Problem"
description: "Find if there exists a subsequence with given sum. Learn subset sum problem fundamentals and recursive thinking."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Subsequence-Sum Problem
----------------------------

### Problem Statement:

Given array `A` and integer `B`, check if there exists a subsequence with sum equal to `B`.

### Examples:

#### Example 1:

**Input:** A = [1, 2, 3], B = 4

**Output:** true (subsequence [1,3] has sum 4)

### Approach:

Recursive: For each element, include or exclude. DP: Use 2D table[i][sum].

### Time Complexity:

* **Recursive: O(2^N)**, **DP: O(N×Sum)**

### JavaScript Code:

```javascript
function hasSubsequenceSum(A, B) {
    function helper(index, sum) {
        if (sum === 0) return true;
        if (index >= A.length) return false;
        
        // Include or exclude current element
        return helper(index + 1, sum - A[index]) || 
               helper(index + 1, sum);
    }
    
    return helper(0, B);
}
```

### Key Takeaways:

1. Each element has two choices: include or exclude
2. Recursive solution explores all possibilities
3. DP optimizes with memoization
4. Classic subset sum problem
5. Foundation for backtracking problems

