---
title: "Symbols, Sets, Maps & WeakMaps"
description: "Discover modern data structures and primitive types in JavaScript. Learn when and how to use Symbols for unique identifiers, Sets for unique collections, Maps for key-value pairs, and WeakMaps for memory-efficient associations."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 00-understand-javascript-complete
topics:
  - javascript
  - es6
resources:
  - title: "MDN - Symbol"
    type: "documentation"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol"
    description: "Complete reference for JavaScript Symbols"
  - title: "MDN - Set"
    type: "documentation"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set"
    description: "Comprehensive guide to Set data structure"
  - title: "MDN - Map"
    type: "documentation"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map"
    description: "Complete Map documentation and examples"
  - title: "MDN - WeakMap"
    type: "documentation"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/WeakMap"
    description: "Understanding WeakMap for memory-efficient associations"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758811622/Portfolio/javaScriptCourse/images/all%20title%20images/29_kfasgd.png)

Symbols, Sets, Maps & WeakMaps – Modern Data Structures Revolution
================================================================

Imagine you're managing a **sophisticated library system** 📚 in a modern city. The old system had limitations:

- **Book IDs** could accidentally conflict between different departments
- **Member lists** could contain duplicates causing confusion
- **Book-to-reader associations** used inefficient paper cards
- **Temporary associations** accumulated over time, cluttering storage

Now you've upgraded to a **state-of-the-art digital system** with four revolutionary tools:

1. **Symbols** (Unique Identifiers) 🏷️ - Like digital security tags that are guaranteed to be unique, even if they look identical to humans
2. **Sets** (Unique Collections) 📦 - Smart containers that automatically prevent duplicates and provide fast membership checks
3. **Maps** (Advanced Key-Value Storage) 🗂️ - Flexible filing systems that can use any type of key, not just strings
4. **WeakMaps** (Memory-Efficient Associations) ♻️ - Temporary filing systems that automatically clean up when items are no longer needed

**These new JavaScript data structures work exactly like this modern library system.** They solve fundamental limitations of traditional objects and arrays, providing more precise, efficient, and memory-conscious ways to organize and access data in modern applications.

Understanding these structures is crucial for writing sophisticated JavaScript applications that handle complex data relationships, avoid naming conflicts, and manage memory efficiently.

## The Theoretical Foundation: Data Structure Evolution and Memory Management 📐

### Understanding the Limitations of Objects and Arrays

**Traditional JavaScript was limited by its primitive data structures**. Objects and arrays, while versatile, have fundamental limitations rooted in their design:

1. **Objects**: Based on hash tables, but keys are always coerced to strings
2. **Arrays**: Based on dense or sparse arrays, but lack built-in uniqueness guarantees
3. **Memory Management**: No built-in weak references for automatic cleanup

### The Computer Science Behind New Data Structures

**Symbols solve the "unique identifier" problem** from computer science. In programming language theory, you often need guaranteed unique values that can't accidentally collide. Symbols provide:

- **Uniqueness Guarantee**: Even symbols with same description are unique (like GUID/UUID)
- **Type Safety**: Cannot be accidentally recreated or guessed
- **Performance**: Efficient comparison (reference equality, not value equality)

**Sets implement mathematical set theory** with efficient algorithms:
- **Uniqueness**: Based on the mathematical definition of sets
- **Fast Membership Testing**: Usually O(1) average case using hash tables
- **Set Operations**: Union, intersection, difference - fundamental mathematical operations

**Maps provide true associative arrays** solving key limitations:
- **Any Key Type**: Objects can only use string keys; Maps can use any type
- **Insertion Order**: Maintains order like Python's ordered dictionaries
- **Size Property**: Efficient size tracking without manual counting

**WeakMaps implement weak references** for memory management:
- **Garbage Collection Friendly**: Automatic cleanup when keys are no longer referenced
- **Privacy Pattern**: Enable truly private object properties
- **Memory Leak Prevention**: Avoid common memory leaks in event handlers and caches

### The Philosophy of Data Structure Selection

**Choosing the right data structure is algorithmic thinking**. Each structure optimizes for different operations:

- **Objects**: Fast property access, prototype chain, JSON serializable
- **Maps**: Frequent additions/deletions, non-string keys, size queries
- **Sets**: Uniqueness constraints, fast membership testing, mathematical operations
- **Arrays**: Index-based access, iteration, functional programming methods
- **WeakMaps**: Private data, automatic cleanup, temporary associations

This reflects the computer science principle that **data structures encode assumptions about usage patterns**.

## The Limitations They Solve 🎯

### Problems with Traditional JavaScript Data Structures 😤

Before ES6, JavaScript developers were limited to objects and arrays, which had significant constraints:

