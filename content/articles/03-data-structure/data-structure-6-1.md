---
title: "Basic Sorting Algorithms"
description: "Master the fundamentals of sorting. Learn Bubble Sort, Selection Sort, and Insertion Sort with detailed analysis, optimizations, and practical applications."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2025-09-26"
datePublished: "2025-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - javascript
  - sorting
  - bubble-sort
  - selection-sort
  - insertion-sort
resources:
  - title: "Sorting Visualizations"
    type: "tool"
    url: "https://visualgo.net/en/sorting"
    description: "Interactive sorting algorithm visualization and comparison"
  - title: "Sorting Problems"
    type: "practice"
    url: "https://leetcode.com/tag/sorting/"
    description: "Practice problems for mastering sorting algorithms"
  - title: "Sorting Algorithms Theory"
    type: "reference"
    url: "https://en.wikipedia.org/wiki/Sorting_algorithm"
    description: "Comprehensive sorting algorithm theory and classifications"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758827456/Portfolio/dsa/images/24/basic-sorting.png)

Basic Sorting Algorithms – Foundational Data Organization Mastery
================================================================

Imagine you're a **school librarian** 📚 organizing a **completely shuffled collection** of books, and you need to **arrange them in alphabetical order** so students can find books easily:

**📖 The Library Organization Challenge:**

**🏫 Chaotic Library Scenario:**
- **500 Books**: Completely random order on shelves
- **Goal**: Arrange alphabetically (A-Z by title)
- **Constraint**: Limited space - can only move few books at a time
- **Methods**: Different systematic approaches to organize efficiently

**❌ Random Organization Problems:**
```
Random approach:
- Pick random book, place randomly
- No systematic method
- Books remain disorganized
- Students can't find anything!

Naive approach:
- Try to place each book in "correct" position immediately
- Requires knowing position of every other book
- Too complex for human brain to track
- Leads to mistakes and confusion
```

**🎯 Systematic Sorting Strategies:**
Think like a **professional organizer** who uses **proven methods** to bring **order from chaos**:

**📊 Three Fundamental Approaches:**

**🫧 Bubble Sort (The Bubble-Up Method):**
```
Strategy: Compare adjacent books, swap if out of order
Think: "Heavy books bubble up, light books bubble down"

Library Example:
Pass 1: Go through entire shelf, swap any adjacent books that are out of order
Pass 2: Go through shelf again, make more swaps
Continue until no swaps needed (shelf is sorted)

Why "Bubble"? Largest elements "bubble up" to their final position each pass
```

**🎯 Selection Sort (The Find-and-Place Method):**
```
Strategy: Find the smallest book, place it first; find next smallest, place it second...
Think: "Select the next book that belongs in this position"

Library Example:
Step 1: Scan all 500 books, find the one that comes first alphabetically (A...)
Step 2: Place it in position 1
Step 3: Scan remaining 499 books, find the next alphabetically
Step 4: Place it in position 2
Continue until all books placed
```

**📝 Insertion Sort (The One-by-One Method):**
```
Strategy: Take books one by one, insert each into correct position in sorted portion
Think: "Like organizing cards in your hand as you pick them up"

Library Example:
Start: First book is "sorted" (position 1)
Step 1: Take second book, insert it in correct position relative to first book
Step 2: Take third book, insert it in correct position among first two books
Continue: Each new book is inserted into its correct position in the growing sorted section
```

**⚡ Performance Characteristics:**

**🐌 Time Complexity (All O(n²) worst case):**
```
Algorithm     | Best Case | Average Case | Worst Case | Why?
============= | ========= | ============ | ========== | ====
Bubble Sort   | O(n)      | O(n²)        | O(n²)      | Many unnecessary comparisons
Selection Sort| O(n²)     | O(n²)        | O(n²)      | Always scans entire remaining array
Insertion Sort| O(n)      | O(n²)        | O(n²)      | But excellent for nearly sorted data
```

**💾 Space Complexity (All O(1)):**
```
All three algorithms are "in-place":
- Only use constant extra memory
- Don't need additional arrays
- Perfect for memory-constrained environments
```

**🎯 When to Use Each Algorithm:**

**Choose Bubble Sort When:**
- **Learning**: Understanding basic sorting concepts
- **Small Data**: Very small datasets (< 10 elements)
- **Educational**: Teaching algorithm fundamentals
- **Never in Production**: Too inefficient for real applications

**Choose Selection Sort When:**
- **Minimize Writes**: Fewest possible swaps (exactly n-1 swaps)
- **Simple Implementation**: Easy to understand and code
- **Small Data**: Small datasets where O(n²) is acceptable
- **Memory Analysis**: When write operations are expensive

**Choose Insertion Sort When:**
- **Nearly Sorted Data**: Excellent performance on almost-sorted arrays
- **Online Algorithms**: Elements arrive one at a time
- **Small Subarrays**: Often used in hybrid algorithms (with QuickSort/MergeSort)
- **Adaptive Needed**: Performance adapts to input characteristics

**🌟 Real-World Applications:**

**Educational and Learning:**
- **Algorithm Education**: Teaching fundamental sorting concepts
- **Interview Preparation**: Understanding basic algorithms
- **Coding Bootcamps**: Building foundation for advanced algorithms
- **Algorithm Analysis**: Understanding time/space complexity

**Small Data Processing:**
- **Embedded Systems**: Resource-constrained environments
- **Game Development**: Sorting small arrays (player scores, inventory items)
- **Configuration Files**: Organizing small lists of settings
- **Data Validation**: Sorting before comparison operations

**Hybrid Algorithm Components:**
- **Advanced Sorting**: Insertion sort used in QuickSort for small subarrays
- **Database Indexing**: Basic sorting for small index segments
- **Search Optimization**: Preparing small datasets for binary search
- **Cache-Friendly**: Good performance for data that fits in CPU cache

**💡 Sorting Intuition:**
Like a **professional organizer** working with different strategies. **Bubble Sort** is like carefully **comparing neighboring items** and **gradually moving them to correct positions**. **Selection Sort** is like **finding the next correct item** and **placing it exactly where it belongs**. **Insertion Sort** is like **building an organized collection** by **inserting each new item in its correct position**. All three guarantee **complete organization** but differ in **efficiency and approach**! 📋

This is exactly how basic sorting algorithms work! They provide **systematic approaches** to **data organization** with **simple logic and guaranteed results**, making them essential for **understanding algorithm fundamentals and solving small-scale sorting problems**! 🚀✨

## The Theoretical Foundation: Understanding Basic Sorting 🧠

### Sorting Problem Definition

**Sorting is the fundamental problem of arranging elements in a specific order according to a comparison function.** This seemingly simple problem forms the foundation of computer science and has profound implications for data organization, search efficiency, and algorithm design.

**Formal Definition:**
- **Input**: Array of n elements A = [a₁, a₂, ..., aₙ]
- **Output**: Permutation A' = [a'₁, a'₂, ..., a'ₙ] where a'₁ ≤ a'₂ ≤ ... ≤ a'ₙ
- **Comparison Function**: Defines the ordering relationship between elements
- **Stability**: Maintains relative order of equal elements

**Key Properties:**
1. **Correctness**: Output must be properly ordered according to comparison function
2. **Permutation**: Output contains exactly the same elements as input
3. **Deterministic**: Same input always produces same output (for stable algorithms)
4. **Termination**: Algorithm must complete in finite time

### Algorithm Classification Framework

**Basic sorting algorithms can be classified along multiple dimensions:**

**By Comparison Model:**
- **Comparison-based**: Use only element comparisons (all basic sorts)
- **Non-comparison**: Use element properties (counting, radix sorts)

