import { describe, it, expect } from 'vitest';
import nextCookies from '../src/index';

describe('next-cookies', () => {
  it('should return empty object when no cookies', () => {
    const ctx = { req: { headers: { cookie: undefined } } };
    const result = nextCookies(ctx);
    expect(result).toEqual({});
  });

  it('should parse single cookie', () => {
    const ctx = { req: { headers: { cookie: 'name=value' } } };
    const result = nextCookies(ctx);
    expect(result).toEqual({ name: 'value' });
  });

  it('should parse multiple cookies', () => {
    const ctx = { req: { headers: { cookie: 'name=value; session=abc123' } } };
    const result = nextCookies(ctx);
    expect(result).toEqual({ name: 'value', session: 'abc123' });
  });

  it('should handle empty context', () => {
    const ctx = {};
    const result = nextCookies(ctx);
    expect(result).toEqual({});
  });

  it('should handle context without req', () => {
    const ctx = {} as Parameters<typeof nextCookies>[0];
    const result = nextCookies(ctx);
    expect(result).toEqual({});
  });

  it('should handle context with req but no headers', () => {
    const ctx = { req: {} } as Parameters<typeof nextCookies>[0];
    const result = nextCookies(ctx);
    expect(result).toEqual({});
  });

  it('should decode cookie values', () => {
    const ctx = { req: { headers: { cookie: 'name=hello%20world' } } };
    const result = nextCookies(ctx);
    expect(result).toEqual({ name: 'hello world' });
  });
});
