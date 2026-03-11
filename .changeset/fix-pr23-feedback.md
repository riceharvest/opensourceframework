---
"@opensourceframework/next-csrf": minor
"@opensourceframework/next-auth": patch
"@opensourceframework/critters": patch
"@opensourceframework/next-cookies": patch
"@opensourceframework/next-pwa": patch
"@opensourceframework/next-images": patch
"@opensourceframework/next-optimized-images": patch
"@opensourceframework/next-compose-plugins": minor
"@opensourceframework/next-transpile-modules": minor
---

- **next-csrf**: Added App Router support with `verifyCsrfToken` and automated tests.
- **next-auth**: Migrated client tests to Vitest and MSW v2, resolving CI regressions and modernization requirements.
- **critters**: Fixed security vulnerabilities and functional bugs, and cleaned up source files.
- **next-cookies**: Fixed `useCookies` state update issues and added comprehensive unit tests.
- **next-pwa**: Improved test discoverability and added E2E test scripts.
- **next-images / next-optimized-images**: Formally marked as deprecated.
- **next-compose-plugins**: Added support for async plugin functions and async `next.config.js` for Next.js 16 compatibility.
- **next-transpile-modules**: Added support for Next.js 13+ native `transpilePackages` for better performance and Turbopack compatibility.
