---
title: "String Pattern Matching"
description: "Master string searching algorithms. Learn naive pattern matching, KMP algorithm, Rabin-Karp algorithm, and Boyer-Moore algorithm for efficient text processing."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
  - pattern-matching
resources:
  - title: "String Matching Visualizations"
    type: "tool"
    url: "https://visualgo.net/en/suffixarray"
    description: "Interactive visualization of string matching algorithms"
  - title: "Pattern Matching Complexity"
    type: "reference"
    url: "https://en.wikipedia.org/wiki/String-searching_algorithm"
    description: "Comprehensive analysis of string matching algorithms"
  - title: "String Matching Problems"
    type: "practice"
    url: "https://leetcode.com/tag/string-matching/"
    description: "Practice problems for mastering pattern matching"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758827456/Portfolio/dsa/images/30/pattern_matching.png)

String Pattern Matching – The Art of Text Search Mastery
---------------------------------------------------------

Imagine you're a **digital forensics expert** 🔍 analyzing **massive text databases** to find **crucial evidence patterns**, where **inefficient search could mean missing critical clues** or **taking days instead of minutes**:

**🕵️ The Digital Detective Challenge:**

**📄 Scenario 1: Email Investigation (Naive Approach)**
```
Task: Find "confidential project alpha" in 50GB email database
Naive approach: Check every position in every email
Result: 3 days of processing time
Risk: Missing deadline for court hearing
Problem: Excessive redundant comparisons
```

**🔬 Scenario 2: DNA Sequence Analysis (Smart Pattern Matching)**
```
Task: Find specific gene sequence in 3 billion base pairs
Smart approach: Use KMP algorithm with preprocessing
Result: 2 hours of processing time
Success: Identify disease markers quickly
Advantage: Skip impossible match positions
```

**🌐 Scenario 3: Web Search Engine (Boyer-Moore Optimization)**
```
Task: Search billions of web pages for user queries
Optimization: Boyer-Moore with bad character heuristic
Result: Sub-second response times
Impact: Real-time search for millions of users
Magic: Start matching from end of pattern
```

**💡 The Pattern Matching Revolution:**
The difference between **naive string searching** and **intelligent pattern matching** is the difference between **examining every character** versus **learning from mismatches** to **skip impossible positions** - turning **intractable problems into real-time solutions**.


## The Theoretical Foundation

### String Matching Complexity Landscape

**The Fundamental Challenge:**
Given a **text T** of length **n** and a **pattern P** of length **m**, find all occurrences of P in T.

**Naive Approach Limitations:**
- **Time Complexity**: O(n × m) - quadratic in worst case
- **Redundant Work**: Rechecks characters after mismatch
- **No Learning**: Doesn't use information from partial matches
- **Worst Case**: Pattern like "aaab" in text "aaaaaaaaab"

**Advanced Algorithm Advantages:**
- **Preprocessing**: Learn pattern structure before searching
- **Mismatch Utilization**: Use partial match information to skip positions
- **Optimal Skipping**: Jump maximum safe distance after mismatch
- **Linear Time**: Achieve O(n + m) complexity

### Information Theory Perspective

**Pattern Matching as Information Processing:**
- **Entropy**: Patterns with more structure enable better preprocessing
- **Information Gain**: Each comparison provides information about possible matches
- **Redundancy Exploitation**: Repeated substrings allow intelligent skipping
- **Optimal Algorithms**: Minimize total character comparisons


## 1. Naive Pattern Matching - The Brute Force Baseline

### The Concept: Exhaustive Checking

**Real-World Analogy: Airport Security Manual Search**

Imagine **airport security** manually searching **every passenger's luggage** for **prohibited items**:

**🛂 Naive Security Search Strategy:**
```
Searching for "weapon" in luggage contents:
1. Start at first item in first bag
2. Compare "w-e-a-p-o-n" character by character
3. If mismatch at any position, move to next starting position
4. Repeat until bag is fully searched
5. Check every bag exhaustively

Problem: If "w-e-a-p-o" matches but "n" doesn't, 
         still must re-check "e-a-p-o-n" from next position
```

### Naive Pattern Matching Implementation

