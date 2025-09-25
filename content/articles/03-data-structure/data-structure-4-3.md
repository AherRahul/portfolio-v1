---
title: "Maps & Key-Value Structures"
description: "Master associative data structures. Learn map implementations, ordered maps, multi-maps, and advanced key-value storage techniques for efficient data retrieval."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - javascript
  - maps
  - key-value
resources:
  - title: "Map Visualizations"
    type: "tool"
    url: "https://visualgo.net/en/hashtable"
    description: "Interactive map operations and key-value storage visualization"
  - title: "Map Problems"
    type: "practice"
    url: "https://leetcode.com/tag/hash-table/"
    description: "Practice problems for mastering map-based algorithms"
  - title: "Associative Arrays"
    type: "reference"
    url: "https://en.wikipedia.org/wiki/Associative_array"
    description: "Comprehensive guide to associative data structures"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758827456/Portfolio/dsa/images/17/maps.png)

Maps & Key-Value Structures – The Foundation of Associative Data
================================================================

Imagine you're the **head librarian of a modern digital library** 📚 where **millions of books** need to be **instantly accessible** by **any identifying information** - not just their location, but by title, author, ISBN, subject, or even a brief description:

**📖 The Multi-Access Library Challenge:**

**🔍 Traditional Single-Index Problems:**
- **Location-Only Access**: Books organized by shelf number → Can only find by physical location
- **Linear Search**: To find book by title → Must scan every shelf sequentially  
- **Multiple Catalogs**: Separate filing systems for author, subject, year → Massive duplication
- **Update Nightmare**: New book → Must update dozens of separate index systems

**🎯 Real Scenario:**
```
Patron requests: "I need the book by Stephen King about a haunted hotel"
Traditional approach:
1. Search author catalog for "Stephen King" (5 minutes)
2. Find all his books (dozens of results) 
3. Manually scan descriptions looking for "haunted hotel" (10 minutes)
4. Hope you find "The Shining" eventually (15+ minutes total)

OR patron asks: "What's ISBN 978-0-385-12167-8?"
Traditional: Must search through ALL books to find matching ISBN (hours!)
```

**💡 The Map Solution (Universal Key-Value System):**
Think of it like having a **magical librarian assistant** who instantly knows **every possible way** to identify any book. Give any piece of information, get the complete book details immediately!

**🗂️ The Key-Value Magic:**
```javascript
// The Universal Book Map
const libraryMap = new Map([
    // Key (any identifier) → Value (complete book info)
    ["The Shining", {title: "The Shining", author: "Stephen King", isbn: "978-0-385-12167-8"}],
    ["Stephen King", [{title: "The Shining", ...}, {title: "It", ...}, {title: "Carrie", ...}]],
    ["978-0-385-12167-8", {title: "The Shining", author: "Stephen King", genre: "Horror"}],
    ["haunted hotel", {title: "The Shining", author: "Stephen King", description: "..."}],
    ["horror", [{title: "The Shining", ...}, {title: "Dracula", ...}, {title: "Frankenstein", ...}]]
]);

// Instant access by ANY key:
libraryMap.get("The Shining")        → Complete book details (0.001 seconds)
libraryMap.get("Stephen King")       → All his books (0.001 seconds)  
libraryMap.get("978-0-385-12167-8")  → Book by ISBN (0.001 seconds)
libraryMap.get("haunted hotel")      → Matching books (0.001 seconds)
```

**⚡ Map Performance Revolution:**
- **Any Key Access**: Find information using ANY identifier → O(1) instant lookup
- **Flexible Associations**: One book can have multiple keys pointing to it
- **Dynamic Updates**: Add new key-value pairs instantly → O(1) insertion
- **Memory Efficiency**: Store information once, reference from multiple keys

**🔄 Map vs Array Comparison:**
```
Array (Position-Based):
books[0] = "The Shining"
books[1] = "It" 
books[2] = "Carrie"

Access: books[1] → "It"
Problem: Must know exact position! What if you want book by title?

Map (Key-Based):
books.set("The Shining", bookDetails)
books.set("horror_classic", bookDetails)  
books.set("sk_1977", bookDetails)  // Same book, multiple keys!

Access: books.get("The Shining") → bookDetails
        books.get("horror_classic") → Same bookDetails
        books.get("sk_1977") → Same bookDetails
```

**🌟 Real-World Map Applications:**

**Web Development:**
- **User Sessions**: sessionId → user data, preferences, shopping cart
- **Database Records**: primary key → complete record information
- **Configuration**: setting name → configuration value
- **Caching Systems**: cache key → expensive computation results

**System Programming:**  
- **Symbol Tables**: variable name → memory address, type information
- **File Systems**: file path → inode, metadata, permissions
- **Memory Management**: virtual address → physical address mapping
- **Process Management**: process ID → process control block

**Data Processing:**
- **Indexing**: document ID → document content, metadata
- **Aggregation**: category → list of items, statistics
- **Lookup Tables**: code → description, translation
- **Frequency Counting**: item → occurrence count

**Game Development:**
- **Game State**: player ID → character stats, inventory, position
- **Asset Management**: asset name → texture, sound, model data
- **Configuration**: setting key → game option values
- **Leaderboards**: player name → score, achievements

**💎 Map Variants & Capabilities:**

**1. HashMap (Unordered):**
```javascript
const userMap = new Map();
userMap.set("user123", {name: "Alice", email: "alice@example.com"});
userMap.set("user456", {name: "Bob", email: "bob@example.com"});
// O(1) access, no ordering guaranteed
```

**2. TreeMap (Ordered):**
```javascript
const orderedScores = new Map([...entries].sort());
// Maintains key ordering, O(log n) access
// Range queries: get all scores between 80-90
```

