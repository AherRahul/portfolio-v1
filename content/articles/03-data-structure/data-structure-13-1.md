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

Recursion
------------------

**Recursion is a technique** where a `function calls` itself to solve a problem by **breaking** it down into **smaller sub-problems**.

### Two Parts Of Recursion:
1. **Base Case:** Stop Condition - When to stop calling itself
2. **Recursive Case:** Part where functions call itself


### Base Condition:
*   Every **function call** in `recursion` is stored in the `call stack`. If the recursion is too deep or has no base condition, the call stack keeps growing until memory is exhausted, causing a stack overflow error.
*   A **base condition** is essential in recursion. It stops the recursion when a certain condition is met. Without it, recursion goes infinite and causes a stack overflow. **`if (num === 0) return;`.**


### Real Life Example: 
1. Queue of People
2. Comment Thread
3. Organisational hierachies

### Note
1. Base case must be on the top to stop the recursion.
2. The case of infinite recursion leads to the **STACK OVERFOLW**

### Commom Mistake's
1. Missing Base Case - Stack overflow
2. Not simplyfying the inputs - never reach base case
3. Too deep recursion - large inputs
4. Keeping in mind the time complexity

### Approach:

*   `Problem:` Print numbers from n to 1 using `recursion`.
*   Print the `number`.
*   Recurse with `num - 1`.
*   Stop when `num === 0`.

### Time Complexity: `O(n)`

*   one function call per number from n to 1.
    

### Space Complexity: `O(n)`

*   Due to recursive call stack frames.
    

### JavaScript Code

```javascript

function printDescending(num) {
    if (num === 0) return;
    console.log(num);
    printDescending(num - 1);
}
printDescending(5);       
```