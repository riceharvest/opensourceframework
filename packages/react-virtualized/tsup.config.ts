import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['source-stripped/index.jsx'],
  format: ['cjs', 'esm'],
  dts: false,
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
