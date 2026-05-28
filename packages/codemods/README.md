# @opensourceframework/codemods

Codemods for migrating imports and usage from original packages to their maintained OpenSource Framework replacements.

## Installation

```bash
pnpm add -D @opensourceframework/codemods
# or
npm install --save-dev @opensourceframework/codemods
```

## CLI

Run the `next-seo` migration against a file or directory:

```bash
pnpm exec osf-codemod next-seo ./src
# or
npx osf-codemod next-seo ./src
```

The transform rewrites `next-seo` ESM imports and CommonJS `require()` calls to `@opensourceframework/next-seo`.

## Programmatic API

```ts
import { nextSeoImport } from '@opensourceframework/codemods';
```
