import { vi } from 'vitest'

const jestMock = {
  fn: vi.fn,
  spyOn: vi.spyOn,
  useFakeTimers: vi.useFakeTimers,
  runAllTimers: vi.runAllTimers,
  advanceTimersByTime: vi.advanceTimersByTime,
  useRealTimers: vi.useRealTimers,
  clearAllMocks: vi.clearAllMocks,
  resetAllMocks: vi.resetAllMocks,
  restoreAllMocks: vi.restoreAllMocks,
  setTimeout: globalThis.setTimeout,
  clearTimeout: globalThis.clearTimeout,
}

// @ts-ignore
globalThis.jest = jestMock
// @ts-ignore
globalThis.spyOn = vi.spyOn
