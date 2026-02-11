---
title: "Memento Pattern"
description: "Learn how the Memento Design Pattern enables efficient undo functionality by capturing and restoring object states without breaking encapsulation."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

## Mastering the Memento Pattern for Robust Undo Functionality

![Smart Watch](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)


### Introduction  
The Memento Design Pattern is a powerful behavioral design pattern that allows an object to save and restore its internal state without exposing its implementation details. This capability is essential in applications requiring undo/redo operations, version control, or state checkpointing. In this post, we will explore the Memento Pattern in-depth, demonstrate its benefits over naive implementations, and provide a step-by-step guide on how to implement it effectively using a text editor example.


It’s particularly useful in situations where:

*   You need to implement **undo/redo** functionality.
*   You want to support **checkpointing or versioning** of an object’s state.
*   You want to separate the concerns of **state storage** from **state management logic**.

Let’s walk through a real-world example to see how we can apply the Memento Pattern to solve a real-world problem that involves implementing undo functionality in a text editor.


### 1. Understanding the Problem: Undo in Text Editors

Imagine building a simple text editor that supports basic operations: typing text, retrieving content, and, importantly, undoing changes. While typing and retrieving content are straightforward, implementing undo functionality introduces complexity. The challenge lies in efficiently capturing the editor’s state at various points and restoring it without exposing or compromising the internal state.


### 2. Limitations of Naive Undo Implementations

#### 2.1 Manual Snapshots and Its Drawbacks  
A simple approach to undo involves the client manually capturing snapshots of the document’s content and restoring them when needed. For example:

```java
class TextEditorNaive {
    private String content = "";

    public void type(String newText) {
        content += newText;
    }

    public void undo(String previousContent) {
        content = previousContent;
    }

    public String getContent() {
        return content;
    }
}
```
### Example Usage

```java
public class TextEditorUndoV1 {
    public static void main(String[] args) {
        TextEditorNaive editor = new TextEditorNaive();

        editor.type("Hello");
        String snapshot1 = editor.getContent(); // manual snapshot

        editor.type(" World");
        String snapshot2 = editor.getContent();

        System.out.println("Current Content: " + editor.getContent()); // Hello World

        // Undo 1 step
        editor.undo(snapshot1);
        System.out.println("After Undo: " + editor.getContent()); // Hello
    }
}
```

The client is responsible for capturing the content at checkpoints and passing it back for undo operations.

### 2.2 Why This Approach Fails

While this naive implementation works for very basic undo logic, it introduces several **major issues**:

#### 1\. Encapsulation is Broken

*   The client must **manually fetch and store internal state** (`getContent()`) just to implement undo.
*   This exposes implementation details and **violates the principle of information hiding**.

#### 2\. Manual Snapshot Management

*   The client is responsible for managing previous versions of the content.
*   This makes undo logic **error-prone** and tightly coupled to the editor’s internal structure.

#### 3\. Not Scalable

*   What if you want to undo **multiple actions** (not just one)?
*   Or restore **cursor position, formatting, and selection** along with content?You’d need to **extend the snapshot logic**, leaking even more of the editor’s internal state into the client.

### What We Really Need

We need a solution that allows:

*   The **TextEditor** to expose a safe way to **capture and restore its state**
*   The **client** to manage these states (snapshots) **without knowing or touching internal fields**
*   Undo/redo to be implemented in a way that is **scalable, maintainable, and encapsulated**

This is exactly what the **Memento Pattern** is designed to solve.

### 3. Overview of the Memento Design Pattern

The Memento Pattern provides a clean solution by encapsulating the state-saving mechanism inside the object itself, while providing a separate caretaker to manage these snapshots. This ensures:

- State is captured and restored safely.
- Internal state details remain hidden.
- Undo/redo and versioning features are easier to implement and maintain.

> **Definition:** The Memento Pattern allows an object (Originator) to save and restore its internal state without exposing its internal structure, using a separate Memento object to store the state and a Caretaker to manage these mementos.


### 4. Components of the Memento Pattern

### Class Diagram

