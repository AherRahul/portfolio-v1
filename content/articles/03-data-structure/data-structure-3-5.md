---
title: "Tries (Prefix Trees)"
description: "Master efficient string searching. Learn Trie structure, insertion, search, deletion operations, and applications in autocomplete, spell checkers, and IP routing."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - javascript
  - tries
  - prefix-trees
resources:
  - title: "Trie Visualizations"
    type: "tool"
    url: "https://visualgo.net/en/suffixarray"
    description: "Interactive trie operations and string matching visualization"
  - title: "Autocomplete Problems"
    type: "practice"
    url: "https://leetcode.com/tag/trie/"
    description: "Practice problems for mastering trie algorithms"
  - title: "String Algorithms"
    type: "reference"
    url: "https://en.wikipedia.org/wiki/Trie"
    description: "Comprehensive reference on trie data structure"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758827456/Portfolio/dsa/images/14/tries.png)

Tries (Prefix Trees) – Efficient String Search & Prefix Matching
================================================================

Imagine you're the **head librarian of the world's largest digital library** 📚 where millions of users search for books every second, and you need to provide **instant autocomplete suggestions** as they type:

**📚 The Digital Library Challenge:**

**⏰ Traditional String Search Problems:**
- **Linear Scanning**: Must check every book title letter by letter → O(n×m) time
- **No Prefix Matching**: Can't efficiently find all books starting with "Harry P..."
- **Memory Waste**: Storing complete words separately, massive duplication
- **Slow Autocomplete**: Users wait seconds for suggestions while typing

**🔍 The Search Reality:**
```
User types: "Har"
Traditional approach: 
- Check "Harry Potter..." (7 comparisons)
- Check "Heart of Darkness" (3 comparisons + mismatch)  
- Check "Hard Times" (3 comparisons + match)
- Check "Harmony" (3 comparisons + match)
- Check 1,000,000 other titles...
Result: Thousands of comparisons for simple prefix!
```

**🌳 The Trie Solution (Prefix Tree Magic):**
- **Shared Prefixes**: Common word beginnings stored **only once**
- **Branching Structure**: Each letter becomes a **path decision**
- **Prefix Navigation**: Follow path letter by letter to find all matches
- **Instant Suggestions**: All words with prefix "Har" found in **O(prefix_length)** time

**🎯 Trie Library Organization:**
```
The Prefix Tree Structure:
        ROOT
         |
         H
         |
         a
         |
         r (3 books start with "Har")
        / \
       d   r (branch: "Hard" vs "Harr")
       |   |
       y   y
       |   |
    [word] |
           |
           [space]
           |
           P
           |
           o
           |
           t
           |
           t
           |
           e
           |
           r
           |
        [word: "Harry Potter"]
```

**⚡ The Trie Performance Revolution:**
- **Search Time**: O(word_length) instead of O(total_words × average_length)
- **Prefix Matching**: O(prefix_length) to find ALL words with that prefix
- **Memory Efficiency**: Shared prefixes stored once, not duplicated
- **Autocomplete**: Instant suggestions as users type each character

**🔥 Real Example - Typing "CAT":**
```
Traditional Search:
- Scan "CARE" (3 matches + 1 mismatch)
- Scan "CARD" (3 matches + 1 mismatch)  
- Scan "CAR" (3 matches)
- Scan "CAT" (3 matches) ✓
- Continue scanning thousands more...

Trie Search:
1. Start at ROOT
2. Follow path: C → A → T (3 steps)
3. Found! No need to scan other words ✓
Total: Exactly 3 operations!
```

**📈 Autocomplete Magic Example:**
```
User types: "PRO"
Trie instantly returns:
- PROGRAM
- PROGRAMMING  
- PROGRAMMER
- PROGRESS
- PROJECT
- PROMISE
- PROBLEM

All found in O(3) time + O(results) time!
```

**🌍 Real-World Trie Applications:**
- **Search Engines**: Google's autocomplete suggestions as you type
- **Code Editors**: IntelliSense autocomplete for variable/function names
- **Spell Checkers**: Finding similar words and suggesting corrections
- **IP Routing**: Internet routers use tries for efficient packet routing
- **Phone Directories**: T9 predictive text on old mobile phones
- **DNS Resolution**: Domain name lookups use trie-like structures
- **Genome Analysis**: Finding DNA sequence patterns in bioinformatics

**💡 The Trie Advantage:**
- **Predictable Performance**: Search time depends only on word length, not database size
- **Prefix Power**: Efficiently find all words starting with any prefix
- **Memory Sharing**: Common prefixes stored once, significant space savings
- **Incremental Search**: Build suggestions character by character in real-time
- **Wildcard Support**: Can be extended to support pattern matching

This is exactly how tries work in computer science! They transform **string searching from expensive scanning** into **efficient tree traversal**, making them essential for any application requiring fast string operations and prefix matching!

## The Theoretical Foundation: What Are Tries? 🌲