```javascript
/**
 * Naive Pattern Matching - Brute force string search
 * Time: O(n × m), Space: O(1)
 * Simple but inefficient due to redundant comparisons
 */

function naivePatternMatching(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    const matches = [];
    
    console.log(`Naive Pattern Matching: Finding "${pattern}" in text of length ${n}`);
    console.log("Text:", text.length > 50 ? text.substring(0, 50) + "..." : text);
    console.log("Pattern:", pattern);
    
    let totalComparisons = 0;
    
    // Check every possible starting position
    for (let i = 0; i <= n - m; i++) {
        let j;
        
        console.log(`\nChecking position ${i}:`);
        console.log(`Text window: "${text.substring(i, i + m)}"`);
        
        // Compare pattern with text starting at position i
        for (j = 0; j < m; j++) {
            totalComparisons++;
            
            console.log(`  Comparing text[${i + j}]='${text[i + j]}' with pattern[${j}]='${pattern[j]}'`);
            
            if (text[i + j] !== pattern[j]) {
                console.log(`  ❌ Mismatch at position ${j}`);
                break;
            }
        }
        
        // If we completed the pattern match
        if (j === m) {
            console.log(`  ✅ Match found at position ${i}`);
            matches.push(i);
        }
    }
    
    console.log(`\nNaive search completed:`);
    console.log(`Total comparisons: ${totalComparisons}`);
    console.log(`Matches found at positions: [${matches.join(', ')}]`);
    
    return matches;
}

// Analyze worst-case behavior
function analyzeNaiveWorstCase() {
    console.log("=== Naive Algorithm Worst Case Analysis ===");
    
    // Construct worst-case input
    const pattern = "aaab";
    const text = "a".repeat(20) + "b";
    
    console.log(`Worst case pattern: "${pattern}"`);
    console.log(`Worst case text: "${text}"`);
    console.log(`Expected comparisons: (n-m+1) × m = (${text.length}-${pattern.length}+1) × ${pattern.length} = ${(text.length - pattern.length + 1) * pattern.length}`);
    
    naivePatternMatching(text, pattern);
}

// Example usage
console.log("=== Naive Pattern Matching Examples ===");

const sampleText = "ABABDABACDABABCABCABCABC";
const samplePattern = "ABABCAB";

naivePatternMatching(sampleText, samplePattern);

analyzeNaiveWorstCase();
```

### Naive Algorithm Analysis

**Time Complexity:**
- **Best Case**: O(n) - pattern found immediately or not present
- **Average Case**: O(n + m) - for random text and pattern
- **Worst Case**: O(n × m) - maximum mismatches at each position

**Space Complexity:** O(1) - only uses constant extra space

**Limitations:**
- **Redundant comparisons**: Doesn't learn from partial matches
- **Poor worst-case**: Quadratic time for pathological inputs
- **No preprocessing**: Misses opportunities to skip positions


## 2. KMP Algorithm - The Partial Match Genius

### The Concept: Learn from Failures

**Real-World Analogy: Smart Password Cracking**

Imagine a **sophisticated password cracker** that **learns from failed attempts**:

**🔐 KMP Password Strategy:**
```
Cracking password with pattern "ABABCAB":

Naive approach: If "ABABC" matches but "A" fails at end,
                start over completely from next position

KMP insight: "ABABC" contains "AB" at both start and end!
            After failure, we know last "AB" could be start of new match
            Skip ahead intelligently instead of starting over

Pattern Analysis:
"ABABCAB" → Failure function shows overlap patterns
When mismatch occurs, jump to largest safe position
```

### KMP Algorithm Implementation