![Memento Class Diagram](https://res.cloudinary.com/duojkrgue/image/upload/v1770806316/Portfolio/lldSystemDesign/img/ca5b9178-9e22-4290-b999-601eaa0ebd68.png)

#### 1\. Originator (e.g., `TextEditor`)

The object whose internal state you want to **capture and restore later**. It is responsible for:

*   Creating a **memento** that captures its current state
*   Restoring its state from a memento when needed (e.g., during an undo operation)

It encapsulates the logic to decide **what state to save**, ensuring the client or caretaker never has access to its internals.

#### 2\. Memento

*   A **passive object** that holds the **snapshot of the Originator’s state** at a given point in time.
*   It **does not expose** any methods to modify its state.
*   Only the Originator can access the internal state inside the memento.

#### 3\. ConcreteMemento (Optional)

*   In more complex systems, the Memento might be defined via an **interface or abstract class**, and a `ConcreteMemento` provides the actual implementation.
*   This allows for future extensibility or multiple types of mementos.
*   In many simple use cases (like ours), the Memento itself acts as the concrete implementation.

#### 4\. Caretaker

*   The **Caretaker** is responsible for **storing, managing, and restoring** mementos.
*   It never examines or modifies the content of a memento, it just treats it as a black box.


### 5. Implementing the Memento Pattern: A Step-by-Step Guide

Let’s refactor our naive text editor into a clean, maintainable design using the **Memento Pattern**.

Our goal is to enable undo functionality in a way that is:

*   **Encapsulated** – the editor’s internal state remains private.
*   **Flexible** – the editor can save and restore snapshots.
*   **Safe** – the client doesn’t manipulate state directly.

#### 5.1\. Create the Memento Class - `TextEditorMemento`

The **memento** stores a snapshot of the `TextEditor`'s internal state. It is usually:

*   **Immutable** – fields are `private final` and not modifiable after creation.
*   **Minimal** – it stores only the state required for restoration.
*   **Encapsulated** – only the originator (the `TextEditor`) should know how to use it.


```java
class TextEditorMemento {
    private final String state;

    public TextEditorMemento(String state) {
        this.state = state;
    }

    public String getState() {
        return state;
    }
}
```

#### 5.2 Developing the Originator: TextEditor

The originator is the object whose state we want to save and restore. It provides:

*   A method to **create** a memento representing its current state.
*   A method to **restore** its state from a given memento.

```java
class TextEditor {
    private String content = "";

    public void type(String newText) {
        content += newText;
        System.out.println("Typed: " + newText);
    }

    public String getContent() {
        return content;
    }

    public TextEditorMemento save() {
        System.out.println("Saving state: \"" + content + "\"");
        return new TextEditorMemento(content);
    }

    public void restore(TextEditorMemento memento) {
        content = memento.getState();
        System.out.println("Restored state to: \"" + content + "\"");
    }
}
```

#### 5.3 Implementing the Caretaker: TextEditorUndoManager

This class manages the undo stack. It is responsible for:

*   Managing the **history of states** (mementos).
*   Calling the originator's `save()` and `restore()` methods at the right time.
*   **Not inspecting or modifying** the internal state itself.

```java
class TextEditorUndoManager {
    private final Stack<TextEditorMemento> history = new Stack<>();

    public void save(TextEditor editor) {
        history.push(editor.save());
    }

    public void undo(TextEditor editor) {
        if (!history.isEmpty()) {
            editor.restore(history.pop());
        } else {
            System.out.println("Nothing to undo.");
        }
    }
}
```

#### 5.4 Client Code: Using the Editor with Undo Support

```java
public class TextEditorUndoV2 {
    public static void main(String[] args) {
        TextEditor editor = new TextEditor();
        TextEditorUndoManager undoManager = new TextEditorUndoManager();

        editor.type("Hello");
        undoManager.save(editor);

        editor.type(" World");
        undoManager.save(editor);

        editor.type("!");
        System.out.println("Current Content: " + editor.getContent());

        System.out.println("\n--- Undo 1 ---");
        undoManager.undo(editor);

        System.out.println("\n--- Undo 2 ---");
        undoManager.undo(editor);

        System.out.println("\n--- Undo 3 ---");
        undoManager.undo(editor);
    }
}
```

#### 5.5 Sample Output

```
Typed: Hello
Saving state: "Hello"
Typed:  World
Saving state: "Hello World"
Typed: !
Current Content: Hello World!

--- Undo 1 ---
Restored state to: "Hello World"

--- Undo 2 ---
Restored state to: "Hello"

--- Undo 3 ---
Nothing to undo.
```


### 6. Advantages and Best Practices

**1. Encapsulation Preserved:** The Originator manages its state internally, and clients never access or modify it directly.

**2. Simplified Client Logic:** The caretaker handles state history, freeing the client from manual snapshot management.

**3. Scalability and Flexibility:** The design supports multi-level undo/redo, versioning, and can be extended to include other state details like cursor position or formatting.

**4. Maintainability:** Clear separation of concerns makes the codebase easier to maintain and evolve.

**5. Immutability:** Mementos should be immutable to prevent accidental modifications.


### 7. Conclusion

The Memento Design Pattern is an elegant, reliable solution for implementing undo functionality and managing object states in software design. By encapsulating state snapshots inside memento objects and delegating their management to a caretaker, it ensures robust, scalable, and maintainable code. Whether you’re designing a text editor, graphic tool, or any application requiring state rollback, the Memento Pattern is a fundamental pattern every developer should master.


### FAQ

**Q1: Can the Memento Pattern be used for redo functionality?**  
Yes, by maintaining separate stacks for undo and redo, the caretaker can manage both operations.

**Q2: Is it necessary to expose the Memento to the client?**  
No, the memento should remain opaque to the client to preserve encapsulation.

**Q3: How to handle large states efficiently?**  
Consider using delta snapshots or compressing state data to optimize memory usage.


By implementing the Memento Pattern thoughtfully, you can provide seamless undo/redo capabilities while maintaining clean, well-encapsulated code.

## Mind Map

![Memento Class Diagram](https://res.cloudinary.com/duojkrgue/image/upload/v1770806340/Portfolio/lldSystemDesign/img/NoteGPT_MindMap_1770806313604_dnh6xj.png)


