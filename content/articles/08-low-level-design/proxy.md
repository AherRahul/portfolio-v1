---
title: "Proxy Design Pattern"
description: "Learn how the Proxy Design Pattern optimizes resource use and access control by acting as a placeholder for resource-heavy objects, improving performance and security."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

## Understanding the Proxy Design Pattern: A Complete Guide

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)

### Introduction to the Proxy Design Pattern

The **Proxy Design Pattern** is a structural design pattern that acts as a placeholder or surrogate for another object, enabling controlled access to it. This approach is crucial when dealing with resource-intensive, remote, or sensitive components such as large images, database connections, or external APIs. By using a proxy, you can defer costly operations, add additional functionalities like logging or authorization, and maintain a clean separation of concerns without modifying the original object or client code.


In real-world applications, you often work with **resource-intensive, remote, or sensitive components** such as database connections, third-party APIs, file systems, or large in-memory datasets.

![Proxy Design Pattern](https://res.cloudinary.com/duojkrgue/image/upload/v1770568308/99751a6f-385d-41e4-9048-1edd4a4445e1.png)

Sometimes you also want to:

*   Defer or control access to the actual implementation
*   Add extra functionality (e.g., logging, authentication) without modifying existing code.

A **proxy** sits between the client and the real object, intercepting calls and optionally altering the behavior.

![Proxy Design Pattern](https://res.cloudinary.com/duojkrgue/image/upload/v1770568311/27aa8510-fff9-45e1-bdfa-f02362c852eb.png)

Let’s walk through a real-world example and see how we can apply the Proxy Pattern to build safer, smarter, and more controlled interactions with expensive or sensitive resources.



### Why Use the Proxy Pattern?

#### The Problem: Eager Loading in Resource-Heavy Applications

Imagine you're building an **image gallery application**. Users can scroll through a list of image thumbnails, and when they click on one, the **full high-resolution image** is displayed.

#### 1\. The Image Interface

We define a basic `Image` interface to support rendering behavior:

```java
interface Image {
    void display();
    String getFileName();
}
```

#### 2\. High-Resolution Image Implementation

This class represents an actual full-size image that is loaded and rendered. The moment it’s constructed, it loads the full image data — which is intentionally slow and memory-heavy.

```java
class HighResolutionImage implements Image {
    private String fileName;
    private byte[] imageData;

    public HighResolutionImage(String fileName) {
        this.fileName = fileName;
        loadImageFromDisk(); // Expensive operation!
    }

    private void loadImageFromDisk() {
        System.out.println("Loading image: " + fileName + " from disk (Expensive Operation)...");
        try {
            Thread.sleep(2000); // Simulate disk I/O delay
            this.imageData = new byte[10 * 1024 * 1024]; // Simulate 10MB memory usage
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        System.out.println("Image " + fileName + " loaded successfully.");
    }

    @Override
    public void display() {
        System.out.println("Displaying image: " + fileName);
    }

    @Override
    public String getFileName() {
        return fileName;
    }
}
```

#### 3\. The Naive Gallery App

```java
public class ImageGalleryAppV1 {
    public static void main(String[] args) {
        System.out.println("Application Started. Initializing images for gallery...");

        // Images are created eagerly – loaded even if not viewed!
        Image image1 = new HighResolutionImage("photo1.jpg");
        Image image2 = new HighResolutionImage("photo2.png");
        Image image3 = new HighResolutionImage("photo3.gif");

        System.out.println("\nGallery initialized. User might view an image now.");

        // User clicks on image1
        System.out.println("User requests to display " + image1.getFileName());
        image1.display();

        // User clicks on image3
        System.out.println("\nUser requests to display " + image3.getFileName());
        image3.display();

        System.out.println("\nApplication finished.");
    }
}
```

Take the example of an image gallery application where users browse thumbnails and view high-resolution images. The straightforward approach is to load the full image data immediately when the image object is created. However, this leads to several issues:

- **Slow startup time** as all images load upfront.
- **Excessive memory consumption** by loading images that might never be viewed.
- **Unnecessary I/O operations**, wasting bandwidth and system resources.

Additionally, without a proxy, implementing features like logging image access, caching, or permission checks requires modifying the original image class, violating principles like the Single Responsibility Principle and increasing maintenance complexity.

#### What We Need?

- **Deferred loading** of expensive objects until necessary.
- Ability to **add extra behaviors** such as logging or access control seamlessly.
- A **uniform interface** so clients remain unaware of whether they interact with a proxy or the real object.
- **No modifications** to the existing real object class.

The Proxy Pattern fulfills these requirements elegantly.


### Core Concepts of the Proxy Design Pattern

> The **Proxy Design Pattern** provides a **stand-in or placeholder** for another object to **control access** to it. Instead of the client interacting directly with the “real” object (e.g., `HighResolutionImage`), it interacts with a **Proxy** that **implements the same interface**.

This allows the proxy to perform additional responsibilities — such as **lazy initialization**, **access control**, **logging**, or **caching** **without changing the original class or the client code**.

### Class Diagram

![Proxy Class Diagram](https://res.cloudinary.com/duojkrgue/image/upload/v1770568526/16902515-4032-40bb-8ffc-6cbf93589ff1.png)

#### Key Participants

1. **Subject Interface:** Defines the common operations to be implemented by both the real object and the proxy. For example, an `Image` interface with methods like `display()` and `getFileName()`.

2. **RealSubject:** The actual resource-intensive object (e.g., `HighResolutionImage`) that performs the core work but is expensive to instantiate.

3. **Proxy:** Implements the same interface as the real object and holds a reference to it. Controls when and how the real object is created and accessed, often performing additional tasks such as lazy loading, caching, logging, or access control.

4. **Client:** Interacts with the subject interface without awareness of whether it’s dealing with the proxy or the real object, promoting decoupled and maintainable code.

#### Types of Proxies

- **Virtual Proxy:** Delays the creation of the real object until it is needed (lazy loading).
- **Protection Proxy:** Controls access based on permissions or roles.
- **Remote Proxy:** Manages communication with remote resources.
- **Caching Proxy:** Caches results to avoid costly recomputations.
- **Smart Proxy:** Adds extra logic like reference counting or logging.


### Implementing the Proxy Pattern: A Practical Example

#### Step 1: Define the Subject Interface

```java
interface Image {
    void display();
    String getFileName();
}
```

#### Step 2: Create the RealSubject Class (HighResolutionImage)

This class simulates loading a heavy resource during construction.

```java
class HighResolutionImage implements Image {
    private String fileName;
    private byte[] imageData;

    public HighResolutionImage(String fileName) {
        this.fileName = fileName;
        loadImageFromDisk();
    }

    private void loadImageFromDisk() {
        System.out.println("Loading image: " + fileName + " from disk (Expensive Operation)...");
        try {
            Thread.sleep(2000); // Simulate delay
            this.imageData = new byte[10 * 1024 * 1024]; // Simulate 10MB usage
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        System.out.println("Image " + fileName + " loaded successfully.");
    }

    @Override
    public void display() {
        System.out.println("Displaying image: " + fileName);
    }

    @Override
    public String getFileName() {
        return fileName;
    }
}
```

#### Step 3: Develop the Proxy Class (ImageProxy)

The proxy defers the loading of the real image until `display()` is called.

```java
class ImageProxy implements Image {
    private String fileName;
    private HighResolutionImage realImage;

    public ImageProxy(String fileName) {
        this.fileName = fileName;
        System.out.println("ImageProxy: Created for " + fileName + ". Real image not loaded yet.");
    }

    @Override
    public String getFileName() {
        return fileName;
    }

    @Override
    public void display() {
        if (realImage == null) {
            System.out.println("ImageProxy: display() requested for " + fileName + ". Loading high-resolution image...");
            realImage = new HighResolutionImage(fileName);
        } else {
            System.out.println("ImageProxy: Using cached high-resolution image for " + fileName);
        }
        realImage.display();
    }
}
```

#### Step 4: Modify Client to Use Proxy

```java
public class ImageGalleryAppV2 {
    public static void main(String[] args) {
        System.out.println("Application Started. Initializing image proxies for gallery...");

        Image image1 = new ImageProxy("photo1.jpg");
        Image image2 = new ImageProxy("photo2.png"); // Never displayed
        Image image3 = new ImageProxy("photo3.gif");

        System.out.println("\nGallery initialized. No images actually loaded yet.");
        System.out.println("Image 1 Filename: " + image1.getFileName());

        System.out.println("\nUser requests to display " + image1.getFileName());
        image1.display();

        System.out.println("\nUser requests to display " + image1.getFileName() + " again.");
        image1.display();

        System.out.println("\nUser requests to display " + image3.getFileName());
        image3.display();

        System.out.println("\nApplication finished. Note: photo2.png was never loaded.");
    }
}
```

#### Benefits Achieved

- **Lazy Loading:** Images load only on demand, improving startup speed and reducing memory use.
- **Transparent Interface:** Client code remains unchanged and unaware of the proxy.
- **No Modification to RealSubject:** The heavy image class remains intact and focused on its core responsibility.
- **Extensibility:** The proxy can later be extended to add logging, caching, or security features.


### Extending the Proxy Pattern: Adding More Responsibilities

#### Protection Proxy: Enforcing Access Control

The proxy can be enhanced to restrict access based on user roles or permissions without changing the real object.

```java
private boolean checkAccess(String userRole) {
    System.out.println("ProtectionProxy: Checking access for role: " + userRole + " on file: " + fileName);
    return "ADMIN".equals(userRole) || !fileName.contains("secret");
}

public void display(String userRole) {
    if (!checkAccess(userRole)) {
        System.out.println("ProtectionProxy: Access denied for " + fileName);
        return;
    }
    if (realImage == null) {
        System.out.println("ImageProxy: Loading image for authorized access...");
        realImage = new HighResolutionImage(fileName);
    }
    realImage.display();
}
```

#### Logging Proxy: Tracking Access and Usage

Adding logging helps with auditing and debugging by recording every operation transparently.

```java
@Override
public void display() {
    System.out.println("LoggingProxy: Attempting to display " + fileName + " at " + new java.util.Date());

    if (realImage == null) {
        System.out.println("ImageProxy: Lazy-loading image...");
        realImage = new HighResolutionImage(fileName);
    }

    realImage.display();

    System.out.println("LoggingProxy: Finished displaying " + fileName + " at " + new java.util.Date());
}
```

#### Combining Proxy Responsibilities

By integrating virtual, protection, and logging proxies, `ImageProxy` can become a powerful component that:

- Delays expensive operations (Virtual Proxy)
- Enforces security policies (Protection Proxy)
- Logs usage and performance metrics (Logging Proxy)

All these happen without altering the original `HighResolutionImage` or client code, preserving clean architecture and maintainability.


### Conclusion

The **Proxy Design Pattern** is an invaluable tool when you need to manage expensive or sensitive resources efficiently. By providing a stand-in that controls access and adds extra functionality, proxies help:

- Improve application performance via lazy loading.
- Enforce security and permission checks.
- Track and log resource usage for auditing.
- Maintain clean, decoupled, and extensible code bases.

Using proxies promotes adherence to key software design principles like **Single Responsibility** and **Open-Closed** principles, making your applications more robust and adaptable to changing requirements.


### Frequently Asked Questions (FAQs)

#### Q1: How is the Proxy Pattern different from the Decorator Pattern?

**Answer:** The Proxy controls access to the underlying object, often deferring creation or adding security, while the Decorator adds new behavior or responsibilities dynamically without controlling access.

#### Q2: Can multiple proxies be combined?

**Answer:** Yes, proxies can be layered or combined to add multiple responsibilities such as caching, logging, and access control simultaneously.

#### Q3: Is the Proxy Pattern only useful for resource-intensive objects?

**Answer:** While especially beneficial for heavy objects, proxies can also be used for adding security, remote access, or other cross-cutting concerns.

#### Q4: Does the Proxy Pattern add performance overhead?

**Answer:** There is minor overhead from the additional indirection, but it's typically outweighed by the gains in resource management and flexibility.


By mastering the Proxy Design Pattern, developers can build more efficient, secure, and maintainable applications that scale gracefully with complex resource demands.

## Mind Map

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770568702/NoteGPT_MindMap_1770568675901_zw96dr.png)

