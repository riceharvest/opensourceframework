import { test, expect, vi } from 'vitest';
import { program } from '../src/index';
import { resolve } from 'node:path';

// Compute monorepo root relative to this test file location (test/ -> ../../.. -> workspace)
const monorepoRoot = resolve(import.meta.dirname, '..', '..', '..');

test('ask command fails without OPENROUTER_API_KEY', async () => {
  const savedKey = process.env.OPENROUTER_API_KEY;
  process.env.OPENROUTER_API_KEY = '';
  program.exitOverride();
  try {
    await expect(program.parseAsync([
      'node', 'docs-bot', '-r', monorepoRoot, 'ask', 'What is this?'
    ])).rejects.toThrow();
  } finally {
    if (savedKey !== undefined) process.env.OPENROUTER_API_KEY = savedKey;
    else delete process.env.OPENROUTER_API_KEY;
  }
});

test('ask command returns answer from OpenRouter', async () => {
  const mockResponse = {
    choices: [{ message: { content: 'Test answer from OpenRouter' } }]
  };

  const originalFetch = global.fetch;
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    } as Response)
  ) as any;

  const logMock = vi.fn();
  const originalLog = console.log;
  console.log = logMock;

  const savedKey = process.env.OPENROUTER_API_KEY;
  process.env.OPENROUTER_API_KEY = 'dummy-key';

  program.exitOverride();
  try {
    await program.parseAsync([
      'node', 'docs-bot', '-r', monorepoRoot, 'ask', 'test question'
    ]);
    expect(logMock).toHaveBeenCalledWith('Test answer from OpenRouter');
    expect(global.fetch).toHaveBeenCalledWith(
      'https://openrouter.ai/api/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': 'Bearer dummy-key'
        })
      })
    );
  } finally {
    console.log = originalLog;
    global.fetch = originalFetch;
    if (savedKey !== undefined) process.env.OPENROUTER_API_KEY = savedKey;
    else delete process.env.OPENROUTER_API_KEY;
  }
});

