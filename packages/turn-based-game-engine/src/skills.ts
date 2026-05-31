// src/lib/game/skills.ts
// Complete Skill System with Proper Bonuses for Tarkov-inspired RPG

import type { SkillType, GameState, SkillData } from './types';

/**
 * Skill bonus types - defines what bonuses each skill can provide
 */
export interface SkillBonuses {
    // Combat bonuses
    hitChance?: number;           // Ballistics
    damage?: number;              // Firepower
    criticalChance?: number;      // Firepower
    evasion?: number;             // Tactics
    damageReduction?: number;     // Tactics

    // Operative bonuses
    maxHpBonus?: number;          // Endurance
    staminaDrainReduction?: number; // Endurance
    scopedAccuracy?: number;      // Marksman
    rangeDropoffReduction?: number; // Marksman
    closeRangeDamage?: number;    // CQB
    weaponSwapSpeed?: number;     // CQB
    lootQualityBonus?: number;    // Scavenging
    autoScavEnabled?: boolean;    // Scavenging (level 40 unlock)
    routeUnlocks?: string[];      // Navigation
    buyPriceReduction?: number;   // Trading
    sellPriceBonus?: number;      // Trading
    craftingSpeed?: number;       // Engineering
    repairEfficiency?: number;    // Engineering
    healingEffectiveness?: number; // Survival
    stimDuration?: number;        // Survival
    mapRevealChance?: number;     // Intel
    lootPreview?: boolean;        // Intel
}

/**
 * Skill configuration - defines base values and scaling for each skill
 */
export interface SkillConfig {
    name: string;
    category: 'combat' | 'operative';
    maxLevel: number;
    baseBonus: number;
    bonusPerLevel: number;
    specialUnlocks?: Record<number, string>;
}

/**
 * Skill database with all 12 skills and their configurations
 */
export const SKILL_DATABASE: Record<SkillType, SkillConfig> = {
    // COMBAT SKILLS
    ballistics: {
        name: 'Ballistics',
        category: 'combat',
        maxLevel: 99,
        baseBonus: 0,
        bonusPerLevel: 0.5, // +0.5% hit chance per level
        specialUnlocks: {
            10: 'Weapon Proficiency: AR/LMG',
            25: 'Weapon Proficiency: DMR',
            50: 'Weapon Proficiency: Sniper',
            75: 'Master Marksman',
        },
    },
    firepower: {
        name: 'Firepower',
        category: 'combat',
        maxLevel: 99,
        baseBonus: 0,
        bonusPerLevel: 0.5, // +0.5% damage per level
        specialUnlocks: {
            20: '+0.2% Critical Chance',
            50: '+0.5% Critical Chance',
            80: '+1.0% Critical Chance',
        },
    },
    tactics: {
        name: 'Tactics',
        category: 'combat',
        maxLevel: 99,
        baseBonus: 0,
        bonusPerLevel: 0.5, // +0.5% evasion per level
        specialUnlocks: {
            15: '+0.3% Damage Reduction',
            40: '+0.6% Damage Reduction',
            70: '+1.0% Damage Reduction',
        },
    },

    // OPERATIVE SKILLS
    endurance: {
        name: 'Endurance',
        category: 'operative',
        maxLevel: 99,
        baseBonus: 0,
        bonusPerLevel: 2, // +2 HP per level
        specialUnlocks: {
            20: 'Stamina Drain -10%',
            50: 'Stamina Drain -20%',
            80: 'Stamina Drain -30%',
        },
    },
    marksman: {
        name: 'Marksman',
        category: 'operative',
        maxLevel: 99,
        baseBonus: 0,
        bonusPerLevel: 0.8, // +0.8% scoped accuracy per level
        specialUnlocks: {
            25: 'Range Dropoff -10%',
            50: 'Range Dropoff -20%',
            75: 'Range Dropoff -30%',
        },
    },
    cqb: {
        name: 'CQB',
        category: 'operative',
        maxLevel: 99,
        baseBonus: 0,
        bonusPerLevel: 1.0, // +1% close range damage per level
        specialUnlocks: {
            20: 'Weapon Swap Speed +10%',
            50: 'Weapon Swap Speed +20%',
            80: 'Weapon Swap Speed +30%',
        },
    },
    scavenging: {
        name: 'Scavenging',
        category: 'operative',
        maxLevel: 99,
        baseBonus: 0,
        bonusPerLevel: 0.5, // +0.5% loot quality per level
        specialUnlocks: {
            20: 'Increased Container Loot',
            40: 'Auto-Scavenger Unlock',
            70: 'Elite Scavenger',
        },
    },
    navigation: {
        name: 'Navigation',
        category: 'operative',
        maxLevel: 99,
        baseBonus: 0,
        bonusPerLevel: 1.0,
        specialUnlocks: {
            10: 'Woods Route Unlock',
            25: 'Shoreline Route Unlock',
            50: 'Reserve Route Unlock',
            75: 'Labs Route Unlock',
        },
    },
    trading: {
        name: 'Trading',
        category: 'operative',
        maxLevel: 99,
        baseBonus: 0,
        bonusPerLevel: 0.3, // Buy -0.3%, Sell +0.3% per level
        specialUnlocks: {
            30: 'Flea Market Fee Reduction',
            60: 'Trader Discount Elite',
        },
    },
    engineering: {
        name: 'Engineering',
        category: 'operative',
        maxLevel: 99,
        baseBonus: 0,
        bonusPerLevel: 2.0, // +2% crafting speed per level
        specialUnlocks: {
            25: 'Repair Efficiency +15%',
            50: 'Crafting Queue +1',
            75: 'Master Engineer',
        },
    },
    survival: {
        name: 'Survival',
        category: 'operative',
        maxLevel: 99,
        baseBonus: 0,
        bonusPerLevel: 1.0, // +1% healing effectiveness per level
        specialUnlocks: {
            20: 'Stim Duration +10%',
            45: 'Stim Duration +20%',
            70: 'Stim Duration +30%',
        },
    },
    intel: {
        name: 'Intel',
        category: 'operative',
        maxLevel: 99,
        baseBonus: 0,
        bonusPerLevel: 0.5, // +0.5% map reveal chance per level
        specialUnlocks: {
            25: 'Loot Preview (Common)',
            50: 'Loot Preview (Uncommon)',
            75: 'Loot Preview (Rare+)',
        },
    },
};

