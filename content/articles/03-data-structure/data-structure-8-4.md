---
title: "String DP & Edit Distance"
description: "Apply DP to string manipulation. Learn edit distance, longest palindromic subsequence, and string transformation algorithms using dynamic programming."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
  - string-dp
resources:
  - title: "String DP Visualizer"
    type: "tool"
    url: "https://visualgo.net/en/recursion"
    description: "Interactive visualization of string dynamic programming algorithms"
  - title: "Edit Distance Applications"
    type: "reference"
    url: "https://en.wikipedia.org/wiki/Edit_distance"
    description: "Comprehensive guide to edit distance theory and applications"
  - title: "String DP Practice"
    type: "practice"
    url: "https://leetcode.com/tag/string/"
    description: "Essential string manipulation problems using dynamic programming"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758827456/Portfolio/dsa/images/35/string_dp.png)

String DP & Edit Distance – The Art of Text Transformation
-----------------------------------------------------------

Imagine you're the **Chief Data Scientist** 🧬 at a **cutting-edge biotech company** where **analyzing DNA sequences** could lead to **breakthrough cancer treatments**, but **slight mutations in genetic code** require **sophisticated string transformation algorithms** to identify patterns:

**🔬 The Genetic Analysis Challenge:**

**🧪 Scenario 1: DNA Sequence Comparison (Edit Distance)**
```
Problem: Compare patient DNA with healthy reference sequence
Challenge: Account for mutations (insertions, deletions, substitutions)
Example:
- Reference: "ATCGATCG"  
- Patient:   "ATGAATCG"
- Mutations: 1 substitution (C→G), 1 insertion (A)
- Need: Minimum edit operations to transform patient → reference
Application: Identify genetic variants and disease markers
```

**🔍 Scenario 2: Protein Folding Analysis (Palindromic Patterns)**
```
Problem: Find symmetric protein structures (palindromic sequences)
Challenge: Proteins fold based on palindromic amino acid patterns
Example:
- Sequence: "ABCDCBAEF"
- Longest palindromic subsequence: "ABCDCBA" (length 7)
- Insight: Symmetric regions indicate stable folding points
Application: Drug design and protein engineering
```

**💊 Scenario 3: Drug Discovery (String Partitioning)**
```
Problem: Break complex molecular formulas into known compounds
Challenge: Segment strings into valid dictionary components  
Example:
- Formula: "methylphenylacetate"
- Partition: "methyl" + "phenyl" + "acetate" (all valid compounds)
- Question: Can entire formula be decomposed into known parts?
Application: Automated chemical synthesis planning
```

**💡 The String DP Revolution:**
**String Dynamic Programming** transforms **complex text analysis** from **exponential brute-force approaches** to **polynomial solutions** by recognizing that **optimal string transformations** exhibit **optimal substructure** - enabling everything from **spell checkers to DNA analysis** to **machine translation systems**.


## The Theoretical Foundation

### String DP Problem Characteristics

**Core String DP Properties:**
1. **Sequence Dependency**: Characters depend on relative positions
2. **Optimal Substructure**: Optimal solutions contain optimal subsolutions
3. **Overlapping Subproblems**: Same substring problems appear multiple times
4. **State Representation**: Typically dp[i][j] for two-string problems, dp[i] for single-string

**Common String DP Patterns:**
- **Alignment Problems**: Compare two strings (edit distance, LCS)
- **Subsequence Problems**: Find optimal subsequences (LIS, palindromes)
- **Partitioning Problems**: Break strings into valid components
- **Transformation Problems**: Convert strings with minimum operations

### Mathematical Foundations

**Edit Distance Formulation:**
For strings A[1..m] and B[1..n]:
```
dp[i][j] = minimum operations to transform A[1..i] to B[1..j]

Recurrence:
if A[i] == B[j]: dp[i][j] = dp[i-1][j-1]
else: dp[i][j] = 1 + min(
    dp[i-1][j],     // deletion
    dp[i][j-1],     // insertion  
    dp[i-1][j-1]    // substitution
)
```

