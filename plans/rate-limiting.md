# Plan: Rate Limiting & Abuse Controls

## Context

- **Project root:** `/home/dario/Documents/dev workspace/opensourceframework/`
- **Stack:** pnpm/Turbo monorepo, Hono, Drizzle ORM, Postgres, TypeScript
- **No Redis** — Postgres-only, DB-backed rate limiting
- **Use cases:** prevent free tier abuse, stop runaway agents, protect OpenRouter key usage

---

## Goal

Add rate limiting at multiple layers: unauthenticated IP, authenticated user, and per-installation. Use Postgres as the backing store since Redis is not available.

---

## 1. Rate Limit DB Schema

```sql
CREATE TABLE rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL,       -- e.g. 'ip:192.168.1.1' or 'user:uuid' or 'install:uuid'
  window_start timestamptz NOT NULL,
  request_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(key, window_start)
);

-- Index for fast lookups
CREATE INDEX idx_rate_limits_key_window ON rate_limits(key, window_start);
```

**Sliding window approach:** Use `INSERT ... ON CONFLICT (key, window_start) DO UPDATE SET request_count = request_count + 1` for atomic increments.

Cleanup old rows with a periodic delete (keep 7 days of history max).

---

## 2. Rate Limit Key Strategies

| Layer | Key format | Source |
|-------|-----------|--------|
| Per-IP | `ip:{ip}` | `X-Forwarded-For` or `c.ip` |
| Per-User | `user:{userId}` | JWT/session claim |
| Per-Installation | `install:{installId}` | Path param |
| Per-OpenRouter key | `orkey:{secretId}` | DB lookup |

---

## 3. Limits by Endpoint Tier

| Tier | Endpoints | Limit | Window |
|------|-----------|-------|--------|
| **Auth** | `POST /auth/*` | 20 req | 1 min |
| **Read** | `GET /installs/:id` (status poll) | 60 req | 1 min |
| **Lifecycle** | `POST /installs/:id/{wake/pause/stop/restart}` | 10 req | 1 min |
| **Write** | `POST /installs` (provision) | 5 req | 1 hour |
| **Deprovision** | `POST /installs/:id/deprovision` | 3 req | 1 hour |
| **OpenRouter proxy** | `POST /proxy/openrouter/*` | 30 req | 1 min per install |
| **Webhooks** | `POST /webhooks/*` | 100 req | 1 min |

---

## 4. Rate Limit Service

```ts
// src/lib/rate-limit/service.ts

export type RateLimitKey = { type: 'ip'; value: string }
  | { type: 'user'; value: string }
  | { type: 'install'; value: string };

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: Date;       // window_start + window duration
  retryAfter?: number; // seconds, only if allowed=false
}

export class RateLimitService {
  constructor(private windowSeconds: number, private maxRequests: number) {}

  /** Check and atomically increment counter. Returns result. */
  async check(key: RateLimitKey): Promise<RateLimitResult>;

  /** Reset a key's counter (for testing or manual unblock) */
  async reset(key: RateLimitKey): Promise<void>;
}
```

---

## 5. Hono Middleware — `src/server/middleware/rate-limit.ts`

```ts
export function rateLimitMiddleware(
  getKey: (c: Context) => RateLimitKey,
  windowSeconds: number,
  maxRequests: number
) {
  const service = new RateLimitService(windowSeconds, maxRequests);

  return async (c: Context, next: Next) => {
    const key = getKey(c);
    const result = await service.check(key);

    // Always set rate limit headers
    c.res.headers.set('X-RateLimit-Limit', String(result.limit));
    c.res.headers.set('X-RateLimit-Remaining', String(result.remaining));
    c.res.headers.set('X-RateLimit-Reset', String(result.resetAt.getTime()));

    if (!result.allowed) {
      c.res.headers.set('Retry-After', String(result.retryAfter!));
      return c.json({
        error: 'rate_limit_exceeded',
        retryAfter: result.retryAfter,
        limit: result.limit,
        window: `${windowSeconds}s`,
      }, 429);
    }

    await next();
  };
}
```

---

## 6. Usage in Routes

```ts
// In route file — IP-level rate limit on auth routes
app.use('/auth/*', rateLimitMiddleware(
  (c) => ({ type: 'ip', value: c.req.header('x-forwarded-for') ?? 'unknown' }),
  60,   // 1 minute window
  20    // 20 requests
));

// Lifecycle routes — per-installation limit
app.post('/installs/:id/stop', rateLimitMiddleware(
  (c) => ({ type: 'install', value: c.req.param('id') }),
  60, 10
), async (c) => { ... });
```

---

## 7. OpenRouter Budget Limits (Separate Track)

OpenRouter costs are tracked separately from request rate limits:

```sql
CREATE TABLE openrouter_budget_limits (
  installation_id uuid PRIMARY KEY REFERENCES installations(id),
  daily_limit_cents integer NOT NULL DEFAULT 500,  -- $5/day default
  monthly_limit_cents integer NOT NULL DEFAULT 5000,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

On every OpenRouter proxy request:
1. Look up today's accumulated cost for this install from `usage` table
2. If `today_cost >= daily_limit_cents` → reject with 429 + `daily_limit_exceeded`
3. After request, record cost in usage table

---

## 8. Cleanup Job

Periodically delete old rate limit rows (older than 7 days):

```sql
DELETE FROM rate_limits WHERE window_start < now() - interval '7 days';
```

Can be a cron job or run opportunistically on a percentage of requests.

---

## 9. Directory Structure

```
src/
  lib/
    rate-limit/
      service.ts         # RateLimitService
      middleware.ts     # Hono middleware factory
  server/
    middleware/
      rate-limit.ts     # re-export + preset configs
tests/
  rate-limit/
    service.test.ts     # atomic increment, window expiry, cleanup
    middleware.test.ts  # 429 response shape, headers
drizzle/
  0005_rate_limits.sql
```

---

## 10. 429 Response Shape

```json
{
  "error": "rate_limit_exceeded",
  "retryAfter": 42,
  "limit": 60,
  "window": "minute"
}
```

Headers on all responses:
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1754068800
Retry-After: 42  (only on 429)
```

---

## 11. Implementation Order

1. Add migration `0005_rate_limits.sql`
2. Create `src/lib/rate-limit/service.ts` — atomic DB increment
3. Create `src/lib/rate-limit/middleware.ts` — Hono middleware factory
4. Wire IP-level rate limit onto auth routes
5. Add per-installation limits to lifecycle routes
6. Add OpenRouter budget tracking table + check on proxy routes
7. Write tests for service (atomic increment, concurrent requests, window expiry)
8. Write tests for middleware (429 shape, headers)
9. Add cleanup query (7-day retention)
