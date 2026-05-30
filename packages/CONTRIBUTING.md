# Contributing to OpenSource Framework Packages

Welcome! This document provides guidelines for contributing to any `@opensourceframework/*` package.

**Note**: This is a supplement to the [main CONTRIBUTING.md](../../CONTRIBUTING.md). Please read both before contributing.

## Table of Contents

- [Quick Start](#quick-start)
- [Package Status](#package-status)
- [Forked Packages](#forked-packages)
- [Special Considerations for Forks](#special-considerations-for-forks)
- [Testing Requirements](#testing-requirements)
- [Documentation Updates](#documentation-updates)
- [Security Reporting](#security-reporting)
- [Release Process](#release-process)

## Quick Start

1. **Set up development environment** (see [main CONTRIBUTING.md](../../CONTRIBUTING.md#development-environment-setup))
2. **Pick a package** to work on from `packages/`
3. **Create a branch**: `git checkout -b feat/package-name/feature`
4. **Make changes** following the guidelines below
5. **Test thoroughly**: `corepack pnpm@9.6.0 --filter @opensourceframework/package-name test`
6. **Create a changeset**: `corepack pnpm@9.6.0 changeset`
7. **Open a PR** with completed checklist

## Package Status

All packages in this monorepo are either:

1. **Existing maintained packages** (critters, next-csrf, etc.)
2. **Pending forks** (packages listed below) - awaiting setup

### Pending Fork Packages

These packages are planned for adoption but not yet forked. See their `PENDING-FORK.md` files:

| Package | Weekly Downloads | Priority | Status |
|---------|------------------|----------|--------|
| [@opensourceframework/next-seo](packages/next-seo/PENDING-FORK.md) | 200K | High | Pending |
| [@opensourceframework/next-transpile-modules](packages/next-transpile-modules/PENDING-FORK.md) | 300K | High | Pending |
| [@opensourceframework/next-compose-plugins](packages/next-compose-plugins/PENDING-FORK.md) | 100K | High | Pending |
| [@opensourceframework/next-cookies](packages/next-cookies/PENDING-FORK.md) | 20K | Medium | Pending |
| [@opensourceframework/next-auth](packages/next-auth/PENDING-FORK.md) | 500K | Critical | Pending |
| [@opensourceframework/next-pwa](packages/next-pwa/PENDING-FORK.md) | 200K | High | Pending |
| [@opensourceframework/react-virtualized](packages/react-virtualized/PENDING-FORK.md) | 300K | High | Pending |
| [@opensourceframework/next-session](packages/next-session/PENDING-FORK.md) | 30K | Medium | Pending |
| [@opensourceframework/next-iron-session](packages/next-iron-session/PENDING-FORK.md) | 150K | Medium | Pending |
| [@opensourceframework/next-mdx](packages/next-mdx/PENDING-FORK.md) | 50K | Low-Medium | Pending |

**Do not submit PRs for pending packages until they are forked and set up.**

## Forked Packages

Once a package is forked and set up:

1. The `PENDING-FORK.md` will be replaced with actual source code
2. The package will appear in the monorepo's `packages/` directory
3. Contribution guidelines will follow the same standards as existing packages

## Special Considerations for Forks

When contributing to a forked package, keep these principles in mind:

### Attribution

- **Never remove original author attribution** in `package.json` and README
- **Clearly indicate** that this is a maintained fork
- **Link to original repository** in documentation
- **Preserve original license** (usually MIT)

### Compatibility

- **Target Next.js 16+** for all forks
- **Maintain backward compatibility** where possible
- **Document breaking changes** clearly
- **Provide migration guides** from original package

### Security

- **Security-critical packages** (next-auth, next-session, next-iron-session) require extra scrutiny
- **All security fixes** should be backported if applicable to original
- **Coordinate with security team** for vulnerability disclosures

### Testing

- **Import original test suite** when forking
- **Ensure all original tests pass** before adding new ones
- **Add regression tests** for any bugs fixed
- **Increase coverage** to at least 80%

## Testing Requirements

All packages must meet these testing standards:

### Test Coverage

- **Minimum 80%** line coverage for new code
- **100%** for critical security code (auth, sessions, crypto)
- **No coverage drop** in existing code

### Test Types

1. **Unit tests** - Test individual functions/classes
2. **Integration tests** - Test package with Next.js
3. **E2E tests** - Full application tests (when feasible)
4. **Snapshot tests** - For UI/output stability
5. **Performance tests** - For large packages (react-virtualized, next-pwa)

### Running Tests

```bash
# All packages
corepack pnpm@9.6.0 test

# Specific package
corepack pnpm@9.6.0 --filter @opensourceframework/next-csrf test

# With coverage
corepack pnpm@9.6.0 --filter @opensourceframework/package-name test:coverage

# Watch mode
corepack pnpm@9.6.0 --filter @opensourceframework/package-name test:watch

# Type checking
corepack pnpm@9.6.0 --filter @opensourceframework/package-name typecheck
```

### Test File Location

- Co-located with source: `src/index.test.ts` or `src/__tests__/`
- Or in `test/` directory at package root

## Documentation Updates

When contributing to a package:

### README.md

- Update for any API changes
- Add examples for new features
- Update compatibility table
- Add migration notes for breaking changes

### API Documentation

- Add JSDoc comments to all public exports
- Include examples in comments
- Document parameters and return types
- Note any side effects or requirements

### CHANGELOG

- Changes are automatically generated by Changesets
- Ensure your changeset description is clear and user-facing
- Mark breaking changes with `BREAKING CHANGE:` prefix

### Migration Guides

For breaking changes, create migration documentation:

```markdown
## Migration from v1.x to v2.x

### Changed APIs

```diff
- oldFunction(oldParam)
+ newFunction(newParam)
```

### Deprecated Features

List features that are deprecated and alternatives.

### Upgrade Steps

1. Update package: `corepack pnpm@9.6.0 update @opensourceframework/package-name`
2. Update code according to changes
3. Run tests
4. Test your application thoroughly
```

## Security Reporting

**DO NOT open GitHub issues for security vulnerabilities.**

Instead:

1. **Email**: security@opensourceframework.dev
2. **GitHub Advisory**: Use [private vulnerability reporting](https://github.com/riceharvest/opensourceframework/security/advisories)
3. **Encryption**: PGP key available on request

**For security-sensitive packages** (next-auth, next-session, next-iron-session, next-csrf):

- All PRs require **security review** from maintainers
- Consider **third-party audit** before major releases
- Follow [Security Policy](../../SECURITY.md) strictly

## Release Process

Releases are managed via [Changesets](https://github.com/changesets/changesets).

### For Contributors

1. **Create a changeset** after merging your PR:
   ```bash
   corepack pnpm@9.6.0 changeset
   ```
   - Select affected packages
   - Choose version bump (major/minor/patch)
   - Write a clear, user-facing description

2. **Changeset Guidelines**:
   - Be specific about what changed and why
   - Mention any breaking changes
   - Reference related issues/PRs
   - Keep it concise but informative

   Example:
   ```
   feat(next-csrf): add support for custom token storage

   Adds the ability to provide custom token storage function instead of using cookies directly. This enables integration with external session stores.

   Breaking change: The `secret` option is now required.
   ```

### For Maintainers

1. **Version bump**: `corepack pnpm@9.6.0 changeset version`
2. **Update lockfile**: `corepack pnpm@9.6.0 install`
3. **Build all packages**: `corepack pnpm@9.6.0 build`
4. **Run tests**: `corepack pnpm@9.6.0 test`
5. **Publish**: `corepack pnpm@9.6.0 changeset publish`
6. **Create release notes**: Automatic via changesets

## Branch Naming

Use descriptive branch names with prefixes:

- `feat/package-name/description` - New features
- `fix/package-name/issue` - Bug fixes
- `docs/package-name/update` - Documentation
- `test/package-name/add-tests` - Test additions
- `refactor/package-name/cleanup` - Refactoring
- `chore/package-name/task` - Maintenance

Examples:
- `feat/next-auth/add-oauth2-support`
- `fix/next-csrf/cookie-parsing`
- `docs/next-seo/update-examples`

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): subject

body

footer
```

**Types**: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert, deps

**Scopes**: Use package name (e.g., `next-auth`, `next-csrf`, `next-images`) or `monorepo` for root changes

**Examples**:
```
feat(next-auth): implement refresh token rotation

Adds support for OAuth 2.0 refresh token rotation as recommended by security best practices.

BREAKING CHANGE: Refresh tokens are now single-use. Existing refresh tokens will be invalidated.

Closes #123
```

## Getting Help

- **General questions**: [GitHub Discussions](https://github.com/riceharvest/opensourceframework/discussions)
- **Bug reports**: [GitHub Issues](https://github.com/riceharvest/opensourceframework/issues)
- **Security issues**: security@opensourceframework.dev
- **Chat**: [Discord/Slack - TBD]

## Package-Specific Notes

### Security-Critical Packages

These packages require extra review:

- `@opensourceframework/next-auth`
- `@opensourceframework/next-session`
- `@opensourceframework/next-iron-session`
- `@opensourceframework/next-csrf`

**Requirements**:
- PR must be approved by at least one senior maintainer
- Consider requesting external security audit for major changes
- Include security test cases
- Document security implications of changes

### High-Impact Packages

These packages have many users and require thorough testing:

- `@opensourceframework/next-seo` (200K)
- `@opensourceframework/next-transpile-modules` (300K)
- `@opensourceframework/react-virtualized` (300K)
- `@opensourceframework/next-pwa` (200K)

**Requirements**:
- Comprehensive test coverage
- Test across multiple Next.js versions
- Performance benchmarks
- Browser compatibility testing (where applicable)

---

Thank you for contributing to OpenSource Framework! 🎉

*See also: [main CONTRIBUTING.md](../../CONTRIBUTING.md), [CODE_OF_CONDUCT.md](../../CODE_OF_CONDUCT.md), [SECURITY.md](../../SECURITY.md)*
