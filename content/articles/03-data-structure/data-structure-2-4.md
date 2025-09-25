---
title: "Stacks & Stack Applications"
description: "Master the Last-In-First-Out (LIFO) principle. Learn stack operations, expression evaluation, backtracking algorithms, and real-world applications of stack data structures."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - javascript
  - stacks
  - data-structures
resources:
  - title: "Stack Visualizations"
    type: "tool"
    url: "https://visualgo.net/en/list"
    description: "Interactive stack operations visualization"
  - title: "Stack Problems Practice"
    type: "practice"
    url: "https://leetcode.com/tag/stack/"
    description: "Practice problems for mastering stack algorithms"
  - title: "Call Stack Guide"
    type: "reference"
    url: "https://developer.mozilla.org/en-US/docs/Glossary/Call_stack"
    description: "Understanding function call stacks in JavaScript"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758827456/Portfolio/dsa/images/08/stacks.png)

Stacks & Stack Applications – The Last-In-First-Out Principle in Action
=======================================================================

Imagine you're a **busy restaurant chef** 👨‍🍳 during the dinner rush, managing multiple aspects of kitchen operations that naturally follow the **"Last-In, First-Out"** principle:

**🍽️ The Kitchen Stack Systems:**

**📚 Plate Stack:**
- **Clean plates arrive** from dishwasher and get **stacked on top**
- **When serving food**, you always take the **top plate** (most recently cleaned)
- **LIFO Logic**: Last plate stacked = First plate used
- **Why it works**: Top plate is most accessible, maintains order naturally

**📋 Order Management:**
- **New orders come in** and get **placed on top** of the order stack
- **Kitchen processes** the **top order first** (most recent priority)
- **Rush Strategy**: Handle immediate orders first, older ones wait underneath
- **Stack Depth**: Can see how many orders are "below" current one

**🥞 Pancake Serving:**
- **Fresh pancakes** get **stacked on top** of existing pile
- **Customers receive** the **top pancake** (hottest and freshest)
- **Temperature Logic**: Most recent pancake is warmest, best quality
- **Natural Flow**: No need to disturb bottom pancakes

**🧠 Chef's Mental Stack:**
- **Immediate tasks** get **pushed onto** your mental "to-do stack"
- **Complete current task** first, then **pop** to previous task
- **Interrupt Handling**: New urgent task temporarily pauses current work
- **Memory Management**: Finish top priority, then remember what you were doing

**🔄 The Stack Life Cycle:**
1. **Push**: Add new item to top of stack
2. **Pop**: Remove top item from stack  
3. **Peek/Top**: Look at top item without removing it
4. **Empty Check**: See if stack has any items
5. **Size**: Count total items in stack

**This is exactly how stacks work in computer science!** They're everywhere:

**💻 Real-World Stack Applications:**
- **Function Calls**: Each function call creates a new "stack frame" on top
- **Undo Operations**: Each action gets pushed, undo pops the most recent
- **Web Browser**: Back button pops from page history stack
- **Expression Evaluation**: Parentheses and operators use stack processing
- **Memory Management**: Local variables stored in stack memory
- **Recursive Algorithms**: Each recursive call adds to the call stack

The stack is the **most intuitive data structure** because it mirrors how we naturally handle layered tasks in real life - always dealing with the most recent item first!

## The Theoretical Foundation: What Are Stacks? 📚

### Understanding LIFO (Last-In, First-Out) Principle

**A stack is a linear data structure that follows the Last-In, First-Out (LIFO) principle, where elements are added and removed from the same end, called the "top" of the stack.** Think of it as a **vertical container** where you can only access the topmost item.

**Core Stack Concepts:**

1. **LIFO Ordering**: Last element added is the first one removed
2. **Single Access Point**: All operations happen at the "top" of the stack
3. **Restricted Access**: Cannot access middle or bottom elements directly
4. **Dynamic Size**: Can grow and shrink during runtime
5. **Efficient Operations**: Push and pop are O(1) constant time

**Stack Visualization:**
```
Top →  [Item 4] ← Last added (will be first removed)
       [Item 3]
       [Item 2]
       [Item 1] ← First added (will be last removed)
Bottom
```

### Stack Operations

**Essential Stack Operations:**

1. **Push**: Add element to top of stack
2. **Pop**: Remove and return top element
3. **Peek/Top**: View top element without removing it
4. **isEmpty**: Check if stack is empty
5. **Size**: Get number of elements in stack

