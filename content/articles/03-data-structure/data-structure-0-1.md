---
title: "Problem: Count Digits in a Number"
description: "Understanding the importance of data structures and algorithms in programming. Learn systematic problem-solving approaches, algorithmic thinking, and how DSA impacts software performance and efficiency."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Introduction to Algorithms - MIT"
    type: "book"
    url: "https://mitpress.mit.edu/books/introduction-algorithms-third-edition"
    description: "The definitive textbook on algorithms and data structures"
  - title: "Algorithm Visualizations"
    type: "tool"
    url: "https://visualgo.net/"
    description: "Interactive visualizations of algorithms and data structures"
  - title: "LeetCode Practice"
    type: "practice"
    url: "https://leetcode.com/"
    description: "Platform for practicing algorithmic problem solving"
---


![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Introduction to DSA & Problem Solving – Count Digits in a Number
------------------------------------------------------------------------------

###  Problem Statement
Write a function `countDigits(n)` that takes an integer `n` and returns how many digits it contains.

###  Requirements
- Should handle both **positive** and **negative** integers.  
- Should return **1** if `n` is `0` (since `0` is a single-digit number).


###  Examples

| Input | Output | Explanation |
|--------|---------|-------------|
| `259` | `3` | There are three digits: 2, 5, 9 |
| `-1035` | `4` | Sign doesn’t count; digits are 1, 0, 3, 5 |
| `0` | `1` | Zero is considered a single-digit number |



###  Approach

1. **Handle Zero:**  
   If `n == 0`, return `1` immediately since zero has one digit.

2. **Ignore Sign:**  
   Convert the number to positive using `Math.abs(n)`.
 
3. **Initialize a Counter:**  
   Start a variable `count = 0`.

4. **Loop Until the Number Becomes Zero:**  
   - Divide `n` by 10 (integer division) to remove the last digit.  
   - Increment the counter each time.

5. **Return the Count** after the loop finishes.



### Visualization


![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759763477/Portfolio/dsa/images/00/6456018e-4d04-4ec1-aac9-fc62392b4143.png)

Let’s trace the input **259**:

| Step | n (current) | Count |
|------|--------------|-------|
| Start | 259 | 0 |
| After 1st division | 25 | 1 |
| After 2nd division | 2 | 2 |
| After 3rd division | 0 | 3 |

**Output → 3**



### Code Implementations

#### JavaScript

```js
function countDigits(n) {
  
  // If `n == 0`, return `1` immediately since zero has one digit.
  if (n === 0) return 1;
  
  // Convert the number to positive using `Math.abs(n)`.
  n = Math.abs(n);
  
  let count = 0;
  while (n > 0) {
    n = Math.floor(n / 10);
    count++;
  }
  return count;
}

console.log(countDigits(259)); // 3
```

## Key Takeaways
- Always handle zero as a special case.
- Use absolute value to ignore sign.
- Counting digits can be done mathematically (divide by 10) or using string length (str(n) in Python, toString() in JS).
- Time Complexity → O(log₁₀(n))
- Space Complexity → O(1)