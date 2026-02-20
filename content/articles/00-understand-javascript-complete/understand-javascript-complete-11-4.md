---
title: "How to setup Typescript in project"
description: "Learn how to set up TypeScript traditionally in your project with step-by-step guidance, including key configurations and best practices for seamless coding."
datePublished: 2026-02-13
dateModified: 2026-02-13
topics:
  - javascript
courseName: 00-understand-javascript-complete
showOnArticles: false
featured: false
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758725512/Portfolio/javaScriptCourse/images/0_eestcm.png)

## How to Set Up TypeScript Traditionally: A Step-by-Step Guide

TypeScript has become an essential language for modern JavaScript development, adding type safety and enhanced tooling to your projects. Whether you're working with Node.js, React, or any other JavaScript environment, understanding how to set up TypeScript properly can save you countless hours debugging and improve your code quality.

In this comprehensive guide, we will explore the traditional way of setting up TypeScript in a project, focusing on installing it project-wise rather than globally, initializing configuration files, and running your TypeScript code efficiently. This tutorial does not require you to use React or Node.js specifically but will prepare you with foundational knowledge that you can easily extend to those environments.

## Why Set Up TypeScript Project-Wise Instead of Globally?

### Global vs. Local Installation

When installing TypeScript, you have two main options:

- **Global Installation**: Installing TypeScript globally means it is available system-wide. You can run the TypeScript compiler (`tsc`) from any terminal window without specifying a project directory.
- **Local (Project-wise) Installation**: Installing TypeScript locally within a project directory ensures that each project can use its own TypeScript version without conflicts. This approach is especially useful when working with multiple projects that may require different versions of TypeScript.

### Advantages of Project-wise Installation

- Maintains version consistency per project.
- Avoids conflicts between different projects using incompatible TypeScript versions.
- Simplifies dependency management by keeping everything within the project scope.

## Step 1: Initializing Your Project and Installing TypeScript

### Setting Up a New Project

Start by opening your terminal inside your project folder or create a new folder:

```bash
mkdir my-typescript-project
cd my-typescript-project
```

Initialize the project with `npm` or `yarn`:

```bash
npm init -y
```

This command generates a `package.json` file that will manage your project dependencies.

### Installing TypeScript as a Dev Dependency

To install TypeScript locally, run the following command:

```bash
npm install --save-dev typescript
```

This installs TypeScript in your project and adds it to your `devDependencies` in `package.json`.

### Verifying TypeScript Installation

Because you installed TypeScript locally, the `tsc` command is not available globally. Instead, you can run it using `npx`, which executes binaries from your project's `node_modules`:

```bash
npx tsc --version
```

You should see the current version of TypeScript installed, for example, `5.9.3`.

## Step 2: Creating the TypeScript Configuration File (`tsconfig.json`)

### What is `tsconfig.json`?

The `tsconfig.json` file tells the TypeScript compiler how to compile your project. It contains compiler options, file inclusions, and other settings.

### Generating `tsconfig.json`

Use the following command to create a default configuration file:

```bash
npx tsc --init
```

This command generates a `tsconfig.json` with a set of default compiler options.

### Exploring Key Options in `tsconfig.json`

- **`rootDir`**: Specifies the root folder where TypeScript looks for source files, usually set to `"./src"`.
- **`outDir`**: Defines where compiled JavaScript files will be placed, often `"./dist"`.
- **`target`**: Decides which JavaScript version the TypeScript code will be compiled down to (e.g., `ES5`, `ES2017`, `ESNext`).
- **`strict`**: Enables strict type-checking options.
- **`jsx`**: Configures JSX support if you use React.

### Example `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"]
}
```

## Step 3: Writing Your First TypeScript File

### Creating the Source Folder and File

Create a `src` directory and add an `index.ts` file:

```bash
mkdir src
touch src/index.ts
```

### Sample TypeScript Code

Here’s a simple function demonstrating TypeScript's type safety:

```typescript
function greet(person: string): string {
  return `Hello, ${person}! Welcome to TypeScript.`;
}

