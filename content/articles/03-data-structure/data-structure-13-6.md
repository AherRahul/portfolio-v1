---
title: "Check Palindrome using Recursion"
description: "Verify if a string is a palindrome using recursion. Master string manipulation with recursion, learn two-pointer recursive technique, and understand how to compare characters from both ends recursively."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-12-24"
datePublished: "2026-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "String Algorithms"
    type: "article"
    url: "https://www.geeksforgeeks.org/string-data-structure/"
    description: "Comprehensive guide to string algorithms"
  - title: "Palindrome Checker"
    type: "tool"
    url: "https://www.palindromelist.net/"
    description: "Online palindrome verification tool"
  - title: "Recursion Practice"
    type: "practice"
    url: "https://leetcode.com/tag/recursion/"
    description: "Practice recursive string problems"
---


![Recursion Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Check if a String is a Palindrome Using Recursion

## 2. Problem Statement

Write a recursive function that checks whether string **A** is a palindrome or not. Return **1** if the string A is a palindrome, else return **0**.

**Note:** A palindrome is a string that's the same when read forward and backward.

**Input:**
- A string `A` (1 ≤ length ≤ 10000)

**Output:**
- Return 1 if palindrome, 0 otherwise

## 3. Examples

### Example 1:
```
Input: A = "racecar"
Output: 1
Explanation: "racecar" reads the same forward and backward
```

### Example 2:
```
Input: A = "hello"
Output: 0
Explanation: "hello" != "olleh", not a palindrome
```

### Example 3:
```
Input: A = "a"
Output: 1
Explanation: Single character is always a palindrome
```

### Example 4:
```
Input: A = "madam"
Output: 1
Explanation: "madam" reads the same both ways
```

### Example 5:
```
Input: A = "ab"
Output: 0
Explanation: "ab" != "ba", not a palindrome
```

### Example 6:
```
Input: A = "noon"
Output: 1
Explanation: "noon" is a palindrome
```

## 4. Constraints

- `1 ≤ length of A ≤ 10000`
- String contains only lowercase English letters
- Must use recursion
- Should handle single character strings
- Case-sensitive comparison

## 5. Important Points

### Understanding Palindromes

**Definition:** A palindrome reads the same forwards and backwards.

**Examples:**
- Words: "radar", "level", "rotor", "civic"
- Phrases: "A man a plan a canal Panama" (ignoring spaces/case)
- Numbers: 121, 1221, 12321

### Recursive Strategy

**Key Insight:** Compare characters from both ends moving inward.

1. **Base Cases:**
   - Empty string: palindrome
   - Single character: palindrome
   - Two characters: check if they're equal

2. **Recursive Case:**
   - Compare first and last characters
   - If equal, recursively check the substring (excluding first and last)
   - If not equal, not a palindrome

### Two-Pointer Technique

```
"racecar"
 ↑     ↑
 L     R

Compare s[L] with s[R]
If equal, move both pointers inward: L++, R--
Repeat until L >= R
```

## 6. Brute Force Approach

### Concept

Create a reversed copy of the string and compare with original.

### Algorithm

1. Reverse the entire string
2. Compare original with reversed
3. If equal, return 1 (palindrome)
4. Otherwise, return 0 (not palindrome)

### Why It's Brute Force

- Creates extra string (space inefficient)
- Doesn't use recursion
- Doesn't meet problem requirements

## 7. Brute Force Code (Iterative)

```javascript
function isPalindromeBruteForce(str) {
    // Reverse the string
    const reversed = str.split('').reverse().join('');
    
    // Compare with original
    return str === reversed ? 1 : 0;
}

// Test cases
console.log(isPalindromeBruteForce("racecar")); // 1
console.log(isPalindromeBruteForce("hello"));   // 0
console.log(isPalindromeBruteForce("madam"));   // 1
```

## 8. Dry Run of Brute Force

Let's trace `isPalindromeBruteForce("racecar")`:

```
Step 1: Original string
str = "racecar"

Step 2: Split into array
arr = ['r', 'a', 'c', 'e', 'c', 'a', 'r']

Step 3: Reverse array
reversed_arr = ['r', 'a', 'c', 'e', 'c', 'a', 'r']

Step 4: Join back to string
reversed = "racecar"

Step 5: Compare
"racecar" === "racecar" → true

Result: 1 (palindrome)
```

## 9. Time and Space Complexity of Brute Force

### Time Complexity: **O(N)**
- Split: O(N)
- Reverse: O(N)
- Join: O(N)
- Compare: O(N)
- Total: O(N)

### Space Complexity: **O(N)**
- Creates reversed string: O(N)
- Array for split: O(N)
- Total: O(N)

## 10. Visualization (Brute Force)

```
isPalindromeBruteForce("racecar")

Original:  r a c e c a r
           ↓ ↓ ↓ ↓ ↓ ↓ ↓
Reversed:  r a c e c a r
           
Compare:   ✓ ✓ ✓ ✓ ✓ ✓ ✓

Result: All match → Palindrome!
```

## 11. Optimized Approach Description (Recursive Two-Pointer)

### The Recursive Strategy

Use **two pointers** (left and right) to compare characters recursively.

**Algorithm:**
1. Start with left = 0, right = length - 1
2. **Base Cases:**
   - If left >= right: checked all pairs, return true
   - If s[left] ≠ s[right]: not palindrome, return false
3. **Recursive Case:**
   - If s[left] === s[right]: move pointers inward (left++, right--)
   - Recursively check remaining substring

### Visual Representation

```
"racecar"
 ↑     ↑   Compare r === r ✓
  ↑   ↑    Compare a === a ✓
   ↑ ↑     Compare c === c ✓
    ↑      Compare e with itself ✓ (middle)
    
All checks passed → Palindrome!
```

## 12. Optimized Approach Algorithm

**Step-by-step:**

1. **Create helper function** with left and right indices
2. **Base case 1:** If left >= right, return 1 (all pairs checked)
3. **Base case 2:** If s[left] ≠ s[right], return 0 (mismatch found)
4. **Recursive case:** Check next pair: isPalindrome(left + 1, right - 1)
5. **Return result** from recursive calls

## 13. Optimized Code (Recursive Solutions)

### Solution 1: Two-Pointer Recursion

```javascript
/**
 * Check if string is palindrome using recursion
 * @param {string} str - Input string
 * @returns {number} - 1 if palindrome, 0 otherwise
 */
function isPalindrome(str) {
    function helper(left, right) {
        // Base case: All pairs checked
        if (left >= right) {
            return 1;
        }
        
        // Base case: Mismatch found
        if (str[left] !== str[right]) {
            return 0;
        }
        
        // Recursive case: Check next pair
        return helper(left + 1, right - 1);
    }
    
    return helper(0, str.length - 1);
}

// Test cases
console.log(isPalindrome("racecar")); // 1
console.log(isPalindrome("hello"));   // 0
console.log(isPalindrome("madam"));   // 1
console.log(isPalindrome("a"));       // 1
console.log(isPalindrome("noon"));    // 1
```

### Solution 2: String Slicing

```javascript
/**
 * Check palindrome using string slicing
 */
function isPalindromeSlice(str) {
    // Base cases
    if (str.length <= 1) {
        return 1;
    }
    
    // Check first and last characters
    if (str[0] !== str[str.length - 1]) {
        return 0;
    }
    
    // Recursively check substring (excluding first and last)
    return isPalindromeSlice(str.slice(1, -1));
}

console.log(isPalindromeSlice("racecar")); // 1
console.log(isPalindromeSlice("hello"));   // 0
```

### Solution 3: With Validation

```javascript
/**
 * Robust palindrome checker with input validation
 */
function isPalindromeSafe(str) {
    // Input validation
    if (typeof str !== 'string') {
        throw new Error("Input must be a string");
    }
    
    if (str.length === 0) {
        return 1; // Empty string is palindrome by definition
    }
    
    // Helper function with two pointers
    function checkPalindrome(left, right) {
        // Base case: pointers met or crossed
        if (left >= right) {
            return 1;
        }
        
        // Mismatch found
        if (str[left] !== str[right]) {
            return 0;
        }
        
        // Check next pair
        return checkPalindrome(left + 1, right - 1);
    }
    
    return checkPalindrome(0, str.length - 1);
}
```

### Solution 4: Case-Insensitive with Special Characters

```javascript
/**
 * Palindrome check ignoring case and non-alphanumeric
 */
function isPalindromeAdvanced(str) {
    // Clean string: lowercase, remove non-alphanumeric
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    
    function helper(left, right) {
        if (left >= right) return 1;
        if (cleaned[left] !== cleaned[right]) return 0;
        return helper(left + 1, right - 1);
    }
    
    return helper(0, cleaned.length - 1);
}

console.log(isPalindromeAdvanced("A man, a plan, a canal: Panama")); // 1
console.log(isPalindromeAdvanced("race a car")); // 0
```

## 14. Dry Run of Optimized Approach

Let's trace `isPalindrome("racecar")`:

```
Initial Call: isPalindrome("racecar")
  - Calls: helper(0, 6)

Step 1: helper(0, 6)
  - left = 0, right = 6
  - str[0] = 'r', str[6] = 'r'
  - 'r' === 'r' ✓
  - Call: helper(1, 5)

Step 2: helper(1, 5)
  - left = 1, right = 5
  - str[1] = 'a', str[5] = 'a'
  - 'a' === 'a' ✓
  - Call: helper(2, 4)

Step 3: helper(2, 4)
  - left = 2, right = 4
  - str[2] = 'c', str[4] = 'c'
  - 'c' === 'c' ✓
  - Call: helper(3, 3)

Step 4: helper(3, 3)
  - left = 3, right = 3
  - left >= right (3 >= 3) ✓
  - BASE CASE: Return 1

Unwinding:
  - helper(3, 3) returns 1
  - helper(2, 4) returns 1
  - helper(1, 5) returns 1
  - helper(0, 6) returns 1

Final Result: 1 (palindrome) ✓
```

### Trace Table

| Call | left | right | str[left] | str[right] | Match? | Action |
|------|------|-------|-----------|------------|--------|--------|
| 1 | 0 | 6 | 'r' | 'r' | ✓ | Recurse |
| 2 | 1 | 5 | 'a' | 'a' | ✓ | Recurse |
| 3 | 2 | 4 | 'c' | 'c' | ✓ | Recurse |
| 4 | 3 | 3 | - | - | - | Base case |

### Non-Palindrome Example: "hello"

```
Call 1: helper(0, 4)
  - str[0] = 'h', str[4] = 'o'
  - 'h' !== 'o' ✗
  - BASE CASE: Return 0

Result: 0 (not palindrome)
```

## 15. Time and Space Complexity of Optimized Solution

### Time Complexity: **O(N/2) = O(N)**

**Analysis:**
- Check N/2 pairs of characters
- Each recursive call: O(1) work
- Total: N/2 comparisons
- Simplified: **O(N)**

### Space Complexity: **O(N/2) = O(N)**

**Analysis:**
- Recursion depth: N/2 (for two-pointer approach)
- Each frame: O(1) space
- Call stack: O(N/2) frames
- Simplified: **O(N)**

**Note:** String slicing approach has O(N²) time due to string creation in each call.

### Comparison

| Approach | Time | Space | String Creation |
|----------|------|-------|-----------------|
| Brute Force (Reverse) | O(N) | O(N) | Yes (1 copy) |
| Two-Pointer Recursion | O(N) | O(N) | No |
| String Slicing | O(N²) | O(N) | Yes (N copies) |
| Iterative Two-Pointer | O(N) | O(1) | No |

## 16. Visualization (Recursive Two-Pointer)

### Recursion Tree for "racecar"

```
                    helper(0, 6)
                    r ↔ r ✓
                         ↓
                    helper(1, 5)
                    a ↔ a ✓
                         ↓
                    helper(2, 4)
                    c ↔ c ✓
                         ↓
                    helper(3, 3)
                    BASE CASE
                    Return 1
                         ↓
                    Return 1
                         ↓
                    Return 1
                         ↓
                    Return 1

Result: Palindrome!
```

### Call Stack Evolution

```
isPalindrome("racecar")

Phase 1: Building Stack
┌──────────────────────────┐
│ helper(0, 6): r ↔ r ✓    │
├──────────────────────────┤
│ helper(1, 5): a ↔ a ✓    │
├──────────────────────────┤
│ helper(2, 4): c ↔ c ✓    │
├──────────────────────────┤
│ helper(3, 3): BASE CASE  │
└──────────────────────────┘

Phase 2: Unwinding (All return 1)
```

### Non-Palindrome: "hello"

```
                    helper(0, 4)
                    h ↔ o ✗
                    MISMATCH!
                    Return 0

Result: Not a palindrome
(Only 1 function call needed!)
```

## 17. Edge Cases to Consider

### 1. **Single Character**
```javascript
isPalindrome("a");
// Output: 1
// Base case: single char is always palindrome
```

### 2. **Empty String**
```javascript
isPalindrome("");
// Output: 1
// Empty string considered palindrome
```

### 3. **Two Characters - Palindrome**
```javascript
isPalindrome("aa");
// Output: 1
// Equal characters
```

### 4. **Two Characters - Not Palindrome**
```javascript
isPalindrome("ab");
// Output: 0
// Different characters
```

### 5. **Even Length Palindrome**
```javascript
isPalindrome("noon");
// Output: 1
// Even number of characters
```

### 6. **Odd Length Palindrome**
```javascript
isPalindrome("racecar");
// Output: 1
// Odd number of characters (middle char)
```

### 7. **Very Long String**
```javascript
isPalindrome("a".repeat(10000));
// Output: 1
// Risk: Deep recursion, may cause stack overflow
```

### 8. **Case Sensitivity**
```javascript
isPalindrome("RaceCar");
// Output: 0
// 'R' !== 'r' (case sensitive)
```

### 9. **Special Characters**
```javascript
isPalindrome("race car");
// Output: 0
// Space character breaks palindrome
```

### Enhanced Edge Case Handling

```javascript
function isPalindromeRobust(str) {
    // Type validation
    if (typeof str !== 'string') {
        throw new Error("Input must be a string");
    }
    
    // Empty or single char
    if (str.length <= 1) {
        return 1;
    }
    
    // Stack overflow prevention
    if (str.length > 10000) {
        console.warn("Large string, consider iterative approach");
    }
    
    function helper(left, right) {
        if (left >= right) return 1;
        if (str[left] !== str[right]) return 0;
        return helper(left + 1, right - 1);
    }
    
    return helper(0, str.length - 1);
}
```

## 18. Key Takeaways

### a. Applications

1. **Text Processing**
   - Word validation
   - Pattern matching
   - String analysis

2. **Data Validation**
   - Input verification
   - Format checking
   - Symmetric data validation

3. **DNA Sequences**
   - Finding palindromic sequences in genetics
   - Restriction sites identification
   - Complementary strand analysis

4. **Cryptography**
   - Pattern detection
   - Cipher analysis
   - Hash validation

5. **Algorithms**
   - Longest palindromic substring
   - Palindrome partitioning
   - Manacher's algorithm

### b. Interview Strategy

**When Asked This Problem:**

1. **Clarify Requirements**
   - "Is it case-sensitive?"
   - "Should I ignore spaces/punctuation?"
   - "What about empty strings?"
   - "Can I use extra space?"

2. **Discuss Approaches**
   - Naive: Reverse and compare
   - Optimal: Two-pointer recursion
   - Iterative two-pointer (O(1) space)

3. **Code the Recursive Solution**
   - Show two-pointer technique
   - Handle base cases clearly
   - Keep code clean and readable

4. **Analyze Complexity**
   - Time: O(N)
   - Space: O(N) due to recursion
   - Compare with iterative O(1) space

5. **Discuss Variations**
   - Case-insensitive palindromes
   - Ignoring special characters
   - Longest palindromic substring

**Follow-up Questions to Expect:**
- "Can you do it iteratively?"
- "How would you handle case-insensitivity?"
- "What about palindromic substrings?"
- "Can you optimize space to O(1)?"

### c. Common Mistakes

1. **Wrong Base Case**
```javascript
// ❌ WRONG: Doesn't handle even-length strings
function isPalindrome(str, l, r) {
    if (l === r) return 1;  // Misses when l > r
    // ...
}
```

2. **Not Checking Mismatch**
```javascript
// ❌ WRONG: Always returns 1
function isPalindrome(str, l, r) {
    if (l >= r) return 1;
    return isPalindrome(str, l + 1, r - 1);
    // Forgot to check str[l] !== str[r]
}
```

3. **Wrong Pointer Movement**
```javascript
// ❌ WRONG: Doesn't move pointers correctly
function isPalindrome(str, l, r) {
    if (l >= r) return 1;
    if (str[l] !== str[r]) return 0;
    return isPalindrome(str, l, r);  // Infinite recursion!
}
```

4. **String Slicing Creating O(N²)**
```javascript
// ⚠️ INEFFICIENT: Creates many string copies
function isPalindrome(str) {
    if (str.length <= 1) return 1;
    if (str[0] !== str[str.length - 1]) return 0;
    return isPalindrome(str.slice(1, -1));  // O(N) per call!
}
```

5. **Not Returning Value**
```javascript
// ❌ WRONG: Doesn't return recursive result
function isPalindrome(str, l, r) {
    if (l >= r) return 1;
    if (str[l] !== str[r]) return 0;
    isPalindrome(str, l + 1, r - 1);  // Missing return!
}
```

### d. Related Problems

**Beginner Level:**
1. **Valid Palindrome** - Ignore case and special chars
2. **Reverse String** - Basic string manipulation
3. **First Unique Character** - String processing
4. **Anagram Check** - Character frequency

**Intermediate Level:**
5. **Longest Palindromic Substring** - Dynamic programming
6. **Palindrome Partitioning** - Backtracking
7. **Valid Palindrome II** - Remove one character
8. **Shortest Palindrome** - String matching

**Advanced Level:**
9. **Palindrome Pairs** - Hash map and trie
10. **Manacher's Algorithm** - Linear time palindrome
11. **Palindromic Tree** - Advanced data structure
12. **Count Palindromic Subsequences** - DP optimization

### e. Performance

**Benchmarking:**

```javascript
const testStr = "racecar".repeat(1000); // 7000 chars

// Recursive Two-Pointer
console.time('Recursive Two-Pointer');
isPalindrome(testStr);
console.timeEnd('Recursive Two-Pointer');
// Time: ~0.5-1ms

// String Slicing (Inefficient)
console.time('String Slicing');
isPalindromeSlice(testStr);
console.timeEnd('String Slicing');
// Time: ~10-20ms (much slower!)

// Iterative Two-Pointer (Best)
console.time('Iterative');
isPalindromeIterative(testStr);
console.timeEnd('Iterative');
// Time: ~0.3-0.5ms
```

**Comparison Table:**

| Approach | Time | Space | Best Use Case |
|----------|------|-------|---------------|
| Recursive Two-Pointer | O(N) | O(N) | Learning, interviews |
| String Slicing | O(N²) | O(N) | Short strings only |
| Iterative Two-Pointer | O(N) | O(1) | Production code |
| Reverse & Compare | O(N) | O(N) | Simple implementation |

**When to Use Each:**

**Recursive (Two-Pointer):**
- Interview coding
- Teaching recursion
- Short to medium strings
- Code clarity matters

**Iterative:**
- Production systems
- Large strings
- Memory-constrained environments
- Performance-critical code

## Summary

Palindrome checking with recursion demonstrates:

✅ **Two-Pointer Technique:** Compare from both ends  
✅ **Base Case Mastery:** Multiple stopping conditions  
✅ **String Manipulation:** Character-by-character processing  
✅ **Efficiency Trade-offs:** Recursion vs iteration  
✅ **Real-World Problem:** Common in interviews and applications  

Master this pattern, and you'll excel at recursive string problems!

**Next Steps:**
- Try longest palindromic substring
- Implement palindrome partitioning
- Practice with case-insensitive versions
- Explore Manacher's algorithm
- Study palindromic trees

Happy Coding! 🚀