### Stack Implementations

**Array-based Stack:**
- Use array with index tracking the top
- Simple and memory efficient
- Fixed or dynamic size options

**Linked List-based Stack:**
- Use singly linked list with head as top
- Dynamic size with memory allocation
- Slight memory overhead for pointers

## Core Stack Implementation 📦

**Concept**: Implementing a stack with all fundamental operations and detailed analysis.

```javascript
// Comprehensive Stack Implementation with Array

class ArrayStack {
    constructor(capacity = 10) {
        this.items = new Array(capacity);
        this.top = -1; // Index of top element (-1 means empty)
        this.capacity = capacity;
        this.operationCount = 0;
    }
    
    // Push operation: Add element to top - O(1)
    push(element) {
        console.log(`\n📚 PUSHING ${element} onto stack`);
        console.log(`Current state: top=${this.top}, size=${this.size()}`);
        this.operationCount++;
        
        // Check for stack overflow
        if (this.isFull()) {
            console.log(`❌ Stack Overflow! Cannot push ${element}`);
            console.log(`Stack is at maximum capacity: ${this.capacity}`);
            throw new Error('Stack Overflow');
        }
        
        // Increment top and add element
        this.top++;
        this.items[this.top] = element;
        
        console.log(`✅ Pushed ${element} at index ${this.top}`);
        console.log(`New state: top=${this.top}, size=${this.size()}`);
        console.log(`Stack contents: ${this.toString()}`);
        console.log(`Time Complexity: O(1) - constant time operation`);
        
        return this;
    }
    
    // Pop operation: Remove and return top element - O(1)
    pop() {
        console.log(`\n📤 POPPING from stack`);
        console.log(`Current state: top=${this.top}, size=${this.size()}`);
        this.operationCount++;
        
        // Check for stack underflow
        if (this.isEmpty()) {
            console.log(`❌ Stack Underflow! Cannot pop from empty stack`);
            return undefined;
        }
        
        // Get top element and decrement top
        const poppedElement = this.items[this.top];
        this.items[this.top] = undefined; // Clear reference
        this.top--;
        
        console.log(`✅ Popped ${poppedElement} from index ${this.top + 1}`);
        console.log(`New state: top=${this.top}, size=${this.size()}`);
        console.log(`Stack contents: ${this.toString()}`);
        console.log(`Time Complexity: O(1) - constant time operation`);
        
        return poppedElement;
    }
    
    // Peek operation: View top element without removing - O(1)
    peek() {
        console.log(`\n👀 PEEKING at top of stack`);
        this.operationCount++;
        
        if (this.isEmpty()) {
            console.log(`❌ Cannot peek at empty stack`);
            return undefined;
        }
        
        const topElement = this.items[this.top];
        console.log(`✅ Top element: ${topElement} at index ${this.top}`);
        console.log(`Stack not modified - peek is non-destructive operation`);
        console.log(`Time Complexity: O(1) - constant time operation`);
        
        return topElement;
    }
    
    // Check if stack is empty
    isEmpty() {
        const empty = this.top === -1;
        console.log(`📊 isEmpty() = ${empty} (top = ${this.top})`);
        return empty;
    }
    
    // Check if stack is full
    isFull() {
        const full = this.top === this.capacity - 1;
        console.log(`📊 isFull() = ${full} (top = ${this.top}, capacity = ${this.capacity})`);
        return full;
    }
    
    // Get stack size
    size() {
        const stackSize = this.top + 1;
        return stackSize;
    }
    
    // Clear all elements
    clear() {
        console.log(`\n🧹 CLEARING stack`);
        
        const oldSize = this.size();
        this.top = -1;
        this.items.fill(undefined);
        
        console.log(`✅ Cleared ${oldSize} elements`);
        console.log(`New state: top=${this.top}, size=${this.size()}`);
    }
    
    // Convert stack to string representation
    toString() {
        if (this.isEmpty()) {
            return "[]";
        }
        
        const elements = [];
        for (let i = this.top; i >= 0; i--) {
            elements.push(this.items[i]);
        }
        
        return `[${elements.join(', ')}] ← top`;
    }
    
    // Display detailed stack state
    display() {
        console.log(`\n📋 STACK STATE DISPLAY`);
        console.log(`Capacity: ${this.capacity}`);
        console.log(`Size: ${this.size()}`);
        console.log(`Top index: ${this.top}`);
        console.log(`Operations performed: ${this.operationCount}`);
        
        if (this.isEmpty()) {
            console.log(`Stack is empty`);
        } else {
            console.log(`Stack contents (top to bottom):`);
            for (let i = this.top; i >= 0; i--) {
                const marker = i === this.top ? ' ← TOP' : '';
                console.log(`  Index ${i}: ${this.items[i]}${marker}`);
            }
        }
        
        console.log(`Visual representation: ${this.toString()}`);
    }
    
    // Demonstrate basic stack operations
    demonstrateBasicOperations() {
        console.log('=== ARRAY-BASED STACK DEMONSTRATION ===\n');
        
        console.log('1. INITIAL STATE:');
        this.display();
        
        console.log('\n2. PUSH OPERATIONS:');
        this.push(10);
        this.push(20);
        this.push(30);
        this.push(40);
        
        console.log('\n3. PEEK OPERATION:');
        const topElement = this.peek();
        
        console.log('\n4. POP OPERATIONS:');
        const popped1 = this.pop();
        const popped2 = this.pop();
        
        console.log('\n5. FINAL STATE:');
        this.display();
        
        console.log(`\n🎯 OPERATION SUMMARY:`);
        console.log(`- All operations are O(1) constant time`);
        console.log(`- LIFO principle maintained throughout`);
        console.log(`- Stack overflow/underflow protection included`);
        console.log(`- Memory efficient with array implementation`);
        
        return {
            finalSize: this.size(),
            topElement: this.peek(),
            totalOperations: this.operationCount
        };
    }
}

// Test array-based stack
const arrayStack = new ArrayStack(5);
arrayStack.demonstrateBasicOperations();
```

