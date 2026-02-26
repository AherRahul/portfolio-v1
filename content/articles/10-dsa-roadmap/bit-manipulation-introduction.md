---
title: Introduction
description: Master Introduction in the Bit Manipulation module. Comprehensive
  guide and algorithmic problem solving.
datePublished: 2026-02-26
dateModified: 2026-02-26
topics:
  - dsa
courseName: 10-dsa-roadmap
showOnArticles: false
published: true
---

Most developers avoid bit manipulation because it looks intimidating\. Shifting bits, flipping 1s and 0s, reading cryptic expressions like `n & (n - 1)`\. It feels like black magic\.

But here is the truth: **bit manipulation is one of the highest ROI topics for coding interviews**\. A handful of techniques can solve dozens of problems, often in O\(1\) space and with blazing fast performance\.

> Computers think in bits\. When you learn to think in bits too, you unlock solutions that would otherwise seem impossible\.

In this chapter, we will cover:

*   What is bit manipulation and why it matters
*   The 6 bitwise operators you need to know
*   Essential bit manipulation techniques
*   Common patterns with sample problems
*   LeetCode problems to practice

# What is Bit Manipulation?

**Bit manipulation** is the process of performing operations directly on the binary representation of numbers\. Instead of working with decimal values, you work with individual bits \(0s and 1s\)\.

Every integer in a computer is stored as a sequence of bits\. For example, the number `5` is stored as `101` in binary \(assuming 3 bits for simplicity\)\.

```shell
Decimal: 5
Binary:  101

Breakdown:
 1 × 2² + 0 × 2¹ + 1 × 2⁰
= 4     + 0     + 1
= 5
```

### Why Learn Bit Manipulation?

1.  **Speed**: Bitwise operations are among the fastest operations a CPU can perform\. They happen in a single clock cycle\.
2.  **Space Efficiency**: You can store multiple boolean flags in a single integer\. Instead of using an array of booleans, one 32\-bit integer can hold 32 flags\.
3.  **Interview Favorite**: Companies like Google, Amazon, and Meta love bit manipulation problems because they test fundamental computer science knowledge\.
4.  **Elegant Solutions**: Many problems that seem to require O\(n\) space can be solved in O\(1\) space using bit tricks\.

# The 6 Bitwise Operators

Before diving into techniques, you need to understand the six fundamental bitwise operators\.

### 1\. AND \(`&`\)

Returns `1` only if **both** bits are `1`\.

```shell
 5 = 0101
& 3 = 0011
-----------
 1 = 0001
```

**Use case**: Check if a specific bit is set, clear bits, extract bits\.

### 2\. OR \(`|`\)

Returns `1` if **at least one** bit is `1`\.

```shell
 5 = 0101
| 3 = 0011
-----------
 7 = 0111
```

**Use case**: Set specific bits to 1\.

### 3\. XOR \(`^`\)

Returns `1` if the bits are **different**\.

Shell

```shell
 5 = 0101
^ 3 = 0011
-----------
 6 = 0110
```

**Use case**: Toggle bits, find unique elements, swap values\.

**Key property**: `a ^ a = 0` and `a ^ 0 = a`

### 4\. NOT \(`~`\)

Flips all bits \(0 becomes 1, 1 becomes 0\)\.

Shell

```shell
~5 = ~0101
-----------
   = 1010  (in a larger bit representation, this gives -6)
```

**Note**: In most languages, `~n = -(n + 1)` due to two's complement representation\.

### 5\. Left Shift \(`<<`\)

Shifts bits to the left by specified positions\. Each shift **multiplies** by 2\.

```shell
<< 1:
 0101 << 1
= 1010
= 10
```

**Formula**: `n << k = n × 2^k`

### 6\. Right Shift \(`>>`\)

Shifts bits to the right by specified positions\. Each shift **divides** by 2 \(integer division\)\.

```shell
>> 1:
 0101 >> 1
= 0010
= 2
```

**Formula**: `n >> k = n / 2^k` \(integer division\)

# Essential Bit Manipulation Techniques

Now let's look at the techniques that appear repeatedly in coding interviews\.

### 1\. Check if a Bit is Set

To check if the k\-th bit \(0\-indexed from right\) is set to 1:

Python

```python
def is_bit_set(n, k):
   return (n & (1 << k)) != 0
```

**How it works**:

*   `1 << k` creates a number with only the k\-th bit set
*   `n & (1 << k)` isolates that bit
*   If the result is non\-zero, the bit was set

```shell
Example: Is bit 2 set in 5 (0101)?

<< 2 = 0100
& 4  = 0101 & 0100 = 0100 (non-zero, so YES)
```

### 2\. Set a Bit

To set the k\-th bit to 1:

Python

```python
def set_bit(n, k):
   return n | (1 << k)
```

**How it works**: OR with a mask that has 1 at position k\.

```shell
Example: Set bit 1 in 5 (0101)

<< 1 = 0010
| 2  = 0101 | 0010 = 0111 = 7
```

### 3\. Clear a Bit

To clear \(unset\) the k\-th bit:

Python

```python
def clear_bit(n, k):
   return n & ~(1 << k)
```

**How it works**: AND with a mask that has 0 at position k and 1s everywhere else\.

Shell

```shell
Example: Clear bit 2 in 5 (0101)

<< 2  = 0100
~(0100) = 1011
& 11  = 0101 & 1011 = 0001 = 1
```

### 4\. Toggle a Bit

To flip a bit \(0 to 1, or 1 to 0\):

Python

```python
def toggle_bit(n, k):
   return n ^ (1 << k)
```

**How it works**: XOR with a mask that has 1 at position k\.

### 5\. Check if Power of 2

A number is a power of 2 if it has exactly one bit set\.

Python

```python
def is_power_of_two(n):
   return n > 0 and (n & (n - 1)) == 0
```

**How it works**:

*   Powers of 2 have only one bit set: 1, 10, 100, 1000\.\.\.
*   Subtracting 1 flips all bits after \(and including\) the rightmost set bit
*   AND of these gives 0 only for powers of 2

```shell
n = 8   = 1000
n - 1   = 0111
n & n-1 = 0000 (Power of 2!)

n = 6   = 0110
n - 1   = 0101
n & n-1 = 0100 (Not power of 2)
```

### 6\. Count Set Bits \(Brian Kernighan's Algorithm\)

Count the number of 1s in the binary representation:

Python

```python
def count_set_bits(n):
   count = 0
   while n:
       n = n & (n - 1)  # Clear the rightmost set bit
       count += 1
   return count
```

**Why it works**: `n & (n - 1)` clears the rightmost set bit\. We count how many times we can do this before n becomes 0\.

**Time complexity**: O\(number of set bits\), not O\(32\)

### 7\. Get the Rightmost Set Bit

Extract the rightmost bit that is set to 1:

Python

```python
def rightmost_set_bit(n):
   return n & (-n)
```

**How it works**: In two's complement, `-n = ~n + 1`\. This creates a number where only the rightmost set bit survives the AND\.

```shell
n  = 12  = 01100
-n = -12 = 10100 (two's complement)
n & -n   = 00100 = 4
```

### 8\. Turn Off the Rightmost Set Bit

Python

```python
def clear_rightmost_set_bit(n):
   return n & (n - 1)
```

This is the same trick used in counting set bits and checking power of 2\.