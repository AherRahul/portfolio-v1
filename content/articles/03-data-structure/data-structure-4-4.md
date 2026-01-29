---
title: "Bulbs Problem"
description: "Master the greedy approach with carry forward technique to solve the bulbs switching problem. Learn how state propagation and toggle mechanics work in array problems."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-26"
datePublished: "2026-09-26"
showOnArticles: false
courseName: 03-data-structure
topics:
  - data-structures
resources:
  - title: "Greedy Algorithms"
    type: "reference"
    url: "https://www.geeksforgeeks.org/greedy-algorithms/"
    description: "Understanding greedy algorithmic approaches"
  - title: "State Toggle Problems"
    type: "tool"
    url: "https://visualgo.net/en"
    description: "Visualize state changes"
  - title: "Greedy Practice"
    type: "practice"
    url: "https://leetcode.com/tag/greedy/"
    description: "Practice greedy algorithm problems"

---

![image.png](https://res.cloudinary.com/duojkrgue/image/upload/v1758777256/Portfolio/dsa/Data_Structure_and_algorithms_xibaur.png)

Bulbs Problem
----------------------------

### Problem Statement:

A wire connects `N` light bulbs. Each bulb has a switch associated with it; however, due to **faulty wiring**, a switch also changes the state of **all the bulbs to the right** of the current bulb.

Given an initial state of all bulbs (represented as an array where 0 = OFF and 1 = ON), find the **minimum number of switches** you have to press to turn on all the bulbs.

You can press the same switch multiple times.

**Note:** 
* 0 represents the bulb is OFF
* 1 represents the bulb is ON

### Examples:

#### Example 1:

**Input:** A = [0, 1, 0, 1]

**Output:** 4

**Explanation:**
* Press switch at bulb 0: [1, 0, 1, 0] (toggle 0,1,2,3) → 1 press
* Press switch at bulb 1: [1, 1, 0, 1] (toggle 1,2,3) → 2 presses
* Press switch at bulb 2: [1, 1, 1, 0] (toggle 2,3) → 3 presses
* Press switch at bulb 3: [1, 1, 1, 1] (toggle 3) → 4 presses

#### Example 2:

**Input:** A = [1, 1, 1, 1]

**Output:** 0

**Explanation:** All bulbs are already ON, no switches needed.

#### Example 3:

**Input:** A = [0, 0, 0, 0]

**Output:** 1

**Explanation:**
* Press switch at bulb 0: All bulbs turn ON → 1 press

#### Example 4:

**Input:** A = [1, 0, 1]

**Output:** 2

**Explanation:**
* Press switch at bulb 1: [1, 1, 0] → 1 press
* Press switch at bulb 2: [1, 1, 1] → 2 presses

### Constraints:

* `1 ≤ N ≤ 10^5`
* `A[i] ∈ {0, 1}`

### Important Points to Understand:

**1. Faulty Wiring Effect:**
* Pressing switch at position i toggles bulbs at positions i, i+1, i+2, ..., N-1.
* This is a cascading effect to the right.

**2. Greedy Approach:**
* Process bulbs from left to right.
* If a bulb is OFF, we MUST press its switch (no other switch affects it from the left).
* No need to backtrack or check multiple solutions.

**3. State Tracking:**
* Track the current effective state considering all previous toggles.
* Use a toggle counter to determine actual state.

**4. Optimization:**
* Brute force: Try all combinations - exponential time.
* Greedy: Process left to right - O(N) time.

### Approach:

**Greedy Approach:**
1. Initialize `switches = 0` and `toggleCount = 0`.
2. Traverse array from left to right.
3. For each bulb:
   * Calculate actual state: `(A[i] + toggleCount) % 2`
   * If actual state is 0 (OFF):
     * Press the switch → `switches++`
     * Increment `toggleCount`
4. Return `switches`.

**Key Insight:** 
* When we press a switch, it affects current and all future bulbs.
* We carry forward the toggle count to know the actual state of each bulb.

### Time Complexity:

* **Time Complexity = O(N)** - Single pass through the array.

### Space Complexity:

* **Space Complexity = O(1)** - Only using counter variables.

### Dry Run:

```
Input: A = [0, 1, 0, 1]

Initialize: switches = 0, toggleCount = 0

i = 0, A[0] = 0
    actualState = (0 + 0) % 2 = 0 (OFF)
    Bulb is OFF → Press switch
    switches = 1, toggleCount = 1

i = 1, A[1] = 1
    actualState = (1 + 1) % 2 = 0 (OFF)
    Bulb is OFF (toggled once) → Press switch
    switches = 2, toggleCount = 2

i = 2, A[2] = 0
    actualState = (0 + 2) % 2 = 0 (OFF)
    Bulb is OFF (toggled twice, back to OFF) → Press switch
    switches = 3, toggleCount = 3

i = 3, A[3] = 1
    actualState = (1 + 3) % 2 = 0 (OFF)
    Bulb is OFF (toggled 3 times) → Press switch
    switches = 4, toggleCount = 4

Final switches = 4

Output: 4
```

### Dry Run - Example 2:

```
Input: A = [1, 1, 1, 1]

Initialize: switches = 0, toggleCount = 0

i = 0, A[0] = 1
    actualState = (1 + 0) % 2 = 1 (ON)
    Bulb is ON → No press needed

i = 1, A[1] = 1
    actualState = (1 + 0) % 2 = 1 (ON)
    Bulb is ON → No press needed

i = 2, A[2] = 1
    actualState = (1 + 0) % 2 = 1 (ON)
    Bulb is ON → No press needed

i = 3, A[3] = 1
    actualState = (1 + 0) % 2 = 1 (ON)
    Bulb is ON → No press needed

Final switches = 0

Output: 0
```

### Dry Run - Example 3:

```
Input: A = [0, 0, 0, 0]

Initialize: switches = 0, toggleCount = 0

i = 0, A[0] = 0
    actualState = (0 + 0) % 2 = 0 (OFF)
    Bulb is OFF → Press switch
    switches = 1, toggleCount = 1
    [This press turns ON all bulbs: 0,1,2,3]

i = 1, A[1] = 0
    actualState = (0 + 1) % 2 = 1 (ON)
    Bulb is ON (toggled once) → No press needed

i = 2, A[2] = 0
    actualState = (0 + 1) % 2 = 1 (ON)
    Bulb is ON (toggled once) → No press needed

i = 3, A[3] = 0
    actualState = (0 + 1) % 2 = 1 (ON)
    Bulb is ON (toggled once) → No press needed

Final switches = 1

Output: 1
```

### Visualization:

```
Example: A = [0, 1, 0, 1]

Initial state:
Index:  0  1  2  3
State: [0, 1, 0, 1]
        ↑  OFF (need to press)

After pressing switch 0:
        [1, 0, 1, 0]  (all toggled)
           ↑  OFF (need to press)
Presses: 1

After pressing switch 1:
        [1, 1, 0, 1]  (1,2,3 toggled)
              ↑  OFF (need to press)
Presses: 2

After pressing switch 2:
        [1, 1, 1, 0]  (2,3 toggled)
                 ↑  OFF (need to press)
Presses: 3

After pressing switch 3:
        [1, 1, 1, 1]  (3 toggled)
Presses: 4 ✓ All ON!

Visual representation of toggles:
    Press 0:  ████████████  (affects all)
    Press 1:     ████████   (affects 1,2,3)
    Press 2:        ████    (affects 2,3)
    Press 3:           █    (affects 3)
```

### Optimal Approach - JavaScript Code:

```javascript
function bulbs(A) {
    let switches = 0;
    let toggleCount = 0;
    
    for (let i = 0; i < A.length; i++) {
        // Calculate actual state considering previous toggles
        const actualState = (A[i] + toggleCount) % 2;
        
        // If bulb is OFF, press the switch
        if (actualState === 0) {
            switches++;
            toggleCount++;
        }
    }
    
    return switches;
}
```

**Time:** O(N) ✓
**Space:** O(1) ✓

### Alternative Approach - Simulating Actual Toggles:

```javascript
function bulbs_Simulation(A) {
    const state = [...A];  // Copy array
    let switches = 0;
    
    for (let i = 0; i < state.length; i++) {
        if (state[i] === 0) {
            // Press switch - toggle all from i to end
            switches++;
            for (let j = i; j < state.length; j++) {
                state[j] = 1 - state[j];  // Toggle
            }
        }
    }
    
    return switches;
}
```

**Time:** O(N²) ❌ (nested loops for toggling)
**Space:** O(N) ❌ (copy of array)

**Note:** This simulation approach is intuitive but inefficient. The optimal approach uses toggle counting.

### Alternative Approach - Using XOR:

```javascript
function bulbs_XOR(A) {
    let switches = 0;
    let toggle = 0;
    
    for (let i = 0; i < A.length; i++) {
        // XOR to get actual state
        const actualState = A[i] ^ toggle;
        
        if (actualState === 0) {
            switches++;
            toggle = toggle ^ 1;  // Flip toggle state
        }
    }
    
    return switches;
}
```

**Time:** O(N) ✓
**Space:** O(1) ✓

### Edge Cases to Consider:

**1. All Bulbs ON:**
* Input: A = [1, 1, 1, 1]
* Output: 0 (no switches needed)

**2. All Bulbs OFF:**
* Input: A = [0, 0, 0, 0]
* Output: 1 (one press at first bulb turns all ON)

**3. Single Bulb OFF:**
* Input: A = [0]
* Output: 1

**4. Single Bulb ON:**
* Input: A = [1]
* Output: 0

**5. Alternating Pattern:**
* Input: A = [0, 1, 0, 1, 0, 1]
* Each OFF bulb needs a press → count OFF bulbs considering toggles

**6. Two Bulbs:**
* Input: A = [0, 0]
* Output: 1 (press first, both turn ON)

**7. Large Array:**
* Input: Array of size 10^5
* Should handle efficiently in O(N) time

### Key Takeaways:

1. **Greedy approach works:** Process left to right, make local optimal decisions.

2. **Carry forward toggle count:** Track cumulative toggles to know actual state.

3. **Modulo arithmetic:** Use `(state + toggles) % 2` to determine actual ON/OFF.

4. **No backtracking needed:** Once we decide at position i, it's optimal.

5. **Cascading effect:** Each switch press affects all elements to its right.

6. **Applications:**
   * Circuit problems
   * Game state problems
   * Toggle mechanics in UI
   * Cascading updates in systems

7. **Interview strategy:**
   * Start by explaining the faulty wiring behavior.
   * Show simulation approach (intuitive but slow).
   * Optimize using toggle counter.
   * Walk through example showing toggle tracking.

8. **Common mistakes:**
   * Actually modifying the array (unnecessary and slower).
   * Not tracking toggle count properly.
   * Trying to optimize with look-ahead (greedy is sufficient).
   * Forgetting modulo for state calculation.

9. **Mathematical insight:**
   * Toggle is a binary operation: 0↔1.
   * Even number of toggles = original state.
   * Odd number of toggles = flipped state.

10. **Related problems:**
    * Minimum flips to make binary string alternating.
    * Light switching problems.
    * Game of life variations.
    * Cascading update problems.

11. **Why greedy works:**
    * For bulb at position i, only its switch can turn it ON from OFF.
    * Switches to the right don't affect bulb i.
    * Switches to the left have already been decided.
    * Hence, greedy decision is optimal.

12. **Extension:** "What if switch affects left and right?"
    * Answer: Much harder - needs dynamic programming or BFS.
    * Current problem is special because effect is one-directional.

