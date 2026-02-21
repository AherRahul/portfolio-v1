---
title: Callback Functions & Event Listeners
description: Callback functions are the foundation of asynchronous JavaScript
  and event-driven programming. Understanding how callbacks work with event
  listeners is essential for building interactive web applications.
slidesUrl: https://github.com/AherRahul/portfolio-v1/blob/main/content/articles
dateModified: 2026-02-21
datePublished: 2026-02-21
showOnArticles: false
courseName: 00-understand-javascript-complete
topics:
  - javascript
resources:
  - title: JS course PDF - 16
    type: PDF
    url: https://res.cloudinary.com/duojkrgue/image/upload/v1758792130/Portfolio/javaScriptCourse/pdf/JavaScript-day16_Callbacks_compressed.pdf
    description: A PDF Notes on Callback Functions & Event Listeners topic
  - title: MDN - Callback Functions
    type: documentation
    url: https://developer.mozilla.org/en-US/docs/Glossary/Callback_function
    description: Complete guide to callback functions from MDN
  - title: MDN - Event Listeners
    type: documentation
    url: https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
    description: Complete reference for addEventListener and event handling
  - title: JavaScript.info - Introduction to Events
    type: article
    url: https://javascript.info/introduction-browser-events
    description: Comprehensive guide to browser events and event handling
published: false
---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758811617/Portfolio/javaScriptCourse/images/all%20title%20images/17_d5t5i3.png)

Callback Functions & Event Listeners – The Messengers of JavaScript
===================================================================

Imagine you're the **manager of a busy restaurant** 🍽️ where different things happen throughout the day:

- When a **customer enters**, someone should greet them
- When **food is ready**, someone should deliver it
- When the **phone rings**, someone should answer it
- When it's **closing time**, someone should clean up

You can't be everywhere at once, so you give your staff **specific instructions**: "Hey Sarah, **when the phone rings, answer it**" or "John, **when the food is ready, take it to table 5**."

In JavaScript, **callback functions** work exactly like these instructions! They're functions that you "hand over" to someone else (the browser, an API, or another function) with the message: "**When this specific thing happens, call this function**."

**Event listeners** are like your most reliable staff members – they sit patiently, watching for specific events, and when those events occur, they immediately execute the callback functions you gave them.

## What Are Callback Functions? 📞

A **callback function** is a function that is passed as an argument to another function and is executed at a specific time or when a specific event occurs. Think of it as a **"call me back when you're done"** instruction.

### Basic Callback Example 📋

```javascript
// Simple callback function
function greetUser(name, callback) {
    console.log(`Hello, ${name}!`);
    
    // After greeting, call the callback
    callback();
}

function sayGoodbye() {
    console.log("Goodbye! Have a great day!");
}

// Pass sayGoodbye as a callback to greetUser
greetUser("Alice", sayGoodbye);

// Output:
// Hello, Alice!
// Goodbye! Have a great day!
```

### Callbacks with Parameters 📝

```javascript
// Callback that receives data
function processUserData(userId, callback) {
    // Simulate fetching user data
    setTimeout(() => {
        const userData = {
            id: userId,
            name: "Alice",
            email: "alice@example.com"
        };
        
        // Call the callback with the fetched data
        callback(userData);
    }, 1000);
}

function displayUser(user) {
    console.log(`User: ${user.name} (${user.email})`);
}

function saveUserToLocalStorage(user) {
    localStorage.setItem(`user_${user.id}`, JSON.stringify(user));
    console.log("User saved to local storage");
}

// Different callbacks for different purposes
processUserData(123, displayUser);
processUserData(456, saveUserToLocalStorage);
```

### Anonymous Callbacks 🎭

```javascript
// Using anonymous functions as callbacks
setTimeout(function() {
    console.log("This runs after 2 seconds");
}, 2000);

// Arrow function callbacks
setTimeout(() => {
    console.log("This also runs after 2 seconds");
}, 2000);

// Inline callback with logic
[1, 2, 3, 4, 5].forEach(function(number) {
    if (number % 2 === 0) {
        console.log(`${number} is even`);
    } else {
        console.log(`${number} is odd`);
    }
});
```

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758818890/Portfolio/javaScriptCourse/images/16/callback_flow.png)

