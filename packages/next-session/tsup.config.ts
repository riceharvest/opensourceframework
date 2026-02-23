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
  external: ['next', 'cookie','nanoid'],
  esbuildOptions(options) {
    options.banner = {
      js: `/**
 * @opensourceframework/{package-name}
 * {brief-description}
 * 
 * @original-author {original-author}
 * @original-repo {original-repo-url}
 * @license {original-license}
 */`,
    };
  },
});
