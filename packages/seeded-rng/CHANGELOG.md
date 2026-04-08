# Changelog

## 0.2.2

### Patch Changes

- 4ebdbe8: fix: resolve critical security vulnerabilities in dependencies

## 0.2.1

### Patch Changes

- 7f495f3: - **next-csrf**: Added App Router support with `verifyCsrfToken` and automated tests.
  - **next-auth**: Migrated client tests to Vitest and MSW v2, resolving CI regressions and modernization requirements.
  - **critters**: Fixed security vulnerabilities and functional bugs, and cleaned up source files.
  - **next-cookies**: Fixed `useCookies` state update issues and added comprehensive unit tests.
  - **next-pwa**: Improved test discoverability and added E2E test scripts.
  - **next-images**: Repositioned as a supported compatibility-first fork, removed deprecation metadata, refreshed docs, and added regression tests for webpack behavior.
  - **next-optimized-images**: Replaced the vulnerable `imagemin`/`file-type` path with an internal optimizer loader while keeping the compatibility-focused API intact.
  - **next-compose-plugins**: Added support for async plugin functions and async `next.config.js` for Next.js 16 compatibility.
  - **next-transpile-modules**: Added support for Next.js 13+ native `transpilePackages` for better performance and Turbopack compatibility.
  - **next-mdx**: Modernized with current `next-mdx-remote` support, improved config resolution, and removed the prior security advisory.
  - **next-mdx-toc**: Migrated to Vitest and verified compatibility with modernized `next-mdx`.
  - **react-virtualized**: Stabilized the Vitest/jsdom harness, restored missing test dependencies, and fixed mount-time scrolling regressions.
  - **Package metadata**: Published packages now point to the canonical monorepo metadata and include `llms.txt` in tarballs where package-level guidance exists.
- 7f495f3: # Monorepo Modernization (Next.js 16 & React 19)

  Comprehensive modernization of all packages in the monorepo to support the latest industry standards.
  - **Compatibility**: Verified all packages against **Next.js 16** and **React 19**.
  - **next-auth**: Refactored URL handling to a structured `url` object and replaced the legacy `oauth` package with a native `fetch`-based implementation for OAuth 2.x.
  - **next-session**: Added native Web API support (`getWebSession`) for standard `Request`/`Response` objects, improving compatibility with Next.js Middleware and App Router.
  - **critters**: Improved animation name extraction and implemented robust multi-format font preloading.
  - **Reliability**: Added safety guards to `next-pwa` build process and refined `safeHref` sanitization in `critters`.
  - **Infrastructure**: Updated `llms.txt` for better AI discovery and added missing `LICENSE` files to several packages.

## 0.2.1

### Patch Changes

- Modernization and stabilization fixes:
  - Standardized scripts and CI/CD lockfiles
  - Fixed lint rules and CI/CD unblocking
  - Added llms.txt for AI-First Discovery
  - Include llms.txt in published files

## 0.2.0

### Minor Changes

- 8d7f5c3: Initial release - Seeded random number generator

  Implementation of seeded random number generation with:
  - Multiple RNG algorithms (xorshift128+, PCG, Mulberry32)
  - Deterministic random sequences from seed values
  - Support for generating numbers, integers, and booleans
  - Cryptographically secure random seed generation
  - TypeScript support with full type definitions
  - Comprehensive test suite including security tests

## 0.1.1

### Patch Changes

- 9bbe919: fix: resolve code quality issues across multiple packages
  - react-a11y-utils: rename CSSProperties to A11yCSSProperties to avoid shadowing React's type
  - seeded-rng: add error logging in catch block instead of silently swallowing errors
  - next-csrf: return null for missing cookies (instead of empty string) to distinguish from empty values
  - next-csrf: fix HttpError constructor to have proper default status value
  - next-csrf: add @returns type info to nextCsrf() function JSDoc

## 0.1.0

### Minor Changes

- Initial release of @opensourceframework/seeded-rng - seeded random number generator for reproducible randomness.

  Features:
  - Deterministic randomness with configurable seeds
  - Reproducible sequences for testing, debugging, and replays
  - Game development utilities (weighted picks, shuffles)
  - Testing utilities for deterministic test data
  - Zero dependencies
  - Full TypeScript support
  - Full test coverage

  **Security Notice**: This library is NOT cryptographically secure. Do not use for password generation, cryptographic keys, session tokens, or any security-sensitive operations.

- Initial release of new open-source packages extracted from Next.js projects

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-02-15

### Added

- Initial release
- `SeededRNG` class with Linear Congruential Generator (LCG) algorithm
- Core random number generation methods:
  - `next()` - random float [0, 1)
  - `nextInt(min, max)` - random integer [min, max]
  - `nextFloat(min, max)` - random float [min, max)
  - `chance(probability)` - boolean with probability
- Array utilities:
  - `pick(array)` - random element selection
  - `shuffle(array)` - Fisher-Yates shuffle
  - `weightedPick(items)` - weighted random selection
- Additional utilities:
  - `nextBool(probability?)` - random boolean
  - `nextSign()` - random -1 or 1
  - `nextHex(length)` - random hex string
  - `nextUUID()` - UUID-like string (NOT for real UUIDs)
  - `fork()` - create independent RNG
- State management:
  - `reset()` - reset to initial state
  - `getInitialSeed()` - get initial seed
  - `getCurrentSeed()` - get current state
  - `setSeed(seed)` - set current state
  - `getStats()` - get RNG statistics
- Convenience functions:
  - `createRNG(seed)` - create RNG instance
  - `seededInt(seed, min, max)` - one-shot integer
  - `seededFloat(seed, min, max)` - one-shot float
  - `seededShuffle(seed, array)` - one-shot shuffle
  - `seededPick(seed, array)` - one-shot pick
- Full TypeScript support
- Comprehensive test suite
- Security warnings about cryptographic usage