**Time Complexity**: O(m × n)
**Space Complexity**: O(m × n), optimizable to O(min(m, n))


## 1. Edit Distance (Levenshtein Distance)

### The String Transformation Foundation

```javascript
/**
 * Edit Distance - Minimum operations to transform one string to another
 * Operations: insertion, deletion, substitution
 */

function editDistance(str1, str2) {
    console.log(`=== Edit Distance ===`);
    console.log(`Transform "${str1}" → "${str2}"`);
    
    const m = str1.length;
    const n = str2.length;
    
    // dp[i][j] = min operations to transform str1[0..i-1] to str2[0..j-1]
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    
    // Base cases: transform empty string
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;  // Delete all characters from str1
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;  // Insert all characters of str2
    }
    
    console.log("\nBuilding DP table:");
    console.log("Base cases initialized - empty string transformations");
    
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                // Characters match - no operation needed
                dp[i][j] = dp[i - 1][j - 1];
                console.log(`Match '${str1[i-1]}': dp[${i}][${j}] = dp[${i-1}][${j-1}] = ${dp[i][j]}`);
            } else {
                // Characters don't match - try all operations
                const deletion = dp[i - 1][j] + 1;      // Delete from str1
                const insertion = dp[i][j - 1] + 1;     // Insert into str1
                const substitution = dp[i - 1][j - 1] + 1; // Replace in str1
                
                dp[i][j] = Math.min(deletion, insertion, substitution);
                
                console.log(`No match '${str1[i-1]}' vs '${str2[j-1]}':`);
                console.log(`  Delete: ${deletion}, Insert: ${insertion}, Substitute: ${substitution}`);
                console.log(`  dp[${i}][${j}] = ${dp[i][j]}`);
            }
        }
    }
    
    console.log("\nFinal DP table:");
    printEditDistanceTable(dp, str1, str2);
    
    console.log(`\nMinimum edit distance: ${dp[m][n]}`);
    return dp[m][n];
}

function printEditDistanceTable(dp, str1, str2) {
    const m = str1.length;
    const n = str2.length;
    
    // Print header
    console.log("     ", "  ε", str2.split("").map(c => c.padStart(3)).join(""));
    
    for (let i = 0; i <= m; i++) {
        const rowLabel = i === 0 ? "ε" : str1[i - 1];
        const row = dp[i].map(val => val.toString().padStart(3)).join("");
        console.log(`${rowLabel.padStart(3)}  ${row}`);
    }
}

// Edit distance with path reconstruction
function editDistanceWithPath(str1, str2) {
    console.log(`\n=== Edit Distance with Operations ===`);
    
    const m = str1.length;
    const n = str2.length;
    
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    const operations = Array.from({ length: m + 1 }, () => Array(n + 1).fill(''));
    
    // Base cases
    for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
        operations[i][0] = 'DELETE';
    }
    for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
        operations[0][j] = 'INSERT';
    }
    operations[0][0] = '';
    
    // Fill DP table
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
                operations[i][j] = 'MATCH';
            } else {
                const deletion = dp[i - 1][j] + 1;
                const insertion = dp[i][j - 1] + 1;
                const substitution = dp[i - 1][j - 1] + 1;
                
                if (deletion <= insertion && deletion <= substitution) {
                    dp[i][j] = deletion;
                    operations[i][j] = 'DELETE';
                } else if (insertion <= substitution) {
                    dp[i][j] = insertion;
                    operations[i][j] = 'INSERT';
                } else {
                    dp[i][j] = substitution;
                    operations[i][j] = 'SUBSTITUTE';
                }
            }
        }
    }
    
    // Reconstruct operations
    console.log("\nReconstructing transformation sequence:");
    const transformations = [];
    let i = m, j = n;
    
    while (i > 0 || j > 0) {
        const op = operations[i][j];
        
        if (op === 'MATCH') {
            transformations.unshift(`Keep '${str1[i-1]}'`);
            i--; j--;
        } else if (op === 'SUBSTITUTE') {
            transformations.unshift(`Substitute '${str1[i-1]}' → '${str2[j-1]}'`);
            i--; j--;
        } else if (op === 'DELETE') {
            transformations.unshift(`Delete '${str1[i-1]}'`);
            i--;
        } else if (op === 'INSERT') {
            transformations.unshift(`Insert '${str2[j-1]}'`);
            j--;
        }
    }
    
    console.log("Transformation sequence:");
    transformations.forEach((op, idx) => {
        console.log(`${idx + 1}. ${op}`);
    });
    
    return { distance: dp[m][n], operations: transformations };
}

// Space-optimized edit distance
function editDistanceOptimized(str1, str2) {
    console.log(`\n=== Space-Optimized Edit Distance ===`);
    
    const m = str1.length;
    const n = str2.length;
    
    // Only need current and previous row
    let prev = Array.from({ length: n + 1 }, (_, j) => j);
    let curr = new Array(n + 1);
    
    console.log("Space-optimized computation:");
    console.log(`Initial: [${prev.join(', ')}]`);
    
    for (let i = 1; i <= m; i++) {
        curr[0] = i;  // Base case: delete all characters from str1
        
        for (let j = 1; j <= n; j++) {
            if (str1[i - 1] === str2[j - 1]) {
                curr[j] = prev[j - 1];  // Match
            } else {
                curr[j] = 1 + Math.min(
                    prev[j],        // deletion
                    curr[j - 1],    // insertion
                    prev[j - 1]     // substitution
                );
            }
        }
        
        console.log(`After '${str1[i-1]}': [${curr.join(', ')}]`);
        [prev, curr] = [curr, prev];  // Swap arrays
    }
    
    return prev[n];
}

// Run examples
console.log("=== Edit Distance Examples ===");

console.log("--- Basic Edit Distance ---");
editDistance("kitten", "sitting");

console.log("--- With Operations ---");
editDistanceWithPath("sunday", "saturday");

console.log("--- Space Optimized ---");
console.log("Result:", editDistanceOptimized("intention", "execution"));
```


