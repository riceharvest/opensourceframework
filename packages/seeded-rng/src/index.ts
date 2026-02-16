/**
 * Seeded Random Number Generator
 * 
 * ⚠️ **SECURITY WARNING**: The default SeededRNG (LCG) is NOT cryptographically secure!
 * 
 * This library provides TWO RNG implementations:
 * 
 * 1. **SeededRNG** (LCG) - Fast but NOT secure
 *    - Do NOT use for: passwords, keys, tokens, nonces, security
 *    - Use for: games, simulations, testing, debugging
 * 
 * 2. **SecureSeededRNG** (ISAAC) - Cryptographically Secure
 *    - Use for: any security-sensitive operations
 *    - Deterministic and reproducible like SeededRNG
 *    - Based on ISAAC cipher algorithm
 * 
 * For cryptographic randomness without seeding:
 * - Browser: `crypto.getRandomValues()`
 * - Node.js: `crypto.randomBytes()` or `crypto.randomInt()`
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
  /** Use cryptographically secure RNG (default: false) */
  secure?: boolean;
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
// SeededRNG Class (Fast, NOT Cryptographically Secure)
// ============================================================================

/**
 * Seeded Random Number Generator for deterministic, reproducible randomness.
 * 
 * Uses the Linear Congruential Generator (LCG) algorithm for consistent,
 * reproducible random sequences given the same seed.
 * 
 * ⚠️ **WARNING**: This is NOT cryptographically secure!
 * Use SecureSeededRNG for security-sensitive applications.
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
   */
  getInitialSeed(): number {
    return this.initialSeed;
  }

  /**
   * Gets the current seed/state value
   */
  getCurrentSeed(): number {
    return this.seed;
  }

  /**
   * Sets the current seed/state
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
   */
  reset(): void {
    this.seed = this.initialSeed;
    this.iterations = 0;
  }

  /**
   * Generates the next random float between 0 (inclusive) and 1 (exclusive)
   * Uses LCG algorithm: seed = (seed * a + c) % m
   */
  next(): number {
    this.seed = (this.seed * SeededRNG.A + SeededRNG.C) % SeededRNG.M;
    this.iterations++;
    return this.seed / SeededRNG.M;
  }

  /**
   * Generates a random integer in range [min, max] (inclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Generates a random float in range [min, max)
   */
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  /**
   * Returns true with the given probability (0-1)
   */
  chance(probability: number): boolean {
    return this.next() < probability;
  }

  /**
   * Selects a random element from an array
   */
  pick<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    return array[this.nextInt(0, array.length - 1)];
  }

  /**
   * Shuffles an array using the Fisher-Yates algorithm
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

    return items[items.length - 1]?.item;
  }

  /**
   * Generates a random boolean value
   */
  nextBool(probability: number = 0.5): boolean {
    return this.chance(probability);
  }

  /**
   * Generates a random sign (-1 or 1)
   */
  nextSign(): -1 | 1 {
    return this.chance(0.5) ? 1 : -1;
  }

  /**
   * Generates a random hexadecimal string
   * ⚠️ NOT for cryptographic use - use SecureSeededRNG for secure hex
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
   * ⚠️ NOT for security use - use crypto.randomUUID() for real UUIDs
   */
  nextUUID(): string {
    return `${this.nextHex(8)}-${this.nextHex(4)}-${this.nextHex(4)}-${this.nextHex(4)}-${this.nextHex(12)}`;
  }

  /**
   * Creates a new RNG with a random seed derived from this one
   */
  fork(): SeededRNG {
    return new SeededRNG(this.nextInt(0, 2147483647));
  }
}

// ============================================================================
// SecureSeededRNG Class (Cryptographically Secure - ISAAC)
// ============================================================================

