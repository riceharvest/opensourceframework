// src/lib/game/items.ts
import {
    NEW_WEAPONS,
    NEW_AMMO,
    NEW_MODS,
    NEW_ARMOR,
    NEW_MEDICAL,
    NEW_PROVISIONS,
    NEW_BARTER,
    NEW_KEYS,
    PHASE2_NVG_THERMAL,
    PHASE2_MELEE,
    PHASE2_THROWABLES,
    PHASE2_HEADSETS,
    PHASE2_SECURE_CONTAINERS,
    ADDITIONAL_ITEMS,
} from './items_expansion';

import type { Item, Weapon, WeaponMod, Ammo, Armor, Medical, Provision, AttachmentSlot, MalfunctionType } from './types';

// Type guard functions for proper type narrowing
export function isWeapon(item: Item): item is Weapon {
    return item.type === 'weapon' && 'weaponClass' in item;
}

export function isAmmo(item: Item): item is Ammo {
    return item.type === 'ammo' && 'caliber' in item;
}

export function isMedical(item: Item): item is Medical {
    return item.type === 'medical' && 'useTime' in item;
}

export function isArmor(item: Item): item is Armor {
    return (item.type === 'armor' || item.type === 'helmet') && 'armorClass' in item;
}

export function isProvision(item: Item): item is Provision {
    return (item.type === 'food' || item.type === 'drink') && 'energyBonus' in item;
}

export function isWeaponMod(item: Item): item is WeaponMod {
    return item.type === 'mod' && 'slotType' in item;
}

