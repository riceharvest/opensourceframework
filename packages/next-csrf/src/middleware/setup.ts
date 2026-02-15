/**
 * @opensourceframework/next-csrf
 * CSRF protection for Next.js applications
 * 
 * @original-author Juan Olvera (j0lv3r4)
 * @original-repo https://github.com/j0lv3r4/next-csrf
 * @license MIT
 */

import type {
  GetServerSidePropsContext,
  NextApiHandler,
  NextApiRequest,
  NextApiResponse,
} from 'next';
import type { SetupMiddlewareArgs } from '../types';
import { createToken } from '../utils/create-token';
import { sign } from 'cookie-signature';
import { serialize } from 'cookie';
import { getSecret } from '../utils/get-secret';

/**
 * Union type for setup middleware arguments
 * Supports both API routes (req, res) and getServerSideProps (context)
 */
type SetupArgs =
  | [NextApiRequest, NextApiResponse]
  | [GetServerSidePropsContext];

/**
 * Setup middleware for initializing CSRF tokens
 * 
 * This middleware creates and sets CSRF secret and token cookies.
 * It works with both Next.js API routes and getServerSideProps.
 * 
 * @param handler - The Next.js API route handler or getServerSideProps handler
 * @param options - Setup middleware configuration options
 * @returns Wrapped handler with CSRF token setup
 * 
 * @example
 * // API Route usage
 * export default setup(handler, { secret, tokenKey, cookieOptions });
 * 
 * @example
 * // getServerSideProps usage
 * export const getServerSideProps = setup(async ({ req, res }) => {
 *   return { props: {} };
 * });
 */
const setup = (
  handler: NextApiHandler,
  { secret, tokenKey, cookieOptions }: SetupMiddlewareArgs
) => async (...args: SetupArgs): Promise<void> => {
  // Determine if this is an API route (req, res) or getServerSideProps (context)
  const isApi = args.length > 1;

  const req = isApi
    ? (args[0] as NextApiRequest)
    : (args[0] as GetServerSidePropsContext).req;
  const res = isApi
    ? (args[1] as NextApiResponse)
    : (args[0] as GetServerSidePropsContext).res;

  // Get existing CSRF secret or generate a new one
  const csrfSecret = getSecret(req, 'csrfSecret') || createToken.secretSync();
  const unsignedToken = createToken.create(csrfSecret);

  // Sign token if secret is provided
  // Note: Changing the backend secret will invalidate all existing sessions
  let token: string;
  if (secret != null) {
    token = sign(unsignedToken, secret);
  } else {
    token = unsignedToken;
  }

  // Set both cookies: csrfSecret and token
  res.setHeader('Set-Cookie', [
    serialize('csrfSecret', csrfSecret, cookieOptions),
    serialize(tokenKey, token, cookieOptions),
  ]);

  await handler(req as NextApiRequest, res as NextApiResponse);
};

export { setup };