// src/lib/game/items_expansion.ts
// Phase 1: Items Expansion - 200+ new items

import type { Weapon, WeaponMod, Ammo, Armor, Medical, Provision, Barter, Key, NVG, Thermal, MeleeWeapon, Throwable, Headset, SecureContainer } from './types';

// ============================================================================
// PHASE 1.1: WEAPONS (30 new weapons)
// ============================================================================

export const NEW_WEAPONS: Record<string, Weapon> = {
    // === ASSAULT RIFLES (10) ===
    'ak74n': {
        id: 'ak74n',
        name: 'Kalashnikov AK-74N 5.45x39',
        shortName: 'AK-74N',
        description: 'The AK-74N is a modernized version of the AK-74 with a side-folding stock and dovetail mount.',
        type: 'weapon',
        weaponClass: 'ar',
        caliber: '5.45x39',
        width: 4, height: 2,
        baseValue: 38000, weight: 3.5,
        damage: 52, accuracy: 68, ergonomics: 52,
        verticalRecoil: 78, horizontalRecoil: 205, fireRate: 650, effectiveRange: 500
    },
    'ak101': {
        id: 'ak101',
        name: 'Kalashnikov AK-101 5.56x45',
        shortName: 'AK-101',
        description: 'Export version of the AK-74M chambered in 5.56x45 NATO.',
        type: 'weapon',
        weaponClass: 'ar',
        caliber: '5.56x45',
        width: 4, height: 2,
        baseValue: 52000, weight: 3.6,
        damage: 54, accuracy: 70, ergonomics: 55,
        verticalRecoil: 76, horizontalRecoil: 195, fireRate: 600, effectiveRange: 500
    },
    'ak102': {
        id: 'ak102',
        name: 'Kalashnikov AK-102 5.56x45',
        shortName: 'AK-102',
        description: 'Short-barreled export AK chambered in 5.56x45 NATO.',
        type: 'weapon',
        weaponClass: 'ar',
        caliber: '5.56x45',
        width: 3, height: 2,
        baseValue: 48000, weight: 3.2,
        damage: 50, accuracy: 65, ergonomics: 58,
        verticalRecoil: 82, horizontalRecoil: 215, fireRate: 600, effectiveRange: 400
    },
    'ak103': {
        id: 'ak103',
        name: 'Kalashnikov AK-103 7.62x39',
        shortName: 'AK-103',
        description: 'Modernized AK chambered in 7.62x39 with polymer furniture.',
        type: 'weapon',
        weaponClass: 'ar',
        caliber: '7.62x39',
        width: 4, height: 2,
        baseValue: 55000, weight: 3.9,
        damage: 66, accuracy: 69, ergonomics: 52,
        verticalRecoil: 88, horizontalRecoil: 235, fireRate: 600, effectiveRange: 450
    },
    'ak104': {
        id: 'ak104',
        name: 'Kalashnikov AK-104 7.62x39',
        shortName: 'AK-104',
        description: 'Short-barreled version of the AK-103.',
        type: 'weapon',
        weaponClass: 'ar',
        caliber: '7.62x39',
        width: 3, height: 2,
        baseValue: 58000, weight: 3.4,
        damage: 62, accuracy: 64, ergonomics: 56,
        verticalRecoil: 95, horizontalRecoil: 255, fireRate: 600, effectiveRange: 350
    },
    'ak105': {
        id: 'ak105',
        name: 'Kalashnikov AK-105 5.45x39',
        shortName: 'AK-105',
        description: 'Short-barreled AK-74M for special forces.',
        type: 'weapon',
        weaponClass: 'ar',
        caliber: '5.45x39',
        width: 3, height: 2,
        baseValue: 65000, weight: 3.2,
        damage: 48, accuracy: 66, ergonomics: 58,
        verticalRecoil: 85, horizontalRecoil: 225, fireRate: 600, effectiveRange: 400
    },
    'scarl': {
        id: 'scarl',
        name: 'FN SCAR-L 5.56x45',
        shortName: 'SCAR-L',
        description: 'Belgian assault rifle chambered in 5.56x45 NATO.',
        type: 'weapon',
        weaponClass: 'ar',
        caliber: '5.56x45',
        width: 4, height: 2,
        baseValue: 85000, weight: 3.3,
        damage: 56, accuracy: 76, ergonomics: 62,
        verticalRecoil: 72, horizontalRecoil: 175, fireRate: 625, effectiveRange: 550
    },
    'scarh': {
        id: 'scarh',
        name: 'FN SCAR-H 7.62x51',
        shortName: 'SCAR-H',
        description: 'Heavy version of the SCAR chambered in 7.62x51 NATO.',
        type: 'weapon',
        weaponClass: 'ar',
        caliber: '7.62x51',
        width: 4, height: 2,
        baseValue: 120000, weight: 3.7,
        damage: 72, accuracy: 78, ergonomics: 58,
        verticalRecoil: 82, horizontalRecoil: 195, fireRate: 600, effectiveRange: 600
    },
    'mcx': {
        id: 'mcx',
        name: 'SIG MCX .300 Blackout',
        shortName: 'MCX',
        description: 'Modern modular rifle chambered in .300 AAC Blackout.',
        type: 'weapon',
        weaponClass: 'ar',
        caliber: '.300blk',
        width: 3, height: 2,
        baseValue: 95000, weight: 2.9,
        damage: 60, accuracy: 74, ergonomics: 70,
        verticalRecoil: 68, horizontalRecoil: 165, fireRate: 800, effectiveRange: 400
    },
    'rd704': {
        id: 'rd704',
        name: 'Rifle Dynamics RD-704 7.62x39',
        shortName: 'RD-704',
        description: 'Premium American-made AK with enhanced ergonomics.',
        type: 'weapon',
        weaponClass: 'ar',
        caliber: '7.62x39',
        width: 4, height: 2,
        baseValue: 145000, weight: 3.4,
        damage: 66, accuracy: 74, ergonomics: 68,
        verticalRecoil: 75, horizontalRecoil: 195, fireRate: 650, effectiveRange: 450
    },

    // === SMGs (7) ===
    'mpx': {
        id: 'mpx',
        name: 'SIG MPX 9x19',
        shortName: 'MPX',
        description: 'Modern submachine gun with AR-style controls.',
        type: 'weapon',
        weaponClass: 'smg',
        caliber: '9x19',
        width: 3, height: 2,
        baseValue: 68000, weight: 2.7,
        damage: 38, accuracy: 76, ergonomics: 82,
        verticalRecoil: 42, horizontalRecoil: 95, fireRate: 850, effectiveRange: 175
    },
    'pp19': {
        id: 'pp19',
        name: 'PP-19 Vityaz 9x19',
        shortName: 'PP-19',
        description: 'Russian submachine gun based on the AK platform.',
        type: 'weapon',
        weaponClass: 'smg',
        caliber: '9x19',
        width: 3, height: 2,
        baseValue: 32000, weight: 2.9,
        damage: 36, accuracy: 68, ergonomics: 72,
        verticalRecoil: 48, horizontalRecoil: 110, fireRate: 700, effectiveRange: 150
    },
    'ump45': {
        id: 'ump45',
        name: 'HK UMP .45 ACP',
        shortName: 'UMP',
        description: 'German submachine gun chambered in .45 ACP.',
        type: 'weapon',
        weaponClass: 'smg',
        caliber: '.45acp',
        width: 3, height: 2,
        baseValue: 42000, weight: 2.5,
        damage: 52, accuracy: 72, ergonomics: 68,
        verticalRecoil: 55, horizontalRecoil: 125, fireRate: 600, effectiveRange: 125
    },
    'p90': {
        id: 'p90',
        name: 'FN P90 5.7x28',
        shortName: 'P90',
        description: 'Belgian personal defense weapon with top-mounted magazine.',
        type: 'weapon',
        weaponClass: 'smg',
        caliber: '5.7x28',
        width: 3, height: 2,
        baseValue: 110000, weight: 2.6,
        damage: 42, accuracy: 82, ergonomics: 88,
        verticalRecoil: 38, horizontalRecoil: 85, fireRate: 900, effectiveRange: 200
    },
    'mp9': {
        id: 'mp9',
        name: 'B&T MP9 9x19',
        shortName: 'MP9',
        description: 'Compact Swiss submachine gun with extreme rate of fire.',
        type: 'weapon',
        weaponClass: 'smg',
        caliber: '9x19',
        width: 2, height: 2,
        baseValue: 58000, weight: 1.4,
        damage: 36, accuracy: 70, ergonomics: 92,
        verticalRecoil: 45, horizontalRecoil: 105, fireRate: 1100, effectiveRange: 100
    },
    'sr2m': {
        id: 'sr2m',
        name: 'SR-2M Veresk 9x21',
        shortName: 'SR-2M',
        description: 'Russian special forces SMG with high penetration.',
        type: 'weapon',
        weaponClass: 'smg',
        caliber: '9x21',
        width: 3, height: 2,
        baseValue: 88000, weight: 1.9,
        damage: 48, accuracy: 78, ergonomics: 78,
        verticalRecoil: 52, horizontalRecoil: 115, fireRate: 950, effectiveRange: 175
    },
    'ks23': {
        id: 'ks23',
        name: 'KS-23M 23x75mm',
        shortName: 'KS-23M',
        description: 'Soviet pump-action shotgun firing massive 23mm shells.',
        type: 'weapon',
        weaponClass: 'shotgun',
        caliber: '23x75mm',
        width: 4, height: 2,
        baseValue: 65000, weight: 4.2,
        damage: 280, accuracy: 55, ergonomics: 35,
        verticalRecoil: 185, horizontalRecoil: 320, fireRate: 60, effectiveRange: 60
    },

    // === SHOTGUNS (4) ===
    'mp133': {
        id: 'mp133',
        name: 'MP-133 12ga',
        shortName: 'MP-133',
        description: 'Russian pump-action shotgun. Budget-friendly option.',
        type: 'weapon',
        weaponClass: 'shotgun',
        caliber: '12ga',
        width: 4, height: 2,
        baseValue: 18000, weight: 3.2,
        damage: 145, accuracy: 38, ergonomics: 55,
        verticalRecoil: 115, horizontalRecoil: 245, fireRate: 60, effectiveRange: 55
    },
    'm870': {
        id: 'm870',
        name: 'Remington Model 870 12ga',
        shortName: 'M870',
        description: 'Classic American pump-action shotgun.',
        type: 'weapon',
        weaponClass: 'shotgun',
        caliber: '12ga',
        width: 4, height: 2,
        baseValue: 28000, weight: 3.2,
        damage: 148, accuracy: 42, ergonomics: 58,
        verticalRecoil: 110, horizontalRecoil: 235, fireRate: 60, effectiveRange: 60
    },
    'mossberg': {
        id: 'mossberg',
        name: 'Mossberg 590A1 12ga',
        shortName: 'M590A1',
        description: 'Military-grade pump-action shotgun.',
        type: 'weapon',
        weaponClass: 'shotgun',
        caliber: '12ga',
        width: 4, height: 2,
        baseValue: 35000, weight: 3.4,
        damage: 152, accuracy: 45, ergonomics: 60,
        verticalRecoil: 105, horizontalRecoil: 225, fireRate: 60, effectiveRange: 65
    },
    'toz106': {
        id: 'toz106',
        name: 'TOZ-106 20ga',
        shortName: 'TOZ-106',
        description: 'Budget bolt-action shotgun. Perfect for broke scavs.',
        type: 'weapon',
        weaponClass: 'shotgun',
        caliber: '20ga',
        width: 3, height: 2,
        baseValue: 8500, weight: 2.5,
        damage: 125, accuracy: 35, ergonomics: 50,
        verticalRecoil: 95, horizontalRecoil: 205, fireRate: 40, effectiveRange: 45
    },

    // === SNIPER/DMR (5) ===
    'm700': {
        id: 'm700',
        name: 'Remington Model 700 7.62x51',
        shortName: 'M700',
        description: 'Classic American bolt-action sniper rifle.',
        type: 'weapon',
        weaponClass: 'sniper',
        caliber: '7.62x51',
        width: 5, height: 2,
        baseValue: 52000, weight: 4.2,
        damage: 96, accuracy: 90, ergonomics: 40,
        verticalRecoil: 105, horizontalRecoil: 155, fireRate: 40, effectiveRange: 1100
    },
    't5000': {
        id: 't5000',
        name: 'ORSIS T-5000 7.62x51',
        shortName: 'T-5000',
        description: 'Russian precision sniper rifle.',
        type: 'weapon',
        weaponClass: 'sniper',
        caliber: '7.62x51',
        width: 5, height: 2,
        baseValue: 95000, weight: 5.6,
        damage: 94, accuracy: 96, ergonomics: 35,
        verticalRecoil: 98, horizontalRecoil: 145, fireRate: 45, effectiveRange: 1200
    },
    'axmc': {
        id: 'axmc',
        name: 'Accuracy International AXMC .338 Lapua',
        shortName: 'AXMC',
        description: 'British heavy sniper rifle for extreme long-range engagements.',
        type: 'weapon',
        weaponClass: 'sniper',
        caliber: '.338lapua',
        width: 6, height: 2,
        baseValue: 280000, weight: 7.8,
        damage: 165, accuracy: 98, ergonomics: 28,
        verticalRecoil: 165, horizontalRecoil: 195, fireRate: 35, effectiveRange: 1500
    },
    'm1a': {
        id: 'm1a',
        name: 'Springfield M1A 7.62x51',
        shortName: 'M1A',
        description: 'Semi-automatic version of the M14 battle rifle.',
        type: 'weapon',
        weaponClass: 'dmr',
        caliber: '7.62x51',
        width: 5, height: 2,
        baseValue: 68000, weight: 4.8,
        damage: 88, accuracy: 82, ergonomics: 45,
        verticalRecoil: 115, horizontalRecoil: 185, fireRate: 700, effectiveRange: 600
    },
    'rsass': {
        id: 'rsass',
        name: 'Remington R11 RSASS 7.62x51',
        shortName: 'RSASS',
        description: 'Premium semi-automatic sniper system.',
        type: 'weapon',
        weaponClass: 'dmr',
        caliber: '7.62x51',
        width: 5, height: 2,
        baseValue: 185000, weight: 4.5,
        damage: 92, accuracy: 86, ergonomics: 52,
        verticalRecoil: 98, horizontalRecoil: 165, fireRate: 750, effectiveRange: 700
    },

    // === PISTOLS (4) ===
    'grach': {
        id: 'grach',
        name: 'MP-443 Grach 9x19',
        shortName: 'Grach',
        description: 'Modern Russian military pistol.',
        type: 'weapon',
        weaponClass: 'pistol',
        caliber: '9x19',
        width: 2, height: 1,
        baseValue: 12000, weight: 0.95,
        damage: 36, accuracy: 68, ergonomics: 88,
        verticalRecoil: 38, horizontalRecoil: 72, fireRate: 400, effectiveRange: 50
    },
    'usp': {
        id: 'usp',
        name: 'HK USP .45 ACP',
        shortName: 'USP',
        description: 'German combat pistol chambered in .45 ACP.',
        type: 'weapon',
        weaponClass: 'pistol',
        caliber: '.45acp',
        width: 2, height: 1,
        baseValue: 18000, weight: 0.88,
        damage: 52, accuracy: 72, ergonomics: 82,
        verticalRecoil: 45, horizontalRecoil: 85, fireRate: 380, effectiveRange: 50
    },
    'm1911': {
        id: 'm1911',
        name: 'Colt M1911A1 .45 ACP',
        shortName: 'M1911',
        description: 'Classic American pistol. Over a century of service.',
        type: 'weapon',
        weaponClass: 'pistol',
        caliber: '.45acp',
        width: 2, height: 1,
        baseValue: 15000, weight: 1.1,
        damage: 58, accuracy: 68, ergonomics: 80,
        verticalRecoil: 52, horizontalRecoil: 95, fireRate: 350, effectiveRange: 45
    },
    'fiveseven': {
        id: 'fiveseven',
        name: 'FN Five-seveN MK2 5.7x28',
        shortName: 'Five-seveN',
        description: 'Belgian pistol firing armor-piercing 5.7mm rounds.',
        type: 'weapon',
        weaponClass: 'pistol',
        caliber: '5.7x28',
        width: 2, height: 1,
        baseValue: 45000, weight: 0.72,
        damage: 40, accuracy: 78, ergonomics: 92,
        verticalRecoil: 32, horizontalRecoil: 65, fireRate: 450, effectiveRange: 75
    },
};