## 2. Longest Palindromic Subsequence

### The Symmetry Pattern

```javascript
/**
 * Longest Palindromic Subsequence - Find longest palindrome that can be formed
 * by deleting some characters (maintaining order)
 */

function longestPalindromicSubsequence(s) {
    console.log(`=== Longest Palindromic Subsequence ===`);
    console.log(`String: "${s}"`);
    
    const n = s.length;
    
    // dp[i][j] = length of LPS in substring s[i..j]
    const dp = Array.from({ length: n }, () => Array(n).fill(0));
    
    // Base case: single character palindromes
    for (let i = 0; i < n; i++) {
        dp[i][i] = 1;
    }
    
    console.log("\nBuilding DP table by length:");
    console.log("Length 1: All single characters are palindromes");
    
    // Fill for lengths 2 to n
    for (let len = 2; len <= n; len++) {
        console.log(`\nLength ${len}:`);
        
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            
            if (s[i] === s[j]) {
                // Characters match - extend inner palindrome
                if (len === 2) {
                    dp[i][j] = 2;
                } else {
                    dp[i][j] = dp[i + 1][j - 1] + 2;
                }
                console.log(`Match '${s[i]}' at [${i},${j}]: dp[${i}][${j}] = ${dp[i][j]}`);
            } else {
                // Characters don't match - take best of excluding one end
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
                console.log(`No match at [${i},${j}]: max(${dp[i+1][j]}, ${dp[i][j-1]}) = ${dp[i][j]}`);
            }
        }
    }
    
    console.log("\nFinal DP table:");
    printPalindromeTable(dp, s);
    
    console.log(`\nLongest palindromic subsequence length: ${dp[0][n-1]}`);
    return dp[0][n - 1];
}

function printPalindromeTable(dp, s) {
    const n = s.length;
    
    console.log("   i\\j:", Array.from({ length: n }, (_, i) => i.toString().padStart(3)).join(""));
    
    for (let i = 0; i < n; i++) {
        const row = dp[i].map(val => val.toString().padStart(3)).join("");
        console.log(`${s[i]}(${i}):  ${row}`);
    }
}

// Reconstruct the actual palindromic subsequence
function longestPalindromicSubsequenceWithString(s) {
    console.log(`\n=== LPS with Reconstruction ===`);
    
    const n = s.length;
    const dp = Array.from({ length: n }, () => Array(n).fill(0));
    
    // Fill DP table (same as above)
    for (let i = 0; i < n; i++) {
        dp[i][i] = 1;
    }
    
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            
            if (s[i] === s[j]) {
                dp[i][j] = (len === 2) ? 2 : dp[i + 1][j - 1] + 2;
            } else {
                dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);
            }
        }
    }
    
    // Reconstruct the palindrome
    console.log("Reconstructing palindromic subsequence:");
    const palindrome = [];
    let i = 0, j = n - 1;
    
    while (i <= j) {
        if (i === j) {
            // Single character in the middle
            palindrome.push(s[i]);
            console.log(`Middle character: '${s[i]}'`);
            break;
        } else if (s[i] === s[j]) {
            // Characters match - they're part of palindrome
            palindrome.push(s[i]);
            console.log(`Matching pair: '${s[i]}' at positions ${i}, ${j}`);
            i++;
            j--;
        } else {
            // Move towards the direction with larger LPS
            if (dp[i + 1][j] > dp[i][j - 1]) {
                console.log(`Move right: dp[${i+1}][${j}] > dp[${i}][${j-1}]`);
                i++;
            } else {
                console.log(`Move left: dp[${i}][${j-1}] >= dp[${i+1}][${j}]`);
                j--;
            }
        }
    }
    
    // Build complete palindrome
    const leftHalf = palindrome;
    const rightHalf = palindrome.slice(0, -1).reverse();  // Exclude middle if odd length
    const completePalindrome = leftHalf.concat(rightHalf);
    
    console.log(`Palindromic subsequence: "${completePalindrome.join('')}"`);
    console.log(`Length: ${dp[0][n-1]}`);
    
    return { length: dp[0][n-1], palindrome: completePalindrome.join('') };
}

// Minimum insertions to make palindrome
function minInsertionsForPalindrome(s) {
    console.log(`\n=== Minimum Insertions for Palindrome ===`);
    console.log(`String: "${s}"`);
    
    const n = s.length;
    const lpsLength = longestPalindromicSubsequence(s);
    
    // Minimum insertions = n - LPS length
    const minInsertions = n - lpsLength;
    
    console.log(`String length: ${n}`);
    console.log(`LPS length: ${lpsLength}`);
    console.log(`Minimum insertions needed: ${minInsertions}`);
    
    return minInsertions;
}

// Run examples
console.log("=== Palindromic Subsequence Examples ===");

console.log("--- Basic LPS ---");
longestPalindromicSubsequence("bbbab");

console.log("--- LPS with Reconstruction ---");
longestPalindromicSubsequenceWithString("character");

console.log("--- Minimum Insertions ---");
minInsertionsForPalindrome("abcda");
```


