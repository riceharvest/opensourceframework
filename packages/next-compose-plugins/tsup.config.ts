import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.js'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['next'],
  splitting: false,
  footer(ctx) {
    if (ctx.format === 'cjs') {
      return { js: 'if (module.exports.default) module.exports = module.exports.default;' }
    }
    return {}
  },
})
