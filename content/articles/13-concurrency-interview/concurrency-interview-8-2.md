---
title: "Livelock"
description: "Livelock - Concurrency Interview Module 8"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - concurrency
courseName: 13-concurrency-interview
showOnArticles: false
featured: false
---

# Livelock

A livelock happens when threads are not blocked, but the system still makes no progress. Instead of waiting, the threads keep reacting to each other in a way that prevents either from completing work. CPU usage can be high, logs can be noisy, and yet nothing useful finishes.

Real-World Analogy

Two people meet in a narrow hallway. Both step aside to let the other pass. They step in the same direction. They step aside again, same direction. And again.

Both are actively trying to be polite, both are moving, but neither makes any progress down the hallway.

In many ways, livelock is more insidious than deadlock. With deadlock, you notice immediately because everything stops. With livelock, the system looks busy. Threads are executing, network requests are flying, logs are filling up with retry messages. It might take hours before someone realizes that despite all this activity, no actual work is completing.

# What is Livelock?

Livelock occurs when threads are not blocked but continuously change state in response to each other without making progress. Unlike deadlock where threads are stuck waiting, in livelock threads are actively running but trapped in an unproductive loop.

The key distinction:

Aspect

Deadlock

Livelock

Thread state

BLOCKED (waiting)

RUNNING (executing)

CPU usage

Near zero

High (often 100%)

Activity

None

Lots of retries, state changes

Detection

Thread dumps show blocked threads

Thread dumps show running threads

Root cause

Circular wait for locks

Overly reactive retry logic

# Why Livelock Happens

Livelock typically emerges from code designed to be helpful. Retry logic, conflict resolution, and polite backoff can all cause livelock when they interact badly.

### 1\. Overly Polite Algorithms

Both participants back off under the same conditions, using the same strategy.

```plaintext
1Thread A: "Lock 1 acquired, can't get Lock 2, I'll release Lock 1 and retry"
2Thread B: "Lock 2 acquired, can't get Lock 1, I'll release Lock 2 and retry"
3[Both release at the same time]
4[Both retry at the same time]
5[Same situation repeats infinitely]
```

The problem: both threads are too accommodating. Neither asserts priority or breaks the symmetry.

### 2\. Retry Without Randomization

When multiple components retry at fixed intervals, they stay synchronized.

```shell
1t=0:    Service A calls API
2t=0:    Service B calls API
3t=0:    Service C calls API
4        [API overloaded, all fail]
5
6t=1000: Service A retries
7t=1000: Service B retries
8t=1000: Service C retries
9        [API still overloaded, all fail again]
```

Without randomization, the retry storm repeats forever at the same interval.

### 3\. Collision Resolution Without Jitter

Network protocols like Ethernet's CSMA/CD and distributed systems often use backoff after collisions. Without randomness, collisions keep happening.

```shell
1Device A: Transmit → Collision → Wait 1ms → Transmit → Collision
2Device B: Transmit → Collision → Wait 1ms → Transmit → Collision
3[Infinitely synchronized collisions]
```

### 4\. Thundering Herd

When many threads wait for a resource and all wake up simultaneously when it becomes available, they all compete, most fail, and all go back to waiting. The cycle repeats.

```shell
1[100 threads waiting for connection]
2[1 connection freed]
3[100 threads wake up, 99 fail to get it]
4[99 threads go back to waiting]
5[Next connection freed, same thing happens]
```

# How to Detect Livelock

Livelock is harder to detect than deadlock because the system looks active. Here are the symptoms:

### Symptoms

**High CPU with no throughput:** CPU pegged at 100%, but requests per second is zero or near zero. Work is being done, but it's all overhead.

**Retry logs exploding:** Log files fill with retry messages. You see patterns like "Retry attempt 1... Retry attempt 2... Retry attempt 3..." repeating infinitely.

**Metrics show activity but no completion:** Queue depth grows, in-flight requests increase, but completed requests flatline.

**Patterns in timing:** If you plot retry attempts, you might see synchronization: many retries at exactly the same timestamps.

### Detection Approach

1.  **Compare CPU usage vs. throughput:** High CPU with low throughput is suspicious.
2.  **Check retry counts:** If retries are unbounded and growing, investigate.
3.  **Analyze thread dumps:** Unlike deadlock (BLOCKED threads), livelock shows RUNNABLE threads all executing similar retry logic.
4.  **Profile hotspots:** Profilers will show all time spent in retry/backoff code, not in actual business logic.

