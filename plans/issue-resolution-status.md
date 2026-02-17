# Package Issue Resolution Status

This document audits the issues from original packages and verifies whether our forked/extracted versions address them.

---

## critters (Fork from Google Chrome Labs)

### Original Repository Status

The original `GoogleChromeLabs/critters` repository was **archived on October 25, 2024**. Ownership has been transferred to the Nuxt team, who now maintain it as **[beasties](https://github.com/danielroe/beasties)**.

#### Key Changes in beasties (Official Successor)
| Feature | Description |
|---------|-------------|
| `remote` option | Download and inline remote stylesheets (http://, https://, //) |
| `safeParser` option | PostCSS safe parser for fault-tolerant CSS parsing (handles legacy code with syntax errors) |
| `allowRules` option | Programmatically include specific selectors regardless of DOM matching |
| Vite plugin | Official support via `vite-plugin-beasties` |

### Original Issues (from archived repo)

| Issue | Status in Our Fork | Notes |
|-------|-------------------|-------|
| **Security: XSS via media attributes** | ❌ NOT FIXED | `alert(1)` passes through in media attributes |
| **Security: Script injection via CSS url()** | ❌ NOT FIXED | `</style><script>alert(1)</script>` in CSS url() creates script tags |
| **Security: Script injection via href** | ❌ NOT FIXED | `</script><script>alert(1)</script>` in href creates script tags |
| **Security: HTML entity decoding** | ❌ NOT FIXED | HTML entities inside `<script>` tags are being decoded |
| **Security: onload attribute sanitization** | ❌ NOT FIXED | Malicious `onload="alert(1)"` not being sanitized in noscript fallback |
| CSS selector parsing | ⚠️ PARTIAL | `::part()` pseudo-elements not supported (css-select limitation) |
| Path traversal protection | ✅ FIXED | Our fork properly validates paths are within base directory |

### Our Test Failures (10 total)

#### Security Test Failures (4 tests)

| Test | Issue | Root Cause | Fix Required |
|------|-------|------------|--------------|
| `should not decode HTML entities` | HTML entities in `<script>` tags are decoded | DOM parser behavior | Preserve original entity encoding |
| `should not create a new script tag from embedding additional stylesheets` | CSS url() injection creates script tags | Insufficient CSS content sanitization | Sanitize CSS url() values |
| `should not create a new script tag by ending </script> from href` | Script injection via href attribute | Href not sanitized for script content | Validate href attribute values |
| `should sanitize malicious media queries` | `onload="alert(1)"` preserved in noscript | Event handlers not stripped from attributes | Strip event handlers from all attributes |

#### Functionality Test Failures (6 tests)

| Test | Issue | Root Cause | Fix Required |
|------|-------|------------|--------------|
| `Prevent injection via media attr` | `alert(1)` in media attribute not blocked | Media query validation insufficient | Validate/sanitize media attribute values |
| `handles empty HTML gracefully` | Adds `data-critters-container` unexpectedly | Container attribute added unconditionally | Only add container when processing CSS |
| `handles additionalStylesheets option` | CSS not compressed (`p { color: green; }` vs `p{color:green}`) | Additional stylesheets not processed through same pipeline | Apply CSS compression to additional stylesheets |
| `respects critters:exclude comment` | Exclude comment not working correctly | Comment parsing logic issue | Review comment directive handling |
| `handles preload: swap option` | Missing `rel="preload"` in output | Preload strategy implementation differs from test expectation | Review swap preload implementation |
| `handles preload: js option` | Script tag regex mismatch | Test expects `/<script>/` but output has `<script data-href=...>` | Update test or review JS preload implementation |

### Recommendations for critters

1. **HIGH PRIORITY**: Fix security vulnerabilities before publication
   - Sanitize all user-controllable attributes (media, onload, href)
   - Prevent script injection via CSS content
   - Preserve HTML entity encoding in sensitive contexts

2. **MEDIUM PRIORITY**: Consider merging upstream improvements from beasties
   - `safeParser` option for fault-tolerant parsing
   - `allowRules` option for programmatic selector inclusion
   - `remote` option for remote stylesheet handling

3. **LOW PRIORITY**: Fix functionality test failures
   - Review preload strategy implementations
   - Fix additional stylesheets CSS compression

---

## next-csrf (Original Package)

### Status: ✅ READY

| Metric | Value |
|--------|-------|
| Tests | 19 passed, 0 failed |
| Security | No known vulnerabilities |
| TypeScript | Full type definitions |
| Documentation | Comprehensive JSDoc comments |

### Original Package Reference

This is based on the original `j0lv3r4/next-csrf` package by Juan Olvera.

### Implementation Verification

| Feature | Status | Notes |
|---------|--------|-------|
| Token generation | ✅ Working | Uses crypto for secure token generation |
| Cookie handling | ✅ Working | Secure defaults (httpOnly, sameSite) |
| Token validation | ✅ Working | Synchronizer token pattern |
| Ignored methods | ✅ Working | GET, HEAD, OPTIONS skipped by default |
| Custom error messages | ✅ Working | Configurable error responses |
| TypeScript support | ✅ Working | Full type exports |

### Known Issues

None identified. All tests pass and implementation follows security best practices.

### Recommendations

- Consider adding App Router (Server Actions) support
- Add support for Edge Runtime
- Consider adding rate limiting integration

---

## next-images (Original Package)

### Status: ⚠️ DEPRECATED (Tests Pass)

| Metric | Value |
|--------|-------|
| Tests | 40 passed, 0 failed |
| Security | No known vulnerabilities |
| TypeScript | Full type definitions |
| Deprecation | Marked as deprecated |

### Original Package Reference

This is based on the original `twopluszero/next-images` package by Aref Aslani.

### Deprecation Notice

This package is **deprecated**. Next.js 10+ includes a built-in Image component that provides:
- Automatic image optimization
- Lazy loading
- Better performance
- Responsive images
- Placeholder blur

### Implementation Verification

| Feature | Status | Notes |
|---------|--------|-------|
| url-loader integration | ✅ Working | Inlines small images as Base64 |
| file-loader fallback | ✅ Working | Large images served as files |
| Dynamic asset prefix | ✅ Working | Runtime asset prefix resolution |
| Custom file extensions | ✅ Working | Configurable extensions |
| Exclude patterns | ✅ Working | Regex/string exclude support |
| TypeScript support | ✅ Working | Full type exports |

### Known Issues

None identified with the implementation itself. The deprecation is strategic.

### Recommendations

1. **Keep for backward compatibility** - Some projects may still need webpack-based image handling
2. **Document migration path** - Provide clear guidance for moving to `next/image`
3. **Consider deprecation timeline** - Set a clear end-of-life date
4. **Publish final version** - Mark as deprecated in package.json with clear message

```json
{
  "deprecated": "Use Next.js built-in next/image component instead. See: https://nextjs.org/docs/api-reference/next/image"
}
```

---

## Summary

### Package Readiness Matrix

| Package | Tests | Security | Documentation | Ready for Publication |
|---------|-------|----------|---------------|----------------------|
| critters | ❌ 10 failures | ❌ 4 security issues | ✅ Good | ❌ **NO** |
| next-csrf | ✅ 19 passed | ✅ Secure | ✅ Good | ✅ **YES** |
| next-images | ✅ 40 passed | ✅ Secure | ✅ Good | ⚠️ **DEPRECATED** |

### Action Items

#### critters (High Priority)
- [ ] Fix security vulnerability: XSS via media attributes
- [ ] Fix security vulnerability: Script injection via CSS url()
- [ ] Fix security vulnerability: Script injection via href
- [ ] Fix security vulnerability: HTML entity decoding
- [ ] Fix security vulnerability: onload attribute sanitization
- [ ] Fix functionality: additionalStylesheets CSS compression
- [ ] Fix functionality: critters:exclude comment handling
- [ ] Fix functionality: preload strategy implementations
- [ ] Consider merging beasties improvements (safeParser, allowRules, remote)

#### next-csrf (Low Priority)
- [ ] Add App Router / Server Actions support
- [ ] Add Edge Runtime compatibility
- [ ] Consider rate limiting integration

#### next-images (Maintenance)
- [ ] Add deprecation notice to package.json
- [ ] Document migration path to next/image
- [ ] Set deprecation timeline

---

## Appendix: Test Commands

```bash
# Run all tests
pnpm test

# Run tests for specific package
cd packages/critters && npm test
cd packages/next-csrf && npm test
cd packages/next-images && npm test
```

---

*Report generated: 2026-02-16*
*Auditor: Kilo Code Debug Mode*
