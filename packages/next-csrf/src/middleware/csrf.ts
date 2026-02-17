/**
 * @opensourceframework/next-csrf
 * CSRF protection for Next.js applications
 * 
 * @original-author Juan Olvera (j0lv3r4)
 * @original-repo https://github.com/j0lv3r4/next-csrf
 * @license MIT
 */

import { HttpError } from '../utils';
import { serialize, parse } from 'cookie';
import { sign, unsign } from 'cookie-signature';
import { createToken } from '../utils/create-token';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import type { MiddlewareArgs } from '../types';
import { CsrfErrorCodes, type CsrfErrorCode } from '../types';

/**
 * Creates a CSRF error with a specific code for better debugging and logging
 * while keeping the response message generic for security.
 * 
 * @param code - Specific error code for identification
 * @param genericMessage - Generic message to show in response (from config)
 * @returns HttpError with code attached for logging purposes
 */
const createCsrfError = (code: CsrfErrorCode, genericMessage: string): HttpError => {
  const error = new HttpError(403, genericMessage) as HttpError & { code: CsrfErrorCode };
  error.code = code;
  return error;
};

/**
 * CSRF validation middleware for Next.js API routes
 * 
 * This middleware validates CSRF tokens on incoming requests using the
 * Synchronizer Token Pattern (double submit cookie pattern).
 * 
 * @param handler - The Next.js API route handler
 * @param options - Middleware configuration options
 * @returns Wrapped handler with CSRF protection
 * 
 * @see https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#synchronizer-token-pattern
 */
const csrf = (
  handler: NextApiHandler,
  {
    ignoredMethods,
    csrfErrorMessage,
    tokenKey,
    cookieOptions,
    secret,
    regenerateToken,
  }: MiddlewareArgs
) => async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    // Validate request method exists
    if (typeof req.method !== 'string') {
      throw createCsrfError(CsrfErrorCodes.GENERIC, csrfErrorMessage);
    }

    // Skip CSRF validation for ignored methods (typically safe methods like GET, HEAD, OPTIONS)
    // Use case-insensitive comparison for robustness (HTTP methods are case-sensitive per RFC 7231,
    // but Node.js/Next.js normalizes to uppercase, and we want to handle edge cases gracefully)
    const methodUpper = req.method.toUpperCase();
    if (ignoredMethods.some(m => m.toUpperCase() === methodUpper)) {
      await handler(req, res);
      return;
    }

    // Fail if no cookie is present
    if (req.headers?.cookie === undefined) {
      throw createCsrfError(CsrfErrorCodes.MISSING_COOKIE_HEADER, csrfErrorMessage);
    }

    const cookie = parse(req.headers.cookie);
    
    // Extract token and secret from cookies
    let token = cookie[tokenKey];
    const csrfSecret = cookie['csrfSecret'];

    // Check token exists in cookie
    if (!token) {
      throw createCsrfError(CsrfErrorCodes.MISSING_TOKEN, csrfErrorMessage);
    }

    // Check csrfSecret exists
    if (!csrfSecret) {
      throw createCsrfError(CsrfErrorCodes.MISSING_SECRET, csrfErrorMessage);
    }

    // If a secret was provided, the cookie is signed
    // Unsign and verify (Synchronizer token pattern)
    if (secret != null) {
      const unsignedToken = unsign(token, secret);

      // Validate signature - this indicates tampering or corruption
      if (!unsignedToken) {
        throw createCsrfError(CsrfErrorCodes.INVALID_SIGNATURE, csrfErrorMessage);
      }

      token = unsignedToken;
    }

    // Verify CSRF token against the secret
    if (!createToken.verify(csrfSecret, token)) {
      throw createCsrfError(CsrfErrorCodes.VERIFICATION_FAILED, csrfErrorMessage);
    }

    // Token is valid - regenerate if configured (default: true)
    // Setting regenerateToken to false can help with concurrent requests or back-button navigation
    if (regenerateToken) {
      let newToken: string;
      if (secret != null) {
        // Sign if secret is present
        newToken = sign(createToken.create(csrfSecret), secret);
      } else {
        newToken = createToken.create(csrfSecret);
      }

      res.setHeader('Set-Cookie', serialize(tokenKey, newToken, cookieOptions));
    }

    await handler(req, res);
  } catch (error) {
    // Explicitly handle non-HttpError exceptions with 403 Forbidden default
    const httpError = error instanceof HttpError 
      ? error 
      : createCsrfError(CsrfErrorCodes.GENERIC, csrfErrorMessage);
    
    // Include error code in response for client-side handling
    const errorResponse = {
      message: httpError.message,
      code: (httpError as HttpError & { code?: CsrfErrorCode }).code || CsrfErrorCodes.GENERIC,
    };
    
    res.status(httpError.status).json(errorResponse);
  }
};

export { csrf };