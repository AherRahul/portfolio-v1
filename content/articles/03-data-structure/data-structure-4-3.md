---
title: "Leaders in an Array"
description: "Master the concept of leaders in an array using the carry forward technique. Learn how to find elements that are greater than all elements to their right efficiently in a single pass."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Array Problems"
    type: "reference"
    url: "https://www.geeksforgeeks.org/leaders-in-an-array/"
    description: "Understanding leader elements"
  - title: "Array Visualization"
    type: "tool"
    url: "https://visualgo.net/en/array"
    description: "Visualize array traversal"
  - title: "Array Practice"
    type: "practice"
    url: "https://leetcode.com/tag/array/"
    description: "Practice array problems"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Leaders in an Array
----------------------------

### Problem Statement:

Given an integer array `A` of size `N`, find all the **leader elements** in the array.

An element is called a **leader** if it is **greater than all the elements to its right side**. The rightmost element is always a leader.

Return an array containing all leader elements in the order they appear in the original array.

### Examples:

#### Example 1:

**Input:** A = [16, 17, 4, 3, 5, 2]

**Output:** [17, 5, 2]

**Explanation:**
* 17 is greater than all elements to its right (4, 3, 5, 2)
* 5 is greater than all elements to its right (2)
* 2 is the rightmost element (always a leader)

#### Example 2:

**Input:** A = [5, 4, 3, 2, 1]

**Output:** [5, 4, 3, 2, 1]

**Explanation:** Since the array is in descending order, every element is a leader.

#### Example 3:

**Input:** A = [1, 2, 3, 4, 5]

**Output:** [5]

**Explanation:** Only the last element is a leader (ascending order).

#### Example 4:

**Input:** A = [7, 10, 4, 3, 6, 5, 2]

**Output:** [10, 6, 5, 2]

**Explanation:**
* 10 > all elements to its right
* 6 > 5, 2
* 5 > 2
* 2 is rightmost

### Constraints:

* `1 ≤ N ≤ 10^5`
* `-10^9 ≤ A[i] ≤ 10^9`

### Important Points to Understand:

**1. Leader Definition:**
* Must be **greater than** (not greater than or equal to) all elements to its right.
* Rightmost element is always a leader by definition.

**2. Carry Forward from Right:**
* Traverse from right to left.
* Track the maximum element seen so far from the right.
* If current element > max, it's a leader.

**3. Order Preservation:**
* Output should maintain the original order of leaders.
* Can reverse at the end if building from right to left.

**4. Optimization:**
* Brute force: O(N²) - for each element, check all elements to its right.
* Optimized: O(N) - single pass from right to left.

### Approach:

**Brute Force Approach:**
1. For each element at index i.
2. Check if it's greater than all elements from i+1 to N-1.
3. If yes, add to result.

**Optimized Approach (Carry Forward):**
1. Start from the rightmost element.
2. Track `maxRight` - maximum element seen so far from right.
3. If current element > maxRight, it's a leader.
4. Update maxRight as we move left.
5. Reverse the result to maintain original order.

### Time Complexity:

**Brute Force:**
* **Time Complexity = O(N²)** - For each element, scan remaining array.

**Optimized:**
* **Time Complexity = O(N)** - Single pass from right to left.

### Space Complexity:

* **Space Complexity = O(K)** where K = number of leaders.
* In worst case (descending array), K = N.

### Dry Run - Brute Force:

```
Input: A = [16, 17, 4, 3, 5, 2]

i = 0 (16):
    Check if 16 > all of [17, 4, 3, 5, 2]
    16 < 17 → NOT a leader

i = 1 (17):
    Check if 17 > all of [4, 3, 5, 2]
    17 > 4 ✓, 17 > 3 ✓, 17 > 5 ✓, 17 > 2 ✓
    → IS a leader

i = 2 (4):
    Check if 4 > all of [3, 5, 2]
    4 > 3 ✓, but 4 < 5 ✗
    → NOT a leader

i = 3 (3):
    Check if 3 > all of [5, 2]
    3 < 5 → NOT a leader

i = 4 (5):
    Check if 5 > all of [2]
    5 > 2 ✓
    → IS a leader

i = 5 (2):
    Rightmost → IS a leader

Leaders = [17, 5, 2]

Output: [17, 5, 2]
```

### Dry Run - Optimized:

```
Input: A = [16, 17, 4, 3, 5, 2]

Initialize: maxRight = -Infinity, leaders = []

Traverse RIGHT to LEFT:

i = 5, A[5] = 2
    2 > -Infinity → Leader!
    leaders = [2]
    maxRight = 2

i = 4, A[4] = 5
    5 > 2 → Leader!
    leaders = [2, 5]
    maxRight = 5

i = 3, A[3] = 3
    3 < 5 → NOT a leader
    maxRight = 5

i = 2, A[2] = 4
    4 < 5 → NOT a leader
    maxRight = 5

i = 1, A[1] = 17
    17 > 5 → Leader!
    leaders = [2, 5, 17]
    maxRight = 17

i = 0, A[0] = 16
    16 < 17 → NOT a leader
    maxRight = 17

Reverse leaders: [17, 5, 2]

Output: [17, 5, 2]
```

### Brute Force Approach - JavaScript Code:

