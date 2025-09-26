---
title: "Strings & String Algorithms"
description: "Dive deep into string manipulation and pattern matching. Learn string operations, substring algorithms, palindrome detection, and advanced string processing techniques."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "String Algorithm Visualizations"
    type: "tool"
    url: "https://visualgo.net/en/suffixarray"
    description: "Interactive string algorithm demonstrations"
  - title: "Regular Expressions Guide"
    type: "reference"
    url: "https://regexr.com/"
    description: "Interactive regular expression testing and learning"
  - title: "String Problems Practice"
    type: "practice"
    url: "https://leetcode.com/tag/string/"
    description: "Comprehensive string algorithm practice problems"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758827456/Portfolio/dsa/images/06/strings.png)

Strings & String Algorithms – The Art of Text Processing and Pattern Recognition
================================================================================

Imagine you're a **master codebreaker working for an intelligence agency** 🕵️‍♂️ during a critical mission where every decoded message could save lives:

**📜 The Intelligence Challenge:**
- **Encrypted Messages**: Enemy communications arrive as garbled text: "XJQQT BTWQI" that needs to be decoded to "HELLO WORLD"
- **Pattern Recognition**: You must find hidden codes within millions of intercepted documents - searching for specific patterns like "OPERATION" followed by a date
- **Language Analysis**: Determine if suspicious text is actually English, Russian, or a made-up code by analyzing letter frequency and structure
- **Document Authentication**: Verify if two documents are essentially the same despite minor differences in formatting or spelling

**🔍 Your Analytical Toolkit:**
- **Character-by-Character Analysis**: Like a detective examining each letter under a magnifying glass, checking for substitution patterns
- **Substring Detection**: Scanning through massive documents to find specific phrases or code words hidden anywhere within
- **Pattern Matching**: Using mathematical algorithms to detect repeating structures or cipher patterns
- **Text Transformation**: Converting between different formats, removing noise, and standardizing messages

**⚡ The Breakthrough Algorithms:**
- **Frequency Analysis**: Count letter occurrences to identify Caesar ciphers (A→D, B→E pattern)
- **String Matching**: Use sophisticated algorithms to find "needle in haystack" patterns instantly
- **Palindrome Detection**: Identify symmetric codes that read the same forwards and backwards
- **Edit Distance**: Measure how similar two documents are by counting minimum changes needed

**This is exactly how string algorithms work in computer science!** Every text operation you've ever used relies on sophisticated string processing:

**📱 Real-World String Processing:**
- **Search Engines**: Google processes billions of text queries, finding relevant pages in milliseconds
- **DNA Analysis**: Biologists search for gene patterns in massive DNA sequences using string matching
- **Spell Checkers**: Calculate edit distance to suggest corrections for misspelled words  
- **Plagiarism Detection**: Compare documents to find similar content and potential copying
- **Programming**: Code editors use string algorithms for syntax highlighting, autocomplete, and refactoring

**String algorithms are the invisible engines** powering text search, language processing, bioinformatics, and data analysis - transforming raw character sequences into meaningful information!

## The Theoretical Foundation: What Are Strings? 📝

### Understanding String Representation

**A string is a sequence of characters stored as an array-like structure, where each character occupies a specific position.** Think of it as a **sequence of symbols** that can represent text, DNA sequences, musical notes, or any ordered data.

**Core String Concepts:**

1. **Character Encoding**: How characters map to numbers (ASCII, Unicode, UTF-8)
2. **Immutability**: Many languages treat strings as unchangeable (create new strings for modifications)
3. **Indexing**: Access individual characters by position (0-based indexing)
4. **Length**: Number of characters in the string
5. **Operations**: Concatenation, substring extraction, searching, comparison

**String vs Array Relationship:**
```
String: "HELLO"
Array:  ['H', 'E', 'L', 'L', 'O']
Index:   0    1    2    3    4
```

### String Complexity Considerations

**Memory Layout:**
- **Sequential Storage**: Characters stored consecutively in memory
- **Length Tracking**: Most implementations store length for O(1) access
- **Encoding Overhead**: Unicode strings may use variable-width encoding

**Operation Complexities:**
- **Access**: O(1) - Direct character access by index
- **Length**: O(1) - Usually stored as metadata
- **Concatenation**: O(n + m) - Must copy both strings
- **Substring**: O(k) - Where k is substring length
- **Search**: O(n × m) naive, O(n + m) optimized algorithms

## Core String Operations with Implementation Details 🛠️

### Basic String Manipulation

**Concept**: Fundamental operations that form the building blocks of all string processing.

