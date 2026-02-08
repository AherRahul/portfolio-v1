---
title: "Decorator Pattern"
description: "Learn how the Decorator Design Pattern enables dynamic, flexible feature addition without subclassing, demonstrated through a rich text renderer example."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
---

## Understanding the Decorator Design Pattern for Flexible Text Rendering

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)

### Introduction to the Decorator Pattern  

> The **Decorator Design Pattern** is a powerful **structural pattern** that allows developers to **dynamically add new behavior or responsibilities to objects** without needing to alter their original code. 

This approach is especially useful in software design when you want to extend the functionality of a class, **compose behaviors at runtime**, and avoid complex inheritance hierarchies or bloated classes filled with conditional logic.

Imagine you are building a rich text rendering system, such as a simple word processor or markdown preview tool. The core component, `TextView`, renders plain text, but requirements evolve to include features like bold, italic, underline, scrollable, or bordered text containers — often in combination. How can you design this system to be modular, flexible, and scalable?

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770566182/90c39283-6fe9-4350-a21c-103df36ae3c1.png)

It’s particularly useful in situations where:

*   You want to **extend the functionality** of a class without subclassing it.
*   You need to **compose behaviors at runtime**, in various combinations.
*   You want to avoid bloated classes filled with `if-else` logic for optional features.

Let’s walk through a real-world example to see how we can apply the Decorator Pattern to build a **modular, flexible, and easily composable system** for enhancing object functionality.


### The Problem: Adding Features to a Text Renderer

Imagine you’re building a **rich text rendering system** (like a simple word processor or a markdown preview tool). At the core of your system is a `TextView` component that renders plain text on screen.

Soon, product requirements evolve:

*   You need to support **bold** text
*   Then **italic** text
*   Then **underlined** text
*   Then **scrollable** and **bordered** text containers
*   And possibly **combinations** of those (e.g., bold + italic + underlined)

### Naive Approach: Subclassing for Every Combination

You might start by creating a base class like this:

```java
interface TextView {
    void render();
}
```

And then extend it to support new features:

**Bold Text View**

```java
class BoldTextView extends TextView {
    @Override
    public void render() {
        System.out.print("Rendering bold text");
    }
}
```

**Italic Text View**

```java
class ItalicTextView extends TextView {
    @Override
    public void render() {
        System.out.print("Rendering italic text");
    }
}
```

**BoldItalicTextView**

```java
class BoldItalicTextView extends TextView {
    @Override
    public void render() {
        System.out.print("Rendering bold + italic text");
    }
}
```


### The Challenge with Traditional Subclassing

#### Naive Approach: Subclass Explosion  
A straightforward but flawed solution is to create subclasses for each feature and their combinations:

- `BoldTextView`  
- `ItalicTextView`  
- `UnderlineTextView`  
- Combinations like `BoldItalicTextView`, `BoldUnderlineTextView`, etc.

This approach quickly leads to **class explosion**, where the number of classes grows exponentially with every new feature. For example, just four features could require managing up to 15 subclasses to cover all combinations.

#### Limitations of Subclassing  
- **Rigid design:** You cannot toggle features dynamically at runtime without complex logic or swapping objects.  
- **Violates the Open/Closed Principle:** Adding a new feature means modifying or extending existing classes, increasing maintenance risks.  
- **Unmanageable complexity:** As features grow, the inheritance tree becomes difficult to maintain and understand.

### What We Need Instead  
A design that allows:

- **Dynamic and independent addition of features** like bold, italic, or underline.  
- **Flexible composition at runtime**, enabling any combination of features.  
- **Avoidance of class explosion** and adherence to the Open/Closed Principle.  

The **Decorator Pattern** perfectly addresses these needs by wrapping objects with decorators that add behaviors dynamically.

## The Decorator Pattern Explained

### Core Concept  

> The Decorator Pattern attaches additional responsibilities to an object **dynamically**, without changing its structure. It wraps the original object inside a decorator object that shares the same interface and adds behavior before or after delegating to the wrapped object.

This creates a **layered effect** where multiple decorators can be stacked to apply several enhancements in any order, avoiding complex inheritance.

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770566260/6067d892-95b0-4d1c-b72f-52a3bf235556.png)

> #### Real-World Analogy  
> Think of a plain coffee. You add milk, then sugar. Each addition enhances the coffee's flavor without changing the original drink. Similarly, decorators add new behaviors around an object without modifying it.

### Components of the Decorator Pattern

- **1. Component Interface:** Defines the common interface for both the core object and decorators. In our example, `TextView` declares the `render()` method.
- **2. Concrete Component:** The base object implementing the component interface, e.g., `PlainTextView`, which renders plain text.
- **3. Base Decorator (Abstract):** Implements the component interface and holds a reference to a component object. It forwards calls to this wrapped component.
- **4. Concrete Decorators:** Extend the base decorator and add specific functionality, like `BoldDecorator`, `ItalicDecorator`, or `UnderlineDecorator`.
- **5. Client:** Creates and composes decorators at runtime to combine desired behaviors flexibly.