**3. MultiMap (Multiple Values per Key):**
```javascript
const categoryMap = new Map();
categoryMap.set("fruits", ["apple", "banana", "orange"]);
categoryMap.set("fruits", [...categoryMap.get("fruits"), "grape"]); // Add more
// One key can map to multiple values
```

**🚀 The Map Advantage:**
- **Intuitive Access**: Natural key-based data retrieval
- **Flexible Keys**: Use strings, numbers, objects, anything as keys
- **Dynamic Associations**: Add/remove key-value pairs at runtime
- **Memory Efficiency**: Shared values with multiple key references
- **Language Support**: Built into most modern programming languages

This is exactly how maps work in computer science! They transform **positional data access** into **associative data access**, making information retrieval **intuitive, fast, and flexible**. From web applications to system programming, maps are the **foundation of modern data management**! 🚀✨

## The Theoretical Foundation: What Are Maps? 🗺️

### Understanding Associative Data Structures

**A map (also called associative array, dictionary, or hash table) is a data structure that implements a key-value association, where each unique key maps to exactly one value.** The fundamental concept is **associative access** - instead of accessing data by position (like arrays), you access data by meaningful identifiers.

**Core Map Properties:**

1. **Key-Value Association**: Each key uniquely identifies and maps to one value
2. **Unique Keys**: No duplicate keys allowed (though values can be duplicated)
3. **Dynamic Sizing**: Can grow and shrink as key-value pairs are added/removed
4. **Efficient Lookup**: Fast retrieval of values by their associated keys
5. **Flexible Keys**: Keys can be any data type (strings, numbers, objects)

**Map vs Other Data Structures:**

**Map vs Array:**
- **Map**: Key-based access, flexible keys, O(1) lookup by key
- **Array**: Index-based access, integer indices only, O(1) by index, O(n) by value

**Map vs Set:**
- **Map**: Key-value pairs, focuses on association and retrieval
- **Set**: Keys only, focuses on membership and uniqueness

**Map vs Object (in JavaScript):**
- **Map**: Any key type, maintains insertion order, size property
- **Object**: String/Symbol keys, optimized for records, prototype chain

### Map Implementation Strategies

**Hash-Based Maps (HashMap):**
- **Implementation**: Hash table with key-value pairs
- **Performance**: O(1) average case for get/set operations
- **Ordering**: No guaranteed key ordering
- **Best for**: General-purpose key-value storage

**Tree-Based Maps (TreeMap):**
- **Implementation**: Self-balancing binary search tree (Red-Black, AVL)
- **Performance**: O(log n) for all operations
- **Ordering**: Maintains sorted key order
- **Best for**: Range queries, ordered iteration

**Array-Based Maps:**
- **Implementation**: Array of key-value pairs
- **Performance**: O(n) for lookup, O(1) for insertion at end
- **Ordering**: Maintains insertion order
- **Best for**: Small maps, preservation of insertion order

### Key Design Considerations

**Key Equality and Hashing:**
- **Primitive Keys**: Direct comparison and hashing
- **Object Keys**: Reference equality vs. value equality
- **Custom Keys**: Must implement proper equality and hash functions
- **Hash Quality**: Good distribution prevents clustering and collisions

**Memory Management:**
- **Key Storage**: How keys are stored and compared
- **Value Storage**: Direct storage vs. reference storage
- **Load Factor**: Balance between memory usage and performance
- **Resize Strategy**: When and how to grow/shrink the underlying storage

## Map Implementation & Advanced Operations 🔧

**Concept**: Complete map implementation with multiple backing strategies and advanced features.