export const ITEM_DATABASE: Record<string, Item> = {
    // WEAPONS - Assault Rifles
    'ak-74': {
        id: 'ak-74',
        name: 'Kalashnikov AK-74 5.45x39',
        shortName: 'AK-74',
        description: 'The AK-74 is an assault rifle developed in the early 1970s.',
        type: 'weapon',
        weaponClass: 'ar',
        caliber: '5.45x39',
        width: 4, height: 2,
        baseValue: 22000, weight: 3.6,
        damage: 48, accuracy: 65, ergonomics: 45,
        verticalRecoil: 82, horizontalRecoil: 210, fireRate: 600, effectiveRange: 500
    },
    'm4a1': {
        id: 'm4a1',
        name: 'Colt M4A1 5.56x45',
        shortName: 'M4A1',
        description: 'Standard issue US military carbine.',
        type: 'weapon',
        weaponClass: 'ar',
        caliber: '5.56x45',
        width: 4, height: 2,
        baseValue: 55000, weight: 2.9,
        damage: 42, accuracy: 78, ergonomics: 62,
        verticalRecoil: 74, horizontalRecoil: 190, fireRate: 800, effectiveRange: 600
    },
    'rpk-16': {
        id: 'rpk-16',
        name: 'RPK-16 5.45x39',
        shortName: 'RPK-16',
        description: 'Modern Russian light machine gun.',
        type: 'weapon',
        weaponClass: 'lmg',
        caliber: '5.45x39',
        width: 5, height: 2,
        baseValue: 85000, weight: 4.5,
        damage: 52, accuracy: 70, ergonomics: 40,
        verticalRecoil: 95, horizontalRecoil: 220, fireRate: 700, effectiveRange: 650
    },
    'svds': {
        id: 'svds',
        name: 'SVDS 7.62x54R',
        shortName: 'SVDS',
        description: 'Modernized SVD sniper rifle.',
        type: 'weapon',
        weaponClass: 'dmr',
        caliber: '7.62x54R',
        width: 5, height: 2,
        baseValue: 75000, weight: 4.1,
        damage: 82, accuracy: 88, ergonomics: 35,
        verticalRecoil: 110, horizontalRecoil: 180, fireRate: 100, effectiveRange: 1000
    },
    'sv-98': {
        id: 'sv-98',
        name: 'SV-98 7.62x54R',
        shortName: 'SV-98',
        description: 'Russian bolt-action sniper rifle.',
        type: 'weapon',
        weaponClass: 'sniper',
        caliber: '7.62x54R',
        width: 6, height: 2,
        baseValue: 18000, weight: 5.8,
        damage: 85, accuracy: 92, ergonomics: 25,
        verticalRecoil: 140, horizontalRecoil: 150, fireRate: 30, effectiveRange: 1200
    },
    'saiga-12': {
        id: 'saiga-12',
        name: 'Saiga-12K 12ga',
        shortName: 'Saiga-12',
        description: 'Semi-automatic shotgun.',
        type: 'weapon',
        weaponClass: 'shotgun',
        caliber: '12ga',
        width: 4, height: 2,
        baseValue: 28000, weight: 3.6,
        damage: 140, accuracy: 35, ergonomics: 40,
        verticalRecoil: 160, horizontalRecoil: 280, fireRate: 250, effectiveRange: 80
    },
    'm249': {
        id: 'm249',
        name: 'M249 SAW 5.56x45',
        shortName: 'M249',
        description: 'Light machine gun used by US forces.',
        type: 'weapon',
        weaponClass: 'lmg',
        caliber: '5.56x45',
        width: 5, height: 2,
        baseValue: 180000, weight: 7.5,
        damage: 48, accuracy: 65, ergonomics: 30,
        verticalRecoil: 105, horizontalRecoil: 260, fireRate: 800, effectiveRange: 800
    },
    'vss': {
        id: 'vss',
        name: 'VSS Vintorez 9x39',
        shortName: 'VSS',
        description: 'Special suppressed sniper rifle.',
        type: 'weapon',
        weaponClass: 'dmr',
        caliber: '9x39',
        width: 4, height: 2,
        baseValue: 95000, weight: 2.6,
        damage: 58, accuracy: 82, ergonomics: 55,
        verticalRecoil: 65, horizontalRecoil: 120, fireRate: 700, effectiveRange: 400
    },
    'pm-pistol': {
        id: 'pm-pistol',
        name: 'PM 9x18PM',
        shortName: 'PM',
        description: 'Soviet pistol.',
        type: 'weapon',
        weaponClass: 'pistol',
        caliber: '9x18PM',
        width: 2, height: 1,
        baseValue: 4500, weight: 0.73,
        damage: 24, accuracy: 30, ergonomics: 80,
        verticalRecoil: 40, horizontalRecoil: 80, fireRate: 300, effectiveRange: 50
    },
    'ash-12': {
        id: 'ash-12',
        name: 'ASh-12.7 12.7x55',
        shortName: 'ASh-12',
        description: 'Heavy assault rifle.',
        type: 'weapon',
        weaponClass: 'ar',
        caliber: '12.7x55',
        width: 4, height: 2,
        baseValue: 120000, weight: 5.3,
        damage: 95, accuracy: 55, ergonomics: 35,
        verticalRecoil: 140, horizontalRecoil: 300, fireRate: 500, effectiveRange: 300
    },

    // SMGs - NEW CATEGORY
    'mp5': {
        id: 'mp5',
        name: 'HK MP5 9x19',
        shortName: 'MP5',
        description: 'Legendary submachine gun. Reliable and accurate.',
        type: 'weapon',
        weaponClass: 'smg',
        caliber: '9x19',
        width: 3, height: 2,
        baseValue: 38000, weight: 2.5,
        damage: 35, accuracy: 72, ergonomics: 75,
        verticalRecoil: 45, horizontalRecoil: 110, fireRate: 800, effectiveRange: 150
    },
    'mp7': {
        id: 'mp7',
        name: 'HK MP7 4.6x30',
        shortName: 'MP7',
        description: 'Personal defense weapon with armor-piercing capability.',
        type: 'weapon',
        weaponClass: 'smg',
        caliber: '4.6x30',
        width: 3, height: 2,
        baseValue: 65000, weight: 1.9,
        damage: 38, accuracy: 78, ergonomics: 80,
        verticalRecoil: 40, horizontalRecoil: 95, fireRate: 950, effectiveRange: 175
    },
    'vector': {
        id: 'vector',
        name: 'TDI Kriss Vector 9x19',
        shortName: 'Vector',
        description: 'Extreme rate of fire. Devastating in close quarters.',
        type: 'weapon',
        weaponClass: 'smg',
        caliber: '9x19',
        width: 3, height: 2,
        baseValue: 72000, weight: 2.7,
        damage: 36, accuracy: 68, ergonomics: 70,
        verticalRecoil: 50, horizontalRecoil: 125, fireRate: 1100, effectiveRange: 125
    },

    // Additional Assault Rifles
    'hk416': {
        id: 'hk416',
        name: 'HK 416A5 5.56x45',
        shortName: 'HK416',
        description: 'Premium AR platform. Exceptional reliability and accuracy.',
        type: 'weapon',
        weaponClass: 'ar',
        caliber: '5.56x45',
        width: 4, height: 2,
        baseValue: 95000, weight: 3.1,
        damage: 44, accuracy: 82, ergonomics: 65,
        verticalRecoil: 55, horizontalRecoil: 145, fireRate: 850, effectiveRange: 450
    },
    'akm': {
        id: 'akm',
        name: 'AKM 7.62x39',
        shortName: 'AKM',
        description: 'Classic 7.62 AK. High damage but heavy recoil.',
        type: 'weapon',
        weaponClass: 'ar',
        caliber: '7.62x39',
        width: 4, height: 2,
        baseValue: 42000, weight: 3.5,
        damage: 62, accuracy: 68, ergonomics: 55,
        verticalRecoil: 85, horizontalRecoil: 240, fireRate: 600, effectiveRange: 350
    },

    // Additional Shotguns
    'mp153': {
        id: 'mp153',
        name: 'MP-153 12ga',
        shortName: 'MP-153',
        description: 'Reliable semi-automatic shotgun. Great for budget runs.',
        type: 'weapon',
        weaponClass: 'shotgun',
        caliber: '12ga',
        width: 4, height: 2,
        baseValue: 28000, weight: 3.5,
        damage: 135, accuracy: 42, ergonomics: 50,
        verticalRecoil: 120, horizontalRecoil: 260, fireRate: 300, effectiveRange: 50
    },

    // Additional Sniper/DMR
    'dvl10': {
        id: 'dvl10',
        name: 'DVL-10 7.62x51',
        shortName: 'DVL-10',
        description: 'Integrally suppressed sniper rifle. Ultra-quiet.',
        type: 'weapon',
        weaponClass: 'sniper',
        caliber: '7.62x51',
        width: 5, height: 2,
        baseValue: 88000, weight: 4.2,
        damage: 88, accuracy: 95, ergonomics: 45,
        verticalRecoil: 95, horizontalRecoil: 165, fireRate: 60, effectiveRange: 1000
    },

    // Additional Pistols
    'glock17': {
        id: 'glock17',
        name: 'Glock 17 9x19',
        shortName: 'Glock 17',
        description: 'Reliable polymer-framed pistol. Standard issue for many forces.',
        type: 'weapon',
        weaponClass: 'pistol',
        caliber: '9x19',
        width: 2, height: 1,
        baseValue: 8500, weight: 0.62,
        damage: 32, accuracy: 75, ergonomics: 90,
        verticalRecoil: 35, horizontalRecoil: 70, fireRate: 400, effectiveRange: 50
    },
    'tt': {
        id: 'tt',
        name: 'TT Pistol 7.62x25',
        shortName: 'TT',
        description: 'Classic Soviet pistol. Powerful for its size.',
        type: 'weapon',
        weaponClass: 'pistol',
        caliber: '7.62x25',
        width: 2, height: 1,
        baseValue: 6500, weight: 0.85,
        damage: 42, accuracy: 72, ergonomics: 85,
        verticalRecoil: 40, horizontalRecoil: 75, fireRate: 350, effectiveRange: 50
    },

    // MODS
    'okp-7': {
        id: 'okp-7',
        name: 'OKP-7 Reflex Sight',
        shortName: 'OKP-7',
        description: 'A dedicated reflex sight for AK variants.',
        type: 'mod',
        slotType: 'optics',
        width: 1, height: 1,
        baseValue: 12000, weight: 0.2,
        icon: 'okp7',
        modifiers: { accuracy: 12, ergonomics: -2 }
    },
    'rk-3': {
        id: 'rk-3',
        name: 'Zenit RK-3 Pistol Grip',
        shortName: 'RK-3',
        description: 'High ergonomics pistol grip.',
        type: 'mod',
        slotType: 'foregrip',
        width: 1, height: 1,
        baseValue: 8000, weight: 0.1,
        icon: 'rk3',
        modifiers: { ergonomics: 8, verticalRecoil: -2 }
    },
    'suppressor-545': {
        id: 'suppressor-545',
        name: 'PBS-4 5.45x39 Suppressor',
        shortName: 'PBS-4',
        description: 'Suppressor for 5.45mm weapons.',
        type: 'mod',
        slotType: 'muzzle',
        width: 2, height: 1,
        baseValue: 35000, weight: 0.6,
        icon: 'suppressor',
        modifiers: { accuracy: 5, ergonomics: -8, verticalRecoil: -5, horizontalRecoil: -3 }
    },

    // Additional Scopes
    'eotech-xps3': {
        id: 'eotech-xps3',
        name: 'EOTech XPS3-0',
        shortName: 'XPS3-0',
        description: 'Holographic sight.',
        type: 'mod',
        slotType: 'optics',
        width: 1, height: 1,
        baseValue: 28000, weight: 0.25,
        icon: 'eotech',
        modifiers: { accuracy: 15, ergonomics: -3 }
    },
    'pso1': {
        id: 'pso1',
        name: 'PSO-1M2-1',
        shortName: 'PSO-1',
        description: '4x Russian scope.',
        type: 'mod',
        slotType: 'optics',
        width: 2, height: 1,
        baseValue: 22000, weight: 0.6,
        icon: 'pso1',
        modifiers: { accuracy: 20, ergonomics: -8 }
    },

    // Additional Suppressors
    'saker762': {
        id: 'saker762',
        name: 'Saker ASR 7.62',
        shortName: 'Saker 762',
        description: '7.62 NATO suppressor.',
        type: 'mod',
        slotType: 'muzzle',
        width: 2, height: 1,
        baseValue: 55000, weight: 0.65,
        icon: 'saker',
        modifiers: { accuracy: 5, ergonomics: -15, verticalRecoil: -5 }
    },
    'nt4': {
        id: 'nt4',
        name: 'KAC NT4',
        shortName: 'NT4',
        description: '5.56 suppressor.',
        type: 'mod',
        slotType: 'muzzle',
        width: 2, height: 1,
        baseValue: 48000, weight: 0.5,
        icon: 'nt4',
        modifiers: { accuracy: 3, ergonomics: -12, verticalRecoil: -4 }
    },

    // Additional Grips
    'rk2': {
        id: 'rk2',
        name: 'RK-2 Foregrip',
        shortName: 'RK-2',
        description: 'Vertical grip.',
        type: 'mod',
        slotType: 'foregrip',
        width: 1, height: 1,
        baseValue: 12000, weight: 0.15,
        icon: 'rk2',
        modifiers: { ergonomics: 2, verticalRecoil: -8, horizontalRecoil: -4 }
    },
    'afg': {
        id: 'afg',
        name: 'Magpul AFG',
        shortName: 'AFG',
        description: 'Angled grip.',
        type: 'mod',
        slotType: 'foregrip',
        width: 1, height: 1,
        baseValue: 8500, weight: 0.08,
        icon: 'afg',
        modifiers: { ergonomics: 5, verticalRecoil: -5, horizontalRecoil: -3 }
    },

    // Stocks
    'moe': {
        id: 'moe',
        name: 'Magpul MOE',
        shortName: 'MOE',
        description: 'Collapsible stock.',
        type: 'mod',
        slotType: 'stock',
        width: 2, height: 1,
        baseValue: 15000, weight: 0.35,
        icon: 'moe',
        modifiers: { ergonomics: 8, verticalRecoil: -6, horizontalRecoil: -4 }
    },
    'zhukov': {
        id: 'zhukov',
        name: 'Magpul Zhukov',
        shortName: 'Zhukov',
        description: 'Folding AK stock.',
        type: 'mod',
        slotType: 'stock',
        width: 2, height: 1,
        baseValue: 22000, weight: 0.4,
        icon: 'zhukov',
        modifiers: { ergonomics: 6, verticalRecoil: -8, horizontalRecoil: -5 }
    },

    // Magazines
    'pmag60': {
        id: 'pmag60',
        name: 'PMAG 60-round',
        shortName: 'PMAG 60',
        description: '60-round 5.56 drum magazine.',
        type: 'mod',
        slotType: 'magazine',
        width: 2, height: 2,
        baseValue: 35000, weight: 0.45,
        icon: 'pmag60',
        modifiers: { ergonomics: -15 }
    },
    'akdrum': {
        id: 'akdrum',
        name: 'RPK Drum 75rd',
        shortName: 'RPK Drum',
        description: '75-round 5.45 drum magazine.',
        type: 'mod',
        slotType: 'magazine',
        width: 2, height: 2,
        baseValue: 42000, weight: 0.65,
        icon: 'akdrum',
        modifiers: { ergonomics: -20 }
    },

    // AMMO
    '545x39-ps': {
        id: '545x39-ps',
        name: '5.45x39mm PS',
        shortName: 'PS',
        description: 'Steel core bullets.',
        type: 'ammo',
        caliber: '5.45x39',
        penetration: 28, damage: 45, fragmentationChance: 0.15,
        width: 1, height: 1, baseValue: 210, weight: 0.01, icon: '545ps'
    },
    '545x39-bp': {
        id: '545x39-bp',
        name: '5.45x39mm BP',
        shortName: 'BP',
        description: 'Armor piercing rounds.',
        type: 'ammo',
        caliber: '5.45x39',
        penetration: 45, damage: 42, fragmentationChance: 0.12,
        width: 1, height: 1, baseValue: 850, weight: 0.01, icon: '545bp'
    },
    '545x39-bt': {
        id: '545x39-bt',
        name: '5.45x39mm BT',
        shortName: 'BT',
        description: 'Tracer armor piercing.',
        type: 'ammo',
        caliber: '5.45x39',
        penetration: 40, damage: 44, fragmentationChance: 0.14,
        width: 1, height: 1, baseValue: 650, weight: 0.01, icon: '545bt'
    },
    '545x39-7n40': {
        id: '545x39-7n40',
        name: '5.45x39mm 7N40',
        shortName: '7N40',
        description: 'High accuracy rounds.',
        type: 'ammo',
        caliber: '5.45x39',
        penetration: 38, damage: 52, fragmentationChance: 0.18,
        width: 1, height: 1, baseValue: 1200, weight: 0.01, icon: '5457n40'
    },
    '545x39-igolnik': {
        id: '545x39-igolnik',
        name: '5.45x39mm Igolnik',
        shortName: 'Igolnik',
        description: 'Top tier armor piercing.',
        type: 'ammo',
        caliber: '5.45x39',
        penetration: 62, damage: 37, fragmentationChance: 0.08,
        width: 1, height: 1, baseValue: 2800, weight: 0.01, icon: '545igolnik'
    },
    '556x45-m855': {
        id: '556x45-m855',
        name: '5.56x45mm M855',
        shortName: 'M855',
        description: 'Standard NATO ball ammo.',
        type: 'ammo',
        caliber: '5.56x45',
        penetration: 30, damage: 52, fragmentationChance: 0.16,
        width: 1, height: 1, baseValue: 180, weight: 0.01, icon: '556m855'
    },
    '556x45-m855a1': {
        id: '556x45-m855a1',
        name: '5.56x45mm M855A1',
        shortName: 'M855A1',
        description: 'Enhanced performance round.',
        type: 'ammo',
        caliber: '5.56x45',
        penetration: 46, damage: 49, fragmentationChance: 0.18,
        width: 1, height: 1, baseValue: 1200, weight: 0.01, icon: '556m855a1'
    },
    '556x45-m995': {
        id: '556x45-m995',
        name: '5.56x45mm M995',
        shortName: 'M995',
        description: 'Armor piercing.',
        type: 'ammo',
        caliber: '5.56x45',
        penetration: 58, damage: 42, fragmentationChance: 0.10,
        width: 1, height: 1, baseValue: 3500, weight: 0.01, icon: '556m995'
    },
    '762x54r-ps': {
        id: '762x54r-ps',
        name: '7.62x54R PS',
        shortName: 'PS',
        description: 'Sniper ammo.',
        type: 'ammo',
        caliber: '7.62x54R',
        penetration: 45, damage: 86, fragmentationChance: 0.12,
        width: 1, height: 1, baseValue: 450, weight: 0.02, icon: '76254ps'
    },
    '762x54r-snb': {
        id: '762x54r-snb',
        name: '7.62x54R SNB',
        shortName: 'SNB',
        description: 'Armor piercing sniper.',
        type: 'ammo',
        caliber: '7.62x54R',
        penetration: 65, damage: 75, fragmentationChance: 0.08,
        width: 1, height: 1, baseValue: 1800, weight: 0.02, icon: '76254snb'
    },
    '12ga-buckshot': {
        id: '12ga-buckshot',
        name: '12/70 7mm Buckshot',
        shortName: 'Buckshot',
        description: 'Standard buckshot.',
        type: 'ammo',
        caliber: '12ga',
        penetration: 3, damage: 50, fragmentationChance: 0,
        width: 1, height: 1, baseValue: 55, weight: 0.05, icon: '12gabuck'
    },
    '12ga-ap20': {
        id: '12ga-ap20',
        name: '12/70 AP-20',
        shortName: 'AP-20',
        description: 'Armor piercing slug.',
        type: 'ammo',
        caliber: '12ga',
        penetration: 42, damage: 164, fragmentationChance: 0.05,
        width: 1, height: 1, baseValue: 1200, weight: 0.05, icon: '12gaap20'
    },

    // MISSING AMMO TYPES - 9x18PM for PM Pistol
    '9x18mm-pst': {
        id: '9x18mm-pst',
        name: '9x18mm PM Pst',
        shortName: 'Pst',
        description: 'Standard 9x18PM pistol ammo.',
        type: 'ammo',
        caliber: '9x18PM',
        penetration: 12, damage: 28, fragmentationChance: 0.10,
        width: 1, height: 1, baseValue: 45, weight: 0.01, icon: '9x18pst'
    },
    '9x18mm-sp7': {
        id: '9x18mm-sp7',
        name: '9x18mm PM SP7',
        shortName: 'SP7',
        description: 'High damage hollow point.',
        type: 'ammo',
        caliber: '9x18PM',
        penetration: 2, damage: 42, fragmentationChance: 0.35,
        width: 1, height: 1, baseValue: 85, weight: 0.01, icon: '9x18sp7'
    },

    // MISSING AMMO TYPES - 9x39 for VSS
    '9x39-sp5': {
        id: '9x39-sp5',
        name: '9x39mm SP-5',
        shortName: 'SP-5',
        description: 'Standard subsonic sniper ammo.',
        type: 'ammo',
        caliber: '9x39',
        penetration: 35, damage: 64, fragmentationChance: 0.15,
        width: 1, height: 1, baseValue: 950, weight: 0.02, icon: '9x39sp5'
    },
    '9x39-sp6': {
        id: '9x39-sp6',
        name: '9x39mm SP-6',
        shortName: 'SP-6',
        description: 'Armor piercing subsonic.',
        type: 'ammo',
        caliber: '9x39',
        penetration: 48, damage: 58, fragmentationChance: 0.12,
        width: 1, height: 1, baseValue: 1800, weight: 0.02, icon: '9x39sp6'
    },

    // MISSING AMMO TYPES - 12.7x55 for ASh-12
    '127x55-ps12': {
        id: '127x55-ps12',
        name: '12.7x55mm PS12',
        shortName: 'PS12',
        description: 'Standard heavy assault ammo.',
        type: 'ammo',
        caliber: '12.7x55',
        penetration: 32, damage: 110, fragmentationChance: 0.20,
        width: 1, height: 1, baseValue: 850, weight: 0.03, icon: '12755ps12'
    },
    '127x55-ps12b': {
        id: '127x55-ps12b',
        name: '12.7x55mm PS12B',
        shortName: 'PS12B',
        description: 'Armor piercing heavy ammo.',
        type: 'ammo',
        caliber: '12.7x55',
        penetration: 52, damage: 102, fragmentationChance: 0.15,
        width: 1, height: 1, baseValue: 2400, weight: 0.03, icon: '12755ps12b'
    },

    // MISSING AMMO TYPES - More 5.56x45 options
    '556x45-m856a1': {
        id: '556x45-m856a1',
        name: '5.56x45mm M856A1',
        shortName: 'M856A1',
        description: 'Tracer round with enhanced performance.',
        type: 'ammo',
        caliber: '5.56x45',
        penetration: 42, damage: 51, fragmentationChance: 0.18,
        width: 1, height: 1, baseValue: 950, weight: 0.01, icon: '556m856a1'
    },
    '556x45-mk318': {
        id: '556x45-mk318',
        name: '5.56x45mm MK 318 Mod 0',
        shortName: 'MK318',
        description: 'Special Operations Science and Technology round.',
        type: 'ammo',
        caliber: '5.56x45',
        penetration: 40, damage: 54, fragmentationChance: 0.20,
        width: 1, height: 1, baseValue: 750, weight: 0.01, icon: '556mk318'
    },

    // Missing calibers for new weapons
    '9x19-pst': {
        id: '9x19-pst',
        name: '9x19mm Pst',
        shortName: 'Pst',
        description: 'Standard 9mm Parabellum round.',
        type: 'ammo',
        caliber: '9x19',
        penetration: 18, damage: 50, fragmentationChance: 0.15,
        width: 1, height: 1, baseValue: 95, weight: 0.01, icon: '9x19pst'
    },
    '9x19-ap': {
        id: '9x19-ap',
        name: '9x19mm AP 6.3',
        shortName: 'AP 6.3',
        description: 'Armor-piercing 9mm. Effective against Class 3 armor.',
        type: 'ammo',
        caliber: '9x19',
        penetration: 30, damage: 48, fragmentationChance: 0.05,
        width: 1, height: 1, baseValue: 450, weight: 0.01, icon: '9x19ap'
    },
    '762x39-ps': {
        id: '762x39-ps',
        name: '7.62x39mm PS',
        shortName: 'PS',
        description: 'Standard Soviet intermediate cartridge.',
        type: 'ammo',
        caliber: '7.62x39',
        penetration: 32, damage: 57, fragmentationChance: 0.25,
        width: 1, height: 1, baseValue: 280, weight: 0.01, icon: '76239ps'
    },
    '762x39-bp': {
        id: '762x39-bp',
        name: '7.62x39mm BP',
        shortName: 'BP',
        description: 'Armor-piercing 7.62x39. Good against Class 4 armor.',
        type: 'ammo',
        caliber: '7.62x39',
        penetration: 47, damage: 58, fragmentationChance: 0.12,
        width: 1, height: 1, baseValue: 1200, weight: 0.01, icon: '76239bp'
    },
    '762x51-m80': {
        id: '762x51-m80',
        name: '7.62x51mm M80',
        shortName: 'M80',
        description: 'Standard NATO 7.62x51mm battle rifle round.',
        type: 'ammo',
        caliber: '7.62x51',
        penetration: 41, damage: 80, fragmentationChance: 0.17,
        width: 1, height: 1, baseValue: 550, weight: 0.02, icon: '76251m80'
    },
    '762x51-m61': {
        id: '762x51-m61',
        name: '7.62x51mm M61',
        shortName: 'M61',
        description: 'Armor-piercing. Effective against Class 5 armor.',
        type: 'ammo',
        caliber: '7.62x51',
        penetration: 54, damage: 70, fragmentationChance: 0.05,
        width: 1, height: 1, baseValue: 2200, weight: 0.02, icon: '76251m61'
    },
    '46x30-fmjsx': {
        id: '46x30-fmjsx',
        name: '4.6x30mm FMJ SX',
        shortName: 'FMJ SX',
        description: 'MP7 standard round. Small but fast.',
        type: 'ammo',
        caliber: '4.6x30',
        penetration: 33, damage: 43, fragmentationChance: 0.10,
        width: 1, height: 1, baseValue: 380, weight: 0.01, icon: '4630fmjsx'
    },
    '12ga-superformance': {
        id: '12ga-superformance',
        name: '12/70 SuperFormance',
        shortName: 'SuperFormance',
        description: 'High-velocity buckshot. Devastating at close range.',
        type: 'ammo',
        caliber: '12ga',
        penetration: 5, damage: 180, fragmentationChance: 0,
        width: 1, height: 1, baseValue: 85, weight: 0.05, icon: '12gasuper'
    },
    '762x25-pst': {
        id: '762x25-pst',
        name: '7.62x25mm Pst',
        shortName: 'Pst',
        description: 'Fast and flat-shooting pistol cartridge.',
        type: 'ammo',
        caliber: '7.62x25',
        penetration: 28, damage: 58, fragmentationChance: 0.25,
        width: 1, height: 1, baseValue: 120, weight: 0.01, icon: '76225pst'
    },

    // ARMOR
    // CLASS 1 - Early Game Armor
    '6b2': {
        id: '6b2',
        name: '6B2 Armor',
        shortName: '6B2',
        description: 'Soviet-era flak vest. Basic protection.',
        type: 'armor',
        armorClass: 1, maxDurability: 35, material: 'Aramid', protectionZones: ['Thorax'],
        width: 2, height: 2, baseValue: 5500, weight: 2.8, icon: '6b2'
    },
    'paca': {
        id: 'paca',
        name: 'PACA Soft Armor',
        shortName: 'PACA',
        description: 'Police type body armor.',
        type: 'armor',
        armorClass: 2, maxDurability: 50, material: 'Aramid', protectionZones: ['Thorax', 'Stomach'],
        width: 2, height: 2, baseValue: 18000, weight: 3.5, icon: 'paca'
    },
    // CLASS 3 - Mid Tier Armor
    '6b23-1': {
        id: '6b23-1',
        name: '6B23-1 Body Armor',
        shortName: '6B23-1',
        description: 'Ratnik standard issue armor.',
        type: 'armor',
        armorClass: 3, maxDurability: 70, material: 'Ceramic', protectionZones: ['Thorax', 'Stomach'],
        width: 3, height: 3, baseValue: 45000, weight: 6.5, icon: '6b23'
    },
    'trooper-fof': {
        id: 'trooper-fof',
        name: 'Trooper TFO Body Armor',
        shortName: 'Trooper',
        description: 'Light tactical armor.',
        type: 'armor',
        armorClass: 3, maxDurability: 60, material: 'Combined', protectionZones: ['Thorax', 'Stomach'],
        width: 2, height: 3, baseValue: 52000, weight: 5.2, icon: 'trooper'
    },
    '6b13': {
        id: '6b13',
        name: '6B13 Assault Armor',
        shortName: '6B13',
        description: 'Russian assault vest.',
        type: 'armor',
        armorClass: 4, maxDurability: 90, material: 'Ceramic', protectionZones: ['Thorax', 'Stomach'],
        width: 3, height: 3, baseValue: 95000, weight: 8.2, icon: '6b13'
    },
    // CLASS 5 - High Tier Armor
    'korund-vm': {
        id: 'korund-vm',
        name: 'Korund-VM Body Armor',
        shortName: 'Korund',
        description: 'Modern Russian special forces armor.',
        type: 'armor',
        armorClass: 5, maxDurability: 100, material: 'Ceramic', protectionZones: ['Thorax', 'Stomach'],
        width: 3, height: 3, baseValue: 180000, weight: 9.5, icon: 'korund'
    },
    'gen4-hmk': {
        id: 'gen4-hmk',
        name: 'Gen4 HMK Body Armor',
        shortName: 'Gen4 HMK',
        description: 'High mobility Gen4 variant.',
        type: 'armor',
        armorClass: 5, maxDurability: 110, material: 'Combined', protectionZones: ['Thorax', 'Stomach'],
        width: 3, height: 3, baseValue: 220000, weight: 10.0, icon: 'gen4'
    },
    '6b43': {
        id: '6b43',
        name: '6B43 Zabralo-Sh',
        shortName: '6B43',
        description: 'Heavy Russian body armor.',
        type: 'armor',
        armorClass: 6, maxDurability: 130, material: 'Ceramic', protectionZones: ['Thorax', 'Stomach', 'Arms', 'Legs'],
        width: 4, height: 4, baseValue: 380000, weight: 20.0, icon: '6b43'
    },

    // HELMETS - Expanded Variety
    // Class 1-2 Helmets
    'shpm': {
        id: 'shpm',
        name: 'ShPM Firefighter Helmet',
        shortName: 'ShPM',
        description: 'Basic firefighter helmet.',
        type: 'helmet',
        armorClass: 1, maxDurability: 30, material: 'Combined', protectionZones: ['Head'],
        width: 2, height: 2, baseValue: 4500, weight: 1.2, icon: 'shpm'
    },
    'ssh-68': {
        id: 'ssh-68',
        name: 'SSh-68 Steel Helmet',
        shortName: 'SSh-68',
        description: 'Soviet steel helmet.',
        type: 'helmet',
        armorClass: 2, maxDurability: 40, material: 'Steel', protectionZones: ['Head'],
        width: 2, height: 2, baseValue: 12000, weight: 1.5, icon: 'ssh68'
    },
    // Class 3 Helmets
    '6b47': {
        id: '6b47',
        name: '6B47 Ratnik Helmet',
        shortName: '6B47',
        description: 'Modern Russian military helmet.',
        type: 'helmet',
        armorClass: 3, maxDurability: 55, material: 'Combined', protectionZones: ['Head'],
        width: 2, height: 2, baseValue: 35000, weight: 1.3, icon: '6b47'
    },
    'lzsh': {
        id: 'lzsh',
        name: 'LZSh Light Helmet',
        shortName: 'LZSh',
        description: 'Lightweight tactical helmet.',
        type: 'helmet',
        armorClass: 3, maxDurability: 50, material: 'Combined', protectionZones: ['Head'],
        width: 2, height: 2, baseValue: 42000, weight: 1.1, icon: 'lzsh'
    },
    // Class 4 Helmets
    'maska-1sh': {
        id: 'maska-1sh',
        name: 'Maska-1Sh Helmet',
        shortName: 'Maska',
        description: 'Russian heavy helmet.',
        type: 'helmet',
        armorClass: 4, maxDurability: 65, material: 'Steel', protectionZones: ['Head'],
        width: 2, height: 2, baseValue: 120000, weight: 2.6, icon: 'maska'
    },
    'altyn': {
        id: 'altyn',
        name: 'Altyn Helmet',
        shortName: 'Altyn',
        description: 'Russian special forces helmet.',
        type: 'helmet',
        armorClass: 4, maxDurability: 75, material: 'Steel', protectionZones: ['Head', 'Face'],
        width: 2, height: 2, baseValue: 165000, weight: 3.2, icon: 'altyn'
    },
    // Class 5 Helmets
    'tagilla-mask': {
        id: 'tagilla-mask',
        name: 'Tagilla Welding Mask',
        shortName: 'Tagilla Mask',
        description: 'Boss welding mask.',
        type: 'helmet',
        armorClass: 5, maxDurability: 80, material: 'Combined', protectionZones: ['Head', 'Face'],
        width: 2, height: 2, baseValue: 95000, weight: 2.0, icon: 'tagillamask'
    },
    'rys-t': {
        id: 'rys-t',
        name: 'Rys-T Helmet',
        shortName: 'Rys-T',
        description: 'High-tier Russian assault helmet.',
        type: 'helmet',
        armorClass: 5, maxDurability: 85, material: 'Combined', protectionZones: ['Head', 'Face'],
        width: 2, height: 2, baseValue: 145000, weight: 2.8, icon: 'ryst'
    },

    // CHEST RIGS
    'blackrock': {
        id: 'blackrock',
        name: 'BlackRock Chest Rig',
        shortName: 'BlackRock',
        description: 'Compact chest rig with 12 slots.',
        type: 'rig',
        slots: 12,
        width: 2, height: 2, baseValue: 18000, weight: 1.2, icon: 'blackrock'
    },
    'avs': {
        id: 'avs',
        name: 'AVS Chest Rig',
        shortName: 'AVS',
        description: 'Spacious chest rig with 18 slots.',
        type: 'rig',
        slots: 18,
        width: 3, height: 2, baseValue: 42000, weight: 1.8, icon: 'avs'
    },
    'tv110': {
        id: 'tv110',
        name: 'TV-110 Rig',
        shortName: 'TV-110',
        description: 'High-capacity rig with 20 slots.',
        type: 'rig',
        slots: 20,
        width: 3, height: 2, baseValue: 55000, weight: 2.0, icon: 'tv110'
    },
    'mk3': {
        id: 'mk3',
        name: 'TV-110 MK3',
        shortName: 'MK3',
        description: 'Top-tier rig with 24 slots.',
        type: 'rig',
        slots: 24,
        width: 3, height: 2, baseValue: 72000, weight: 2.2, icon: 'mk3'
    },
    'tactec': {
        id: 'tactec',
        name: 'Tactec Plate Carrier',
        shortName: 'Tactec',
        description: 'Plate carrier with integrated armor and 16 slots.',
        type: 'rig',
        armorClass: 4, maxDurability: 70, slots: 16,
        width: 3, height: 2, baseValue: 95000, weight: 3.5, icon: 'tactec'
    },

    // BACKPACKS
    'mbss': {
        id: 'mbss',
        name: 'MBSS Backpack',
        shortName: 'MBSS',
        description: 'Small civilian backpack. 12 slots.',
        type: 'backpack',
        capacity: 12,
        width: 3, height: 3, baseValue: 8500, weight: 0.9, icon: 'mbss'
    },
    'scav-bp': {
        id: 'scav-bp',
        name: 'Scav Backpack',
        shortName: 'Scav BP',
        description: 'Common scavenger backpack. 20 slots.',
        type: 'backpack',
        capacity: 20,
        width: 3, height: 4, baseValue: 22000, weight: 1.4, icon: 'scavbp'
    },
    'trizip': {
        id: 'trizip',
        name: 'Tri-Zip Backpack',
        shortName: 'Tri-Zip',
        description: 'Military-grade backpack. 30 slots.',
        type: 'backpack',
        capacity: 30,
        width: 4, height: 4, baseValue: 45000, weight: 1.8, icon: 'trizip'
    },
    'beta': {
        id: 'beta',
        name: 'Beta Backpack',
        shortName: 'Beta',
        description: 'Large assault backpack. 35 slots.',
        type: 'backpack',
        capacity: 35,
        width: 4, height: 5, baseValue: 68000, weight: 2.2, icon: 'beta'
    },
    'attack2': {
        id: 'attack2',
        name: 'Attack-2 Backpack',
        shortName: 'Attack-2',
        description: 'Raid backpack. Maximum capacity with 42 slots.',
        type: 'backpack',
        capacity: 42,
        width: 5, height: 5, baseValue: 95000, weight: 2.8, icon: 'attack2'
    },

    // MEDICAL
    'ai-2': {
        id: 'ai-2',
        name: 'AI-2 Medkit',
        shortName: 'AI-2',
        description: 'Individual first aid kit.',
        type: 'medical',
        useTime: 2, hpRestored: 50, maxUses: 2,
        width: 1, height: 1, baseValue: 3400, weight: 0.1, icon: 'ai2'
    },
    'salewa': {
        id: 'salewa',
        name: 'Salewa First Aid Kit',
        shortName: 'Salewa',
        description: 'Advanced medical kit.',
        type: 'medical',
        useTime: 4, hpRestored: 400, maxUses: 1,
        width: 2, height: 2, baseValue: 18000, weight: 0.6, icon: 'salewa'
    },
    'ifak': {
        id: 'ifak',
        name: 'IFAK',
        shortName: 'IFAK',
        description: 'Individual First Aid Kit.',
        type: 'medical',
        useTime: 3, hpRestored: 200, maxUses: 1,
        width: 1, height: 1, baseValue: 8500, weight: 0.4, icon: 'ifak'
    },
    'grizzly': {
        id: 'grizzly',
        name: 'Grizzly First Aid Kit',
        shortName: 'Grizzly',
        description: 'Heavy duty medical kit.',
        type: 'medical',
        useTime: 8, hpRestored: 800, maxUses: 1,
        width: 2, height: 2, baseValue: 72000, weight: 1.2, icon: 'grizzly'
    },
    'morphine': {
        id: 'morphine',
        name: 'Morphine Injector',
        shortName: 'Morphine',
        description: 'Pain relief stimulant.',
        type: 'medical',
        useTime: 2, hpRestored: 0, maxUses: 1,
        width: 1, height: 1, baseValue: 18000, weight: 0.05, icon: 'morphine'
    },
    // SURGERY KITS - Restore blacked limbs
    'cms': {
        id: 'cms',
        name: 'CMS Surgical Kit',
        shortName: 'CMS',
        description: 'Compact surgical kit to restore blacked limbs to 50% max HP.',
        type: 'medical',
        useTime: 16, hpRestored: 0, maxUses: 5,
        width: 2, height: 1, baseValue: 45000, weight: 0.4, icon: 'cms'
    },
    'surv12': {
        id: 'surv12',
        name: 'Surv12 Field Surgical Kit',
        shortName: 'Surv12',
        description: 'Advanced surgical kit to restore blacked limbs to 80% max HP.',
        type: 'medical',
        useTime: 20, hpRestored: 0, maxUses: 15,
        width: 2, height: 2, baseValue: 120000, weight: 0.8, icon: 'surv12'
    },
    // TOURNIQUETS - Stop heavy bleeding
    'cat': {
        id: 'cat',
        name: 'CAT Tourniquet',
        shortName: 'CAT',
        description: 'Combat Application Tourniquet. Stops heavy bleeding.',
        type: 'medical',
        useTime: 4, hpRestored: 0, maxUses: 1,
        width: 1, height: 1, baseValue: 8500, weight: 0.1, icon: 'cat'
    },
    'esmarch': {
        id: 'esmarch',
        name: 'Esmarch Tourniquet',
        shortName: 'Esmarch',
        description: 'Soviet rubber tourniquet. Stops heavy bleeding.',
        type: 'medical',
        useTime: 3, hpRestored: 0, maxUses: 1,
        width: 1, height: 1, baseValue: 3200, weight: 0.08, icon: 'esmarch'
    },
    // HEMOSTATS - Alternative to tourniquets
    'hemostat': {
        id: 'hemostat',
        name: 'Hemostat',
        shortName: 'Hemostat',
        description: 'Medical clamp to stop bleeding.',
        type: 'medical',
        useTime: 5, hpRestored: 0, maxUses: 1,
        width: 1, height: 1, baseValue: 15000, weight: 0.05, icon: 'hemostat'
    },
    'quickclot': {
        id: 'quickclot',
        name: 'QuikClot Hemostatic dressing',
        shortName: 'QuikClot',
        description: 'Advanced hemostatic dressing.',
        type: 'medical',
        useTime: 4, hpRestored: 0, maxUses: 1,
        width: 1, height: 1, baseValue: 18000, weight: 0.05, icon: 'quickclot'
    },
    // SPLINTS - Fix fractures
    'splint': {
        id: 'splint',
        name: 'Immobilizing Splint',
        shortName: 'Splint',
        description: 'Used to fix fractures. Takes time to apply.',
        type: 'medical',
        useTime: 10, hpRestored: 0, maxUses: 1,
        width: 1, height: 2, baseValue: 6500, weight: 0.3, icon: 'splint'
    },
    'alu-splint': {
        id: 'alu-splint',
        name: 'Aluminum Splint',
        shortName: 'Alu Splint',
        description: 'Lightweight aluminum splint for fractures.',
        type: 'medical',
        useTime: 8, hpRestored: 0, maxUses: 1,
        width: 1, height: 2, baseValue: 9500, weight: 0.2, icon: 'alusplint'
    },
    // BANDAGES - Stop light bleeding
    'bandage': {
        id: 'bandage',
        name: 'Aseptic Bandage',
        shortName: 'Bandage',
        description: 'Basic bandage for light bleeding.',
        type: 'medical',
        useTime: 2, hpRestored: 0, maxUses: 1,
        width: 1, height: 1, baseValue: 1200, weight: 0.05, icon: 'bandage'
    },
    'army-bandage': {
        id: 'army-bandage',
        name: 'Army Bandage',
        shortName: 'Army Bandage',
        description: 'Military-grade bandage.',
        type: 'medical',
        useTime: 2, hpRestored: 0, maxUses: 1,
        width: 1, height: 1, baseValue: 2500, weight: 0.05, icon: 'armybandage'
    },

    // FOOD
    'tushonka': {
        id: 'tushonka',
        name: 'Can of Beef Tushonka',
        shortName: 'Tushonka',
        description: 'Army rations.',
        type: 'food',
        energyBonus: 40, hydrationBonus: -5,
        width: 1, height: 1, baseValue: 8500, weight: 0.5, icon: 'tushonka'
    },
    'isrkra': {
        id: 'isrkra',
        name: 'Iskra Ration Pack',
        shortName: 'Iskra',
        description: 'Emergency rations.',
        type: 'food',
        energyBonus: 35, hydrationBonus: 0,
        width: 2, height: 1, baseValue: 12500, weight: 0.4, icon: 'isrkra'
    },
    'water': {
        id: 'water',
        name: '0.6L Water Bottle',
        shortName: 'Water',
        description: 'Clean drinking water.',
        type: 'drink',
        energyBonus: 0, hydrationBonus: 35,
        width: 1, height: 2, baseValue: 2800, weight: 0.6, icon: 'water'
    },

    // BARTER ITEMS
    'screws': {
        id: 'screws',
        name: 'Pack of Screws',
        shortName: 'Screws',
        description: 'Construction screws.',
        type: 'barter',
        width: 1, height: 1, baseValue: 2200, weight: 0.4, icon: 'screws'
    },
    'nails': {
        id: 'nails',
        name: 'Pack of Nails',
        shortName: 'Nails',
        description: 'Construction nails.',
        type: 'barter',
        width: 1, height: 1, baseValue: 1800, weight: 0.5, icon: 'nails'
    },
    'gold-chain': {
        id: 'gold-chain',
        name: 'Golden Chain',
        shortName: 'Gold Chain',
        description: 'Valuable jewelry.',
        type: 'barter',
        width: 1, height: 1, baseValue: 42000, weight: 0.05, icon: 'goldchain'
    },
    'bitcoin': {
        id: 'bitcoin',
        name: 'Physical Bitcoin',
        shortName: 'Bitcoin',
        description: '0.2 BTC physical coin.',
        type: 'barter',
        width: 1, height: 1, baseValue: 850000, weight: 0.05, icon: 'bitcoin'
    },
    'roler': {
        id: 'roler',
        name: 'Roler Submariner',
        shortName: 'Roler',
        description: 'Luxury watch.',
        type: 'barter',
        width: 1, height: 1, baseValue: 68000, weight: 0.1, icon: 'roler'
    },
    'armor-repair-kit': {
        id: 'armor-repair-kit',
        name: 'Armor Repair Kit',
        shortName: 'Armor Kit',
        description: 'Used to repair damaged armor.',
        type: 'barter',
        width: 2, height: 2, baseValue: 45000, weight: 2.0, icon: 'armorrepair'
    },
    'weapon-repair-kit': {
        id: 'weapon-repair-kit',
        name: 'Weapon Repair Kit',
        shortName: 'Weapon Kit',
        description: 'Used to repair damaged weapons.',
        type: 'barter',
        width: 2, height: 2, baseValue: 65000, weight: 1.5, icon: 'weaponrepair'
    },

    // KEYS
    'dorms-314': {
        id: 'dorms-314',
        name: 'Dorm Room 314 Key',
        shortName: 'Dorms 314',
        description: 'Key to Customs dorms.',
        type: 'key',
        width: 1, height: 1, baseValue: 45000, weight: 0.01, icon: 'key'
    },
    'marked-key': {
        id: 'marked-key',
        name: 'Marked Key',
        shortName: 'Marked',
        description: 'Mysterious marked key.',
        type: 'key',
        width: 1, height: 1, baseValue: 180000, weight: 0.01, icon: 'markedkey'
    },
    'labs-card': {
        id: 'labs-card',
        name: 'Lab. Blue Keycard',
        shortName: 'Labs Card',
        description: 'Terragroup Labs access.',
        type: 'key',
        width: 1, height: 1, baseValue: 1200000, weight: 0.01, icon: 'labscard'
    },

    // FUEL
    'fuel-small': {
        id: 'fuel-small',
        name: 'Expeditionary Fuel Tank',
        shortName: 'Fuel Tank',
        description: 'Metal fuel tank for generator. 60/60 fuel units.',
        type: 'fuel',
        width: 2, height: 2, baseValue: 85000, weight: 4.5, icon: 'fuel'
    },
    'fuel-big': {
        id: 'fuel-big',
        name: 'Metal Fuel Tank',
        shortName: 'Big Fuel',
        description: 'Large metal fuel tank for generator. 100/100 fuel units.',
        type: 'fuel',
        width: 2, height: 3, baseValue: 140000, weight: 8.0, icon: 'fuel'
    },

    // Merge all Phase 1 expansion items
    ...NEW_WEAPONS,
    ...NEW_AMMO,
    ...NEW_MODS,
    ...NEW_ARMOR,
    ...NEW_MEDICAL,
    ...NEW_PROVISIONS,
    ...NEW_BARTER,
    ...NEW_KEYS,
    // Merge Phase 2 items
    ...PHASE2_NVG_THERMAL,
    ...PHASE2_MELEE,
    ...PHASE2_THROWABLES,
    ...PHASE2_HEADSETS,
    ...PHASE2_SECURE_CONTAINERS,
    // Additional items to reach 400+
    ...ADDITIONAL_ITEMS,
};

