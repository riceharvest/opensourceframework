# Contributing to OpenSource Framework

Thank you for your interest in contributing to OpenSource Framework! This document provides guidelines and instructions for contributing.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Development Environment Setup](#development-environment-setup)
- [Making Changes](#making-changes)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)
- [Documentation Guidelines](#documentation-guidelines)
- [Package-Specific Notes](#package-specific-notes)
- [Pull Request Process](#pull-request-process)

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to the maintainers.

## Development Environment Setup

### Prerequisites

- **Node.js**: Version 20.0.0 or higher
- **pnpm**: Version 9.0.0 or higher
- **Git**: For version control

### Initial Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/opensourceframework.git
   cd opensourceframework
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Verify setup**
   ```bash
   pnpm build
   pnpm test
   pnpm lint
   ```

### IDE Setup

We recommend using VS Code with the following extensions:
- ESLint
- Prettier
- TypeScript

## Making Changes

### Branch Naming

Use descriptive branch names with the following prefixes:
- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation changes
- `refactor/` - Code refactoring
- `test/` - Test additions/modifications
- `chore/` - Maintenance tasks

Examples:
- `feat/next-csrf-add-options`
- `fix/critters-css-parsing`
- `docs/update-readme`

### Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation only
- `style` - Code style changes (formatting, etc.)
- `refactor` - Code refactoring
- `perf` - Performance improvements
- `test` - Adding/modifying tests
- `build` - Build system changes
- `ci` - CI configuration changes
- `chore` - Other changes
- `revert` - Revert previous commit
- `deps` - Dependency updates

**Scopes:**
- `next-csrf` - Changes to next-csrf package
- `next-images` - Changes to next-images package
- `critters` - Changes to critters package
- `repo` - Repository-level changes
- `deps` - Dependency updates
- `release` - Release-related changes

**Examples:**
```
feat(next-csrf): add support for custom token length
fix(critters): resolve CSS parsing issue with nested media queries
docs(repo): update contributing guide with new testing requirements
chore(deps): update typescript to v5.4.0
```

### Development Workflow

1. **Create a branch**
   ```bash
   git checkout -b feat/your-feature
   ```

2. **Make your changes**
   - Write code following our coding standards
   - Add/update tests
   - Update documentation

3. **Test your changes**
   ```bash
   # Run tests for all packages
   pnpm test
   
   # Run tests for a specific package
   pnpm --filter @opensourceframework/next-csrf test
   
   # Run tests with coverage
   pnpm test:coverage
   ```

4. **Lint and format**
   ```bash
   pnpm lint
   pnpm format
   ```

5. **Create a changeset** (for user-facing changes)
   ```bash
   pnpm changeset
   ```
   This will prompt you to:
   - Select affected packages
   - Choose version bump type (major/minor/patch)
   - Write a description of the change

6. **Commit your changes**
   ```bash
   git add .
   git commit
   ```
   The commit message will be validated against our conventions.

7. **Push and create a PR**
   ```bash
   git push origin feat/your-feature
   ```

## Coding Standards

### TypeScript

- Use strict mode enabled in tsconfig
- Prefer explicit types over `any`
- Use type-only imports where possible
- Document public APIs with JSDoc comments

### Code Style

- Formatting is enforced via Prettier
- Linting rules are enforced via ESLint
- Run `pnpm format` before committing
- Run `pnpm lint` to check for issues

### File Organization

```
packages/[package-name]/
â src/
â  â index.ts          # Public exports
â  â [module].ts       # Module implementations
â  â __tests__/        # Test files (co-located)
â test/
â  â index.test.ts     # Integration tests
â package.json
â tsconfig.json
â tsup.config.ts
â vitest.config.ts
```

## Testing Requirements

### Test Coverage

- All new features must have tests
- Bug fixes should include regression tests
- Aim for at least 80% coverage on new code

### Running Tests

```bash
# All tests
pnpm test

# Watch mode
pnpm --filter @opensourceframework/next-csrf test:watch

# Coverage report
pnpm test:coverage

# Specific test file
pnpm --filter @opensourceframework/next-csrf vitest run src/index.test.ts
```

### Writing Tests

We use Vitest. Example:

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from './myModule';

describe('myFunction', () => {
  it('should return expected value', () => {
    expect(myFunction('input')).toBe('expected output');
  });

  it('should handle edge cases', () => {
    expect(myFunction('')).toBe('');
  });
});
```

## Documentation Guidelines

### README Updates

- Update package README for package-specific changes
- Update root README for repository-level changes
- Keep API documentation accurate and complete

### JSDoc Comments

```typescript
/**
 * Generates a CSRF token.
 * @param options - Configuration options
 * @param options.length - Token length (default: 32)
 * @returns A cryptographically secure token string
 * @example
 * ```typescript
 * const token = generateToken({ length: 64 });
 * ```
 */
export function generateToken(options?: { length?: number }): string {
  // ...
}
```

### CHANGELOG

- Changes are automatically documented via Changesets
- Ensure your changeset description is clear and user-facing
- Breaking changes should be clearly marked

## Package-Specific Notes

### @opensourceframework/next-csrf

- Security-critical package
- All changes require thorough security review
- Must test with multiple Next.js versions
- Document any security implications

### @opensourceframework/next-images

- Test with various image formats
- Verify compatibility with Next.js image optimization
- Check performance implications of changes

### @opensourceframework/critters

- Test CSS parsing with real-world stylesheets
- Verify no CSS specificity issues
- Check for cross-browser compatibility

## Pull Request Process

### Before Submitting

- [ ] Code compiles without errors
- [ ] All tests pass
- [ ] Linting passes
- [ ] Documentation updated
- [ ] Changeset created (if applicable)
- [ ] PR description filled out completely

### PR Requirements

1. **Fill out the PR template completely**
2. **Link related issues**
3. **Request review from maintainers**
4. **Address all review feedback**

### Review Process

1. Automated checks must pass (CI)
2. At least one maintainer approval required
3. All conversations must be resolved
4. PR is squashed and merged

### After Merge

- Changes will be included in the next release
- Packages are automatically published via Changesets
- GitHub releases are automatically created

## Getting Help

- **Questions?** Open a discussion on GitHub
- **Bugs?** Open an issue with the bug template
- **Security issues?** Follow our [Security Policy](./SECURITY.md)

Thank you for contributing to OpenSource Framework! ð