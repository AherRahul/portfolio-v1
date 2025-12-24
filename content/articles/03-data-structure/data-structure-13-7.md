---
title: "Print Reverse String using Recursion"
description: "Reverse and print a string using recursion. Learn how recursion naturally handles reversal operations, understand call stack unwinding for output, and master string processing with recursive techniques."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-12-24"
datePublished: "2025-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "String Manipulation"
    type: "article"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String"
    description: "MDN guide to JavaScript strings"
  - title: "Recursion Visualizer"
    type: "tool"
    url: "https://visualgo.net/en/recursion"
    description: "Visualize recursive string operations"
---


![Recursion Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Reverse and Print a String Using Recursion**

## 2. Problem Statement

Write a recursive function that takes a string **S** as input and **prints the characters of S in reverse order**.

**Input:**
- A string `S` (1 ≤ length ≤ 10000)

**Output:**
- Print the string in reverse order

## 3. Examples

### Example 1:
```
Input: S = "hello"
Output: "olleh"
```

### Example 2:
```
Input: S = "world"
Output: "dlrow"
```

### Example 3:
```
Input: S = "a"
Output: "a"
```

### Example 4:
```
Input: S = "recursion"
Output: "noisrucer"
```

## 4. Constraints

- `1 ≤ length of S ≤ 10000`
- String contains alphanumeric characters
- Must use recursion
- Print reversed string

## 5. Important Points

### Key Insight

**Recursion naturally reverses!** When you print AFTER the recursive call, output happens during stack unwinding, which reverses the order.

**Pattern:**
```
printReverse(str, index):
    if index === length: return
    printReverse(str, index + 1)  // Recurse first
    print(str[index])             // Print on way back
```

### Real-World Applications

- Text processing
- String manipulation
- Palindrome checking
- Data reversal

## 6. Brute Force Approach

Use built-in string methods to reverse.

## 7. Brute Force Code

```javascript
function reverseStringIterative(str) {
    return str.split('').reverse().join('');
}

console.log(reverseStringIterative("hello")); // "olleh"
```

## 8. Dry Run of Brute Force

```
Input: "hello"
Split: ['h', 'e', 'l', 'l', 'o']
Reverse: ['o', 'l', 'l', 'e', 'h']
Join: "olleh"
```

## 9. Time and Space Complexity of Brute Force

- **Time:** O(N)
- **Space:** O(N)

## 10. Visualization (Brute Force)

```
"hello" → ['h','e','l','l','o'] → ['o','l','l','e','h'] → "olleh"
```

## 11. Optimized Approach Description

Use recursion with index to print characters in reverse during stack unwinding.

## 12. Optimized Approach Algorithm

1. Base case: if index >= length, return
2. Recursive call with index + 1
3. Print character at current index (during unwinding)

## 13. Optimized Code

```javascript
/**
 * Print string in reverse using recursion
 * @param {string} str - Input string
 * @param {number} index - Current index
 */
function printReverse(str, index = 0) {
    // Base case
    if (index >= str.length) {
        return;
    }
    
    // Recurse to end
    printReverse(str, index + 1);
    
    // Print during unwinding
    process.stdout.write(str[index]);
}

// Test
printReverse("hello"); // Prints: olleh
```

### Alternative: Character-by-character

```javascript
function reverseString(str) {
    if (str === "") {
        return "";
    }
    return reverseString(str.substr(1)) + str[0];
}

console.log(reverseString("hello")); // "olleh"
```

## 14. Dry Run of Optimized Approach

```
printReverse("hello", 0)
  → printReverse("hello", 1)
    → printReverse("hello", 2)
      → printReverse("hello", 3)
        → printReverse("hello", 4)
          → printReverse("hello", 5) [BASE CASE]
          
Unwinding:
← Print 'o'
← Print 'l'
← Print 'l'
← Print 'e'
← Print 'h'

Output: "olleh"
```

## 15. Time and Space Complexity

- **Time:** O(N) - visit each character once
- **Space:** O(N) - recursion call stack

## 16. Visualization

```
Call Stack for "hello":

printReverse("hello", 0)
  printReverse("hello", 1)
    printReverse("hello", 2)
      printReverse("hello", 3)
        printReverse("hello", 4)
          printReverse("hello", 5) ← BASE CASE
        ← Print 'o'
      ← Print 'l'
    ← Print 'l'
  ← Print 'e'
← Print 'h'

Result: olleh
```

## 17. Edge Cases

### Empty String
```javascript
printReverse(""); // Prints nothing
```

### Single Character
```javascript
printReverse("a"); // Prints: a
```

### Special Characters
```javascript
printReverse("a b!"); // Prints: !b a
```

## 18. Key Takeaways

### a. Applications
- Text processing
- String reversal
- Palindrome creation
- Data transformation

### b. Interview Strategy
- Explain stack unwinding
- Show both approaches
- Discuss complexity
- Handle edge cases

### c. Common Mistakes
- Printing before recursion (wrong order)
- Missing base case
- Not handling empty strings

### d. Related Problems
- Reverse words in a string
- Reverse array
- Palindrome check
- String manipulation

### e. Performance
- Recursive: O(N) time, O(N) space
- Iterative: O(N) time, O(1) space (better for production)

## Summary

Reversing a string with recursion demonstrates stack unwinding beautifully! Print AFTER recursion to get reversed output.

✅ **Stack Unwinding:** Natural reversal mechanism  
✅ **Simple Pattern:** Recurse then print  
✅ **Foundation:** For more complex recursion  

Happy Coding! 🚀