```javascript
// Comprehensive Map Implementation with Multiple Strategies

class AdvancedMap {
    constructor(implementation = 'hash') {
        this.implementation = implementation;
        this.size = 0;
        
        switch (implementation) {
            case 'hash':
                this.storage = new Map(); // Use native Map for hash-based
                break;
            case 'tree':
                this.storage = []; // Array of {key, value} for tree simulation
                break;
            case 'array':
                this.storage = []; // Array of {key, value} pairs
                break;
            default:
                throw new Error(`Unknown implementation: ${implementation}`);
        }
        
        this.operations = 0;
        
        console.log(`\n🏗️ ADVANCED MAP initialized with ${implementation} implementation`);
    }
    
    // Set key-value pair
    set(key, value) {
        console.log(`\n📝 SET operation: ${JSON.stringify(key)} → ${JSON.stringify(value)}`);
        console.log(`Implementation: ${this.implementation}`);
        console.log(`Current size: ${this.size}`);
        
        this.operations++;
        
        switch (this.implementation) {
            case 'hash':
                return this.hashSet(key, value);
            case 'tree':
                return this.treeSet(key, value);
            case 'array':
                return this.arraySet(key, value);
        }
    }
    
    // Hash-based set - O(1) average
    hashSet(key, value) {
        const hadKey = this.storage.has(key);
        
        if (!hadKey) {
            this.size++;
            console.log(`✅ New key added`);
        } else {
            console.log(`🔄 Existing key updated`);
        }
        
        this.storage.set(key, value);
        
        console.log(`Hash implementation: Direct native Map operation`);
        console.log(`Time Complexity: O(1) average case`);
        console.log(`New size: ${this.size}`);
        
        return this;
    }
    
    // Tree-based set - O(log n)
    treeSet(key, value) {
        console.log(`Tree implementation: Binary search insertion`);
        
        // Binary search for insertion point
        let left = 0;
        let right = this.storage.length;
        let insertIndex = right;
        let found = false;
        
        while (left < right) {
            const mid = Math.floor((left + right) / 2);
            const comparison = this.compareKeys(key, this.storage[mid].key);
            
            console.log(`  Binary search: comparing with index ${mid} (${JSON.stringify(this.storage[mid].key)})`);
            
            if (comparison === 0) {
                console.log(`    Found existing key at index ${mid}`);
                this.storage[mid].value = value;
                found = true;
                console.log(`🔄 Updated existing key`);
                break;
            } else if (comparison < 0) {
                right = mid;
                insertIndex = mid;
                console.log(`    Key is smaller - search left half`);
            } else {
                left = mid + 1;
                insertIndex = mid + 1;
                console.log(`    Key is larger - search right half`);
            }
        }
        
        if (!found) {
            console.log(`  Inserting new key-value pair at index ${insertIndex}`);
            this.storage.splice(insertIndex, 0, { key, value });
            this.size++;
            console.log(`✅ New key added at sorted position`);
        }
        
        console.log(`Time Complexity: O(log n) for search + O(n) for insertion = O(n)`);
        console.log(`New size: ${this.size}`);
        console.log(`Maintained sorted order: ${this.storage.map(item => JSON.stringify(item.key)).join(' < ')}`);
        
        return this;
    }
    
    // Array-based set - O(n)
    arraySet(key, value) {
        console.log(`Array implementation: Linear search`);
        
        // Linear search for existing key
        for (let i = 0; i < this.storage.length; i++) {
            console.log(`  Checking index ${i}: ${JSON.stringify(this.storage[i].key)}`);
            
            if (this.keysEqual(this.storage[i].key, key)) {
                console.log(`    Found existing key at index ${i}`);
                this.storage[i].value = value;
                console.log(`🔄 Updated existing key`);
                console.log(`Time Complexity: O(${i + 1}) - found at position ${i}`);
                return this;
            }
        }
        
        // Key not found, add to end
        this.storage.push({ key, value });
        this.size++;
        console.log(`✅ New key added at end (index ${this.storage.length - 1})`);
        console.log(`Time Complexity: O(${this.storage.length}) - linear search + O(1) insertion`);
        console.log(`New size: ${this.size}`);
        
        return this;
    }
    
    // Get value by key
    get(key) {
        console.log(`\n🔍 GET operation: ${JSON.stringify(key)}`);
        console.log(`Implementation: ${this.implementation}`);
        
        this.operations++;
        
        switch (this.implementation) {
            case 'hash':
                return this.hashGet(key);
            case 'tree':
                return this.treeGet(key);
            case 'array':
                return this.arrayGet(key);
        }
    }
    
    // Hash-based get - O(1) average
    hashGet(key) {
        const value = this.storage.get(key);
        const found = this.storage.has(key);
        
        console.log(`Hash implementation: Direct native Map lookup`);
        console.log(`Result: ${found ? `Found value ${JSON.stringify(value)}` : 'Key not found'}`);
        console.log(`Time Complexity: O(1) average case`);
        
        return value;
    }
    
    // Tree-based get - O(log n)
    treeGet(key) {
        console.log(`Tree implementation: Binary search lookup`);
        
        let left = 0;
        let right = this.storage.length - 1;
        let comparisons = 0;
        
        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            const comparison = this.compareKeys(key, this.storage[mid].key);
            comparisons++;
            
            console.log(`  Comparison ${comparisons}: checking index ${mid} (${JSON.stringify(this.storage[mid].key)})`);
            
            if (comparison === 0) {
                console.log(`    ✅ Found key at index ${mid}`);
                console.log(`Result: Found value ${JSON.stringify(this.storage[mid].value)}`);
                console.log(`Time Complexity: O(${comparisons}) = O(log n)`);
                return this.storage[mid].value;
            } else if (comparison < 0) {
                right = mid - 1;
                console.log(`    Key is smaller - search left half`);
            } else {
                left = mid + 1;
                console.log(`    Key is larger - search right half`);
            }
        }
        
        console.log(`❌ Key not found after ${comparisons} comparisons`);
        console.log(`Time Complexity: O(${comparisons}) = O(log n)`);
        return undefined;
    }
    
    // Array-based get - O(n)
    arrayGet(key) {
        console.log(`Array implementation: Linear search`);
        
        for (let i = 0; i < this.storage.length; i++) {
            console.log(`  Checking index ${i}: ${JSON.stringify(this.storage[i].key)}`);
            
            if (this.keysEqual(this.storage[i].key, key)) {
                console.log(`    ✅ Found key at index ${i}`);
                console.log(`Result: Found value ${JSON.stringify(this.storage[i].value)}`);
                console.log(`Time Complexity: O(${i + 1}) - linear search`);
                return this.storage[i].value;
            }
        }
        
        console.log(`❌ Key not found after searching ${this.storage.length} entries`);
        console.log(`Time Complexity: O(${this.storage.length}) - full linear search`);
        return undefined;
    }
    
    // Check if key exists
    has(key) {
        console.log(`\n❓ HAS operation: ${JSON.stringify(key)}`);
        
        const value = this.get(key);
        const exists = value !== undefined;
        
        console.log(`Result: Key ${exists ? 'EXISTS' : 'DOES NOT EXIST'}`);
        return exists;
    }
    
    // Delete key-value pair
    delete(key) {
        console.log(`\n🗑️ DELETE operation: ${JSON.stringify(key)}`);
        console.log(`Implementation: ${this.implementation}`);
        
        this.operations++;
        
        switch (this.implementation) {
            case 'hash':
                return this.hashDelete(key);
            case 'tree':
                return this.treeDelete(key);
            case 'array':
                return this.arrayDelete(key);
        }
    }
    
    // Hash-based delete - O(1) average
    hashDelete(key) {
        const existed = this.storage.has(key);
        
        if (existed) {
            this.storage.delete(key);
            this.size--;
            console.log(`✅ Key deleted successfully`);
        } else {
            console.log(`❌ Key not found - nothing to delete`);
        }
        
        console.log(`Time Complexity: O(1) average case`);
        console.log(`New size: ${this.size}`);
        
        return existed;
    }
    
    // Tree-based delete - O(n) worst case due to array splice
    treeDelete(key) {
        console.log(`Tree implementation: Binary search + array removal`);
        
        for (let i = 0; i < this.storage.length; i++) {
            if (this.compareKeys(key, this.storage[i].key) === 0) {
                console.log(`Found key at index ${i}`);
                console.log(`Removing element and shifting remaining elements`);
                
                this.storage.splice(i, 1);
                this.size--;
                
                console.log(`✅ Key deleted successfully`);
                console.log(`Time Complexity: O(n) - array element removal`);
                console.log(`New size: ${this.size}`);
                console.log(`Maintained sorted order: ${this.storage.map(item => JSON.stringify(item.key)).join(' < ')}`);
                
                return true;
            }
        }
        
        console.log(`❌ Key not found - nothing to delete`);
        return false;
    }
    
    // Array-based delete - O(n)
    arrayDelete(key) {
        console.log(`Array implementation: Linear search + removal`);
        
        for (let i = 0; i < this.storage.length; i++) {
            if (this.keysEqual(this.storage[i].key, key)) {
                console.log(`Found key at index ${i}`);
                console.log(`Removing element and shifting remaining elements`);
                
                this.storage.splice(i, 1);
                this.size--;
                
                console.log(`✅ Key deleted successfully`);
                console.log(`Time Complexity: O(n) - linear search + array removal`);
                console.log(`New size: ${this.size}`);
                
                return true;
            }
        }
        
        console.log(`❌ Key not found - nothing to delete`);
        return false;
    }
    
    // Get all keys
    keys() {
        console.log(`\n🔑 KEYS operation`);
        
        let keys;
        
        switch (this.implementation) {
            case 'hash':
                keys = Array.from(this.storage.keys());
                console.log(`Hash implementation: Keys in insertion order`);
                break;
            case 'tree':
                keys = this.storage.map(item => item.key);
                console.log(`Tree implementation: Keys in sorted order`);
                break;
            case 'array':
                keys = this.storage.map(item => item.key);
                console.log(`Array implementation: Keys in insertion order`);
                break;
        }
        
        console.log(`Found ${keys.length} keys: [${keys.map(k => JSON.stringify(k)).join(', ')}]`);
        console.log(`Time Complexity: O(n) - must visit all entries`);
        
        return keys;
    }
    
    // Get all values
    values() {
        console.log(`\n💎 VALUES operation`);
        
        let values;
        
        switch (this.implementation) {
            case 'hash':
                values = Array.from(this.storage.values());
                break;
            case 'tree':
                values = this.storage.map(item => item.value);
                break;
            case 'array':
                values = this.storage.map(item => item.value);
                break;
        }
        
        console.log(`Found ${values.length} values: [${values.map(v => JSON.stringify(v)).join(', ')}]`);
        console.log(`Time Complexity: O(n) - must visit all entries`);
        
        return values;
    }
    
    // Get all entries as [key, value] pairs
    entries() {
        console.log(`\n📋 ENTRIES operation`);
        
        let entries;
        
        switch (this.implementation) {
            case 'hash':
                entries = Array.from(this.storage.entries());
                break;
            case 'tree':
                entries = this.storage.map(item => [item.key, item.value]);
                break;
            case 'array':
                entries = this.storage.map(item => [item.key, item.value]);
                break;
        }
        
        console.log(`Found ${entries.length} entries:`);
        entries.forEach(([key, value], index) => {
            console.log(`  ${index + 1}. ${JSON.stringify(key)} → ${JSON.stringify(value)}`);
        });
        
        console.log(`Time Complexity: O(n) - must visit all entries`);
        
        return entries;
    }
    
    // Clear all entries
    clear() {
        console.log(`\n🧹 CLEAR operation`);
        console.log(`Removing ${this.size} entries`);
        
        switch (this.implementation) {
            case 'hash':
                this.storage.clear();
                break;
            case 'tree':
            case 'array':
                this.storage = [];
                break;
        }
        
        this.size = 0;
        console.log(`✅ Map cleared - now empty`);
    }
    
    // Helper methods
    compareKeys(a, b) {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    }
    
    keysEqual(a, b) {
        return a === b;
    }
    
    // Get current size
    getSize() {
        return this.size;
    }
    
    // Check if empty
    isEmpty() {
        return this.size === 0;
    }
    
    // Display map statistics
    displayStats() {
        console.log(`\n📊 MAP STATISTICS`);
        console.log(`=================`);
        console.log(`Implementation: ${this.implementation}`);
        console.log(`Size: ${this.size} entries`);
        console.log(`Operations performed: ${this.operations}`);
        
        switch (this.implementation) {
            case 'hash':
                console.log(`Advantages: O(1) average operations, flexible key types`);
                console.log(`Disadvantages: No key ordering, potential worst-case O(n)`);
                break;
            case 'tree':
                console.log(`Advantages: Maintained key ordering, O(log n) guarantees`);
                console.log(`Disadvantages: Slower than hash for basic operations`);
                break;
            case 'array':
                console.log(`Advantages: Simple implementation, preserves insertion order`);
                console.log(`Disadvantages: O(n) operations, poor performance for large maps`);
                break;
        }
        
        const memoryUsage = this.estimateMemoryUsage();
        console.log(`Estimated memory usage: ${memoryUsage} bytes`);
    }
    
    estimateMemoryUsage() {
        // Rough estimation
        const entrySize = 50; // Approximate bytes per entry
        const overhead = this.implementation === 'hash' ? this.size * 2 : 0;
        return this.size * entrySize + overhead;
    }
    
    // Performance comparison
    performanceComparison() {
        console.log('\n=== MAP IMPLEMENTATION COMPARISON ===');
        
        const testData = [
            ['user1', { name: 'Alice', age: 25 }],
            ['user2', { name: 'Bob', age: 30 }],
            ['user3', { name: 'Carol', age: 35 }],
            ['user4', { name: 'David', age: 40 }],
            ['user5', { name: 'Eve', age: 45 }]
        ];
        
        const implementations = ['hash', 'tree', 'array'];
        const results = {};
        
        implementations.forEach(impl => {
            console.log(`\n🧪 Testing ${impl} implementation:`);
            
            const map = new AdvancedMap(impl);
            
            // Insert test
            const insertStart = performance.now();
            testData.forEach(([key, value]) => map.set(key, value));
            const insertTime = performance.now() - insertStart;
            
            // Lookup test
            const lookupStart = performance.now();
            testData.forEach(([key]) => map.get(key));
            const lookupTime = performance.now() - lookupStart;
            
            // Delete test
            const deleteStart = performance.now();
            map.delete('user3');
            const deleteTime = performance.now() - deleteStart;
            
            results[impl] = {
                insertTime: insertTime.toFixed(3),
                lookupTime: lookupTime.toFixed(3),
                deleteTime: deleteTime.toFixed(3),
                memoryUsage: map.estimateMemoryUsage()
            };
            
            console.log(`  Insert time: ${results[impl].insertTime}ms`);
            console.log(`  Lookup time: ${results[impl].lookupTime}ms`);
            console.log(`  Delete time: ${results[impl].deleteTime}ms`);
            console.log(`  Memory usage: ${results[impl].memoryUsage} bytes`);
        });
        
        console.log(`\n📊 COMPARISON SUMMARY:`);
        console.log(`Implementation | Insert   | Lookup   | Delete   | Memory`);
        console.log(`============== | ======== | ======== | ======== | ======`);
        
        implementations.forEach(impl => {
            const r = results[impl];
            console.log(`${impl.padEnd(14)} | ${r.insertTime.padEnd(8)} | ${r.lookupTime.padEnd(8)} | ${r.deleteTime.padEnd(8)} | ${r.memoryUsage}`);
        });
        
        console.log(`\n💡 RECOMMENDATIONS:`);
        console.log(`🥇 General purpose: Hash implementation (O(1) average)`);
        console.log(`🏆 Ordered data: Tree implementation (sorted keys)`);
        console.log(`📚 Small datasets: Array implementation (simple)`);
        
        return results;
    }
    
    // Demonstrate map operations
    demonstrateMapOperations() {
        console.log(`=== MAP OPERATIONS DEMONSTRATION ===`);
        console.log(`Implementation: ${this.implementation}`);
        
        console.log('\n1. BASIC MAP OPERATIONS:');
        this.set('name', 'John Doe');
        this.set('age', 30);
        this.set('city', 'New York');
        this.set('occupation', 'Software Engineer');
        
        console.log('\n2. RETRIEVAL OPERATIONS:');
        ['name', 'age', 'country', 'city'].forEach(key => this.get(key));
        
        console.log('\n3. KEY-VALUE ITERATION:');
        this.keys();
        this.values();
        this.entries();
        
        console.log('\n4. UPDATE OPERATIONS:');
        this.set('age', 31); // Update existing
        this.set('country', 'USA'); // Add new
        
        console.log('\n5. DELETION OPERATIONS:');
        this.delete('occupation');
        this.delete('salary'); // Non-existent
        
        console.log('\n6. FINAL STATE:');
        this.displayStats();
        
        return {
            size: this.getSize(),
            isEmpty: this.isEmpty(),
            keys: this.keys(),
            values: this.values()
        };
    }
}

// Test different implementations
console.log('\n' + '='.repeat(60));

console.log('\n🔸 HASH MAP DEMONSTRATION:');
const hashMap = new AdvancedMap('hash');
hashMap.demonstrateMapOperations();

console.log('\n🔸 TREE MAP DEMONSTRATION:');
const treeMap = new AdvancedMap('tree');
treeMap.demonstrateMapOperations();

console.log('\n🔸 ARRAY MAP DEMONSTRATION:');
const arrayMap = new AdvancedMap('array');
arrayMap.demonstrateMapOperations();

console.log('\n🔸 PERFORMANCE COMPARISON:');
const performanceMap = new AdvancedMap('hash');
performanceMap.performanceComparison();
```

