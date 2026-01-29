---
title: "Special Subsequences AG"
description: "Master the carry forward technique to count special subsequences efficiently. Learn how to avoid nested loops and optimize counting problems using information propagation."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Subsequence Problems"
    type: "reference"
    url: "https://www.geeksforgeeks.org/subarraysubstring-vs-subsequence-and-programs-to-generate-them/"
    description: "Understanding subsequences and efficient counting"
  - title: "Carry Forward Technique"
    type: "tool"
    url: "https://visualgo.net/en/array"
    description: "Visualize array traversal techniques"
  - title: "String Algorithm Practice"
    type: "practice"
    url: "https://leetcode.com/tag/string/"
    description: "Practice string and subsequence problems"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Special Subsequences "AG"
----------------------------

### Problem Statement:

Given a string `S` consisting of uppercase English letters, count the number of **special subsequences** of the form **"AG"** where 'A' appears before 'G'.

A subsequence is a sequence that can be derived from the string by deleting some or no characters without changing the order of the remaining characters.

For example, in string "ABCGAG", the subsequences "AG" can be formed by:
- A at index 0 and G at index 3
- A at index 0 and G at index 5
- A at index 4 and G at index 5

Return the total count of such subsequences.

### Examples:

#### Example 1:

**Input:** S = "AG"

**Output:** 1

**Explanation:** Only one subsequence "AG" possible.

#### Example 2:

**Input:** S = "ABCGAG"

**Output:** 3

**Explanation:** 
* A[0] + G[3] → "AG"
* A[0] + G[5] → "AG"
* A[4] + G[5] → "AG"
* Total = 3

#### Example 3:

**Input:** S = "GAB"

**Output:** 0

**Explanation:** No 'A' appears before any 'G', so count = 0.

#### Example 4:

**Input:** S = "AAGGG"

**Output:** 6

**Explanation:** 
* A[0] can pair with G[2], G[3], G[4] → 3 subsequences
* A[1] can pair with G[2], G[3], G[4] → 3 subsequences
* Total = 6

### Constraints:

* `1 ≤ |S| ≤ 10^5`
* S contains only uppercase English letters

### Important Points to Understand:

**1. Subsequence vs Substring:**
* Subsequence: Characters don't need to be contiguous (can skip characters).
* Substring: Characters must be contiguous.

**2. Carry Forward Technique:**
* Instead of nested loops, carry forward information from previous iterations.
* For each 'G', count how many 'A's have appeared before it.

**3. Order Matters:**
* 'A' must appear before 'G' in the string.
* "GA" is not a valid subsequence for this problem.

**4. Optimization:**
* Brute force: O(N²) - check all pairs.
* Optimized: O(N) - carry forward count of 'A's.

### Approach:

**Brute Force Approach:**
1. Use two nested loops.
2. Outer loop finds each 'A'.
3. Inner loop counts 'G's after each 'A'.
4. Sum all counts.

**Optimized Approach (Carry Forward):**
1. Initialize `countA = 0` and `result = 0`.
2. Traverse the string left to right.
3. If current character is 'A', increment `countA`.
4. If current character is 'G', add `countA` to `result`.
5. Return result.

**Key Insight:** Each 'G' can pair with ALL 'A's that appeared before it!

### Time Complexity:

**Brute Force:**
* **Time Complexity = O(N²)** - Nested loops checking all pairs.

**Optimized (Carry Forward):**
* **Time Complexity = O(N)** - Single pass through the string.

### Space Complexity:

* **Space Complexity = O(1)** - Only using counter variables.

### Dry Run - Brute Force:

```
Input: S = "ABCGAG"

Nested loops approach:
i = 0 (A):
    j = 1 (B) → skip
    j = 2 (C) → skip
    j = 3 (G) → count++ = 1
    j = 4 (A) → skip
    j = 5 (G) → count++ = 2

i = 1 (B) → skip entire inner loop

i = 2 (C) → skip entire inner loop

i = 3 (G) → skip entire inner loop

i = 4 (A):
    j = 5 (G) → count++ = 3

Final count = 3

Output: 3
```

### Dry Run - Optimized (Carry Forward):

```
Input: S = "ABCGAG"

Initialize: countA = 0, result = 0

i = 0, S[0] = 'A'
    → countA = 1, result = 0

i = 1, S[1] = 'B'
    → no change

i = 2, S[2] = 'C'
    → no change

i = 3, S[3] = 'G'
    → result = result + countA = 0 + 1 = 1
    (This 'G' pairs with 1 'A' before it)

i = 4, S[4] = 'A'
    → countA = 2, result = 1

i = 5, S[5] = 'G'
    → result = result + countA = 1 + 2 = 3
    (This 'G' pairs with 2 'A's before it)

Final result = 3

Output: 3
```

### Brute Force Approach - JavaScript Code:

