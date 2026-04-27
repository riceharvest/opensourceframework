# Plan: Install Lifecycle Actions

## Context

- **Project root:** `/home/dario/Documents/dev workspace/opensourceframework/`
- **Stack:** pnpm/Turbo monorepo, Hono, Drizzle ORM, Postgres, TypeScript
- **Existing:** Hetzner provisioning worker, `installations` table
- **Install status:** `provisioning | running | stopped | paused | error | deleting`

---

## Goal

Wire real Hetzner API calls to lifecycle operations so users can restart, wake, pause, stop, and permanently delete/deprovision their agent installs.

---

## 1. Install Status State Machine

```
provisioning ──► running ──┬──► stopped ────► running (wake)
                            │                    ▲
                            │                    │
                            ├──► paused ────────┤
                            │                    │
                            │                    │
                            └──► error ─────────┘
                            │
                            └──► deleting ───► (terminal)
```

**Valid transitions:**

| Action | Valid source states | Target state |
|--------|-------------------|--------------|
| `wake` | `stopped` | `running` |
| `pause` | `running` | `paused` |
| `stop` | `running` | `stopped` |
| `restart` | `running` | `running` (reset) |
| `deprovision` | `running`, `stopped`, `paused`, `error` | `deleting` → gone |

---

## 2. Hetzner API Calls Needed

From `src/lib/providers/hetzner-provisioning.ts` (existing), add:

```ts
// src/lib/hetzner/server-actions.ts

/** Start a stopped server (wake) */
export async function startServer(serverId: string): Promise<void>;

/** Stop a running server (graceful shutdown) */
export async function stopServer(serverId: string): Promise<void>;

/** Reset a running server (hard restart) */
export async function resetServer(serverId: string): Promise<void>;

/** Delete a server and all attached resources */
export async function deleteServer(serverId: string): Promise<void>;
```

Each wraps the Hetzner REST API:
- `POST /servers/{id}/actions/start`
- `POST /servers/{id}/actions/shutdown` (graceful stop)
- `POST /servers/{id}/actions/reset`
- `POST /servers/{id}/actions/delete`

---

## 3. DB Schema Additions

### `lifecycle_events` table (audit log)

```sql
CREATE TABLE lifecycle_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  installation_id uuid NOT NULL REFERENCES installations(id),
  action text NOT NULL,  -- 'wake' | 'pause' | 'stop' | 'restart' | 'deprovision'
  status text NOT NULL,  -- 'requested' | 'completed' | 'failed'
  hetzner_action_id text,
  error_message text,
  requested_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz
);
```

### Update `installations` table

Add `status` column if not already present:

```sql
ALTER TABLE installations ADD COLUMN status text NOT NULL DEFAULT 'provisioning';
```

---

## 4. Lifecycle Service

```ts
// src/lib/control-plane/lifecycle/service.ts

export class LifecycleService {
  /** Validate and execute wake — starts a stopped server */
  async wake(installationId: string, reqId: string): Promise<LifecycleEvent>;

  /** Pause — graceful stop */
  async pause(installationId: string, reqId: string): Promise<LifecycleEvent>;

  /** Hard stop */
  async stop(installationId: string, reqId: string): Promise<LifecycleEvent>;

  /** Restart */
  async restart(installationId: string, reqId: string): Promise<LifecycleEvent>;

  /** Deprovision — delete Hetzner server + all resources */
  async deprovision(installationId: string, reqId: string): Promise<LifecycleEvent>;
}
```

Each method:
1. Loads installation from DB
2. Validates status transition is allowed
3. Sets `status = action_target` in DB
4. Calls Hetzner API
5. Records `lifecycle_event` audit row
6. Returns event

---

## 5. API Endpoints

```
POST /installs/:id/wake
POST /installs/:id/pause
POST /installs/:id/stop
POST /installs/:id/restart
POST /installs/:id/deprovision
```

Response shape:

```ts
// 202 Accepted — action queued/executed
{
  "event": {
    "id": "uuid",
    "action": "wake",
    "status": "completed", // or "requested" if async
    "requested_at": "ISO timestamp"
  }
}

// 409 Conflict — invalid state transition
{
  "error": "invalid_transition",
  "message": "Cannot wake install in 'paused' state. Valid states: stopped",
  "current_status": "paused"
}
```

---

## 6. Deprovision Cleanup (async job)

Deprovision is not synchronous — it queues a `deprovision` job:

1. Set `status = 'deleting'` in DB
2. Queue `deprovision` job
3. Worker picks up job:
   a. Delete Hetzner server (frees IP, volume)
   b. Remove DNS records
   c. Mark lifecycle event `completed`
   d. Delete installation row (or mark `deleted`)

If Hetzner delete fails → retry with backoff, then mark `failed` after max retries.

---

## 7. Directory Structure

```
src/
  lib/
    hetzner/
      client.ts          # existing Hetzner API client
      server-actions.ts # NEW: start/stop/reset/delete wrappers
    control-plane/
      lifecycle/
        service.ts      # LifecycleService
        validation.ts   # state transition rules
        errors.ts       # InvalidTransitionError
  server/
    routes/
      lifecycle.ts      # mount POST /installs/:id/{action}
tests/
  lifecycle/
    service.test.ts
    validation.test.ts
drizzle/
  0004_lifecycle_events.sql
```

---

## 8. Implementation Order

1. Add `server-actions.ts` — Hetzner start/stop/reset/delete API wrappers
2. Add `lifecycle/service.ts` — `LifecycleService` with all 5 actions
3. Add `lifecycle/validation.ts` — state machine rules
4. Add `lifecycle/errors.ts` — `InvalidTransitionError`
5. Add migration `0004_lifecycle_events.sql`
6. Create `src/server/routes/lifecycle.ts` — mount endpoints
7. Wire lifecycle routes into main app
8. Write tests: valid transitions, invalid transitions (409), Hetzner errors

---

## 9. Open Questions

- **Graceful vs hard stop:** `shutdown` is graceful (OS shutdown signal), `stop` is hard power cut. Which is default for `pause`?
- **Restart behavior:** Does restart clear the KV cache? Should it?
- **Deprovision confirmation:** Require a confirmation flag (`{ force: true }`) to prevent accidental deletion?
