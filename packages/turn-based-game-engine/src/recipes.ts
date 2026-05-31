// src/lib/game/recipes.ts
import type { CraftingRecipe, HideoutModule } from './types';

/**
 * Hideout module definitions with all available modules
 */
export const HIDOUT_MODULES: Record<string, HideoutModule> = {
    'generator': {
        id: 'generator',
        name: 'Generator',
        level: 1,
        maxLevel: 3,
        isUpgrading: false,
        fuel: 0,
        maxFuel: 100,
        fuelConsumption: 0.1,
        requirements: {
            roubles: 10000,
            items: [],
            level: 1,
        },
    },
    'workbench': {
        id: 'workbench',
        name: 'Workbench',
        level: 1,
        maxLevel: 3,
        isUpgrading: false,
        requirements: {
            roubles: 25000,
            items: [{ itemId: 'screws', quantity: 10 }, { itemId: 'nails', quantity: 5 }],
            level: 5,
        },
    },
    'medstation': {
        id: 'medstation',
        name: 'Medstation',
        level: 0,
        maxLevel: 3,
        isUpgrading: false,
        requirements: {
            roubles: 15000,
            items: [{ itemId: 'ai-2', quantity: 2 }],
            level: 3,
        },
    },
    'nutrition-unit': {
        id: 'nutrition-unit',
        name: 'Nutrition Unit',
        level: 0,
        maxLevel: 3,
        isUpgrading: false,
        requirements: {
            roubles: 20000,
            items: [{ itemId: 'tushonka', quantity: 3 }],
            level: 10,
        },
    },
    'bitcoin-farm': {
        id: 'bitcoin-farm',
        name: 'Bitcoin Farm',
        level: 0,
        maxLevel: 3,
        isUpgrading: false,
        requirements: {
            roubles: 150000,
            items: [],
            level: 20,
        },
    },
    'scav-case': {
        id: 'scav-case',
        name: 'Scav Case',
        level: 0,
        maxLevel: 1,
        isUpgrading: false,
        requirements: {
            roubles: 50000,
            items: [],
            level: 15,
        },
    },
    'shooting-range': {
        id: 'shooting-range',
        name: 'Shooting Range',
        level: 0,
        maxLevel: 3,
        isUpgrading: false,
        requirements: {
            roubles: 30000,
            items: [],
            level: 8,
        },
    },
    'solar-power': {
        id: 'solar-power',
        name: 'Solar Power',
        level: 0,
        maxLevel: 1,
        isUpgrading: false,
        requirements: {
            roubles: 250000,
            items: [],
            level: 25,
        },
    },
    'air-filtering': {
        id: 'air-filtering',
        name: 'Air Filtering Unit',
        level: 0,
        maxLevel: 1,
        isUpgrading: false,
        requirements: {
            roubles: 120000,
            items: [],
            level: 18,
        },
    },
    'water-collector': {
        id: 'water-collector',
        name: 'Water Collector',
        level: 0,
        maxLevel: 3,
        isUpgrading: false,
        requirements: {
            roubles: 12000,
            items: [],
            level: 5,
        },
    },
    'lavatory': {
        id: 'lavatory',
        name: 'Lavatory',
        level: 0,
        maxLevel: 3,
        isUpgrading: false,
        requirements: {
            roubles: 8000,
            items: [],
            level: 2,
        },
    },
    'stash': {
        id: 'stash',
        name: 'Stash',
        level: 1,
        maxLevel: 4,
        isUpgrading: false,
        requirements: {
            roubles: 0,
            items: [],
            level: 1,
        },
    },
};

