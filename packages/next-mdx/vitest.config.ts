import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // The tests mutate process.cwd() and mock the filesystem; keep files serial
    // to avoid cross-file races in CI.
    fileParallelism: false,
    include: ['**/*.test.{js,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
