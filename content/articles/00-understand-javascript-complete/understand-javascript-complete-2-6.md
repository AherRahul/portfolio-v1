---
title: Datatypes and ECMA standards
description: Learn the essentials of JavaScript data types, strict mode, and
  best coding practices to become a proficient coder. Master JS basics with
  practical tips and examples.
datePublished: 2026-02-21
dateModified: 2026-02-21
topics:
  - javascript
courseName: 00-understand-javascript-complete
showOnArticles: false
featured: false
published: true
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758725512/Portfolio/javaScriptCourse/images/0_eestcm.png)


# Introduction to JavaScript Data Types and Best Practices  

JavaScript is a versatile programming language that has evolved significantly over the years. In this blog post, we dive deep into the fundamentals of JavaScript data types, strict mode usage, and key coding best practices that every developer should know. Whether you are a beginner or looking to refresh your knowledge, this guide will provide practical insights and tips to improve your coding skills and understanding of JavaScript’s core concepts.  

## Understanding the Evolution of JavaScript  

JavaScript has come a long way from its early days. Earlier versions lacked features like classes, modules, and arrow functions, which are now standard. To maintain backward compatibility while encouraging modern coding standards, JavaScript introduced the concept of “strict mode.” By enabling strict mode in your scripts, you tell the JavaScript engine to treat your code as if it’s running in a newer, stricter environment, helping catch errors early and enforce good practices.  

### What is Strict Mode?  

Strict mode is activated by including the statement `"use strict";` at the beginning of your JavaScript file or function. This mode enforces a stricter parsing and error handling of your code, preventing the use of certain problematic syntax and behaviors. Modern JavaScript engines automatically run code in strict mode, but explicitly declaring it is still a good practice to ensure consistency.  

#### Benefits of Using Strict Mode  

- Prevents accidental global variable declarations.  
- Throws errors for unsafe actions such as deleting undeletable properties.  
- Disallows duplicate parameter names in functions.  
- Helps in writing more secure and optimized code.  

## Common JavaScript Data Types  

JavaScript has a handful of primitive data types and one major complex type, the object. Understanding these is crucial for writing effective code.  

### Primitive Data Types  

#### 1. Number  
Numbers in JavaScript represent both integer and floating-point values. They have a specific range governed by the IEEE 754 double-precision format, which can safely represent integers up to approximately 2^53. For extremely large numbers, JavaScript provides the `BigInt` type.  

Example:  
```js
let age = 18;  // Number  
let price = 99.99;  
```

#### 2. String  
Strings are sequences of characters enclosed in single or double quotes. They represent text data.  

Example:  
```js
let name = "Hitesh";  
```

#### 3. Boolean  
Booleans represent logical values `true` or `false`. They are essential for conditions and controlling program flow.  

Example:  
```js
let isLoggedIn = true;  
```

#### 4. Null  
`null` is a special standalone value that represents intentional absence of any object value. It’s used to indicate "no value" or "empty".  

#### 5. Undefined  
`undefined` means a variable has been declared but not yet assigned a value. It’s important to distinguish between `undefined` and `null`.  

#### 6. Symbol  
Symbols are unique and immutable identifiers, often used for object property keys to avoid naming conflicts. They are especially useful in frameworks like React for unique component identification.  

### Non-Primitive Data Type  

#### Object  
Objects are collections of key-value pairs and are essential for storing complex data and building structures like arrays, functions, and custom data types. Objects will be covered in detail in future posts.  

## JavaScript Coding Best Practices  

### Avoid Excessive Use of Alerts  

While `alert()` can display messages, it is rarely used in production due to its intrusive nature. It’s mostly helpful for beginners to understand simple outputs but should be replaced with console logs or UI elements in real applications.  

### Use Semicolons Consistently  

JavaScript does not strictly require semicolons because of automatic semicolon insertion, but omitting them can cause unexpected bugs. For readability and maintainability, always use semicolons to end your statements.  

Example:  
```js
console.log("Hello");  // Good practice  
console.log("World")   // Avoid this style  
```

### Prioritize Code Readability  

Readable code is easy to understand, debug, and extend. Use proper indentation, spacing, and line breaks. Avoid cramming multiple statements on one line or using unclear variable names. Tools like Prettier or EditorConfig can help maintain consistent formatting.  

### Practice Writing Code Regularly  

The best way to learn JavaScript is by writing code on your keyboard, not just reading or copying from paper. Practice by building small projects, solving problems, and experimenting with features you learn.  

## Exploring JavaScript Type Checking with `typeof`  

JavaScript provides the `typeof` operator to check the data type of a variable or value. It returns a string indicating the type, such as `"string"`, `"number"`, `"boolean"`, `"undefined"`, or `"object"`.  

Example:  
```js
let name = "Hitesh";  
console.log(typeof name);  // Output: string  

let age = 18;  
console.log(typeof age);   // Output: number  

let user = null;  
console.log(typeof user);  // Output: object (quirk of JS)  

let notAssigned;  
console.log(typeof notAssigned);  // Output: undefined  
```

#### Understanding the `typeof null` Quirk  

Interestingly, `typeof null` returns `"object"`, which is a well-known JavaScript peculiarity. This is due to legacy reasons in the language design but can cause confusion and bugs if not understood properly.  

## Importance of Official Documentation  

For accurate and up-to-date information, always rely on official documentation such as:  

- [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript) — user-friendly and comprehensive guides.  
- [ECMAScript Specification (TC39)](https://tc39.es/ecma262/) — the official language standard defining JavaScript behavior.  

Understanding these resources helps grasp language features, standards, and best practices deeply.  

## Summary  

In this post, we covered:  

- The significance of strict mode in modern JavaScript development.  
- Core JavaScript data types including Number, String, Boolean, Null, Undefined, Symbol, and Objects.  
- Coding best practices such as consistent semicolon usage, prioritizing readability, and avoiding outdated methods like excessive alerts.  
- How to use the `typeof` operator for type checking and the peculiarities of JavaScript types.  
- The importance of relying on official documentation like MDN and ECMAScript standards.  

Mastering these fundamentals lays a solid foundation for advanced JavaScript concepts and real-world application development.  

## Assignment for Readers  

Try writing simple JavaScript code snippets using different data types discussed here. Use strict mode and observe how errors are caught. Experiment with `typeof` on various values and note the outputs. Explore MDN documentation for any doubts or to deepen your understanding.  

## Closing Note  

JavaScript is a powerful language with a relatively simple core but many interesting quirks and features. Consistent practice and referring to official standards will help you become an efficient JavaScript developer. Stay tuned for more detailed explorations of objects, functions, and advanced topics in upcoming posts.  

Happy coding!