### Understanding Trie Structure

**A trie (pronounced "try") is a tree-like data structure designed for efficient storage and retrieval of strings. Each node represents a character, and the path from root to any node represents a prefix.** The key insight is that **shared prefixes are stored only once**, making tries extremely memory-efficient for large string collections.

**Core Trie Concepts:**

1. **Tree Structure**: Each node contains character mappings to child nodes
2. **Path Representation**: Root-to-node path represents a string prefix
3. **End Markers**: Special flags indicate complete word endings
4. **Shared Prefixes**: Common beginnings stored once, branches at differences
5. **Character Mapping**: Usually implemented with arrays or hash maps

**Trie Structure Example:**
```
Words: ["CAR", "CARD", "CARE", "CAREFUL", "CATS", "DOG"]

        ROOT
       /    \
      C      D
      |      |
      A      O
      |      |
      R      G
    / | \    |
   $ D  E    $
     | |
     $ F
       |
       U
       |
       L
       |
       $

$ = end of word marker
```

### Trie vs Other String Structures

**Trie vs Hash Table:**
- **Trie**: O(word_length) search, prefix matching, sorted traversal
- **Hash Table**: O(1) average search, no prefix support, no ordering

**Trie vs Binary Search Tree (for strings):**
- **Trie**: O(word_length) operations, prefix matching, shared storage
- **BST**: O(log n) operations, full string comparisons, separate storage

**Trie vs Array of Strings:**
- **Trie**: O(word_length) search, shared prefixes, prefix matching
- **Array**: O(n) search, duplicate storage, expensive prefix finding

### Memory and Time Complexity

**Time Complexities:**
- **Search**: O(word_length) - independent of dictionary size
- **Insert**: O(word_length) - traverse and create path
- **Delete**: O(word_length) - mark end or remove nodes
- **Prefix Search**: O(prefix_length + results) - find all matches

**Space Complexity:**
- **Worst Case**: O(alphabet_size × total_characters) - no shared prefixes
- **Best Case**: O(unique_characters) - maximum prefix sharing
- **Typical**: Much better than separate string storage due to prefix sharing

### Character Set Considerations

**Alphabet Size Impact:**
- **English (26 letters)**: Small arrays or simple hash maps per node
- **Unicode**: Hash maps required due to large character space
- **Binary**: Simple left/right child pointers (for binary strings)
- **DNA (4 bases)**: Very compact array representation

## Trie Implementation 🔧

**Concept**: Complete trie implementation with insertion, search, deletion, and prefix operations.

