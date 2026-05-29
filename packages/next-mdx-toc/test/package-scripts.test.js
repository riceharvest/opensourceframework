import { describe, expect, it } from 'vitest';
import packageJson from '../package.json' assert { type: 'json' };

describe('package scripts', () => {
  it('uses the repo-pinned pnpm through Corepack for workspace dependency builds', () => {
    expect(packageJson.scripts.prebuild).toBe(
      'corepack pnpm --filter @opensourceframework/next-mdx build'
    );
    expect(packageJson.scripts.predev).toBe(
      'corepack pnpm --filter @opensourceframework/next-mdx build'
    );
  });
});