```javascript
// Problem 1: Object keys are always strings
const traditional = {};
traditional[1] = "number key";
traditional["1"] = "string key";
console.log(traditional); // { "1": "string key" } - number key was overwritten!

// Problem 2: No built-in way to prevent duplicates
const duplicateArray = [1, 2, 2, 3, 3, 3];
// Removing duplicates required: [...new Set(duplicateArray)] or manual logic

// Problem 3: Property name conflicts
const user = {
  name: "Alice",
  toString: "Custom toString" // Accidentally overwrites Object.prototype.toString!
};

// Problem 4: Memory leaks with object references
const cache = {};
let heavyObject = { data: new Array(1000000).fill("heavy") };
cache[heavyObject.id] = heavyObject;
heavyObject = null; // Object not truly freed because cache still references it

// Problem 5: Iteration over object properties includes inherited properties
const person = { name: "Alice", age: 30 };
Object.prototype.customProperty = "inherited";
for (let key in person) {
  console.log(key); // Logs: name, age, customProperty (unwanted!)
}
```

### Modern Solutions with New Data Structures ✨

```javascript
// Solution 1: Maps allow any type as key
const modernMap = new Map();
modernMap.set(1, "number key");
modernMap.set("1", "string key");
console.log(modernMap.get(1));   // "number key"
console.log(modernMap.get("1")); // "string key" - both coexist!

// Solution 2: Sets automatically handle uniqueness
const uniqueSet = new Set([1, 2, 2, 3, 3, 3]);
console.log([...uniqueSet]); // [1, 2, 3] - duplicates automatically removed

// Solution 3: Symbols create guaranteed unique property keys
const nameSymbol = Symbol('name');
const userModern = {
  [nameSymbol]: "Alice",
  toString: "Safe to override"
};
// No conflict possible - Symbol keys are always unique

// Solution 4: WeakMaps automatically clean up unreferenced objects
const weakCache = new WeakMap();
let heavyObjectModern = { data: new Array(1000000).fill("heavy") };
weakCache.set(heavyObjectModern, "metadata");
heavyObjectModern = null; // Object AND cache entry are automatically garbage collected

// Solution 5: Maps provide clean iteration without inherited properties
const personMap = new Map([["name", "Alice"], ["age", 30]]);
for (let [key, value] of personMap) {
  console.log(key, value); // Only logs: name Alice, age 30
}
```

## Symbols – Unique Identifiers 🏷️

### Understanding Symbols 💡

**What are Symbols?** They're a primitive data type that creates guaranteed unique identifiers. Every Symbol is unique, even if created with the same description.

**Mental Model:** Think of Symbols like **digital fingerprints** or **unique serial numbers** - even if two items have the same description, they can be distinguished by their unique Symbol identity.

### Basic Symbol Creation and Usage 📝

```javascript
// Creating Symbols
const symbol1 = Symbol();
const symbol2 = Symbol();
const symbol3 = Symbol("description");
const symbol4 = Symbol("description");

// Every Symbol is unique
console.log(symbol1 === symbol2); // false
console.log(symbol3 === symbol4); // false - same description, different Symbol!

// Symbols as object properties
const user = {
  name: "Alice",
  [Symbol("id")]: 12345,
  [Symbol("internal")]: "private data"
};

console.log(user.name); // "Alice"
// Symbol properties can't be accessed with dot notation or string keys
console.log(user["id"]); // undefined
console.log(Object.keys(user)); // ["name"] - Symbol properties are hidden

// Accessing Symbol properties requires the exact Symbol reference
const idSymbol = Symbol("userId");
const userWithId = {
  name: "Alice",
  [idSymbol]: 12345
};

console.log(userWithId[idSymbol]); // 12345
```

### Well-Known Symbols 🌟

JavaScript provides built-in symbols for special behaviors:

```javascript
// Symbol.iterator - defines how objects are iterated
const iterableObject = {
  data: [1, 2, 3, 4, 5],
  
  [Symbol.iterator]() {
    let index = 0;
    const data = this.data;
    
    return {
      next() {
        if (index < data.length) {
          return { value: data[index++], done: false };
        }
        return { done: true };
      }
    };
  }
};

// Now the object is iterable
for (let value of iterableObject) {
  console.log(value); // 1, 2, 3, 4, 5
}

// Symbol.toStringTag - customizes Object.prototype.toString()
class CustomClass {
  get [Symbol.toStringTag]() {
    return "CustomClass";
  }
}

const instance = new CustomClass();
console.log(instance.toString()); // "[object CustomClass]"

// Symbol.hasInstance - customizes instanceof behavior
class MyArray {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance);
  }
}

console.log([] instanceof MyArray); // true
console.log("string" instanceof MyArray); // false
```

### Practical Symbol Applications 🌍