```javascript
// Complete Trie Implementation for String Processing

class TrieNode {
    constructor() {
        this.children = new Map(); // Character -> TrieNode mapping
        this.isEndOfWord = false;  // Marks complete word ending
        this.wordCount = 0;        // Count of words passing through this node
        this.endCount = 0;         // Count of words ending at this node
    }
    
    // Check if node has specific child
    hasChild(char) {
        return this.children.has(char);
    }
    
    // Get child node for character
    getChild(char) {
        return this.children.get(char);
    }
    
    // Add child node for character
    setChild(char, node) {
        this.children.set(char, node);
    }
    
    // Remove child node for character
    removeChild(char) {
        this.children.delete(char);
    }
    
    // Get all child characters
    getChildrenKeys() {
        return Array.from(this.children.keys()).sort();
    }
    
    // Check if node is leaf (no children)
    isLeaf() {
        return this.children.size === 0;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
        this.totalWords = 0;
        this.uniqueWords = 0;
    }
    
    // Insert word into trie - O(word_length)
    insert(word) {
        console.log(`\n➕ INSERTING word: "${word}"`);
        console.log(`Current state: ${this.totalWords} total words, ${this.uniqueWords} unique`);
        
        if (!word || word.length === 0) {
            console.log(`❌ Cannot insert empty word`);
            return false;
        }
        
        let current = this.root;
        const path = ['ROOT'];
        
        console.log(`Starting insertion from ROOT:`);
        
        // Traverse/create path for each character
        for (let i = 0; i < word.length; i++) {
            const char = word[i].toLowerCase();
            console.log(`  Step ${i + 1}: Processing character '${char}'`);
            
            if (!current.hasChild(char)) {
                console.log(`    Creating new node for '${char}'`);
                current.setChild(char, new TrieNode());
            } else {
                console.log(`    Using existing node for '${char}'`);
            }
            
            current = current.getChild(char);
            current.wordCount++;
            path.push(char.toUpperCase());
            
            console.log(`    Path so far: ${path.join(' → ')}`);
            console.log(`    Node word count: ${current.wordCount}`);
        }
        
        // Mark end of word
        const wasNewWord = !current.isEndOfWord;
        current.isEndOfWord = true;
        current.endCount++;
        
        if (wasNewWord) {
            this.uniqueWords++;
            console.log(`✅ New unique word added!`);
        } else {
            console.log(`📝 Duplicate word - incrementing count`);
        }
        
        this.totalWords++;
        
        console.log(`Final path: ${path.join(' → ')} [END]`);
        console.log(`Word frequency: ${current.endCount}`);
        console.log(`Updated totals: ${this.totalWords} total, ${this.uniqueWords} unique`);
        console.log(`Time Complexity: O(${word.length}) - independent of dictionary size`);
        
        return true;
    }
    
    // Search for exact word - O(word_length)
    search(word) {
        console.log(`\n🔍 SEARCHING for word: "${word}"`);
        
        if (!word || word.length === 0) {
            console.log(`❌ Cannot search for empty word`);
            return false;
        }
        
        let current = this.root;
        const path = ['ROOT'];
        
        console.log(`Starting search from ROOT:`);
        
        // Traverse path for each character
        for (let i = 0; i < word.length; i++) {
            const char = word[i].toLowerCase();
            console.log(`  Step ${i + 1}: Looking for character '${char}'`);
            
            if (!current.hasChild(char)) {
                console.log(`    ❌ Character '${char}' not found`);
                console.log(`    Available children: [${current.getChildrenKeys().join(', ')}]`);
                console.log(`    Word "${word}" does NOT exist in trie`);
                console.log(`    Time Complexity: O(${i + 1}) - early termination`);
                return false;
            }
            
            current = current.getChild(char);
            path.push(char.toUpperCase());
            
            console.log(`    ✅ Found '${char}' - continuing search`);
            console.log(`    Path so far: ${path.join(' → ')}`);
        }
        
        // Check if this is a complete word
        const isCompleteWord = current.isEndOfWord;
        
        if (isCompleteWord) {
            console.log(`✅ Word "${word}" found in trie!`);
            console.log(`Complete path: ${path.join(' → ')} [END]`);
            console.log(`Word frequency: ${current.endCount}`);
            console.log(`Words passing through final node: ${current.wordCount}`);
        } else {
            console.log(`❌ Path exists but "${word}" is not a complete word`);
            console.log(`Path: ${path.join(' → ')} [NO END MARKER]`);
            console.log(`This is a prefix of other words`);
        }
        
        console.log(`Time Complexity: O(${word.length}) - examined every character`);
        return isCompleteWord;
    }
    
    // Check if prefix exists - O(prefix_length)
    startsWith(prefix) {
        console.log(`\n🔎 CHECKING prefix: "${prefix}"`);
        
        if (!prefix || prefix.length === 0) {
            console.log(`✅ Empty prefix - all words start with empty string`);
            return true;
        }
        
        let current = this.root;
        const path = ['ROOT'];
        
        // Traverse path for each character
        for (let i = 0; i < prefix.length; i++) {
            const char = prefix[i].toLowerCase();
            console.log(`  Step ${i + 1}: Looking for character '${char}'`);
            
            if (!current.hasChild(char)) {
                console.log(`    ❌ Character '${char}' not found`);
                console.log(`    No words start with prefix "${prefix}"`);
                console.log(`    Time Complexity: O(${i + 1}) - early termination`);
                return false;
            }
            
            current = current.getChild(char);
            path.push(char.toUpperCase());
            console.log(`    ✅ Found '${char}' - continuing`);
        }
        
        console.log(`✅ Prefix "${prefix}" exists in trie!`);
        console.log(`Prefix path: ${path.join(' → ')}`);
        console.log(`Words with this prefix: ${current.wordCount}`);
        console.log(`Time Complexity: O(${prefix.length})`);
        
        return true;
    }
    
    // Get all words with given prefix - O(prefix_length + results)
    getWordsWithPrefix(prefix) {
        console.log(`\n📋 FINDING all words with prefix: "${prefix}"`);
        
        const results = [];
        
        // Navigate to prefix node
        let current = this.root;
        const prefixLower = prefix.toLowerCase();
        
        console.log(`Navigating to prefix node:`);
        for (let i = 0; i < prefixLower.length; i++) {
            const char = prefixLower[i];
            
            if (!current.hasChild(char)) {
                console.log(`❌ Prefix "${prefix}" not found - no words exist`);
                return results;
            }
            
            current = current.getChild(char);
            console.log(`  Found '${char}' - continuing to next character`);
        }
        
        console.log(`✅ Reached prefix node - starting word collection`);
        console.log(`Words with prefix "${prefix}": ${current.wordCount}`);
        
        // Collect all words starting from prefix node
        this.collectAllWords(current, prefixLower, results);
        
        console.log(`🎯 Found ${results.length} words with prefix "${prefix}":`);
        results.forEach((word, index) => {
            console.log(`  ${index + 1}. "${word}"`);
        });
        
        console.log(`Time Complexity: O(${prefix.length} + ${results.length})`);
        
        return results.sort();
    }
    
    // Recursively collect all words from a node
    collectAllWords(node, currentWord, results) {
        // If this node marks end of word, add to results
        if (node.isEndOfWord) {
            results.push(currentWord);
        }
        
        // Recursively explore all children
        for (const [char, childNode] of node.children) {
            this.collectAllWords(childNode, currentWord + char, results);
        }
    }
    
    // Delete word from trie - O(word_length)
    delete(word) {
        console.log(`\n🗑️ DELETING word: "${word}"`);
        
        if (!word || word.length === 0) {
            console.log(`❌ Cannot delete empty word`);
            return false;
        }
        
        const path = [];
        let current = this.root;
        
        // Build path to word
        for (let i = 0; i < word.length; i++) {
            const char = word[i].toLowerCase();
            
            if (!current.hasChild(char)) {
                console.log(`❌ Word "${word}" not found - cannot delete`);
                return false;
            }
            
            path.push({ node: current, char: char });
            current = current.getChild(char);
        }
        
        // Check if word exists
        if (!current.isEndOfWord) {
            console.log(`❌ "${word}" is not a complete word - cannot delete`);
            return false;
        }
        
        console.log(`✅ Found word "${word}" - proceeding with deletion`);
        
        // Mark as no longer end of word
        current.isEndOfWord = false;
        current.endCount = 0;
        this.totalWords--;
        this.uniqueWords--;
        
        // Clean up nodes if necessary (bottom-up)
        let nodeToCheck = current;
        
        for (let i = path.length - 1; i >= 0; i--) {
            const { node: parentNode, char } = path[i];
            
            // Decrease word count
            nodeToCheck.wordCount--;
            
            console.log(`  Checking node '${char}': wordCount=${nodeToCheck.wordCount}, isEnd=${nodeToCheck.isEndOfWord}, children=${nodeToCheck.children.size}`);
            
            // Remove node if it's no longer needed
            if (nodeToCheck.wordCount === 0 && !nodeToCheck.isEndOfWord && nodeToCheck.isLeaf()) {
                console.log(`    Removing unnecessary node '${char}'`);
                parentNode.removeChild(char);
            } else {
                console.log(`    Keeping node '${char}' (still needed)`);
                break; // Stop cleanup if node is still needed
            }
            
            nodeToCheck = parentNode;
        }
        
        console.log(`✅ Word "${word}" deleted successfully`);
        console.log(`Updated totals: ${this.totalWords} total, ${this.uniqueWords} unique`);
        console.log(`Time Complexity: O(${word.length})`);
        
        return true;
    }
    
    // Get all words in trie
    getAllWords() {
        console.log(`\n📚 GETTING all words in trie`);
        const results = [];
        this.collectAllWords(this.root, '', results);
        
        console.log(`Found ${results.length} words:`);
        results.sort().forEach((word, index) => {
            console.log(`  ${index + 1}. "${word}"`);
        });
        
        return results.sort();
    }
    
    // Count total words
    getWordCount() {
        return this.totalWords;
    }
    
    // Count unique words
    getUniqueWordCount() {
        return this.uniqueWords;
    }
    
    // Check if trie is empty
    isEmpty() {
        return this.totalWords === 0;
    }
    
    // Visualize trie structure
    visualizeTrie() {
        console.log(`\n🌳 TRIE STRUCTURE VISUALIZATION`);
        console.log(`Total words: ${this.totalWords} (${this.uniqueWords} unique)`);
        
        if (this.isEmpty()) {
            console.log(`Trie is empty`);
            return;
        }
        
        console.log(`\nTree structure:`);
        this.printTrieStructure(this.root, '', true, '');
        
        console.log(`\n📊 Statistics:`);
        console.log(`- Root children: ${this.root.children.size}`);
        console.log(`- Total words: ${this.totalWords}`);
        console.log(`- Unique words: ${this.uniqueWords}`);
        console.log(`- Average word frequency: ${(this.totalWords / Math.max(this.uniqueWords, 1)).toFixed(2)}`);
    }
    
    // Helper to print trie structure
    printTrieStructure(node, prefix, isLast, currentPath) {
        const children = Array.from(node.children.entries()).sort();
        const marker = node.isEndOfWord ? ` [END×${node.endCount}]` : '';
        const pathInfo = currentPath ? ` (${currentPath})` : ' (ROOT)';
        
        console.log(prefix + (isLast ? '└── ' : '├── ') + (currentPath.slice(-1) || 'ROOT') + marker);
        
        children.forEach(([char, childNode], index) => {
            const isLastChild = index === children.length - 1;
            const childPrefix = prefix + (isLast ? '    ' : '│   ');
            this.printTrieStructure(childNode, childPrefix, isLastChild, currentPath + char);
        });
    }
    
    // Autocomplete simulation
    simulateAutocomplete() {
        console.log('\n=== AUTOCOMPLETE SIMULATION ===');
        
        // Build dictionary
        const words = [
            'apple', 'application', 'apply', 'appreciate', 'approach',
            'car', 'card', 'care', 'careful', 'career',
            'cat', 'catch', 'category', 'cats',
            'dog', 'dogs', 'door', 'down'
        ];
        
        console.log('\nBuilding dictionary:');
        words.forEach(word => this.insert(word));
        
        this.visualizeTrie();
        
        // Simulate user typing
        const queries = ['app', 'car', 'ca', 'do', 'xyz'];
        
        console.log('\n🔍 AUTOCOMPLETE DEMO:');
        
        queries.forEach(query => {
            console.log(`\nUser types: "${query}"`);
            const suggestions = this.getWordsWithPrefix(query);
            
            if (suggestions.length > 0) {
                console.log(`💡 Autocomplete suggestions: ${suggestions.join(', ')}`);
            } else {
                console.log(`❌ No suggestions found`);
            }
        });
    }
    
    // Spell checker simulation
    simulateSpellChecker() {
        console.log('\n=== SPELL CHECKER SIMULATION ===');
        
        // Build dictionary
        const dictionary = ['hello', 'world', 'programming', 'algorithm', 'computer', 'science'];
        
        console.log('\nBuilding spell checker dictionary:');
        dictionary.forEach(word => this.insert(word));
        
        // Test words
        const testWords = ['hello', 'wrold', 'programming', 'algoritm', 'xyz'];
        
        console.log('\n📝 SPELL CHECKING:');
        
        testWords.forEach(word => {
            console.log(`\nChecking word: "${word}"`);
            const exists = this.search(word);
            
            if (exists) {
                console.log(`✅ "${word}" is spelled correctly`);
            } else {
                console.log(`❌ "${word}" not found in dictionary`);
                
                // Simple suggestion: find words with similar prefix
                for (let i = word.length; i > 0; i--) {
                    const prefix = word.substring(0, i);
                    const suggestions = this.getWordsWithPrefix(prefix);
                    
                    if (suggestions.length > 0) {
                        console.log(`💡 Did you mean: ${suggestions.slice(0, 3).join(', ')}?`);
                        break;
                    }
                }
            }
        });
    }
    
    // Demonstrate trie operations
    demonstrateTrie() {
        console.log('=== TRIE DATA STRUCTURE DEMONSTRATION ===\n');
        
        console.log('1. BUILDING TRIE WITH WORD INSERTIONS:');
        const words = ['cat', 'cats', 'car', 'card', 'care', 'careful', 'dog'];
        words.forEach(word => this.insert(word));
        
        console.log('\n2. TRIE STRUCTURE VISUALIZATION:');
        this.visualizeTrie();
        
        console.log('\n3. SEARCH OPERATIONS:');
        ['cat', 'car', 'carry', 'dog'].forEach(word => this.search(word));
        
        console.log('\n4. PREFIX OPERATIONS:');
        ['ca', 'car', 'do'].forEach(prefix => {
            this.startsWith(prefix);
            this.getWordsWithPrefix(prefix);
        });
        
        console.log('\n5. DELETION OPERATIONS:');
        this.delete('careful');
        this.delete('car');
        this.visualizeTrie();
        
        console.log('\n6. AUTOCOMPLETE SIMULATION:');
        const autocompleteTrie = new Trie();
        autocompleteTrie.simulateAutocomplete();
        
        console.log('\n7. SPELL CHECKER SIMULATION:');
        const spellCheckerTrie = new Trie();
        spellCheckerTrie.simulateSpellChecker();
        
        console.log(`\n🎯 TRIE APPLICATIONS SUMMARY:`);
        console.log(`✅ Autocomplete systems (search engines, text editors)`);
        console.log(`✅ Spell checkers and correction systems`);
        console.log(`✅ IP routing tables in network infrastructure`);
        console.log(`✅ T9 predictive text input systems`);
        console.log(`✅ Genome sequence analysis in bioinformatics`);
        console.log(`✅ DNS resolution and domain name lookups`);
        console.log(`✅ Code completion in IDEs and editors`);
        console.log(`✅ Dictionary implementations for word games`);
        
        return {
            totalWords: this.getWordCount(),
            uniqueWords: this.getUniqueWordCount(),
            allWords: this.getAllWords()
        };
    }
}

// Test trie operations
const trie = new Trie();
trie.demonstrateTrie();
```

