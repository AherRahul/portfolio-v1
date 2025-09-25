---
title: "undefined vs not defined"
description: "undefined and 'not defined' are two completely different concepts in JavaScript that often confuse developers. Understanding the distinction between these states is essential for debugging and writing robust code."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-25"
datePublished: "2025-09-25"
showOnArticles: false
courseName: 00-understand-javascript-complete
topics:
  - javascript
resources:
  - title: "JS course PDF - 13"
    type: "PDF"
    url: "https://res.cloudinary.com/duojkrgue/image/upload/v1758792130/Portfolio/javaScriptCourse/pdf/JavaScript-day13_Undefined_compressed.pdf"
    description: "A PDF Notes on undefined vs not defined topic"
  - title: "MDN - undefined"
    type: "documentation"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined"
    description: "Complete reference for the undefined value in JavaScript"
  - title: "MDN - ReferenceError"
    type: "documentation"
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError"
    description: "Understanding ReferenceError when variables are not defined"
  - title: "JavaScript.info - Variables"
    type: "article"
    url: "https://javascript.info/variables"
    description: "Comprehensive guide to variable declaration and undefined values"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758811616/Portfolio/javaScriptCourse/images/all%20title%20images/14_b0culy.png)

undefined vs not defined – The Tale of Two Absences
===================================================

Imagine you're a **librarian** 📚 in a magical library where every book has a specific spot on the shelf. In this library, there are two very different situations:

1. **Empty Slot with a Label** (`undefined`) - There's a designated spot on the shelf with a label "JavaScript Basics," but the book is missing. The slot exists, but it's empty.

2. **No Slot at All** (`not defined`) - You're looking for a book called "Unicorn Programming," but there's no slot for it anywhere. The library doesn't even know this book should exist.

In JavaScript, `undefined` and "not defined" represent these exact scenarios. They're often confused because they both represent "absence," but they're fundamentally different concepts that occur at different stages of JavaScript's execution.

## What is `undefined`? 📖

`undefined` is a **primitive value** in JavaScript that represents a declared variable that hasn't been assigned a value yet. It's like a placeholder that says "I exist, but I'm empty."

### `undefined` is a Special Value 🎯

```javascript
// undefined is a global property and primitive value
console.log(typeof undefined); // "undefined"
console.log(undefined === undefined); // true

// It's also the only value of type "undefined"
let variable;
console.log(typeof variable); // "undefined"
console.log(variable === undefined); // true

// undefined is falsy
console.log(Boolean(undefined)); // false
console.log(!undefined); // true

// But it's not the same as other falsy values
console.log(undefined == null); // true (loose equality)
console.log(undefined === null); // false (strict equality)
console.log(undefined == false); // false
console.log(undefined === false); // false
```

### When Variables Become `undefined` 🔍

```javascript
// 1. Declared but not initialized
let declaredVariable;
console.log(declaredVariable); // undefined

// 2. Function parameters not passed
function greet(name, age) {
    console.log(name); // "Alice"
    console.log(age);  // undefined (not passed)
}
greet("Alice");

// 3. Function with no return statement
function noReturn() {
    console.log("This function doesn't return anything");
}
const result = noReturn(); // "This function doesn't return anything"
console.log(result); // undefined

// 4. Object properties that don't exist
const person = { name: "Alice" };
console.log(person.age); // undefined

// 5. Array elements that don't exist
const colors = ["red", "green"];
console.log(colors[5]); // undefined

// 6. Explicit assignment
let explicitlyUndefined = undefined;
console.log(explicitlyUndefined); // undefined
```

### Hoisting and `undefined` 🎪

```javascript
// Variables are hoisted and initialized with undefined
console.log(hoistedVar); // undefined (not an error!)
var hoistedVar = "I'm hoisted!";

// This is what actually happens:
var hoistedVar; // = undefined (hoisting)
console.log(hoistedVar); // undefined
hoistedVar = "I'm hoisted!";

// Function expressions behave differently
console.log(functionExpression); // undefined
var functionExpression = function() {
    return "I'm a function expression";
};

// let and const are hoisted but in temporal dead zone
console.log(letVariable); // ReferenceError (not undefined!)
let letVariable = "I'm let";
```

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758815567/Portfolio/javaScriptCourse/images/13/undefined_cases.png)

