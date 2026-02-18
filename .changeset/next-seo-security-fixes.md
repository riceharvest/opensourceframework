---
"@opensourceframework/next-seo": patch
---

Fixed React 18 peer dependency compatibility and upgraded Next.js to 15.5.10 to address security vulnerabilities (GHSA-h25m-26qc-wcjf, GHSA-9qr9-h5gf-34mp, GHSA-mwv6-3258-q52c, GHSA-9g9p-9gw9-jx7f).

- Pinned React to ^18.2.0 in devDependencies to match peer dependencies
- Upgraded Next.js from 15.3.2 to 15.5.10 in both main package and example app
- All 539 unit tests pass
