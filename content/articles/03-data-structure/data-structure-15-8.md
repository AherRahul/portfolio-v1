---
title: "Form Largest Number from Array"
description: "Arrange array elements to form largest number. Master custom string comparison, handle edge cases with zeros, and learn concatenation-based sorting."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-12-24"
datePublished: "2026-12-24"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
---


![Sorting Banner](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

## Largest Number

## 2. Problem Statement

Given an array of non-negative integers **A**, arrange them such that they form the **largest possible number** and return it as a string.

**Input:**
- Array `A` of N non-negative integers

**Output:**
- String representing the largest number

## 3. Examples

```
Input: [3, 30, 34, 5, 9]
Output: "9534330"
Explanation: Arrange as 9-5-34-3-30

Input: [54, 546, 548, 60]
Output: "6054854654"

Input: [0, 0, 0]
Output: "0"
Explanation: All zeros result in "0"
```

## 4. Constraints

- `1 ≤ N ≤ 100`
- `0 ≤ A[i] ≤ 10^9`

## 5. Important Points

**Key Insight:**
```
Compare concatenations:
If "a" + "b" > "b" + "a", then a should come before b
```

**Edge Cases:**
- All zeros → return "0"
- Single element → return as string
- Leading zeros → handle carefully

## 6. Brute Force Approach

Generate all permutations and find the maximum.

## 7. Brute Force Code

```javascript
function largestNumberBrute(arr) {
    // Generate all permutations
    function permute(nums) {
        if (nums.length <= 1) return [nums];
        const result = [];
        for (let i = 0; i < nums.length; i++) {
            const rest = [...nums.slice(0, i), ...nums.slice(i + 1)];
            for (const perm of permute(rest)) {
                result.push([nums[i], ...perm]);
            }
        }
        return result;
    }
    
    const perms = permute(arr);
    let max = "0";
    
    for (const perm of perms) {
        const num = perm.join("");
        if (num > max || (num === max && num.length > max.length)) {
            max = num;
        }
    }
    
    return max;
}
```

## 8. Dry Run

```
arr = [3, 30, 34]

Permutations:
3-30-34 → "33034"
3-34-30 → "33430"
30-3-34 → "30334"
30-34-3 → "30343"
34-3-30 → "34330" ✓ (max)
34-30-3 → "34303"

Result: "34330"
```

## 9. Time and Space Complexity of Brute Force

**Time:** O(N! * N)  
**Space:** O(N!)

## 10. Visualization

```
Array: [3, 30, 34, 5, 9]

Compare pairs:
9 vs 5: "95" > "59" → 9 first
9 vs 34: "934" > "349" → 9 first
5 vs 34: "534" > "345" → 5 first
34 vs 3: "343" > "334" → 34 first
3 vs 30: "330" > "303" → 3 first

Order: 9, 5, 34, 3, 30
Result: "9534330"
```

## 11. Optimized Approach Description

Use custom comparator for sorting. Compare two numbers by concatenating them in both orders and choosing the larger combination.

## 12. Optimized Approach Algorithm

```
1. Convert all numbers to strings
2. Sort using custom comparator:
   - Compare (a + b) vs (b + a)
   - If (a + b) > (b + a): a comes first
3. Join sorted strings
4. Handle edge case: if result starts with "0", return "0"
```

## 13. Optimized Code

```javascript
function largestNumber(arr) {
    // Convert to strings
    const nums = arr.map(String);
    
    // Custom sort
    nums.sort((a, b) => {
        const order1 = a + b;
        const order2 = b + a;
        
        // Descending order
        return order2.localeCompare(order1);
    });
    
    // Join and handle all zeros case
    const result = nums.join("");
    return result[0] === "0" ? "0" : result;
}

// Test cases
console.log(largestNumber([3, 30, 34, 5, 9]));
// "9534330"

console.log(largestNumber([54, 546, 548, 60]));
// "6054854654"

console.log(largestNumber([0, 0, 0]));
// "0"

console.log(largestNumber([1]));
// "1"

console.log(largestNumber([10, 2]));
// "210"
```

## 14. Dry Run

```
arr = [3, 30, 34, 5, 9]
nums = ["3", "30", "34", "5", "9"]

Sort with custom comparator:
Compare "9" and "5":
  "95" vs "59" → "95" > "59" → keep order

Compare "9" and "34":
  "934" vs "349" → "934" > "349" → keep order

Compare "5" and "34":
  "534" vs "345" → "534" > "345" → keep order

Compare "34" and "3":
  "343" vs "334" → "343" > "334" → keep order

Compare "3" and "30":
  "330" vs "303" → "330" > "303" → keep order

Sorted: ["9", "5", "34", "3", "30"]
Join: "9534330"

Result: "9534330"
```

## 15. Time and Space Complexity

**Time:** O(N log N * K) where K is avg string length  
**Space:** O(N * K) for string storage

## 16. Visualization

```
Comparison logic:
[3, 30] → "330" vs "303" → 3 before 30 ✓

[54, 546] → "54546" vs "54654" → 546 before 54 ✓

Why this works:
If AB > BA, then A should come before B
Transitivity ensures correct ordering

Example:
A=9, B=5, C=34
"95" > "59" → 9 before 5
"934" > "349" → 9 before 34
"534" > "345" → 5 before 34
Result: 9, 5, 34 ✓
```

## 17. Edge Cases

```javascript
// All zeros
largestNumber([0, 0, 0]); // "0"

// Single element
largestNumber([1]); // "1"

// Two elements
largestNumber([10, 2]); // "210"

// With zero
largestNumber([0, 9]); // "90"

// Similar numbers
largestNumber([121, 12]); // "12121"

// Single digit
largestNumber([1, 2, 3, 4]); // "4321"

// Large numbers
largestNumber([824, 938, 1399, 5607]); // "938824560713399"

// Prefix numbers
largestNumber([3, 30, 300, 34]); // "343300030"
```

## 18. Key Takeaways

### a. Applications
- Number formation
- Greedy algorithms
- Custom sorting
- String manipulation

### b. Interview Strategy
- Explain concatenation comparison
- Handle all zeros case
- Discuss time complexity
- Mention string comparison

### c. Common Mistakes
- Wrong comparison logic
- Not handling zeros
- Integer overflow
- Wrong sort order

### d. Related Problems
- Next Greater Element III
- Next Permutation
- Smallest Number
- Arrange Numbers to Form Biggest

### e. Performance
- O(N log N) optimal for comparison sorting
- String operations add overhead
- Stable sort not required
- Edge cases critical

## Summary

✅ **Custom Comparator:** Compare concatenations  
✅ **String Comparison:** Use "a+b" vs "b+a"  
✅ **Handle Zeros:** Return "0" for all zeros  

Happy Coding! 🚀