```javascript
// Comprehensive String Operations Implementation

class StringOperations {
    constructor() {
        this.operationCount = 0;
    }
    
    // Character access and analysis
    analyzeCharacters(str) {
        console.log(`🔍 CHARACTER ANALYSIS of "${str}"`);
        console.log(`String length: ${str.length}`);
        this.operationCount++;
        
        // Character frequency analysis
        const frequency = new Map();
        const charTypes = {
            letters: 0,
            digits: 0,
            spaces: 0,
            special: 0
        };
        
        for (let i = 0; i < str.length; i++) {
            const char = str[i];
            const charCode = char.charCodeAt(0);
            
            // Update frequency
            frequency.set(char, (frequency.get(char) || 0) + 1);
            
            // Categorize character
            if (char.match(/[a-zA-Z]/)) {
                charTypes.letters++;
            } else if (char.match(/[0-9]/)) {
                charTypes.digits++;
            } else if (char === ' ') {
                charTypes.spaces++;
            } else {
                charTypes.special++;
            }
            
            console.log(`char[${i}] = '${char}' (ASCII: ${charCode})`);
        }
        
        console.log(`\n📊 Character Statistics:`);
        console.log(`Letters: ${charTypes.letters}, Digits: ${charTypes.digits}`);
        console.log(`Spaces: ${charTypes.spaces}, Special: ${charTypes.special}`);
        
        console.log(`\n🔢 Character Frequencies:`);
        const sortedFreq = [...frequency.entries()].sort((a, b) => b[1] - a[1]);
        sortedFreq.forEach(([char, count]) => {
            console.log(`'${char}': ${count} times`);
        });
        
        console.log(`Time Complexity: O(n) - must examine each character`);
        
        return { frequency: frequency, types: charTypes };
    }
    
    // String concatenation with performance analysis
    stringConcatenation(str1, str2) {
        console.log(`\n🔗 STRING CONCATENATION`);
        console.log(`String 1: "${str1}" (length: ${str1.length})`);
        console.log(`String 2: "${str2}" (length: ${str2.length})`);
        this.operationCount++;
        
        // Method 1: Simple concatenation
        console.log(`\nMethod 1: Simple concatenation (+)`);
        const start1 = performance.now();
        const result1 = str1 + str2;
        const end1 = performance.now();
        
        console.log(`Result: "${result1}"`);
        console.log(`Time: ${(end1 - start1).toFixed(4)}ms`);
        console.log(`Time Complexity: O(n + m) - must copy all characters`);
        
        // Method 2: Array join (for multiple concatenations)
        console.log(`\nMethod 2: Array join (efficient for multiple strings)`);
        const start2 = performance.now();
        const result2 = [str1, str2].join('');
        const end2 = performance.now();
        
        console.log(`Result: "${result2}"`);
        console.log(`Time: ${(end2 - start2).toFixed(4)}ms`);
        console.log(`Advantage: More efficient for many concatenations`);
        
        // Method 3: Template literals
        console.log(`\nMethod 3: Template literals`);
        const start3 = performance.now();
        const result3 = `${str1}${str2}`;
        const end3 = performance.now();
        
        console.log(`Result: "${result3}"`);
        console.log(`Time: ${(end3 - start3).toFixed(4)}ms`);
        console.log(`Advantage: Readable and flexible`);
        
        console.log(`\n💡 Performance Note: JavaScript optimizes string operations internally`);
        
        return result1;
    }
    
    // Substring extraction and analysis
    substringOperations(str) {
        console.log(`\n✂️ SUBSTRING OPERATIONS on "${str}"`);
        this.operationCount++;
        
        const operations = [
            { name: 'First 5 characters', start: 0, end: 5 },
            { name: 'Last 5 characters', start: str.length - 5, end: str.length },
            { name: 'Middle portion', start: 2, end: str.length - 2 },
            { name: 'Single character', start: 3, end: 4 }
        ];
        
        operations.forEach(op => {
            console.log(`\n${op.name}:`);
            
            // Method 1: slice()
            const sliceResult = str.slice(op.start, op.end);
            console.log(`  slice(${op.start}, ${op.end}): "${sliceResult}"`);
            
            // Method 2: substring()
            const substringResult = str.substring(op.start, op.end);
            console.log(`  substring(${op.start}, ${op.end}): "${substringResult}"`);
            
            // Method 3: substr() (deprecated but still used)
            const length = op.end - op.start;
            const substrResult = str.substr(op.start, length);
            console.log(`  substr(${op.start}, ${length}): "${substrResult}"`);
            
            console.log(`  Time Complexity: O(k) where k = ${length} (substring length)`);
        });
        
        console.log(`\n🎯 Key Differences:`);
        console.log(`- slice(): Handles negative indices, more flexible`);
        console.log(`- substring(): Swaps arguments if start > end`);
        console.log(`- substr(): Uses start + length (deprecated)`);
        
        return str.slice(0, 5);
    }
    
    // String comparison algorithms
    stringComparison(str1, str2) {
        console.log(`\n⚖️ STRING COMPARISON`);
        console.log(`String 1: "${str1}"`);
        console.log(`String 2: "${str2}"`);
        this.operationCount++;
        
        // Lexicographic comparison
        console.log(`\nLexicographic Comparison (dictionary order):`);
        const compareResult = str1.localeCompare(str2);
        console.log(`str1.localeCompare(str2) = ${compareResult}`);
        
        if (compareResult < 0) {
            console.log(`"${str1}" comes before "${str2}" alphabetically`);
        } else if (compareResult > 0) {
            console.log(`"${str1}" comes after "${str2}" alphabetically`);
        } else {
            console.log(`"${str1}" and "${str2}" are equal`);
        }
        
        // Character-by-character comparison implementation
        console.log(`\nCharacter-by-character analysis:`);
        const minLength = Math.min(str1.length, str2.length);
        let diffIndex = -1;
        
        for (let i = 0; i < minLength; i++) {
            const char1 = str1[i];
            const char2 = str2[i];
            const code1 = char1.charCodeAt(0);
            const code2 = char2.charCodeAt(0);
            
            console.log(`Position ${i}: '${char1}' (${code1}) vs '${char2}' (${code2})`);
            
            if (char1 !== char2) {
                diffIndex = i;
                console.log(`  ➡️ First difference at position ${i}`);
                break;
            } else {
                console.log(`  ✅ Match`);
            }
        }
        
        if (diffIndex === -1 && str1.length !== str2.length) {
            console.log(`All compared characters match, but lengths differ`);
            console.log(`"${str1.length > str2.length ? str1 : str2}" is longer`);
        }
        
        console.log(`Time Complexity: O(min(n, m)) - stops at first difference`);
        
        return compareResult;
    }
    
    // Case transformation and normalization
    caseOperations(str) {
        console.log(`\n🔤 CASE TRANSFORMATION for "${str}"`);
        this.operationCount++;
        
        const transformations = {
            lowercase: str.toLowerCase(),
            uppercase: str.toUpperCase(),
            titleCase: str.replace(/\w\S*/g, (txt) => 
                txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()),
            camelCase: str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
                index === 0 ? word.toLowerCase() : word.toUpperCase()).replace(/\s+/g, ''),
            snakeCase: str.toLowerCase().replace(/\s+/g, '_'),
            kebabCase: str.toLowerCase().replace(/\s+/g, '-')
        };
        
        Object.entries(transformations).forEach(([name, result]) => {
            console.log(`${name.padEnd(12)}: "${result}"`);
        });
        
        // Character encoding considerations
        console.log(`\n🌐 Unicode Considerations:`);
        const unicodeString = "Café naïve résumé";
        console.log(`Original: "${unicodeString}"`);
        console.log(`Lowercase: "${unicodeString.toLowerCase()}"`);
        console.log(`Uppercase: "${unicodeString.toUpperCase()}"`);
        console.log(`Normalized: "${unicodeString.normalize('NFD')}"`);
        
        console.log(`Time Complexity: O(n) - must process each character`);
        
        return transformations;
    }
    
    // Demonstrate all basic string operations
    demonstrateBasicOperations() {
        console.log('=== BASIC STRING OPERATIONS DEMONSTRATION ===\n');
        
        const testString = "Hello World Programming";
        
        const charAnalysis = this.analyzeCharacters(testString);
        
        const concatenation = this.stringConcatenation("Data", " Structures");
        
        const substrings = this.substringOperations(testString);
        
        const comparison = this.stringComparison("Apple", "Banana");
        
        const caseOps = this.caseOperations("Hello World Programming");
        
        console.log(`\n📊 OPERATION SUMMARY:`);
        console.log(`Total operations performed: ${this.operationCount}`);
        console.log(`String processing is fundamental to text manipulation!`);
        
        return {
            charAnalysis: charAnalysis,
            concatenation: concatenation,
            substrings: substrings,
            comparison: comparison,
            caseOps: caseOps
        };
    }
}

// Test basic string operations
const stringOps = new StringOperations();
stringOps.demonstrateBasicOperations();
```

