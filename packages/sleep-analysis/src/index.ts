/**
 * sleep-analysis
 * 
 * Logic for processing and interpreting biometric sleep data patterns.
 */

export interface SleepSegment {
  startTime: number;
  endTime: number;
  type: 'deep' | 'rem' | 'light' | 'awake';
}

export interface SleepData {
  segments: SleepSegment[];
}

export interface SleepAnalysisResult {
  totalDurationMinutes: number;
  efficiency: number;
  deepSleepMinutes: number;
  remMinutes: number;
  lightSleepMinutes: number;
  awakeMinutes: number;
  score: number;
}

/**
 * Calculates the duration of a sleep segment in minutes.
 */
function getDuration(segment: SleepSegment): number {
  return (segment.endTime - segment.startTime) / (1000 * 60);
}

/**
 * Analyzes sleep data and returns detailed metrics and an overall score.
 */
export function analyzeSleep(data: SleepData): SleepAnalysisResult {
  let deep = 0;
  let rem = 0;
  let light = 0;
  let awake = 0;

  data.segments.forEach(segment => {
    const duration = getDuration(segment);
    switch (segment.type) {
      case 'deep': deep += duration; break;
      case 'rem': rem += duration; break;
      case 'light': light += duration; break;
      case 'awake': awake += duration; break;
    }
  });

  const totalSleepMinutes = deep + rem + light;
  const totalDurationMinutes = totalSleepMinutes + awake;
  const efficiency = totalDurationMinutes > 0 ? (totalSleepMinutes / totalDurationMinutes) * 100 : 0;

  // Simple scoring algorithm (can be made more complex)
  // Ideal: 7-9 hours, 20% deep, 20% rem, >85% efficiency
  let score = 0;
  
  // Duration score (max 40)
  const idealMinutes = 8 * 60;
  score += Math.max(0, 40 - Math.abs(idealMinutes - totalSleepMinutes) / 5);

  // Efficiency score (max 30)
  score += (efficiency / 100) * 30;

  // Composition score (max 30)
  const deepRatio = totalSleepMinutes > 0 ? deep / totalSleepMinutes : 0;
  const remRatio = totalSleepMinutes > 0 ? rem / totalSleepMinutes : 0;
  
  if (deepRatio >= 0.15 && deepRatio <= 0.25) score += 15;
  else if (deepRatio > 0) score += 10;

  if (remRatio >= 0.20 && remRatio <= 0.25) score += 15;
  else if (remRatio > 0) score += 10;

  return {
    totalDurationMinutes,
    efficiency,
    deepSleepMinutes: deep,
    remMinutes: rem,
    lightSleepMinutes: light,
    awakeMinutes: awake,
    score: Math.min(100, Math.round(score))
  };
}