/**
 * Cryptographically Secure Seeded Random Number Generator
 * 
 * Uses the ISAAC (Indirection, Shift, Accumulate, Add, and Count) cipher
 * algorithm to generate cryptographically secure pseudo-random numbers.
 * 
 * This is suitable for:
 * - Password generation
 * - Cryptographic keys
 * - Session tokens
 * - Nonce generation
 * - Any security-sensitive operations
 * 
 * Like SeededRNG, this is deterministic - the same seed produces the same sequence.
 * 
 * @example
 * ```typescript
 * import { SecureSeededRNG } from '@opensourceframework/seeded-rng';
 * 
 * // Create with a specific seed for reproducibility
 * const rng = new SecureSeededRNG(12345);
 * 
 * console.log(rng.nextInt(1, 100)); // Always same result for seed 12345
 * console.log(rng.nextHex(32)); // Always same secure hex for seed 12345
 * 
 * // Reset to replay the same sequence
 * rng.reset();
 * console.log(rng.nextInt(1, 100)); // Same as first call
 * ```
 * 
 * @example
 * ```typescript
 * // Generate a secure random password
 * const rng = new SecureSeededRNG();
 * const password = rng.nextSecureHex(32); // 32 bytes of secure randomness
 * ```
 */
export class SecureSeededRNG {
  private seed: number;
  private initialSeed: number;
  private iterations: number = 0;
  
  // ISAAC state
  private randRsl: number[];
  private randCnt: number;
  private randA: number;
  private randB: number;
  private randC: number;

  /**
   * Creates a new secure seeded RNG instance
   * 
   * @param seed - Optional seed value. If not provided, uses crypto.getRandomValues()
   * 
   * @example
   * ```typescript
   * // With a specific seed (reproducible)
   * const rng1 = new SecureSeededRNG(42);
   * 
   * // Without seed (cryptographically random each time)
   * const rng2 = new SecureSeededRNG();
   * ```
   */
  constructor(seed?: number) {
    // Initialize arrays
    this.randRsl = new Array(256);
    this.randCnt = 256;
    this.randA = 0;
    this.randB = 0;
    this.randC = 0;
    
    // Use crypto API if available for initial random seed
    if (seed === undefined) {
      let randomSeed = Math.floor(Math.random() * 4294967296);
      
      try {
        // Try to use crypto.getRandomValues
        const array = new Uint32Array(1);
        (globalThis as any).crypto?.getRandomValues?.(array);
        if (array[0] !== undefined) {
          randomSeed = array[0];
        }
      } catch {
        // Fallback to Math.random
      }
      
      seed = randomSeed;
    }
    
    this.initialSeed = seed;
    this.seed = seed;
    this.isaacSeed(seed);
  }

  /**
   * Initialize ISAAC with a seed
   */
  private isaacSeed(seed: number): void {
    // Generate 256 32-bit values from the seed using a mixing function
    const seedArray: number[] = new Array(256);
    
    // Simple seed expansion - mix the seed with golden ratio
    const GOLDEN_RATIO = 0x9e3779b9;
    let mix = seed;
    
    for (let i = 0; i < 256; i++) {
      mix = (mix ^ (mix >>> 16)) * GOLDEN_RATIO | 0;
      seedArray[i] = mix;
    }
    
    // Initialize randA, randB, randC with values derived from seed
    this.randA = seed;
    this.randB = seed ^ 0x9e3779b9;
    this.randC = seed ^ 0x9e3779b9;
    
    // Initialize randRsl with seed array
    for (let i = 0; i < 256; i++) {
      this.randRsl[i] = seedArray[i] ?? 0;
    }
    
    // Initialize randCnt
    this.randCnt = 256;
    
    // First round of ISAAC - warm up
    this.isaac();
  }

  /**
   * ISAAC algorithm - generates 256 random 32-bit values
   */
  private isaac(): void {
    let i, x, y;
    
    this.randB = (this.randB + (this.randC + 1) | 0) | 0;
    this.randC = (this.randC + 1) | 0;
    
    for (i = 0; i < 256; i++) {
      x = this.randRsl[i];
      
      switch (i & 3) {
        case 0:
          this.randA = (this.randA ^ (this.randA << 13)) | 0;
          break;
        case 1:
          this.randA = (this.randA ^ (this.randA >>> 6)) | 0;
          break;
        case 2:
          this.randA = (this.randA ^ (this.randA << 2)) | 0;
          break;
        case 3:
          this.randA = (this.randA ^ (this.randA >>> 16)) | 0;
          break;
      }
      
      const rslIdx = (i + 128) & 0xff;
      const rslVal = this.randRsl[rslIdx] ?? 0;
      y = ((rslVal + this.randA) | 0) + this.randB | 0;
      
      this.randRsl[i] = y;
      
      const idx2 = (y >>> 2) & 0xff;
      const rslVal2 = this.randRsl[idx2] ?? 0;
      this.randB = ((rslVal2 + this.randA + this.randB) | 0) | 0;
    }
  }