// Helper functions
export function getItemById(id: string): Item | undefined {
    return ITEM_DATABASE[id];
}

export function getItemsByType(type: Item['type']): Item[] {
    return Object.values(ITEM_DATABASE).filter(item => item.type === type);
}

export function getItemsByCaliber(caliber: string): Ammo[] {
    return Object.values(ITEM_DATABASE).filter(isAmmo).filter(a => a.caliber === caliber);
}

export function calculateTotalValue(itemIds: string[]): number {
    return itemIds.reduce((total, id) => {
        const item = ITEM_DATABASE[id];
        return total + (item?.baseValue || 0);
    }, 0);
}

/**
 * Check if a mod is compatible with a weapon for a specific slot
 */
export function isModCompatible(
    weapon: Weapon,
    mod: WeaponMod,
    slot: AttachmentSlot
): boolean {
    // First check if the slot matches the mod's slot type
    if (mod.slotType !== slot) {
        return false;
    }

    // If weapon has no compatibility data, assume all mods are compatible
    if (!weapon.compatibleMods) {
        return true;
    }

    // Check if the slot has specific compatibility list
    const compatibleIds = weapon.compatibleMods[slot];
    if (compatibleIds === undefined) {
        // No restrictions defined for this slot
        return true;
    }

    // Check if the mod ID is in the compatible list
    return compatibleIds.length === 0 || compatibleIds.includes(mod.id);
}

