---
title: "Java Modules (JPMS)"
description: "Learn about Java Modules in Java programming."
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - java
courseName: "10-java-fundamentals"
showOnArticles: false
featured: false
---

![hero image](https://algomaster.io/og-image.png)

The Java Platform Module System (JPMS) is one of the most significant enhancements introduced in Java 9.

If you've been working with Java for a while, you might have felt the pain of managing large codebases and dependencies. The introduction of modules aims to make Java development more organized, secure, and manageable.

Let’s dive into what Java modules are, why they matter, and how to use them effectively.

# What Are Java Modules?

At its core, a **Java module** is a collection of related packages and resources, grouped together to encapsulate functionalities. Think of a module as a self-contained unit that exposes a specific API while hiding its implementation details.

Modules allow you to define clear boundaries in your application, making it easier to manage dependencies and control access. This concept is similar to how classes and interfaces work but at a higher level, providing a broader structural approach.

### Key Benefits of Using Modules

*   **Encapsulation**: Modules can hide internal implementation details. Only the packages you explicitly export are accessible to other modules.
*   **Improved Dependency Management**: With modules, you can specify which other modules your module depends on. This helps avoid version conflicts and reduces the risk of runtime errors.
*   **Better Organization**: Modules encourage a more organized project structure, making it easier to maintain large codebases.

### A Simple Example

```java
module math.operations {
    exports com.example.math;
}
```


Let’s say you have a simple application that includes a module for mathematical operations. Here’s how you might define such a module.

In this example, we define a module called `math.operations`, which exports the `com.example.math` package. Other modules can now rely on this math operations module and access its public classes and methods.

```java
src/
  └── math.operations/
      ├── module-info.java
      └── com/
          └── example/
              └── math/
                  └── MathOperations.java
```


# Creating and Using Modules

Now that we understand what modules are, let’s get into how to create and use them. The first step is to define your module using a `module-info.java` file, which we will discuss in detail in the next chapter.

### Directory Structure

To create a module, you need to define a specific directory structure. Here’s what it might look like for our `math.operations` module:

### Writing a Basic Module

Here’s how you might implement the `MathOperations` class inside the `com.example.math` package:

```java
// src/math.operations/com/example/math/MathOperations.java
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


This class provides basic arithmetic operations. To access these methods from another module, you’ll use the module’s exports, which we’ll cover in detail next.

### Compiling and Running Modules

To compile and run modules, you can use the `javac` and `java` commands with the `--module-path` option. Here’s how you can compile the module:

And to run a module:

This command structure helps keep your modules organized and easily runnable.

# Module Dependencies

One of the powerful features of JPMS is the ability to define dependencies between modules. When you create a module, you may need to rely on other modules. This is where the `requires` directive comes into play.

### Defining Dependencies

Let’s say we have another module called `math.utils` that provides utility functions. You would specify this dependency in your `module-info.java` like this:

### Example of a Dependent Module

```java
javac -d out --module-path out src/math.operations/module-info.java src/math.operations/com/example/math/MathOperations.java
```


Here’s how a simple `math.utils` module might look:

And the utility class:

```java
java --module-path out --module math.operations/com.example.math.MathOperations
```


### Using Dependencies

Now, if you want to use the `Utils` class in your `MathOperations`, you could modify `MathOperations` like this:

In this example, the `MathOperations` class now utilizes methods from the `math.utils` module, demonstrating how modules can communicate with one another.

```java
module math.operations {
    exports com.example.math;
    requires math.utils;  // This module depends on math.utils
}
```


# Access Control in Modules

JPMS provides a more granular level of access control compared to traditional Java package access. By default, all packages within a module are accessible only to that module. However, you can explicitly export packages to allow access from other modules.

### Exporting Packages

To export a package from a module, you use the `exports` directive in the `module-info.java` file. For instance:

If you want to keep certain packages internal, simply don’t export them. This encapsulation reduces the chances of unwanted access and misuse of your classes.

### Example of Internal Packages

```java
module math.utils {
    exports com.example.utils;
}
```


Suppose you have a package that contains classes for internal use only:

In this case, since `com.example.math.internal` is not exported, it remains hidden from other modules. This is particularly useful for maintaining the integrity of your module.

```java
// src/math.utils/com/example/utils/Utils.java
package com.example.utils;

public class Utils {
    public static void printResult(String label, int result) {
        System.out.println(label + ": " + result);
    }
}
```


# Real-World Applications

The introduction of Java modules offers many advantages that can significantly impact real-world applications. Here are a few scenarios where JPMS shines:

### Large Applications

In large-scale applications, using modules can help manage dependencies and minimize conflicts. For instance, a banking application might be split into several modules, such as `accounting`, `transactions`, and `user-management`. Each module can evolve independently, promoting better collaboration among teams.

### Microservices Architecture

In a microservices architecture, where services are independent, modules can serve a similar purpose. Each service can be a module with its own dependencies, ensuring that changes in one service do not affect others. This enhances modularity and maintainability.

### Modular Libraries

If you’re developing a library, JPMS allows you to provide a clean API while hiding implementation details. This way, users of your library only interact with the interfaces you expose, reducing the likelihood of misuse.

# Challenges and Limitations

While JPMS brings numerous benefits, it’s essential to be aware of its challenges. Here are a few aspects that can trip up developers:

1.  **Complexity**: Introducing modules can add complexity to your build and runtime processes, especially for existing applications.
2.  **Legacy Code**: Integrating JPMS into legacy systems may require significant refactoring.
3.  **Tooling Support**: Not all tools and frameworks fully support JPMS yet, which may lead to compatibility issues.

Navigating these challenges requires careful planning and understanding of your project’s structure and requirements.

Now that you understand the core concepts of Java Modules (JPMS) and how to create, manage, and utilize them effectively, you are ready to explore the intricacies of `module-info.java`.

In the next chapter, we will look at how to define module dependencies, exports, and other settings crucial for module configuration. Get ready to dive deeper into the heart of modular programming in Java!

```java
// src/math.operations/com/example/math/MathOperations.java
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


```java
module math.operations {
    exports com.example.math;  // Accessible to other modules
}
```


```java
package com.example.math.internal;

class InternalMath {
    static int multiply(int a, int b) {
        return a * b;
    }
}
```
