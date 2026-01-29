---
title: "Single Number"
description: "Understand First-In-First-Out (FIFO) processing. Learn queue operations, circular queues, priority queues, deques, and queue applications in algorithms and system design."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
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

Single Number
-----------------------

### Problem Statement:

Given a **non-empty** array of integers `nums`, every element appears twice except for one. **Find that single one**.

**You must implement a solution with a linear runtime complexity and use only constant extra space.**

<br />

#### Example 1:

**Input:** nums = \[2, 2, 1\]

**Output:** 1

<br />

#### Example 2:

**Input:** nums = \[4, 1, 2, 1, 2\]

**Output:** 4

<br />

#### Example 3:

**Input:** nums = \[1\]

**Output:** 1

### Constraints:

*   `1 ≤ nums.length ≤ 3 × 104`
*   `-3 × 104 ≤ nums[i] ≤ 3 × 104`
*   `Each element appears twice except one that appears only once.`

### Approach 1 (Brute-force Hash Map):

*   **Create an empty** `hash map` to store counts of each element.
*   Loop through the `array`, **update the count** for each element.
*   Loop again to **find the element** with count `1` and return it.

### Time Complexity:

*   **Time Complexity = O(n)** We traverse the array twice: once for counting and once for checking.
    

### Space Complexity:

*   **Space Complexity = O(n)** The hash map may store counts for up to `n` elements in the worst case.
    

### Dry Run
```
Input: nums = [4, 2, 1, 0, 5]

Step 1: Initialize hash = {}

First loop (counting occurrences):
    i = 0 → nums[0] = 4 → not in hash → hash = {4: 1}
    i = 1 → nums[1] = 2 → not in hash → hash = {4: 1, 2: 1}
    i = 2 → nums[2] = 1 → not in hash → hash = {4: 1, 2: 1, 1: 1}
    i = 3 → nums[3] = 0 → not in hash → hash = {4: 1, 2: 1, 1: 1, 0: 1}
    i = 4 → nums[4] = 5 → not in hash → hash = {4: 1, 2: 1, 1: 1, 0: 1, 5: 1}

After first loop: hash = {4: 1, 2: 1, 1: 1, 0: 1, 5: 1}

Second loop (finding element with count = 1):
    i = 0 → nums[0] = 4 → hash[4] = 1 → return 4

Final return = 4
  
Output: 4
```

### JavaScript Code

```javascript

var singleNumber = function(nums) {
    let hash = {};
    for (let i = 0; i < nums.length; i++) {
        if (!hash[nums[i]]) {
            hash[nums[i]] = 1;
        } else {
            hash[nums[i]]++;
        }
    }
    for (let i = 0; i < nums.length; i++) {
        if (hash[nums[i]] === 1) {
            return nums[i];
        }
    }
};
         
```

--- 

### Approach 2 (Optimal using XOR):

*   `XOR` of two **same numbers** is 0: `a ^ a = 0`.
*   `XOR` of a number with `0` is the number itself: `a ^ 0 = a`
*   So, if all elements occur **twice except one**, XOR-ing all gives that **unique number**.

### Time Complexity:

*   **Time Complexity = O(n)** where n is the number of elements in the array.
    

### Space Complexity:

*   **Space Complexity = O(1)** No extra space used.
    

### Dry Run
```
Input: nums = [4, 2, 1, 0, 5]

Step 1: Initialize xor = 0

Loop through array:
    i = 0 → xor = 0 ^ 4 = 4
    i = 1 → xor = 4 ^ 2 = 6
    i = 2 → xor = 6 ^ 1 = 7
    i = 3 → xor = 7 ^ 0 = 7
    i = 4 → xor = 7 ^ 5 = 2

Final xor = 2
  

Output: 2
```

### JavaScript Code

```javascript

  var singleNumber = function(nums) {
      let xor = 0;
      for (let i = 0; i < nums.length; i++) {
          xor = xor ^ nums[i];
      }
      return xor;
  };
         
```

### Important Points to Understand:

**1. Every Element Appears Twice Except One:** This property makes XOR perfect for this problem.
**2. XOR Properties:** a ^ a = 0 (same numbers cancel), a ^ 0 = a (identity).
**3. Commutative and Associative:** Order doesn't matter with XOR.
**4. Linear Constraint:** Must solve in O(N) time with O(1) space.

### Edge Cases to Consider:

**1. Single Element:** Input: [1], Output: 1
**2. Three Elements:** Input: [1, 2, 1], Output: 2
**3. Large Array:** Handle arrays up to 3 × 10^4 elements efficiently.
**4. Negative Numbers:** Input: [-1, -2, -1], Output: -2
**5. Zero Present:** Input: [0, 1, 0], Output: 1

### Key Takeaways:

1. **XOR is the key:** Brute force uses hash map (O(N) space), XOR uses O(1) space.
2. **Bit manipulation:** Understanding bitwise operations unlocks elegant solutions.
3. **Two approaches:** Hash map (intuitive) vs XOR (optimal).
4. **Space-time trade-off:** XOR sacrifices code clarity for space efficiency.
5. **Applications:** Error detection, data deduplication, cryptography basics.
6. **Interview strategy:** Start with hash map, then optimize to XOR.
7. **Common mistakes:** Not considering XOR approach, forgetting edge cases.
8. **Related problems:** Single number II (appears 3 times), single number III (two unique).
9. **Pattern:** XOR cancellation pattern appears in many bit manipulation problems.
10. **Foundation:** This problem teaches core bit manipulation concepts for interviews.