### Specialized Map Variants

**Concept**: Implementing specialized map types for specific use cases and requirements.

```javascript
// Specialized Map Implementations

// 1. Multi-Map: One key can map to multiple values
class MultiMap {
    constructor() {
        this.storage = new Map();
        this.totalValues = 0;
    }
    
    // Add value to key (allows multiple values per key)
    add(key, value) {
        console.log(`\n➕ MULTIMAP ADD: ${JSON.stringify(key)} → ${JSON.stringify(value)}`);
        
        if (!this.storage.has(key)) {
            this.storage.set(key, []);
            console.log(`Created new value array for key ${JSON.stringify(key)}`);
        }
        
        const values = this.storage.get(key);
        values.push(value);
        this.totalValues++;
        
        console.log(`Added value to key. Total values for key: ${values.length}`);
        console.log(`Key now maps to: [${values.map(v => JSON.stringify(v)).join(', ')}]`);
        
        return this;
    }
    
    // Get all values for a key
    get(key) {
        console.log(`\n🔍 MULTIMAP GET: ${JSON.stringify(key)}`);
        
        const values = this.storage.get(key) || [];
        console.log(`Found ${values.length} values: [${values.map(v => JSON.stringify(v)).join(', ')}]`);
        
        return [...values]; // Return copy to prevent external modification
    }
    
    // Remove specific value from key
    remove(key, value) {
        console.log(`\n🗑️ MULTIMAP REMOVE: ${JSON.stringify(value)} from ${JSON.stringify(key)}`);
        
        if (!this.storage.has(key)) {
            console.log(`Key not found - nothing to remove`);
            return false;
        }
        
        const values = this.storage.get(key);
        const index = values.indexOf(value);
        
        if (index === -1) {
            console.log(`Value not found in key's value list`);
            return false;
        }
        
        values.splice(index, 1);
        this.totalValues--;
        
        // Remove key if no values left
        if (values.length === 0) {
            this.storage.delete(key);
            console.log(`Removed empty key`);
        } else {
            console.log(`Removed value. Remaining values: [${values.map(v => JSON.stringify(v)).join(', ')}]`);
        }
        
        return true;
    }
    
    // Remove all values for a key
    removeAll(key) {
        console.log(`\n🗑️ MULTIMAP REMOVE ALL: ${JSON.stringify(key)}`);
        
        if (!this.storage.has(key)) {
            console.log(`Key not found`);
            return false;
        }
        
        const values = this.storage.get(key);
        this.totalValues -= values.length;
        this.storage.delete(key);
        
        console.log(`Removed key and all ${values.length} values`);
        return true;
    }
    
    // Get count of values for key
    count(key) {
        const values = this.storage.get(key);
        return values ? values.length : 0;
    }
    
    // Check if key-value pair exists
    has(key, value = undefined) {
        if (!this.storage.has(key)) return false;
        
        if (value === undefined) {
            return true; // Just check key existence
        }
        
        return this.storage.get(key).includes(value);
    }
    
    // Get all unique keys
    keys() {
        return Array.from(this.storage.keys());
    }
    
    // Get all values (flattened)
    values() {
        const allValues = [];
        for (const valueArray of this.storage.values()) {
            allValues.push(...valueArray);
        }
        return allValues;
    }
    
    // Demonstrate MultiMap
    demonstrateMultiMap() {
        console.log('=== MULTIMAP DEMONSTRATION ===');
        
        console.log('\n1. ADDING MULTIPLE VALUES TO SAME KEYS:');
        this.add('colors', 'red');
        this.add('colors', 'blue');
        this.add('colors', 'green');
        
        this.add('numbers', 1);
        this.add('numbers', 2);
        this.add('numbers', 3);
        
        this.add('animals', 'cat');
        this.add('animals', 'dog');
        
        console.log('\n2. RETRIEVING VALUES:');
        this.get('colors');
        this.get('numbers');
        this.get('nonexistent');
        
        console.log('\n3. REMOVING SPECIFIC VALUES:');
        this.remove('colors', 'blue');
        this.get('colors');
        
        console.log('\n4. MULTIMAP STATISTICS:');
        console.log(`Total keys: ${this.keys().length}`);
        console.log(`Total values: ${this.totalValues}`);
        console.log(`All keys: [${this.keys().map(k => JSON.stringify(k)).join(', ')}]`);
        
        console.log(`\n🎯 MULTIMAP APPLICATIONS:`);
        console.log(`- Tag systems (article → multiple tags)`);
        console.log(`- Index structures (word → multiple document IDs)`);
        console.log(`- Graph adjacency lists (node → multiple neighbors)`);
        console.log(`- Group memberships (person → multiple groups)`);
        
        return {
            keys: this.keys().length,
            totalValues: this.totalValues
        };
    }
}

