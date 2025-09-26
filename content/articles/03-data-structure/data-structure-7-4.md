---
title: "Regular Expressions & Text Processing"
description: "Apply pattern matching to real-world text processing. Learn regular expression algorithms, automata theory, and advanced text manipulation techniques."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
  - text-processing
resources:
  - title: "Regular Expression Visualizer"
    type: "tool"
    url: "https://regexr.com/"
    description: "Interactive tool for testing and visualizing regular expressions"
  - title: "Automata Theory Reference"
    type: "reference"
    url: "https://en.wikipedia.org/wiki/Finite-state_machine"
    description: "Comprehensive guide to finite state machines and automata"
  - title: "Text Processing Problems"
    type: "practice"
    url: "https://leetcode.com/tag/string/"
    description: "Advanced string and text processing challenges"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758827456/Portfolio/dsa/images/31/regex.png)

Regular Expressions & Text Processing – The Language of Pattern Mastery
------------------------------------------------------------------------

Imagine you're a **master cryptographer** 🔐 working for **international intelligence**, where you must **extract specific information patterns** from **millions of intercepted communications**, and **writing individual search algorithms** for each pattern would take **years**:

**🕵️ The Intelligence Pattern Challenge:**

**📡 Scenario 1: Communication Analysis (Manual Pattern Coding)**
```
Task: Find all email addresses, phone numbers, and dates in messages
Manual approach: Write separate algorithms for each pattern
- Email: complex@domain.com validation algorithm
- Phone: (123) 456-7890 format checking algorithm  
- Date: MM/DD/YYYY parsing algorithm
Result: 500+ lines of custom code, months of development
```

**🤖 Scenario 2: Pattern Language Revolution (Regular Expressions)**
```
Task: Same pattern extraction using regex language
Smart approach: Use pattern description language
- Email: \b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b
- Phone: \(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})
- Date: \d{1,2}[/-]\d{1,2}[/-]\d{4}
Result: 3 lines of pattern code, minutes of development
```

**🚀 Scenario 3: Advanced Text Mining (Finite State Automata)**
```
Task: Parse complex document structures and extract intelligence
Challenge: Nested patterns, context-sensitive matching
Solution: Compile regex patterns to finite state machines
Result: Real-time processing of terabytes of text data
```

**💡 The Text Processing Revolution:**
**Regular expressions** transform text processing from **writing custom algorithms** to **describing patterns in a universal language**. This paradigm shift enables **rapid development**, **standardized solutions**, and **mathematical foundations** that scale from **simple searches to complex document parsing**.


## The Theoretical Foundation

### Formal Language Theory

**Regular Languages Hierarchy:**
Regular expressions are part of the **Chomsky hierarchy** of formal languages:

1. **Type 3 (Regular)**: Recognized by finite automata
   - Regular expressions, finite state machines
   - Linear time complexity, efficient implementation

2. **Type 2 (Context-Free)**: Recognized by pushdown automata  
   - Programming language parsing, XML/JSON
   - Polynomial time complexity

3. **Type 1 (Context-Sensitive)**: Recognized by linear bounded automata
   - Natural language processing
   - Exponential time complexity

4. **Type 0 (Unrestricted)**: Recognized by Turing machines
   - General computation
   - Undecidable problems

**Regular Expression Operations:**
- **Concatenation**: AB (A followed by B)
- **Alternation**: A|B (A or B)
- **Kleene Star**: A* (zero or more A)
- **Plus**: A+ (one or more A)
- **Optional**: A? (zero or one A)

### Finite State Automata

**Connection to Algorithms:**
Every regular expression can be converted to a **finite state automaton (FSA)**:
- **Deterministic FSA (DFA)**: Unique next state for each input
- **Non-deterministic FSA (NFA)**: Multiple possible next states
- **Thompson's Construction**: Converts regex to NFA
- **Subset Construction**: Converts NFA to DFA


## 1. Regular Expression Engine Implementation

### The Concept: Pattern Compilation and Matching

**Real-World Analogy: Language Translation System**

Imagine a **universal translator** that converts **pattern descriptions** into **efficient recognition machines**:

**🌍 Regex Translation Strategy:**
```
Human Pattern Description: "Find all words starting with 'un' followed by any letters"
Regex Pattern: \bun\w+\b
Compilation Process:
1. Parse pattern into syntax tree
2. Convert to finite state machine
3. Optimize state transitions
4. Execute efficiently on input text

Benefits: Write once, run efficiently anywhere
```

### Basic Regex Engine Implementation

