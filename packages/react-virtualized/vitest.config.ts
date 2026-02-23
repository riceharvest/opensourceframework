import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./source/vitest-setup.ts'],
    include: ['source-stripped/**/*.jest.jsx', 'source-stripped/**/*.ssr.jsx'],
    exclude: ['node_modules', 'dist', 'source-stripped/**/*.e2e.jsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['source-stripped/**/*.jsx'],
      exclude: [
        'source-stripped/vendor/**',
        'source-stripped/demo/**',
        'source-stripped/jest-*.jsx',
        'source-stripped/vitest-*.ts',
        'source-stripped/TestUtils.jsx',
        '**/*.example.jsx',
      ],
    },
  },
});
