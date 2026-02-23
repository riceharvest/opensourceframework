import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['source/index.js'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  external: ['react', 'react-dom'],
  loader: {
    '.js': 'jsx',
  },
  esbuildOptions(options) {
    options.banner = {
      js: '"use client";',
    };
  },
});
