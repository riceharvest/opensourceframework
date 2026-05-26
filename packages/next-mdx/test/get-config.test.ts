import { mkdtemp, rm, writeFile } from 'fs/promises';
import path from 'path';

import { getConfig } from '../src/get-config';

// Skip on Windows: temp paths with ~ get URL-encoded, breaking dynamic import
const isWindows = process.platform === 'win32';
const originalCwd = process.cwd();

afterEach(() => {
  process.chdir(originalCwd);
});

test.sequential.skipIf(isWindows)('prefers next-mdx.config.mjs over next-mdx.json', async () => {
  const tempDir = await mkdtemp(path.join(originalCwd, '.tmp-next-mdx-config-'));

  try {
    await writeFile(
      path.join(tempDir, 'next-mdx.json'),
      JSON.stringify({
        post: {
          contentPath: 'content/from-json',
        },
      })
    );

    await writeFile(
      path.join(tempDir, 'next-mdx.config.mjs'),
      [
        'export default {',
        "  post: {",
        "    contentPath: 'content/from-js',",
        "    basePath: '/blog'",
        '  }',
        '};',
      ].join('\n')
    );

    process.chdir(tempDir);

    await expect(getConfig()).resolves.toEqual({
      post: {
        contentPath: 'content/from-js',
        basePath: '/blog',
      },
    });
  } finally {
    process.chdir(originalCwd);
    await rm(tempDir, { recursive: true, force: true });
  }
});