**Application 1: Private Object Properties**
```javascript
// Creating truly private properties using Symbols
const PrivateData = (() => {
  const _id = Symbol('id');
  const _balance = Symbol('balance');
  const _transactions = Symbol('transactions');
  
  class BankAccount {
    constructor(id, initialBalance = 0) {
      this[_id] = id;
      this[_balance] = initialBalance;
      this[_transactions] = [];
    }
    
    deposit(amount) {
      if (amount <= 0) throw new Error("Amount must be positive");
      this[_balance] += amount;
      this[_transactions].push({ type: 'deposit', amount, date: new Date() });
    }
    
    withdraw(amount) {
      if (amount <= 0) throw new Error("Amount must be positive");
      if (amount > this[_balance]) throw new Error("Insufficient funds");
      this[_balance] -= amount;
      this[_transactions].push({ type: 'withdrawal', amount, date: new Date() });
    }
    
    getBalance() {
      return this[_balance];
    }
    
    getTransactionHistory() {
      return [...this[_transactions]]; // Return copy to prevent external modification
    }
    
    // Debug method (normally wouldn't exist in production)
    _getPrivateData() {
      return {
        id: this[_id],
        balance: this[_balance],
        transactions: this[_transactions]
      };
    }
  }
  
  return BankAccount;
})();

const account = new PrivateData("ACC-123", 1000);
account.deposit(500);
console.log(account.getBalance()); // 1500

// Private data is not accessible from outside
console.log(Object.keys(account)); // [] - no enumerable properties
console.log(account._balance); // undefined
console.log(account._id); // undefined
```

**Application 2: Plugin System with Symbol Registry**
```javascript
// Global Symbol registry for cross-realm Symbol sharing
const PLUGIN_NAMESPACE = Symbol.for('app.plugins');
const PLUGIN_CONFIG = Symbol.for('app.plugin.config');
const PLUGIN_STATE = Symbol.for('app.plugin.state');

class PluginManager {
  constructor() {
    this[PLUGIN_NAMESPACE] = new Map();
  }
  
  register(pluginName, pluginClass) {
    if (this[PLUGIN_NAMESPACE].has(pluginName)) {
      throw new Error(`Plugin ${pluginName} already registered`);
    }
    
    const plugin = new pluginClass();
    plugin[PLUGIN_CONFIG] = {};
    plugin[PLUGIN_STATE] = { active: false, initialized: false };
    
    this[PLUGIN_NAMESPACE].set(pluginName, plugin);
  }
  
  configure(pluginName, config) {
    const plugin = this[PLUGIN_NAMESPACE].get(pluginName);
    if (!plugin) throw new Error(`Plugin ${pluginName} not found`);
    
    plugin[PLUGIN_CONFIG] = { ...plugin[PLUGIN_CONFIG], ...config };
  }
  
  activate(pluginName) {
    const plugin = this[PLUGIN_NAMESPACE].get(pluginName);
    if (!plugin) throw new Error(`Plugin ${pluginName} not found`);
    
    if (!plugin[PLUGIN_STATE].initialized) {
      plugin.initialize(plugin[PLUGIN_CONFIG]);
      plugin[PLUGIN_STATE].initialized = true;
    }
    
    plugin[PLUGIN_STATE].active = true;
    plugin.activate();
  }
  
  getPluginState(pluginName) {
    const plugin = this[PLUGIN_NAMESPACE].get(pluginName);
    return plugin ? plugin[PLUGIN_STATE] : null;
  }
}

// Example plugin
class LoggingPlugin {
  initialize(config) {
    this.logLevel = config.logLevel || 'info';
    console.log(`Logging plugin initialized with level: ${this.logLevel}`);
  }
  
  activate() {
    console.log('Logging plugin activated');
  }
  
  log(level, message) {
    if (this[PLUGIN_STATE].active) {
      console.log(`[${level.toUpperCase()}] ${message}`);
    }
  }
}

// Usage
const pluginManager = new PluginManager();
pluginManager.register('logging', LoggingPlugin);
pluginManager.configure('logging', { logLevel: 'debug' });
pluginManager.activate('logging');
```

## Sets – Unique Collections 📦

### Understanding Sets 💡

**What are Sets?** They're collections of unique values where duplicate values are automatically prevented. Sets can contain any type of value and maintain insertion order.

**Mental Model:** Think of Sets like a **VIP guest list** - each person can only appear once, and the bouncer (Set) automatically prevents duplicates from entering.

### Basic Set Operations 📝

```javascript
// Creating and using Sets
const numberSet = new Set();

// Adding values
numberSet.add(1);
numberSet.add(2);
numberSet.add(3);
numberSet.add(2); // Duplicate - ignored
numberSet.add(3); // Duplicate - ignored

console.log(numberSet); // Set { 1, 2, 3 }
console.log(numberSet.size); // 3

// Creating Sets from arrays
const fruitsArray = ["apple", "banana", "apple", "orange", "banana"];
const fruitsSet = new Set(fruitsArray);
console.log([...fruitsSet]); // ["apple", "banana", "orange"] - duplicates removed

// Checking membership
console.log(fruitsSet.has("apple")); // true
console.log(fruitsSet.has("grape")); // false

// Removing values
fruitsSet.delete("banana");
console.log(fruitsSet.has("banana")); // false

// Iterating over Sets
for (let fruit of fruitsSet) {
  console.log(fruit); // apple, orange
}

// Converting back to array
const uniqueFruits = Array.from(fruitsSet);
// or: const uniqueFruits = [...fruitsSet];
```

### Advanced Set Operations 🚀

