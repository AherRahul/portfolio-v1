---
title: "Max Consecutive Ones"
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

Max Consecutive Ones 
--------------------------

### Problem Statement:

Given a binary array `nums`, return the maximum number of consecutive 1’s in the array.

<br />

**Example 1:**

**Input:** nums = \[1,1,0,1,1,1\]

**Output:** `3`

`Explanation` The first two digits or the last three digits are consecutive 1s. The maximum number of consecutive 1s is 3.

<br />

**Example 2:**

**Input:** nums = \[1,0,1,1,0,1\]

**Output:** `2`

### Constraints:

*   1 <= nums.length <= 105
*   nums\[i\] is either 0 or 1.

### Optimal Approach: Single Pass

*   Initialize two variables:
*   `currentCount` → to count current streak of 1s
*   `maxCount` → to keep track of the maximum streak seen so far
*   Traverse the array:
*   If `nums[i] == 1`, increment `currentCount`.
*   If `nums[i] == 0`, compare `currentCount` with `maxCount`, update`maxCount`, then reset `currentCount` to 0.
*   After the loop, return the maximum of `maxCount` and `currentCount` (to handle case where array ends in 1s)

### Visualisation:

![Max 1's](https://namastedev.com/blog/wp-content/uploads/2025/06/Screenshot-2025-06-28-at-10.24.01 PM.png)

### Time Complexity:

*   **Time Complexity = O(n)**
    
*   One pass to shift non-zero elements.

### Space Complexity:

*   **Space Complexity = O(1)**
    
*   No extra space used beyond a few variables.

### Dry Run
```
Input: nums = [1, 1, 0, 1, 1, 1]

i = 0 → nums[i] = 1 → currentCount = 1
i = 1 → nums[i] = 1 → currentCount = 2
i = 2 → nums[i] = 0 → maxCount = 2, currentCount = 0
i = 3 → nums[i] = 1 → currentCount = 1
i = 4 → nums[i] = 1 → currentCount = 2
i = 5 → nums[i] = 1 → currentCount = 3
  

Output: max(2, 3) = 3
```
### JavaScript Code

```javascript

var findMaxConsecutiveOnes = function(nums) {
    let currentCount = 0;
    let maxCount = 0;
    for (let i = 0; i < nums.length; i++) {
      if (nums[i] == 1) {
        currentCount++;
      } else {
        maxCount = Math.max(currentCount, maxCount);
        currentCount = 0;
      }
    }
    return Math.max(maxCount, currentCount);
  };
    
```

### Important Points to Understand:

**1. Consecutive Count:** Track current streak and maximum streak separately.
**2. Reset on Zero:** When encountering 0, compare and reset current count.
**3. Final Check:** Don't forget to check current count after loop ends.
**4. Binary Array:** Only contains 0s and 1s, simplifying the logic.

### Edge Cases to Consider:

**1. All Ones:** Input: [1, 1, 1], Output: 3
**2. All Zeros:** Input: [0, 0, 0], Output: 0
**3. Single One:** Input: [1], Output: 1
**4. Single Zero:** Input: [0], Output: 0
**5. Alternating:** Input: [1, 0, 1, 0], Output: 1
**6. Ones at End:** Input: [0, 1, 1, 1], Output: 3
**7. Ones at Start:** Input: [1, 1, 1, 0], Output: 3

### Key Takeaways:

1. **Single pass solution** with O(N) time, O(1) space.
2. **Track two values:** Current streak and maximum streak.
3. **Reset pattern:** Common in consecutive/streak problems.
4. **Final comparison:** Always check current count after loop.
5. **Applications:** Streak analysis, pattern detection, time series.
6. **Interview strategy:** Explain the reset logic clearly.
7. **Common mistake:** Forgetting final comparison when array ends with 1s.
8. **Related problems:** Longest consecutive sequence, max consecutive ones III.
9. **Variation:** Can be extended to find longest subarray with at most k zeros.
10. **Pattern recognition:** This pattern appears in many sequential problems.