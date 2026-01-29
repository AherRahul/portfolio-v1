---
title: "Monitoring & Observability"
description: "Basics of app monitoring: logs, metrics, traces, health checks, alerts; integrating popular tools and exposing Prometheus metrics."
slidesUrl: "https://github.com/AherRahul/portfolio-v1/blob/main/content/articles"
dateModified: "2026-09-15"
datePublished: "2026-09-15"
showOnArticles: false
courseName: 01-beginner-to-advance-nodejs
topics:
  - nodejs
resources:
  - title: "Prometheus Client"
    type: "tool"
    url: "https://github.com/siimon/prom-client"
    description: "Prometheus metrics for NodeJs"
  - title: "OpenTelemetry"
    type: "documentation"
    url: "https://opentelemetry.io/docs/instrumentation/js/"
    description: "Traces/metrics/logs for JS/Node"
---

![Monitoring & Observability](https://res.cloudinary.com/duojkrgue/image/upload/v1757930700/Portfolio/nodeJsCourse/33_ihknbh.png)

<!-- # 📖 My Personal Notes – Monitoring & Observability -->

When things break in production, good observability turns a mystery into a checklist. Here’s how I make NodeJs apps observable with logs, metrics, traces, and health checks—plus exactly what I alert on and why.

## First: Health vs. Readiness (what each endpoint really means)

Liveness tells the platform “my process is running.” Readiness tells the load balancer “it’s safe to send me traffic.” They solve different problems: liveness restarts crashed apps; readiness protects warmups, migrations, and dependency outages.

```js
// Liveness: is the process alive?
app.get('/live', (_req, res) => res.json({ status: 'alive', ts: Date.now() }))

// Readiness: are dependencies OK?
app.get('/ready', async (_req, res) => {
  try {
    await db.raw('SELECT 1')
    await redis.ping()
    return res.json({ status: 'ready' })
  } catch (e) {
    return res.status(503).json({ status: 'not_ready', reason: String(e) })
  }
})
```

Explanation: Returning 503 on readiness prevents traffic while dependencies are down; Kubernetes/Load balancers stop routing to this instance without killing it.

## Metrics with Prometheus (what I expose and why)

I start with default process metrics, then add HTTP latency and a couple business metrics. Histograms let me alert on p95/p99, not just averages.

```js
import client from 'prom-client'

client.collectDefaultMetrics()

export const httpDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP latency in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5]
})

export const httpRequests = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code']
})

export function metricsMiddleware(req, res, next) {
  const start = process.hrtime.bigint()
  res.on('finish', () => {
    const delta = Number(process.hrtime.bigint() - start) / 1e9
    const route = req.route?.path || req.path
    httpDuration.labels(req.method, route, String(res.statusCode)).observe(delta)
    httpRequests.labels(req.method, route, String(res.statusCode)).inc()
  })
  next()
}

app.get('/metrics', async (_req, res) => {
  res.set('Content-Type', client.register.contentType)
  res.end(await client.register.metrics())
})
```

Why: With this in Grafana I can see throughput, slow routes, and spikes in error rates per endpoint.

## Structured logging that’s actually useful in incidents

Human-friendly console logs are nice locally, but production needs structured logs (JSON) with correlation IDs so I can follow one request across services.

```js
import { randomUUID } from 'crypto'
import pino from 'pino'
const logger = pino({ level: process.env.LOG_LEVEL || 'info' })

export function loggingMiddleware(req, res, next) {
  req.id = randomUUID()
  const started = Date.now()

  logger.info({ id: req.id, method: req.method, url: req.url }, 'req:start')
  res.on('finish', () => {
    logger.info({ id: req.id, status: res.statusCode, ms: Date.now() - started }, 'req:end')
  })
  next()
}
```

Explanation: In an outage I filter logs by `id` to see the full request story (auth → DB → external API) without guessing.

## What I alert on (and what I don’t)

I avoid noisy alerts. Instead of “CPU > 70%,” I alert on symptoms users feel: high error rate and high latency. Infra metrics are dashboards; symptom metrics wake me up.

- Error rate (5xx) > 5% over 5 minutes
- p95 latency by route > SLO (e.g., 800ms) over 5 minutes
- Queue depth growing for 10 minutes
- Readiness failing across N instances (redundancy risk)

## Tracing (the moment you have multiple services)

For multi-service systems I add OpenTelemetry. Even basic spans around DB and external calls help spot where time goes.

```js
import { trace } from '@opentelemetry/api'
const tracer = trace.getTracer('node-app')

export async function withSpan(name, fn) {
  return tracer.startActiveSpan(name, async span => {
    try { return await fn(span) } catch (e) { span.recordException(e); throw e } finally { span.end() }
  })
}
```

Why: When a request is slow, traces show exactly which hop (DB, cache, third-party) is the culprit.

## Bringing it together (minimal setup I ship)

1) Health/readiness endpoints
2) JSON structured logs with request IDs
3) Prometheus metrics with HTTP histograms
4) Optional: tracing for multi-service apps

This combo shortens MTTR and gives me confidence during deploys and incidents.