## What is "not defined"? 🚫

"Not defined" is **not a value** – it's an **error state** that occurs when you try to access a variable that JavaScript doesn't know about. It's like asking the librarian for a book that was never catalogued.

### ReferenceError: Variable is not defined 💥

```javascript
// Trying to access a variable that was never declared
console.log(nonExistentVariable); // ReferenceError: nonExistentVariable is not defined

// This happens at runtime when JavaScript tries to resolve the identifier
function tryToAccess() {
    return mysteriousVariable; // ReferenceError: mysteriousVariable is not defined
}

// tryToAccess(); // Uncommenting this would throw an error

// You can't even check its type
// console.log(typeof someUnknownVariable); // ReferenceError in strict mode
// In non-strict mode, typeof returns "undefined" for undeclared variables
```

### The Difference in Action 🎭

```javascript
// Scenario 1: undefined (variable exists but has no value)
let existingVariable;
console.log(existingVariable); // undefined
console.log(typeof existingVariable); // "undefined"

// Scenario 2: not defined (variable doesn't exist)
// console.log(nonExistingVariable); // ReferenceError: nonExistingVariable is not defined
// console.log(typeof nonExistingVariable); // ReferenceError in strict mode

// Safe way to check if variable exists
if (typeof potentiallyUndeclaredVariable !== 'undefined') {
    console.log("Variable exists");
} else {
    console.log("Variable doesn't exist or is undefined");
}
```

## Hoisting Behavior Comparison 🎪

### `var` Hoisting with `undefined`

```javascript
// What you write:
console.log(a); // undefined
console.log(b); // ReferenceError: b is not defined
var a = 5;

// What JavaScript does:
var a; // hoisted and initialized with undefined
console.log(a); // undefined
console.log(b); // ReferenceError: b is not defined (b was never declared)
a = 5;
```

### `let` and `const` Hoisting (Temporal Dead Zone)

```javascript
// let and const are hoisted but not initialized
console.log(typeof a); // "undefined" (special case)
console.log(typeof b); // ReferenceError: Cannot access 'b' before initialization
console.log(typeof c); // ReferenceError: Cannot access 'c' before initialization

let b = 10;
const c = 20;

// The temporal dead zone means the variables exist but can't be accessed
function temporalDeadZoneExample() {
    // TDZ starts here for variable 'x'
    console.log(typeof x); // ReferenceError: Cannot access 'x' before initialization
    let x = 5; // TDZ ends here
    console.log(x); // 5
}
```

## Practical Examples and Debugging 🔧

### Example 1: Function Parameters 📝

```javascript
function createUser(name, age, email) {
    console.log("Name:", name);     // "Alice"
    console.log("Age:", age);       // undefined (not passed)
    console.log("Email:", email);   // undefined (not passed)
    
    // Better approach with default parameters
    return {
        name: name || "Anonymous",
        age: age || 0,
        email: email || "no-email@example.com"
    };
}

const user1 = createUser("Alice");
console.log(user1); // { name: "Alice", age: 0, email: "no-email@example.com" }

// ES6 default parameters
function createUserModern(name = "Anonymous", age = 0, email = "no-email@example.com") {
    return { name, age, email };
}

const user2 = createUserModern("Bob");
console.log(user2); // { name: "Bob", age: 0, email: "no-email@example.com" }
```

### Example 2: Object Property Access 🏠

```javascript
const user = {
    name: "Alice",
    profile: {
        age: 30
    }
};

// Safe property access
console.log(user.name);                    // "Alice"
console.log(user.email);                   // undefined (property doesn't exist)
console.log(user.profile.age);             // 30
console.log(user.profile.city);            // undefined (nested property doesn't exist)

// Dangerous nested access
// console.log(user.settings.theme);       // TypeError: Cannot read property 'theme' of undefined

// Safe nested access methods:

// Method 1: Check each level
if (user.settings && user.settings.theme) {
    console.log(user.settings.theme);
}

// Method 2: Optional chaining (ES2020)
console.log(user.settings?.theme);         // undefined (no error)
console.log(user.profile?.city);           // undefined (no error)

// Method 3: Destructuring with defaults
const { settings = {} } = user;
console.log(settings.theme);               // undefined (safe)
```

