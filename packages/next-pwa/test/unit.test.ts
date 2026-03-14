import { describe, it, expect, vi, beforeEach } from 'vitest';
import nextPwa from '../index.js';

describe('next-pwa unit tests', () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.NEXT_TURBOPACK = undefined;
    process.env.__NEXT_TURBOPACK = undefined;
  });

  it('should be a function', () => {
    expect(typeof nextPwa).toBe('function');
  });

  it('should return a configuration object', () => {
    const withPWA = nextPwa({ dest: 'public' });
    const config = withPWA({ basePath: '/test' });
    expect(typeof config).toBe('object');
  });

  it('should handle disable option', () => {
    const withPWA = nextPwa({ disable: true });
    const config = withPWA({ basePath: '/test' });
    // In disabled mode, it should return the original config (or something close)
    expect(config.basePath).toBe('/test');
  });
});
