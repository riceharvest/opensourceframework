import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { env } from '@pospos2/config';
import { createScaleRegistry, type ScaleRegistry } from './services/scale-reader';
import { readdir, mkdir, rename, writeFile, readFile, stat } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { requestIdMiddleware } from './server/middleware/request-id.js';
import { httpLogger } from './server/middleware/logger.js';
import { logger } from './lib/logger.js';

const app = new Hono();

app.use('/*', cors());
app.use(requestIdMiddleware(app));
app.use(httpLogger(app));

// Outbox and device storage configuration
const OUTBOX_DIR = join(process.cwd(), 'outbox');
const PENDING_DIR = join(OUTBOX_DIR, 'pending');
const SYNCED_DIR = join(OUTBOX_DIR, 'synced');
const ARCHIVE_DIR = join(OUTBOX_DIR, 'archive');
const DEVICE_FILE = join(process.cwd(), 'device.json');
const STATE_FILE = join(OUTBOX_DIR, 'state.json');

// Global state
let state: { lastRetryAt: string | null; lastSuccessfulSyncAt: string | null; cloudReachable: boolean } = {
  lastRetryAt: null,
  lastSuccessfulSyncAt: null,
  cloudReachable: false,
};

async function init() {
  await mkdir(PENDING_DIR, { recursive: true });
  await mkdir(SYNCED_DIR, { recursive: true });
  await mkdir(ARCHIVE_DIR, { recursive: true });
  try {
    const stateRaw = await readFile(STATE_FILE, 'utf-8');
    state = JSON.parse(stateRaw);
  } catch {
    // Use defaults
  }
}
await init();

async function saveState() {
  await writeFile(STATE_FILE, JSON.stringify(state, null, 2));
}

// Device helpers
async function getDeviceRecord() {
  try {
    const data = await readFile(DEVICE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return null;
  }
}

async function ensureDeviceId() {
  let device = await getDeviceRecord();
  if (!device) {
    const deviceId = randomUUID();
    device = { id: deviceId, registeredAt: new Date().toISOString(), lastSeen: new Date().toISOString() };
    await writeFile(DEVICE_FILE, JSON.stringify(device, null, 2));
    return deviceId;
  }
  return device.id;
}

async function updateDeviceLastSeen() {
  const device = await getDeviceRecord();
  if (device) {
    device.lastSeen = new Date().toISOString();
    await writeFile(DEVICE_FILE, JSON.stringify(device, null, 2));
  }
}

// Outbox helpers
interface PendingTransaction {
  id: string;
  data: any;
  filePath: string;
  fileName: string;
  mtime: number;
}

async function listPendingTransactions(): Promise<PendingTransaction[]> {
  const files = await readdir(PENDING_DIR).catch(() => []);
  const pending: PendingTransaction[] = [];
  for (const file of files) {
    if (file.startsWith('pending_') && file.endsWith('.json')) {
      const filePath = join(PENDING_DIR, file);
      try {
        const stats = await stat(filePath);
        const content = await readFile(filePath, 'utf-8');
        const data = JSON.parse(content);
        const id = file.replace(/^pending_|\.json$/g, '');
        pending.push({ id, data, filePath, fileName: file, mtime: stats.mtimeMs });
      } catch (e) {
        // ignore
      }
    }
  }
  // Sort by mtime ascending to get oldest first if needed
  pending.sort((a, b) => a.mtime - b.mtime);
  return pending;
}

async function savePendingTransaction(transaction: any): Promise<string> {
  const id = transaction.id || randomUUID();
  const fileName = `pending_${id}.json`;
  const filePath = join(PENDING_DIR, fileName);
  await writeFile(filePath, JSON.stringify(transaction, null, 2));
  return id;
}

async function syncPendingTransactions(): Promise<{ success: number; failed: number }> {
  const pending = await listPendingTransactions();
  if (pending.length === 0) {
    return { success: 0, failed: 0 };
  }
  const deviceId = await ensureDeviceId();
  try {
    const response = await fetch(`${env.CLOUD_API_URL}/api/sync`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deviceId,
        transactions: pending.map(p => p.data)
      })
    });
    if (response.ok) {
      for (const p of pending) {
        const dest = join(SYNCED_DIR, p.fileName);
        await rename(p.filePath, dest);
      }
      state.lastSuccessfulSyncAt = new Date().toISOString();
      state.cloudReachable = true;
      await saveState();
      return { success: pending.length, failed: 0 };
    } else {
      state.cloudReachable = false;
      await saveState();
      return { success: 0, failed: pending.length };
    }
  } catch (err) {
    const log = logger.child({ component: 'service', action: 'outbox.sync' });
    log.error({ err }, 'sync error');
    state.cloudReachable = false;
    await saveState();
    return { success: 0, failed: pending.length };
  }
}

