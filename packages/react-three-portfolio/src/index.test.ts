import { describe, it, expect } from 'vitest';
import * as exports from './index';

describe('react-three-portfolio', () => {
  it('should export all expected components', () => {
    expect(exports.HeroCanvas).toBeDefined();
    expect(exports.HeroOrb).toBeDefined();
    expect(exports.EnergyWaves).toBeDefined();
    expect(exports.Eye).toBeDefined();
    expect(exports.LightningEffect).toBeDefined();
    expect(exports.SparkleEffect).toBeDefined();
    expect(exports.PostProcessing).toBeDefined();
  });

  it('should have HeroCanvas as a function', () => {
    expect(typeof exports.HeroCanvas).toBe('function');
  });

  it('should have HeroOrb as a function', () => {
    expect(typeof exports.HeroOrb).toBe('function');
  });

  it('should have EnergyWaves as a function', () => {
    expect(typeof exports.EnergyWaves).toBe('function');
  });

  it('should have Eye as a function', () => {
    expect(typeof exports.Eye).toBe('function');
  });

  it('should have LightningEffect as a function', () => {
    expect(typeof exports.LightningEffect).toBe('function');
  });

  it('should have SparkleEffect as a function', () => {
    expect(typeof exports.SparkleEffect).toBe('function');
  });

  it('should have PostProcessing as a function', () => {
    expect(typeof exports.PostProcessing).toBe('function');
  });
});
