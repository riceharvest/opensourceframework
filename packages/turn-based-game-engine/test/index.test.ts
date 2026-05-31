import { describe, expect, it, vi } from 'vitest';

import {
  calculateFirstShotRecoil,
  createGameRNG,
  processTick,
  type GameState,
} from '../src/index';

function createMinimalGameState(overrides: Partial<GameState> = {}): GameState {
  const now = Date.now();

  const baseState: GameState = {
    version: 'test',
    lastTick: now,
    playerStats: {
      hp: {
        head: 35,
        thorax: 85,
        stomach: 70,
        leftArm: 60,
        rightArm: 60,
        leftLeg: 65,
        rightLeg: 65,
      },
      energy: 100,
      hydration: 100,
    },
    skills: {
      ballistics: { level: 1, xp: 0 },
      firepower: { level: 1, xp: 0 },
      tactics: { level: 1, xp: 0 },
      endurance: { level: 1, xp: 0 },
      marksman: { level: 1, xp: 0 },
      cqb: { level: 1, xp: 0 },
      scavenging: { level: 1, xp: 0 },
      navigation: { level: 1, xp: 0 },
      trading: { level: 1, xp: 0 },
      engineering: { level: 1, xp: 0 },
      survival: { level: 1, xp: 0 },
      intel: { level: 1, xp: 0 },
    },
    activeEffects: [],
    activeRaid: null,
    activeCrafts: [],
    traders: {},
    hideoutModules: {},
    insuranceReturns: [],
    stash: [],
    equipment: {},
    quests: [],
    lastRaidSummary: null,
    weaponMastery: {},
    detailedBodyParts: {
      head: { hp: 35, maxHp: 35, isBlacked: false },
      thorax: { hp: 85, maxHp: 85, isBlacked: false },
      stomach: { hp: 70, maxHp: 70, isBlacked: false },
      leftArm: { hp: 60, maxHp: 60, isBlacked: false },
      rightArm: { hp: 60, maxHp: 60, isBlacked: false },
      leftLeg: { hp: 65, maxHp: 65, isBlacked: false },
      rightLeg: { hp: 65, maxHp: 65, isBlacked: false },
    },
    bleedingEffects: [],
    fractures: [],
    weaponStates: {},
    stamina: { current: 100, max: 100, isRecovering: false },
    weight: { current: 0, threshold: 'light' },
    painkillerState: {
      active: false,
      startTime: 0,
      duration: 0,
      usesInWindow: 0,
      windowStartTime: 0,
      addictionLevel: 0,
      isInWithdrawal: false,
    },
    recoilState: { verticalBuildup: 0, horizontalBuildup: 0, recoveryRate: 1, shotsInBurst: 0 },
    visorStates: {},
    fleaMarketListings: [],
    scavKarma: 0,
    secureContainer: undefined,
    stashRows: 10,
    stashCols: 10,
    level: 1,
    xp: 0,
    roubles: 0,
    dollars: 0,
    euros: 0,
  };

  return { ...baseState, ...overrides };
}

describe('@opensourceframework/turn-based-game-engine', () => {
  it('exports deterministic game RNG helpers', () => {
    const first = createGameRNG(12345);
    const second = createGameRNG(12345);

    expect(first.nextInt(1, 100)).toBe(second.nextInt(1, 100));
  });

  it('processes a tick without app-specific runtime dependencies', () => {
    vi.useFakeTimers({ now: new Date('2026-01-01T00:00:00.000Z') });
    const state = createMinimalGameState();

    vi.advanceTimersByTime(1000);
    const result = processTick(state);

    expect(result.updates.lastTick).toBeGreaterThan(state.lastTick);
    expect(result.updates.playerStats?.energy).toBeLessThan(100);
    expect(result.events).toEqual([]);
    vi.useRealTimers();
  });

  it('keeps ballistics utilities available from the public entrypoint', () => {
    expect(calculateFirstShotRecoil(10)).toBeGreaterThan(1);
  });
});