**By Memory Usage:**
- **In-place**: O(1) extra memory (all three basic algorithms)
- **Out-of-place**: O(n) or more extra memory (merge sort)

**By Stability:**
- **Stable**: Maintains relative order of equal elements (bubble, insertion)
- **Unstable**: May change relative order of equal elements (selection)

**By Adaptability:**
- **Adaptive**: Performance improves on nearly sorted input (insertion, bubble optimized)
- **Non-adaptive**: Same performance regardless of input order (selection)

### Bubble Sort Deep Analysis

**Bubble Sort is the simplest sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they're in wrong order.**

**Algorithm Mechanics:**
1. **Pass Through Array**: Compare each adjacent pair
2. **Swap if Necessary**: Exchange elements if they're out of order  
3. **Bubble Effect**: Largest element "bubbles up" to correct position
4. **Repeat Passes**: Continue until no swaps are made

**Mathematical Analysis:**
- **Passes Required**: At most n-1 passes for n elements
- **Comparisons per Pass**: Decreases by 1 each pass (n-1, n-2, ..., 1)
- **Total Comparisons**: Σ(i=1 to n-1) i = n(n-1)/2 = O(n²)
- **Swaps**: O(n²) in worst case (reverse sorted array)

**Optimization Opportunities:**
- **Early Termination**: Stop if no swaps made in a pass
- **Boundary Reduction**: Reduce comparison range after each pass
- **Cocktail Sort**: Bidirectional bubble sort variant

### Selection Sort Deep Analysis

**Selection Sort divides the array into sorted and unsorted portions, repeatedly selecting the minimum element from unsorted portion and placing it at the end of sorted portion.**

**Algorithm Mechanics:**
1. **Find Minimum**: Scan unsorted portion for smallest element
2. **Swap with First**: Exchange minimum with first unsorted element
3. **Expand Sorted Region**: Sorted portion grows by one element
4. **Repeat**: Continue until all elements are sorted

**Mathematical Analysis:**
- **Iterations**: Exactly n-1 iterations for n elements
- **Comparisons**: Σ(i=0 to n-2) (n-1-i) = n(n-1)/2 = O(n²)
- **Swaps**: Exactly n-1 swaps (minimum possible for comparison sort)
- **Invariant**: First i elements are always in final sorted order

**Key Characteristics:**
- **Minimizes Swaps**: Fewest exchanges among comparison-based sorts
- **Not Adaptive**: Same performance on all inputs
- **Unstable**: Relative order of equal elements may change
- **Simple Logic**: Easy to understand and implement

### Insertion Sort Deep Analysis

**Insertion Sort builds the sorted array one element at a time by repeatedly taking an element from the unsorted portion and inserting it into its correct position in the sorted portion.**

**Algorithm Mechanics:**
1. **Start with Second Element**: First element forms initial sorted region
2. **Insert Element**: Take next element and find its correct position
3. **Shift Elements**: Move larger elements one position right
4. **Place Element**: Insert current element in correct position
5. **Expand Region**: Sorted region grows by one element

**Mathematical Analysis:**
- **Best Case**: O(n) when array is already sorted (just n-1 comparisons)
- **Worst Case**: O(n²) when array is reverse sorted
- **Average Case**: O(n²) with about n²/4 comparisons and swaps
- **Adaptive Performance**: Performance scales with "sortedness" of input

**Advantages:**
- **Online Algorithm**: Can sort elements as they arrive
- **Stable**: Maintains relative order of equal elements
- **In-place**: Requires only O(1) extra memory
- **Efficient for Small Arrays**: Often fastest for small datasets (n < 50)

### Comparative Analysis Framework

**Performance Comparison on Different Input Types:**

**Random Data:**
- All three algorithms perform similarly poorly: O(n²)
- Insertion sort typically fastest due to fewer writes
- Selection sort most predictable (always same number of operations)

**Nearly Sorted Data:**
- Insertion sort: O(n) - excellent performance
- Bubble sort: O(n) with optimization
- Selection sort: O(n²) - no improvement

**Reverse Sorted Data:**
- All algorithms achieve worst-case O(n²) performance
- Maximum number of swaps and comparisons required
- Bubble sort particularly inefficient

**Identical Elements:**
- Insertion sort: O(n) - optimal performance
- Bubble sort: O(n) with optimization
- Selection sort: O(n²) - unnecessarily scans all elements

### Stability Analysis

**Stability is crucial when sorting complex objects with multiple fields:**

**Stable Algorithms (Bubble, Insertion):**
```javascript
// Input: [(John, 25), (Alice, 30), (Bob, 25)]
// Sort by age (stable)
// Output: [(John, 25), (Bob, 25), (Alice, 30)]
// John appears before Bob since John came first in input
```

**Unstable Algorithm (Selection):**
```javascript
// Input: [(John, 25), (Alice, 30), (Bob, 25)]  
// Sort by age (unstable)
// Output: [(Bob, 25), (John, 25), (Alice, 30)]
// Relative order of John and Bob may be changed
```

**Making Selection Sort Stable:**
```javascript
// Instead of simple swaps, use element shifting
// This preserves relative order but increases complexity
```

### Algorithm Optimization Strategies

**Bubble Sort Optimizations:**
1. **Early Termination**: Stop if no swaps in a pass
2. **Boundary Tracking**: Remember last swap position
3. **Cocktail Sort**: Alternate left-to-right and right-to-left passes

**Selection Sort Optimizations:**
1. **Dual Selection**: Find both minimum and maximum in each pass
2. **Heap Selection**: Use heap data structure for selection
3. **Stable Variant**: Use insertion-like shifting instead of swapping

**Insertion Sort Optimizations:**
1. **Binary Search**: Use binary search to find insertion position
2. **Shell Sort**: Use decreasing gap sequence for better performance
3. **Sentinel**: Use sentinel value to eliminate bounds checking

### Practical Implementation Considerations

**Memory Access Patterns:**
- **Cache Efficiency**: All algorithms have good spatial locality
- **Write Performance**: Selection sort minimizes writes (important for flash memory)
- **Pipeline Efficiency**: Simple operations pipeline well on modern CPUs

**Branching and Predictions:**
- **Bubble Sort**: Many conditional swaps (branch mispredictions)
- **Selection Sort**: Predictable access patterns
- **Insertion Sort**: Variable branching based on data distribution

**Compiler Optimizations:**
- **Loop Unrolling**: Compilers can optimize simple loops effectively
- **Vectorization**: Modern compilers may vectorize simple operations
- **Inlining**: Small sorting functions often get inlined

## Complete Bubble Sort Implementation 🔧

**Concept**: Comprehensive Bubble Sort with all optimizations and detailed analysis.

