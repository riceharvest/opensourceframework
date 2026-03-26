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
 * @opensourceframework/next-whatsapp
 * WhatsApp Web.js integration for Next.js applications
 * 
 * Dependencies:
 * - whatsapp-web.js
 * - qrcode
 * 
 * @license MIT
 */`,
    };
  },
});