// ============================================================================
// PHASE 1.2: AMMO TYPES (40 new ammo types)
// ============================================================================

export const NEW_AMMO: Record<string, Ammo> = {
    // === 5.45x39 (add 2) ===
    '545x39-bs': {
        id: '545x39-bs',
        name: '5.45x39mm BS',
        shortName: 'BS',
        description: 'Armor-piercing rounds with steel core.',
        type: 'ammo',
        caliber: '5.45x39',
        penetration: 52, damage: 40, fragmentationChance: 0.10,
        width: 1, height: 1, baseValue: 1800, weight: 0.01, icon: '545bs'
    },
    '545x39-pp': {
        id: '545x39-pp',
        name: '5.45x39mm PP',
        shortName: 'PP',
        description: 'Improved penetration cartridge.',
        type: 'ammo',
        caliber: '5.45x39',
        penetration: 36, damage: 46, fragmentationChance: 0.14,
        width: 1, height: 1, baseValue: 450, weight: 0.01, icon: '545pp'
    },

    // === 5.56x45 (add 3) ===
    '556x45-ss190': {
        id: '556x45-ss190',
        name: '5.56x45mm SS190',
        shortName: 'SS190',
        description: 'FN specialized armor-piercing round.',
        type: 'ammo',
        caliber: '5.56x45',
        penetration: 48, damage: 47, fragmentationChance: 0.12,
        width: 1, height: 1, baseValue: 1400, weight: 0.01, icon: '556ss190'
    },
    '556x45-m856': {
        id: '556x45-m856',
        name: '5.56x45mm M856',
        shortName: 'M856',
        description: 'Standard tracer round.',
        type: 'ammo',
        caliber: '5.56x45',
        penetration: 28, damage: 55, fragmentationChance: 0.22,
        width: 1, height: 1, baseValue: 220, weight: 0.01, icon: '556m856'
    },
    '556x45-mk262': {
        id: '556x45-mk262',
        name: '5.56x45mm MK 262 Mod 1',
        shortName: 'MK262',
        description: 'Special long-range precision round.',
        type: 'ammo',
        caliber: '5.56x45',
        penetration: 38, damage: 58, fragmentationChance: 0.20,
        width: 1, height: 1, baseValue: 850, weight: 0.01, icon: '556mk262'
    },

    // === 7.62x39 (add 2) ===
    '762x39-t45m1': {
        id: '762x39-t45m1',
        name: '7.62x39mm T-45M1',
        shortName: 'T-45M1',
        description: 'Improved tracer round.',
        type: 'ammo',
        caliber: '7.62x39',
        penetration: 34, damage: 62, fragmentationChance: 0.18,
        width: 1, height: 1, baseValue: 320, weight: 0.01, icon: '762t45m1'
    },
    '762x39-maiap': {
        id: '762x39-maiap',
        name: '7.62x39mm MAI AP',
        shortName: 'MAI AP',
        description: 'Advanced armor-piercing 7.62x39.',
        type: 'ammo',
        caliber: '7.62x39',
        penetration: 58, damage: 56, fragmentationChance: 0.08,
        width: 1, height: 1, baseValue: 2800, weight: 0.01, icon: '762maiap'
    },

    // === 7.62x51 (add 3) ===
    '762x51-m993': {
        id: '762x51-m993',
        name: '7.62x51mm M993',
        shortName: 'M993',
        description: 'Tungsten core armor-piercing.',
        type: 'ammo',
        caliber: '7.62x51',
        penetration: 70, damage: 67, fragmentationChance: 0.05,
        width: 1, height: 1, baseValue: 4500, weight: 0.02, icon: '762m993'
    },
    '762x51-ultra': {
        id: '762x51-ultra',
        name: '7.62x51mm Ultra Nosler',
        shortName: 'Ultra Nosler',
        description: 'Premium hunting ammunition.',
        type: 'ammo',
        caliber: '7.62x51',
        penetration: 15, damage: 102, fragmentationChance: 0.45,
        width: 1, height: 1, baseValue: 650, weight: 0.02, icon: '762ultra'
    },
    '762x51-bpz': {
        id: '762x51-bpz',
        name: '7.62x51mm BPZ FMJ',
        shortName: 'BPZ FMJ',
        description: 'Budget full metal jacket.',
        type: 'ammo',
        caliber: '7.62x51',
        penetration: 35, damage: 88, fragmentationChance: 0.20,
        width: 1, height: 1, baseValue: 380, weight: 0.02, icon: '762bpz'
    },

    // === 7.62x54R (add 3) ===
    '762x54r-7n37': {
        id: '762x54r-7n37',
        name: '7.62x54R 7N37',
        shortName: '7N37',
        description: 'Armor-piercing sniper cartridge.',
        type: 'ammo',
        caliber: '7.62x54R',
        penetration: 68, damage: 72, fragmentationChance: 0.06,
        width: 1, height: 1, baseValue: 2800, weight: 0.02, icon: '7627n37'
    },
    '762x54r-7bt1': {
        id: '762x54r-7bt1',
        name: '7.62x54R 7BT1',
        shortName: '7BT1',
        description: 'Armor-piercing incendiary tracer.',
        type: 'ammo',
        caliber: '7.62x54R',
        penetration: 59, damage: 78, fragmentationChance: 0.10,
        width: 1, height: 1, baseValue: 2200, weight: 0.02, icon: '7627bt1'
    },
    '762x54r-7n13': {
        id: '762x54r-7n13',
        name: '7.62x54R 7N13',
        shortName: '7N13',
        description: 'Special armor-piercing round.',
        type: 'ammo',
        caliber: '7.62x54R',
        penetration: 55, damage: 82, fragmentationChance: 0.12,
        width: 1, height: 1, baseValue: 1600, weight: 0.02, icon: '7627n13'
    },

    // === 9x19 (add 2) ===
    '9x19-luger': {
        id: '9x19-luger',
        name: '9x19mm Luger CCI',
        shortName: 'Luger CCI',
        description: 'High-velocity hollow point.',
        type: 'ammo',
        caliber: '9x19',
        penetration: 10, damage: 70, fragmentationChance: 0.35,
        width: 1, height: 1, baseValue: 180, weight: 0.01, icon: '9x19luger'
    },
    '9x19-rip': {
        id: '9x19-rip',
        name: '9x19mm RIP',
        shortName: 'RIP',
        description: 'Radically invasive projectile. Devastating flesh damage.',
        type: 'ammo',
        caliber: '9x19',
        penetration: 2, damage: 102, fragmentationChance: 0.80,
        width: 1, height: 1, baseValue: 450, weight: 0.01, icon: '9x19rip'
    },

    // === 9x18PM (add 2) ===
    '9x18mm-pmm': {
        id: '9x18mm-pmm',
        name: '9x18mm PMM',
        shortName: 'PMM',
        description: 'High-velocity overpressure round.',
        type: 'ammo',
        caliber: '9x18PM',
        penetration: 24, damage: 58, fragmentationChance: 0.15,
        width: 1, height: 1, baseValue: 120, weight: 0.01, icon: '9x18pmm'
    },
    '9x18mm-rg028': {
        id: '9x18mm-rg028',
        name: '9x18mm RG028',
        shortName: 'RG028',
        description: 'Gzh hollow point.',
        type: 'ammo',
        caliber: '9x18PM',
        penetration: 5, damage: 65, fragmentationChance: 0.40,
        width: 1, height: 1, baseValue: 95, weight: 0.01, icon: '9x18rg028'
    },

    // === 9x39 (add 2) ===
    '9x39-bp': {
        id: '9x39-bp',
        name: '9x39mm BP',
        shortName: 'BP',
        description: 'Armor-piercing subsonic.',
        type: 'ammo',
        caliber: '9x39',
        penetration: 60, damage: 60, fragmentationChance: 0.08,
        width: 1, height: 1, baseValue: 3200, weight: 0.02, icon: '9x39bp'
    },
    '9x39-spp': {
        id: '9x39-spp',
        name: '9x39mm SPP',
        shortName: 'SPP',
        description: 'Sniper special purpose.',
        type: 'ammo',
        caliber: '9x39',
        penetration: 50, damage: 64, fragmentationChance: 0.10,
        width: 1, height: 1, baseValue: 2400, weight: 0.02, icon: '9x39spp'
    },

    // === 12ga (add 3) ===
    '12ga-flechette': {
        id: '12ga-flechette',
        name: '12/70 Flechette',
        shortName: 'Flechette',
        description: 'Armor-piercing dart projectiles.',
        type: 'ammo',
        caliber: '12ga',
        penetration: 45, damage: 120, fragmentationChance: 0,
        width: 1, height: 1, baseValue: 850, weight: 0.05, icon: '12gaflechette'
    },
    '12ga-magnum': {
        id: '12ga-magnum',
        name: '12/70 8.5mm Magnum',
        shortName: 'Magnum',
        description: 'High-power buckshot.',
        type: 'ammo',
        caliber: '12ga',
        penetration: 8, damage: 225, fragmentationChance: 0,
        width: 1, height: 1, baseValue: 120, weight: 0.05, icon: '12gamagnum'
    },
    '12ga-7mm': {
        id: '12ga-7mm',
        name: '12/70 7mm Buckshot',
        shortName: '7mm',
        description: 'Standard 7mm buckshot.',
        type: 'ammo',
        caliber: '12ga',
        penetration: 3, damage: 165, fragmentationChance: 0,
        width: 1, height: 1, baseValue: 55, weight: 0.05, icon: '12ga7mm'
    },

    // === 5.7x28 (new caliber, 3 types) ===
    '57x28-ss190': {
        id: '57x28-ss190',
        name: '5.7x28mm SS190',
        shortName: 'SS190',
        description: 'Armor-piercing personal defense round.',
        type: 'ammo',
        caliber: '5.7x28',
        penetration: 35, damage: 49, fragmentationChance: 0.20,
        width: 1, height: 1, baseValue: 650, weight: 0.01, icon: '57ss190'
    },
    '57x28-l191': {
        id: '57x28-l191',
        name: '5.7x28mm L191',
        shortName: 'L191',
        description: 'Tracer variant of SS190.',
        type: 'ammo',
        caliber: '5.7x28',
        penetration: 33, damage: 46, fragmentationChance: 0.22,
        width: 1, height: 1, baseValue: 580, weight: 0.01, icon: '57l191'
    },
    '57x28-sb193': {
        id: '57x28-sb193',
        name: '5.7x28mm SB193',
        shortName: 'SB193',
        description: 'Subsonic hollow point.',
        type: 'ammo',
        caliber: '5.7x28',
        penetration: 15, damage: 67, fragmentationChance: 0.35,
        width: 1, height: 1, baseValue: 450, weight: 0.01, icon: '57sb193'
    },

    // === .300 Blackout (new caliber, 3 types) ===
    '300blk-whisper': {
        id: '300blk-whisper',
        name: '.300 Blackout Whisper',
        shortName: 'Whisper',
        description: 'Subsonic suppressed load.',
        type: 'ammo',
        caliber: '.300blk',
        penetration: 28, damage: 75, fragmentationChance: 0.25,
        width: 1, height: 1, baseValue: 520, weight: 0.01, icon: '300whisper'
    },
    '300blk-ap': {
        id: '300blk-ap',
        name: '.300 Blackout AP',
        shortName: 'AP',
        description: 'Armor-piercing supersonic.',
        type: 'ammo',
        caliber: '.300blk',
        penetration: 45, damage: 62, fragmentationChance: 0.12,
        width: 1, height: 1, baseValue: 1200, weight: 0.01, icon: '300ap'
    },
    '300blk-vmax': {
        id: '300blk-vmax',
        name: '.300 Blackout V-Max',
        shortName: 'V-Max',
        description: 'Hornady V-Max ballistic tip.',
        type: 'ammo',
        caliber: '.300blk',
        penetration: 18, damage: 88, fragmentationChance: 0.50,
        width: 1, height: 1, baseValue: 850, weight: 0.01, icon: '300vmax'
    },

    // === .338 Lapua (new caliber, 3 types) ===
    '338lapua-tacx': {
        id: '338lapua-tacx',
        name: '.338 Lapua Magnum TAC-X',
        shortName: 'TAC-X',
        description: 'Barnes all-copper expanding.',
        type: 'ammo',
        caliber: '.338lapua',
        penetration: 18, damage: 196, fragmentationChance: 0.45,
        width: 1, height: 1, baseValue: 2800, weight: 0.03, icon: '338tacx'
    },
    '338lapua-ap': {
        id: '338lapua-ap',
        name: '.338 Lapua Magnum AP',
        shortName: 'AP',
        description: 'Armor-piercing sniper round.',
        type: 'ammo',
        caliber: '.338lapua',
        penetration: 85, damage: 142, fragmentationChance: 0.05,
        width: 1, height: 1, baseValue: 8500, weight: 0.03, icon: '338ap'
    },
    '338lapua-fmj': {
        id: '338lapua-fmj',
        name: '.338 Lapua Magnum FMJ',
        shortName: 'FMJ',
        description: 'Standard full metal jacket.',
        type: 'ammo',
        caliber: '.338lapua',
        penetration: 42, damage: 182, fragmentationChance: 0.15,
        width: 1, height: 1, baseValue: 1800, weight: 0.03, icon: '338fmj'
    },

    // === .45 ACP (new caliber, 3 types) ===
    '45acp-acp': {
        id: '45acp-acp',
        name: '.45 ACP Match',
        shortName: 'Match',
        description: 'Standard match-grade round.',
        type: 'ammo',
        caliber: '.45acp',
        penetration: 19, damage: 72, fragmentationChance: 0.20,
        width: 1, height: 1, baseValue: 145, weight: 0.01, icon: '45match'
    },
    '45acp-p': {
        id: '45acp-p',
        name: '.45 ACP +P',
        shortName: '+P',
        description: 'Overpressure hollow point.',
        type: 'ammo',
        caliber: '.45acp',
        penetration: 12, damage: 88, fragmentationChance: 0.40,
        width: 1, height: 1, baseValue: 280, weight: 0.01, icon: '45p'
    },
    '45acp-rip': {
        id: '45acp-rip',
        name: '.45 ACP RIP',
        shortName: 'RIP',
        description: 'Radically invasive projectile.',
        type: 'ammo',
        caliber: '.45acp',
        penetration: 3, damage: 145, fragmentationChance: 0.85,
        width: 1, height: 1, baseValue: 680, weight: 0.01, icon: '45rip'
    },

    // === 9x21 (new caliber, 2 types) ===
    '9x21-ps': {
        id: '9x21-ps',
        name: '9x21mm PS',
        shortName: 'PS',
        description: 'Standard armor-piercing.',
        type: 'ammo',
        caliber: '9x21',
        penetration: 38, damage: 55, fragmentationChance: 0.15,
        width: 1, height: 1, baseValue: 380, weight: 0.01, icon: '9x21ps'
    },
    '9x21-pst': {
        id: '9x21-pst',
        name: '9x21mm Pst',
        shortName: 'Pst',
        description: 'Standard pistol cartridge.',
        type: 'ammo',
        caliber: '9x21',
        penetration: 28, damage: 62, fragmentationChance: 0.22,
        width: 1, height: 1, baseValue: 280, weight: 0.01, icon: '9x21pst'
    },

    // === 20ga (new caliber, 2 types) ===
    '20ga-75mm': {
        id: '20ga-75mm',
        name: '20/70 7.5mm Buckshot',
        shortName: '7.5mm',
        description: 'Standard 20 gauge buckshot.',
        type: 'ammo',
        caliber: '20ga',
        penetration: 2, damage: 125, fragmentationChance: 0,
        width: 1, height: 1, baseValue: 35, weight: 0.04, icon: '20ga75'
    },
    '20ga-62mm': {
        id: '20ga-62mm',
        name: '20/70 6.2mm Buckshot',
        shortName: '6.2mm',
        description: 'Smaller pellet buckshot.',
        type: 'ammo',
        caliber: '20ga',
        penetration: 4, damage: 115, fragmentationChance: 0,
        width: 1, height: 1, baseValue: 42, weight: 0.04, icon: '20ga62'
    },

    // === 23x75mm (new caliber, 3 types) ===
    '23x75-barricade': {
        id: '23x75-barricade',
        name: '23x75mm Barricade',
        shortName: 'Barricade',
        description: 'Solid steel slug for breaching.',
        type: 'ammo',
        caliber: '23x75mm',
        penetration: 65, damage: 195, fragmentationChance: 0.05,
        width: 1, height: 1, baseValue: 850, weight: 0.08, icon: '23barricade'
    },
    '23x75-shrapnel': {
        id: '23x75-shrapnel',
        name: '23x75mm Shrapnel',
        shortName: 'Shrapnel',
        description: 'Fragmentation round.',
        type: 'ammo',
        caliber: '23x75mm',
        penetration: 12, damage: 280, fragmentationChance: 0.30,
        width: 1, height: 1, baseValue: 680, weight: 0.08, icon: '23shrapnel'
    },
    '23x75-zvezda': {
        id: '23x75-zvezda',
        name: '23x75mm Zvezda',
        shortName: 'Zvezda',
        description: 'Flashbang round.',
        type: 'ammo',
        caliber: '23x75mm',
        penetration: 0, damage: 0, fragmentationChance: 0,
        width: 1, height: 1, baseValue: 420, weight: 0.08, icon: '23zvezda'
    },
};