// 2. Ordered Map: Maintains insertion order and supports range operations
class OrderedMap {
    constructor() {
        this.storage = new Map(); // Native Map maintains insertion order
        this.keyList = []; // For efficient range operations
    }
    
    set(key, value) {
        console.log(`\n📝 ORDERED SET: ${JSON.stringify(key)} → ${JSON.stringify(value)}`);
        
        const isNewKey = !this.storage.has(key);
        
        if (isNewKey) {
            this.keyList.push(key);
            console.log(`New key added. Insertion order: [${this.keyList.map(k => JSON.stringify(k)).join(', ')}]`);
        } else {
            console.log(`Updating existing key - order preserved`);
        }
        
        this.storage.set(key, value);
        
        return this;
    }
    
    get(key) {
        return this.storage.get(key);
    }
    
    delete(key) {
        console.log(`\n🗑️ ORDERED DELETE: ${JSON.stringify(key)}`);
        
        if (this.storage.delete(key)) {
            const index = this.keyList.indexOf(key);
            this.keyList.splice(index, 1);
            console.log(`Key removed. New order: [${this.keyList.map(k => JSON.stringify(k)).join(', ')}]`);
            return true;
        }
        
        return false;
    }
    
    // Get first N entries
    first(n = 1) {
        console.log(`\n🥇 FIRST ${n} entries:`);
        
        const firstKeys = this.keyList.slice(0, n);
        const result = firstKeys.map(key => [key, this.storage.get(key)]);
        
        result.forEach(([key, value], index) => {
            console.log(`  ${index + 1}. ${JSON.stringify(key)} → ${JSON.stringify(value)}`);
        });
        
        return result;
    }
    
