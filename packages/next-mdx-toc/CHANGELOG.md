# Change Log

## 0.1.5

### Patch Changes

- 9f75983: fix: update pnpm lockfile and fix workspace link setup for next-mdx
- 4ebdbe8: fix: resolve critical security vulnerabilities in dependencies
- Updated dependencies [9f75983]
- Updated dependencies [4ebdbe8]
  - @opensourceframework/next-mdx@0.7.1

## 0.1.4

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

- Updated dependencies [7f495f3]
- Updated dependencies [7f495f3]
  - @opensourceframework/next-mdx@0.7.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.1.3](https://github.com/shadcn/next-mdx/compare/next-mdx-toc@0.1.2...next-mdx-toc@0.1.3) (2021-11-23)

### Bug Fixes

- rename repo links ([33fda7e](https://github.com/shadcn/next-mdx/commit/33fda7e7f8f901c80dba871cb6c1ae7874796574))

## [0.1.2](https://github.com/shadcn/next-mdx/compare/next-mdx-toc@0.1.1...next-mdx-toc@0.1.2) (2021-07-07)

**Note:** Version bump only for package next-mdx-toc

## [0.1.1](https://github.com/shadcn/next-mdx/compare/next-mdx-toc@0.1.0...next-mdx-toc@0.1.1) (2021-03-29)

### Bug Fixes

- **next-mdx-toc:** add next-mdx to dependencies ([d1a8e0a](https://github.com/shadcn/next-mdx/commit/d1a8e0a0bf38b17bc392fca448b218ceba6bf273))

# 0.1.0 (2021-03-29)

### Features

- **next-mdx-doc:** add next-mdx-doc ([0e3dce0](https://github.com/shadcn/next-mdx/commit/0e3dce0d7f8accec6359f1dc0e2bfb03026d9890))