// ============================================================================
// PHASE 1.3: WEAPON MODS (50 new mods)
// ============================================================================

export const NEW_MODS: Record<string, WeaponMod> = {
    // === SCOPES (15) ===
    'scope-hamr': {
        id: 'scope-hamr',
        name: 'Leupold Mark 4 HAMR',
        shortName: 'HAMR',
        description: 'Hybrid AR mount with 4x scope and DeltaPoint reflex.',
        type: 'mod',
        slotType: 'optics',
        width: 2, height: 1,
        baseValue: 65000, weight: 0.35,
        icon: 'hamr',
        modifiers: { accuracy: 18, ergonomics: -6 }
    },
    'scope-bravo4': {
        id: 'scope-bravo4',
        name: 'SIG Sauer BRAVO4',
        shortName: 'BRAVO4',
        description: '4x30mm wide field battle sight.',
        type: 'mod',
        slotType: 'optics',
        width: 2, height: 1,
        baseValue: 58000, weight: 0.45,
        icon: 'bravo4',
        modifiers: { accuracy: 16, ergonomics: -5 }
    },
    'scope-vudu': {
        id: 'scope-vudu',
        name: 'EOTech Vudu 1-6x24',
        shortName: 'Vudu',
        description: 'Premium 1-6x variable scope.',
        type: 'mod',
        slotType: 'optics',
        width: 2, height: 1,
        baseValue: 85000, weight: 0.55,
        icon: 'vudu',
        modifiers: { accuracy: 22, ergonomics: -8 }
    },
    'scope-razor': {
        id: 'scope-razor',
        name: 'Vortex Razor HD Gen.2',
        shortName: 'Razor HD',
        description: '1-6x24mm premium LPVO.',
        type: 'mod',
        slotType: 'optics',
        width: 2, height: 1,
        baseValue: 120000, weight: 0.62,
        icon: 'razor',
        modifiers: { accuracy: 24, ergonomics: -9 }
    },
    'scope-atacr': {
        id: 'scope-atacr',
        name: 'Nightforce ATACR 7-35x56',
        shortName: 'ATACR',
        description: 'Elite long-range sniper scope.',
        type: 'mod',
        slotType: 'optics',
        width: 2, height: 1,
        baseValue: 180000, weight: 0.95,
        icon: 'atacr',
        modifiers: { accuracy: 35, ergonomics: -15 }
    },
    'scope-march': {
        id: 'scope-march',
        name: 'March Tactical 3-24x42',
        shortName: 'March',
        description: 'High-end tactical scope.',
        type: 'mod',
        slotType: 'optics',
        width: 2, height: 1,
        baseValue: 145000, weight: 0.78,
        icon: 'march',
        modifiers: { accuracy: 30, ergonomics: -12 }
    },
    'scope-monstrum': {
        id: 'scope-monstrum',
        name: 'Monstrum Tactical Compact Scope',
        shortName: 'Monstrum',
        description: 'Budget 2-7x scope.',
        type: 'mod',
        slotType: 'optics',
        width: 2, height: 1,
        baseValue: 18000, weight: 0.55,
        icon: 'monstrum',
        modifiers: { accuracy: 12, ergonomics: -6 }
    },
    'scope-walther': {
        id: 'scope-walther',
        name: 'Walther MRS',
        shortName: 'MRS',
        description: 'Micro reflex sight.',
        type: 'mod',
        slotType: 'optics',
        width: 1, height: 1,
        baseValue: 15000, weight: 0.12,
        icon: 'walther',
        modifiers: { accuracy: 10, ergonomics: -2 }
    },
    'scope-pilad': {
        id: 'scope-pilad',
        name: 'VOMZ Pilad P1x42',
        shortName: 'Pilad',
        description: 'Russian reflex sight.',
        type: 'mod',
        slotType: 'optics',
        width: 1, height: 1,
        baseValue: 12000, weight: 0.15,
        icon: 'pilad',
        modifiers: { accuracy: 9, ergonomics: -2 }
    },
    'scope-pk06': {
        id: 'scope-pk06',
        name: 'BelOMO PK-06',
        shortName: 'PK-06',
        description: 'Compact Russian reflex sight.',
        type: 'mod',
        slotType: 'optics',
        width: 1, height: 1,
        baseValue: 22000, weight: 0.13,
        icon: 'pk06',
        modifiers: { accuracy: 11, ergonomics: -1 }
    },
    'scope-uh1': {
        id: 'scope-uh1',
        name: 'Vortex Razor AMG UH-1',
        shortName: 'UH-1',
        description: 'Holographic sight.',
        type: 'mod',
        slotType: 'optics',
        width: 1, height: 1,
        baseValue: 38000, weight: 0.32,
        icon: 'uh1',
        modifiers: { accuracy: 14, ergonomics: -3 }
    },
    'scope-m4': {
        id: 'scope-m4',
        name: 'Aimpoint Micro T-1',
        shortName: 'T-1',
        description: 'Compact red dot sight.',
        type: 'mod',
        slotType: 'optics',
        width: 1, height: 1,
        baseValue: 42000, weight: 0.09,
        icon: 't1',
        modifiers: { accuracy: 12, ergonomics: -1 }
    },
    'scope-compact2': {
        id: 'scope-compact2',
        name: 'Aimpoint CompM4',
        shortName: 'CompM4',
        description: 'Military-grade red dot.',
        type: 'mod',
        slotType: 'optics',
        width: 1, height: 1,
        baseValue: 48000, weight: 0.25,
        icon: 'compm4',
        modifiers: { accuracy: 13, ergonomics: -2 }
    },
    'scope-trijicon': {
        id: 'scope-trijicon',
        name: 'Trijicon ACOG TA11D',
        shortName: 'ACOG',
        description: '3.5x35mm fiber optic scope.',
        type: 'mod',
        slotType: 'optics',
        width: 2, height: 1,
        baseValue: 72000, weight: 0.45,
        icon: 'acog',
        modifiers: { accuracy: 19, ergonomics: -5 }
    },
    'scope-elcan': {
        id: 'scope-elcan',
        name: 'Elcan SpecterDR 1x/4x',
        shortName: 'SpecterDR',
        description: 'Dual role 1x/4x scope.',
        type: 'mod',
        slotType: 'optics',
        width: 2, height: 1,
        baseValue: 95000, weight: 0.65,
        icon: 'elcan',
        modifiers: { accuracy: 20, ergonomics: -6 }
    },

    // === SUPPRESSORS (10) ===
    'suppressor-socom': {
        id: 'suppressor-socom',
        name: 'Surefire SOCOM556-RC2',
        shortName: 'SOCOM',
        description: 'Premium 5.56 suppressor.',
        type: 'mod',
        slotType: 'muzzle',
        width: 2, height: 1,
        baseValue: 75000, weight: 0.52,
        icon: 'socom',
        modifiers: { accuracy: 5, ergonomics: -14, verticalRecoil: -6, horizontalRecoil: -4 }
    },
    'suppressor-sandman': {
        id: 'suppressor-sandman',
        name: 'Dead Air Sandman-S',
        shortName: 'Sandman',
        description: '7.62 quick-detach suppressor.',
        type: 'mod',
        slotType: 'muzzle',
        width: 2, height: 1,
        baseValue: 82000, weight: 0.58,
        icon: 'sandman',
        modifiers: { accuracy: 4, ergonomics: -16, verticalRecoil: -7, horizontalRecoil: -3 }
    },
    'suppressor-omega': {
        id: 'suppressor-omega',
        name: 'SilencerCo Omega 300',
        shortName: 'Omega',
        description: 'Multi-caliber suppressor.',
        type: 'mod',
        slotType: 'muzzle',
        width: 2, height: 1,
        baseValue: 88000, weight: 0.48,
        icon: 'omega',
        modifiers: { accuracy: 5, ergonomics: -13, verticalRecoil: -5, horizontalRecoil: -3 }
    },
    'suppressor-tbac': {
        id: 'suppressor-tbac',
        name: 'Thunder Beast Ultra 5',
        shortName: 'TBAC',
        description: 'Lightweight precision suppressor.',
        type: 'mod',
        slotType: 'muzzle',
        width: 2, height: 1,
        baseValue: 95000, weight: 0.42,
        icon: 'tbac',
        modifiers: { accuracy: 6, ergonomics: -11, verticalRecoil: -4, horizontalRecoil: -2 }
    },
    'suppressor-gemtech': {
        id: 'suppressor-gemtech',
        name: 'Gemtech ONE',
        shortName: 'ONE',
        description: '7.62 direct thread suppressor.',
        type: 'mod',
        slotType: 'muzzle',
        width: 2, height: 1,
        baseValue: 68000, weight: 0.55,
        icon: 'gemtech',
        modifiers: { accuracy: 4, ergonomics: -15, verticalRecoil: -5, horizontalRecoil: -3 }
    },
    'suppressor-sdn6': {
        id: 'suppressor-sdn6',
        name: 'AAC 762-SDN-6',
        shortName: 'SDN-6',
        description: 'Quick-detach 7.62 suppressor.',
        type: 'mod',
        slotType: 'muzzle',
        width: 2, height: 1,
        baseValue: 72000, weight: 0.62,
        icon: 'sdn6',
        modifiers: { accuracy: 4, ergonomics: -17, verticalRecoil: -6, horizontalRecoil: -3 }
    },
    'suppressor-warden': {
        id: 'suppressor-warden',
        name: 'Surefire Warden',
        shortName: 'Warden',
        description: 'Blast diffuser.',
        type: 'mod',
        slotType: 'muzzle',
        width: 1, height: 1,
        baseValue: 28000, weight: 0.22,
        icon: 'warden',
        modifiers: { accuracy: 2, ergonomics: -5, verticalRecoil: -2, horizontalRecoil: -1 }
    },
    'suppressor-qdc': {
        id: 'suppressor-qdc',
        name: 'KAC QDC 5.56',
        shortName: 'QDC',
        description: 'Knight\'s Armament suppressor.',
        type: 'mod',
        slotType: 'muzzle',
        width: 2, height: 1,
        baseValue: 85000, weight: 0.48,
        icon: 'qdc',
        modifiers: { accuracy: 5, ergonomics: -13, verticalRecoil: -5, horizontalRecoil: -4 }
    },
    'suppressor-rotor43': {
        id: 'suppressor-rotor43',
        name: 'Rotor 43 7.62x39',
        shortName: 'Rotor 43',
        description: 'Russian AK suppressor.',
        type: 'mod',
        slotType: 'muzzle',
        width: 2, height: 1,
        baseValue: 45000, weight: 0.58,
        icon: 'rotor43',
        modifiers: { accuracy: 3, ergonomics: -12, verticalRecoil: -4, horizontalRecoil: -2 }
    },
    'suppressor-tgpa': {
        id: 'suppressor-tgpa',
        name: 'TGP-A 5.45x39',
        shortName: 'TGP-A',
        description: 'Russian military suppressor.',
        type: 'mod',
        slotType: 'muzzle',
        width: 2, height: 1,
        baseValue: 38000, weight: 0.55,
        icon: 'tgpa',
        modifiers: { accuracy: 3, ergonomics: -10, verticalRecoil: -4, horizontalRecoil: -2 }
    },

    // === GRIPS (10) ===
    'grip-rk0': {
        id: 'grip-rk0',
        name: 'Zenit RK-0 Foregrip',
        shortName: 'RK-0',
        description: 'Compact vertical grip.',
        type: 'mod',
        slotType: 'foregrip',
        width: 1, height: 1,
        baseValue: 8500, weight: 0.10,
        icon: 'rk0',
        modifiers: { ergonomics: 3, verticalRecoil: -6, horizontalRecoil: -3 }
    },
    'grip-rk1': {
        id: 'grip-rk1',
        name: 'Zenit RK-1 Foregrip',
        shortName: 'RK-1',
        description: 'B25U angled grip.',
        type: 'mod',
        slotType: 'foregrip',
        width: 1, height: 1,
        baseValue: 12000, weight: 0.12,
        icon: 'rk1',
        modifiers: { ergonomics: 4, verticalRecoil: -7, horizontalRecoil: -4 }
    },
    'grip-rk5': {
        id: 'grip-rk5',
        name: 'Zenit RK-5 Foregrip',
        shortName: 'RK-5',
        description: 'Short vertical grip.',
        type: 'mod',
        slotType: 'foregrip',
        width: 1, height: 1,
        baseValue: 9500, weight: 0.08,
        icon: 'rk5',
        modifiers: { ergonomics: 4, verticalRecoil: -5, horizontalRecoil: -2 }
    },
    'grip-rk6': {
        id: 'grip-rk6',
        name: 'Zenit RK-6 Foregrip',
        shortName: 'RK-6',
        description: 'Micro vertical grip.',
        type: 'mod',
        slotType: 'foregrip',
        width: 1, height: 1,
        baseValue: 7800, weight: 0.06,
        icon: 'rk6',
        modifiers: { ergonomics: 5, verticalRecoil: -4, horizontalRecoil: -2 }
    },
    'grip-se5': {
        id: 'grip-se5',
        name: 'Stark SE-5 Express',
        shortName: 'SE-5',
        description: 'Angled foregrip.',
        type: 'mod',
        slotType: 'foregrip',
        width: 1, height: 1,
        baseValue: 15000, weight: 0.11,
        icon: 'se5',
        modifiers: { ergonomics: 6, verticalRecoil: -6, horizontalRecoil: -3 }
    },
    'grip-b25u': {
        id: 'grip-b25u',
        name: 'Zenit B-25U RK-1',
        shortName: 'B-25U',
        description: 'Aim mount with foregrip.',
        type: 'mod',
        slotType: 'foregrip',
        width: 1, height: 1,
        baseValue: 18000, weight: 0.15,
        icon: 'b25u',
        modifiers: { ergonomics: 2, verticalRecoil: -8, horizontalRecoil: -5 }
    },
    'grip-mlokafg': {
        id: 'grip-mlokafg',
        name: 'Magpul M-LOK AFG',
        shortName: 'AFG',
        description: 'Angled foregrip for M-LOK.',
        type: 'mod',
        slotType: 'foregrip',
        width: 1, height: 1,
        baseValue: 11000, weight: 0.09,
        icon: 'mlokafg',
        modifiers: { ergonomics: 6, verticalRecoil: -5, horizontalRecoil: -3 }
    },
    'grip-td': {
        id: 'grip-td',
        name: 'TangoDown Stubby',
        shortName: 'TD Stubby',
        description: 'Compact vertical grip.',
        type: 'mod',
        slotType: 'foregrip',
        width: 1, height: 1,
        baseValue: 13500, weight: 0.10,
        icon: 'td',
        modifiers: { ergonomics: 4, verticalRecoil: -6, horizontalRecoil: -3 }
    },
    'grip-uspalm': {
        id: 'grip-uspalm',
        name: 'US Palm AK Battle Grip',
        shortName: 'US Palm',
        description: 'Ergonomic AK pistol grip.',
        type: 'mod',
        slotType: 'foregrip',
        width: 1, height: 1,
        baseValue: 9500, weight: 0.09,
        icon: 'uspalm',
        modifiers: { ergonomics: 10, verticalRecoil: -1, horizontalRecoil: -1 }
    },
    'grip-stark': {
        id: 'grip-stark',
        name: 'Stark SE-5 Pistol Grip',
        shortName: 'Stark',
        description: 'AR-15 pistol grip.',
        type: 'mod',
        slotType: 'foregrip',
        width: 1, height: 1,
        baseValue: 8500, weight: 0.08,
        icon: 'stark',
        modifiers: { ergonomics: 9, verticalRecoil: -1, horizontalRecoil: -1 }
    },

    // === STOCKS (10) ===
    'stock-ubr': {
        id: 'stock-ubr',
        name: 'Magpul UBR Gen.2',
        shortName: 'UBR',
        description: 'Utility battle rifle stock.',
        type: 'mod',
        slotType: 'stock',
        width: 2, height: 1,
        baseValue: 35000, weight: 0.48,
        icon: 'ubr',
        modifiers: { ergonomics: 10, verticalRecoil: -10, horizontalRecoil: -6 }
    },
    'stock-prs': {
        id: 'stock-prs',
        name: 'Magpul PRS Gen.3',
        shortName: 'PRS',
        description: 'Precision rifle stock.',
        type: 'mod',
        slotType: 'stock',
        width: 2, height: 1,
        baseValue: 42000, weight: 0.62,
        icon: 'prs',
        modifiers: { ergonomics: 8, verticalRecoil: -12, horizontalRecoil: -8 }
    },
    'stock-emod': {
        id: 'stock-emod',
        name: 'Vltor EMOD',
        shortName: 'EMOD',
        description: 'Enhanced modular stock.',
        type: 'mod',
        slotType: 'stock',
        width: 2, height: 1,
        baseValue: 28000, weight: 0.42,
        icon: 'emod',
        modifiers: { ergonomics: 9, verticalRecoil: -7, horizontalRecoil: -4 }
    },
    'stock-glcore': {
        id: 'stock-glcore',
        name: 'FAB Defense GL-Core',
        shortName: 'GL-Core',
        description: 'Tactical stock.',
        type: 'mod',
        slotType: 'stock',
        width: 2, height: 1,
        baseValue: 22000, weight: 0.35,
        icon: 'glcore',
        modifiers: { ergonomics: 8, verticalRecoil: -6, horizontalRecoil: -4 }
    },
    'stock-mft': {
        id: 'stock-mft',
        name: 'MFT Minimalist',
        shortName: 'MFT',
        description: 'Lightweight fixed stock.',
        type: 'mod',
        slotType: 'stock',
        width: 2, height: 1,
        baseValue: 18000, weight: 0.28,
        icon: 'mft',
        modifiers: { ergonomics: 7, verticalRecoil: -5, horizontalRecoil: -3 }
    },
    'stock-archangel': {
        id: 'stock-archangel',
        name: 'Archangel OPFOR',
        shortName: 'Archangel',
        description: 'Mosin aftermarket stock.',
        type: 'mod',
        slotType: 'stock',
        width: 2, height: 1,
        baseValue: 32000, weight: 0.85,
        icon: 'archangel',
        modifiers: { ergonomics: 12, verticalRecoil: -9, horizontalRecoil: -6 }
    },
    'stock-pt1': {
        id: 'stock-pt1',
        name: 'Zenit PT-1',
        shortName: 'PT-1',
        description: 'AK folding stock.',
        type: 'mod',
        slotType: 'stock',
        width: 2, height: 1,
        baseValue: 28000, weight: 0.38,
        icon: 'pt1',
        modifiers: { ergonomics: 9, verticalRecoil: -8, horizontalRecoil: -5 }
    },
    'stock-pt3': {
        id: 'stock-pt3',
        name: 'Zenit PT-3',
        shortName: 'PT-3',
        description: 'Enhanced AK stock.',
        type: 'mod',
        slotType: 'stock',
        width: 2, height: 1,
        baseValue: 32000, weight: 0.42,
        icon: 'pt3',
        modifiers: { ergonomics: 10, verticalRecoil: -9, horizontalRecoil: -5 }
    },
    'stock-pt74s': {
        id: 'stock-pt74s',
        name: 'Zenit PT-74S',
        shortName: 'PT-74S',
        description: 'Metal AK stock.',
        type: 'mod',
        slotType: 'stock',
        width: 2, height: 1,
        baseValue: 35000, weight: 0.48,
        icon: 'pt74s',
        modifiers: { ergonomics: 7, verticalRecoil: -10, horizontalRecoil: -6 }
    },
    'stock-buffertube': {
        id: 'stock-buffertube',
        name: 'Mil-Spec Buffer Tube',
        shortName: 'Buffer Tube',
        description: 'AR-15 receiver extension.',
        type: 'mod',
        slotType: 'stock',
        width: 2, height: 1,
        baseValue: 8500, weight: 0.22,
        icon: 'buffer',
        modifiers: { ergonomics: 2, verticalRecoil: -2, horizontalRecoil: -1 }
    },

    // === MUZZLE DEVICES (10) ===
    'muzzle-warcomp': {
        id: 'muzzle-warcomp',
        name: 'Surefire Warcomp',
        shortName: 'Warcomp',
        description: 'Flash hider/compensator hybrid.',
        type: 'mod',
        slotType: 'muzzle',
        width: 1, height: 1,
        baseValue: 18000, weight: 0.08,
        icon: 'warcomp',
        modifiers: { accuracy: 2, ergonomics: -2, verticalRecoil: -4, horizontalRecoil: -2 }
    },
    'muzzle-bcm': {
        id: 'muzzle-bcm',
        name: 'BCM Mod 0 Compensator',
        shortName: 'BCM',
        description: 'Muzzle climb compensator.',
        type: 'mod',
        slotType: 'muzzle',
        width: 1, height: 1,
        baseValue: 15000, weight: 0.07,
        icon: 'bcm',
        modifiers: { accuracy: 1, ergonomics: -2, verticalRecoil: -5, horizontalRecoil: -2 }
    },
    'muzzle-lantac': {
        id: 'muzzle-lantac',
        name: 'Lantac Dragon',
        shortName: 'Dragon',
        description: 'Aggressive muzzle brake.',
        type: 'mod',
        slotType: 'muzzle',
        width: 1, height: 1,
        baseValue: 22000, weight: 0.09,
        icon: 'lantac',
        modifiers: { accuracy: 2, ergonomics: -3, verticalRecoil: -7, horizontalRecoil: -3 }
    },
    'muzzle-keymo': {
        id: 'muzzle-keymo',
        name: 'Dead Air Keymo',
        shortName: 'Keymo',
        description: 'QD mount and muzzle brake.',
        type: 'mod',
        slotType: 'muzzle',
        width: 1, height: 1,
        baseValue: 18000, weight: 0.08,
        icon: 'keymo',
        modifiers: { accuracy: 1, ergonomics: -2, verticalRecoil: -4, horizontalRecoil: -2 }
    },
    'muzzle-cherrybomb': {
        id: 'muzzle-cherrybomb',
        name: 'Q Cherry Bomb',
        shortName: 'Cherry Bomb',
        description: 'Compact muzzle brake.',
        type: 'mod',
        slotType: 'muzzle',
        width: 1, height: 1,
        baseValue: 12000, weight: 0.06,
        icon: 'cherrybomb',
        modifiers: { accuracy: 1, ergonomics: -1, verticalRecoil: -3, horizontalRecoil: -1 }
    },
    'muzzle-mams': {
        id: 'muzzle-mams',
        name: 'KAC MAMS',
        shortName: 'MAMS',
        description: 'Multi-axis muzzle stability.',
        type: 'mod',
        slotType: 'muzzle',
        width: 1, height: 1,
        baseValue: 28000, weight: 0.10,
        icon: 'mams',
        modifiers: { accuracy: 3, ergonomics: -3, verticalRecoil: -6, horizontalRecoil: -4 }
    },
    'muzzle-ferfrans': {
        id: 'muzzle-ferfrans',
        name: 'Ferfrans CQB Muzzle Brake',
        shortName: 'Ferfrans',
        description: 'CQB optimized brake.',
        type: 'mod',
        slotType: 'muzzle',
        width: 1, height: 1,
        baseValue: 18000, weight: 0.08,
        icon: 'ferfrans',
        modifiers: { accuracy: 2, ergonomics: -2, verticalRecoil: -5, horizontalRecoil: -3 }
    },
    'muzzle-srvv': {
        id: 'muzzle-srvv',
        name: 'SRVV Jet AK Brake',
        shortName: 'SRVV',
        description: 'Russian AK muzzle brake.',
        type: 'mod',
        slotType: 'muzzle',
        width: 1, height: 1,
        baseValue: 12000, weight: 0.09,
        icon: 'srvv',
        modifiers: { accuracy: 1, ergonomics: -2, verticalRecoil: -6, horizontalRecoil: -3 }
    },
    'muzzle-bulletec': {
        id: 'muzzle-bulletec',
        name: 'Bulletec ST-6012',
        shortName: 'Bulletec',
        description: 'Multi-chamber brake.',
        type: 'mod',
        slotType: 'muzzle',
        width: 1, height: 1,
        baseValue: 15000, weight: 0.08,
        icon: 'bulletec',
        modifiers: { accuracy: 2, ergonomics: -2, verticalRecoil: -5, horizontalRecoil: -2 }
    },
    'muzzle-jp': {
        id: 'muzzle-jp',
        name: 'JP Enterprises Compensator',
        shortName: 'JP',
        description: 'Competition compensator.',
        type: 'mod',
        slotType: 'muzzle',
        width: 1, height: 1,
        baseValue: 22000, weight: 0.09,
        icon: 'jp',
        modifiers: { accuracy: 3, ergonomics: -2, verticalRecoil: -7, horizontalRecoil: -3 }
    },

    // === MAGAZINES (10) ===
    'mag-pmag20': {
        id: 'mag-pmag20',
        name: 'PMAG 20 GEN M3',
        shortName: 'PMAG 20',
        description: '20-round 5.56 magazine.',
        type: 'mod',
        slotType: 'magazine',
        width: 1, height: 2,
        baseValue: 5500, weight: 0.18,
        icon: 'pmag20',
        modifiers: { ergonomics: 2 }
    },
    'mag-pmag40': {
        id: 'mag-pmag40',
        name: 'PMAG 40 GEN M3',
        shortName: 'PMAG 40',
        description: '40-round 5.56 magazine.',
        type: 'mod',
        slotType: 'magazine',
        width: 1, height: 2,
        baseValue: 12000, weight: 0.28,
        icon: 'pmag40',
        modifiers: { ergonomics: -4 }
    },
    'mag-surefire100': {
        id: 'mag-surefire100',
        name: 'Surefire MAG5-100',
        shortName: 'SF 100rd',
        description: 'Quad-stack 100-round magazine.',
        type: 'mod',
        slotType: 'magazine',
        width: 2, height: 2,
        baseValue: 85000, weight: 0.65,
        icon: 'surefire100',
        modifiers: { ergonomics: -22 }
    },
    'mag-ak103': {
        id: 'mag-ak103',
        name: 'AK-103 7.62 30rd',
        shortName: 'AK-103 Mag',
        description: '30-round 7.62x39 magazine.',
        type: 'mod',
        slotType: 'magazine',
        width: 1, height: 2,
        baseValue: 4500, weight: 0.22,
        icon: 'ak103mag',
        modifiers: { ergonomics: 1 }
    },
    'mag-ak74-45': {
        id: 'mag-ak74-45',
        name: 'AK-74 5.45 45rd',
        shortName: 'AK-74 45rd',
        description: 'Extended 5.45 magazine.',
        type: 'mod',
        slotType: 'magazine',
        width: 1, height: 2,
        baseValue: 8500, weight: 0.32,
        icon: 'ak7445',
        modifiers: { ergonomics: -5 }
    },
    'mag-rpk95': {
        id: 'mag-rpk95',
        name: 'RPK-16 95rd Drum',
        shortName: 'RPK Drum',
        description: '95-round 5.45 drum magazine.',
        type: 'mod',
        slotType: 'magazine',
        width: 2, height: 2,
        baseValue: 65000, weight: 0.85,
        icon: 'rpk95',
        modifiers: { ergonomics: -25 }
    },
    'mag-glock33': {
        id: 'mag-glock33',
        name: 'Glock 9mm 33rd',
        shortName: 'Glock 33rd',
        description: 'Extended stick magazine.',
        type: 'mod',
        slotType: 'magazine',
        width: 1, height: 2,
        baseValue: 6500, weight: 0.18,
        icon: 'glock33',
        modifiers: { ergonomics: -3 }
    },
    'mag-mp550': {
        id: 'mag-mp550',
        name: 'MP5 50rd Drum',
        shortName: 'MP5 Drum',
        description: '50-round 9mm drum.',
        type: 'mod',
        slotType: 'magazine',
        width: 2, height: 1,
        baseValue: 28000, weight: 0.45,
        icon: 'mp5drum',
        modifiers: { ergonomics: -12 }
    },
    'mag-surefire60': {
        id: 'mag-surefire60',
        name: 'Surefire MAG5-60',
        shortName: 'SF 60rd',
        description: 'Quad-stack 60-round magazine.',
        type: 'mod',
        slotType: 'magazine',
        width: 2, height: 1,
        baseValue: 42000, weight: 0.42,
        icon: 'surefire60',
        modifiers: { ergonomics: -14 }
    },
    'mag-pmag762': {
        id: 'mag-pmag762',
        name: 'PMAG SR/LR GEN M3',
        shortName: 'PMAG 7.62',
        description: '25-round 7.62x51 magazine.',
        type: 'mod',
        slotType: 'magazine',
        width: 1, height: 2,
        baseValue: 12000, weight: 0.28,
        icon: 'pmag762',
        modifiers: { ergonomics: -2 }
    },
};

