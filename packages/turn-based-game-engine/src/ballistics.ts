// src/lib/game/ballistics.ts
import { ITEM_DATABASE, isWeapon, isWeaponMod, calculateRecoilModifiers } from './items';

import type { Ammo, Armor, Weapon, WeaponMod, InventoryItem } from './types';

export interface DamageResult {
    damageDealt: number;
    armorDamage: number;
    penetrated: boolean;
    bluntDamage: number;
}

export interface CalculatedWeaponStats {
    baseDamage: number;
    ergonomics: number;
    verticalRecoil: number;
    horizontalRecoil: number;
    accuracy: number;
    fireRate: number;
}

/**
 * Weapon with mods attached
 */
export interface WeaponWithMods {
    weapon: Weapon;
    mods: WeaponMod[];
}

/**
 * Calculate final weapon stats including mod modifiers
 */
export function calculateWeaponStats(weaponWithMods: WeaponWithMods): CalculatedWeaponStats {
    const { weapon, mods } = weaponWithMods;

    // Start with base weapon stats
    const stats: CalculatedWeaponStats = {
        baseDamage: weapon.damage,
        ergonomics: weapon.ergonomics,
        verticalRecoil: weapon.verticalRecoil,
        horizontalRecoil: weapon.horizontalRecoil,
        accuracy: weapon.accuracy,
        fireRate: weapon.fireRate,
    };

    // Apply each mod's modifiers
    for (const mod of mods) {
        if (mod.modifiers) {
            stats.accuracy += mod.modifiers.accuracy ?? 0;
            stats.ergonomics += mod.modifiers.ergonomics ?? 0;
            stats.verticalRecoil += mod.modifiers.verticalRecoil ?? 0;
            stats.horizontalRecoil += mod.modifiers.horizontalRecoil ?? 0;
            stats.fireRate += mod.modifiers.fireRate ?? 0;
        }
    }

    // Ensure stats don't go below minimums
    return {
        baseDamage: Math.max(1, stats.baseDamage),
        ergonomics: Math.max(1, stats.ergonomics),
        verticalRecoil: Math.max(1, stats.verticalRecoil),
        horizontalRecoil: Math.max(1, stats.horizontalRecoil),
        accuracy: Math.max(1, Math.min(100, stats.accuracy)),
        fireRate: Math.max(1, stats.fireRate),
    };
}

/**
 * Get weapon stats from inventory item (with attachments)
 */
export function getWeaponStatsFromInventoryItem(item: InventoryItem): CalculatedWeaponStats | null {
    const itemData = ITEM_DATABASE[item.itemId];
    if (!itemData || !isWeapon(itemData)) {
        return null;
    }

    // Extract mods from attachments
    const mods: WeaponMod[] = [];
    if (item.attachments) {
        for (const attachment of Object.values(item.attachments)) {
            if (attachment) {
                const modData = ITEM_DATABASE[attachment.itemId];
                if (modData && isWeaponMod(modData)) {
                    mods.push(modData);
                }
            }
        }
    }

    return calculateWeaponStats({ weapon: itemData, mods });
}

/**
 * Calculate effective damage with weapon mods
 */
export function calculateEffectiveDamage(
    baseDamage: number,
    weaponStats: CalculatedWeaponStats,
    range: number,
    targetDistance: number
): number {
    // Calculate range effectiveness (dropoff)
    const effectiveRangeRatio = Math.min(1, range / Math.max(1, targetDistance));
    const rangeModifier = 0.5 + (0.5 * effectiveRangeRatio); // 50-100% damage based on range

    // Apply accuracy as a damage variance factor
    const accuracyBonus = (weaponStats.accuracy - 50) / 100; // -0.5 to +0.5

    // Final damage calculation
    let damage = baseDamage * rangeModifier * (1 + accuracyBonus * 0.1);

    // Ergonomics affects handling and consistency (small bonus)
    const ergonomicsBonus = (weaponStats.ergonomics - 40) / 500; // -0.02 to +0.12
    damage *= (1 + ergonomicsBonus);

    return Math.max(1, Math.floor(damage));
}

