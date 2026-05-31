// src/lib/game/enemies.ts
import type { SeededRNG } from './rng';

export interface Enemy {
    id: string;
    name: string;
    type: 'scav' | 'guard' | 'boss' | 'pmc' | 'raider';
    hp: number;
    maxHp: number;
    armorClass: number;
    weaponId: string;
    accuracy: number; // 0-1
    reactionTime: number; // seconds
    lootTable: string; // reference to loot table id
    difficulty: number; // 0-100
    damage: number; // Base damage per hit
    attackChance: number; // Chance to attack per tick
    health: number; // Alias for hp
}

export const ENEMY_DATABASE: Record<string, Enemy> = {
    // SCAVS (Low Tier)
    'scav-basic': {
        id: 'scav-basic',
        name: 'Scavenger',
        type: 'scav',
        hp: 100,
        maxHp: 100,
        health: 100,
        armorClass: 1,
        weaponId: 'pm-pistol',
        accuracy: 0.2,
        reactionTime: 2.0,
        lootTable: 'scav-loot',
        difficulty: 10,
        damage: 15,
        attackChance: 0.15
    },
    'scav-armed': {
        id: 'scav-armed',
        name: 'Armed Scav',
        type: 'scav',
        hp: 150,
        maxHp: 150,
        health: 150,
        armorClass: 2,
        weaponId: 'ak-74',
        accuracy: 0.25,
        reactionTime: 1.5,
        lootTable: 'scav-loot',
        difficulty: 20,
        damage: 25,
        attackChance: 0.18
    },
    'scav-veteran': {
        id: 'scav-veteran',
        name: 'Veteran Scav',
        type: 'scav',
        hp: 200,
        maxHp: 200,
        health: 200,
        armorClass: 3,
        weaponId: 'ak-74',
        accuracy: 0.35,
        reactionTime: 1.0,
        lootTable: 'scav-veteran-loot',
        difficulty: 35,
        damage: 30,
        attackChance: 0.22
    },

    // RAIDERS (Mid-High Tier)
    'raider-basic': {
        id: 'raider-basic',
        name: 'PMC Raider',
        type: 'raider',
        hp: 250,
        maxHp: 250,
        health: 250,
        armorClass: 4,
        weaponId: 'm4a1',
        accuracy: 0.45,
        reactionTime: 0.8,
        lootTable: 'raider-loot',
        difficulty: 50,
        damage: 35,
        attackChance: 0.28
    },
    'raider-heavy': {
        id: 'raider-heavy',
        name: 'Heavy Raider',
        type: 'raider',
        hp: 350,
        maxHp: 350,
        health: 350,
        armorClass: 5,
        weaponId: 'm4a1',
        accuracy: 0.5,
        reactionTime: 0.7,
        lootTable: 'raider-heavy-loot',
        difficulty: 65,
        damage: 40,
        attackChance: 0.3
    },
    'raider-sniper': {
        id: 'raider-sniper',
        name: 'Raider Sniper',
        type: 'raider',
        hp: 180,
        maxHp: 180,
        health: 180,
        armorClass: 3,
        weaponId: 'sv-98',
        accuracy: 0.7,
        reactionTime: 1.2,
        lootTable: 'raider-sniper-loot',
        difficulty: 60,
        damage: 80,
        attackChance: 0.2
    },

    // BOSSES (High Tier)
    'killa': {
        id: 'killa',
        name: 'Killa',
        type: 'boss',
        hp: 800,
        maxHp: 800,
        health: 800,
        armorClass: 6,
        weaponId: 'rpk-16',
        accuracy: 0.6,
        reactionTime: 0.3,
        lootTable: 'killa-loot',
        difficulty: 90,
        damage: 45,
        attackChance: 0.35
    },
    'tagilla': {
        id: 'tagilla',
        name: 'Tagilla',
        type: 'boss',
        hp: 1220,
        maxHp: 1220,
        health: 1220,
        armorClass: 6,
        weaponId: 'saiga-12',
        accuracy: 0.45,
        reactionTime: 0.4,
        lootTable: 'tagilla-loot',
        difficulty: 95,
        damage: 60,
        attackChance: 0.3
    },
    'shturman': {
        id: 'shturman',
        name: 'Shturman',
        type: 'boss',
        hp: 712,
        maxHp: 712,
        health: 712,
        armorClass: 4,
        weaponId: 'svds',
        accuracy: 0.8,
        reactionTime: 0.5,
        lootTable: 'shturman-loot',
        difficulty: 85,
        damage: 85,
        attackChance: 0.25
    },
    'glukhar': {
        id: 'glukhar',
        name: 'Glukhar',
        type: 'boss',
        hp: 1015,
        maxHp: 1015,
        health: 1015,
        armorClass: 5,
        weaponId: 'ash-12',
        accuracy: 0.55,
        reactionTime: 0.5,
        lootTable: 'glukhar-loot',
        difficulty: 88,
        damage: 55,
        attackChance: 0.32
    },
    'sanitar': {
        id: 'sanitar',
        name: 'Sanitar',
        type: 'boss',
        hp: 1270,
        maxHp: 1270,
        health: 1270,
        armorClass: 5,
        weaponId: 'vss',
        accuracy: 0.5,
        reactionTime: 0.6,
        lootTable: 'sanitar-loot',
        difficulty: 82,
        damage: 50,
        attackChance: 0.28
    },
    'saeed': {
        id: 'saeed',
        name: 'Guard Captain Saeed',
        type: 'boss',
        hp: 1200,
        maxHp: 1200,
        health: 1200,
        armorClass: 5,
        weaponId: 'm249',
        accuracy: 0.6,
        reactionTime: 0.5,
        lootTable: 'boss-saeed-loot',
        difficulty: 92,
        damage: 48,
        attackChance: 0.33
    },
    'reshala': {
        id: 'reshala',
        name: 'Reshala',
        type: 'boss',
        hp: 752,
        maxHp: 752,
        health: 752,
        armorClass: 4,
        weaponId: 'm4a1',
        accuracy: 0.55,
        reactionTime: 0.6,
        lootTable: 'reshala-loot',
        difficulty: 75,
        damage: 40,
        attackChance: 0.28
    },

    // GUARDS (Boss Minions)
    'guard-follower': {
        id: 'guard-follower',
        name: 'Boss Guard',
        type: 'guard',
        hp: 300,
        maxHp: 300,
        health: 300,
        armorClass: 4,
        weaponId: 'ak-74',
        accuracy: 0.4,
        reactionTime: 0.8,
        lootTable: 'guard-loot',
        difficulty: 45,
        damage: 32,
        attackChance: 0.25
    },
};