### Pattern Matching Algorithms

**Concept**: Sophisticated algorithms for finding patterns within text efficiently.

```javascript
// Advanced Pattern Matching Algorithms

class PatternMatchingAlgorithms {
    
    // Naive string matching algorithm
    naivePatternMatch(text, pattern) {
        console.log(`🔍 NAIVE PATTERN MATCHING`);
        console.log(`Text: "${text}" (length: ${text.length})`);
        console.log(`Pattern: "${pattern}" (length: ${pattern.length})`);
        
        const matches = [];
        let comparisons = 0;
        
        // Check every possible starting position
        for (let i = 0; i <= text.length - pattern.length; i++) {
            console.log(`\nChecking position ${i}:`);
            let matchFound = true;
            
            // Compare pattern with text starting at position i
            for (let j = 0; j < pattern.length; j++) {
                comparisons++;
                const textChar = text[i + j];
                const patternChar = pattern[j];
                
                console.log(`  Compare text[${i + j}]='${textChar}' with pattern[${j}]='${patternChar}'`);
                
                if (textChar !== patternChar) {
                    console.log(`  ❌ Mismatch found`);
                    matchFound = false;
                    break;
                } else {
                    console.log(`  ✅ Match`);
                }
            }
            
            if (matchFound) {
                console.log(`  🎯 PATTERN FOUND at position ${i}!`);
                matches.push(i);
            }
        }
        
        console.log(`\n📊 Results:`);
        console.log(`Matches found at positions: [${matches.join(', ')}]`);
        console.log(`Total comparisons: ${comparisons}`);
        console.log(`Time Complexity: O(n × m) - worst case checks every position`);
        console.log(`Space Complexity: O(1) - no extra space needed`);
        
        return { matches: matches, comparisons: comparisons };
    }
    
    // KMP (Knuth-Morris-Pratt) algorithm
    kmpPatternMatch(text, pattern) {
        console.log(`\n🚀 KMP PATTERN MATCHING`);
        console.log(`Text: "${text}"`);
        console.log(`Pattern: "${pattern}"`);
        
        // Build failure function (longest proper prefix which is also suffix)
        const lps = this.buildLPSArray(pattern);
        
        const matches = [];
        let textIndex = 0;
        let patternIndex = 0;
        let comparisons = 0;
        
        console.log(`\nStarting KMP search with LPS array: [${lps.join(', ')}]`);
        
        while (textIndex < text.length) {
            console.log(`\nPosition: text[${textIndex}]='${text[textIndex]}' vs pattern[${patternIndex}]='${pattern[patternIndex]}'`);
            comparisons++;
            
            if (text[textIndex] === pattern[patternIndex]) {
                console.log(`✅ Match found`);
                textIndex++;
                patternIndex++;
                
                // Complete pattern match found
                if (patternIndex === pattern.length) {
                    const matchPos = textIndex - patternIndex;
                    console.log(`🎯 COMPLETE PATTERN FOUND at position ${matchPos}!`);
                    matches.push(matchPos);
                    
                    // Use LPS to avoid unnecessary comparisons
                    patternIndex = lps[patternIndex - 1];
                    console.log(`Using LPS: reset pattern index to ${patternIndex}`);
                }
            } else {
                console.log(`❌ Mismatch`);
                
                if (patternIndex !== 0) {
                    // Use failure function to skip characters
                    const oldPatternIndex = patternIndex;
                    patternIndex = lps[patternIndex - 1];
                    console.log(`Using LPS: jump pattern index from ${oldPatternIndex} to ${patternIndex}`);
                } else {
                    textIndex++;
                    console.log(`No jump possible, advance text index to ${textIndex}`);
                }
            }
        }
        
        console.log(`\n📊 KMP Results:`);
        console.log(`Matches found at positions: [${matches.join(', ')}]`);
        console.log(`Total comparisons: ${comparisons}`);
        console.log(`Time Complexity: O(n + m) - linear time!`);
        console.log(`Space Complexity: O(m) - for LPS array`);
        
        return { matches: matches, comparisons: comparisons, lps: lps };
    }
    
    // Build LPS (Longest Proper Prefix which is also Suffix) array for KMP
    buildLPSArray(pattern) {
        console.log(`\n🔧 Building LPS array for pattern "${pattern}"`);
        
        const lps = new Array(pattern.length).fill(0);
        let length = 0; // Length of previous longest prefix suffix
        let i = 1;
        
        console.log(`LPS[0] = 0 (single character has no proper prefix)`);
        
        while (i < pattern.length) {
            console.log(`\nProcessing pattern[${i}]='${pattern[i]}' with length=${length}`);
            
            if (pattern[i] === pattern[length]) {
                length++;
                lps[i] = length;
                console.log(`✅ Match: pattern[${i}]='${pattern[i]}' === pattern[${length-1}]='${pattern[length-1]}'`);
                console.log(`LPS[${i}] = ${length}`);
                i++;
            } else {
                if (length !== 0) {
                    // Try shorter prefix
                    const oldLength = length;
                    length = lps[length - 1];
                    console.log(`❌ Mismatch: trying shorter prefix, length ${oldLength} → ${length}`);
                } else {
                    lps[i] = 0;
                    console.log(`❌ No prefix possible: LPS[${i}] = 0`);
                    i++;
                }
            }
        }
        
        console.log(`✅ LPS array complete: [${lps.join(', ')}]`);
        console.log(`💡 LPS[i] = length of longest proper prefix of pattern[0...i] that is also suffix`);
        
        return lps;
    }
    
    // Rabin-Karp algorithm using rolling hash
    rabinKarpPatternMatch(text, pattern) {
        console.log(`\n🎲 RABIN-KARP PATTERN MATCHING`);
        console.log(`Text: "${text}"`);
        console.log(`Pattern: "${pattern}"`);
        
        const textLen = text.length;
        const patternLen = pattern.length;
        const prime = 101; // Prime number for hash calculation
        const base = 256;  // Number of characters in alphabet
        
        if (patternLen > textLen) {
            console.log(`Pattern longer than text, no matches possible`);
            return { matches: [], comparisons: 0 };
        }
        
        // Calculate hash values
        let patternHash = 0;
        let textHash = 0;
        let h = 1; // hash multiplier: base^(patternLen-1) % prime
        
        // Calculate h = base^(patternLen-1) % prime
        for (let i = 0; i < patternLen - 1; i++) {
            h = (h * base) % prime;
        }
        
        console.log(`\n🔧 Hash Setup:`);
        console.log(`Base: ${base}, Prime: ${prime}, h: ${h}`);
        
        // Calculate initial hash values
        for (let i = 0; i < patternLen; i++) {
            patternHash = (base * patternHash + pattern.charCodeAt(i)) % prime;
            textHash = (base * textHash + text.charCodeAt(i)) % prime;
        }
        
        console.log(`Pattern hash: ${patternHash}`);
        console.log(`Initial text hash: ${textHash}`);
        
        const matches = [];
        let comparisons = 0;
        
        // Slide pattern over text
        for (let i = 0; i <= textLen - patternLen; i++) {
            console.log(`\nPosition ${i}: checking hash ${textHash} vs ${patternHash}`);
            
            if (textHash === patternHash) {
                console.log(`Hash match! Verifying character by character...`);
                
                // Hash values match, verify actual characters
                let match = true;
                for (let j = 0; j < patternLen; j++) {
                    comparisons++;
                    if (text[i + j] !== pattern[j]) {
                        console.log(`  Mismatch at position ${j}: '${text[i + j]}' vs '${pattern[j]}'`);
                        match = false;
                        break;
                    }
                }
                
                if (match) {
                    console.log(`🎯 PATTERN FOUND at position ${i}!`);
                    matches.push(i);
                }
            } else {
                console.log(`Hash mismatch, skipping character comparison`);
            }
            
            // Calculate rolling hash for next position
            if (i < textLen - patternLen) {
                const oldChar = text.charCodeAt(i);
                const newChar = text.charCodeAt(i + patternLen);
                
                textHash = (base * (textHash - oldChar * h) + newChar) % prime;
                
                // Handle negative hash values
                if (textHash < 0) {
                    textHash += prime;
                }
                
                console.log(`Rolling hash: remove '${text[i]}', add '${text[i + patternLen]}' → ${textHash}`);
            }
        }
        
        console.log(`\n📊 Rabin-Karp Results:`);
        console.log(`Matches found at positions: [${matches.join(', ')}]`);
        console.log(`Character comparisons: ${comparisons}`);
        console.log(`Time Complexity: O(n + m) average, O(n × m) worst case`);
        console.log(`💡 Advantage: Good for multiple pattern searches`);
        
        return { matches: matches, comparisons: comparisons };
    }
    
    // Compare all pattern matching algorithms
    compareAlgorithms(text, pattern) {
        console.log(`\n🏁 ALGORITHM COMPARISON`);
        console.log(`Text: "${text}"`);
        console.log(`Pattern: "${pattern}"`);
        console.log(`${'='.repeat(60)}`);
        
        // Test all algorithms
        const naive = this.naivePatternMatch(text, pattern);
        
        console.log(`\n${'='.repeat(60)}`);
        const kmp = this.kmpPatternMatch(text, pattern);
        
        console.log(`\n${'='.repeat(60)}`);
        const rabinKarp = this.rabinKarpPatternMatch(text, pattern);
        
        console.log(`\n📊 PERFORMANCE COMPARISON:`);
        console.log(`| Algorithm   | Matches | Comparisons | Time Complexity |`);
        console.log(`|-------------|---------|-------------|-----------------|`);
        console.log(`| Naive       | ${naive.matches.length.toString().padEnd(7)} | ${naive.comparisons.toString().padEnd(11)} | O(n × m)        |`);
        console.log(`| KMP         | ${kmp.matches.length.toString().padEnd(7)} | ${kmp.comparisons.toString().padEnd(11)} | O(n + m)        |`);
        console.log(`| Rabin-Karp  | ${rabinKarp.matches.length.toString().padEnd(7)} | ${rabinKarp.comparisons.toString().padEnd(11)} | O(n + m) avg    |`);
        
        console.log(`\n💡 WHEN TO USE EACH:`);
        console.log(`- Naive: Simple cases, educational purposes`);
        console.log(`- KMP: Single pattern, guaranteed O(n + m) time`);
        console.log(`- Rabin-Karp: Multiple patterns, good average case`);
        
        return { naive: naive, kmp: kmp, rabinKarp: rabinKarp };
    }
    
    // Demonstrate pattern matching algorithms
    demonstratePatternMatching() {
        console.log('=== PATTERN MATCHING ALGORITHMS DEMONSTRATION ===');
        
        const text = "ABABDABACDABABCABCABCABCABC";
        const pattern = "ABABCAB";
        
        const results = this.compareAlgorithms(text, pattern);
        
        return results;
    }
}

// Test pattern matching algorithms
console.log('\n' + '='.repeat(60));
const patternMatch = new PatternMatchingAlgorithms();
patternMatch.demonstratePatternMatching();
```

