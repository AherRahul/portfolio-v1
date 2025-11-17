---
title: "Remove Duplicates"
description: "Master the foundation of all data structures. Learn array operations, dynamic resizing, multi-dimensional arrays, and advanced array manipulation techniques essential for algorithmic problem-solving."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Array Data Structure Visualization"
    type: "tool"
    url: "https://visualgo.net/en/list"
    description: "Interactive array operations visualization"
  - title: "JavaScript Array Methods Guide"
    type: "reference"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array"
    description: "Complete JavaScript array method documentation"
  - title: "Array Algorithm Practice"
    type: "practice"
    url: "https://leetcode.com/tag/array/"
    description: "Practice problems focusing on array algorithms"
  - title: "Scaler Notes - Day 33, 18 Apr - DSA: Introduction to Problem Solving"
    type: "documentation"
    url: "https://res.cloudinary.com/duojkrgue/image/upload/v1761497972/Portfolio/scalerNotes/01-dsa-problem-solving_zudvhj.pdf"
    description: "DSA Mathematical foundations"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Remove Duplicates 
----------------------------

### Problem Statement:
Given an integer array `nums` sorted in `non-decreasing order`, remove the duplicates `in-place` such that each unique element appears only once. The relative order of the elements should be kept the same. Then return the number of unique elements in nums.

Consider the number of unique elements of `nums` to be `k`. To get accepted, you need to do the following things:

Change the array `nums` such that the first `k` elements of `nums` contain the unique elements in the order they were present in `nums` initially. The remaining elements of `nums` are not important, as well as the size of `nums`. eturn k.

#### Example 1:

**Input:** nums = \[1,1,2\]

**Output:** 2, nums = \[1,2,\_\]

`Explanation:` Your function should return k = 2, with the first two elements of nums being 1 and 2 respectively. It does not matter what you leave beyond the returned k (hence they are underscores).

#### Example 2:

**Input:** nums = \[0,0,1,1,1,2,2,3,3,4\]

**Output:** 5, nums = \[0,1,2,3,4,\_,\_,\_,\_,\_\]

`Explanation:` Your function should return k = 5, with the first five elements of nums being 0, 1, 2, 3, and 4 respectively. It does not matter what you leave beyond the returned k (hence they are underscores).

### Constraints:

1 ≤ `nums.length` ≤ 3 \* 104

\-100 ≤ `nums[i]` ≤ 100

nums is sorted in non-decreasing order.

### Important Points:

**Non-decreasing order:** The array is sorted such that elements can stay the same or increase: `nums[i] <= nums[i+1]`.

**Examples:**

Valid: `[1, 1, 2, 3, 3, 5]`

Invalid: `[3, 2, 1]` (this is decreasing).

**In-place:**

You must modify the given `nums` array itself. You are **not allowed** to use extra arrays for storing the result.

### Approach:

*   `x = 0:`Pointer to track the last unique element's position.
*   Loop through the array from `i = 0`to`nums.length`.
*   If true (new unique value), increment `x` and update `nums[x] = nums[i]`.
*   This shifts the unique value forward in the array.
*   At the end, `x + 1` gives the count of unique elements.

### Time Complexity:

*   The function uses a single loop that iterates through the entire array once.
    
    Each iteration performs constant-time operations (comparisons and assignments).
    
    **Time Complexity = O(n)**, where `n = nums.length`.
    

### Space Complexity:

*   The function modifies the array **in-place**.
    
    Uses only a few extra variables:`x`and`i`.
    
    **Space Complexity = O(1)**(constant extra space).
    

### Dry Run

```
Input: [1, 1, 2, 3, 3, 5]

Initial state: 
  x = 0 

i = 0: nums[i] = 1, nums[x] = 1 → NOT greater → skip
i = 1: nums[i] = 1, nums[x] = 1 → NOT greater → skip
i = 2: nums[i] = 2, nums[x] = 1 → GREATER → x=1, nums[1] = 2
i = 3: nums[i] = 3, nums[x] = 2 → GREATER → x=2, nums[2] = 3
i = 4: nums[i] = 3, nums[x] = 3 → NOT greater → skip
i = 5: nums[i] = 5, nums[x] = 3 → GREATER → x=3, nums[3] = 5

Final array: [1, 2, 3, 5, 3, 5]
Unique count: x + 1 = 4
  

Output: 4 (First 4 elements are unique: [1, 2, 3, 5])
```

### Visualisation:

![Remove duplicates](https://namastedev.com/blog/wp-content/uploads/2025/06/Screenshot-2025-06-25-at-3.20.41 PM.png)

### JavaScript Code

```javascript

 var removeDuplicates = function(nums) {
      let x = 0;
      for (let i = 0; i < nums.length; i++) {
          if (nums[i] > nums[x]) {
              x++;
              nums[x] = nums[i];
          }
      }
      return x + 1;
  }; 
```

### Edge Cases to Consider:

**1. Single Element Array:**
* Input: nums = [1]
* Output: 1 (only one unique element)

**2. All Same Elements:**
* Input: nums = [5, 5, 5, 5]
* Output: 1 (only one unique element: 5)

**3. All Different Elements:**
* Input: nums = [1, 2, 3, 4, 5]
* Output: 5 (all elements are unique)

**4. Two Elements - Same:**
* Input: nums = [1, 1]
* Output: 1

**5. Two Elements - Different:**
* Input: nums = [1, 2]
* Output: 2

**6. Negative Numbers:**
* Input: nums = [-3, -3, -2, -1]
* Output: 3

**7. Large Array:**
* Arrays up to 3 × 10^4 elements should be handled efficiently.

### Key Takeaways:

1. **Two-pointer technique** is efficient for in-place array modifications.

2. **Sorted array property:** Duplicates are adjacent, making detection simple.

3. **In-place modification** saves space - O(1) extra space vs O(N) for creating new array.

4. **Pointer x tracks position:** x always points to the last unique element's position.

5. **Order preservation:** Relative order of unique elements is maintained.

6. **Applications:**
   * Data deduplication
   * Preprocessing for algorithms requiring unique elements
   * Memory optimization in sorted collections

7. **Interview strategy:**
   * Explain the two-pointer approach clearly.
   * Walk through with an example.
   * Mention that array must be sorted.
   * Discuss in-place modification benefit.

8. **Common mistakes:**
   * Not handling empty arrays.
   * Comparing wrong elements (should compare with last unique, not previous).
   * Forgetting to return x + 1 (count, not index).

9. **Related problems:**
   * Remove duplicates allowing at most k occurrences.
   * Remove duplicates from unsorted array.
   * Find duplicates in array.

10. **Performance:** O(N) time with O(1) space is optimal for this problem.