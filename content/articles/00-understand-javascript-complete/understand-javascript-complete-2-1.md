---
title: let, const and var
description: Learn how to master JavaScript variables and constants with
  practical examples to build e-commerce and social media apps. Start coding
  smartly today!
slidesUrl: https://github.com/AherRahul/portfolio-v1/blob/main/content/articles
dateModified: 2026-02-21
datePublished: 2026-02-21
showOnArticles: false
courseName: 00-understand-javascript-complete
topics:
  - javascript
resources:
  - title: JS course PDF - 5
    type: PDF
    url: https://res.cloudinary.com/duojkrgue/image/upload/v1758792130/Portfolio/javaScriptCourse/pdf/JavaScript-day5_Variables_compressed.pdf
    description: A PDF Notes on Variables and Data Types topic
  - title: MDN - JavaScript Data Types
    type: documentation
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Data_structures
    description: Official MDN documentation on JavaScript data types and structures
  - title: MDN - var, let, const
    type: documentation
    url: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var
    description: Comprehensive guide to variable declarations in JavaScript
  - title: JavaScript.info - Data Types
    type: article
    url: https://javascript.info/types
    description: Detailed explanation of JavaScript data types with examples
published: true
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758725512/Portfolio/javaScriptCourse/images/0_eestcm.png)

# Introduction to JavaScript Variables and Constants

JavaScript is one of the most popular programming languages used for web development, mobile apps, and much more. Whether you want to build an e-commerce website like Flipkart, a social media platform, or a mobile app similar to Uber or Swiggy, mastering JavaScript fundamentals is essential. In this guide, we focus on understanding **variables** and **constants** in JavaScript, the building blocks for storing and managing data in your programs.

Before diving deep into coding, it's important to understand why you want to learn JavaScript. If your goal is merely to learn syntax for a job, you might find it challenging to stay motivated long-term. However, if you aim to build real projects—like websites or apps—you’re on the right path. This mindset is crucial for success in the software industry.

## Why Learn Variables and Constants in JavaScript?

Variables and constants serve as placeholders in your code where you store values such as user information, product details, or settings. When building any web application, you need to store data temporarily or permanently, and JavaScript variables are perfect for this.

For instance, when a user registers on your e-commerce site, you’ll want to capture their:
- Name
- Email
- City and state
- Unique user ID

This data needs to be stored in memory and later accessed or modified as necessary. Variables allow you to do this efficiently.

Constants, on the other hand, hold data that should not change during the program’s execution—like API keys or fixed configuration values. Using constants helps prevent accidental value changes, improving code reliability and security.

## Declaring Variables and Constants: Syntax and Best Practices

In JavaScript, you declare variables using keywords like `let` and `var`, and constants with `const`. However, modern JavaScript encourages using only `let` and `const` because of their better handling of scope and errors.

### Variable Declaration with let and var

- `let`: Used to declare variables whose values can change.
- `var`: An older way to declare variables but has issues with scope that can lead to bugs.

Example:
```javascript
let accountId = 144553;
var accountEmail = "user@example.com";
```

Why prefer `let` over `var`? The answer lies in **scope**.

#### Understanding Scope in JavaScript

Scope determines where a variable is accessible within your code. JavaScript initially had only **function scope** using `var`, but this caused problems where variables unintentionally interfered with each other. Modern JavaScript uses **block scope** with `let` and `const`, limiting a variable’s visibility to the block `{}` in which it is declared.

This prevents bugs like accidentally overwriting variables in different parts of your code and makes your programs more robust and easier to understand.

### Declaring Constants with const

Constants are declared using `const` and cannot be reassigned after their initial value is set.

Example:
```javascript
const accountType = "premium";
```

Attempting to change a constant value will result in an error, which helps avoid mistakes.

## Naming Conventions for Variables and Constants

When naming variables and constants, clarity is key. Use meaningful names that describe the data they hold. For example:

- `accountId` instead of `id`
- `userEmail` instead of `email`
- `accountPassword` instead of `pwd`

There are no strict rules for capitalization, but camelCase is a common standard in JavaScript:
- `accountId`
- `accountEmail`
- `accountPassword`

Choose a style that is easy to read and stick with it consistently.

## Practical Example: Registering a User on Your Website

Let’s create a simple example where we declare variables and constants to hold user registration data.

```javascript
const accountId = 144553;             // constant unique ID
let accountEmail = "user@example.com";  // variable email
let accountPassword = "pass1234";       // variable password
let accountCity = "Bangalore";           // variable city
```

If the user updates their email or city, you can change those variables:

```javascript
accountEmail = "newemail@example.com";
accountCity = "Mumbai";
```

But trying to change `accountId` will cause an error:

```javascript
accountId = 999999;  // This will throw an error
```

## Console Logging and Debugging

You can use `console.log()` to print variables and constants to the console for debugging:

```javascript
console.log(accountId);
console.log(accountEmail);
console.log(accountPassword);
console.log(accountCity);
```

For a more structured output, use `console.table()`:

```javascript
console.table({ accountId, accountEmail, accountPassword, accountCity });
```

This will display the data in a neat table format in the browser’s developer console or Node.js terminal.

## Understanding Undefined Values in Variables

If you declare a variable without assigning a value, JavaScript sets it to `undefined` by default.

Example:

```javascript
let accountState;
console.log(accountState);  // Outputs: undefined
```

This is useful to know because it helps in debugging and setting default values later on.

## Avoid Using var: The Modern JavaScript Standard

Although `var` is still supported, avoid using it because its function-level scope can lead to unexpected bugs, especially in complex applications.

Instead, always declare variables with `let` and constants with `const`. This practice aligns with modern JavaScript standards and makes your code safer and easier to maintain.

## Summary of Key Points

- Use `const` for values that must not change.
- Use `let` for variables that may change.
- Avoid `var` to prevent scope-related bugs.
- Name your variables clearly and use camelCase.
- Use `console.log` and `console.table` for debugging.
- Uninitialized variables default to `undefined`.
- Understand scope to avoid accidental variable overrides.

## Next Steps: Learning Through Projects

Understanding variables and constants is just the beginning. The best way to learn JavaScript is by building real projects like e-commerce websites, social media apps, or mobile applications.

Practice declaring and using variables and constants in different scenarios, experiment with scope, and gradually introduce more advanced concepts like functions, loops, and object-oriented programming.

Stay tuned for upcoming tutorials where we will explore these concepts further and guide you step-by-step through creating functional web applications.

## Final Thoughts

Mastering JavaScript variables and constants is critical for any developer aiming to build interactive and dynamic websites or apps. With a clear understanding of how to declare, use, and manage these data holders, you are well on your way to becoming a proficient JavaScript developer.

Remember, coding is a journey of continuous learning and experimentation. Keep practicing, build projects, and enjoy the process of creating!


If you found this guide helpful, subscribe to the channel and stay updated for more in-depth JavaScript tutorials and project-based learning content.