/**
 * Calculate skill bonuses based on skill type and current level
 */
export function getSkillBonus(skill: SkillType, level: number): SkillBonuses {
    const config = SKILL_DATABASE[skill];
    const effectiveLevel = Math.min(level, config.maxLevel);

    const bonuses: SkillBonuses = {};

    switch (skill) {
        case 'ballistics':
            bonuses.hitChance = config.baseBonus + (effectiveLevel * config.bonusPerLevel);
            break;

        case 'firepower':
            bonuses.damage = config.baseBonus + (effectiveLevel * config.bonusPerLevel);
            // Critical chance unlocks at specific levels
            if (effectiveLevel >= 80) {
                bonuses.criticalChance = 1.0;
            } else if (effectiveLevel >= 50) {
                bonuses.criticalChance = 0.5;
            } else if (effectiveLevel >= 20) {
                bonuses.criticalChance = 0.2;
            }
            break;

        case 'tactics':
            bonuses.evasion = config.baseBonus + (effectiveLevel * config.bonusPerLevel);
            // Damage reduction unlocks at specific levels
            if (effectiveLevel >= 70) {
                bonuses.damageReduction = 1.0;
            } else if (effectiveLevel >= 40) {
                bonuses.damageReduction = 0.6;
            } else if (effectiveLevel >= 15) {
                bonuses.damageReduction = 0.3;
            }
            break;

        case 'endurance':
            bonuses.maxHpBonus = effectiveLevel * config.bonusPerLevel; // +2 HP per level
            // Stamina drain reduction
            if (effectiveLevel >= 80) {
                bonuses.staminaDrainReduction = 30;
            } else if (effectiveLevel >= 50) {
                bonuses.staminaDrainReduction = 20;
            } else if (effectiveLevel >= 20) {
                bonuses.staminaDrainReduction = 10;
            }
            break;

        case 'marksman':
            bonuses.scopedAccuracy = effectiveLevel * config.bonusPerLevel;
            // Range dropoff reduction
            if (effectiveLevel >= 75) {
                bonuses.rangeDropoffReduction = 30;
            } else if (effectiveLevel >= 50) {
                bonuses.rangeDropoffReduction = 20;
            } else if (effectiveLevel >= 25) {
                bonuses.rangeDropoffReduction = 10;
            }
            break;

        case 'cqb':
            bonuses.closeRangeDamage = effectiveLevel * config.bonusPerLevel;
            // Weapon swap speed bonus
            if (effectiveLevel >= 80) {
                bonuses.weaponSwapSpeed = 30;
            } else if (effectiveLevel >= 50) {
                bonuses.weaponSwapSpeed = 20;
            } else if (effectiveLevel >= 20) {
                bonuses.weaponSwapSpeed = 10;
            }
            break;

        case 'scavenging':
            bonuses.lootQualityBonus = effectiveLevel * config.bonusPerLevel;
            bonuses.autoScavEnabled = effectiveLevel >= 40;
            break;

        case 'navigation':
            // Route unlocks based on level
            bonuses.routeUnlocks = [];
            if (effectiveLevel >= 10) bonuses.routeUnlocks.push('woods');
            if (effectiveLevel >= 25) bonuses.routeUnlocks.push('shoreline');
            if (effectiveLevel >= 50) bonuses.routeUnlocks.push('reserve');
            if (effectiveLevel >= 75) bonuses.routeUnlocks.push('labs');
            break;

        case 'trading':
            bonuses.buyPriceReduction = effectiveLevel * config.bonusPerLevel;
            bonuses.sellPriceBonus = effectiveLevel * config.bonusPerLevel;
            break;

        case 'engineering':
            bonuses.craftingSpeed = effectiveLevel * config.bonusPerLevel;
            // Repair efficiency unlocks
            if (effectiveLevel >= 75) {
                bonuses.repairEfficiency = 45;
            } else if (effectiveLevel >= 50) {
                bonuses.repairEfficiency = 30;
            } else if (effectiveLevel >= 25) {
                bonuses.repairEfficiency = 15;
            }
            break;

        case 'survival':
            bonuses.healingEffectiveness = effectiveLevel * config.bonusPerLevel;
            // Stim duration bonus
            if (effectiveLevel >= 70) {
                bonuses.stimDuration = 30;
            } else if (effectiveLevel >= 45) {
                bonuses.stimDuration = 20;
            } else if (effectiveLevel >= 20) {
                bonuses.stimDuration = 10;
            }
            break;

        case 'intel':
            bonuses.mapRevealChance = effectiveLevel * config.bonusPerLevel;
            // Loot preview unlocks
            if (effectiveLevel >= 75) {
                bonuses.lootPreview = true; // Rare+ items
            } else if (effectiveLevel >= 50) {
                bonuses.lootPreview = true; // Uncommon+
            } else if (effectiveLevel >= 25) {
                bonuses.lootPreview = true; // Common+
            }
            break;
    }

    return bonuses;
}

