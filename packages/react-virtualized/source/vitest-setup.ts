import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Provide global mocks for Jest-specific APIs
globalThis.jest = {
  fn: vi.fn,
  mock: vi.mock,
  spyOn: vi.spyOn,
  clearAllMocks: vi.clearAllMocks,
  resetAllMocks: vi.resetAllMocks,
  restoreAllMocks: vi.restoreAllMocks,
  useFakeTimers: vi.useFakeTimers,
  useRealTimers: vi.useRealTimers,
  advanceTimersByTime: vi.advanceTimersByTime,
  setSystemTime: vi.setSystemTime,
  getTimerCount: vi.getTimerCount,
  runAllTimers: vi.runAllTimers,
  runOnlyPendingTimers: vi.runOnlyPendingTimers,
  resetModules: vi.resetModules,
  requireActual: vi.importActual, // Not quite same but close
};

// Also support global spyOn
globalThis.spyOn = vi.spyOn;

vi.mock('dom-helpers/scrollbarSize', () => {
  return {
    default: () => 20,
    __esModule: true,
  };
});
