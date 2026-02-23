# NextAuth.js v3.29.9 Legacy Support Audit Report

**Target:** Next.js 16/17 Compatibility  
**Version Audited:** next-auth@v3.29.9  
**Date:** February 2026

---

## Executive Summary

**NOT COMPATIBLE** with Next.js 16/17 or React 18/19.

NextAuth.js v3 (v3.29.9) was designed for Next.js Pages Router and React 16/17. It has **critical incompatibilities** with modern Next.js and React versions. Migration to next-auth v4+ is strongly recommended.

---

## 1. React 18/19 Compatibility Issues

### 1.1 Peer Dependency Conflicts

**File:** `packages/next-auth/package.json:79-82`

```json
"peerDependencies": {
  "react": "^16.13.1 || ^17",
  "react-dom": "^16.13.1 || ^17"
}
```

- **CRITICAL:** React 18 and 19 are NOT supported
- React 18 introduced strict mode changes and double-invocation of effects
- React 19 adds additional breaking changes

### 1.2 Hydration Error Risks

**Files:**
- `src/client/index.js:54-76` - Direct `document` access without SSR guards
- `src/client/index.js:375-380` - Direct `localStorage` access

```javascript
// src/client/index.js:54 - Runs in module scope
if (typeof window !== "undefined" && !__NEXTAUTH._eventListenersAdded) {
  document.addEventListener(...)  // Can cause hydration mismatch
}

// src/client/index.js:375
if (typeof localStorage === "undefined") return
localStorage.setItem(...)  // Direct browser API access
```

**Issues:**
- Direct DOM access in module scope can cause hydration mismatches in React 18+
- No `'use client'` directive present (not supported in this version)
- `useState` and `useEffect` used without client boundary markers

### 1.3 Missing `'use client'` Directive

- **No `'use client'` found anywhere in the codebase**
- This is required for React Server Components (RSC) compatibility in Next.js 13+
- All client components would need `"use client"` added

### 1.4 Preact Usage

**File:** `packages/next-auth/package.json:75-76`

```json
"preact": "^10.4.1",
"preact-render-to-string": "^5.1.14",
```

- Uses Preact for server-side rendering of built-in pages
- Preact has its own compatibility layer but may conflict with React 18+ concurrent features

---

## 2. Next.js App Router / Route Handlers Support

### 2.1 No App Router Support

- **NO** `app/` directory found
- **NO** route handlers (`.js`, `.ts` files in `app/api/`)
- Zero compatibility with Next.js 13+ App Router

### 2.2 Pages Router Only

**Evidence:**
- Uses `[...nextauth].js` dynamic API route (Pages Router pattern)
- Uses `pages/_app.js` for Provider wrapper
- Uses `getServerSideProps` for protected pages
- Uses `getInitialProps` pattern

**File:** `src/client/index.js:311-315`
```javascript
/**
 * If passed 'appContext' via getInitialProps() in _app.js
 * then get the req object from ctx and use that for the
 * req value to allow _fetchData to work seemlessly in
 * getInitialProps() on server side pages *and* in _app.js.
 */
```

**Pattern Used:**
```javascript
// pages/_app.js - Classic pattern
import { Provider } from "next-auth/client"
export default function App({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  )
}
```

### 2.3 API Route Structure

**File:** `src/server/index.js:56-62`

```javascript
if (!req.query.nextauth) {
  const error = "Cannot find [...nextauth].js in pages/api/auth."
  return res.status(500).end(`Error: ${error}`)
}
```

- Expects file at `pages/api/auth/[...nextauth].js`
- App Router uses `app/api/auth/[...nextauth]/route.ts` instead

---

## 3. Peer Dependency Conflicts

### 3.1 Outdated DevDependencies

**File:** `packages/next-auth/package.json:91-130`

| Package | v3.29.9 | Modern Minimum |
|---------|---------|----------------|
| next | ^11.0.1 | 14.x, 15.x |
| react | ^17.0.2 | 18.x, 19.x |
| react-dom | ^17.0.2 | 18.x, 19.x |
| @babel/runtime | ^7.14.0 | ^7.23.x |
| typescript | ^4.1.3 | ^5.x |

### 3.2 Build System Issues

**File:** `packages/next-auth/package.json:32-34`

```json
"build:js": "node ./config/build.js && babel --config-file ./config/babel.config.js src --out-dir dist",
```

- Uses Babel 7 (outdated)
- Modern Next.js uses SWC/Turbo for builds
- No TypeScript native support (uses Babel for TS)

### 3.3 Adapter Compatibility

**File:** `packages/next-auth/package.json:83-89`

```json
"peerOptionalDependencies": {
  "mongodb": "^3.5.9",
  "mysql": "^2.18.1",
  "mssql": "^6.2.1",
  "pg": "^8.2.1",
  "@prisma/client": "^2.16.1"
}
```

- Prisma 2.x is extremely outdated (current: 5.x)
- Database drivers are legacy versions

---

## 4. Breaking Changes Summary

| Feature | v3 Status | Next.js 16/17 | Recommendation |
|---------|-----------|---------------|----------------|
| Pages Router | Supported | Deprecated | Use App Router |
| App Router | Not Supported | Required | Upgrade to v4+ |
| React 17 | Supported | Unsupported | Use React 18+ |
| React 18/19 | Not Supported | Required | Upgrade to v4+ |
| Route Handlers | Not Supported | Required | Upgrade to v4+ |
| useClient | Not Available | Required | Upgrade to v4+ |
| getServerSideProps | Supported | Works | Still works in v4 |
| getInitialProps | Supported | Deprecated | Refactor in v4+ |

---

## 5. Recommendations

### Immediate Actions

1. **DO NOT USE** next-auth v3 with Next.js 16/17
2. **UPGRADE** to next-auth v4 or v5 (beta) for App Router support
3. **MIGRATE** from `pages/` directory to `app/` directory
4. **ADD** `'use client'` to all client components

### Migration Path

1. Install next-auth v4+: `npm install next-auth@^4`
2. Move API route: `pages/api/auth/[...nextauth].js` → `app/api/auth/[...nextauth]/route.ts`
3. Replace `_app.js` Provider with SessionProvider from `next-auth/react`
4. Replace `getServerSideProps` with Next.js 13+ patterns (Server Components)
5. Update peer dependencies for React 18+

---

## Conclusion

**NextAuth.js v3.29.9 is fundamentally incompatible with Next.js 16/17.**

The library was architected for the Pages Router era (Next.js 10-12) and React 16/17. It lacks:
- App Router support
- Route Handlers  
- React 18/19 compatibility
- `'use client'` directive support
- Modern build tooling

**Recommendation:** Use next-auth v4+ which provides proper Next.js 13+ support, or accept v3 limitations with Next.js 11-12 only.

---

*Audit performed on cloned repository at tag `next-auth@v3.29.9`*
