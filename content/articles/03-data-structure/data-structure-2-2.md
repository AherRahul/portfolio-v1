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
