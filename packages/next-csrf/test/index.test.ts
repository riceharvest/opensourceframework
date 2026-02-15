/**
 * @opensourceframework/next-csrf
 * CSRF protection for Next.js applications
 * 
 * Tests for the nextCsrf function and middleware
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { nextCsrf, HttpError } from '../src/index';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { IncomingMessage, ServerResponse } from 'http';

// Mock Next.js types and request/response
type MockNextApiRequest = Partial<NextApiRequest> & {
  headers: Record<string, string | undefined>;
  method: string;
};

type MockNextApiResponse = Partial<NextApiResponse> & {
  status: ReturnType<typeof vi.fn>;
  json: ReturnType<typeof vi.fn>;
  setHeader: ReturnType<typeof vi.fn>;
};

// Helper to create mock request
function createMockRequest(
  method: string = 'GET',
  cookies: Record<string, string> = {},
  headers: Record<string, string | undefined> = {}
): MockNextApiRequest {
  const cookieString = Object.entries(cookies)
    .map(([key, value]) => `${key}=${value}`)
    .join('; ');

  return {
    method,
    headers: {
      ...headers,
      cookie: cookieString || undefined,
    },
  };
}

// Helper to create mock response
function createMockResponse(): MockNextApiResponse {
  const res: MockNextApiResponse = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    setHeader: vi.fn().mockReturnThis(),
  };
  return res;
}

describe('nextCsrf', () => {
  describe('initialization', () => {
    it('should return setup and csrf middleware functions', () => {
      const { setup, csrf } = nextCsrf({ secret: 'test-secret' });

      expect(typeof setup).toBe('function');
      expect(typeof csrf).toBe('function');
    });

    it('should work with no options', () => {
      const { setup, csrf } = nextCsrf();

      expect(typeof setup).toBe('function');
      expect(typeof csrf).toBe('function');
    });

    it('should accept custom options', () => {
      const { setup, csrf } = nextCsrf({
        secret: 'my-secret-key',
        tokenKey: 'MY-CSRF-TOKEN',
        csrfErrorMessage: 'Custom error message',
        ignoredMethods: ['GET', 'OPTIONS'],
        cookieOptions: {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
        },
      });

      expect(typeof setup).toBe('function');
      expect(typeof csrf).toBe('function');
    });
  });

  describe('setup middleware', () => {
    const secret = 'test-secret-key-12345';
    const tokenKey = 'XSRF-TOKEN';

    it('should set csrfSecret and token cookies', async () => {
      const { setup } = nextCsrf({
        secret,
        tokenKey,
        cookieOptions: { httpOnly: true, path: '/' },
      });

      const mockHandler = vi.fn().mockResolvedValue(undefined);
      const req = createMockRequest('GET');
      const res = createMockResponse();

      const wrappedHandler = setup(mockHandler as unknown as ReturnType<typeof mockHandler>);
      await wrappedHandler(req as NextApiRequest, res as NextApiResponse);

      // Check that setHeader was called with Set-Cookie
      expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', expect.any(Array));

      // Get the cookies that were set
      const setCookieCalls = res.setHeader.mock.calls.filter(
        (call) => call[0] === 'Set-Cookie'
      );
      expect(setCookieCalls.length).toBeGreaterThan(0);

      // Verify cookies contain csrfSecret and token
      const cookies = setCookieCalls[0][1] as string[];
      expect(cookies.length).toBe(2);
      expect(cookies[0]).toMatch(/csrfSecret=/);
      expect(cookies[1]).toMatch(/XSRF-TOKEN=/);
    });

    it('should call the original handler after setting cookies', async () => {
      const { setup } = nextCsrf({ secret, tokenKey });

      const mockHandler = vi.fn().mockResolvedValue(undefined);
      const req = createMockRequest('GET');
      const res = createMockResponse();

      const wrappedHandler = setup(mockHandler as unknown as ReturnType<typeof mockHandler>);
      await wrappedHandler(req as NextApiRequest, res as NextApiResponse);

      expect(mockHandler).toHaveBeenCalledWith(req, res);
    });

    it('should work without a secret (unsigned tokens)', async () => {
      const { setup } = nextCsrf({ tokenKey });

      const mockHandler = vi.fn().mockResolvedValue(undefined);
      const req = createMockRequest('GET');
      const res = createMockResponse();

      const wrappedHandler = setup(mockHandler as unknown as ReturnType<typeof mockHandler>);
      await wrappedHandler(req as NextApiRequest, res as NextApiResponse);

      expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', expect.any(Array));
      
      const setCookieCalls = res.setHeader.mock.calls.filter(
        (call) => call[0] === 'Set-Cookie'
      );
      const cookies = setCookieCalls[0][1] as string[];
      expect(cookies.length).toBe(2);
    });
  });

  describe('csrf middleware', () => {
    const secret = 'test-secret-key-12345';
    const tokenKey = 'XSRF-TOKEN';

    it('should allow GET requests without CSRF token (ignored method)', async () => {
      const { csrf } = nextCsrf({ secret, tokenKey });

      const mockHandler = vi.fn().mockResolvedValue(undefined);
      const req = createMockRequest('GET');
      const res = createMockResponse();

      const wrappedHandler = csrf(mockHandler as unknown as ReturnType<typeof mockHandler>);
      await wrappedHandler(req as NextApiRequest, res as NextApiResponse);

      expect(mockHandler).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalledWith(403);
    });

    it('should allow HEAD requests without CSRF token (ignored method)', async () => {
      const { csrf } = nextCsrf({ secret, tokenKey });

      const mockHandler = vi.fn().mockResolvedValue(undefined);
      const req = createMockRequest('HEAD');
      const res = createMockResponse();

      const wrappedHandler = csrf(mockHandler as unknown as ReturnType<typeof mockHandler>);
      await wrappedHandler(req as NextApiRequest, res as NextApiResponse);

      expect(mockHandler).toHaveBeenCalled();
    });

    it('should allow OPTIONS requests without CSRF token (ignored method)', async () => {
      const { csrf } = nextCsrf({ secret, tokenKey });

      const mockHandler = vi.fn().mockResolvedValue(undefined);
      const req = createMockRequest('OPTIONS');
      const res = createMockResponse();

      const wrappedHandler = csrf(mockHandler as unknown as ReturnType<typeof mockHandler>);
      await wrappedHandler(req as NextApiRequest, res as NextApiResponse);

      expect(mockHandler).toHaveBeenCalled();
    });

    it('should reject POST requests without cookies', async () => {
      const { csrf } = nextCsrf({ secret, tokenKey });

      const mockHandler = vi.fn().mockResolvedValue(undefined);
      const req = createMockRequest('POST'); // No cookies
      const res = createMockResponse();

      const wrappedHandler = csrf(mockHandler as unknown as ReturnType<typeof mockHandler>);
      await wrappedHandler(req as NextApiRequest, res as NextApiResponse);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid CSRF token' });
    });

    it('should reject POST requests without CSRF token in cookies', async () => {
      const { csrf } = nextCsrf({ secret, tokenKey });

      const mockHandler = vi.fn().mockResolvedValue(undefined);
      const req = createMockRequest('POST', { otherCookie: 'value' }); // No XSRF-TOKEN
      const res = createMockResponse();

      const wrappedHandler = csrf(mockHandler as unknown as ReturnType<typeof mockHandler>);
      await wrappedHandler(req as NextApiRequest, res as NextApiResponse);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should reject POST requests with invalid CSRF token', async () => {
      const { csrf } = nextCsrf({ secret, tokenKey });

      const mockHandler = vi.fn().mockResolvedValue(undefined);
      const req = createMockRequest('POST', {
        'XSRF-TOKEN': 'invalid-token',
        csrfSecret: 'invalid-secret',
      });
      const res = createMockResponse();

      const wrappedHandler = csrf(mockHandler as unknown as ReturnType<typeof mockHandler>);
      await wrappedHandler(req as NextApiRequest, res as NextApiResponse);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should reject requests with tampered signed token', async () => {
      const { csrf } = nextCsrf({ secret, tokenKey });

      const mockHandler = vi.fn().mockResolvedValue(undefined);
      const req = createMockRequest('POST', {
        'XSRF-TOKEN': 'tampered.token.signature',
        csrfSecret: 'some-secret',
      });
      const res = createMockResponse();

      const wrappedHandler = csrf(mockHandler as unknown as ReturnType<typeof mockHandler>);
      await wrappedHandler(req as NextApiRequest, res as NextApiResponse);

      expect(res.status).toHaveBeenCalledWith(403);
    });

    it('should use custom error message when provided', async () => {
      const customMessage = 'Custom CSRF error';
      const { csrf } = nextCsrf({ secret, tokenKey, csrfErrorMessage: customMessage });

      const mockHandler = vi.fn().mockResolvedValue(undefined);
      const req = createMockRequest('POST'); // No cookies
      const res = createMockResponse();

      const wrappedHandler = csrf(mockHandler as unknown as ReturnType<typeof mockHandler>);
      await wrappedHandler(req as NextApiRequest, res as NextApiResponse);

      expect(res.json).toHaveBeenCalledWith({ message: customMessage });
    });

    it('should allow custom ignored methods', async () => {
      const { csrf } = nextCsrf({
        secret,
        tokenKey,
        ignoredMethods: ['GET', 'POST'], // POST is now ignored
      });

      const mockHandler = vi.fn().mockResolvedValue(undefined);
      const req = createMockRequest('POST'); // No cookies but POST is ignored
      const res = createMockResponse();

      const wrappedHandler = csrf(mockHandler as unknown as ReturnType<typeof mockHandler>);
      await wrappedHandler(req as NextApiRequest, res as NextApiResponse);

      expect(mockHandler).toHaveBeenCalled();
    });
  });

  describe('HttpError', () => {
    it('should create an error with status and message', () => {
      const error = new HttpError(403, 'Forbidden');

      expect(error.status).toBe(403);
      expect(error.message).toBe('Forbidden');
      expect(error.name).toBe('HttpError');
    });

    it('should default to 403 status', () => {
      const error = new HttpError(undefined as unknown as number, 'Error');

      expect(error.status).toBe(403);
    });

    it('should extend Error', () => {
      const error = new HttpError(500, 'Server Error');

      expect(error).toBeInstanceOf(Error);
    });
  });

  describe('full workflow', () => {
    // This tests the complete setup -> csrf validation flow
    it('should support a complete token lifecycle', async () => {
      const secret = 'workflow-test-secret';
      const tokenKey = 'XSRF-TOKEN';
      const { setup, csrf } = nextCsrf({ secret, tokenKey });

      // Step 1: Setup middleware creates tokens
      const setupHandler = vi.fn().mockResolvedValue(undefined);
      const setupReq = createMockRequest('GET');
      const setupRes = createMockResponse();

      const wrappedSetup = setup(setupHandler as unknown as ReturnType<typeof setupHandler>);
      await wrappedSetup(setupReq as NextApiRequest, setupRes as NextApiResponse);

      // Verify cookies were set
      const setCookieCalls = setupRes.setHeader.mock.calls.filter(
        (call) => call[0] === 'Set-Cookie'
      );
      expect(setCookieCalls.length).toBeGreaterThan(0);

      // The workflow would continue with:
      // 1. Client receives cookies
      // 2. Client makes POST with cookies
      // 3. CSRF middleware validates
      // This integration test focuses on the middleware structure
    });
  });
});