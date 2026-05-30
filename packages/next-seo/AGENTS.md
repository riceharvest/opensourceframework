# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next SEO is a plugin that makes managing SEO easier in Next.js projects. It's built with TypeScript and provides components for structured data (JSON-LD) and SEO management.

## Critical Rules

You must check these after coming up with a plan
[ ] Your plan adheres to the guide found in @ADDING_NEW_COMPONENTS.md
[ ] Your plan adheres to the guidelines found below

## Development Commands

### Installation

```bash
corepack pnpm@9.6.0 install
```

### Build & Development

```bash
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo dev    # Watch mode with tsup
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo build  # Build library code
```

### Code Quality

```bash
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo lint       # Run ESLint
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo lint:fix   # Fix ESLint issues
corepack pnpm@9.6.0 format                                             # Format with Prettier
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo typecheck  # Type checking with TypeScript
```

### Testing

```bash
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo test             # Run typecheck + lint only
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo test:unit        # Run unit tests with Vitest
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo test:unit:watch  # Watch mode for unit tests
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo coverage         # Generate coverage report
# Requires pnpm build to run first
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo test:e2e     # Run E2E tests with Playwright
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo test:e2e:ui  # Run E2E tests with UI
```

### Example App

```bash
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo example:dev    # Run example app at localhost:3001
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo example:build  # Build example app
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo example:start  # Start example app
```

### Utilities

```bash
corepack pnpm@9.6.0 --filter @opensourceframework/next-seo clean  # Clean build artifacts
```

## Project Architecture

### Core Structure

- **`/src`** - Library source code
  - **`/core`** - Core components like `JsonLdScript`
  - **`/types`** - TypeScript type definitions
  - **`/utils`** - Utility functions like `stringify`
- **`/examples/app-router-showcase`** - Example Next.js app for testing
- **`/tests`** - Test files
  - **`/unit`** - Unit tests (Vitest)
  - **`/e2e`** - E2E tests (Playwright)

### Build Configuration

- **tsup** - For building the library (see `tsup.config.ts`)
- Outputs both CommonJS and ESM formats
- Path alias: `~` maps to `./src`

### Testing Setup

- **Vitest** - Unit testing with React Testing Library
- **Playwright** - E2E testing running against example app on port 3001
- Tests use `~` alias for imports

## Development Notes

1. All library code is in `/src` directory
2. The project uses pnpm workspaces with the example app
3. When developing, the example app auto-starts on port 3001 for E2E tests
4. Lint and format are automatically run on staged files via Husky
5. The library exports both CommonJS and ESM formats with TypeScript definitions
6. When adding a new component ALWAYS refer to the guide found in ADDING_NEW_COMPONENTS.md

## Key Patterns

### @type Optional Pattern

Next SEO provides excellent developer experience by **never requiring developers to manually specify `@type` properties**. This is achieved through intelligent type definitions and process functions.

#### How It Works:

1. **Type Definitions**: Component props use `Omit<Type, "@type">` to make `@type` optional
2. **Process Functions**: Automatically add the correct `@type` based on the input
3. **Flexible Inputs**: Accept strings, objects with/without `@type`, and arrays

#### Example:

```typescript
// Developers can write this:
<ArticleJsonLd
  author="John Doe"  // Simple string
  publisher={{ name: "ACME Corp", logo: "logo.jpg" }}  // No @type needed
/>

// Process functions transform it to valid Schema.org:
{
  author: { "@type": "Person", name: "John Doe" },
  publisher: { "@type": "Organization", name: "ACME Corp", logo: {...} }
}
```

#### Benefits:

- **Better DX**: No need to remember Schema.org type names
- **Less Boilerplate**: Cleaner, more readable code
- **Type Safety**: Full TypeScript support maintained
- **Flexibility**: Still accepts objects with `@type` if provided

#### Implementation Rules:

1. Always use process functions for properties accepting flexible types
2. Never require `@type` in component props
3. Use intelligent detection (e.g., `logo` property → Organization)
4. Provide sensible defaults in process functions

This pattern is fundamental to the library's design and must be maintained in all components.
