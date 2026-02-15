/**
 * @opensourceframework/next-csrf
 * CSRF protection for Next.js applications
 * 
 * @original-author Juan Olvera (j0lv3r4)
 * @original-repo https://github.com/j0lv3r4/next-csrf
 * @license MIT
 */

import { parse } from 'cookie';
import type { IncomingMessage } from 'http';

/**
 * Extracts a cookie value by name from an incoming request
 * @param req - The incoming HTTP request
 * @param name - The name of the cookie to extract
 * @returns The cookie value or empty string if not found
 */
function getCookie(req: IncomingMessage, name: string): string {
  if (req.headers.cookie != null) {
    const parsedCookie = parse(req.headers.cookie);
    return parsedCookie[name] || '';
  }

  return '';
}

export { getCookie };