---
title: Destructuring & Spread/Rest Operators
description: Master the art of extracting values from arrays and objects with
  destructuring assignment, and learn to spread and collect elements
  efficiently. These modern syntax features make your code more readable and
  concise.
slidesUrl: https://github.com/AherRahul/portfolio-v1/blob/main/content/articles
dateModified: 2026-02-21
datePublished: 2026-02-21
showOnArticles: false
courseName: 00-understand-javascript-complete
topics:
  - javascript
resources:
  - title: MDN - Destructuring Assignment
    type: documentation
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    description: Complete reference for destructuring assignment in JavaScript
  - title: MDN - Spread Syntax
    type: documentation
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
    description: Comprehensive guide to spread operator usage
  - title: MDN - Rest Parameters
    type: documentation
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters
    description: Understanding rest parameters in function definitions
  - title: ES6 Features Guide
    type: article
    url: https://github.com/lukehoban/es6features#destructuring
    description: Overview of ES6 destructuring and spread features
published: false
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758811621/Portfolio/javaScriptCourse/images/all%20title%20images/27_hmmpq5.png)

Destructuring & Spread/Rest Operators – The Art of Data Extraction
==================================================================

Imagine you're a **professional gift wrapper** 🎁 working during the holiday season. You have two main skills that make you incredibly efficient:

1. **Unwrapping gifts** (Destructuring) - You can quickly and precisely extract items from complex packages, whether they're in boxes, bags, or elaborate wrapping, and neatly lay out each item with proper labels.

2. **Repackaging gifts** (Spread/Rest) - You can take individual items and efficiently pack them into new containers, or take the contents of multiple packages and combine them into a single, beautiful presentation.

**Destructuring and spread/rest operators work exactly like this professional gift wrapper.** They provide elegant, readable syntax for extracting values from complex data structures (arrays and objects) and for combining or distributing data in flexible ways.

These ES6+ features transform verbose, repetitive code into concise, expressive statements that clearly communicate intent. They're not just syntactic sugar – they represent a fundamental shift toward more declarative programming patterns that make code easier to read, write, and maintain.

## The Theoretical Foundation: Pattern Matching and Data Flow 📐

### Understanding Destructuring as Pattern Matching

**Destructuring is based on the concept of "pattern matching"** - a programming paradigm where you describe the structure you expect and the language automatically extracts values that match that structure.

Think of it like creating a **template or blueprint** that JavaScript uses to map values from complex data structures into individual variables. This concept comes from functional programming languages like Haskell and ML, where pattern matching is a core feature.

**Why is this powerful?**
1. **Declarative vs Imperative**: Instead of writing step-by-step instructions to extract data, you declare what you want
2. **Self-Documenting**: The destructuring pattern itself documents the expected data structure
3. **Fail-Fast**: If the structure doesn't match, you get clear errors immediately
4. **Immutable-Friendly**: Encourages creating new data rather than modifying existing structures

### The Philosophy Behind Spread/Rest Operators

**Spread and Rest operators embody the principle of "expansion and collection"** - fundamental operations in functional programming and mathematics.

- **Spread (...)** represents **divergence** - taking something whole and expanding it into parts
- **Rest (...)** represents **convergence** - taking multiple parts and collecting them into a whole

This duality reflects the mathematical concept of **set operations** and the functional programming principle of **variadic functions** (functions that accept variable numbers of arguments).

**Conceptual Benefits:**
1. **Composability**: Easy to combine and transform data structures
2. **Immutability**: Create new structures without modifying originals
3. **Flexibility**: Handle unknown numbers of elements elegantly
4. **Expressiveness**: Code clearly shows intent to expand or collect

## The Problem These Features Solve 🎯

### Before ES6: Verbose Data Extraction 📝

Before destructuring and spread operators, extracting data from arrays and objects required verbose, repetitive code:

```javascript
// Old way: Extracting array elements
var coordinates = [10, 20, 30];
var x = coordinates[0];
var y = coordinates[1];
var z = coordinates[2];

// Old way: Extracting object properties
var user = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};
var name = user.name;
var age = user.age;
var email = user.email;

// Old way: Function with variable arguments
function calculateSum() {
  var numbers = Array.prototype.slice.call(arguments);
  var sum = 0;
  for (var i = 0; i < numbers.length; i++) {
    sum += numbers[i];
  }
  return sum;
}

// Old way: Combining arrays
var arr1 = [1, 2, 3];
var arr2 = [4, 5, 6];
var combined = arr1.concat(arr2);
```