## Understanding Event Listeners 👂

**Event listeners** are special callback functions that "listen" for specific events to occur in the browser. They're like security guards who watch for particular activities and respond accordingly.

### Basic Event Listener Syntax 🎯

```javascript
// Basic syntax: element.addEventListener(event, callback, options)

const button = document.getElementById('myButton');

// Add a click event listener
button.addEventListener('click', function() {
    console.log('Button was clicked!');
});

// Arrow function version
button.addEventListener('click', () => {
    console.log('Button was clicked with arrow function!');
});

// Named function as callback
function handleButtonClick() {
    console.log('Button was clicked with named function!');
}

button.addEventListener('click', handleButtonClick);
```

### Event Object – The Message Carrier 📨

```javascript
const button = document.getElementById('actionButton');

button.addEventListener('click', function(event) {
    console.log('Event object:', event);
    console.log('Event type:', event.type);           // "click"
    console.log('Target element:', event.target);     // The button element
    console.log('Timestamp:', event.timeStamp);       // When the event occurred
    console.log('Mouse coordinates:', event.clientX, event.clientY);
    
    // Prevent default behavior (if any)
    event.preventDefault();
    
    // Stop event from bubbling up
    event.stopPropagation();
});

// Form submit event with event object
const form = document.getElementById('myForm');

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form from submitting normally
    
    const formData = new FormData(event.target);
    console.log('Form data:', Object.fromEntries(formData));
});
```

### Multiple Event Types 🎪

```javascript
const input = document.getElementById('textInput');

// Different events for the same element
input.addEventListener('focus', function() {
    console.log('Input focused');
    this.style.backgroundColor = '#e3f2fd';
});

input.addEventListener('blur', function() {
    console.log('Input lost focus');
    this.style.backgroundColor = '';
});

input.addEventListener('input', function(event) {
    console.log('Input value changed:', event.target.value);
});

input.addEventListener('keydown', function(event) {
    console.log('Key pressed:', event.key);
    
    if (event.key === 'Enter') {
        console.log('Enter key pressed!');
    }
});

// Mouse events
const div = document.getElementById('interactiveDiv');

div.addEventListener('mouseenter', () => console.log('Mouse entered'));
div.addEventListener('mouseleave', () => console.log('Mouse left'));
div.addEventListener('mouseover', () => console.log('Mouse over'));
div.addEventListener('mouseout', () => console.log('Mouse out'));
```

## Practical Callback Patterns 🛠️

### 1. Array Methods with Callbacks 📊

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

// map: Transform each element
const doubled = numbers.map(function(number) {
    return number * 2;
});
console.log(doubled); // [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]

// filter: Select elements that meet criteria
const evenNumbers = numbers.filter(function(number) {
    return number % 2 === 0;
});
console.log(evenNumbers); // [2, 4, 6, 8, 10]

// reduce: Combine all elements into single value
const sum = numbers.reduce(function(accumulator, current) {
    return accumulator + current;
}, 0);
console.log(sum); // 55

// forEach: Execute function for each element
numbers.forEach(function(number, index) {
    console.log(`Index ${index}: ${number}`);
});

// find: Get first element that matches
const firstEven = numbers.find(function(number) {
    return number % 2 === 0;
});
console.log(firstEven); // 2

// some: Check if any element matches
const hasEvenNumbers = numbers.some(function(number) {
    return number % 2 === 0;
});
console.log(hasEvenNumbers); // true

// every: Check if all elements match
const allPositive = numbers.every(function(number) {
    return number > 0;
});
console.log(allPositive); // true
```

### 2. Asynchronous Callbacks ⏰

```javascript
// Simulating API calls with callbacks
function fetchUserData(userId, callback) {
    console.log('Fetching user data...');
    
    // Simulate network delay
    setTimeout(() => {
        if (userId > 0) {
            const userData = {
                id: userId,
                name: `User ${userId}`,
                email: `user${userId}@example.com`
            };
            callback(null, userData); // Success: error = null, data = userData
        } else {
            callback(new Error('Invalid user ID'), null); // Error: error = Error object, data = null
        }
    }, 1500);
}