    // Get last N entries
    last(n = 1) {
        console.log(`\n🏆 LAST ${n} entries:`);
        
        const lastKeys = this.keyList.slice(-n);
        const result = lastKeys.map(key => [key, this.storage.get(key)]);
        
        result.forEach(([key, value], index) => {
            console.log(`  ${index + 1}. ${JSON.stringify(key)} → ${JSON.stringify(value)}`);
        });
        
        return result;
    }
    
    // Get entries in insertion order
    entries() {
        return this.keyList.map(key => [key, this.storage.get(key)]);
    }
    
    // Demonstrate OrderedMap
    demonstrateOrderedMap() {
        console.log('=== ORDERED MAP DEMONSTRATION ===');
        
        console.log('\n1. INSERTION ORDER PRESERVATION:');
        this.set('first', 'A');
        this.set('second', 'B');
        this.set('third', 'C');
        this.set('fourth', 'D');
        
        console.log('\n2. ORDERED ITERATION:');
        const entries = this.entries();
        console.log('Entries in insertion order:');
        entries.forEach(([key, value], index) => {
            console.log(`  ${index + 1}. ${JSON.stringify(key)} → ${JSON.stringify(value)}`);
        });
        
        console.log('\n3. RANGE OPERATIONS:');
        this.first(2);
        this.last(2);
        
        console.log('\n4. UPDATE AND DELETE:');
        this.set('second', 'B_UPDATED'); // Update preserves order
        this.delete('third'); // Removes from order
        
        const finalEntries = this.entries();
        console.log('\nFinal order after updates:');
        finalEntries.forEach(([key, value], index) => {
            console.log(`  ${index + 1}. ${JSON.stringify(key)} → ${JSON.stringify(value)}`);
        });
        
        return finalEntries;
    }
}