## 3. Palindrome Partitioning

### The Optimal Segmentation Pattern

```javascript
/**
 * Palindrome Partitioning - Minimum cuts to partition string into palindromes
 * Find optimal way to split string so each part is a palindrome
 */

function palindromePartitioning(s) {
    console.log(`=== Palindrome Partitioning ===`);
    console.log(`String: "${s}"`);
    
    const n = s.length;
    
    // First, precompute palindrome check for all substrings
    const isPalindrome = Array.from({ length: n }, () => Array(n).fill(false));
    
    console.log("\nPrecomputing palindrome substrings:");
    
    // Single characters
    for (let i = 0; i < n; i++) {
        isPalindrome[i][i] = true;
    }
    
    // Two characters
    for (let i = 0; i < n - 1; i++) {
        if (s[i] === s[i + 1]) {
            isPalindrome[i][i + 1] = true;
            console.log(`"${s.substring(i, i + 2)}" is palindrome`);
        }
    }
    
    // Longer substrings
    for (let len = 3; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            
            if (s[i] === s[j] && isPalindrome[i + 1][j - 1]) {
                isPalindrome[i][j] = true;
                console.log(`"${s.substring(i, j + 1)}" is palindrome`);
            }
        }
    }
    
    // Now find minimum cuts
    console.log("\nFinding minimum cuts:");
    
    // dp[i] = minimum cuts needed for string s[0..i]
    const dp = new Array(n).fill(Infinity);
    
    for (let i = 0; i < n; i++) {
        if (isPalindrome[0][i]) {
            // Entire prefix is palindrome - no cuts needed
            dp[i] = 0;
            console.log(`s[0..${i}] = "${s.substring(0, i + 1)}" is palindrome - 0 cuts`);
        } else {
            // Try all possible last palindromes
            for (let j = 0; j < i; j++) {
                if (isPalindrome[j + 1][i]) {
                    dp[i] = Math.min(dp[i], dp[j] + 1);
                    console.log(`Cut after ${j}: dp[${j}] + 1 = ${dp[j]} + 1 = ${dp[j] + 1}`);
                }
            }
            console.log(`dp[${i}] = ${dp[i]} (for "${s.substring(0, i + 1)}")`);
        }
    }
    
    console.log(`\nMinimum cuts needed: ${dp[n - 1]}`);
    return dp[n - 1];
}

// Palindrome partitioning with actual partition
function palindromePartitioningWithSolution(s) {
    console.log(`\n=== Palindrome Partitioning with Solution ===`);
    
    const n = s.length;
    
    // Precompute palindromes
    const isPalindrome = Array.from({ length: n }, () => Array(n).fill(false));
    
    for (let i = 0; i < n; i++) {
        isPalindrome[i][i] = true;
    }
    
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            
            if (s[i] === s[j] && (len === 2 || isPalindrome[i + 1][j - 1])) {
                isPalindrome[i][j] = true;
            }
        }
    }
    
    // Find minimum cuts with cut positions
    const dp = new Array(n).fill(Infinity);
    const cutAfter = new Array(n).fill(-1);
    
    for (let i = 0; i < n; i++) {
        if (isPalindrome[0][i]) {
            dp[i] = 0;
        } else {
            for (let j = 0; j < i; j++) {
                if (isPalindrome[j + 1][i] && dp[j] + 1 < dp[i]) {
                    dp[i] = dp[j] + 1;
                    cutAfter[i] = j;
                }
            }
        }
    }
    
    // Reconstruct solution
    console.log("Reconstructing optimal partition:");
    const partitions = [];
    let end = n - 1;
    
    while (end >= 0) {
        const start = cutAfter[end] >= 0 ? cutAfter[end] + 1 : 0;
        const partition = s.substring(start, end + 1);
        partitions.unshift(partition);
        console.log(`Partition: "${partition}" [${start}, ${end}]`);
        end = cutAfter[end];
    }
    
    console.log(`Optimal partition: [${partitions.map(p => `"${p}"`).join(', ')}]`);
    console.log(`Number of cuts: ${dp[n - 1]}`);
    
    return { cuts: dp[n - 1], partitions };
}

// All palindromic partitions (backtracking with DP optimization)
function allPalindromePartitions(s) {
    console.log(`\n=== All Palindrome Partitions ===`);
    
    const n = s.length;
    const isPalindrome = Array.from({ length: n }, () => Array(n).fill(false));
    
    // Precompute palindromes
    for (let i = 0; i < n; i++) {
        isPalindrome[i][i] = true;
    }
    
    for (let len = 2; len <= n; len++) {
        for (let i = 0; i <= n - len; i++) {
            const j = i + len - 1;
            
            if (s[i] === s[j] && (len === 2 || isPalindrome[i + 1][j - 1])) {
                isPalindrome[i][j] = true;
            }
        }
    }
    
    // Find all partitions using backtracking
    const result = [];
    const currentPartition = [];
    
    function backtrack(start) {
        if (start === n) {
            result.push([...currentPartition]);
            return;
        }
        
        for (let end = start; end < n; end++) {
            if (isPalindrome[start][end]) {
                currentPartition.push(s.substring(start, end + 1));
                backtrack(end + 1);
                currentPartition.pop();
            }
        }
    }
    
    backtrack(0);
    
    console.log(`Found ${result.length} valid partitions:`);
    result.forEach((partition, idx) => {
        console.log(`${idx + 1}. [${partition.map(p => `"${p}"`).join(', ')}]`);
    });
    
    return result;
}

// Run examples
console.log("=== Palindrome Partitioning Examples ===");

console.log("--- Minimum Cuts ---");
palindromePartitioning("aab");

console.log("--- With Solution ---");
palindromePartitioningWithSolution("racecar");

console.log("--- All Partitions ---");
allPalindromePartitions("aab");
```


