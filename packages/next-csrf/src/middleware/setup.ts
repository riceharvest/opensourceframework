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
  GetServerSidePropsResult,
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

type Setup = {
  (handler: NextApiHandler, options: SetupMiddlewareArgs): (
    req: NextApiRequest,
    res: NextApiResponse
  ) => Promise<void>;
  <P extends { [key: string]: unknown } = { [key: string]: unknown }>(
    handler: (context: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<P>>,
    options: SetupMiddlewareArgs
  ): (context: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<P>>;
};

export const setup: Setup = function setup(
  handler: NextApiHandler | ((context: GetServerSidePropsContext) => Promise<unknown>),
  { secret, tokenKey, cookieOptions }: SetupMiddlewareArgs
): ((req: NextApiRequest, res: NextApiResponse) => Promise<void>) | ((context: GetServerSidePropsContext) => Promise<unknown>) {
  // Internal type guards for discriminating between API routes and getServerSideProps
  const isApiRouteArgs = (args: unknown[]): args is [NextApiRequest, NextApiResponse] => {
    return args.length === 2;
  };

  const isServerSidePropsArgs = (args: unknown[]): args is [GetServerSidePropsContext] => {
    return args.length === 1;
  };

  return async (...args: unknown[]): Promise<unknown> => {
    // Use type guards for type-safe argument handling
    let req: NextApiRequest | GetServerSidePropsContext['req'];
    let res: NextApiResponse | GetServerSidePropsContext['res'];

    if (isApiRouteArgs(args)) {
      req = args[0];
      res = args[1];
    } else if (isServerSidePropsArgs(args)) {
      req = args[0].req;
      res = args[0].res;
    } else {
      throw new Error('Invalid arguments: expected (req, res) or (context)');
    }

    // Get existing CSRF secret or generate a new one
    const csrfSecret = getSecret(req as NextApiRequest, 'csrfSecret') || createToken.secretSync();
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

    // Call the original handler with the appropriate arguments
    if (isApiRouteArgs(args)) {
      return (handler as NextApiHandler)(args[0], args[1]);
    } else {
      return (handler as (context: GetServerSidePropsContext) => Promise<unknown>)(args[0]);
    }
  };
};