// 3. Weak Map: Garbage collection friendly for object keys
class WeakMapDemo {
    constructor() {
        this.storage = new WeakMap(); // Native WeakMap
        console.log('\n🧠 WEAKMAP initialized');
        console.log('Key features: object keys only, weak references, no iteration');
    }
    
    set(key, value) {
        if (typeof key !== 'object' || key === null) {
            console.log(`❌ WeakMap only accepts object keys`);
            return this;
        }
        
        console.log(`\n📝 WEAKMAP SET: [object] → ${JSON.stringify(value)}`);
        this.storage.set(key, value);
        console.log(`✅ Object associated with value`);
        console.log(`Note: If object is garbage collected, entry will be automatically removed`);
        
        return this;
    }
    
    get(key) {
        console.log(`\n🔍 WEAKMAP GET: [object]`);
        
        const value = this.storage.get(key);
        const found = this.storage.has(key);
        
        console.log(`Result: ${found ? `Found value ${JSON.stringify(value)}` : 'Key not found'}`);
        
        return value;
    }
    
    has(key) {
        return this.storage.has(key);
    }
    
    delete(key) {
        console.log(`\n🗑️ WEAKMAP DELETE: [object]`);
        
        const deleted = this.storage.delete(key);
        console.log(`Result: ${deleted ? 'Deleted successfully' : 'Key not found'}`);
        
        return deleted;
    }
    
    // Demonstrate WeakMap with garbage collection
    demonstrateWeakMap() {
        console.log('=== WEAKMAP DEMONSTRATION ===');
        
        console.log('\n1. OBJECT KEY ASSOCIATIONS:');
        
        let obj1 = { id: 1, name: 'Object 1' };
        let obj2 = { id: 2, name: 'Object 2' };
        let obj3 = { id: 3, name: 'Object 3' };
        
        this.set(obj1, 'Data for object 1');
        this.set(obj2, 'Data for object 2');
        this.set(obj3, 'Data for object 3');
        
        console.log('\n2. RETRIEVING VALUES:');
        this.get(obj1);
        this.get(obj2);
        
        console.log('\n3. GARBAGE COLLECTION SIMULATION:');
        console.log('Removing reference to obj2...');
        obj2 = null; // Remove reference
        
        // Note: Actual garbage collection timing is implementation-dependent
        console.log('obj2 is now eligible for garbage collection');
        console.log('WeakMap entry will be automatically removed when GC runs');
        
        console.log('\n4. CHECKING REMAINING REFERENCES:');
        this.get(obj1);
        this.get(obj3);
        
        console.log(`\n💡 WEAKMAP ADVANTAGES:`);
        console.log(`- Prevents memory leaks with object associations`);
        console.log(`- Automatic cleanup when objects are garbage collected`);
        console.log(`- Perfect for private data storage`);
        console.log(`- DOM element event handlers and metadata`);
        
        console.log(`\n⚠️ WEAKMAP LIMITATIONS:`);
        console.log(`- Only object keys (no primitives)`);
        console.log(`- No iteration (keys(), values(), entries())`);
        console.log(`- No size property`);
        console.log(`- Cannot be cleared en masse`);
        
        return true;
    }
}

// Test specialized map variants
console.log('\n' + '='.repeat(60));

console.log('\n🔸 MULTIMAP DEMONSTRATION:');
const multiMap = new MultiMap();
multiMap.demonstrateMultiMap();

console.log('\n🔸 ORDERED MAP DEMONSTRATION:');
const orderedMap = new OrderedMap();
orderedMap.demonstrateOrderedMap();