/**
 * Get all skill bonuses for a complete skill set
 */
export function getAllSkillBonuses(skills: Record<SkillType, SkillData>): Record<SkillType, SkillBonuses> {
    const bonuses: Partial<Record<SkillType, SkillBonuses>> = {};

    (Object.keys(skills) as SkillType[]).forEach(skill => {
        bonuses[skill] = getSkillBonus(skill, skills[skill].level);
    });

    return bonuses as Record<SkillType, SkillBonuses>;
}

/**
 * Calculate total combat bonuses from all skills
 */
export function getTotalCombatBonuses(skills: Record<SkillType, SkillData>): {
    hitChance: number;
    damage: number;
    criticalChance: number;
    evasion: number;
    damageReduction: number;
} {
    const ballistics = getSkillBonus('ballistics', skills.ballistics.level);
    const firepower = getSkillBonus('firepower', skills.firepower.level);
    const tactics = getSkillBonus('tactics', skills.tactics.level);

    return {
        hitChance: ballistics.hitChance || 0,
        damage: firepower.damage || 0,
        criticalChance: firepower.criticalChance || 0,
        evasion: tactics.evasion || 0,
        damageReduction: tactics.damageReduction || 0,
    };
}

/**
 * Calculate total operative bonuses from all skills
 */
export function getTotalOperativeBonuses(skills: Record<SkillType, SkillData>): {
    maxHpBonus: number;
    staminaDrainReduction: number;
    craftingSpeed: number;
    buyPriceReduction: number;
    sellPriceBonus: number;
    healingEffectiveness: number;
} {
    const endurance = getSkillBonus('endurance', skills.endurance.level);
    const engineering = getSkillBonus('engineering', skills.engineering.level);
    const trading = getSkillBonus('trading', skills.trading.level);
    const survival = getSkillBonus('survival', skills.survival.level);

    return {
        maxHpBonus: endurance.maxHpBonus || 0,
        staminaDrainReduction: endurance.staminaDrainReduction || 0,
        craftingSpeed: engineering.craftingSpeed || 0,
        buyPriceReduction: trading.buyPriceReduction || 0,
        sellPriceBonus: trading.sellPriceBonus || 0,
        healingEffectiveness: survival.healingEffectiveness || 0,
    };
}

