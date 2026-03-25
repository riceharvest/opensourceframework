import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { env } from '@pospos2/config';
import { createScaleRegistry, type ScaleRegistry } from './services/scale-reader';

const app = new Hono();

app.use('/*', cors());

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
      // Send periodic updates for the default scale
      setInterval(async () => {
        try {
          const reading = await scaleRegistry.getReading();
          controller.enqueue(`data: ${JSON.stringify(reading)}\n\n`);
        } catch (err) {
          console.error('Error reading scale for events:', err);
        }
      }, 1000);
    },
  });
  return c.stream(stream);
});

app.get('/outbox/status', (c) => {
  // TODO: implement outbox status
  return c.json({ pending: 0, lastSync: null });
});

app.post('/outbox/retry', async (c) => {
  // TODO: implement retry
  return c.json({ ok: true });
});

app.post('/device/register', async (c) => {
  const { name } = await c.req.json();
  // TODO: register device with cloud API
  return c.json({ ok: true, deviceId: 'device-' + Date.now() });
});

const port = parseInt(env.AGENT_PORT, 10);
console.log(`POSPOS Agent listening on http://localhost:${port}`);
export default app;