/**
 * Calculate recoil with skill modifiers
 * @param baseRecoil Base recoil value
 * @param recoilControlLevel Recoil Control skill level
 * @param weaponMasteryLevel Weapon mastery level (0-3)
 * @returns Modified recoil value
 */
export function calculateRecoilWithSkills(
    baseRecoil: number,
    recoilControlLevel: number,
    weaponMasteryLevel: number = 0
): number {
    const recoilMods = calculateRecoilModifiers(recoilControlLevel);

    // Apply vertical recoil reduction
    let modifiedRecoil = baseRecoil * recoilMods.verticalModifier;

    // Weapon mastery reduces recoil further
    const masteryReduction = weaponMasteryLevel * 0.05; // 5% per mastery level
    modifiedRecoil *= (1 - masteryReduction);

    return Math.max(1, modifiedRecoil);
}

/**
 * Calculate first shot recoil multiplier
 */
export function calculateFirstShotRecoil(recoilControlLevel: number): number {
    // First shot is 1.5x normal recoil, reduced by recoil control skill
    const baseMultiplier = 1.5;
    const skillReduction = recoilControlLevel * 0.01;
    return Math.max(1.2, baseMultiplier - skillReduction);
}

/**
 * EFT-style Ballistics Calculation
 * @param ammo The ammunition used
 * @param armor The armor being hit (can be null)
 * @param currentDurability Current durability of the armor
 * @param maxDurability Max durability of the armor
 * @returns Damage results
 */
export function calculateDamage(
    ammo: Ammo,
    armor: Armor | null,
    currentDurability: number = 0,
    maxDurability: number = 100
): DamageResult {
    if (!armor) {
        return {
            damageDealt: ammo.damage,
            armorDamage: 0,
            penetrated: true,
            bluntDamage: 0
        };
    }

    const penValue = ammo.penetration;
    const armorClass = armor.armorClass;
    const durabilityPercent = currentDurability / maxDurability;

    // Fixed Penetration Chance Formula
    // Better scaling that prevents low-tier ammo from having too high pen chance vs high armor
    // Uses a penetration roll (80-120% of pen value) vs armor effectiveness
    const armorEffectiveness = armorClass * 10 * durabilityPercent;
    const penetrationRoll = penValue * (0.8 + Math.random() * 0.4); // 80-120% of pen

    // Chance formula: penetration / (armor + penetration) gives better scaling
    // Example: PS ammo (pen=28) vs Class 6 (60 armor effectiveness)
    // Roll 22-33 vs armor 60 -> chance = 27.5 / (60 + 27.5) = 31% (was 47% with old formula)
    const chance = penetrationRoll / (armorEffectiveness + penetrationRoll);
    const penetrated = Math.random() < chance;

    if (penetrated) {
        // Damage to body: 80-100% of ammo damage, reduced slightly by armor class
        const armorMitigation = Math.min(0.3, armorClass * 0.03); // Up to 30% reduction
        const damageDealt = ammo.damage * (0.8 + Math.random() * 0.2) * (1 - armorMitigation);
        // Minimal damage to armor
        const armorDamage = Math.max(1, penValue / 10) + Math.random() * 2;
        return {
            damageDealt: Math.max(1, damageDealt),
            armorDamage,
            penetrated: true,
            bluntDamage: 0
        };
    } else {
        // Blunt damage: 10-20% of ammo damage, increased if armor is damaged
        const bluntMultiplier = durabilityPercent > 0.5 ? 0.1 : 0.2;
        const bluntDamage = ammo.damage * (bluntMultiplier + Math.random() * 0.1);
        // Significant damage to armor: based on pen value and armor material
        const armorDamage = Math.max(1, (penValue / 10) * (durabilityPercent > 0.5 ? 2 : 4));
        return {
            damageDealt: bluntDamage,
            armorDamage,
            penetrated: false,
            bluntDamage
        };
    }
}