```javascript
function findLeaders_BruteForce(A) {
    const N = A.length;
    const leaders = [];
    
    for (let i = 0; i < N; i++) {
        let isLeader = true;
        
        // Check if A[i] is greater than all elements to its right
        for (let j = i + 1; j < N; j++) {
            if (A[i] <= A[j]) {
                isLeader = false;
                break;
            }
        }
        
        if (isLeader) {
            leaders.push(A[i]);
        }
    }
    
    return leaders;
}
```

**Time:** O(N²) ❌
**Space:** O(K) where K = number of leaders

### Visualization:

```
Array: [16, 17, 4, 3, 5, 2]

Traverse RIGHT to LEFT, tracking max:

Step 1: Index 5 (value 2)
    [16, 17, 4, 3, 5, 2]
                        ↑
    maxRight = -∞
    2 > -∞ → LEADER ✓
    Update maxRight = 2

Step 2: Index 4 (value 5)
    [16, 17, 4, 3, 5, 2]
                    ↑
    maxRight = 2
    5 > 2 → LEADER ✓
    Update maxRight = 5

Step 3: Index 3 (value 3)
    [16, 17, 4, 3, 5, 2]
                ↑
    maxRight = 5
    3 < 5 → NOT leader ✗

Step 4: Index 2 (value 4)
    [16, 17, 4, 3, 5, 2]
            ↑
    maxRight = 5
    4 < 5 → NOT leader ✗

Step 5: Index 1 (value 17)
    [16, 17, 4, 3, 5, 2]
        ↑
    maxRight = 5
    17 > 5 → LEADER ✓
    Update maxRight = 17

Step 6: Index 0 (value 16)
    [16, 17, 4, 3, 5, 2]
    ↑
    maxRight = 17
    16 < 17 → NOT leader ✗

Leaders found (in reverse): [2, 5, 17]
Reverse to get: [17, 5, 2]
```

### Optimal Approach - Carry Forward:

```javascript
function findLeaders(A) {
    const N = A.length;
    const leaders = [];
    let maxRight = -Infinity;
    
    // Traverse from right to left
    for (let i = N - 1; i >= 0; i--) {
        if (A[i] > maxRight) {
            leaders.push(A[i]);
            maxRight = A[i];
        }
    }
    
    // Reverse to maintain original order
    return leaders.reverse();
}
```

**Time:** O(N) ✓
**Space:** O(K) ✓

### Alternative Approach - Without Reverse:

```javascript
function findLeaders_NoReverse(A) {
    const N = A.length;
    const leaders = [];
    let maxRight = -Infinity;
    
    // Traverse from right to left
    for (let i = N - 1; i >= 0; i--) {
        if (A[i] > maxRight) {
            // Insert at beginning to maintain order
            leaders.unshift(A[i]);
            maxRight = A[i];
        }
    }
    
    return leaders;
}
```

**Note:** `unshift()` is O(K) for each insertion, making total O(N×K) in worst case. Reverse approach is better!

### Edge Cases to Consider:

**1. Single Element:**
* Input: A = [5]
* Output: [5] (always a leader)

**2. All Descending:**
* Input: A = [5, 4, 3, 2, 1]
* Output: [5, 4, 3, 2, 1] (all are leaders)

**3. All Ascending:**
* Input: A = [1, 2, 3, 4, 5]
* Output: [5] (only last is leader)

**4. All Same Elements:**
* Input: A = [5, 5, 5, 5]
* Output: [5] (only last, since need strictly greater)

**5. Negative Numbers:**
* Input: A = [-1, -5, -3, -2]
* Output: [-1, -2] (-1 > all right, -2 is last)

**6. Mixed Positive/Negative:**
* Input: A = [10, -5, 8, -3]
* Output: [10, 8, -3]

**7. Two Elements:**
* Input: A = [10, 5]
* Output: [10, 5] (first > second, second is last)

### Key Takeaways:

1. **Right-to-left traversal** is key for O(N) solution.

2. **Carry forward maximum:** Track the maximum seen so far from the right.

3. **Rightmost is always leader:** Don't forget this special case.

4. **Reverse for order:** Building from right requires reversal for correct output order.

5. **Strictly greater:** Leader must be > not ≥ elements to its right.

6. **Applications:**
   * Stock market analysis (finding price peaks)
   * Game leaderboards
   * Performance monitoring
   * Finding dominant elements

7. **Interview strategy:**
   * Start with brute force explanation.
   * Optimize using right-to-left scan.
   * Explain why we track maximum from right.
   * Discuss the reversal step.

8. **Common mistakes:**
   * Using >= instead of > (wrong comparison).
   * Forgetting to add rightmost element.
   * Not reversing the result.
   * Traversing left-to-right (much harder to optimize).

9. **Pattern recognition:** This right-to-left carry forward pattern appears in:
   * Next greater element problems
   * Stock span problems
   * Monotonic stack problems

10. **Related problems:**
    * Next greater element
    * Stock span
    * Trapping rain water
    * Maximum element in subarray

11. **Optimization note:** 
    * Using `reverse()` at end: O(N) + O(K) total
    * Using `unshift()` during iteration: O(N × K) worst case
    * Reverse approach is better!

12. **Interview follow-up:** "What if we need leaders from left?" 
    * Answer: Reverse problem - find elements smaller than all to their left.
    * Or: Find elements greater than all to their left (easier - left-to-right scan).

