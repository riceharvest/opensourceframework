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
  external: ['whatsapp-web.js', 'qrcode'],
  esbuildOptions(options) {
    options.banner = {
      js: `/**
 * @opensourceframework/next-whatsapp
 * WhatsApp integration for Next.js applications using whatsapp-web.js
 *
 * Extracted from the itsalive project
 * @license MIT
 */`,
    };
  },
});
