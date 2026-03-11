# Modernization Plans for Forked Packages

This document outlines detailed modernization plans for each of the 10 target packages that will be forked and maintained by OpenSource Framework.

## Table of Contents

1. [@opensourceframework/next-seo](#next-seo)
2. [@opensourceframework/next-transpile-modules](#next-transpile-modules)
3. [@opensourceframework/next-compose-plugins](#next-compose-plugins)
4. [@opensourceframework/next-cookies](#next-cookies)
5. [@opensourceframework/next-auth](#next-auth)
6. [@opensourceframework/next-pwa](#next-pwa)
7. [@opensourceframework/react-virtualized](#react-virtualized)
8. [@opensourceframework/next-session](#next-session)
9. [@opensourceframework/next-iron-session](#next-iron-session)
10. [@opensourceframework/next-mdx](#next-mdx)

---

## @opensourceframework/next-seo

### Overview

SEO management component for Next.js applications with support for meta tags, Open Graph, Twitter Cards, JSON-LD structured data, and more.

### Current State

- **Original**: https://github.com/garmeeh/next-seo
- **Last Update**: Likely 2023-2024 (verify at fork time)
- **Weekly Downloads**: ~200,000
- **Next.js Compatibility**: 12-15 (verify)
- **TypeScript**: Partial coverage
- **Test Coverage**: Low-medium

### Required Updates

1. **Next.js 16 Compatibility**
   - Test with React 19
   - Update for any API changes in metadata
   - Verify App Router support
   - Check Server Components compatibility

2. **TypeScript Improvements**
   - Add comprehensive type definitions
   - Strict mode compliance
   - Generic types for JSON-LD data

3. **Testing**
   - Add unit tests for SEO component
   - Integration tests for metadata generation
   - E2E tests for actual HTML output
   - Coverage target: 80%+

4. **Performance**
   - Bundle size analysis
   - Tree-shaking verification
   - Memoization of expensive operations

### Security Audit

- Low security risk (primarily UI component)
- Check for XSS vulnerabilities in user-provided data
- Ensure proper sanitization of JSON-LD
- Review third-party dependencies

### Migration Steps

1. Fork repository
2. Update package name to `@opensourceframework/next-seo`
3. Transform imports from `next-seo` to new package name
4. Add comprehensive TypeScript types
5. Create test suite
6. Update documentation with migration guide
7. Add examples for App Router and Pages Router
8. Create changeset

### Effort Breakdown

- Fork setup: 2 hours
- TypeScript types: 8 hours
- Testing: 16 hours
- Documentation: 8 hours
- Next.js 16 compatibility: 8 hours
- **Total**: ~42 hours (5-6 days)

### Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Breaking changes in Next.js metadata API | Comprehensive testing across versions |
| SEO best practices change | Stay informed via Next.js releases |
| Bundle size increase | Profile and optimize |

### Testing Strategy

- Unit tests for all component props
- Snapshot tests for HTML output
- Integration tests with actual Next.js pages
- Cross-version testing (13, 14, 15, 16)
- Accessibility testing

### Documentation Needed

- API reference with all props
- Migration guide from next-seo
- Examples for common use cases
- SEO best practices guide
- Troubleshooting guide

---

## @opensourceframework/next-transpile-modules

### Overview

Enables transpilation of external dependencies in Next.js applications, essential for monorepos and custom packages.

### Current State

- **Original**: https://github.com/hoangvvo/next-transpile-modules
- **Last Update**: Actively maintained (verify)
- **Weekly Downloads**: ~300,000
- **Next.js Compatibility**: 12-15
- **TypeScript**: Good coverage
- **Test Coverage**: Medium

### Required Updates

1. **Next.js 16 Compatibility**
   - Test with Turbopack
   - Update for any webpack config changes
   - Verify App Router compatibility
   - Test with Next.js 16 beta/rc

2. **TypeScript**
   - Already has types, verify strict mode
   - Add types for any missing APIs

3. **Testing**
   - Add tests for edge cases
   - Test with various module types (ESM, CJS)
   - Test with different transpilation targets
   - Coverage target: 85%+

4. **Documentation**
   - Clarify monorepo setup instructions
   - Add troubleshooting for common issues
   - Performance implications

### Security Audit

- Build-time tool, low runtime risk
- Check for path traversal in config
- Validate user-provided module patterns
- Review dependency vulnerabilities

### Migration Steps

1. Fork repository
2. Update package name
3. Add tests for missing scenarios
4. Update documentation
5. Test with Next.js 16
6. Create changeset

### Effort Breakdown

- Fork setup: 2 hours
- Testing: 12 hours
- Next.js 16 compatibility: 8 hours
- Documentation: 4 hours
- **Total**: ~26 hours (3-4 days)

### Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Next.js changes transpilation API | Comprehensive version testing |
| Performance degradation | Benchmark before/after |
| Breaking existing configs | Semantic versioning, deprecation warnings |

### Testing Strategy

- Integration tests with actual Next.js projects
- Test various transpilation patterns
- Performance benchmarking
- Cross-version compatibility matrix

### Documentation Needed

- Configuration examples
- Migration guide from v1 to v2 if breaking changes
- Troubleshooting common issues
- Performance optimization tips

---

## @opensourceframework/next-compose-plugins

### Overview

Utility for composing multiple Next.js plugins with proper ordering and configuration.

### Current State

- **Original**: https://github.com/hoangvvo/next-compose-plugins
- **Last Update**: Actively maintained
- **Weekly Downloads**: ~100,000
- **Next.js Compatibility**: 12-15
- **TypeScript**: Good coverage
- **Test Coverage**: Medium

### Required Updates

1. **Next.js 16 Compatibility**
   - Test with new plugin API changes
   - Verify with app and pages directories

2. **TypeScript**
   - Already well-typed, verify strict mode

3. **Testing**
   - Add tests for plugin ordering edge cases
   - Test with various plugin combinations
   - Coverage target: 90%+

4. **Documentation**
   - Add examples for common plugin combinations
   - Document plugin ordering best practices

### Security Audit

- Configuration utility, low security risk
- Validate plugin configuration objects

### Migration Steps

1. Fork repository
2. Update package name
3. Add comprehensive tests
4. Update documentation
5. Test with Next.js 16
6. Create changeset

### Effort Breakdown

- Fork setup: 2 hours
- Testing: 8 hours
- Documentation: 4 hours
- Next.js 16 compatibility: 4 hours
- **Total**: ~18 hours (2-3 days)

### Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Plugin ordering bugs | Comprehensive testing |
| Next.js API changes | Version compatibility testing |

### Testing Strategy

- Unit tests for plugin composition logic
- Integration tests with real Next.js plugins
- Test all edge cases (undefined, null, empty)

### Documentation Needed

- API reference
- Examples for common use cases
- Plugin ordering guide
- Migration from manual plugin config

---

## @opensourceframework/next-cookies

### Overview

Cookie parsing and setting utility for Next.js with support for both Pages Router and App Router.

### Current State

- **Original**: https://github.com/hoangvvo/next-cookies
- **Last Update**: Actively maintained
- **Weekly Downloads**: ~20,000
- **Next.js Compatibility**: 12-15
- **TypeScript**: Good coverage
- **Test Coverage**: Medium

### Required Updates

1. **Next.js 16 Compatibility**
   - Test with cookies() API changes
   - Verify App Router compatibility
   - Update for any headers/cookies changes

2. **TypeScript**
   - Already typed, verify strict mode

3. **Testing**
   - Add tests for cookie serialization edge cases
   - Test with various cookie options
   - Coverage target: 85%+

4. **Documentation**
   - Update for Next.js 16 cookies() API
   - Add examples for both routers

### Security Audit

- Cookie security is important
- Verify httponly, secure, samesite defaults
- Check for cookie injection vulnerabilities
- Review path/domain validation

### Migration Steps

1. Fork repository
2. Update package name
3. Add/update tests
4. Update documentation
5. Test with Next.js 16
6. Create changeset

### Effort Breakdown

- Fork setup: 2 hours
- Testing: 8 hours
- Next.js 16 compatibility: 6 hours
- Documentation: 4 hours
- **Total**: ~20 hours (2-3 days)

### Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Cookie parsing edge cases | Comprehensive test suite |
| Next.js cookies API changes | Version testing |

### Testing Strategy

- Unit tests for cookie parsing/serialization
- Integration tests with Next.js
- Test edge cases (special chars, large cookies, etc.)

### Documentation Needed

- API reference
- Migration guide
- Security best practices
- Examples for both routers

---

## @opensourceframework/next-auth

### Overview

Complete authentication solution for Next.js applications. **CRITICAL SECURITY PACKAGE**.

### Current State

- **Original**: https://github.com/nextauthjs/next-auth
- **Status**: v3 archived, v4 active
- **Weekly Downloads**: ~500,000
- **Next.js Compatibility**: 12-15 (v3)
- **TypeScript**: Excellent
- **Test Coverage**: High

### Required Updates

**⚠️ SPECIAL HANDLING REQUIRED** due to archived status.

1. **Authorization & Legal**
   - Contact NextAuth.js team for code transfer permission
   - Verify license compatibility
   - Consider clean reimplementation if transfer not possible
   - Establish legal basis for fork

2. **Next.js 16 Compatibility**
   - Major effort due to complex integration
   - Test all OAuth providers
   - Update for Next.js 16 API changes
   - App Router support verification

3. **Security Hardening**
   - Comprehensive security audit
   - Review all cryptographic operations
   - Audit OAuth flow implementations
   - Session management review
   - CSRF protection verification

4. **Modernization & Maintenance**
   - ✅ COMPLETED: Migrated client tests to Vitest and MSW v2
   - ✅ COMPLETED: Fixed CI environment regressions for tests
   - Add types for new Next.js 16 features
   - Update remaining tests to modern patterns

5. **Testing**
   - Ensure all existing tests pass
   - Add tests for Next.js 16 features
   - Security-focused tests
   - Provider integration tests
   - Coverage target: 90%+

6. **Documentation**
   - Migration guide from next-auth v3
   - Security best practices
   - OAuth provider setup guides
   - Upgrade guide from v3 to v4 (if applicable)

### Security Audit

**CRITICAL - MUST COMPLETE BEFORE FIRST RELEASE**

- Audit all cryptographic implementations
- Review session token generation and validation
- Check for timing attacks
- Audit OAuth state parameter usage
- Review callback URL validation
- Check for open redirect vulnerabilities
- Audit JWT handling (if applicable)
- Review CSRF protections
- Security headers
- Rate limiting considerations

### Migration Steps

1. **Legal clearance** - Obtain permission or reimplement
2. Fork repository
3. Update package name
4. Perform comprehensive security audit
5. Fix any security issues
6. Update for Next.js 16
7. Comprehensive testing across providers
8. Update documentation
9. Establish security disclosure process
10. Create changeset

### Effort Breakdown

- Legal/authorization: 40 hours (uncertain)
- Fork setup: 4 hours
- Security audit: 40 hours
- Next.js 16 compatibility: 60 hours
- Testing: 40 hours
- Documentation: 24 hours
- **Total**: ~208 hours (5-6 weeks) - VERY HIGH

### Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Legal issues with fork | Obtain explicit permission, consider reimplementation |
| Security vulnerabilities | Comprehensive audit, third-party security review |
| Breaking changes | Extensive testing, gradual rollout |
| OAuth provider compatibility | Test with major providers (Google, GitHub, etc.) |

### Testing Strategy

- Unit tests for all auth flows
- Integration tests with real OAuth providers (mocked)
- Security-focused tests (timing, CSRF, etc.)
- Cross-browser testing
- Mobile testing
- Load testing for auth endpoints

### Documentation Needed

- Complete API reference
- Migration guide from next-auth
- Security best practices
- OAuth provider setup guides
- Troubleshooting common issues
- Upgrade guides

---

## @opensourceframework/next-pwa

### Overview

Progressive Web App (PWA) support for Next.js with service worker generation, manifest, and offline support.

### Current State

- **Original**: https://github.com/hanford/next-pwa
- **Last Update**: Moderately active
- **Weekly Downloads**: ~200,000
- **Next.js Compatibility**: 12-15
- **TypeScript**: Partial
- **Test Coverage**: Low-medium

### Required Updates

1. **Next.js 16 Compatibility**
   - Major effort due to webpack plugin changes
   - Test with Turbopack
   - Update for App Router
   - Handle edge runtime for service workers

2. **TypeScript**
   - Add comprehensive type definitions
   - Strict mode compliance

3. **Testing**
   - Add PWA-specific tests (service worker, caching)
   - Integration tests with actual Next.js builds
   - Lighthouse PWA score validation
   - Coverage target: 80%+

4. **Documentation**
   - PWA best practices
   - Service worker lifecycle
   - Caching strategies
   - App Router vs Pages Router differences

### Security Audit

- Service worker security critical
- Check for path traversal in cache
- Validate manifest data
- Review caching policies
- Check for XSS in generated service worker

### Migration Steps

1. Fork repository
2. Update package name
3. Add TypeScript types
4. Create comprehensive test suite
5. Update for Next.js 16 and Turbopack
6. Security audit
7. Update documentation
8. Create changeset

### Effort Breakdown

- Fork setup: 2 hours
- TypeScript types: 12 hours
- Testing: 24 hours
- Next.js 16 compatibility: 30 hours
- Security audit: 8 hours
- Documentation: 12 hours
- **Total**: ~88 hours (2-3 weeks)

### Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Webpack API changes in Next.js 16 | Early testing with beta versions |
| Service worker bugs | Comprehensive testing, canary releases |
| PWA certification | Lighthouse validation |

### Testing Strategy

- Unit tests for config generation
- Integration tests building actual Next.js apps
- Service worker testing with Workbox
- Lighthouse PWA score testing
- Caching strategy validation
- Offline functionality tests

### Documentation Needed

- Configuration reference
- PWA best practices
- Caching strategy guide
- Service worker lifecycle
- Migration guide
- Troubleshooting

---

## @opensourceframework/react-virtualized

### Overview

Virtual scrolling and windowing library for React with support for lists, grids, tables, and more.

### Current State

- **Original**: https://github.com/bvaughn/react-virtualized
- **Last Update**: Slower updates
- **Weekly Downloads**: ~300,000
- **React Compatibility**: 16-18
- **TypeScript**: Partial
- **Test Coverage**: Medium

### Required Updates

1. **React 18/19 Compatibility**
   - Address `findDOMNode` deprecation (used extensively in tests and components)
   - Verify concurrent rendering behavior
   - Fix strict mode issues

2. **Testing Infrastructure**
   - ✅ COMPLETED: Migrated to Vitest and enabled legacy Jest tests (360+ tests now passing)
   - ✅ COMPLETED: Resolved missing dependencies (immutable) and global mock issues
   - Fix remaining 50+ environment-related test failures (mostly WindowScroller and Scroll events)
   - Increase coverage beyond current baseline

3. **Accessibility (WCAG)**
   - Audit all components for aria attributes
   - Fix known issues in Table and Grid headers
   - Add keyboard navigation tests

4. **Performance**
   - Implement modern benchmarking suite
   - Optimize for React 18+ useTransition/useDeferredValue
   - Memory leak detection
   - Reduce bundle size

5. **Documentation**
   - Update for modern React patterns
   - Add migration guide from react-window alternatives
   - Performance optimization guide

### Security Audit

- Low security risk (UI library)
- Check for XSS in cell renderers (user-provided content)
- Validate props to prevent prototype pollution

### Migration Steps

1. Fork repository
2. Update package name
3. Add TypeScript types
4. Create comprehensive test suite
5. Performance benchmarking
6. React 18+ compatibility
7. Update documentation
8. Create changeset

### Effort Breakdown

- Fork setup: 2 hours
- TypeScript types: 20 hours
- Testing: 32 hours
- Performance optimization: 24 hours
- React 18+ compatibility: 16 hours
- Documentation: 16 hours
- **Total**: ~110 hours (2-3 weeks)

### Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Performance regressions | Continuous benchmarking |
| Breaking API changes | Semantic versioning, extensive testing |
| Bundle size | Tree-shaking verification |

### Testing Strategy

- Unit tests for all components
- Performance benchmarks
- Accessibility tests (WCAG)
- Visual regression tests
- Memory profiling
- Cross-browser tests

### Documentation Needed

- Complete API reference
- Performance optimization guide
- Migration guide from other virtual list libraries
- Accessibility guide
- Examples for common use cases

---

## @opensourceframework/next-session

### Overview

Session management middleware for Next.js with support for various storage backends.

### Current State

- **Original**: https://github.com/hoangvvo/next-session
- **Last Update**: Moderately active
- **Weekly Downloads**: ~30,000
- **Next.js Compatibility**: 12-15
- **TypeScript**: Good coverage
- **Test Coverage**: Medium

### Required Updates

1. **Next.js 16 Compatibility**
   - Test with cookies() API changes
   - Verify both routers
   - Update for any request/response changes

2. **TypeScript**
   - Already typed, verify strict mode

3. **Testing**
   - Add tests for session storage backends
   - Test session expiration
   - Test concurrency scenarios
   - Coverage target: 85%+

4. **Documentation**
   - Storage backend configuration
   - Security best practices
   - Migration from express-session

### Security Audit

**IMPORTANT** - Session security is critical

- Review session ID generation (cryptographically secure?)
- Check session fixation vulnerabilities
- Verify session expiration handling
- Review storage backend security
- Check for session hijacking vectors
- Review cookie security flags (httponly, secure, samesite)

### Migration Steps

1. Fork repository
2. Update package name
3. Security audit
4. Add/update tests
5. Next.js 16 compatibility
6. Update documentation
7. Create changeset

### Effort Breakdown

- Fork setup: 2 hours
- Security audit: 16 hours
- Testing: 12 hours
- Next.js 16 compatibility: 8 hours
- Documentation: 8 hours
- **Total**: ~46 hours (5-6 days)

### Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Session security flaws | Comprehensive security audit |
| Session store compatibility | Test with all supported backends |
| Memory leaks | Session cleanup testing |

### Testing Strategy

- Unit tests for session middleware
- Integration tests with various stores
- Security tests (session fixation, hijacking)
- Expiration and cleanup tests
- Concurrency tests

### Documentation Needed

- Security best practices
- Storage backend configuration
- Migration guide
- API reference
- Troubleshooting

---

## @opensourceframework/next-iron-session

### Overview

Session management with iron encryption for Next.js, providing stateless encrypted sessions.

### Current State

- **Original**: https://github.com/vvo/next-iron-session
- **Last Update**: Moderately active
- **Weekly Downloads**: ~150,000
- **Next.js Compatibility**: 12-15
- **TypeScript**: Good coverage
- **Test Coverage**: Medium

### Required Updates

1. **Next.js 16 Compatibility**
   - Test with cookies() API changes
   - Verify both routers
   - Update for any request/response changes

2. **TypeScript**
   - Already typed, verify strict mode
   - Improve types for encrypted data

3. **Testing**
   - Add encryption/decryption tests
   - Test with various data types
   - Coverage target: 85%+

4. **Documentation**
   - Encryption best practices
   - Key management
   - Migration from next-session

### Security Audit

**CRITICAL** - Encryption security is paramount

- Audit encryption algorithm (iron)
- Review key derivation functions
- Check for timing attacks
- Verify encryption implementation
- Review key storage recommendations
- Check for downgrade attacks
- Audit cookie tampering detection

### Migration Steps

1. Fork repository
2. Update package name
3. Comprehensive security audit
4. Add/update tests
5. Next.js 16 compatibility
6. Update documentation
7. Create changeset

### Effort Breakdown

- Fork setup: 2 hours
- Security audit: 24 hours
- Testing: 12 hours
- Next.js 16 compatibility: 8 hours
- Documentation: 8 hours
- **Total**: ~54 hours (6-7 days)

### Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| Encryption vulnerabilities | Third-party security audit |
| Key management issues | Clear documentation, use env vars |
| Breaking changes | Semantic versioning |

### Testing Strategy

- Unit tests for encryption/decryption
- Integration tests with Next.js
- Security tests (tampering, replay attacks)
- Test with various data types

### Documentation Needed

- Security best practices
- Key management guide
- Migration guide
- API reference
- Encryption details

---

## @opensourceframework/next-mdx

### Overview

MDX integration for Next.js with support for both Pages Router and App Router.

### Current State

- **Original**: https://github.com/hoangvvo/next-mdx
- **Original Package Name**: @next/mdx (official)
- **Last Update**: Varies
- **Weekly Downloads**: ~50,000
- **Next.js Compatibility**: 12-15
- **TypeScript**: Good
- **Test Coverage**: Medium

### Required Updates

1. **Next.js 16 Compatibility**
   - Test with MDX 3+
   - App Router support
   - Server Components compatibility
   - async/await MDX support

2. **TypeScript**
   - Already typed, verify strict mode

3. **Testing**
   - MDX compilation tests
   - Integration tests
   - Coverage target: 80%+

4. **Documentation**
   - App Router examples
   - MDX 3 migration guide
   - Advanced MDX features

### Security Audit

- MDX compilation security
- Check for XSS in MDX content
- Validate MDX options
- Review plugin security

### Migration Steps

1. Fork repository
2. Update package name
3. Add/update tests
4. Next.js 16 compatibility
5. Update documentation
6. Create changeset

### Effort Breakdown

- Fork setup: 2 hours
- Testing: 12 hours
- Next.js 16 compatibility: 12 hours
- Documentation: 8 hours
- **Total**: ~34 hours (4-5 days)

### Risks & Mitigation

| Risk | Mitigation |
|------|------------|
| MDX version incompatibility | Test with multiple MDX versions |
| App Router issues | Early testing with Next.js 16 |

### Testing Strategy

- MDX compilation tests
- Integration tests with Next.js
- Test various MDX features
- App Router and Pages Router tests

### Documentation Needed

- Configuration guide
- MDX features guide
- Migration from @next/mdx
- App Router examples
- Plugin usage

---

## Summary

### Total Estimated Effort

| Package | Effort (hours) | Effort (weeks) |
|---------|---------------|----------------|
| next-seo | 42 | 1-2 |
| next-transpile-modules | 26 | 1 |
| next-compose-plugins | 18 | 0.5 |
| next-cookies | 20 | 1 |
| next-auth | 208 | 5-6 |
| next-pwa | 88 | 2-3 |
| react-virtualized | 110 | 2-3 |
| next-session | 46 | 1-2 |
| next-iron-session | 54 | 1-2 |
| next-mdx | 34 | 1 |
| **Total** | **646** | **~17 weeks** |

### Priority Order for Implementation

Based on impact vs effort:

1. **Tier 1 (Quick Wins)**:
   - next-compose-plugins (low effort, high impact)
   - next-transpile-modules (low-medium effort, high impact)
   - next-cookies (low effort, medium impact)
   - next-mdx (low effort, low-medium impact)

2. **Tier 2 (Medium Effort)**:
   - next-seo (medium effort, high impact)
   - next-session (medium effort, medium impact)
   - next-iron-session (medium effort, medium impact)

3. **Tier 3 (High Effort)**:
   - next-pwa (high effort, high impact)
   - react-virtualized (high effort, high impact)

4. **Tier 4 (Very High Effort)**:
   - next-auth (very high effort, critical)

### Implementation Strategy

1. **Phase 1** (Weeks 1-2): Complete Tier 1 packages
2. **Phase 2** (Weeks 3-5): Complete Tier 2 packages
3. **Phase 3** (Weeks 6-9): Complete Tier 3 packages
4. **Phase 4** (Weeks 10-17): Complete next-auth (parallel to others if resources allow)

### Success Criteria

- All packages have ≥80% test coverage
- All packages pass Next.js 16 compatibility tests
- Security audits completed for security-sensitive packages
- Documentation is comprehensive and up-to-date
- CI/CD pipelines are green
- No critical vulnerabilities in security audit
- All packages published to npm

---

*Last Updated: 2025-02-18*
*Maintained by: OpenSource Framework Team*