### Advanced Trie Applications

**Concept**: Implementing specialized trie variants for real-world applications.

```javascript
// Advanced Trie Applications and Variants

// 1. Compressed Trie (Radix Tree) for Memory Efficiency
class CompressedTrieNode {
    constructor(key = '', isEndOfWord = false) {
        this.key = key;              // Compressed string segment
        this.isEndOfWord = isEndOfWord;
        this.children = new Map();
        this.value = null;           // Associated value for key-value pairs
    }
}

class RadixTree {
    constructor() {
        this.root = new CompressedTrieNode();
        this.size = 0;
    }
    
    insert(word, value = null) {
        console.log(`\n🗜️ COMPRESSED TRIE: Inserting "${word}"`);
        
        let current = this.root;
        let remaining = word;
        
        while (remaining.length > 0) {
            let found = false;
            
            // Look for matching child
            for (const [firstChar, child] of current.children) {
                if (firstChar === remaining[0]) {
                    const commonPrefix = this.findCommonPrefix(child.key, remaining);
                    
                    if (commonPrefix.length === child.key.length) {
                        // Full match with child key
                        console.log(`  Full match with child: "${child.key}"`);
                        current = child;
                        remaining = remaining.substring(commonPrefix.length);
                        found = true;
                        break;
                    } else if (commonPrefix.length > 0) {
                        // Partial match - need to split
                        console.log(`  Partial match: "${commonPrefix}" with "${child.key}"`);
                        this.splitNode(current, child, commonPrefix);
                        current = child;
                        remaining = remaining.substring(commonPrefix.length);
                        found = true;
                        break;
                    }
                }
            }
            
            if (!found) {
                // Create new child for remaining string
                console.log(`  Creating new node for: "${remaining}"`);
                const newNode = new CompressedTrieNode(remaining, true);
                newNode.value = value;
                current.children.set(remaining[0], newNode);
                this.size++;
                return;
            }
        }
        
        // Mark current node as end of word
        if (!current.isEndOfWord) {
            this.size++;
        }
        current.isEndOfWord = true;
        current.value = value;
        
        console.log(`  ✅ Insertion complete`);
    }
    
    findCommonPrefix(str1, str2) {
        let i = 0;
        while (i < str1.length && i < str2.length && str1[i] === str2[i]) {
            i++;
        }
        return str1.substring(0, i);
    }
    
    splitNode(parent, child, commonPrefix) {
        console.log(`    Splitting node: "${child.key}" at "${commonPrefix}"`);
        
        // Remove child from parent
        const childFirstChar = child.key[0];
        parent.children.delete(childFirstChar);
        
        // Create new intermediate node
        const intermediateNode = new CompressedTrieNode(commonPrefix);
        parent.children.set(commonPrefix[0], intermediateNode);
        
        // Update child key and attach to intermediate
        child.key = child.key.substring(commonPrefix.length);
        intermediateNode.children.set(child.key[0], child);
    }
    
    search(word) {
        console.log(`\n🔍 RADIX SEARCH: "${word}"`);
        
        let current = this.root;
        let remaining = word;
        
        while (remaining.length > 0 && current) {
            let found = false;
            
            for (const [firstChar, child] of current.children) {
                if (firstChar === remaining[0]) {
                    if (remaining.startsWith(child.key)) {
                        console.log(`  Matched segment: "${child.key}"`);
                        current = child;
                        remaining = remaining.substring(child.key.length);
                        found = true;
                        break;
                    }
                }
            }
            
            if (!found) {
                console.log(`  ❌ No matching path found`);
                return false;
            }
        }
        
        const result = remaining.length === 0 && current && current.isEndOfWord;
        console.log(`  ${result ? '✅' : '❌'} Search result: ${result}`);
        return result;
    }
    
    demonstrateRadixTree() {
        console.log('=== COMPRESSED TRIE (RADIX TREE) DEMO ===');
        
        const words = ['car', 'card', 'care', 'careful', 'cat', 'catch'];
        
        console.log('\nInserting words:');
        words.forEach(word => this.insert(word, `value_${word}`));
        
        console.log(`\n💾 Memory efficiency comparison:`);
        console.log(`Regular trie nodes: ~${words.join('').length} (one per character)`);
        console.log(`Compressed trie nodes: ~${this.size} (shared prefixes compressed)`);
        console.log(`Space savings: ~${((words.join('').length - this.size) / words.join('').length * 100).toFixed(1)}%`);
        
        return true;
    }
}

// 2. Suffix Trie for Pattern Matching
class SuffixTrie {
    constructor(text) {
        this.text = text;
        this.trie = new Trie();
        this.buildSuffixTrie();
    }
    
    buildSuffixTrie() {
        console.log(`\n🔚 BUILDING SUFFIX TRIE for: "${this.text}"`);
        
        // Insert all suffixes
        for (let i = 0; i < this.text.length; i++) {
            const suffix = this.text.substring(i);
            console.log(`  Adding suffix ${i + 1}: "${suffix}"`);
            this.trie.insert(suffix);
        }
        
        console.log(`✅ Suffix trie built with ${this.text.length} suffixes`);
    }
    
    findPattern(pattern) {
        console.log(`\n🎯 PATTERN SEARCH: Looking for "${pattern}"`);
        
        // Pattern exists if it's a prefix of any suffix
        const exists = this.trie.startsWith(pattern);
        
        if (exists) {
            // Find all occurrences
            const suffixes = this.trie.getWordsWithPrefix(pattern);
            const positions = suffixes.map(suffix => this.text.length - suffix.length);
            
            console.log(`✅ Pattern "${pattern}" found at positions: ${positions.join(', ')}`);
            return positions;
        } else {
            console.log(`❌ Pattern "${pattern}" not found`);
            return [];
        }
    }
    
    demonstrateSuffixTrie() {
        console.log('=== SUFFIX TRIE PATTERN MATCHING ===');
        
        const patterns = ['ana', 'ban', 'na', 'xyz'];
        
        patterns.forEach(pattern => {
            this.findPattern(pattern);
        });
        
        console.log(`\n💡 Suffix trie applications:`);
        console.log(`- Full-text search in documents`);
        console.log(`- DNA sequence analysis`);
        console.log(`- String pattern matching`);
        console.log(`- Longest common substring problems`);
        
        return true;
    }
}

// 3. IP Routing Trie (Binary Trie)
class IPRoutingTrie {
    constructor() {
        this.root = { children: [null, null], route: null }; // Binary children
    }
    
    insertRoute(ipCIDR, route) {
        console.log(`\n🌐 ADDING ROUTE: ${ipCIDR} → ${route}`);
        
        const [ip, prefixLength] = ipCIDR.split('/');
        const binaryIP = this.ipToBinary(ip);
        const prefix = binaryIP.substring(0, parseInt(prefixLength));
        
        console.log(`  IP: ${ip} → Binary: ${binaryIP}`);
        console.log(`  Prefix (/${prefixLength}): ${prefix}`);
        
        let current = this.root;
        
        for (let i = 0; i < prefix.length; i++) {
            const bit = parseInt(prefix[i]);
            console.log(`    Step ${i + 1}: Following bit ${bit}`);
            
            if (!current.children[bit]) {
                current.children[bit] = { children: [null, null], route: null };
                console.log(`      Created new node for bit ${bit}`);
            }
            
            current = current.children[bit];
        }
        
        current.route = route;
        console.log(`  ✅ Route installed: ${route}`);
    }
    
    findRoute(ip) {
        console.log(`\n🔍 ROUTING LOOKUP: ${ip}`);
        
        const binaryIP = this.ipToBinary(ip);
        console.log(`  Binary IP: ${binaryIP}`);
        
        let current = this.root;
        let bestRoute = null;
        let bestMatchLength = 0;
        
        for (let i = 0; i < binaryIP.length; i++) {
            const bit = parseInt(binaryIP[i]);
            
            if (!current.children[bit]) {
                console.log(`    No path for bit ${bit} at position ${i}`);
                break;
            }
            
            current = current.children[bit];
            
            if (current.route) {
                bestRoute = current.route;
                bestMatchLength = i + 1;
                console.log(`    Found route at /${bestMatchLength}: ${bestRoute}`);
            }
        }
        
        if (bestRoute) {
            console.log(`  ✅ Best matching route: ${bestRoute} (/${bestMatchLength})`);
        } else {
            console.log(`  ❌ No route found for ${ip}`);
        }
        
        return bestRoute;
    }
    
    ipToBinary(ip) {
        return ip.split('.')
                 .map(octet => parseInt(octet).toString(2).padStart(8, '0'))
                 .join('');
    }
    
    demonstrateIPRouting() {
        console.log('=== IP ROUTING TRIE DEMONSTRATION ===');
        
        // Add routes
        const routes = [
            ['192.168.0.0/16', 'Local Network'],
            ['192.168.1.0/24', 'Subnet A'],
            ['192.168.2.0/24', 'Subnet B'],
            ['10.0.0.0/8', 'Private Network'],
            ['0.0.0.0/0', 'Default Gateway']
        ];
        
        console.log('\nAdding routes to routing table:');
        routes.forEach(([cidr, route]) => this.insertRoute(cidr, route));
        
        // Test lookups
        const testIPs = ['192.168.1.100', '192.168.2.50', '10.5.5.5', '8.8.8.8'];
        
        console.log('\nTesting IP route lookups:');
        testIPs.forEach(ip => this.findRoute(ip));
        
        console.log(`\n💡 IP routing trie benefits:`);
        console.log(`- Longest prefix matching (most specific route)`);
        console.log(`- Fast O(32) lookup time (IPv4) or O(128) for IPv6`);
        console.log(`- Memory efficient for sparse routing tables`);
        console.log(`- Hardware-friendly for router implementations`);
        
        return true;
    }
}

// Demonstrate all advanced applications
console.log('\n' + '='.repeat(60));

console.log('\n1. COMPRESSED TRIE (RADIX TREE):');
const radixTree = new RadixTree();
radixTree.demonstrateRadixTree();

console.log('\n2. SUFFIX TRIE FOR PATTERN MATCHING:');
const suffixTrie = new SuffixTrie('banana');
suffixTrie.demonstrateSuffixTrie();

console.log('\n3. IP ROUTING TRIE:');
const ipTrie = new IPRoutingTrie();
ipTrie.demonstrateIPRouting();

console.log(`\n🌟 TRIE VARIANTS SUMMARY:`);
console.log(`- Standard Trie: General-purpose string storage and retrieval`);
console.log(`- Compressed Trie (Radix): Memory-efficient with compressed edges`);
console.log(`- Suffix Trie: Pattern matching and text analysis`);
console.log(`- Binary Trie: IP routing and binary string operations`);
console.log(`- Ternary Search Trie: Memory-efficient for large alphabets`);
```