## 4. Word Break and String Segmentation

### The Dictionary Matching Pattern

```javascript
/**
 * Word Break Problem - Can string be segmented into dictionary words?
 * Classic string DP with dictionary lookup
 */

function wordBreak(s, wordDict) {
    console.log(`=== Word Break Problem ===`);
    console.log(`String: "${s}"`);
    console.log(`Dictionary: [${wordDict.map(w => `"${w}"`).join(', ')}]`);
    
    const n = s.length;
    const wordSet = new Set(wordDict);  // For O(1) lookup
    
    // dp[i] = can string s[0..i-1] be segmented
    const dp = new Array(n + 1).fill(false);
    dp[0] = true;  // Empty string can always be segmented
    
    console.log("\nChecking segmentation possibility:");
    console.log(`dp[0] = true (empty string)`);
    
    for (let i = 1; i <= n; i++) {
        console.log(`\nPosition ${i} (prefix: "${s.substring(0, i)}"):`);
        
        for (let j = 0; j < i; j++) {
            const word = s.substring(j, i);
            
            if (dp[j] && wordSet.has(word)) {
                dp[i] = true;
                console.log(`  Found: "${word}" at [${j}, ${i-1}], dp[${j}] = ${dp[j]}`);
                console.log(`  dp[${i}] = true`);
                break;
            } else if (wordSet.has(word)) {
                console.log(`  "${word}" in dict but dp[${j}] = ${dp[j]}`);
            }
        }
        
        if (!dp[i]) {
            console.log(`  dp[${i}] = false (no valid segmentation)`);
        }
    }
    
    console.log(`\nCan segment string: ${dp[n]}`);
    return dp[n];
}

// Word break with reconstruction
function wordBreakWithSolution(s, wordDict) {
    console.log(`\n=== Word Break with Solution ===`);
    
    const n = s.length;
    const wordSet = new Set(wordDict);
    
    // Track the word that ended at each position
    const dp = new Array(n + 1).fill(false);
    const wordEndingAt = new Array(n + 1).fill('');
    const segmentStart = new Array(n + 1).fill(-1);
    
    dp[0] = true;
    
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j < i; j++) {
            const word = s.substring(j, i);
            
            if (dp[j] && wordSet.has(word)) {
                dp[i] = true;
                wordEndingAt[i] = word;
                segmentStart[i] = j;
                break;  // Take first valid segmentation
            }
        }
    }
    
    if (!dp[n]) {
        console.log("No valid segmentation exists");
        return { canBreak: false, segmentation: [] };
    }
    
    // Reconstruct segmentation
    console.log("Reconstructing segmentation:");
    const segments = [];
    let pos = n;
    
    while (pos > 0) {
        const word = wordEndingAt[pos];
        const start = segmentStart[pos];
        
        segments.unshift(word);
        console.log(`Word: "${word}" at position [${start}, ${pos-1}]`);
        pos = start;
    }
    
    console.log(`Segmentation: [${segments.map(w => `"${w}"`).join(', ')}]`);
    return { canBreak: true, segmentation: segments };
}

// Word break II - return all possible segmentations
function wordBreakII(s, wordDict) {
    console.log(`\n=== Word Break II (All Solutions) ===`);
    
    const wordSet = new Set(wordDict);
    const memo = new Map();
    
    function backtrack(start) {
        if (start === s.length) {
            return [[]];  // Empty segmentation for empty suffix
        }
        
        if (memo.has(start)) {
            return memo.get(start);
        }
        
        const result = [];
        
        for (let end = start + 1; end <= s.length; end++) {
            const word = s.substring(start, end);
            
            if (wordSet.has(word)) {
                const suffixSegmentations = backtrack(end);
                
                for (const suffix of suffixSegmentations) {
                    result.push([word, ...suffix]);
                }
            }
        }
        
        memo.set(start, result);
        return result;
    }
    
    const allSegmentations = backtrack(0);
    
    console.log(`Found ${allSegmentations.length} valid segmentations:`);
    allSegmentations.forEach((segmentation, idx) => {
        console.log(`${idx + 1}. [${segmentation.map(w => `"${w}"`).join(', ')}]`);
    });
    
    return allSegmentations;
}

// Sentence screen fitting (related problem)
function wordsTyping(sentence, rows, cols) {
    console.log(`\n=== Sentence Screen Fitting ===`);
    console.log(`Sentence: [${sentence.map(w => `"${w}"`).join(', ')}]`);
    console.log(`Screen: ${rows} rows × ${cols} cols`);
    
    // Create a long string with sentence repeated
    const s = sentence.join(' ') + ' ';
    const len = s.length;
    
    let start = 0;  // Current position in the repeated sentence
    
    console.log("Fitting sentence on screen:");
    
    for (let i = 0; i < rows; i++) {
        start += cols;
        
        // Adjust if we're in the middle of a word
        while (start > 0 && s[start % len] !== ' ') {
            start--;
        }
        
        // Skip the space
        if (start > 0 && s[start % len] === ' ') {
            start++;
        }
        
        console.log(`Row ${i + 1}: position ${start} in repeated sentence`);
    }
    
    const completeSentences = Math.floor(start / len);
    console.log(`Complete sentences fitted: ${completeSentences}`);
    
    return completeSentences;
}

// Run examples
console.log("=== Word Break Examples ===");

const dictionary = ["leet", "code", "sand", "and", "cat"];

console.log("--- Basic Word Break ---");
wordBreak("leetcode", dictionary);

console.log("--- With Solution ---");
wordBreakWithSolution("catsanddog", ["cat", "cats", "and", "sand", "dog"]);

console.log("--- All Solutions ---");
wordBreakII("catsanddog", ["cat", "cats", "and", "sand", "dog"]);

console.log("--- Screen Fitting ---");
wordsTyping(["hello", "world"], 2, 8);
```