// ============================================================================
// PHASE 1.4: ARMOR & HELMETS (15 new items)
// ============================================================================

export const NEW_ARMOR: Record<string, Armor> = {
    // === BODY ARMOR (8) ===
    '6b5-16': {
        id: '6b5-16',
        name: '6B5-16 Zh-86 Uley',
        shortName: '6B5-16',
        description: 'Soviet assault vest with integrated armor.',
        type: 'armor',
        armorClass: 2, maxDurability: 45, material: 'Aramid', protectionZones: ['Thorax', 'Stomach'],
        width: 3, height: 3, baseValue: 28000, weight: 4.2, icon: '6b516'
    },
    'gzhel-k': {
        id: 'gzhel-k',
        name: 'BNTI Gzhel-K Armor',
        shortName: 'Gzhel-K',
        description: 'High-mobility ceramic armor.',
        type: 'armor',
        armorClass: 4, maxDurability: 80, material: 'Ceramic', protectionZones: ['Thorax', 'Stomach'],
        width: 3, height: 3, baseValue: 110000, weight: 6.8, icon: 'gzhel'
    },
    'trooper-tfo': {
        id: 'trooper-tfo',
        name: 'Trooper TFO Body Armor',
        shortName: 'Trooper TFO',
        description: 'Lightweight tactical vest.',
        type: 'armor',
        armorClass: 4, maxDurability: 70, material: 'Combined', protectionZones: ['Thorax', 'Stomach'],
        width: 2, height: 3, baseValue: 95000, weight: 5.5, icon: 'troopertfo'
    },
    'defender2': {
        id: 'defender2',
        name: 'FORT Defender-2',
        shortName: 'Defender-2',
        description: 'Russian heavy body armor.',
        type: 'armor',
        armorClass: 5, maxDurability: 105, material: 'Ceramic', protectionZones: ['Thorax', 'Stomach'],
        width: 3, height: 3, baseValue: 165000, weight: 11.5, icon: 'defender2'
    },
    'redut-m': {
        id: 'redut-m',
        name: 'FORT Redut-M Body Armor',
        shortName: 'Redut-M',
        description: 'Modernized assault armor.',
        type: 'armor',
        armorClass: 5, maxDurability: 95, material: 'Combined', protectionZones: ['Thorax', 'Stomach'],
        width: 3, height: 3, baseValue: 145000, weight: 10.2, icon: 'redut'
    },
    '6b45': {
        id: '6b45',
        name: '6B45 Ratnik',
        shortName: '6B45',
        description: 'Ratnik heavy assault armor.',
        type: 'armor',
        armorClass: 5, maxDurability: 100, material: 'Ceramic', protectionZones: ['Thorax', 'Stomach', 'Arms'],
        width: 3, height: 3, baseValue: 175000, weight: 11.8, icon: '6b45'
    },
    'osprey': {
        id: 'osprey',
        name: 'Osprey MK4A Body Armor',
        shortName: 'Osprey MK4A',
        description: 'British military plate carrier.',
        type: 'armor',
        armorClass: 6, maxDurability: 115, material: 'Ceramic', protectionZones: ['Thorax', 'Stomach', 'Arms'],
        width: 3, height: 4, baseValue: 280000, weight: 14.5, icon: 'osprey'
    },
    'zhuk-6a': {
        id: 'zhuk-6a',
        name: 'Zhuk-6a Heavy Armor',
        shortName: 'Zhuk-6a',
        description: 'Heavy ceramic assault armor.',
        type: 'armor',
        armorClass: 6, maxDurability: 125, material: 'Ceramic', protectionZones: ['Thorax', 'Stomach', 'Arms', 'Legs'],
        width: 4, height: 4, baseValue: 320000, weight: 16.2, icon: 'zhuk'
    },

    // === HELMETS (7) ===
    'ulach': {
        id: 'ulach',
        name: 'MSA ACH TC-2001 MICH Series',
        shortName: 'ULACH',
        description: 'Modern ballistic helmet with visor capability.',
        type: 'helmet',
        armorClass: 4, maxDurability: 70, material: 'Combined', protectionZones: ['Head'],
        width: 2, height: 2, baseValue: 125000, weight: 1.45, icon: 'ulach'
    },
    'airframe': {
        id: 'airframe',
        name: 'Crye Precision AirFrame',
        shortName: 'AirFrame',
        description: 'Lightweight modular helmet.',
        type: 'helmet',
        armorClass: 4, maxDurability: 65, material: 'Combined', protectionZones: ['Head'],
        width: 2, height: 2, baseValue: 135000, weight: 1.25, icon: 'airframe'
    },
    'tc2002': {
        id: 'tc2002',
        name: 'MSA Gallet TC 800 High Cut',
        shortName: 'TC-2002',
        description: 'High-cut tactical helmet.',
        type: 'helmet',
        armorClass: 4, maxDurability: 68, material: 'Combined', protectionZones: ['Head'],
        width: 2, height: 2, baseValue: 110000, weight: 1.35, icon: 'tc2002'
    },
    'exfil': {
        id: 'exfil',
        name: 'Team Wendy EXFIL Ballistic Helmet',
        shortName: 'EXFIL',
        description: 'Premium ballistic helmet with ear protection.',
        type: 'helmet',
        armorClass: 4, maxDurability: 72, material: 'Combined', protectionZones: ['Head', 'Ears'],
        width: 2, height: 2, baseValue: 145000, weight: 1.15, icon: 'exfil'
    },
    'crye-airframe': {
        id: 'crye-airframe',
        name: 'Crye Precision AirFrame Tan',
        shortName: 'AirFrame Tan',
        description: 'Tan variant AirFrame.',
        type: 'helmet',
        armorClass: 4, maxDurability: 65, material: 'Combined', protectionZones: ['Head'],
        width: 2, height: 2, baseValue: 140000, weight: 1.25, icon: 'airframetan'
    },
    'teamwendy': {
        id: 'teamwendy',
        name: 'Team Wendy EXFIL Carbon',
        shortName: 'EXFIL Carbon',
        description: 'Carbon bump helmet with NVG mount.',
        type: 'helmet',
        armorClass: 1, maxDurability: 30, material: 'Combined', protectionZones: ['Head'],
        width: 2, height: 2, baseValue: 45000, weight: 0.55, icon: 'wendycarbon'
    },
    'bastion': {
        id: 'bastion',
        name: 'Bastion Helmet',
        shortName: 'Bastion',
        description: 'Modern Russian helmet.',
        type: 'helmet',
        armorClass: 4, maxDurability: 60, material: 'Combined', protectionZones: ['Head'],
        width: 2, height: 2, baseValue: 95000, weight: 1.3, icon: 'bastion'
    },
};

