import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/node.ts', 'src/edge.ts', 'src/express.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  treeshake: true,
  external: ['next', 'regexparam'],
  esbuildOptions(options) {
    options.banner = {
      js: `/**
 * @opensourceframework/next-connect
 * The method routing and middleware layer for Next.js (and many others)
 * 
 * @original-author Hoang Vo
 * @original-repo https://github.com/hoangvvo/next-connect
 * @license MIT
 */`,
    };
  },
});
