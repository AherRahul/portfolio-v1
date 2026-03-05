---
title: "Logging Best Practices"
description: "Logging Best Practices - System Design Module 19"
datePublished: 2026-03-05
dateModified: 2026-03-05
topics:
  - system-design
courseName: 07-system-design
showOnArticles: false
featured: false
---

# Logging Best Practices

Every developer can write logs. Add a print statement, output some text, and move on. But there is a difference between writing logs and writing useful logs, logs that actually help you debug problems at 3 AM when the system is on fire.

Poor logging is surprisingly common. Logs that say "Error occurred" without context. Logs buried in millions of lines of debug noise. Logs that leak passwords or credit card numbers. Logs formatted differently across services, making correlation impossible.

Good logging is a skill. It requires thinking about what information you will need when something goes wrong, not when you are writing the code, but six months later when you are debugging a production incident you have never seen before.

In this chapter, you will learn:

*   How to choose appropriate log levels
*   What information to include in log messages
*   Structured logging and why it matters
*   Common logging mistakes and how to avoid them
*   Performance considerations for high-throughput systems

These practices apply whether you are using Log4j, Logback, Python's logging module, or any other logging framework. The principles are universal.

# Log Levels

Log levels categorize messages by importance. Using them well is the foundation of useful logging, because levels decide what gets stored, what gets alerted on, and what gets ignored.

### The Standard Levels

Scroll

Level

When to Use

Example

Production Setting

**FATAL**

System cannot continue, immediate attention required

Database connection lost

Always logged

**ERROR**

Operation failed, needs investigation

Payment processing failed

Always logged

**WARN**

Something unexpected, but system continues

Retry succeeded after failure

Always logged

**INFO**

Normal business events worth recording

Order placed, job completed

Usually logged

**DEBUG**

Detailed information for debugging

SQL query executed, cache hit/miss

Disabled in production

**TRACE**

Very fine-grained tracing

Entering/exiting methods, loop iterations

Rarely used

### Choosing the Right Level

The most common mistake is overusing ERROR and underusing WARN.

**Bad Example:** Logging expected conditions as ERROR

Ask yourself: **“Should this wake someone up at 2 AM?”**

*   If **yes**, it is usually **ERROR** or **FATAL**.
*   If **no**, it is probably **WARN** or lower.

Note

ERROR logs should be actionable. If you cannot do anything about it, it probably should not be an ERROR.

### Level Selection Guide

# What to Log

A log message is only useful if it contains enough information to understand what happened. The goal is simple: someone should be able to read one log line and immediately know what it means, what it affects, and what to do next.

### The Essential Elements

Every log entry should answer these questions:

### Good vs Bad Log Messages

#### Bad: vague and unhelpful

#### Good: specific and actionable

### The Context Checklist

Before writing a log statement, ask: **“If I saw only this log line, would I understand what happened?”**

Context Type

Examples

When to Include

**Identifiers**

user\_id, order\_id, request\_id

Always

**Values**

amount, count, size

When relevant to the event

**State**

status, current step, retry count

For state changes

**Error details**

error code, exception type, message

All errors

**Timing**

duration, timeout value

Performance-related events

**Source**

URL, IP address, service name

External interactions

### Including the Right Amount of Context

**Too little context makes logs useless:**

**Too much context creates noise:**

**Just right:**

Include what you need to debug, nothing more.

# Structured Logging

Structured logging means writing logs in a machine-parseable format, typically JSON, rather than plain text.

### Why Structured Logging Matters

With **unstructured** logs, you end up treating logs like text files:

*   you parse with regex
*   every format variation needs new parsing rules
*   small wording changes can break dashboards and alerts

With **structured** logs, logs behave like data:

*   native JSON parsing
*   consistent fields across services
*   reliable queries and fast filtering

#### **Unstructured log:**

Parsing this requires regex. Different log formats require different regex patterns. Slight format changes break your parsers.

#### **Structured log:**

Now you can query:

*   `event=order_placed AND amount>100` - Large orders
*   `user_id=789` - All activity for this user
*   `service=order-service AND level=ERROR` - Order service errors

### Structured Logging Format

Use consistent field names across all services:

Field

Type

Description

Required

`timestamp`

ISO 8601

When the event occurred

Yes

`level`

string

Log level (INFO, ERROR, etc.)

Yes

`service`

string

Name of the service

Yes

`event`

string

What happened (snake\_case)

Yes

`message`

string

Human-readable description

Optional

`trace_id`

string

Distributed trace ID

When available

`request_id`

string

Request correlation ID

When available

`user_id`

string

User identifier

When relevant

`error_code`

string

Error classification

For errors

`duration_ms`

number

Operation duration

For timed operations

### Implementation Example

Most languages have good structured logging support. The main idea is the same: log an event name and attach key-value context.

Once your logs are structured, you can filter, group, and correlate across services without fighting formatting.

# Logging Sensitive Data

One of the biggest logging risks is accidentally exposing sensitive information. Logs get shipped to central systems, copied into tickets, and shared across teams. If a secret lands in logs, assume it will leak.

### What Not to Log

**Never log these directly:**

*   Passwords
*   API keys and secrets
*   Credit card numbers
*   Government identifiers (SSN, Aadhaar, etc.)
*   Full session tokens, refresh tokens, or JWTs
*   Personal health information

**Log carefully (often mask or avoid):**

*   Email addresses (consider masking)
*   Phone numbers (consider masking)
*   IP addresses (check policy and regulations)