console.log('\n🔸 WEAKMAP DEMONSTRATION:');
const weakMapDemo = new WeakMapDemo();
weakMapDemo.demonstrateWeakMap();
```

## Summary

### Core Map Concepts Mastered
- **Key-Value Association**: Direct mapping from identifiers to data values
- **Associative Access**: Retrieve data by meaningful keys rather than positions
- **Implementation Strategies**: Hash-based, tree-based, and array-based approaches
- **Dynamic Operations**: Add, update, remove, and query key-value pairs efficiently

### Map Operations Complexity
- **Hash-Based Maps**: O(1) average case for get/set/delete operations
- **Tree-Based Maps**: O(log n) guaranteed time with sorted key ordering
- **Array-Based Maps**: O(n) linear operations but simple implementation
- **Space Complexity**: O(n) for storing n key-value pairs plus overhead

### Why Maps Are Essential
- **Intuitive Data Access**: Natural key-based retrieval matches human thinking
- **Flexible Key Types**: Support for strings, numbers, objects as keys
- **Efficient Lookup**: Fast data retrieval without linear searching
- **Dynamic Sizing**: Automatic growth and shrinkage as data changes

### Real-World Map Applications

**Web Development:**
- **Session Management**: session ID → user data, preferences, shopping cart
- **Configuration Systems**: setting name → configuration value
- **Caching Layers**: cache key → expensive computation results
- **Request Routing**: URL pattern → handler function

**Database Systems:**
- **Primary Key Indexes**: primary key → record location and data
- **Foreign Key Relationships**: foreign key → related record references
- **Query Plan Caching**: query hash → optimized execution plan
- **Connection Pooling**: connection ID → database connection object

**System Programming:**
- **Symbol Tables**: variable name → memory address, type information
- **File System Metadata**: file path → inode, permissions, timestamps
- **Process Management**: process ID → process control block
- **Memory Management**: virtual address → physical address mapping

**Game Development:**
- **Asset Management**: asset name → texture, sound, model data
- **Player State**: player ID → character stats, inventory, position
- **Configuration Storage**: setting key → game option values
- **Leaderboard Systems**: player name → score, achievements, rankings

### Map Implementation Strategies

**Hash-Based Maps (HashMap):**
- **Best for**: General-purpose key-value storage with O(1) operations
- **Implementation**: Hash table with collision resolution
- **Advantages**: Excellent average performance, flexible key types
- **Disadvantages**: No key ordering, potential worst-case degradation

**Tree-Based Maps (TreeMap):**
- **Best for**: Ordered data requiring sorted iteration and range queries
- **Implementation**: Self-balancing binary search tree (Red-Black, AVL)
- **Advantages**: Guaranteed O(log n) performance, sorted key order
- **Disadvantages**: Slower than hash maps for basic operations

**Array-Based Maps:**
- **Best for**: Small maps, simple implementation, debugging
- **Implementation**: Array of key-value pairs with linear search
- **Advantages**: Simple code, preserves insertion order, minimal overhead
- **Disadvantages**: Poor performance for large datasets

### Specialized Map Variants

**MultiMap:**
- **Purpose**: One key can map to multiple values
- **Use Cases**: Tag systems, inverted indexes, graph adjacency lists
- **Implementation**: Map<Key, Array<Value>>
- **Operations**: add, remove specific values, get all values for key

**OrderedMap:**
- **Purpose**: Maintains insertion order and supports range operations
- **Use Cases**: LRU caches, event logs, configuration with precedence
- **Implementation**: Native Map (maintains insertion order) + key list
- **Operations**: first(), last(), range queries, ordered iteration

**WeakMap:**
- **Purpose**: Garbage collection friendly object associations
- **Use Cases**: Private data storage, DOM element metadata, memory leak prevention
- **Implementation**: Weak references to object keys
- **Limitations**: Object keys only, no iteration, no size property

### Performance Optimization Techniques

**Load Factor Management:**
- **Hash Maps**: Maintain load factor between 0.5-0.75 for optimal performance
- **Resize Strategy**: Double/halve size with threshold-based triggers
- **Memory vs Speed**: Balance between space usage and access time

**Key Design:**
- **Hash Quality**: Good hash functions prevent clustering and collisions
- **Key Equality**: Consistent and efficient key comparison functions
- **Key Immutability**: Prevent hash code changes after insertion

**Memory Layout:**
- **Cache Locality**: Store related data together for better performance
- **Open Addressing**: Better cache behavior than separate chaining
- **Memory Pools**: Reduce allocation overhead for frequent operations

### Advanced Map Concepts

**Concurrent Maps:**
- **Thread Safety**: Lock-free or fine-grained locking for parallel access
- **ConcurrentHashMap**: Segment-based locking for high concurrency
- **Copy-on-Write**: Immutable snapshots for read-heavy workloads

**Persistent Maps:**
- **Immutability**: Create new versions without modifying existing maps
- **Structural Sharing**: Share common structure between versions
- **Applications**: Functional programming, undo systems, version control

**Distributed Maps:**
- **Consistent Hashing**: Distribute keys across multiple nodes
- **Replication**: Multiple copies for fault tolerance
- **Sharding**: Partition large maps across multiple machines

### Map vs Other Data Structures

**Map vs Array:**
- **Map**: Key-based access, unique keys, flexible key types
- **Array**: Index-based access, integer indices, direct positional access

**Map vs Set:**
- **Map**: Key-value associations, value retrieval and updates
- **Set**: Membership testing, unique element collections

**Map vs Object (JavaScript):**
- **Map**: Any key type, size property, iteration guaranteed order
- **Object**: String/Symbol keys, prototype chain, property access syntax

### Common Map Patterns

**Caching Pattern:**
```javascript
const cache = new Map();
function expensiveOperation(input) {
    if (cache.has(input)) {
        return cache.get(input);
    }
    const result = doExpensiveComputation(input);
    cache.set(input, result);
    return result;
}
```

**Grouping Pattern:**
```javascript
const groupBy = (array, keyFn) => {
    const groups = new Map();
    for (const item of array) {
        const key = keyFn(item);
        if (!groups.has(key)) {
            groups.set(key, []);
        }
        groups.get(key).push(item);
    }
    return groups;
};
```

**Index Building Pattern:**
```javascript
const buildIndex = (records, keyField) => {
    const index = new Map();
    for (const record of records) {
        index.set(record[keyField], record);
    }
    return index;
};
```

Maps represent the **cornerstone of associative data access** in computer science, transforming **positional thinking into relational thinking**. They enable **intuitive, efficient data relationships** that form the foundation of modern software architecture - from simple lookups to complex distributed systems! 🚀✨

Next up: **Disjoint Set Union (Union-Find)** - Learn efficient connectivity algorithms, path compression, union by rank, and applications in network connectivity and graph algorithms!