```javascript
/**
 * KMP (Knuth-Morris-Pratt) Algorithm
 * Time: O(n + m), Space: O(m)
 * Uses failure function to avoid redundant comparisons
 */

function kmpPatternMatching(text, pattern) {
    const n = text.length;
    const m = pattern.length;
    const matches = [];
    
    console.log(`KMP Pattern Matching: Finding "${pattern}" in text of length ${n}`);
    
    // Step 1: Build failure function (preprocessing)
    const failureFunction = buildFailureFunction(pattern);
    console.log("Failure function:", failureFunction);
    
    let i = 0; // Index for text
    let j = 0; // Index for pattern
    let comparisons = 0;
    
    console.log("\nSearching with KMP:");
    
    while (i < n) {
        comparisons++;
        
        console.log(`Comparing text[${i}]='${text[i]}' with pattern[${j}]='${pattern[j]}'`);
        
        if (text[i] === pattern[j]) {
            i++;
            j++;
            console.log(`  ✅ Match! Moving both pointers`);
        } else {
            console.log(`  ❌ Mismatch!`);
            
            if (j !== 0) {
                // Use failure function to skip
                const newJ = failureFunction[j - 1];
                console.log(`  Using failure function: j ${j} → ${newJ}`);
                j = newJ;
            } else {
                // No overlap possible, move text pointer
                console.log(`  No overlap possible, advancing text pointer`);
                i++;
            }
        }
        
        // Check if we found a complete match
        if (j === m) {
            const matchStart = i - j;
            console.log(`🎯 Complete match found at position ${matchStart}`);
            matches.push(matchStart);
            
            // Continue searching using failure function
            j = failureFunction[j - 1];
        }
    }
    
    console.log(`\nKMP search completed:`);
    console.log(`Total comparisons: ${comparisons}`);
    console.log(`Matches found at positions: [${matches.join(', ')}]`);
    
    return matches;
}

/**
 * Build failure function (also called LPS - Longest Proper Prefix Suffix)
 * For each position i, failure[i] = length of longest proper prefix 
 * that is also a suffix of pattern[0...i]
 */
function buildFailureFunction(pattern) {
    const m = pattern.length;
    const failure = new Array(m).fill(0);
    
    console.log(`Building failure function for pattern: "${pattern}"`);
    
    let len = 0; // Length of previous longest prefix suffix
    let i = 1;
    
    // First element is always 0
    console.log(`failure[0] = 0 (base case)`);
    
    while (i < m) {
        console.log(`\nProcessing position ${i}: '${pattern[i]}'`);
        console.log(`Current len (prefix length): ${len}`);
        console.log(`Comparing pattern[${i}]='${pattern[i]}' with pattern[${len}]='${pattern[len]}'`);
        
        if (pattern[i] === pattern[len]) {
            len++;
            failure[i] = len;
            console.log(`  ✅ Match! len becomes ${len}, failure[${i}] = ${len}`);
            i++;
        } else {
            if (len !== 0) {
                // Try shorter prefix
                console.log(`  ❌ Mismatch! Trying shorter prefix: len ${len} → ${failure[len - 1]}`);
                len = failure[len - 1];
            } else {
                // No proper prefix
                failure[i] = 0;
                console.log(`  ❌ No proper prefix, failure[${i}] = 0`);
                i++;
            }
        }
        
        console.log(`Current failure array: [${failure.slice(0, i).join(', ')}]`);
    }
    
    console.log(`Final failure function: [${failure.join(', ')}]`);
    return failure;
}

// Visualize failure function construction
function visualizeFailureFunction(pattern) {
    console.log(`\n=== Failure Function Visualization for "${pattern}" ===`);
    
    const failure = buildFailureFunction(pattern);
    
    console.log("\nPattern analysis:");
    for (let i = 0; i < pattern.length; i++) {
        const prefix = pattern.substring(0, failure[i]);
        const suffix = pattern.substring(i - failure[i] + 1, i + 1);
        
        console.log(`Position ${i}: '${pattern[i]}'`);
        console.log(`  Substring so far: "${pattern.substring(0, i + 1)}"`);
        console.log(`  LPS length: ${failure[i]}`);
        if (failure[i] > 0) {
            console.log(`  Longest proper prefix: "${prefix}"`);
            console.log(`  Matching suffix: "${suffix}"`);
        }
        console.log();
    }
}

// Example usage
console.log("=== KMP Algorithm Examples ===");

const kmpText = "ABABDABACDABABCABCABCABC";
const kmpPattern = "ABABCAB";

kmpPatternMatching(kmpText, kmpPattern);

// Visualize failure function for different patterns
const testPatterns = ["ABABCAB", "AAAA", "ABCDE", "ABABABAB"];
testPatterns.forEach(pattern => {
    visualizeFailureFunction(pattern);
});
```

### KMP Algorithm Analysis

**Time Complexity:** O(n + m)
- **Preprocessing**: O(m) to build failure function
- **Searching**: O(n) - each character examined at most twice
- **Total**: O(n + m) - linear time guarantee

**Space Complexity:** O(m) - storage for failure function

**Key Insights:**
- **Failure function**: Encodes pattern's self-similarity structure
- **No backtracking**: Text pointer never moves backward
- **Optimal skipping**: Jumps to longest possible overlap position
- **Worst-case optimal**: Achieves theoretical minimum for this approach


## 3. Rabin-Karp Algorithm - The Rolling Hash Master

### The Concept: Fingerprint Matching

**Real-World Analogy: Document Plagiarism Detection**

Imagine detecting **plagiarism** in **academic papers** using **document fingerprints**:

**📄 Rabin-Karp Document Strategy:**
```
Traditional approach: Compare every word-by-word
Rabin-Karp insight: Create "fingerprints" (hash values)

Example: Find "quick brown fox" in document
1. Calculate hash of "quick brown fox" = 12345
2. Calculate rolling hash for each 3-word window:
   - "the quick brown" → hash = 67890
   - "quick brown fox" → hash = 12345 ✓ (match!)
   - "brown fox jumps" → hash = 54321

Rolling hash magic: Update hash in O(1) time
Remove first word, add new word → instant new hash
```

### Rabin-Karp Algorithm Implementation

