---
title: Closures in JavaScript
description: Closures are JavaScript's superpower - they allow functions to
  remember variables from their outer scope even after that scope has finished
  executing. This concept is fundamental to understanding advanced JavaScript
  patterns and is a favorite interview topic.
slidesUrl: https://github.com/AherRahul/portfolio-v1/blob/main/content/articles
dateModified: 2026-02-21
datePublished: 2026-02-21
showOnArticles: false
courseName: 00-understand-javascript-complete
topics:
  - javascript
resources:
  - title: JS course PDF - 14
    type: PDF
    url: https://res.cloudinary.com/duojkrgue/image/upload/v1758792130/Portfolio/javaScriptCourse/pdf/JavaScript-day14_Closures_compressed.pdf
    description: A PDF Notes on Closures in JavaScript topic
  - title: MDN - Closures
    type: documentation
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
    description: Complete guide to JavaScript closures from MDN
  - title: JavaScript.info - Closure
    type: article
    url: https://javascript.info/closure
    description: In-depth tutorial on closures with practical examples
  - title: You Don't Know JS - Closures
    type: book
    url: https://github.com/getify/You-Dont-Know-JS/blob/2nd-ed/scope-closures/ch7.md
    description: Deep dive into closures from the You Don't Know JS series
published: false
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758811616/Portfolio/javaScriptCourse/images/all%20title%20images/15_fpg92y.png)

Closures in JavaScript – Functions with Photographic Memory
==========================================================

Imagine you're a **secret agent** 🕵️‍♂️ who has been trained in a special facility. Even after you leave the facility and go on missions around the world, you still remember:

- **The secret codes** you learned during training
- **The special techniques** your instructor taught you
- **The classified information** from your briefings
- **The relationships** you built with other agents

This ability to **remember your training environment** even when you're operating in completely different locations is exactly how **closures** work in JavaScript!

A closure is a function that **remembers and has access to variables from its outer (enclosing) scope** even after the outer function has finished executing. It's like the function has a **photographic memory** of where it came from.

## What is a Closure? 🧠

A **closure** is one of JavaScript's most powerful and unique features. At its core, a closure is **the combination of a function and the lexical environment in which that function was declared**. 

Think of it this way: when you create a function inside another function, the inner function doesn't just contain its own code - it also **"closes over"** (captures) the environment where it was created, including any variables from its parent scope.

### The Conceptual Foundation 📚

**Why do closures exist?** In most programming languages, when a function finishes executing, all its local variables are destroyed. JavaScript is different - if an inner function is returned or passed elsewhere, JavaScript keeps the outer function's variables alive because the inner function might still need them.

**The Key Insight:** Closures allow functions to have **persistent, private state**. The outer function acts like a factory that creates functions with built-in memory.

### Simple Closure Example 📸

Let's start with the simplest possible closure to understand the concept:

```javascript
function outerFunction(x) {
    // This variable belongs to outerFunction's scope
    const outerVariable = x;
    
    // This inner function "closes over" outerVariable
    function innerFunction(y) {
        console.log(outerVariable + y); // Can access outerVariable!
    }
    
    return innerFunction;
}

// Step 1: Call outerFunction and store the returned function
const myClosure = outerFunction(10);

// Step 2: outerFunction has finished executing, but...
// Step 3: innerFunction still remembers outerVariable = 10!
myClosure(5); // Outputs: 15
```

**What's happening here?**
1. `outerFunction(10)` executes and creates `outerVariable = 10`
2. `innerFunction` is created inside `outerFunction`
3. `innerFunction` forms a closure over `outerVariable`
4. `outerFunction` returns `innerFunction` and finishes executing
5. Normally, `outerVariable` would be destroyed, but the closure keeps it alive
6. When we call `myClosure(5)`, it still has access to `outerVariable = 10`

### What Makes This Special? ✨

The key difference between closures and normal functions lies in **variable lifetime**. Let me explain this fundamental concept:

**Normal Function Behavior:**
In a typical function, local variables are created when the function starts and destroyed when it ends. This is called **automatic memory management**.

