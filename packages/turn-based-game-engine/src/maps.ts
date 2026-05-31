// src/lib/game/maps.ts

export interface GameMap {
    id: string;
    name: string;
    description: string;
    difficulty: 'easy' | 'normal' | 'hard' | 'insane';
    estimatedDuration: number; // minutes
    enemyCount: number;
    lootMultiplier: number;
    unlockedAtLevel: number;
    image: string;
}

export const MAP_DATABASE: GameMap[] = [
    {
        id: 'customs',
        name: 'Customs',
        description: 'A large industrial area with many points of interest. Balanced mix of close quarters and medium range engagements.',
        difficulty: 'easy',
        estimatedDuration: 40,
        enemyCount: 15,
        lootMultiplier: 1.0,
        unlockedAtLevel: 1,
        image: '/assets/maps/customs.jpg'
    },
    {
        id: 'woods',
        name: 'Woods',
        description: 'A massive forested territory with a sawmill in the center. Paradise for snipers and long-range specialists.',
        difficulty: 'normal',
        estimatedDuration: 45,
        enemyCount: 12,
        lootMultiplier: 1.2,
        unlockedAtLevel: 5,
        image: '/assets/maps/woods.jpg'
    },
    {
        id: 'zero-dam',
        name: 'Zero Dam',
        description: 'A strategic hydroelectric dam facility. High verticality and tight corridors inside the dam itself.',
        difficulty: 'hard',
        estimatedDuration: 35,
        enemyCount: 20,
        lootMultiplier: 1.8,
        unlockedAtLevel: 15,
        image: '/assets/maps/zerodam.jpg'
    },
    {
        id: 'layali-grove',
        name: 'Layali Grove',
        description: 'Tropical forest with hidden research facilities. Extreme risk, extreme reward.',
        difficulty: 'insane',
        estimatedDuration: 50,
        enemyCount: 25,
        lootMultiplier: 2.5,
        unlockedAtLevel: 30,
        image: '/assets/maps/layali.jpg'
    }
];
