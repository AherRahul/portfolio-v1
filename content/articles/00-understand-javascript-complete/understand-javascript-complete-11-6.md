---
title: "Understanding Unions & Any"
description: "Learn how to effectively use Union and Any types in TypeScript to write cleaner, safer code while avoiding common pitfalls with practical examples."
datePublished: 2026-02-13
dateModified: 2026-02-13
topics:
  - javascript
courseName: 00-understand-javascript-complete
showOnArticles: false
featured: false
---


![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758725512/Portfolio/javaScriptCourse/images/0_eestcm.png)



## Mastering TypeScript: Union vs Any Types Explained

TypeScript is a powerful superset of JavaScript that adds static typing to the language, helping developers catch errors early and write more maintainable code. In this blog post, we will deep dive into two important TypeScript features: **Union Types** and the **Any Type**. Understanding these concepts will improve your coding accuracy and prevent many common bugs. We will discuss their use cases, advantages, and pitfalls with practical examples, empowering you to write robust TypeScript code.

## Understanding TypeScript Union Types

### What is a Union Type?

Union types allow a variable to hold more than one type of value. Instead of restricting a variable to a single type, union types enable it to accept multiple possible types. This flexibility is crucial when dealing with dynamic data such as API responses or user inputs where the type can vary.

For example, consider a variable that may hold either a number or a string:

```typescript
let value: number | string;
value = 10;         // valid
value = "ten";      // also valid
```

Here, the pipe symbol (`|`) separates possible types in the union. This way, TypeScript knows that the variable `value` can be either a `number` or a `string`, and it enforces this rule throughout your code.

### Why Use Union Types?

Union types are ideal when you want to be explicit about the possible values a variable can have, which improves code safety and readability. For instance, when you are working with API request statuses, you might define all possible states like this:

```typescript
type ApiRequestStatus = "pending" | "success" | "error";

let status: ApiRequestStatus;
status = "pending";  // valid
status = "done";     // error: Type '"done"' is not assignable
```

Defining such strict unions prevents mistakes like misspelling status values or passing unexpected values, which can be hard to debug otherwise.

### Real-World Example: API Request Modes

Imagine you are managing API request statuses in your application. Using union types, you can define the allowable states explicitly:

```typescript
type RequestStatus = "pending" | "success" | "error";

let apiStatus: RequestStatus = "pending";

function updateStatus(newStatus: RequestStatus) {
  apiStatus = newStatus;
}

updateStatus("success"); // works
updateStatus("done");    // Type error!
```

This approach ensures that only valid status values are used, reducing runtime errors related to invalid states.

### Benefits of Union Types

- **Type Safety:** Prevents invalid assignments by restricting values to a defined set.
- **Code Autocompletion:** Editors provide suggestions based on union members, speeding up development.
- **Better Documentation:** Makes your code self-describing by defining valid values clearly.
- **Easier Maintenance:** Changes to allowed types propagate safely throughout the codebase.

## Avoiding Pitfalls with the Any Type

### What is the Any Type?

The `any` type in TypeScript is a special type that disables type checking for the variable it is assigned to. It essentially tells the compiler, "I don't care about the type here." Variables with type `any` can hold any value without errors or warnings.

Example:

```typescript
let data: any;
data = 42;
data = "hello";
data = true;
```

While `any` provides maximum flexibility, it also removes the benefits of static typing, leading to potential bugs and harder-to-maintain code.

### Why Avoid Using Any?

Using `any` defeats the purpose of TypeScript by allowing any kind of data, thus bypassing type checks. This can result in:

- **Runtime Errors:** Since type safety is lost, unexpected values can cause crashes.
- **Poor Code Readability:** Other developers (or even you in the future) won't know what types the variable is expected to have.
- **Debugging Difficulties:** Bugs caused by wrong data types become harder to track down without type enforcement.

### When is Any Necessary?

There are cases when you might be forced to use `any`, such as:

- Working with legacy JavaScript code without type definitions.
- Interacting with third-party libraries with incomplete or missing types.
- Handling dynamic data from external sources where the type cannot be predetermined.

Even in these cases, strive to narrow down the type as soon as possible using type guards or by defining interfaces.

### Example Problem with Any Type

Consider the following code where `any` is used and causes unexpected behavior:

```typescript
let currentOrder: any;

let orders = ["12", "20", "28", "42"];

for (let order of orders) {
  if (order === "28") {
    currentOrder = order;
    break;
  }
}

console.log(currentOrder); // Output: "28"
```

Although this works, `currentOrder` can hold any value, which could accidentally cause bugs if misused later. Worse, if you try to use `currentOrder` before assigning it a value, TypeScript will not warn you due to `any`.

### Safer Alternative: Using Union with Undefined

Instead of `any`, you can use a union type that includes `undefined` to explicitly state that a variable might not be assigned a value yet:

```typescript
let currentOrder: string | undefined;

let orders = ["12", "20", "28", "42"];

for (let order of orders) {
  if (order === "28") {
    currentOrder = order;
    break;
  }
}

if (currentOrder !== undefined) {
  console.log(currentOrder);
} else {
  console.log("Order not found");
}
```

This approach makes it clear that `currentOrder` may be `undefined`, forcing you to handle this case and making your code safer and more predictable.

## Best Practices for Using Union and Any Types in TypeScript

### Prefer Union Types Over Any

Whenever possible, define explicit union types to handle multiple possible value types rather than falling back to `any`. This keeps your code type-safe and easier to maintain.

### Use Literal Types for Finite Sets of Values

When a variable can only take a limited set of values (like API statuses or UI modes), use string literal union types to restrict and document these values clearly.

```typescript
type SeatType = "aisle" | "window" | "middle";
```

This enables editor suggestions and prevents invalid assignments, improving developer experience.

* **Minimize the Usage of Any:** Reserve `any` only for exceptional cases. Use type assertions, type guards, or refine types as soon as you can to regain type safety.

* **Handle Undefined and Null Explicitly:** When a variable might not be assigned immediately, use union types including `undefined` or `null` to explicitly model this behavior and handle these cases properly.

* **Leverage TypeScript’s Type Inference:** Sometimes you don't need to annotate types explicitly. Let TypeScript infer types as long as it leads to safe and predictable code.

## Summary

In this post, we explored two critical TypeScript types: **Union** and **Any**. Union types offer a way to express variables that can hold multiple specific types, enhancing code safety and clarity. For example, defining API request statuses or seat types in an airline booking system as unions helps prevent invalid values and aids developer productivity with autocompletion.

On the other hand, the `any` type disables type checking and should be avoided whenever possible, as it removes the benefits of TypeScript’s static typing. While sometimes necessary, it's better to use more precise union types including `undefined` or `null` to represent uncertain values.

By applying these best practices, you can write clean, robust, and maintainable TypeScript code, reducing runtime errors and improving developer experience.

## Frequently Asked Questions (FAQs)

### What are the main advantages of using union types in TypeScript?

Union types allow variables to hold multiple types explicitly, improving type safety, enabling better autocompletion, and preventing invalid assignments.

### Why should I avoid using the `any` type?

Using `any` disables type checking, leading to potential bugs, reduced code readability, and harder debugging. It should be used sparingly and only when necessary.

### How can I handle variables that might not have a value yet?

Use union types that include `undefined` or `null` to explicitly indicate that a variable might be unassigned and handle those cases in your code.

### Can union types be used with custom data types?

Yes, union types can combine primitive types, string literals, and custom interfaces or types, providing great flexibility.



Mastering union and `any` types in TypeScript is essential for building scalable, error-free applications. Start practicing these concepts today to take your TypeScript skills to the next level!