```javascript
// Complete Bubble Sort Implementation with Analysis

class BubbleSortMaster {
    constructor() {
        this.comparisons = 0;
        this.swaps = 0;
        this.passes = 0;
        this.iterations = [];
        
        console.log(`\n🫧 BUBBLE SORT MASTER initialized`);
        console.log(`Ready to demonstrate the bubble-up sorting process!`);
    }
    
    // Basic Bubble Sort implementation
    bubbleSortBasic(arr) {
        console.log(`\n🚀 BASIC BUBBLE SORT`);
        console.log(`Initial array: [${arr.join(', ')}]`);
        
        const n = arr.length;
        const result = [...arr]; // Create copy to avoid modifying original
        
        this.resetCounters();
        
        console.log(`\nArray length: ${n} elements`);
        console.log(`Maximum passes needed: ${n - 1}`);
        
        // Perform bubble sort with detailed tracking
        for (let pass = 0; pass < n - 1; pass++) {
            console.log(`\n--- PASS ${pass + 1} ---`);
            console.log(`Checking elements 0 to ${n - 1 - pass}`);
            
            let swappedInThisPass = false;
            const passSwaps = [];
            
            // Compare adjacent elements in current pass
            for (let i = 0; i < n - 1 - pass; i++) {
                this.comparisons++;
                
                console.log(`\n  Compare positions ${i} and ${i + 1}:`);
                console.log(`    ${result[i]} vs ${result[i + 1]}`);
                
                if (result[i] > result[i + 1]) {
                    // Swap elements
                    console.log(`    ✅ SWAP needed: ${result[i]} > ${result[i + 1]}`);
                    
                    [result[i], result[i + 1]] = [result[i + 1], result[i]];
                    this.swaps++;
                    swappedInThisPass = true;
                    
                    passSwaps.push({
                        position: i,
                        swapped: `${result[i + 1]} ↔ ${result[i]}`
                    });
                    
                    console.log(`    Result: [${result.join(', ')}]`);
                } else {
                    console.log(`    ⚠️ No swap: ${result[i]} ≤ ${result[i + 1]}`);
                }
            }
            
            this.passes++;
            
            console.log(`\n  Pass ${pass + 1} complete:`);
            console.log(`    Array state: [${result.join(', ')}]`);
            console.log(`    Swaps made: ${passSwaps.length}`);
            console.log(`    Element ${result[n - 1 - pass]} is now in final position ${n - 1 - pass}`);
            
            // Record iteration details
            this.iterations.push({
                pass: pass + 1,
                swaps: passSwaps,
                swappedInPass: swappedInThisPass,
                finalElement: result[n - 1 - pass],
                arrayState: [...result]
            });
            
            // Early termination check
            if (!swappedInThisPass) {
                console.log(`\n🎯 EARLY TERMINATION: No swaps in pass ${pass + 1}`);
                console.log(`Array is now sorted!`);
                break;
            }
        }
        
        console.log(`\n✅ BUBBLE SORT COMPLETE!`);
        this.analyzePerformance(arr, result);
        
        return result;
    }
    
    // Optimized Bubble Sort with early termination
    bubbleSortOptimized(arr) {
        console.log(`\n⚡ OPTIMIZED BUBBLE SORT`);
        console.log(`Initial array: [${arr.join(', ')}]`);
        
        const n = arr.length;
        const result = [...arr];
        
        this.resetCounters();
        
        let hasSwapped = true;
        let pass = 0;
        
        while (hasSwapped && pass < n - 1) {
            hasSwapped = false;
            pass++;
            
            console.log(`\n--- PASS ${pass} (Optimized) ---`);
            
            for (let i = 0; i < n - pass; i++) {
                this.comparisons++;
                
                if (result[i] > result[i + 1]) {
                    [result[i], result[i + 1]] = [result[i + 1], result[i]];
                    this.swaps++;
                    hasSwapped = true;
                    
                    console.log(`  Swap at positions ${i},${i + 1}: [${result.join(', ')}]`);
                }
            }
            
            if (!hasSwapped) {
                console.log(`  No swaps in pass ${pass} - array is sorted!`);
            }
        }
        
        this.passes = pass;
        
        console.log(`\n✅ OPTIMIZED BUBBLE SORT COMPLETE!`);
        console.log(`Passes required: ${this.passes} (vs maximum ${n - 1})`);
        
        return result;
    }
    
    // Cocktail Shaker Sort (bidirectional bubble sort)
    cocktailShakerSort(arr) {
        console.log(`\n🍸 COCKTAIL SHAKER SORT (Bidirectional Bubble Sort)`);
        console.log(`Initial array: [${arr.join(', ')}]`);
        
        const n = arr.length;
        const result = [...arr];
        
        this.resetCounters();
        
        let left = 0;
        let right = n - 1;
        let hasSwapped = true;
        
        while (hasSwapped && left < right) {
            hasSwapped = false;
            this.passes++;
            
            console.log(`\n--- PASS ${this.passes} (Left to Right) ---`);
            console.log(`Range: ${left} to ${right}`);
            
            // Left to right pass (bubble largest to right)
            for (let i = left; i < right; i++) {
                this.comparisons++;
                
                if (result[i] > result[i + 1]) {
                    [result[i], result[i + 1]] = [result[i + 1], result[i]];
                    this.swaps++;
                    hasSwapped = true;
                    
                    console.log(`  Swap ${i},${i + 1}: [${result.join(', ')}]`);
                }
            }
            
            right--; // Largest element is now in place
            console.log(`  Element ${result[right + 1]} placed at position ${right + 1}`);
            
            if (!hasSwapped) break;
            
            console.log(`\n--- PASS ${this.passes} (Right to Left) ---`);
            
            // Right to left pass (bubble smallest to left)
            for (let i = right; i > left; i--) {
                this.comparisons++;
                
                if (result[i] < result[i - 1]) {
                    [result[i], result[i - 1]] = [result[i - 1], result[i]];
                    this.swaps++;
                    hasSwapped = true;
                    
                    console.log(`  Swap ${i - 1},${i}: [${result.join(', ')}]`);
                }
            }
            
            left++; // Smallest element is now in place
            console.log(`  Element ${result[left - 1]} placed at position ${left - 1}`);
        }
        
        console.log(`\n✅ COCKTAIL SHAKER SORT COMPLETE!`);
        
        return result;
    }
    
    // Reset performance counters
    resetCounters() {
        this.comparisons = 0;
        this.swaps = 0;
        this.passes = 0;
        this.iterations = [];
    }
    
    // Analyze performance and display results
    analyzePerformance(original, sorted) {
        console.log(`\n📊 BUBBLE SORT PERFORMANCE ANALYSIS`);
        
        const n = original.length;
        
        console.log(`\n🎯 RESULTS:`);
        console.log(`  Original: [${original.join(', ')}]`);
        console.log(`  Sorted:   [${sorted.join(', ')}]`);
        console.log(`  Correct:  ${this.isSorted(sorted) ? '✅ Yes' : '❌ No'}`);
        
        console.log(`\n📈 PERFORMANCE METRICS:`);
        console.log(`  Array size: ${n} elements`);
        console.log(`  Comparisons: ${this.comparisons}`);
        console.log(`  Swaps: ${this.swaps}`);
        console.log(`  Passes: ${this.passes}`);
        console.log(`  Efficiency: ${((this.swaps / (n * (n - 1) / 2)) * 100).toFixed(2)}% of worst case`);
        
        // Theoretical analysis
        console.log(`\n🧮 THEORETICAL COMPARISON:`);
        console.log(`  Best case:    O(n) = ${n} comparisons`);
        console.log(`  Average case: O(n²) ≈ ${Math.floor(n * n / 4)} comparisons`);
        console.log(`  Worst case:   O(n²) = ${n * (n - 1) / 2} comparisons`);
        console.log(`  Actual:       ${this.comparisons} comparisons`);
        
        // Pass-by-pass analysis
        console.log(`\n🔄 PASS-BY-PASS ANALYSIS:`);
        this.iterations.forEach(iter => {
            console.log(`  Pass ${iter.pass}: ${iter.swaps.length} swaps, final element: ${iter.finalElement}`);
        });
        
        return {
            comparisons: this.comparisons,
            swaps: this.swaps,
            passes: this.passes,
            efficiency: (this.swaps / (n * (n - 1) / 2)) * 100
        };
    }
    
    // Check if array is sorted
    isSorted(arr) {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < arr[i - 1]) {
                return false;
            }
        }
        return true;
    }
    
    // Demonstrate all bubble sort variants
    demonstrateBubbleSort(arr) {
        console.log('=== BUBBLE SORT COMPREHENSIVE DEMONSTRATION ===');
        
        console.log('\n1. BASIC BUBBLE SORT:');
        const basic = this.bubbleSortBasic([...arr]);
        const basicStats = {
            comparisons: this.comparisons,
            swaps: this.swaps,
            passes: this.passes
        };
        
        console.log('\n2. OPTIMIZED BUBBLE SORT:');
        const optimized = this.bubbleSortOptimized([...arr]);
        const optimizedStats = {
            comparisons: this.comparisons,
            swaps: this.swaps,
            passes: this.passes
        };
        
        console.log('\n3. COCKTAIL SHAKER SORT:');
        const cocktail = this.cocktailShakerSort([...arr]);
        const cocktailStats = {
            comparisons: this.comparisons,
            swaps: this.swaps,
            passes: this.passes
        };
        
        console.log('\n📊 VARIANT COMPARISON:');
        console.log(`Algorithm        | Comparisons | Swaps | Passes`);
        console.log(`=================|=============|=======|=======`);
        console.log(`Basic Bubble     | ${basicStats.comparisons.toString().padStart(11)} | ${basicStats.swaps.toString().padStart(5)} | ${basicStats.passes.toString().padStart(6)}`);
        console.log(`Optimized Bubble | ${optimizedStats.comparisons.toString().padStart(11)} | ${optimizedStats.swaps.toString().padStart(5)} | ${optimizedStats.passes.toString().padStart(6)}`);
        console.log(`Cocktail Shaker  | ${cocktailStats.comparisons.toString().padStart(11)} | ${cocktailStats.swaps.toString().padStart(5)} | ${cocktailStats.passes.toString().padStart(6)}`);
        
        console.log(`\n🎯 BUBBLE SORT SUMMARY:`);
        console.log(`✅ Simple and intuitive algorithm`);
        console.log(`✅ Stable sorting (maintains equal element order)`);
        console.log(`✅ In-place sorting (O(1) space complexity)`);
        console.log(`✅ Adaptive with optimization (O(n) best case)`);
        console.log(`⚠️ Poor performance on large datasets (O(n²))`);
        
        return {
            basic: { result: basic, stats: basicStats },
            optimized: { result: optimized, stats: optimizedStats },
            cocktail: { result: cocktail, stats: cocktailStats }
        };
    }
}

// Example usage and testing
console.log('\n' + '='.repeat(60));
console.log('🔸 BUBBLE SORT EXAMPLE: Student Grades');

const studentGrades = [85, 92, 78, 96, 88, 76, 94];
console.log(`Sorting student grades: [${studentGrades.join(', ')}]`);

const bubbleDemo = new BubbleSortMaster();
bubbleDemo.demonstrateBubbleSort(studentGrades);

// Test on different input types
console.log('\n🔸 TESTING ON DIFFERENT INPUT TYPES:');

console.log('\nAlready sorted array:');
const sortedArray = [1, 2, 3, 4, 5];
bubbleDemo.bubbleSortOptimized(sortedArray);

console.log('\nReverse sorted array:');
const reverseArray = [5, 4, 3, 2, 1];
bubbleDemo.bubbleSortOptimized(reverseArray);

console.log('\nArray with duplicates:');
const duplicateArray = [3, 1, 4, 1, 5, 9, 2, 6, 5];
bubbleDemo.bubbleSortOptimized(duplicateArray);
```

