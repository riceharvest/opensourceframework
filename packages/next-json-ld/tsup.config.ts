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
 * @opensourceframework/next-json-ld
 * JSON-LD structured data helpers for Next.js SEO
 * 
 * @license MIT
 */`,
    };
  },
});
