import { defineConfig } from 'tsup';
import path from 'path';
import fs from 'fs';

export default defineConfig({
  entry: {
    index: 'index.js',
  },
  format: ['cjs', 'esm'],
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: false,
  external: [
    'next',
    'webpack',
    'webpack/**',
    'babel-loader',
    'clean-webpack-plugin',
    'globby',
    'terser-webpack-plugin',
    'workbox-webpack-plugin',
    'workbox-window',
  ],
  banner: {
    js: `/**
 * @opensourceframework/next-pwa
 * Zero config PWA plugin for Next.js with Turbopack compatibility
 *
 * @original-author Shadow Walker
 * @original-repo https://github.com/shadowwalker/next-pwa
 * @license MIT
 */`,
  },
  noExternal: [],
  esbuildOptions(options) {
    options.platform = 'node';
    options.alias = {
      '~': path.resolve(__dirname, './'),
    };
  },
  onSuccess: async () => {
    const filesToCopy = [
      'register.js',
      'fallback.js',
      'cache.js',
      'build-custom-worker.js',
      'build-fallback-worker.js',
    ];

    for (const file of filesToCopy) {
      const src = path.join(process.cwd(), file);
      const dest = path.join(process.cwd(), 'dist', file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
      }
    }
  },
});
