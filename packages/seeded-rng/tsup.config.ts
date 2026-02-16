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
 * @opensourceframework/seeded-rng
 * Seeded random number generator for reproducible randomness
 * 
 * ⚠️ WARNING: This is NOT cryptographically secure!
 * Do NOT use for security-sensitive operations like:
 * - Password generation
 * - Cryptographic keys
 * - Session tokens
 * - Any security-related randomness
 * 
 * Use crypto.getRandomValues() or Node.js crypto module instead.
 * 
 * @license MIT
 */`,
    };
  },
});
