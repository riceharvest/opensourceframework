import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  treeshake: true,
  external: ['react'],
  esbuildOptions(options) {
    options.banner = {
      js: `/**
 * @opensourceframework/react-a11y-utils
 * React accessibility utility functions and hooks
 * 
 * @license MIT
 */`,
    };
  },
});