Java

```java
1// Detecting livelock: monitor retry counts
2public class LivelockDetector {
3    private final AtomicLong retryCount = new AtomicLong(0);
4    private final AtomicLong successCount = new AtomicLong(0);
5
6    public void recordRetry() {
7        long retries = retryCount.incrementAndGet();
8        long successes = successCount.get();
9
10        // If retries >> successes, possible livelock
11        if (retries > 1000 && successes == 0) {
12            System.err.println("WARNING: Possible livelock detected. " +
13                "Retries: " + retries + ", Successes: " + successes);
14        }
15    }
16
17    public void recordSuccess() {
18        successCount.incrementAndGet();
19        retryCount.set(0);  // Reset on success
20    }
21}
```

# Backoff Strategies

The key to preventing livelock is breaking synchronization between competing threads. Backoff strategies determine how long to wait before retrying.

### Linear Backoff

```shell
1Attempt 1: Wait 100ms
2Attempt 2: Wait 200ms
3Attempt 3: Wait 300ms
4Attempt 4: Wait 400ms
5...
```

**Problem:** If two threads start at the same time, they stay synchronized. Thread A waits 100ms, Thread B waits 100ms. Both retry at the same time. Both wait 200ms. Same problem.

### Exponential Backoff

```shell
1Attempt 1: Wait 100ms
2Attempt 2: Wait 200ms
3Attempt 3: Wait 400ms
4Attempt 4: Wait 800ms
5...
```

**Problem:** Slightly better because waits grow faster, but still synchronized if threads start together. Also, waits can grow very large very quickly.

### Exponential Backoff with Jitter (Recommended)

```shell
1Attempt 1: Wait random(0, 100ms)
2Attempt 2: Wait random(0, 200ms)
3Attempt 3: Wait random(0, 400ms)
4Attempt 4: Wait random(0, 800ms)
5...
```

**Why it works:** The randomness breaks synchronization. Even if two threads start at exactly the same time and fail at exactly the same time, their random waits will differ. One will retry first and likely succeed before the other interferes.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