### String Transformation Algorithms

**Concept**: Algorithms that modify or analyze strings, including palindromes, anagrams, and edit distance.

```javascript
// String Transformation and Analysis Algorithms

class StringAnalysisAlgorithms {
    
    // Palindrome detection with multiple approaches
    palindromeDetection(str) {
        console.log(`🔄 PALINDROME DETECTION for "${str}"`);
        
        // Clean string (remove non-alphanumeric, convert to lowercase)
        const cleaned = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        console.log(`Cleaned string: "${cleaned}"`);
        
        // Approach 1: Two pointers
        console.log(`\nApproach 1: Two Pointers`);
        const twoPointerResult = this.isPalindromeTwo(cleaned);
        
        // Approach 2: Reverse comparison
        console.log(`\nApproach 2: Reverse Comparison`);
        const reverseResult = this.isPalindromeReverse(cleaned);
        
        // Approach 3: Recursive
        console.log(`\nApproach 3: Recursive`);
        const recursiveResult = this.isPalindromeRecursive(cleaned, 0, cleaned.length - 1);
        
        const isPalindrome = twoPointerResult && reverseResult && recursiveResult;
        console.log(`\n✅ Final result: "${str}" is ${isPalindrome ? '' : 'NOT '}a palindrome`);
        
        return isPalindrome;
    }
    
    isPalindromeTwo(str) {
        let left = 0;
        let right = str.length - 1;
        let comparisons = 0;
        
        while (left < right) {
            comparisons++;
            console.log(`  Compare str[${left}]='${str[left]}' with str[${right}]='${str[right]}'`);
            
            if (str[left] !== str[right]) {
                console.log(`  ❌ Mismatch found`);
                console.log(`  Time Complexity: O(n/2) = O(n), Comparisons: ${comparisons}`);
                return false;
            }
            
            console.log(`  ✅ Match`);
            left++;
            right--;
        }
        
        console.log(`  ✅ All characters match! Comparisons: ${comparisons}`);
        console.log(`  Time Complexity: O(n), Space Complexity: O(1)`);
        return true;
    }
    
    isPalindromeReverse(str) {
        const reversed = str.split('').reverse().join('');
        console.log(`  Original: "${str}"`);
        console.log(`  Reversed: "${reversed}"`);
        
        const isEqual = str === reversed;
        console.log(`  ${isEqual ? '✅' : '❌'} Strings are ${isEqual ? 'equal' : 'different'}`);
        console.log(`  Time Complexity: O(n), Space Complexity: O(n)`);
        
        return isEqual;
    }
    
    isPalindromeRecursive(str, left, right, depth = 0) {
        const indent = '  '.repeat(depth + 1);
        console.log(`${indent}Recursive call: isPalindrome(${left}, ${right})`);
        
        // Base case
        if (left >= right) {
            console.log(`${indent}✅ Base case reached: left >= right`);
            return true;
        }
        
        console.log(`${indent}Compare str[${left}]='${str[left]}' with str[${right}]='${str[right]}'`);
        
        if (str[left] !== str[right]) {
            console.log(`${indent}❌ Mismatch found`);
            return false;
        }
        
        console.log(`${indent}✅ Match, checking inner substring`);
        return this.isPalindromeRecursive(str, left + 1, right - 1, depth + 1);
    }
    
    // Anagram detection
    anagramDetection(str1, str2) {
        console.log(`\n🔀 ANAGRAM DETECTION`);
        console.log(`String 1: "${str1}"`);
        console.log(`String 2: "${str2}"`);
        
        // Clean and normalize strings
        const clean1 = str1.replace(/[^a-zA-Z]/g, '').toLowerCase();
        const clean2 = str2.replace(/[^a-zA-Z]/g, '').toLowerCase();
        
        console.log(`Cleaned 1: "${clean1}"`);
        console.log(`Cleaned 2: "${clean2}"`);
        
        if (clean1.length !== clean2.length) {
            console.log(`❌ Different lengths: ${clean1.length} vs ${clean2.length}`);
            return false;
        }
        
        // Approach 1: Character frequency counting
        console.log(`\nApproach 1: Character Frequency Counting`);
        const freq1 = this.getCharacterFrequency(clean1);
        const freq2 = this.getCharacterFrequency(clean2);
        
        console.log(`Frequency 1:`, Object.fromEntries(freq1));
        console.log(`Frequency 2:`, Object.fromEntries(freq2));
        
        // Compare frequencies
        for (const [char, count] of freq1) {
            if (freq2.get(char) !== count) {
                console.log(`❌ Frequency mismatch for '${char}': ${count} vs ${freq2.get(char) || 0}`);
                console.log(`Time Complexity: O(n), Space Complexity: O(k) where k = unique characters`);
                return false;
            }
        }
        
        console.log(`✅ All frequencies match!`);
        
        // Approach 2: Sorting (alternative method)
        console.log(`\nApproach 2: Sorting Comparison`);
        const sorted1 = clean1.split('').sort().join('');
        const sorted2 = clean2.split('').sort().join('');
        
        console.log(`Sorted 1: "${sorted1}"`);
        console.log(`Sorted 2: "${sorted2}"`);
        
        const sortedEqual = sorted1 === sorted2;
        console.log(`${sortedEqual ? '✅' : '❌'} Sorted strings are ${sortedEqual ? 'equal' : 'different'}`);
        console.log(`Time Complexity: O(n log n), Space Complexity: O(n)`);
        
        return sortedEqual;
    }
    
    getCharacterFrequency(str) {
        const frequency = new Map();
        for (const char of str) {
            frequency.set(char, (frequency.get(char) || 0) + 1);
        }
        return frequency;
    }
    
    // Edit Distance (Levenshtein Distance)
    editDistance(str1, str2) {
        console.log(`\n📏 EDIT DISTANCE (Levenshtein Distance)`);
        console.log(`String 1: "${str1}" (length: ${str1.length})`);
        console.log(`String 2: "${str2}" (length: ${str2.length})`);
        
        const m = str1.length;
        const n = str2.length;
        
        // Create DP table
        const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
        
        // Initialize base cases
        console.log(`\nInitializing DP table:`);
        for (let i = 0; i <= m; i++) {
            dp[i][0] = i; // Delete all characters from str1
            console.log(`dp[${i}][0] = ${i} (delete ${i} characters)`);
        }
        
        for (let j = 0; j <= n; j++) {
            dp[0][j] = j; // Insert all characters to make str2
            console.log(`dp[0][${j}] = ${j} (insert ${j} characters)`);
        }
        
        // Fill DP table
        console.log(`\nFilling DP table:`);
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                const char1 = str1[i - 1];
                const char2 = str2[j - 1];
                
                console.log(`\nComparing '${char1}' (str1[${i-1}]) with '${char2}' (str2[${j-1}])`);
                
                if (char1 === char2) {
                    dp[i][j] = dp[i - 1][j - 1]; // No operation needed
                    console.log(`  Characters match: dp[${i}][${j}] = dp[${i-1}][${j-1}] = ${dp[i][j]}`);
                } else {
                    const substitute = dp[i - 1][j - 1] + 1;
                    const delete_ = dp[i - 1][j] + 1;
                    const insert = dp[i][j - 1] + 1;
                    
                    dp[i][j] = Math.min(substitute, delete_, insert);
                    
                    console.log(`  Characters differ:`);
                    console.log(`    Substitute: ${substitute}, Delete: ${delete_}, Insert: ${insert}`);
                    console.log(`    dp[${i}][${j}] = min(${substitute}, ${delete_}, ${insert}) = ${dp[i][j]}`);
                }
            }
        }
        
        // Print DP table
        console.log(`\n📊 Final DP Table:`);
        console.log('    ' + '  '.repeat(str2.length) + str2.split('').join('  '));
        for (let i = 0; i <= m; i++) {
            const rowLabel = i === 0 ? ' ' : str1[i - 1];
            console.log(rowLabel + ' ' + dp[i].map(val => val.toString().padStart(2)).join(' '));
        }
        
        const distance = dp[m][n];
        console.log(`\n✅ Edit Distance: ${distance}`);
        console.log(`💡 Minimum operations needed to transform "${str1}" to "${str2}": ${distance}`);
        console.log(`Time Complexity: O(m × n), Space Complexity: O(m × n)`);
        
        return distance;
    }
    
    // Longest Common Subsequence
    longestCommonSubsequence(str1, str2) {
        console.log(`\n🔗 LONGEST COMMON SUBSEQUENCE`);
        console.log(`String 1: "${str1}"`);
        console.log(`String 2: "${str2}"`);
        
        const m = str1.length;
        const n = str2.length;
        const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));
        
        // Fill DP table
        for (let i = 1; i <= m; i++) {
            for (let j = 1; j <= n; j++) {
                if (str1[i - 1] === str2[j - 1]) {
                    dp[i][j] = dp[i - 1][j - 1] + 1;
                } else {
                    dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
                }
            }
        }
        
        // Reconstruct LCS
        let lcs = '';
        let i = m, j = n;
        
        while (i > 0 && j > 0) {
            if (str1[i - 1] === str2[j - 1]) {
                lcs = str1[i - 1] + lcs;
                i--; j--;
            } else if (dp[i - 1][j] > dp[i][j - 1]) {
                i--;
            } else {
                j--;
            }
        }
        
        console.log(`✅ LCS: "${lcs}" (length: ${dp[m][n]})`);
        console.log(`Time Complexity: O(m × n), Space Complexity: O(m × n)`);
        
        return { lcs: lcs, length: dp[m][n] };
    }
    
    // Demonstrate string analysis algorithms
    demonstrateStringAnalysis() {
        console.log('=== STRING ANALYSIS ALGORITHMS DEMONSTRATION ===');
        
        // Palindrome tests
        const palindromes = ["racecar", "A man a plan a canal Panama", "hello"];
        palindromes.forEach(str => {
            this.palindromeDetection(str);
            console.log('\n' + '-'.repeat(40));
        });
        
        // Anagram tests
        console.log('\nANAGRAM TESTS:');
        this.anagramDetection("listen", "silent");
        this.anagramDetection("The Eyes", "They See");
        
        // Edit distance tests
        console.log('\nEDIT DISTANCE TESTS:');
        this.editDistance("kitten", "sitting");
        this.editDistance("saturday", "sunday");
        
        // LCS tests
        console.log('\nLONGEST COMMON SUBSEQUENCE TESTS:');
        this.longestCommonSubsequence("ABCDGH", "AEDFHR");
        this.longestCommonSubsequence("programming", "algorithm");
        
        return true;
    }
}

// Test string analysis algorithms
console.log('\n' + '='.repeat(60));
const stringAnalysis = new StringAnalysisAlgorithms();
stringAnalysis.demonstrateStringAnalysis();
```

