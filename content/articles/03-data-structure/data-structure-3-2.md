---
title: "Remove Element"
description: "Dive deep into string manipulation and pattern matching. Learn string operations, substring algorithms, palindrome detection, and advanced string processing techniques."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "String Algorithm Visualizations"
    type: "tool"
    url: "https://visualgo.net/en/suffixarray"
    description: "Interactive string algorithm demonstrations"
  - title: "Regular Expressions Guide"
    type: "reference"
    url: "https://regexr.com/"
    description: "Interactive regular expression testing and learning"
  - title: "String Problems Practice"
    type: "practice"
    url: "https://leetcode.com/tag/string/"
    description: "Comprehensive string algorithm practice problems"
  - title: "Scaler Notes - Day 33, 18 Apr - DSA: Introduction to Problem Solving"
    type: "documentation"
    url: "https://res.cloudinary.com/duojkrgue/image/upload/v1761497972/Portfolio/scalerNotes/01-dsa-problem-solving_zudvhj.pdf"
    description: "DSA Mathematical foundations"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)


Remove Element 
-------------------

### Problem Statement:

Given an integer array nums and an integer `val`, remove all occurrences of `val` in-place. The order of the elements may be changed. Then return the number of elements in nums which are not equal to `val`.

Consider the number of elements in `nums` which are not equal to `val` be `k`. To get accepted, you need to:

Modify `nums` such that the first `k` elements contain elements not equal to `val`. The remaining elements beyond `k` do not matter. Return `k`.

<br />

#### Example 1:

**Input:** nums = \[3,2,2,3\], val = 3

**Output:** 2, nums = \[2,2,\_,\_\]

`Explanation:` The first 2 elements should be 2. Underscores represent irrelevant values.

<br />

#### Example 2:

**Input:** nums = \[0,1,2,2,3,0,4,2\], val = 2

**Output:** 5, nums = \[0,1,4,0,3,\_,\_,\_\]

`Explanation:` The first 5 elements should be any order of \[0,1,4,0,3\].

### Approach:

*   Use pointer`x` to track where the next non-val element should go.
*   Traverse the array with index `i`.
*   If `nums[i] != val`, assign `nums[x] = nums[i]`and increment `x`.

### Time Complexity:

*   **Time Complexity = O(n)**, where `n = nums.length`.
    

### Space Complexity:

*   **Space Complexity = O(1)**(constant extra space).
    

### Dry Run

```
Input: [0, 1, 2, 2, 3, 0, 4, 2], val = 2

Initial state: 
  x = 0 

i = 0 → nums[0] = 0 ≠ 2 → nums[0] = 0, x = 1
i = 1 → nums[1] = 1 ≠ 2 → nums[1] = 1, x = 2
i = 2 → nums[2] = 2 = 2 → skip
i = 3 → nums[3] = 2 = 2 → skip
i = 4 → nums[4] = 3 ≠ 2 → nums[2] = 3, x = 3
i = 5 → nums[5] = 0 ≠ 2 → nums[3] = 0, x = 4
i = 6 → nums[6] = 4 ≠ 2 → nums[4] = 4, x = 5
i = 7 → nums[7] = 2 = 2 → skip
  

Output: k = 5, nums = [0, 1, 3, 0, 4]
```

### Visualisation:

![Remove duplicates](https://namastedev.com/blog/wp-content/uploads/2025/06/Screenshot-2025-06-25-at-10.57.03 PM.png)

### JavaScript Code

```javascript

var removeElement = function(nums, val) {
  let x = 0;
  for (let i = 0; i < nums.length; i++) {
    if (nums[i] != val) {
      nums[x] = nums[i];
      x++;
    }
  }
  return x;
};
```

### Constraints:

* `0 ≤ nums.length ≤ 100`
* `0 ≤ nums[i] ≤ 50`
* `0 ≤ val ≤ 100`

### Important Points to Understand:

**1. In-Place Modification:**
* Must modify the original array, not create a new one.
* Use O(1) extra space.

**2. Order Doesn't Matter:**
* Unlike Remove Duplicates, element order can change.
* This allows for more optimization opportunities.

**3. Two-Pointer Approach:**
* Pointer `x` tracks where to place next valid element.
* Only elements not equal to `val` are kept.

**4. Return Value:**
* Return k = count of elements ≠ val.
* First k elements should contain the valid elements.

### Edge Cases to Consider:

**1. Empty Array:**
* Input: nums = `[]`, val = 0
* Output: 0

**2. All Elements Equal to val:**
* Input: nums =  `[2, 2, 2]`, val = 2
* Output: 0 (all removed)

**3. No Elements Equal to val:**
* Input: nums = `[1, 2, 3]`, val = 4
* Output: 3 (nothing removed)

**4. Single Element - Match:**
* Input: nums = `[5]`, val = 5
* Output: 0

**5. Single Element - No Match:**
* Input: nums = `[5]`, val = 3
* Output: 1

**6. val at Beginning:**
* Input: nums = `[3, 3, 1, 2]`, val = 3
* Output: 2, nums = `[1, 2, _, _]`

**7. val at End:**
* Input: nums = `[1, 2, 3, 3]`, val = 3
* Output: 2, nums = `[1, 2, _, _]`

### Key Takeaways:

1. **Two-pointer technique** efficiently removes elements in-place.

2. **No sorting required:** Works on any array order.

3. **Order flexibility:** Since order doesn't matter, we can overwrite freely.

4. **O(N) time, O(1) space:** Optimal solution for this problem.

5. **Applications:**
   * Filtering arrays
   * Data cleanup
   * Preprocessing for algorithms

6. **Interview strategy:**
   * Clarify that order doesn't matter.
   * Explain the two-pointer approach.
   * Walk through an example.
   * Mention edge cases.

7. **Comparison with Remove Duplicates:**
   * Remove Element: any order, removes specific value.
   * Remove Duplicates: preserves order, removes duplicate values.

8. **Common mistakes:**
   * Creating new array instead of in-place modification.
   * Not handling empty array.
   * Forgetting to return count.

9. **Related problems:**
   * Move Zeroes (move instead of remove).
   * Partition Array.
   * Dutch National Flag problem.

10. **Optimization:** This solution is already optimal - single pass, constant space.