```javascript
// Set operations: union, intersection, difference
function setUnion(setA, setB) {
  return new Set([...setA, ...setB]);
}

function setIntersection(setA, setB) {
  return new Set([...setA].filter(x => setB.has(x)));
}

function setDifference(setA, setB) {
  return new Set([...setA].filter(x => !setB.has(x)));
}

function setSymmetricDifference(setA, setB) {
  return new Set([
    ...[...setA].filter(x => !setB.has(x)),
    ...[...setB].filter(x => !setA.has(x))
  ]);
}

// Example usage
const setA = new Set([1, 2, 3, 4]);
const setB = new Set([3, 4, 5, 6]);

console.log([...setUnion(setA, setB)]); // [1, 2, 3, 4, 5, 6]
console.log([...setIntersection(setA, setB)]); // [3, 4]
console.log([...setDifference(setA, setB)]); // [1, 2]
console.log([...setSymmetricDifference(setA, setB)]); // [1, 2, 5, 6]

// Working with object references
const user1 = { name: "Alice", id: 1 };
const user2 = { name: "Bob", id: 2 };
const user3 = { name: "Alice", id: 3 }; // Different object, same name

const userSet = new Set([user1, user2, user3]);
console.log(userSet.size); // 3 - all objects are unique references

// Adding the same object reference
userSet.add(user1); // No effect - already exists
console.log(userSet.size); // Still 3
```

### Practical Set Applications 🌍

**Application 1: Tag Management System**
```javascript
class TagManager {
  constructor() {
    this.globalTags = new Set();
    this.itemTags = new Map(); // item ID -> Set of tags
  }
  
  addTag(itemId, tag) {
    if (!this.itemTags.has(itemId)) {
      this.itemTags.set(itemId, new Set());
    }
    
    this.itemTags.get(itemId).add(tag);
    this.globalTags.add(tag);
  }
  
  removeTag(itemId, tag) {
    if (this.itemTags.has(itemId)) {
      this.itemTags.get(itemId).delete(tag);
      
      // Remove empty tag sets
      if (this.itemTags.get(itemId).size === 0) {
        this.itemTags.delete(itemId);
      }
    }
    
    // Check if tag is still used anywhere
    let tagStillUsed = false;
    for (let tags of this.itemTags.values()) {
      if (tags.has(tag)) {
        tagStillUsed = true;
        break;
      }
    }
    
    if (!tagStillUsed) {
      this.globalTags.delete(tag);
    }
  }
  
  getItemTags(itemId) {
    return this.itemTags.has(itemId) ? [...this.itemTags.get(itemId)] : [];
  }
  
  getAllTags() {
    return [...this.globalTags];
  }
  
  findItemsByTag(tag) {
    const items = [];
    for (let [itemId, tags] of this.itemTags) {
      if (tags.has(tag)) {
        items.push(itemId);
      }
    }
    return items;
  }
  
  findItemsByTags(searchTags, mode = 'any') {
    const searchSet = new Set(searchTags);
    const items = [];
    
    for (let [itemId, tags] of this.itemTags) {
      const intersection = setIntersection(tags, searchSet);
      
      if (mode === 'all' && intersection.size === searchSet.size) {
        items.push(itemId);
      } else if (mode === 'any' && intersection.size > 0) {
        items.push(itemId);
      }
    }
    
    return items;
  }
  
  getTagStats() {
    const stats = new Map();
    
    for (let tag of this.globalTags) {
      stats.set(tag, this.findItemsByTag(tag).length);
    }
    
    return Object.fromEntries(stats);
  }
}

// Usage example
const tagManager = new TagManager();

tagManager.addTag("article-1", "javascript");
tagManager.addTag("article-1", "tutorial");
tagManager.addTag("article-1", "beginner");

tagManager.addTag("article-2", "javascript");
tagManager.addTag("article-2", "advanced");

tagManager.addTag("article-3", "python");
tagManager.addTag("article-3", "tutorial");

console.log(tagManager.getItemTags("article-1")); // ["javascript", "tutorial", "beginner"]
console.log(tagManager.findItemsByTag("javascript")); // ["article-1", "article-2"]
console.log(tagManager.findItemsByTags(["tutorial", "javascript"], "all")); // ["article-1"]
console.log(tagManager.getTagStats()); // { javascript: 2, tutorial: 2, beginner: 1, advanced: 1, python: 1 }
```

## Maps – Advanced Key-Value Storage 🗂️

### Understanding Maps 💡

**What are Maps?** They're collections of key-value pairs where keys can be any type (objects, primitives, functions) and the Map maintains insertion order.

**Mental Model:** Think of Maps like a **sophisticated filing cabinet** where you can use any type of label (not just strings) to organize your files, and the cabinet remembers the order in which you filed things.

### Basic Map Operations 📝

