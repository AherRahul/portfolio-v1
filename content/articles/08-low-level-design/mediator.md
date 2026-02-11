---
title: "Mediator Design Pattern"
description: "Learn how the Mediator Design Pattern simplifies component interaction by promoting loose coupling and centralizing communication in UI development."
datePublished: 2026-02-02
dateModified: 2026-02-02
topics:
  - lld
courseName: 08-low-level-design
showOnArticles: false
---

## Mastering the Mediator Design Pattern for Loose Coupling in UI

![Smart Watch](https://res.cloudinary.com/duojkrgue/image/upload/v1770051377/Portfolio/lldSystemDesign/LLD-banner_huzyvn.png)

### Introduction to the Mediator Design Pattern

The **Mediator Design Pattern** is a powerful behavioral design pattern used to manage complex communications between objects. It encapsulates the interactions between a set of components within a central mediator object, promoting **loose coupling** by preventing direct references between components. This pattern is especially beneficial in systems with multiple tightly coupled classes or UI elements, where changes in one component affect others.

By centralizing communication logic, the Mediator Pattern simplifies maintenance, testing, and scalability. It enables developers to vary interactions independently and build modular, reusable components, improving code clarity and robustness.

![Smart Watch](https://res.cloudinary.com/duojkrgue/image/upload/v1770803756/Portfolio/lldSystemDesign/img/bb60dd26-2cda-452d-903c-0cdc4c0d63bd.png)

It promotes **loose coupling** by preventing objects from referring to each other directly, and lets you vary their interactions independently.

It’s particularly useful in situations where:

*   You have a group of tightly coupled classes or UI components that need to communicate.
*   Changes in one component require updates in multiple others.
*   You want to centralize communication logic to simplify maintenance and testing.

When classes depend on each other directly, their interactions often become tangled.

For example, in a GUI form, when a user types into a field, it may enable or disable a button, update a label, and trigger validation — each component talking to the others directly.

But as more components are added, this direct communication becomes hard to manage, creates **spaghetti code**, and each component ends up handling its own logic plus knowledge of how to coordinate with others.

The **Mediator Pattern** solves this by introducing a **central object that handles communication between components**. Each component interacts only with the mediator, which coordinates and manages interactions — reducing coupling and simplifying each component’s logic.

Let’s walk through a real-world example to see how we can apply the Mediator Pattern to build a more modular, loosely coupled system where components communicate cleanly and consistently.

### Why Use the Mediator Pattern?

#### The Problem with Tightly Coupled Components

Consider a typical **login form** with four UI components:

- Username field
- Password field
- Login button
- Status label

The form logic requires the login button to be enabled only when both username and password fields are filled. Clicking the button should trigger login validation and update the status label accordingly.

The logic of the form is simple:

*   The **login button** should be enabled only when both username and password fields are non-empty.
*   When the button is clicked, it should attempt login and display the result in the **status label**.

Sounds simple, right? Let’s try implementing this with each component talking directly to the others.

### TextField

```java
class TextField {
    private String text = "";
    private Button loginButton;

    public void setLoginButton(Button button) {
        this.loginButton = button;
    }

    public void setText(String newText) {
        this.text = newText;
        System.out.println("TextField updated: " + text);
        if (loginButton != null) {
            loginButton.checkEnabled();
        }
    }

    public String getText() {
        return text;
    }
}
```

### Button

```java
class Button {
    private TextField usernameField;
    private TextField passwordField;
    private Label statusLabel;

    public void setDependencies(TextField username, TextField password, Label status) {
        this.usernameField = username;
        this.passwordField = password;
        this.statusLabel = status;
    }

    public void checkEnabled() {
        boolean enable = !usernameField.getText().isEmpty() &&
            !passwordField.getText().isEmpty();
        System.out.println("Login Button is now " + (enable ? "ENABLED" : "DISABLED"));
    }

    public void click() {
        if (!usernameField.getText().isEmpty() && !passwordField.getText().isEmpty()) {
            System.out.println("Login successful!");
            statusLabel.setText("✅ Logged in!");
        } else {
            System.out.println("Login failed.");
            statusLabel.setText("❌ Please enter username and password.");
        }
    }
}
```

### Label

```java
class Label {
    public void setText(String message) {
        System.out.println("Status: " + message);
    }
}
```

### What’s Wrong with This Design?

At first glance, this seems fine. But as soon as you add a few more components (e.g., remember me checkbox, forgot password link), the logic starts to spiral out of control.

**1\. Tight Coupling:** Every component **knows about others**: the `TextField` knows the `Button`, the `Button` knows the `TextField` and the `Label`. A change in one component's logic often requires updates in others — creating a fragile system.


**2\. Lack of Reusability:** You can’t easily reuse these components elsewhere. They’re hard-wired to interact with specific peers, making them **context-dependent**.


**3\. Poor Maintainability:** Adding or modifying interactions requires changing the logic of multiple classes. This violates the **Open/Closed Principle** and makes the system harder to test and evolve.


**4\. Hidden Logic Sprawled Across Components:** Each component contains not only its own logic, but also **coordinating behavior**, making it harder to isolate responsibilities.


### What We Really Need

We need a way to:

*   **Decouple UI components** from each other
*   Centralize the coordination logic so that each component **focuses only on its own role**
*   Make it easier to **add, remove, or change components or interactions** without breaking everything else

This is exactly what the **Mediator Pattern** is designed to solve.

#### Direct Communication Pitfalls

Implementing this without a mediator leads to components having direct knowledge of each other. For instance, the username and password fields notify the login button about their state, and the button updates the status label upon login attempts. While straightforward initially, adding more components like “Remember Me” checkboxes or “Forgot Password” links quickly complicates this.

**Drawbacks include:**

- **Tight Coupling:** Each component depends on others explicitly, making the system fragile.
- **Poor Reusability:** Components are context-specific and not easily reusable elsewhere.
- **Maintenance Challenges:** Modifying interactions requires changes in multiple places, violating software design principles.
- **Scattered Logic:** Coordination logic is embedded within each component, increasing complexity.


### Introducing the Mediator Pattern

The Mediator Pattern addresses these problems by introducing a **central mediator object** that handles all communication between components. Instead of components interacting directly, they notify the mediator when their state changes. The mediator then coordinates the appropriate responses.

#### Benefits of the Mediator Pattern

- **Loose Coupling:** Components do not reference each other directly.
- **Centralized Control:** Coordination logic is isolated in the mediator.
- **Improved Maintainability:** Adding or changing components requires minimal changes.
- **Enhanced Reusability:** Components are independent and easier to reuse.


### Structure of the Mediator Pattern

The key elements of the Mediator Pattern include:

**1. Mediator Interface:** Defines the contract for communication methods (e.g., `componentChanged()`) used by components to notify the mediator about state changes.

**2. Concrete Mediator:** Implements the mediator interface and manages references to all components. It contains the logic that defines how components interact.

**3. Component Base Class (Optional):** An abstract class or interface that holds a reference to the mediator and provides a method to notify it. This ensures uniform communication.

**4. Concrete Components:** Actual UI elements or modules that perform their specific roles. They communicate only with the mediator and never directly with each other.

### Class Diagram

![Mediator Class Diagram](https://res.cloudinary.com/duojkrgue/image/upload/v1770803784/Portfolio/lldSystemDesign/img/23366d97-d294-414f-9760-e385e08aff72.png)

### Applying the Mediator Pattern: Login Form Example

Let’s refactor the login form example with the Mediator Pattern to illustrate its power.

#### Step 1: Define the Mediator Interface

```java
interface UIMediator {
    void componentChanged(UIComponent component);
}
```

This interface lets components notify the mediator when their state changes.

#### Step 2: Create an Abstract Component Class

```java
abstract class UIComponent {
    protected UIMediator mediator;

    public UIComponent(UIMediator mediator) {
        this.mediator = mediator;
    }

    public void notifyMediator() {
        mediator.componentChanged(this);
    }
}
```

Each UI element extends this class to communicate with the mediator.

#### Step 3: Implement Concrete Components

- **TextField**

```java
class TextField extends UIComponent {
    private String text = "";

    public TextField(UIMediator mediator) {
        super(mediator);
    }

    public void setText(String newText) {
        this.text = newText;
        System.out.println("TextField updated: " + newText);
        notifyMediator();
    }

    public String getText() {
        return text;
    }
}
```

- **Button**

```java
class Button extends UIComponent {
    private boolean enabled = false;

    public Button(UIMediator mediator) {
        super(mediator);
    }

    public void click() {
        if (enabled) {
            System.out.println("Login Button clicked!");
            notifyMediator();
        } else {
            System.out.println("Login Button is disabled.");
        }
    }

    public void setEnabled(boolean value) {
        this.enabled = value;
        System.out.println("Login Button is now " + (enabled ? "ENABLED" : "DISABLED"));
    }
}
```

- **Label**

```java
class Label extends UIComponent {
    private String text;

    public Label(UIMediator mediator) {
        super(mediator);
    }

    public void setText(String message) {
        this.text = message;
        System.out.println("Status: " + text);
    }
}
```

#### Step 4: Implement the Concrete Mediator

```java
class FormMediator implements UIMediator {
    private TextField usernameField;
    private TextField passwordField;
    private Button loginButton;
    private Label statusLabel;

    public void setUsernameField(TextField usernameField) {
        this.usernameField = usernameField;
    }

    public void setPasswordField(TextField passwordField) {
        this.passwordField = passwordField;
    }

    public void setLoginButton(Button loginButton) {
        this.loginButton = loginButton;
    }

    public void setStatusLabel(Label statusLabel) {
        this.statusLabel = statusLabel;
    }

    @Override
    public void componentChanged(UIComponent component) {
        if (component == usernameField || component == passwordField) {
            boolean enableButton = !usernameField.getText().isEmpty() &&
                                   !passwordField.getText().isEmpty();
            loginButton.setEnabled(enableButton);
        } else if (component == loginButton) {
            String username = usernameField.getText();
            String password = passwordField.getText();

            if ("admin".equals(username) && "1234".equals(password)) {
                statusLabel.setText("✅ Login successful!");
            } else {
                statusLabel.setText("❌ Invalid credentials.");
            }
        }
    }
}
```

#### Step 5: Assemble the Application

```java
public class MediatorApp {
    public static void main(String[] args) {
        FormMediator mediator = new FormMediator();

        TextField usernameField = new TextField(mediator);
        TextField passwordField = new TextField(mediator);
        Button loginButton = new Button(mediator);
        Label statusLabel = new Label(mediator);

        mediator.setUsernameField(usernameField);
        mediator.setPasswordField(passwordField);
        mediator.setLoginButton(loginButton);
        mediator.setStatusLabel(statusLabel);

        // Simulate user input and actions
        usernameField.setText("admin");
        passwordField.setText("1234");
        loginButton.click();  // Expected: Successful login

        System.out.println("\n--- New Attempt with Wrong Password ---");
        passwordField.setText("wrong");
        loginButton.click();  // Expected: Login failure
    }
}
```

#### Expected Output

```
TextField updated: admin
Login Button is now DISABLED
TextField updated: 1234
Login Button is now ENABLED
Login Button clicked!
Status: ✅ Login successful!

--- New Attempt with Wrong Password ---
TextField updated: wrong
Login Button is now ENABLED
Login Button clicked!
Status: ❌ Invalid credentials.
```


### Advantages Realized with the Mediator Pattern

- **Loose Coupling:** Components no longer hold references to each other, making the system more flexible.
- **Centralized Communication:** The mediator manages all interaction logic, reducing complexity.
- **Separation of Concerns:** Components focus on their own behavior without managing coordination.
- **Ease of Extension:** Adding new components or modifying behaviors requires minimal changes.
- **Reusability:** Components like `TextField`, `Button`, and `Label` become reusable in other contexts.


### When to Use the Mediator Pattern

The Mediator Pattern is ideal when:

- You have multiple components with complex, intertwined communication.
- Direct coupling between components makes the code hard to maintain or extend.
- You want to centralize and simplify communication logic for better testing.
- You seek to promote reusability of components across different parts of an application.


### Conclusion

The **Mediator Design Pattern** is an essential tool in a developer’s toolkit for managing complex interactions in software systems, especially UI applications. By centralizing communication and promoting loose coupling, it enhances modularity, maintainability, and scalability.

When building systems where components frequently interact and change, adopting the Mediator Pattern can prevent "spaghetti code," reduce hidden dependencies, and make your codebase cleaner and more adaptable to future requirements.


### FAQ

**Q1: How does the Mediator Pattern differ from Observer Pattern?**  
While both patterns promote loose coupling, the Observer Pattern is focused on one-to-many dependencies and event broadcasting. The Mediator centralizes communication and controls all interactions among multiple components in a coordinated way.

**Q2: Can the Mediator Pattern be used outside UI development?**  
Yes, it is applicable in any scenario where multiple objects need coordinated interaction, such as chat systems, workflow engines, or communication protocols.

**Q3: Does the Mediator Pattern add overhead?**  
While there is some overhead due to the extra mediator layer, the benefits in code clarity and maintainability usually outweigh the cost.


Embrace the Mediator Design Pattern to create cleaner, more modular applications with well-managed component interactions!

## Mind Map



![Smart Watch](https://res.cloudinary.com/duojkrgue/image/upload/v1770805486/Portfolio/lldSystemDesign/img/NoteGPT_MindMap_1770805475462_bstbin.png)