This comprehensive Bubble Sort implementation demonstrates the algorithm's mechanics, optimizations, and performance characteristics with detailed step-by-step execution tracking.

## Complete Selection Sort Implementation 🔧

**Concept**: Comprehensive Selection Sort with analysis and optimization strategies.

```javascript
// Complete Selection Sort Implementation with Analysis

class SelectionSortMaster {
    constructor() {
        this.comparisons = 0;
        this.swaps = 0;
        this.selections = 0;
        this.iterations = [];
        
        console.log(`\n🎯 SELECTION SORT MASTER initialized`);
        console.log(`Ready to demonstrate the find-and-select sorting process!`);
    }
    
    // Basic Selection Sort implementation
    selectionSortBasic(arr) {
        console.log(`\n🚀 BASIC SELECTION SORT`);
        console.log(`Initial array: [${arr.join(', ')}]`);
        
        const n = arr.length;
        const result = [...arr];
        
        this.resetCounters();
        
        console.log(`\nArray length: ${n} elements`);
        console.log(`Iterations needed: ${n - 1}`);
        
        // Perform selection sort with detailed tracking
        for (let i = 0; i < n - 1; i++) {
            console.log(`\n--- ITERATION ${i + 1} ---`);
            console.log(`Finding minimum in range [${i}, ${n - 1}]`);
            console.log(`Current array: [${result.join(', ')}]`);
            console.log(`Sorted portion: [${result.slice(0, i).join(', ')}]`);
            console.log(`Unsorted portion: [${result.slice(i).join(', ')}]`);
            
            let minIndex = i;
            let minValue = result[i];
            const candidates = [];
            
            console.log(`\n  Starting with ${result[i]} at position ${i} as minimum candidate`);
            
            // Find minimum element in unsorted portion
            for (let j = i + 1; j < n; j++) {
                this.comparisons++;
                
                console.log(`\n    Compare: ${result[j]} (pos ${j}) vs current min ${minValue} (pos ${minIndex})`);
                
                if (result[j] < minValue) {
                    console.log(`      ✅ NEW MINIMUM found: ${result[j]} < ${minValue}`);
                    
                    candidates.push({
                        oldMin: { value: minValue, index: minIndex },
                        newMin: { value: result[j], index: j }
                    });
                    
                    minIndex = j;
                    minValue = result[j];
                } else {
                    console.log(`      ⚠️ Not smaller: ${result[j]} ≥ ${minValue}`);
                }
            }
            
            this.selections++;
            
            console.log(`\n  🎯 MINIMUM FOUND: ${minValue} at position ${minIndex}`);
            
            // Swap minimum with first element of unsorted portion
            if (minIndex !== i) {
                console.log(`  📦 SWAP needed: position ${i} (${result[i]}) ↔ position ${minIndex} (${result[minIndex]})`);
                
                [result[i], result[minIndex]] = [result[minIndex], result[i]];
                this.swaps++;
                
                console.log(`  ✅ After swap: [${result.join(', ')}]`);
            } else {
                console.log(`  ⚪ No swap needed: ${minValue} already in correct position`);
            }
            
            console.log(`  📍 Position ${i} is now finalized with value ${result[i]}`);
            
            // Record iteration details
            this.iterations.push({
                iteration: i + 1,
                searchRange: [i, n - 1],
                candidates: candidates,
                minFound: { value: minValue, index: minIndex },
                swapMade: minIndex !== i,
                finalValue: result[i],
                arrayState: [...result]
            });
        }
        
        console.log(`\n✅ SELECTION SORT COMPLETE!`);
        console.log(`Final position ${n - 1} automatically has correct value: ${result[n - 1]}`);
        
        this.analyzePerformance(arr, result);
        
        return result;
    }
    
    // Selection Sort with dual selection (find min and max)
    selectionSortDual(arr) {
        console.log(`\n⚡ DUAL SELECTION SORT (Find Min and Max)`);
        console.log(`Initial array: [${arr.join(', ')}]`);
        
        const result = [...arr];
        const n = result.length;
        
        this.resetCounters();
        
        let left = 0;
        let right = n - 1;
        
        while (left < right) {
            let minIndex = left;
            let maxIndex = left;
            
            console.log(`\n--- ITERATION: left=${left}, right=${right} ---`);
            console.log(`Finding min and max in range [${left}, ${right}]`);
            
            // Find both minimum and maximum in current range
            for (let i = left + 1; i <= right; i++) {
                this.comparisons += 2; // One comparison each for min and max
                
                if (result[i] < result[minIndex]) {
                    minIndex = i;
                    console.log(`  New min: ${result[i]} at position ${i}`);
                }
                
                if (result[i] > result[maxIndex]) {
                    maxIndex = i;
                    console.log(`  New max: ${result[i]} at position ${i}`);
                }
            }
            
            console.log(`  Min found: ${result[minIndex]} at position ${minIndex}`);
            console.log(`  Max found: ${result[maxIndex]} at position ${maxIndex}`);
            
            // Handle special case where max is at left position
            if (maxIndex === left) {
                maxIndex = minIndex;
            }
            
            // Place minimum at left position
            if (minIndex !== left) {
                [result[left], result[minIndex]] = [result[minIndex], result[left]];
                this.swaps++;
                console.log(`  Swap min: [${result.join(', ')}]`);
            }
            
            // Place maximum at right position
            if (maxIndex !== right) {
                [result[right], result[maxIndex]] = [result[maxIndex], result[right]];
                this.swaps++;
                console.log(`  Swap max: [${result.join(', ')}]`);
            }
            
            console.log(`  Positions ${left} and ${right} are now finalized`);
            
            left++;
            right--;
        }
        
        console.log(`\n✅ DUAL SELECTION SORT COMPLETE!`);
        
        return result;
    }
    
    // Stable Selection Sort (maintains order of equal elements)
    selectionSortStable(arr) {
        console.log(`\n🔄 STABLE SELECTION SORT`);
        console.log(`Initial array: [${arr.join(', ')}]`);
        
        const result = [...arr];
        const n = result.length;
        
        this.resetCounters();
        
        for (let i = 0; i < n - 1; i++) {
            let minIndex = i;
            
            console.log(`\n--- ITERATION ${i + 1} (Stable) ---`);
            
            // Find minimum in remaining array
            for (let j = i + 1; j < n; j++) {
                this.comparisons++;
                if (result[j] < result[minIndex]) {
                    minIndex = j;
                }
            }
            
            console.log(`Minimum ${result[minIndex]} found at position ${minIndex}`);
            
            // Instead of swapping, shift elements to maintain stability
            if (minIndex !== i) {
                const minValue = result[minIndex];
                
                console.log(`Shifting elements to maintain stability:`);
                
                // Shift elements right to make room
                for (let k = minIndex; k > i; k--) {
                    result[k] = result[k - 1];
                    console.log(`  Shift: ${result[k]} moved to position ${k}`);
                }
                
                result[i] = minValue;
                this.swaps++; // Count as one operation even though it's multiple moves
                
                console.log(`  Placed ${minValue} at position ${i}`);
                console.log(`  Array: [${result.join(', ')}]`);
            }
        }
        
        console.log(`\n✅ STABLE SELECTION SORT COMPLETE!`);
        
        return result;
    }
    
    // Reset performance counters
    resetCounters() {
        this.comparisons = 0;
        this.swaps = 0;
        this.selections = 0;
        this.iterations = [];
    }
    
    // Analyze performance and display results
    analyzePerformance(original, sorted) {
        console.log(`\n📊 SELECTION SORT PERFORMANCE ANALYSIS`);
        
        const n = original.length;
        
        console.log(`\n🎯 RESULTS:`);
        console.log(`  Original: [${original.join(', ')}]`);
        console.log(`  Sorted:   [${sorted.join(', ')}]`);
        console.log(`  Correct:  ${this.isSorted(sorted) ? '✅ Yes' : '❌ No'}`);
        
        console.log(`\n📈 PERFORMANCE METRICS:`);
        console.log(`  Array size: ${n} elements`);
        console.log(`  Comparisons: ${this.comparisons}`);
        console.log(`  Swaps: ${this.swaps}`);
        console.log(`  Selections: ${this.selections}`);
        console.log(`  Theoretical comparisons: ${n * (n - 1) / 2}`);
        console.log(`  Theoretical swaps: ${n - 1} (maximum)`);
        
        // Analysis of algorithm efficiency
        console.log(`\n🧮 EFFICIENCY ANALYSIS:`);
        console.log(`  Comparison efficiency: ${((this.comparisons / (n * (n - 1) / 2)) * 100).toFixed(2)}%`);
        console.log(`  Swap efficiency: ${((this.swaps / (n - 1)) * 100).toFixed(2)}% of maximum`);
        console.log(`  Selections per element: ${(this.selections / n).toFixed(2)}`);
        
        // Iteration-by-iteration analysis
        console.log(`\n🔄 ITERATION ANALYSIS:`);
        this.iterations.forEach(iter => {
            const candidateChanges = iter.candidates.length;
            console.log(`  Iteration ${iter.iteration}: ${candidateChanges} candidate changes, final: ${iter.finalValue}`);
        });
        
        return {
            comparisons: this.comparisons,
            swaps: this.swaps,
            selections: this.selections
        };
    }
    
    // Check if array is sorted
    isSorted(arr) {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < arr[i - 1]) {
                return false;
            }
        }
        return true;
    }
    
    // Compare selection sort variants
    compareVariants(arr) {
        console.log(`\n🔀 SELECTION SORT VARIANTS COMPARISON`);
        
        console.log('\n1. BASIC SELECTION SORT:');
        const basic = this.selectionSortBasic([...arr]);
        const basicStats = { comparisons: this.comparisons, swaps: this.swaps };
        
        console.log('\n2. DUAL SELECTION SORT:');
        const dual = this.selectionSortDual([...arr]);
        const dualStats = { comparisons: this.comparisons, swaps: this.swaps };
        
        console.log('\n3. STABLE SELECTION SORT:');
        const stable = this.selectionSortStable([...arr]);
        const stableStats = { comparisons: this.comparisons, swaps: this.swaps };
        
        console.log('\n📊 VARIANT COMPARISON:');
        console.log(`Variant      | Comparisons | Swaps | Notes`);
        console.log(`=============|=============|=======|========================`);
        console.log(`Basic        | ${basicStats.comparisons.toString().padStart(11)} | ${basicStats.swaps.toString().padStart(5)} | Standard implementation`);
        console.log(`Dual         | ${dualStats.comparisons.toString().padStart(11)} | ${dualStats.swaps.toString().padStart(5)} | Finds min and max together`);
        console.log(`Stable       | ${stableStats.comparisons.toString().padStart(11)} | ${stableStats.swaps.toString().padStart(5)} | Maintains element order`);
        
        return { basic, dual, stable };
    }
    
    // Demonstrate complete selection sort
    demonstrateSelectionSort(arr) {
        console.log('=== SELECTION SORT COMPREHENSIVE DEMONSTRATION ===');
        
        const results = this.compareVariants(arr);
        
        console.log(`\n🎯 SELECTION SORT SUMMARY:`);
        console.log(`✅ Minimizes number of swaps (exactly n-1)`);
        console.log(`✅ Consistent O(n²) performance regardless of input`);
        console.log(`✅ In-place sorting (O(1) space complexity)`);
        console.log(`✅ Simple and predictable algorithm`);
        console.log(`⚠️ Not stable in basic form (equal elements may be reordered)`);
        console.log(`⚠️ Not adaptive (same performance on sorted/unsorted data)`);
        
        return results;
    }
}

// Example usage
console.log('\n🔸 SELECTION SORT EXAMPLE: Book Prices');

const bookPrices = [29.99, 45.50, 12.95, 67.99, 23.75, 89.99, 15.25];
console.log(`Sorting book prices: [${bookPrices.join(', ')}]`);

const selectionDemo = new SelectionSortMaster();
selectionDemo.demonstrateSelectionSort(bookPrices);
```

