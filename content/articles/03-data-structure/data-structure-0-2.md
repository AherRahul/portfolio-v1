---
title: "Problem: Palindrome Number"
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

Introduction to DSA & Problem Solving – Problem: Palindrome Number

### Problem Statement
Write a function **`isPalindrome(x)`** that takes an integer `x` and returns `true` if it reads the same backward and forward; otherwise, returns `false`.


### Requirements
- Must handle both **positive** and **negative** integers.  
- Return **false** for negative numbers (since `-121` ≠ `121-`).  


### Constraints
| Metric | Complexity |
|--------|-------------|
| **Time Complexity** | O(d) — where *d* is the number of digits |
| **Space Complexity** | O(1) — uses constant space |


### Examples
| Input | Output | Explanation |
|-------|---------|-------------|
| `121` | `true` | Reads the same backward and forward |
| `-121` | `false` | Negative sign makes it non-palindromic |
| `10` | `false` | Reverse is `01` which ≠ `10` |



### Step-by-Step Approach

1. **Handle Negatives**  
   If `x < 0`, return `false`.

2. **Store Original Value**  
   Keep a copy of the original number → `xCopy = x`.

3. **Reverse the Number**
   - Initialize `rev = 0`
   - While `x > 0`:
     - `rem = x % 10`
     - `rev = rev * 10 + rem`
     - `x = Math.floor(x / 10)`

4. **Compare Values**
   - If `rev === xCopy`, return `true`
   - Otherwise, return `false`



### Visualization
```
x = 121
rev = 0

Step 1 → rem = 1, rev = 0 * 10 + 1 = 1
Step 2 → rem = 2, rev = 1 * 10 + 2 = 12
Step 3 → rem = 1, rev = 12 * 10 + 1 = 121

rev === xCopy → 121 === 121 → true
```

### Flowchart

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1759767681/Portfolio/dsa/images/00/17f646da-8c0a-4959-b5cd-005d88e26945.png)

### JavaScript Code

```js
var isPalindrome = function(x) {
  
  // Handle Negatives
  if (x < 0) return false;
  
  // Store Original Value
  let xCopy = x;
  let rev = 0;
  
  // Reverse the Number
  while (x > 0) {
    let rem = x % 10;
    rev = rev * 10 + rem;
    x = Math.floor(x / 10);
  }
  
  // Compare Values
  return rev === xCopy;
};

console.log(isPalindrome(121)); // true
```

## Key Takeaways
- Negative integers can never be palindromes.
- Efficient O(1) space and O(d) time.
- Works purely mathematically—no string conversion needed.