```javascript
/**
 * Simple Regular Expression Engine
 * Supports basic operations: ., *, +, ?, |, [], ()
 * Educational implementation for understanding concepts
 */

class RegexEngine {
    constructor() {
        this.debugMode = false;
    }
    
    /**
     * Main matching function
     */
    match(pattern, text, debugMode = false) {
        this.debugMode = debugMode;
        
        console.log(`Regex Match: Pattern "${pattern}" in text "${text}"`);
        
        // Parse pattern into AST (Abstract Syntax Tree)
        const ast = this.parsePattern(pattern);
        console.log("Parsed AST:", JSON.stringify(ast, null, 2));
        
        // Compile AST to NFA
        const nfa = this.compileToNFA(ast);
        console.log("NFA states:", nfa.states.length);
        
        // Execute NFA on text
        const result = this.executeNFA(nfa, text);
        
        console.log(`Match result: ${result.matched}`);
        if (result.matched) {
            console.log(`Match found: "${result.matchedText}" at position ${result.position}`);
        }
        
        return result;
    }
    
    /**
     * Parse regex pattern into Abstract Syntax Tree
     */
    parsePattern(pattern) {
        const tokens = this.tokenize(pattern);
        console.log("Tokens:", tokens);
        
        return this.parseExpression(tokens, 0).node;
    }
    
    tokenize(pattern) {
        const tokens = [];
        for (let i = 0; i < pattern.length; i++) {
            const char = pattern[i];
            
            switch (char) {
                case '.':
                    tokens.push({ type: 'DOT', value: '.' });
                    break;
                case '*':
                    tokens.push({ type: 'STAR', value: '*' });
                    break;
                case '+':
                    tokens.push({ type: 'PLUS', value: '+' });
                    break;
                case '?':
                    tokens.push({ type: 'QUESTION', value: '?' });
                    break;
                case '|':
                    tokens.push({ type: 'PIPE', value: '|' });
                    break;
                case '(':
                    tokens.push({ type: 'LPAREN', value: '(' });
                    break;
                case ')':
                    tokens.push({ type: 'RPAREN', value: ')' });
                    break;
                case '\\':
                    // Escape sequence
                    i++;
                    if (i < pattern.length) {
                        tokens.push({ type: 'CHAR', value: pattern[i] });
                    }
                    break;
                default:
                    tokens.push({ type: 'CHAR', value: char });
            }
        }
        return tokens;
    }
    
    parseExpression(tokens, index) {
        let left = this.parseTerm(tokens, index);
        index = left.index;
        
        // Handle alternation (|)
        while (index < tokens.length && tokens[index].type === 'PIPE') {
            index++; // Skip pipe
            const right = this.parseTerm(tokens, index);
            left = {
                node: { type: 'ALTERNATION', left: left.node, right: right.node },
                index: right.index
            };
        }
        
        return left;
    }
    
    parseTerm(tokens, index) {
        let factors = [];
        
        while (index < tokens.length && 
               tokens[index].type !== 'PIPE' && 
               tokens[index].type !== 'RPAREN') {
            
            const factor = this.parseFactor(tokens, index);
            factors.push(factor.node);
            index = factor.index;
        }
        
        // Create concatenation node
        let result = factors[0];
        for (let i = 1; i < factors.length; i++) {
            result = { type: 'CONCATENATION', left: result, right: factors[i] };
        }
        
        return { node: result || { type: 'EMPTY' }, index };
    }
    
    parseFactor(tokens, index) {
        let base = this.parseBase(tokens, index);
        index = base.index;
        
        // Handle quantifiers (*, +, ?)
        if (index < tokens.length) {
            const token = tokens[index];
            
            if (token.type === 'STAR') {
                base = { node: { type: 'STAR', child: base.node }, index: index + 1 };
            } else if (token.type === 'PLUS') {
                base = { node: { type: 'PLUS', child: base.node }, index: index + 1 };
            } else if (token.type === 'QUESTION') {
                base = { node: { type: 'QUESTION', child: base.node }, index: index + 1 };
            }
        }
        
        return base;
    }
    
    parseBase(tokens, index) {
        if (index >= tokens.length) {
            throw new Error("Unexpected end of pattern");
        }
        
        const token = tokens[index];
        
        if (token.type === 'CHAR') {
            return { node: { type: 'CHAR', value: token.value }, index: index + 1 };
        } else if (token.type === 'DOT') {
            return { node: { type: 'DOT' }, index: index + 1 };
        } else if (token.type === 'LPAREN') {
            // Parse group
            const group = this.parseExpression(tokens, index + 1);
            if (group.index >= tokens.length || tokens[group.index].type !== 'RPAREN') {
                throw new Error("Missing closing parenthesis");
            }
            return { node: group.node, index: group.index + 1 };
        }
        
        throw new Error(`Unexpected token: ${token.type}`);
    }
    
    /**
     * Compile AST to Non-deterministic Finite Automaton (NFA)
     */
    compileToNFA(ast) {
        const nfa = {
            states: [],
            transitions: new Map(),
            startState: 0,
            acceptStates: new Set()
        };
        
        this.stateCounter = 0;
        const result = this.compileNode(ast, nfa);
        
        nfa.startState = result.start;
        nfa.acceptStates.add(result.end);
        
        return nfa;
    }
    
    compileNode(node, nfa) {
        if (!node) {
            const state = this.createState(nfa);
            return { start: state, end: state };
        }
        
        switch (node.type) {
            case 'CHAR':
                return this.compileChar(node.value, nfa);
                
            case 'DOT':
                return this.compileDot(nfa);
                
            case 'CONCATENATION':
                return this.compileConcatenation(node, nfa);
                
            case 'ALTERNATION':
                return this.compileAlternation(node, nfa);
                
            case 'STAR':
                return this.compileStar(node, nfa);
                
            case 'PLUS':
                return this.compilePlus(node, nfa);
                
            case 'QUESTION':
                return this.compileQuestion(node, nfa);
                
            default:
                throw new Error(`Unknown node type: ${node.type}`);
        }
    }
    
    createState(nfa) {
        const state = this.stateCounter++;
        nfa.states.push(state);
        return state;
    }
    
    addTransition(nfa, from, to, symbol) {
        if (!nfa.transitions.has(from)) {
            nfa.transitions.set(from, new Map());
        }
        if (!nfa.transitions.get(from).has(symbol)) {
            nfa.transitions.get(from).set(symbol, new Set());
        }
        nfa.transitions.get(from).get(symbol).add(to);
    }
    
    compileChar(char, nfa) {
        const start = this.createState(nfa);
        const end = this.createState(nfa);
        this.addTransition(nfa, start, end, char);
        return { start, end };
    }
    
    compileDot(nfa) {
        const start = this.createState(nfa);
        const end = this.createState(nfa);
        this.addTransition(nfa, start, end, 'ANY');
        return { start, end };
    }
    
    compileConcatenation(node, nfa) {
        const left = this.compileNode(node.left, nfa);
        const right = this.compileNode(node.right, nfa);
        
        // Connect end of left to start of right with epsilon transition
        this.addTransition(nfa, left.end, right.start, 'EPSILON');
        
        return { start: left.start, end: right.end };
    }
    
    compileAlternation(node, nfa) {
        const left = this.compileNode(node.left, nfa);
        const right = this.compileNode(node.right, nfa);
        
        const start = this.createState(nfa);
        const end = this.createState(nfa);
        
        // Epsilon transitions to both alternatives
        this.addTransition(nfa, start, left.start, 'EPSILON');
        this.addTransition(nfa, start, right.start, 'EPSILON');
        
        // Both alternatives lead to end
        this.addTransition(nfa, left.end, end, 'EPSILON');
        this.addTransition(nfa, right.end, end, 'EPSILON');
        
        return { start, end };
    }
    
    compileStar(node, nfa) {
        const inner = this.compileNode(node.child, nfa);
        const start = this.createState(nfa);
        const end = this.createState(nfa);
        
        // Epsilon transitions for zero or more
        this.addTransition(nfa, start, inner.start, 'EPSILON');
        this.addTransition(nfa, inner.end, inner.start, 'EPSILON');
        this.addTransition(nfa, start, end, 'EPSILON');
        this.addTransition(nfa, inner.end, end, 'EPSILON');
        
        return { start, end };
    }
    
    compilePlus(node, nfa) {
        const inner = this.compileNode(node.child, nfa);
        const start = this.createState(nfa);
        const end = this.createState(nfa);
        
        // One or more: must go through inner at least once
        this.addTransition(nfa, start, inner.start, 'EPSILON');
        this.addTransition(nfa, inner.end, end, 'EPSILON');
        this.addTransition(nfa, inner.end, inner.start, 'EPSILON');
        
        return { start, end };
    }
    
    compileQuestion(node, nfa) {
        const inner = this.compileNode(node.child, nfa);
        const start = this.createState(nfa);
        const end = this.createState(nfa);
        
        // Zero or one: optional path
        this.addTransition(nfa, start, inner.start, 'EPSILON');
        this.addTransition(nfa, inner.end, end, 'EPSILON');
        this.addTransition(nfa, start, end, 'EPSILON');
        
        return { start, end };
    }
    
    /**
     * Execute NFA on input text
     */
    executeNFA(nfa, text) {
        for (let i = 0; i < text.length; i++) {
            const result = this.runNFAFromPosition(nfa, text, i);
            if (result.matched) {
                return {
                    matched: true,
                    position: i,
                    matchedText: text.substring(i, i + result.length)
                };
            }
        }
        
        return { matched: false };
    }
    
    runNFAFromPosition(nfa, text, startPos) {
        let currentStates = new Set([nfa.startState]);
        currentStates = this.epsilonClosure(nfa, currentStates);
        
        let position = startPos;
        let lastAcceptPosition = -1;
        
        // Check if start state is accepting
        if (this.hasAcceptState(currentStates, nfa.acceptStates)) {
            lastAcceptPosition = position;
        }
        
        while (position < text.length && currentStates.size > 0) {
            const char = text[position];
            const nextStates = new Set();
            
            for (const state of currentStates) {
                const transitions = nfa.transitions.get(state);
                if (transitions) {
                    // Character transition
                    if (transitions.has(char)) {
                        for (const nextState of transitions.get(char)) {
                            nextStates.add(nextState);
                        }
                    }
                    // ANY (dot) transition
                    if (transitions.has('ANY')) {
                        for (const nextState of transitions.get('ANY')) {
                            nextStates.add(nextState);
                        }
                    }
                }
            }
            
            currentStates = this.epsilonClosure(nfa, nextStates);
            position++;
            
            if (this.hasAcceptState(currentStates, nfa.acceptStates)) {
                lastAcceptPosition = position;
            }
        }
        
        return {
            matched: lastAcceptPosition > startPos,
            length: lastAcceptPosition - startPos
        };
    }
    
    epsilonClosure(nfa, states) {
        const closure = new Set(states);
        const stack = [...states];
        
        while (stack.length > 0) {
            const state = stack.pop();
            const transitions = nfa.transitions.get(state);
            
            if (transitions && transitions.has('EPSILON')) {
                for (const nextState of transitions.get('EPSILON')) {
                    if (!closure.has(nextState)) {
                        closure.add(nextState);
                        stack.push(nextState);
                    }
                }
            }
        }
        
        return closure;
    }
    
    hasAcceptState(states, acceptStates) {
        for (const state of states) {
            if (acceptStates.has(state)) {
                return true;
            }
        }
        return false;
    }
}

// Example usage
console.log("=== Regular Expression Engine Examples ===");

const regex = new RegexEngine();

// Simple pattern matching
console.log("\n--- Simple Character Matching ---");
regex.match("abc", "xabcy", true);

// Dot metacharacter
console.log("\n--- Dot Metacharacter ---");
regex.match("a.c", "abc", true);

// Star quantifier
console.log("\n--- Star Quantifier ---");
regex.match("ab*c", "ac", true);
regex.match("ab*c", "abbbbc", true);

// Plus quantifier
console.log("\n--- Plus Quantifier ---");
regex.match("ab+c", "abc", true);
regex.match("ab+c", "ac", true);

// Alternation
console.log("\n--- Alternation ---");
regex.match("cat|dog", "I have a dog", true);
```

