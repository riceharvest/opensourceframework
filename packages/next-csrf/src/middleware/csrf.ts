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
  }: MiddlewareArgs
) => async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
  try {
    // Validate request method exists
    if (typeof req.method !== 'string') {
      throw new HttpError(403, csrfErrorMessage);
    }

    // Skip CSRF validation for ignored methods (typically safe methods like GET, HEAD, OPTIONS)
    if (ignoredMethods.includes(req.method)) {
      await handler(req, res);
      return;
    }

    // Fail if no cookie is present
    if (req.headers?.cookie === undefined) {
      throw new HttpError(403, csrfErrorMessage);
    }

    const cookie = parse(req.headers.cookie);
    
    // Extract token and secret from cookies
    let token = cookie[tokenKey];
    const csrfSecret = cookie['csrfSecret'];

    // Check token exists in cookie
    if (!token) {
      throw new HttpError(403, csrfErrorMessage);
    }

    // Check csrfSecret exists
    if (!csrfSecret) {
      throw new HttpError(403, csrfErrorMessage);
    }

    // If a secret was provided, the cookie is signed
    // Unsign and verify (Synchronizer token pattern)
    if (secret != null) {
      const unsignedToken = unsign(token, secret);

      // Validate signature
      if (!unsignedToken) {
        throw new HttpError(403, csrfErrorMessage);
      }

      token = unsignedToken;
    }

    // Verify CSRF token against the secret
    if (!createToken.verify(csrfSecret, token)) {
      throw new HttpError(403, csrfErrorMessage);
    }

    // Token is valid - generate a new one and save it in the cookie
    let newToken: string;
    if (secret != null) {
      // Sign if secret is present
      newToken = sign(createToken.create(csrfSecret), secret);
    } else {
      newToken = createToken.create(csrfSecret);
    }

    res.setHeader('Set-Cookie', serialize(tokenKey, newToken, cookieOptions));

    await handler(req, res);
  } catch (error) {
    const httpError = error as HttpError;
    res.status(httpError.status ?? 500).json({ message: httpError.message });
  }
};

export { csrf };