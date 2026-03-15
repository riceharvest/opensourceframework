import { describe, expect, it } from 'vitest';
import Critters from '../src/index';

describe('@opensourceframework/critters', () => {
  it('exports a Critters constructor', () => {
    expect(typeof Critters).toBe('function');
  });

  it('creates an instance with process method', () => {
    const critters = new Critters();
    expect(typeof critters.process).toBe('function');
  });
});