### Advanced Text Processing Operations

```javascript
/**
 * Advanced Text Processing Utilities
 * Real-world text manipulation and analysis tools
 */

class TextProcessor {
    constructor() {
        this.patterns = {
            email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
            phone: /\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})/g,
            url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g,
            date: /\b(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})\b/g,
            ipAddress: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
            creditCard: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
            socialSecurity: /\b\d{3}-\d{2}-\d{4}\b/g
        };
    }
    
    /**
     * Extract structured data from text
     */
    extractData(text, dataTypes = null) {
        console.log(`Extracting structured data from text (${text.length} characters)`);
        
        const results = {};
        const typesToExtract = dataTypes || Object.keys(this.patterns);
        
        for (const type of typesToExtract) {
            if (this.patterns[type]) {
                const matches = [...text.matchAll(this.patterns[type])];
                results[type] = matches.map(match => ({
                    value: match[0],
                    position: match.index,
                    groups: match.slice(1)
                }));
                
                console.log(`${type}: ${results[type].length} matches found`);
                results[type].forEach((match, i) => {
                    console.log(`  ${i + 1}. "${match.value}" at position ${match.position}`);
                });
            }
        }
        
        return results;
    }
    
    /**
     * Text sanitization and cleaning
     */
    sanitizeText(text, options = {}) {
        console.log("Sanitizing text with options:", options);
        
        let result = text;
        
        // Remove HTML tags
        if (options.removeHtml) {
            result = result.replace(/<[^>]*>/g, '');
            console.log("Removed HTML tags");
        }
        
        // Remove extra whitespace
        if (options.normalizeWhitespace) {
            result = result.replace(/\s+/g, ' ').trim();
            console.log("Normalized whitespace");
        }
        
        // Remove special characters
        if (options.removeSpecialChars) {
            result = result.replace(/[^a-zA-Z0-9\s]/g, '');
            console.log("Removed special characters");
        }
        
        // Convert to lowercase
        if (options.toLowerCase) {
            result = result.toLowerCase();
            console.log("Converted to lowercase");
        }
        
        // Remove profanity (simple word list approach)
        if (options.removeProfanity) {
            const profanityList = ['badword1', 'badword2']; // Simplified list
            for (const word of profanityList) {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                result = result.replace(regex, '***');
            }
            console.log("Removed profanity");
        }
        
        return result;
    }
    
    /**
     * Text validation
     */
    validateFormats(data) {
        console.log("Validating data formats");
        
        const validations = {};
        
        for (const [type, items] of Object.entries(data)) {
            validations[type] = items.map(item => {
                const isValid = this.validateSingleItem(type, item.value);
                return {
                    value: item.value,
                    isValid: isValid,
                    errors: isValid ? [] : [`Invalid ${type} format`]
                };
            });
        }
        
        return validations;
    }
    
    validateSingleItem(type, value) {
        switch (type) {
            case 'email':
                return this.validateEmail(value);
            case 'phone':
                return this.validatePhone(value);
            case 'url':
                return this.validateUrl(value);
            case 'creditCard':
                return this.validateCreditCard(value);
            default:
                return true;
        }
    }
    
    validateEmail(email) {
        // More comprehensive email validation
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(email);
    }
    
    validatePhone(phone) {
        // Remove all non-digits and check length
        const digits = phone.replace(/\D/g, '');
        return digits.length === 10 || digits.length === 11;
    }
    
    validateUrl(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }
    
    validateCreditCard(cardNumber) {
        // Luhn algorithm for credit card validation
        const digits = cardNumber.replace(/\D/g, '');
        if (digits.length < 13 || digits.length > 19) return false;
        
        let sum = 0;
        let isEven = false;
        
        for (let i = digits.length - 1; i >= 0; i--) {
            let digit = parseInt(digits[i]);
            
            if (isEven) {
                digit *= 2;
                if (digit > 9) digit -= 9;
            }
            
            sum += digit;
            isEven = !isEven;
        }
        
        return sum % 10 === 0;
    }
    
    /**
     * Advanced text analysis
     */
    analyzeText(text) {
        console.log("Performing comprehensive text analysis");
        
        const analysis = {
            statistics: this.getTextStatistics(text),
            readability: this.calculateReadability(text),
            sentiment: this.analyzeSentiment(text),
            keywords: this.extractKeywords(text),
            entities: this.extractNamedEntities(text)
        };
        
        return analysis;
    }
    
    getTextStatistics(text) {
        const words = text.split(/\s+/).filter(word => word.length > 0);
        const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
        const paragraphs = text.split(/\n\s*\n/).filter(para => para.trim().length > 0);
        
        const wordLengths = words.map(word => word.length);
        const avgWordLength = wordLengths.reduce((sum, len) => sum + len, 0) / words.length;
        
        return {
            characters: text.length,
            words: words.length,
            sentences: sentences.length,
            paragraphs: paragraphs.length,
            averageWordLength: avgWordLength.toFixed(2),
            averageWordsPerSentence: (words.length / sentences.length).toFixed(2)
        };
    }
    
    calculateReadability(text) {
        // Simplified Flesch Reading Ease score
        const words = text.split(/\s+/).filter(word => word.length > 0);
        const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
        
        // Count syllables (simplified)
        const syllables = words.reduce((total, word) => {
            return total + this.countSyllables(word);
        }, 0);
        
        const avgWordsPerSentence = words.length / sentences.length;
        const avgSyllablesPerWord = syllables / words.length;
        
        const fleschScore = 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * avgSyllablesPerWord);
        
        return {
            fleschScore: Math.max(0, Math.min(100, fleschScore)).toFixed(1),
            level: this.getReadingLevel(fleschScore)
        };
    }
    
    countSyllables(word) {
        // Simplified syllable counting
        word = word.toLowerCase();
        if (word.length <= 3) return 1;
        
        const vowels = word.match(/[aeiouy]+/g);
        let count = vowels ? vowels.length : 1;
        
        if (word.endsWith('e')) count--;
        return Math.max(1, count);
    }
    
    getReadingLevel(score) {
        if (score >= 90) return "Very Easy";
        if (score >= 80) return "Easy";
        if (score >= 70) return "Fairly Easy";
        if (score >= 60) return "Standard";
        if (score >= 50) return "Fairly Difficult";
        if (score >= 30) return "Difficult";
        return "Very Difficult";
    }
    
    analyzeSentiment(text) {
        // Simplified sentiment analysis using word lists
        const positiveWords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'enjoy'];
        const negativeWords = ['bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'worst', 'disappointing'];
        
        const words = text.toLowerCase().split(/\s+/);
        
        let positiveCount = 0;
        let negativeCount = 0;
        
        for (const word of words) {
            if (positiveWords.includes(word)) positiveCount++;
            if (negativeWords.includes(word)) negativeCount++;
        }
        
        const score = (positiveCount - negativeCount) / words.length;
        
        return {
            score: score.toFixed(3),
            label: score > 0.1 ? 'Positive' : score < -0.1 ? 'Negative' : 'Neutral',
            positiveWords: positiveCount,
            negativeWords: negativeCount
        };
    }
    
    extractKeywords(text) {
        // Simple keyword extraction using frequency
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 3); // Filter short words
        
        const frequency = {};
        for (const word of words) {
            frequency[word] = (frequency[word] || 0) + 1;
        }
        
        // Sort by frequency and return top keywords
        return Object.entries(frequency)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([word, count]) => ({ word, count }));
    }
    
    extractNamedEntities(text) {
        // Simplified named entity recognition
        const entities = {
            names: text.match(/\b[A-Z][a-z]+ [A-Z][a-z]+\b/g) || [],
            organizations: text.match(/\b[A-Z][a-z]+ (?:Inc|Corp|LLC|Company|Organization)\b/g) || [],
            locations: text.match(/\b[A-Z][a-z]+(?:, [A-Z][A-Z]| [A-Z][a-z]+)\b/g) || [],
            dates: text.match(/\b(?:January|February|March|April|May|June|July|August|September|October|November|December) \d{1,2}, \d{4}\b/g) || []
        };
        
        return entities;
    }
}

// Example usage
console.log("\n=== Advanced Text Processing Examples ===");

const processor = new TextProcessor();

// Sample text for processing
const sampleText = `
Hello, my email is john.doe@example.com and my phone number is (555) 123-4567.
You can visit my website at https://www.example.com or contact me at work.
My credit card number is 4532-1234-5678-9012 and I live in New York, NY.
The meeting is scheduled for January 15, 2024 at 2:00 PM.
This is a great opportunity to showcase our excellent products!
ABC Corp has been providing wonderful services since 1990.
`;

console.log("Original text:", sampleText);

// Extract structured data
console.log("\n--- Data Extraction ---");
const extractedData = processor.extractData(sampleText);

// Sanitize text
console.log("\n--- Text Sanitization ---");
const sanitized = processor.sanitizeText(sampleText, {
    normalizeWhitespace: true,
    removeSpecialChars: false,
    toLowerCase: false
});
console.log("Sanitized:", sanitized);

// Validate extracted data
console.log("\n--- Data Validation ---");
const validations = processor.validateFormats(extractedData);
console.log("Validations:", JSON.stringify(validations, null, 2));

// Comprehensive text analysis
console.log("\n--- Text Analysis ---");
const analysis = processor.analyzeText(sampleText);
console.log("Analysis:", JSON.stringify(analysis, null, 2));
```


