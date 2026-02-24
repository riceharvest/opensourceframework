# @opensourceframework/next-cookies

## 2.1.3

### Patch Changes

- Modernization and stabilization fixes:
  - Standardized scripts and CI/CD lockfiles
  - Fixed lint rules and CI/CD unblocking
  - Added llms.txt for AI-First Discovery
  - Include llms.txt in published files

## 2.1.1

### Patch Changes

- e700978: Added comprehensive security-focused test coverage (30 new tests) for cookie handling.

  Security tests include:
  - Cookie injection attack prevention
  - Special characters in cookie values (XSS payloads, unicode, emojis)
  - Large cookie handling (4KB+ values, 50+ cookies)
  - Edge cases (null context, missing headers, malformed cookies)
  - URL encoding edge cases

  All 37 tests pass.

## 2.1.0

### Minor Changes

- 7fd0aa2: Initial fork from hoangvvo/next-cookies with Next.js 15+ compatibility and security audit
