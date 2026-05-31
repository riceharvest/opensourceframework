import type { Trader } from './types';

export const INITIAL_TRADERS: Record<string, Trader> = {
  'prapor': {
    id: 'prapor',
    name: 'Prapor',
    description: 'Quartermaster for the local authorities. Deals in weapons, ammunition, and military gear. A reliable source for Eastern bloc equipment.',
    loyaltyLevel: 1,
    reputation: 0,
    salesVolume: 0,
    inventory: [
      // Level 1 - Basic Gear
      { itemId: 'ak-74', price: 22000, requiredLoyalty: 1 },
      { itemId: 'pm-pistol', price: 4500, requiredLoyalty: 1 },
      { itemId: '545x39-ps', price: 210, requiredLoyalty: 1 },
      { itemId: '9x18mm-pst', price: 45, requiredLoyalty: 1 },
      { itemId: 'paca', price: 18000, requiredLoyalty: 1 },
      { itemId: 'ssh-68', price: 12000, requiredLoyalty: 1 },
      { itemId: 'ai-2', price: 3400, requiredLoyalty: 1 },
      { itemId: '6b2', price: 5500, requiredLoyalty: 1 },
      // Level 2 - Intermediate
      { itemId: 'akm', price: 42000, requiredLoyalty: 2 },
      { itemId: '6b23-1', price: 45000, requiredLoyalty: 2 },
      { itemId: '6b47', price: 35000, requiredLoyalty: 2 },
      { itemId: '545x39-bp', price: 850, requiredLoyalty: 2 },
      { itemId: '762x39-ps', price: 280, requiredLoyalty: 2 },
      { itemId: 'rk-3', price: 8000, requiredLoyalty: 2 },
      { itemId: 'okp-7', price: 12000, requiredLoyalty: 2 },
      { itemId: 'suppressor-545', price: 35000, requiredLoyalty: 2 },
      // Level 3 - Advanced
      { itemId: 'rpk-16', price: 85000, requiredLoyalty: 3 },
      { itemId: 'svds', price: 75000, requiredLoyalty: 3 },
      { itemId: '6b13', price: 95000, requiredLoyalty: 3 },
      { itemId: 'maska-1sh', price: 120000, requiredLoyalty: 3 },
      { itemId: '545x39-bt', price: 650, requiredLoyalty: 3 },
      { itemId: '762x39-bp', price: 1200, requiredLoyalty: 3 },
      // Level 4 - Elite
      { itemId: 'ash-12', price: 120000, requiredLoyalty: 4 },
      { itemId: 'vss', price: 95000, requiredLoyalty: 4 },
      { itemId: 'korund-vm', price: 180000, requiredLoyalty: 4 },
      { itemId: 'altyn', price: 165000, requiredLoyalty: 4 },
      { itemId: '545x39-igolnik', price: 2800, requiredLoyalty: 4 },
      { itemId: '9x39-sp6', price: 1800, requiredLoyalty: 4 },
    ],
  },
  'therapist': {
    id: 'therapist',
    name: 'Therapist',
    description: 'Head of medical services. Provides medical supplies, stimulants, and health-related services. Essential for survival in the field.',
    loyaltyLevel: 1,
    reputation: 0,
    salesVolume: 0,
    inventory: [
      // Level 1 - Basic Medical
      { itemId: 'ai-2', price: 3200, requiredLoyalty: 1 },
      { itemId: 'bandage', price: 1200, requiredLoyalty: 1 },
      { itemId: 'splint', price: 6500, requiredLoyalty: 1 },
      { itemId: 'water', price: 2800, requiredLoyalty: 1 },
      // Level 2 - Intermediate
      { itemId: 'salewa', price: 16500, requiredLoyalty: 2 },
      { itemId: 'ifak', price: 7800, requiredLoyalty: 2 },
      { itemId: 'esmarch', price: 3200, requiredLoyalty: 2 },
      { itemId: 'cat', price: 8500, requiredLoyalty: 2 },
      { itemId: 'army-bandage', price: 2500, requiredLoyalty: 2 },
      { itemId: 'alu-splint', price: 9500, requiredLoyalty: 2 },
      // Level 3 - Advanced
      { itemId: 'grizzly', price: 68000, requiredLoyalty: 3 },
      { itemId: 'morphine', price: 16500, requiredLoyalty: 3 },
      { itemId: 'hemostat', price: 15000, requiredLoyalty: 3 },
      { itemId: 'quickclot', price: 18000, requiredLoyalty: 3 },
      { itemId: 'cms', price: 45000, requiredLoyalty: 3 },
      // Level 4 - Elite
      { itemId: 'surv12', price: 120000, requiredLoyalty: 4 },
    ],
  },
  'mechanic': {
    id: 'mechanic',
    name: 'Mechanic',
    description: 'Former electronics and engineering specialist. Offers weapon modifications, containers, and technical equipment. Master of customization.',
    loyaltyLevel: 1,
    reputation: 0,
    salesVolume: 0,
    inventory: [
      // Level 1 - Basic Mods
      { itemId: 'screws', price: 2200, requiredLoyalty: 1 },
      { itemId: 'nails', price: 1800, requiredLoyalty: 1 },
      { itemId: 'weapon-repair-kit', price: 65000, requiredLoyalty: 1 },
      // Level 2 - Intermediate
      { itemId: 'armor-repair-kit', price: 45000, requiredLoyalty: 2 },
      { itemId: 'eotech-xps3', price: 28000, requiredLoyalty: 2 },
      { itemId: 'rk2', price: 12000, requiredLoyalty: 2 },
      { itemId: 'afg', price: 8500, requiredLoyalty: 2 },
      { itemId: 'moe', price: 15000, requiredLoyalty: 2 },
      // Level 3 - Advanced
      { itemId: 'm4a1', price: 55000, requiredLoyalty: 3 },
      { itemId: 'hk416', price: 95000, requiredLoyalty: 3 },
      { itemId: 'pso1', price: 22000, requiredLoyalty: 3 },
      { itemId: 'saker762', price: 55000, requiredLoyalty: 3 },
      { itemId: 'zhukov', price: 22000, requiredLoyalty: 3 },
      // Level 4 - Elite
      { itemId: 'saiga-12', price: 28000, requiredLoyalty: 4 },
      { itemId: 'dvl10', price: 88000, requiredLoyalty: 4 },
      { itemId: 'nt4', price: 48000, requiredLoyalty: 4 },
      { itemId: 'pmag60', price: 35000, requiredLoyalty: 4 },
      { itemId: 'akdrum', price: 42000, requiredLoyalty: 4 },
    ],
  },
  'skier': {
    id: 'skier',
    name: 'Skier',
    description: 'Supplier of Western equipment and containers. Deals in armor, rigs, backpacks, and barter items. Good prices for quality gear.',
    loyaltyLevel: 1,
    reputation: 0,
    salesVolume: 0,
    inventory: [
      // Level 1 - Basic Gear
      { itemId: 'mbss', price: 8500, requiredLoyalty: 1 },
      { itemId: 'blackrock', price: 18000, requiredLoyalty: 1 },
      { itemId: 'tushonka', price: 8500, requiredLoyalty: 1 },
      { itemId: 'isrkra', price: 12500, requiredLoyalty: 1 },
      // Level 2 - Intermediate
      { itemId: 'scav-bp', price: 22000, requiredLoyalty: 2 },
      { itemId: 'avs', price: 42000, requiredLoyalty: 2 },
      { itemId: 'trooper-fof', price: 52000, requiredLoyalty: 2 },
      { itemId: 'lzsh', price: 42000, requiredLoyalty: 2 },
      { itemId: 'dorms-314', price: 45000, requiredLoyalty: 2 },
      // Level 3 - Advanced
      { itemId: 'trizip', price: 45000, requiredLoyalty: 3 },
      { itemId: 'tv110', price: 55000, requiredLoyalty: 3 },
      { itemId: 'gen4-hmk', price: 220000, requiredLoyalty: 3 },
      { itemId: 'tagilla-mask', price: 95000, requiredLoyalty: 3 },
      { itemId: 'marked-key', price: 180000, requiredLoyalty: 3 },
      // Level 4 - Elite
      { itemId: 'beta', price: 68000, requiredLoyalty: 4 },
      { itemId: 'attack2', price: 95000, requiredLoyalty: 4 },
      { itemId: 'mk3', price: 72000, requiredLoyalty: 4 },
      { itemId: 'tactec', price: 95000, requiredLoyalty: 4 },
      { itemId: 'rys-t', price: 145000, requiredLoyalty: 4 },
      { itemId: 'labs-card', price: 1200000, requiredLoyalty: 4 },
    ],
  },
  'peacekeeper': {
    id: 'peacekeeper',
    name: 'Peacekeeper',
    description: 'UN peacekeeping forces quartermaster. Specializes in NATO weapons, dollars transactions, and high-end Western equipment.',
    loyaltyLevel: 1,
    reputation: 0,
    salesVolume: 0,
    inventory: [
      // Level 1 - Basic Western
      { itemId: 'glock17', price: 8500, requiredLoyalty: 1 },
      { itemId: '9x19-pst', price: 95, requiredLoyalty: 1 },
      { itemId: '556x45-m855', price: 180, requiredLoyalty: 1 },
      // Level 2 - Intermediate
      { itemId: 'mp5', price: 38000, requiredLoyalty: 2 },
      { itemId: 'mp153', price: 28000, requiredLoyalty: 2 },
      { itemId: '556x45-m855a1', price: 1200, requiredLoyalty: 2 },
      { itemId: '9x19-ap', price: 450, requiredLoyalty: 2 },
      // Level 3 - Advanced
      { itemId: 'mp7', price: 65000, requiredLoyalty: 3 },
      { itemId: 'vector', price: 72000, requiredLoyalty: 3 },
      { itemId: '556x45-m995', price: 3500, requiredLoyalty: 3 },
      { itemId: '762x51-m80', price: 550, requiredLoyalty: 3 },
      // Level 4 - Elite
      { itemId: 'm249', price: 180000, requiredLoyalty: 4 },
      { itemId: 'sv-98', price: 18000, requiredLoyalty: 4 },
      { itemId: '762x51-m61', price: 2200, requiredLoyalty: 4 },
      { itemId: '6b43', price: 380000, requiredLoyalty: 4 },
    ],
  },
};

// Helper function to get trader by ID
export function getTrader(id: string): Trader | undefined {
  return INITIAL_TRADERS[id];
}

// Helper to get all traders as array
export function getAllTraders(): Trader[] {
  return Object.values(INITIAL_TRADERS);
}