## 2. Advanced Pattern Matching Applications

### Document Processing Pipeline

```javascript
/**
 * Enterprise Document Processing System
 * Demonstrates real-world regex applications in document processing
 */

class DocumentProcessor {
    constructor() {
        this.processors = {
            legal: new LegalDocumentProcessor(),
            medical: new MedicalDocumentProcessor(),
            financial: new FinancialDocumentProcessor(),
            academic: new AcademicDocumentProcessor()
        };
    }
    
    processDocument(document, type) {
        console.log(`Processing ${type} document: ${document.title}`);
        
        const processor = this.processors[type];
        if (!processor) {
            throw new Error(`Unknown document type: ${type}`);
        }
        
        return processor.process(document);
    }
}

class LegalDocumentProcessor {
    constructor() {
        this.patterns = {
            caseNumber: /\b(?:Case|Docket)\s+(?:No\.?\s*)?([A-Z0-9\-:]+)\b/gi,
            lawCitation: /\b\d+\s+[A-Z][a-z]+\.?\s+\d+(?:\s*\(\d{4}\))?\b/g,
            legalEntity: /\b[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*\s+(?:Inc|Corp|LLC|LP|LLP|Co)\b/g,
            courtName: /\b(?:Supreme|District|Circuit|Appellate|Superior|Municipal)\s+Court\b/gi,
            judge: /\b(?:Judge|Justice|Hon\.)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\b/gi,
            statute: /\b(?:USC|U\.S\.C\.)\s+§\s*(\d+(?:\([a-z]\))?)/gi
        };
    }
    
    process(document) {
        console.log("Processing legal document for case information extraction");
        
        const extracted = {};
        for (const [key, pattern] of Object.entries(this.patterns)) {
            extracted[key] = [...document.content.matchAll(pattern)].map(match => ({
                text: match[0],
                captured: match[1] || null,
                position: match.index
            }));
        }
        
        // Additional legal document analysis
        const analysis = {
            documentType: this.classifyLegalDocument(document.content),
            keyDates: this.extractLegalDates(document.content),
            parties: this.extractParties(document.content),
            jurisdiction: this.identifyJurisdiction(document.content)
        };
        
        return { extracted, analysis };
    }
    
    classifyLegalDocument(content) {
        const patterns = {
            contract: /\b(?:agreement|contract|covenant|indenture)\b/i,
            lawsuit: /\b(?:complaint|petition|motion|brief|pleading)\b/i,
            patent: /\b(?:patent|invention|claim|embodiment)\b/i,
            merger: /\b(?:merger|acquisition|consolidation)\b/i
        };
        
        for (const [type, pattern] of Object.entries(patterns)) {
            if (pattern.test(content)) {
                return type;
            }
        }
        return 'unknown';
    }
    
    extractLegalDates(content) {
        const datePattern = /\b(?:filed|decided|argued|effective|signed)\s+(?:on\s+)?([A-Z][a-z]+\s+\d{1,2},\s+\d{4})\b/gi;
        return [...content.matchAll(datePattern)].map(match => ({
            action: match[0].split(/\s+/)[0],
            date: match[1],
            position: match.index
        }));
    }
    
    extractParties(content) {
        // Simplified party extraction
        const plaintiffPattern = /\b([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+v\.?\s+/g;
        const defendantPattern = /\bv\.?\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g;
        
        return {
            plaintiffs: [...content.matchAll(plaintiffPattern)].map(match => match[1]),
            defendants: [...content.matchAll(defendantPattern)].map(match => match[1])
        };
    }
    
    identifyJurisdiction(content) {
        const jurisdictions = [
            'Federal', 'State', 'California', 'New York', 'Texas', 'Florida'
        ];
        
        for (const jurisdiction of jurisdictions) {
            if (new RegExp(`\\b${jurisdiction}\\b`, 'i').test(content)) {
                return jurisdiction;
            }
        }
        return 'Unknown';
    }
}

class MedicalDocumentProcessor {
    constructor() {
        this.patterns = {
            diagnosis: /\b(?:diagnosis|dx):\s*([A-Z]\d{2}(?:\.\d{1,2})?)\b/gi,
            medication: /\b([A-Z][a-z]+(?:in|ol|ex|ide|ine))\s+(\d+(?:\.\d+)?)\s*(mg|g|ml|mcg)\b/gi,
            vitals: /\b(?:BP|Blood Pressure):\s*(\d{2,3}\/\d{2,3})\s*mmHg\b/gi,
            temperature: /\b(?:temp|temperature):\s*(\d{2,3}(?:\.\d)?)\s*°?[CF]\b/gi,
            allergies: /\b(?:allergic to|allergy):\s*([A-Za-z\s,]+)(?:\.|$)/gi,
            procedures: /\b(?:procedure|surgery|operation):\s*([A-Za-z\s-]+)(?:\.|$)/gi
        };
    }
    
    process(document) {
        console.log("Processing medical document for clinical information");
        
        const extracted = {};
        for (const [key, pattern] of Object.entries(this.patterns)) {
            extracted[key] = [...document.content.matchAll(pattern)].map(match => ({
                text: match[0],
                value: match[1],
                unit: match[2] || null,
                position: match.index
            }));
        }
        
        const analysis = {
            patientInfo: this.extractPatientInfo(document.content),
            riskFactors: this.identifyRiskFactors(document.content),
            followUp: this.extractFollowUpInstructions(document.content)
        };
        
        return { extracted, analysis };
    }
    
    extractPatientInfo(content) {
        const patterns = {
            dob: /\b(?:DOB|Date of Birth):\s*(\d{1,2}\/\d{1,2}\/\d{4})\b/i,
            mrn: /\b(?:MRN|Medical Record Number):\s*([A-Z0-9\-]+)\b/i,
            gender: /\b(?:Gender|Sex):\s*(Male|Female|M|F)\b/i
        };
        
        const info = {};
        for (const [key, pattern] of Object.entries(patterns)) {
            const match = content.match(pattern);
            if (match) {
                info[key] = match[1];
            }
        }
        
        return info;
    }
    
    identifyRiskFactors(content) {
        const riskFactors = [
            'diabetes', 'hypertension', 'smoking', 'obesity', 'family history'
        ];
        
        return riskFactors.filter(factor => 
            new RegExp(`\\b${factor}\\b`, 'i').test(content)
        );
    }
    
    extractFollowUpInstructions(content) {
        const followUpPattern = /\b(?:follow.?up|return|revisit)\s+(?:in\s+)?(\d+(?:\.\d+)?)\s*(days?|weeks?|months?)\b/gi;
        return [...content.matchAll(followUpPattern)].map(match => ({
            duration: match[1],
            unit: match[2],
            fullText: match[0]
        }));
    }
}

class FinancialDocumentProcessor {
    constructor() {
        this.patterns = {
            amounts: /\$\s*([0-9,]+(?:\.\d{2})?)\b/g,
            accountNumbers: /\b(?:Account|Acct)\.?\s*(?:No\.?\s*)?:?\s*([0-9\-]{8,20})\b/gi,
            routingNumbers: /\b(?:Routing|ABA)\.?\s*(?:No\.?\s*)?:?\s*([0-9]{9})\b/gi,
            transactions: /\b(\d{1,2}\/\d{1,2}\/\d{4})\s+([A-Za-z\s]+?)\s+(\$[0-9,]+\.\d{2})\b/g,
            taxId: /\b(?:Tax ID|EIN|SSN):\s*([0-9\-]{9,11})\b/gi,
            currencies: /\b([A-Z]{3})\s+([0-9,]+(?:\.\d{2})?)\b/g
        };
    }
    
    process(document) {
        console.log("Processing financial document for monetary and account data");
        
        const extracted = {};
        for (const [key, pattern] of Object.entries(this.patterns)) {
            extracted[key] = [...document.content.matchAll(pattern)].map(match => ({
                text: match[0],
                value: match[1],
                additional: match[2] || null,
                position: match.index
            }));
        }
        
        const analysis = {
            totalAmounts: this.calculateTotals(extracted.amounts),
            transactionSummary: this.analyzeTransactions(extracted.transactions),
            riskIndicators: this.identifyFinancialRisks(document.content)
        };
        
        return { extracted, analysis };
    }
    
    calculateTotals(amounts) {
        const total = amounts.reduce((sum, amount) => {
            const value = parseFloat(amount.value.replace(/,/g, ''));
            return sum + value;
        }, 0);
        
        return {
            count: amounts.length,
            total: total.toFixed(2),
            average: amounts.length > 0 ? (total / amounts.length).toFixed(2) : 0
        };
    }
    
    analyzeTransactions(transactions) {
        return {
            count: transactions.length,
            dateRange: this.getDateRange(transactions),
            categories: this.categorizeTransactions(transactions)
        };
    }
    
    getDateRange(transactions) {
        if (transactions.length === 0) return null;
        
        const dates = transactions.map(t => new Date(t.value));
        return {
            earliest: Math.min(...dates),
            latest: Math.max(...dates)
        };
    }
    
    categorizeTransactions(transactions) {
        // Simplified transaction categorization
        const categories = {
            'ATM': 0,
            'Transfer': 0,
            'Payment': 0,
            'Deposit': 0,
            'Other': 0
        };
        
        for (const transaction of transactions) {
            const description = transaction.additional || '';
            if (description.includes('ATM')) categories['ATM']++;
            else if (description.includes('Transfer')) categories['Transfer']++;
            else if (description.includes('Payment')) categories['Payment']++;
            else if (description.includes('Deposit')) categories['Deposit']++;
            else categories['Other']++;
        }
        
        return categories;
    }
    
    identifyFinancialRisks(content) {
        const riskKeywords = [
            'bankruptcy', 'default', 'overdue', 'collection', 'foreclosure'
        ];
        
        return riskKeywords.filter(keyword => 
            new RegExp(`\\b${keyword}\\b`, 'i').test(content)
        );
    }
}

class AcademicDocumentProcessor {
    constructor() {
        this.patterns = {
            citations: /\b([A-Z][a-z]+(?:,\s+[A-Z]\.)*)\s+\((\d{4})\)\.\s+([^.]+)\.\s*([^.]+)?\./g,
            doi: /\bdoi:\s*(10\.\d+\/[^\s]+)\b/gi,
            isbn: /\b(?:ISBN|isbn)[-:\s]*([0-9\-Xx]{10,17})\b/gi,
            equations: /\$\$([^$]+)\$\$/g,
            sections: /\b(\d+(?:\.\d+)*)\s+([A-Z][^.]*)\b/g,
            keywords: /\b(?:keywords?|key words?):\s*([^.]+)\./gi
        };
    }
    
    process(document) {
        console.log("Processing academic document for research content");
        
        const extracted = {};
        for (const [key, pattern] of Object.entries(this.patterns)) {
            extracted[key] = [...document.content.matchAll(pattern)].map(match => ({
                text: match[0],
                author: match[1] || null,
                year: match[2] || null,
                title: match[3] || null,
                position: match.index
            }));
        }
        
        const analysis = {
            citationCount: extracted.citations.length,
            researchFields: this.identifyResearchFields(document.content),
            readabilityScore: this.calculateAcademicReadability(document.content),
            structureAnalysis: this.analyzeDocumentStructure(document.content)
        };
        
        return { extracted, analysis };
    }
    
    identifyResearchFields(content) {
        const fields = {
            'Computer Science': ['algorithm', 'machine learning', 'artificial intelligence'],
            'Mathematics': ['theorem', 'proof', 'equation', 'mathematical'],
            'Physics': ['quantum', 'particle', 'energy', 'physics'],
            'Biology': ['gene', 'protein', 'cell', 'biological'],
            'Chemistry': ['molecule', 'chemical', 'reaction', 'compound']
        };
        
        const identified = [];
        for (const [field, keywords] of Object.entries(fields)) {
            const score = keywords.reduce((count, keyword) => {
                const matches = content.match(new RegExp(`\\b${keyword}\\b`, 'gi'));
                return count + (matches ? matches.length : 0);
            }, 0);
            
            if (score > 0) {
                identified.push({ field, score });
            }
        }
        
        return identified.sort((a, b) => b.score - a.score);
    }
    
    calculateAcademicReadability(content) {
        // Academic-specific readability metrics
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = content.split(/\s+/).filter(w => w.length > 0);
        
        const avgWordsPerSentence = words.length / sentences.length;
        const complexWords = words.filter(word => word.length > 6).length;
        const complexWordRatio = complexWords / words.length;
        
        return {
            avgWordsPerSentence: avgWordsPerSentence.toFixed(1),
            complexWordRatio: (complexWordRatio * 100).toFixed(1) + '%',
            academicLevel: avgWordsPerSentence > 20 ? 'Graduate' : 'Undergraduate'
        };
    }
    
    analyzeDocumentStructure(content) {
        const structure = {
            abstract: /\babstract\b/i.test(content),
            introduction: /\bintroduction\b/i.test(content),
            methodology: /\b(?:methodology|methods)\b/i.test(content),
            results: /\bresults\b/i.test(content),
            conclusion: /\bconclusion\b/i.test(content),
            references: /\b(?:references|bibliography)\b/i.test(content)
        };
        
        const completeness = Object.values(structure).filter(Boolean).length / Object.keys(structure).length;
        
        return {
            sections: structure,
            completeness: (completeness * 100).toFixed(0) + '%'
        };
    }
}

// Example usage
console.log("\n=== Document Processing Examples ===");

const docProcessor = new DocumentProcessor();

// Sample documents
const documents = [
    {
        title: "Contract Agreement",
        content: "This agreement is filed on January 15, 2024 between ABC Corp and XYZ Inc. Case No. 2024-CV-12345. Judge Smith presiding.",
        type: "legal"
    },
    {
        title: "Medical Report",
        content: "Patient DOB: 01/15/1980, MRN: MR123456. Diagnosis: E11.9. BP: 140/90 mmHg. Prescribed Metformin 500mg twice daily. Follow-up in 2 weeks.",
        type: "medical"
    },
    {
        title: "Financial Statement",
        content: "Account No: 1234-5678-9012. Transaction 01/15/2024 ATM Withdrawal $100.00. Total balance: $5,250.75. Tax ID: 12-3456789.",
        type: "financial"
    },
    {
        title: "Research Paper", 
        content: "Smith, J. (2024). Machine Learning Algorithms. Computer Science Review. doi: 10.1016/j.cosrev.2024.100567. Keywords: artificial intelligence, deep learning.",
        type: "academic"
    }
];

// Process each document
documents.forEach(doc => {
    console.log(`\n--- Processing ${doc.title} ---`);
    const result = docProcessor.processDocument(doc, doc.type);
    console.log("Extracted data:", JSON.stringify(result.extracted, null, 2));
    console.log("Analysis:", JSON.stringify(result.analysis, null, 2));
});
```