## Complete Insertion Sort Implementation 🔧

**Concept**: Comprehensive Insertion Sort with optimizations and real-world applications.

```javascript
// Complete Insertion Sort Implementation with Analysis

class InsertionSortMaster {
    constructor() {
        this.comparisons = 0;
        this.shifts = 0;
        this.insertions = 0;
        this.iterations = [];
        
        console.log(`\n📝 INSERTION SORT MASTER initialized`);
        console.log(`Ready to demonstrate the incremental insertion process!`);
    }
    
    // Basic Insertion Sort implementation
    insertionSortBasic(arr) {
        console.log(`\n🚀 BASIC INSERTION SORT`);
        console.log(`Initial array: [${arr.join(', ')}]`);
        
        const n = arr.length;
        const result = [...arr];
        
        this.resetCounters();
        
        console.log(`\nArray length: ${n} elements`);
        console.log(`Starting with first element as sorted portion`);
        console.log(`Sorted: [${result[0]}], Unsorted: [${result.slice(1).join(', ')}]`);
        
        // Start from second element (index 1)
        for (let i = 1; i < n; i++) {
            console.log(`\n--- ITERATION ${i} ---`);
            
            const currentElement = result[i];
            const sortedPortion = result.slice(0, i);
            const unsortedPortion = result.slice(i);
            
            console.log(`Inserting element: ${currentElement} (from position ${i})`);
            console.log(`Current sorted portion: [${sortedPortion.join(', ')}]`);
            console.log(`Current unsorted portion: [${unsortedPortion.join(', ')}]`);
            
            let j = i - 1;
            let insertionPosition = i;
            const shiftOperations = [];
            
            console.log(`\n  Finding insertion position for ${currentElement}:`);
            
            // Find correct position and shift elements
            while (j >= 0 && result[j] > currentElement) {
                this.comparisons++;
                
                console.log(`    Compare: ${result[j]} > ${currentElement}? Yes`);
                console.log(`    Shift: ${result[j]} moves from position ${j} to position ${j + 1}`);
                
                result[j + 1] = result[j];
                this.shifts++;
                
                shiftOperations.push({
                    element: result[j + 1],
                    from: j,
                    to: j + 1
                });
                
                j--;
                insertionPosition = j + 1;
            }
            
            if (j >= 0) {
                this.comparisons++;
                console.log(`    Compare: ${result[j]} > ${currentElement}? No`);
            }
            
            // Insert the current element at correct position
            result[j + 1] = currentElement;
            this.insertions++;
            
            console.log(`\n  ✅ INSERTION: ${currentElement} placed at position ${j + 1}`);
            console.log(`  Array after insertion: [${result.join(', ')}]`);
            console.log(`  New sorted portion: [${result.slice(0, i + 1).join(', ')}]`);
            console.log(`  Remaining unsorted: [${result.slice(i + 1).join(', ')}]`);
            
            // Record iteration details
            this.iterations.push({
                iteration: i,
                element: currentElement,
                originalPosition: i,
                finalPosition: j + 1,
                shifts: shiftOperations,
                comparisons: j >= 0 ? i - (j + 1) + 1 : i,
                arrayState: [...result]
            });
        }
        
        console.log(`\n✅ INSERTION SORT COMPLETE!`);
        this.analyzePerformance(arr, result);
        
        return result;
    }
    
    // Binary Search Insertion Sort (optimized for comparisons)
    insertionSortBinary(arr) {
        console.log(`\n⚡ BINARY SEARCH INSERTION SORT`);
        console.log(`Initial array: [${arr.join(', ')}]`);
        
        const result = [...arr];
        const n = result.length;
        
        this.resetCounters();
        
        for (let i = 1; i < n; i++) {
            const key = result[i];
            console.log(`\n--- ITERATION ${i}: Inserting ${key} ---`);
            
            // Binary search for insertion position
            let left = 0;
            let right = i;
            
            console.log(`  Binary search in range [${left}, ${right})`);
            
            while (left < right) {
                const mid = Math.floor((left + right) / 2);
                this.comparisons++;
                
                console.log(`    Compare: ${result[mid]} vs ${key} (mid=${mid})`);
                
                if (result[mid] > key) {
                    right = mid;
                    console.log(`      ${result[mid]} > ${key}, search left half [${left}, ${mid})`);
                } else {
                    left = mid + 1;
                    console.log(`      ${result[mid]} ≤ ${key}, search right half [${mid + 1}, ${right})`);
                }
            }
            
            const insertPos = left;
            console.log(`  Insertion position found: ${insertPos}`);
            
            // Shift elements to make room
            console.log(`  Shifting elements from position ${insertPos} to ${i - 1}:`);
            for (let j = i; j > insertPos; j--) {
                result[j] = result[j - 1];
                this.shifts++;
                console.log(`    Shift: ${result[j]} to position ${j}`);
            }
            
            result[insertPos] = key;
            this.insertions++;
            
            console.log(`  Inserted ${key} at position ${insertPos}`);
            console.log(`  Result: [${result.join(', ')}]`);
        }
        
        console.log(`\n✅ BINARY INSERTION SORT COMPLETE!`);
        
        return result;
    }
    
    // Insertion Sort with sentinel (optimization)
    insertionSortWithSentinel(arr) {
        console.log(`\n🛡️ INSERTION SORT WITH SENTINEL`);
        console.log(`Initial array: [${arr.join(', ')}]`);
        
        if (arr.length === 0) return [];
        
        const result = [...arr];
        const n = result.length;
        
        this.resetCounters();
        
        // Find minimum element and place it at the beginning (sentinel)
        let minIndex = 0;
        for (let i = 1; i < n; i++) {
            if (result[i] < result[minIndex]) {
                minIndex = i;
            }
        }
        
        if (minIndex !== 0) {
            [result[0], result[minIndex]] = [result[minIndex], result[0]];
            console.log(`Sentinel: moved ${result[0]} to front as sentinel`);
        }
        
        console.log(`Array with sentinel: [${result.join(', ')}]`);
        
        // Now perform insertion sort without bounds checking
        for (let i = 2; i < n; i++) {
            const key = result[i];
            let j = i - 1;
            
            console.log(`\nInserting ${key} (no bounds checking needed due to sentinel):`);
            
            // No need to check j >= 0 because sentinel guarantees termination
            while (result[j] > key) {
                result[j + 1] = result[j];
                this.shifts++;
                this.comparisons++;
                j--;
            }
            
            this.comparisons++; // Final comparison that failed the while condition
            result[j + 1] = key;
            this.insertions++;
            
            console.log(`  Result: [${result.join(', ')}]`);
        }
        
        console.log(`\n✅ SENTINEL INSERTION SORT COMPLETE!`);
        
        return result;
    }
    
    // Adaptive Insertion Sort (optimized for nearly sorted arrays)
    insertionSortAdaptive(arr) {
        console.log(`\n🎯 ADAPTIVE INSERTION SORT`);
        console.log(`Initial array: [${arr.join(', ')}]`);
        
        const result = [...arr];
        const n = result.length;
        
        this.resetCounters();
        
        // Check if array is already sorted or nearly sorted
        let inversionCount = 0;
        for (let i = 0; i < n - 1; i++) {
            if (result[i] > result[i + 1]) {
                inversionCount++;
            }
        }
        
        console.log(`Inversion count: ${inversionCount}`);
        
        if (inversionCount === 0) {
            console.log(`✅ Array is already sorted! No work needed.`);
            return result;
        }
        
        if (inversionCount <= n / 4) {
            console.log(`📈 Array is nearly sorted - using optimized approach`);
        }
        
        // Perform standard insertion sort with early termination detection
        for (let i = 1; i < n; i++) {
            const key = result[i];
            
            // Quick check: if element is already in correct position
            if (key >= result[i - 1]) {
                console.log(`Element ${key} already in correct position`);
                continue;
            }
            
            console.log(`\nInserting ${key}:`);
            
            let j = i - 1;
            while (j >= 0 && result[j] > key) {
                result[j + 1] = result[j];
                this.shifts++;
                this.comparisons++;
                j--;
            }
            
            if (j >= 0) this.comparisons++;
            
            result[j + 1] = key;
            this.insertions++;
            
            console.log(`  Result: [${result.join(', ')}]`);
        }
        
        console.log(`\n✅ ADAPTIVE INSERTION SORT COMPLETE!`);
        
        return result;
    }
    
    // Reset performance counters
    resetCounters() {
        this.comparisons = 0;
        this.shifts = 0;
        this.insertions = 0;
        this.iterations = [];
    }
    
    // Analyze performance and display results
    analyzePerformance(original, sorted) {
        console.log(`\n📊 INSERTION SORT PERFORMANCE ANALYSIS`);
        
        const n = original.length;
        
        console.log(`\n🎯 RESULTS:`);
        console.log(`  Original: [${original.join(', ')}]`);
        console.log(`  Sorted:   [${sorted.join(', ')}]`);
        console.log(`  Correct:  ${this.isSorted(sorted) ? '✅ Yes' : '❌ No'}`);
        
        console.log(`\n📈 PERFORMANCE METRICS:`);
        console.log(`  Array size: ${n} elements`);
        console.log(`  Comparisons: ${this.comparisons}`);
        console.log(`  Shifts: ${this.shifts}`);
        console.log(`  Insertions: ${this.insertions}`);
        
        // Calculate efficiency
        const bestCaseComparisons = n - 1;
        const worstCaseComparisons = n * (n - 1) / 2;
        const averageCaseComparisons = n * (n - 1) / 4;
        
        console.log(`\n🧮 THEORETICAL COMPARISON:`);
        console.log(`  Best case:    O(n) = ${bestCaseComparisons} comparisons`);
        console.log(`  Average case: O(n²) ≈ ${averageCaseComparisons} comparisons`);
        console.log(`  Worst case:   O(n²) = ${worstCaseComparisons} comparisons`);
        console.log(`  Actual:       ${this.comparisons} comparisons`);
        
        // Adaptability analysis
        const efficiency = this.comparisons / worstCaseComparisons;
        console.log(`\n📊 ADAPTABILITY ANALYSIS:`);
        console.log(`  Efficiency: ${(efficiency * 100).toFixed(2)}% of worst case`);
        console.log(`  Performance: ${efficiency < 0.25 ? 'Excellent (nearly sorted)' : 
                                      efficiency < 0.50 ? 'Good' :
                                      efficiency < 0.75 ? 'Average' : 'Poor (reverse sorted)'}`);
        
        return {
            comparisons: this.comparisons,
            shifts: this.shifts,
            insertions: this.insertions,
            efficiency: efficiency
        };
    }
    
    // Check if array is sorted
    isSorted(arr) {
        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < arr[i - 1]) {
                return false;
            }
        }
        return true;
    }
    
    // Compare insertion sort variants
    compareVariants(arr) {
        console.log(`\n🔀 INSERTION SORT VARIANTS COMPARISON`);
        
        console.log('\n1. BASIC INSERTION SORT:');
        const basic = this.insertionSortBasic([...arr]);
        const basicStats = { comparisons: this.comparisons, shifts: this.shifts };
        
        console.log('\n2. BINARY INSERTION SORT:');
        const binary = this.insertionSortBinary([...arr]);
        const binaryStats = { comparisons: this.comparisons, shifts: this.shifts };
        
        console.log('\n3. INSERTION SORT WITH SENTINEL:');
        const sentinel = this.insertionSortWithSentinel([...arr]);
        const sentinelStats = { comparisons: this.comparisons, shifts: this.shifts };
        
        console.log('\n4. ADAPTIVE INSERTION SORT:');
        const adaptive = this.insertionSortAdaptive([...arr]);
        const adaptiveStats = { comparisons: this.comparisons, shifts: this.shifts };
        
        console.log('\n📊 VARIANT COMPARISON:');
        console.log(`Variant         | Comparisons | Shifts | Notes`);
        console.log(`================|=============|========|===========================`);
        console.log(`Basic           | ${basicStats.comparisons.toString().padStart(11)} | ${basicStats.shifts.toString().padStart(6)} | Standard implementation`);
        console.log(`Binary Search   | ${binaryStats.comparisons.toString().padStart(11)} | ${binaryStats.shifts.toString().padStart(6)} | Fewer comparisons`);
        console.log(`With Sentinel   | ${sentinelStats.comparisons.toString().padStart(11)} | ${sentinelStats.shifts.toString().padStart(6)} | No bounds checking`);
        console.log(`Adaptive        | ${adaptiveStats.comparisons.toString().padStart(11)} | ${adaptiveStats.shifts.toString().padStart(6)} | Optimized for sorted data`);
        
        return { basic, binary, sentinel, adaptive };
    }
    
    // Demonstrate complete insertion sort
    demonstrateInsertionSort(arr) {
        console.log('=== INSERTION SORT COMPREHENSIVE DEMONSTRATION ===');
        
        const results = this.compareVariants(arr);
        
        console.log(`\n🎯 INSERTION SORT SUMMARY:`);
        console.log(`✅ Excellent for small arrays (n < 50)`);
        console.log(`✅ Adaptive - efficient on nearly sorted data`);
        console.log(`✅ Stable sorting (maintains equal element order)`);
        console.log(`✅ In-place sorting (O(1) space complexity)`);
        console.log(`✅ Online algorithm (can sort as elements arrive)`);
        console.log(`✅ Used in hybrid algorithms (QuickSort, TimSort)`);
        console.log(`⚠️ Poor performance on large random/reverse datasets`);
        
        return results;
    }
}

// Example usage and testing
console.log('\n🔸 INSERTION SORT EXAMPLE: Playing Cards');

const playingCards = [7, 2, 11, 1, 9, 5, 13];
console.log(`Sorting playing cards: [${playingCards.join(', ')}]`);

const insertionDemo = new InsertionSortMaster();
insertionDemo.demonstrateInsertionSort(playingCards);

// Test on nearly sorted array
console.log('\n🔸 TESTING ON NEARLY SORTED ARRAY:');
const nearlySorted = [1, 2, 4, 3, 5, 6, 8, 7, 9];
console.log(`Nearly sorted: [${nearlySorted.join(', ')}]`);
insertionDemo.insertionSortAdaptive(nearlySorted);
```

