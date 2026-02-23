# Migration Guide: next-seo → @opensourceframework/next-seo

## Overview

This guide helps you migrate from the original `next-seo` package to the maintained fork `@opensourceframework/next-seo`.

## Why Migrate?

- **Original package** has limited maintenance
- **This fork** has 539+ tests and full TypeScript rewrite
- **Next.js 15+** optimization
- **No @type required** pattern for better DX

## Migration Steps

### 1. Update Dependencies

```bash
# Remove original package
npm uninstall next-seo

# Install maintained fork
npm install @opensourceframework/next-seo

# or with pnpm
pnpm remove next-seo
pnpm add @opensourceframework/next-seo
```

### 2. Update Import Statements

No changes required - the package exports are identical:

```javascript
// Before
import { NextSeo } from 'next-seo'
import { ArticleJsonLd } from 'next-seo'

// After - works exactly the same
import { NextSeo } from '@opensourceframework/next-seo'
import { ArticleJsonLd } from '@opensourceframework/next-seo'
```

### 3. Update App Router Usage

For Next.js App Router, the import path is unchanged:

```tsx
// Before
import { NextSeo } from 'next-seo'

// After - identical usage
import { NextSeo } from '@opensourceframework/next-seo'

export default function Page() {
  return (
    <>
      <NextSeo title="My Page" description="Description" />
      {/* Your content */}
    </>
  )
}
```

### 4. Update Pages Router Usage

```jsx
// Before
import Head from 'next/head'
import { NextSeo } from 'next-seo'

// After - same pattern
import Head from 'next/head'
import { NextSeo } from '@opensourceframework/next-seo'

export default function Page() {
  return (
    <>
      <NextSeo title="My Page" description="Description" />
      <Head>
        <title>My Page</title>
      </Head>
      {/* Your content */}
    </>
  )
}
```

## Improved DX: No @type Required

The fork includes intelligent type detection - you don't need to specify @type:

```tsx
// Original package - verbose
<ArticleJsonLd
  author={{
    "@type": "Person",
    name: "John Doe"
  }}
  publisher={{
    "@type": "Organization",
    name: "ACME Corp",
    logo: "logo.jpg"
  }}
/>

// Fork - simplified (still fully valid)
<ArticleJsonLd
  author="John Doe"
  publisher={{ name: "ACME Corp", logo: "logo.jpg" }}
/>
```

## Compatibility

| Feature | Original | Fork |
|---------|----------|------|
| Next.js 13-14 | ✓ | ✓ |
| Next.js 15+ | Partial | ✓ |
| TypeScript | Partial | ✓ |
| App Router | ✓ | ✓ |
| Pages Router | ✓ | ✓ |
| JSON-LD Components | 30+ | 30+ |

## Rollback

```bash
npm uninstall @opensourceframework/next-seo
npm install next-seo@7.x.x
```

## Support

- **Issues:** https://github.com/riceharvest/opensourceframework/issues
- **Discussions:** https://github.com/riceharvest/opensourceframework/discussions

## Changelog Highlights

### v7.3.4
- Next.js 15+ optimizations
- TypeScript 5.x support
- Enhanced JSON-LD processing

### v7.3.x
- 539+ unit tests
- Full TypeScript rewrite
- Improved @type detection
