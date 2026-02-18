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

describe('next-cookies - security tests', () => {
  describe('cookie injection attacks', () => {
    it('should handle attempt to inject new cookie via value', () => {
      // Attempt to inject a new cookie by including cookie delimiter in value
      const ctx = { req: { headers: { cookie: 'name=value; injected=malicious' } } };
      const result = nextCookies(ctx);
      // Both cookies are parsed - this is expected behavior
      // The security is that the attacker cannot override existing cookies
      expect(result).toEqual({ name: 'value', injected: 'malicious' });
    });

    it('should handle attempt to inject via URL encoding', () => {
      // URL encoded semicolon (%3B) should be treated as part of value, not delimiter
      const ctx = { req: { headers: { cookie: 'name=value%3Binjected%3Dmalicious' } } };
      const result = nextCookies(ctx);
      expect(result).toEqual({ name: 'value;injected=malicious' });
      expect(result).not.toHaveProperty('injected');
    });

    it('should handle attempt to inject HttpOnly flag', () => {
      // HttpOnly is a cookie attribute, not a cookie value - it gets filtered out
      const ctx = { req: { headers: { cookie: 'name=value; HttpOnly' } } };
      const result = nextCookies(ctx);
      // universal-cookie filters out cookie attributes like HttpOnly
      expect(result).toEqual({ name: 'value' });
    });

    it('should handle attempt to inject Secure flag', () => {
      // Secure is a cookie attribute, not a cookie value - it gets filtered out
      const ctx = { req: { headers: { cookie: 'name=value; Secure' } } };
      const result = nextCookies(ctx);
      // universal-cookie filters out cookie attributes like Secure
      expect(result).toEqual({ name: 'value' });
    });

    it('should handle attempt to inject Path attribute', () => {
      const ctx = { req: { headers: { cookie: 'name=value; Path=/' } } };
      const result = nextCookies(ctx);
      expect(result).toEqual({ name: 'value', Path: '/' });
    });

    it('should handle attempt to inject Domain attribute', () => {
      const ctx = { req: { headers: { cookie: 'name=value; Domain=evil.com' } } };
      const result = nextCookies(ctx);
      expect(result).toEqual({ name: 'value', Domain: 'evil.com' });
    });
  });

  describe('special characters in cookie values', () => {
    it('should handle quotes in cookie values', () => {
      // universal-cookie strips quotes from quoted cookie values
      const ctx = { req: { headers: { cookie: 'name="quoted_value"' } } };
      const result = nextCookies(ctx);
      expect(result.name).toBe('quoted_value');
    });

    it('should handle equals sign in cookie value', () => {
      const ctx = { req: { headers: { cookie: 'name=value=with=equals' } } };
      const result = nextCookies(ctx);
      expect(result).toEqual({ name: 'value=with=equals' });
    });

    it('should handle base64-like values', () => {
      const ctx = { req: { headers: { cookie: 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U' } } };
      const result = nextCookies(ctx);
      expect(result.token).toBe('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U');
    });

    it('should handle special URL-encoded characters', () => {
      const ctx = { req: { headers: { cookie: 'name=%3Cscript%3Ealert(1)%3C%2Fscript%3E' } } };
      const result = nextCookies(ctx);
      expect(result).toEqual({ name: '<script>alert(1)</script>' });
    });

    it('should handle unicode characters', () => {
      const ctx = { req: { headers: { cookie: 'name=%E4%BD%A0%E5%A5%BD' } } }; // "你好" in Chinese
      const result = nextCookies(ctx);
      expect(result).toEqual({ name: '你好' });
    });

    it('should handle emoji in cookie values', () => {
      const ctx = { req: { headers: { cookie: 'emoji=%F0%9F%98%80' } } }; // 😀 emoji
      const result = nextCookies(ctx);
      expect(result).toEqual({ emoji: '😀' });
    });

    it('should handle newlines encoded in value', () => {
      const ctx = { req: { headers: { cookie: 'name=line1%0Aline2' } } };
      const result = nextCookies(ctx);
      expect(result).toEqual({ name: 'line1\nline2' });
    });

    it('should handle tabs encoded in value', () => {
      const ctx = { req: { headers: { cookie: 'name=col1%09col2' } } };
      const result = nextCookies(ctx);
      expect(result).toEqual({ name: 'col1\tcol2' });
    });

    it('should handle percent signs in values', () => {
      const ctx = { req: { headers: { cookie: 'discount=25%25' } } };
      const result = nextCookies(ctx);
      expect(result).toEqual({ discount: '25%' });
    });
  });

  describe('large cookie handling', () => {
    it('should handle large cookie value (4KB)', () => {
      // Generate a 4KB string
      const largeValue = 'a'.repeat(4096);
      const ctx = { req: { headers: { cookie: `large=${largeValue}` } } };
      const result = nextCookies(ctx);
      expect(result.large).toBe(largeValue);
      expect(result.large?.length).toBe(4096);
    });

    it('should handle many cookies', () => {
      // Generate 50 cookies
      const cookies = Array.from({ length: 50 }, (_, i) => `cookie${i}=value${i}`).join('; ');
      const ctx = { req: { headers: { cookie: cookies } } };
      const result = nextCookies(ctx);
      expect(Object.keys(result).length).toBe(50);
      expect(result.cookie0).toBe('value0');
      expect(result.cookie49).toBe('value49');
    });

    it('should handle empty cookie value', () => {
      const ctx = { req: { headers: { cookie: 'empty=; name=value' } } };
      const result = nextCookies(ctx);
      expect(result.empty).toBe('');
      expect(result.name).toBe('value');
    });

    it('should handle cookie with only name (no equals)', () => {
      // universal-cookie requires = sign to parse a cookie
      const ctx = { req: { headers: { cookie: 'flagCookie; name=value' } } };
      const result = nextCookies(ctx);
      // flagCookie without = is not parsed as a cookie
      expect(result.flagCookie).toBeUndefined();
      expect(result.name).toBe('value');
    });
  });

  describe('edge cases', () => {
    it('should handle trailing semicolon', () => {
      const ctx = { req: { headers: { cookie: 'name=value;' } } };
      const result = nextCookies(ctx);
      expect(result).toEqual({ name: 'value' });
    });

    it('should handle leading semicolon', () => {
      const ctx = { req: { headers: { cookie: '; name=value' } } };
      const result = nextCookies(ctx);
      expect(result).toEqual({ name: 'value' });
    });

    it('should handle multiple semicolons', () => {
      const ctx = { req: { headers: { cookie: 'name=value;; session=abc' } } };
      const result = nextCookies(ctx);
      expect(result).toEqual({ name: 'value', session: 'abc' });
    });

    it('should handle spaces around equals', () => {
      const ctx = { req: { headers: { cookie: 'name = value' } } };
      const result = nextCookies(ctx);
      // universal-cookie trims spaces around key and value
      expect(result).toEqual({ name: 'value' });
    });

    it('should handle spaces after semicolon', () => {
      const ctx = { req: { headers: { cookie: 'name=value;  session=abc' } } };
      const result = nextCookies(ctx);
      expect(result).toEqual({ name: 'value', session: 'abc' });
    });

    it('should handle double quotes around entire cookie', () => {
      const ctx = { req: { headers: { cookie: '"name=value"' } } };
      const result = nextCookies(ctx);
      // The quotes become part of the key
      expect(result).toHaveProperty('"name');
    });

    it('should handle cookie name with special characters', () => {
      const ctx = { req: { headers: { cookie: 'session-id=abc123; user_token=xyz789' } } };
      const result = nextCookies(ctx);
      expect(result).toEqual({ 'session-id': 'abc123', 'user_token': 'xyz789' });
    });

    it('should return empty object for null cookie header', () => {
      const ctx = { req: { headers: { cookie: null } } } as unknown as Parameters<typeof nextCookies>[0];
      const result = nextCookies(ctx);
      expect(result).toEqual({});
    });

    it('should handle undefined req object gracefully', () => {
      const ctx = { req: undefined } as Parameters<typeof nextCookies>[0];
      const result = nextCookies(ctx);
      expect(result).toEqual({});
    });

    it('should handle null req object gracefully', () => {
      const ctx = { req: null } as unknown as Parameters<typeof nextCookies>[0];
      const result = nextCookies(ctx);
      expect(result).toEqual({});
    });
  });

  describe('options parameter', () => {
    it('should accept options parameter', () => {
      const ctx = { req: { headers: { cookie: 'name=value' } } };
      const result = nextCookies(ctx, { doNotParse: true });
      expect(result).toEqual({ name: 'value' });
    });
  });
});