```javascript
// Creating and using Maps
const userMap = new Map();

// Setting key-value pairs
userMap.set("name", "Alice");
userMap.set("age", 30);
userMap.set("email", "alice@example.com");

// Keys can be any type
const keyObj = { type: "preference" };
const keyFunc = function() { return "theme"; };
const keySymbol = Symbol("id");

userMap.set(keyObj, "dark mode");
userMap.set(keyFunc, "dark");
userMap.set(keySymbol, 12345);

// Getting values
console.log(userMap.get("name")); // "Alice"
console.log(userMap.get(keyObj)); // "dark mode"
console.log(userMap.get(keyFunc)); // "dark"

// Checking existence
console.log(userMap.has("name")); // true
console.log(userMap.has("address")); // false

// Map size
console.log(userMap.size); // 6

// Deleting entries
userMap.delete("age");
console.log(userMap.has("age")); // false

// Creating Maps from arrays
const configMap = new Map([
  ["theme", "dark"],
  ["language", "en"],
  ["notifications", true]
]);

console.log(configMap.get("theme")); // "dark"
```

### Advanced Map Features 🚀

```javascript
// Map iteration preserves insertion order
const orderedMap = new Map();
orderedMap.set("first", 1);
orderedMap.set("second", 2);
orderedMap.set("third", 3);

// Iterate over entries
for (let [key, value] of orderedMap) {
  console.log(`${key}: ${value}`);
}
// Output: first: 1, second: 2, third: 3

// Iterate over keys only
for (let key of orderedMap.keys()) {
  console.log(key); // first, second, third
}

// Iterate over values only
for (let value of orderedMap.values()) {
  console.log(value); // 1, 2, 3
}

// forEach method
orderedMap.forEach((value, key, map) => {
  console.log(`${key} = ${value}`);
});

// Converting to arrays
const entriesArray = [...orderedMap]; // [["first", 1], ["second", 2], ["third", 3]]
const keysArray = [...orderedMap.keys()]; // ["first", "second", "third"]
const valuesArray = [...orderedMap.values()]; // [1, 2, 3]

// Converting to object (when keys are strings)
const configObject = Object.fromEntries(configMap);
console.log(configObject); // { theme: "dark", language: "en", notifications: true }

// Clearing all entries
const tempMap = new Map([["a", 1], ["b", 2]]);
tempMap.clear();
console.log(tempMap.size); // 0
```

### Practical Map Applications 🌍

**Application 1: Cache System with Object Keys**
```javascript
class ObjectCache {
  constructor(maxSize = 100) {
    this.cache = new Map();
    this.maxSize = maxSize;
  }
  
  get(object) {
    if (this.cache.has(object)) {
      // Move to end (LRU behavior)
      const value = this.cache.get(object);
      this.cache.delete(object);
      this.cache.set(object, value);
      return value;
    }
    return null;
  }
  
  set(object, value) {
    // Remove oldest entry if at capacity
    if (this.cache.size >= this.maxSize && !this.cache.has(object)) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    // Remove existing entry if updating
    if (this.cache.has(object)) {
      this.cache.delete(object);
    }
    
    this.cache.set(object, value);
  }
  
  has(object) {
    return this.cache.has(object);
  }
  
  delete(object) {
    return this.cache.delete(object);
  }
  
  clear() {
    this.cache.clear();
  }
  
  size() {
    return this.cache.size;
  }
  
  // Get cache statistics
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      utilization: (this.cache.size / this.maxSize * 100).toFixed(2) + '%'
    };
  }
}

// Usage example
const cache = new ObjectCache(3);

const user1 = { id: 1, name: "Alice" };
const user2 = { id: 2, name: "Bob" };
const user3 = { id: 3, name: "Charlie" };
const user4 = { id: 4, name: "David" };

cache.set(user1, { profile: "alice_profile.json", preferences: { theme: "dark" } });
cache.set(user2, { profile: "bob_profile.json", preferences: { theme: "light" } });
cache.set(user3, { profile: "charlie_profile.json", preferences: { theme: "dark" } });

console.log(cache.getStats()); // { size: 3, maxSize: 3, utilization: "100.00%" }

// Adding a 4th item should evict the first (LRU)
cache.set(user4, { profile: "david_profile.json", preferences: { theme: "auto" } });

console.log(cache.has(user1)); // false - evicted
console.log(cache.has(user4)); // true - newly added
```

