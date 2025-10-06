---
title: "Problem: Reverse Integer with Overflow Check"
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

Introduction to DSA & Problem Solving – Reverse Integer with Overflow Check
------------------------------------------------------------------------------------------


### Problem Statement
Write a function `reverse(x)` that takes a **32-bit signed integer** and returns its digits reversed.  
If the reversed value **overflows** the 32-bit integer range, return `0`.

### Requirements
- Reverse the digits of the integer (both **positive** and **negative** values).
- Return `0` if the reversed number **exceeds** the range of a 32-bit signed integer.
- The 32-bit signed integer range is **[-2³¹, 2³¹ − 1]** → **[-2147483648, 2147483647]**.

### Constraints
- **Time Complexity:** `O(d)` where `d` = number of digits.  
- **Space Complexity:** `O(1)` — only a few extra variables.

### Examples

| Input | Output | Explanation |
|--------|---------|-------------|
| `123` | `321` | Digits reversed normally. |
| `-123` | `-321` | Sign preserved, digits reversed. |
| `1534236469` | `0` | Overflow occurs after reversal. |

### Step-by-Step Approach

1. **Preserve the Original Number:**  
   Store the input value in `xCopy` to remember its original sign.

2. **Work with Absolute Value:**  
   Use `Math.abs(x)` (or `abs(x)` in other languages) to simplify digit extraction.

3. **Reverse the Digits:**
   - Initialize `rev = 0`.  
   - Loop while `x != 0`:
     1. Extract the last digit: `last = x % 10`
     2. Append it to `rev`: `rev = rev * 10 + last`
     3. Drop the last digit: `x = Math.floor(x / 10)`

4. **Check for Overflow:**  
   Before returning, check if `rev` exceeds the 32-bit signed integer limit.  
   If yes → return `0`.

5. **Restore the Sign:**  
   If the original number (`xCopy`) was negative, return `-rev`; otherwise, return `rev`.

### Visualization

Let’s trace **x = 123**

| Step | x | last | rev (after step) |
|------|----|------|-----------------|
| Start | 123 | - | 0 |
| 1 | 12 | 3 | 3 |
| 2 | 1 | 2 | 32 |
| 3 | 0 | 1 | 321 |

Output → **321**

Now for **x = -123**  
We take the absolute value → 123  
Reverse it → 321  
Then reapply the sign → **-321**

### Code Implementations

```js
var reverse = function(x) {
  
  // Preserve the Original Number
  let xCopy = x;
  let rev = 0;
  
  // Work with Absolute Value
  x = Math.abs(x);

  // Reverse the Digits
  while (x > 0) {
    let last = x % 10;
    rev = rev * 10 + last;
    x = Math.floor(x / 10);
  }

  // Overflow check
  if (rev > 2**31 - 1) return 0;

  // Restore sign
  return xCopy < 0 ? -rev : rev;
};

console.log(reverse(123));   // 321
console.log(reverse(-123));  // -321
console.log(reverse(1534236469)); // 0 (overflow)

```

## Key Takeaways
- Always handle overflow for problems involving integer reversal or arithmetic.
- Use absolute value to simplify digit extraction.
- Preserve the original sign and reapply it after reversal.
- The 32-bit integer limit is:
  - Minimum: -2³¹ = -2147483648
  - Maximum: 2³¹ − 1 = 2147483647
- Time Complexity: O(d) where d = number of digits.
- Space Complexity: O(1)