## Summary

### String DP & Edit Distance Mastery Achieved

**Comprehensive String Algorithm Arsenal:**
- **Edit Distance**: Optimal string transformations with insertion, deletion, substitution
- **Palindromic Patterns**: Longest palindromic subsequences and optimal partitioning
- **String Segmentation**: Dictionary-based word break and text parsing
- **Advanced Applications**: DNA analysis, text processing, and computational linguistics

**Strategic Pattern Recognition:**

**Sequence Alignment Mastery:**
- **Two-String DP**: Problems involving comparison of two sequences
- **Edit Operations**: Understanding cost models for different transformations
- **Path Reconstruction**: Tracking optimal decisions for solution recovery
- **Space Optimization**: Reducing memory complexity while maintaining correctness

**Palindrome Analysis Excellence:**
- **Symmetry Detection**: Efficiently finding palindromic structures in strings
- **Optimal Partitioning**: Minimizing cuts while maintaining palindrome property
- **Dynamic Length Handling**: Processing variable-length palindromic patterns
- **Substring Preprocessing**: Optimizing palindrome queries through precomputation

**Text Processing Sophistication:**
- **Dictionary Matching**: Efficient word boundary detection and validation
- **Segmentation Algorithms**: Breaking text into meaningful components
- **Multiple Solutions**: Enumerating all valid parsing options
- **Constraint Handling**: Managing space and formatting requirements