**Application 2: Event Frequency Counter**
```javascript
class EventFrequencyCounter {
  constructor() {
    this.eventCounts = new Map();
    this.totalEvents = 0;
  }
  
  record(event) {
    this.eventCounts.set(event, (this.eventCounts.get(event) || 0) + 1);
    this.totalEvents++;
  }
  
  recordMultiple(events) {
    events.forEach(event => this.record(event));
  }
  
  getCount(event) {
    return this.eventCounts.get(event) || 0;
  }
  
  getFrequency(event) {
    if (this.totalEvents === 0) return 0;
    return (this.getCount(event) / this.totalEvents) * 100;
  }
  
  getMostFrequent(limit = 5) {
    return [...this.eventCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([event, count]) => ({
        event,
        count,
        frequency: this.getFrequency(event).toFixed(2) + '%'
      }));
  }
  
  getLeastFrequent(limit = 5) {
    return [...this.eventCounts.entries()]
      .sort((a, b) => a[1] - b[1])
      .slice(0, limit)
      .map(([event, count]) => ({
        event,
        count,
        frequency: this.getFrequency(event).toFixed(2) + '%'
      }));
  }
  
  getAllEvents() {
    return [...this.eventCounts.keys()];
  }
  
  getStats() {
    return {
      totalEvents: this.totalEvents,
      uniqueEvents: this.eventCounts.size,
      averageFrequency: this.eventCounts.size > 0 ? 
        (100 / this.eventCounts.size).toFixed(2) + '%' : '0%'
    };
  }
  
  reset() {
    this.eventCounts.clear();
    this.totalEvents = 0;
  }
}

// Usage example
const counter = new EventFrequencyCounter();

// Simulate user interactions
const userActions = [
  'click', 'scroll', 'click', 'hover', 'click', 'scroll',
  'submit', 'click', 'hover', 'scroll', 'click', 'resize',
  'click', 'hover', 'submit', 'scroll'
];

counter.recordMultiple(userActions);

console.log(counter.getStats()); 
// { totalEvents: 16, uniqueEvents: 5, averageFrequency: "20.00%" }

console.log(counter.getMostFrequent(3));
// [
//   { event: 'click', count: 6, frequency: '37.50%' },
//   { event: 'scroll', count: 4, frequency: '25.00%' },
//   { event: 'hover', count: 3, frequency: '18.75%' }
// ]
```

## WeakMaps – Memory-Efficient Associations ♻️

### Understanding WeakMaps 💡

**What are WeakMaps?** They're collections of key-value pairs where keys must be objects and the references to keys are "weak" - if no other references to the key object exist, it can be garbage collected along with its associated value.

**Mental Model:** Think of WeakMaps like **temporary visitor badges** in a secure building. When a visitor leaves and returns their badge, all records associated with that badge are automatically cleared from the system to save space and maintain security.

### Basic WeakMap Operations 📝

```javascript
// Creating and using WeakMaps
const weakMap = new WeakMap();

// Keys must be objects
const obj1 = { name: "Alice" };
const obj2 = { name: "Bob" };

// Setting values
weakMap.set(obj1, "metadata for Alice");
weakMap.set(obj2, "metadata for Bob");

// Getting values
console.log(weakMap.get(obj1)); // "metadata for Alice"
console.log(weakMap.get(obj2)); // "metadata for Bob"

// Checking existence
console.log(weakMap.has(obj1)); // true

// Deleting entries
weakMap.delete(obj2);
console.log(weakMap.has(obj2)); // false

// ❌ Primitive keys are not allowed
// weakMap.set("string", "value"); // TypeError!
// weakMap.set(123, "value"); // TypeError!

// ✅ Only object keys work
const symbolKey = Symbol("key"); // Symbols are objects
weakMap.set(symbolKey, "symbol value"); // This works
```

### WeakMap vs Map Comparison 🔄

```javascript
// Demonstrating the difference between Map and WeakMap
let obj = { data: "important" };

// Regular Map - strong reference
const strongMap = new Map();
strongMap.set(obj, "stored in strong map");

// WeakMap - weak reference
const weakMap = new WeakMap();
weakMap.set(obj, "stored in weak map");

console.log(strongMap.has(obj)); // true
console.log(weakMap.has(obj)); // true

// Clear the reference
obj = null;

// Force garbage collection (simulation - actual GC timing varies)
// The Map still holds a reference to the original object
console.log(strongMap.size); // 1 - object still referenced by Map

// The WeakMap allows the object to be garbage collected
// weakMap.has(originalObj) would be false if GC has run
// Note: We can't test this directly because we lost the reference

// WeakMaps don't have size property or iteration methods
// console.log(weakMap.size); // undefined
// for (let [key, value] of weakMap) {} // TypeError!
```

### Practical WeakMap Applications 🌍

**Application 1: Private Data Storage**
```javascript
// Using WeakMap to store private data
const privateData = new WeakMap();

class BankAccount {
  constructor(accountNumber, initialBalance = 0) {
    // Store private data using the instance as the key
    privateData.set(this, {
      accountNumber,
      balance: initialBalance,
      transactions: [],
      createdAt: new Date()
    });
  }
  
  deposit(amount) {
    if (amount <= 0) throw new Error("Amount must be positive");
    
    const data = privateData.get(this);
    data.balance += amount;
    data.transactions.push({
      type: 'deposit',
      amount,
      balance: data.balance,
      timestamp: new Date()
    });
  }
  
  withdraw(amount) {
    if (amount <= 0) throw new Error("Amount must be positive");
    
    const data = privateData.get(this);
    if (amount > data.balance) throw new Error("Insufficient funds");
    
    data.balance -= amount;
    data.transactions.push({
      type: 'withdrawal',
      amount,
      balance: data.balance,
      timestamp: new Date()
    });
  }
  
  getBalance() {
    const data = privateData.get(this);
    return data.balance;
  }
  
  getAccountNumber() {
    const data = privateData.get(this);
    return data.accountNumber;
  }
  
  getTransactionHistory() {
    const data = privateData.get(this);
    return [...data.transactions]; // Return copy
  }
  
  // When the account instance is garbage collected,
  // its private data is automatically cleaned up too
}

// Usage
const account1 = new BankAccount("ACC-123", 1000);
const account2 = new BankAccount("ACC-456", 2000);

account1.deposit(500);
account2.withdraw(300);

console.log(account1.getBalance()); // 1500
console.log(account2.getBalance()); // 1700

// Private data is completely inaccessible from outside
console.log(account1.accountNumber); // undefined
console.log(account1.balance); // undefined

// When account1 goes out of scope, its private data is automatically cleaned up
```

