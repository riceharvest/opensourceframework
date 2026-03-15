---
"@opensourceframework/critters": patch
"@opensourceframework/next-auth": patch
"@opensourceframework/next-circuit-breaker": patch
"@opensourceframework/next-compose-plugins": patch
"@opensourceframework/next-connect": patch
"@opensourceframework/next-cookies": patch
"@opensourceframework/next-csrf": patch
"@opensourceframework/next-images": patch
"@opensourceframework/next-iron-session": patch
"@opensourceframework/next-json-ld": patch
"@opensourceframework/next-mdx": patch
"@opensourceframework/next-mdx-toc": patch
"@opensourceframework/next-optimized-images": patch
"@opensourceframework/next-pwa": patch
"@opensourceframework/next-seo": patch
"@opensourceframework/next-session": patch
"@opensourceframework/next-transpile-modules": patch
"@opensourceframework/react-a11y-utils": patch
"@opensourceframework/react-query-auth": patch
"@opensourceframework/react-virtualized": patch
"@opensourceframework/seeded-rng": patch
---

# Monorepo Modernization (Next.js 16 & React 19)

Comprehensive modernization of all packages in the monorepo to support the latest industry standards.

- **Compatibility**: Verified all packages against **Next.js 16** and **React 19**.
- **next-auth**: Refactored URL handling to a structured `url` object and replaced the legacy `oauth` package with a native `fetch`-based implementation for OAuth 2.x.
- **next-session**: Added native Web API support (`getWebSession`) for standard `Request`/`Response` objects, improving compatibility with Next.js Middleware and App Router.
- **critters**: Improved animation name extraction and implemented robust multi-format font preloading.
- **Reliability**: Added safety guards to `next-pwa` build process and refined `safeHref` sanitization in `critters`.
- **Infrastructure**: Updated `llms.txt` for better AI discovery and added missing `LICENSE` files to several packages.
