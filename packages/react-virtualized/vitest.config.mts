import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['source-stripped/vitest-setup.ts'],
    include: ['test/**/*.test.ts', 'source-stripped/**/*.jest.jsx'],
    alias: {
      '@opensourceframework/react-virtualized': '/source-stripped/index.jsx'
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['source-stripped/**'],
      exclude: [
        'source-stripped/**/*.jest.jsx',
        'source-stripped/**/*.e2e.jsx',
        'source-stripped/**/*.example.jsx',
        'source-stripped/**/*.ssr.jsx',
        'source-stripped/demo/**',
        'source-stripped/jest-setup.jsx',
        'source-stripped/TestUtils.jsx',
        'source-stripped/vendor/**',
      ],
    },
  },
});
