---
title: "module-info.java"
description: "Learn about Module Info in Java programming."
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - java
courseName: 11-java-fundamentals
showOnArticles: false
featured: false
---

![hero image](https://algomaster.io/og-image.png)

Understanding `module-info.java` is essential in mastering Java's module system, the Java Platform Module System (JPMS). This file serves as the backbone of module configurations, allowing you to define how modules interact with one another. Let’s dive into the intricacies of `module-info.java`, exploring its structure, purpose, and real-world application.

# What is `module-info.java`?

At the core of JPMS lies the `module-info.java` file. This file is mandatory for each module, acting as its descriptor. Think of it as a contract that outlines what a module provides and what it requires from other modules.

Here’s a simple example of a `module-info.java`:

```java
module com.example.myapp {
    requires java.sql; // This module requires the java.sql module
    exports com.example.myapp.service; // This package is publicly accessible
}
```


In this example:

```java
module com.example.myapp {
    // Module directives go here
}
```


*   The `module com.example.myapp` line declares a new module named `com.example.myapp`.

```java
module com.example.myapp {
    requires java.sql;
    requires java.logging; // This module also requires java.logging
}
```

*   The `requires` keyword specifies that this module depends on the `java.sql` module.
*   The `exports` keyword makes the `com.example.myapp.service` package accessible to other modules.

```java
module com.example.myapp {
    requires transitive com.example.utils; // Expose utils to consumers
}
```


# Structure of `module-info.java`

The structure of a `module-info.java` file is quite straightforward yet powerful. Let’s break down its components further.

### Module Declaration

The module declaration itself is straightforward. You start with the `module` keyword followed by the name of the module. Module names should be unique, typically following reverse-domain naming conventions to avoid conflicts.

### Naming Conventions

*   Use lowercase for module names.
*   Stick to reverse domain name conventions to ensure uniqueness.

### Requires Directive

The `requires` directive is used to specify dependencies on other modules. When you declare a dependency, it means your module cannot function without the specified module.

#### Multiple Requires

You can have multiple `requires` statements within a single `module-info.java`:

### Transitive Dependencies

If one module depends on another, it may want to expose that dependency to its own consumers. You can do this using the `requires transitive` directive:

In this case, any module that requires `com.example.myapp` will automatically have access to `com.example.utils`.

```java
module com.example.myapp {
    exports com.example.myapp.service; // Only this package is accessible
}
```


# Exporting Packages

The `exports` directive is crucial for controlling the visibility of packages within your module. By default, all packages in a module are not accessible to other modules.

### Exporting a Package

You can export a specific package like this:

#### Multiple Exports

Just as with `requires`, you can export multiple packages:

#### Private Packages

If you want to keep certain packages hidden, simply avoid exporting them. This encapsulation is a powerful feature, allowing you to design your module's API carefully.

# Understanding the Module Path

The module path is where the Java Runtime looks for modules, similar to how the classpath functions for classes. When compiling or running your application, you must specify the module path using the `--module-path` option.

### Compiling Modules

When compiling modules, you can specify the module path using:

```java
module com.example.myapp {
    exports com.example.myapp.service;
    exports com.example.myapp.model; // Another package is made public
}
```


This command compiles all Java files in the current directory and places the output in the `out` directory, while looking for dependencies in the `libs` directory.

### Running Modules

To run a module, use the `--module` option:

This command specifies the entry point to your application, allowing Java to locate the necessary classes in your module.

# Real-World Applications and Use Cases

Now that we have the basics down, let's explore some practical scenarios where `module-info.java` shines.

### Modularizing a Large Application

Imagine you are working on a large enterprise application with multiple components, such as a web server, a database handler, and a user interface. By modularizing these components, you enhance maintainability and encapsulation.

#### Example Structure

```java
javac --module-path libs -d out $(find . -name "*.java")
```


With individual `module-info.java` files for `server`, `database`, and `ui`, you can define their dependencies and exposed packages efficiently.

### Easy Dependency Management

Using `module-info.java`, managing dependencies becomes straightforward. You can clearly see which modules your module relies on and which packages are exposed. This clarity reduces the risk of version conflicts and dependency hell.

#### Example Dependency Graph

```java
java --module-path out -m com.example.myapp/com.example.myapp.Main
```


This diagram illustrates the dependencies for `com.example.myapp`, providing a visual representation of how modules are interlinked.

```java
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


# Common Gotchas and Edge Cases

While `module-info.java` makes dependency management cleaner, there are pitfalls to watch out for.

### Missing Exports

If you forget to export a package, classes in that package can't be accessed from other modules, leading to `IllegalAccessError`. For example, if you have:

```java
// module-info.java
module com.example.myapp {
    exports com.example.myapp.service; 
}
```


But you try to access a class in `com.example.myapp.model` from another module, you'll encounter issues since `model` isn’t exported.

### Circular Dependencies

Circular dependencies can lead to complications. If Module A requires Module B, and Module B requires Module A, you’ll get a compilation error. To solve this, reconsider your module boundaries and refactor where necessary.

### Run-time vs Compile-time Errors

Finally, remember that some issues related to module visibility will only become apparent at runtime. Make sure to test your modules thoroughly to catch these errors early.

# Conclusion

The `module-info.java` file is a powerful tool for defining module boundaries and dependencies in Java applications. By using it effectively, you can create well-structured, maintainable codebases that avoid common pitfalls.

From declaring module dependencies to controlling package accessibility, mastering `module-info.java` will enhance your programming capabilities in Java. The key is to think modularly, ensuring that your modules are cohesive and loosely coupled. Happy coding!