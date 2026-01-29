---
title: "Reverse String"
description: "Understand dynamic memory allocation and pointer manipulation. Master singly linked lists, doubly linked lists, circular lists, and advanced linked list operations and algorithms."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Linked List Visualizations"
    type: "tool"
    url: "https://visualgo.net/en/list"
    description: "Interactive linked list operations visualization"
  - title: "Linked List Problems"
    type: "practice"
    url: "https://leetcode.com/tag/linked-list/"
    description: "Practice problems for mastering linked list algorithms"
  - title: "Memory Management Guide"
    type: "reference"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management"
    description: "Understanding memory allocation and garbage collection"
  - title: "Scaler Notes - Day 33, 18 Apr - DSA: Introduction to Problem Solving"
    type: "documentation"
    url: "https://res.cloudinary.com/duojkrgue/image/upload/v1761497972/Portfolio/scalerNotes/01-dsa-problem-solving_zudvhj.pdf"
    description: "DSA Mathematical foundations"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)


Reverse String 
---------------------

### Problem Statement:

Write a function that reverses a string. The input string is given as an array of characters `s`. You must do this by modifying the input array in-place with `O(1)`extra memory.

<br />

#### Example 1:

**Input:** = \[“h”,”e”,”l”,”l”,”o”\]

**Output:** = \[“o”,”l”,”l”,”e”,”h”\]

<br />

#### Example 2:

**Input:** = \[“H”,”a”,”n”,”n”,”a”,”h”\]

**Output:** = \[“h”,”a”,”n”,”n”,”a”,”H”\]


### Approach: Two Pointer Technique

*   Initialize two pointers, one at the start and one at the end of the array.
*   Swap the characters at both pointers.
*   Move the pointers towards the center until they meet.

### Time Complexity:

*   **Time Complexity = O(n)**
    

### Space Complexity:

*   **Space Complexity = O(1)**
    

### Dry Run

```
Input: = ["h", "e", "l", "l", "o"]

len = 5, halfLen = 2
                    
i = 0 → swap [0] and [4] → ["o", "e", "l", "l", "h"]
i = 1 → swap [1] and [3] → ["o", "l", "l", "e", "h"]
  

Output: ["o", "l", "l", "e", "h"]
```

### Visualisation:

![Reverse String](https://namastedev.com/blog/wp-content/uploads/2025/06/Screenshot-2026-06-26-at-8.19.31 PM.png)

### JavaScript Code

```javascript

var reverseString = function(s) {
    let len = s.length;
    let halfLen = Math.floor(len / 2);

    for (let i = 0; i < halfLen; i++) {
        let temp = s[i];
        s[i] = s[len - i - 1];
        s[len - i - 1] = temp;
    }
};
         
```

### Constraints:

* `1 ≤ s.length ≤ 10^5`
* s[i] is a printable ASCII character

### Important Points to Understand:

**1. In-Place Requirement:**
* Must modify the input array directly.
* O(1) extra space (only temp variable for swapping).

**2. Character Array:**
* Input is an array of characters, not a string.
* JavaScript strings are immutable, arrays are mutable.

**3. Two-Pointer Pattern:**
* Swap elements from both ends moving toward center.
* Only need to swap first half with second half.

**4. Symmetry:**
* Middle element (if odd length) doesn't need to move.

### Edge Cases to Consider:

**1. Single Character:**
* Input: s = ["a"]
* Output: ["a"] (no change needed)

**2. Two Characters:**
* Input: s = ["a", "b"]
* Output: ["b", "a"]

**3. Palindrome:**
* Input: s = ["r", "a", "c", "e", "c", "a", "r"]
* Output: ["r", "a", "c", "e", "c", "a", "r"] (stays same)

**4. Odd Length:**
* Input: s = ["a", "b", "c"]
* Output: ["c", "b", "a"]
* Middle element 'b' doesn't move.

**5. Even Length:**
* Input: s = ["a", "b", "c", "d"]
* Output: ["d", "c", "b", "a"]

**6. Special Characters:**
* Input: s = ["!", "@", "#"]
* Output: ["#", "@", "!"]

**7. Numbers as Characters:**
* Input: s = ["1", "2", "3"]
* Output: ["3", "2", "1"]

### Brute Force Approach:

**Using Extra Space:**
```javascript
var reverseStringBruteForce = function(s) {
    const reversed = [];
    
    // Copy in reverse order
    for (let i = s.length - 1; i >= 0; i--) {
        reversed.push(s[i]);
    }
    
    // Copy back
    for (let i = 0; i < s.length; i++) {
        s[i] = reversed[i];
    }
};
```

**Time:** O(N)
**Space:** O(N) ❌ (violates O(1) space requirement)

### Multiple Optimized Approaches:

**Approach 1: Two Pointers (Current Solution)**
```javascript
var reverseString = function(s) {
    let left = 0;
    let right = s.length - 1;
    
    while (left < right) {
        // Swap
        [s[left], s[right]] = [s[right], s[left]];
        left++;
        right--;
    }
};
```

**Approach 2: For Loop with Half Length**
```javascript
var reverseString = function(s) {
    const len = s.length;
    const halfLen = Math.floor(len / 2);
    
    for (let i = 0; i < halfLen; i++) {
        const temp = s[i];
        s[i] = s[len - 1 - i];
        s[len - 1 - i] = temp;
    }
};
```

**Approach 3: Recursion** (Not O(1) space due to call stack)
```javascript
var reverseString = function(s, left = 0, right = s.length - 1) {
    if (left >= right) return;
    
    [s[left], s[right]] = [s[right], s[left]];
    reverseString(s, left + 1, right - 1);
};
```

**Time:** O(N)
**Space:** O(N) due to recursion stack ❌

### Key Takeaways:

1. **Two-pointer technique** is the standard for reversing arrays/strings.

2. **In-place operations** are crucial for space optimization.

3. **Swapping techniques:**
   * Using temp variable
   * Using array destructuring: [a, b] = [b, a]
   * Using XOR (for numbers only)

4. **Half iterations:** Only need N/2 swaps.

5. **Foundation skill:** Reversing is used in many advanced problems:
   * Palindrome checking
   * Array rotation
   * String manipulation
   * Matrix transformations

6. **Interview strategy:**
   * Start with two-pointer explanation.
   * Mention space complexity requirement.
   * Walk through with odd and even length examples.
   * Discuss why we only iterate to midpoint.

7. **Common mistakes:**
   * Going beyond midpoint (causes double reversal).
   * Not handling empty or single-element arrays.
   * Using extra space (violates constraint).

8. **Related problems:**
   * Reverse words in a string.
   * Rotate array.
   * Palindrome problems.
   * Reverse linked list.

9. **Applications:**
   * Text processing
   * Data serialization
   * Encryption/encoding
   * Game development (mirror effects)

10. **Performance:** O(N) time, O(1) space is optimal for in-place reversal.