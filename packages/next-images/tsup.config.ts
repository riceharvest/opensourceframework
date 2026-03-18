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
  external: [],
  footer(ctx) {
    if (ctx.format === 'cjs') {
      return { js: 'if (module.exports.default) module.exports = module.exports.default;' }
    }
    return {}
  },
});