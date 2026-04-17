import { test, expect } from 'vitest';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve, sep } from 'node:path';
import { existsSync, rmSync, readFileSync } from 'node:fs';

const execAsync = promisify(exec);
const monorepoRoot = resolve(process.cwd(), '..', '..');
const testOutputDir = resolve(monorepoRoot, 'test-docs-site-tmp');
const indexPathStr = `test-docs-site-tmp${sep}index.html`;

// Ensure clean state before tests
if (existsSync(testOutputDir)) {
  rmSync(testOutputDir, { recursive: true, force: true });
}

test('site command generates static HTML site', async () => {
  const { stdout } = await execAsync('node packages/docs-bot/dist/index.js site --output test-docs-site-tmp', {
    cwd: monorepoRoot,
    env: { TERM: 'dumb', FORCE_COLOR: '0', ...process.env }
  });

  expect(stdout).toContain('Static site generated at');
  expect(stdout).toContain(indexPathStr);

  const indexPath = resolve(testOutputDir, 'index.html');
  expect(existsSync(indexPath)).toBe(true);

  const html = readFileSync(indexPath, 'utf8');
  expect(html).toContain('<!DOCTYPE html>');
  expect(html).toContain('OpenSourceFramework Packages');
  expect(html).toContain('package-grid');
  expect(html).toMatch(/@opensourceframework\/\w+/);
  // Verify interactive search elements
  expect(html).toContain('id="search"');
  expect(html).toContain('fuse.js');
  expect(html).toContain('searchInput.addEventListener');
});

test('site command with custom snippet length', async () => {
  // Clean previous output
  if (existsSync(testOutputDir)) {
    rmSync(testOutputDir, { recursive: true, force: true });
  }

  const { stdout } = await execAsync('node packages/docs-bot/dist/index.js site --output test-docs-site-tmp --snippet-length 500', {
    cwd: monorepoRoot,
    env: { TERM: 'dumb', FORCE_COLOR: '0', ...process.env }
  });

  expect(stdout).toContain('Static site generated at');
  const indexPath = resolve(testOutputDir, 'index.html');
  const html = readFileSync(indexPath, 'utf8');
  expect(html).toContain('package-grid');
});