### Linked List-based Stack Implementation

**Concept**: Implementing stack using linked list for dynamic size and memory flexibility.

```javascript
// Stack Implementation using Linked List

class StackNode {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
    
    toString() {
        return `Node(${this.data})`;
    }
}

class LinkedListStack {
    constructor() {
        this.top = null;
        this.size = 0;
        this.operationCount = 0;
    }
    
    // Push operation: Add element to top - O(1)
    push(element) {
        console.log(`\n📚 PUSHING ${element} onto linked list stack`);
        console.log(`Current top: ${this.top ? this.top.toString() : 'null'}`);
        this.operationCount++;
        
        // Create new node
        const newNode = new StackNode(element);
        console.log(`Created new node: ${newNode.toString()}`);
        
        // Point new node to current top
        newNode.next = this.top;
        console.log(`New node points to current top: ${this.top ? this.top.toString() : 'null'}`);
        
        // Update top to new node
        this.top = newNode;
        this.size++;
        
        console.log(`✅ Pushed ${element} successfully`);
        console.log(`New top: ${this.top.toString()}`);
        console.log(`Size: ${this.size}`);
        console.log(`Stack: ${this.toString()}`);
        console.log(`Time Complexity: O(1) - constant time insertion at head`);
        
        return this;
    }
    
    // Pop operation: Remove and return top element - O(1)
    pop() {
        console.log(`\n📤 POPPING from linked list stack`);
        console.log(`Current top: ${this.top ? this.top.toString() : 'null'}`);
        this.operationCount++;
        
        // Check for empty stack
        if (this.isEmpty()) {
            console.log(`❌ Cannot pop from empty stack`);
            return undefined;
        }
        
        // Get data from top node
        const poppedData = this.top.data;
        const oldTop = this.top;
        
        console.log(`Data to pop: ${poppedData}`);
        console.log(`Old top node: ${oldTop.toString()}`);
        console.log(`Next node: ${oldTop.next ? oldTop.next.toString() : 'null'}`);
        
        // Update top to next node
        this.top = this.top.next;
        this.size--;
        
        // Clean up old node (optional in garbage-collected languages)
        oldTop.next = null;
        
        console.log(`✅ Popped ${poppedData} successfully`);
        console.log(`New top: ${this.top ? this.top.toString() : 'null'}`);
        console.log(`Size: ${this.size}`);
        console.log(`Stack: ${this.toString()}`);
        console.log(`Time Complexity: O(1) - constant time deletion at head`);
        
        return poppedData;
    }
    
    // Peek operation: View top element - O(1)
    peek() {
        console.log(`\n👀 PEEKING at linked list stack top`);
        this.operationCount++;
        
        if (this.isEmpty()) {
            console.log(`❌ Cannot peek at empty stack`);
            return undefined;
        }
        
        const topData = this.top.data;
        console.log(`✅ Top element: ${topData}`);
        console.log(`Top node: ${this.top.toString()}`);
        console.log(`Stack unchanged - non-destructive operation`);
        console.log(`Time Complexity: O(1) - direct access to top node`);
        
        return topData;
    }
    
    // Check if stack is empty
    isEmpty() {
        const empty = this.top === null;
        console.log(`📊 isEmpty() = ${empty} (top = ${this.top ? this.top.toString() : 'null'})`);
        return empty;
    }
    
    // Get stack size
    getSize() {
        return this.size;
    }
    
    // Convert to string representation
    toString() {
        if (this.isEmpty()) {
            return "[]";
        }
        
        const elements = [];
        let current = this.top;
        
        while (current !== null) {
            elements.push(current.data);
            current = current.next;
        }
        
        return `[${elements.join(' → ')}] ← top`;
    }
    
    // Display detailed stack state
    display() {
        console.log(`\n📋 LINKED LIST STACK STATE`);
        console.log(`Size: ${this.size}`);
        console.log(`Top: ${this.top ? this.top.toString() : 'null'}`);
        console.log(`Operations performed: ${this.operationCount}`);
        
        if (this.isEmpty()) {
            console.log(`Stack is empty`);
        } else {
            console.log(`Stack contents (top to bottom):`);
            let current = this.top;
            let position = 0;
            
            while (current !== null) {
                const marker = position === 0 ? ' ← TOP' : '';
                console.log(`  Position ${position}: ${current.toString()}${marker}`);
                current = current.next;
                position++;
            }
        }
        
        console.log(`Visual: ${this.toString()}`);
    }
    
    // Compare with array implementation
    compareWithArrayStack() {
        console.log(`\n⚖️ LINKED LIST vs ARRAY STACK COMPARISON:`);
        
        console.log(`\n📊 Linked List Stack Advantages:`);
        console.log(`- Dynamic size: no capacity limit`);
        console.log(`- Memory efficient: allocates only what's needed`);
        console.log(`- No stack overflow: grows as needed`);
        console.log(`- Flexible: can handle any number of elements`);
        
        console.log(`\n📊 Linked List Stack Disadvantages:`);
        console.log(`- Memory overhead: extra pointer per node`);
        console.log(`- Cache performance: nodes scattered in memory`);
        console.log(`- Allocation cost: dynamic memory allocation per push`);
        console.log(`- Complexity: more complex implementation`);
        
        console.log(`\n📊 Array Stack Advantages:`);
        console.log(`- Memory efficient: no pointer overhead`);
        console.log(`- Cache friendly: contiguous memory layout`);
        console.log(`- Simple: straightforward implementation`);
        console.log(`- Fast: minimal memory allocation`);
        
        console.log(`\n📊 Array Stack Disadvantages:`);
        console.log(`- Fixed size: predetermined capacity`);
        console.log(`- Memory waste: unused allocated space`);
        console.log(`- Stack overflow: capacity limitations`);
        console.log(`- Inflexible: cannot handle arbitrary growth`);
        
        return {
            linkedListAdvantages: ['Dynamic size', 'No overflow', 'Memory efficient'],
            arrayAdvantages: ['Cache friendly', 'Simple', 'No pointer overhead']
        };
    }
    
    // Demonstrate linked list stack
    demonstrateLinkedListStack() {
        console.log('\n=== LINKED LIST STACK DEMONSTRATION ===\n');
        
        console.log('1. INITIAL STATE:');
        this.display();
        
        console.log('\n2. PUSH OPERATIONS:');
        this.push('A');
        this.push('B');
        this.push('C');
        this.push('D');
        
        console.log('\n3. PEEK OPERATION:');
        const topElement = this.peek();
        
        console.log('\n4. POP OPERATIONS:');
        const popped1 = this.pop();
        const popped2 = this.pop();
        
        console.log('\n5. FINAL STATE:');
        this.display();
        
        console.log('\n6. IMPLEMENTATION COMPARISON:');
        this.compareWithArrayStack();
        
        return {
            finalSize: this.getSize(),
            topElement: this.peek(),
            totalOperations: this.operationCount
        };
    }
}