**Application 2: DOM Element Metadata**
```javascript
// Associating metadata with DOM elements without polluting the DOM
const elementMetadata = new WeakMap();

class ElementManager {
  static attachMetadata(element, metadata) {
    if (!(element instanceof HTMLElement)) {
      throw new Error("First argument must be an HTMLElement");
    }
    
    const existingData = elementMetadata.get(element) || {};
    elementMetadata.set(element, { ...existingData, ...metadata });
  }
  
  static getMetadata(element) {
    return elementMetadata.get(element) || {};
  }
  
  static removeMetadata(element) {
    return elementMetadata.delete(element);
  }
  
  static updateMetadata(element, updates) {
    const currentData = elementMetadata.get(element) || {};
    elementMetadata.set(element, { ...currentData, ...updates });
  }
  
  // Method to track element interactions
  static trackInteraction(element, interactionType) {
    const metadata = this.getMetadata(element);
    const interactions = metadata.interactions || [];
    
    interactions.push({
      type: interactionType,
      timestamp: new Date(),
      elementInfo: {
        tagName: element.tagName,
        id: element.id,
        className: element.className
      }
    });
    
    this.updateMetadata(element, { 
      interactions,
      lastInteraction: interactionType,
      interactionCount: interactions.length
    });
  }
  
  static getInteractionStats(element) {
    const metadata = this.getMetadata(element);
    const interactions = metadata.interactions || [];
    
    const stats = interactions.reduce((acc, interaction) => {
      acc[interaction.type] = (acc[interaction.type] || 0) + 1;
      return acc;
    }, {});
    
    return {
      totalInteractions: interactions.length,
      interactionTypes: stats,
      lastInteraction: metadata.lastInteraction,
      firstInteraction: interactions[0]?.timestamp,
      lastInteractionTime: interactions[interactions.length - 1]?.timestamp
    };
  }
}

// Example usage (would work in browser environment)
/*
// Create some DOM elements
const button = document.createElement('button');
const div = document.createElement('div');

// Attach metadata
ElementManager.attachMetadata(button, {
  component: 'PrimaryButton',
  trackClicks: true,
  analyticsId: 'btn-primary-1'
});

ElementManager.attachMetadata(div, {
  component: 'ContentContainer',
  loadTime: Date.now(),
  visible: true
});

// Track interactions
ElementManager.trackInteraction(button, 'click');
ElementManager.trackInteraction(button, 'hover');
ElementManager.trackInteraction(button, 'click');

console.log(ElementManager.getMetadata(button));
console.log(ElementManager.getInteractionStats(button));

// When elements are removed from DOM and lose all references,
// their metadata is automatically garbage collected
button.remove();
div.remove();
// Associated metadata will be cleaned up automatically
*/
```

**Application 3: Observer Pattern with Automatic Cleanup**
```javascript
// Event system that automatically cleans up when objects are garbage collected
const observers = new WeakMap();

class ObservableSubject {
  constructor() {
    observers.set(this, new Set());
  }
  
  addObserver(observer) {
    if (typeof observer.update !== 'function') {
      throw new Error("Observer must have an update method");
    }
    
    observers.get(this).add(observer);
  }
  
  removeObserver(observer) {
    const observerSet = observers.get(this);
    if (observerSet) {
      observerSet.delete(observer);
    }
  }
  
  notifyObservers(data) {
    const observerSet = observers.get(this);
    if (observerSet) {
      for (let observer of observerSet) {
        try {
          observer.update(this, data);
        } catch (error) {
          console.error("Observer update failed:", error);
        }
      }
    }
  }
  
  getObserverCount() {
    const observerSet = observers.get(this);
    return observerSet ? observerSet.size : 0;
  }
}

class DataModel extends ObservableSubject {
  constructor(initialData = {}) {
    super();
    this.data = initialData;
  }
  
  update(newData) {
    const oldData = { ...this.data };
    this.data = { ...this.data, ...newData };
    
    this.notifyObservers({
      type: 'data-updated',
      oldData,
      newData: this.data,
      changes: newData
    });
  }
  
  getData() {
    return { ...this.data };
  }
}

class ViewObserver {
  constructor(name) {
    this.name = name;
  }
  
  update(subject, data) {
    console.log(`${this.name} received update:`, data.type);
    console.log(`Changed data:`, data.changes);
  }
}

// Usage
const model = new DataModel({ count: 0, name: "Counter" });

const view1 = new ViewObserver("View1");
const view2 = new ViewObserver("View2");

model.addObserver(view1);
model.addObserver(view2);

console.log(model.getObserverCount()); // 2

model.update({ count: 1 });
model.update({ name: "Updated Counter" });

// When view1 goes out of scope and is garbage collected,
// it's automatically removed from the observer set
// (in real scenarios, you'd need to explicitly remove or let it go out of scope)
```