## Summary

### Core String Concepts Mastered
- **Character Operations**: Access, frequency analysis, and encoding considerations
- **Pattern Matching**: Naive, KMP, and Rabin-Karp algorithms for efficient searching
- **String Transformations**: Palindromes, anagrams, and edit distance calculations
- **Advanced Algorithms**: Dynamic programming approaches for string comparison

### String Algorithm Complexities
- **Access**: O(1) - Direct character access by index
- **Concatenation**: O(n + m) - Must copy all characters
- **Pattern Search**: O(n + m) with KMP, O(n × m) naive
- **Edit Distance**: O(n × m) - Dynamic programming solution
- **LCS**: O(n × m) - Dynamic programming for subsequence

### Why String Algorithms Matter
- **Text Processing**: Search engines, databases, and document analysis
- **Bioinformatics**: DNA sequence analysis and protein matching
- **Natural Language**: Spell checking, language translation, and text similarity
- **Security**: Pattern detection in network traffic and malware analysis

### Real-World Applications Demonstrated
- **Search Engines**: Pattern matching for web content indexing
- **DNA Analysis**: Sequence alignment and gene pattern detection
- **Spell Checkers**: Edit distance for suggestion algorithms
- **Plagiarism Detection**: Longest common subsequence analysis
- **Data Cleaning**: String normalization and duplicate detection