## Summary

### Regular Expressions & Text Processing Mastery Achieved

**Complete Text Processing Arsenal:**
- **Regular Expression Theory**: Understanding of formal language hierarchy and automata theory
- **Regex Engine Implementation**: Built functional NFA-based pattern matching engine from scratch  
- **Advanced Text Processing**: Comprehensive utilities for extraction, validation, and analysis
- **Domain-Specific Applications**: Specialized processors for legal, medical, financial, and academic documents

**Theoretical Foundation Mastered:**

**Formal Language Theory:**
- **Chomsky Hierarchy**: Understanding of language complexity levels and their computational requirements
- **Finite State Automata**: Deep knowledge of NFA/DFA construction and optimization
- **Thompson's Construction**: Ability to convert regex patterns to executable automata
- **Complexity Analysis**: Recognition of when regex is appropriate vs. more powerful parsing techniques

**Regex Engine Architecture:**
- **Pattern Compilation**: Multi-stage process from regex syntax to executable state machines
- **NFA Execution**: Efficient state management and epsilon closure algorithms
- **Optimization Techniques**: State minimization and transition table optimization
- **Memory Management**: Space-efficient implementation for large-scale text processing

**Advanced Text Processing Capabilities:**

**Data Extraction Excellence:**
- **Pattern Recognition**: Comprehensive library of real-world patterns (emails, phones, URLs, financial data)
- **Structured Data Mining**: Automated extraction of meaningful information from unstructured text
- **Multi-Domain Expertise**: Specialized processing for different document types and industries
- **Validation Systems**: Robust verification of extracted data using domain-specific rules

