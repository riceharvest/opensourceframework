# Change Log

## 0.7.1

### Patch Changes

- 9f75983: fix: update pnpm lockfile and fix workspace link setup for next-mdx
- 4ebdbe8: fix: resolve critical security vulnerabilities in dependencies

## 0.7.0

### Minor Changes

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

### Patch Changes

- 7f495f3: # Monorepo Modernization (Next.js 16 & React 19)

  Comprehensive modernization of all packages in the monorepo to support the latest industry standards.
  - **Compatibility**: Verified all packages against **Next.js 16** and **React 19**.
  - **next-auth**: Refactored URL handling to a structured `url` object and replaced the legacy `oauth` package with a native `fetch`-based implementation for OAuth 2.x.
  - **next-session**: Added native Web API support (`getWebSession`) for standard `Request`/`Response` objects, improving compatibility with Next.js Middleware and App Router.
  - **critters**: Improved animation name extraction and implemented robust multi-format font preloading.
  - **Reliability**: Added safety guards to `next-pwa` build process and refined `safeHref` sanitization in `critters`.
  - **Infrastructure**: Updated `llms.txt` for better AI discovery and added missing `LICENSE` files to several packages.

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.6.2](https://github.com/shadcn/next-mdx/compare/next-mdx@0.6.1...next-mdx@0.6.2) (2021-11-23)

### Bug Fixes

- rename repo links ([33fda7e](https://github.com/shadcn/next-mdx/commit/33fda7e7f8f901c80dba871cb6c1ae7874796574))
- update license link ([d8c4ca1](https://github.com/shadcn/next-mdx/commit/d8c4ca13d30ed88fd6dada6b7e1d69d206e15607))

## [0.6.1](https://github.com/shadcn/next-mdx/compare/next-mdx@0.6.0...next-mdx@0.6.1) (2021-07-07)

**Note:** Version bump only for package next-mdx

# [0.6.0](https://github.com/shadcn/next-mdx/compare/next-mdx@0.5.1...next-mdx@0.6.0) (2021-03-29)

### Features

- **next-mdx-doc:** add next-mdx-doc ([0e3dce0](https://github.com/shadcn/next-mdx/commit/0e3dce0d7f8accec6359f1dc0e2bfb03026d9890))

## [0.5.1](https://github.com/shadcn/next-mdx/compare/next-mdx@0.5.0...next-mdx@0.5.1) (2021-03-26)

### Bug Fixes

- **next-mdx:** sort getAllNodes ([e2df46b](https://github.com/shadcn/next-mdx/commit/e2df46b20db13b2ee5e132316b88138ebb961f10))

# [0.5.0](https://github.com/shadcn/next-mdx/compare/next-mdx@0.4.0...next-mdx@0.5.0) (2021-03-26)

### Features

- **next-mdx:** add support for optional catch-all routes ([fdce04e](https://github.com/shadcn/next-mdx/commit/fdce04eaa3dbbbca2e1fe36c9538ec23a6b3c693))

# [0.4.0](https://github.com/shadcn/next-mdx/compare/next-mdx@0.3.0...next-mdx@0.4.0) (2021-03-18)

### Features

- make basePath optional ([6c5328c](https://github.com/shadcn/next-mdx/commit/6c5328c651cd62d59f2cafe5a323b7f2a137aa75))

# [0.3.0](https://github.com/shadcn/next-mdx/compare/next-mdx@0.2.4...next-mdx@0.3.0) (2021-03-17)

**Note:** Version bump only for package next-mdx

## [0.2.4](https://github.com/shadcn/next-mdx/compare/next-mdx@0.2.3...next-mdx@0.2.4) (2021-03-08)

### Bug Fixes

- **next-mdx:** remove unused dependencies ([d9f2461](https://github.com/shadcn/next-mdx/commit/d9f2461f6513d7e47b247f416514fb57ffe7183d))

## [0.2.3](https://github.com/shadcn/next-mdx/compare/next-mdx@0.2.2...next-mdx@0.2.3) (2021-03-04)

**Note:** Version bump only for package next-mdx

## [0.2.2](https://github.com/shadcn/next-mdx/compare/next-mdx@0.2.1...next-mdx@0.2.2) (2021-03-03)

### Bug Fixes

- update files in package.json ([c56fbaf](https://github.com/shadcn/next-mdx/commit/c56fbaf2e27225555996b8968437c40c644104f4))

## [0.2.1](https://github.com/shadcn/next-mdx/compare/next-mdx@0.2.0...next-mdx@0.2.1) (2021-03-03)

**Note:** Version bump only for package next-mdx

# [0.2.0](https://github.com/shadcn/next-mdx/compare/next-mdx@0.1.0...next-mdx@0.2.0) (2021-02-26)

### Features

- add server and client code ([fd192a0](https://github.com/shadcn/next-mdx/commit/fd192a0dbeb9d94c0b3890c1751788560fd07c8d))

# 0.1.0 (2021-02-26)

### Features

- initial commit ([d789874](https://github.com/reflexjs/reflexjs/commit/d789874a84f9f6fdd197133be32b4d8bf8fa95dc))
