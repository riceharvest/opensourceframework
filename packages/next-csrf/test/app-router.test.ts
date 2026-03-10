
import { describe, it, expect, vi } from 'vitest';
import { verifyCsrfToken } from '../src/app-router';
import { createToken } from '../src/utils/create-token';

vi.mock('next/headers', () => ({
  headers: vi.fn(),
  cookies: vi.fn(),
}));

import { headers, cookies } from 'next/headers';

describe('verifyCsrfToken (App Router)', () => {
  it('should verify a valid token', async () => {
    const secret = 'secret';
    const token = createToken.create(secret);
    
    (headers as any).mockResolvedValue(new Map([
      ['x-csrf-token', token]
    ]));
    
    (cookies as any).mockResolvedValue({
      get: (name: string) => {
        if (name === 'XSRF-TOKEN') return { value: token };
        if (name === 'csrfSecret') return { value: secret };
        return undefined;
      }
    });
    
    await expect(verifyCsrfToken()).resolves.not.toThrow();
  });

  it('should throw if tokens mismatch', async () => {
    const secret = 'secret';
    const token = createToken.create(secret);
    
    (headers as any).mockResolvedValue(new Map([
      ['x-csrf-token', 'wrong-token']
    ]));
    
    (cookies as any).mockResolvedValue({
      get: (name: string) => {
        if (name === 'XSRF-TOKEN') return { value: token };
        if (name === 'csrfSecret') return { value: secret };
        return undefined;
      }
    });
    
    await expect(verifyCsrfToken()).rejects.toThrow('CSRF token mismatch');
  });
});
