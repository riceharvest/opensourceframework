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

- 8d7f5c3: Initial release - React accessibility utilities

  Implementation of accessibility utilities for React applications with:
  - ARIA attribute helpers and type definitions
  - Focus management utilities
  - Screen reader announcement helpers
  - Keyboard navigation support
  - TypeScript support with full type definitions
  - Comprehensive test suite

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

- Initial release of @opensourceframework/react-a11y-utils - React accessibility utility functions and hooks.

  Features:
  - ARIA prop factories for common patterns (disclosure, toggle, selection)
  - Screen reader utilities (srOnly, srOnlyFocusable)
  - Live region helpers for dynamic content announcements
  - Form field accessibility props
  - Full TypeScript support with ARIA attribute types
  - Zero dependencies
  - WCAG compliant
  - Full test coverage

- Initial release of new open-source packages extracted from Next.js projects

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.1] - 2026-02-15

### Added

- Initial release
- Screen reader utilities (`srOnly`, `srOnlyFocusable`)
- Pre-built ARIA props (`decorative`, `disabledProps`, `statusMessageProps`, `alertMessageProps`)
- Factory functions for ARIA props:
  - `createLiveRegion` - for live region announcements
  - `createSkipLinkProps` - for skip link navigation
  - `createDisclosureProps` - for expand/collapse patterns
  - `createPressedProps` - for toggle buttons
  - `createSelectedProps` - for selectable elements
  - `createCheckedProps` - for checkboxes
  - `createDialogTriggerProps` - for dialog/modal triggers
  - `createFormFieldProps` - for form field accessibility
  - `createDescribedByProps` - for aria-describedby
  - `createLabelledByProps` - for aria-labelledby
  - `mergeA11yProps` - for combining props
- Full TypeScript support with comprehensive ARIA attribute types
- Comprehensive test suite