**Problems with the old approach:**
- **Repetitive code:** Similar patterns repeated over and over
- **Error-prone:** Easy to make mistakes with array indices
- **Poor readability:** Intent isn't immediately clear
- **Verbose syntax:** More code to accomplish simple tasks

### Modern ES6+ Approach: Elegant and Expressive ✨

```javascript
// Modern way: Array destructuring
const [x, y, z] = [10, 20, 30];

// Modern way: Object destructuring
const { name, age, email } = {
  name: "Alice",
  age: 30,
  email: "alice@example.com"
};

// Modern way: Rest parameters
function calculateSum(...numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}

// Modern way: Spread operator
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
const combined = [...arr1, ...arr2];
```

**Benefits of the modern approach:**
- **Concise syntax:** Express intent clearly in fewer lines
- **Self-documenting:** Variable names match data structure
- **Less error-prone:** No manual index management
- **Flexible patterns:** Powerful combinations and variations

## Array Destructuring – Unpacking Collections 📦

### Basic Array Destructuring Concepts 💡

**What is array destructuring?** It's a syntax that allows you to extract values from arrays and assign them to variables in a single, declarative statement.

**Mental Model:** Think of array destructuring as creating a template that matches the structure of your data. JavaScript automatically maps the values based on position.

```javascript
// Basic destructuring assignment
const fruits = ["apple", "banana", "orange"];
const [first, second, third] = fruits;

console.log(first);  // "apple"
console.log(second); // "banana"
console.log(third);  // "orange"

// What's happening conceptually:
// Position 0: first  = fruits[0] = "apple"
// Position 1: second = fruits[1] = "banana"
// Position 2: third  = fruits[2] = "orange"
```

### Advanced Array Destructuring Patterns 🎨

**Pattern 1: Skipping Elements**
```javascript
const numbers = [1, 2, 3, 4, 5];

// Skip elements you don't need with empty slots
const [first, , third, , fifth] = numbers;

console.log(first); // 1
console.log(third); // 3
console.log(fifth); // 5

// Practical example: Extracting coordinates
const coordinates = [latitude, longitude, altitude, accuracy, timestamp];
const [lat, lng, , , time] = coordinates; // Skip altitude and accuracy
```

**Pattern 2: Default Values**
```javascript
// Provide defaults for missing values
const [a = 10, b = 20, c = 30] = [1, 2]; // Third element is missing

console.log(a); // 1 (from array)
console.log(b); // 2 (from array)
console.log(c); // 30 (default value)

// Practical example: Configuration with defaults
function processConfig(config = []) {
  const [
    theme = 'light',
    language = 'en',
    notifications = true
  ] = config;
  
  return { theme, language, notifications };
}

console.log(processConfig(['dark', 'es'])); 
// { theme: 'dark', language: 'es', notifications: true }
```

**Pattern 3: Rest Elements**
```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// Collect remaining elements
const [first, second, ...rest] = numbers;

console.log(first);  // 1
console.log(second); // 2
console.log(rest);   // [3, 4, 5, 6, 7, 8, 9, 10]

// Practical example: Processing function arguments
function processData(primaryValue, secondaryValue, ...additionalData) {
  console.log('Primary:', primaryValue);
  console.log('Secondary:', secondaryValue);
  console.log('Additional data count:', additionalData.length);
  return { primaryValue, secondaryValue, additionalData };
}

const result = processData(1, 2, 3, 4, 5, 6);
// Primary: 1
// Secondary: 2
// Additional data count: 4
```

### Practical Array Destructuring Examples 🌍

