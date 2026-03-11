import { describe, it, expect } from 'vitest';
import nextCookies, { getCookies } from '../src/index';

describe('next-cookies', () => {
  it('should be a function', () => {
    expect(typeof nextCookies).toBe('function');
  });

  it('getCookies should be an alias for nextCookies', () => {
    expect(getCookies).toBe(nextCookies);
  });

  it('should parse cookies from context', () => {
    const ctx = {
      req: {
        headers: {
          cookie: 'test=value; other=123; bool=true'
        }
      }
    };
    const cookies = nextCookies(ctx);
    // universal-cookie by default parses JSON-like values
    expect(cookies).toEqual({
      test: 'value',
      other: 123,
      bool: true
    });
  });

  it('should return empty object if no cookies', () => {
    const ctx = {
      req: {
        headers: {}
      }
    };
    const cookies = nextCookies(ctx);
    expect(cookies).toEqual({});
  });

  it('should handle undefined context', () => {
    // @ts-expect-error intentionally exercises the undefined input fallback
    const cookies = nextCookies(undefined);
    expect(cookies).toEqual({});
  });
});
