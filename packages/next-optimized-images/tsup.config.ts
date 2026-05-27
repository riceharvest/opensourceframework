import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['lib/index.js'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: [
    'next',
    'webpack',
    './loaders/raw-loader/export-loader.js',
    './loaders/lqip-loader/picture-export-loader.js',
    './loaders/lqip-loader/colors-export-loader.js',
  ],
})
