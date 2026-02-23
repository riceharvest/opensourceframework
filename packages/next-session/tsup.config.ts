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
  external: ['next', 'cookie', 'nanoid'],
  esbuildOptions(options) {
    options.banner = {
      js: `/**
 * @opensourceframework/next-session
 * Simple promise-based session for Next.js
 * 
 * @original-author Unknown
 * @original-repo https://github.com/hoangvvo/next-session
 * @license MIT
 */`,
    };
  },
});
