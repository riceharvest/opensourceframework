import { test, expect } from 'vitest';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { join, resolve, sep } from 'node:path';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';

const execAsync = promisify(exec);
const monorepoRoot = existsSync(resolve(process.cwd(), 'packages/docs-bot'))
  ? process.cwd()
  : resolve(process.cwd(), '..', '..');
const cliPath = 'packages/docs-bot/dist/index.js';

function createFixtureRoot(): string {
  const root = mkdtempSync(join(tmpdir(), 'docs-bot-site-'));
  const packageDir = join(root, 'packages', 'sample-package');
  mkdirSync(join(packageDir, 'src'), { recursive: true });
  writeFileSync(
    join(packageDir, 'package.json'),
    JSON.stringify({
      name: '@opensourceframework/sample-package',
      description: 'Fixture package for docs-bot site tests',
    }),
    'utf8'
  );
  writeFileSync(join(packageDir, 'README.md'), '# Sample Package\n\nThis fixture is intentionally tiny.', 'utf8');
  writeFileSync(join(packageDir, 'src', 'index.ts'), 'export const sample = true;\n', 'utf8');
  return root;
}

async function runSiteCommand(args = '') {
  const fixtureRoot = createFixtureRoot();
  const outputDir = join(fixtureRoot, 'site-output');
  const { stdout } = await execAsync(
    `node ${cliPath} site --root "${fixtureRoot}" --output "${outputDir}" ${args}`,
    {
      cwd: monorepoRoot,
      env: { TERM: 'dumb', FORCE_COLOR: '0', ...process.env },
    }
  );

  return { fixtureRoot, outputDir, stdout };
}

test('site command generates static HTML site', async () => {
  const { fixtureRoot, outputDir, stdout } = await runSiteCommand();

  try {
    expect(stdout).toContain('Static site generated at');
    expect(stdout).toContain(`site-output${sep}index.html`);

    const indexPath = join(outputDir, 'index.html');
    expect(existsSync(indexPath)).toBe(true);

    const html = readFileSync(indexPath, 'utf8');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('OpenSourceFramework Packages');
    expect(html).toContain('package-grid');
    expect(html).toContain('@opensourceframework/sample-package');
    expect(html).toContain('Fixture package for docs-bot site tests');
    // Verify interactive search elements
    expect(html).toContain('id="search"');
    expect(html).toContain('fuse.js');
    expect(html).toContain('searchInput.addEventListener');
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test('site command with custom snippet length', async () => {
  const { fixtureRoot, outputDir, stdout } = await runSiteCommand('--snippet-length 500');

  try {
    expect(stdout).toContain('Static site generated at');
    const indexPath = join(outputDir, 'index.html');
    const html = readFileSync(indexPath, 'utf8');
    expect(html).toContain('package-grid');
    expect(html).toContain('@opensourceframework/sample-package');
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});