export const CRAFTING_DATABASE: CraftingRecipe[] = [
    // AMMO CRAFTING - Workbench Level 1
    {
        id: 'craft-ps-ammo',
        moduleId: 'workbench',
        moduleLevel: 1,
        name: '5.45x39 PS Ammo',
        duration: 1800, // 30 mins
        requirements: [
            { itemId: 'screws', quantity: 2 },
            { itemId: 'nails', quantity: 1 }
        ],
        result: { itemId: '545x39-ps', quantity: 60 }
    },
    {
        id: 'craft-m855-ammo',
        moduleId: 'workbench',
        moduleLevel: 1,
        name: '5.56x45 M855 Ammo',
        duration: 2100, // 35 mins
        requirements: [
            { itemId: 'screws', quantity: 2 },
            { itemId: 'nails', quantity: 2 }
        ],
        result: { itemId: '556x45-m855', quantity: 60 }
    },
    {
        id: 'craft-9x18pm-ammo',
        moduleId: 'workbench',
        moduleLevel: 1,
        name: '9x18PM Pst Ammo',
        duration: 900, // 15 mins
        requirements: [
            { itemId: 'nails', quantity: 1 }
        ],
        result: { itemId: '9x18mm-pst', quantity: 50 }
    },

    // AMMO CRAFTING - Workbench Level 2
    {
        id: 'craft-bp-ammo',
        moduleId: 'workbench',
        moduleLevel: 2,
        name: '5.45x39 BP Ammo',
        duration: 3600, // 60 mins
        requirements: [
            { itemId: '545x39-ps', quantity: 120 },
            { itemId: 'screws', quantity: 4 }
        ],
        result: { itemId: '545x39-bp', quantity: 60 }
    },
    {
        id: 'craft-bt-ammo',
        moduleId: 'workbench',
        moduleLevel: 2,
        name: '5.45x39 BT Ammo',
        duration: 4200, // 70 mins
        requirements: [
            { itemId: '545x39-ps', quantity: 120 },
            { itemId: 'screws', quantity: 3 },
            { itemId: 'gold-chain', quantity: 1 }
        ],
        result: { itemId: '545x39-bt', quantity: 60 }
    },
    {
        id: 'craft-m855a1-ammo',
        moduleId: 'workbench',
        moduleLevel: 2,
        name: '5.56x45 M855A1 Ammo',
        duration: 4500, // 75 mins
        requirements: [
            { itemId: '556x45-m855', quantity: 120 },
            { itemId: 'screws', quantity: 5 }
        ],
        result: { itemId: '556x45-m855a1', quantity: 60 }
    },
    {
        id: 'craft-9x39-ammo',
        moduleId: 'workbench',
        moduleLevel: 2,
        name: '9x39 SP-5 Ammo',
        duration: 3000, // 50 mins
        requirements: [
            { itemId: 'screws', quantity: 4 },
            { itemId: 'nails', quantity: 3 }
        ],
        result: { itemId: '9x39-sp5', quantity: 40 }
    },

    // AMMO CRAFTING - Workbench Level 3
    {
        id: 'craft-igolnik-ammo',
        moduleId: 'workbench',
        moduleLevel: 3,
        name: '5.45x39 Igolnik Ammo',
        duration: 7200, // 120 mins
        requirements: [
            { itemId: '545x39-bp', quantity: 120 },
            { itemId: 'gold-chain', quantity: 2 },
            { itemId: 'screws', quantity: 8 }
        ],
        result: { itemId: '545x39-igolnik', quantity: 60 }
    },
    {
        id: 'craft-m995-ammo',
        moduleId: 'workbench',
        moduleLevel: 3,
        name: '5.56x45 M995 Ammo',
        duration: 7800, // 130 mins
        requirements: [
            { itemId: '556x45-m855a1', quantity: 120 },
            { itemId: 'roler', quantity: 1 },
            { itemId: 'screws', quantity: 10 }
        ],
        result: { itemId: '556x45-m995', quantity: 60 }
    },

    // MEDICAL CRAFTING - Medstation Level 1
    {
        id: 'craft-salewa',
        moduleId: 'medstation',
        moduleLevel: 1,
        name: 'Salewa First Aid Kit',
        duration: 1200, // 20 mins
        requirements: [
            { itemId: 'ai-2', quantity: 2 }
        ],
        result: { itemId: 'salewa', quantity: 1 }
    },
    {
        id: 'craft-ifak',
        moduleId: 'medstation',
        moduleLevel: 1,
        name: 'IFAK',
        duration: 1800, // 30 mins
        requirements: [
            { itemId: 'ai-2', quantity: 1 },
            { itemId: 'salewa', quantity: 1 }
        ],
        result: { itemId: 'ifak', quantity: 1 }
    },
    {
        id: 'craft-morphine',
        moduleId: 'medstation',
        moduleLevel: 1,
        name: 'Morphine Injector',
        duration: 2400, // 40 mins
        requirements: [
            { itemId: 'ai-2', quantity: 3 },
            { itemId: 'screws', quantity: 1 }
        ],
        result: { itemId: 'morphine', quantity: 1 }
    },

    // MEDICAL CRAFTING - Medstation Level 2
    {
        id: 'craft-grizzly',
        moduleId: 'medstation',
        moduleLevel: 2,
        name: 'Grizzly First Aid Kit',
        duration: 3600, // 60 mins
        requirements: [
            { itemId: 'salewa', quantity: 2 },
            { itemId: 'ifak', quantity: 2 },
            { itemId: 'morphine', quantity: 1 }
        ],
        result: { itemId: 'grizzly', quantity: 1 }
    },

    // WEAPON MOD CRAFTING - Workbench Level 2
    {
        id: 'craft-suppressor-545',
        moduleId: 'workbench',
        moduleLevel: 2,
        name: 'PBS-4 5.45x39 Suppressor',
        duration: 5400, // 90 mins
        requirements: [
            { itemId: 'screws', quantity: 8 },
            { itemId: 'nails', quantity: 4 },
            { itemId: 'gold-chain', quantity: 1 }
        ],
        result: { itemId: 'suppressor-545', quantity: 1 }
    },
    {
        id: 'craft-rk3-grip',
        moduleId: 'workbench',
        moduleLevel: 1,
        name: 'Zenit RK-3 Pistol Grip',
        duration: 2400, // 40 mins
        requirements: [
            { itemId: 'screws', quantity: 4 },
            { itemId: 'nails', quantity: 2 }
        ],
        result: { itemId: 'rk-3', quantity: 1 }
    },
    {
        id: 'craft-okp7-sight',
        moduleId: 'workbench',
        moduleLevel: 2,
        name: 'OKP-7 Reflex Sight',
        duration: 4200, // 70 mins
        requirements: [
            { itemId: 'screws', quantity: 6 },
            { itemId: 'gold-chain', quantity: 1 }
        ],
        result: { itemId: 'okp-7', quantity: 1 }
    },

    // BARTER ITEM CRAFTING - Workbench Level 2
    {
        id: 'craft-armor-repair-kit',
        moduleId: 'workbench',
        moduleLevel: 2,
        name: 'Armor Repair Kit',
        duration: 4800, // 80 mins
        requirements: [
            { itemId: 'screws', quantity: 10 },
            { itemId: 'nails', quantity: 5 },
            { itemId: 'paca', quantity: 1 }
        ],
        result: { itemId: 'armor-repair-kit', quantity: 1 }
    },
    {
        id: 'craft-weapon-repair-kit',
        moduleId: 'workbench',
        moduleLevel: 3,
        name: 'Weapon Repair Kit',
        duration: 7200, // 120 mins
        requirements: [
            { itemId: 'screws', quantity: 15 },
            { itemId: 'nails', quantity: 8 },
            { itemId: 'pm-pistol', quantity: 1 }
        ],
        result: { itemId: 'weapon-repair-kit', quantity: 1 }
    },
    {
        id: 'craft-gold-chain',
        moduleId: 'workbench',
        moduleLevel: 3,
        name: 'Golden Chain',
        duration: 7200, // 120 mins
        requirements: [
            { itemId: 'roler', quantity: 1 },
            { itemId: 'nails', quantity: 5 }
        ],
        result: { itemId: 'gold-chain', quantity: 2 }
    },

    // NUTRITION UNIT RECIPES
    {
        id: 'craft-isrkra-nutrition',
        moduleId: 'nutrition-unit',
        moduleLevel: 1,
        name: 'Iskra Ration Pack',
        duration: 2400, // 40 mins
        requirements: [
            { itemId: 'tushonka', quantity: 2 }
        ],
        result: { itemId: 'isrkra', quantity: 1 }
    },
    {
        id: 'craft-water-purified',
        moduleId: 'nutrition-unit',
        moduleLevel: 2,
        name: 'Purified Water',
        duration: 1800, // 30 mins
        requirements: [
            { itemId: 'water', quantity: 2 }
        ],
        result: { itemId: 'water', quantity: 3 }
    },

    // LAVATORY RECIPES (Medical Supplies)
    {
        id: 'craft-ai2-lavatory',
        moduleId: 'lavatory',
        moduleLevel: 1,
        name: 'AI-2 Medkit',
        duration: 900, // 15 mins
        requirements: [
            { itemId: 'nails', quantity: 2 }
        ],
        result: { itemId: 'ai-2', quantity: 1 }
    },
    {
        id: 'craft-morphine-lavatory',
        moduleId: 'lavatory',
        moduleLevel: 2,
        name: 'Morphine Injector',
        duration: 3600, // 60 mins
        requirements: [
            { itemId: 'ai-2', quantity: 2 },
            { itemId: 'screws', quantity: 2 }
        ],
        result: { itemId: 'morphine', quantity: 1 }
    },

    // WATER COLLECTOR RECIPES
    {
        id: 'craft-water-collector',
        moduleId: 'water-collector',
        moduleLevel: 1,
        name: 'Water Bottle',
        duration: 3600, // 60 mins
        requirements: [],
        result: { itemId: 'water', quantity: 1 }
    },

    // BITCOIN FARM (Passive - handled in tick)
    // No active crafts, generates bitcoins passively based on GPU count

    // SCAV CASE (Scav Missions)
    {
        id: 'scav-mission-1hr',
        moduleId: 'scav-case',
        moduleLevel: 1,
        name: 'Scav Mission (1 Hour)',
        duration: 3600, // 1 hour
        requirements: [
            { itemId: 'roubles', quantity: 5000 }
        ],
        result: { itemId: 'scav-loot-box', quantity: 1 }
    },
    {
        id: 'scav-mission-4hr',
        moduleId: 'scav-case',
        moduleLevel: 1,
        name: 'Scav Mission (4 Hours)',
        duration: 14400, // 4 hours
        requirements: [
            { itemId: 'roubles', quantity: 15000 }
        ],
        result: { itemId: 'scav-loot-box-large', quantity: 1 }
    },
];

