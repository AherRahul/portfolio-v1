---
title: "Missing Number"
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
  - title: "Scaler Notes - Day 33, 18 Apr - DSA: Introduction to Problem Solving"
    type: "documentation"
    url: "https://res.cloudinary.com/duojkrgue/image/upload/v1761497972/Portfolio/scalerNotes/01-dsa-problem-solving_zudvhj.pdf"
    description: "DSA Mathematical foundations"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Missing Number
--------------------

### Problem Statement:
Given an array nums containing `n` distinct numbers in the range `[0, n]`, return the only number in the range that is missing from the array.

<br />

#### Example 1:

**Input:** nums = \[3,0,1\]

**Output:** 2

`Explanation:` n = 3 since there are 3 numbers, so all numbers are in the range \[0,3\]. 2 is the missing number in the range since it does not appear in nums.

<br />

#### Example 2:

**Input:** nums = \[0,1\]

**Output:** 2

`Explanation:` n = 2 since there are 2 numbers, so all numbers are in the range \[0,2\]. 2 is the missing number in the range since it does not appear in nums.

<br />

#### Example 3:

**Input:** nums = \[9,6,4,2,3,5,7,0,1\]

**Output:** 8

`Explanation:` n = 9 since there are 9 numbers, so all numbers are in the range \[0,9\]. 8 is the missing number in the range since it does not appear in nums.

### Constraints:

*   `n == nums.length`
*   `1 <= n <= 10 4`
*   `0 <= nums[i] <= n`
*   `All the numbers of nums are unique.`

### Approach 1 (Brute-force with sorting and comparison):

*   **Sort the array**.
*   Loop from index `1` to `n - 1`
*   If `nums[i] != nums[i-1] + 1`, return `nums[i-1] + 1` as the missing number.
*   If no such mismatch is found:
*   If `nums[0] != 0`, return `0`.
*   Else return `n`.

### Time Complexity:

*   **Time Complexity = O(n log n)** Due to sorting the array.
    

### Space Complexity:

*   **Space Complexity = O(1)** Sorting is done in-place, and only a few variables are used.
    

### Dry Run

```
Input: `Input: nums = [4, 2, 1, 0, 5]

After Sorting: nums = [0, 1, 2, 4, 5]
    Check:
        i = 1 → 1 == 0 + 1
        i = 2 → 2 == 1 + 1
        i = 3 → 4 != 2 + 1 → return 3
    Final return 3
  

Output: 3
```

### Visualisation:

![Stocks](https://namastedev.com/blog/wp-content/uploads/2025/07/Screenshot-2025-07-12-at-9.57.58 AM.png)

### JavaScript Code

```javascript

var missingNumber = function(nums) {
      nums.sort((a, b) => a - b);
      if (nums[0] !== 0) return 0;
      for (let i = 1; i < nums.length; i++) {
          if (nums[i] !== nums[i - 1] + 1) {
              return nums[i - 1] + 1;
          }
      } 
      return nums.length;
  };
         
```

---

### Approach 2 (Optimal using Sum Formula):

*   The **sum of numbers** from `0 to n` is given by the formula:
*   `total_sum = (n × (n + 1)) / 2`
*   Steps are as follows:
    *   **Calculate** total\_sum using the `formula above`.
    *   **Calculate the sum** of all elements in the `input array`.
    *   The **missing** number is `total_sum - sum_of_array`.

### Time Complexity:

*   **Time Complexity = O(n)** We traverse the array once to compute the sum.
    

### Space Complexity:

*   **Space Complexity = O(1)** Only a few variables are used, no extra space proportional to input size.
    

### Dry Run

```
Input: nums = [3, 0, 1]

Step 1: n = nums.length = 3
Step 2: total_sum = (n * (n + 1)) / 2 = (3 * 4) / 2 = 6

Step 3: sum_of_array = 0
        num = 3 → sum_of_array = 3
        num = 0 → sum_of_array = 3
        num = 1 → sum_of_array = 4

Step 4: return total_sum - sum_of_array = 6 - 4 = 2
  

Output: 2
```

### JavaScript Code

```javascript

  var missingNumber = function(nums) {
      let n = nums.length;
      let total_sum = (n * (n + 1)) / 2;
      let sum_of_array = 0;
  
      for (let num of nums) {
          sum_of_array += num;
      }
      return total_sum - sum_of_array;
  };
         
```

### Important Points to Understand:

**1. Missing in Range [0, n]:** Array has n elements, range is [0, n], so exactly one number is missing.
**2. Multiple Approaches:** Sum formula, XOR, sorting, hash set - each with different trade-offs.
**3. Mathematical Formula:** Sum of 0 to n = n × (n + 1) / 2.
**4. XOR Property:** a ^ a = 0, a ^ 0 = a, XOR all gives missing number.

### Edge Cases to Consider:

**1. Missing 0:** Input: [1, 2], Output: 0
**2. Missing n:** Input: [0, 1], Output: 2
**3. Missing Middle:** Input: [0, 2], Output: 1
**4. Single Element:** Input: [0], Output: 1 or Input: [1], Output: 0
**5. Large Array:** n = 10^4, verify no integer overflow.

### Key Takeaways:

1. **XOR approach** is elegant and avoids overflow issues.
2. **Sum formula** is intuitive but watch for overflow with large numbers.
3. **Multiple solutions** with different space-time trade-offs.
4. **Mathematical insight:** Understanding number properties leads to elegant solutions.
5. **Applications:** Data validation, error detection, checksum verification.
6. **Interview strategy:** Explain multiple approaches and their pros/cons.
7. **Common mistakes:** Integer overflow with sum approach, not handling edge cases.
8. **Related problems:** Find duplicate number, first missing positive.
9. **XOR properties:** Powerful tool for many array problems.
10. **Optimization:** XOR approach is O(N) time, O(1) space - optimal!