**Example 1: Swapping Variables**
```javascript
// Old way: Requires temporary variable
let a = 1;
let b = 2;
let temp = a;
a = b;
b = temp;

// Modern way: One elegant line
let x = 1;
let y = 2;
[x, y] = [y, x];

console.log(x); // 2
console.log(y); // 1

// Real-world application: Sorting algorithms
function bubbleSort(arr) {
  const sorted = [...arr]; // Don't mutate original
  
  for (let i = 0; i < sorted.length; i++) {
    for (let j = 0; j < sorted.length - i - 1; j++) {
      if (sorted[j] > sorted[j + 1]) {
        // Elegant swap using destructuring
        [sorted[j], sorted[j + 1]] = [sorted[j + 1], sorted[j]];
      }
    }
  }
  
  return sorted;
}
```

**Example 2: Function Return Values**
```javascript
// Function returning multiple values
function getUserLocation() {
  // Simulate getting user location
  return [40.7128, -74.0060, "New York", "NY"];
}

// Destructure the returned array
const [latitude, longitude, city, state] = getUserLocation();

console.log(`Location: ${city}, ${state}`);
console.log(`Coordinates: ${latitude}, ${longitude}`);

// Advanced example: Error handling with tuples
function divide(a, b) {
  if (b === 0) {
    return [null, new Error("Division by zero")];
  }
  return [a / b, null];
}

const [result, error] = divide(10, 2);
if (error) {
  console.error("Error:", error.message);
} else {
  console.log("Result:", result); // 5
}
```

**Example 3: Working with Nested Arrays**
```javascript
const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];

// Destructure nested arrays
const [[a, b, c], [d, e, f], [g, h, i]] = matrix;

console.log(a, e, i); // 1 5 9 (diagonal elements)

// Practical example: Processing CSV data
function parseCSVRow(csvString) {
  const rows = csvString.split('\n').map(row => row.split(','));
  
  // Destructure header and data rows
  const [headers, ...dataRows] = rows;
  
  return dataRows.map(row => {
    const record = {};
    const [name, age, email, ...additionalFields] = row;
    
    record.name = name;
    record.age = parseInt(age);
    record.email = email;
    record.additionalData = additionalFields;
    
    return record;
  });
}

const csvData = `name,age,email,city,country
Alice,30,alice@example.com,New York,USA
Bob,25,bob@example.com,London,UK`;

const parsedData = parseCSVRow(csvData);
console.log(parsedData);
```

## Object Destructuring – Extracting Properties 🔑

### Basic Object Destructuring Concepts 💡

**What is object destructuring?** It's a syntax that allows you to extract properties from objects and assign them to variables with matching names.

**Mental Model:** Think of object destructuring as creating a blueprint that extracts specific rooms (properties) from a house (object) and gives you direct access to each room.

```javascript
// Basic object destructuring
const user = {
  name: "Alice",
  age: 30,
  email: "alice@example.com",
  address: {
    city: "New York",
    country: "USA"
  }
};

// Extract properties into variables
const { name, age, email } = user;

console.log(name);  // "Alice"
console.log(age);   // 30
console.log(email); // "alice@example.com"

// What's happening conceptually:
// name  = user.name  = "Alice"
// age   = user.age   = 30
// email = user.email = "alice@example.com"
```

### Advanced Object Destructuring Patterns 🎨

**Pattern 1: Renaming Variables**
```javascript
const apiResponse = {
  user_id: 123,
  user_name: "Alice",
  user_email: "alice@example.com"
};

// Rename variables to follow JavaScript conventions
const {
  user_id: id,
  user_name: name,
  user_email: email
} = apiResponse;

console.log(id);    // 123
console.log(name);  // "Alice"
console.log(email); // "alice@example.com"

// Practical example: API data transformation
function transformUserData(apiData) {
  const {
    user_id: id,
    user_name: name,
    user_email: email,
    user_profile: {
      avatar_url: avatarUrl,
      bio_text: bio
    }
  } = apiData;
  
  return { id, name, email, avatarUrl, bio };
}
```

**Pattern 2: Default Values**
```javascript
const config = {
  theme: "dark",
  language: "en"
  // notifications property is missing
};

// Provide defaults for missing properties
const {
  theme = "light",
  language = "en",
  notifications = true,
  autoSave = false
} = config;

console.log(theme);         // "dark" (from object)
console.log(language);      // "en" (from object)
console.log(notifications); // true (default)
console.log(autoSave);      // false (default)

// Practical example: Function options pattern
function createChart(data, options = {}) {
  const {
    width = 400,
    height = 300,
    type = 'line',
    animate = true,
    theme = 'light'
  } = options;
  
  return {
    data,
    config: { width, height, type, animate, theme }
  };
}

const chart = createChart([1, 2, 3], { width: 600, type: 'bar' });
```