```javascript
/**
 * Rabin-Karp Algorithm - Rolling hash pattern matching
 * Average Time: O(n + m), Worst Time: O(n × m), Space: O(1)
 * Uses hash functions for fast average-case performance
 */

class RabinKarp {
    constructor(base = 256, prime = 101) {
        this.base = base;    // Base for hash calculation (number of characters)
        this.prime = prime;  // Prime number for modular arithmetic
    }
    
    search(text, pattern) {
        const n = text.length;
        const m = pattern.length;
        const matches = [];
        
        console.log(`Rabin-Karp Search: Finding "${pattern}" in text of length ${n}`);
        console.log(`Using base=${this.base}, prime=${this.prime}`);
        
        if (m > n) return matches;
        
        // Calculate hash values
        let patternHash = 0;
        let textHash = 0;
        let h = 1; // Hash multiplier for removing leading digit
        
        // Calculate h = base^(m-1) % prime
        for (let i = 0; i < m - 1; i++) {
            h = (h * this.base) % this.prime;
        }
        
        console.log(`Hash multiplier h = ${this.base}^${m-1} mod ${this.prime} = ${h}`);
        
        // Calculate initial hash values
        for (let i = 0; i < m; i++) {
            patternHash = (this.base * patternHash + pattern.charCodeAt(i)) % this.prime;
            textHash = (this.base * textHash + text.charCodeAt(i)) % this.prime;
        }
        
        console.log(`Initial pattern hash: ${patternHash}`);
        console.log(`Initial text hash: ${textHash}`);
        
        let hashComparisons = 0;
        let characterComparisons = 0;
        
        // Slide the pattern over text one by one
        for (let i = 0; i <= n - m; i++) {
            hashComparisons++;
            
            console.log(`\nPosition ${i}:`);
            console.log(`  Text window: "${text.substring(i, i + m)}"`);
            console.log(`  Text hash: ${textHash}, Pattern hash: ${patternHash}`);
            
            // Check if hash values match
            if (patternHash === textHash) {
                console.log(`  🔍 Hash match! Verifying character by character...`);
                
                // Verify character by character
                let j;
                for (j = 0; j < m; j++) {
                    characterComparisons++;
                    
                    if (text[i + j] !== pattern[j]) {
                        console.log(`    ❌ Character mismatch at position ${j}`);
                        break;
                    }
                }
                
                if (j === m) {
                    console.log(`    ✅ Confirmed match at position ${i}`);
                    matches.push(i);
                } else {
                    console.log(`    ❌ False positive (hash collision)`);
                }
            } else {
                console.log(`  ❌ Hash mismatch, skipping character verification`);
            }
            
            // Calculate hash for next window (rolling hash)
            if (i < n - m) {
                textHash = this.rollingHash(
                    textHash,
                    text.charCodeAt(i),        // Character to remove
                    text.charCodeAt(i + m),    // Character to add
                    h
                );
                console.log(`  Rolling hash: removed '${text[i]}', added '${text[i + m]}' → ${textHash}`);
            }
        }
        
        console.log(`\nRabin-Karp search completed:`);
        console.log(`Hash comparisons: ${hashComparisons}`);
        console.log(`Character comparisons: ${characterComparisons}`);
        console.log(`Matches found at positions: [${matches.join(', ')}]`);
        
        return matches;
    }
    
    /**
     * Calculate rolling hash: remove oldChar, add newChar
     */
    rollingHash(oldHash, oldChar, newChar, h) {
        // Remove leading character: subtract oldChar * base^(m-1)
        let newHash = (oldHash - oldChar * h) % this.prime;
        
        // Handle negative values
        if (newHash < 0) {
            newHash += this.prime;
        }
        
        // Shift and add new character
        newHash = (newHash * this.base + newChar) % this.prime;
        
        return newHash;
    }
    
    /**
     * Demonstrate hash collision handling
     */
    analyzeHashCollisions(text, pattern) {
        console.log(`\n=== Hash Collision Analysis ===`);
        console.log(`Text: "${text}"`);
        console.log(`Pattern: "${pattern}"`);
        
        const n = text.length;
        const m = pattern.length;
        const patternHash = this.calculateHash(pattern);
        
        console.log(`Pattern hash: ${patternHash}`);
        
        const collisions = [];
        for (let i = 0; i <= n - m; i++) {
            const window = text.substring(i, i + m);
            const windowHash = this.calculateHash(window);
            
            if (windowHash === patternHash && window !== pattern) {
                collisions.push({ position: i, window: window });
            }
        }
        
        console.log(`Hash collisions found: ${collisions.length}`);
        collisions.forEach(collision => {
            console.log(`  Position ${collision.position}: "${collision.window}" (hash=${patternHash})`);
        });
        
        return collisions;
    }
    
    calculateHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (this.base * hash + str.charCodeAt(i)) % this.prime;
        }
        return hash;
    }
}

// Example usage
console.log("=== Rabin-Karp Algorithm Examples ===");

const rabinKarp = new RabinKarp(256, 101);
const rkText = "GEEKS FOR GEEKS PROGRAMMING GEEKS";
const rkPattern = "GEEKS";

rabinKarp.search(rkText, rkPattern);

// Demonstrate hash collisions
const collisionText = "ABCABCABCABCABC";
const collisionPattern = "ABC";
rabinKarp.analyzeHashCollisions(collisionText, collisionPattern);

// Multiple pattern search using Rabin-Karp
function multiplePatternSearch(text, patterns) {
    console.log("\n=== Multiple Pattern Search ===");
    
    const rk = new RabinKarp();
    const results = {};
    
    patterns.forEach(pattern => {
        console.log(`\nSearching for "${pattern}":`);
        results[pattern] = rk.search(text, pattern);
    });
    
    return results;
}

const multiText = "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG";
const multiPatterns = ["THE", "QUICK", "JUMPS", "DOG"];
multiplePatternSearch(multiText, multiPatterns);
```

