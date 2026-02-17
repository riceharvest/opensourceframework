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
 * @returns The cookie value, empty string if cookie exists but is empty, or null if not found
 */
function getCookie(req: IncomingMessage, name: string): string | null {
  if (req.headers.cookie != null) {
    const parsedCookie = parse(req.headers.cookie);
    if (Object.prototype.hasOwnProperty.call(parsedCookie, name)) {
      return parsedCookie[name] as string;
    }
    return null;
  }

  return null;
}

export { getCookie };