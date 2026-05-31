// src/lib/game/engine.ts
import { gameLogger } from './logger';

import { MAP_ENCOUNTERS } from './encounters';
import { ENEMY_DATABASE } from './enemies';
import { ITEM_DATABASE } from './items';
import { SeededRNG, createGameRNG } from './rng';

import type { GameState, ActiveRaid, InventoryItem, InsuranceReturn, PlayerStats, ActiveEffect } from './types';


// Maximum delta time to prevent extreme jumps (5 seconds)
const MAX_DELTA_TIME = 5;

// Maximum offline seconds for passive XP (8 hours)
const MAX_OFFLINE_SECONDS = 8 * 60 * 60; // 8 hours

export interface TickResult {
    updates: Partial<GameState>;
    events: GameEvent[];
}

export type GameEvent =
    | { type: 'skillLevelUp'; skill: string; level: number }
    | { type: 'raidComplete'; success: boolean; loot: number }
    | { type: 'moduleUpgradeComplete'; moduleId: string }
    | { type: 'craftComplete'; recipeId: string }
    | { type: 'insuranceReturn'; itemId: string }
    | { type: 'questComplete'; questId: string }
    | { type: 'playerDeath'; cause: string }
    | { type: 'enemyKilled'; enemyId: string; xp: number }
    | { type: 'lowFuel'; moduleId: string }
    | { type: 'outOfFuel'; moduleId: string }
    | { type: 'effectExpired'; effectType: string; name?: string | undefined };

/**
 * Process a single game tick (1 second)
 */
