/**
 * Seeded Random Number Generator
 * 
 * ⚠️ **SECURITY WARNING**: This is NOT cryptographically secure!
 * 
 * Do NOT use this library for:
 * - Password generation
 * - Cryptographic keys
 * - Session tokens
 * - Nonce generation
 * - Any security-sensitive operations
 * 
 * For cryptographic randomness, use:
 * - Browser: `crypto.getRandomValues()`
 * - Node.js: `crypto.randomBytes()` or `crypto.randomInt()`
 * 
 * This library is designed for:
 * - Game development (procedural generation, AI behavior)
 * - Simulations requiring reproducibility
 * - Testing with deterministic results
 * - Debugging with consistent random sequences
 * 
 * @module @opensourceframework/seeded-rng
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Options for weighted random selection
 */
export interface WeightedItem<T> {
  /** The item to potentially select */
  item: T;
  /** The relative weight of this item (higher = more likely) */
  weight: number;
}

/**
 * Options for creating an RNG instance
 */
export interface RNGOptions {
  /** The seed value for deterministic randomness */
  seed?: number;
}

/**
 * Statistics about the RNG state
 */
export interface RNGStats {
  /** The initial seed value */
  initialSeed: number;
  /** The current seed/state value */
  currentSeed: number;
  /** Number of random values generated */
  iterations: number;
}

// ============================================================================
// SeededRNG Class
// ============================================================================

/**
 * Seeded Random Number Generator for deterministic, reproducible randomness.
 * 
 * Uses the Linear Congruential Generator (LCG) algorithm for consistent,
 * reproducible random sequences given the same seed.
 * 
 * @example
 * ```typescript
 * import { SeededRNG } from '@opensourceframework/seeded-rng';
 * 
 * // Create with a specific seed for reproducibility
 * const rng = new SeededRNG(12345);
 * 
 * console.log(rng.nextInt(1, 100)); // Always same result for seed 12345
 * console.log(rng.next()); // Always same result
 * 
 * // Reset to replay the same sequence
 * rng.reset();
 * console.log(rng.nextInt(1, 100)); // Same as first call
 * ```
 */
export class SeededRNG {
  private seed: number;
  private initialSeed: number;
  private iterations: number = 0;

  // LCG parameters (using values from Numerical Recipes)
  private static readonly A = 9301;
  private static readonly C = 49297;
  private static readonly M = 233280;

  /**
   * Creates a new seeded RNG instance
   * 
   * @param seed - Optional seed value. If not provided, generates a random seed
   * 
   * @example
   * ```typescript
   * // With a specific seed (reproducible)
   * const rng1 = new SeededRNG(42);
   * 
   * // Without seed (random each time)
   * const rng2 = new SeededRNG();
   * ```
   */
  constructor(seed?: number) {
    this.initialSeed = seed ?? Math.floor(Math.random() * 2147483647);
    this.seed = this.initialSeed;
  }

  /**
   * Gets the initial seed value (useful for serialization/replay)
   * 
   * @example
   * ```typescript
   * const rng = new SeededRNG(42);
   * console.log(rng.getInitialSeed()); // 42
   * ```
   */
  getInitialSeed(): number {
    return this.initialSeed;
  }

  /**
   * Gets the current seed/state value
   * Useful for saving state mid-sequence
   * 
   * @example
   * ```typescript
   * const rng = new SeededRNG(42);
   * rng.next();
   * const state = rng.getCurrentSeed(); // Save for later
   * ```
   */
  getCurrentSeed(): number {
    return this.seed;
  }

  /**
   * Sets the current seed/state
   * Useful for restoring a saved state
   * 
   * @param seed - The seed value to set
   */
  setSeed(seed: number): void {
    this.seed = seed;
  }

  /**
   * Gets statistics about the RNG state
   */
  getStats(): RNGStats {
    return {
      initialSeed: this.initialSeed,
      currentSeed: this.seed,
      iterations: this.iterations,
    };
  }

  /**
   * Resets the RNG to its initial state
   * Allows replaying the same random sequence
   * 
   * @example
   * ```typescript
   * const rng = new SeededRNG(42);
   * const first = rng.nextInt(1, 10);
   * const second = rng.nextInt(1, 10);
   * 
   * rng.reset();
   * 
   * console.log(rng.nextInt(1, 10)); // Same as 'first'
   * console.log(rng.nextInt(1, 10)); // Same as 'second'
   * ```
   */
  reset(): void {
    this.seed = this.initialSeed;
    this.iterations = 0;
  }

