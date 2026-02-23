import { vi } from 'vitest'
Object.defineProperty(globalThis, 'jest', { value: vi })
Object.defineProperty(globalThis, 'spyOn', { value: vi.spyOn })
