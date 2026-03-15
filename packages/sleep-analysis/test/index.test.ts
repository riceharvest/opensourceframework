import { describe, expect, it } from 'vitest';
import { analyzeSleep, SleepData } from '../src/index';

describe('sleep-analysis', () => {
  it('should calculate correct metrics for a sample sleep', () => {
    const data: SleepData = {
      segments: [
        { startTime: 0, endTime: 60 * 1000 * 60, type: 'light' }, // 1h
        { startTime: 60 * 1000 * 60, endTime: 120 * 1000 * 60, type: 'deep' }, // 1h
        { startTime: 120 * 1000 * 60, endTime: 180 * 1000 * 60, type: 'rem' }, // 1h
        { startTime: 180 * 1000 * 60, endTime: 200 * 1000 * 60, type: 'awake' }, // 20m
      ]
    };

    const result = analyzeSleep(data);
    expect(result.totalDurationMinutes).toBe(200);
    expect(result.deepSleepMinutes).toBe(60);
    expect(result.remMinutes).toBe(60);
    expect(result.efficiency).toBe(180 / 200 * 100);
    expect(result.score).toBeGreaterThan(0);
  });

  it('should return zero metrics for empty data', () => {
    const data: SleepData = { segments: [] };
    const result = analyzeSleep(data);
    expect(result.totalDurationMinutes).toBe(0);
    expect(result.score).toBeGreaterThanOrEqual(0);
  });
});
