---
title: "Flyweight Pattern"
description: "Learn how the Flyweight Design Pattern optimizes memory by sharing common object data, boosting performance in text editors and similar high-volume applications."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

## Mastering the Flyweight Pattern for Efficient Memory Use in Java

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)

### Introduction to the Flyweight Design Pattern

In software development, especially when building applications that handle massive numbers of similar objects, managing memory efficiently becomes crucial. The **Flyweight Design Pattern** is a powerful **structural pattern** designed to tackle this exact challenge by sharing common parts of an object’s state across many instances. This strategy reduces memory consumption and boosts application performance.

If you’ve ever wondered how text editors, map applications, or game engines manage thousands—even millions—of similar objects without exhausting system resources, the Flyweight Pattern is often the answer.


It’s particularly useful in situations where:

*   You need to create a **large number of similar objects**, but most of their data is **shared or repeated**.
*   Storing all object data individually would result in high memory consumption.
*   You want to **separate intrinsic state** (shared, reusable data) from **extrinsic state** (context-specific, passed in at runtime).

When building high-volume systems like text editors (with thousands of character glyphs), map applications (with repeated icons or tiles), or game engines (with many similar objects like trees or particles), developers often instantiate **huge numbers of objects** many of which are functionally identical.

But this can lead to significant performance issues, excessive memory allocation, and poor scalability especially when most of these objects **differ only by a few small, context-specific values**.

The **Flyweight Pattern** solves this by sharing common state (the **intrinsic** part) across all similar objects and externalizing unique data (the **extrinsic** part). It allows you to create **lightweight objects** by caching and reusing instances instead of duplicating data.

Let’s walk through a real-world example to see how we can apply the Flyweight Pattern to drastically reduce memory usage and create scalable object-heavy systems.


### Understanding the Problem: Rendering Characters in a Text Editor

Imagine developing a rich text editor, similar to Google Docs or Microsoft Word. The editor must render potentially hundreds of thousands of characters, each having properties such as:

- Font family (e.g., Arial, Times New Roman)  
- Font size  
- Color  
- Style (bold, italic)  
- Position on screen (x, y coordinates)


A naive implementation might look like this:

```java
class CharacterGlyph {
    private char symbol;          // e.g., 'a', 'b', etc.
    private String fontFamily;    // e.g., "Arial"
    private int fontSize;         // e.g., 12
    private String color;         // e.g., "#000000"
    private int x;                // position X
    private int y;                // position Y

    public CharacterGlyph(char symbol, String fontFamily, int fontSize, String color, int x, int y) {
        this.symbol = symbol;
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.color = color;
        this.x = x;
        this.y = y;
    }

    public void draw() {
        System.out.println("Drawing '" + symbol + "' in " + fontFamily +
            ", size " + fontSize + ", color " + color + " at (" + x + "," + y + ")");
    }
}
```

Now imagine rendering a **10-page document** with **500,000 characters**. Even if most characters share the same font, size, and color — you’re still allocating **half a million objects**, most of which contain **duplicate formatting data**.

A naive approach involves creating an object for every character, each storing all these properties individually. For a large document with hundreds of thousands of characters, this leads to:

- **High Memory Usage:** Repeated storage of identical formatting data wastes enormous amounts of memory.
- **Performance Bottlenecks:** Managing millions of objects puts pressure on Java’s Garbage Collector (GC) and degrades cache performance, slowing down the system.
- **Poor Scalability:** Opening larger documents or multiple files simultaneously becomes impractical due to ballooning memory requirements.
- **What is Needed?:** A solution that allows sharing of common data (like font and color) across many characters, while keeping only unique data (like position) stored individually.


### What is the Flyweight Pattern?

The **Flyweight Pattern** minimizes memory usage by sharing as much data as possible between similar objects. Instead of duplicating identical data for each object, it extracts the common parts (intrinsic state) and keeps them in shared flyweight objects. The unique parts (extrinsic state) are supplied externally when needed.

### Class Diagram