/**
 * Module benefits based on level
 */
export const MODULE_BENEFITS: Record<string, Record<number, { description: string; effect: string }>> = {
    'nutrition-unit': {
        1: { description: 'Craft basic food items', effect: 'Unlock food recipes' },
        2: { description: 'Reduce energy drain by 10%', effect: 'energy_drain_reduction' },
        3: { description: 'Reduce energy drain by 20%', effect: 'energy_drain_reduction' },
    },
    'bitcoin-farm': {
        1: { description: 'Generate bitcoins passively', effect: 'bitcoin_generation' },
        2: { description: 'Faster bitcoin generation', effect: 'bitcoin_generation_fast' },
        3: { description: 'Maximum bitcoin generation', effect: 'bitcoin_generation_max' },
    },
    'scav-case': {
        1: { description: 'Send scavs on loot missions', effect: 'scav_missions' },
    },
    'shooting-range': {
        1: { description: 'Test weapons, +5% weapon mastery XP', effect: 'mastery_xp_boost' },
        2: { description: '+10% weapon mastery XP', effect: 'mastery_xp_boost' },
        3: { description: '+15% weapon mastery XP', effect: 'mastery_xp_boost' },
    },
    'solar-power': {
        1: { description: 'Reduce generator fuel consumption by 50%', effect: 'fuel_savings' },
    },
    'air-filtering': {
        1: { description: 'Boost skill XP gain by 15%', effect: 'skill_xp_boost' },
    },
    'water-collector': {
        1: { description: 'Generate water passively', effect: 'water_generation' },
        2: { description: 'Faster water generation', effect: 'water_generation_fast' },
        3: { description: 'Maximum water generation', effect: 'water_generation_max' },
    },
    'lavatory': {
        1: { description: 'Craft basic medical supplies', effect: 'medical_crafting' },
        2: { description: 'Craft advanced medical supplies', effect: 'medical_crafting_advanced' },
        3: { description: 'Craft elite medical supplies', effect: 'medical_crafting_elite' },
    },
};