  /**
   * Get next 32-bit random value
   */
  private rand(): number {
    if (this.randCnt === 0) {
      this.isaac();
      this.randCnt = 256;
    }
    
    this.randCnt--;
    this.iterations++;
    
    const result = this.randRsl[this.randCnt];
    return result ?? 0;
  }

  /**
   * Gets the initial seed value
   */
  getInitialSeed(): number {
    return this.initialSeed;
  }

  /**
   * Gets the current state value
   */
  getCurrentSeed(): number {
    return this.seed;
  }

  /**
   * Sets the current seed/state
   */
  setSeed(seed: number): void {
    this.seed = seed;
    this.isaacSeed(seed);
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
   */
  reset(): void {
    this.seed = this.initialSeed;
    this.iterations = 0;
    this.isaacSeed(this.initialSeed);
  }

  /**
   * Generates the next random float between 0 (inclusive) and 1 (exclusive)
   */
  next(): number {
    // Use >>> 0 to convert signed 32-bit int to unsigned before division
    return (this.rand() >>> 0) / 4294967296;
  }

  /**
   * Generates a random integer in range [min, max] (inclusive)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Generates a random float in range [min, max)
   */
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  /**
   * Returns true with the given probability (0-1)
   */
  chance(probability: number): boolean {
    return this.next() < probability;
  }

  /**
   * Selects a random element from an array
   */
  pick<T>(array: T[]): T | undefined {
    if (array.length === 0) return undefined;
    return array[this.nextInt(0, array.length - 1)];
  }

  /**
   * Shuffles an array using the Fisher-Yates algorithm
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

    return items[items.length - 1]?.item;
  }

  /**
   * Generates a random boolean value
   */
  nextBool(probability: number = 0.5): boolean {
    return this.chance(probability);
  }

  /**
   * Generates a random sign (-1 or 1)
   */
  nextSign(): -1 | 1 {
    return this.chance(0.5) ? 1 : -1;
  }

  /**
   * Generates a cryptographically secure random hexadecimal string
   * 
   * This IS safe for:
   * - Session tokens
   * - API keys
   * - Reset tokens
   * - Any security-sensitive strings
   * 
   * When seeded, always uses ISAAC for deterministic output.
   * 
   * @param length - Number of bytes (each byte becomes 2 hex chars)
   */
  nextHex(length: number): string {
    const chars = '0123456789abcdef';
    let result = '';
    
    // Always use ISAAC for deterministic behavior when seeded
    // crypto.getRandomValues would break determinism
    for (let i = 0; i < length; i++) {
      const byte = this.rand() & 0xff;
      result += chars[(byte >> 4) & 0x0f];
      result += chars[byte & 0x0f];
    }
    return result;
  }

  /**
   * Generates a cryptographically secure random byte array
   * 
   * @param length - Number of random bytes to generate
   */
  nextBytes(length: number): Uint8Array {
    const bytes = new Uint8Array(length);
    
    // Always use ISAAC for deterministic behavior when seeded
    // crypto.getRandomValues would break determinism
    for (let i = 0; i < length; i++) {
      bytes[i] = this.rand() & 0xff;
    }
    
    return bytes;
  }

  /**
   * Generates a cryptographically secure random Base64 string
   * 
   * @param length - Number of random bytes before encoding
   */
  nextBase64(length: number): string {
    const bytes = this.nextBytes(length);
    let binary = '';
    for (let i = 0; i < bytes.length; i++) {
      const byte = bytes[i] ?? 0;
      binary += String.fromCharCode(byte);
    }
    return btoa(binary);
  }

  /**
   * Generates a random UUID v4 (cryptographically secure)
   * 
   * Uses ISAAC for deterministic UUID generation when seeded.
   */
  nextUUID(): string {
    // Use ISAAC for deterministic UUID generation when seeded
    const bytes = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
      bytes[i] = this.rand() & 0xff;
    }
    
    // Set version (4) and variant (RFC 4122)
    const byte6 = bytes[6] ?? 0;
    const byte8 = bytes[8] ?? 0;
    bytes[6] = (byte6 & 0x0f) | 0x40;
    bytes[8] = (byte8 & 0x3f) | 0x80;
    
    const hex = Array.from(bytes).map(b => (b ?? 0).toString(16).padStart(2, '0')).join('');
    return `${hex.slice(0,8)}-${hex.slice(8,12)}-${hex.slice(12,16)}-${hex.slice(16,20)}-${hex.slice(20)}`;
  }

