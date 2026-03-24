import { test, expect } from 'vitest';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';

const execAsync = promisify(exec);
const monorepoRoot = resolve(process.cwd(), '..', '..');

test('ask command fails without OPENROUTER_API_KEY', async () => {
  // Ensure OPENROUTER_API_KEY is not set in the environment
  const env = { ...process.env, OPENROUTER_API_KEY: '' };
  await expect(execAsync('node packages/docs-bot/dist/index.js ask "What is this?"', {
    cwd: monorepoRoot,
    env: { TERM: 'dumb', FORCE_COLOR: '0', ...env }
  })).rejects.toThrow();
});
