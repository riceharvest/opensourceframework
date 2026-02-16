import { describe, it, expect } from 'vitest';
import {
  SeededRNG,
  createRNG,
  createSecureRNG,
  seededInt,
  seededFloat,
  seededShuffle,
  seededPick,
  seededSecureInt,
  seededSecureHex,
} from '../src/index';

describe('SeededRNG', () => {
  describe('constructor', () => {
    it('should create RNG with a specific seed', () => {
      const rng = new SeededRNG(42);
      expect(rng.getInitialSeed()).toBe(42);
    });

    it('should create RNG with a random seed if not provided', () => {
      const rng = new SeededRNG();
      expect(typeof rng.getInitialSeed()).toBe('number');
    });
  });

  describe('reproducibility', () => {
    it('should produce the same sequence for the same seed', () => {
      const rng1 = new SeededRNG(42);
      const rng2 = new SeededRNG(42);

      const sequence1 = [rng1.next(), rng1.next(), rng1.next()];
      const sequence2 = [rng2.next(), rng2.next(), rng2.next()];

      expect(sequence1).toEqual(sequence2);
    });

    it('should produce different sequences for different seeds', () => {
      const rng1 = new SeededRNG(42);
      const rng2 = new SeededRNG(43);

      const sequence1 = [rng1.next(), rng1.next(), rng1.next()];
      const sequence2 = [rng2.next(), rng2.next(), rng2.next()];

      expect(sequence1).not.toEqual(sequence2);
    });
  });

  describe('reset', () => {
    it('should reset to initial state', () => {
      const rng = new SeededRNG(42);
      const first = rng.next();
      const second = rng.next();

      rng.reset();

      expect(rng.next()).toBe(first);
      expect(rng.next()).toBe(second);
    });
  });

  describe('next', () => {
    it('should return a number between 0 and 1', () => {
      const rng = new SeededRNG(42);
      for (let i = 0; i < 100; i++) {
        const value = rng.next();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });
  });

  describe('nextInt', () => {
    it('should return an integer in the specified range', () => {
      const rng = new SeededRNG(42);
      for (let i = 0; i < 100; i++) {
        const value = rng.nextInt(1, 10);
        expect(Number.isInteger(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeLessThanOrEqual(10);
      }
    });

    it('should return the same value for min and max', () => {
      const rng = new SeededRNG(42);
      expect(rng.nextInt(5, 5)).toBe(5);
    });
  });

  describe('nextFloat', () => {
    it('should return a float in the specified range', () => {
      const rng = new SeededRNG(42);
      for (let i = 0; i < 100; i++) {
        const value = rng.nextFloat(5, 10);
        expect(value).toBeGreaterThanOrEqual(5);
        expect(value).toBeLessThan(10);
      }
    });
  });

  describe('chance', () => {
    it('should return boolean', () => {
      const rng = new SeededRNG(42);
      expect(typeof rng.chance(0.5)).toBe('boolean');
    });

    it('should always return true with probability 1', () => {
      const rng = new SeededRNG(42);
      for (let i = 0; i < 100; i++) {
        expect(rng.chance(1)).toBe(true);
      }
    });

    it('should always return false with probability 0', () => {
      const rng = new SeededRNG(42);
      for (let i = 0; i < 100; i++) {
        expect(rng.chance(0)).toBe(false);
      }
    });
  });

  describe('pick', () => {
    it('should return an element from the array', () => {
      const rng = new SeededRNG(42);
      const arr = ['a', 'b', 'c'];
      const result = rng.pick(arr);
      expect(arr).toContain(result);
    });

    it('should return undefined for empty array', () => {
      const rng = new SeededRNG(42);
      expect(rng.pick([])).toBeUndefined();
    });

    it('should be reproducible', () => {
      const rng1 = new SeededRNG(42);
      const rng2 = new SeededRNG(42);
      const arr = ['a', 'b', 'c', 'd', 'e'];

      expect(rng1.pick(arr)).toBe(rng2.pick(arr));
    });
  });

  describe('shuffle', () => {
    it('should return a shuffled array', () => {
      const rng = new SeededRNG(42);
      const original = [1, 2, 3, 4, 5];
      const shuffled = rng.shuffle(original);

      // Should contain same elements
      expect(shuffled.sort()).toEqual(original.sort());
      // Should not modify original
      expect(original).toEqual([1, 2, 3, 4, 5]);
    });

    it('should be reproducible', () => {
      const rng1 = new SeededRNG(42);
      const rng2 = new SeededRNG(42);
      const arr = [1, 2, 3, 4, 5];

      expect(rng1.shuffle(arr)).toEqual(rng2.shuffle(arr));
    });
  });

  describe('weightedPick', () => {
    it('should return an item from the list', () => {
      const rng = new SeededRNG(42);
      const items = [
        { item: 'a', weight: 1 },
        { item: 'b', weight: 1 },
        { item: 'c', weight: 1 },
      ];
      const result = rng.weightedPick(items);
      expect(['a', 'b', 'c']).toContain(result);
    });

    it('should return undefined for empty array', () => {
      const rng = new SeededRNG(42);
      expect(rng.weightedPick([])).toBeUndefined();
    });

    it('should favor higher weights', () => {
      const rng = new SeededRNG(42);
      const items = [
        { item: 'rare', weight: 1 },
        { item: 'common', weight: 99 },
      ];

      // Run many times
      const results = { rare: 0, common: 0 };
      for (let i = 0; i < 1000; i++) {
        const result = rng.weightedPick(items);
        results[result as 'rare' | 'common']++;
      }

      // Common should be picked much more often
      expect(results.common).toBeGreaterThan(results.rare * 10);
    });
  });

  describe('nextBool', () => {
    it('should return a boolean', () => {
      const rng = new SeededRNG(42);
      expect(typeof rng.nextBool()).toBe('boolean');
    });
  });

  describe('nextSign', () => {
    it('should return -1 or 1', () => {
      const rng = new SeededRNG(42);
      for (let i = 0; i < 100; i++) {
        const sign = rng.nextSign();
        expect([-1, 1]).toContain(sign);
      }
    });
  });

  describe('nextHex', () => {
    it('should return a hex string of the correct length', () => {
      const rng = new SeededRNG(42);
      const hex = rng.nextHex(8);
      expect(hex).toHaveLength(8);
      expect(/^[0-9a-f]+$/.test(hex)).toBe(true);
    });
  });

  describe('nextUUID', () => {
    it('should return a UUID-like string', () => {
      const rng = new SeededRNG(42);
      const uuid = rng.nextUUID();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/);
    });
  });

  describe('fork', () => {
    it('should create a new RNG with a different seed', () => {
      const rng = new SeededRNG(42);
      const forked = rng.fork();

      expect(forked.getInitialSeed()).not.toBe(rng.getInitialSeed());
    });

    it('should create independent sequences', () => {
      const rng = new SeededRNG(42);
      const forked = rng.fork();

      const sequence1 = [rng.next(), rng.next(), rng.next()];
      const sequence2 = [forked.next(), forked.next(), forked.next()];

      expect(sequence1).not.toEqual(sequence2);
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      const rng = new SeededRNG(42);
      rng.next();
      rng.next();
      rng.next();

      const stats = rng.getStats();
      expect(stats.initialSeed).toBe(42);
      expect(stats.iterations).toBe(3);
    });
  });

  describe('setSeed', () => {
    it('should allow setting the current seed', () => {
      const rng = new SeededRNG(42);
      rng.next();
      rng.next();

      const currentSeed = rng.getCurrentSeed();
      rng.next();
      rng.setSeed(currentSeed);

      // The sequence should continue from the saved state
      const rng2 = new SeededRNG(42);
      rng2.next();
      rng2.next();
      expect(rng.next()).toBe(rng2.next());
    });
  });
});

describe('Convenience Functions', () => {
  describe('createRNG', () => {
    it('should create an RNG with the given seed', () => {
      const rng = createRNG(42);
      expect(rng.getInitialSeed()).toBe(42);
    });

    it('should create an RNG with random seed if null', () => {
      const rng = createRNG(null);
      expect(typeof rng.getInitialSeed()).toBe('number');
    });

    it('should create an RNG without argument', () => {
      const rng = createRNG();
      expect(typeof rng.getInitialSeed()).toBe('number');
    });
  });

  describe('createSecureRNG', () => {
    it('should create a secure RNG with the given seed', () => {
      const rng = createSecureRNG(42);
      expect(rng.getInitialSeed()).toBe(42);
    });

    it('should create a secure RNG with random seed if not provided', () => {
      const rng = createSecureRNG();
      expect(typeof rng.getInitialSeed()).toBe('number');
    });

    it('should create a secure RNG with null', () => {
      const rng = createSecureRNG(null);
      expect(typeof rng.getInitialSeed()).toBe('number');
    });
  });

  describe('seededInt', () => {
    it('should return a deterministic integer', () => {
      const value1 = seededInt(42, 1, 100);
      const value2 = seededInt(42, 1, 100);
      expect(value1).toBe(value2);
    });

    it('should handle edge case with same min and max', () => {
      const value = seededInt(42, 5, 5);
      expect(value).toBe(5);
    });

    it('should work with negative numbers', () => {
      const value1 = seededInt(123, -10, -1);
      const value2 = seededInt(123, -10, -1);
      expect(value1).toBe(value2);
      expect(value1).toBeGreaterThanOrEqual(-10);
      expect(value1).toBeLessThanOrEqual(-1);
    });
  });

  describe('seededFloat', () => {
    it('should return a deterministic float', () => {
      const value1 = seededFloat(42, 0, 1);
      const value2 = seededFloat(42, 0, 1);
      expect(value1).toBe(value2);
    });

    it('should handle edge case with same min and max', () => {
      const value = seededFloat(42, 5.5, 5.5);
      expect(value).toBe(5.5);
    });
  });

  describe('seededShuffle', () => {
    it('should return a deterministic shuffled array', () => {
      const arr = [1, 2, 3, 4, 5];
      const shuffled1 = seededShuffle(42, arr);
      const shuffled2 = seededShuffle(42, arr);
      expect(shuffled1).toEqual(shuffled2);
    });

    it('should not modify the original array', () => {
      const original = [1, 2, 3, 4, 5];
      const originalCopy = [...original];
      seededShuffle(42, original);
      expect(original).toEqual(originalCopy);
    });

    it('should handle empty array', () => {
      const result = seededShuffle(42, []);
      expect(result).toEqual([]);
    });

    it('should handle single element array', () => {
      const result = seededShuffle(42, [1]);
      expect(result).toEqual([1]);
    });
  });

  describe('seededPick', () => {
    it('should return a deterministic pick', () => {
      const arr = ['a', 'b', 'c', 'd', 'e'];
      const pick1 = seededPick(42, arr);
      const pick2 = seededPick(42, arr);
      expect(pick1).toBe(pick2);
    });

    it('should return undefined for empty array', () => {
      const result = seededPick(42, []);
      expect(result).toBeUndefined();
    });
  });

  describe('seededSecureInt', () => {
    it('should return a deterministic secure integer', () => {
      const value1 = seededSecureInt(42, 1, 1000);
      const value2 = seededSecureInt(42, 1, 1000);
      expect(value1).toBe(value2);
    });

    it('should return value in range', () => {
      const value = seededSecureInt(42, 100, 200);
      expect(value).toBeGreaterThanOrEqual(100);
      expect(value).toBeLessThanOrEqual(200);
    });
  });

  describe('seededSecureHex', () => {
    it('should return a deterministic secure hex string', () => {
      const hex1 = seededSecureHex(42, 16);
      const hex2 = seededSecureHex(42, 16);
      expect(hex1).toBe(hex2);
    });

    it('should return correct length', () => {
      const hex = seededSecureHex(42, 32);
      expect(hex).toHaveLength(64); // 32 bytes = 64 hex chars
    });

    it('should only contain hex characters', () => {
      const hex = seededSecureHex(42, 16);
      expect(/^[0-9a-f]+$/.test(hex)).toBe(true);
    });
  });
});
