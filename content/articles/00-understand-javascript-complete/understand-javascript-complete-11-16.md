---
title: "Typescript with React"
description: "Learn how to use TypeScript with React effectively, including components, hooks, props, and forms with hands-on examples to boost your coding confidence."
datePublished: 2026-02-13
dateModified: 2026-02-13
topics:
  - javascript
courseName: 00-understand-javascript-complete
showOnArticles: false
featured: false
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758725512/Portfolio/javaScriptCourse/images/0_eestcm.png)  



## Mastering React with TypeScript: A Practical Guide for Developers

React and TypeScript make a powerful combination for building scalable and maintainable front-end applications. Many developers often wonder if learning TypeScript is necessary when they already know JavaScript, especially when working with React. The truth is that all JavaScript React code can seamlessly be converted to TypeScript with minimal effort, primarily by adding type definitions and interfaces. This guide will walk you through the essentials of working with TypeScript in React, including component creation, props handling, hooks, and forms, providing you the confidence to use TypeScript efficiently in your projects.

## Why Use TypeScript with React?

### Benefits of Type Safety

TypeScript provides static typing, which helps catch errors early in the development process. It ensures that the data types passed around your components are consistent, reducing runtime bugs and improving code quality.

### Seamless Transition from JavaScript to TypeScript

If you already have JavaScript knowledge, transitioning to TypeScript is simpler than you might think. TypeScript is a superset of JavaScript, which means all JavaScript code is valid TypeScript. You just add type annotations and interfaces as needed.

### Better Developer Experience with Tooling

With TypeScript, editors provide better auto-completion, inline documentation, and error checking, making your development workflow more productive.

## Setting Up a React TypeScript Project

### Creating a Fresh React + TypeScript Project

To start a new React project with TypeScript, you can use tools like Vite or Create React App. Here's a quick way using npm and Vite:

```bash
npm create vite@latest my-react-ts-app -- --template react-ts
cd my-react-ts-app
npm install
npm run dev
```

This initializes a React project with TypeScript support out-of-the-box.

### Project Structure Overview

Inside the `src` folder, your main entry is `main.tsx` or `App.tsx`. Files with the `.tsx` extension indicate React components written in TypeScript JSX syntax.

## Building React Components with TypeScript

### Creating a Basic Functional Component

Let's create a simple component called `TeaCard` that accepts some props.

```tsx
import React from 'react';

interface TeaCardProps {
  name: string;
  price: number;
  isSpecial?: boolean; // Optional prop
}

export function TeaCard({ name, price, isSpecial = false }: TeaCardProps) {
  return (
    <article>
      <h2>{name} {isSpecial && <span>★</span>}</h2>
      <p>Price: ₹{price}</p>
    </article>
  );
}
```

Here, `TeaCardProps` interface defines the shape of props the component expects. The `isSpecial` prop is optional with a default value.

### Using the Component in App.tsx

```tsx
import React from 'react';
import { TeaCard } from './components/TeaCard';

export function App() {
  return (
    <div>
      <TeaCard name="Headphones" price={5000} isSpecial />
      <TeaCard name="iPhone" price={80000} />
    </div>
  );
}
```

Passing props with proper types helps avoid bugs and improves maintainability.

## Managing State with useState Hook in TypeScript

### Defining State Types Explicitly

TypeScript allows you to specify the type of state variables. For example, a simple counter component:

```tsx
import React, { useState } from 'react';

export function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)}>Order One More</button>
    </div>
  );
}
```

Here, `useState<number>(0)` explicitly states that `count` is a number.

### Why Explicit Types Matter

Specifying types prevents accidental assignment of wrong data types and helps TypeScript provide better suggestions.

## Handling Lists and Props with Arrays

### Typing Arrays of Objects

Suppose you have a list of tea items:

```tsx
interface Tea {
  id: number;
  name: string;
  price: number;
}

interface TeaListProps {
  items: Tea[];
}

export function TeaList({ items }: TeaListProps) {
  return (
    <div>
      {items.map(tea => (
        <TeaCard
          key={tea.id}
          name={tea.name}
          price={tea.price}
          isSpecial={tea.price > 30}
        />
      ))}
    </div>
  );
}
```

### Importing Types for Reusability