// Using the async function with callbacks
fetchUserData(123, function(error, userData) {
    if (error) {
        console.error('Error:', error.message);
        return;
    }
    
    console.log('User data received:', userData);
    
    // Chain another async operation
    fetchUserPosts(userData.id, function(error, posts) {
        if (error) {
            console.error('Error fetching posts:', error.message);
            return;
        }
        
        console.log('User posts:', posts);
    });
});

function fetchUserPosts(userId, callback) {
    setTimeout(() => {
        const posts = [
            { id: 1, title: 'First Post', userId },
            { id: 2, title: 'Second Post', userId }
        ];
        callback(null, posts);
    }, 1000);
}
```

### 3. Error Handling with Callbacks 🚨

```javascript
// Error-first callback pattern (Node.js style)
function readFile(filename, callback) {
    // Simulate file reading
    setTimeout(() => {
        if (filename.endsWith('.txt')) {
            const content = `Content of ${filename}`;
            callback(null, content); // No error, return content
        } else {
            callback(new Error('Only .txt files are supported'), null);
        }
    }, 1000);
}

// Using error-first callbacks
readFile('document.txt', function(error, content) {
    if (error) {
        console.error('File read error:', error.message);
        return;
    }
    
    console.log('File content:', content);
});

readFile('image.jpg', function(error, content) {
    if (error) {
        console.error('File read error:', error.message); // This will execute
        return;
    }
    
    console.log('File content:', content);
});

// Try-catch wrapper for safer callback execution
function safeCallback(callback, ...args) {
    try {
        callback(...args);
    } catch (error) {
        console.error('Callback execution error:', error);
    }
}

// Example of using safe callback wrapper
function riskyOperation(callback) {
    const data = { message: 'Success' };
    safeCallback(callback, data);
}

riskyOperation(function(data) {
    // This might throw an error
    console.log(data.message.toUpperCase());
});
```

## Advanced Event Listener Concepts 🚀

### 1. Event Bubbling and Capturing 🫧

```javascript
// HTML structure: <div id="outer"><div id="inner"><button id="button">Click me</button></div></div>

const outer = document.getElementById('outer');
const inner = document.getElementById('inner');
const button = document.getElementById('button');

// Event bubbling (default): button → inner → outer
button.addEventListener('click', () => console.log('Button clicked'));
inner.addEventListener('click', () => console.log('Inner div clicked'));
outer.addEventListener('click', () => console.log('Outer div clicked'));

// Event capturing: outer → inner → button
outer.addEventListener('click', () => console.log('Outer div (capturing)'), true);
inner.addEventListener('click', () => console.log('Inner div (capturing)'), true);
button.addEventListener('click', () => console.log('Button (capturing)'), true);

// Stop propagation
button.addEventListener('click', function(event) {
    console.log('Button clicked - stopping propagation');
    event.stopPropagation(); // Prevents bubbling to parent elements
});

// Stop immediate propagation
button.addEventListener('click', function(event) {
    console.log('First button listener');
    event.stopImmediatePropagation(); // Prevents other listeners on same element
});

button.addEventListener('click', function(event) {
    console.log('Second button listener'); // This won't execute
});
```

### 2. Event Delegation 🎯

```javascript
// Instead of adding listeners to each item individually
const itemsContainer = document.getElementById('itemsContainer');

// Add single listener to container (event delegation)
itemsContainer.addEventListener('click', function(event) {
    // Check if clicked element is an item
    if (event.target.classList.contains('item')) {
        console.log('Item clicked:', event.target.textContent);
    }
    
    // Handle different types of clicks
    if (event.target.classList.contains('delete-btn')) {
        const item = event.target.closest('.item');
        item.remove();
        console.log('Item deleted');
    }
    
    if (event.target.classList.contains('edit-btn')) {
        const item = event.target.closest('.item');
        const text = item.querySelector('.item-text');
        text.contentEditable = true;
        text.focus();
        console.log('Item editing enabled');
    }
});