## Implementing the Decorator Pattern in Java
Let’s implement the **Decorator Pattern** to enable flexible styling of text elements — such as bold, italic, underline, and combinations of these — all without subclassing or modifying the core text rendering logic.


### Step 1: Define the Component Interface  

This interface will be used by both the base component and all decorators. It defines the `render()` method that displays the text.

```java
interface TextView {
    void render();
}
```

### Step 2: Implement the Concrete Component  

This is the base class that renders plain text. It implements the `TextView` interface and contains the core content to be displayed.


```java
class PlainTextView implements TextView {
    private final String text;

    public PlainTextView(String text) {
        this.text = text;
    }

    @Override
    public void render() {
        System.out.print(text);
    }
}
```

This class simply renders plain text.

### Step 3: Create the Abstract Decorator 

This class also implements `TextView` and holds a reference to another `TextView` component. It forwards calls to the wrapped component.


```java
abstract class TextDecorator implements TextView {
    protected final TextView inner;

    public TextDecorator(TextView inner) {
        this.inner = inner;
    }
}
```

The decorator holds a reference to a `TextView` and will delegate calls to it.

### Step 4: Implement Concrete Decorators

Each decorator adds a specific formatting layer before or after calling the wrapped component's `render()` method.


#### Bold Decorator  
```java
class BoldDecorator extends TextDecorator {
    public BoldDecorator(TextView inner) {
        super(inner);
    }

    @Override
    public void render() {
        System.out.print("<b>");
        inner.render();
        System.out.print("</b>");
    }
}
```

#### Italic Decorator  
```java
class ItalicDecorator extends TextDecorator {
    public ItalicDecorator(TextView inner) {
        super(inner);
    }

    @Override
    public void render() {
        System.out.print("<i>");
        inner.render();
        System.out.print("</i>");
    }
}
```

#### Underline Decorator  
```java
class UnderlineDecorator extends TextDecorator {
    public UnderlineDecorator(TextView inner) {
        super(inner);
    }

    @Override
    public void render() {
        System.out.print("<u>");
        inner.render();
        System.out.print("</u>");
    }
}
```

### Step 5: Compose Decorators in Client Code  

The client composes the desired formatting by wrapping decorators dynamically at runtime. This avoids subclass explosion and provides full control over order and combination.


```java
public class TextRendererApp {
    public static void main(String[] args) {
        TextView text = new PlainTextView("Hello, World!");

        System.out.print("Plain: ");
        text.render();
        System.out.println();

        System.out.print("Bold: ");
        TextView boldText = new BoldDecorator(text);
        boldText.render();
        System.out.println();

        System.out.print("Italic + Underline: ");
        TextView italicUnderline = new UnderlineDecorator(new ItalicDecorator(text));
        italicUnderline.render();
        System.out.println();

        System.out.print("Bold + Italic + Underline: ");
        TextView allStyles = new UnderlineDecorator(new ItalicDecorator(new BoldDecorator(text)));
        allStyles.render();
        System.out.println();
    }
}
```

#### Sample Output:  
```shell
Plain: Hello, World!  
Bold: <b>Hello, World!</b>  
Italic + Underline: <u><i>Hello, World!</i></u>  
Bold + Italic + Underline: <u><i><b>Hello, World!</b></i></u>  
```

## Benefits of Using the Decorator Pattern
- **Dynamic Layering**: Decorators can be added, removed, or combined at runtime, providing maximum flexibility.
- **Modular Design**: Each decorator encapsulates a single behavior or responsibility, making the code easier to maintain and extend.
- **Avoided Class Explosion**: No need to create a subclass for every possible feature combination; decorators can be stacked dynamically.
- **Adherence to Open/Closed Principle**: New decorators can be added without modifying existing code, reducing the risk of bugs and regressions.
- **Highly Flexible and Reusable**: Any combination and ordering of features is possible, enabling rich and customizable behavior.


## Practical Use Cases Beyond Text Rendering
- **Graphical User Interfaces:** Adding borders, scrollbars, shadows, or other visual effects dynamically.  
- **Streams and I/O:** Wrapping input/output streams with buffering, compression, or encryption functionalities.  
- **Logging:** Adding different logging behaviors dynamically without modifying the core business logic.  
- **Notification Systems:** Combining SMS, email, and push notifications as decorators.

## Conclusion

The Decorator Pattern is an elegant and powerful design solution for adding responsibilities to objects **dynamically and transparently**. By wrapping core components with decorators, you achieve modular, flexible, and maintainable code without the drawbacks of an extensive subclass hierarchy.

In our rich text rendering example, the pattern enables any combination of text styles like bold, italic, and underline, composed at runtime, aligning perfectly with modern software design principles.

Embracing the Decorator Pattern in your projects will help you build scalable systems that are easier to extend and customize, ultimately enhancing software quality and developer productivity.

## Mind Map

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770566507/NoteGPT_MindMap_1770566483685_dqw96i.png)

