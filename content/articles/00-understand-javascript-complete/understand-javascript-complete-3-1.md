---
title: Objects and this keyword
description: Learn JavaScript objects comprehensively, including declaration, access methods, symbols, freezing objects, and interview tips in this detailed guide.
slidesUrl: https://github.com/AherRahul/portfolio-v1/blob/main/content/articles
dateModified: 2026-01-29
datePublished: 2026-09-25
showOnArticles: false
courseName: 00-understand-javascript-complete
topics:
  - javascript
resources:
  - title: JS course PDF - 9
    type: PDF
    url: https://res.cloudinary.com/duojkrgue/image/upload/v1758792130/Portfolio/javaScriptCourse/pdf/JavaScript-day9_Objects_compressed.pdf
    description: A PDF Notes on Objects and this keyword topic
  - title: MDN - Working with Objects
    type: documentation
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_Objects
    description: Comprehensive guide to JavaScript objects from MDN
  - title: MDN - this keyword
    type: documentation
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this
    description: Complete reference for the this keyword in JavaScript
  - title: JavaScript.info - Objects
    type: article
    url: https://javascript.info/object
    description: Detailed tutorial on JavaScript objects with practical examples
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758811615/Portfolio/javaScriptCourse/images/all%20title%20images/10_ng3jhr.png)

## Understanding JavaScript Objects: A Complete Guide

JavaScript is a versatile and widely-used programming language, and mastering objects is crucial for any developer aiming to excel in it. Objects form the core of JavaScript programming, enabling developers to store complex data and functionalities efficiently. In this guide, we will explore JavaScript objects in detail — from declaration methods to accessing properties, using symbols, freezing objects, and common interview questions related to objects.

## 1. Introduction to JavaScript Objects

Objects in JavaScript are collections of key-value pairs, where keys are strings or symbols and values can be any data type, including functions or other objects. Objects allow you to group related data and functionalities together, making your code more modular and manageable.

In JavaScript, understanding objects thoroughly is essential because they form the foundation of many programming patterns and are heavily used in real-world applications.

## 2. Declaring Objects in JavaScript

There are primarily two ways to declare objects in JavaScript:

#### Object Literals

This is the simplest and most common method to create objects. You define an object using curly braces `{}` and list key-value pairs inside.

```javascript
const user = {
  name: "Rahul",
  team: "JS User",
  location: "Jaipur",
  email: "rahul@example.com"
};
```

#### Constructor Method

Objects can also be created using constructors such as the `Object()` constructor or custom constructor functions. When using constructors, each call creates a new instance, unlike literal objects which are singletons.

```javascript
const user = new Object();
user.name = "Rahul";
user.team = "JS User";
```

#### Singleton Concept

When using object literals, the object is a singleton, meaning only one instance exists. However, constructor methods can create multiple instances. Understanding this distinction is important, especially in interview scenarios.

## 3. Accessing Object Properties

JavaScript provides two main methods to access properties of objects:

### Dot Notation

This is the most straightforward way to access object properties.

```javascript
console.log(user.name); // Outputs: Rahul
```

### Bracket Notation

Bracket notation is more flexible and necessary in certain cases, such as when property names have spaces or special characters, or when accessing properties dynamically.

```javascript
console.log(user["email"]); // Outputs: rahul@example.com
```

Bracket notation also allows accessing properties with names that are not valid identifiers, such as `"full name"`:

```javascript
const user = {
  "full name": "Rahul Chaudhary"
};
console.log(user["full name"]); // Correct way to access
```

### When to Use Which?

Most of the time, dot notation is preferred for its simplicity. However, if property names contain spaces, symbols, or reserved words, or if you need dynamic access, bracket notation is mandatory.

## 4. Using Symbols as Object Keys

Symbols are a unique and immutable primitive data type introduced in ES6. They act as unique keys for object properties, avoiding property name collisions.

### Declaring Symbols

```javascript
const sym1 = Symbol("id");
const sym2 = Symbol("id"); // Even with the same description, sym1 !== sym2
```

### Using Symbols as Keys

Symbols can be used as keys in objects, but they must be accessed using bracket notation:

```javascript
const user = {
  [sym1]: 101
};

console.log(user[sym1]); // Outputs: 101
```

Dot notation will not work with symbols because symbols are not strings.

### Why Use Symbols?

- To create unique property keys that won't collide with other keys.
- Useful in libraries and frameworks to add metadata or hidden properties.

### Interview Tip

Being able to declare and use symbols in objects is often a point of discussion in JavaScript interviews. It’s important to know that symbols require bracket notation for access and assignment.

## 5. Freezing Objects to Lock Values

Sometimes, it’s necessary to prevent modification of an object’s properties to ensure data integrity. JavaScript provides the `Object.freeze()` method for this purpose.

### How to Freeze an Object

```javascript
Object.freeze(user);
```

After freezing, any attempt to change, add, or delete properties will silently fail (in non-strict mode) or throw errors (in strict mode).

### Practical Example

```javascript
Object.freeze(user);
user.email = "newemail@example.com"; // This will not change the email
console.log(user.email); // Outputs: rahul@example.com
```

Freezing is useful when you want to create immutable objects, especially in large applications or libraries.

## 6. Adding Functions (Methods) Inside Objects

Objects can contain functions, called methods, which allow you to define behaviors related to the object.

### Defining Methods in Objects

```javascript
const user = {
  name: "Rahul",
  greet: function() {
    console.log("Hello " + this.name);
  }
};

user.greet(); // Outputs: Hello Rahul
```

### Using Template Literals for Dynamic Values

You can enhance greetings using ES6 template literals for cleaner syntax:

```javascript
const user = {
  name: "Rahul",
  greet() {
    console.log(`Hello ${this.name}`);
  }
};

user.greet(); // Outputs: Hello Rahul
```

### Important Note on `this`

Inside methods, `this` refers to the object itself, enabling access to other properties.

## 7. Common Interview Tips and Best Practices

**1. Always Know Both Access Methods:** Understand when to use dot notation and when to use bracket notation. Remember bracket notation is essential for keys with spaces, special characters, or symbols.

**2. Know How to Work with Symbols:** Symbols are less common but important for advanced JavaScript usage. Know how to declare them and access symbol-keyed properties.

**3. Understand Object Immutability:** Freezing objects using `Object.freeze()` is a common interview question. Be prepared to explain how it works and demonstrate usage.

**4. Methods Inside Objects:** Be ready to add functions inside objects and explain how `this` works within methods.

**5. Debugging Tips:** If you get `undefined` or errors while accessing properties, check if you are using the right notation and if the property exists.

## 8. Summary

Mastering JavaScript objects is vital for becoming an effective JavaScript developer. This guide covered:

- How to declare objects using literals and constructors.
- The difference between singletons and multiple instances.
- Accessing properties using dot and bracket notations.
- Utilizing Symbols as unique keys and how to work with them.
- Freezing objects to prevent changes.
- Adding and using methods within objects.
- Common interview questions and best practices.

By practicing these concepts and experimenting with your own objects, you will gain confidence and be well-prepared for both practical programming and technical interviews.


If you found this guide helpful, share it with your peers and keep exploring more advanced JavaScript concepts. Stay tuned for further tutorials on JavaScript events, asynchronous programming, and more!