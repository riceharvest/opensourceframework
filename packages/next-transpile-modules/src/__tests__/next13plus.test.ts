import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
const rewire = require('rewire');

describe('Next.js 13+ compatibility', () => {
  let withTmInitializer;
  let withTmRewire;

  beforeEach(() => {
    withTmRewire = rewire('../next-transpile-modules');
    withTmInitializer = withTmRewire;
    
    // Mock the resolver to avoid file system lookups
    const mockResolve = {
      create: {
        sync: () => (context, request) => {
          if (request.includes('package.json')) {
            return '/mock/path/to/module/package.json';
          }
          return request;
        }
      }
    };
    withTmRewire.__set__('enhancedResolve', mockResolve);
  });

  afterEach(() => {
    delete process.env.NEXT_PRIVATE_TEST_VERSION;
  });

  it('should use transpilePackages when Next.js version >= 13.0.0', () => {
    process.env.NEXT_PRIVATE_TEST_VERSION = '13.0.0';
    
    const withTM = withTmInitializer(['a-module']);
    const nextConfig = { someOption: true };
    const result = withTM(nextConfig);
    
    expect(result.transpilePackages).toContain('a-module');
    expect(result.someOption).toBe(true);
    expect(result.webpack).toBeUndefined();
  });

  it('should merge with existing transpilePackages', () => {
    process.env.NEXT_PRIVATE_TEST_VERSION = '13.1.0';
    
    const withTM = withTmInitializer(['a-module']);
    const nextConfig = { transpilePackages: ['existing-module'] };
    const result = withTM(nextConfig);
    
    expect(result.transpilePackages).toContain('a-module');
    expect(result.transpilePackages).toContain('existing-module');
  });

  it('should fallback to webpack hacks when Next.js version < 13.0.0', () => {
    process.env.NEXT_PRIVATE_TEST_VERSION = '12.3.1';
    
    const withTM = withTmInitializer(['a-module']);
    const nextConfig = { someOption: true };
    const result = withTM(nextConfig);
    
    expect(result.transpilePackages).toBeUndefined();
    expect(typeof result.webpack).toBe('function');
  });
});