**Pattern 3: Nested Destructuring**
```javascript
const userProfile = {
  personal: {
    name: "Alice",
    age: 30
  },
  contact: {
    email: "alice@example.com",
    phone: "+1-555-0123"
  },
  preferences: {
    theme: "dark",
    notifications: {
      email: true,
      push: false,
      sms: true
    }
  }
};

// Deep destructuring
const {
  personal: { name, age },
  contact: { email },
  preferences: {
    theme,
    notifications: { email: emailNotifications, push: pushNotifications }
  }
} = userProfile;

console.log(name);              // "Alice"
console.log(age);               // 30
console.log(email);             // "alice@example.com"
console.log(theme);             // "dark"
console.log(emailNotifications); // true
console.log(pushNotifications);  // false
```

**Pattern 4: Rest Properties**
```javascript
const user = {
  id: 123,
  name: "Alice",
  email: "alice@example.com",
  age: 30,
  city: "New York",
  country: "USA",
  jobTitle: "Developer"
};

// Extract specific properties and collect the rest
const { id, name, email, ...otherInfo } = user;

console.log(id);        // 123
console.log(name);      // "Alice"
console.log(email);     // "alice@example.com"
console.log(otherInfo); // { age: 30, city: "New York", country: "USA", jobTitle: "Developer" }

// Practical example: Separating sensitive data
function sanitizeUserData(user) {
  const { password, ssn, creditCard, ...publicData } = user;
  
  // Log sensitive data access (for security audit)
  if (password || ssn || creditCard) {
    console.log("Sensitive data accessed - audit logged");
  }
  
  return publicData; // Return only non-sensitive data
}
```

### Practical Object Destructuring Examples 🌍

**Example 1: Function Parameters**
```javascript
// Instead of passing many parameters
function createUser(name, age, email, city, country, jobTitle) {
  // Function body
}

// Use object destructuring for named parameters
function createUserModern({ name, age, email, city = "Unknown", country = "Unknown", jobTitle }) {
  console.log(`Creating user: ${name}, ${age} years old`);
  console.log(`Contact: ${email}`);
  console.log(`Location: ${city}, ${country}`);
  console.log(`Job: ${jobTitle}`);
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    name,
    age,
    email,
    location: { city, country },
    jobTitle,
    createdAt: new Date()
  };
}

// Much clearer function calls
const user = createUserModern({
  name: "Alice",
  age: 30,
  email: "alice@example.com",
  city: "New York",
  country: "USA",
  jobTitle: "Software Developer"
});
```

**Example 2: React Component Props (if applicable)**
```javascript
// React component using destructuring (modern pattern)
function UserCard({ user, showEmail = false, onEdit, onDelete }) {
  // Destructure user object
  const { name, age, avatar, preferences: { theme } } = user;
  
  return {
    name,
    age,
    avatar,
    theme,
    showEmail,
    actions: { onEdit, onDelete }
  };
}

// Usage
const userData = {
  name: "Alice",
  age: 30,
  avatar: "avatar.jpg",
  preferences: { theme: "dark" }
};

const card = UserCard({
  user: userData,
  showEmail: true,
  onEdit: () => console.log("Edit user"),
  onDelete: () => console.log("Delete user")
});
```

## Spread Operator – Expanding and Combining 📤

### Understanding the Spread Operator (...) 💡

**What is the spread operator?** It's a syntax that allows you to expand iterable elements (arrays, objects, strings) in places where multiple elements are expected.

**Mental Model:** Think of the spread operator as "unpacking" a suitcase and laying out all the contents individually, rather than dealing with the suitcase as a whole.

### Array Spreading 📋

```javascript
// Basic array spreading
const fruits = ["apple", "banana"];
const vegetables = ["carrot", "lettuce"];

// Combine arrays
const food = [...fruits, ...vegetables];
console.log(food); // ["apple", "banana", "carrot", "lettuce"]

// Add elements while spreading
const meal = ["soup", ...fruits, "sandwich", ...vegetables, "dessert"];
console.log(meal); // ["soup", "apple", "banana", "sandwich", "carrot", "lettuce", "dessert"]
```