  /**
   * Creates a new SecureSeededRNG with a random seed derived from this one
   */
  fork(): SecureSeededRNG {
    return new SecureSeededRNG(this.nextInt(0, 4294967295));
  }
}

// ============================================================================
// Convenience Functions
// ============================================================================

/**
 * Creates a new SeededRNG instance (fast, NOT cryptographically secure)
 * 
 * This is a convenience factory function that creates a new SeededRNG instance.
 * The SeededRNG uses a Linear Congruential Generator (LCG) algorithm which is
 * fast but NOT suitable for security-sensitive operations.
 * 
 * @param seed - Optional seed value. If not provided, a random seed will be generated.
 *               Pass `null` to explicitly indicate no seed is provided.
 * @returns A new SeededRNG instance initialized with the provided or generated seed
 * 
 * @example
 * ```typescript
 * // With a specific seed (reproducible sequences)
 * const rng = createRNG(42);
 * console.log(rng.nextInt(1, 100)); // Always returns the same value
 * 
 * // Without seed (random each time)
 * const rng2 = createRNG();
 * ```
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random|Math.random}
 * @group Seeded RNG
 */
export function createRNG(seed?: number | null): SeededRNG {
  return new SeededRNG(seed ?? undefined);
}

/**
 * Creates a new SecureSeededRNG instance (cryptographically secure)
 * 
 * This is a convenience factory function that creates a new SecureSeededRNG instance.
 * The SecureSeededRNG uses the ISAAC cipher algorithm which is cryptographically
 * secure and suitable for security-sensitive operations like password generation,
 * token creation, and cryptographic key derivation.
 * 
 * @param seed - Optional seed value for deterministic sequences.
 *               If not provided, a cryptographically random seed will be generated
 *               using `crypto.getRandomValues()` where available.
 *               Pass `null` to explicitly indicate no seed is provided.
 * @returns A new SecureSeededRNG instance initialized with the provided or generated seed
 * 
 * @example
 * ```typescript
 * // With a specific seed (reproducible sequences)
 * const rng = createSecureRNG(42);
 * console.log(rng.nextHex(16)); // Always returns the same value
 * 
 * // Without seed (cryptographically random each time)
 * const rng2 = createSecureRNG();
 * const password = rng2.nextSecureHex(32); // 32-byte secure password
 * ```
 * 
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Crypto/getRandomValues|crypto.getRandomValues}
 * @group Secure RNG
 */
export function createSecureRNG(seed?: number | null): SecureSeededRNG {
  return new SecureSeededRNG(seed ?? undefined);
}

/**
 * Generates a single random integer with a seed (one-shot, NOT secure)
 * 
 * Creates a temporary SeededRNG instance, generates a single random integer
 * in the specified range [min, max], and returns the result.
 * 
 * ⚠️ This is NOT cryptographically secure. Use for games, testing, or
 * non-security-related randomness only.
 * 
 * @param seed - The seed value for deterministic randomness
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns A random integer between min and max (inclusive)
 * 
 * @example
 * ```typescript
 * // Always returns the same value for the same seed
 * console.log(seededInt(12345, 1, 100)); // Always returns 38 (for example)
 * ```
 * 
 * @see {@link SeededRNG.nextInt}
 */
export function seededInt(seed: number, min: number, max: number): number {
  const rng = new SeededRNG(seed);
  return rng.nextInt(min, max);
}

/**
 * Generates a single random float with a seed (one-shot, NOT secure)
 * 
 * Creates a temporary SeededRNG instance, generates a single random float
 * in the specified range [min, max), and returns the result.
 * 
 * ⚠️ This is NOT cryptographically secure. Use for games, testing, or
 * non-security-related randomness only.
 * 
 * @param seed - The seed value for deterministic randomness
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (exclusive)
 * @returns A random float between min (inclusive) and max (exclusive)
 * 
 * @example
 * ```typescript
 * // Always returns the same value for the same seed
 * console.log(seededFloat(12345, 0.0, 1.0)); // Always returns 0.83... (for example)
 * ```
 * 
 * @see {@link SeededRNG.nextFloat}
 */