// Dynamic content works automatically with delegation
function addNewItem(text) {
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `
        <span class="item-text">${text}</span>
        <button class="edit-btn">Edit</button>
        <button class="delete-btn">Delete</button>
    `;
    itemsContainer.appendChild(item);
}

// These new items will automatically have event handling
addNewItem('New Item 1');
addNewItem('New Item 2');
```

### 3. Custom Events 🎭

```javascript
// Creating and dispatching custom events
const customElement = document.getElementById('customElement');

// Create a custom event
const customEvent = new CustomEvent('userLoggedIn', {
    detail: {
        userId: 123,
        username: 'alice',
        timestamp: Date.now()
    },
    bubbles: true,
    cancelable: true
});

// Listen for the custom event
customElement.addEventListener('userLoggedIn', function(event) {
    console.log('User logged in:', event.detail);
    console.log('Username:', event.detail.username);
    console.log('Timestamp:', new Date(event.detail.timestamp));
});

// Dispatch the custom event
customElement.dispatchEvent(customEvent);

// Another example: Communication between components
class UserManager {
    constructor(element) {
        this.element = element;
    }
    
    login(username) {
        // Simulate login process
        setTimeout(() => {
            const loginEvent = new CustomEvent('login', {
                detail: { username, success: true }
            });
            this.element.dispatchEvent(loginEvent);
        }, 1000);
    }
    
    logout() {
        const logoutEvent = new CustomEvent('logout', {
            detail: { timestamp: Date.now() }
        });
        this.element.dispatchEvent(logoutEvent);
    }
}

const userManager = new UserManager(document.body);

// Listen for user events
document.body.addEventListener('login', function(event) {
    if (event.detail.success) {
        console.log(`Welcome, ${event.detail.username}!`);
    }
});

document.body.addEventListener('logout', function(event) {
    console.log('User logged out at:', new Date(event.detail.timestamp));
});

// Trigger events
userManager.login('alice');
setTimeout(() => userManager.logout(), 3000);
```

### 4. Event Listener Options 🔧

```javascript
const button = document.getElementById('optionsButton');

// Advanced options
button.addEventListener('click', function(event) {
    console.log('Click handler executed');
}, {
    once: true,        // Execute only once, then remove
    passive: true,     // Never calls preventDefault() (performance optimization)
    capture: true      // Use capturing phase
});

// Passive listeners for better performance (especially for scroll/touch events)
window.addEventListener('scroll', function(event) {
    console.log('Scrolling...');
    // Cannot call event.preventDefault() in passive listener
}, { passive: true });

// AbortController for removing event listeners
const controller = new AbortController();

button.addEventListener('click', function() {
    console.log('This listener can be aborted');
}, { signal: controller.signal });

// Remove the listener
setTimeout(() => {
    controller.abort(); // Removes all listeners with this signal
}, 5000);

// Conditional event listener removal
function createConditionalListener() {
    let clickCount = 0;
    
    function handleClick(event) {
        clickCount++;
        console.log(`Click ${clickCount}`);
        
        if (clickCount >= 5) {
            event.target.removeEventListener('click', handleClick);
            console.log('Listener removed after 5 clicks');
        }
    }
    
    return handleClick;
}