### Example 3: Array Access Patterns 📊

```javascript
const fruits = ["apple", "banana"];

console.log(fruits[0]);    // "apple"
console.log(fruits[5]);    // undefined (index doesn't exist)
console.log(fruits.length); // 2

// Common mistake with array holes
const sparseArray = [1, , , 4]; // Array with holes
console.log(sparseArray[1]);     // undefined
console.log(sparseArray[2]);     // undefined
console.log(sparseArray.length); // 4

// Detecting array holes
console.log(1 in sparseArray);   // false (hole)
console.log(0 in sparseArray);   // true (element exists)

// Safe array access
function safeArrayAccess(arr, index) {
    return index >= 0 && index < arr.length ? arr[index] : undefined;
}

console.log(safeArrayAccess(fruits, 0));  // "apple"
console.log(safeArrayAccess(fruits, 5));  // undefined
```

## Checking for `undefined` vs "not defined" 🕵️‍♂️

### Different Detection Methods 🔍

```javascript
// Method 1: typeof operator (safest for unknown variables)
console.log(typeof declaredButUndefined); // "undefined"
console.log(typeof completelyUnknown);    // "undefined" (special case - no error)

// Method 2: Direct comparison (only for known variables)
let knownVariable;
console.log(knownVariable === undefined);     // true
console.log(knownVariable == undefined);      // true
console.log(knownVariable == null);           // true (loose equality)

// Method 3: Using void 0 (equivalent to undefined)
console.log(knownVariable === void 0);        // true

// Method 4: Checking object properties
const obj = { a: undefined };
console.log('a' in obj);                      // true (property exists but is undefined)
console.log('b' in obj);                      // false (property doesn't exist)
console.log(obj.hasOwnProperty('a'));         // true
console.log(obj.hasOwnProperty('b'));         // false
```

### Safe Variable Checking Function 🛡️

```javascript
function isVariableDefined(variableName) {
    try {
        return eval(variableName) !== undefined || eval(`typeof ${variableName}`) !== 'undefined';
    } catch (e) {
        return false; // Variable is not defined
    }
}

// Better approach without eval
function safeCheck(obj, property) {
    return obj && obj.hasOwnProperty(property);
}

// Modern approach with optional chaining
function getValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

const data = { user: { profile: { name: "Alice" } } };
console.log(getValue(data, 'user.profile.name'));  // "Alice"
console.log(getValue(data, 'user.profile.age'));   // undefined
console.log(getValue(data, 'user.settings.theme')); // undefined
```

## Common Pitfalls and Best Practices 🚨

### Pitfall 1: Confusing `undefined` with `null` 🕳️

```javascript
let a;              // undefined
let b = null;       // null
let c = undefined;  // undefined (explicit)

console.log(a == b);   // true (loose equality)
console.log(a === b);  // false (strict equality)
console.log(typeof a); // "undefined"
console.log(typeof b); // "object" (historical quirk)

// Best practice: Use strict equality for checking
if (value === undefined) {
    // Handle undefined
}

if (value === null) {
    // Handle null
}

// Check for both null and undefined
if (value == null) {
    // Handles both null and undefined
}

// Or more explicitly
if (value === null || value === undefined) {
    // Handles both null and undefined
}
```

### Pitfall 2: Reassigning `undefined` 😱

```javascript
// In old JavaScript (ES3), undefined could be reassigned!
// undefined = "not undefined anymore"; // DON'T DO THIS (won't work in modern JS)

// Safe way to get true undefined
const trueUndefined = void 0;
const alsoUndefined = (function() { return; })();

// Modern approach
const myUndefined = (() => {})();
```

### Pitfall 3: Default Parameter Gotchas 🎭

```javascript
function greet(name = "Anonymous") {
    console.log(`Hello, ${name}!`);
}

greet();            // "Hello, Anonymous!"
greet(undefined);   // "Hello, Anonymous!" (undefined triggers default)
greet(null);        // "Hello, null!" (null doesn't trigger default)
greet("");          // "Hello, !" (empty string doesn't trigger default)
greet(0);           // "Hello, 0!" (0 doesn't trigger default)

// Only undefined triggers default parameters
function betterGreet(name) {
    if (name === undefined) {
        name = "Anonymous";
    }
    console.log(`Hello, ${name}!`);
}
```