// Test linked list stack
console.log('\n' + '='.repeat(60));
const linkedStack = new LinkedListStack();
linkedStack.demonstrateLinkedListStack();
```

### Advanced Stack Applications

**Concept**: Real-world applications demonstrating the power and versatility of stack data structures.

```javascript
// Advanced Stack Applications

class StackApplications {
    
    // Expression evaluation: Convert infix to postfix and evaluate
    evaluateExpression(expression) {
        console.log(`\n🧮 EXPRESSION EVALUATION: "${expression}"`);
        
        // Step 1: Convert infix to postfix
        const postfix = this.infixToPostfix(expression);
        
        // Step 2: Evaluate postfix expression
        const result = this.evaluatePostfix(postfix);
        
        console.log(`\n✅ Final Result:`);
        console.log(`Infix: ${expression}`);
        console.log(`Postfix: ${postfix}`);
        console.log(`Result: ${result}`);
        
        return result;
    }
    
    // Convert infix expression to postfix using stack
    infixToPostfix(infix) {
        console.log(`\n🔄 CONVERTING INFIX TO POSTFIX`);
        console.log(`Input: ${infix}`);
        
        const operatorStack = new LinkedListStack();
        const postfix = [];
        
        // Define operator precedence
        const precedence = {
            '+': 1, '-': 1,
            '*': 2, '/': 2,
            '^': 3
        };
        
        const isOperator = (char) => '+-*/^'.includes(char);
        const isOperand = (char) => /[a-zA-Z0-9]/.test(char);
        
        console.log(`\nProcessing character by character:`);
        
        for (let i = 0; i < infix.length; i++) {
            const char = infix[i];
            
            if (char === ' ') continue; // Skip spaces
            
            console.log(`\nStep ${i + 1}: Processing '${char}'`);
            
            if (isOperand(char)) {
                // Operand: add directly to output
                postfix.push(char);
                console.log(`  Operand: Added '${char}' to output`);
                console.log(`  Output: [${postfix.join(', ')}]`);
            }
            else if (char === '(') {
                // Opening parenthesis: push to stack
                operatorStack.push(char);
                console.log(`  Opening parenthesis: Pushed to stack`);
                console.log(`  Stack: ${operatorStack.toString()}`);
            }
            else if (char === ')') {
                // Closing parenthesis: pop until opening parenthesis
                console.log(`  Closing parenthesis: Popping until '('`);
                
                while (!operatorStack.isEmpty() && operatorStack.peek() !== '(') {
                    const op = operatorStack.pop();
                    postfix.push(op);
                    console.log(`    Popped '${op}' to output`);
                }
                
                if (!operatorStack.isEmpty()) {
                    operatorStack.pop(); // Remove the '('
                    console.log(`    Removed '(' from stack`);
                }
                
                console.log(`  Output: [${postfix.join(', ')}]`);
                console.log(`  Stack: ${operatorStack.toString()}`);
            }
            else if (isOperator(char)) {
                // Operator: pop higher or equal precedence operators
                console.log(`  Operator '${char}' (precedence: ${precedence[char]})`);
                
                while (!operatorStack.isEmpty() && 
                       operatorStack.peek() !== '(' && 
                       precedence[operatorStack.peek()] >= precedence[char]) {
                    
                    const op = operatorStack.pop();
                    postfix.push(op);
                    console.log(`    Popped higher precedence '${op}' to output`);
                }
                
                operatorStack.push(char);
                console.log(`    Pushed '${char}' to stack`);
                console.log(`  Output: [${postfix.join(', ')}]`);
                console.log(`  Stack: ${operatorStack.toString()}`);
            }
        }
        
        // Pop remaining operators
        console.log(`\nPopping remaining operators from stack:`);
        while (!operatorStack.isEmpty()) {
            const op = operatorStack.pop();
            postfix.push(op);
            console.log(`  Popped '${op}' to output`);
        }
        
        const result = postfix.join(' ');
        console.log(`\n✅ Postfix conversion complete: ${result}`);
        
        return result;
    }
    