#mermaid-2yb1x1v7lpm-1772709685594{font-family:inherit;font-size:16px;fill:#fafafa;}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#mermaid-2yb1x1v7lpm-1772709685594 .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#mermaid-2yb1x1v7lpm-1772709685594 .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#mermaid-2yb1x1v7lpm-1772709685594 .error-icon{fill:#000000;}#mermaid-2yb1x1v7lpm-1772709685594 .error-text{fill:#fafafa;stroke:#fafafa;}#mermaid-2yb1x1v7lpm-1772709685594 .edge-thickness-normal{stroke-width:1px;}#mermaid-2yb1x1v7lpm-1772709685594 .edge-thickness-thick{stroke-width:3.5px;}#mermaid-2yb1x1v7lpm-1772709685594 .edge-pattern-solid{stroke-dasharray:0;}#mermaid-2yb1x1v7lpm-1772709685594 .edge-thickness-invisible{stroke-width:0;fill:none;}#mermaid-2yb1x1v7lpm-1772709685594 .edge-pattern-dashed{stroke-dasharray:3;}#mermaid-2yb1x1v7lpm-1772709685594 .edge-pattern-dotted{stroke-dasharray:2;}#mermaid-2yb1x1v7lpm-1772709685594 .marker{fill:#22c55e;stroke:#22c55e;}#mermaid-2yb1x1v7lpm-1772709685594 .marker.cross{stroke:#22c55e;}#mermaid-2yb1x1v7lpm-1772709685594 svg{font-family:inherit;font-size:16px;}#mermaid-2yb1x1v7lpm-1772709685594 p{margin:0;}#mermaid-2yb1x1v7lpm-1772709685594 .label{font-family:inherit;color:#f0fdf4;}#mermaid-2yb1x1v7lpm-1772709685594 .cluster-label text{fill:#fafafa;}#mermaid-2yb1x1v7lpm-1772709685594 .cluster-label span{color:#fafafa;}#mermaid-2yb1x1v7lpm-1772709685594 .cluster-label span p{background-color:transparent;}#mermaid-2yb1x1v7lpm-1772709685594 .label text,#mermaid-2yb1x1v7lpm-1772709685594 span{fill:#f0fdf4;color:#f0fdf4;}#mermaid-2yb1x1v7lpm-1772709685594 .node rect,#mermaid-2yb1x1v7lpm-1772709685594 .node circle,#mermaid-2yb1x1v7lpm-1772709685594 .node ellipse,#mermaid-2yb1x1v7lpm-1772709685594 .node polygon,#mermaid-2yb1x1v7lpm-1772709685594 .node path{fill:#166534;stroke:#22c55e;stroke-width:1px;}#mermaid-2yb1x1v7lpm-1772709685594 .rough-node .label text,#mermaid-2yb1x1v7lpm-1772709685594 .node .label text,#mermaid-2yb1x1v7lpm-1772709685594 .image-shape .label,#mermaid-2yb1x1v7lpm-1772709685594 .icon-shape .label{text-anchor:middle;}#mermaid-2yb1x1v7lpm-1772709685594 .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#mermaid-2yb1x1v7lpm-1772709685594 .rough-node .label,#mermaid-2yb1x1v7lpm-1772709685594 .node .label,#mermaid-2yb1x1v7lpm-1772709685594 .image-shape .label,#mermaid-2yb1x1v7lpm-1772709685594 .icon-shape .label{text-align:center;}#mermaid-2yb1x1v7lpm-1772709685594 .node.clickable{cursor:pointer;}#mermaid-2yb1x1v7lpm-1772709685594 .root .anchor path{fill:#22c55e!important;stroke-width:0;stroke:#22c55e;}#mermaid-2yb1x1v7lpm-1772709685594 .arrowheadPath{fill:#0b0b0b;}#mermaid-2yb1x1v7lpm-1772709685594 .edgePath .path{stroke:#22c55e;stroke-width:2.0px;}#mermaid-2yb1x1v7lpm-1772709685594 .flowchart-link{stroke:#22c55e;fill:none;}#mermaid-2yb1x1v7lpm-1772709685594 .edgeLabel{background-color:#0a0a0a;text-align:center;}#mermaid-2yb1x1v7lpm-1772709685594 .edgeLabel p{background-color:#0a0a0a;}#mermaid-2yb1x1v7lpm-1772709685594 .edgeLabel rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-2yb1x1v7lpm-1772709685594 .labelBkg{background-color:rgba(10, 10, 10, 0.5);}#mermaid-2yb1x1v7lpm-1772709685594 .cluster rect{fill:#1a1a1a;stroke:#000000;stroke-width:1px;}#mermaid-2yb1x1v7lpm-1772709685594 .cluster text{fill:#fafafa;}#mermaid-2yb1x1v7lpm-1772709685594 .cluster span{color:#fafafa;}#mermaid-2yb1x1v7lpm-1772709685594 div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:inherit;font-size:12px;background:#000000;border:1px solid #262626;border-radius:2px;pointer-events:none;z-index:100;}#mermaid-2yb1x1v7lpm-1772709685594 .flowchartTitleText{text-anchor:middle;font-size:18px;fill:#fafafa;}#mermaid-2yb1x1v7lpm-1772709685594 rect.text{fill:none;stroke-width:0;}#mermaid-2yb1x1v7lpm-1772709685594 .icon-shape,#mermaid-2yb1x1v7lpm-1772709685594 .image-shape{background-color:#0a0a0a;text-align:center;}#mermaid-2yb1x1v7lpm-1772709685594 .icon-shape p,#mermaid-2yb1x1v7lpm-1772709685594 .image-shape p{background-color:#0a0a0a;padding:2px;}#mermaid-2yb1x1v7lpm-1772709685594 .icon-shape rect,#mermaid-2yb1x1v7lpm-1772709685594 .image-shape rect{opacity:0.5;background-color:#0a0a0a;fill:#0a0a0a;}#mermaid-2yb1x1v7lpm-1772709685594 .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#mermaid-2yb1x1v7lpm-1772709685594 .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#mermaid-2yb1x1v7lpm-1772709685594 :root{--mermaid-font-family:inherit;}#mermaid-2yb1x1v7lpm-1772709685594 .orange>\*{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-2yb1x1v7lpm-1772709685594 .orange span{fill:#ffa94d!important;stroke:#000!important;color:#000!important;}#mermaid-2yb1x1v7lpm-1772709685594 .orange tspan{fill:#000!important;}#mermaid-2yb1x1v7lpm-1772709685594 .green>\*{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-2yb1x1v7lpm-1772709685594 .green span{fill:#69db7c!important;stroke:#000!important;color:#000!important;}#mermaid-2yb1x1v7lpm-1772709685594 .green tspan{fill:#000!important;}#mermaid-2yb1x1v7lpm-1772709685594 .red>\*{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-2yb1x1v7lpm-1772709685594 .red span{fill:#ff8787!important;stroke:#000!important;color:#000!important;}#mermaid-2yb1x1v7lpm-1772709685594 .red tspan{fill:#000!important;}