/**
 * Apply all skill effects to game state
 * This updates the state with calculated bonuses from skills
 */
export function applySkillEffects(state: GameState): GameState {
    const bonuses = getAllSkillBonuses(state.skills);
    const combatBonuses = getTotalCombatBonuses(state.skills);
    const operativeBonuses = getTotalOperativeBonuses(state.skills);

    // Create updated state
    const updatedState: GameState = { ...state };

    // Apply endurance HP bonus to max HP values
    if (operativeBonuses.maxHpBonus > 0) {
        const hpBonusPerPart = Math.floor(operativeBonuses.maxHpBonus / 7); // Distribute across 7 body parts
        updatedState.playerStats = {
            ...state.playerStats,
            hp: {
                head: Math.min(100, state.playerStats.hp.head + hpBonusPerPart),
                thorax: Math.min(100, state.playerStats.hp.thorax + hpBonusPerPart * 2),
                stomach: Math.min(100, state.playerStats.hp.stomach + hpBonusPerPart),
                leftArm: Math.min(100, state.playerStats.hp.leftArm + hpBonusPerPart),
                rightArm: Math.min(100, state.playerStats.hp.rightArm + hpBonusPerPart),
                leftLeg: Math.min(100, state.playerStats.hp.leftLeg + hpBonusPerPart),
                rightLeg: Math.min(100, state.playerStats.hp.rightLeg + hpBonusPerPart),
            },
        };
    }

    // Store calculated bonuses in a meta field for quick access during gameplay
    // This is a computed value that doesn't need to be persisted
    (updatedState as unknown as Record<string, unknown>).calculatedBonuses = {
        combat: combatBonuses,
        operative: operativeBonuses,
        all: bonuses,
    };

    return updatedState;
}

/**
 * Calculate adjusted hit chance considering ballistics skill
 */
export function calculateAdjustedHitChance(
    baseHitChance: number,
    ballisticsLevel: number,
    weaponClass?: string
): number {
    const bonuses = getSkillBonus('ballistics', ballisticsLevel);
    let adjustedChance = baseHitChance + (bonuses.hitChance || 0) / 100;

    // Weapon proficiency bonuses
    if (weaponClass) {
        switch (weaponClass) {
            case 'ar':
            case 'lmg':
                if (ballisticsLevel >= 10) adjustedChance += 0.02;
                if (ballisticsLevel >= 75) adjustedChance += 0.03;
                break;
            case 'sniper':
            case 'dmr':
                if (ballisticsLevel >= 25) adjustedChance += 0.03;
                if (ballisticsLevel >= 50) adjustedChance += 0.02;
                break;
        }
    }

    return Math.min(0.95, Math.max(0.05, adjustedChance)); // Clamp between 5% and 95%
}

/**
 * Calculate adjusted damage considering firepower skill
 */