    // Evaluate postfix expression using stack
    evaluatePostfix(postfix) {
        console.log(`\n🔢 EVALUATING POSTFIX: "${postfix}"`);
        
        const valueStack = new LinkedListStack();
        const tokens = postfix.split(' ');
        
        console.log(`Tokens: [${tokens.join(', ')}]`);
        
        for (let i = 0; i < tokens.length; i++) {
            const token = tokens[i];
            
            if (token === '') continue; // Skip empty tokens
            
            console.log(`\nStep ${i + 1}: Processing '${token}'`);
            
            if (/^\d+$/.test(token)) {
                // Operand: push to stack
                const value = parseInt(token);
                valueStack.push(value);
                console.log(`  Operand: Pushed ${value} to stack`);
                console.log(`  Stack: ${valueStack.toString()}`);
            }
            else {
                // Operator: pop two operands, compute, push result
                if (valueStack.getSize() < 2) {
                    throw new Error(`Insufficient operands for operator '${token}'`);
                }
                
                const b = valueStack.pop();
                const a = valueStack.pop();
                let result;
                
                console.log(`  Operator '${token}': Computing ${a} ${token} ${b}`);
                
                switch (token) {
                    case '+': result = a + b; break;
                    case '-': result = a - b; break;
                    case '*': result = a * b; break;
                    case '/': result = Math.floor(a / b); break;
                    case '^': result = Math.pow(a, b); break;
                    default: throw new Error(`Unknown operator: ${token}`);
                }
                
                valueStack.push(result);
                console.log(`  Result: ${result}`);
                console.log(`  Stack: ${valueStack.toString()}`);
            }
        }
        
        if (valueStack.getSize() !== 1) {
            throw new Error('Invalid postfix expression');
        }
        
        const finalResult = valueStack.pop();
        console.log(`\n✅ Evaluation complete: ${finalResult}`);
        
        return finalResult;
    }
    