### Rabin-Karp Analysis

**Time Complexity:**
- **Average Case**: O(n + m) - few hash collisions
- **Worst Case**: O(n × m) - many hash collisions requiring character verification
- **Preprocessing**: O(m) - calculate pattern hash

**Space Complexity:** O(1) - constant extra space

**Advantages:**
- **Multiple patterns**: Efficient for searching multiple patterns simultaneously
- **Streaming data**: Works well with data streams
- **Average case optimal**: Fast when hash function is good

**Hash Function Quality:**
- **Good hash function**: Minimizes collisions, approaches O(n + m)
- **Poor hash function**: Many collisions, degrades to O(n × m)
- **Rolling hash**: O(1) hash updates make algorithm practical


## 4. Boyer-Moore Algorithm - The Backward Genius

### The Concept: Start from the End

**Real-World Analogy: Speed Reading Technique**

Imagine a **speed reader** who **starts from the end** of words to **quickly eliminate** impossible matches:

**📖 Boyer-Moore Speed Reading Strategy:**
```
Finding "EXAMPLE" in text:
Traditional: Start from 'E' and compare left-to-right
Boyer-Moore: Start from 'E' (end) and compare right-to-left

Text:    "SOME TEXT WITH EXAMPLES HERE"
Pattern: "EXAMPLE"

1. Align pattern with text: E-X-A-M-P-L-E
   Compare 'E' (pattern end) with 'T' (text)
   'T' not in pattern → skip entire pattern length!

2. Next alignment skips 7 positions forward
   Much faster than checking every position
```

### Boyer-Moore Algorithm Implementation

