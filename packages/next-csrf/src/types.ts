/**
 * @opensourceframework/next-csrf
 * CSRF protection for Next.js applications
 * 
 * @original-author Juan Olvera (j0lv3r4)
 * @original-repo https://github.com/j0lv3r4/next-csrf
 * @license MIT
 */

import type { SerializeOptions } from 'cookie';

/**
 * Configuration options for the nextCsrf function
 * 
 * This implementation uses the Double Submit Cookie pattern where:
 * - A CSRF secret is stored in an httpOnly cookie (csrfSecret)
 * - A CSRF token is stored in a cookie (XSRF-TOKEN by default)
 * - Both cookies are validated server-side on each request
 * - The token is rotated after each successful validation
 * 
 * @see https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie
 */
export interface NextCsrfOptions {
  /** 
   * HTTP methods to ignore (skip CSRF validation). 
   * Methods are compared case-insensitively.
   * Default: ["GET", "HEAD", "OPTIONS"] 
   */
  ignoredMethods?: string[];
  /** Error message to return for unauthorized requests. Default: "Invalid CSRF token" */
  csrfErrorMessage?: string;
  /** The name of the cookie to store the CSRF token. Default: "XSRF-TOKEN" */
  tokenKey?: string;
  /** 
   * Cookie serialization options.
   * 
   * Default: { httpOnly: false, path: "/", sameSite: "lax", secure: process.env.NODE_ENV === "production" }
   * 
   * Note on httpOnly: The token cookie is client-readable by default so frontend code
   * can submit it in a request header/body/query for double-submit validation.
   * The internal csrfSecret cookie is always set as httpOnly.
   * 
   * Important: The sameSite: 'lax' setting provides additional CSRF protection by
   * preventing cookies from being sent with cross-site POST requests.
   */
  cookieOptions?: SerializeOptions;
  /** Secret key for signing cookies. Optional but recommended for production. */
  secret?: string;
  /**
   * Whether to regenerate the CSRF token after each successful validation.
   * Default: true
   * 
   * Setting this to false can help with concurrent requests or back-button navigation,
   * but reduces security slightly as the same token is used for multiple requests.
   */
  regenerateToken?: boolean;
}

/**
 * Arguments passed to the CSRF middleware
 * Extends NextCsrfOptions with required fields
 */
export interface MiddlewareArgs extends Required<Omit<NextCsrfOptions, 'secret'>> {
  cookieOptions: SerializeOptions;
  secret?: string;
}

/**
 * Arguments passed to the setup middleware
 */
export interface SetupMiddlewareArgs {
  tokenKey: string;
  cookieOptions: SerializeOptions;
  secret?: string;
}

/**
 * Type for the middleware function
 */
export type Middleware = (handler: NextApiHandler) => NextApiHandler;

/**
 * CSRF error codes for specific error identification
 * These codes help with debugging and logging while keeping error messages
 * generic for security (to avoid exposing implementation details to attackers)
 */
export const CsrfErrorCodes = {
  /** No cookie header present in request */
  MISSING_COOKIE_HEADER: 'ECSRFMissingCookie',
  /** CSRF token not found in cookie */
  MISSING_TOKEN: 'ECSRFMissingToken',
  /** CSRF token not found in request header/body/query */
  MISSING_REQUEST_TOKEN: 'ECSRFMissingRequestToken',
  /** CSRF secret not found in cookie */
  MISSING_SECRET: 'ECSRFMissingSecret',
  /** Token signature verification failed */
  INVALID_SIGNATURE: 'ECSRFInvalidSignature',
  /** Request token does not match the cookie token */
  TOKEN_MISMATCH: 'ECSRFMismatchedToken',
  /** Token verification against secret failed */
  VERIFICATION_FAILED: 'ECSRFVerificationFailed',
  /** Generic/unknown CSRF error */
  GENERIC: 'ECSRFToken',
} as const;

export type CsrfErrorCode = typeof CsrfErrorCodes[keyof typeof CsrfErrorCodes];

/**
 * Detailed CSRF error information for logging and debugging
 */
export interface CsrfErrorDetails {
  /** Error code for programmatic handling */
  code: CsrfErrorCode;
  /** Human-readable message (generic for security) */
  message: string;
  /** HTTP status code (always 403 for CSRF failures) */
  status: 403;
}

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
