import type { Quest } from './types';

export const INITIAL_QUESTS: Quest[] = [
  // Prapor Quests
  {
    id: 'quest-debut',
    traderId: 'prapor',
    title: 'Debut',
    description: 'Welcome to Tarkov, operative. We need to test your combat capabilities. Eliminate hostiles in the field and report back.',
    minLevel: 1,
    status: 'available',
    objectives: [
      { type: 'kill', target: 'scav', current: 0, required: 5 },
      { type: 'extract', target: 'any', current: 0, required: 3 },
    ],
    rewards: {
      roubles: 10000,
      xp: 500,
      items: [{ itemId: 'ak-74', quantity: 1 }],
    },
  },
  {
    id: 'quest-search-mission',
    traderId: 'prapor',
    title: 'Search Mission',
    description: 'We need supplies. Search the area for valuable items and bring them back.',
    minLevel: 2,
    status: 'available',
    objectives: [
      { type: 'find', target: 'tushonka', current: 0, required: 3 },
      { type: 'find', target: 'screws', current: 0, required: 5 },
    ],
    rewards: {
      roubles: 15000,
      xp: 800,
    },
  },
  {
    id: 'quest-shootout-picnic',
    traderId: 'prapor',
    title: 'Shootout Picnic',
    description: 'The area near the Customs is heating up. Show them who controls the territory.',
    minLevel: 3,
    status: 'available',
    objectives: [
      { type: 'kill', target: 'scav', current: 0, required: 15 },
      { type: 'extract', target: 'customs', current: 0, required: 5 },
    ],
    rewards: {
      roubles: 25000,
      xp: 1500,
      items: [{ itemId: '6b23-1', quantity: 1 }],
    },
  },
  {
    id: 'quest-operation-aurora',
    traderId: 'prapor',
    title: 'Operation Aurora',
    description: 'A high-priority operation requires experienced operators. Reach the required level and prove your worth.',
    minLevel: 5,
    status: 'available',
    objectives: [
      { type: 'level', target: 'character', current: 0, required: 10 },
      { type: 'kill', target: 'any', current: 0, required: 20 },
    ],
    rewards: {
      roubles: 50000,
      xp: 3000,
      items: [{ itemId: 'rpk-16', quantity: 1 }],
    },
  },
  // Therapist Quests
  {
    id: 'quest-shortage',
    traderId: 'therapist',
    title: 'Shortage',
    description: 'Medical supplies are running low. I need you to find basic medical items in the field.',
    minLevel: 1,
    status: 'available',
    objectives: [
      { type: 'find', target: 'ai-2', current: 0, required: 5 },
      { type: 'find', target: 'bandage', current: 0, required: 3 },
    ],
    rewards: {
      roubles: 8000,
      xp: 600,
      items: [{ itemId: 'salewa', quantity: 2 }],
    },
  },
  {
    id: 'quest-sanitary-standards',
    traderId: 'therapist',
    title: 'Sanitary Standards',
    description: 'We need better medical supplies for the wounded. Find advanced medical items.',
    minLevel: 4,
    status: 'available',
    objectives: [
      { type: 'find', target: 'morphine', current: 0, required: 3 },
      { type: 'find', target: 'salewa', current: 0, required: 5 },
    ],
    rewards: {
      roubles: 20000,
      xp: 1200,
      items: [{ itemId: 'ifak', quantity: 3 }],
    },
  },
  {
    id: 'quest-hippocratic-vow',
    traderId: 'therapist',
    title: 'Hippocratic Vow',
    description: 'As a medic, you must learn to survive. Extract from raids while maintaining your health.',
    minLevel: 5,
    status: 'available',
    objectives: [
      { type: 'extract', target: 'any', current: 0, required: 10 },
      { type: 'find', target: 'cms', current: 0, required: 1 },
    ],
    rewards: {
      roubles: 35000,
      xp: 2000,
      items: [{ itemId: 'grizzly', quantity: 1 }],
    },
  },
  // Mechanic Quests
  {
    id: 'quest-gunsmith-part1',
    traderId: 'mechanic',
    title: 'Gunsmith - Part 1',
    description: 'Every operator should know their weapon. Find and modify an AK-74 to specifications.',
    minLevel: 2,
    status: 'available',
    objectives: [
      { type: 'find', target: 'ak-74', current: 0, required: 1 },
      { type: 'find', target: 'okp-7', current: 0, required: 1 },
      { type: 'find', target: 'rk-3', current: 0, required: 1 },
    ],
    rewards: {
      roubles: 15000,
      xp: 1000,
      items: [{ itemId: 'suppressor-545', quantity: 1 }],
    },
  },
  {
    id: 'quest-gunsmith-part2',
    traderId: 'mechanic',
    title: 'Gunsmith - Part 2',
    description: 'Now let\'s work on an M4 platform. Find the components and assemble a proper rifle.',
    minLevel: 5,
    status: 'available',
    objectives: [
      { type: 'find', target: 'm4a1', current: 0, required: 1 },
      { type: 'find', target: 'eotech-xps3', current: 0, required: 1 },
      { type: 'find', target: '556x45-m855', current: 0, required: 120 },
    ],
    rewards: {
      roubles: 30000,
      xp: 2000,
      items: [{ itemId: 'hk416', quantity: 1 }],
    },
  },
  {
    id: 'quest-scout',
    traderId: 'mechanic',
    title: 'Scout',
    description: 'Knowledge of the terrain is crucial. Visit different locations and gather intel.',
    minLevel: 3,
    status: 'available',
    objectives: [
      { type: 'extract', target: 'customs', current: 0, required: 3 },
      { type: 'extract', target: 'woods', current: 0, required: 3 },
    ],
    rewards: {
      roubles: 18000,
      xp: 1500,
      items: [{ itemId: '6b47', quantity: 1 }],
    },
  },
  // Skier Quests
  {
    id: 'quest-supplier',
    traderId: 'skier',
    title: 'Supplier',
    description: 'I need you to gather some items for my clients. Focus on barter goods.',
    minLevel: 1,
    status: 'available',
    objectives: [
      { type: 'find', target: 'gold-chain', current: 0, required: 2 },
      { type: 'find', target: 'roler', current: 0, required: 1 },
    ],
    rewards: {
      roubles: 25000,
      xp: 1000,
      items: [{ itemId: 'mbss', quantity: 1 }],
    },
  },
  {
    id: 'quest-secure-container',
    traderId: 'skier',
    title: 'The Courier',
    description: 'Transport valuable items safely. Extract with high-value loot.',
    minLevel: 5,
    status: 'available',
    objectives: [
      { type: 'extract', target: 'any', current: 0, required: 5 },
      { type: 'find', target: 'marked-key', current: 0, required: 1 },
    ],
    rewards: {
      roubles: 45000,
      xp: 2500,
      items: [{ itemId: 'scav-bp', quantity: 1 }],
    },
  },
  {
    id: 'quest-bullshit',
    traderId: 'skier',
    title: 'Bullshit',
    description: 'Sometimes you need to improvise. Survive under difficult conditions.',
    minLevel: 7,
    status: 'available',
    objectives: [
      { type: 'kill', target: 'scav', current: 0, required: 20 },
      { type: 'extract', target: 'any', current: 0, required: 8 },
    ],
    rewards: {
      roubles: 50000,
      xp: 3000,
      items: [{ itemId: 'trizip', quantity: 1 }],
    },
  },
  // Peacekeeper Quests
  {
    id: 'quest-fishing-gear',
    traderId: 'peacekeeper',
    title: 'Fishing Gear',
    description: 'We need to identify NATO equipment in the field. Find Western weapons.',
    minLevel: 3,
    status: 'available',
    objectives: [
      { type: 'find', target: 'm4a1', current: 0, required: 2 },
      { type: 'find', target: 'glock17', current: 0, required: 3 },
    ],
    rewards: {
      roubles: 20000,
      xp: 1200,
      items: [{ itemId: '556x45-m855', quantity: 120 }],
    },
  },
  {
    id: 'quest-terror-stopper',
    traderId: 'peacekeeper',
    title: 'Terror Stopper',
    description: 'Hostile forces are threatening the peacekeeping mission. Eliminate threats.',
    minLevel: 5,
    status: 'available',
    objectives: [
      { type: 'kill', target: 'any', current: 0, required: 25 },
      { type: 'extract', target: 'any', current: 0, required: 10 },
    ],
    rewards: {
      roubles: 40000,
      xp: 2500,
      items: [{ itemId: 'mp5', quantity: 1 }],
    },
  },
  {
    id: 'quest-humanitarian-supplies',
    traderId: 'peacekeeper',
    title: 'Humanitarian Supplies',
    description: 'Civilian population needs aid. Gather food and medical supplies.',
    minLevel: 4,
    status: 'available',
    objectives: [
      { type: 'find', target: 'tushonka', current: 0, required: 10 },
      { type: 'find', target: 'water', current: 0, required: 5 },
      { type: 'find', target: 'ai-2', current: 0, required: 5 },
    ],
    rewards: {
      roubles: 30000,
      xp: 1800,
      items: [{ itemId: 'trooper-fof', quantity: 1 }],
    },
  },
  // Master Quest (Endgame)
  {
    id: 'quest-the-guide',
    traderId: 'prapor',
    title: 'The Guide',
    description: 'The ultimate test of an operator. Complete raids on all available territories.',
    minLevel: 20,
    status: 'available',
    objectives: [
      { type: 'extract', target: 'customs', current: 0, required: 10 },
      { type: 'extract', target: 'woods', current: 0, required: 10 },
      { type: 'extract', target: 'zero-dam', current: 0, required: 5 },
      { type: 'extract', target: 'layali-grove', current: 0, required: 3 },
    ],
    rewards: {
      roubles: 200000,
      xp: 10000,
      items: [
        { itemId: 'm249', quantity: 1 },
        { itemId: '6b43', quantity: 1 },
      ],
    },
  },
];

// Helper functions
export function getQuestsByTrader(traderId: string): Quest[] {
  return INITIAL_QUESTS.filter(q => q.traderId === traderId);
}

export function getAvailableQuests(level: number): Quest[] {
  return INITIAL_QUESTS.filter(q => q.minLevel <= level && q.status === 'available');
}

export function getQuestById(id: string): Quest | undefined {
  return INITIAL_QUESTS.find(q => q.id === id);
}