// ============================================================================
// PHASE 1.5: MEDICAL ITEMS (10 new items)
// ============================================================================

export const NEW_MEDICAL: Record<string, Medical> = {
    // === STIMULANTS (5) ===
    'sj6': {
        id: 'sj6',
        name: 'SJ6 Combat Stimulant',
        shortName: 'SJ6',
        description: 'Increases movement speed temporarily.',
        type: 'medical',
        useTime: 2, maxUses: 1,
        width: 1, height: 1, baseValue: 68000, weight: 0.05, icon: 'sj6'
    },
    'propital': {
        id: 'propital',
        name: 'Propital',
        shortName: 'Propital',
        description: 'Regenerative stimulant. Heals over time.',
        type: 'medical',
        useTime: 2, maxUses: 1,
        width: 1, height: 1, baseValue: 52000, weight: 0.05, icon: 'propital'
    },
    'etg-c': {
        id: 'etg-c',
        name: 'ETG-C Combat Stimulant',
        shortName: 'ETG-C',
        description: 'Combat performance enhancer.',
        type: 'medical',
        useTime: 2, maxUses: 1,
        width: 1, height: 1, baseValue: 75000, weight: 0.05, icon: 'etgc'
    },
    'mule': {
        id: 'mule',
        name: 'M.U.L.E. Stimulator',
        shortName: 'MULE',
        description: 'Increases carrying capacity.',
        type: 'medical',
        useTime: 2, maxUses: 1,
        width: 1, height: 1, baseValue: 58000, weight: 0.05, icon: 'mule'
    },
    'zagustin': {
        id: 'zagustin',
        name: 'Zagustin Hemostatic Drug',
        shortName: 'Zagustin',
        description: 'Prevents bleeding temporarily.',
        type: 'medical',
        useTime: 2, maxUses: 1,
        width: 1, height: 1, baseValue: 45000, weight: 0.05, icon: 'zagustin'
    },

    // === MEDICAL SUPPLIES (5) ===
    'goldenstar': {
        id: 'goldenstar',
        name: 'Golden Star Balm',
        shortName: 'Golden Star',
        description: 'Vietnamese balm. Pain relief.',
        type: 'medical',
        useTime: 3, maxUses: 10,
        width: 1, height: 1, baseValue: 8500, weight: 0.08, icon: 'goldenstar'
    },
    'vaseline': {
        id: 'vaseline',
        name: 'Vaseline',
        shortName: 'Vaseline',
        description: 'Petroleum jelly. Prevents skin irritation.',
        type: 'medical',
        useTime: 4, maxUses: 5,
        width: 1, height: 1, baseValue: 6500, weight: 0.06, icon: 'vaseline'
    },
    'ibuprofen': {
        id: 'ibuprofen',
        name: 'Ibuprofen Painkillers',
        shortName: 'Ibuprofen',
        description: 'NSAID pain reliever.',
        type: 'medical',
        useTime: 2, maxUses: 1,
        width: 1, height: 1, baseValue: 12000, weight: 0.05, icon: 'ibuprofen'
    },
    'augmentin': {
        id: 'augmentin',
        name: 'Augmentin Antibiotics',
        shortName: 'Augmentin',
        description: 'Broad-spectrum antibiotics.',
        type: 'medical',
        useTime: 3, maxUses: 1,
        width: 1, height: 1, baseValue: 15000, weight: 0.05, icon: 'augmentin'
    },
    'etgchange': {
        id: 'etgchange',
        name: 'eTG-Change Regenerative',
        shortName: 'eTG-Change',
        description: 'Advanced regenerative stimulant.',
        type: 'medical',
        useTime: 3, maxUses: 1,
        width: 1, height: 1, baseValue: 88000, weight: 0.05, icon: 'etgchange'
    },
};

// ============================================================================
// PHASE 1.6: PROVISIONS (15 new items)
// ============================================================================

export const NEW_PROVISIONS: Record<string, Provision> = {
    // === FOOD (8) ===
    'mre': {
        id: 'mre',
        name: 'MRE',
        shortName: 'MRE',
        description: 'Meal, Ready-to-Eat.',
        type: 'food',
        energyBonus: 55, hydrationBonus: -8,
        width: 1, height: 2, baseValue: 15000, weight: 0.8, icon: 'mre'
    },
    'crackers': {
        id: 'crackers',
        name: 'Crackers',
        shortName: 'Crackers',
        description: 'Army crackers.',
        type: 'food',
        energyBonus: 25, hydrationBonus: -5,
        width: 1, height: 1, baseValue: 3500, weight: 0.2, icon: 'crackers'
    },
    'sugar': {
        id: 'sugar',
        name: 'Pack of Sugar',
        shortName: 'Sugar',
        description: 'White sugar.',
        type: 'food',
        energyBonus: 35, hydrationBonus: -10,
        width: 1, height: 1, baseValue: 12500, weight: 0.5, icon: 'sugar'
    },
    'chocolate': {
        id: 'chocolate',
        name: 'Alyonka Chocolate Bar',
        shortName: 'Chocolate',
        description: 'Russian milk chocolate.',
        type: 'food',
        energyBonus: 20, hydrationBonus: -2,
        width: 1, height: 1, baseValue: 8500, weight: 0.1, icon: 'chocolate'
    },
    'slickers': {
        id: 'slickers',
        name: 'Slickers Bar',
        shortName: 'Slickers',
        description: 'Energy bar.',
        type: 'food',
        energyBonus: 30, hydrationBonus: 0,
        width: 1, height: 1, baseValue: 6500, weight: 0.08, icon: 'slickers'
    },
    'iskra': {
        id: 'iskra',
        name: 'Iskra Lunchbox',
        shortName: 'Iskra',
        description: 'Soviet field ration.',
        type: 'food',
        energyBonus: 50, hydrationBonus: -5,
        width: 2, height: 1, baseValue: 18000, weight: 0.6, icon: 'iskra'
    },
    'emelya': {
        id: 'emelya',
        name: 'Emelya Rye Croutons',
        shortName: 'Emelya',
        description: 'Russian croutons.',
        type: 'food',
        energyBonus: 15, hydrationBonus: -8,
        width: 1, height: 1, baseValue: 2800, weight: 0.1, icon: 'emelya'
    },
    'beefstew': {
        id: 'beefstew',
        name: 'Can of Beef Stew',
        shortName: 'Beef Stew',
        description: 'Canned beef stew.',
        type: 'food',
        energyBonus: 45, hydrationBonus: 5,
        width: 1, height: 1, baseValue: 9500, weight: 0.45, icon: 'beefstew'
    },

    // === DRINKS (5) ===
    'applejuice': {
        id: 'applejuice',
        name: 'Apple Juice',
        shortName: 'Apple Juice',
        description: 'Boxed apple juice.',
        type: 'drink',
        energyBonus: 5, hydrationBonus: 40,
        width: 1, height: 2, baseValue: 4500, weight: 0.5, icon: 'applejuice'
    },
    'pineapplejuice': {
        id: 'pineapplejuice',
        name: 'Pineapple Juice',
        shortName: 'Pineapple',
        description: 'Tropical pineapple juice.',
        type: 'drink',
        energyBonus: 8, hydrationBonus: 45,
        width: 1, height: 2, baseValue: 5500, weight: 0.5, icon: 'pineapple'
    },
    'vitajuice': {
        id: 'vitajuice',
        name: 'Vita Juice',
        shortName: 'Vita',
        description: 'Multivitamin drink.',
        type: 'drink',
        energyBonus: 10, hydrationBonus: 35,
        width: 1, height: 2, baseValue: 3800, weight: 0.45, icon: 'vita'
    },
    'maxenergy': {
        id: 'maxenergy',
        name: 'Max Energy Drink',
        shortName: 'Max Energy',
        description: 'Energy drink.',
        type: 'drink',
        energyBonus: 12, hydrationBonus: 30,
        width: 1, height: 1, baseValue: 6500, weight: 0.35, icon: 'maxenergy'
    },
    'tarcola': {
        id: 'tarcola',
        name: 'TarCola',
        shortName: 'TarCola',
        description: 'Tarkov cola.',
        type: 'drink',
        energyBonus: 8, hydrationBonus: 32,
        width: 1, height: 1, baseValue: 4200, weight: 0.35, icon: 'tarcola'
    },

    // === ALCOHOL (2) ===
    'vodka': {
        id: 'vodka',
        name: 'Bottle of Vodka',
        shortName: 'Vodka',
        description: 'Russian standard vodka.',
        type: 'drink',
        energyBonus: 10, hydrationBonus: 15,
        width: 1, height: 2, baseValue: 12000, weight: 0.9, icon: 'vodka'
    },
    'whiskey': {
        id: 'whiskey',
        name: 'Bottle of Whiskey',
        shortName: 'Whiskey',
        description: 'Scotch whiskey.',
        type: 'drink',
        energyBonus: 12, hydrationBonus: 12,
        width: 1, height: 2, baseValue: 18000, weight: 0.85, icon: 'whiskey'
    },
};

// ============================================================================
// PHASE 1.7: BARTER ITEMS (50 new items)
// ============================================================================