## Summary

### Core Basic Sorting Concepts Mastered
- **Sorting Problem**: Arrange elements in specific order using comparison function
- **In-Place Sorting**: Algorithms requiring only O(1) extra memory  
- **Stable Sorting**: Maintaining relative order of equal elements
- **Adaptive Algorithms**: Performance improves on nearly sorted input

### Algorithm Mastery Summary

**Bubble Sort:**
- **Approach**: Compare adjacent elements, swap if out of order
- **Time Complexity**: O(n²) average/worst, O(n) best with optimization
- **Space Complexity**: O(1) in-place sorting
- **Stability**: Stable algorithm
- **Best for**: Educational purposes, very small datasets (< 10 elements)

**Selection Sort:**
- **Approach**: Find minimum element, place in correct position
- **Time Complexity**: O(n²) in all cases (not adaptive)
- **Space Complexity**: O(1) in-place sorting  
- **Stability**: Unstable in basic form, can be made stable
- **Best for**: Minimizing number of swaps, predictable performance

**Insertion Sort:**
- **Approach**: Insert each element into correct position in sorted portion
- **Time Complexity**: O(n²) average/worst, O(n) best case
- **Space Complexity**: O(1) in-place sorting
- **Stability**: Stable algorithm
- **Best for**: Small arrays, nearly sorted data, online algorithms

