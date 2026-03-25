import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  treeshake: true,
  external: ['react', 'react-dom', 'three', '@react-three/fiber', '@react-three/drei', 'gsap'],
  esbuildOptions(options) {
    options.banner = {
      js: `/**
 * @opensourceframework/react-three-portfolio
 * Three.js/React Three Fiber visual components for portfolios
 * Extracted from gabriel project
 *
 * @license MIT
 */`,
    };
  },
});
