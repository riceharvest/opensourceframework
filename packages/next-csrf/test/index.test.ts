import { describe, expect, it } from 'vitest';
import { csrf, nextCsrf, setup } from '../src/index';

describe('@opensourceframework/next-csrf', () => {
  it('exports nextCsrf and middleware helpers', () => {
    expect(typeof nextCsrf).toBe('function');
    expect(typeof csrf).toBe('function');
    expect(typeof setup).toBe('function');
  });

  it('creates setup/csrf middleware pair', () => {
    const result = nextCsrf();
    expect(typeof result.setup).toBe('function');
    expect(typeof result.csrf).toBe('function');
  });
});
