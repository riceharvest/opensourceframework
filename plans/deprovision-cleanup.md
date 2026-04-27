# Plan: Hetzner Resource Deprovisioning & Cleanup

## Context

- **Project root:** `/home/dario/Documents/dev workspace/opensourceframework/`
- **Stack:** pnpm/Turbo monorepo, Hono, Drizzle ORM, Postgres, TypeScript
- **Existing:** `lifecycle-actions.md` plan includes `deprovision` action; provisioning worker; `installations` table with Hetzner server IDs
- **Goal:** Cleanly destroy all Hetzner resources when an install is deleted, preventing orphaned resources and leaked IPs/volumes

---

## Goal

When a user deletes an installation, all Hetzner cloud resources (server, attached IPs, volumes, DNS entries) must be permanently destroyed. This must be robust — no orphaned servers accruing costs.

---

## 1. What Gets Created Per Install

Based on the Hetzner provisioning plan, each install creates:

| Resource | Hetzner API |
|----------|------------|
| Server (VM) | `POST /servers` |
| Primary IP | Assigned at server creation |
| Firewall (optional) | `POST /firewalls` |
| Volume (optional) | `POST /volumes` |
| DNS entry (reverse PTR) | Hetzner DNS API |

---

## 2. Deprovision Cleanup Order (Safe Destroy Order)

```
1. Mark installation status = 'deleting' in DB (prevents new agent connections)
2. Remove DNS reverse PTR record (prevents dangling DNS)
3. Delete firewall (detaches from server)
4. Delete server (this also releases primary IP)
5. Delete any additional attached volumes
6. Mark installation as 'deleted' in DB (or remove row)
7. Emit lifecycle event 'completed'
```

If any step fails → retry with exponential backoff (max 5 attempts), then mark `failed` after retries exhausted.

---

## 3. DB Schema Additions

### `installation_resources` table (tracks all Hetzner resource IDs)

```sql
CREATE TABLE installation_resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  installation_id uuid NOT NULL REFERENCES installations(id),
  resource_type text NOT NULL,  -- 'server' | 'ip' | 'firewall' | 'volume' | 'dns_record'
  resource_id text NOT NULL,   -- Hetzner resource ID (string)
  metadata jsonb,               -- extra info: ip address, volume size, etc.
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_installation_resources_install ON installation_resources(installation_id);
```

**Update this table during provisioning** — record every resource ID that gets created. This is the deprovisioning manifest.

---

## 4. Deprovision Job (async, via job queue)

Same pattern as provisioning jobs:

```ts
// src/lib/control-plane/deprovision/service.ts

export class DeprovisionService {
  /** Enqueue a deprovision job for an installation */
  async enqueue(installationId: string, reqId: string): Promise<void>;

  /** Run the next pending deprovision job */
  async runNext(): Promise<void>;

  /** Run all pending deprovision jobs to completion */
  async runUntilIdle(): Promise<void>;
}
```

Job record in `provisioning_jobs` table (reuse existing job infrastructure):
```sql
INSERT INTO provisioning_jobs (job_type, metadata, status)
VALUES ('deprovision', jsonb_build_object('installation_id', $1), 'pending');
```

---

## 5. Deprovision Worker Function

```ts
async function deprovisionInstall(job: ProvisioningJob) {
  const { installationId } = job.metadata;
  const resources = await db.query.installationResources.findMany({
    where: eq(installationResources.installationId, installationId),
    orderBy: [desc(installationResources.resourceType)], // server last
  });

  // Step 1: Mark deleting
  await db.update(installations)
    .set({ status: 'deleting' })
    .where(eq(installations.id, installationId));

  for (const resource of resources) {
    try {
      await deleteResource(resource);
    } catch (err) {
      // Log error, record in lifecycle event, retry or fail
      await recordLifecycleEvent(installationId, 'deprovision', 'failed', err.message);
      throw err;
    }
  }

  // Step 7: Mark deleted in DB
  await db.update(installations)
    .set({ status: 'deleted', deletedAt: new Date() })
    .where(eq(installations.id, installationId));

  await recordLifecycleEvent(installationId, 'deprovision', 'completed');
}
```