**Document Intelligence:**
- **Content Classification**: Automatic document type identification and routing
- **Entity Recognition**: Extraction of named entities, relationships, and contextual information
- **Sentiment Analysis**: Basic emotional tone detection and keyword analysis
- **Readability Assessment**: Quantitative measures of text complexity and accessibility

**Industrial Applications Expertise:**
- **Legal Document Processing**: Case information extraction, citation parsing, party identification
- **Medical Record Analysis**: Clinical data extraction, diagnosis coding, medication parsing
- **Financial Document Mining**: Transaction analysis, account information extraction, risk assessment
- **Academic Research Tools**: Citation analysis, field identification, structure validation

### Real-World Impact and Strategic Applications

**Enterprise Text Processing:**
- **Compliance Systems**: Automated regulatory document analysis and reporting
- **Customer Support**: Intelligent ticket routing and response generation
- **Data Migration**: Legacy system text extraction and standardization
- **Quality Assurance**: Automated document review and error detection

**Information Security and Intelligence:**
- **Threat Detection**: Pattern-based analysis of security logs and network traffic
- **Digital Forensics**: Evidence extraction from various document formats and communications
- **Fraud Prevention**: Transaction pattern analysis and anomaly detection
- **Content Filtering**: Automated moderation and policy compliance checking

