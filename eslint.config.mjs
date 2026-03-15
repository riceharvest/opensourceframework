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
    files: ["**/*.{js,mjs,cjs,ts,tsx,jsx}"],
    languageOptions: { globals: { ...globals.node, ...globals.es2021 } },
  },
  {
    files: ["**/examples/**/*.{js,mjs,cjs,ts,tsx,jsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.es2021 } },
  },
  {
    files: ["**/www/**/*.{js,mjs,cjs,ts,tsx,jsx}"],
    languageOptions: { globals: { ...globals.browser, ...globals.es2021 } },
  },
  {
    files: ["packages/next-pwa/**/*.{js,mjs,cjs,ts,tsx,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.serviceworker,
        ...globals.es2021,
        __PWA_START_URL__: "readonly",
        __PWA_SW__: "readonly",
        __PWA_SCOPE__: "readonly",
        __PWA_ENABLE_REGISTER__: "readonly",
        __PWA_CACHE_ON_FRONT_END_NAV__: "readonly",
        __PWA_RELOAD_ON_ONLINE__: "readonly",
      },
    },
  },
  {
    files: [
      "packages/next-auth/src/client/**/*.{js,mjs,cjs,ts,tsx,jsx}",
      "packages/next-auth/www/**/*.{js,mjs,cjs,ts,tsx,jsx}",
      "packages/next-auth/app/pages/**/*.{js,mjs,cjs,ts,tsx,jsx}",
    ],
    ignores: [
      "packages/next-auth/app/pages/api/**/*.{js,mjs,cjs,ts,tsx,jsx}",
    ],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2021,
      },
    },
  },
  {
    files: ["packages/react-virtualized/**/*.{js,mjs,cjs,ts,tsx,jsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node,
        ...globals.es2021,
        vi: "readonly",
        jest: "readonly",
        describe: "readonly",
        it: "readonly",
        test: "readonly",
        expect: "readonly",
        beforeEach: "readonly",
        afterEach: "readonly",
        HTMLElement: "readonly",
        HTMLInputElement: "readonly",
        Element: "readonly",
      },
    },
    rules: {
      "no-undef": "off",
      "no-redeclare": "off",
      "no-irregular-whitespace": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: [
      "**/*.{test,spec}.{js,mjs,cjs,ts,tsx,jsx}",
      "**/test/**/*.{js,mjs,cjs,ts,tsx,jsx}",
      "**/__tests__/**/*.{js,mjs,cjs,ts,tsx,jsx}",
    ],
    plugins: { jest: jestPlugin },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        ...globals.es2021,
      },
    },
    rules: {
      "jest/no-try-expect": "off",
      "jest/no-conditional-expect": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  {
    files: [
      "**/*.{test,spec}.{js,mjs,cjs,ts,tsx,jsx}",
      "**/test/**/*.{js,mjs,cjs,ts,tsx,jsx}",
      "**/__tests__/**/*.{js,mjs,cjs,ts,tsx,jsx}",
    ],
    languageOptions: {
      globals: {
        vi: "readonly",
        spyOn: "readonly",
      },
    },
  },
  {
    ignores: [
      "**/node_modules/",
      "**/dist/",
      "**/coverage/",
      "**/package-lock.json",
      "**/pnpm-lock.yaml",
      "**/.next/",
      "packages/next-pwa/test-app/public/service-worker.js",
    ],
  },
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-require-imports": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-unused-expressions": "off",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-wrapper-object-types": "off",
      "@typescript-eslint/no-unsafe-function-type": "off",
      "no-unused-expressions": "off",
      "@typescript-eslint/triple-slash-reference": "off",
      "@typescript-eslint/prefer-as-const": "off",
    },
  },
  {
    files: [
      "**/*.{test,spec}.{js,mjs,cjs,ts,tsx,jsx}",
      "**/test/**/*.{js,mjs,cjs,ts,tsx,jsx}",
      "**/__tests__/**/*.{js,mjs,cjs,ts,tsx,jsx}",
    ],
    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  {
    files: ["packages/next-pwa/fallback.js"],
    rules: {
      "no-fallthrough": "off",
    },
  },
  {
    files: ["packages/react-virtualized/**/*.{js,mjs,cjs,ts,tsx,jsx}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "no-setter-return": "off",
    },
  },
);