  /**
   * Generates the next random float between 0 (inclusive) and 1 (exclusive)
   * 
   * Uses LCG algorithm: seed = (seed * a + c) % m
   * 
   * @returns A random float in range [0, 1)
   * 
   * @example
   * ```typescript
   * const rng = new SeededRNG(42);
   * console.log(rng.next()); // e.g., 0.123456...
   * ```
   */
  next(): number {
    this.seed = (this.seed * SeededRNG.A + SeededRNG.C) % SeededRNG.M;
    this.iterations++;
    return this.seed / SeededRNG.M;
  }

  /**
   * Generates a random integer in range [min, max] (inclusive)
   * 
   * @param min - The minimum value (inclusive)
   * @param max - The maximum value (inclusive)
   * @returns A random integer in range [min, max]
   * 
   * @example
   * ```typescript
   * const rng = new SeededRNG(42);
   * const dice = rng.nextInt(1, 6); // Dice roll: 1-6
   * const percent = rng.nextInt(0, 100); // 0-100
   * ```
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Generates a random float in range [min, max)
   * 
   * @param min - The minimum value (inclusive)
   * @param max - The maximum value (exclusive)
   * @returns A random float in range [min, max)
   * 
   * @example
   * ```typescript
   * const rng = new SeededRNG(42);
   * const angle = rng.nextFloat(0, Math.PI * 2); // Random angle
   * ```
   */
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  /**
   * Returns true with the given probability (0-1)
   * 
   * @param probability - The probability of returning true (0.0 to 1.0)
   * @returns True with the given probability
   * 
   * @example
   * ```typescript
   * const rng = new SeededRNG(42);
   * 
   * if (rng.chance(0.25)) {
   *   // 25% chance of this happening
   * }
   * 
   * // Critical hit with 5% chance
   * const isCritical = rng.chance(0.05);
   * ```
   */
  chance(probability: number): boolean {
    return this.next() < probability;
  }