**Scientific and Academic Research:**
- **Literature Mining**: Automated research paper analysis and knowledge extraction
- **Data Processing**: Large-scale text corpus analysis for linguistic and social research
- **Bibliometric Analysis**: Citation network construction and impact assessment
- **Reproducible Research**: Standardized data extraction and validation pipelines

### Performance and Optimization Guidelines

**Algorithm Selection Strategy:**
```
Text Processing Task        | Optimal Approach         | Complexity Consideration
=========================== | ======================== | ==========================
Simple pattern matching    | Native regex engines    | O(n) for most patterns
Complex structured parsing | Custom FSA compilation  | O(n) with preprocessing
Real-time processing       | Compiled DFA execution   | Minimal memory allocation
Large corpus analysis      | Parallel regex execution | Distributed processing
Interactive applications   | Cached pattern compilation| Amortized preprocessing cost
```

**Scalability Optimization:**
- **Pattern Compilation**: Precompile frequently used patterns for reuse
- **Memory Management**: Efficient state machine representation for large-scale processing
- **Parallel Processing**: Distribute text processing across multiple threads/machines
- **Caching Strategies**: Store compilation results and intermediate processing states

**Industry Best Practices:**
- **Security Considerations**: Input validation and regex complexity limits to prevent ReDoS attacks
- **Internationalization**: Unicode support and locale-specific pattern handling
- **Error Handling**: Graceful degradation and comprehensive error reporting
- **Documentation**: Clear pattern documentation and maintenance procedures

You now possess the **theoretical understanding, implementation expertise, and practical experience** to architect **enterprise-grade text processing systems** that can **efficiently handle massive document corpora** while providing **accurate, reliable, and scalable solutions** for **complex information extraction challenges**.

The progression from **basic pattern matching to sophisticated document intelligence systems** represents the **pinnacle of text processing mastery** - the ability to **transform unstructured text into actionable intelligence** through **mathematically sound algorithms** and **domain-specific expertise**.

Your skillset now encompasses the **complete spectrum of text processing** from **theoretical automata construction to industrial-scale document processing pipelines**, enabling you to **solve complex real-world information challenges** in **legal, medical, financial, and academic domains** with **optimal performance and reliability**.
