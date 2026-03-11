---
"@opensourceframework/next-csrf": minor
"@opensourceframework/next-auth": patch
"@opensourceframework/critters": patch
"@opensourceframework/next-cookies": patch
"@opensourceframework/next-pwa": patch
"@opensourceframework/next-images": patch
"@opensourceframework/next-optimized-images": patch
---

- **next-csrf**: Added App Router support with `verifyCsrfToken` and automated tests.
- **next-auth**: Migrated client tests to Vitest and MSW v2, resolving CI regressions and modernization requirements.
- **critters**: Fixed security vulnerabilities and functional bugs, and cleaned up source files.
- **next-cookies**: Fixed `useCookies` state update issues and added comprehensive unit tests.
- **next-pwa**: Improved test discoverability and added E2E test scripts.
- **next-images / next-optimized-images**: Formally marked as deprecated.
