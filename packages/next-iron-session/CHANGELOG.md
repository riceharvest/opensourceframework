## 8.0.5

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

## [8.0.0-alpha.0](https://github.com/vvo/iron-session/compare/v6.2.1...v8.0.0-alpha.0) (2023-05-27)

### ⚠ BREAKING CHANGES

- rewrite (#574)

### Features

- rewrite ([#574](https://github.com/vvo/iron-session/issues/574)) ([ecdd626](https://github.com/vvo/iron-session/commit/ecdd6260641cd9a61c671fd18a7ef980148ca76a))

### Bug Fixes

- handle ttl and max-age properly in case of overriden options in save/destroy calls ([3c00b13](https://github.com/vvo/iron-session/commit/3c00b1325079c594930fda82157deec3a70d1dd7))