```javascript
/**
 * Boyer-Moore Algorithm - Efficient pattern matching with skip tables
 * Average Time: O(n/m), Worst Time: O(n × m), Space: O(σ + m)
 * σ = alphabet size, often better than linear time in practice
 */

class BoyerMoore {
    constructor(pattern) {
        this.pattern = pattern;
        this.m = pattern.length;
        
        // Build preprocessing tables
        this.badCharTable = this.buildBadCharacterTable();
        this.goodSuffixTable = this.buildGoodSuffixTable();
        
        console.log(`Boyer-Moore initialized for pattern: "${pattern}"`);
        console.log("Bad Character Table:", this.badCharTable);
        console.log("Good Suffix Table:", this.goodSuffixTable);
    }
    
    /**
     * Build bad character table
     * For each character, store the rightmost occurrence in pattern
     */
    buildBadCharacterTable() {
        const table = {};
        
        console.log("\nBuilding Bad Character Table:");
        
        // Initialize all characters to -1 (not found)
        for (let i = 0; i < this.m; i++) {
            const char = this.pattern[i];
            table[char] = i;
            console.log(`  '${char}' at position ${i}`);
        }
        
        return table;
    }
    
    /**
     * Build good suffix table (simplified version)
     * In practice, this is quite complex; here's a basic implementation
     */
    buildGoodSuffixTable() {
        const table = new Array(this.m).fill(this.m);
        
        // This is a simplified implementation
        // Full Boyer-Moore has complex good suffix preprocessing
        for (let i = 0; i < this.m - 1; i++) {
            table[i] = this.m - 1 - i;
        }
        
        return table;
    }
    
    search(text) {
        const n = text.length;
        const matches = [];
        let comparisons = 0;
        let skips = 0;
        
        console.log(`\nBoyer-Moore Search in text of length ${n}`);
        
        let i = 0; // Text index
        
        while (i <= n - this.m) {
            let j = this.m - 1; // Start from end of pattern
            
            console.log(`\nAlignment at position ${i}:`);
            console.log(`Text window:  "${text.substring(i, i + this.m)}"`);
            console.log(`Pattern:      "${this.pattern}"`);
            console.log(`Starting comparison from right (j=${j})`);
            
            // Compare pattern with text from right to left
            while (j >= 0 && this.pattern[j] === text[i + j]) {
                comparisons++;
                console.log(`  ✅ Match: pattern[${j}]='${this.pattern[j]}' == text[${i + j}]='${text[i + j]}'`);
                j--;
            }
            
            if (j < 0) {
                // Pattern found
                console.log(`🎯 Complete match found at position ${i}`);
                matches.push(i);
                i += this.goodSuffixTable[0]; // Move by good suffix rule
            } else {
                // Mismatch occurred
                comparisons++;
                const mismatchChar = text[i + j];
                console.log(`  ❌ Mismatch: pattern[${j}]='${this.pattern[j]}' != text[${i + j}]='${mismatchChar}'`);
                
                // Calculate skip using bad character rule
                const badCharSkip = this.calculateBadCharacterSkip(mismatchChar, j);
                const goodSuffixSkip = this.goodSuffixTable[j];
                
                const skip = Math.max(badCharSkip, goodSuffixSkip, 1);
                
                console.log(`  Bad character skip: ${badCharSkip}`);
                console.log(`  Good suffix skip: ${goodSuffixSkip}`);
                console.log(`  Using maximum skip: ${skip}`);
                
                i += skip;
                skips++;
            }
        }
        
        console.log(`\nBoyer-Moore search completed:`);
        console.log(`Total comparisons: ${comparisons}`);
        console.log(`Total skips: ${skips}`);
        console.log(`Matches found at positions: [${matches.join(', ')}]`);
        
        return matches;
    }
    
    calculateBadCharacterSkip(char, position) {
        const lastOccurrence = this.badCharTable[char];
        
        if (lastOccurrence === undefined) {
            // Character not in pattern, skip entire pattern
            const skip = position + 1;
            console.log(`    '${char}' not in pattern → skip ${skip} positions`);
            return skip;
        } else {
            // Character in pattern, skip to align with rightmost occurrence
            const skip = Math.max(1, position - lastOccurrence);
            console.log(`    '${char}' last seen at position ${lastOccurrence} → skip ${skip} positions`);
            return skip;
        }
    }
    
    /**
     * Demonstrate Boyer-Moore advantages
     */
    static compareWithNaive(text, pattern) {
        console.log(`\n=== Boyer-Moore vs Naive Comparison ===`);
        console.log(`Text: "${text}"`);
        console.log(`Pattern: "${pattern}"`);
        
        // Naive search
        console.log("\n--- Naive Search ---");
        const naiveMatches = naivePatternMatching(text, pattern);
        
        // Boyer-Moore search
        console.log("\n--- Boyer-Moore Search ---");
        const bm = new BoyerMoore(pattern);
        const bmMatches = bm.search(text);
        
        console.log(`\nResults comparison:`);
        console.log(`Naive matches: [${naiveMatches.join(', ')}]`);
        console.log(`Boyer-Moore matches: [${bmMatches.join(', ')}]`);
        console.log(`Results match: ${JSON.stringify(naiveMatches) === JSON.stringify(bmMatches)}`);
    }
}

// Example usage
console.log("=== Boyer-Moore Algorithm Examples ===");

const bmText = "HERE IS A SIMPLE EXAMPLE OF BOYER MOORE ALGORITHM EXAMPLE";
const bmPattern = "EXAMPLE";

const boyerMoore = new BoyerMoore(bmPattern);
boyerMoore.search(bmText);

// Performance comparison
BoyerMoore.compareWithNaive("ABAAABCDABABCABCABCABC", "ABABCAB");

// Best case demonstration
console.log("\n=== Boyer-Moore Best Case ===");
const bestCaseText = "ZZZZZZZZZZZZZZZZZZZZZZZZ";
const bestCasePattern = "ABC";

console.log(`Best case: Pattern "${bestCasePattern}" not in text of Z's`);
console.log("Boyer-Moore should skip maximum distances");