export function calculateAdjustedDamage(
    baseDamage: number,
    firepowerLevel: number,
    isCritical: boolean
): { damage: number; isCritical: boolean } {
    const bonuses = getSkillBonus('firepower', firepowerLevel);

    // Calculate critical hit chance
    const critChance = (bonuses.criticalChance || 0) / 100;
    const rollCritical = Math.random() < critChance;

    // Apply damage bonus
    let adjustedDamage = baseDamage * (1 + (bonuses.damage || 0) / 100);

    // Apply critical damage
    const finalIsCritical = isCritical || rollCritical;
    if (finalIsCritical) {
        adjustedDamage *= 1.5; // 50% bonus damage on crit
    }

    return { damage: Math.floor(adjustedDamage), isCritical: finalIsCritical };
}

/**
 * Calculate adjusted price based on trading skill
 */
export function calculateAdjustedPrice(
    basePrice: number,
    tradingLevel: number,
    isBuying: boolean
): number {
    const bonuses = getSkillBonus('trading', tradingLevel);

    if (isBuying) {
        const reduction = bonuses.buyPriceReduction || 0;
        return Math.floor(basePrice * (1 - reduction / 100));
    } else {
        const bonus = bonuses.sellPriceBonus || 0;
        return Math.floor(basePrice * (1 + bonus / 100));
    }
}

/**
 * Calculate crafting duration with engineering bonus
 */
export function calculateCraftingDuration(
    baseDuration: number,
    engineeringLevel: number
): number {
    const bonuses = getSkillBonus('engineering', engineeringLevel);
    const speedBonus = bonuses.craftingSpeed || 0;

    // Reduce duration based on crafting speed bonus
    return Math.floor(baseDuration * (1 - speedBonus / 100));
}

/**
 * Calculate healing amount with survival skill bonus
 */
export function calculateHealingAmount(
    baseHealing: number,
    survivalLevel: number
): number {
    const bonuses = getSkillBonus('survival', survivalLevel);
    const effectiveness = bonuses.healingEffectiveness || 0;

    return Math.floor(baseHealing * (1 + effectiveness / 100));
}

/**
 * Check if a route is unlocked based on navigation skill
 */
export function isRouteUnlocked(routeId: string, navigationLevel: number): boolean {
    const bonuses = getSkillBonus('navigation', navigationLevel);
    return bonuses.routeUnlocks?.includes(routeId) ?? false;
}

/**
 * Get loot quality modifier from scavenging skill
 */
export function getLootQualityModifier(scavengingLevel: number): number {
    const bonuses = getSkillBonus('scavenging', scavengingLevel);
    return 1 + (bonuses.lootQualityBonus || 0) / 100;
}

/**
 * Check if auto-scav is enabled (level 40+ scavenging)
 */
export function isAutoScavEnabled(scavengingLevel: number): boolean {
    const bonuses = getSkillBonus('scavenging', scavengingLevel);
    return bonuses.autoScavEnabled ?? false;
}

/**
 * Calculate evasion chance from tactics skill
 */
export function calculateEvasionChance(tacticsLevel: number): number {
    const bonuses = getSkillBonus('tactics', tacticsLevel);
    return Math.min(0.5, (bonuses.evasion || 0) / 100); // Cap at 50%
}

/**
 * Calculate damage reduction from tactics skill
 */
export function calculateDamageReduction(tacticsLevel: number): number {
    const bonuses = getSkillBonus('tactics', tacticsLevel);
    return (bonuses.damageReduction || 0) / 100;
}

/**
 * Format skill level with Roman numerals for display
 */
export function formatSkillLevel(level: number): string {
    if (level >= 99) return 'Elite';
    if (level >= 80) return 'Master';
    if (level >= 60) return 'Expert';
    if (level >= 40) return 'Advanced';
    if (level >= 20) return 'Intermediate';
    return 'Novice';
}

/**
 * Get skill progress percentage to next level
 */
export function getSkillProgress(skillData: SkillData): number {
    const required = calculateSkillXpRequirement(skillData.level);
    return Math.min(100, (skillData.xp / required) * 100);
}

/**
 * Calculate XP required for next skill level
 */
export function calculateSkillXpRequirement(level: number, base: number = 50, growth: number = 1.05): number {
    return Math.floor(base * Math.pow(growth, level - 1));
}
