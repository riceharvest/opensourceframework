import { describe, expect, it } from 'vitest';
import { serialize } from 'cookie';
import { sign } from 'cookie-signature';
import type { NextApiRequest, NextApiResponse } from 'next';
import { csrf } from '../src/middleware';
import { createToken } from '../src/utils/create-token';
import { CsrfErrorCodes } from '../src/types';

type MockResponse = NextApiResponse & {
  statusCode: number;
  payload?: unknown;
  headers: Record<string, string | string[]>;
};

function createMockResponse(): MockResponse {
  const headers: Record<string, string | string[]> = {};
  const res = {
    statusCode: 200,
    headers,
    setHeader(name: string, value: string | string[]) {
      headers[name] = value;
      return this;
    },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.payload = payload;
      return this;
    },
  } as unknown as MockResponse;
  return res;
}

function createMockRequest(
  method: string,
  cookieHeader: string,
  extraHeaders?: Record<string, string>,
  body: unknown = {}
): NextApiRequest {
  return {
    method,
    headers: {
      cookie: cookieHeader,
      ...extraHeaders,
    },
    body,
    query: {},
  } as unknown as NextApiRequest;
}

describe('csrf middleware', () => {
  const tokenKey = 'XSRF-TOKEN';
  const baseOptions = {
    ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
    csrfErrorMessage: 'Invalid CSRF token',
    tokenKey,
    cookieOptions: { path: '/', sameSite: 'lax' as const, httpOnly: false },
    regenerateToken: false,
    secret: undefined,
  };

  it('rejects non-ignored requests when request token is missing', async () => {
    const csrfSecret = createToken.secretSync();
    const token = createToken.create(csrfSecret);
    const cookieHeader = [
      serialize('csrfSecret', csrfSecret),
      serialize(tokenKey, token),
    ].join('; ');

    const req = createMockRequest('POST', cookieHeader);
    const res = createMockResponse();
    let called = false;
    const handler = async () => {
      called = true;
    };

    await csrf(handler, baseOptions)(req, res);

    expect(called).toBe(false);
    expect(res.statusCode).toBe(403);
    expect(res.payload).toMatchObject({ code: CsrfErrorCodes.MISSING_REQUEST_TOKEN });
  });

  it('accepts request when header token matches cookie token', async () => {
    const csrfSecret = createToken.secretSync();
    const token = createToken.create(csrfSecret);
    const cookieHeader = [
      serialize('csrfSecret', csrfSecret),
      serialize(tokenKey, token),
    ].join('; ');

    const req = createMockRequest('POST', cookieHeader, { 'x-csrf-token': token });
    const res = createMockResponse();
    let called = false;
    const handler = async () => {
      called = true;
    };

    await csrf(handler, baseOptions)(req, res);

    expect(called).toBe(true);
    expect(res.statusCode).toBe(200);
  });

  it('rejects request when request token does not match cookie token', async () => {
    const csrfSecret = createToken.secretSync();
    const token = createToken.create(csrfSecret);
    const cookieHeader = [
      serialize('csrfSecret', csrfSecret),
      serialize(tokenKey, token),
    ].join('; ');

    const req = createMockRequest('POST', cookieHeader, { 'x-csrf-token': 'invalid-token' });
    const res = createMockResponse();
    const handler = async () => undefined;

    await csrf(handler, baseOptions)(req, res);

    expect(res.statusCode).toBe(403);
    expect(res.payload).toMatchObject({ code: CsrfErrorCodes.TOKEN_MISMATCH });
  });

  it('accepts signed token from request header when secret is configured', async () => {
    const csrfSecret = createToken.secretSync();
    const unsignedToken = createToken.create(csrfSecret);
    const secret = 'super-secret';
    const signedToken = sign(unsignedToken, secret);
    const cookieHeader = [
      serialize('csrfSecret', csrfSecret),
      serialize(tokenKey, signedToken),
    ].join('; ');

    const req = createMockRequest('POST', cookieHeader, { 'x-csrf-token': signedToken });
    const res = createMockResponse();
    let called = false;
    const handler = async () => {
      called = true;
    };

    await csrf(handler, { ...baseOptions, secret })(req, res);

    expect(called).toBe(true);
    expect(res.statusCode).toBe(200);
  });
});
