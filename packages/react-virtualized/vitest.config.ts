import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['source-stripped/**/*.jest.jsx'],
    setupFiles: ['./vitest.setup.ts'],
  },
  esbuild: {
    loader: 'jsx',
    include: /source-stripped\/.*\.jsx$/,
  },
})