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
  external: ['next', 'universal-cookie'],
  esbuildOptions(options) {
    options.banner = {
      js: `/**
 * @opensourceframework/next-cookies
 * Get the cookies on both the client & server
 *
 * @original-author Matthew Mueller
 * @original-repo https://github.com/hoangvvo/next-cookies
 * @license MIT
 */`,
    };
  },
});
