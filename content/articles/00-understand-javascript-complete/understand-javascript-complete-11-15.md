---
title: Type definations and Axios in typescript
description: Learn TypeScript type declarations, web requests using Axios and
  Fetch, and practical tips to write better typed code with interfaces and
  generics.
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

## Introduction to TypeScript Type Declarations and Web Requests

TypeScript has become an essential tool for developers who want to write robust and maintainable JavaScript code. One of its core features is **type declarations**, which help catch errors early and provide better code suggestions. In this post, we’ll explore the fundamentals of type declarations, how they integrate with web requests, and practical ways to use **Axios** and **Fetch API** with TypeScript, along with generics and interfaces.

<br/>


## Understanding Type Declarations in TypeScript

### What Are Type Declarations?

Type declarations in TypeScript are special files, usually with a `.d.ts` extension, that define the types of variables, functions, classes, and other entities. They don’t contain executable code but provide type information to the TypeScript compiler and editor tooling.

- **Purpose:** Enable code editors to offer suggestions, warnings, and errors.
- **Location:** Usually found in `node_modules/@types` or bundled with libraries.
- **Common Files:** Files such as `dom.d.ts` define DOM-related APIs, while others define ECMAScript standard library methods.

### Why Are Type Declarations Important?

Without type declarations, TypeScript cannot provide meaningful hints or error detection. For example, when working with DOM APIs or third-party libraries, these declarations tell TypeScript what to expect in terms of inputs, outputs, and object structures.

### How Do They Work Internally?

When you install TypeScript, it comes with a set of declaration files covering core JavaScript features and browser APIs. These files define interfaces, methods, and their types. For example, the method `addEventListener` is defined in `dom.d.ts` with its expected parameters and return types.

<br/>


## Exploring Declaration Files (`.d.ts`)

### Structure and Content

A typical declaration file contains interfaces and type definitions but no actual implementation. For example, an array’s declaration file details all the available methods like `map`, `filter`, and `flatArray`, their signatures, and expected types.

### How Developers Interact with Declaration Files

- Usually, developers do **not** write or modify these files frequently.
- They help editors provide autocomplete and error checking.
- When using libraries, these files are either included or installed separately via `@types`.

<br/>


## Using Type Declarations with Third-Party Libraries

### Installing Type Declarations

Many popular libraries ship with their own type declarations. If not, you can install them from the DefinitelyTyped repository using npm:

```bash
npm install --save-dev @types/library-name
```

For example, for Axios:

```bash
npm install axios
npm install --save-dev @types/axios
```

### Handling Missing Type Declarations

If a library doesn’t provide type declarations, you can:

- Create your own `.d.ts` files with minimal interface definitions.
- Refer to the documentation to write accurate type interfaces.
- Use `any` type as a last resort, though this loses the benefits of TypeScript.

<br/>


## Practical Web Requests in TypeScript

### Using Axios with TypeScript

Axios is a popular HTTP client library that supports promises. It works well with TypeScript due to its bundled type declarations.

#### Basic Axios GET Request

```typescript
import axios, { AxiosResponse } from 'axios';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

async function fetchData(): Promise<void> {
  try {
    const response: AxiosResponse<Todo[]> = await axios.get('https://jsonplaceholder.typicode.com/todos/1');
    console.log(response.data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}
```

#### Key Points:

- Using **interfaces** to define the expected response data.
- Utilizing **AxiosResponse** generic type to strongly type the response.
- Catching errors and differentiating Axios errors for better error handling.
- Using `async/await` for clearer asynchronous code flow.

### Using Fetch API with TypeScript

Fetch is a native browser API for making HTTP requests. Unlike Axios, Fetch doesn’t come with built-in typings for response data, so you must manually handle the JSON response and errors.

#### Basic Fetch GET Request

```typescript
interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

async function fetchData(): Promise<void> {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Todo = await response.json();
    console.log(data);
  } catch (error) {
    console.error('Fetch error:', error);
  }
}
```

#### Key Differences from Axios:

- Manual checking of response status.
- Explicitly parsing JSON data.
- No built-in error classification like Axios.

<br/>


## Leveraging Interfaces and Generics in TypeScript

### Defining Interfaces for API Data

Interfaces define the shape of objects you expect from API responses, improving code readability and maintainability.

Example:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}
```

Use interfaces whenever you expect structured data, particularly useful for API responses.

### Using Generics for Flexible Typing

Generics enable reusable functions and types that work with multiple data types.

Example with Axios:

```typescript
async function fetchData<T>(url: string): Promise<T> {
  const response = await axios.get<T>(url);
  return response.data;
}

const todo = await fetchData<Todo>('https://jsonplaceholder.typicode.com/todos/1');
```

Benefits of generics:

- Strongly type data without duplicating code.
- Enhanced code flexibility and safety.

<br/>


## Best Practices for Using TypeScript with Web Requests

### Always Install Type Declarations

For every library you install, check if types are included or available separately and install them to benefit from TypeScript’s features fully.

### Handle Errors with Type Safety

Use TypeScript’s type guards, such as `axios.isAxiosError`, to handle different error types more effectively.

### Don’t Ignore TypeScript Suggestions

Red squiggly lines often indicate useful suggestions. Fixing these early reduces runtime bugs.

### Use Interfaces for API Contracts

Define interfaces for both request payloads and response data. This approach ensures data consistency across your application.

### Use Generics for Reusable API Functions

Writing generic fetch functions reduces boilerplate and improves scalability.

<br/>


## Summary

In this blog post, we explored the essential concepts of **TypeScript type declarations** and their practical usage with web requests via **Axios** and **Fetch API**. We learned:

- What declaration files (`.d.ts`) are and why they are crucial for TypeScript’s static typing.
- How to install and use type declarations for libraries.
- How to write typed web request functions with interfaces and generics.
- Best practices to handle errors and maintain type safety.

By integrating these practices, you can write cleaner, safer, and more maintainable TypeScript code for your web applications.

<br/>


## Frequently Asked Questions (FAQ)

### What are `.d.ts` files in TypeScript?

They are type declaration files that describe the shape of code that TypeScript cannot infer, enabling better tooling and type checking.

### How do I install type declarations for a library?

Use npm with the `@types` scope, e.g., `npm install --save-dev @types/axios`.

### Can I use Fetch API with TypeScript?

Yes, but you need to manually type the response data and handle status codes.

### What are generics in TypeScript?

Generics allow you to write functions and types that work with any data type, enhancing code reusability and type safety.


If you want to deepen your TypeScript knowledge or explore more practical web development techniques, stay tuned for upcoming posts covering Express.js type declarations and advanced generics usage!