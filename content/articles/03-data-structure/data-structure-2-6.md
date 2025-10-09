---
title: "Move Zeros"
description: "Understand First-In-First-Out (FIFO) processing. Learn queue operations, circular queues, priority queues, deques, and queue applications in algorithms and system design."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Queue Visualizations"
    type: "tool"
    url: "https://visualgo.net/en/list"
    description: "Interactive queue operations visualization"
  - title: "Queue Problems Practice"
    type: "practice"
    url: "https://leetcode.com/tag/queue/"
    description: "Practice problems for mastering queue algorithms"
  - title: "Priority Queue Implementation"
    type: "reference"
    url: "https://en.wikipedia.org/wiki/Priority_queue"
    description: "Understanding priority queue data structures"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)


Move Zeros 
-----------------

### Problem Statement:

Given an integer array nums, move all 0’s to the end of it while maintaining the relative order of the non-zero elements.

**Note:**You must do this in-place without making a copy of the array.

<br />

**Example 1:**

**Input:** nums = \[0,1,0,3,12\]

**Output:**`[1,3,12,0,0]`

<br />

**Example 2:**

**Input:** nums = \[0\]

**Output:**`[0]`

### Constraints:

*   1 <= nums.length <= 104
*   \-2 31 <= prices\[i\] <= 104\-1

### Optimal Approach: Two Pointers

*   Initialize a pointer `x = 0`.
*   Loop through the array:
*   If the current element is not 0, assign it to `nums[x]` and increment `x`.
*   After the loop, from index `x` to the end of the array, fill all values with 0.

### Visualisation:

![Move zero](https://namastedev.com/blog/wp-content/uploads/2025/06/Screenshot-2025-06-28-at-8.46.31 PM.png)

## Time Complexity:

*   **Time Complexity = O(n)**
    
*   One pass to shift non-zero elements.
*   Another pass to fill in zeros.

### Space Complexity:

*   **Space Complexity = O(1)**
    
*   In-place modifications with constant extra space.

### Dry Run

```
Input: nums = [0, 1, 0, 3, 12], x = 0

i = 0 → nums[0] = 0 → skip
i = 1 → nums[1] = 1 → nums[0] = 1, x = 1
i = 2 → nums[2] = 0 → skip
i = 3 → nums[3] = 3 → nums[1] = 3, x = 2
i = 4 → nums[4] = 12 → nums[2] = 12, x = 3

Fill remaining with 0s from index 3 onward:
nums[3] = 0
nums[4] = 0
  

Output: [1, 3, 12, 0, 0]
```

### JavaScript Code

```javascript

var moveZeroes = function(nums) {
      let x = 0;
      for (let i = 0; i < nums.length; i++) {
          if (nums[i] !== 0) {
              nums[x] = nums[i];
              x++;
          }
      }
      for (let i = x; i < nums.length; i++) {
          nums[i] = 0;
      }
  };
    
```
