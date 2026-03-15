import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/next-transpile-modules.js'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['next'],
})
