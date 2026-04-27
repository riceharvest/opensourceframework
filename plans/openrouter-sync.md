# Plan: OpenRouter Model/Usage/Credits Sync Jobs

## Context

- **Project root:** `/home/dario/Documents/dev workspace/opensourceframework/`
- **Stack:** pnpm/Turbo monorepo, Hono, Drizzle ORM, Postgres, TypeScript
- **Existing:** OpenRouter keys stored in DB via secrets service; provisioning worker uses job queue pattern
- **Goal:** Periodically sync credits balance, usage by model, and supported models list

---

## 1. What to Sync

| Data | Source endpoint | Frequency | Why |
|------|----------------|-----------|-----|
| Credits balance | `GET /v1/credits` | Every 5 min | Show balance, detect low-credit warnings |
| Daily usage by model | `GET /v1/users/usage` | Every 15 min | Per-model cost breakdown |
| Supported models | `GET /v1/models` | Every 1 hour | Cache supported models + pricing |

---

## 2. DB Schema Additions

### `openrouter_sync_state` — last sync timestamps and data

```sql
CREATE TABLE openrouter_sync_state (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key_type text NOT NULL,  -- 'credits' | 'usage' | 'models'
  last_synced_at timestamptz,
  last_synced_hash text,   -- hash of response, detect no-change
  data jsonb,              -- cached data
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(key_type)
);
```

### `openrouter_usage` — daily per-model usage records

```sql
CREATE TABLE openrouter_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  installation_id uuid NOT NULL REFERENCES installations(id),
  date date NOT NULL,           -- YYYY-MM-DD
  model text NOT NULL,
  input_tokens bigint NOT NULL DEFAULT 0,
  output_tokens bigint NOT NULL DEFAULT 0,
  cost_cents integer NOT NULL DEFAULT 0,  -- stored as integer cents
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(installation_id, date, model)
);

CREATE INDEX idx_openrouter_usage_install_date ON openrouter_usage(installation_id, date);
```

### Extend `openrouter_sync_jobs` (or create if not exists — follows provisioning job pattern)

```sql
CREATE TYPE sync_job_type AS ENUM ('sync_credits', 'sync_usage', 'sync_models');

CREATE TABLE openrouter_sync_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_type sync_job_type NOT NULL,
  status text NOT NULL DEFAULT 'pending',  -- 'pending' | 'running' | 'done' | 'failed'
  locked_until timestamptz,
  retry_count integer NOT NULL DEFAULT 0,
  last_error text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
```

---

## 3. Job Queue Service

Same pattern as `provisioning/service.ts`:

```ts
// src/lib/control-plane/openrouter-sync/service.ts

export class OpenRouterSyncService {
  /** Enqueue a sync job (called by cron or on-demand) */
  async enqueueSync(type: SyncJobType): Promise<void>;

  /** Claim and run the next available sync job */
  async runNext(): Promise<void>;

  /** Run all pending jobs to completion */
  async runUntilIdle(): Promise<void>;
}
```

Atomic claim:
```sql
UPDATE openrouter_sync_jobs
SET status = 'running', locked_until = now() + interval '5 minutes'
WHERE id = (
  SELECT id FROM openrouter_sync_jobs
  WHERE status = 'pending' AND (locked_until IS NULL OR locked_until < now())
  ORDER BY created_at ASC
  LIMIT 1
  FOR UPDATE SKIP LOCKED
)
RETURNING *;
```

---

## 4. Sync Functions

### Credits Sync

```ts
async function syncCredits(apiKey: string): Promise<CreditsData> {
  const res = await fetch('https://openrouter.ai/api/v1/credits', {
    headers: { 'Authorization': `Bearer ${apiKey}` }
  });
  const data = await res.json();
  return {
    balance: data.balance,       // dollars
    limit: data.limit,            // quota limit
    used: data.usage,             // total used so far
    renewedAt: data.renewed_at,    // ISO timestamp
  };
}
```

Store in `openrouter_sync_state` with `key_type = 'credits'`.

### Usage Sync

