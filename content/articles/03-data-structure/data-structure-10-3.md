---
title: "Contains Duplicate – Optimized Solution (JavaScript)"
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

Contains Duplicate – Optimized Solution (JavaScript)
-----------------------

### Problem Statement
Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct. 

### **Example 1**
* `Input: nums = [1, 2, 3, 1] Output: true`

### **Example 2**
* `Input: nums = [1, 2, 3, 4] Output: false`

### Approach 1: Brute Force (O(n²))
Compare every pair using nested loops.

```javascript

var containsDuplicate = function(nums) {
  for (let i = 0; i < nums.length; i++) {     
    for (let j = i + 1; j < nums.length; j++) {       
      if (nums[i] === nums[j]) return true;     
    }   
  }   
  return false; 
};
```

> This approch will Works, But too slow for large arrays (LeetCode: TLE when n > 10⁴)

---
### Approach 2: Using Sorting (O(n log n) Time | O(1) or O(log n) Space)

### Logic

* Sort the array first.
* Then, any duplicates will be adjacent.
* Check if `nums[i] === nums[i + 1]`.

### Code

```javascript
var containsDuplicate = function(nums) {
    nums.sort((a, b) => a - b);

    for (let i = 0; i < nums.length - 1; i++) {
        if (nums[i] === nums[i + 1]) return true;
    }
    
    return false;
};

```
---
### Approach 3: Using a **Set** (O(n) Time | O(n) Space) - Optimized
A **Set** stores only _unique_ values.  
So, if we ever find a number that already exists in the Set — it’s a duplicate.

### Algorithm
1.  Create an empty `Set`.
2.  Loop through each number in `nums`.
3.  If the number already exists in the `Set`, return `true`.
4.  Otherwise, add it to the `Set`.
5.  If the loop completes with no duplicates → return `false`.
    
#### Optimized JavaScript Solution
```javascript
var containsDuplicate = function(nums) {

  // Create an empty set
  const seen = new Set();
  
  // Loop through each number in nums.
  for (let num of nums) {  
    
    // If the number already exists
    if (seen.has(num)) return true;   // Duplicate found
         
    // Otherwise, add it to the Set.
    seen.add(num);   
  }   
  
  // no duplicates
  return false; // All unique 
};
```

### Example Trace

* **Input:** `nums = [1, 2, 3, 1]`

| Step | num | Set Content | Action |
| --- | --- | --- | --- |
| 1   | 1   | `{}` | Add 1 |
| 2   | 2   | `{1}` | Add 2 |
| 3   | 3   | `{1,2}` | Add 3 |
| 4   | 1   | `{1,2,3}` | Already in Set → return `true` |

* **Output:** `true`


### Complexity Analysis

| Metric | Complexity |
| --- | --- |
| **Time** | O(n) — single pass through array |
| **Space** | O(n) — Set may store up to all elements |


### Alternate One-liner (using Set size comparison)

```javascript
var containsDuplicate = nums => new Set(nums).size !== nums.length;
```

* Same logic, shorter syntax  
* Slightly less readable in interviews


### Summary

| Approach | Time | Space | Remarks |
| --- | --- | --- | --- |
| Brute Force | O(n²) | O(1) | Simple but inefficient |
| Sorting | O(n log n) | O(1) or O(n) | Can check adjacent elements |
| **Set (Optimized)** | **O(n)** | **O(n)** | Best tradeoff between speed & clarity |
