import {defineConfig} from 'tsup';

export default defineConfig([
  {
    entry: ['source/index.js'],
    format: 'cjs',
    dts: false,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-dom', 'react-lifecycles-compat', 'dom-helpers'],
    outDir: 'dist/commonjs',
    env: {NODE_ENV: 'commonjs'},
  },
  {
    entry: ['source/index.js'],
    format: 'esm',
    dts: false,
    sourcemap: true,
    clean: false,
    external: ['react', 'react-dom', 'react-lifecycles-compat', 'dom-helpers'],
    outDir: 'dist/es',
    env: {NODE_ENV: 'es'},
  },
  {
    entry: ['source/index.js'],
    format: 'umd',
    dts: false,
    sourcemap: true,
    clean: false,
    external: ['react', 'react-dom'],
    outDir: 'dist/umd',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    env: {NODE_ENV: 'rollup'},
  },
]);
