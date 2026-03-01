---
title: "Java Modules (JPMS)"
description: "Discover how the Java Platform Module System (JPMS) enhances code organization, security, and dependency management in Java 9 and beyond."
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - java
courseName: 11-java-fundamentals
showOnArticles: false
featured: false
---



# Mastering Java Modules: A Complete Guide to JPMS in Java 9

## Introduction to Java Platform Module System (JPMS)

Java 9 introduced one of the most significant enhancements in the Java ecosystem: the Java Platform Module System (JPMS). For developers dealing with complex and large-scale Java applications, managing dependencies, code readability, and security can often become cumbersome. JPMS addresses these challenges by introducing a formal module system that organizes codebases into well-defined units called modules.

This blog post will take you through the essentials of Java modules, why they matter, and how to leverage JPMS effectively for better modularity, maintainability, and scalability in your Java projects.


## What Are Java Modules?

### Understanding the Concept of Modules

At its core, a **Java module** is a logical grouping of related packages and resources that encapsulates specific functionality. Modules act as self-contained units, exposing only selected APIs and hiding their internal implementation details from the outside world.

This design principle is similar to encapsulation in object-oriented programming but applies at a higher, application-wide level. Instead of classes and interfaces, modules define boundaries across multiple packages, enabling clearer dependency management and access control.

### Key Benefits of Using Modules

- **Encapsulation**: Modules restrict access to internal code by exporting only what is necessary. This protects implementation details and reduces unintended coupling.
- **Improved Dependency Management**: Modules explicitly declare their dependencies on other modules, helping avoid version conflicts and runtime errors.
- **Better Project Organization**: By dividing a large application into distinct modules, developers gain a cleaner, more maintainable project structure.


## Creating and Using Java Modules

### Defining a Module with `module-info.java`

The fundamental step in creating a module is defining a `module-info.java` file. This file declares the module’s name, its exported packages, and required dependencies.

For example, consider a module dedicated to mathematical operations:

```java
module math.operations {
    exports com.example.math;
}
```

This snippet defines a module named `math.operations` that exports the `com.example.math` package for use by other modules.

### Directory Structure for Modules

Java modules require a specific directory structure to work effectively:

```
src/
 └── math.operations/
     ├── module-info.java
     └── com/
         └── example/
             └── math/
                 └── MathOperations.java
```

This organization keeps the module descriptor and source files well-structured.

### Writing a Basic Module: Example Class

Here’s a simple implementation of the `MathOperations` class inside the exported package:

```java
package com.example.math;

public class MathOperations {
    public static int add(int a, int b) {
        return a + b;
    }

    public static int subtract(int a, int b) {
        return a - b;
    }
}
```

### Compiling and Running Modules

Modules are compiled and run using the `javac` and `java` commands with the `--module-path` option:

```bash
javac -d out --module-path out src/math.operations/module-info.java src/math.operations/com/example/math/MathOperations.java
```

To run the module:

```bash
java --module-path out --module math.operations/com.example.math.MathOperations
```

This approach maintains modular integrity and helps avoid classpath conflicts.


## Managing Module Dependencies

### Declaring Dependencies with `requires`

Modules can depend on one another, which is declared using the `requires` directive in `module-info.java`. For instance, suppose `math.operations` depends on another module called `math.utils`:

```java
module math.operations {
    exports com.example.math;
    requires math.utils;
}
```

### Example: Creating a Dependent Module

The `math.utils` module might look like this:

```java
module math.utils {
    exports com.example.utils;
}
```

With a utility class inside:

```java
package com.example.utils;

public class Utils {
    public static void printResult(String label, int result) {
        System.out.println(label + ": " + result);
    }
}
```

### Using Dependent Modules

By importing and utilizing classes from `math.utils`, `MathOperations` can provide enhanced functionality:

```java
package com.example.math;

import com.example.utils.Utils;

public class MathOperations {
    public static int add(int a, int b) {
        int result = a + b;
        Utils.printResult("Addition", result);
        return result;
    }

    public static int subtract(int a, int b) {
        int result = a - b;
        Utils.printResult("Subtraction", result);
        return result;
    }
}
```

This demonstrates how JPMS facilitates inter-module communication while enforcing clear boundaries.


## Access Control in Java Modules

### Exporting Packages

By default, all packages inside a module are inaccessible to other modules unless explicitly exported. The `exports` directive in `module-info.java` controls which packages are visible externally:

```java
module math.operations {
    exports com.example.math;
}
```

### Internal Packages and Encapsulation

Packages not exported remain internal and hidden. For example:

```java
package com.example.math.internal;

class InternalMath {
    static int multiply(int a, int b) {
        return a * b;
    }
}
```

Since `com.example.math.internal` is not exported, classes inside it cannot be accessed by other modules. This strict encapsulation enhances security and maintainability by preventing unintended external use.


## Real-World Applications of JPMS

### Managing Large Applications

In enterprise-grade applications with thousands of classes, JPMS enables modular separation into meaningful units such as `accounting`, `transactions`, and `user-management`. This modularization enables teams to work independently and evolve modules without interfering with each other.

### Supporting Microservices Architecture

Microservices naturally benefit from modularization. Each microservice can be implemented as a module with its own dependencies and APIs, ensuring changes in one service do not impact others. JPMS strengthens microservices by enforcing clear contracts and reducing tight coupling.

### Building Modular Libraries

Library developers can use JPMS to expose only the intended API packages, hiding all internal implementation details. This approach minimizes misuse of library internals and improves API stability over time.


## Challenges and Limitations of JPMS

While JPMS offers substantial benefits, developers should be mindful of potential challenges:

- **Increased Complexity**: Introducing modules adds complexity to the build process and runtime configuration, especially for existing projects.
- **Legacy Code Integration**: Refactoring legacy monolithic applications to use modules can be time-consuming and may require significant redesign.
- **Tooling and Framework Support**: Some development tools and frameworks may not fully support JPMS yet, leading to compatibility hurdles.

Overcoming these challenges requires strategic planning and a good understanding of the modular system.


## Conclusion and Next Steps

The Java Platform Module System revolutionizes Java development by introducing a powerful, formal mechanism to modularize applications. With benefits ranging from improved encapsulation and dependency management to better organized and maintainable codebases, JPMS is a must-know for modern Java developers.

Now that you understand the fundamentals—what modules are, how to create and use them, manage dependencies, and control access—you are ready to deepen your knowledge. The next step involves mastering the `module-info.java` file in detail—defining exports, requires, opens, and other directives that give you full control over your modules.

Embrace JPMS to write cleaner, safer, and more scalable Java applications today!


## Frequently Asked Questions (FAQ)

#### What is the difference between Java packages and modules?

Packages group related classes and interfaces, whereas modules group related packages and define explicit boundaries and dependencies among those packages.

#### Can I use JPMS in Java versions prior to 9?

No. JPMS was introduced in Java 9. Earlier versions do not support modules natively.

#### How does JPMS improve security?

By controlling package exports and module dependencies, JPMS restricts access to internal code, reducing the risk of unauthorized access or misuse.

#### What tools support JPMS?

Modern build tools like Maven, Gradle, and IDEs like IntelliJ IDEA and Eclipse have added support for JPMS, but some older tools or frameworks may lag behind.


By integrating Java modules into your development workflow, you can harness the full power of modular programming, enabling you to build robust, maintainable, and efficient Java applications.