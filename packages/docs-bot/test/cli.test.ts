import { test, expect } from 'vitest';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';

const execAsync = promisify(exec);
// When running via pnpm test in the package, process.cwd() is the package root (packages/docs-bot)
// The monorepo root is two levels up.
const monorepoRoot = resolve(process.cwd(), '..', '..');

test('CLI lists packages when run without query', async () => {
  const { stdout } = await execAsync('node packages/docs-bot/dist/index.js', {
    cwd: monorepoRoot,
    env: { TERM: 'dumb', FORCE_COLOR: '0', ...process.env }
  });
  expect(stdout).toContain('Found');
  expect(stdout).toContain('@opensourceframework/docs-bot');
});

test('CLI finds packages matching query "auth"', async () => {
  const { stdout } = await execAsync('node packages/docs-bot/dist/index.js "auth"', {
    cwd: monorepoRoot,
    env: { TERM: 'dumb', FORCE_COLOR: '0', ...process.env }
  });
  expect(stdout).toContain('next-auth');
});

test('CLI returns non-zero exit on invalid usage', async () => {
  await expect(execAsync('node packages/docs-bot/dist/index.js --invalid-flag', {
    cwd: monorepoRoot,
    env: { TERM: 'dumb', FORCE_COLOR: '0', ...process.env }
  })).rejects.toThrow();
});