  /**
   * Selects a random element from an array
   * 
   * @param array - The array to select from
   * @returns A random element, or undefined if array is empty
   * 
   * @example
   * ```typescript
   * const rng = new SeededRNG(42);
   * const colors = ['red', 'green', 'blue'];
   * const randomColor = rng.pick(colors); // 'red', 'green', or 'blue'
   * ```
   */
  pick<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    return array[this.nextInt(0, array.length - 1)];
  }

  /**
   * Shuffles an array using the Fisher-Yates algorithm
   * Returns a new shuffled array (does not modify original)
   * 
   * @param array - The array to shuffle
   * @returns A new shuffled array
   * 
   * @example
   * ```typescript
   * const rng = new SeededRNG(42);
   * const deck = ['A', 'K', 'Q', 'J', '10'];
   * const shuffled = rng.shuffle(deck);
   * // deck remains unchanged, shuffled is a new shuffled array
   * ```
   */
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      const temp = result[i];
      result[i] = result[j] as T;
      result[j] = temp as T;
    }
    return result;
  }

  /**
   * Selects a random element based on weights
   * Higher weights are more likely to be selected
   * 
   * @param items - Array of items with their weights
   * @returns The selected item, or undefined if array is empty
   * 
   * @example
   * ```typescript
   * const rng = new SeededRNG(42);
   * 
   * const loot = rng.weightedPick([
   *   { item: 'common', weight: 70 },
   *   { item: 'rare', weight: 20 },
   *   { item: 'legendary', weight: 1 },
   * ]);
   * ```
   */
  weightedPick<T>(items: WeightedItem<T>[]): T | undefined {
    if (items.length === 0) return undefined;

    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
    let random = this.next() * totalWeight;

    for (const item of items) {
      random -= item.weight;
      if (random <= 0) {
        return item.item;
      }
    }

    // Fallback to last item if floating point precision issues
    return items[items.length - 1]?.item;
  }

  /**
   * Generates a random boolean value
   * 
   * @param probability - Probability of returning true (default: 0.5)
   * @returns A random boolean
   * 
   * @example
   * ```typescript
   * const rng = new SeededRNG(42);
   * const coinFlip = rng.nextBool(); // 50/50
   * const biased = rng.nextBool(0.7); // 70% chance of true
   * ```
   */
  nextBool(probability: number = 0.5): boolean {
    return this.chance(probability);
  }

  /**
   * Generates a random sign (-1 or 1)
   * 
   * @returns Either -1 or 1
   * 
   * @example
   * ```typescript
   * const rng = new SeededRNG(42);
   * const direction = rng.nextSign(); // -1 or 1
   * ```
   */
  nextSign(): -1 | 1 {
    return this.chance(0.5) ? 1 : -1;
  }

  /**
   * Generates a random hexadecimal string
   * 
   * @param length - The length of the string to generate
   * @returns A random hexadecimal string
   * 
   * @example
   * ```typescript
   * const rng = new SeededRNG(42);
   * const hex = rng.nextHex(8); // e.g., 'a3f2c8d1'
   * ```
   */
  nextHex(length: number): string {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars[this.nextInt(0, 15)];
    }
    return result;
  }

  /**
   * Generates a random UUID-like string (NOT a real UUID!)
   * This is deterministic based on the seed and should NOT be used for unique identifiers
   * 
   * @returns A UUID-like string
   * 
   * @example
   * ```typescript
   * const rng = new SeededRNG(42);
   * const id = rng.nextUUID(); // e.g., 'a3f2c8d1-4b5e-4f6a-8c9d-0e1f2a3b4c5d'
   * ```
   */
  nextUUID(): string {
    return `${this.nextHex(8)}-${this.nextHex(4)}-${this.nextHex(4)}-${this.nextHex(4)}-${this.nextHex(12)}`;
  }

  /**
   * Creates a new RNG with a random seed derived from this one
   * Useful for creating independent but deterministic sub-generators
   * 
   * @returns A new SeededRNG instance
   * 
   * @example
   * ```typescript
   * const mainRng = new SeededRNG(42);
   * const terrainRng = mainRng.fork();
   * const entityRng = mainRng.fork();
   * // terrainRng and entityRng have different seeds but are deterministic
   * ```
   */
  fork(): SeededRNG {
    return new SeededRNG(this.nextInt(0, 2147483647));
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Creates a new SeededRNG instance
 * Convenience function for quick RNG creation
 * 
 * @param seed - Optional seed value
 * @returns A new SeededRNG instance
 * 
 * @example
 * ```typescript
 * import { createRNG } from '@opensourceframework/seeded-rng';
 * 
 * const rng = createRNG(42);
 * console.log(rng.nextInt(1, 100));
 * ```
 */
export function createRNG(seed?: number | null): SeededRNG {
  return new SeededRNG(seed ?? undefined);
}

/**
 * Generates a single random integer with a seed (one-shot)
 * Useful when you need just one deterministic random value
 * 
 * @param seed - The seed value
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns A deterministic random integer
 * 
 * @example
 * ```typescript
 * import { seededInt } from '@opensourceframework/seeded-rng';
 * 
 * const value = seededInt(42, 1, 100); // Always same result for seed 42
 * ```
 */
export function seededInt(seed: number, min: number, max: number): number {
  const rng = new SeededRNG(seed);
  return rng.nextInt(min, max);
}

/**
 * Generates a single random float with a seed (one-shot)
 * 
 * @param seed - The seed value
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (exclusive)
 * @returns A deterministic random float
 * 
 * @example
 * ```typescript
 * import { seededFloat } from '@opensourceframework/seeded-rng';
 * 
 * const value = seededFloat(42, 0, 1); // Always same result
 * ```
 */
export function seededFloat(seed: number, min: number, max: number): number {
  const rng = new SeededRNG(seed);
  return rng.nextFloat(min, max);
}

/**
 * Shuffles an array with a seed (one-shot)
 * 
 * @param seed - The seed value
 * @param array - The array to shuffle
 * @returns A new shuffled array
 * 
 * @example
 * ```typescript
 * import { seededShuffle } from '@opensourceframework/seeded-rng';
 * 
 * const shuffled = seededShuffle(42, [1, 2, 3, 4, 5]);
 * ```
 */
export function seededShuffle<T>(seed: number, array: T[]): T[] {
  const rng = new SeededRNG(seed);
  return rng.shuffle(array);
}

/**
 * Picks a random element with a seed (one-shot)
 * 
 * @param seed - The seed value
 * @param array - The array to pick from
 * @returns A random element, or undefined if empty
 * 
 * @example
 * ```typescript
 * import { seededPick } from '@opensourceframework/seeded-rng';
 * 
 * const color = seededPick(42, ['red', 'green', 'blue']);
 * ```
 */
export function seededPick<T>(seed: number, array: T[]): T | undefined {
  const rng = new SeededRNG(seed);
  return rng.pick(array);
}

export default SeededRNG;
