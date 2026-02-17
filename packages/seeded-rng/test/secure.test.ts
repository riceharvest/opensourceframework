import { describe, it, expect } from 'vitest';
import { SecureSeededRNG, seededSecureInt, seededSecureHex } from '../src/index';

describe('SecureSeededRNG', () => {
  describe('constructor', () => {
    it('should create with a specific seed', () => {
      const rng = new SecureSeededRNG(42);
      expect(rng.getInitialSeed()).toBe(42);
    });

    it('should create with a random seed if none provided', () => {
      const rng = new SecureSeededRNG();
      expect(rng.getInitialSeed()).toBeDefined();
    });

    it('should handle zero seed', () => {
      const rng = new SecureSeededRNG(0);
      expect(rng.getInitialSeed()).toBe(0);
    });

    it('should handle large seed values', () => {
      const rng = new SecureSeededRNG(4294967295);
      expect(rng.getInitialSeed()).toBe(4294967295);
    });
  });

  describe('determinism', () => {
    it('should produce same sequence with same seed', () => {
      const rng1 = new SecureSeededRNG(12345);
      const rng2 = new SecureSeededRNG(12345);

      for (let i = 0; i < 100; i++) {
        expect(rng1.next()).toBe(rng2.next());
      }
    });

    it('should produce different sequences with different seeds', () => {
      const rng1 = new SecureSeededRNG(12345);
      const rng2 = new SecureSeededRNG(54321);

      expect(rng1.next()).not.toBe(rng2.next());
    });

    it('should reset to same sequence', () => {
      const rng = new SecureSeededRNG(42);
      const values1 = [rng.next(), rng.next(), rng.next()];
      
      rng.reset();
      const values2 = [rng.next(), rng.next(), rng.next()];

      expect(values1).toEqual(values2);
    });
  });

  describe('next()', () => {
    it('should return float between 0 and 1', () => {
      const rng = new SecureSeededRNG(42);
      for (let i = 0; i < 100; i++) {
        const value = rng.next();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });

    it('should not return exactly 1', () => {
      const rng = new SecureSeededRNG(42);
      for (let i = 0; i < 1000; i++) {
        expect(rng.next()).not.toBe(1);
      }
    });
  });

  describe('nextInt()', () => {
    it('should return integer in range [min, max]', () => {
      const rng = new SecureSeededRNG(42);
      for (let i = 0; i < 100; i++) {
        const value = rng.nextInt(1, 10);
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(10);
      }
    });

    it('should handle min equals max', () => {
      const rng = new SecureSeededRNG(42);
      for (let i = 0; i < 10; i++) {
        expect(rng.nextInt(5, 5)).toBe(5);
      }
    });

    it('should handle negative ranges', () => {
      const rng = new SecureSeededRNG(42);
      for (let i = 0; i < 100; i++) {
        const value = rng.nextInt(-100, -50);
        expect(value).toBeGreaterThanOrEqual(-100);
        expect(value).toBeLessThanOrEqual(-50);
      }
    });
  });

  describe('nextFloat()', () => {
    it('should return float in range [min, max)', () => {
      const rng = new SecureSeededRNG(42);
      for (let i = 0; i < 100; i++) {
        const value = rng.nextFloat(0, 10);
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(10);
      }
    });
  });

  describe('chance()', () => {
    it('should return true with exact probability', () => {
      const rng = new SecureSeededRNG(42);
      
      // With 1.0, always true
      let allTrue = true;
      for (let i = 0; i < 100; i++) {
        if (!rng.chance(1.0)) allTrue = false;
      }
      expect(allTrue).toBe(true);

      // With 0.0, always false
      let allFalse = true;
      for (let i = 0; i < 100; i++) {
        if (rng.chance(0.0)) allFalse = false;
      }
      expect(allFalse).toBe(true);
    });
  });

  describe('pick()', () => {
    it('should pick random element from array', () => {
      const rng = new SecureSeededRNG(42);
      const arr = ['a', 'b', 'c', 'd', 'e'];
      
      for (let i = 0; i < 50; i++) {
        const picked = rng.pick(arr);
        expect(arr).toContain(picked);
      }
    });

    it('should return undefined for empty array', () => {
      const rng = new SecureSeededRNG(42);
      expect(rng.pick([])).toBeUndefined();
    });
  });

  describe('shuffle()', () => {
    it('should shuffle array deterministically', () => {
      const rng1 = new SecureSeededRNG(42);
      const rng2 = new SecureSeededRNG(42);
      
      const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const shuffled1 = rng1.shuffle(arr);
      const shuffled2 = rng2.shuffle(arr);
      
      expect(shuffled1).toEqual(shuffled2);
    });

    it('should not modify original array', () => {
      const rng = new SecureSeededRNG(42);
      const original = [1, 2, 3];
      const originalCopy = [...original];
      
      rng.shuffle(original);
      
      expect(original).toEqual(originalCopy);
    });
  });

  describe('weightedPick()', () => {
    it('should pick based on weights deterministically', () => {
      const rng1 = new SecureSeededRNG(42);
      const rng2 = new SecureSeededRNG(42);
      
      const items = [
        { item: 'common', weight: 70 },
        { item: 'rare', weight: 25 },
        { item: 'legendary', weight: 5 },
      ];
      
      // Run many times and check distribution is same
      const results1: string[] = [];
      const results2: string[] = [];
      
      for (let i = 0; i < 1000; i++) {
        results1.push(rng1.weightedPick(items)!);
        results2.push(rng2.weightedPick(items)!);
      }
      
      expect(results1).toEqual(results2);
    });

    it('should return undefined for empty array', () => {
      const rng = new SecureSeededRNG(42);
      expect(rng.weightedPick([])).toBeUndefined();
    });
  });

  describe('nextBool()', () => {
    it('should return boolean with default 50% probability', () => {
      const rng = new SecureSeededRNG(42);
      const results: boolean[] = [];
      
      for (let i = 0; i < 100; i++) {
        results.push(rng.nextBool());
      }
      
      const trueCount = results.filter(b => b).length;
      expect(trueCount).toBeGreaterThan(0);
      expect(trueCount).toBeLessThan(100);
    });

    it('should respect custom probability', () => {
      const rng = new SecureSeededRNG(42);
      
      // Always true with probability 1.0
      for (let i = 0; i < 10; i++) {
        expect(rng.nextBool(1.0)).toBe(true);
      }
      
      // Always false with probability 0.0
      for (let i = 0; i < 10; i++) {
        expect(rng.nextBool(0.0)).toBe(false);
      }
    });
  });

  describe('nextSign()', () => {
    it('should return -1 or 1', () => {
      const rng = new SecureSeededRNG(42);
      
      for (let i = 0; i < 100; i++) {
        const sign = rng.nextSign();
        expect([1, -1]).toContain(sign);
      }
    });
  });

  describe('nextHex()', () => {
    it('should generate hex string of correct length', () => {
      const rng = new SecureSeededRNG(42);
      
      expect(rng.nextHex(16)).toHaveLength(32); // 16 bytes = 32 hex chars
      expect(rng.nextHex(32)).toHaveLength(64);
      expect(rng.nextHex(8)).toHaveLength(16);
    });

    it('should only contain valid hex characters', () => {
      const rng = new SecureSeededRNG(42);
      const hex = rng.nextHex(32);
      
      expect(hex).toMatch(/^[0-9a-f]+$/);
    });

    it('should be deterministic with same seed', () => {
      const rng1 = new SecureSeededRNG(42);
      const rng2 = new SecureSeededRNG(42);
      
      expect(rng1.nextHex(16)).toBe(rng2.nextHex(16));
    });

    it('should generate different values without seed', () => {
      const results = new Set<string>();
      
      for (let i = 0; i < 100; i++) {
        const rng = new SecureSeededRNG();
        results.add(rng.nextHex(8));
      }
      
      // Should have many unique values
      expect(results.size).toBeGreaterThan(50);
    });
  });

  describe('nextBytes()', () => {
    it('should generate byte array of correct length', () => {
      const rng = new SecureSeededRNG(42);
      
      expect(rng.nextBytes(16)).toHaveLength(16);
      expect(rng.nextBytes(32)).toHaveLength(32);
    });

    it('should contain values in valid byte range', () => {
      const rng = new SecureSeededRNG(42);
      const bytes = rng.nextBytes(100);
      
      for (const byte of bytes) {
        expect(byte).toBeGreaterThanOrEqual(0);
        expect(byte).toBeLessThanOrEqual(255);
      }
    });
  });

  describe('nextBase64()', () => {
    it('should generate valid base64 string', () => {
      const rng = new SecureSeededRNG(42);
      const base64 = rng.nextBase64(16);
      
      // Should be valid base64 (length will be different due to encoding)
      expect(base64.length).toBeGreaterThan(0);
      // Should not contain invalid base64 characters
      expect(() => atob(base64)).not.toThrow();
    });
  });

  describe('nextUUID()', () => {
    it('should generate valid UUID v4 format', () => {
      const rng = new SecureSeededRNG(42);
      const uuid = rng.nextUUID();
      
      // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    it('should be deterministic with same seed', () => {
      const rng1 = new SecureSeededRNG(42);
      const rng2 = new SecureSeededRNG(42);
      
      expect(rng1.nextUUID()).toBe(rng2.nextUUID());
    });
  });

  describe('fork()', () => {
    it('should create independent RNG', () => {
      const rng = new SecureSeededRNG(42);
      const fork = rng.fork();
      
      // Both should produce values
      const val1 = rng.next();
      const val2 = fork.next();
      
      expect(val1).toBeDefined();
      expect(val2).toBeDefined();
    });
  });

  describe('getStats()', () => {
    it('should track iterations correctly', () => {
      const rng = new SecureSeededRNG(42);
      
      expect(rng.getStats().iterations).toBe(0);
      
      rng.next();
      expect(rng.getStats().iterations).toBe(1);
      
      rng.nextInt(1, 10);
      expect(rng.getStats().iterations).toBe(2);
    });
  });

  describe('seededSecureInt()', () => {
    it('should be deterministic', () => {
      const val1 = seededSecureInt(42, 1, 100);
      const val2 = seededSecureInt(42, 1, 100);
      
      expect(val1).toBe(val2);
    });

    it('should return value in range', () => {
      for (let i = 0; i < 100; i++) {
        const val = seededSecureInt(42, 1, 100);
        expect(val).toBeGreaterThanOrEqual(1);
        expect(val).toBeLessThanOrEqual(100);
      }
    });
  });

  describe('seededSecureHex()', () => {
    it('should be deterministic', () => {
      const hex1 = seededSecureHex(42, 16);
      const hex2 = seededSecureHex(42, 16);
      
      expect(hex1).toBe(hex2);
    });

    it('should generate correct length', () => {
      const hex = seededSecureHex(42, 16);
      expect(hex).toHaveLength(32);
    });
  });
});