/**
 * Armor material types for repair system
 */
export type ArmorMaterial = 'ceramic' | 'steel' | 'titanium' | 'aramid' | 'combined';

/**
 * Repair kit definitions
 */
export interface RepairKit {
    id: string;
    name: string;
    repairAmount: number; // Amount of durability restored
    maxDurabilityLoss: number; // % of max durability lost on repair
    compatibleMaterials: ArmorMaterial[];
    repairSpeed: number; // Multiplier for repair time
    quality: 'basic' | 'standard' | 'advanced' | 'elite';
}

export const REPAIR_KITS: Record<string, RepairKit> = {
    'armor-repair-kit-basic': {
        id: 'armor-repair-kit-basic',
        name: 'Basic Armor Repair Kit',
        repairAmount: 25,
        maxDurabilityLoss: 5, // 5% max durability loss
        compatibleMaterials: ['aramid', 'combined'],
        repairSpeed: 1.0,
        quality: 'basic',
    },
    'armor-repair-kit-standard': {
        id: 'armor-repair-kit-standard',
        name: 'Standard Armor Repair Kit',
        repairAmount: 40,
        maxDurabilityLoss: 3,
        compatibleMaterials: ['aramid', 'combined', 'ceramic'],
        repairSpeed: 1.2,
        quality: 'standard',
    },
    'armor-repair-kit-advanced': {
        id: 'armor-repair-kit-advanced',
        name: 'Advanced Armor Repair Kit',
        repairAmount: 60,
        maxDurabilityLoss: 2,
        compatibleMaterials: ['aramid', 'combined', 'ceramic', 'steel'],
        repairSpeed: 1.5,
        quality: 'advanced',
    },
    'armor-repair-kit-elite': {
        id: 'armor-repair-kit-elite',
        name: 'Elite Armor Repair Kit',
        repairAmount: 80,
        maxDurabilityLoss: 1,
        compatibleMaterials: ['aramid', 'combined', 'ceramic', 'steel', 'titanium'],
        repairSpeed: 2.0,
        quality: 'elite',
    },
};