### Real-World Applications Mastery

**Bioinformatics and Computational Biology:**
- **DNA Sequence Alignment**: Comparing genetic sequences for mutation analysis
- **Protein Structure Prediction**: Finding palindromic patterns in amino acid sequences
- **Phylogenetic Analysis**: Computing evolutionary distances between species
- **Drug Discovery**: Molecular string matching for compound identification

**Natural Language Processing:**
- **Spell Checking**: Edit distance for correction suggestions
- **Machine Translation**: Sequence alignment for language mapping
- **Text Parsing**: Word break for tokenization and analysis
- **Document Similarity**: String distance metrics for content comparison

**Information Technology Applications:**
- **Version Control**: Computing diffs and patches for file changes
- **Database Systems**: Fuzzy string matching for record linkage
- **Search Engines**: Query suggestion and autocorrection systems
- **Data Cleaning**: Standardizing and deduplicating text records

**Software Engineering:**
- **Code Analysis**: Finding similar code patterns and refactoring opportunities
- **Testing**: Comparing expected vs actual output strings
- **Configuration Management**: Template processing and variable substitution
- **User Interface**: Input validation and formatting assistance

### Mathematical and Theoretical Foundations

**Algorithmic Complexity Analysis:**
- **Time Complexity**: Understanding O(mn) patterns and optimization opportunities
- **Space Complexity**: Trade-offs between memory usage and computational efficiency
- **Approximation Algorithms**: When exact solutions become computationally prohibitive
- **Parallel Processing**: Opportunities for distributed string processing