    // Balanced parentheses checker
    isBalancedParentheses(expression) {
        console.log(`\n🔍 CHECKING BALANCED PARENTHESES: "${expression}"`);
        
        const stack = new LinkedListStack();
        const pairs = { '(': ')', '[': ']', '{': '}' };
        const opening = Object.keys(pairs);
        const closing = Object.values(pairs);
        
        console.log(`Valid pairs: ${JSON.stringify(pairs)}`);
        
        for (let i = 0; i < expression.length; i++) {
            const char = expression[i];
            
            console.log(`\nStep ${i + 1}: Processing '${char}'`);
            
            if (opening.includes(char)) {
                // Opening bracket: push to stack
                stack.push(char);
                console.log(`  Opening bracket: Pushed '${char}' to stack`);
                console.log(`  Stack: ${stack.toString()}`);
            }
            else if (closing.includes(char)) {
                // Closing bracket: check if matches top of stack
                console.log(`  Closing bracket: '${char}'`);
                
                if (stack.isEmpty()) {
                    console.log(`  ❌ No matching opening bracket - stack is empty`);
                    return false;
                }
                
                const top = stack.pop();
                const expected = pairs[top];
                
                console.log(`  Popped '${top}' from stack, expected closing: '${expected}'`);
                
                if (char !== expected) {
                    console.log(`  ❌ Mismatch: expected '${expected}', got '${char}'`);
                    return false;
                }
                
                console.log(`  ✅ Match found: '${top}' with '${char}'`);
                console.log(`  Stack: ${stack.toString()}`);
            }
        }
        
        const isBalanced = stack.isEmpty();
        console.log(`\n${isBalanced ? '✅' : '❌'} Final result: ${isBalanced ? 'BALANCED' : 'NOT BALANCED'}`);
        
        if (!isBalanced) {
            console.log(`Remaining unmatched brackets: ${stack.toString()}`);
        }
        
        return isBalanced;
    }
    
    // Function call simulation (call stack)
    simulateCallStack() {
        console.log(`\n📞 SIMULATING FUNCTION CALL STACK`);
        
        const callStack = new LinkedListStack();
        
        // Simulate recursive factorial calculation
        const factorial = (n, depth = 0) => {
            const functionName = `factorial(${n})`;
            const indent = '  '.repeat(depth);
            
            console.log(`${indent}➡️ Calling ${functionName}`);
            callStack.push(functionName);
            console.log(`${indent}Call stack: ${callStack.toString()}`);
            
            if (n <= 1) {
                console.log(`${indent}✅ Base case: returning 1`);
                const returned = callStack.pop();
                console.log(`${indent}⬅️ Returning from ${returned}`);
                console.log(`${indent}Call stack: ${callStack.toString()}`);
                return 1;
            }
            
            console.log(`${indent}🔄 Recursive case: ${n} * factorial(${n-1})`);
            const result = n * factorial(n - 1, depth + 1);
            
            const returned = callStack.pop();
            console.log(`${indent}⬅️ Returning from ${returned} with result: ${result}`);
            console.log(`${indent}Call stack: ${callStack.toString()}`);
            
            return result;
        };
        
        console.log(`Computing factorial(4):`);
        const result = factorial(4);
        
        console.log(`\n✅ Final result: 4! = ${result}`);
        console.log(`💡 Each function call creates a stack frame`);
        console.log(`💡 LIFO order ensures proper return sequence`);
        console.log(`💡 Stack prevents infinite recursion (stack overflow)`);
        
        return result;
    }
    