export const NEW_BARTER: Record<string, Barter> = {
    // === ELECTRONICS (10) ===
    'gpu': {
        id: 'gpu',
        name: 'Graphics Card',
        shortName: 'GPU',
        description: 'High-performance graphics processing unit.',
        type: 'barter',
        width: 2, height: 1, baseValue: 850000, weight: 0.85, icon: 'gpu'
    },
    'cpufan': {
        id: 'cpufan',
        name: 'CPU Fan',
        shortName: 'CPU Fan',
        description: 'Cooling fan for processors.',
        type: 'barter',
        width: 1, height: 1, baseValue: 45000, weight: 0.25, icon: 'cpufan'
    },
    'ram': {
        id: 'ram',
        name: 'RAM',
        shortName: 'RAM',
        description: 'DDR memory module.',
        type: 'barter',
        width: 1, height: 1, baseValue: 68000, weight: 0.05, icon: 'ram'
    },
    'ledx': {
        id: 'ledx',
        name: 'LEDX Skin Transilluminator',
        shortName: 'LEDX',
        description: 'Medical vein finder.',
        type: 'barter',
        width: 1, height: 1, baseValue: 1250000, weight: 0.4, icon: 'ledx'
    },
    'defib': {
        id: 'defib',
        name: 'Portable Defibrillator',
        shortName: 'Defib',
        description: 'Emergency cardiac device.',
        type: 'barter',
        width: 1, height: 2, baseValue: 950000, weight: 1.2, icon: 'defib'
    },
    'psu': {
        id: 'psu',
        name: 'Power Supply Unit',
        shortName: 'PSU',
        description: 'Computer power supply.',
        type: 'barter',
        width: 2, height: 1, baseValue: 22000, weight: 1.8, icon: 'psu'
    },
    'pcb': {
        id: 'pcb',
        name: 'Printed Circuit Board',
        shortName: 'PCB',
        description: 'Electronic circuit board.',
        type: 'barter',
        width: 1, height: 1, baseValue: 18000, weight: 0.1, icon: 'pcb'
    },
    'ssd': {
        id: 'ssd',
        name: 'SSD Drive',
        shortName: 'SSD',
        description: 'Solid state drive.',
        type: 'barter',
        width: 1, height: 1, baseValue: 55000, weight: 0.08, icon: 'ssd'
    },
    'gphone': {
        id: 'gphone',
        name: 'Broken GPhone X',
        shortName: 'GPhone',
        description: 'Damaged smartphone.',
        type: 'barter',
        width: 1, height: 1, baseValue: 95000, weight: 0.2, icon: 'gphone'
    },
    'sas': {
        id: 'sas',
        name: 'SAS Drive',
        shortName: 'SAS',
        description: 'Enterprise hard drive.',
        type: 'barter',
        width: 2, height: 1, baseValue: 75000, weight: 0.65, icon: 'sas'
    },

    // === TOOLS (10) ===
    'screwdriver': {
        id: 'screwdriver',
        name: 'Flat Screwdriver',
        shortName: 'Screwdriver',
        description: 'Basic hand tool.',
        type: 'barter',
        width: 1, height: 2, baseValue: 8500, weight: 0.15, icon: 'screwdriver'
    },
    'wrench': {
        id: 'wrench',
        name: 'Wrench',
        shortName: 'Wrench',
        description: 'Adjustable wrench.',
        type: 'barter',
        width: 1, height: 1, baseValue: 6500, weight: 0.25, icon: 'wrench'
    },
    'pliers': {
        id: 'pliers',
        name: 'Pliers',
        shortName: 'Pliers',
        description: 'Combination pliers.',
        type: 'barter',
        width: 1, height: 1, baseValue: 5500, weight: 0.2, icon: 'pliers'
    },
    'drill': {
        id: 'drill',
        name: 'Electric Drill',
        shortName: 'Drill',
        description: 'Cordless power drill.',
        type: 'barter',
        width: 2, height: 1, baseValue: 45000, weight: 1.2, icon: 'drill'
    },
    'sledgehammer': {
        id: 'sledgehammer',
        name: 'Sledgehammer',
        shortName: 'Sledge',
        description: 'Heavy duty hammer.',
        type: 'barter',
        width: 2, height: 2, baseValue: 28000, weight: 4.5, icon: 'sledge'
    },
    'ratchet': {
        id: 'ratchet',
        name: 'Ratchet Wrench',
        shortName: 'Ratchet',
        description: 'Socket wrench set.',
        type: 'barter',
        width: 1, height: 2, baseValue: 18000, weight: 0.45, icon: 'ratchet'
    },
    'nippers': {
        id: 'nippers',
        name: 'Nippers',
        shortName: 'Nippers',
        description: 'Diagonal cutters.',
        type: 'barter',
        width: 1, height: 1, baseValue: 4500, weight: 0.12, icon: 'nippers'
    },
    'wd40-small': {
        id: 'wd40-small',
        name: 'WD-40 100ml',
        shortName: 'WD-40',
        description: 'Lubricant spray.',
        type: 'barter',
        width: 1, height: 1, baseValue: 12000, weight: 0.15, icon: 'wd40'
    },
    'toolset': {
        id: 'toolset',
        name: 'Toolset',
        shortName: 'Toolset',
        description: 'Basic mechanic tools.',
        type: 'barter',
        width: 2, height: 2, baseValue: 68000, weight: 3.5, icon: 'toolset'
    },
    'metalspare': {
        id: 'metalspare',
        name: 'Metal Spare Parts',
        shortName: 'Metal Parts',
        description: 'Assorted metal components.',
        type: 'barter',
        width: 2, height: 1, baseValue: 8500, weight: 1.2, icon: 'metalspare'
    },

    // === VALUABLES (10) ===
    'lion': {
        id: 'lion',
        name: 'Bronze Lion',
        shortName: 'Lion',
        description: 'Antique lion figurine.',
        type: 'barter',
        width: 2, height: 2, baseValue: 158000, weight: 2.5, icon: 'lion'
    },
    'cat': {
        id: 'cat',
        name: 'Cat Figurine',
        shortName: 'Cat',
        description: 'Porcelain cat statue.',
        type: 'barter',
        width: 1, height: 2, baseValue: 58000, weight: 0.8, icon: 'cat'
    },
    'horse': {
        id: 'horse',
        name: 'Horse Figurine',
        shortName: 'Horse',
        description: 'Porcelain horse statue.',
        type: 'barter',
        width: 2, height: 1, baseValue: 42000, weight: 0.9, icon: 'horse'
    },
    'bronzelion': {
        id: 'bronzelion',
        name: 'Bronze Lion Figurine',
        shortName: 'Br. Lion',
        description: 'Decorative bronze statue.',
        type: 'barter',
        width: 1, height: 1, baseValue: 85000, weight: 1.2, icon: 'bronzelion'
    },
    'skullring': {
        id: 'skullring',
        name: 'Gold Skull Ring',
        shortName: 'Skull Ring',
        description: 'Macabre jewelry.',
        type: 'barter',
        width: 1, height: 1, baseValue: 125000, weight: 0.05, icon: 'skullring'
    },
    'rolers': {
        id: 'rolers',
        name: 'Roler Submariner Gold',
        shortName: 'Roler',
        description: 'Luxury wristwatch.',
        type: 'barter',
        width: 1, height: 1, baseValue: 78000, weight: 0.1, icon: 'roler'
    },
    'goldtt': {
        id: 'goldtt',
        name: 'Golden TT Pistol',
        shortName: 'Golden TT',
        description: 'Golden-plated TT.',
        type: 'barter',
        width: 2, height: 1, baseValue: 145000, weight: 0.95, icon: 'goldtt'
    },
    'bitcoin': {
        id: 'bitcoin',
        name: 'Physical Bitcoin',
        shortName: 'Bitcoin',
        description: '0.2 BTC physical coin.',
        type: 'barter',
        width: 1, height: 1, baseValue: 950000, weight: 0.05, icon: 'bitcoin'
    },
    'gpcoin': {
        id: 'gpcoin',
        name: 'GP Coin',
        shortName: 'GP Coin',
        description: 'Tarkov cryptocurrency.',
        type: 'barter',
        width: 1, height: 1, baseValue: 28000, weight: 0.02, icon: 'gpcoin'
    },
    'prokill': {
        id: 'prokill',
        name: 'Prokill Medallion',
        shortName: 'Prokill',
        description: 'PMC trophy medallion.',
        type: 'barter',
        width: 1, height: 1, baseValue: 125000, weight: 0.15, icon: 'prokill'
    },

    // === MEDICAL SUPPLIES (5) ===
    'peroxide': {
        id: 'peroxide',
        name: 'Hydrogen Peroxide',
        shortName: 'Peroxide',
        description: 'Medical antiseptic.',
        type: 'barter',
        width: 1, height: 2, baseValue: 8500, weight: 0.5, icon: 'peroxide'
    },
    'saline': {
        id: 'saline',
        name: 'Saline Solution',
        shortName: 'Saline',
        description: 'Sterile salt solution.',
        type: 'barter',
        width: 1, height: 2, baseValue: 12000, weight: 0.6, icon: 'saline'
    },
    'bloodset': {
        id: 'bloodset',
        name: 'Medical Bloodset',
        shortName: 'Bloodset',
        description: 'IV transfusion kit.',
        type: 'barter',
        width: 1, height: 1, baseValue: 28000, weight: 0.4, icon: 'bloodset'
    },
    'syringe': {
        id: 'syringe',
        name: 'Disposable Syringe',
        shortName: 'Syringe',
        description: 'Single-use syringe.',
        type: 'barter',
        width: 1, height: 1, baseValue: 9500, weight: 0.02, icon: 'syringe'
    },
    'vaseline-bar': {
        id: 'vaseline-bar',
        name: 'Vaseline',
        shortName: 'Vaseline',
        description: 'Petroleum jelly bar.',
        type: 'barter',
        width: 1, height: 1, baseValue: 6800, weight: 0.08, icon: 'vaseline'
    },

    // === BUILDING MATERIALS (10) ===
    'plywood': {
        id: 'plywood',
        name: 'Plywood',
        shortName: 'Plywood',
        description: 'Construction plywood sheets.',
        type: 'barter',
        width: 2, height: 1, baseValue: 8500, weight: 1.5, icon: 'plywood'
    },
    'nuts': {
        id: 'nuts',
        name: 'Screw Nuts',
        shortName: 'Nuts',
        description: 'Assorted screw nuts.',
        type: 'barter',
        width: 1, height: 1, baseValue: 4500, weight: 0.15, icon: 'nuts'
    },
    'bolts': {
        id: 'bolts',
        name: 'Bolts',
        shortName: 'Bolts',
        description: 'Assorted bolts.',
        type: 'barter',
        width: 1, height: 1, baseValue: 5500, weight: 0.2, icon: 'bolts'
    },
    'ducttape': {
        id: 'ducttape',
        name: 'Duct Tape',
        shortName: 'Duct Tape',
        description: 'Universal repair tape.',
        type: 'barter',
        width: 1, height: 1, baseValue: 6800, weight: 0.25, icon: 'ducttape'
    },
    'insulatingtape': {
        id: 'insulatingtape',
        name: 'Insulating Tape',
        shortName: 'Ins. Tape',
        description: 'Electrical tape.',
        type: 'barter',
        width: 1, height: 1, baseValue: 5500, weight: 0.1, icon: 'insulating'
    },
    'wd40-400': {
        id: 'wd40-400',
        name: 'WD-40 400ml',
        shortName: 'WD-40 400',
        description: 'Large lubricant can.',
        type: 'barter',
        width: 1, height: 2, baseValue: 28000, weight: 0.45, icon: 'wd40'
    },
    'clin': {
        id: 'clin',
        name: 'Clin Wiper',
        shortName: 'Clin',
        description: 'Glass cleaner.',
        type: 'barter',
        width: 1, height: 2, baseValue: 9500, weight: 0.5, icon: 'clin'
    },
    'nails-pack': {
        id: 'nails-pack',
        name: 'Pack of Nails',
        shortName: 'Nails',
        description: 'Construction nails.',
        type: 'barter',
        width: 1, height: 1, baseValue: 8500, weight: 0.5, icon: 'nails'
    },
    'screws-pack': {
        id: 'screws-pack',
        name: 'Pack of Screws',
        shortName: 'Screws',
        description: 'Construction screws.',
        type: 'barter',
        width: 1, height: 1, baseValue: 9500, weight: 0.4, icon: 'screws'
    },
    'hose': {
        id: 'hose',
        name: 'Corrugated Hose',
        shortName: 'Hose',
        description: 'Flexible tubing.',
        type: 'barter',
        width: 1, height: 2, baseValue: 18500, weight: 0.8, icon: 'hose'
    },

    // === HOUSEHOLD (5) ===
    'matches': {
        id: 'matches',
        name: 'Classic Matches',
        shortName: 'Matches',
        description: 'Safety matches.',
        type: 'barter',
        width: 1, height: 1, baseValue: 1500, weight: 0.02, icon: 'matches'
    },
    'hunting-matches': {
        id: 'hunting-matches',
        name: 'Hunting Matches',
        shortName: 'Hunt. Matches',
        description: 'Waterproof matches.',
        type: 'barter',
        width: 1, height: 1, baseValue: 4500, weight: 0.02, icon: 'huntmatches'
    },
    'zibbo': {
        id: 'zibbo',
        name: 'Zibbo Lighter',
        shortName: 'Zibbo',
        description: 'Butane lighter.',
        type: 'barter',
        width: 1, height: 1, baseValue: 8500, weight: 0.05, icon: 'zibbo'
    },
    'cigarettes': {
        id: 'cigarettes',
        name: 'Cigarettes',
        shortName: 'Cigs',
        description: 'Pack of smokes.',
        type: 'barter',
        width: 1, height: 1, baseValue: 12500, weight: 0.05, icon: 'cigarettes'
    },
    'soap': {
        id: 'soap',
        name: 'Soap',
        shortName: 'Soap',
        description: 'Toilet soap bar.',
        type: 'barter',
        width: 1, height: 1, baseValue: 3500, weight: 0.1, icon: 'soap'
    },
};

// ============================================================================
// PHASE 1.8: KEYS (20 new keys)
// ============================================================================

export const NEW_KEYS: Record<string, Key> = {
    // === CUSTOMS KEYS (5) ===
    'factory-key': {
        id: 'factory-key',
        name: 'Factory Exit Key',
        shortName: 'Factory',
        description: 'Key to Factory emergency exits.',
        type: 'key',
        width: 1, height: 1, baseValue: 95000, weight: 0.01, icon: 'key'
    },
    'machinery-key': {
        id: 'machinery-key',
        name: 'Machinery Key',
        shortName: 'Machinery',
        description: 'Key to Customs machinery room.',
        type: 'key',
        width: 1, height: 1, baseValue: 45000, weight: 0.01, icon: 'key'
    },
    'customs-office': {
        id: 'customs-office',
        name: 'Customs Office Key',
        shortName: 'Office',
        description: 'Key to Customs administration office.',
        type: 'key',
        width: 1, height: 1, baseValue: 120000, weight: 0.01, icon: 'key'
    },
    'gas-station': {
        id: 'gas-station',
        name: 'Gas Station Storage Key',
        shortName: 'Gas Stor.',
        description: 'Key to Customs gas station storage.',
        type: 'key',
        width: 1, height: 1, baseValue: 68000, weight: 0.01, icon: 'key'
    },
    'dorms-110': {
        id: 'dorms-110',
        name: 'Dorms Room 110 Key',
        shortName: 'Dorms 110',
        description: 'Key to Customs dorms room 110.',
        type: 'key',
        width: 1, height: 1, baseValue: 55000, weight: 0.01, icon: 'key'
    },

    // === RESERVE KEYS (5) ===
    'rb-ak': {
        id: 'rb-ak',
        name: 'RB-AK Key',
        shortName: 'RB-AK',
        description: 'Key to Reserve armory.',
        type: 'key',
        width: 1, height: 1, baseValue: 125000, weight: 0.01, icon: 'key'
    },
    'rb-am': {
        id: 'rb-am',
        name: 'RB-AM Key',
        shortName: 'RB-AM',
        description: 'Key to Reserve medical storage.',
        type: 'key',
        width: 1, height: 1, baseValue: 165000, weight: 0.01, icon: 'key'
    },
    'rb-bk': {
        id: 'rb-bk',
        name: 'RB-BK Key',
        shortName: 'RB-BK',
        description: 'Key to Reserve barracks.',
        type: 'key',
        width: 1, height: 1, baseValue: 95000, weight: 0.01, icon: 'key'
    },
    'rb-gn': {
        id: 'rb-gn',
        name: 'RB-GN Key',
        shortName: 'RB-GN',
        description: 'Key to Reserve generator room.',
        type: 'key',
        width: 1, height: 1, baseValue: 85000, weight: 0.01, icon: 'key'
    },
    'rb-kprl': {
        id: 'rb-kprl',
        name: 'RB-KPRL Key',
        shortName: 'RB-KPRL',
        description: 'Key to Reserve underground.',
        type: 'key',
        width: 1, height: 1, baseValue: 285000, weight: 0.01, icon: 'key'
    },

    // === SHORELINE KEYS (5) ===
    'san-306': {
        id: 'san-306',
        name: 'Sanatorium 306 Key',
        shortName: 'San. 306',
        description: 'Key to Shoreline east wing room 306.',
        type: 'key',
        width: 1, height: 1, baseValue: 145000, weight: 0.01, icon: 'key'
    },
    'san-314': {
        id: 'san-314',
        name: 'Sanatorium 314 Key',
        shortName: 'San. 314',
        description: 'Key to Shoreline east wing room 314.',
        type: 'key',
        width: 1, height: 1, baseValue: 185000, weight: 0.01, icon: 'key'
    },
    'san-328': {
        id: 'san-328',
        name: 'Sanatorium 328 Key',
        shortName: 'San. 328',
        description: 'Key to Shoreline east wing room 328.',
        type: 'key',
        width: 1, height: 1, baseValue: 225000, weight: 0.01, icon: 'key'
    },
    'west-306': {
        id: 'west-306',
        name: 'West Wing 306 Key',
        shortName: 'W. 306',
        description: 'Key to Shoreline west wing room 306.',
        type: 'key',
        width: 1, height: 1, baseValue: 135000, weight: 0.01, icon: 'key'
    },
    'east-310': {
        id: 'east-310',
        name: 'East Wing 310 Key',
        shortName: 'E. 310',
        description: 'Key to Shoreline east wing room 310.',
        type: 'key',
        width: 1, height: 1, baseValue: 115000, weight: 0.01, icon: 'key'
    },

    // === INTERCHANGE KEYS (3) ===
    'emercom': {
        id: 'emercom',
        name: 'EMERCOM Medical Key',
        shortName: 'EMERCOM',
        description: 'Key to Interchange medical storage.',
        type: 'key',
        width: 1, height: 1, baseValue: 195000, weight: 0.01, icon: 'key'
    },
    'kiba-inner': {
        id: 'kiba-inner',
        name: 'KIBA Inner Grate Key',
        shortName: 'KIBA Inner',
        description: 'Key to KIBA store inner gate.',
        type: 'key',
        width: 1, height: 1, baseValue: 285000, weight: 0.01, icon: 'key'
    },
    'kiba-outer': {
        id: 'kiba-outer',
        name: 'KIBA Outer Door Key',
        shortName: 'KIBA Outer',
        description: 'Key to KIBA store outer door.',
        type: 'key',
        width: 1, height: 1, baseValue: 255000, weight: 0.01, icon: 'key'
    },

    // === LABS KEYS (2) ===
    'labs-manager': {
        id: 'labs-manager',
        name: 'Labs Manager Office',
        shortName: 'Manager',
        description: 'Key to Labs manager office.',
        type: 'key',
        width: 1, height: 1, baseValue: 385000, weight: 0.01, icon: 'key'
    },
    'labs-arsenal': {
        id: 'labs-arsenal',
        name: 'Labs Arsenal Storage',
        shortName: 'Arsenal',
        description: 'Key to Labs weapon storage.',
        type: 'key',
        width: 1, height: 1, baseValue: 485000, weight: 0.01, icon: 'key'
    },
};

