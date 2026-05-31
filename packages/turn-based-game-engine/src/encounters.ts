// src/lib/game/encounters.ts

export type EncounterType = 'combat' | 'loot' | 'nothing' | 'scavenge' | 'extraction';

export interface Encounter {
    id: string;
    type: EncounterType;
    description: string;
    chance: number; // 0-1
    minTime: number; // seconds into raid
}

export const MAP_ENCOUNTERS: Record<string, Encounter[]> = {
    'customs': [
        { id: 'customs-scav-1', type: 'combat', description: 'A scav is patrolling near the warehouses.', chance: 0.4, minTime: 60 },
        { id: 'customs-loot-1', type: 'loot', description: 'You found a discarded sports bag.', chance: 0.6, minTime: 30 },
        { id: 'customs-nothing-1', type: 'nothing', description: 'Area seems clear. Moving fast.', chance: 1.0, minTime: 0 },
        { id: 'customs-extract', type: 'extraction', description: 'Checkpoint reached. Extraction point available.', chance: 1.0, minTime: 180 },
    ],
    'zero-dam': [
        { id: 'zd-saeed', type: 'combat', description: 'Guard Captain Saeed spotted in the Administrative Center!', chance: 0.1, minTime: 300 },
        { id: 'zd-scav-1', type: 'combat', description: 'Zero Dam guards are vigilant.', chance: 0.6, minTime: 60 },
    ],
    'woods': [
        { id: 'woods-shturman', type: 'combat', description: 'Shturman and his guards spotted at the lumber camp!', chance: 0.08, minTime: 240 },
        { id: 'woods-scav-1', type: 'combat', description: 'Scavs are hunting in the forest clearing.', chance: 0.5, minTime: 60 },
        { id: 'woods-loot-1', type: 'loot', description: 'You found a hidden stash in a hollow tree.', chance: 0.4, minTime: 45 },
        { id: 'woods-scavenge-1', type: 'scavenge', description: 'Mushrooms and berries are growing here.', chance: 0.6, minTime: 30 },
        { id: 'woods-sniper', type: 'combat', description: 'A sniper is positioned in the treeline!', chance: 0.25, minTime: 120 },
        { id: 'woods-nothing-1', type: 'nothing', description: 'The forest is quiet. Too quiet.', chance: 1.0, minTime: 0 },
        { id: 'woods-extract', type: 'extraction', description: 'Outskirts extraction point is nearby.', chance: 1.0, minTime: 240 },
    ],
    'layali-grove': [
        { id: 'lg-scav-1', type: 'combat', description: 'Local militia patrols the oasis.', chance: 0.55, minTime: 60 },
        { id: 'lg-loot-1', type: 'loot', description: 'You found an abandoned merchant cart.', chance: 0.45, minTime: 40 },
        { id: 'lg-scavenge-1', type: 'scavenge', description: 'Date palms provide some sustenance.', chance: 0.5, minTime: 25 },
        { id: 'lg-raider-1', type: 'combat', description: 'Desert raiders ambush from the dunes!', chance: 0.35, minTime: 90 },
        { id: 'lg-nothing-1', type: 'nothing', description: 'The desert heat shimmers on the horizon.', chance: 1.0, minTime: 0 },
        { id: 'lg-extract', type: 'extraction', description: 'Desert road extraction is clear.', chance: 1.0, minTime: 300 },
    ]
};
