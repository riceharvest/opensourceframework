# Changelog

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