## Summary

### Core Trie Concepts Mastered
- **Prefix-based Structure**: Shared prefixes stored once, branches at differences
- **Character Mapping**: Each node maps characters to child nodes
- **Path Representation**: Root-to-node paths represent string prefixes
- **End Markers**: Special flags indicate complete word endings

### Trie Operations Complexity
- **Search**: O(word_length) - independent of total words in dictionary
- **Insert**: O(word_length) - traverse and create character path
- **Delete**: O(word_length) - mark end or remove unnecessary nodes
- **Prefix Search**: O(prefix_length + results) - find all matching words
- **Space**: O(alphabet_size × unique_characters) - depends on prefix sharing

### Why Tries Are Essential
- **Prefix Efficiency**: Instant prefix matching and autocomplete suggestions
- **Memory Sharing**: Common prefixes stored once, significant space savings
- **Predictable Performance**: Operations depend only on word length, not dictionary size
- **Real-time Processing**: Build suggestions character-by-character as users type

### Real-World Trie Applications

**Search and Autocomplete:**
- **Search Engines**: Google's instant search suggestions
- **Text Editors**: IntelliSense and code completion in IDEs
- **Mobile Keyboards**: T9 predictive text and word suggestions
- **E-commerce**: Product search autocomplete

**Network Infrastructure:**
- **IP Routing**: Longest prefix matching in internet routers
- **DNS Resolution**: Domain name lookup optimization
- **Network Security**: URL filtering and pattern matching

