/**
 * @opensourceframework/next-csrf
 * CSRF protection for Next.js applications
 * 
 * @original-author Juan Olvera (j0lv3r4)
 * @original-repo https://github.com/j0lv3r4/next-csrf
 * @license MIT
 * 
 * This package is a maintained fork of the original next-csrf package.
 * It provides CSRF protection for Next.js applications using the
 * Synchronizer Token Pattern.
 */

import type { NextApiHandler } from 'next';
import { csrf, setup } from './middleware';
import type { NextCsrfOptions, NextCSRF, Middleware } from './types';
import type { CookieSerializeOptions } from 'cookie';

/**
 * Default cookie options for CSRF cookies
 * These provide a secure baseline configuration
 */
const cookieDefaultOptions: CookieSerializeOptions = {
  httpOnly: true,
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

/**
 * Default options for CSRF middleware
 */
const defaultOptions: Required<Omit<NextCsrfOptions, 'secret'>> = {
  tokenKey: 'XSRF-TOKEN',
  csrfErrorMessage: 'Invalid CSRF token',
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  cookieOptions: cookieDefaultOptions,
};

/**
 * Creates CSRF protection middleware for Next.js applications
 * 
 * This function initializes CSRF protection and returns two middleware functions:
 * - `setup`: Creates and sets CSRF token and secret cookies (use on login/initial page load)
 * - `csrf`: Validates CSRF tokens on protected routes (use on API routes)
 * 
 * @param userOptions - Configuration options for CSRF protection
 * @returns Object containing setup and csrf middleware functions
 * 
 * @example
 * ```typescript
 * // lib/csrf.ts
 * import { nextCsrf } from '@opensourceframework/next-csrf';
 * 
 * const { csrf, setup } = nextCsrf({
 *   secret: process.env.CSRF_SECRET,
 *   tokenKey: 'XSRF-TOKEN',
 * });
 * 
 * export { csrf, setup };
 * ```
 * 
 * @example
 * ```typescript
 * // pages/api/protected.ts
 * import { csrf } from '../../lib/csrf';
 * 
 * const handler = (req, res) => {
 *   return res.status(200).json({ message: 'Protected data' });
 * };
 * 
 * export default csrf(handler);
 * ```
 * 
 * @example
 * ```typescript
 * // pages/login.ts (getServerSideProps)
 * import { setup } from '../lib/csrf';
 * 
 * function LoginPage() {
 *   // ... component code
 * }
 * 
 * export const getServerSideProps = setup(async ({ req, res }) => {
 *   return { props: {} };
 * });
 * 
 * export default LoginPage;
 * ```
 */
function nextCsrf(userOptions: NextCsrfOptions = {}): NextCSRF {
  const options = {
    ...defaultOptions,
    ...userOptions,
  };

  // Generate middleware functions
  return {
    setup: ((handler: NextApiHandler) =>
      setup(handler, {
        tokenKey: options.tokenKey,
        cookieOptions: options.cookieOptions,
        secret: userOptions.secret,
      })) as Middleware,
      
    csrf: ((handler: NextApiHandler) =>
      csrf(handler, {
        tokenKey: options.tokenKey,
        csrfErrorMessage: options.csrfErrorMessage,
        ignoredMethods: options.ignoredMethods,
        cookieOptions: options.cookieOptions,
        secret: userOptions.secret,
      })) as Middleware,
  };
}

// Export main function and types
export { nextCsrf };

// Re-export types for consumers
export type { NextCsrfOptions, NextCSRF, Middleware } from './types';

// Export middleware for direct access if needed
export { csrf, setup } from './middleware';

// Export utilities for advanced use cases
export { HttpError } from './utils';