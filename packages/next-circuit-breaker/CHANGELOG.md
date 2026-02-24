# Changelog

## 0.2.1

### Patch Changes

- Modernization and stabilization fixes:
  - Standardized scripts and CI/CD lockfiles
  - Fixed lint rules and CI/CD unblocking
  - Added llms.txt for AI-First Discovery
  - Include llms.txt in published files

## 0.2.0

### Minor Changes

- 8d7f5c3: Initial release - Circuit breaker pattern for API routes

  Implementation of the circuit breaker pattern for Next.js API routes with:
  - Configurable failure thresholds and timeouts
  - Automatic circuit state management (closed, open, half-open)
  - Fallback support for graceful degradation
  - TypeScript support with full type definitions
  - Comprehensive test suite

## 0.1.0

### Minor Changes

- Initial release of @opensourceframework/next-circuit-breaker - circuit breaker pattern implementation for Next.js API routes.

  Features:
  - Circuit breaker pattern to prevent cascading failures
  - Next.js API route integration with `withApiCircuitBreaker`
  - Three states: CLOSED, OPEN, HALF_OPEN
  - Configurable failure and success thresholds
  - State callbacks for monitoring and logging
  - Zero dependencies, TypeScript native
  - Full test coverage

- Initial release of new open-source packages extracted from Next.js projects

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-02-15

### Added

- Initial release
- `CircuitBreaker` class with CLOSED, OPEN, and HALF_OPEN states
- Configurable failure and success thresholds
- Configurable timeout for automatic recovery
- Callbacks for state transitions (`onOpen`, `onClose`, `onHalfOpen`)
- `withCircuitBreaker` helper function for wrapping async functions
- `withApiCircuitBreaker` helper for Next.js API routes
- State inspection methods (`getState`, `getStats`, `isOpen`, `isClosed`, `isHalfOpen`)
- Manual control methods (`trip`, `reset`)
- Full TypeScript support with exported types
- Comprehensive test suite