### Pattern Matching Algorithm Comparison
- **Naive**: Simple but O(n × m) complexity, good for small inputs
- **KMP**: Guaranteed O(n + m) with preprocessing, excellent for single patterns
- **Rabin-Karp**: Good average case, excellent for multiple pattern searches
- **Boyer-Moore**: Fast in practice, especially for large alphabets

### String Transformation Techniques
- **Palindrome Detection**: Multiple approaches with different trade-offs
- **Anagram Analysis**: Frequency counting vs sorting approaches
- **Edit Distance**: Measuring similarity between strings
- **LCS**: Finding common subsequences for comparison

### Performance Optimization Tips
1. **Choose Right Algorithm**: KMP for guaranteed performance, Rabin-Karp for multiple patterns
2. **Preprocessing**: Build auxiliary data structures for repeated operations
3. **Memory Efficiency**: Consider space-time trade-offs in algorithm selection
4. **String Immutability**: Understand language-specific string handling
5. **Unicode Considerations**: Handle international text correctly

### Advanced String Concepts
- **Suffix Arrays**: Efficient substring search structures
- **Trie Data Structures**: Prefix-based string storage and retrieval
- **Regular Expressions**: Pattern matching with complex rules
- **String Compression**: Algorithms like LZ77 and Huffman coding
- **Fuzzy Matching**: Approximate string matching techniques

### Next Steps in String Mastery
- **Practice Problems**: Solve string manipulation challenges
- **Study Suffix Trees**: Advanced pattern matching data structures
- **Learn Regular Expressions**: Powerful pattern matching tools
- **Explore Compression**: Understand string compression algorithms
- **Apply to Projects**: Use string algorithms in real applications

Strings are the **foundation of text processing** - every search, every spell check, every language translation relies on sophisticated string algorithms. Master these techniques, and you unlock the ability to process and analyze textual data at scale! 🚀✨

Next up: **Linked Lists & Variants** - Learn dynamic data structures that excel at insertion and deletion operations!
