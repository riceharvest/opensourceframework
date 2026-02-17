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
  esbuildOptions(options) {
    options.banner = {
      js: `/**
 * @opensourceframework/next-circuit-breaker
 * Circuit breaker pattern implementation for Next.js API routes
 * 
 * @license MIT
 */`,
    };
  },
});
