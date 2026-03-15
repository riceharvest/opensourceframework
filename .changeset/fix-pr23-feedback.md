---
"@opensourceframework/next-csrf": minor
"@opensourceframework/next-auth": patch
"@opensourceframework/critters": patch
"@opensourceframework/next-cookies": patch
"@opensourceframework/next-pwa": patch
"@opensourceframework/next-images": patch
"@opensourceframework/next-optimized-images": patch
"@opensourceframework/next-iron-session": patch
"@opensourceframework/next-compose-plugins": minor
"@opensourceframework/next-connect": patch
"@opensourceframework/next-transpile-modules": minor
"@opensourceframework/next-json-ld": patch
"@opensourceframework/next-mdx": minor
"@opensourceframework/next-mdx-toc": patch
"@opensourceframework/next-seo": patch
"@opensourceframework/next-session": patch
"@opensourceframework/react-a11y-utils": patch
"@opensourceframework/react-query-auth": patch
"@opensourceframework/react-virtualized": patch
"@opensourceframework/seeded-rng": patch
"@opensourceframework/next-circuit-breaker": patch
---

- **next-csrf**: Added App Router support with `verifyCsrfToken` and automated tests.
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
