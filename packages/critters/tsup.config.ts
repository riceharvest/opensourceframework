import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.js'],
  format: ['cjs', 'esm'],
  dts: false, // types are already in src/index.d.ts
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  treeshake: true,
  external: ['postcss', 'htmlparser2', 'domhandler', 'dom-serializer', 'css-select', 'css-what'],
  esbuildOptions(options) {
    options.banner = {
      js: `/**
 * @opensourceframework/critters
 * Critical CSS inliner
 * 
 * @original-author The Chromium Authors
 * @original-repo https://github.com/GoogleChromeLabs/critters
 * @license Apache-2.0
 */`,
    };
  },
});
