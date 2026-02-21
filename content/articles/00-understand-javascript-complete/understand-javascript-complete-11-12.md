---
title: Array, enum and tuples in Typescript
description: Learn TypeScript arrays, tuples, and enums with practical examples
  to build robust, error-free applications. Master foundational data structures
  easily.
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

## Array, enum and tuples in Typescript 

TypeScript is a powerful superset of JavaScript that adds static typing and enhanced tooling to your code. Among its many features, foundational data structures like arrays, tuples, and enums play a critical role in developing scalable and maintainable applications. This guide will take you through these core concepts with practical examples, helping you grasp their syntax, use cases, and best practices.

## Understanding Arrays in TypeScript  

### What Are Arrays?  
Arrays are one of the most commonly used data structures in TypeScript and JavaScript. They allow you to store multiple values in a single variable. In TypeScript, arrays can be strongly typed, meaning you can specify the type of elements it holds, improving code reliability and catching errors early.

### Declaring Arrays  
You can declare an array of strings, numbers, or any other type using two main syntaxes:

```typescript
let flavors: string[] = ["Masala", "Ginger"];
let prices: Array<number> = [10, 20, 30];
```

- `string[]` denotes an array of strings.
- `Array<number>` is a generic type specifying an array of numbers.

Both syntaxes are interchangeable, but the bracket notation (`string[]`) is more common.

### Array of Objects  
Often, you need to store complex data like objects inside arrays. For example, a tea menu can be represented as an array of objects with defined properties:

```typescript
type Tea = {
  name: string;
  price: number;
};

let menu: Tea[] = [
  { name: "Masala", price: 15 },
  { name: "Ginger", price: 20 }
];
```

This approach enforces the structure of objects and ensures all menu items have consistent properties.

### Readonly Arrays  
TypeScript also allows you to create immutable arrays using the `readonly` modifier:

```typescript
const cities: readonly string[] = ["Delhi", "Jaipur"];
```

Once defined, you cannot modify a `readonly` array, meaning methods like `push` or direct element assignment will throw errors. This is useful to avoid accidental mutations and maintain data integrity.

### Multi-dimensional Arrays  
You can create arrays of arrays (multi-dimensional arrays) for complex data sets:

```typescript
let table: number[][] = [
  [1, 2, 3],
  [4, 5, 6]
];
```

Each element inside the main array is itself an array, providing a grid-like data structure often used in machine learning, graphics, or tabular data.

## Exploring Tuples in TypeScript  

### What Are Tuples?  
Tuples are a special type of array with fixed length and known types at each position. Unlike regular arrays, tuples enforce the order and type of elements strictly.

### Declaring Tuples  
For example, to represent a tea item with a name and price using a tuple:

```typescript
let teaTuple: [string, number] = ["Masala", 20];
```

Here, the first element must be a string, and the second a number, in that exact order.

### Optional Tuple Elements  
Tuples can also have optional elements:

```typescript
let userInfo: [string, number, boolean?] = ["Alice", 100, true];
```

The third element here is a boolean and optional, so you can omit it if you want.

### Readonly Tuples  
Just like arrays, tuples can be made immutable:

```typescript
const location: readonly [number, number] = [28.66, 32.22];
```

Attempting to modify elements of a readonly tuple will result in compile-time errors.

### Named Tuples  
To improve code readability, TypeScript supports named tuples, which assign meaningful names to tuple elements:

```typescript
let teaItem: [name: string, price: number] = ["Masala", 25];
```

This makes your code self-documenting and easier to understand when accessing tuple elements.

### Tuples Are Arrays Under the Hood  
It's important to remember that tuples are essentially arrays with fixed types and length. This means methods like `push` can technically be used, but this often leads to unexpected behavior and bugs. Hence, it's best to avoid pushing extra elements into tuples.

## Leveraging Enums in TypeScript  

### What Are Enums?  
Enums (short for enumerations) are a TypeScript feature that allows you to define a set of named constants. They restrict the values a variable can take, making your code more predictable and safer by preventing invalid assignments.

### Defining Enums  
For example, defining cup sizes for tea:

```typescript
enum CupSize {
  SMALL,
  MEDIUM,
  LARGE
}
```

By default, enum values start at 0 and auto-increment. So, `SMALL` = 0, `MEDIUM` = 1, `LARGE` = 2.

### Assigning Custom Values  
You can assign custom numeric or string values:

```typescript
enum Status {
  PENDING = 100,
  SERVED,
  CANCELLED
}
```

Here, `PENDING` is explicitly set to 100, and subsequent values auto-increment (`SERVED` = 101, `CANCELLED` = 102).

### Using String Enums  
Strings can also be used to make enums more descriptive:

```typescript
enum TeaType {
  MASALA = "Masala",
  GINGER = "Ginger"
}
```

This is often preferred for clarity and debugging.

### Accessing Enum Values  
When using enums, TypeScript provides autocomplete suggestions and restricts inputs to valid enum members:

```typescript
enum CupSize {
  SMALL,
  MEDIUM,
  LARGE
}


let selectedSize: CupSize = CupSize.MEDIUM;
console.log(selectedSize); // Output: 1
```

This prevents errors such as assigning invalid size values.

### Enum Best Practices  
- Keep enum values consistent in type (all numbers or all strings).
- Use uppercase naming conventions for enum members.
- Use enums to represent fixed sets of options in your application, like status codes, categories, or configuration constants.

### Constants and Enums  
You can also declare enums as constants to optimize runtime code generation:

```typescript
const enum SugarLevel {
  LOW = 1,
  MEDIUM,
  HIGH
}
```

Constant enums are removed during compilation, replacing usage with literal values for better performance.

## Practical Example: Making Tea with TypeScript  

To put all concepts together, consider a simple function to make tea with a restricted set of tea types and cup sizes:

```typescript
enum TeaType {
  MASALA = "Masala",
  GINGER = "Ginger"
}

enum CupSize {
  SMALL,
  MEDIUM,
  LARGE
}

function makeTea(type: TeaType, size: CupSize): void {
  console.log(`Making a ${size} cup of ${type} tea.`);
}

makeTea(TeaType.MASALA, CupSize.LARGE);
```

This approach ensures only valid tea types and cup sizes are allowed, enhancing code safety and reducing bugs.

## Summary  

- **Arrays** are versatile collections of elements of the same type, with support for readonly and multi-dimensional structures.
- **Tuples** provide fixed-length, ordered collections with specific types for each element, supporting optional and readonly features.
- **Enums** allow defining named constants, restricting variable values to predefined options and improving code clarity.
- Adhering to best practices in using these structures makes your TypeScript code more robust, maintainable, and easier to debug.

## Frequently Asked Questions (FAQs)  

**Q1: Can I modify a readonly array or tuple after creation?**  
No, readonly arrays and tuples are immutable. Attempting to modify them will result in compile-time errors.

**Q2: What happens if I push an element to a tuple?**  
Technically possible since tuples are arrays internally, but it leads to unexpected behavior and should be avoided.

**Q3: Should I use string or numeric enums?**  
String enums are preferred for clarity, but numeric enums are useful for auto-incrementing sequences or performance.

**Q4: Can enums have mixed types?**  
It's possible but discouraged. Keeping enum values consistent in type is a best practice to avoid confusion.



Mastering arrays, tuples, and enums will significantly improve your TypeScript coding skills, enabling you to build safer and more efficient applications. Happy coding!