### Performance Characteristics

**Time Complexity Comparison:**
```
Input Type       | Bubble | Selection | Insertion
================= | ====== | ========= | =========
Random           | O(n²)  | O(n²)     | O(n²)
Nearly Sorted    | O(n)   | O(n²)     | O(n)
Reverse Sorted   | O(n²)  | O(n²)     | O(n²)
Already Sorted   | O(n)   | O(n²)     | O(n)
```

**Operation Counts for n=1000:**
```
Algorithm    | Comparisons | Swaps/Shifts | Notes
============ | =========== | ============ | ===================
Bubble       | ~500,000    | ~250,000     | Many unnecessary comparisons
Selection    | ~500,000    | ~1,000       | Minimal swaps
Insertion    | ~250,000    | ~250,000     | Adaptive to input order
```

### Real-World Applications Mastered

**Educational and Learning:**
- **Algorithm Fundamentals**: Teaching basic sorting concepts and algorithm analysis
- **Interview Preparation**: Understanding time/space complexity trade-offs
- **Coding Practice**: Implementing simple algorithms from scratch
- **Debugging Skills**: Learning to trace algorithm execution step-by-step

**Small Data Processing:**
- **Embedded Systems**: Resource-constrained environments with small datasets
- **Game Development**: Sorting small collections (player scores, inventory items)
- **Configuration Management**: Organizing small lists of settings or parameters
- **Data Validation**: Preparing small datasets for comparison operations