    // Undo-Redo system implementation
    undoRedoSystem() {
        console.log(`\n↩️ UNDO-REDO SYSTEM SIMULATION`);
        
        const undoStack = new LinkedListStack();
        const redoStack = new LinkedListStack();
        let currentState = "Initial Document";
        
        const executeAction = (action) => {
            console.log(`\n🔧 Executing action: ${action}`);
            
            // Save current state to undo stack
            undoStack.push(currentState);
            console.log(`  Saved state to undo stack: "${currentState}"`);
            
            // Clear redo stack (new action invalidates redo history)
            while (!redoStack.isEmpty()) {
                redoStack.pop();
            }
            console.log(`  Cleared redo stack (new action path)`);
            
            // Apply action
            currentState = action;
            console.log(`  New current state: "${currentState}"`);
            console.log(`  Undo stack: ${undoStack.toString()}`);
            console.log(`  Redo stack: ${redoStack.toString()}`);
        };
        
        const undo = () => {
            console.log(`\n↩️ UNDO operation`);
            
            if (undoStack.isEmpty()) {
                console.log(`  ❌ Nothing to undo`);
                return;
            }
            
            // Save current state to redo stack
            redoStack.push(currentState);
            console.log(`  Saved current state to redo stack: "${currentState}"`);
            
            // Restore previous state
            currentState = undoStack.pop();
            console.log(`  Restored state: "${currentState}"`);
            console.log(`  Undo stack: ${undoStack.toString()}`);
            console.log(`  Redo stack: ${redoStack.toString()}`);
        };
        
        const redo = () => {
            console.log(`\n↪️ REDO operation`);
            
            if (redoStack.isEmpty()) {
                console.log(`  ❌ Nothing to redo`);
                return;
            }
            
            // Save current state to undo stack
            undoStack.push(currentState);
            console.log(`  Saved current state to undo stack: "${currentState}"`);
            
            // Restore redo state
            currentState = redoStack.pop();
            console.log(`  Restored state: "${currentState}"`);
            console.log(`  Undo stack: ${undoStack.toString()}`);
            console.log(`  Redo stack: ${redoStack.toString()}`);
        };
        
        // Simulate document editing
        console.log(`Starting with: "${currentState}"`);
        
        executeAction("Added title");
        executeAction("Added paragraph 1");
        executeAction("Added paragraph 2");
        executeAction("Added image");
        
        console.log(`\n📝 Current document: "${currentState}"`);
        
        undo(); // Remove image
        undo(); // Remove paragraph 2
        
        console.log(`\n📝 After undos: "${currentState}"`);
        
        redo(); // Restore paragraph 2
        
        console.log(`\n📝 After redo: "${currentState}"`);
        
        executeAction("Added conclusion"); // This clears redo stack
        
        console.log(`\n✅ Undo-Redo demonstration complete`);
        console.log(`💡 Two stacks enable bidirectional state management`);
        console.log(`💡 New actions clear redo history (branching prevention)`);
        
        return { currentState, undoCount: undoStack.getSize(), redoCount: redoStack.getSize() };
    }
    