![Flyweight Class Diagram](https://res.cloudinary.com/duojkrgue/image/upload/v1770570088/8feed14c-3a56-491a-a387-dd74cde1c431.png)

#### Key Concepts:

- **Intrinsic State:** Shared, immutable data common to many objects (e.g., font style, size, character symbol).  
- **Extrinsic State:** Context-dependent data passed at runtime (e.g., position coordinates on screen).  
- **Flyweight Factory:** Manages creation and reuse of flyweight objects, ensuring no duplicates.  
- **Client:** Uses flyweights combined with extrinsic state to perform tasks like rendering.

#### How it Works:

Instead of each character object storing all its data, characters with the same font, size, and color share a single flyweight object representing that combination. Their unique positions are passed externally when drawing.


### Implementing the Flyweight Pattern in Java

Let’s build a simplified model of a text editor rendering characters efficiently using the Flyweight Pattern.

#### 1. Define the Flyweight Interface

The interface declares a method to draw a character, accepting extrinsic state (position).

```java
interface CharacterFlyweight {
    void draw(int x, int y);
}
```

#### 2. Implement the Concrete Flyweight

This class stores intrinsic state: character symbol, font family, size, and color.

```java
class CharacterGlyph implements CharacterFlyweight {
    private final char symbol;
    private final String fontFamily;
    private final int fontSize;
    private final String color;

    public CharacterGlyph(char symbol, String fontFamily, int fontSize, String color) {
        this.symbol = symbol;
        this.fontFamily = fontFamily;
        this.fontSize = fontSize;
        this.color = color;
    }

    @Override
    public void draw(int x, int y) {
        System.out.println("Drawing '" + symbol + "' [Font: " + fontFamily +
            ", Size: " + fontSize + ", Color: " + color + "] at (" + x + "," + y + ")");
    }
}
```

All glyphs with the same font and character reuse the same object.

#### 3. Create the Flyweight Factory

The factory ensures flyweights are shared and reused. It checks whether a flyweight with a given set of intrinsic values already exists and returns it, or creates a new one if it doesn’t.

```java
class CharacterFlyweightFactory {
    private final Map<String, CharacterFlyweight> flyweightMap = new HashMap<>();

    public CharacterFlyweight getFlyweight(char symbol, String fontFamily, int fontSize, String color) {
        String key = symbol + fontFamily + fontSize + color;
        flyweightMap.putIfAbsent(key, new CharacterGlyph(symbol, fontFamily, fontSize, color));
        return flyweightMap.get(key);
    }

    public int getFlyweightCount() {
        return flyweightMap.size();
    }
}
```

#### 4. Build the Client

The client is responsible for rendering the document. It:

- Retrieves flyweight objects from the factory
- Combines each flyweight with position-specific data (extrinsic state)
- Stores RenderedCharacter objects that contain a flyweight and coordinates

```java
class TextEditorClient {
    private final CharacterFlyweightFactory factory = new CharacterFlyweightFactory();
    private final List<RenderedCharacter> document = new ArrayList<>();

    public void addCharacter(char c, int x, int y, String font, int size, String color) {
        CharacterFlyweight glyph = factory.getFlyweight(c, font, size, color);
        document.add(new RenderedCharacter(glyph, x, y));
    }

    public void renderDocument() {
        for (RenderedCharacter rc : document) {
            rc.render();
        }
        System.out.println("Total flyweight objects used: " + factory.getFlyweightCount());
    }

    private static class RenderedCharacter {
        private final CharacterFlyweight glyph;
        private final int x, y;

        public RenderedCharacter(CharacterFlyweight glyph, int x, int y) {
            this.glyph = glyph;
            this.x = x;
            this.y = y;
        }

        public void render() {
            glyph.draw(x, y);
        }
    }
}
```

#### 5. Test the Flyweight Pattern

Render two words with different formatting styles.

```java
public class FlyweightDemo {
    public static void main(String[] args) {
        TextEditorClient editor = new TextEditorClient();

        // Render "Hello" with Arial font
        String word = "Hello";
        for (int i = 0; i < word.length(); i++) {
            editor.addCharacter(word.charAt(i), 10 + i * 15, 50, "Arial", 14, "#000000");
        }

        // Render "World" with Times New Roman font and blue color
        String word2 = "World";
        for (int i = 0; i < word2.length(); i++) {
            editor.addCharacter(word2.charAt(i), 10 + i * 15, 100, "Times New Roman", 14, "#3333FF");
        }

        editor.renderDocument();
    }
}
```

#### Expected Output

```
Drawing 'H' [Font: Arial, Size: 14, Color: #000000] at (10, 50)
Drawing 'e' [Font: Arial, Size: 14, Color: #000000] at (25, 50)
Drawing 'l' [Font: Arial, Size: 14, Color: #000000] at (40, 50)
Drawing 'l' [Font: Arial, Size: 14, Color: #000000] at (55, 50)
Drawing 'o' [Font: Arial, Size: 14, Color: #000000] at (70, 50)
Drawing 'W' [Font: Times New Roman, Size: 14, Color: #3333FF] at (10, 100)
Drawing 'o' [Font: Times New Roman, Size: 14, Color: #3333FF] at (25, 100)
Drawing 'r' [Font: Times New Roman, Size: 14, Color: #3333FF] at (40, 100)
Drawing 'l' [Font: Times New Roman, Size: 14, Color: #3333FF] at (55, 100)
Drawing 'd' [Font: Times New Roman, Size: 14, Color: #3333FF] at (70, 100)
Total flyweight objects used: 8
```

Notice that although 10 characters were rendered, only 8 flyweight objects were created due to shared formatting.


### Benefits of Using the Flyweight Pattern

#### 1. Memory Efficiency  
By sharing common formatting data, you avoid redundant storage and significantly reduce memory footprint.

#### 2. Enhanced Performance  
Fewer objects mean less overhead for garbage collection and improved cache utilization, resulting in faster rendering.

#### 3. Clear Separation of Concerns  
Intrinsic (shared) and extrinsic (unique) states are cleanly divided, making the system easier to maintain and extend.

#### 4. Scalability  
Your application can handle documents with thousands or millions of characters without exhausting resources.

#### 5. Reusability  
Flyweights representing common characters and styles are reused across the system, promoting consistency.


### When to Use the Flyweight Pattern

- When your application creates a large number of similar objects that share a lot of data.  
- When memory consumption is a concern due to object duplication.  
- When you can separate object state into intrinsic (shared) and extrinsic (unique) parts.  
- Common in text editors, graphical applications, game development, and map rendering.


### Conclusion

The Flyweight Design Pattern is an essential tool for developers aiming to build memory-efficient and high-performance applications that manage numerous similar objects. By sharing intrinsic state and externalizing extrinsic state, you can drastically reduce memory usage, improve scalability, and maintain clean, modular code.

Implementing this pattern in Java, as shown with our text editor example, demonstrates how effective and practical the Flyweight Pattern can be in solving real-world challenges.

Start applying the Flyweight Pattern today to optimize your object-heavy applications and unlock better performance and resource utilization!


### Frequently Asked Questions (FAQ)

#### Q1: What is the main advantage of the Flyweight Pattern?  
**A:** It reduces memory usage by sharing common data between many objects, preventing duplication.

#### Q2: What is the difference between intrinsic and extrinsic state?  
**A:** Intrinsic state is shared and stored inside the flyweight; extrinsic state is unique and supplied by the client during runtime.

#### Q3: Can the Flyweight Pattern be used in languages other than Java?  
**A:** Yes, it’s a language-agnostic design pattern and can be implemented in any object-oriented language.

#### Q4: Is the Flyweight Pattern useful only for characters or text rendering?  
**A:** No, it’s applicable wherever many similar objects with shared state exist, such as game entities, UI components, and map tiles.


By understanding and applying the Flyweight Pattern, you can build more efficient, scalable, and maintainable systems, especially when dealing with large volumes of objects in resource-constrained environments.

## Mind Map

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1770570291/NoteGPT_MindMap_1770570275822_gk0gh4.png)
