import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const jestPlugin = require('eslint-plugin-jest');

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ['**/*.{js,mjs,cjs,ts,tsx,jsx}'],
    plugins: {
      jest: jestPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
        ...globals.es2021,
        'vi': 'readonly',
        'spyOn': 'readonly',
      },
    },
  },
  {
    ignores: [
      '**/node_modules/',
      '**/dist/',
      '**/coverage/',
      '**/package-lock.json',
      '**/pnpm-lock.yaml',
      '**/.next/',
      '**/examples/'
    ]
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-this-alias': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
      'no-undef': 'warn',
      'no-unreachable': 'warn',
      'no-unused-expressions': 'off',
      'no-fallthrough': 'warn',
      'no-redeclare': 'warn',
      'no-setter-return': 'warn',
      'no-irregular-whitespace': 'warn',
      'camelcase': 'warn',
      'jest/no-try-expect': 'off',
      'jest/no-conditional-expect': 'off',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@typescript-eslint/prefer-as-const': 'off'
    }
  }
);