```ts
async function syncUsage(apiKey: string, since: Date): Promise<UsageRecord[]> {
  // GET /v1/users/usage — returns daily breakdown
  const res = await fetch(
    `https://openrouter.ai/api/v1/users/usage?since=${since.toISOString()}`,
    { headers: { 'Authorization': `Bearer ${apiKey}` } }
  );
  const data = await res.json();
  return data.data.map((r: any) => ({
    date: r.date,
    model: r.model,
    tokens: r.total_tokens,
    costCents: Math.round(r.cost * 100),
  }));
}
```

Merge into `openrouter_usage` using `INSERT ... ON CONFLICT DO UPDATE`.

### Models Cache

```ts
async function syncModels(): Promise<ModelInfo[]> {
  const res = await fetch('https://openrouter.ai/api/v1/models');
  const data = await res.json();
  return data.data.map((m: any) => ({
    id: m.id,
    name: m.name,
    pricing: m.pricing,
  }));
}
```

Store in `openrouter_sync_state` with `key_type = 'models'`.

---

## 5. Polling Schedule

Use cron (or a simple interval in the worker):

| Job | Frequency |
|-----|-----------|
| Credits sync | Every 5 minutes |
| Usage sync | Every 15 minutes |
| Models sync | Every 1 hour |

Enqueue jobs on schedule:
```ts
// In worker startup
setInterval(() => openrouterSyncService.enqueueSync('credits'), 5 * 60 * 1000);
setInterval(() => openrouterSyncService.enqueueSync('usage'), 15 * 60 * 1000);
setInterval(() => openrouterSyncService.enqueueSync('models'), 60 * 60 * 1000);
```

Or use the existing cron job system if one exists.

---

## 6. Error Handling

- If OpenRouter API returns 5xx or times out: retry with exponential backoff (max 5 retries, 5min cap)
- If API returns 401/403: mark associated OpenRouter key as invalid in DB, stop syncing it
- Log all sync failures with `reqId` for traceability
- After max retries: mark job `failed`, record `last_error`, alert

Circuit breaker pattern (reuse existing if found):
```ts
// If OpenRouter is down, skip sync cycle entirely
// Don't spam the API with retries when it's actually down
```

---

## 7. API Exposure (for billing/management)

```
GET /admin/openrouter/credits?installation_id=
GET /admin/openrouter/usage?installation_id=&from=&to=&model=
GET /admin/openrouter/models
```

Response shapes:

```ts
// GET /admin/openrouter/credits?installation_id=...
{
  "balance": 12.34,
  "limit": 100.00,
  "used": 87.66,
  "renewedAt": "2026-04-01T00:00:00Z",
  "lastSyncedAt": "2026-04-26T10:30:00Z"
}

// GET /admin/openrouter/usage?installation_id=...&from=2026-04-01&to=2026-04-26
{
  "records": [
    {
      "date": "2026-04-25",
      "model": "anthropic/claude-3.5-sonnet",
      "inputTokens": 150000,
      "outputTokens": 45000,
      "costCents": 42
    }
  ],
  "totalCostCents": 420
}
```

---

## 8. Directory Structure

```
src/
  lib/
    openrouter/
      client.ts           # OpenRouter API client (fetch wrappers)
      sync/
        service.ts        # OpenRouterSyncService
        jobs/
          credits.ts      # credits sync job
          usage.ts        # usage sync job
          models.ts      # models cache job
  server/
    routes/
      admin.openrouter.ts  # GET /admin/openrouter/*
tests/
  openrouter-sync/
    service.test.ts
    credits.test.ts
    usage.test.ts
drizzle/
  0006_openrouter_sync.sql
```

---

## 9. Implementation Order

1. Add migration `0006_openrouter_sync.sql` — all 3 tables
2. Create `src/lib/openrouter/client.ts` — fetch wrappers for credits/usage/models endpoints
3. Create `src/lib/openrouter/sync/jobs/credits.ts` — credits sync logic
4. Create `src/lib/openrouter/sync/jobs/usage.ts` — usage sync logic
5. Create `src/lib/openrouter/sync/jobs/models.ts` — models cache logic
6. Create `src/lib/openrouter/sync/service.ts` — job queue service
7. Wire sync job enqueuing into worker startup (setInterval)
8. Create `src/server/routes/admin.openrouter.ts` — read-only admin endpoints
9. Write tests for sync logic (mock OpenRouter API responses)
10. Write tests for service (atomic claim, retry, error handling)

---

## 10. Interaction with Billing

Credits data from this sync feeds the billing system:
- Low credit warning → email notification to user (via notification service)
- Usage data → per-installation cost tracking
- If user exceeds plan limit → block new installs or throttle

This makes the OpenRouter sync a prerequisite for accurate usage-based billing.