/**
 * Get material type from armor
 */
export function getArmorMaterial(armor: Armor): ArmorMaterial {
    const material = armor.material.toLowerCase();
    if (material.includes('ceramic')) return 'ceramic';
    if (material.includes('titanium')) return 'titanium';
    if (material.includes('steel')) return 'steel';
    if (material.includes('aramid')) return 'aramid';
    return 'combined';
}

/**
 * Calculate repair result for armor
 */
export function calculateArmorRepair(
    currentDurability: number,
    maxDurability: number,
    repairKit: RepairKit,
    engineeringLevel: number = 1
): {
    newDurability: number;
    newMaxDurability: number;
    actualRepairAmount: number;
} {
    // Apply engineering bonus to repair efficiency
    const engineeringBonus = 1 + ((engineeringLevel - 1) * 0.02); // +2% per level
    const actualRepairAmount = Math.floor(repairKit.repairAmount * engineeringBonus);

    // Calculate max durability loss
    const durabilityLossPercent = Math.max(0, repairKit.maxDurabilityLoss - ((engineeringLevel - 1) * 0.05));
    const durabilityLoss = Math.floor(maxDurability * (durabilityLossPercent / 100));

    const newMaxDurability = Math.max(1, maxDurability - durabilityLoss);
    const newDurability = Math.min(newMaxDurability, currentDurability + actualRepairAmount);

    return {
        newDurability,
        newMaxDurability,
        actualRepairAmount: newDurability - currentDurability,
    };
}

