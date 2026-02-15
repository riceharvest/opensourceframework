/**
 * @opensourceframework/next-csrf
 * CSRF protection for Next.js applications
 * 
 * @original-author Juan Olvera (j0lv3r4)
 * @original-repo https://github.com/j0lv3r4/next-csrf
 * @license MIT
 */

import { getCookie } from './get-cookie';
import type { IncomingMessage } from 'http';

/**
 * Retrieves the CSRF secret from the request cookies
 * The secret is stored in a cookie named after the tokenKey in lowercase
 * @param req - The incoming HTTP request
 * @param tokenKey - The token key used to derive the secret cookie name
 * @returns The CSRF secret or empty string if not found
 */
const getSecret = (req: IncomingMessage, tokenKey: string): string => {
  return getCookie(req, tokenKey.toLowerCase());
};

export { getSecret };