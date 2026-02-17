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
  // External dependencies that shouldn't be bundled
  external: ['file-loader', 'url-loader', 'webpack'],
  onSuccess: async () => {
    // Copy global.d.ts to dist folder for TypeScript declarations
    const fs = await import('fs');
    const path = await import('path');
    const srcPath = path.join(process.cwd(), 'src', 'global.d.ts');
    const destPath = path.join(process.cwd(), 'dist', 'global.d.ts');
    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
    }
  },
});