const userName: string = "Rahul Aher";
console.log(greet(userName));
```

### Understanding the Sample Code

- The function `greet` accepts a parameter `person` typed as `string`.
- It returns a `string`.
- The `userName` variable is explicitly typed as `string`.
- The compiler ensures you can only pass a string to `greet`, preventing runtime errors.

## Step 4: Compiling TypeScript Code

### Running the TypeScript Compiler

Compile your code by running:

```bash
npx tsc
```

This command reads your `tsconfig.json`, compiles `.ts` files in `src`, and outputs `.js` files in `dist`.

### Checking the Output

Navigate to the `dist` folder and open `index.js`. It should contain JavaScript equivalent to your TypeScript code.

## Step 5: Running Your Compiled JavaScript

Run the compiled JavaScript using Node.js:

```bash
node dist/index.js
```

You should see the output:

```
Hello, Rahul Aher! Welcome to TypeScript.
```

## Optional: Setting Up Scripts for Convenience

To simplify running your TypeScript commands, update `package.json` with scripts:

```json
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "tsc --watch"
}
```

- `npm run build` compiles your TypeScript files.
- `npm run start` runs the compiled JavaScript.
- `npm run dev` watches for changes and recompiles automatically.

## Understanding TypeScript's Type Safety and IntelliSense

### How TypeScript Helps Developers

With TypeScript:

- Functions and variables have defined types, reducing bugs.
- Editors like VS Code provide autocomplete and suggestions (IntelliSense).
- Large teams benefit from clear contracts between components, improving maintainability.

### Example: Type Safety in Action

If you try to call `greet(123)` instead of a string, TypeScript will warn you during compilation, preventing runtime errors.

## Extending TypeScript Setup to Node.js and React

### Adding Type Definitions

When working with Node.js or React, you often need additional type definitions:

```bash
npm install --save-dev @types/node @types/react
```

These packages provide TypeScript with the necessary typings for Node and React APIs.

### Using TypeScript with React

Modify `tsconfig.json` to include:

```json
"jsx": "react-jsx"
```

And rename your React files from `.js` to `.tsx` for JSX support.

## Tips and Best Practices for TypeScript Setup

- **Always prefer project-wise installation** to avoid version conflicts.
- **Keep your `tsconfig.json` clean and tailored** to your project's needs.
- **Use strict mode** to catch more errors early.
- **Leverage your editor's IntelliSense** for faster and safer coding.
- **Regularly update TypeScript and type definitions** for the latest features and fixes.
- **Use `tsc --watch` during development** for automatic recompilation.

## Conclusion

Setting up TypeScript traditionally is straightforward and forms the foundation for robust JavaScript applications. By installing TypeScript locally, configuring `tsconfig.json` correctly, and understanding the basics of compiling and running TypeScript code, you can start leveraging TypeScript’s powerful features for safer and cleaner code.

Once comfortable with this setup, you can easily extend your knowledge to frameworks like React and backends like Node.js. Stay tuned for upcoming tutorials on TypeScript types, advanced configurations, and real-world coding examples.

## FAQ

### 1. Why should I install TypeScript locally instead of globally?  
Installing locally avoids version conflicts across projects and ensures each project uses the correct TypeScript version.

### 2. What is the purpose of the `tsconfig.json` file?  
It configures the TypeScript compiler with project-specific options such as source directories, output folders, and compiler flags.

### 3. How do I run TypeScript code after compiling?  
Compile TypeScript to JavaScript using `npx tsc`, then run the output JavaScript files with Node.js.

### 4. Can I use TypeScript with React or Node.js?  
Yes! You can install appropriate type definitions (`@types/react`, `@types/node`) and configure TypeScript accordingly.

### 5. What is `npx` and why do I use it?  
`npx` runs binaries from your project's `node_modules` without installing them globally, useful for tools like the TypeScript compiler.


With this guide, you’re now ready to set up and start coding with TypeScript confidently!