```javascript
function countAG_BruteForce(S) {
    let count = 0;
    const N = S.length;
    
    // Find each 'A'
    for (let i = 0; i < N; i++) {
        if (S[i] === 'A') {
            // Count all 'G's after this 'A'
            for (let j = i + 1; j < N; j++) {
                if (S[j] === 'G') {
                    count++;
                }
            }
        }
    }
    
    return count;
}
```

**Time:** O(N²) ❌
**Space:** O(1) ✓

### Visualization:

```
String: A B C G A G
Index:  0 1 2 3 4 5

Carry Forward Technique:

Step 1: A (index 0)
    countA = 1
    result = 0
    
Step 2-3: B, C
    Skip (not A or G)
    
Step 4: G (index 3)
    This G can pair with all previous A's!
    result += countA = 0 + 1 = 1
    Pairs formed: A[0]-G[3]
    
Step 5: A (index 4)
    countA = 2
    result = 1
    
Step 6: G (index 5)
    This G can pair with all previous A's!
    result += countA = 1 + 2 = 3
    Pairs formed: A[0]-G[5], A[4]-G[5]

Visual representation:
    A - - G A G
    ↓     ↓ ↓ ↓
    └─────┘ │ │  (pair 1)
    └───────┘ │  (pair 2)
      └───────┘  (pair 3)

Total pairs = 3
```

### Optimal Approach - Carry Forward:

```javascript
function countAG(S) {
    let countA = 0;  // Count of 'A's seen so far
    let result = 0;   // Total AG subsequences
    
    for (let i = 0; i < S.length; i++) {
        if (S[i] === 'A') {
            countA++;  // Found another 'A'
        } else if (S[i] === 'G') {
            result += countA;  // This 'G' pairs with all previous 'A's
        }
    }
    
    return result;
}
```

**Time:** O(N) ✓
**Space:** O(1) ✓

### Alternative Approach - Using Array Methods:

```javascript
function countAG_Functional(S) {
    let countA = 0;
    
    return S.split('').reduce((result, char) => {
        if (char === 'A') {
            countA++;
            return result;
        } else if (char === 'G') {
            return result + countA;
        }
        return result;
    }, 0);
}
```

### Edge Cases to Consider:

**1. No 'A' in string:**
* Input: S = "BGC"
* Output: 0 (no 'A' means no "AG" subsequences)

**2. No 'G' in string:**
* Input: S = "ABC"
* Output: 0 (no 'G' means no "AG" subsequences)

**3. All 'A's:**
* Input: S = "AAA"
* Output: 0 (no 'G' to pair with)

**4. All 'G's:**
* Input: S = "GGG"
* Output: 0 (no 'A' to pair with)

**5. 'G' before 'A':**
* Input: S = "GA"
* Output: 0 (order matters - 'A' must come before 'G')

**6. Single character:**
* Input: S = "A" or S = "G"
* Output: 0 (need both characters)

**7. Multiple A's and G's:**
* Input: S = "AAAGGG"
* countA = 3, each G adds 3 to result
* Output: 3 + 3 + 3 = 9

**8. Interleaved:**
* Input: S = "AGAGAG"
* Track carefully: 1 + 2 + 3 = 6

### Key Takeaways:

1. **Carry forward** eliminates the need for nested loops.

2. **Count accumulation:** Each 'G' can pair with ALL 'A's seen so far.

3. **Single pass solution:** O(N) time is optimal for this problem.

4. **Order matters:** Must traverse left to right to maintain correct pairing.

5. **Multiplication principle:** If we have `k` 'A's and then encounter a 'G', we add `k` to result.

6. **Applications:**
   * Counting pairs/triplets in sequences
   * Pattern matching with ordering constraints
   * DNA sequence analysis
   * Text processing algorithms

7. **Interview strategy:**
   * Start with brute force (nested loops).
   * Explain why it's inefficient.
   * Introduce carry forward optimization.
   * Walk through with example showing how counting works.

8. **Common mistakes:**
   * Counting in wrong direction (right to left won't work).
   * Forgetting to reset or update counters.
   * Not understanding that each G pairs with ALL previous A's.

9. **Pattern recognition:** This technique extends to:
   * Counting triplets (ABC, ADE, etc.)
   * Multiple character sequences
   * Weighted counting problems

10. **Related problems:**
   * Count subsequences of form "ABC"
   * Count special binary subsequences
   * Number of matching pairs
   * Longest increasing subsequence variations

11. **Extension to triplets:**
    For "ABC" pattern:
    - Track countA and countAB
    - When see 'A': countA++
    - When see 'B': countAB += countA
    - When see 'C': result += countAB

12. **Mathematical insight:**
    If string has m 'A's followed by n 'G's: answer = m × n
    For "AAAGGG": 3 × 3 = 9 subsequences