// Loot tables for reference
export const LOOT_TABLES: Record<string, { itemId: string; chance: number; minQty: number; maxQty: number }[]> = {
    'scav-loot': [
        { itemId: '545x39-ps', chance: 0.4, minQty: 10, maxQty: 30 },
        { itemId: 'ai-2', chance: 0.3, minQty: 1, maxQty: 1 },
        { itemId: 'tushonka', chance: 0.2, minQty: 1, maxQty: 1 },
        { itemId: 'screws', chance: 0.15, minQty: 1, maxQty: 2 },
    ],
    'scav-veteran-loot': [
        { itemId: '545x39-ps', chance: 0.5, minQty: 20, maxQty: 60 },
        { itemId: 'salewa', chance: 0.25, minQty: 1, maxQty: 1 },
        { itemId: 'okp-7', chance: 0.1, minQty: 1, maxQty: 1 },
        { itemId: 'paca', chance: 0.05, minQty: 1, maxQty: 1 },
    ],
    'raider-loot': [
        { itemId: '556x45-m855', chance: 0.5, minQty: 30, maxQty: 90 },
        { itemId: 'salewa', chance: 0.3, minQty: 1, maxQty: 2 },
        { itemId: 'ifak', chance: 0.2, minQty: 1, maxQty: 1 },
        { itemId: 'paca', chance: 0.15, minQty: 1, maxQty: 1 },
    ],
    'raider-heavy-loot': [
        { itemId: '556x45-m855a1', chance: 0.4, minQty: 30, maxQty: 60 },
        { itemId: 'salewa', chance: 0.35, minQty: 1, maxQty: 2 },
        { itemId: 'ifak', chance: 0.25, minQty: 1, maxQty: 1 },
        { itemId: '6b13', chance: 0.1, minQty: 1, maxQty: 1 },
    ],
    'killa-loot': [
        { itemId: 'rpk-16', chance: 1.0, minQty: 1, maxQty: 1 },
        { itemId: 'maska-1sh', chance: 0.8, minQty: 1, maxQty: 1 },
        { itemId: '6b43', chance: 0.6, minQty: 1, maxQty: 1 },
        { itemId: 'grizzly', chance: 0.5, minQty: 1, maxQty: 2 },
    ],
    'tagilla-loot': [
        { itemId: 'saiga-12', chance: 1.0, minQty: 1, maxQty: 1 },
        { itemId: 'tagilla-mask', chance: 0.8, minQty: 1, maxQty: 1 },
        { itemId: '6b43', chance: 0.6, minQty: 1, maxQty: 1 },
    ],
    'boss-saeed-loot': [
        { itemId: 'm249', chance: 1.0, minQty: 1, maxQty: 1 },
        { itemId: 'salewa', chance: 0.8, minQty: 2, maxQty: 4 },
        { itemId: 'gold-chain', chance: 0.4, minQty: 1, maxQty: 2 },
        { itemId: 'bitcoin', chance: 0.2, minQty: 1, maxQty: 1 },
    ],
    // Boss Loot Tables
    'shturman-loot': [
        { itemId: 'svds', chance: 1.0, minQty: 1, maxQty: 1 },
        { itemId: '762x54r-snb', chance: 0.9, minQty: 40, maxQty: 80 },
        { itemId: 'gold-chain', chance: 0.5, minQty: 1, maxQty: 2 },
        { itemId: 'marked-key', chance: 0.15, minQty: 1, maxQty: 1 },
        { itemId: 'grizzly', chance: 0.4, minQty: 1, maxQty: 1 },
    ],
    'glukhar-loot': [
        { itemId: 'ash-12', chance: 1.0, minQty: 1, maxQty: 1 },
        { itemId: '127x55-ps12b', chance: 0.85, minQty: 30, maxQty: 60 },
        { itemId: '6b43', chance: 0.5, minQty: 1, maxQty: 1 },
        { itemId: 'bitcoin', chance: 0.25, minQty: 1, maxQty: 1 },
        { itemId: 'labs-card', chance: 0.05, minQty: 1, maxQty: 1 },
    ],
    'sanitar-loot': [
        { itemId: 'vss', chance: 1.0, minQty: 1, maxQty: 1 },
        { itemId: '9x39-sp6', chance: 0.9, minQty: 40, maxQty: 80 },
        { itemId: 'grizzly', chance: 0.8, minQty: 2, maxQty: 4 },
        { itemId: 'morphine', chance: 0.7, minQty: 2, maxQty: 5 },
        { itemId: 'ifak', chance: 0.9, minQty: 3, maxQty: 6 },
    ],
    'reshala-loot': [
        { itemId: 'm4a1', chance: 1.0, minQty: 1, maxQty: 1 },
        { itemId: '556x45-m855a1', chance: 0.8, minQty: 60, maxQty: 120 },
        { itemId: 'gold-chain', chance: 0.6, minQty: 1, maxQty: 3 },
        { itemId: 'roler', chance: 0.3, minQty: 1, maxQty: 1 },
        { itemId: 'dorms-314', chance: 0.4, minQty: 1, maxQty: 1 },
    ],
    // Raider & Guard Loot Tables
    'raider-sniper-loot': [
        { itemId: 'sv-98', chance: 1.0, minQty: 1, maxQty: 1 },
        { itemId: '762x54r-ps', chance: 0.9, minQty: 40, maxQty: 80 },
        { itemId: 'ifak', chance: 0.4, minQty: 1, maxQty: 2 },
        { itemId: 'lzsh', chance: 0.2, minQty: 1, maxQty: 1 },
    ],
    'guard-loot': [
        { itemId: 'ak-74', chance: 0.7, minQty: 1, maxQty: 1 },
        { itemId: '545x39-bp', chance: 0.6, minQty: 30, maxQty: 90 },
        { itemId: 'salewa', chance: 0.3, minQty: 1, maxQty: 1 },
        { itemId: 'ifak', chance: 0.4, minQty: 1, maxQty: 1 },
        { itemId: '6b23-1', chance: 0.15, minQty: 1, maxQty: 1 },
        { itemId: 'screws', chance: 0.2, minQty: 1, maxQty: 3 },
    ],
};