export function processTick(state: GameState): TickResult {
    const events: GameEvent[] = [];
    const now = Date.now();

    // Apply admin speed multiplier
    const speedMultiplier = state.admin?.speedMultiplier ?? 1;
    const rawDeltaTime = ((now - state.lastTick) / 1000) * speedMultiplier;
    // Cap delta time to prevent extreme jumps from lag/tabbing away
    const deltaTime = Math.min(rawDeltaTime, MAX_DELTA_TIME);

    // Create seeded RNG for deterministic randomness - pass seed if raid is active
    const rng = createGameRNG(state.activeRaid?.seed ?? null);

    const updates: Partial<GameState> = {
        lastTick: now
    };

    // 1. Metabolism (Energy/Hydration Drain) affected by Endurance skill
    const enduranceLevel = state.skills.endurance.level;
    const enduranceBonus = Math.min(0.5, (enduranceLevel - 1) * 0.02);
    const metabolismRate = 0.005 * (1 - enduranceBonus);

    let pStats = { ...state.playerStats };

    // God mode check
    const godMode = state.admin?.godMode;

    // 1.5 Process Active Effects (Stimulants, Healing, etc.)
    const activeEffects = state.activeEffects || [];
    const remainingEffects: ActiveEffect[] = [];

    for (const effect of activeEffects) {
        const elapsed = (now - effect.startTime) / 1000; // seconds
        const remaining = Math.max(0, effect.duration - elapsed);

        if (remaining > 0) {
            // Apply effect based on type
            switch (effect.type) {
                case 'healing': {
                    // HP regeneration over time
                    const healAmount = (effect.magnitude / effect.duration) * deltaTime;
                    // Distribute healing across damaged body parts
                    const parts = ['head', 'thorax', 'stomach', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'] as const;
                    for (const part of parts) {
                        if (pStats.hp[part] < 100) {
                            pStats.hp[part] = Math.min(100, pStats.hp[part] + healAmount / parts.length);
                        }
                    }
                    break;
                }

                case 'painkiller':
                    // Painkillers prevent pain effects (handled in combat)
                    // Also slight damage reduction while active
                    break;

                case 'stimulant':
                    // Stimulants boost energy and hydration slightly
                    if (!godMode) {
                        pStats.energy = Math.min(100, pStats.energy + (effect.magnitude * 0.01 * deltaTime));
                        pStats.hydration = Math.min(100, pStats.hydration + (effect.magnitude * 0.005 * deltaTime));
                    }
                    break;

                case 'bleeding_light':
                case 'bleeding_heavy':
                    // Bleeding causes HP drain over time
                    if (!godMode && !activeEffects.some(e => e.type === 'painkiller')) {
                        const bleedDamage = (effect.magnitude / effect.duration) * deltaTime;
                        pStats.hp.thorax = Math.max(0, pStats.hp.thorax - bleedDamage * 0.3);
                        pStats.hp.stomach = Math.max(0, pStats.hp.stomach - bleedDamage * 0.3);
                        pStats.hp.head = Math.max(0, pStats.hp.head - bleedDamage * 0.1);
                    }
                    break;

                case 'energy':
                    // Energy restoration items
                    if (!godMode) {
                        pStats.energy = Math.min(100, pStats.energy + (effect.magnitude / effect.duration) * deltaTime);
                    }
                    break;

                case 'hydration':
                    // Hydration restoration items
                    if (!godMode) {
                        pStats.hydration = Math.min(100, pStats.hydration + (effect.magnitude / effect.duration) * deltaTime);
                    }
                    break;

                case 'radiation':
                    // Radiation damage over time
                    if (!godMode) {
                        const radDamage = (effect.magnitude / effect.duration) * deltaTime;
                        pStats.hp.thorax = Math.max(0, pStats.hp.thorax - radDamage * 0.5);
                        pStats.energy = Math.max(0, pStats.energy - radDamage * 0.2);
                    }
                    break;
            }

            // Keep effect if still active
            remainingEffects.push(effect);
        } else {
            // Effect expired
            events.push({ type: 'effectExpired', effectType: effect.type, name: effect.name });
        }
    }

    // Update active effects
    if (remainingEffects.length !== activeEffects.length) {
        updates.activeEffects = remainingEffects;
    }

    if (!godMode) {
        pStats.energy = Math.max(0, pStats.energy - (metabolismRate * deltaTime));
        pStats.hydration = Math.max(0, pStats.hydration - (metabolismRate * deltaTime));

        if (pStats.energy <= 0 || pStats.hydration <= 0) {
            pStats.hp.thorax = Math.max(0, pStats.hp.thorax - (0.3 * deltaTime));
            pStats.hp.head = Math.max(0, pStats.hp.head - (0.3 * deltaTime));
        }
    } else {
        // God mode - keep stats maxed and prevent all HP damage
        pStats.energy = 100;
        pStats.hydration = 100;
        // Prevent HP damage from any source
        pStats.hp.thorax = Math.max(pStats.hp.thorax, 85);
        pStats.hp.head = Math.max(pStats.hp.head, 35);
    }

    updates.playerStats = pStats;

    // 2. Process Active Raid
    if (state.activeRaid) {
        const raidRes = processRaidTick(state.activeRaid, state, deltaTime, events, rng);
        updates.activeRaid = { ...state.activeRaid, ...raidRes.raidUpdates };

        // Apply stash updates from raid processing (armor durability damage)
        if (raidRes.stashUpdates) {
            updates.stash = raidRes.stashUpdates;
        }

        if (raidRes.playerStatsUpdates) {
            pStats = { ...pStats, ...raidRes.playerStatsUpdates };
            updates.playerStats = pStats;
        }

        // Collect events
        events.push(...raidRes.events);

        // Check if combat damage caused death (even if not directly to head/thorax)
        // Combat damage might have reduced HP below threshold
        const combatDeathOccurred = !godMode && (pStats.hp.head <= 0 || pStats.hp.thorax <= 0);

        // Check if raid should complete (extraction finished)
        const raidShouldComplete = !updates.activeRaid?.currentEnemy &&
            (updates.activeRaid?.status === 'extracting' || state.activeRaid?.status === 'extracting') &&
            ((updates.activeRaid?.elapsedTime ?? state.activeRaid?.elapsedTime ?? 0) >= 30);

        // Store values before potentially setting activeRaid to null
        const raidLocationId = state.activeRaid?.locationId || 'unknown';
        const raidIsScav = state.activeRaid?.isScav || false;
        const raidKills = updates.activeRaid?.kills || state.activeRaid?.kills || [];
        const raidElapsedTime = updates.activeRaid?.elapsedTime ?? state.activeRaid?.elapsedTime ?? 0;

        if (raidShouldComplete) {
            // Raid extraction complete
            updates.activeRaid = null;
            updates.lastRaidSummary = {
                locationId: raidLocationId,
                isScav: raidIsScav,
                status: 'extracted',
                kills: raidKills,
                lootValue: 0,
                totalXp: Math.floor(raidKills.length * 50),
                duration: raidElapsedTime
            };
        } else if (combatDeathOccurred) {
            // Combat death processing
            events.push({ type: 'playerDeath', cause: 'Combat' });

            const equippedIds = Object.values(state.equipment).filter(Boolean) as string[];
            const pouchId = state.equipment.pouch;

            if (!raidIsScav) {
                const newInsurance: InsuranceReturn[] = [];

                state.stash.forEach(item => {
                    if (equippedIds.includes(item.instanceId) && item.instanceId !== pouchId) {
                        if (item.isInsured && rng.chance(0.85)) {
                            newInsurance.push({
                                instanceId: item.instanceId,
                                itemId: item.itemId,
                                returnTime: now + (24 * 60 * 60 * 1000)
                            });
                        }
                    }
                });

                updates.insuranceReturns = [...state.insuranceReturns, ...newInsurance];
                updates.stash = state.stash.filter(i =>
                    !equippedIds.includes(i.instanceId) || i.instanceId === pouchId
                );
                updates.equipment = pouchId ? { pouch: pouchId } : {};
            }

            updates.activeRaid = null;
            updates.lastRaidSummary = {
                locationId: raidLocationId,
                isScav: raidIsScav,
                status: 'killed',
                kills: raidKills,
                lootValue: 0,
                totalXp: Math.floor(raidKills.length * 50),
                duration: raidElapsedTime
            };

            // Reset HP to 1 (not max) on death
            updates.playerStats = {
                hp: { head: 1, thorax: 1, stomach: 1, leftArm: 1, rightArm: 1, leftLeg: 1, rightLeg: 1 },
                energy: Math.max(0, pStats.energy - 30),
                hydration: Math.max(0, pStats.hydration - 30)
            };
        } else if (!godMode && (pStats.hp.head <= 0 || pStats.hp.thorax <= 0)) {
            // Direct damage to head/thorax (not from combat)
            events.push({ type: 'playerDeath', cause: 'Combat' });

            updates.activeRaid = null;
            updates.lastRaidSummary = {
                locationId: raidLocationId,
                isScav: raidIsScav,
                status: 'killed',
                kills: raidKills,
                lootValue: 0,
                totalXp: Math.floor(raidKills.length * 50),
                duration: raidElapsedTime
            };

            updates.playerStats = {
                hp: { head: 1, thorax: 1, stomach: 1, leftArm: 1, rightArm: 1, leftLeg: 1, rightLeg: 1 },
                energy: Math.max(0, pStats.energy - 30),
                hydration: Math.max(0, pStats.hydration - 30)
            };
        }
    }

    // 3. Process Crafting
    const completedCrafts: string[] = [];
    state.activeCrafts.forEach(craft => {
        if (now >= craft.endTime && !craft.isCompleted) {
            completedCrafts.push(craft.recipeId);
            events.push({ type: 'craftComplete', recipeId: craft.recipeId });
        }
    });

    if (completedCrafts.length > 0) {
        updates.activeCrafts = state.activeCrafts.map(c =>
            completedCrafts.includes(c.recipeId) ? { ...c, isCompleted: true } : c
        );
    }

    // 4. Process Module Upgrades
    Object.entries(state.hideoutModules).forEach(([moduleId, module]) => {
        if (module.isUpgrading && module.upgradeEndTime && now >= module.upgradeEndTime) {
            // Use destructuring to remove upgradeEndTime
            const { upgradeEndTime: _removed, ...moduleWithoutEndTime } = module;
            void _removed; // Mark as intentionally unused
            updates.hideoutModules = {
                ...updates.hideoutModules,
                [moduleId]: {
                    ...moduleWithoutEndTime,
                    level: module.level + 1,
                    isUpgrading: false
                }
            };
            events.push({ type: 'moduleUpgradeComplete', moduleId });
        }
    });

    // 5. Fuel Consumption for Generator
    const generator = state.hideoutModules['generator'];
    if (generator && generator.fuel !== undefined && generator.maxFuel && generator.fuel > 0) {
        const fuelConsumptionRate = generator.fuelConsumption || 0.1; // 0.1 fuel per second default
        const actualConsumption = fuelConsumptionRate * deltaTime;

        const newFuel = Math.max(0, generator.fuel - actualConsumption);

        // Check for low fuel warning (below 10%)
        if (generator.fuel > generator.maxFuel * 0.1 && newFuel <= generator.maxFuel * 0.1) {
            events.push({ type: 'lowFuel', moduleId: 'generator' });
        }

        // Check for out of fuel
        if (generator.fuel > 0 && newFuel === 0) {
            events.push({ type: 'outOfFuel', moduleId: 'generator' });
        }

        if (newFuel !== generator.fuel) {
            updates.hideoutModules = {
                ...updates.hideoutModules,
                generator: {
                    ...generator,
                    fuel: newFuel
                }
            };
        }
    }

    // 6. Insurance & Recoveries
    const readyReturns = state.insuranceReturns.filter(ir => now >= ir.returnTime);
    if (readyReturns.length > 0) {
        const newItems: InventoryItem[] = readyReturns.map(ir => ({
            instanceId: `ins-${now}-${ir.instanceId}`,
            itemId: ir.itemId,
            x: 0, y: 0, rotated: false,
            quantity: 1,
            foundInRaid: false // Insurance returns are not FIR
        }));

        readyReturns.forEach(ret => {
            events.push({ type: 'insuranceReturn', itemId: ret.itemId });
        });

        updates.stash = [...(updates.stash || state.stash), ...newItems];
        updates.insuranceReturns = state.insuranceReturns.filter(ir => now < ir.returnTime);
    }

    // 7. Natural Recovery (only out of raid, requires generator fuel)
    const hasGeneratorFuel = generator && generator.fuel && generator.fuel > 0;
    if (!state.activeRaid && !godMode && hasGeneratorFuel) {
        const recoveryRate = 0.05 * deltaTime;
        const newHp = { ...pStats.hp };
        let changed = false;

        (Object.keys(newHp) as (keyof typeof newHp)[]).forEach(part => {
            if (newHp[part] < 100) {
                newHp[part] = Math.min(100, newHp[part] + recoveryRate);
                changed = true;
            }
        });

        if (changed) {
            updates.playerStats = { ...pStats, hp: newHp };
        }
    }

    // 8. Quest Progression Check
    state.quests.forEach(quest => {
        if (quest.status === 'active') {
            const allComplete = quest.objectives.every(obj => obj.current >= obj.required);
            if (allComplete) {
                updates.quests = state.quests.map(q =>
                    q.id === quest.id ? { ...q, status: 'completed' as const } : q
                );
                events.push({ type: 'questComplete', questId: quest.id });
            }
        }
    });

    // 9. Process Black Limb Effects
    // Skip if godMode, no active raid, or death already processed
    if (!godMode && state.activeRaid && !updates.activeRaid) {
        let deathProcessed = false;

        const blackedParts = Object.entries(state.detailedBodyParts)
            .filter(([, part]) => part.isBlacked)
            .map(([name]) => name as keyof PlayerStats['hp']);

        for (const part of blackedParts) {
            switch (part) {
                case 'head':
                case 'thorax':
                    // Head/Thorax blacked = Death
                    deathProcessed = true;
                    events.push({ type: 'playerDeath', cause: `${part} destroyed` });
                    updates.activeRaid = null;
                    updates.playerStats = {
                        ...pStats,
                        hp: { head: 1, thorax: 1, stomach: 1, leftArm: 1, rightArm: 1, leftLeg: 1, rightLeg: 1 }
                    };
                    break;
                case 'stomach':
                    // Stomach blacked = rapid dehydration/energy loss
                    pStats.energy = Math.max(0, pStats.energy - (0.1 * deltaTime));
                    pStats.hydration = Math.max(0, pStats.hydration - (0.15 * deltaTime));
                    break;
                case 'leftArm':
                case 'rightArm':
                    // Arm blacked = reduced reload speed, weapon shake (handled in UI)
                    break;
                case 'leftLeg':
                case 'rightLeg':
                    // Leg blacked = cannot sprint, reduced movement speed
                    // Movement penalties applied elsewhere
                    break;
            }
        }

        // Only update playerStats if death was NOT processed
        if (!deathProcessed) {
            updates.playerStats = pStats;
        }
    }

    // 10. NEW: Process Bleeding Effects
    // Skip if godMode, no active raid, or death already processed
    if (!godMode && state.activeRaid && !updates.activeRaid) {
        let deathProcessed = false;

        for (const bleed of state.bleedingEffects) {
            const damagePerSecond = bleed.severity === 'heavy' ? 5 : 2;
            const totalDamage = damagePerSecond * deltaTime;

            // Distribute damage to thorax (primary) and other parts
            pStats.hp.thorax = Math.max(0, pStats.hp.thorax - totalDamage * 0.5);
            pStats.hp.stomach = Math.max(0, pStats.hp.stomach - totalDamage * 0.3);
            pStats.hp.head = Math.max(0, pStats.hp.head - totalDamage * 0.2);

            // Check for death - process same consequences as combat death
            if (pStats.hp.head <= 0 || pStats.hp.thorax <= 0) {
                deathProcessed = true;
                events.push({ type: 'playerDeath', cause: 'Bled out' });

                // Process insurance and loot loss (same as combat death)
                if (state.activeRaid && !state.activeRaid.isScav) {
                    const equippedIds = Object.values(state.equipment).filter(Boolean) as string[];
                    const pouchId = state.equipment.pouch;
                    const newInsurance: InsuranceReturn[] = [];

                    state.stash.forEach(item => {
                        if (equippedIds.includes(item.instanceId) && item.instanceId !== pouchId) {
                            // Remove FIR status on death - items lost
                            if (item.isInsured && rng.chance(0.85)) {
                                newInsurance.push({
                                    instanceId: item.instanceId,
                                    itemId: item.itemId,
                                    returnTime: now + (24 * 60 * 60 * 1000)
                                });
                            }
                        }
                    });

                    updates.insuranceReturns = [...state.insuranceReturns, ...newInsurance];
                    // Remove equipped items (except pouch) from stash on death - FIR items lost
                    updates.stash = state.stash.filter(i =>
                        !equippedIds.includes(i.instanceId) || i.instanceId === pouchId
                    );
                    updates.equipment = pouchId ? { pouch: pouchId } : {};
                }

                updates.activeRaid = null;
                updates.lastRaidSummary = {
                    locationId: state.activeRaid?.locationId || 'unknown',
                    isScav: state.activeRaid?.isScav || false,
                    status: 'killed',
                    kills: state.activeRaid?.kills || [],
                    lootValue: 0,
                    totalXp: Math.floor((state.activeRaid?.kills?.length || 0) * 50),
                    duration: state.activeRaid?.elapsedTime || 0
                };
                updates.playerStats = {
                    hp: { head: 1, thorax: 1, stomach: 1, leftArm: 1, rightArm: 1, leftLeg: 1, rightLeg: 1 },
                    energy: Math.max(0, pStats.energy - 30),
                    hydration: Math.max(0, pStats.hydration - 30)
                };
                break;
            }
        }

        // Only update playerStats if death was NOT processed
        if (!deathProcessed) {
            updates.playerStats = pStats;
        }
    }

    // 11. NEW: Process Painkiller Withdrawal
    if (state.painkillerState.addictionLevel > 0 && !state.painkillerState.active) {
        const withdrawalDuration = 10 * 60 * 1000; // 10 minutes
        if (Date.now() - (state.painkillerState.withdrawalStartTime || Date.now()) > withdrawalDuration) {
            // Withdrawal faded - reduce addiction
            updates.painkillerState = {
                ...state.painkillerState,
                addictionLevel: Math.max(0, state.painkillerState.addictionLevel - 1),
                isInWithdrawal: false,
            };
        } else {
            // In withdrawal - apply effects (tremors, tunnel vision, reduced stamina)
            updates.painkillerState = {
                ...state.painkillerState,
                isInWithdrawal: true,
                withdrawalStartTime: state.painkillerState.withdrawalStartTime || Date.now(),
            };
        }
    }

    // 12. Process Weight Effects on Stamina
    // Skip if godMode, no active raid, or death already processed
    if (!godMode && state.activeRaid && !updates.activeRaid) {
        const weightThreshold = state.weight.threshold;
        let staminaDrainMultiplier = 1;

        switch (weightThreshold) {
            case 'medium':
                staminaDrainMultiplier = 1.2;
                break;
            case 'heavy':
                staminaDrainMultiplier = 1.5;
                break;
            case 'overloaded':
                staminaDrainMultiplier = 2.0;
                break;
            case 'encumbered':
                staminaDrainMultiplier = 3.0;
                break;
        }

        // Apply stamina drain based on weight
        if (staminaDrainMultiplier > 1) {
            const extraDrain = (staminaDrainMultiplier - 1) * deltaTime;
            updates.stamina = {
                ...state.stamina,
                current: Math.max(0, state.stamina.current - extraDrain),
            };
        }
    }

    // 13. NEW: Update Recoil Recovery
    if (state.recoilState.verticalBuildup > 0 || state.recoilState.horizontalBuildup > 0) {
        const recoveryRate = 0.3 * deltaTime * (1 + state.skills.ballistics.level * 0.02);
        updates.recoilState = {
            ...state.recoilState,
            verticalBuildup: Math.max(0, state.recoilState.verticalBuildup - recoveryRate),
            horizontalBuildup: Math.max(0, state.recoilState.horizontalBuildup - recoveryRate),
            shotsInBurst: 0, // Reset burst counter when not firing
        };
    }

    return { updates, events };
}

interface RaidProcessResult {
    raidUpdates: Partial<ActiveRaid>;
    playerStatsUpdates?: Partial<PlayerStats> | undefined;
    stashUpdates?: InventoryItem[];
    events: GameEvent[];
}

function processRaidTick(
    raid: ActiveRaid,
    state: GameState,
    dt: number,
    globalEvents: GameEvent[],
    rng: SeededRNG
): RaidProcessResult {
    const events: GameEvent[] = [];
    const raidUpdates: Partial<ActiveRaid> = {
        elapsedTime: raid.elapsedTime + dt
    };
    // Only collect new logs, apply at end
    const newLogs: string[] = [];
    let playerStatsUpdates: { hp: PlayerStats['hp'] } | undefined = undefined;
    let stashUpdates: InventoryItem[] | undefined = undefined;

    // Admin reveal all
    const revealAll = state.admin?.revealAll;

    if (raid.status === 'searching') {
        const encounters = MAP_ENCOUNTERS[raid.locationId] || [];
        const possible = encounters.filter(e =>
            raidUpdates.elapsedTime !== undefined &&
            e.minTime <= raidUpdates.elapsedTime &&
            e.minTime > raid.elapsedTime
        );

        for (const e of possible) {
            const chance = revealAll ? 1 : e.chance;
            if (rng.chance(chance) && raidUpdates.elapsedTime !== undefined) {
                newLogs.push(`[${formatTime(raidUpdates.elapsedTime)}] ${e.description}`);

                if (e.type === 'combat') {
                    // Select enemy based on location using seeded RNG
                    const enemyPool = ['scav-basic', 'scav-armed', 'scav-veteran'];
                    const enemyId = rng.pick(enemyPool);
                    if (!enemyId) {
                        gameLogger.error('Failed to select enemy from pool');
                        continue;
                    }
                    const enemy = ENEMY_DATABASE[enemyId];

                    raidUpdates.status = 'combat';
                    raidUpdates.currentEnemy = {
                        id: enemyId,
                        hp: enemy?.health || 100,
                        maxHp: enemy?.health || 100
                    };
                } else if (e.type === 'loot') {
                    raidUpdates.status = 'looting';
                }
            }
        }
    } else if (raid.status === 'combat' && raid.currentEnemy) {
        const enemy = ENEMY_DATABASE[raid.currentEnemy.id];

        // Player Attack affected by weapon skills
        let hitChance = 0.2;
        const equippedWeapon = state.equipment.primary;

        if (equippedWeapon) {
            const weaponItem = state.stash.find(i => i.instanceId === equippedWeapon);
            if (weaponItem) {
                const weaponData = ITEM_DATABASE[weaponItem.itemId] as { weaponClass?: string } | undefined;
                if (weaponData && weaponData.weaponClass) {
                    switch (weaponData.weaponClass) {
                        case 'ar':
                        case 'lmg':
                            hitChance += (state.skills.ballistics.level - 1) * 0.008;
                            break;
                        case 'sniper':
                        case 'dmr':
                            hitChance += (state.skills.marksman.level - 1) * 0.012;
                            break;
                        case 'smg':
                        case 'shotgun':
                            hitChance += (state.skills.cqb.level - 1) * 0.008;
                            break;
                    }
                }
            }
        }

        // God mode = always hit, max damage
        const isGodMode = state.admin?.godMode;
        if (isGodMode || Math.random() < hitChance) {
            let damage = 40 + Math.random() * 20;
            if (isGodMode) damage = 999;

            const newHp = Math.max(0, raid.currentEnemy.hp - damage);
            const weaponId = raid.isScav ? 'ak-74' : (equippedWeapon ? state.stash.find(i => i.instanceId === equippedWeapon)?.itemId : 'knife');

            const weaponData = ITEM_DATABASE[weaponId || 'ak-74'];
            if (!weaponData) {
                gameLogger.error('Invalid weapon ID in combat', { weaponId });
                return { raidUpdates, events };
            }
            const weaponName = weaponData.shortName;

            if (raidUpdates.elapsedTime !== undefined) {
                raidUpdates.raidLogs!.push(`[${formatTime(raidUpdates.elapsedTime)}] Engaging hostile. Hit confirmed with ${weaponName}.`);
            }

            if (newHp <= 0) {
                if (raidUpdates.elapsedTime !== undefined) {
                    raidUpdates.raidLogs!.push(`[${formatTime(raidUpdates.elapsedTime)}] Target KIA.`);
                }
                raidUpdates.status = 'searching';
                // Properly remove currentEnemy by using delete
                delete (raidUpdates as Partial<ActiveRaid>).currentEnemy;

                const xpGain = 200 + (enemy?.difficulty || 0) * 50;
                raidUpdates.kills = [...(raid.kills || []), {
                    enemyId: raid.currentEnemy.id,
                    weapon: weaponId || 'ak-74',
                    xp: xpGain
                }];

                events.push({ type: 'enemyKilled', enemyId: raid.currentEnemy.id, xp: xpGain });
            } else {
                raidUpdates.currentEnemy = { ...raid.currentEnemy, hp: newHp };
            }
        }

        // Enemy Attack affected by Tactics skill
        const tacticsLevel = state.skills.tactics.level;
        const dodgeChance = Math.min(0.5, (tacticsLevel - 1) * 0.005);

        // God mode = never get hit
        if (!isGodMode && Math.random() < (enemy?.attackChance || 0.2) && Math.random() > dodgeChance) {
            const parts = ['head', 'thorax', 'stomach', 'leftArm', 'rightArm', 'leftLeg', 'rightLeg'] as const;
            const partIndex = Math.floor(Math.random() * parts.length);
            const part = parts[partIndex];
            if (!part) {
                gameLogger.error('Failed to select body part in combat');
                return { raidUpdates, playerStatsUpdates: playerStatsUpdates ?? undefined, events };
            }
            const damage = enemy?.damage || 15;

            if (raidUpdates.elapsedTime !== undefined) {
                raidUpdates.raidLogs!.push(`[${formatTime(raidUpdates.elapsedTime)}] Taking fire! Impact to ${part.toUpperCase()}.`);
            }

            // Get current HP values - use type assertion to handle strict narrowing
            const statsUpdates = playerStatsUpdates as { hp: PlayerStats['hp'] } | undefined;
            const baseHp = statsUpdates ? statsUpdates.hp : state.playerStats.hp;
            const currentHp = baseHp[part];
            const updatedHp: PlayerStats['hp'] = {
                head: baseHp.head,
                thorax: baseHp.thorax,
                stomach: baseHp.stomach,
                leftArm: baseHp.leftArm,
                rightArm: baseHp.rightArm,
                leftLeg: baseHp.leftLeg,
                rightLeg: baseHp.rightLeg,
                [part]: Math.max(0, currentHp - damage)
            };
            playerStatsUpdates = { hp: updatedHp };

            // Apply armor durability damage - immutable update
            const armorDamage = Math.max(1, Math.floor(damage * 0.5));
            if (state.equipment.bodyArmor) {
                const armorInstance = state.stash.find(i => i.instanceId === state.equipment.bodyArmor);
                if (armorInstance && armorInstance.durability !== undefined) {
                    // Create immutable stash update instead of direct mutation
                    const updatedArmorItem: InventoryItem = {
                        ...armorInstance,
                        durability: Math.max(0, armorInstance.durability - armorDamage)
                    };
                    stashUpdates = state.stash.map(item =>
                        item.instanceId === armorInstance.instanceId ? updatedArmorItem : item
                    );
                }
            }
        }
    } else if (raid.status === 'looting') {
        if (Math.random() < 0.3 || revealAll) {
            const lootPool = [
                { id: '545x39-ps', weight: 30 },
                { id: 'ai-2', weight: 20 },
                { id: 'tushonka', weight: 15 },
                { id: 'salewa', weight: 10 },
                { id: 'paca', weight: 5 },
                { id: 'okp-7', weight: 8 },
                { id: 'ak-74', weight: 2 },
            ];

            const totalWeight = lootPool.reduce((sum, item) => sum + item.weight, 0);
            let random = Math.random() * totalWeight;
            const firstItem = lootPool[0];
            if (!firstItem) {
                gameLogger.error('Loot pool is empty');
                return { raidUpdates, playerStatsUpdates: playerStatsUpdates ?? undefined, events };
            }
            let lootId = firstItem.id;

            for (const item of lootPool) {
                random -= item.weight;
                if (random <= 0) {
                    lootId = item.id;
                    break;
                }
            }

            const newItem: InventoryItem = {
                instanceId: `loot-${Date.now()}-${Math.random()}`,
                itemId: lootId,
                x: 0, y: 0, rotated: false,
                quantity: lootId.includes('ammo') ? Math.floor(Math.random() * 30) + 10 : 1,
                foundInRaid: true // Loot found in raid gets FIR status
            };

            raidUpdates.lootFound = [...raid.lootFound, newItem];
            const lootItemData = ITEM_DATABASE[lootId];
            if (lootItemData) {
                if (raidUpdates.elapsedTime !== undefined) {
                    raidUpdates.raidLogs!.push(`[${formatTime(raidUpdates.elapsedTime)}] Secured ${lootItemData.shortName}.`);
                }
            } else {
                gameLogger.error('Invalid loot ID in raid', { lootId });
                if (raidUpdates.elapsedTime !== undefined) {
                    raidUpdates.raidLogs!.push(`[${formatTime(raidUpdates.elapsedTime)}] Secured unknown item.`);
                }
            }
            raidUpdates.status = 'searching';
        }
    }

    return { raidUpdates, playerStatsUpdates: playerStatsUpdates ?? undefined, events };
}

function formatTime(s: number): string {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
}

/**
 * Calculate offline progress
 */
export function calculateOfflineProgress(state: GameState, offlineSeconds: number) {
    const results = {
        skillGains: {} as Record<string, number>,
        moneyGained: 0,
        craftsCompleted: 0,
        insuranceReturned: 0,
        modulesUpgraded: [] as string[],
        fuelConsumed: 0,
        raidsCompleted: 0
    };

    const now = Date.now();
    const offlineMs = offlineSeconds * 1000;

    // Process crafts
    state.activeCrafts.forEach(craft => {
        if (!craft.isCompleted && now + offlineMs >= craft.endTime) {
            results.craftsCompleted++;
        }
    });

    // Process insurance returns
    results.insuranceReturned = state.insuranceReturns.filter(ir =>
        now + offlineMs >= ir.returnTime
    ).length;

    // Process module upgrades
    Object.entries(state.hideoutModules).forEach(([moduleId, module]) => {
        if (module.isUpgrading && module.upgradeEndTime && now + offlineMs >= module.upgradeEndTime) {
            results.modulesUpgraded.push(moduleId);
        }
    });

    // Calculate fuel consumption for offline period
    const generator = state.hideoutModules['generator'];
    if (generator && generator.fuel !== undefined && generator.fuelConsumption) {
        const maxConsumption = generator.fuelConsumption * offlineSeconds;
        results.fuelConsumed = Math.min(generator.fuel, maxConsumption);
    }

    // Passive skill gains (very small amounts)
    const passiveXp = Math.floor(offlineSeconds / 12); // 1 XP per 12 seconds (10x faster)
    if (passiveXp > 0) {
        results.skillGains['endurance'] = passiveXp;
        results.skillGains['scavenging'] = Math.floor(passiveXp * 0.5);
    }

    return results;
}

/**
 * Calculate loot value multiplier based on player level
 * New players (levels 1-10) get +50% loot value
 * Mid-level players (levels 11-20) get +25% loot value
 * Veterans (level 21+) get normal rates
 */
export function calculateLootMultiplier(level: number): number {
    if (level <= 10) return 1.5; // +50% for new players
    if (level <= 20) return 1.25; // +25% for mid-level
    return 1.0; // Normal rates for veterans
}

/**
 * Calculate new player protection bonus
 * First 3 raids have enhanced rewards and reduced penalties
 */
export function calculateNewPlayerProtection(
    raidCount: number
): {
    lootMultiplier: number;
    insuranceReturnRate: number;
    xpMultiplier: number;
    isProtected: boolean;
} {
    const isProtected = raidCount < 3;

    if (isProtected) {
        return {
            lootMultiplier: 1.5,
            insuranceReturnRate: 1.0, // 100% insurance return
            xpMultiplier: 1.25,
            isProtected: true,
        };
    }

    return {
        lootMultiplier: 1.0,
        insuranceReturnRate: 0.85, // Normal 85% insurance return
        xpMultiplier: 1.0,
        isProtected: false,
    };
}

/**
 * Process raid extraction - move loot from raid to stash with FIR status
 * Includes level-based bonuses for new player experience
 */
export function processRaidExtraction(
    state: GameState,
    lootItems: InventoryItem[]
): { updatedStash: InventoryItem[]; xpGained: number } {
    const now = Date.now();
    let xpGained = 0;

    // Calculate bonuses
    const lootMultiplier = calculateLootMultiplier(state.level);
    const protection = calculateNewPlayerProtection(state.raidCount || 0);
    const totalMultiplier = lootMultiplier * protection.lootMultiplier;

    // Process loot items - they already have FIR = true from looting
    const processedLoot: InventoryItem[] = lootItems.map(item => {
        // Calculate XP based on item value with multipliers
        const itemData = ITEM_DATABASE[item.itemId];
        if (itemData) {
            const baseXp = Math.floor(itemData.baseValue / 1000) * item.quantity;
            xpGained += Math.floor(baseXp * totalMultiplier);
        }

        return {
            ...item,
            instanceId: `extracted-${now}-${item.instanceId}`,
            // Ensure FIR status is maintained on extraction
            foundInRaid: true
        };
    });

    return {
        updatedStash: [...state.stash, ...processedLoot],
        xpGained: Math.floor(xpGained * protection.xpMultiplier)
    };
}

/**
 * Calculate raid rewards with level-based bonuses
 * Used when generating loot during raid completion
 */
export function calculateRaidLootValue(
    baseLootValue: number,
    level: number,
    raidCount: number,
    isFirstExtractOfDay: boolean = false
): number {
    let multiplier = calculateLootMultiplier(level);

    // Apply new player protection
    const protection = calculateNewPlayerProtection(raidCount);
    multiplier *= protection.lootMultiplier;

    // First extract of the day bonus
    if (isFirstExtractOfDay) {
        multiplier *= 1.2; // +20% bonus
    }

    return Math.floor(baseLootValue * multiplier);
}

/**
 * Process player death - lose equipped gear, FIR items are lost
 */
export function processPlayerDeath(
    state: GameState,
    cause: string
): { updates: Partial<GameState>; insuranceReturns: InsuranceReturn[] } {
    const now = Date.now();
    const equippedIds = Object.values(state.equipment).filter(Boolean) as string[];
    const pouchId = state.equipment.pouch;

    const newInsurance: InsuranceReturn[] = [];

    state.stash.forEach(item => {
        if (equippedIds.includes(item.instanceId) && item.instanceId !== pouchId) {
            // Items lost on death - if insured, chance to return (without FIR)
            if (item.isInsured && Math.random() < 0.85) {
                newInsurance.push({
                    instanceId: item.instanceId,
                    itemId: item.itemId,
                    returnTime: now + (24 * 60 * 60 * 1000)
                });
            }
        }
    });

    return {
        updates: {
            // Remove equipped items except pouch
            stash: state.stash.filter(i =>
                !equippedIds.includes(i.instanceId) || i.instanceId === pouchId
            ),
            equipment: pouchId ? { pouch: pouchId } : {},
            activeRaid: null,
            lastRaidSummary: {
                locationId: state.activeRaid?.locationId || 'unknown',
                isScav: state.activeRaid?.isScav || false,
                status: 'killed',
                kills: state.activeRaid?.kills || [],
                lootValue: 0,
                totalXp: 0,
                duration: state.activeRaid?.elapsedTime || 0
            },
            playerStats: {
                hp: { head: 1, thorax: 1, stomach: 1, leftArm: 1, rightArm: 1, leftLeg: 1, rightLeg: 1 },
                energy: Math.max(0, state.playerStats.energy - 30),
                hydration: Math.max(0, state.playerStats.hydration - 30)
            }
        },
        insuranceReturns: newInsurance
    };
}