Resource deletion mapping:

```ts
async function deleteResource(resource: InstallationResource) {
  switch (resource.resourceType) {
    case 'server':
      await hetznerClient.deleteServer(resource.resourceId);
      break;
    case 'firewall':
      await hetznerClient.deleteFirewall(resource.resourceId);
      break;
    case 'volume':
      await hetznerClient.deleteVolume(resource.resourceId);
      break;
    case 'dns_record':
      await hetznerDnsClient.deleteRecord(resource.resourceId);
      break;
    // IP is released automatically when server is deleted
  }
}
```

---

## 6. DNS Cleanup — Hetzner Reverse DNS

When provisioning creates a server, it sets a reverse PTR record:

```
# Hetzner DNS API — delete reverse DNS for IP
DELETE /records/{zone_id}/{record_id}
```

Store the DNS record ID in `installation_resources` during provisioning so we can delete it here.

---

## 7. Error Handling & Retries

| Error type | Response |
|------------|----------|
| Hetzner API 404 (resource already gone) | Log warning, continue to next resource |
| Hetzner API 429 (rate limited) | Backoff 30s, retry up to 5 times |
| Hetzner API 5xx | Backoff 60s, retry up to 5 times |
| Max retries exceeded | Mark job `failed`, record `last_error`, alert |

Job is never lost — stays in `pending`/`failed` status until manually resolved or retried.

---

## 8. Hard Delete vs Soft Delete

**Soft delete (default):** Set `status = 'deleted'` and `deleted_at = now()` in DB. Keep the row for audit/history. Resources are gone.

**Hard delete (GDPR/account closure):** Physically remove the DB row after resources are confirmed deleted.

Use soft delete for normal deprovision. Hard delete is a separate admin action.

---

## 9. API Endpoint

```
DELETE /installs/:id
```

Request body (optional):
```json
{ "force": false }
```

| `force=false` (default) | `force=true` |
|------------------------|--------------|
| Returns 202 Accepted (async job) | Returns 202 Accepted (async job) |
| Waits for install to be in a valid state | Immediately marks deleting, kills server |
| Checks for active connections | Skips graceful shutdown |

Response:
```json
{
  "job": {
    "id": "uuid",
    "status": "pending",
    "estimated_duration_seconds": 60
  }
}
```

---

## 10. Idempotency

If `DELETE /installs/:id` is called twice:
1. First call → enqueues deprovision job, returns 202
2. Second call → checks if deprovision already in progress/pending → returns 409 `deprovision_in_progress`

---

## 11. Directory Structure

```
src/
  lib/
    hetzner/
      resources.ts       # deleteServer, deleteFirewall, deleteVolume, deleteDnsRecord
    control-plane/
      deprovision/
        service.ts      # DeprovisionService
        worker.ts       # runNext / runUntilIdle
  server/
    routes/
      deprovision.ts    # DELETE /installs/:id
tests/
  deprovision/
    service.test.ts
    cleanup-order.test.ts
drizzle/
  0007_installation_resources.sql
  0008_deprovision_jobs.sql  (if separate job type from provisioning)
```

---

## 12. Implementation Order

1. Add `installation_resources` table migration (`0007`)
2. Add `delete_*` functions to `src/lib/hetzner/resources.ts`
3. Update provisioning to record all resource IDs in `installation_resources` table
4. Create `src/lib/control-plane/deprovision/service.ts`
5. Create `src/lib/control-plane/deprovision/worker.ts`
6. Create `DELETE /installs/:id` route that enqueues deprovision job
7. Wire worker into worker binary
8. Write tests: cleanup order, 404 handling, retry backoff, idempotency