**Hybrid Algorithm Components:**
- **QuickSort**: Uses insertion sort for small subarrays (typically n < 10-50)
- **TimSort**: Python's built-in sort uses insertion sort for small runs
- **Introsort**: C++ STL sort switches to insertion sort for small partitions
- **Library Implementations**: Most advanced sorts include basic sort optimizations

**Special Use Cases:**
- **Online Algorithms**: Insertion sort for data arriving in real-time
- **Nearly Sorted Data**: Insertion sort for maintaining sorted collections
- **Stable Sorting Needs**: When preserving element order is crucial
- **Memory-Constrained**: When O(1) space complexity is required

### Optimization Techniques Mastered

**Bubble Sort Optimizations:**
- **Early Termination**: Stop when no swaps occur in a pass
- **Boundary Reduction**: Reduce comparison range after each pass  
- **Cocktail Sort**: Bidirectional bubbling for better performance
- **Adaptive Termination**: Detect when array becomes sorted

**Selection Sort Optimizations:**
- **Dual Selection**: Find both minimum and maximum in single pass
- **Stable Variant**: Use element shifting instead of swapping
- **Heap Selection**: Use heap data structure for efficient minimum finding
- **Write Minimization**: Optimize for expensive write operations

**Insertion Sort Optimizations:**
- **Binary Search**: Use binary search to find insertion position
- **Sentinel Optimization**: Eliminate bounds checking with sentinel value
- **Gap Sequences**: Shell sort uses decreasing gaps for better performance
- **Adaptive Behavior**: Early termination for already-sorted elements

### Algorithm Selection Guidelines

**Choose Bubble Sort When:**
- **Education**: Teaching algorithm concepts and complexity analysis
- **Simplicity**: Need easiest possible sorting implementation
- **Debugging**: Want most traceable algorithm execution
- **Never for Production**: Too inefficient for real applications

**Choose Selection Sort When:**
- **Minimize Writes**: When write operations are expensive (flash memory)
- **Predictable Performance**: Need consistent O(n²) regardless of input
- **Simple Implementation**: Want straightforward algorithm without optimizations
- **Analysis Learning**: Understanding non-adaptive algorithm behavior

**Choose Insertion Sort When:**
- **Small Arrays**: Arrays with fewer than 50 elements
- **Nearly Sorted Data**: Data that's already mostly organized
- **Online Processing**: Elements arrive one at a time
- **Hybrid Algorithms**: As subroutine in more complex sorting algorithms
- **Stable Sorting**: When maintaining relative order is important

**Input Size Recommendations:**
```
Array Size | Best Choice    | Reason
========== | ============== | ===========================
n < 10     | Any algorithm  | Performance difference negligible
10 ≤ n < 50| Insertion Sort | Usually fastest for small arrays
n ≥ 50     | Advanced Sorts | O(n log n) algorithms become worthwhile
```

### Implementation Best Practices

**Code Quality:**
- **Clear Variable Names**: Use descriptive names for indices and temporary variables
- **Comprehensive Comments**: Explain algorithm logic and key invariants
- **Error Handling**: Validate input arrays and handle edge cases
- **Modular Design**: Separate sorting logic from input/output operations

**Performance Considerations:**
- **Compiler Optimizations**: Write code that compilers can optimize effectively
- **Cache Efficiency**: Maintain good spatial locality in memory access
- **Branch Prediction**: Minimize unpredictable conditional statements
- **Constant Factors**: Optimize inner loops for better practical performance

**Testing and Validation:**
- **Correctness Testing**: Verify sorting correctness on various input types
- **Stability Testing**: For stable algorithms, verify equal elements maintain order
- **Performance Profiling**: Measure actual performance vs theoretical expectations
- **Edge Case Handling**: Test empty arrays, single elements, duplicate values

### Common Pitfalls and Solutions

**Bubble Sort Pitfalls:**
- **Forgetting Optimization**: Always implement early termination for better best-case
- **Incorrect Loop Bounds**: Ensure inner loop doesn't access invalid indices
- **Unnecessary Passes**: Remember that each pass places one element correctly

**Selection Sort Pitfalls:**
- **Stability Issues**: Basic version isn't stable; use shifting for stability
- **Unnecessary Swaps**: Don't swap if minimum element is already in correct position
- **Index Tracking**: Carefully track minimum element index throughout search

**Insertion Sort Pitfalls:**
- **Bounds Checking**: Ensure while loop doesn't go below array start
- **Element Overwriting**: Save current element before shifting other elements
- **Off-by-One Errors**: Be careful with insertion position calculations

**General Pitfalls:**
- **Modifying Input**: Always work on copy unless in-place modification is intended
- **Comparison Function**: Ensure consistent comparison logic for complex objects
- **Integer Overflow**: Be careful with index arithmetic in large arrays

### Advanced Concepts and Extensions

**Algorithm Analysis:**
- **Invariant Maintenance**: Understanding loop invariants for correctness proofs
- **Amortized Analysis**: Understanding average-case performance over operation sequences
- **Lower Bounds**: Comparison-based sorting has Ω(n log n) lower bound
- **Decision Trees**: Visualizing all possible comparison sequences

**Theoretical Extensions:**
- **Sorting Networks**: Hardware-based parallel sorting implementations
- **External Sorting**: Sorting data larger than available memory
- **Stable vs Unstable**: Trade-offs between stability and performance
- **Adaptive Sorting**: Algorithms that adapt to input characteristics

**Modern Applications:**
- **Timsort**: Python's hybrid stable sort combining merge sort and insertion sort
- **Introsort**: C++ hybrid sort combining quicksort, heapsort, and insertion sort
- **Parallel Sorting**: Multi-threaded versions of basic sorting algorithms
- **GPU Sorting**: Massively parallel sorting on graphics processors

Basic sorting algorithms represent **fundamental algorithm design mastery** with **clear logic and guaranteed correctness**. From educational foundations to practical optimizations, these algorithms provide **essential understanding** for **algorithm analysis and serve as building blocks** for more advanced sorting techniques! 🚀✨

**Next up: Advanced Sorting Algorithms** - where we'll explore the power of divide-and-conquer with Merge Sort, Quick Sort, and Heap Sort for efficient large-scale data organization! 🎯
