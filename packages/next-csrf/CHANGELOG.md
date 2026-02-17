# @opensourceframework/next-csrf

## 0.2.5

### Patch Changes

- 9bbe919: fix: resolve code quality issues across multiple packages
  - react-a11y-utils: rename CSSProperties to A11yCSSProperties to avoid shadowing React's type
  - seeded-rng: add error logging in catch block instead of silently swallowing errors
  - next-csrf: return null for missing cookies (instead of empty string) to distinguish from empty values
  - next-csrf: fix HttpError constructor to have proper default status value
  - next-csrf: add @returns type info to nextCsrf() function JSDoc

## 0.2.4

### Patch Changes

- Initial release of @opensourceframework/next-csrf - a maintained fork of the archived next-csrf package.

  This fork provides:
  - Continued maintenance for the original next-csrf package by Juan Olvera
  - Next.js 14-16 support
  - Full TypeScript support with improved type definitions
  - Modern build tooling (tsup, vitest)
  - CSRF protection using the Synchronizer Token Pattern

  The original next-csrf package was last updated in April 2023. This fork ensures continued support for Next.js applications requiring CSRF protection.

## 0.0.1

### Patch Changes

- Forked from `next-csrf`
- Initial release under `@opensourceframework` scope
- Added TypeScript types
- Updated dependencies to latest versions

---

## Historical Changelog

The following will be preserved from the original package:

[Original changelog content will be added when forking]