**Practical Array Spreading Examples:**

```javascript
// Example 1: Array copying (shallow copy)
const originalArray = [1, 2, 3, 4, 5];
const copiedArray = [...originalArray];

copiedArray.push(6);
console.log(originalArray); // [1, 2, 3, 4, 5] (unchanged)
console.log(copiedArray);   // [1, 2, 3, 4, 5, 6]

// Example 2: Finding max/min values
const numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5];

// Old way
const maxOld = Math.max.apply(null, numbers);

// Modern way with spread
const maxNew = Math.max(...numbers);
const minNew = Math.min(...numbers);

console.log(maxNew); // 9
console.log(minNew); // 1

// Example 3: Converting NodeList to Array
// const elements = document.querySelectorAll('.item'); // NodeList
// const elementsArray = [...elements]; // Convert to Array

// Example 4: Array insertion at specific position
function insertAt(array, index, ...items) {
  return [
    ...array.slice(0, index),
    ...items,
    ...array.slice(index)
  ];
}

const originalNumbers = [1, 2, 5, 6];
const withInserted = insertAt(originalNumbers, 2, 3, 4);
console.log(withInserted); // [1, 2, 3, 4, 5, 6]
```

### Object Spreading 📋

```javascript
// Basic object spreading
const personalInfo = {
  name: "Alice",
  age: 30
};

const contactInfo = {
  email: "alice@example.com",
  phone: "+1-555-0123"
};

// Combine objects
const userProfile = {
  ...personalInfo,
  ...contactInfo,
  id: 123,
  isActive: true
};

console.log(userProfile);
// {
//   name: "Alice",
//   age: 30,
//   email: "alice@example.com", 
//   phone: "+1-555-0123",
//   id: 123,
//   isActive: true
// }
```

**Practical Object Spreading Examples:**

```javascript
// Example 1: Object updating (immutable pattern)
const currentUser = {
  id: 123,
  name: "Alice",
  email: "alice@old-email.com",
  preferences: {
    theme: "light",
    notifications: true
  }
};

// Update email without mutating original
const updatedUser = {
  ...currentUser,
  email: "alice@new-email.com",
  preferences: {
    ...currentUser.preferences,
    theme: "dark"
  }
};

console.log(currentUser.email); // "alice@old-email.com" (unchanged)
console.log(updatedUser.email); // "alice@new-email.com"

// Example 2: Default options pattern
function makeRequest(url, options = {}) {
  const defaultOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    timeout: 5000
  };
  
  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers
    }
  };
  
  console.log(`Making ${finalOptions.method} request to ${url}`);
  console.log('Options:', finalOptions);
  
  return finalOptions;
}

makeRequest('/api/users', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer token123'
  },
  body: JSON.stringify({ name: 'Alice' })
});

// Example 3: Conditional property spreading
function createUserProfile(userData, includePrivate = false) {
  const publicData = {
    name: userData.name,
    avatar: userData.avatar,
    joinDate: userData.joinDate
  };
  
  const privateData = {
    email: userData.email,
    phone: userData.phone,
    address: userData.address
  };
  
  return {
    ...publicData,
    ...(includePrivate && privateData) // Conditionally spread
  };
}

const userData = {
  name: "Alice",
  avatar: "avatar.jpg",
  joinDate: "2023-01-01",
  email: "alice@example.com",
  phone: "+1-555-0123",
  address: "123 Main St"
};

const publicProfile = createUserProfile(userData, false);
const privateProfile = createUserProfile(userData, true);

console.log(publicProfile);  // Only public data
console.log(privateProfile); // Public + private data
```

## Rest Parameters – Collecting Arguments 📥

### Understanding Rest Parameters 💡

**What are rest parameters?** They allow you to represent an indefinite number of arguments as an array, collecting all remaining arguments into a single parameter.

**Mental Model:** Think of rest parameters as a "catch-all basket" that collects whatever arguments are left over after assigning the named parameters.

### Basic Rest Parameters 📝