**Closure Behavior:**
When a closure is involved, JavaScript says: "Wait! This inner function might need these variables later, so I'll keep them alive even after the outer function is done."

```javascript
// Example 1: Normal function execution - variables are destroyed
function normalFunction() {
    let localVar = "I'll be destroyed";
    console.log(localVar);
} // When this function ends, localVar is destroyed

normalFunction(); // Output: "I'll be destroyed"
// After this point, localVar no longer exists in memory

// Example 2: Closure - variables are preserved!
function createClosure() {
    let preservedVar = "I'll survive!";
    
    // This returned function forms a closure
    return function() {
        console.log(preservedVar); // Still accessible!
    };
}

const closure = createClosure();
// At this point, createClosure has finished executing
// BUT preservedVar is still alive because closure needs it!
closure(); // Output: "I'll survive!"
```

**The Conceptual Difference:**
- **Without closures:** Variables die when their function ends
- **With closures:** Variables stay alive as long as any function still references them

This is why closures are so powerful - they give functions **persistent memory** that survives beyond their creation context.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758816678/Portfolio/javaScriptCourse/images/14/closure_memory.png)

## How Closures Work Under the Hood 🔧

To truly understand closures, we need to grasp how JavaScript manages **scope chains** and **lexical environments**. This is where the magic happens.

### The Scope Chain and Lexical Environment 🔗

**Conceptual Understanding:**
When you nest functions inside other functions, JavaScript creates a **scope chain** - like a series of connected rooms where each inner room can see into all the outer rooms, but not vice versa.

**Lexical Environment:** Each function carries a "snapshot" of all the variables it can access. This snapshot is called its lexical environment.

**The Scope Chain Rule:** Inner functions can access variables from their outer functions, but outer functions cannot access variables from inner functions.

Let's see this in action with a three-level nesting example:

```javascript
function grandparent() {
    const grandparentVar = "I'm the grandparent";
    
    function parent() {
        const parentVar = "I'm the parent";
        
        function child() {
            const childVar = "I'm the child";
            
            // The child can access ALL three levels:
            console.log(childVar);       // "I'm the child" (own scope)
            console.log(parentVar);      // "I'm the parent" (parent scope)
            console.log(grandparentVar); // "I'm the grandparent" (grandparent scope)
        }
        
        return child; // Return the child function
    }
    
    return parent(); // Call parent and return its result (the child function)
}

const closureFunction = grandparent();
closureFunction();
```

**What's remarkable here:**
1. When `grandparent()` finishes, normally `grandparentVar` would be destroyed
2. When `parent()` finishes, normally `parentVar` would be destroyed  
3. But because `child` function still references both variables, JavaScript keeps them alive
4. The `child` function carries the entire scope chain with it as a closure

**Mental Model:** Think of the `child` function as carrying three backpacks:
- **Backpack 1:** Its own variables (`childVar`)
- **Backpack 2:** Parent's variables (`parentVar`) 
- **Backpack 3:** Grandparent's variables (`grandparentVar`)

Even when the child leaves home (gets returned from the functions), it still carries all three backpacks!

### Memory Perspective 💾

```javascript
function createMultipleClosures() {
    const sharedVariable = "Shared by all closures";
    let counter = 0;
    
    return {
        increment: function() {
            counter++;
            console.log(`${sharedVariable}: ${counter}`);
        },
        
        decrement: function() {
            counter--;
            console.log(`${sharedVariable}: ${counter}`);
        },
        
        getValue: function() {
            return counter;
        }
    };
}

const closures = createMultipleClosures();
closures.increment(); // "Shared by all closures: 1"
closures.increment(); // "Shared by all closures: 2"
closures.decrement(); // "Shared by all closures: 1"

// All three functions share the same lexical environment!
console.log(closures.getValue()); // 1
```

## Practical Closure Patterns 🛠️

### 1. Data Privacy and Encapsulation 🔒

