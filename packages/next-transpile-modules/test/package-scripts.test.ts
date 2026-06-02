import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const packageJson = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf8')) as {
  scripts: Record<string, string>;
};

describe('package scripts', () => {
  it('uses pnpm for the package-local pretest setup step', () => {
    expect(packageJson.scripts.pretest).toBe('pnpm run setup');
  });
});
