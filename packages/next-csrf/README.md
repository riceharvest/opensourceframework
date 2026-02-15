# @opensourceframework/next-csrf

[![npm version](https://badge.fury.io/js/@opensourceframework/next-csrf.svg)](https://badge.fury.io/js/@opensourceframework/next-csrf)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> CSRF protection for Next.js applications

This is a **maintained fork** of the original [`next-csrf`](https://github.com/j0lv3r4/next-csrf) package by [Juan Olvera (j0lv3r4)](https://github.com/j0lv3r4). The original package was last updated in April 2023 and has been archived. This fork continues maintenance with updates for Next.js 14-16 support and TypeScript improvements.

## Attribution

- **Original Author**: [Juan Olvera](https://github.com/j0lv3r4)
- **Original Repository**: https://github.com/j0lv3r4/next-csrf
- **Original License**: MIT

## Features

- **Synchronizer Token Pattern**: Implements CSRF mitigation using the [Synchronizer Token Pattern](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern)
- **Signed Cookies**: Optional cookie signing for enhanced security
- **Next.js Integration**: Works with both Pages Router (API routes, getServerSideProps) and App Router
- **TypeScript Support**: Full TypeScript support with type definitions
- **Customizable**: Configurable token keys, error messages, and cookie options

## Installation

```bash
# npm
npm install @opensourceframework/next-csrf

# yarn
yarn add @opensourceframework/next-csrf

# pnpm
pnpm add @opensourceframework/next-csrf
```

## Quick Start

### 1. Create a CSRF configuration file

```typescript
// lib/csrf.ts
import { nextCsrf } from '@opensourceframework/next-csrf';

const { csrf, setup } = nextCsrf({
  // Required: A secret key for signing cookies (use environment variable in production)
  secret: process.env.CSRF_SECRET,
  
  // Optional: Customize the token cookie name (default: 'XSRF-TOKEN')
  tokenKey: 'XSRF-TOKEN',
  
  // Optional: Custom error message (default: 'Invalid CSRF token')
  csrfErrorMessage: 'Invalid CSRF token',
  
  // Optional: Methods to ignore (default: ['GET', 'HEAD', 'OPTIONS'])
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  
  // Optional: Cookie options
  cookieOptions: {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
});

export { csrf, setup };
```

### 2. Set up tokens on initial page load

For Pages Router:

```typescript
// pages/login.tsx
import { setup } from '../lib/csrf';

function LoginPage() {
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    const response = await fetch('/api/protected', {
      method: 'POST',
    });
    
    if (response.ok) {
      console.log('Request succeeded with CSRF protection');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Submit</button>
    </form>
  );
}

// Setup CSRF tokens on this page
export const getServerSideProps = setup(async ({ req, res }) => {
  return { props: {} };
});

export default LoginPage;
```

### 3. Protect API routes

```typescript
// pages/api/protected.ts
import { csrf } from '../../lib/csrf';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  return res.status(200).json({ 
    message: 'This API route is protected with CSRF!' 
  });
};

export default csrf(handler);
```

## API Reference

### `nextCsrf(options)`

Creates CSRF middleware functions.

**Parameters:**

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `secret` | `string` | - | Secret key for signing cookies. Recommended for production. |
| `tokenKey` | `string` | `'XSRF-TOKEN'` | Name of the CSRF token cookie. |
| `csrfErrorMessage` | `string` | `'Invalid CSRF token'` | Error message for invalid tokens. |
| `ignoredMethods` | `string[]` | `['GET', 'HEAD', 'OPTIONS']` | HTTP methods to skip CSRF validation. |
| `cookieOptions` | `CookieSerializeOptions` | See below | Cookie serialization options. |

**Default Cookie Options:**

```javascript
{
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
}
```

**Returns:**

An object with two middleware functions:

- `setup` - Middleware to create and set CSRF tokens
- `csrf` - Middleware to validate CSRF tokens

### `setup(handler)`

Middleware that creates CSRF secret and token cookies.

- Works with both API routes (`req, res`) and `getServerSideProps` (`context`)
- Creates two cookies: `csrfSecret` and the token cookie (default: `XSRF-TOKEN`)
- If `secret` option is provided, the token is signed

### `csrf(handler)`

Middleware that validates CSRF tokens on incoming requests.

- Skips validation for ignored methods (default: GET, HEAD, OPTIONS)
- Validates token against secret
- Verifies signed tokens if `secret` was provided
- Generates a new token after successful validation

### `HttpError`

Custom error class for CSRF-related HTTP errors.

```typescript
import { HttpError } from '@opensourceframework/next-csrf';

throw new HttpError(403, 'Custom error message');
```

## Migration from `next-csrf`

If you're migrating from the original `next-csrf` package:

### 1. Update imports

```diff
- import { nextCsrf } from 'next-csrf';
+ import { nextCsrf } from '@opensourceframework/next-csrf';
```

### 2. Update package.json

```diff
- "next-csrf": "^0.2.1"
+ "@opensourceframework/next-csrf": "^0.2.2"
```

### 3. No code changes required

The API is fully compatible with the original package.

## Security Considerations

1. **Always use a secret in production**: Set `secret` to a cryptographically secure random string.

2. **Use HTTPS in production**: Set `secure: true` in cookie options for production environments.

3. **Regenerate tokens**: The middleware automatically regenerates tokens after each validated request.

4. **Session invalidation**: If you change the `secret`, all existing sessions will be invalidated.

5. **Cookie settings**: The default settings (`httpOnly: true`, `sameSite: 'lax'`) provide good baseline security.

## Compatibility

- **Next.js**: 12.x, 13.x, 14.x, 15.x, 16.x
- **Node.js**: 18.x or higher
- **TypeScript**: 5.x

## How It Works

The package implements the [Synchronizer Token Pattern](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern):

1. **Setup Phase**: When a user visits a page with CSRF setup, the middleware:
   - Generates a unique CSRF secret
   - Creates a token from the secret
   - Stores both in HTTP-only cookies
   - Optionally signs the token with your secret

2. **Validation Phase**: When a user submits a request:
   - The middleware extracts the token from cookies
   - If signed, it verifies the signature
   - It validates the token against the secret
   - If valid, it generates a new token for the next request

## Development

```bash
# Install dependencies
pnpm install

# Build the package
pnpm build

# Run tests
pnpm test

# Run tests with coverage
pnpm test:coverage

# Type checking
pnpm typecheck
```

## License

MIT License - See [LICENSE](../../LICENSE) for details.

## Credits

- Original implementation by [Juan Olvera](https://github.com/j0lv3r4)
- Maintained by the [OpenSource Framework](https://github.com/opensourceframework) team

## Contributing

Contributions are welcome! Please read the [contributing guidelines](../../CONTRIBUTING.md) first.