**Text Processing:**
- **Spell Checkers**: Dictionary lookups and correction suggestions
- **Bioinformatics**: DNA sequence analysis and pattern finding
- **Natural Language**: Word validation and linguistic analysis

### Trie Variants and Optimizations

**Standard Trie:**
- **Best for**: General string storage with frequent prefix operations
- **Memory**: Good for datasets with many shared prefixes
- **Performance**: Consistent O(word_length) operations

**Compressed Trie (Radix Tree):**
- **Best for**: Memory-constrained environments
- **Memory**: Excellent - compresses single-child paths
- **Performance**: Slightly more complex but same asymptotic complexity

**Suffix Trie:**
- **Best for**: Pattern matching and text searching
- **Memory**: High - stores all suffixes of text
- **Performance**: Excellent for finding all pattern occurrences

**Binary Trie:**
- **Best for**: IP routing and binary string operations
- **Memory**: Optimal for binary alphabets
- **Performance**: Fixed O(bit_length) operations

### Trie vs Other String Structures

**Trie vs Hash Table:**
- **Trie**: Prefix operations, sorted traversal, predictable performance
- **Hash Table**: Faster exact lookups, no prefix support, potential collisions

**Trie vs Binary Search Tree:**
- **Trie**: Character-level operations, prefix matching
- **BST**: String-level comparisons, general ordering operations

