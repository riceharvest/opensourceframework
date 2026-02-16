# @opensourceframework/next-circuit-breaker

[![npm version](https://badge.fury.io/js/@opensourceframework%2Fnext-circuit-breaker.svg)](https://badge.fury.io/js/@opensourceframework%2Fnext-circuit-breaker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Circuit breaker pattern implementation for Next.js API routes. Prevent cascading failures by failing fast when downstream services are unavailable.

## Features

- 🔄 **Circuit Breaker Pattern** - Protect your services from cascading failures
- ⚡ **Next.js Integration** - Works seamlessly with Next.js API routes
- 📊 **State Management** - CLOSED, OPEN, and HALF_OPEN states
- 🔧 **Configurable** - Customizable failure thresholds and timeouts
- 📈 **Monitoring** - Built-in state inspection and callbacks
- 🪶 **Lightweight** - Zero dependencies, TypeScript native

## Installation

```bash
npm install @opensourceframework/next-circuit-breaker
# or
yarn add @opensourceframework/next-circuit-breaker
# or
pnpm add @opensourceframework/next-circuit-breaker
```

## Quick Start

### Basic Usage

```typescript
import { CircuitBreaker } from '@opensourceframework/next-circuit-breaker';

// Create a circuit breaker for an external API call
const fetchUserData = async (userId: string) => {
  const response = await fetch(`https://api.example.com/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};

const breaker = new CircuitBreaker(fetchUserData, {
  failureThreshold: 5,    // Open after 5 failures
  successThreshold: 2,    // Close after 2 consecutive successes
  timeout: 30000,         // Wait 30s before trying again
});

// Use the circuit breaker
try {
  const user = await breaker.fire('user-123');
  console.log(user);
} catch (error) {
  if (error.message === 'Circuit breaker is OPEN') {
    // Handle the circuit being open
    console.log('Service temporarily unavailable');
  }
}
```

### Next.js API Route

```typescript
import { withApiCircuitBreaker } from '@opensourceframework/next-circuit-breaker';
import type { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Your API logic that calls external services
  const data = await fetchExternalService();
  res.status(200).json(data);
}

// Wrap your handler with circuit breaker protection
export default withApiCircuitBreaker(handler, {
  failureThreshold: 5,
  timeout: 30000,
  onOpen: () => console.log('Circuit opened - external service may be down'),
  onClose: () => console.log('Circuit closed - service recovered'),
});
```

### Function Wrapper

```typescript
import { withCircuitBreaker } from '@opensourceframework/next-circuit-breaker';

// Wrap any async function
const protectedFetch = withCircuitBreaker(
  async (url: string) => {
    const response = await fetch(url);
    return response.json();
  },
  {
    failureThreshold: 3,
    timeout: 10000,
  }
);

// Use like a normal function
const data = await protectedFetch('/api/data');
```

## API Reference

### `CircuitBreaker`

The main circuit breaker class.

#### Constructor

```typescript
new CircuitBreaker<TArgs, TResult>(
  request: AsyncFunction<TArgs, TResult>,
  options?: CircuitBreakerOptions
)
```

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `failureThreshold` | `number` | `3` | Number of failures before opening the circuit |
| `successThreshold` | `number` | `2` | Number of successes before closing the circuit |
| `timeout` | `number` | `10000` | Time in ms before attempting to close |
| `onOpen` | `() => void` | - | Callback when circuit opens |
| `onClose` | `() => void` | - | Callback when circuit closes |
| `onHalfOpen` | `() => void` | - | Callback when circuit enters half-open |

#### Methods

| Method | Description |
|--------|-------------|
| `fire(...args)` | Execute the wrapped function |
| `getState()` | Get current state: 'CLOSED', 'OPEN', 'HALF_OPEN' |
| `getStats()` | Get detailed state information |
| `isOpen()` | Check if circuit is open |
| `isClosed()` | Check if circuit is closed |
| `isHalfOpen()` | Check if circuit is half-open |
| `trip()` | Manually open the circuit |
| `reset()` | Manually reset to closed state |

### `withCircuitBreaker`

Convenience function to wrap an async function.

```typescript
withCircuitBreaker<TArgs, TResult>(
  handler: AsyncFunction<TArgs, TResult>,
  options?: CircuitBreakerOptions
): (...args: TArgs) => Promise<TResult>
```

### `withApiCircuitBreaker`

Alias for `withCircuitBreaker` - use in Next.js API routes.

## How It Works

The circuit breaker has three states:

1. **CLOSED** (Normal Operation)
   - All requests pass through to the wrapped function
   - Failures are counted
   - When failures exceed `failureThreshold`, circuit opens

2. **OPEN** (Failing Fast)
   - All requests fail immediately without calling the wrapped function
   - After `timeout` milliseconds, circuit enters half-open state

3. **HALF_OPEN** (Testing Recovery)
   - Limited requests are allowed through
   - If `successThreshold` consecutive requests succeed, circuit closes
   - If any request fails, circuit opens again

## Best Practices

1. **Set appropriate thresholds** based on your service's reliability requirements
2. **Use callbacks** for logging and monitoring
3. **Provide fallback behavior** when the circuit is open
4. **Monitor circuit state** for alerting and debugging

```typescript
const breaker = new CircuitBreaker(fetchData, {
  failureThreshold: 5,
  timeout: 30000,
  onOpen: () => {
    // Send alert to monitoring
    logger.error('Circuit opened for fetchData');
  },
  onClose: () => {
    logger.info('Circuit closed - service recovered');
  },
});

// With fallback
try {
  return await breaker.fire(id);
} catch (error) {
  if (breaker.isOpen()) {
    // Return cached data or default
    return getCachedData(id);
  }
  throw error;
}
```

## Contributing

See [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

MIT © OpenSource Framework Contributors
