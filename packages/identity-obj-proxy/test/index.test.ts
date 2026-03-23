import { describe, expect, it } from 'vitest';
import idObj from '../src/index';

describe('identity-obj-proxy', () => {
  it('returns the requested key as a string', () => {
    // @ts-expect-error - testing proxy behavior
    expect(idObj.foo).toBe('foo');
    // @ts-expect-error - testing proxy behavior
    expect(idObj.bar).toBe('bar');
    // @ts-expect-error - testing proxy behavior
    expect(idObj['some-complex-key']).toBe('some-complex-key');
  });

  it('returns false for __esModule to support ES module interop', () => {
    // @ts-expect-error - testing proxy behavior
    expect(idObj.__esModule).toBe(false);
  });
});