```javascript
// Module Pattern - Creating private variables
function createBankAccount(initialBalance) {
    // Private variables
    let balance = initialBalance;
    let transactions = [];
    
    // Private function
    function addTransaction(type, amount) {
        transactions.push({
            type,
            amount,
            date: new Date(),
            balance: balance
        });
    }
    
    // Public API (closures)
    return {
        deposit(amount) {
            if (amount > 0) {
                balance += amount;
                addTransaction('deposit', amount);
                return `Deposited $${amount}. New balance: $${balance}`;
            }
            return 'Invalid amount';
        },
        
        withdraw(amount) {
            if (amount > 0 && amount <= balance) {
                balance -= amount;
                addTransaction('withdrawal', amount);
                return `Withdrew $${amount}. New balance: $${balance}`;
            }
            return 'Invalid amount or insufficient funds';
        },
        
        getBalance() {
            return balance;
        },
        
        getTransactions() {
            return [...transactions]; // Return copy to prevent external modification
        }
    };
}

const account = createBankAccount(1000);

console.log(account.deposit(500));   // "Deposited $500. New balance: $1500"
console.log(account.withdraw(200));  // "Withdrew $200. New balance: $1300"
console.log(account.getBalance());   // 1300

// Private variables are not accessible from outside
console.log(account.balance);        // undefined
console.log(account.transactions);   // undefined

// Each account has its own private state
const account2 = createBankAccount(500);
console.log(account2.getBalance());  // 500 (independent of account1)
```

### 2. Function Factories 🏭

```javascript
// Creating specialized functions using closures
function createMultiplier(multiplier) {
    return function(number) {
        return number * multiplier;
    };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);
const quadruple = createMultiplier(4);

console.log(double(5));     // 10
console.log(triple(5));     // 15
console.log(quadruple(5));  // 20

// More complex function factory
function createValidator(validationType) {
    const validators = {
        email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        phone: (value) => /^\+?[\d\s\-\(\)]+$/.test(value),
        zipCode: (value) => /^\d{5}(-\d{4})?$/.test(value)
    };
    
    const validator = validators[validationType];
    
    return function(value) {
        if (!validator) {
            throw new Error(`Unknown validation type: ${validationType}`);
        }
        
        return {
            isValid: validator(value),
            type: validationType,
            value: value
        };
    };
}

const emailValidator = createValidator('email');
const phoneValidator = createValidator('phone');

console.log(emailValidator('user@example.com')); // { isValid: true, type: 'email', value: 'user@example.com' }
console.log(phoneValidator('123-456-7890'));     // { isValid: true, type: 'phone', value: '123-456-7890' }
```

### 3. Event Handlers and Callbacks 📞

```javascript
// Closure in event handlers
function setupButtons() {
    const buttons = document.querySelectorAll('.action-button');
    
    buttons.forEach((button, index) => {
        // Each button remembers its own index
        button.addEventListener('click', function() {
            console.log(`Button ${index} was clicked!`);
            // The closure remembers the specific index for this button
        });
    });
}

// Another example: Creating custom event handlers
function createClickHandler(message, count = 0) {
    return function(event) {
        count++; // Each handler has its own count
        console.log(`${message} (clicked ${count} times)`);
        
        if (count >= 5) {
            event.target.removeEventListener('click', arguments.callee);
            console.log('Event listener removed after 5 clicks');
        }
    };
}

// Usage
const button1 = document.createElement('button');
const button2 = document.createElement('button');

button1.addEventListener('click', createClickHandler('Button 1 clicked'));
button2.addEventListener('click', createClickHandler('Button 2 clicked'));
```

### 4. Memoization (Caching) 💾

```javascript
// Using closures for caching expensive computations
function createMemoizedFunction(fn) {
    const cache = {}; // Private cache
    
    return function(...args) {
        const key = JSON.stringify(args);
        
        if (key in cache) {
            console.log('Cache hit!');
            return cache[key];
        }
        
        console.log('Computing...');
        const result = fn.apply(this, args);
        cache[key] = result;
        
        return result;
    };
}

// Expensive function to memoize
function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

const memoizedFibonacci = createMemoizedFunction(fibonacci);

console.log(memoizedFibonacci(10)); // Computing... 55
console.log(memoizedFibonacci(10)); // Cache hit! 55
console.log(memoizedFibonacci(11)); // Computing... 89 (partial cache hit)
```

