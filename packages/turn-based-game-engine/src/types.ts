// src/lib/types/game.ts

export interface AdminState {
  isAdmin?: boolean;
  adminPassword?: string;
  speedMultiplier?: number;
  instantCraft?: boolean;
  godMode?: boolean;
  unlimitedMoney?: boolean;
  revealAll?: boolean;
}

export type SkillType =
    | 'ballistics' | 'firepower' | 'tactics' | 'endurance' | 'marksman' | 'cqb'
    | 'scavenging' | 'navigation' | 'trading' | 'engineering' | 'survival' | 'intel';

export interface SkillData {
    level: number;
    xp: number;
}

export type ItemType =
    | 'weapon' | 'ammo' | 'armor' | 'helmet' | 'headset'
    | 'rig' | 'backpack' | 'medical' | 'food' | 'drink'
    | 'barter' | 'key' | 'container' | 'fuel' | 'mod'
    | 'nvg' | 'thermal' | 'melee' | 'throwable' | 'secureContainer';

export type AttachmentSlot = 'optics' | 'muzzle' | 'foregrip' | 'magazine' | 'stock' | 'tactical';

// BaseItem is an abstract interface that all specific item types extend
// It is NOT part of the Item union - this enables proper discriminated union narrowing
export interface BaseItem {
    id: string;
    name: string;
    shortName: string;
    description: string;
    type: ItemType;
    width: number;
    height: number;
    icon?: string;
    baseValue: number;
    weight: number;
}

export interface Weapon extends BaseItem {
    type: 'weapon';
    weaponClass: 'ar' | 'smg' | 'shotgun' | 'dmr' | 'sniper' | 'pistol' | 'lmg' | 'melee';
    caliber: string;
    damage: number;
    accuracy: number;
    ergonomics: number;
    verticalRecoil: number;
    horizontalRecoil: number;
    fireRate: number;
    effectiveRange: number;
    compatibleMods?: {
        [slot in AttachmentSlot]?: string[]; // Array of compatible mod IDs
    };
}

export interface WeaponMod extends BaseItem {
    type: 'mod';
    slotType: AttachmentSlot;
    modifiers: {
        accuracy?: number;
        ergonomics?: number;
        verticalRecoil?: number;
        horizontalRecoil?: number;
        fireRate?: number;
    };
}

export interface Ammo extends BaseItem {
    type: 'ammo';
    caliber: string;
    penetration: number;
    damage: number;
    fragmentationChance: number;
}

export interface Armor extends BaseItem {
    type: 'armor' | 'helmet';
    armorClass: number;
    maxDurability: number;
    material: string;
    protectionZones: string[];
}

export interface Medical extends BaseItem {
    type: 'medical';
    useTime: number;
    hpRestored?: number;
    maxUses: number;
}

export interface Provision extends BaseItem {
    type: 'food' | 'drink';
    energyBonus: number;
    hydrationBonus: number;
}

// Additional concrete item types for discriminated union
export interface Helmet extends Armor {
    type: 'helmet';
}

export interface Rig extends BaseItem {
    type: 'rig';
    armorClass?: number;
    maxDurability?: number;
    slots: number;
}

export interface Backpack extends BaseItem {
    type: 'backpack';
    capacity: number;
}

export interface Headset extends BaseItem {
    type: 'headset';
    hearingBoost: number;
}

export interface Barter extends BaseItem {
    type: 'barter';
}

export interface Key extends BaseItem {
    type: 'key';
}

export interface Container extends BaseItem {
    type: 'container';
    capacity: number;
}

export interface Fuel extends BaseItem {
    type: 'fuel';
    fuelCapacity?: number;
}

export interface NVG extends BaseItem {
    type: 'nvg';
    generation: 1 | 2 | 3 | 4;
    brightnessBoost: number;
    noiseLevel: number;
}

export interface Thermal extends BaseItem {
    type: 'thermal';
    refreshRate: number;
    range: number;
}

export interface MeleeWeapon extends BaseItem {
    type: 'melee';
    damage: number;
    range: number;
    penetration: number;
}

export interface Throwable extends BaseItem {
    type: 'throwable';
    throwType: 'frag' | 'flash' | 'smoke' | 'stun';
    damage?: number;
    radius?: number;
    duration?: number;
    blindDuration?: number;
}

