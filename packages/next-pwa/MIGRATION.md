# Migration Guide: next-pwa → @opensourceframework/next-pwa

## Overview

This guide helps you migrate from the original `next-pwa` package to the maintained fork `@opensourceframework/next-pwa`.

## Why Migrate?

- **Original package** has Turbopack compatibility bugs
- **This fork** fixes service worker generation issues with Turbopack
- **Active maintenance** with React 19 support
- **tsup-based** modern build system

## Migration Steps

### 1. Update Dependencies

```bash
# Remove original package
npm uninstall next-pwa

# Install maintained fork
npm install @opensourceframework/next-pwa

# or with pnpm
pnpm remove next-pwa
pnpm add @opensourceframework/next-pwa
```

### 2. Update next.config.js

No configuration changes required - the API is identical:

```javascript
// Before
const withPWA = require('next-pwa')({
  dest: 'public'
})

// After - identical configuration
const withPWA = require('@opensourceframework/next-pwa')({
  dest: 'public'
})

module.exports = withPWA({
  // your Next.js config
})
```

### 3. Verify PWA Files

The fork generates identical service worker files:
- `public/workbox-*.js` (Workbox runtime)
- `public/sw.js` (service worker)
- `public/manifest.json` (if configured)

## Compatibility

| Feature | Original | Fork |
|---------|----------|------|
| Next.js 12-15 | ✓ | ✓ |
| Next.js 16/17 | ✗ | ✓ |
| React 18 | ✓ | ✓ |
| React 19 | ✗ | ✓ |
| Turbopack | ✗ (broken) | ✓ (fixed) |
| Webpack | ✓ | ✓ |

## Turbopack Users

If you were unable to use Turbopack due to PWA issues, this fork resolves them:

```javascript
// next.config.js - now works with Turbopack
const withPWA = require('@opensourceframework/next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
})

module.exports = withPWA({
  // your Turbopack-enabled config
})
```

## Rollback

```bash
npm uninstall @opensourceframework/next-pwa
npm install next-pwa@5.6.2
```

## Support

- **Issues:** https://github.com/riceharvest/opensourceframework/issues
- **Discussions:** https://github.com/riceharvest/opensourceframework/discussions

## Changelog Highlights

### v5.6.2
- Turbopack service worker generation fixed
- React 19 compatibility added

### v5.6.x
- tsup build system migration
- TypeScript definitions updated