You can export interfaces like `Tea` from a separate `types.ts` file to reuse them across components.

## Building Forms with TypeScript in React

### Defining Form Props and Interfaces

When working with forms, you often need to define the shape of form data and handlers:

```tsx
interface OrderFormProps {
  onSubmit: (order: { name: string; cups: number }) => void;
}

export function OrderForm({ onSubmit }: OrderFormProps) {
  const [name, setName] = React.useState<string>('Masala');
  const [cups, setCups] = React.useState<number>(1);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ name, cups });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          type="text"
        />
      </label>
      <label>
        Cups:
        <input
          value={cups}
          onChange={e => setCups(Number(e.target.value))}
          type="number"
        />
      </label>
      <button type="submit">Place Order</button>
    </form>
  );
}
```

### Handling Events with TypeScript

- Use `React.FormEvent<HTMLFormElement>` for form submit events.
- Use `React.ChangeEvent<HTMLInputElement>` for input change events.
- Convert input values to appropriate types (e.g., string to number).

## Advanced Props: Using Children and Extending Interfaces

### The Special `children` Prop in React

When building wrapper components or layouts, you often use the `children` prop:

```tsx
import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  footer?: ReactNode;
  children: ReactNode;
}

export function Card({ title, footer, children }: CardProps) {
  return (
    <section>
      <h2>{title}</h2>
      {children}
      {footer && <footer>{footer}</footer>}
    </section>
  );
}
```

### Extending Props with `PropsWithChildren`

Alternatively, you can extend React's built-in type for props with children:

```tsx
import React, { PropsWithChildren, ReactNode } from 'react';

interface CardExtraProps {
  title: string;
  footer?: ReactNode;
}

export function Card({ title, footer, children }: PropsWithChildren<CardExtraProps>) {
  // same as above
}
```

This is useful for consistent typing of components accepting children.

## Creating Custom Hooks with TypeScript

### Example: A Generic useFetch Hook

Custom hooks help encapsulate logic like fetching data:

```tsx
import { useState, useEffect } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(url: string): FetchState<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    fetch(url)
      .then(res => res.json())
      .then(data => setState({ data, loading: false, error: null }))
      .catch(err => setState({ data: null, loading: false, error: err.message }));
  }, [url]);

  return state;
}
```

### Benefits of Generic Hooks

- Reusable across different data types.
- Strongly typed state for data, loading, and error.
- Improved code readability and maintainability.

## Best Practices for TypeScript with React

### Define Interfaces for Props and State

Always create interfaces for your component props and state shapes to maintain clear contracts.

### Use Optional Props and Default Values

Mark optional props with `?` and provide default values where applicable.

### Leverage TypeScript Utility Types

Use utility types like `PropsWithChildren`, `Partial<T>`, and generics to write flexible and reusable components.

### Handle Events with Proper Types

Use React's predefined event types for input, form, and other event handlers to get accurate type checking.

## Conclusion: Building Confidence with TypeScript in React

TypeScript enhances React development by providing type safety, better tooling, and clearer code structure. The learning curve is minimal if you start by adding types gradually to your existing JavaScript React code.

By practicing key concepts such as defining props interfaces, typing hooks, handling events, and building reusable components, you gain confidence and accelerate your development process.

This guide covered practical examples including components, state management, lists, forms, children props, and custom hooks. With these fundamentals, you are well-equipped to build robust React applications using TypeScript and can confidently advance to frameworks like Next.js without additional hurdles.

Keep exploring, practicing, and integrating TypeScript into your React projects to enjoy cleaner, safer, and more maintainable codebases.

## FAQ

### Is TypeScript necessary for React development?

No, but it greatly improves code quality and reduces bugs, especially in large projects.

### Can I convert existing JavaScript React projects to TypeScript?

Yes, by gradually renaming files to `.tsx` and adding type definitions.

### How do I type React event handlers in TypeScript?

Use React's built-in event types like `React.ChangeEvent<HTMLInputElement>` or `React.FormEvent<HTMLFormElement>`.

### What is the best way to handle props with children?

Use `PropsWithChildren<T>` or explicitly type the `children` prop as `ReactNode` in your interfaces.



Embrace TypeScript in your React journey and build reliable, scalable front-end applications with ease!