export interface SecureContainer extends BaseItem {
    type: 'secureContainer';
    slots: number;
    gridWidth: number;
    gridHeight: number;
}

// Discriminated union - BaseItem is intentionally NOT included
// This forces TypeScript to use the 'type' property for narrowing
export type Item =
    | Weapon
    | WeaponMod
    | Ammo
    | Armor
    | Helmet
    | Medical
    | Provision
    | Rig
    | Backpack
    | Headset
    | Barter
    | Key
    | Container
    | Fuel
    | NVG
    | Thermal
    | MeleeWeapon
    | Throwable
    | SecureContainer;

export interface InventoryItem {
    instanceId: string;
    itemId: string;
    x: number;
    y: number;
    rotated: boolean;
    quantity: number;
    foundInRaid: boolean;
    durability?: number;
    maxDurability?: number;
    isInsured?: boolean;
    attachments?: Partial<Record<AttachmentSlot, InventoryItem>>;
    containerId?: string; // ID of secure container this item is stored in
}

export interface BodyPartState {
    hp: number;
    maxHp: number;
    isBlacked: boolean;
}

export interface PlayerStats {
    hp: {
        head: number;
        thorax: number;
        stomach: number;
        leftArm: number;
        rightArm: number;
        leftLeg: number;
        rightLeg: number;
    };
    energy: number;
    hydration: number;
}

export interface DetailedBodyParts {
    head: BodyPartState;
    thorax: BodyPartState;
    stomach: BodyPartState;
    leftArm: BodyPartState;
    rightArm: BodyPartState;
    leftLeg: BodyPartState;
    rightLeg: BodyPartState;
}

export type BleedingSeverity = 'light' | 'heavy';

export interface BleedingEffect {
    part: keyof DetailedBodyParts;
    severity: BleedingSeverity;
    startTime: number;
}

export interface FractureState {
    part: 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg';
    isSplinted: boolean;
    splintAppliedAt?: number;
}

export type MalfunctionType = 'jam' | 'misfire' | 'failure_to_feed' | 'failure_to_eject';

export interface WeaponState {
    instanceId: string;
    itemId: string;
    magazineInstanceId?: string;
    chamberedRound?: string;
    durability: number;
    maxDurability: number;
    currentMalfunction?: MalfunctionType | undefined;
    shotsSinceLastClean: number;
}

export interface StaminaState {
    current: number;
    max: number;
    isRecovering: boolean;
}

export interface WeightState {
    current: number;
    threshold: 'light' | 'medium' | 'heavy' | 'overloaded' | 'encumbered';
}

export interface VisorState {
    isDown: boolean;
    currentDurability: number;
    maxDurability: number;
}

export interface HelmetWithVisor extends Armor {
    type: 'helmet';
    hasVisor: boolean;
    visorArmorClass?: number;
    visorDurability?: number;
    visionPenalty?: number;
}

export interface RecoilState {
    verticalBuildup: number;
    horizontalBuildup: number;
    recoveryRate: number;
    shotsInBurst: number;
}

export interface PainkillerState {
    active: boolean;
    startTime: number;
    duration: number;
    usesInWindow: number;
    windowStartTime: number;
    addictionLevel: number;
    isInWithdrawal: boolean;
    withdrawalStartTime?: number;
}

export type ActiveEffectType =
    | 'painkiller'
    | 'stimulant'
    | 'healing'
    | 'radiation'
    | 'bleeding_light'
    | 'bleeding_heavy'
    | 'energy'
    | 'hydration'
    | 'fracture'
    | 'surgery'
    | 'tourniquet'
    | 'painkiller_withdrawal';

export interface ActiveEffect {
    type: ActiveEffectType;
    startTime: number;
    duration: number;
    magnitude: number;
    sourceItemId: string;
    name?: string;
    targetBodyPart?: keyof DetailedBodyParts;
}

export interface HideoutModule {
    id: string;
    name: string;
    level: number;
    maxLevel: number;
    isUpgrading: boolean;
    upgradeEndTime?: number;
    fuel?: number;
    maxFuel?: number;
    fuelConsumption?: number;
    requirements: {
        roubles: number;
        items: { itemId: string; quantity: number }[];
        level: number;
    };
}

