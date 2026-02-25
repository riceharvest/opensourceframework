import { describe, it, expect } from 'vitest';
import { placeholder } from '../src/index';

describe('@opensourceframework/critters', () => {
  it('should export placeholder', () => {
    expect(placeholder).toBe(true);
  });

  // TODO: Add actual tests when implementing the package
  it.todo('should extract critical CSS');
  it.todo('should inline critical styles');
  it.todo('should work with Next.js build process');
});
