// src/lib/game/rng.ts
/**
 * Seeded Random Number Generator for deterministic game behavior.
 * Uses Linear Congruential Generator (LCG) algorithm for consistent,
 * reproducible random sequences given the same seed.
 *
 * Based on game programming best practices for deterministic RNG
 * in game engines to support replay debugging and fair gameplay.
 */
export class SeededRNG {
    private seed: number;
    private initialSeed: number;

    /**
     * Creates a new seeded RNG instance
     * @param seed - Optional seed value. If not provided, generates random seed
     */
    constructor(seed?: number) {
        this.initialSeed = seed ?? Math.floor(Math.random() * 2147483647);
        this.seed = this.initialSeed;
    }

    /**
     * Gets the initial seed value (for serialization/replay)
     */
    getInitialSeed(): number {
        return this.initialSeed;
    }

    /**
     * Gets current seed value
     */
    getCurrentSeed(): number {
        return this.seed;
    }

    /**
     * Resets the RNG to its initial state
     */
    reset(): void {
        this.seed = this.initialSeed;
    }

    /**
     * Generates next random float between 0 (inclusive) and 1 (exclusive)
     * Uses LCG: seed = (seed * a + c) % m
     * where a = 9301, c = 49297, m = 233280
     */
    next(): number {
        // Linear congruential generator parameters
        const a = 9301;
        const c = 49297;
        const m = 233280;

        this.seed = (this.seed * a + c) % m;
        return this.seed / m;
    }

    /**
     * Generates random integer in range [min, max] (inclusive)
     */
    nextInt(min: number, max: number): number {
        return Math.floor(this.next() * (max - min + 1)) + min;
    }

    /**
     * Generates random float in range [min, max)
     */
    nextFloat(min: number, max: number): number {
        return this.next() * (max - min) + min;
    }

    /**
     * Returns true with given probability (0-1)
     */
    chance(probability: number): boolean {
        return this.next() < probability;
    }

    /**
     * Selects random element from array
     */
    pick<T>(array: T[]): T | undefined {
        if (array.length === 0) return undefined;
        return array[this.nextInt(0, array.length - 1)];
    }

    /**
     * Shuffles array using Fisher-Yates algorithm
     */
    shuffle<T>(array: T[]): T[] {
        const result = [...array];
        for (let i = result.length - 1; i > 0; i--) {
            const j = this.nextInt(0, i);
            const temp = result[i] as T;
            result[i] = result[j] as T;
            result[j] = temp;
        }
        return result;
    }

    /**
     * Weighted random selection from options
     * @param items - Array of items with weights
     * @returns Selected item or undefined if array is empty
     */
    weightedPick<T>(items: { item: T; weight: number }[]): T | undefined {
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
}

/**
 * Creates RNG from game state for deterministic gameplay
 * Uses raid seed if available, otherwise generates new seed
 */
export function createGameRNG(seed?: number | null): SeededRNG {
    return new SeededRNG(seed ?? undefined);
}