const bmBestCase = new BoyerMoore(bestCasePattern);
bmBestCase.search(bestCaseText);
```

### Boyer-Moore Analysis

**Time Complexity:**
- **Best Case**: O(n/m) - can skip multiple characters
- **Average Case**: O(n) - linear time for most practical inputs
- **Worst Case**: O(n × m) - pathological patterns and text

**Space Complexity:** O(σ + m) where σ is alphabet size

**Key Techniques:**
- **Bad Character Rule**: Skip based on mismatched character
- **Good Suffix Rule**: Skip based on matched suffix (complex preprocessing)
- **Right-to-left scanning**: Enables larger skips than left-to-right

**Practical Performance:**
- **Excellent for large alphabets**: English text, DNA sequences
- **Sublinear average case**: Often faster than O(n)
- **Text editors**: Used in many text search implementations


## Algorithm Comparison and Applications

### Performance Comparison Matrix

| Algorithm | Best Case | Average Case | Worst Case | Space | Preprocessing |
|-----------|-----------|--------------|------------|-------|---------------|
| Naive | O(n) | O(n) | O(n×m) | O(1) | None |
| KMP | O(n) | O(n+m) | O(n+m) | O(m) | O(m) |
| Rabin-Karp | O(n+m) | O(n+m) | O(n×m) | O(1) | O(m) |
| Boyer-Moore | O(n/m) | O(n) | O(n×m) | O(σ+m) | O(m+σ) |

### Real-World Applications

```javascript
/**
 * Practical String Matching Applications
 */

class StringSearchApplications {
    // Web search engine implementation
    static webSearch(documents, query) {
        console.log(`Web Search: Finding "${query}" in ${documents.length} documents`);
        
        const results = [];
        const kmp = new KMP();
        
        documents.forEach((doc, index) => {
            const matches = kmp.search(doc.content, query);
            if (matches.length > 0) {
                results.push({
                    docId: index,
                    title: doc.title,
                    matches: matches.length,
                    preview: StringSearchApplications.generatePreview(doc.content, query, matches[0])
                });
            }
        });
        
        return results.sort((a, b) => b.matches - a.matches);
    }
    
    // DNA sequence analysis
    static dnaSequenceAnalysis(genome, targetSequence) {
        console.log(`DNA Analysis: Finding sequence "${targetSequence}" in genome`);
        
        // Use Boyer-Moore for efficiency with 4-letter alphabet
        const bm = new BoyerMoore(targetSequence);
        const matches = bm.search(genome);
        
        return {
            sequence: targetSequence,
            occurrences: matches.length,
            positions: matches,
            significance: matches.length > 0 ? "Gene marker found" : "Sequence not present"
        };
    }
    
    // Plagiarism detection
    static plagiarismDetection(document1, document2, minLength = 20) {
        console.log(`Plagiarism Detection: Comparing documents`);
        
        const commonSubstrings = [];
        const rk = new RabinKarp();
        
        // Check all substrings of minimum length
        for (let i = 0; i <= document1.length - minLength; i++) {
            const substring = document1.substring(i, i + minLength);
            const matches = rk.search(document2, substring);
            
            if (matches.length > 0) {
                commonSubstrings.push({
                    text: substring,
                    doc1Position: i,
                    doc2Positions: matches
                });
            }
        }
        
        return {
            similarityScore: commonSubstrings.length / (document1.length - minLength + 1),
            commonPhrases: commonSubstrings.slice(0, 10) // Top 10
        };
    }
    
    // Text editor find/replace
    static textEditorSearch(text, pattern, replaceWith = null) {
        console.log(`Text Editor: ${replaceWith ? 'Replace' : 'Find'} "${pattern}"`);
        
        const kmp = new KMP();
        const matches = kmp.search(text, pattern);
        
        if (replaceWith) {
            // Perform replacement (reverse order to maintain indices)
            let result = text;
            for (let i = matches.length - 1; i >= 0; i--) {
                const pos = matches[i];
                result = result.substring(0, pos) + replaceWith + result.substring(pos + pattern.length);
            }
            return { originalText: text, newText: result, replacements: matches.length };
        }
        
        return { matches: matches.length, positions: matches };
    }
    
    static generatePreview(text, query, position, contextLength = 50) {
        const start = Math.max(0, position - contextLength);
        const end = Math.min(text.length, position + query.length + contextLength);
        
        return "..." + text.substring(start, end) + "...";
    }
}

// Demonstrate applications
console.log("\n=== String Matching Applications ===");

// Web search example
const documents = [
    { title: "Algorithms Guide", content: "String matching algorithms are fundamental in computer science" },
    { title: "Data Structures", content: "Arrays and strings are basic data structures for algorithms" },
    { title: "Programming Tips", content: "Efficient algorithms improve program performance significantly" }
];

const searchResults = StringSearchApplications.webSearch(documents, "algorithms");
console.log("Web search results:", searchResults);

// DNA analysis example
const dnaGenome = "ATCGATCGATCGATCGTAGCTAGCTAGCTAG";
const targetGene = "ATCG";
const dnaResults = StringSearchApplications.dnaSequenceAnalysis(dnaGenome, targetGene);
console.log("DNA analysis results:", dnaResults);

