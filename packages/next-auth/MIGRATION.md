# Migration Guide: next-auth → @opensourceframework/next-auth

## Overview

This guide helps you migrate from the abandoned `next-auth` package to the maintained fork `@opensourceframework/next-auth`.

## Why Migrate?

- **Original package** (nextauthjs/next-auth) has moved to NextAuth v5 with breaking changes
- **This fork** maintains v3.x compatibility for legacy applications
- **Active maintenance** with security patches and Next.js 16/17 support
- **React 19** hydration fixes included

## Migration Steps

### 1. Update Dependencies

```bash
# Remove original package
npm uninstall next-auth

# Install maintained fork
npm install @opensourceframework/next-auth

# or with pnpm
pnpm remove next-auth
pnpm add @opensourceframework/next-auth
```

### 2. Update Import Statements

No changes required - the package exports are identical:

```javascript
// Before
import NextAuth from "next-auth"
import Providers from "next-auth/providers"

// After - works exactly the same
import NextAuth from "@opensourceframework/next-auth"
import Providers from "@opensourceframework/next-auth/providers"
```

### 3. Update Provider Imports

```javascript
// Before
import Providers from "next-auth/providers"

// After - identical usage
import Providers from "@opensourceframework/next-auth/providers"
```

### 4. Update Adapter Imports (if using database)

```javascript
// Before
import PrismaAdapter from "@next-auth/prisma-adapter"

// After - same interface
import { PrismaAdapter } from "@opensourceframework/next-auth/adapters"
```

### 5. Verify Configuration

Your existing configuration should work without changes:

```javascript
// next-auth.js / [...nextauth].js - no changes needed
export default NextAuth({
  providers: [...],
  database: process.env.DATABASE_URL,
  // all other options remain the same
})
```

## Compatibility

| Feature | Original | Fork |
|---------|----------|------|
| Next.js 12-15 | ✓ | ✓ |
| Next.js 16/17 | ✗ | ✓ |
| React 18 | ✓ | ✓ |
| React 19 | ✗ | ✓ |
| OAuth 1.0/2.0 | ✓ | ✓ |
| JWT Sessions | ✓ | ✓ |
| Database Sessions | ✓ | ✓ |

## Rollback

If you encounter issues, rollback is simple:

```bash
npm uninstall @opensourceframework/next-auth
npm install next-auth@3.29.10
```

## Support

- **Issues:** https://github.com/riceharvest/opensourceframework/issues
- **Discussions:** https://github.com/riceharvest/opensourceframework/discussions

## Changelog Highlights

### v3.29.10
- React 19 hydration fixes
- Next.js 16/17 support added

### v3.29.x
- Security patches backported
- TypeScript type definitions maintained
