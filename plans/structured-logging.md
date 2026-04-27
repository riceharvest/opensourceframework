# Plan: Structured Logging & Observability

## Context

- **Project root:** `/home/dario/Documents/dev workspace/opensourceframework/`
- **Stack:** pnpm/Turbo monorepo, Hono, Drizzle ORM, Postgres, TypeScript
- **Current state:** `console.log` / `console.error` scattered throughout routes and services
- **Goal:** JSON structured logs, request IDs, component tags, log levels

---

## 1. Logger Library — pino

**Why pino:** ~4× faster than winston, JSON by default, Hono middleware available, low overhead, swap transports without changing app code.

```sh
pnpm add pino
```

**Base logger — `src/lib/logger.ts`:**

```ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  formatters: {
    level: (label) => ({ level: label }),
  },
  timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
});
```

---

## 2. Request ID & Correlation

Every HTTP request gets/generates a `X-Request-ID`. It propagates through all service calls.

**Middleware — `src/server/middleware/request-id.ts`:**

```ts
import { randomUUID } from 'crypto';

export function requestIdMiddleware(app: Hono) {
  app.use('*', async (c, next) => {
    const reqId = c.req.header('X-Request-ID') ?? randomUUID();
    c.set('reqId', reqId);
    c.res.headers.set('X-Request-ID', reqId);
    await next();
  });
}
```

Child logger per request injects `reqId` as a static field — every downstream log line is automatically tagged.

---

## 3. Component Tags

| Component | Files |
|-----------|-------|
| `http` | `src/server/routes/` |
| `service` | `src/lib/control-plane/` |
| `provider` | `src/lib/providers/` |
| `worker` | Background job workers |
| `db` | DB query wrappers |

```ts
const log = logger.child({ component: 'http' });
log.info({ reqId, method: 'POST', path: '/v1/keys' }, 'request');
```

---

## 4. What to Log

| Event | Level | Fields |
|-------|-------|--------|
| HTTP request received | `info` | `method`, `path`, `reqId`, `component=http` |
| HTTP response sent | `info` | `status`, `duration_ms`, `reqId` |
| Slow DB query (≥100ms) | `warn` | `query`, `duration_ms`, `reqId` |
| Business event (e.g. install provisioned) | `info` | `action`, `entity_id`, `reqId` |
| Validation / 4xx | `warn` | `err.message`, `status`, `reqId` |
| Unexpected error | `error` | `err.stack`, `reqId` |
| Worker startup/shutdown | `info` | `msg` |

**Never log:** request/response bodies, PII fields, large payloads (truncate to 256 chars).

---

## 5. Log Levels

| Level | When |
|-------|------|
| `fatal` | Unrecoverable, process exits |
| `error` | Expected failures — DB down, upstream timeout |
| `warn` | Degraded behaviour — slow query, 4xx, retries |
| `info` | Every request, business milestones |
| `debug` | Query params, feature flags (dev only) |

Default: `info` production, `debug` in `NODE_ENV=development`.

---

## 6. Sampling High-Volume Paths

For health checks / polling endpoints that would spam logs:

```ts
const sample = Math.random() < 0.05; // 5%
if (sample || status >= 500) {
  logger.info({ ...fields, sampled: sample }, 'request');
}
```

Or skip logging entirely for specific paths in the middleware.

---

## 7. Hono Route Logging Middleware

```ts
// src/server/middleware/logger.ts
export function httpLogger(app: Hono) {
  app.use('*', async (c, next) => {
    const reqId = c.get('reqId');
    const start = Date.now();
    await next();
    const duration = Date.now() - start;
    const log = logger.child({ component: 'http', reqId });
    log.info({
      method: c.req.method,
      path: c.req.path,
      status: c.res.status,
      duration_ms: duration,
    }, 'response');
  });
}
```

---

## 8. Service Layer Migration

Replace all `console.log/error` in `src/lib/control-plane/` and `src/lib/providers/`:

```ts
// BEFORE
console.log('install created', installId);

// AFTER
const log = logger.child({ component: 'service', reqId });
log.info({ action: 'install.created', installId }, 'install created');
```

Audit and replace with:
```sh
grep -rn "console\.\(log\|error\|warn\)" src/lib/control-plane/ src/lib/providers/
```

---

## 9. DB Slow Query Instrumentation

Wrap the Drizzle client or add a query logger middleware that logs queries ≥ 100ms:

```ts
// Log slow queries at warn level
const slowThreshold = 100; // ms
// Wrap execute/query methods to log slow ones
```

---

## 10. Example Output Lines

```json
{"level":"info","time":"2026-04-26T10:33:00.000Z","reqId":"a1b2c3d4","component":"http","method":"POST","path":"/v1/installs","status":201,"duration_ms":47}
{"level":"warn","time":"2026-04-26T10:33:01.000Z","reqId":"a1b2c3d4","component":"db","query":"SELECT...","duration_ms":143}
{"level":"error","time":"2026-04-26T10:33:02.000Z","reqId":"a1b2c3d4","component":"service","action":"provision.create","err":{"type":"HetznerError","message":"server limit exceeded"}}
```

---

## 11. Migration Steps (order)

1. `pnpm add pino`
2. Create `src/lib/logger.ts`
3. Create `src/server/middleware/request-id.ts`
4. Create `src/server/middleware/logger.ts`
5. Wire both middleware into main app
6. Audit `console.*` calls: `grep -rn "console\." src/`
7. Replace each with component-tagged child logger
8. Add `LOG_LEVEL` env var support
9. Write test: assert log output shape (JSON, reqId present) in Vitest
10. Add `pino-pretty` for dev (`NODE_ENV=development`) — local dev only

---

## 12. Future: Log Transport

For now logs go to stdout and are collected by the deployment environment.

When ready to add a transport (e.g., Logflare, Grafana Loki, Elasticsearch):
```sh
pnpm add pino-pretty   # dev only
# or pino-loki, pino-elasticsearch for production
```
Just reconfigure the `pino()` instance — no app code changes needed.