const conditionalHandler = createConditionalListener();
button.addEventListener('click', conditionalHandler);
```

## Real-World Applications 🌍

### 1. Form Validation 📝

```javascript
class FormValidator {
    constructor(formElement) {
        this.form = formElement;
        this.errors = {};
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Real-time validation on input
        this.form.addEventListener('input', (event) => {
            this.validateField(event.target);
        });
        
        // Validate on blur (when user leaves field)
        this.form.addEventListener('blur', (event) => {
            this.validateField(event.target);
        }, true); // Use capturing to handle all form fields
        
        // Prevent invalid form submission
        this.form.addEventListener('submit', (event) => {
            if (!this.validateForm()) {
                event.preventDefault();
                this.showErrors();
            }
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        const fieldName = field.name;
        
        // Clear previous error
        delete this.errors[fieldName];
        
        // Validation rules
        if (field.required && !value) {
            this.errors[fieldName] = 'This field is required';
        } else if (field.type === 'email' && value && !this.isValidEmail(value)) {
            this.errors[fieldName] = 'Please enter a valid email address';
        } else if (field.minLength && value.length < field.minLength) {
            this.errors[fieldName] = `Minimum length is ${field.minLength} characters`;
        }
        
        this.updateFieldUI(field);
    }
    
    validateForm() {
        const fields = this.form.querySelectorAll('input, textarea, select');
        fields.forEach(field => this.validateField(field));
        return Object.keys(this.errors).length === 0;
    }
    
    updateFieldUI(field) {
        const errorElement = field.parentNode.querySelector('.error-message');
        const fieldName = field.name;
        
        if (this.errors[fieldName]) {
            field.classList.add('invalid');
            if (errorElement) {
                errorElement.textContent = this.errors[fieldName];
            }
        } else {
            field.classList.remove('invalid');
            if (errorElement) {
                errorElement.textContent = '';
            }
        }
    }
    
    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }
    
    showErrors() {
        const firstErrorField = this.form.querySelector('.invalid');
        if (firstErrorField) {
            firstErrorField.focus();
        }
    }
}

// Usage
const form = document.getElementById('registrationForm');
const validator = new FormValidator(form);
```

### 2. Interactive Image Gallery 🖼️

```javascript
class ImageGallery {
    constructor(galleryElement) {
        this.gallery = galleryElement;
        this.currentImageIndex = 0;
        this.images = [];
        this.setupEventListeners();
        this.loadImages();
    }
    
