# @opensourceframework/critters Changelog

## 1.0.0

### Major Changes

- Initial release of @opensourceframework/critters - a maintained fork of the archived Google critters package.

  This fork provides:
  - Continued maintenance and bug fixes for the original critters package
  - Security updates and vulnerability patches
  - Modern build tooling (tsup, vitest)
  - Comprehensive test coverage
  - Full TypeScript support

  The original critters package was archived by GoogleChromeLabs in October 2024. This fork ensures the package remains available and maintained for the 1.5M+ weekly downloads the original package received.

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.26] - 2026-02-15

### Added

- Forked from original `critters` package (v0.0.25) by GoogleChromeLabs
- Full source code implementation ported from original repository
- TypeScript type definitions (`index.d.ts`)
- Comprehensive test suite with Vitest
  - Critical CSS extraction tests
  - Security tests (XSS prevention, path traversal protection)
  - Preload strategy tests
  - Options handling tests
- Test fixtures for HTML and CSS processing
- Modern build configuration with tsup for ESM and CJS support

### Changed

- Package namespace changed to `@opensourceframework/critters`
- License changed to Apache-2.0 (matching original)
- Updated author attribution to include original authors
- Updated dependencies to latest compatible versions:
  - chalk: ^4.1.0
  - css-select: ^5.1.0
  - css-what: ^6.1.0
  - dom-serializer: ^2.0.0
  - domhandler: ^5.0.3
  - htmlparser2: ^8.0.2
  - postcss: ^8.4.38
  - postcss-media-query-parser: ^0.2.3

### Documentation

- Comprehensive README with API documentation
- Attribution to original authors (GoogleChromeLabs)
- Migration guide from original package
- Usage examples for Webpack and Next.js

### Security

- Path traversal protection maintained
- HTML entity encoding preserved
- CSS injection prevention
- Media query validation

---

## Original Package History

For the history of the original package (v0.0.25 and earlier), please see the
[original repository](https://github.com/GoogleChromeLabs/critters).

### Original Authors

- Jason Miller (developit@google.com)
- Janicklas Ralph (janicklas@google.com)

### Original License

Apache-2.0 © Google LLC
