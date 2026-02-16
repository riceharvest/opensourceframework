# @opensourceframework/seeded-rng

[![npm version](https://badge.fury.io/js/@opensourceframework%2Fseeded-rng.svg)](https://badge.fury.io/js/@opensourceframework%2Fseeded-rng)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Seeded random number generator for reproducible randomness in games, simulations, and testing.

> ⚠️ **SECURITY WARNING**: This library is **NOT cryptographically secure**!
> 
> Do NOT use for:
> - Password generation
> - Cryptographic keys
> - Session tokens
> - Nonce generation
> - Any security-sensitive operations
> 
> For cryptographic randomness, use:
> - Browser: `crypto.getRandomValues()`
> - Node.js: `crypto.randomBytes()` or `crypto.randomInt()`

## Features

- 🎲 **Deterministic Randomness** - Same seed always produces the same sequence
- 🔄 **Reproducible Results** - Perfect for testing, debugging, and replays
- 🎮 **Game Development** - Procedural generation, AI behavior, loot tables
- 🧪 **Testing** - Deterministic test data generation
- 📊 **Simulations** - Reproducible simulation results
- 🪶 **Zero Dependencies** - Lightweight and self-contained

## Installation

```bash
npm install @opensourceframework/seeded-rng
# or
yarn add @opensourceframework/seeded-rng
# or
pnpm add @opensourceframework/seeded-rng
```

## Quick Start

```typescript
import { SeededRNG } from '@opensourceframework/seeded-rng';

// Create with a specific seed for reproducibility
const rng = new SeededRNG(42);

// Basic random values
console.log(rng.next());           // Float [0, 1)
console.log(rng.nextInt(1, 100));  // Integer [1, 100]
console.log(rng.nextFloat(0, 10)); // Float [0, 10)

// Game mechanics
const diceRoll = rng.nextInt(1, 6);
const isCritical = rng.chance(0.05); // 5% chance
const coinFlip = rng.nextBool();

// Array operations
const colors = ['red', 'green', 'blue'];
const randomColor = rng.pick(colors);
const shuffled = rng.shuffle([1, 2, 3, 4, 5]);

// Weighted selection (loot tables)
const loot = rng.weightedPick([
  { item: 'common', weight: 70 },
  { item: 'rare', weight: 20 },
  { item: 'legendary', weight: 1 },
]);

// Reset to replay the same sequence
rng.reset();
console.log(rng.nextInt(1, 100)); // Same as first call
```

## API Reference

### `SeededRNG` Class

#### Constructor

```typescript
new SeededRNG(seed?: number)
```

Creates a new RNG instance. If no seed is provided, a random seed is generated.

#### Methods

| Method | Description |
|--------|-------------|
| `next()` | Returns random float [0, 1) |
| `nextInt(min, max)` | Returns random integer [min, max] |
| `nextFloat(min, max)` | Returns random float [min, max) |
| `nextBool(probability?)` | Returns random boolean (default 50%) |
| `nextSign()` | Returns -1 or 1 |
| `chance(probability)` | Returns true with given probability |
| `pick(array)` | Returns random element from array |
| `shuffle(array)` | Returns shuffled copy of array |
| `weightedPick(items)` | Weighted random selection |
| `nextHex(length)` | Returns random hex string |
| `nextUUID()` | Returns UUID-like string |
| `fork()` | Creates new independent RNG |
| `reset()` | Resets to initial state |
| `getInitialSeed()` | Gets the initial seed |
| `getCurrentSeed()` | Gets current state |
| `setSeed(seed)` | Sets current state |
| `getStats()` | Gets RNG statistics |

### Convenience Functions

```typescript
import { 
  createRNG, 
  seededInt, 
  seededFloat, 
  seededShuffle, 
  seededPick 
} from '@opensourceframework/seeded-rng';

// Create RNG
const rng = createRNG(42);

// One-shot operations (don't create instance)
const value = seededInt(42, 1, 100);
const shuffled = seededShuffle(42, [1, 2, 3, 4, 5]);
const picked = seededPick(42, ['a', 'b', 'c']);
```

## Usage Examples

### Procedural Generation

```typescript
import { SeededRNG } from '@opensourceframework/seeded-rng';

function generateTerrain(seed: number, width: number, height: number) {
  const rng = new SeededRNG(seed);
  const terrain = [];
  
  for (let y = 0; y < height; y++) {
    const row = [];
    for (let x = 0; x < width; x++) {
      row.push({
        elevation: rng.nextFloat(0, 1),
        moisture: rng.nextFloat(0, 1),
        hasTree: rng.chance(0.1),
      });
    }
    terrain.push(row);
  }
  
  return terrain;
}

// Same seed always produces same terrain
const world1 = generateTerrain(12345, 100, 100);
const world2 = generateTerrain(12345, 100, 100);
// world1 === world2 (same data)
```

### Game Loot System

```typescript
import { SeededRNG } from '@opensourceframework/seeded-rng';

class LootSystem {
  private rng: SeededRNG;

  constructor(seed: number) {
    this.rng = new SeededRNG(seed);
  }

  dropLoot() {
    const rarity = this.rng.weightedPick([
      { item: 'common', weight: 60 },
      { item: 'uncommon', weight: 25 },
      { item: 'rare', weight: 12 },
      { item: 'epic', weight: 2.5 },
      { item: 'legendary', weight: 0.5 },
    ]);

    const itemCount = this.rng.nextInt(1, 3);
    const items = [];

    for (let i = 0; i < itemCount; i++) {
      items.push(this.generateItem(rarity));
    }

    return { rarity, items };
  }

  private generateItem(rarity: string) {
    // Generate item based on rarity
    return {
      id: this.rng.nextUUID(),
      name: `${rarity} item`,
      stats: {
        power: this.rng.nextInt(10, 100),
        defense: this.rng.nextInt(5, 50),
      },
    };
  }
}
```

### Testing with Deterministic Data

```typescript
import { SeededRNG } from '@opensourceframework/seeded-rng';

describe('User Processing', () => {
  let rng: SeededRNG;

  beforeEach(() => {
    rng = new SeededRNG(42); // Consistent seed for all tests
  });

  function generateTestUser() {
    return {
      id: rng.nextUUID(),
      name: `User_${rng.nextInt(1000, 9999)}`,
      email: `test${rng.nextInt(1, 100)}@example.com`,
      age: rng.nextInt(18, 80),
      active: rng.nextBool(),
    };
  }

  it('should process user correctly', () => {
    const user = generateTestUser();
    // Same user data every test run
    expect(user.age).toBe(58); // Deterministic!
  });
});
```

### Replay System

```typescript
import { SeededRNG } from '@opensourceframework/seeded-rng';

class GameReplay {
  private rng: SeededRNG;
  private seed: number;
  private actions: Array<{ frame: number; action: string }> = [];

  constructor(seed: number) {
    this.seed = seed;
    this.rng = new SeededRNG(seed);
  }

  recordAction(frame: number, action: string) {
    this.actions.push({ frame, action });
  }

  getReplayData() {
    return {
      seed: this.seed,
      actions: this.actions,
    };
  }

  static replay(data: { seed: number; actions: Array<{ frame: number; action: string }> }) {
    const rng = new SeededRNG(data.seed);
    // Replay will have identical RNG sequence
    return { rng, actions: data.actions };
  }
}
```

## Algorithm

This library uses the Linear Congruential Generator (LCG) algorithm:

```
seed = (seed * a + c) % m
```

With parameters from Numerical Recipes:
- a = 9301
- c = 49297  
- m = 233280

This provides:
- Fast computation
- Good statistical properties for non-crypto use
- Reproducible sequences across platforms

## Contributing

See [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

MIT © OpenSource Framework Contributors