## Interview Questions & Debugging Scenarios 🎯

### Q1: What's the output?
```javascript
var a;
console.log(a);           // ?
console.log(typeof a);    // ?
console.log(a === undefined); // ?

// console.log(b);        // ?
console.log(typeof b);    // ?
```

**Answer**: `undefined`, `"undefined"`, `true`, `"undefined"` (typeof safely returns "undefined" for undeclared variables)

### Q2: Spot the bug!
```javascript
function processUsers(users) {
    for (let i = 0; i < users.length; i++) {
        console.log(users[i].name.toUpperCase());
    }
}

const userList = [
    { name: "Alice" },
    { name: "Bob" },
    { name: undefined }, // Bug!
    { email: "charlie@example.com" } // Bug!
];

// processUsers(userList); // Will throw errors
```

**Solution**:
```javascript
function processUsersSafe(users) {
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        if (user && typeof user.name === 'string') {
            console.log(user.name.toUpperCase());
        } else {
            console.log('Invalid user name');
        }
    }
}
```

### Q3: What's happening here?
```javascript
function mysterious() {
    console.log("Before hoisting:", x);
    var x = 5;
    console.log("After assignment:", x);
}

mysterious();
```

**Answer**: Outputs `undefined` then `5`. The `var x` declaration is hoisted to the top but the assignment stays in place.

## Best Practices Summary 📋

### 1. Variable Declaration ✅
```javascript
// Good: Always initialize variables
let userName = "";
let userAge = 0;
let isActive = false;

// Avoid: Leaving variables undefined
let userName; // undefined until assigned
```

### 2. Function Parameters ✅
```javascript
// Good: Use default parameters
function createUser(name = "", age = 0, email = "") {
    return { name, age, email };
}

// Good: Validate parameters
function processUser(user) {
    if (!user || typeof user !== 'object') {
        throw new Error('Invalid user object');
    }
    // Process user...
}
```

### 3. Property Access ✅
```javascript
// Good: Use optional chaining
const theme = user.settings?.ui?.theme ?? 'light';

// Good: Check before accessing
if (user.settings && user.settings.ui) {
    const theme = user.settings.ui.theme;
}

// Good: Use destructuring with defaults
const { settings = {} } = user;
const { ui = {} } = settings;
const { theme = 'light' } = ui;
```

### 4. Type Checking ✅
```javascript
// Good: Explicit checks
if (value === undefined) { /* handle undefined */ }
if (value === null) { /* handle null */ }

// Good: Check for both
if (value == null) { /* handle null or undefined */ }

// Good: Safe typeof check
if (typeof value !== 'undefined') { /* value exists */ }
```

## Summary

### `undefined`
- **A primitive value** representing uninitialized variables
- **Returned by functions** with no explicit return
- **Default value** for missing object properties and array elements
- **Falsy value** but not equal to other falsy values except `null` (loose equality)
- **Result of hoisting** for `var` declarations

### "not defined"
- **An error state** (ReferenceError) when accessing undeclared variables
- **Occurs at runtime** when JavaScript can't resolve an identifier
- **Different from undefined** - it's an error, not a value
- **Can be caught** with try-catch blocks
- **Safely detected** with `typeof` in non-strict mode

### Key Differences
- **undefined**: Variable exists but has no value
- **not defined**: Variable doesn't exist in any scope
- **undefined**: Can be assigned and compared
- **not defined**: Throws ReferenceError when accessed
- **undefined**: Result of hoisting and default behavior
- **not defined**: Result of typos or missing declarations

### My Personal Insight
The undefined vs "not defined" distinction was initially confusing because they both represent "nothingness," but understanding that one is a value and the other is an error changed everything. It's like the difference between an empty box (undefined) and no box at all (not defined).

The key insight is that JavaScript is very specific about these states – undefined means "I know about this thing, but it's empty," while "not defined" means "I've never heard of this thing." This distinction is crucial for debugging and understanding how JavaScript's execution context works.

### Next Up
Now that you understand the difference between undefined and "not defined," we'll dive into **Closures** – JavaScript's superpower that allows functions to remember their environment even after their parent scope has finished executing.

Remember: undefined is a value, "not defined" is an error state! 🎯