// ============================================================================
// MEDICAL SYSTEM CONSTANTS
// ============================================================================

export interface SurgeryKit {
    id: string;
    name: string;
    restoresToPercent: number; // Percentage of max HP to restore (0.5 = 50%)
    uses: number;
    useTime: number;
}

export const SURGERY_KITS: Record<string, SurgeryKit> = {
    'cms': {
        id: 'cms',
        name: 'CMS Surgical Kit',
        restoresToPercent: 0.5, // 50% max HP
        uses: 5,
        useTime: 16,
    },
    'surv12': {
        id: 'surv12',
        name: 'Surv12 Field Surgical Kit',
        restoresToPercent: 0.8, // 80% max HP
        uses: 15,
        useTime: 20,
    },
};

export interface TourniquetDef {
    id: string;
    name: string;
    useTime: number;
    stopsHeavyBleeding: boolean;
}

export const TOURNIQUETS: Record<string, TourniquetDef> = {
    'cat': {
        id: 'cat',
        name: 'CAT Tourniquet',
        useTime: 4,
        stopsHeavyBleeding: true,
    },
    'esmarch': {
        id: 'esmarch',
        name: 'Esmarch Tourniquet',
        useTime: 3,
        stopsHeavyBleeding: true,
    },
};

export interface HemostatDef {
    id: string;
    name: string;
    useTime: number;
    stopsHeavyBleeding: boolean;
}

