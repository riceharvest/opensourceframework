import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['test/**/*.test.ts'],
    setupFiles: ['./vitest.setup.ts'],
  },
  esbuild: {
    loader: 'jsx',
    include: /source-stripped\/.*\.jsx$/,
  },
})