async function cleanupSyncedFiles(days: number = 7): Promise<number> {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  const files = await readdir(SYNCED_DIR).catch(() => []);
  let archived = 0;
  for (const file of files) {
    if (file.startsWith('pending_') && file.endsWith('.json')) {
      const filePath = join(SYNCED_DIR, file);
      try {
        const stats = await stat(filePath);
        if (stats.mtimeMs < cutoff) {
          const dest = join(ARCHIVE_DIR, file);
          await rename(filePath, dest);
          archived++;
        }
      } catch (e) {
        // ignore
      }
    }
  }
  return archived;
}

// Initialize scale registry
const scaleRegistry: ScaleRegistry = createScaleRegistry(env);

app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/scale', async (c) => {
  const scaleId = c.req.query('scaleId') as string | undefined;
  return c.json(await scaleRegistry.getReading(scaleId));
});

app.get('/scales', async (c) => {
  const readings = await scaleRegistry.getAllReadings();
  return c.json({ scales: readings });
});

app.get('/events', async (c) => {
  const stream = new ReadableStream({
    async start(controller) {
      setInterval(async () => {
        try {
          const reading = await scaleRegistry.getReading();
          controller.enqueue(`data: ${JSON.stringify(reading)}\n\n`);
        } catch (err) {
          const log = logger.child({ component: 'service', action: 'scale.read' });
          log.error({ err }, 'error reading scale for events');
        }
      }, 1000);
    },
  });
  return c.body(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', 'Connection': 'keep-alive' } });
});

app.get('/version', async (c) => {
  try {
    const pkgPath = join(process.cwd(), 'package.json');
    const pkgRaw = await readFile(pkgPath, 'utf-8');
    const pkg = JSON.parse(pkgRaw);
    return c.json({ name: pkg.name, version: pkg.version });
  } catch (e) {
    return c.json({ name: 'pospos-agent', version: 'unknown' });
  }
});

app.get('/device/config', async (c) => {
  await updateDeviceLastSeen();
  const device = await getDeviceRecord();
  return c.json({
    deviceId: device?.id ?? null,
    storeId: null,
    displayName: device?.name ?? null,
    cloudApiUrl: env.CLOUD_API_URL,
    isRegistered: !!device,
    registeredAt: device?.registeredAt ?? null,
    lastSeen: device?.lastSeen ?? null,
  });
});

app.post('/device/register', async (c) => {
  const body = await c.req.json();
  const name = body.name || null;
  let device = await getDeviceRecord();
  if (!device) {
    const deviceId = randomUUID();
    device = { id: deviceId, name, registeredAt: new Date().toISOString(), lastSeen: new Date().toISOString() };
  } else {
    if (name) device.name = name;
    device.lastSeen = new Date().toISOString();
  }
  await writeFile(DEVICE_FILE, JSON.stringify(device, null, 2));
  return c.json({ ok: true, deviceId: device.id });
});

app.get('/outbox/pending', async (c) => {
  const pending = await listPendingTransactions();
  return c.json({ pending: pending.map(p => ({ id: p.id })), count: pending.length });
});

app.post('/outbox/transactions', async (c) => {
  const transaction = await c.req.json();
  const id = await savePendingTransaction(transaction);
  return c.json({ status: 'queued', id });
});

app.get('/outbox/status', async (c) => {
  const pending = await listPendingTransactions();
  const pendingCount = pending.length;
  let oldestPendingAt = null;
  if (pending.length > 0) {
    const oldest = pending[0]; // sorted by mtime ascending
    oldestPendingAt = new Date(oldest.mtime).toISOString();
  }
  return c.json({
    pendingCount,
    syncingCount: 0,
    failedCount: 0,
    oldestPendingAt,
    lastRetryAt: state.lastRetryAt,
    lastSuccessfulSyncAt: state.lastSuccessfulSyncAt,
    cloudReachable: state.cloudReachable
  });
});

app.post('/outbox/retry', async (c) => {
  const result = await syncPendingTransactions();
  state.lastRetryAt = new Date().toISOString();
  await saveState();
  return c.json({ status: 'ok', ...result });
});

app.post('/outbox/cleanup', async (c) => {
  const days = c.req.query('days') ? parseInt(c.req.query('days') as string, 10) : 7;
  const archived = await cleanupSyncedFiles(days);
  return c.json({ archived });
});

const port = parseInt(env.AGENT_PORT, 10);
logger.info({ port }, 'POSPOS Agent listening');
export default app;