export interface Trader {
    id: string;
    name: string;
    description: string;
    loyaltyLevel: number;
    reputation: number;
    salesVolume: number;
    inventory: { itemId: string; price: number; requiredLoyalty: number }[];
}

export interface CraftingRecipe {
    id: string;
    moduleId: string;
    moduleLevel: number;
    name: string;
    duration: number;
    requirements: { itemId: string; quantity: number }[];
    result: { itemId: string; quantity: number };
}

export interface ActiveCraft {
    recipeId: string;
    startTime: number;
    endTime: number;
    isCompleted: boolean;
}

export interface Quest {
    id: string;
    traderId: string;
    title: string;
    description: string;
    minLevel: number;
    status: 'available' | 'active' | 'completed' | 'claimed' | 'failed' | 'archived';
    objectives: {
        type: 'kill' | 'find' | 'extract' | 'level';
        target: string;
        current: number;
        required: number;
    }[];
    rewards: { roubles?: number; xp?: number; items?: { itemId: string; quantity: number }[] };
}

export interface InsuranceReturn {
    instanceId: string;
    itemId: string;
    returnTime: number;
}

export interface RaidSummary {
    locationId: string;
    isScav: boolean;
    status: 'extracted' | 'killed' | 'mia';
    kills: { enemyId: string; weapon: string; xp: number }[];
    lootValue: number;
    totalXp: number;
    duration: number;
}

// Flea Market Types
export interface FleaMarketListing {
    id: string;
    itemId: string;
    sellerId: string;
    price: number;
    currency: 'roubles' | 'dollars' | 'euros';
    quantity: number;
    listedAt: number;
    expiresAt: number;
    itemInstanceId: string;
}

export interface FleaMarketFilters {
    category?: ItemType;
    minPrice?: number;
    maxPrice?: number;
    onlyFIR?: boolean;
    traderOnly?: boolean;
}

// Scav Karma Types
export type ScavKarmaLevel = -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface WeaponMastery {
    kills: number;
    headshots: number;
    masteryLevel: number; // 1-3
}

export interface GameState {
    version: string;
    lastTick: number;
    skills: Record<SkillType, SkillData>;
    level: number;
    xp: number;
    roubles: number;
    dollars: number;
    euros: number;
    stash: InventoryItem[];
    stashRows: number;
    stashCols: number;
    equipment: {
        head?: string;
        eyes?: string;
        ears?: string;
        bodyArmor?: string;
        rig?: string;
        backpack?: string;
        pouch?: string;
        primary?: string;
        secondary?: string;
        pistol?: string;
        melee?: string;
    };
    hideoutModules: Record<string, HideoutModule>;
    activeCrafts: ActiveCraft[];
    traders: Record<string, Trader>;
    quests: Quest[];
    insuranceReturns: InsuranceReturn[];
    activeRaid: ActiveRaid | null;
    playerStats: PlayerStats;
    scavCooldownEnd?: number;
    lastRaidSummary: RaidSummary | null;
    admin?: AdminState;
    activeEffects: ActiveEffect[];
    weaponMastery: Record<string, WeaponMastery>;
    // New Systems
    detailedBodyParts: DetailedBodyParts;
    bleedingEffects: BleedingEffect[];
    fractures: FractureState[];
    weaponStates: Record<string, WeaponState>;
    stamina: StaminaState;
    weight: WeightState;
    painkillerState: PainkillerState;
    recoilState: RecoilState;
    visorStates: Record<string, VisorState>;
    // Phase 2 Systems
    fleaMarketListings: FleaMarketListing[];
    scavKarma: number;
    secureContainer: string | undefined;
    // New Player Experience
    raidCount?: number; // Total completed raids for new player protection
}

export interface ActiveRaid {
    locationId: string;
    startTime: number;
    elapsedTime: number;
    status: 'searching' | 'combat' | 'looting' | 'extracting';
    currentEncounter?: string | undefined;
    currentEnemy?: { id: string; hp: number; maxHp: number } | undefined;
    lootFound: InventoryItem[];
    raidLogs: string[];
    isScav: boolean;
    kills?: { enemyId: string; weapon: string; xp: number }[] | undefined;
    /** Seed for deterministic RNG during raid */
    seed?: number;
}
