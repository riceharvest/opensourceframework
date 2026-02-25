# @opensourceframework/next-csrf

> CSRF protection for Next.js applications

[![npm version](https://img.shields.io/npm/v/@opensourceframework/next-csrf.svg)](https://www.npmjs.com/package/@opensourceframework/next-csrf)
[![npm downloads](https://img.shields.io/npm/dm/@opensourceframework/next-csrf.svg)](https://www.npmjs.com/package/@opensourceframework/next-csrf)
[![License](https://img.shields.io/npm/l/@opensourceframework/next-csrf.svg)](./LICENSE)

## About

This is a maintained fork of the original `next-csrf` package, which was abandoned.

### Why This Fork?

- **Security updates**: Continued maintenance for security vulnerabilities
- **Bug fixes**: Resolution of known issues from the original package
- **TypeScript improvements**: Enhanced type definitions
- **Next.js compatibility**: Updates for latest Next.js versions

### Original Package

- **Original Repository**: [link to original repo]
- **Original npm Package**: [link to npm]
- **Fork Reason**: Original package is no longer maintained
- **Fork Date**: [date]

## Installation

```bash
npm install @opensourceframework/next-csrf
# or
yarn add @opensourceframework/next-csrf
# or
pnpm add @opensourceframework/next-csrf
```

## Usage

```typescript
// Usage example
import { createCSRF } from '@opensourceframework/next-csrf';

const csrf = createCSRF({
  secret: process.env.CSRF_SECRET,
});

// Use in API routes
export default csrf.protect(handler);
```

## API Reference

### `createCSRF(options)`

Creates a CSRF protection instance.

**Options:**
- `secret` - Secret key for token signing (required)
- `tokenKey` - Name of the token in cookies (default: '_csrf')
- `saltLength` - Length of the salt (default: 8)

### `csrf.protect(handler)`

Middleware that protects an API route handler.

## Migration Guide

If migrating from the original package:

```diff
- import { createCSRF } from 'next-csrf';
+ import { createCSRF } from '@opensourceframework/next-csrf';
```

No other code changes required.

## Contributing

See the [root contributing guide](../../CONTRIBUTING.md) for general contribution information.

For this package specifically:
- All security-related changes require thorough review
- Tests must cover security edge cases
- Document any security implications

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for details about changes.

## License

[MIT](./LICENSE) - Same license as original package.

## Credits

- Original author: [original author name/link]
- Maintainers: [OpenSource Framework contributors]