// Text editor example
const editorText = "The quick brown fox jumps over the lazy dog. The fox is quick.";
const findResult = StringSearchApplications.textEditorSearch(editorText, "quick");
const replaceResult = StringSearchApplications.textEditorSearch(editorText, "quick", "fast");
console.log("Find result:", findResult);
console.log("Replace result:", replaceResult);
```


## Summary

### String Pattern Matching Mastery Achieved

**Algorithm Portfolio Mastered:**
- **Naive Matching**: Foundation understanding of brute-force approach and its limitations
- **KMP Algorithm**: Linear-time guarantee through failure function preprocessing
- **Rabin-Karp**: Hash-based approach optimal for multiple pattern search
- **Boyer-Moore**: Sublinear average performance through intelligent skipping

**Strategic Algorithm Selection:**

**Naive Pattern Matching Foundation:**
- **Conceptual clarity**: Simple to understand and implement
- **Baseline performance**: O(n × m) worst-case establishes improvement targets
- **Educational value**: Demonstrates why advanced algorithms are necessary
- **Small data**: Acceptable for very small texts or patterns

**KMP Algorithm Excellence:**
- **Linear time guarantee**: Optimal O(n + m) performance in all cases
- **Failure function**: Encodes pattern structure for intelligent skipping
- **Real-time processing**: Suitable for streaming data and time-critical applications
- **Theoretical optimality**: Achieves best possible worst-case for this approach

**Rabin-Karp Versatility:**
- **Hash-based efficiency**: Fast average-case performance with good hash functions
- **Multiple pattern search**: Optimal for finding many patterns simultaneously
- **Rolling hash technique**: O(1) hash updates enable practical implementation
- **Collision handling**: Robust verification ensures correctness

**Boyer-Moore Superiority:**
- **Sublinear performance**: Can achieve O(n/m) in best case scenarios
- **Backward scanning**: Right-to-left comparison enables larger skips
- **Alphabet optimization**: Excellent performance for large character sets
- **Industrial standard**: Used in many text editors and search tools

### Real-World Impact and Applications

**Text Processing Systems:**
- **Search Engines**: Efficient indexing and query processing for billions of documents
- **Text Editors**: Real-time find/replace operations in large files
- **Code Editors**: Syntax highlighting and symbol search in source code
- **Database Systems**: String pattern matching in text fields and full-text search

**Bioinformatics and Scientific Computing:**
- **DNA Sequencing**: Finding gene patterns and mutations in genomic data
- **Protein Analysis**: Identifying structural patterns in amino acid sequences
- **Medical Imaging**: Pattern recognition in diagnostic image analysis
- **Drug Discovery**: Molecular pattern matching for compound identification

**Information Security:**
- **Intrusion Detection**: Network packet analysis for malicious patterns
- **Malware Detection**: Signature-based virus and threat identification
- **Digital Forensics**: Evidence pattern discovery in digital investigations
- **Plagiarism Detection**: Academic integrity and copyright protection

**Data Mining and Analytics:**
- **Log Analysis**: System monitoring and anomaly detection in server logs
- **Social Media**: Trend analysis and sentiment pattern recognition
- **Financial Systems**: Fraud detection through transaction pattern analysis
- **Business Intelligence**: Pattern discovery in customer behavior data

### Performance Optimization Guidelines

**Algorithm Selection Decision Matrix:**
```
Use Case                    | Optimal Algorithm        | Reason
=========================== | ======================== | ==========================
Single pattern, any text   | KMP                     | Guaranteed linear time
Multiple patterns          | Rabin-Karp              | Efficient hash reuse
Large alphabet text        | Boyer-Moore             | Maximum skip potential
Streaming/real-time data   | KMP                     | No backtracking needed
Very short patterns        | Naive                   | Overhead not justified
Memory-constrained systems | Boyer-Moore/Rabin-Karp  | Minimal space usage
Educational/debugging      | Naive                   | Simplest to understand
```

**Implementation Optimization:**
- **Hash function quality**: Critical for Rabin-Karp performance
- **Alphabet size considerations**: Boyer-Moore excels with large alphabets
- **Pattern characteristics**: Repetitive patterns favor KMP
- **Text characteristics**: Random text favors Boyer-Moore

You now possess the **theoretical foundation, algorithmic expertise, and practical wisdom** to choose and implement **optimal string pattern matching solutions** for any text processing challenge.

The journey from **naive O(n × m) brute force to sublinear Boyer-Moore optimization** represents a fundamental advancement in **algorithmic thinking** - the ability to **learn from partial information** and **exploit data structure** to achieve **dramatic performance improvements**.

This mastery transforms you from a programmer who **searches through text** into an engineer who **architectures information retrieval systems** that **scale efficiently** from **small documents to massive text corpora**, enabling the **real-time text processing capabilities** that power **modern search engines, databases, and analytical systems**.
