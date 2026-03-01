---
title: "module-info.java"
description: "Master `module-info.java` to effectively manage Java modules, dependencies, and package exports for modular, maintainable Java applications with JPMS."
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - java
courseName: 11-java-fundamentals
showOnArticles: false
featured: false
---

# Mastering module-info.java for Effective Java Module Management

## Introduction to module-info.java in Java

In the Java Platform Module System (JPMS), introduced in Java 9, `module-info.java` plays a pivotal role. This file is the core descriptor for every Java module, defining the module’s name, dependencies, and the packages it exposes to other modules. Consider it as a contract that outlines what the module provides and what it requires, enabling clear modular boundaries within your application.

Here’s a simple example of a `module-info.java` file:

```java
module com.example.myapp {
    requires java.sql;
    exports com.example.myapp.service;
}
```

In this snippet:

- `module com.example.myapp` declares a new module named `com.example.myapp`.
- `requires java.sql` indicates that this module depends on the `java.sql` module.
- `exports com.example.myapp.service` makes the `service` package accessible to other modules.

This file is mandatory for every module and forms the foundation of the modular architecture in Java.


## Structure and Components of `module-info.java`

### Module Declaration

Every `module-info.java` file begins with the `module` keyword followed by the module’s unique name. It is best practice to use lowercase letters and follow reverse domain naming conventions (e.g., `com.example.myapp`) to avoid naming conflicts.

### Naming Conventions

- Use all lowercase letters.
- Follow reverse domain name format (e.g., `org.company.project`).
- Keep names unique and descriptive.

### Requires Directive

The `requires` directive declares dependencies on other modules. Without declaring a dependency, your module cannot access the other module’s public packages.

```java
module com.example.myapp {
    requires java.sql;
    requires java.logging;
}
```

You can declare multiple dependencies using multiple `requires` statements.

#### Transitive Dependencies

Sometimes, you want to expose a dependency to consumers of your module. The `requires transitive` directive lets downstream modules automatically access the dependencies of your module:

```java
module com.example.myapp {
    requires transitive com.example.utils;
}
```

Here, any module that depends on `com.example.myapp` will also implicitly depend on `com.example.utils`.

### Exporting Packages

By default, packages within a module are encapsulated and hidden from other modules. The `exports` directive selectively exposes packages.

```java
module com.example.myapp {
    exports com.example.myapp.service;
}
```

#### Multiple Exports

You can export several packages by repeating the `exports` directive:

```java
module com.example.myapp {
    exports com.example.myapp.service;
    exports com.example.myapp.model;
}
```

#### Private Packages

Packages not exported remain internal and inaccessible, enabling you to maintain a clean API surface and encapsulate implementation details.


## Working with the Module Path

### What is the Module Path?

The module path is analogous to the traditional classpath but designed specifically for modules. It tells the Java compiler and runtime where to find modules.

### Compiling Modules with Module Path

When compiling, specify the module path to include dependencies:

```bash
javac --module-path libs -d out $(find . -name "*.java")
```

This command compiles Java files in the current directory, outputs the compiled modules to the `out` directory, and looks for dependencies in the `libs` directory.

### Running Modules

To run an application module, use the `--module` option:

```bash
java --module-path out -m com.example.myapp/com.example.myapp.Main
```

This command tells the JVM to find the module `com.example.myapp` in the `out` directory and execute the `Main` class.


## Practical Applications of `module-info.java`

### Modularizing Large Applications

In large enterprise applications, dividing components such as web servers, databases, and user interfaces into modules improves maintainability and scalability.

#### Example Modular Structure

```
myapp/
├── module-info.java
├── server/
│   ├── module-info.java
│   └── com/example/myapp/server/Server.java
├── database/
│   ├── module-info.java
│   └── com/example/myapp/database/Database.java
└── ui/
    ├── module-info.java
    └── com/example/myapp/ui/UI.java
```

Each module has its own `module-info.java` declaring dependencies and exported packages, enabling clear separation of concerns.

### Simplified Dependency Management

Using `module-info.java` clearly reveals each module’s dependencies and exposed packages, reducing version conflicts and "dependency hell."

Example command to compile and link modules:

```bash
javac --module-path libs -d out $(find . -name "*.java")
```

And to run:

```bash
java --module-path out -m com.example.myapp/com.example.myapp.Main
```

This approach provides a clear dependency graph, making it easier to visualize and manage module interactions.


## Common Mistakes and Challenges

### Missing Exports

Failing to export required packages results in runtime errors such as `IllegalAccessError`. For example, if `com.example.myapp.model` is not exported but accessed externally, your program will fail.

```java
module com.example.myapp {
    exports com.example.myapp.service;
}
```

Trying to access `model` package classes from outside will cause access errors.

### Circular Dependencies

Modules cannot depend on each other in a circular fashion (Module A requires Module B and vice versa). The compiler will throw errors, and this usually signals a need to refactor module boundaries.

### Runtime vs Compile-time Errors

Some module visibility errors only surface at runtime. Thorough testing is necessary to catch access issues and ensure your module setup works as intended.



## Conclusion: Why `module-info.java` Matters

The `module-info.java` file is a cornerstone of the Java Platform Module System, empowering developers to define clean module boundaries and control dependencies effectively. By mastering this file, you can build modular, maintainable, and scalable Java applications that avoid common pitfalls like dependency conflicts and unintended package exposure.

Key takeaways:

- Use `module-info.java` to declare module names, dependencies (`requires`), and exported packages (`exports`).
- Follow naming conventions for clarity and uniqueness.
- Employ `requires transitive` to propagate dependencies downstream.
- Understand and use the module path to compile and run modular applications.
- Avoid common mistakes like missing exports and circular dependencies.

By adopting a modular mindset and leveraging `module-info.java`, you enhance your ability to write robust Java programs that stand the test of time. Happy modular coding!