```javascript
// Traditional approach with arguments object
function sumOld() {
  var sum = 0;
  for (var i = 0; i < arguments.length; i++) {
    sum += arguments[i];
  }
  return sum;
}

// Modern approach with rest parameters
function sumNew(...numbers) {
  return numbers.reduce((sum, num) => sum + num, 0);
}

console.log(sumNew(1, 2, 3, 4, 5)); // 15

// Rest parameters are real arrays with all array methods
function analyzeNumbers(...numbers) {
  return {
    count: numbers.length,
    sum: numbers.reduce((a, b) => a + b, 0),
    average: numbers.reduce((a, b) => a + b, 0) / numbers.length,
    max: Math.max(...numbers),
    min: Math.min(...numbers)
  };
}

console.log(analyzeNumbers(1, 2, 3, 4, 5));
// { count: 5, sum: 15, average: 3, max: 5, min: 1 }
```

### Advanced Rest Parameter Patterns 🎨

**Pattern 1: Named Parameters + Rest**
```javascript
function logMessage(level, message, ...additionalData) {
  const timestamp = new Date().toISOString();
  
  console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
  
  if (additionalData.length > 0) {
    console.log('Additional data:', additionalData);
  }
}

logMessage('info', 'User logged in', { userId: 123 }, { sessionId: 'abc' });
// [2026-09-26T...] INFO: User logged in
// Additional data: [{ userId: 123 }, { sessionId: 'abc' }]

// Pattern 2: Flexible API design
function createQuery(tableName, ...conditions) {
  const baseQuery = `SELECT * FROM ${tableName}`;
  
  if (conditions.length === 0) {
    return baseQuery;
  }
  
  const whereClause = conditions
    .map(condition => `(${condition})`)
    .join(' AND ');
    
  return `${baseQuery} WHERE ${whereClause}`;
}

console.log(createQuery('users'));
// "SELECT * FROM users"

console.log(createQuery('users', 'age > 18', 'status = "active"', 'city = "New York"'));
// "SELECT * FROM users WHERE (age > 18) AND (status = "active") AND (city = "New York")"
```

### Practical Rest Parameter Examples 🌍

**Example 1: Event System**
```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }
  
  on(eventName, callback) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }
  
  emit(eventName, ...args) {
    if (!this.events[eventName]) {
      return;
    }
    
    this.events[eventName].forEach(callback => {
      callback(...args); // Spread the collected arguments
    });
  }
}

const emitter = new EventEmitter();

emitter.on('user-action', (action, userId, metadata) => {
  console.log(`Action: ${action}, User: ${userId}`, metadata);
});

emitter.emit('user-action', 'login', 123, { timestamp: Date.now(), ip: '192.168.1.1' });
```

**Example 2: Mathematical Operations**
```javascript
function createMathOperations() {
  return {
    add: (...numbers) => numbers.reduce((sum, num) => sum + num, 0),
    
    multiply: (...numbers) => numbers.reduce((product, num) => product * num, 1),
    
    average: (...numbers) => {
      if (numbers.length === 0) return 0;
      return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    },
    
    range: (...numbers) => {
      if (numbers.length === 0) return 0;
      return Math.max(...numbers) - Math.min(...numbers);
    }
  };
}

const math = createMathOperations();

console.log(math.add(1, 2, 3, 4, 5));        // 15
console.log(math.multiply(2, 3, 4));          // 24
console.log(math.average(10, 20, 30));        // 20
console.log(math.range(5, 15, 3, 22, 8));     // 19 (22 - 3)
```

## Combining Destructuring with Spread/Rest 🎭

The real power emerges when you combine these features:

```javascript
// Complex data processing example
function processApiResponse(response) {
  // Destructure response with defaults and rest
  const {
    status = 'unknown',
    data: {
      users = [],
      metadata = {},
      ...otherData
    } = {},
    ...responseMetadata
  } = response;
  
  // Process users array
  const processedUsers = users.map(user => {
    const { id, name, email, ...profile } = user;
    
    return {
      id,
      displayName: name,
      contactEmail: email,
      profile: {
        ...profile,
        processedAt: new Date().toISOString()
      }
    };
  });
  
  // Spread and combine results
  return {
    status,
    users: processedUsers,
    metadata: {
      ...metadata,
      userCount: processedUsers.length,
      ...responseMetadata
    },
    additionalData: otherData
  };
}

// Usage
const apiResponse = {
  status: 'success',
  data: {
    users: [
      { id: 1, name: 'Alice', email: 'alice@example.com', age: 30, city: 'New York' },
      { id: 2, name: 'Bob', email: 'bob@example.com', age: 25, city: 'London' }
    ],
    metadata: { totalPages: 5, currentPage: 1 },
    categories: ['admin', 'user'],
    settings: { theme: 'dark' }
  },
  timestamp: '2026-09-26T10:00:00Z',
  requestId: 'req-123'
};

const processed = processApiResponse(apiResponse);
console.log(processed);
```

## Common Patterns and Best Practices 🎯

### Function Parameter Patterns 📝

```javascript
// 1. Options object with destructuring
function createChart({ 
  data, 
  width = 400, 
  height = 300, 
  type = 'line',
  options = {}
}) {
  const { animate = true, theme = 'light', ...otherOptions } = options;
  
  return {
    data,
    config: {
      width,
      height,
      type,
      animate,
      theme,
      ...otherOptions
    }
  };
}

// 2. Required and optional parameters
function processUserData(
  userId,                    // Required
  { 
    includeProfile = false,  // Optional with default
    includeHistory = false,  // Optional with default
    ...processingOptions     // Additional options
  } = {}
) {
  console.log(`Processing user ${userId}`);
  console.log('Options:', { includeProfile, includeHistory, ...processingOptions });
}

// 3. Variable arguments with context
function logWithContext(context, level, message, ...data) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${context}] ${level}: ${message}`);
  
  if (data.length > 0) {
    console.log('Data:', ...data);
  }
}
```

### State Management Patterns 🔄

```javascript
// Immutable state updates
function updateUserState(currentState, updates) {
  return {
    ...currentState,
    user: {
      ...currentState.user,
      ...updates,
      lastModified: new Date().toISOString()
    }
  };
}

// Array operations without mutation
function addItem(array, item) {
  return [...array, item];
}

function removeItem(array, index) {
  return [
    ...array.slice(0, index),
    ...array.slice(index + 1)
  ];
}

function updateItem(array, index, updates) {
  return array.map((item, i) => 
    i === index ? { ...item, ...updates } : item
  );
}
```

## Summary

### Core Concepts
- **Destructuring:** Extract values from arrays and objects into variables
- **Spread operator:** Expand elements in places where multiple elements are expected
- **Rest parameters:** Collect multiple arguments into an array
- **Pattern matching:** Use structure to guide variable assignment

### Key Benefits
- **Readable code:** Intent is clear from the syntax
- **Less repetition:** Eliminate verbose property access patterns
- **Immutable patterns:** Easy to create new objects/arrays without mutation
- **Flexible APIs:** Create functions that accept variable arguments elegantly

### Best Practices
- **Use descriptive variable names** that match your data structure
- **Provide default values** for optional properties
- **Combine patterns** for powerful data processing
- **Prefer immutable updates** using spread operators

### Modern JavaScript Patterns
- **Options objects** instead of long parameter lists
- **Immutable state management** for predictable data flow
- **Functional programming** with clean data transformations
- **API design** that's both flexible and type-safe

### My Personal Insight
Learning destructuring and spread/rest operators completely changed how I approach data handling in JavaScript. These aren't just convenient shortcuts – they represent a fundamental shift toward more declarative, functional programming patterns.

The breakthrough moment came when I realized these features make **code more self-documenting**. When you see `const { name, email, age } = user`, you immediately understand what data you're working with, which properties matter, and what the function expects.

These patterns also dramatically reduce bugs related to typos in property names, undefined values, and accidental mutations – making code both cleaner and more reliable.

### Next Up
Now that you've mastered modern data extraction and manipulation, we'll explore **Template Literals & Tagged Templates** – the revolution in string handling that brings interpolation, multiline strings, and custom processing to JavaScript.

Remember: Destructuring and spread/rest aren't just syntax features – they're the foundation of modern JavaScript data handling patterns! 🚀✨