    // Demonstrate all stack applications
    demonstrateStackApplications() {
        console.log('=== STACK APPLICATIONS DEMONSTRATION ===');
        
        // Expression evaluation
        console.log('\n1. EXPRESSION EVALUATION:');
        this.evaluateExpression("3 + 4 * 2 - 1");
        this.evaluateExpression("(3 + 4) * (2 - 1)");
        
        // Balanced parentheses
        console.log('\n2. BALANCED PARENTHESES:');
        this.isBalancedParentheses("([{}])");
        this.isBalancedParentheses("([{]}");
        this.isBalancedParentheses("((()))");
        
        // Call stack simulation
        console.log('\n3. FUNCTION CALL STACK:');
        this.simulateCallStack();
        
        // Undo-Redo system
        console.log('\n4. UNDO-REDO SYSTEM:');
        this.undoRedoSystem();
        
        console.log(`\n🎯 STACK APPLICATIONS SUMMARY:`);
        console.log(`- Expression evaluation: Infix to postfix conversion`);
        console.log(`- Balanced parentheses: Syntax validation`);
        console.log(`- Function calls: Call stack management`);
        console.log(`- Undo-Redo: State management with dual stacks`);
        console.log(`- All applications leverage LIFO principle effectively`);
        
        return true;
    }
}

// Test stack applications
console.log('\n' + '='.repeat(60));
const applications = new StackApplications();
applications.demonstrateStackApplications();
```

## Summary

### Core Stack Concepts Mastered
- **LIFO Principle**: Last-In-First-Out ordering for all operations
- **Array Implementation**: Fixed-size stack with overflow protection
- **Linked List Implementation**: Dynamic-size stack with memory flexibility
- **Advanced Applications**: Expression evaluation, balanced parentheses, call stacks, undo-redo

### Stack Operations Complexity
- **Push**: O(1) - Add element to top
- **Pop**: O(1) - Remove element from top
- **Peek**: O(1) - View top element
- **isEmpty**: O(1) - Check if stack is empty
- **Size**: O(1) - Get number of elements

### Why Stacks Are Fundamental
- **Natural Model**: Mirrors real-world LIFO scenarios (plates, books, tasks)
- **Function Calls**: Essential for recursive algorithms and procedure management
- **Expression Processing**: Critical for parsing and evaluating mathematical expressions
- **State Management**: Perfect for undo-redo systems and backtracking algorithms

### Real-World Stack Applications
- **Compiler Design**: Syntax parsing, expression evaluation, symbol table management
- **Operating Systems**: Function call management, interrupt handling, memory allocation
- **Web Browsers**: Page history, JavaScript execution context, DOM traversal
- **Text Editors**: Undo-redo functionality, bracket matching, syntax highlighting
- **Game Development**: Game state management, pathfinding algorithms, AI decision trees

### Array vs Linked List Implementation

**Array-based Stack:**
- **Advantages**: Memory efficient, cache-friendly, simple implementation
- **Disadvantages**: Fixed size, potential overflow, memory waste
- **Best for**: Known size limits, performance-critical applications

**Linked List-based Stack:**
- **Advantages**: Dynamic size, no overflow, memory efficient allocation
- **Disadvantages**: Pointer overhead, scattered memory, allocation cost
- **Best for**: Unknown size requirements, memory-constrained environments

### Stack in Algorithm Design
- **Recursion to Iteration**: Convert recursive algorithms to iterative using stacks
- **Backtracking**: Maintain exploration state for systematic search
- **Tree Traversal**: Depth-first search implementation using stacks
- **Graph Algorithms**: Topological sorting, strongly connected components

### Common Stack Patterns
1. **Matching Pairs**: Parentheses, brackets, quotes validation
2. **Expression Evaluation**: Infix/postfix conversion and calculation
3. **State Preservation**: Function calls, undo-redo systems
4. **Backtracking**: Maze solving, N-Queens problem
5. **Syntax Processing**: Compiler design, language parsing

### Performance Considerations
- **Memory Usage**: Linked list has pointer overhead, array has unused space
- **Cache Performance**: Array implementation better for cache locality
- **Dynamic Behavior**: Linked list better for varying sizes
- **Implementation Complexity**: Array simpler, linked list more flexible

### Next Steps in Stack Mastery
- **Study Recursion**: Understand call stack behavior deeply
- **Practice Problems**: Solve stack-based coding challenges
- **Explore Variations**: Minimum stack, stack with getMin() operation
- **Advanced Applications**: Expression trees, syntax analysis

Stacks teach the fundamental principle of **Last-In-First-Out ordering** and demonstrate how **simple constraints can enable powerful applications**. From the call stack that enables every function call you make, to the undo button in your favorite editor, stacks are working behind the scenes to manage state and enable elegant algorithmic solutions! 🚀✨

Next up: **Queues & Queue Variants** - Learn the First-In-First-Out principle and its applications in scheduling, buffering, and breadth-first algorithms!
