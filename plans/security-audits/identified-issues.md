# Security Audit Summary & Identified Issues

This report summarizes the security audit performed on March 14, 2026. The focus was on identifying vulnerabilities in the dependency graph of the OpenSource Framework monorepo.

## Summary of Findings

| Severity | Count | Primary Drivers |
|----------|-------|-----------------|
| Critical | 2     | `undici` (SSRF/DoS), `next` (Legacy versions) |
| High     | 5     | `undici` (WebSocket DoS), `yauzl` (Zip slip) |
| Moderate | 9+    | `next` (Server Actions DoS), `cross-spawn` |
| Low      | 2+    | Miscellaneous dev-dependency issues |

## Identified Issues (To be Addressed)

### 1. [CRITICAL] `undici` Uncontrolled Resource Consumption (CVE-2026-2581)
- **Context:** Affects any package using `undici` via `next` or other fetch-related utilities.
- **Vulnerability:** Uncontrolled resource consumption in deduplication handler can lead to process OOM and Denial of Service.
- **Affected Packages:** Root monorepo, `docs`, `showcase`, and several internal packages.
- **Recommended Action:** Upgrade `undici` to `7.24.0+`.

### 2. [HIGH] `undici` WebSocket Memory Exhaustion (CVE-2026-1526)
- **Context:** Found in `jsdom` used by `vitest` for component testing.
- **Vulnerability:** Unbounded memory consumption during permessage-deflate decompression can crash the test runner or CI agent.
- **Affected Packages:** All packages using `vitest` with `jsdom` environment.
- **Recommended Action:** Update `vitest` and `jsdom` to versions that pull in patched `undici`.

### 3. [MODERATE] `next` Server Actions Denial of Service (GHSA-7m27-7ghc-44w9)
- **Context:** Several packages and the `docs`/`showcase` apps use Next.js 15.1.0 or 14.2.24.
- **Vulnerability:** Attackers can leave Server Action requests hanging, exhausting server resources.
- **Affected Packages:** `docs`, `showcase`, `next-auth`.
- **Recommended Action:** Ensure all Next.js 15 projects are on `15.1.2+` and Next.js 14 projects are on `14.2.21+`.

### 4. [HIGH] `yauzl` Zip Slip Vulnerability
- **Context:** Found in `puppeteer` dependency chain used for some E2E tests.
- **Vulnerability:** Path traversal during zip extraction.
- **Affected Packages:** `next-transpile-modules`.
- **Recommended Action:** Audit and update `puppeteer` or replace `yauzl` if possible.

## Next Steps for Security Hardening
- [ ] Implement automated `pnpm audit` check in CI that fails on High/Critical.
- [ ] Schedule regular dependency updates via Renovate or Dependabot.
- [ ] Replace or patch vulnerable legacy dependencies in abandoned forks.