## Closure Gotchas and Common Mistakes ⚠️

### 1. The Classic Loop Problem 🔄

```javascript
// The problem: All buttons alert the same number
function createButtonsProblem() {
    for (var i = 0; i < 3; i++) {
        const button = document.createElement('button');
        button.textContent = `Button ${i}`;
        
        button.addEventListener('click', function() {
            alert(`Button ${i} clicked`); // Always alerts "Button 3 clicked"
        });
        
        document.body.appendChild(button);
    }
}

// Why this happens:
// All event handlers share the same lexical environment
// and reference the same variable 'i'
// By the time any button is clicked, the loop has finished and i = 3

// Solution 1: Use let instead of var (block scope)
function createButtonsSolution1() {
    for (let i = 0; i < 3; i++) { // let creates new scope for each iteration
        const button = document.createElement('button');
        button.textContent = `Button ${i}`;
        
        button.addEventListener('click', function() {
            alert(`Button ${i} clicked`); // Each closure has its own 'i'
        });
        
        document.body.appendChild(button);
    }
}

// Solution 2: IIFE (Immediately Invoked Function Expression)
function createButtonsSolution2() {
    for (var i = 0; i < 3; i++) {
        const button = document.createElement('button');
        button.textContent = `Button ${i}`;
        
        (function(index) { // IIFE creates new scope
            button.addEventListener('click', function() {
                alert(`Button ${index} clicked`); // Each closure has its own 'index'
            });
        })(i);
        
        document.body.appendChild(button);
    }
}

// Solution 3: bind method
function createButtonsSolution3() {
    for (var i = 0; i < 3; i++) {
        const button = document.createElement('button');
        button.textContent = `Button ${i}`;
        
        button.addEventListener('click', function(index) {
            alert(`Button ${index} clicked`);
        }.bind(null, i));
        
        document.body.appendChild(button);
    }
}
```

### 2. Memory Leaks with Closures 💧

```javascript
// Potential memory leak
function createLeakyFunction() {
    const largeData = new Array(1000000).fill('data'); // Large array
    
    return function smallFunction() {
        return 'I only need to do something small';
        // But I keep the entire largeData alive!
    };
}

// Better approach: Clean up unnecessary references
function createCleanFunction() {
    const largeData = new Array(1000000).fill('data');
    const smallPieceOfData = largeData[0]; // Extract only what we need
    
    return function smallFunction() {
        return `I only keep what I need: ${smallPieceOfData}`;
        // largeData can be garbage collected
    };
}

// Example: DOM element leak
function createDOMHandler() {
    const element = document.getElementById('myElement');
    const data = element.dataset;
    
    // This creates a reference cycle
    element.onclick = function() {
        console.log(data); // Closure keeps reference to element
    };
    
    // Better: Remove reference when done
    return function cleanup() {
        element.onclick = null; // Break the cycle
    };
}
```

### 3. Shared State Confusion 🤝

```javascript
// Problem: Shared state between closures
function createCounters() {
    let count = 0; // Shared between all returned functions
    
    return {
        increment: () => ++count,
        decrement: () => --count,
        getValue: () => count
    };
}

const counter1 = createCounters();
const counter2 = createCounters();

counter1.increment(); // 1
counter2.increment(); // 1 (independent counters - this is correct)

console.log(counter1.getValue()); // 1
console.log(counter2.getValue()); // 1

// But this might be confusing:
function createSharedCounters() {
    let count = 0; // This will be shared!
    
    function createCounter() {
        return {
            increment: () => ++count,
            decrement: () => --count,
            getValue: () => count
        };
    }
    
    return {
        newCounter: createCounter
    };
}

const factory = createSharedCounters();
const sharedCounter1 = factory.newCounter();
const sharedCounter2 = factory.newCounter();

sharedCounter1.increment(); // 1
sharedCounter2.increment(); // 2 (shared state!)

console.log(sharedCounter1.getValue()); // 2
console.log(sharedCounter2.getValue()); // 2
```