// ============================================================================
// PHASE 2.1: NVGs AND THERMALS
// ============================================================================

export const PHASE2_NVG_THERMAL: Record<string, NVG | Thermal> = {
    // NVGs
    'pnv10t': {
        id: 'pnv10t',
        name: 'PNV-10T Night Vision',
        shortName: 'PNV-10T',
        description: 'Russian Gen 1 night vision goggles.',
        type: 'nvg',
        width: 2, height: 1, baseValue: 45000, weight: 0.45, icon: 'pnv10t',
        generation: 1, brightnessBoost: 0.4, noiseLevel: 0.35
    },
    'pvs14': {
        id: 'pvs14',
        name: 'AN/PVS-14 Night Vision',
        shortName: 'PVS-14',
        description: 'US military Gen 2 night vision monocular.',
        type: 'nvg',
        width: 1, height: 1, baseValue: 125000, weight: 0.38, icon: 'pvs14',
        generation: 2, brightnessBoost: 0.6, noiseLevel: 0.2
    },
    'pnvg18': {
        id: 'pnvg18',
        name: 'GPNVG-18 Panoramic NVG',
        shortName: 'GPNVG-18',
        description: 'Quad-tube panoramic night vision. Elite tier.',
        type: 'nvg',
        width: 2, height: 1, baseValue: 450000, weight: 0.52, icon: 'pnvg18',
        generation: 3, brightnessBoost: 0.85, noiseLevel: 0.08
    },
    // Thermals
    'flir': {
        id: 'flir',
        name: 'FLIR RS-32 Thermal Scope',
        shortName: 'FLIR',
        description: '60Hz thermal weapon sight.',
        type: 'thermal',
        width: 2, height: 1, baseValue: 680000, weight: 0.65, icon: 'flir',
        refreshRate: 60, range: 800
    },
    'reapir': {
        id: 'reapir',
        name: 'REAP-IR Thermal Scope',
        shortName: 'REAP-IR',
        description: '60Hz mini thermal sight.',
        type: 'thermal',
        width: 2, height: 1, baseValue: 580000, weight: 0.48, icon: 'reapir',
        refreshRate: 60, range: 650
    },
};

// ============================================================================
// PHASE 2.2: MELEE WEAPONS
// ============================================================================

export const PHASE2_MELEE: Record<string, MeleeWeapon> = {
    'hatchat': {
        id: 'hatchat',
        name: 'HATCHAT Melee Weapon',
        shortName: 'HATCHAT',
        description: 'Standard-issue tactical axe.',
        type: 'melee',
        width: 2, height: 1, baseValue: 15000, weight: 0.85, icon: 'hatchat',
        damage: 35, range: 0.8, penetration: 15
    },
    'crowbar': {
        id: 'crowbar',
        name: 'Crowbar',
        shortName: 'Crowbar',
        description: 'Standard prying tool.',
        type: 'melee',
        width: 2, height: 1, baseValue: 8500, weight: 1.2, icon: 'crowbar',
        damage: 25, range: 1.0, penetration: 20
    },
    'redrebel': {
        id: 'redrebel',
        name: 'Red Rebel Ice Pick',
        shortName: 'Red Rebel',
        description: 'Ice axe for climbing. Special extract on Reserve.',
        type: 'melee',
        width: 1, height: 2, baseValue: 2850000, weight: 0.65, icon: 'redrebel',
        damage: 45, range: 0.9, penetration: 25
    },
    'cultist': {
        id: 'cultist',
        name: 'Cultist Knife',
        shortName: 'Cultist',
        description: 'Ritual blade from the Cultists.',
        type: 'melee',
        width: 1, height: 1, baseValue: 125000, weight: 0.35, icon: 'cultist',
        damage: 40, range: 0.7, penetration: 18
    },
    'camper': {
        id: 'camper',
        name: 'Camper Axe',
        shortName: 'Camper',
        description: 'Camping hatchet.',
        type: 'melee',
        width: 1, height: 2, baseValue: 12500, weight: 0.75, icon: 'camper',
        damage: 30, range: 0.8, penetration: 12
    },
    'freeman': {
        id: 'freeman',
        name: 'Freeman Crowbar',
        shortName: 'Freeman',
        description: 'Theoretical physicist choice.',
        type: 'melee',
        width: 2, height: 1, baseValue: 45000, weight: 1.15, icon: 'freeman',
        damage: 28, range: 1.2, penetration: 22
    },
};

// ============================================================================
// PHASE 2.3: THROWABLES (GRENADES)
// ============================================================================

export const PHASE2_THROWABLES: Record<string, Throwable> = {
    'f1': {
        id: 'f1',
        name: 'F-1 Hand Grenade',
        shortName: 'F-1',
        description: 'Soviet fragmentation grenade. High damage.',
        type: 'throwable',
        width: 1, height: 1, baseValue: 12500, weight: 0.6, icon: 'f1',
        throwType: 'frag', damage: 200, radius: 8
    },
    'rgd5': {
        id: 'rgd5',
        name: 'RGD-5 Hand Grenade',
        shortName: 'RGD-5',
        description: 'Soviet anti-personnel grenade.',
        type: 'throwable',
        width: 1, height: 1, baseValue: 8500, weight: 0.45, icon: 'rgd5',
        throwType: 'frag', damage: 150, radius: 6
    },
    'm67': {
        id: 'm67',
        name: 'M67 Frag Grenade',
        shortName: 'M67',
        description: 'US fragmentation grenade.',
        type: 'throwable',
        width: 1, height: 1, baseValue: 11000, weight: 0.4, icon: 'm67',
        throwType: 'frag', damage: 180, radius: 7
    },
    'flashbang': {
        id: 'flashbang',
        name: 'M18 Flashbang',
        shortName: 'Flash',
        description: 'Non-lethal flash grenade.',
        type: 'throwable',
        width: 1, height: 1, baseValue: 9500, weight: 0.35, icon: 'flashbang',
        throwType: 'flash', blindDuration: 10
    },
    'smoke-white': {
        id: 'smoke-white',
        name: 'M18 Smoke Grenade (White)',
        shortName: 'Smoke',
        description: 'White screening smoke.',
        type: 'throwable',
        width: 1, height: 1, baseValue: 6500, weight: 0.4, icon: 'smoke',
        throwType: 'smoke', duration: 60
    },
    'm18': {
        id: 'm18',
        name: 'M18 Colored Smoke',
        shortName: 'M18',
        description: 'Colored signal smoke.',
        type: 'throwable',
        width: 1, height: 1, baseValue: 5500, weight: 0.4, icon: 'm18',
        throwType: 'smoke', duration: 90
    },
    'zarya': {
        id: 'zarya',
        name: 'Zarya Stun Grenade',
        shortName: 'Zarya',
        description: 'Russian stun grenade.',
        type: 'throwable',
        width: 1, height: 1, baseValue: 7800, weight: 0.38, icon: 'zarya',
        throwType: 'stun', duration: 8
    },
};

// ============================================================================
// PHASE 2.4: HEADSETS
// ============================================================================

export const PHASE2_HEADSETS: Record<string, Headset> = {
    'comtac2': {
        id: 'comtac2',
        name: 'Peltor ComTac II',
        shortName: 'ComTac II',
        description: 'Premium active hearing protection.',
        type: 'headset',
        width: 2, height: 1, baseValue: 85000, weight: 0.35, icon: 'comtac2',
        hearingBoost: 20
    },
    'sordin': {
        id: 'sordin',
        name: 'MSA Sordin Supreme',
        shortName: 'Sordin',
        description: 'Professional tactical headset.',
        type: 'headset',
        width: 2, height: 1, baseValue: 72000, weight: 0.38, icon: 'sordin',
        hearingBoost: 18
    },
    'razors': {
        id: 'razors',
        name: 'Walker Razor Slim',
        shortName: 'Razors',
        description: 'Budget active hearing protection.',
        type: 'headset',
        width: 2, height: 1, baseValue: 45000, weight: 0.32, icon: 'razors',
        hearingBoost: 15
    },
    'xcel': {
        id: 'xcel',
        name: 'Sordin XCEL 500BT',
        shortName: 'XCEL',
        description: 'Advanced Bluetooth headset.',
        type: 'headset',
        width: 2, height: 1, baseValue: 95000, weight: 0.4, icon: 'xcel',
        hearingBoost: 22
    },
    'gsh01': {
        id: 'gsh01',
        name: 'GSSh-01 Active Headset',
        shortName: 'GSSh-01',
        description: 'Russian military headset.',
        type: 'headset',
        width: 2, height: 1, baseValue: 32000, weight: 0.35, icon: 'gsh01',
        hearingBoost: 12
    },
};

// ============================================================================
// PHASE 2.5: SECURE CONTAINERS
// ============================================================================

export const PHASE2_SECURE_CONTAINERS: Record<string, SecureContainer> = {
    'alpha': {
        id: 'alpha',
        name: 'Secure Container Alpha',
        shortName: 'Alpha',
        description: '2x2 secure container. Basic edition.',
        type: 'secureContainer',
        width: 2, height: 2, baseValue: 0, weight: 0.1, icon: 'alpha',
        slots: 4, gridWidth: 2, gridHeight: 2
    },
    'beta': {
        id: 'beta',
        name: 'Secure Container Beta',
        shortName: 'Beta',
        description: '3x2 secure container. Left Behind edition.',
        type: 'secureContainer',
        width: 3, height: 2, baseValue: 0, weight: 0.12, icon: 'beta',
        slots: 6, gridWidth: 3, gridHeight: 2
    },
    'gamma': {
        id: 'gamma',
        name: 'Secure Container Gamma',
        shortName: 'Gamma',
        description: '3x3 secure container. EOD edition.',
        type: 'secureContainer',
        width: 3, height: 3, baseValue: 0, weight: 0.15, icon: 'gamma',
        slots: 9, gridWidth: 3, gridHeight: 3
    },
    'epsilon': {
        id: 'epsilon',
        name: 'Secure Container Epsilon',
        shortName: 'Epsilon',
        description: '4x2 secure container. Quest reward.',
        type: 'secureContainer',
        width: 4, height: 2, baseValue: 0, weight: 0.14, icon: 'epsilon',
        slots: 8, gridWidth: 4, gridHeight: 2
    },
    'kappa': {
        id: 'kappa',
        name: 'Secure Container Kappa',
        shortName: 'Kappa',
        description: '4x3 secure container. Final quest reward.',
        type: 'secureContainer',
        width: 4, height: 3, baseValue: 0, weight: 0.18, icon: 'kappa',
        slots: 12, gridWidth: 4, gridHeight: 3
    },
};

// ============================================================================
// ADDITIONAL ITEMS TO REACH 400+ TOTAL
// ============================================================================

