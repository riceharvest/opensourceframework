# @opensourceframework/sleep-analysis

Biometric sleep data analysis and interpretation utility for TypeScript and JavaScript apps.

## Installation

```bash
npm install @opensourceframework/sleep-analysis
# or
pnpm add @opensourceframework/sleep-analysis
```

## Usage

```ts
import { analyzeSleep, type SleepData } from '@opensourceframework/sleep-analysis';

const data: SleepData = {
  segments: [
    { startTime: 0, endTime: 60 * 60 * 1000, type: 'light' },
    { startTime: 60 * 60 * 1000, endTime: 2 * 60 * 60 * 1000, type: 'deep' },
    { startTime: 2 * 60 * 60 * 1000, endTime: 3 * 60 * 60 * 1000, type: 'rem' },
    { startTime: 3 * 60 * 60 * 1000, endTime: 200 * 60 * 1000, type: 'awake' },
  ],
};

const result = analyzeSleep(data);
console.log(result.efficiency);
```

## API

### `analyzeSleep(data)`

Accepts a `SleepData` object containing timestamped sleep-stage segments and returns:

- `totalDurationMinutes`
- `efficiency`
- `deepSleepMinutes`
- `remMinutes`
- `lightSleepMinutes`
- `awakeMinutes`
- `score`

Sleep segment types are `deep`, `rem`, `light`, and `awake`.

## License

MIT
