# Contributing to @opensourceframework/{package-name}

Thank you for your interest in contributing to @opensourceframework/{package-name}! This document provides guidelines specific to this package.

## Quick Links

- [OpenSource Framework Contributing Guide](../../CONTRIBUTING.md) - General contribution guidelines for all packages
- [Security Policy](./SECURITY.md) - How to report security vulnerabilities
- [Code of Conduct](../../CODE_OF_CONDUCT.md) - Community guidelines

## Package-Specific Information

### Overview

{brief-description}

### Compatibility

- **Next.js**: {nextjs-versions}
- **Node.js**: 18.x or higher
- **TypeScript**: 5.x

### Testing Strategy

{testing-strategy}

### Special Considerations

{special-considerations}

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/riceharvest/opensourceframework.git
   cd opensourceframework
   ```

2. **Install dependencies**
   ```bash
   corepack pnpm@9.6.0 install
   ```

3. **Build the package**
   ```bash
   corepack pnpm@9.6.0 --filter @opensourceframework/{package-name} build
   ```

4. **Run tests**
   ```bash
   corepack pnpm@9.6.0 --filter @opensourceframework/{package-name} test
   ```

## Development Workflow

### Branch Naming

- `feat/{package-name}-feature` - New features
- `fix/{package-name}-bug` - Bug fixes
- `docs/{package-name}` - Documentation
- `test/{package-name}` - Test improvements
- `chore/{package-name}` - Maintenance

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

For this package, use scope: `{package-name}`

Examples:
```
feat({package-name}): add support for custom options
fix({package-name}): resolve memory leak in cleanup
docs({package-name}): update API documentation
test({package-name}): add integration tests for edge cases
```

### Changesets

For any user-facing changes, create a changeset:

```bash
corepack pnpm@9.6.0 changeset
```

Select:
- Package: `@opensourceframework/{package-name}`
- Version bump: major/minor/patch based on [SemVer](https://semver.org/)
- Write a clear description of the change

### Testing Requirements

- All new features must include tests
- Bug fixes must include regression tests
- Aim for at least 80% coverage on modified code
- Test with multiple Next.js versions if applicable

Run tests:
```bash
# All tests for this package
corepack pnpm@9.6.0 --filter @opensourceframework/{package-name} test

# Watch mode
corepack pnpm@9.6.0 --filter @opensourceframework/{package-name} test:watch

# Coverage
corepack pnpm@9.6.0 --filter @opensourceframework/{package-name} test:coverage

# Type checking
corepack pnpm@9.6.0 --filter @opensourceframework/{package-name} typecheck
```

### Pull Request Process

1. **Fill out the PR template completely**
2. **Ensure all checks pass** (CI, linting, tests, type checking)
3. **Request review** from maintainers
4. **Address all feedback**
5. **Squash and merge** when approved

### Review Checklist

- [ ] Code follows TypeScript best practices
- [ ] All tests pass
- [ ] Linting passes
- [ ] Documentation updated (README, JSDoc)
- [ ] Changeset created (if applicable)
- [ ] No security vulnerabilities introduced
- [ ] Backward compatibility maintained (or major version bump)
- [ ] Performance impact considered

## Package Structure

```
packages/{package-name}/
├── src/
│   ├── index.ts          # Public exports
│   └── [module].ts       # Implementation
├── test/                 # Integration tests
├── __tests__/           # Unit tests (co-located)
├── package.json
├── tsconfig.json
├── tsup.config.ts
├── vitest.config.ts
└── README.md
```

## Common Issues

{common-issues}

## Need Help?

- **Questions?** Open a [GitHub Discussion](https://github.com/riceharvest/opensourceframework/discussions)
- **Bugs?** Open an [Issue](https://github.com/riceharvest/opensourceframework/issues)
- **Security?** See our [Security Policy](./SECURITY.md)

Thank you for contributing! 🎉