export const HEMOSTATS: Record<string, HemostatDef> = {
    'hemostat': {
        id: 'hemostat',
        name: 'Hemostat',
        useTime: 5,
        stopsHeavyBleeding: true,
    },
    'quickclot': {
        id: 'quickclot',
        name: 'QuikClot',
        useTime: 4,
        stopsHeavyBleeding: true,
    },
};

export interface SplintDef {
    id: string;
    name: string;
    useTime: number;
}

export const SPLINTS: Record<string, SplintDef> = {
    'splint': {
        id: 'splint',
        name: 'Immobilizing Splint',
        useTime: 10,
    },
    'alu-splint': {
        id: 'alu-splint',
        name: 'Aluminum Splint',
        useTime: 8,
    },
};

export interface BandageDef {
    id: string;
    name: string;
    useTime: number;
    stopsLightBleeding: boolean;
}

export const BANDAGES: Record<string, BandageDef> = {
    'bandage': {
        id: 'bandage',
        name: 'Aseptic Bandage',
        useTime: 2,
        stopsLightBleeding: true,
    },
    'army-bandage': {
        id: 'army-bandage',
        name: 'Army Bandage',
        useTime: 2,
        stopsLightBleeding: true,
    },
};

// ============================================================================
// WEAPON DURABILITY & MALFUNCTION SYSTEM
// ============================================================================

export interface MalfunctionDef {
    type: MalfunctionType;
    name: string;
    description: string;
    clearTime: number; // Seconds to clear
}

export const MALFUNCTIONS: Record<MalfunctionType, MalfunctionDef> = {
    'jam': {
        type: 'jam',
        name: 'Weapon Jam',
        description: 'Stuck casing, need to clear',
        clearTime: 3,
    },
    'misfire': {
        type: 'misfire',
        name: 'Misfire',
        description: 'Bad primer, click no bang',
        clearTime: 2,
    },
    'failure_to_feed': {
        type: 'failure_to_feed',
        name: 'Failure to Feed',
        description: 'Round didn\'t chamber',
        clearTime: 2.5,
    },
    'failure_to_eject': {
        type: 'failure_to_eject',
        name: 'Failure to Eject',
        description: 'Spent casing stuck',
        clearTime: 3.5,
    },
};

/**
 * Calculate jam chance based on weapon durability
 * Returns probability 0-1
 */
export function calculateJamChance(durability: number): number {
    if (durability >= 90) return 0.001;      // 0.1%
    if (durability >= 70) return 0.005;      // 0.5%
    if (durability >= 50) return 0.02;       // 2%
    if (durability >= 30) return 0.05;       // 5%
    if (durability >= 10) return 0.10;       // 10%
    return 0.20;                              // 20%
}

/**
 * Calculate misfire chance based on weapon durability
 */
export function calculateMisfireChance(durability: number): number {
    if (durability >= 70) return 0;
    if (durability >= 50) return 0.005;      // 0.5%
    if (durability >= 30) return 0.015;      // 1.5%
    if (durability >= 10) return 0.03;       // 3%
    return 0.08;                              // 8%
}

/**
 * Calculate failure to feed chance based on weapon durability
 */
export function calculateFailureToFeedChance(durability: number): number {
    if (durability >= 50) return 0;
    if (durability >= 30) return 0.005;      // 0.5%
    if (durability >= 10) return 0.015;      // 1.5%
    return 0.05;                              // 5%
}

/**
 * Calculate failure to eject chance based on weapon durability
 */
export function calculateFailureToEjectChance(durability: number): number {
    if (durability >= 30) return 0;
    if (durability >= 10) return 0.01;       // 1%
    return 0.04;                              // 4%
}