**Trie vs Array:**
- **Trie**: Efficient insertion/deletion, prefix operations
- **Array**: Simple implementation, expensive insertions/deletions

### Performance Optimization Tips
- **Character Set**: Use arrays for small alphabets, hash maps for large ones
- **Compression**: Consider radix trees for memory efficiency
- **End Markers**: Use boolean flags rather than special characters
- **Path Compression**: Implement compressed tries for sparse datasets

### Advanced Trie Concepts
- **Ternary Search Tries**: Balance memory and performance for large alphabets
- **Bursting Tries**: Hybrid approach switching to arrays at certain densities
- **Cache-Oblivious Tries**: Optimize for modern memory hierarchies
- **Concurrent Tries**: Thread-safe implementations for parallel processing

### Implementation Considerations

**Character Handling:**
- **Case Sensitivity**: Normalize to lowercase for case-insensitive operations
- **Unicode Support**: Use Map/Object for international character sets
- **Special Characters**: Handle spaces, punctuation, and symbols appropriately

**Memory Management:**
- **Node Cleanup**: Remove unnecessary nodes during deletion
- **Reference Counting**: Track word frequency for analytics
- **Memory Pools**: Reuse node objects to reduce allocation overhead

**Error Handling:**
- **Input Validation**: Check for null/empty strings
- **Graceful Degradation**: Handle memory exhaustion and large inputs
- **Consistent State**: Maintain trie integrity during operations

Tries represent the **perfect solution for prefix-based string operations**, transforming expensive string scanning into efficient tree traversal. They're **essential for any application requiring fast string matching, autocomplete functionality, or prefix-based searching** - from search engines to network routers! 🚀✨

Next up: **Hash Tables & Advanced Structures** - Learn constant-time data access, collision resolution, and advanced hashing strategies for optimal performance!

<function_calls>
<invoke name="todo_write">
<parameter name="merge">true