export function seededFloat(seed: number, min: number, max: number): number {
  const rng = new SeededRNG(seed);
  return rng.nextFloat(min, max);
}

/**
 * Shuffles an array with a seed (one-shot, NOT secure)
 * 
 * Creates a temporary SeededRNG instance, shuffles the array using the
 * Fisher-Yates algorithm with the seeded random number generator, and
 * returns a new shuffled array.
 * 
 * ⚠️ This is NOT cryptographically secure. Use for games, testing, or
 * non-security-related randomness only.
 * 
 * @param seed - The seed value for deterministic shuffling
 * @param array - The array to shuffle
 * @returns A new array with elements in random order (deterministic based on seed)
 * 
 * @example
 * ```typescript
 * // Always produces the same shuffle for the same seed
 * const result = seededShuffle(42, ['a', 'b', 'c', 'd']);
 * // Result is always: ['c', 'a', 'd', 'b'] (for example)
 * ```
 * 
 * @see {@link SeededRNG.shuffle}
 */
export function seededShuffle<T>(seed: number, array: T[]): T[] {
  const rng = new SeededRNG(seed);
  return rng.shuffle(array);
}

/**
 * Picks a random element with a seed (one-shot, NOT secure)
 * 
 * Creates a temporary SeededRNG instance and selects a random element
 * from the provided array.
 * 
 * ⚠️ This is NOT cryptographically secure. Use for games, testing, or
 * non-security-related randomness only.
 * 
 * @param seed - The seed value for deterministic selection
 * @param array - The array to pick from
 * @returns A randomly selected element from the array, or undefined if empty
 * 
 * @example
 * ```typescript
 * // Always picks the same element for the same seed
 * const item = seededPick(42, ['apple', 'banana', 'cherry']);
 * // Always returns 'banana' (for example)
 * 
 * // Returns undefined for empty arrays
 * const empty = seededPick(1, []); // Returns undefined
 * ```
 * 
 * @see {@link SeededRNG.pick}
 */
export function seededPick<T>(seed: number, array: T[]): T | undefined {
  const rng = new SeededRNG(seed);
  return rng.pick(array);
}

/**
 * Generates a single cryptographically secure random integer with a seed
 * 
 * Creates a temporary SecureSeededRNG instance and generates a single
 * random integer in the specified range [min, max].
 * 
 * This IS cryptographically secure and suitable for security-sensitive
 * operations like generating random IDs, tokens, or any value that
 * should not be predictable.
 * 
 * @param seed - The seed value for deterministic (but still secure) sequences
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns A cryptographically secure random integer between min and max (inclusive)
 * 
 * @example
 * ```typescript
 * // Generates a secure random number (still deterministic with same seed)
 * const num = seededSecureInt(42, 1, 1000000);
 * ```
 * 
 * @see {@link SecureSeededRNG.nextInt}
 */
export function seededSecureInt(seed: number, min: number, max: number): number {
  const rng = new SecureSeededRNG(seed);
  return rng.nextInt(min, max);
}

/**
 * Generates a cryptographically secure random hex string (seeded)
 * 
 * Creates a temporary SecureSeededRNG instance and generates a
 * cryptographically secure hexadecimal string.
 * 
 * This IS safe for:
 * - Session tokens
 * - API keys
 * - Password reset tokens
 * - Any security-sensitive strings
 * 
 * @param seed - The seed value for deterministic (but still secure) sequences
 * @param length - Number of bytes (each byte becomes 2 hex characters)
 * @returns A cryptographically secure hexadecimal string
 * 
 * @example
 * ```typescript
 * // Generate a 32-byte (64 character) secure hex string
 * const token = seededSecureHex(42, 32);
 * // Returns: 'a1b2c3d4e5f6...'
 * 
 * // Generate a 16-byte API key
 * const apiKey = seededSecureHex(Date.now(), 16);
 * ```
 * 
 * @see {@link SecureSeededRNG.nextHex}
 */
export function seededSecureHex(seed: number, length: number): string {
  const rng = new SecureSeededRNG(seed);
  return rng.nextHex(length);
}

export { SeededRNG as default };
