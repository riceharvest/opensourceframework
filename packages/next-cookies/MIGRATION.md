# Migration Guide: next-cookies → @opensourceframework/next-cookies

## Overview

This guide helps you migrate from the original `next-cookies` package to the maintained fork `@opensourceframework/next-cookies`.

## Why Migrate?

- **Original package** has limited maintenance
- **This fork** has TypeScript support
- **Next.js 12-16** support
- **React 18/19** compatibility

## Migration Steps

### 1. Update Dependencies

```bash
# Remove original package
npm uninstall next-cookies

# Install maintained fork
npm install @opensourceframework/next-cookies

# or with pnpm
pnpm remove next-cookies
pnpm add @opensourceframework/next-cookies
```

### 2. Update Import Statements

The API remains the same:

```javascript
// Before
import { parseCookies, setCookie, removeCookie } from 'next-cookies'

// After - works exactly the same
import { parseCookies, setCookie, removeCookie } from '@opensourceframework/next-cookies'
```

### 3. Server-Side Usage

#### getServerSideProps

```javascript
// Before
import { parseCookies } from 'next-cookies'

export async function getServerSideProps(context) {
  const cookies = parseCookies(context)
  return { props: { token: cookies.token } }
}

// After - identical
import { parseCookies } from '@opensourceframework/next-cookies'

export async function getServerSideProps(context) {
  const cookies = parseCookies(context)
  return { props: { token: cookies.token } }
}
```

#### API Routes

```javascript
// Before
import { parseCookies, setCookie } from 'next-cookies'

export default function handler(req, res) {
  const cookies = parseCookies(req)
  setCookie(res, 'token', 'value', { path: '/' })
  res.end('OK')
}

// After - identical
import { parseCookies, setCookie } from '@opensourceframework/next-cookies'

export default function handler(req, res) {
  const cookies = parseCookies(req)
  setCookie(res, 'token', 'value', { path: '/' })
  res.end('OK')
}
```

#### Next.js 13+ App Router

```typescript
// Using Next.js 13+ built-in cookies
import { cookies } from 'next/headers'

export async function getData() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  return { token }
}
```

### 4. Client-Side Usage

```javascript
// Before
import { parseCookies } from 'next-cookies'
import { Component } from 'react'

class MyComponent extends Component {
  render() {
    return null
  }
}

export default parseCookies(MyComponent)

// After - use universal-cookie directly or context
// The fork recommends using universal-cookie for client-side
import Cookie from 'universal-cookie'

const cookies = new Cookie()
const value = cookies.get('token')
```

## API Reference

### parseCookies(request)
- **request:** Next.js request object (req in API routes, context in getServerSideProps)
- **Returns:** Object of cookies

### setCookie(response, name, value, options)
- **response:** Express response or Next.js response object
- **name:** Cookie name
- **value:** Cookie value
- **options:** { path, domain, expires, httpOnly, secure, sameSite }

### removeCookie(response, name, options)
- **response:** Express response or Next.js response object
- **name:** Cookie name
- **options:** { path, domain }

## Compatibility

| Feature | Original | Fork |
|---------|----------|------|
| Next.js 12 | ✓ | ✓ |
| Next.js 13-14 | ✓ | ✓ |
| Next.js 15-16 | Partial | ✓ |
| React 18 | ✓ | ✓ |
| React 19 | ✗ | ✓ |
| TypeScript | ✗ | ✓ |

## Rollback

```bash
npm uninstall @opensourceframework/next-cookies
npm install next-cookies@2.x.x
```

## Support

- **Issues:** https://github.com/riceharvest/opensourceframework/issues
- **Discussions:** https://github.com/riceharvest/opensourceframework/discussions

## Changelog Highlights

### v2.1.2
- TypeScript definitions added
- React 19 support

### v2.1.x
- ESM/CJS dual output
- Next.js 16 support