**Information Theory Connections:**
- **Minimum Description Length**: Edit distance as information measure
- **Kolmogorov Complexity**: String similarity and compression relationships
- **Entropy**: Pattern detection and randomness measurement
- **Error Correction**: String algorithms in communication systems

### Advanced Problem-Solving Framework

**String DP Problem Analysis:**
```
1. Problem Classification:
   - Single string: palindromes, partitioning
   - Two strings: alignment, transformation
   - Multiple strings: common subsequences
   - With constraints: dictionary, patterns
   
2. State Design:
   - Choose appropriate dimensions
   - Define meaningful state transitions
   - Optimize space usage when possible
   
3. Algorithm Strategy:
   - Bottom-up vs top-down approach
   - Preprocessing optimizations
   - Path reconstruction requirements
   
4. Implementation Optimization:
   - Space complexity reduction
   - Early termination conditions
   - Parallel processing opportunities
```

**Performance Optimization Techniques:**
- **Memoization**: Avoiding redundant computations in recursive solutions
- **Tabulation**: Bottom-up construction for predictable memory access
- **Space Compression**: Reducing memory from O(mn) to O(min(m,n))
- **Early Termination**: Stopping computation when bounds are exceeded

You now possess **comprehensive mastery of string dynamic programming** that enables **sophisticated text processing and analysis**. This expertise provides the **algorithmic foundation** for solving **complex string manipulation challenges** in **bioinformatics, natural language processing, and software engineering**.

The progression from **basic edit distance to advanced segmentation algorithms** represents a **fundamental advancement in text processing capability** - the ability to **model string transformations mathematically** and **find optimal solutions efficiently** for **real-world text analysis problems**.

This knowledge prepares you for **advanced applications** in **machine learning, computational biology, and data science** where **string algorithms form the backbone** of **intelligent text processing systems**.