/**
 * Roll for weapon malfunction based on durability
 * Returns the malfunction type or null if no malfunction
 */
export function rollForMalfunction(durability: number): MalfunctionType | null {
    const rand = Math.random();

    // Check for jam first (most common)
    const jamChance = calculateJamChance(durability);
    if (rand < jamChance) return 'jam';

    // Check for misfire
    const misfireChance = calculateMisfireChance(durability);
    if (rand < jamChance + misfireChance) return 'misfire';

    // Check for failure to feed
    const feedChance = calculateFailureToFeedChance(durability);
    if (rand < jamChance + misfireChance + feedChance) return 'failure_to_feed';

    // Check for failure to eject
    const ejectChance = calculateFailureToEjectChance(durability);
    if (rand < jamChance + misfireChance + feedChance + ejectChance) return 'failure_to_eject';

    return null;
}

// ============================================================================
// WEIGHT SYSTEM CONSTANTS
// ============================================================================

export type WeightThreshold = 'light' | 'medium' | 'heavy' | 'overloaded' | 'encumbered';

export interface WeightThresholdDef {
    threshold: WeightThreshold;
    minWeight: number;
    maxWeight: number;
    speedModifier: number;
    staminaDrainMultiplier: number;
    jumpHeightModifier: number;
    fallDamageMultiplier: number;
    footstepVolumeMultiplier: number;
    canSprint: boolean;
}

export const WEIGHT_THRESHOLDS: WeightThresholdDef[] = [
    {
        threshold: 'light',
        minWeight: 0,
        maxWeight: 20,
        speedModifier: 1.0,
        staminaDrainMultiplier: 1.0,
        jumpHeightModifier: 1.0,
        fallDamageMultiplier: 1.0,
        footstepVolumeMultiplier: 1.0,
        canSprint: true,
    },
    {
        threshold: 'medium',
        minWeight: 20,
        maxWeight: 35,
        speedModifier: 0.9,
        staminaDrainMultiplier: 1.2,
        jumpHeightModifier: 0.9,
        fallDamageMultiplier: 1.2,
        footstepVolumeMultiplier: 1.3,
        canSprint: true,
    },
    {
        threshold: 'heavy',
        minWeight: 35,
        maxWeight: 50,
        speedModifier: 0.75,
        staminaDrainMultiplier: 1.5,
        jumpHeightModifier: 0.75,
        fallDamageMultiplier: 1.5,
        footstepVolumeMultiplier: 1.6,
        canSprint: true,
    },
    {
        threshold: 'overloaded',
        minWeight: 50,
        maxWeight: 70,
        speedModifier: 0.5,
        staminaDrainMultiplier: 2.0,
        jumpHeightModifier: 0.5,
        fallDamageMultiplier: 2.0,
        footstepVolumeMultiplier: 2.0,
        canSprint: false,
    },
    {
        threshold: 'encumbered',
        minWeight: 70,
        maxWeight: Infinity,
        speedModifier: 0.25,
        staminaDrainMultiplier: 3.0,
        jumpHeightModifier: 0.25,
        fallDamageMultiplier: 3.0,
        footstepVolumeMultiplier: 2.5,
        canSprint: false,
    },
];

/**
 * Get weight threshold for a given weight in kg
 */
export function getWeightThreshold(weight: number): WeightThresholdDef {
    for (const threshold of WEIGHT_THRESHOLDS) {
        if (weight >= threshold.minWeight && weight < threshold.maxWeight) {
            return threshold;
        }
    }
    return WEIGHT_THRESHOLDS[WEIGHT_THRESHOLDS.length - 1]!;
}

/**
 * Calculate total weight from inventory items
 */
export function calculateTotalWeight(items: { itemId: string; quantity: number }[]): number {
    return items.reduce((total, item) => {
        const itemData = ITEM_DATABASE[item.itemId];
        if (!itemData) return total;
        return total + (itemData.weight * item.quantity);
    }, 0);
}

// ============================================================================
// STAMINA SYSTEM CONSTANTS
// ============================================================================

export const STAMINA_CONSTANTS = {
    MAX_STAMINA: 100,
    SPRINT_DRAIN_PER_SEC: 10,
    WALK_DRAIN_PER_SEC: 0.5,
    STAND_RECOVERY_PER_SEC: 2,
    MIN_SPRINT_STAMINA: 20, // Cannot sprint below this
    LOW_STAMINA_THRESHOLD: 20,
    CRITICAL_STAMINA_THRESHOLD: 10,
    ENDURANCE_BONUS_PER_LEVEL: 0.01, // +1% max stamina per level
    ENDURANCE_DRAIN_REDUCTION_PER_LEVEL: 0.005, // -0.5% drain per level
};

/**
 * Calculate max stamina based on endurance skill level
 */
export function calculateMaxStamina(enduranceLevel: number): number {
    const bonus = (enduranceLevel - 1) * STAMINA_CONSTANTS.ENDURANCE_BONUS_PER_LEVEL;
    return STAMINA_CONSTANTS.MAX_STAMINA * (1 + bonus);
}

/**
 * Calculate sprint drain rate based on endurance skill
 */
export function calculateSprintDrain(enduranceLevel: number): number {
    const reduction = (enduranceLevel - 1) * STAMINA_CONSTANTS.ENDURANCE_DRAIN_REDUCTION_PER_LEVEL;
    return STAMINA_CONSTANTS.SPRINT_DRAIN_PER_SEC * (1 - reduction);
}

// ============================================================================
// RECOIL SYSTEM CONSTANTS
// ============================================================================

export const RECOIL_CONSTANTS = {
    FIRST_SHOT_MULTIPLIER: 1.5,
    PROGRESSIVE_BUILDUP_PER_SHOT: 0.1,
    MAX_PROGRESSIVE_BUILDUP: 2.0,
    RECOIL_RECOVERY_PER_SEC: 0.3,
    RECOIL_CONTROL_BONUS_PER_LEVEL: 0.01, // -1% vertical per level
    RECOIL_CONTROL_HORIZONTAL_BONUS_PER_LEVEL: 0.005, // -0.5% horizontal per level
};

/**
 * Calculate recoil modifiers based on Recoil Control skill
 */
export function calculateRecoilModifiers(recoilControlLevel: number): {
    verticalModifier: number;
    horizontalModifier: number;
    recoverySpeedModifier: number;
} {
    const verticalReduction = recoilControlLevel * RECOIL_CONSTANTS.RECOIL_CONTROL_BONUS_PER_LEVEL;
    const horizontalReduction = recoilControlLevel * RECOIL_CONSTANTS.RECOIL_CONTROL_HORIZONTAL_BONUS_PER_LEVEL;

    return {
        verticalModifier: Math.max(0.5, 1 - verticalReduction),
        horizontalModifier: Math.max(0.7, 1 - horizontalReduction),
        recoverySpeedModifier: 1 + (recoilControlLevel * 0.02),
    };
}

// ============================================================================
// HELMET VISOR SYSTEM
// ============================================================================

export interface VisorDef {
    armorClass: number;
    durability: number;
    visionPenalty: number; // 0-1 (0 = no penalty, 1 = complete blackout)
}

export const HELMET_VISORS: Record<string, VisorDef> = {
    'altyn': {
        armorClass: 4,
        durability: 50,
        visionPenalty: 0.15,
    },
    'tagilla-mask': {
        armorClass: 5,
        durability: 80,
        visionPenalty: 0.35,
    },
    'rys-t': {
        armorClass: 5,
        durability: 60,
        visionPenalty: 0.20,
    },
};

// ============================================================================
// PAINKILLER ADDICTION SYSTEM
// ============================================================================

export const PAINKILLER_CONSTANTS = {
    ADDICTION_WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    ADDICTION_THRESHOLD_USES: 3,
    WITHDRAWAL_DURATION_MS: 10 * 60 * 1000, // 10 minutes
    TREMOR_CHANCE_BASE: 0.3,
    TUNNEL_VISION_PENALTY: 0.25,
    STAMINA_PENALTY: 0.2,
};

export interface PainkillerEffect {
    duration: number; // in seconds
    addictionRisk: number; // 0-1 probability
}

export const PAINKILLER_EFFECTS: Record<string, PainkillerEffect> = {
    'morphine': {
        duration: 15 * 60, // 15 minutes
        addictionRisk: 0.4,
    },
    'ibuprofen': {
        duration: 5 * 60, // 5 minutes
        addictionRisk: 0.1,
    },
    'augmentin': {
        duration: 10 * 60, // 10 minutes
        addictionRisk: 0.05,
    },
};
