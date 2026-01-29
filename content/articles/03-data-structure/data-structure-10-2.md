---
title: "Two Sum – Optimized Solution (JavaScript)"
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

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Two Sum – Optimized Solution (JavaScript)
-----------------------

### Problem Statement
You are given an array of integers `nums` and an integer `target`.  
Return the indices of the two numbers such that they add up to the target.  

**Rules:**
- Each input has exactly one solution.
- You may not use the same element twice.
- The answer can be returned in any order.

### Approach - 1: Brute Force (Nested Loops)

```javascript
var twoSum = function(nums, target) {      
    for (let x = 0; x < nums.length; x++) {          
        for (let i = x + 1; i < nums.length; i++) {              
            if (nums[x] + nums[i] === target) {                  
                return [x, i];              
            }          
        }      
    }  
}
```

### What’s Good

* Simple and easy to understand.
* Works correctly for all valid inputs.
* Uses no extra space (O(1) space complexity).
    

### What’s the Issue

**1. Time Complexity = O(n²)**: You’re using **two nested loops**:

*   The outer loop runs n times.
*   The inner loop runs up to n - 1 times.So, total comparisons ≈ n × (n-1)/2 → **O(n²)**.
    

That means:
*   For n = 1,000 elements → ~500,000 operations.
*   For n = 10⁵ → ~5 \* 10⁹ (billions!) → very slow 

This approach **does not scale well** for large arrays.
    
**2. Inefficient for Real-World Data**: When working with larger datasets (thousands or millions of entries), this approach becomes computationally expensive and slows down execution dramatically.

---

### Approach - 2: Using HashMap (Optimal Solution)
Instead of checking every pair (which is O(n²)), we use a **HashMap** to store numbers as we iterate.  
For each element, we check if its complement (`target - nums[i]`) already exists in the map.

If it does, we’ve found our pair!  
If not, we store the current number and its index in the map.

### Algorithm Steps:
1. Initialize an empty `Map()`.
2. Loop through each element `nums[i]`:
   - Compute `complement = target - nums[i]`.
   - If `map` already has this `complement`, return `[map.get(complement), i]`.
   - Else, store the current number with its index → `map.set(nums[i], i)`.
3. If no pair found (theoretically shouldn’t happen), return an empty array.

### Input:
* nums = \[ 2, 7, 11, 15 \];
* target = 9;

### Process:
*   i = 0 → num = 2 → complement = 7 → not in map → store { 2: 0 }
*   i = 1 → num = 7 → complement = 2 → found! return \[ 0, 1 \]
    

### Output:
`   [0, 1]   `

### Time & Space Complexity
* **Time:** O(n) Each element is visited once 
* **Space:** O(n) Map stores up to n elements

### Visualization
| i | nums(i) | complement | map (before) | Action               |
| - | ------- | ---------- | ------------ | -------------------- |
| 0 | 2       | 7          | {}           | Store (2 → 0)        |
| 1 | 7       | 2          | {2: 0}       | Found! return \[ 0, 1 \] |


### Optimized JavaScript Code

```javascript
function twoSum(nums, target) {
    // Initialize an empty Map()
    const map = new Map(); // stores {num: index}    
    
    // Loop through each element nums[i]
    for (let i = 0; i < nums.length; i++) {
      
        // Compute complement = target - nums[i]
        const complement = target - nums[i];      
        
        // map already has this complement
        if (map.has(complement)) {        
            return [map.get(complement), i];      
        }      
        
        // store the current number with its index
        map.set(nums[i], i);    
    }    
    return []; // no valid pair (shouldn’t happen as per problem)  
}  

console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]   
```

### Comparison Table
| Approach                | Code Style  | Time Complexity | Space | Suitable For                  |
| ----------------------- | ----------- | --------------- | ----- | ----------------------------- |
| **Brute Force**         | Two loops   | O(n²)           | O(1)  | Small input sizes             |
| **Optimized (HashMap)** | Single loop | O(n)            | O(n)  | Large inputs / production use |


### Key Insight
Using a **HashMap** allows constant-time lookups for the complement, reducing complexity from **O(n²)** → **O(n)** — a must-know trick for interviews.

### Core Assumption
> "Each input would have **exactly one solution**, and you may not use the same element twice." That means:

*   No need to handle multiple pairs.
*   We’ll always find one valid pair.