Exponential + Jitter

random(0-100ms)

random(0-200ms)

random(0-400ms)

Exponential Backoff

100ms

200ms

400ms

Linear Backoff

100ms

200ms

300ms

Stays synchronized

Still synchronized

Breaks synchronization

### Jitter Variations

There are several ways to add jitter:

**Full Jitter:** `wait = random(0, base * 2^attempt)`

Most aggressive randomization. Wait time is completely random within the range.

**Equal Jitter:** `wait = base * 2^attempt / 2 + random(0, base * 2^attempt / 2)`

Half deterministic, half random. Provides a minimum wait while still randomizing.

**Decorrelated Jitter:** `wait = min(cap, random(base, previous_wait * 3))`

Each wait depends on the previous wait, creating more variation over time.

Java

```java
1import java.util.Random;
2
3public class BackoffStrategies {
4    private static final Random random = new Random();
5    private static final long BASE_MS = 100;
6    private static final long CAP_MS = 10000;
7
8    // Full jitter: random(0, base * 2^attempt)
9    public static long fullJitter(int attempt) {
10        long maxWait = Math.min(CAP_MS, BASE_MS * (1L << attempt));
11        return random.nextLong(maxWait);
12    }
13
14    // Equal jitter: half + random half
15    public static long equalJitter(int attempt) {
16        long maxWait = Math.min(CAP_MS, BASE_MS * (1L << attempt));
17        long halfWait = maxWait / 2;
18        return halfWait + random.nextLong(halfWait);
19    }
20
21    // Decorrelated jitter
22    private static long previousWait = BASE_MS;
23
24    public static long decorrelatedJitter() {
25        long wait = Math.min(CAP_MS, random.nextLong(BASE_MS, previousWait * 3));
26        previousWait = wait;
27        return wait;
28    }
29}
```

# How to Prevent Livelock

### Strategy 1: Add Randomization to Backoff

The simplest fix: add random jitter to all retry delays.

Java

```java
1import java.util.Random;
2import java.util.concurrent.TimeUnit;
3
4public class RetryWithJitter {
5    private static final Random random = new Random();
6    private static final int MAX_RETRIES = 10;
7    private static final long BASE_DELAY_MS = 100;
8
9    public <T> T executeWithRetry(Callable<T> operation) throws Exception {
10        int attempt = 0;
11
12        while (attempt < MAX_RETRIES) {
13            try {
14                return operation.call();
15            } catch (RetryableException e) {
16                attempt++;
17
18                if (attempt >= MAX_RETRIES) {
19                    throw e;
20                }
21
22                // Exponential backoff with full jitter
23                long maxDelay = BASE_DELAY_MS * (1L << attempt);
24                long delay = random.nextLong(maxDelay);
25
26                System.out.println("Attempt " + attempt + " failed, " +
27                    "retrying in " + delay + "ms");
28
29                Thread.sleep(delay);
30            }
31        }
32
33        throw new RuntimeException("Max retries exceeded");
34    }
35}
```

### Strategy 2: Asymmetric Behavior

Give different threads different roles or priorities. Not everyone should back off equally.

Java

```java
1public class AsymmetricLocking {
2    private final Lock lock1 = new ReentrantLock();
3    private final Lock lock2 = new ReentrantLock();
4    private static final Random random = new Random();
5
6    public void operationWithPriority(int priority) {
7        while (true) {
8            if (lock1.tryLock()) {
9                try {
10                    if (lock2.tryLock()) {
11                        try {
12                            // Critical section
13                            doWork();
14                            return;
15                        } finally {
16                            lock2.unlock();
17                        }
18                    }
19                } finally {
20                    lock1.unlock();
21                }
22            }
23
24            // Asymmetric backoff based on priority
25            // Lower priority = longer backoff = more likely to yield
26            long baseBackoff = 10;
27            long backoff = baseBackoff * (11 - priority) + random.nextInt(10);
28
29            try {
30                Thread.sleep(backoff);
31            } catch (InterruptedException e) {
32                Thread.currentThread().interrupt();
33                return;
34            }
35        }
36    }
37}
```