export const ADDITIONAL_ITEMS = {
    // Additional Weapons (7 unique)
    'mp5k': { id: 'mp5k', name: 'HK MP5K', shortName: 'MP5K', description: 'Compact MP5 variant.', type: 'weapon' as const, weaponClass: 'smg' as const, caliber: '9x19', width: 2, height: 2, baseValue: 45000, weight: 2.0, damage: 32, accuracy: 70, ergonomics: 85, verticalRecoil: 38, horizontalRecoil: 85, fireRate: 900, effectiveRange: 100 },
    'glock18': { id: 'glock18', name: 'Glock 18C', shortName: 'G18C', description: 'Full-auto Glock.', type: 'weapon' as const, weaponClass: 'pistol' as const, caliber: '9x19', width: 2, height: 1, baseValue: 22000, weight: 0.65, damage: 32, accuracy: 68, ergonomics: 88, verticalRecoil: 42, horizontalRecoil: 78, fireRate: 1100, effectiveRange: 40 },
    'desert-eagle': { id: 'desert-eagle', name: 'Desert Eagle .50 AE', shortName: 'DEagle', description: 'Powerful handgun.', type: 'weapon' as const, weaponClass: 'pistol' as const, caliber: '.50ae', width: 2, height: 1, baseValue: 45000, weight: 1.8, damage: 85, accuracy: 75, ergonomics: 65, verticalRecoil: 85, horizontalRecoil: 125, fireRate: 300, effectiveRange: 60 },
    'rpk16': { id: 'rpk16', name: 'RPK-16', shortName: 'RPK-16', description: 'Modern Russian LMG.', type: 'weapon' as const, weaponClass: 'lmg' as const, caliber: '5.45x39', width: 5, height: 2, baseValue: 95000, weight: 4.8, damage: 54, accuracy: 72, ergonomics: 48, verticalRecoil: 78, horizontalRecoil: 195, fireRate: 700, effectiveRange: 550 },
    'saiga12': { id: 'saiga12', name: 'Saiga-12K', shortName: 'Saiga-12', description: 'Semi-auto 12ga shotgun.', type: 'weapon' as const, weaponClass: 'shotgun' as const, caliber: '12ga', width: 4, height: 2, baseValue: 32000, weight: 3.6, damage: 155, accuracy: 48, ergonomics: 58, verticalRecoil: 125, horizontalRecoil: 265, fireRate: 300, effectiveRange: 70 },
    'asval': { id: 'asval', name: 'AS VAL', shortName: 'AS VAL', description: 'Special assault rifle.', type: 'weapon' as const, weaponClass: 'ar' as const, caliber: '9x39', width: 4, height: 2, baseValue: 95000, weight: 2.5, damage: 65, accuracy: 78, ergonomics: 62, verticalRecoil: 58, horizontalRecoil: 155, fireRate: 900, effectiveRange: 280 },
    'mk47': { id: 'mk47', name: 'Mk-47 Mutant', shortName: 'Mutant', description: '7.62x39 AR platform.', type: 'weapon' as const, weaponClass: 'ar' as const, caliber: '7.62x39', width: 4, height: 2, baseValue: 125000, weight: 3.5, damage: 68, accuracy: 74, ergonomics: 58, verticalRecoil: 82, horizontalRecoil: 195, fireRate: 650, effectiveRange: 450 },

    // Additional Ammo (1 unique)
    '762x51-m62': { id: '762x51-m62', name: '7.62x51mm M62', shortName: 'M62', description: 'Tracer 7.62x51.', type: 'ammo' as const, caliber: '7.62x51', penetration: 54, damage: 79, fragmentationChance: 0.14, width: 1, height: 1, baseValue: 680, weight: 0.02, icon: '762m62' },

    // Additional Mods (10)
    'scope-ps320': { id: 'scope-ps320', name: 'FLIR PS32', shortName: 'PS32', description: 'Thermal optic.', type: 'mod' as const, slotType: 'optics' as const, width: 2, height: 1, baseValue: 450000, weight: 0.75, icon: 'ps320', modifiers: { accuracy: 25, ergonomics: -18 } },
    'scope-valday': { id: 'scope-valday', name: 'Valday PS-320', shortName: 'Valday', description: '1x/6x scope.', type: 'mod' as const, slotType: 'optics' as const, width: 2, height: 1, baseValue: 58000, weight: 0.55, icon: 'valday', modifiers: { accuracy: 18, ergonomics: -7 } },
    'suppressor-silencerco': { id: 'suppressor-silencerco', name: 'SilencerCo Hybrid 46', shortName: 'Hybrid 46', description: 'Multi-caliber suppressor.', type: 'mod' as const, slotType: 'muzzle' as const, width: 2, height: 1, baseValue: 95000, weight: 0.52, icon: 'hybrid', modifiers: { accuracy: 4, ergonomics: -15, verticalRecoil: -6, horizontalRecoil: -3 } },
    'suppressor-oss': { id: 'suppressor-oss', name: 'OSS HX-QD 556', shortName: 'OSS', description: 'Flow-through suppressor.', type: 'mod' as const, slotType: 'muzzle' as const, width: 2, height: 1, baseValue: 78000, weight: 0.48, icon: 'oss', modifiers: { accuracy: 3, ergonomics: -12, verticalRecoil: -5, horizontalRecoil: -2 } },
    'grip-bcm': { id: 'grip-bcm', name: 'BCM GUNFIGHTER', shortName: 'BCM Grip', description: 'Vertical foregrip.', type: 'mod' as const, slotType: 'foregrip' as const, width: 1, height: 1, baseValue: 9500, weight: 0.08, icon: 'bcmgrip', modifiers: { ergonomics: 5, verticalRecoil: -5, horizontalRecoil: -3 } },
    'stock-moe': { id: 'stock-moe', name: 'Magpul MOE', shortName: 'MOE', description: 'Standard stock.', type: 'mod' as const, slotType: 'stock' as const, width: 2, height: 1, baseValue: 18000, weight: 0.32, icon: 'moe', modifiers: { ergonomics: 8, verticalRecoil: -6, horizontalRecoil: -4 } },
    'stock-zukov': { id: 'stock-zukov', name: 'Magpul Zhukov-S', shortName: 'Zhukov', description: 'Folding AK stock.', type: 'mod' as const, slotType: 'stock' as const, width: 2, height: 1, baseValue: 22000, weight: 0.42, icon: 'zhukov', modifiers: { ergonomics: 10, verticalRecoil: -8, horizontalRecoil: -5 } },
    'muzzle-surefire': { id: 'muzzle-surefire', name: 'Surefire SF3P', shortName: 'SF3P', description: 'Flash hider.', type: 'mod' as const, slotType: 'muzzle' as const, width: 1, height: 1, baseValue: 12000, weight: 0.07, icon: 'sf3p', modifiers: { accuracy: 1, ergonomics: -1, verticalRecoil: -3, horizontalRecoil: -2 } },
    'mag-drum60': { id: 'mag-drum60', name: '60rd AK Drum', shortName: 'AK Drum', description: '60-round drum.', type: 'mod' as const, slotType: 'magazine' as const, width: 2, height: 2, baseValue: 45000, weight: 0.95, icon: 'akdrum', modifiers: { ergonomics: -20 } },
    'mag-stanag60': { id: 'mag-stanag60', name: '60rd STANAG', shortName: 'STANAG 60', description: '60-round 5.56 mag.', type: 'mod' as const, slotType: 'magazine' as const, width: 2, height: 1, baseValue: 38000, weight: 0.45, icon: 'stanag60', modifiers: { ergonomics: -12 } },

    // Additional Armor (3 unique)
    'jpc': { id: 'jpc', name: 'Crye JPC 2.0', shortName: 'JPC', description: 'Jumpable plate carrier.', type: 'armor' as const, armorClass: 4, maxDurability: 75, material: 'Combined', protectionZones: ['Thorax', 'Stomach'], width: 3, height: 3, baseValue: 125000, weight: 6.8, icon: 'jpc' },
    'cvc': { id: 'cvc', name: 'CVC Helmet', shortName: 'CVC', description: 'Combat vehicle crew helmet.', type: 'helmet' as const, armorClass: 3, maxDurability: 55, material: 'Combined', protectionZones: ['Head'], width: 2, height: 2, baseValue: 45000, weight: 1.2, icon: 'cvc' },
    'lynx': { id: 'lynx', name: 'Lynx Helmet', shortName: 'Lynx', description: 'Russian tactical helmet.', type: 'helmet' as const, armorClass: 4, maxDurability: 65, material: 'Combined', protectionZones: ['Head'], width: 2, height: 2, baseValue: 98000, weight: 1.35, icon: 'lynx' },

    // Additional Medical (3 unique)
    'alumsplint': { id: 'alumsplint', name: 'Aluminum Splint', shortName: 'Splint', description: 'For fractures.', type: 'medical' as const, useTime: 3, maxUses: 5, width: 1, height: 2, baseValue: 12500, weight: 0.25, icon: 'splint' },
    'esketamine': { id: 'esketamine', name: 'Esketamine Injector', shortName: 'Esketamine', description: 'Pain relief stimulant.', type: 'medical' as const, useTime: 2, maxUses: 1, width: 1, height: 1, baseValue: 45000, weight: 0.05, icon: 'esketamine' },
    'l1': { id: 'l1', name: 'L1 (Norepinephrine)', shortName: 'L1', description: 'Combat stimulant.', type: 'medical' as const, useTime: 2, maxUses: 1, width: 1, height: 1, baseValue: 52000, weight: 0.05, icon: 'l1' },

    // Additional Provisions (5)
    'condensedmilk': { id: 'condensedmilk', name: 'Condensed Milk', shortName: 'Cond. Milk', description: 'Sweetened condensed milk.', type: 'food' as const, energyBonus: 45, hydrationBonus: -10, width: 1, height: 1, baseValue: 18500, weight: 0.4, icon: 'condensedmilk' },
    'sausage': { id: 'sausage', name: 'Doctor Sausage', shortName: 'Sausage', description: 'Soviet-style sausage.', type: 'food' as const, energyBonus: 35, hydrationBonus: -3, width: 1, height: 1, baseValue: 12500, weight: 0.35, icon: 'sausage' },
    'tc': { id: 'tc', name: 'Tarcone Coffee', shortName: 'Tarcone', description: 'Coffee drink.', type: 'drink' as const, energyBonus: 10, hydrationBonus: 25, width: 1, height: 1, baseValue: 8500, weight: 0.3, icon: 'tc' },
    'hotrod': { id: 'hotrod', name: 'Hot Rod Energy', shortName: 'Hot Rod', description: 'Energy drink.', type: 'drink' as const, energyBonus: 15, hydrationBonus: 28, width: 1, height: 1, baseValue: 9500, weight: 0.35, icon: 'hotrod' },
    'moonshine': { id: 'moonshine', name: 'Fierce Hatchling Moonshine', shortName: 'Moonshine', description: 'Strong alcohol.', type: 'drink' as const, energyBonus: 20, hydrationBonus: 20, width: 1, height: 2, baseValue: 285000, weight: 1.2, icon: 'moonshine' },

    // Additional Barter (20)
    'tetriz': { id: 'tetriz', name: 'Tetriz Portable Game', shortName: 'Tetriz', description: 'Retro gaming console.', type: 'barter' as const, width: 1, height: 2, baseValue: 95000, weight: 0.4, icon: 'tetriz' },
    'magnet': { id: 'magnet', name: 'Powerful Magnet', shortName: 'Magnet', description: 'Neodymium magnet.', type: 'barter' as const, width: 1, height: 1, baseValue: 18500, weight: 0.5, icon: 'magnet' },
    'pressuregauge': { id: 'pressuregauge', name: 'Pressure Gauge', shortName: 'Gauge', description: 'Mechanical gauge.', type: 'barter' as const, width: 1, height: 1, baseValue: 22000, weight: 0.35, icon: 'gauge' },
    'thermometer': { id: 'thermometer', name: 'Medical Thermometer', shortName: 'Thermometer', description: 'Digital thermometer.', type: 'barter' as const, width: 1, height: 1, baseValue: 28000, weight: 0.15, icon: 'thermometer' },
    'phmeter': { id: 'phmeter', name: 'PH Meter', shortName: 'PH Meter', description: 'Chemistry tool.', type: 'barter' as const, width: 1, height: 1, baseValue: 32000, weight: 0.2, icon: 'phmeter' },
    'gasanalyzer': { id: 'gasanalyzer', name: 'Gas Analyzer', shortName: 'Gas An.', description: 'Measurement device.', type: 'barter' as const, width: 1, height: 2, baseValue: 45000, weight: 0.8, icon: 'gasanalyzer' },
    'geigercounter': { id: 'geigercounter', name: 'Geiger Counter', shortName: 'Geiger', description: 'Radiation detector.', type: 'barter' as const, width: 1, height: 2, baseValue: 55000, weight: 0.6, icon: 'geiger' },
    'militarycircuit': { id: 'militarycircuit', name: 'Military Circuit Board', shortName: 'Mil. Circuit', description: 'Military-grade electronics.', type: 'barter' as const, width: 1, height: 1, baseValue: 125000, weight: 0.15, icon: 'militarycircuit' },
    'intelfolder': { id: 'intelfolder', name: 'Intelligence Folder', shortName: 'Intel', description: 'Classified documents.', type: 'barter' as const, width: 1, height: 1, baseValue: 185000, weight: 0.1, icon: 'intel' },
    'militaryflash': { id: 'militaryflash', name: 'Military Flash Drive', shortName: 'Mil. Flash', description: 'Encrypted storage.', type: 'barter' as const, width: 1, height: 1, baseValue: 125000, weight: 0.05, icon: 'militaryflash' },
    'diary': { id: 'diary', name: 'Slim Diary', shortName: 'Diary', description: 'Personal journal.', type: 'barter' as const, width: 1, height: 1, baseValue: 95000, weight: 0.1, icon: 'diary' },
    'sdd': { id: 'sdd', name: 'Secure Flash Drive', shortName: 'SDD', description: 'Encrypted USB drive.', type: 'barter' as const, width: 1, height: 1, baseValue: 58000, weight: 0.05, icon: 'sdd' },
    'cracker': { id: 'cracker', name: 'Christmas Cracker', shortName: 'Cracker', description: 'Holiday item.', type: 'barter' as const, width: 1, height: 1, baseValue: 12500, weight: 0.1, icon: 'cracker' },
    'techmanual': { id: 'techmanual', name: 'Technical Documentation', shortName: 'Tech Doc', description: 'Technical manual.', type: 'barter' as const, width: 1, height: 2, baseValue: 65000, weight: 0.5, icon: 'techdoc' },
    'wilston': { id: 'wilston', name: 'Wilston Cigarettes', shortName: 'Wilston', description: 'Premium cigarettes.', type: 'barter' as const, width: 1, height: 1, baseValue: 18500, weight: 0.05, icon: 'wilston' },
    'strike': { id: 'strike', name: 'Strike Cigarettes', shortName: 'Strike', description: 'French cigarettes.', type: 'barter' as const, width: 1, height: 1, baseValue: 9500, weight: 0.05, icon: 'strike' },
    'apollo': { id: 'apollo', name: 'Apollo Soyuz Cigarettes', shortName: 'Apollo', description: 'Soviet cigarettes.', type: 'barter' as const, width: 1, height: 1, baseValue: 12500, weight: 0.05, icon: 'apollo' },
    'repellent': { id: 'repellent', name: 'Repellent', shortName: 'Repellent', description: 'Insect repellent.', type: 'barter' as const, width: 1, height: 1, baseValue: 12500, weight: 0.2, icon: 'repellent' },
    'oxbleach': { id: 'oxbleach', name: 'Ox Bleach', shortName: 'Bleach', description: 'Cleaning supplies.', type: 'barter' as const, width: 1, height: 2, baseValue: 18500, weight: 0.75, icon: 'bleach' },
    'wiper': { id: 'wiper', name: 'Tech. wiper', shortName: 'Wiper', description: 'Technical wiper.', type: 'barter' as const, width: 1, height: 1, baseValue: 8500, weight: 0.15, icon: 'wiper' },

    // Additional Keys (15)
    'dorms114': { id: 'dorms114', name: 'Dorms 114 Key', shortName: '114', description: 'Customs dorms room 114.', type: 'key' as const, width: 1, height: 1, baseValue: 45000, weight: 0.01, icon: 'key' },
    'dorms203': { id: 'dorms203', name: 'Dorms 203 Key', shortName: '203', description: 'Customs dorms room 203.', type: 'key' as const, width: 1, height: 1, baseValue: 38000, weight: 0.01, icon: 'key' },
    'dorms204': { id: 'dorms204', name: 'Dorms 204 Key', shortName: '204', description: 'Customs dorms room 204.', type: 'key' as const, width: 1, height: 1, baseValue: 42000, weight: 0.01, icon: 'key' },
    'marked': { id: 'marked', name: 'Marked Key', shortName: 'Marked', description: 'Mysterious marked key.', type: 'key' as const, width: 1, height: 1, baseValue: 385000, weight: 0.01, icon: 'marked' },
    'rb-st': { id: 'rb-st', name: 'RB-ST Key', shortName: 'RB-ST', description: 'Reserve storage key.', type: 'key' as const, width: 1, height: 1, baseValue: 185000, weight: 0.01, icon: 'key' },
    'rb-rs': { id: 'rb-rs', name: 'RB-RS Key', shortName: 'RB-RS', description: 'Reserve key.', type: 'key' as const, width: 1, height: 1, baseValue: 225000, weight: 0.01, icon: 'key' },
    'rb-ps': { id: 'rb-ps', name: 'RB-PS Key', shortName: 'RB-PS', description: 'Reserve power station.', type: 'key' as const, width: 1, height: 1, baseValue: 145000, weight: 0.01, icon: 'key' },
    'san-216': { id: 'san-216', name: 'San. 216 Key', shortName: '216', description: 'Shoreline east 216.', type: 'key' as const, width: 1, height: 1, baseValue: 95000, weight: 0.01, icon: 'key' },
    'san-226': { id: 'san-226', name: 'San. 226 Key', shortName: '226', description: 'Shoreline east 226.', type: 'key' as const, width: 1, height: 1, baseValue: 85000, weight: 0.01, icon: 'key' },
    'san-301': { id: 'san-301', name: 'San. 301 Key', shortName: '301', description: 'Shoreline east 301.', type: 'key' as const, width: 1, height: 1, baseValue: 185000, weight: 0.01, icon: 'key' },
    'san-222': { id: 'san-222', name: 'San. 222 Key', shortName: '222', description: 'Shoreline east 222.', type: 'key' as const, width: 1, height: 1, baseValue: 125000, weight: 0.01, icon: 'key' },
    'west-219': { id: 'west-219', name: 'West 219 Key', shortName: 'W219', description: 'Shoreline west 219.', type: 'key' as const, width: 1, height: 1, baseValue: 78000, weight: 0.01, icon: 'key' },
    'west-220': { id: 'west-220', name: 'West 220 Key', shortName: 'W220', description: 'Shoreline west 220.', type: 'key' as const, width: 1, height: 1, baseValue: 82000, weight: 0.01, icon: 'key' },
    'goshan': { id: 'goshan', name: 'Goshan Key', shortName: 'Goshan', description: 'Interchange Goshan.', type: 'key' as const, width: 1, height: 1, baseValue: 145000, weight: 0.01, icon: 'key' },
    'idea': { id: 'idea', name: 'IDEA Key', shortName: 'IDEA', description: 'Interchange IDEA.', type: 'key' as const, width: 1, height: 1, baseValue: 125000, weight: 0.01, icon: 'key' },
};
