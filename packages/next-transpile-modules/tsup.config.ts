import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/next-transpile-modules.js'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  treeshake: true,
  external: ['next', 'enhanced-resolve'],
  esbuildOptions(options) {
    options.banner = {
      js: `/**
 * @opensourceframework/next-transpile-modules
 * Next.js plugin to transpile code from node_modules
 *
 * @original-author https://github.com/vercel/next.js
 * @original-repo https://github.com/vercel/next.js
 * @license MIT
 */`,
    };
  },
});