## Performance Considerations and Best Practices 🎯

### When to Use Each Data Structure 🤔

```javascript
// Use Symbol for:
// ✅ Unique property keys that won't conflict
// ✅ Private/internal properties
// ✅ Meta-programming and custom behaviors
// ❌ Public APIs where keys need to be discoverable

// Use Set for:
// ✅ Collections where uniqueness matters
// ✅ Fast membership testing (O(1) has() operation)
// ✅ Mathematical set operations (union, intersection)
// ❌ When you need indexed access or complex data association

// Use Map for:
// ✅ Key-value pairs where keys can be any type
// ✅ Preserving insertion order
// ✅ When you need size property and easy iteration
// ✅ Frequent additions and removals
// ❌ When keys are always strings and object syntax is preferred

// Use WeakMap for:
// ✅ Private data associated with objects
// ✅ Metadata that should be garbage collected with objects
// ✅ Avoiding memory leaks in DOM manipulation
// ❌ When you need iteration or size information
// ❌ When keys might be primitives
```

### Performance Comparison 📊

```javascript
// Performance testing example (simplified)
function performanceTest() {
  const iterations = 100000;
  
  // Object vs Map performance
  console.time("Object operations");
  const obj = {};
  for (let i = 0; i < iterations; i++) {
    obj[i] = i;
  }
  for (let i = 0; i < iterations; i++) {
    const value = obj[i];
  }
  console.timeEnd("Object operations");
  
  console.time("Map operations");
  const map = new Map();
  for (let i = 0; i < iterations; i++) {
    map.set(i, i);
  }
  for (let i = 0; i < iterations; i++) {
    const value = map.get(i);
  }
  console.timeEnd("Map operations");
  
  // Array vs Set for uniqueness
  console.time("Array uniqueness check");
  const arr = [];
  for (let i = 0; i < 1000; i++) {
    const value = Math.floor(Math.random() * 500);
    if (!arr.includes(value)) {
      arr.push(value);
    }
  }
  console.timeEnd("Array uniqueness check");
  
  console.time("Set uniqueness check");
  const set = new Set();
  for (let i = 0; i < 1000; i++) {
    const value = Math.floor(Math.random() * 500);
    set.add(value); // Automatically handles uniqueness
  }
  console.timeEnd("Set uniqueness check");
}

// Run performance test
// performanceTest();
```

## Summary

### Core Concepts
- **Symbols:** Unique identifiers for property keys and meta-programming
- **Sets:** Collections of unique values with fast membership testing
- **Maps:** Key-value pairs with any type of key and preserved insertion order
- **WeakMaps:** Object-keyed associations with automatic garbage collection

### Key Advantages
- **Type safety:** Each structure serves specific use cases
- **Performance:** Optimized operations for their intended purposes
- **Memory efficiency:** WeakMaps prevent memory leaks
- **Expressiveness:** Code intent is clearer with appropriate data structures

### Common Use Cases
- **Symbols:** Private properties, unique constants, meta-programming
- **Sets:** Unique collections, mathematical operations, fast lookups
- **Maps:** Flexible key-value storage, ordered data, caching
- **WeakMaps:** Private data, DOM metadata, observer patterns

### Best Practices
- **Choose the right tool:** Match data structure to use case
- **Consider performance:** Each structure has optimal scenarios
- **Memory awareness:** Use WeakMaps for temporary associations
- **API design:** Think about iteration and discovery needs

### Migration Strategies
- **From Objects to Maps:** When you need non-string keys or guaranteed iteration order
- **From Arrays to Sets:** When uniqueness and fast membership testing matter
- **From Closures to WeakMaps:** For private data that should be garbage collected

### My Personal Insight
These new data structures fundamentally changed how I approach data organization in JavaScript. The realization that objects and arrays aren't always the best choice was liberating - each structure has a "sweet spot" where it excels.

**Symbols** taught me about truly private properties and meta-programming possibilities. **Sets** eliminated so much array uniqueness logic from my code. **Maps** replaced many objects where I was misusing object semantics. **WeakMaps** solved memory leak problems I didn't even know I had.

The key insight is that **choosing the right data structure is as important as choosing the right algorithm**. Modern JavaScript gives us precise tools for precise jobs.

### Next Up
Now that you've mastered modern data structures, we'll explore **Iterators & Generators** - the powerful protocols that enable custom iteration behavior, lazy evaluation, and sophisticated control flow patterns in JavaScript.

Remember: These aren't just new features - they're specialized tools that solve specific problems more elegantly than traditional approaches! 🚀✨
