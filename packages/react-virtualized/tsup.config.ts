import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['source-stripped/index.jsx'],
  format: ['cjs', 'esm'],
  dts: false,
  clean: true,
  external: ['react', 'react-dom'],
  loader: { '.js': 'jsx' },
})