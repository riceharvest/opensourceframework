import { describe, it, expect } from 'vitest';
import { placeholder } from '../src/index';

describe('@opensourceframework/next-images', () => {
  it('should export placeholder', () => {
    expect(placeholder).toBe(true);
  });

  // TODO: Add actual tests when implementing the package
  it.todo('should handle image imports');
  it.todo('should support various image formats');
  it.todo('should work with Next.js Image component');
});