    setupEventListeners() {
        // Image click for full-screen view
        this.gallery.addEventListener('click', (event) => {
            if (event.target.classList.contains('gallery-image')) {
                this.openFullscreen(event.target);
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (event) => {
            if (this.isFullscreenOpen()) {
                switch (event.key) {
                    case 'ArrowLeft':
                        this.previousImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                    case 'Escape':
                        this.closeFullscreen();
                        break;
                }
            }
        });
        
        // Touch gestures for mobile
        let startX = 0;
        
        this.gallery.addEventListener('touchstart', (event) => {
            startX = event.touches[0].clientX;
        }, { passive: true });
        
        this.gallery.addEventListener('touchend', (event) => {
            const endX = event.changedTouches[0].clientX;
            const difference = startX - endX;
            
            if (Math.abs(difference) > 50) { // Minimum swipe distance
                if (difference > 0) {
                    this.nextImage();
                } else {
                    this.previousImage();
                }
            }
        }, { passive: true });
        
        // Lazy loading with Intersection Observer
        this.setupLazyLoading();
    }
    
    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        this.gallery.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    loadImages() {
        this.images = Array.from(this.gallery.querySelectorAll('.gallery-image'));
    }
    
    openFullscreen(imageElement) {
        this.currentImageIndex = this.images.indexOf(imageElement);
        
        // Create fullscreen overlay
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        overlay.innerHTML = `
            <div class="fullscreen-content">
                <img src="${imageElement.src}" alt="${imageElement.alt}">
                <button class="close-btn">&times;</button>
                <button class="prev-btn">&#8249;</button>
                <button class="next-btn">&#8250;</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        // Add event listeners to fullscreen controls
        overlay.querySelector('.close-btn').addEventListener('click', () => {
            this.closeFullscreen();
        });
        
        overlay.querySelector('.prev-btn').addEventListener('click', () => {
            this.previousImage();
        });
        
        overlay.querySelector('.next-btn').addEventListener('click', () => {
            this.nextImage();
        });
        
        // Close on overlay click
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                this.closeFullscreen();
            }
        });
    }
    
    closeFullscreen() {
        const overlay = document.querySelector('.fullscreen-overlay');
        if (overlay) {
            overlay.remove();
        }
    }
    
    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.updateFullscreenImage();
    }
    
    previousImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        this.updateFullscreenImage();
    }
    
    updateFullscreenImage() {
        const overlay = document.querySelector('.fullscreen-overlay');
        if (overlay) {
            const img = overlay.querySelector('img');
            const currentImage = this.images[this.currentImageIndex];
            img.src = currentImage.src;
            img.alt = currentImage.alt;
        }
    }
    
    isFullscreenOpen() {
        return !!document.querySelector('.fullscreen-overlay');
    }
}

// Usage
const gallery = document.getElementById('imageGallery');
const imageGallery = new ImageGallery(gallery);
```

### 3. Real-time Chat Interface 💬

```javascript
class ChatInterface {
    constructor(chatContainer) {
        this.container = chatContainer;
        this.messageInput = chatContainer.querySelector('.message-input');
        this.sendButton = chatContainer.querySelector('.send-button');
        this.messagesContainer = chatContainer.querySelector('.messages');
        this.isTyping = false;
        this.typingTimeout = null;
        
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Send message on button click
        this.sendButton.addEventListener('click', () => {
            this.sendMessage();
        });
        
        // Send message on Enter key
        this.messageInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.sendMessage();
            }
        });
        
        // Typing indicator
        this.messageInput.addEventListener('input', () => {
            this.handleTyping();
        });
        
        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => {
            this.resizeTextarea();
        });
        
        // Emoji picker toggle
        const emojiButton = this.container.querySelector('.emoji-button');
        if (emojiButton) {
            emojiButton.addEventListener('click', () => {
                this.toggleEmojiPicker();
            });
        }
        
        // File upload
        const fileInput = this.container.querySelector('.file-input');
        if (fileInput) {
            fileInput.addEventListener('change', (event) => {
                this.handleFileUpload(event.target.files);
            });
        }
        
        // Message actions (edit, delete, react)
        this.messagesContainer.addEventListener('click', (event) => {
            this.handleMessageActions(event);
        });
        
        // Scroll to bottom when new messages arrive
        this.observeNewMessages();
    }
    
    sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;
        
        // Create message object
        const messageData = {
            id: Date.now(),
            text: message,
            timestamp: new Date(),
            sender: 'currentUser',
            type: 'text'
        };
        
        // Add message to UI
        this.addMessage(messageData);
        
        // Clear input
        this.messageInput.value = '';
        this.resizeTextarea();
        
        // Send to server (simulated)
        this.sendToServer(messageData);
        
        // Stop typing indicator
        this.stopTyping();
    }
    
    addMessage(messageData) {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${messageData.sender}`;
        messageElement.dataset.messageId = messageData.id;
        
        messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-text">${this.escapeHtml(messageData.text)}</div>
                <div class="message-time">${this.formatTime(messageData.timestamp)}</div>
            </div>
            <div class="message-actions">
                <button class="react-btn" data-action="react">👍</button>
                <button class="edit-btn" data-action="edit">Edit</button>
                <button class="delete-btn" data-action="delete">Delete</button>
            </div>
        `;
        
        this.messagesContainer.appendChild(messageElement);
        this.scrollToBottom();
    }
    
    handleTyping() {
        if (!this.isTyping) {
            this.isTyping = true;
            this.sendTypingIndicator(true);
        }
        
        // Clear existing timeout
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
        }
        
        // Set new timeout
        this.typingTimeout = setTimeout(() => {
            this.stopTyping();
        }, 1000);
    }
    
    stopTyping() {
        if (this.isTyping) {
            this.isTyping = false;
            this.sendTypingIndicator(false);
        }
        
        if (this.typingTimeout) {
            clearTimeout(this.typingTimeout);
            this.typingTimeout = null;
        }
    }
    
    handleMessageActions(event) {
        const action = event.target.dataset.action;
        if (!action) return;
        
        const messageElement = event.target.closest('.message');
        const messageId = messageElement.dataset.messageId;
        
        switch (action) {
            case 'react':
                this.toggleReaction(messageId, '👍');
                break;
            case 'edit':
                this.editMessage(messageId);
                break;
            case 'delete':
                this.deleteMessage(messageId);
                break;
        }
    }
    
    resizeTextarea() {
        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 120) + 'px';
    }
    
    scrollToBottom() {
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
    
    observeNewMessages() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    this.scrollToBottom();
                }
            });
        });
        
        observer.observe(this.messagesContainer, {
            childList: true
        });
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    sendToServer(messageData) {
        // Simulate server communication
        console.log('Sending to server:', messageData);
    }
    
    sendTypingIndicator(isTyping) {
        // Simulate typing indicator
        console.log('Typing indicator:', isTyping);
    }
}

// Usage
const chatContainer = document.getElementById('chatContainer');
const chat = new ChatInterface(chatContainer);
```

## Common Callback Pitfalls and Solutions ⚠️

### 1. Callback Hell 🌪️

```javascript
// The problem: Nested callbacks become unreadable
getUserData(userId, function(error, user) {
    if (error) {
        console.error(error);
        return;
    }
    
    getUserPosts(user.id, function(error, posts) {
        if (error) {
            console.error(error);
            return;
        }
        
        getPostComments(posts[0].id, function(error, comments) {
            if (error) {
                console.error(error);
                return;
            }
            
            getCommentReplies(comments[0].id, function(error, replies) {
                if (error) {
                    console.error(error);
                    return;
                }
                
                // Finally do something with the data
                console.log('Data loaded:', { user, posts, comments, replies });
            });
        });
    });
});

// Solution 1: Named functions
function handleGetUser(error, user) {
    if (error) {
        console.error(error);
        return;
    }
    
    getUserPosts(user.id, handleGetPosts);
}

function handleGetPosts(error, posts) {
    if (error) {
        console.error(error);
        return;
    }
    
    getPostComments(posts[0].id, handleGetComments);
}

function handleGetComments(error, comments) {
    if (error) {
        console.error(error);
        return;
    }
    
    getCommentReplies(comments[0].id, handleGetReplies);
}

function handleGetReplies(error, replies) {
    if (error) {
        console.error(error);
        return;
    }
    
    console.log('Data loaded successfully');
}

getUserData(userId, handleGetUser);

// Solution 2: Promises (modern approach)
function getUserDataPromise(userId) {
    return new Promise((resolve, reject) => {
        getUserData(userId, (error, data) => {
            if (error) reject(error);
            else resolve(data);
        });
    });
}

// Chain with .then()
getUserDataPromise(userId)
    .then(user => getUserPostsPromise(user.id))
    .then(posts => getPostCommentsPromise(posts[0].id))
    .then(comments => getCommentRepliesPromise(comments[0].id))
    .then(replies => {
        console.log('Data loaded:', replies);
    })
    .catch(error => {
        console.error('Error in chain:', error);
    });
```

### 2. Memory Leaks with Event Listeners 💧

```javascript
// Problem: Event listeners not removed
function createDynamicElement() {
    const element = document.createElement('div');
    
    // This creates a memory leak if element is removed without cleaning up
    element.addEventListener('click', function() {
        console.log('Element clicked');
    });
    
    return element;
}

// Solution: Proper cleanup
function createDynamicElementSafe() {
    const element = document.createElement('div');
    
    function clickHandler() {
        console.log('Element clicked');
    }
    
    element.addEventListener('click', clickHandler);
    
    // Return cleanup function
    element.destroy = function() {
        element.removeEventListener('click', clickHandler);
    };
    
    return element;
}

// Using AbortController for automatic cleanup
function createDynamicElementModern() {
    const element = document.createElement('div');
    const controller = new AbortController();
    
    element.addEventListener('click', function() {
        console.log('Element clicked');
    }, { signal: controller.signal });
    
    // Cleanup all listeners
    element.destroy = function() {
        controller.abort();
    };
    
    return element;
}
```

### 3. Race Conditions with Callbacks 🏃‍♂️

```javascript
// Problem: Callbacks executing out of order
let requestId = 0;

function searchUsers(query, callback) {
    const currentRequestId = ++requestId;
    
    // Simulate variable response times
    const delay = Math.random() * 2000;
    
    setTimeout(() => {
        const results = [`${query}1`, `${query}2`, `${query}3`];
        callback(currentRequestId, results);
    }, delay);
}

// Problem: Later requests might complete before earlier ones
searchUsers('alice', (id, results) => {
    console.log('Results for request', id, ':', results);
});

searchUsers('bob', (id, results) => {
    console.log('Results for request', id, ':', results);
});

// Solution: Check if response is still relevant
let latestRequestId = 0;

function searchUsersSafe(query, callback) {
    const currentRequestId = ++latestRequestId;
    
    const delay = Math.random() * 2000;
    
    setTimeout(() => {
        // Only execute callback if this is still the latest request
        if (currentRequestId === latestRequestId) {
            const results = [`${query}1`, `${query}2`, `${query}3`];
            callback(results);
        }
    }, delay);
}

// Alternative: Using AbortController
function searchUsersAbortable(query, callback, signal) {
    const delay = Math.random() * 2000;
    
    const timeoutId = setTimeout(() => {
        if (!signal.aborted) {
            const results = [`${query}1`, `${query}2`, `${query}3`];
            callback(results);
        }
    }, delay);
    
    // Cleanup if aborted
    signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
    });
}
```

## Interview Questions & Challenges 🎯

### Q1: What's the output?
```javascript
function test() {
    for (var i = 0; i < 3; i++) {
        setTimeout(function() {
            console.log(i);
        }, 100);
    }
}

test();
```
**Answer**: `3 3 3` - All callbacks share the same variable `i` which becomes 3 after the loop.

### Q2: Fix the above to print 0, 1, 2:
```javascript
// Solution 1: Use let
function test() {
    for (let i = 0; i < 3; i++) {
        setTimeout(function() {
            console.log(i);
        }, 100);
    }
}

// Solution 2: IIFE
function test() {
    for (var i = 0; i < 3; i++) {
        (function(j) {
            setTimeout(function() {
                console.log(j);
            }, 100);
        })(i);
    }
}

// Solution 3: bind
function test() {
    for (var i = 0; i < 3; i++) {
        setTimeout(console.log.bind(null, i), 100);
    }
}
```

### Q3: What does this code do?
```javascript
function once(fn) {
    let hasBeenCalled = false;
    let result;
    
    return function(...args) {
        if (!hasBeenCalled) {
            hasBeenCalled = true;
            result = fn.apply(this, args);
        }
        return result;
    };
}

const expensiveOperation = once(function(x) {
    console.log('Computing...');
    return x * x;
});

console.log(expensiveOperation(5)); // ?
console.log(expensiveOperation(10)); // ?
```
**Answer**: Creates a function that only executes once. First call logs "Computing..." and returns 25. Second call returns 25 without logging.

## Summary

### Callback Functions
- **Functions passed as arguments** to be executed later
- **Foundation of asynchronous** JavaScript programming
- **Enable event-driven** and functional programming patterns
- **Can be anonymous or named** functions
- **Support error-first** callback pattern for robust error handling

### Event Listeners
- **Special callbacks** that respond to browser events
- **addEventListener()** for registering event handlers
- **Event object** contains information about the event
- **Event delegation** for efficient handling of dynamic content
- **Custom events** for component communication

### Key Concepts
- **Event bubbling/capturing** - How events propagate through DOM
- **this binding** - Context in event handlers and callbacks
- **Memory management** - Proper cleanup to prevent leaks
- **Race conditions** - Handling asynchronous callback order
- **Error handling** - Graceful failure management

### Best Practices
- Use arrow functions to preserve `this` context
- Clean up event listeners to prevent memory leaks
- Use event delegation for dynamic content
- Handle errors gracefully in async callbacks
- Consider modern alternatives (Promises, async/await) for complex scenarios

### My Personal Insight
Callbacks were my introduction to thinking asynchronously in JavaScript. The concept that you could "hand over" a function to be called later was mind-bending at first, but it opened up a whole new way of thinking about program flow.

The key insight is that callbacks aren't just about timing - they're about **inversion of control**. You're saying "I don't know when this will happen, but when it does, please call this function." This pattern is everywhere in JavaScript, from simple event handlers to complex API interactions.

Event listeners taught me that web development is fundamentally about **responding to user actions** and system events. Understanding the event system deeply makes you a much more effective front-end developer.

### Next Up
Now that you understand callbacks and event listeners, we'll explore **Trust Issues with setTimeout** - understanding the quirks and limitations of JavaScript's most common async function.

Remember: Callbacks are JavaScript's way of saying "I'll call you back when I'm ready!" 📞✨
