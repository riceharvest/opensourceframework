# Migration Guide: next-transpile-modules → @opensourceframework/next-transpile-modules

## Overview

This guide helps you migrate from the original `next-transpile-modules` package to the maintained fork `@opensourceframework/next-transpile-modules`.

## Why Migrate?

- **Original package** has limited maintenance
- **This fork** supports Next.js 14-22
- **React 18/19/20/21** support
- **Modern build** with tsup

## Migration Steps

### 1. Update Dependencies

```bash
# Remove original package
npm uninstall next-transpile-modules

# Install maintained fork
npm install @opensourceframework/next-transpile-modules

# or with pnpm
pnpm remove next-transpile-modules
pnpm add @opensourceframework/next-transpile-modules
```

### 2. Update next.config.js

No configuration changes required:

```javascript
// Before
const withTM = require('next-transpile-modules')(['some-esm-package'])

// After - identical configuration
const withTM = require('@opensourceframework/next-transpile-modules')(['some-esm-package'])

module.exports = withTM({
  // your Next.js config
})
```

### 3. Verify Workspaces Support

The fork maintains support for all package managers:

| Package Manager | Support |
|-----------------|---------|
| npm | ✓ |
| yarn | ✓ |
| pnpm | ✓ |

## Common Use Cases

### Using ESM-only Packages

```javascript
// next.config.js
const withTM = require('@opensourceframework/next-transpile-modules')([
  'some-esm-only-package',
  'another-package'
])

module.exports = withTM({
  webpack: (config) => {
    // your webpack config
    return config
  }
})
```

### Using with SWC

Works seamlessly with SWC compiler:

```javascript
// next.config.js - works with swc compiler
const withTM = require('@opensourceframework/next-transpile-modules')(['esm-package'])

module.exports = withTM({
  swcMinify: true,
})
```

## Compatibility

| Feature | Original | Fork |
|---------|----------|------|
| Next.js 14 | ✓ | ✓ |
| Next.js 15-22 | Partial | ✓ |
| React 18 | ✓ | ✓ |
| React 19 | Partial | ✓ |
| React 20/21 | ✗ | ✓ |
| Webpack 5 | ✓ | ✓ |

## Troubleshooting

### Module not found after transpilation

Ensure the package is in the transpileModules array:

```javascript
const withTM = require('@opensourceframework/next-transpile-modules')([
  '@your-scope/package-name'
])
```

### TypeScript errors

The fork includes TypeScript definitions. No additional setup required.

## Rollback

```bash
npm uninstall @opensourceframework/next-transpile-modules
npm install next-transpile-modules@10.x.x
```

## Support

- **Issues:** https://github.com/riceharvest/opensourceframework/issues
- **Discussions:** https://github.com/riceharvest/opensourceframework/discussions

## Changelog Highlights

### v10.0.2
- Next.js 22 support
- React 20/21 support added

### v10.0.x
- tsup build migration
- Updated TypeScript definitions
- Test coverage maintained
