import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts', 'src/client.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  external: ['next', 'react'],
});