## Advanced Closure Patterns 🚀

### 1. Currying with Closures 🍛

```javascript
// Currying: Transform function(a, b, c) into function(a)(b)(c)
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        } else {
            return function(...nextArgs) {
                return curried.apply(this, args.concat(nextArgs));
            };
        }
    };
}

// Example usage
function add(a, b, c) {
    return a + b + c;
}

const curriedAdd = curry(add);

console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6

// Practical example: Creating specialized functions
const addTax = curry((taxRate, price) => price * (1 + taxRate));
const addSalesTax = addTax(0.08); // 8% sales tax
const addLuxuryTax = addTax(0.15); // 15% luxury tax

console.log(addSalesTax(100)); // 108
console.log(addLuxuryTax(100)); // 115
```

### 2. Partial Application 🧩

```javascript
// Partial application: Pre-fill some arguments
function partial(fn, ...presetArgs) {
    return function(...laterArgs) {
        return fn(...presetArgs, ...laterArgs);
    };
}

// Example: Creating specialized loggers
function log(level, category, message) {
    console.log(`[${level}] ${category}: ${message}`);
}

const logError = partial(log, 'ERROR');
const logErrorAuth = partial(log, 'ERROR', 'AUTH');

logError('DATABASE', 'Connection failed');        // [ERROR] DATABASE: Connection failed
logErrorAuth('Invalid credentials');              // [ERROR] AUTH: Invalid credentials

// Another example: API calls with preset configurations
function makeAPICall(method, baseURL, endpoint, data) {
    return fetch(`${baseURL}${endpoint}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined
    });
}

const apiGet = partial(makeAPICall, 'GET', 'https://api.example.com');
const apiPost = partial(makeAPICall, 'POST', 'https://api.example.com');

// Usage
apiGet('/users').then(response => response.json());
apiPost('/users', { name: 'Alice', email: 'alice@example.com' });
```

### 3. Function Composition 🎼

```javascript
// Function composition using closures
function compose(...functions) {
    return function(initialValue) {
        return functions.reduceRight((acc, fn) => fn(acc), initialValue);
    };
}

function pipe(...functions) {
    return function(initialValue) {
        return functions.reduce((acc, fn) => fn(acc), initialValue);
    };
}

// Example functions
const add5 = x => x + 5;
const multiply3 = x => x * 3;
const subtract2 = x => x - 2;

// Composition (right to left)
const composedFunction = compose(subtract2, multiply3, add5);
console.log(composedFunction(10)); // ((10 + 5) * 3) - 2 = 43

// Pipe (left to right)
const pipedFunction = pipe(add5, multiply3, subtract2);
console.log(pipedFunction(10)); // ((10 + 5) * 3) - 2 = 43

// Real-world example: Data processing pipeline
const processUserData = pipe(
    user => ({ ...user, email: user.email.toLowerCase() }),
    user => ({ ...user, name: user.name.trim() }),
    user => ({ ...user, isValid: user.email.includes('@') && user.name.length > 0 })
);

const user = { name: '  Alice  ', email: 'ALICE@EXAMPLE.COM' };
console.log(processUserData(user));
// { name: 'Alice', email: 'alice@example.com', isValid: true }
```

## Real-World Applications 🌎

### 1. Debouncing and Throttling 🎛️

```javascript
// Debouncing: Execute function only after it stops being called
function debounce(func, wait) {
    let timeout;
    
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Throttling: Execute function at most once per time period
function throttle(func, limit) {
    let inThrottle;
    
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Usage
const expensiveOperation = (query) => {
    console.log(`Searching for: ${query}`);
    // Expensive API call here
};

const debouncedSearch = debounce(expensiveOperation, 300);
const throttledScroll = throttle(() => console.log('Scrolling...'), 100);

// Event listeners
document.getElementById('searchInput')?.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
});

