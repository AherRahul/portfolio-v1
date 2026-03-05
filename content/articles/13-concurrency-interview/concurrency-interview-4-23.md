---
title: "Creating Goroutines"
description: "Creating Goroutines - Concurrency Interview Module 4"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Creating Goroutines

Go was designed with concurrency as a first-class citizen. The language philosophy is captured in the proverb: "Don't communicate by sharing memory; share memory by communicating."

Every Go program starts with one goroutine, the `main` goroutine, and can spawn millions more. Creating a goroutine is so cheap (both in time and memory) that you should think of them as lightweight tasks rather than expensive resources.

This chapter teaches you how to create and manage goroutines in practice. We'll cover the `go` keyword, different patterns for spawning goroutines, waiting for completion, returning results, and handling errors.

# The `go` Keyword

The `go` keyword is all you need to create a goroutine. Place it before a function call, and that function executes concurrently:

When you write `go functionName(args)`, several things happen:

1.  **New goroutine created:** The runtime allocates a new goroutine with roughly 2KB of stack space
2.  **Arguments evaluated:** Function arguments are evaluated in the current goroutine, then copied to the new one
3.  **Added to run queue:** The new goroutine is placed in a scheduler queue
4.  **Immediate return:** The `go` statement returns immediately, the calling goroutine continues

The critical thing to understand: the `main` goroutine doesn't wait. If `main` finishes, the program exits, killing all other goroutines without letting them complete.

This race to exit is intentional. Go doesn't have daemon goroutines or automatic waiting. You must explicitly coordinate completion using channels, WaitGroups, or other synchronization primitives.

# Four Ways to Create Goroutines

Go provides several patterns for spawning goroutines, each suited to different situations.

### Named Function

The most straightforward approach calls an existing function:

Named functions are ideal when:

*   The logic is reusable across multiple call sites
*   The function is substantial enough to deserve a name
*   You want to test the function independently

### Anonymous Function (Closure)

Anonymous functions let you define logic inline:

The trailing `()` is essential, it invokes the function. Without it, you're trying to use the function value with `go`, which doesn't make sense.

Anonymous functions are useful when:

*   The logic is specific to one location
*   You need to capture variables from the surrounding scope
*   The operation is simple (a few lines)

**Warning:** Closures capture variables by reference, not by value. This leads to one of Go's most common concurrency bugs:

By the time the goroutines run, the loop has finished and `i` equals 10. The fix is to pass `i` as an argument:

**Note:** Go 1.22 changed loop variable semantics. Starting with Go 1.22, each iteration gets a fresh variable, fixing this bug. However, for backward compatibility and clarity, passing the value explicitly remains good practice.

### Method on a Value or Pointer

Methods work the same as functions with `go`:

When spawning a goroutine with a method:

*   The receiver (`s` in this case) is captured
*   Be careful with pointer receivers if the struct might change
*   Consider whether the method should be concurrent-safe

### Function Variable

You can store a function in a variable and spawn it as a goroutine:

This pattern is useful when:

*   You're selecting between multiple handler functions
*   Functions are passed in from configuration or dependency injection
*   You're building generic worker pools

### Comparison Table

Pattern

Use When

Pros

Cons

Named function

Reusable logic, testing needed

Clear, testable, documented

Requires separate definition

Anonymous function

One-off logic, needs captured state

Inline, captures scope

Can't test independently, closure bugs

Method

Object-oriented design

Natural for types with state

Receiver captured by reference

Function variable

Dynamic dispatch, configuration

Flexible

Indirection, harder to trace

# Goroutine Identity and Properties

If you're coming from Java, you might expect goroutines to have IDs, names, and priorities. Go intentionally omits these features.

### No Goroutine ID

There's no `runtime.Goid()` function. This is by design. The Go team deliberately avoided exposing goroutine IDs because:

1.  **Discourages bad patterns:** IDs tempt developers to build goroutine-local storage, which leads to hard-to-maintain code
2.  **Encourages explicit state passing:** Instead of thread-local storage, pass context through function arguments
3.  **Simplifies the runtime:** Fewer features to maintain and optimize

If you absolutely need to identify goroutines for debugging:

This is fragile and slow. For request tracing, use `context.Context` instead.

### No Names

Goroutines don't have names. For debugging and tracing:

### No Priority

All goroutines are equal. The scheduler doesn't support priority levels. If you need prioritization:

### No Daemon Concept

Unlike Java, there's no distinction between daemon and non-daemon goroutines. When `main` returns, all goroutines die immediately. If you need background work to continue, keep `main` running:

### Using Context for Request-Scoped Data

The idiomatic replacement for thread-local storage is `context.Context`:

Context carries request-scoped values, deadlines, and cancellation signals. The next chapters cover context in depth.

# Waiting for Goroutines

Since the `go` statement returns immediately, you need explicit synchronization to wait for goroutines to complete.

### sync.WaitGroup

`WaitGroup` is the standard tool for waiting on multiple goroutines:

**Critical pattern:** Call `Add()` before starting the goroutine, not inside it. Otherwise, you have a race between `Wait()` and `Add()`:

### Channel as Done Signal

For a single goroutine, a channel can signal completion:

Using `struct{}` (empty struct) signals without sending data, costing zero bytes. Closing the channel, rather than sending a value, allows multiple receivers to unblock simultaneously.

### time.Sleep (Don't Use in Production)

You'll see `time.Sleep` in examples, but it's wrong for production code:

Problems:

*   **Too short:** Work might not finish
*   **Too long:** Wastes time
*   **Non-deterministic:** Timing varies by system load
*   **Masks bugs:** Hides synchronization problems

Use `time.Sleep` only in examples or tests where exact timing doesn't matter.

# Returning Results from Goroutines

Goroutines can't return values directly since `go` returns immediately. Instead, you communicate results through channels or shared memory.

### Channels (Idiomatic Go)

Channels are Go's preferred mechanism for goroutine communication:

For multiple results:

### Shared Memory with Synchronization

Sometimes channels add unnecessary complexity. For simple aggregation, shared memory with a mutex works well:

For simple counters, `sync/atomic` is more efficient:

### errgroup Package

The `golang.org/x/sync/errgroup` package combines WaitGroup with error handling:

Key features of errgroup:

*   **First error wins:** The first error returned cancels the context
*   **Wait returns error:** Unlike WaitGroup, you get the error back
*   **Automatic context cancellation:** Other goroutines can check `ctx.Done()`

# Error Handling in Goroutines

Errors in goroutines require explicit handling. They don't propagate to the parent goroutine automatically.

### Panics Don't Propagate

A panic in one goroutine doesn't crash others (except `main`):

If any goroutine panics without recovery, the entire program crashes. Use `recover()` to handle panics within goroutines:

### Returning Errors via Channels

For regular errors (not panics), send them through channels:

### Pattern: Error Aggregation

When running multiple goroutines, collect all errors:

# Common Patterns

These patterns appear frequently in Go code. Master them and you'll handle most concurrent scenarios.

### Fire-and-Forget

For operations where you don't need the result:

Use when:

*   Result doesn't affect program flow
*   Occasional failures are acceptable
*   You want minimum latency in the caller

### Request-Response

Goroutine does work, returns result through channel:

The returned channel acts like a "future" or "promise" from other languages.

### Worker Pool (Basic)

Fixed number of workers processing a shared queue:

### Fan-Out/Fan-In (Basic)

Distribute work to multiple goroutines (fan-out), collect results (fan-in):

These patterns are covered in more depth in the channels chapter.

Launching soon
