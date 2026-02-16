/**
 * @opensourceframework/next-csrf
 * CSRF protection for Next.js applications
 * 
 * @original-author Juan Olvera (j0lv3r4)
 * @original-repo https://github.com/j0lv3r4/next-csrf
 * @license MIT
 */

import type { CookieSerializeOptions } from 'cookie';

/**
 * Configuration options for the nextCsrf function
 */
export interface NextCsrfOptions {
  /** HTTP methods to ignore (skip CSRF validation). Default: ["GET", "HEAD", "OPTIONS"] */
  ignoredMethods?: string[];
  /** Error message to return for unauthorized requests. Default: "Invalid CSRF token" */
  csrfErrorMessage?: string;
  /** The name of the cookie to store the CSRF token. Default: "XSRF-TOKEN" */
  tokenKey?: string;
  /** Cookie serialization options. Default: { httpOnly: true, path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production" } */
  cookieOptions?: CookieSerializeOptions;
  /** Secret key for signing cookies. Optional but recommended for production. */
  secret?: string;
}

/**
 * Arguments passed to the CSRF middleware
 * Extends NextCsrfOptions with required fields
 */
export interface MiddlewareArgs extends Required<Omit<NextCsrfOptions, 'secret'>> {
  cookieOptions: CookieSerializeOptions;
  secret?: string;
}

/**
 * Arguments passed to the setup middleware
 */
export interface SetupMiddlewareArgs {
  tokenKey: string;
  cookieOptions: CookieSerializeOptions;
  secret?: string;
}

/**
 * Type for the middleware function
 */
export type Middleware = (handler: NextApiHandler) => NextApiHandler;

/**
 * Return type of the nextCsrf function
 */
export interface NextCSRF {
  /** Setup middleware - creates CSRF token and secret cookies */
  setup: Middleware;
  /** CSRF validation middleware - validates tokens on requests */
  csrf: Middleware;
}

// Import NextApiHandler type conditionally to support both Pages Router and standalone usage
import type { NextApiHandler } from 'next';