### Masking Techniques

When you need to reference sensitive data for debugging, log the minimum needed for correlation.

#### Bad (exposing full values):

#### Good (masked for safety):

### Automatic Sanitization

Do not rely on developers remembering to redact every time. Add sanitization to the logging pipeline so it happens by default.

**Typical controls:**

*   **Field blocklist**: redact keys like `password`, `token`, `authorization`, `api_key`
*   **Value masks**: apply safe partial reveals for known types
*   **Regex detection**: catch secrets that show up inside free-text logs

Patterns to detect and mask:

*   Credit card numbers: `\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b`
*   API keys: `(api[_-]?key|secret)[=:]\s*\w+`
*   Passwords in URLs: `password=\w+`
*   Bearer tokens: `Bearer\s+\w+`

# Performance Considerations

Logging is not free. In high-throughput systems, even “small” logging overhead can become a real performance and cost problem.

### The Cost of Logging

A typical log line can trigger multiple steps:

*   **String formatting** and concatenation
*   **JSON serialization** (for structured logs)
*   **Memory allocations** (objects, buffers)
*   **I/O** (disk or network), which can block if synchronous

The expensive part is almost always **I/O**, especially if it happens on the request thread.

### Performance Best Practices

#### **1\. Use** l**azy evaluation**

Do not compute expensive values if the log will not be written.

**Bad (always computes expensive data):**

**Good (only computes if debug is enabled):**

**Better (let the framework defer evaluation when supported):**

#### **2\. Use async logging**

Synchronous logging can block request processing while waiting for disk or network.

**Synchronous logging**

*   Request → process → write log (wait) → response

**Asynchronous logging**

*   Request → process → enqueue log → response
*   Background thread writes logs to disk or ships them over the network

Async logging queues log messages and writes them in a background thread. This prevents I/O from blocking request processing.

#### **3\.** Pick the right production log level

Environment

Recommended Level

Reason

Development

DEBUG or TRACE

Full visibility for debugging

Staging

DEBUG

Test with production-like logging

Production

INFO

Balance visibility and performance

Production (incident)

DEBUG

Temporarily enable for debugging

A common practice is “INFO by default, DEBUG on demand,” with a time limit and scope (specific service, endpoint, or user) so you do not drown in noise.

#### **4\.** Sample high-volume events

For events that happen constantly (cache hits, heartbeats), log only a sample.

**Probabilistic sampling (1%):**

**Deterministic sampling (every 1000th event):**

If you want accurate counts, do not rely on logs for that. Use **metrics** (counters, histograms) and keep logs for context.

### Rough performance impact (ballpark)

These numbers vary by language, hardware, and logging pipeline, but they help build intuition:

Scenario

Impact

Sync logging to disk

1-10ms per log (blocking)

Async logging to disk

<0.1ms per log (non-blocking)

Logging over network

5-50ms per log if sync

JSON serialization

0.01-0.1ms per log

String formatting

0.001-0.01ms per log

At **10,000 requests/sec**, even **0.1ms** of extra overhead per request adds up fast. That is roughly **1 second of CPU time per second**, just for logging work.

The goal is not “log less.” It is “log smarter”: correct levels, structured context, async I/O, and sampling where needed.

# Common Logging Mistakes

Avoid these patterns that make logs less useful:

### 1\. Logging Without Context

### 2\. Inconsistent Formats

### 3\. Excessive Logging

### 4\. Swallowing Exceptions

### 5\. Log Message in Code, Context in Exception

# Log Rotation and Retention

Logs consume disk space. If you do not manage them, they will eventually fill the disk and take your service down in the most avoidable way.

### Rotation Strategies

Rotation means closing the current log file and starting a new one on a schedule.

The most common strategies are:

Strategy

Configuration

Use Case

**Size-based**

Rotate when file reaches 100MB

Consistent file sizes

**Time-based**

Rotate daily at midnight

Predictable log files

**Combined**

Rotate daily OR at 100MB

Best of both

After rotation, it is common to:

*   **compress** older files (gzip)
*   **delete** logs after a retention window

### Retention Guidelines

Retention depends on what the logs are used for and whether compliance applies.

Log Type

Retention

Reason

Application logs

7-30 days

Debugging recent issues

Access logs

30-90 days

Traffic analysis, security

Audit logs

1-7 years

Compliance requirements

Security logs

1-7 years

Incident investigation

Debug logs

1-7 days

Short-term debugging

**Tip:** keep long-term logs in cheaper storage (object storage) and keep hot logs in the logging system for fast search.

# Summary

**Effective logging requires intentional design:**

*   **Log levels** categorize messages by importance. ERROR should wake someone up; DEBUG should not.
*   **Context** makes logs useful. Include identifiers, relevant values, and enough information to understand what happened.
*   **Structured logging** (JSON) enables efficient searching and analysis. Use consistent field names across services.
*   **Sensitive data** must be protected. Never log passwords, keys, or PII directly. Implement automatic sanitization.
*   **Performance** matters at scale. Use async logging, lazy evaluation, and appropriate log levels in production.
*   **Rotation and retention** prevent logs from becoming a reliability problem.

**Key practices:**

*   Ask "Would this help me debug at 3 AM?" before adding a log
*   Include request IDs and user IDs for correlation
*   Use structured formats with consistent field names
*   Implement log rotation and retention policies
*   Sample high-frequency events rather than logging everything

Launching soon