Threads with higher priority back off less, making them more likely to acquire locks first. This breaks the symmetry that causes livelock.

### Strategy 3: Limit Retry Attempts

Don't retry forever. Set a maximum number of retries and fail gracefully.

Java

```java
1public void operationWithLimit() {
2    int maxRetries = 10;
3    int attempt = 0;
4
5    while (attempt < maxRetries) {
6        if (tryAcquireAllLocks()) {
7            try {
8                doWork();
9                return;
10            } finally {
11                releaseAllLocks();
12            }
13        }
14        attempt++;
15        backoffWithJitter(attempt);
16    }
17
18    throw new OperationFailedException("Could not acquire locks after " + maxRetries + " attempts");
19}
```

### Strategy 4: Circuit Breaker Pattern

If operations keep failing, stop trying for a while. Let the system recover.

.mermaid-diagram-container text, .mermaid-diagram-container .nodeLabel, .mermaid-diagram-container .edgeLabel, .mermaid-diagram-container .label, .mermaid-diagram-container tspan { font-weight: 600 !important; } .mermaid-diagram-container .flowchart-link, .mermaid-diagram-container .edge-pattern-solid, .mermaid-diagram-container .messageLine0, .mermaid-diagram-container .messageLine1, .mermaid-diagram-container path.path { stroke-width: 2px !important; } .mermaid-diagram-container marker path { stroke-width: 1px !important; } /\* Fix text cutoff in nodes \*/ .mermaid-diagram-container svg { overflow: visible !important; } .mermaid-diagram-container svg \* { overflow: visible !important; } .mermaid-diagram-container foreignObject { overflow: visible !important; } .mermaid-diagram-container foreignObject > \* { overflow: visible !important; } .mermaid-diagram-container .node, .mermaid-diagram-container .node \* { overflow: visible !important; } /\* Fix text centering in nodes \*/ .mermaid-diagram-container foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; height: 100% !important; } /\* Fix text wrapping in subgraph/cluster labels \*/ .mermaid-diagram-container .cluster-label, .mermaid-diagram-container .cluster-label foreignObject, .mermaid-diagram-container .cluster-label foreignObject > div, .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p, .mermaid-diagram-container .cluster-label text, .mermaid-diagram-container .cluster-label tspan { white-space: nowrap !important; overflow: visible !important; } /\* Ensure cluster/subgraph labels appear above nodes and centered \*/ .mermaid-diagram-container .cluster-label { z-index: 10 !important; } .mermaid-diagram-container .cluster-label foreignObject { transform: translateY(-8px) !important; overflow: visible !important; } .mermaid-diagram-container .cluster-label foreignObject > div { display: flex !important; justify-content: center !important; align-items: center !important; text-align: center !important; width: 100% !important; } .mermaid-diagram-container .cluster-label foreignObject > div > span, .mermaid-diagram-container .cluster-label foreignObject > div > p { background-color: var(--background, #000) !important; padding: 2px 6px !important; border-radius: 3px !important; font-size: 16px !important; font-weight: 600 !important; white-space: nowrap !important; } /\* Sequence diagram note fix - prevent text overflow \*/ .mermaid-diagram-container .note rect, .mermaid-diagram-container rect.note { rx: 5px !important; ry: 5px !important; } .mermaid-diagram-container .note text, .mermaid-diagram-container .noteText { font-size: 14px !important; dominant-baseline: central !important; } /\* State diagram specific styles \*/ .mermaid-state-container svg { overflow: visible !important; width: 100% !important; height: auto !important; max-width: 100% !important; } .mermaid-state-container .statediagram-state, .mermaid-state-container .stateGroup, .mermaid-state-container .state { overflow: visible !important; } .mermaid-state-container text, .mermaid-state-container .nodeLabel, .mermaid-state-container .state-text, .mermaid-state-container tspan { white-space: nowrap !important; font-size: 14px !important; overflow: visible !important; } /\* Dark mode text colors for state diagrams - only cluster labels, not state node text \*/ .dark .mermaid-state-container .statediagram-cluster .cluster-label text, .dark .mermaid-state-container .statediagram-cluster .cluster-label tspan, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject span, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject p, .dark .mermaid-state-container .statediagram-cluster .cluster-label foreignObject div { fill: #f0fdf4 !important; color: #f0fdf4 !important; } .mermaid-state-container .edgeLabel, .mermaid-state-container .edge-label { white-space: nowrap !important; font-size: 13px !important; background-color: transparent !important; overflow: visible !important; } /\* Dark mode edge label colors \*/ .dark .mermaid-state-container .edgeLabel, .dark .mermaid-state-container .edgeLabel span, .dark .mermaid-state-container .edge-label { fill: #fafafa !important; color: #fafafa !important; } .mermaid-state-container .transition, .mermaid-state-container path.transition { stroke-width: 2px !important; } /\* Fix composite state title vertical positioning \*/ .mermaid-state-container .statediagram-cluster .cluster-label text, .mermaid-state-container .statediagram-cluster .cluster-label tspan { dominant-baseline: middle !important; alignment-baseline: middle !important; }

When the circuit is **Open**, all operations fail immediately without trying. This gives the system time to recover and prevents retry storms from making things worse.

# Livelock in Practice

### The Bug: Synchronized Retry Loop

Java

```java
1// BROKEN: Two threads in livelock
2public class LivelockDemo {
3    private final Lock lock1 = new ReentrantLock();
4    private final Lock lock2 = new ReentrantLock();
5
6    public void thread1Work() {
7        while (true) {
8            lock1.lock();
9            System.out.println("Thread 1: Acquired lock1");
10
11            // Try to get lock2
12            if (lock2.tryLock()) {
13                try {
14                    System.out.println("Thread 1: Acquired lock2, doing work");
15                    doWork();
16                    return;
17                } finally {
18                    lock2.unlock();
19                    lock1.unlock();
20                }
21            }
22
23            // Can't get lock2, release lock1 and retry
24            System.out.println("Thread 1: Can't get lock2, backing off");
25            lock1.unlock();
26
27            // Fixed delay - BAD!
28            try { Thread.sleep(100); } catch (InterruptedException e) { return; }
29        }
30    }
31
32    public void thread2Work() {
33        while (true) {
34            lock2.lock();
35            System.out.println("Thread 2: Acquired lock2");
36
37            // Try to get lock1
38            if (lock1.tryLock()) {
39                try {
40                    System.out.println("Thread 2: Acquired lock1, doing work");
41                    doWork();
42                    return;
43                } finally {
44                    lock1.unlock();
45                    lock2.unlock();
46                }
47            }
48
49            // Can't get lock1, release lock2 and retry
50            System.out.println("Thread 2: Can't get lock1, backing off");
51            lock2.unlock();
52
53            // Same fixed delay - BAD!
54            try { Thread.sleep(100); } catch (InterruptedException e) { return; }
55        }
56    }
57}
```

### The Fix: Random Backoff

Java

```java
1// FIXED: Random backoff breaks synchronization
2public class LivelockFixed {
3    private final Lock lock1 = new ReentrantLock();
4    private final Lock lock2 = new ReentrantLock();
5    private static final Random random = new Random();
6
7    public void thread1Work() {
8        int attempt = 0;
9        while (true) {
10            lock1.lock();
11            try {
12                if (lock2.tryLock()) {
13                    try {
14                        doWork();
15                        return;
16                    } finally {
17                        lock2.unlock();
18                    }
19                }
20            } finally {
21                lock1.unlock();
22            }
23
24            // Random backoff with exponential growth
25            attempt++;
26            long maxDelay = 100L * (1L << Math.min(attempt, 6));
27            long delay = random.nextLong(maxDelay);
28
29            System.out.println("Thread 1: Backing off for " + delay + "ms");
30
31            try { Thread.sleep(delay); } catch (InterruptedException e) { return; }
32        }
33    }
34
35    public void thread2Work() {
36        int attempt = 0;
37        while (true) {
38            lock2.lock();
39            try {
40                if (lock1.tryLock()) {
41                    try {
42                        doWork();
43                        return;
44                    } finally {
45                        lock1.unlock();
46                    }
47                }
48            } finally {
49                lock2.unlock();
50            }
51
52            // Random backoff - different random value!
53            attempt++;
54            long maxDelay = 100L * (1L << Math.min(attempt, 6));
55            long delay = random.nextLong(maxDelay);
56
57            System.out.println("Thread 2: Backing off for " + delay + "ms");
58
59            try { Thread.sleep(delay); } catch (InterruptedException e) { return; }
60        }
61    }
62}
```

Launching soon
