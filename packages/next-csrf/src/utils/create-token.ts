/**
 * @opensourceframework/next-csrf
 * CSRF protection for Next.js applications
 * 
 * @original-author Juan Olvera (j0lv3r4)
 * @original-repo https://github.com/j0lv3r4/next-csrf
 * @license MIT
 */

import Tokens from 'csrf';

/**
 * CSRF token manager using the `csrf` library
 * Handles token creation, verification, and secret generation
 */
const createToken = new Tokens();

export { createToken };