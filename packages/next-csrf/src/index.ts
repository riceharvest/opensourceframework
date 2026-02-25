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

import type { SerializeOptions } from 'cookie';
import type { NextApiHandler } from 'next';
import { csrf, setup } from './middleware';
import type { Middleware, NextCSRF, NextCsrfOptions } from './types';

/**
 * Default cookie options for CSRF cookies
 */
const cookieDefaultOptions: SerializeOptions = {
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
  regenerateToken: true,
};

function nextCsrf(userOptions: NextCsrfOptions = {}): NextCSRF {
  const options = {
    ...defaultOptions,
    ...userOptions,
  };

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
        regenerateToken: options.regenerateToken,
      })) as Middleware,
  };
}

export { nextCsrf };
export type { CsrfErrorCode, CsrfErrorDetails, Middleware, NextCSRF, NextCsrfOptions } from './types';
export { CsrfErrorCodes } from './types';
export { csrf, setup } from './middleware';
export { HttpError } from './utils';
