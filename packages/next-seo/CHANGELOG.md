# next-seo

## 7.3.5

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

## 7.3.1

### Patch Changes

- e700978: Fixed React 18 peer dependency compatibility and upgraded Next.js to 15.5.10 to address security vulnerabilities (GHSA-h25m-26qc-wcjf, GHSA-9qr9-h5gf-34mp, GHSA-mwv6-3258-q52c, GHSA-9g9p-9gw9-jx7f).
  - Pinned React to ^18.2.0 in devDependencies to match peer dependencies
  - Upgraded Next.js from 15.3.2 to 15.5.10 in both main package and example app
  - All 539 unit tests pass

## 7.3.0

### Minor Changes

- Initial fork from garmeeh/next-seo with Next.js 15+ compatibility and TypeScript improvements

## 7.2.0

### Minor Changes

- 28c684e: Add `review` and `aggregateRating` props to OrganizationJsonLd component, matching the existing support in LocalBusinessJsonLd. Both are direct Schema.org Organization properties processed using shared utilities.

## 7.1.0

### Minor Changes

- d412e2b: Add HowToJsonLd component for structured data support
  - New `HowToJsonLd` component following Schema.org HowTo specification
  - Support for HowToStep, HowToSection, HowToDirection, and HowToTip types
  - HowToSupply and HowToTool for materials and equipment
  - Duration properties (prepTime, performTime, totalTime) in ISO 8601 format
  - estimatedCost as string or MonetaryAmount object
  - yield as string or QuantitativeValue
  - Video support via VideoObject

## 7.0.1

### Patch Changes

- 1db3648: Add JSDoc comment to internal type guard function