// Boss level requirements - bosses only spawn at certain player levels
const BOSS_LEVEL_REQUIREMENTS: Record<string, number> = {
    'killa': 20,
    'tagilla': 25,
    'shturman': 22,
    'glukhar': 28,
    'sanitar': 24,
    'saeed': 30,
    'reshala': 18,
};

// Helper function to get random enemy for a location
export function getRandomEnemyForLocation(
    locationId: string,
    playerLevel: number,
    rng?: SeededRNG
): string {
    const locationTiers: Record<string, string[]> = {
        'factory': ['scav-basic', 'scav-armed', 'scav-veteran'],
        'customs': ['scav-armed', 'scav-veteran', 'raider-basic'],
        'woods': ['scav-basic', 'scav-armed', 'raider-sniper'],
        'interchange': ['scav-armed', 'scav-veteran', 'raider-basic', 'raider-heavy'],
        'reserve': ['scav-veteran', 'raider-basic', 'raider-heavy', 'glukhar'],
        'labs': ['raider-basic', 'raider-heavy', 'raider-sniper'],
        'streets': ['scav-veteran', 'raider-basic', 'raider-heavy', 'killa'],
    };

    const pool = locationTiers[locationId] || ['scav-basic'];

    // Filter out bosses that the player doesn't meet level requirements for
    const availableEnemies = pool.filter(enemyId => {
        const levelRequirement = BOSS_LEVEL_REQUIREMENTS[enemyId];
        if (levelRequirement === undefined) {
            // Not a boss, always available
            return true;
        }
        return playerLevel >= levelRequirement;
    });

    // Fall back to scav-basic if no enemies available (shouldn't happen)
    const finalPool = availableEnemies.length > 0 ? availableEnemies : ['scav-basic'];

    // Use seeded RNG if provided, otherwise fall back to Math.random
    if (rng) {
        return rng.pick(finalPool) ?? 'scav-basic';
    }
    return finalPool[Math.floor(Math.random() * finalPool.length)] ?? 'scav-basic';
}
