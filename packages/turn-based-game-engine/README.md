# @opensourceframework/turn-based-game-engine

A TypeScript turn-based extraction game engine extracted from `tarkuv`. It provides deterministic simulation primitives for raids, combat, items, maps, enemies, quests, crafting, hideout progression, and skills.

## Install

```bash
pnpm add @opensourceframework/turn-based-game-engine
```

## Usage

```ts
import {
  calculateHitChance,
  createGameRNG,
  processTick,
  SKILL_DEFINITIONS,
} from '@opensourceframework/turn-based-game-engine';

const rng = createGameRNG(12345);
const hitChance = calculateHitChance({
  weaponAccuracy: 80,
  distance: 50,
  targetSize: 1,
  shooterSkill: 10,
});
```

The engine is framework-agnostic and stores all mutable progress in plain serializable objects.