window.addEventListener('scroll', throttledScroll);
```

### 2. State Management 📊

```javascript
// Simple state manager using closures
function createStore(initialState) {
    let state = { ...initialState };
    const listeners = [];
    
    return {
        getState() {
            return { ...state }; // Return copy to prevent direct mutation
        },
        
        setState(newState) {
            const prevState = { ...state };
            state = { ...state, ...newState };
            
            // Notify all listeners
            listeners.forEach(listener => {
                listener(state, prevState);
            });
        },
        
        subscribe(listener) {
            listeners.push(listener);
            
            // Return unsubscribe function
            return function unsubscribe() {
                const index = listeners.indexOf(listener);
                if (index > -1) {
                    listeners.splice(index, 1);
                }
            };
        }
    };
}

// Usage
const store = createStore({ count: 0, user: null });

const unsubscribe = store.subscribe((newState, prevState) => {
    console.log('State changed:', { newState, prevState });
});

store.setState({ count: 1 }); // State changed: { newState: { count: 1, user: null }, prevState: { count: 0, user: null } }
store.setState({ user: 'Alice' }); // State changed: { newState: { count: 1, user: 'Alice' }, prevState: { count: 1, user: null } }

unsubscribe(); // Stop listening to changes
```

## Interview Questions & Challenges 🎯

### Q1: What will this code output?
```javascript
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i);
    }, 1000);
}
```
**Answer**: `3 3 3` (all functions share the same `i` variable)

### Q2: Fix the above code to output `0 1 2`:
```javascript
// Solution 1: Use let
for (let i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log(i);
    }, 1000);
}

// Solution 2: IIFE
for (var i = 0; i < 3; i++) {
    (function(j) {
        setTimeout(function() {
            console.log(j);
        }, 1000);
    })(i);
}

// Solution 3: bind
for (var i = 0; i < 3; i++) {
    setTimeout(function(index) {
        console.log(index);
    }.bind(null, i), 1000);
}
```

### Q3: Explain what happens here:
```javascript
function outer() {
    let count = 0;
    
    return function inner() {
        count++;
        console.log(count);
    };
}

const counter1 = outer();
const counter2 = outer();

counter1(); // ?
counter1(); // ?
counter2(); // ?
```
**Answer**: `1`, `2`, `1` - Each call to `outer()` creates a new lexical environment with its own `count` variable.

## Summary

### What are Closures?
- **Functions that remember** their lexical environment
- **Combination of function + outer scope** variables
- **Persist even after** outer function finishes
- **Enable data privacy** and encapsulation
- **Foundation for many** JavaScript patterns

### Key Benefits
- **Data Privacy**: Create private variables and methods
- **Function Factories**: Generate specialized functions
- **State Preservation**: Maintain state between function calls
- **Callbacks and Events**: Remember context in async operations
- **Module Patterns**: Create reusable, encapsulated code

### Common Pitfalls
- **Loop variable sharing**: Use `let` or IIFE to fix
- **Memory leaks**: Clean up unnecessary references
- **Shared state confusion**: Understand when variables are shared
- **Performance**: Don't create closures unnecessarily in loops

### Best Practices
- Use closures for data privacy and module patterns
- Prefer `let`/`const` over `var` to avoid scope issues
- Clean up references to prevent memory leaks
- Use closures for specialized function creation
- Understand the trade-offs between closure approaches

### My Personal Insight
Closures were the concept that made JavaScript feel truly magical to me. The idea that a function could "remember" its birthplace even when called from completely different contexts was mind-blowing.

The key insight is that closures aren't just a language feature – they're a fundamental part of how JavaScript works. Every function you write creates a closure, but closures become powerful when you use them intentionally for patterns like modules, factories, and state management.

Think of closures as functions with a built-in memory system – they never forget where they came from!

### Next Up
Now that you understand closures, we'll tackle the famous **setTimeout + Closures Interview Questions** – the classic problems that test your deep understanding of both concepts together.

Remember: Closures = Functions + Memory of their birthplace! 🧠✨
