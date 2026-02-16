/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures by failing fast when downstream services are unavailable
 * @module @opensourceframework/next-circuit-breaker
 */

/**
 * Circuit breaker states
 */
export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

/**
 * Options for configuring the circuit breaker
 */
export interface CircuitBreakerOptions {
  /** Number of failures before opening the circuit (default: 3) */
  failureThreshold?: number;
  /** Number of successes before closing the circuit in half-open state (default: 2) */
  successThreshold?: number;
  /** Time in milliseconds before attempting to close the circuit (default: 10000) */
  timeout?: number;
  /** Callback fired when circuit opens */
  onOpen?: () => void;
  /** Callback fired when circuit closes */
  onClose?: () => void;
  /** Callback fired when circuit enters half-open state */
  onHalfOpen?: () => void;
}

/**
 * Type for async functions that can be wrapped by the circuit breaker
 */
export type AsyncFunction<TArgs extends unknown[], TResult> = (
  ...args: TArgs
) => Promise<TResult>;

/**
 * Circuit breaker state information
 */
export interface CircuitBreakerState {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  nextAttemptTime: number;
}

/**
 * Circuit Breaker Pattern Implementation
 *
 * Prevents cascading failures by failing fast when downstream services are unavailable.
 * The circuit breaker has three states:
 *
 * - **CLOSED**: Normal operation, requests pass through
 * - **OPEN**: Requests fail immediately without calling the underlying function
 * - **HALF_OPEN**: Limited requests allowed to test if the service has recovered
 *
 * @example
 * ```typescript
 * import { CircuitBreaker } from '@opensourceframework/next-circuit-breaker';
 *
 * const fetchData = async (id: string) => {
 *   const response = await fetch(`/api/data/${id}`);
 *   return response.json();
 * };
 *
 * const breaker = new CircuitBreaker(fetchData, {
 *   failureThreshold: 5,
 *   timeout: 30000,
 * });
 *
 * try {
 *   const data = await breaker.fire('123');
 * } catch (error) {
 *   if (error.message === 'Circuit breaker is OPEN') {
 *     // Handle circuit open state
 *   }
 * }
 * ```
 */
export class CircuitBreaker<TArgs extends unknown[], TResult> {
  private state: CircuitState = 'CLOSED';
  private failureCount = 0;
  private successCount = 0;
  private nextAttemptTime = 0;

  private readonly failureThreshold: number;
  private readonly successThreshold: number;
  private readonly timeout: number;
  private readonly onOpen?: () => void;
  private readonly onClose?: () => void;
  private readonly onHalfOpen?: () => void;

  /**
   * Creates a new CircuitBreaker instance
   *
   * @param request - The async function to wrap
   * @param options - Configuration options
   */
  constructor(
    private readonly request: AsyncFunction<TArgs, TResult>,
    options: CircuitBreakerOptions = {}
  ) {
    this.failureThreshold = options.failureThreshold ?? 3;
    this.successThreshold = options.successThreshold ?? 2;
    this.timeout = options.timeout ?? 10000;
    this.onOpen = options.onOpen;
    this.onClose = options.onClose;
    this.onHalfOpen = options.onHalfOpen;
  }

  /**
   * Executes the wrapped function if the circuit allows it
   *
   * @param args - Arguments to pass to the wrapped function
   * @returns The result of the wrapped function
   * @throws Error if the circuit is open, or re-throws errors from the wrapped function
   */
  async fire(...args: TArgs): Promise<TResult> {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttemptTime) {
        this.transitionToHalfOpen();
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const response = await this.request(...args);
      return this.success(response);
    } catch (error) {
      return this.fail(error);
    }
  }

  /**
   * Gets the current state of the circuit breaker
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Gets detailed state information for monitoring
   */
  getStats(): CircuitBreakerState {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      nextAttemptTime: this.nextAttemptTime,
    };
  }

  /**
   * Checks if the circuit is currently open
   */
  isOpen(): boolean {
    return this.state === 'OPEN';
  }

  /**
   * Checks if the circuit is currently closed
   */
  isClosed(): boolean {
    return this.state === 'CLOSED';
  }

  /**
   * Checks if the circuit is currently half-open
   */
  isHalfOpen(): boolean {
    return this.state === 'HALF_OPEN';
  }

  /**
   * Manually opens the circuit (useful for maintenance)
   */
  trip(): void {
    this.open();
  }

  /**
   * Manually resets the circuit to closed state
   */
  reset(): void {
    this.failureCount = 0;
    this.successCount = 0;
    this.state = 'CLOSED';
    this.onClose?.();
  }

  private success(response: TResult): TResult {
    if (this.state === 'HALF_OPEN') {
      this.successCount++;
      if (this.successCount >= this.successThreshold) {
        this.reset();
      }
    }
    return response;
  }

  private fail(error: unknown): never {
    this.failureCount++;
    if (this.failureCount >= this.failureThreshold) {
      this.open();
    }
    throw error;
  }

  private open(): void {
    this.state = 'OPEN';
    this.nextAttemptTime = Date.now() + this.timeout;
    this.onOpen?.();
    // Schedule automatic transition to half-open
    setTimeout(() => this.transitionToHalfOpen(), this.timeout);
  }

  private transitionToHalfOpen(): void {
    if (this.state === 'OPEN') {
      this.state = 'HALF_OPEN';
      this.successCount = 0;
      this.onHalfOpen?.();
    }
  }
}

/**
 * Creates a circuit breaker wrapper for an async function
 *
 * This is a convenience function that creates a CircuitBreaker instance
 * and returns a wrapped version of the original function.
 *
 * @param handler - The async function to wrap
 * @param options - Circuit breaker options
 * @returns A wrapped function with circuit breaker protection
 *
 * @example
 * ```typescript
 * import { withCircuitBreaker } from '@opensourceframework/next-circuit-breaker';
 *
 * const protectedFetch = withCircuitBreaker(
 *   async (url: string) => {
 *     const response = await fetch(url);
 *     return response.json();
 *   },
 *   { failureThreshold: 5, timeout: 30000 }
 * );
 *
 * // Use like a normal async function
 * const data = await protectedFetch('/api/data');
 * ```
 */
export const withCircuitBreaker = <TArgs extends unknown[], TResult>(
  handler: AsyncFunction<TArgs, TResult>,
  options?: CircuitBreakerOptions
): ((...args: TArgs) => Promise<TResult>) => {
  const circuit = new CircuitBreaker<TArgs, TResult>(handler, options);
  return async (...args: TArgs) => circuit.fire(...args);
};

/**
 * Creates a circuit breaker middleware for Next.js API routes
 *
 * @param handler - Next.js API route handler
 * @param options - Circuit breaker options
 * @returns Wrapped handler with circuit breaker protection
 *
 * @example
 * ```typescript
 * // In your Next.js API route
 * import { withApiCircuitBreaker } from '@opensourceframework/next-circuit-breaker';
 * import type { NextApiRequest, NextApiResponse } from 'next';
 *
 * async function handler(req: NextApiRequest, res: NextApiResponse) {
 *   const data = await fetchExternalService();
 *   res.status(200).json(data);
 * }
 *
 * export default withApiCircuitBreaker(handler, {
 *   failureThreshold: 5,
 *   timeout: 30000,
 * });
 * ```
 */
export const withApiCircuitBreaker = <TArgs extends unknown[], TResult>(
  handler: AsyncFunction<TArgs, TResult>,
  options?: CircuitBreakerOptions
): ((...args: TArgs) => Promise<TResult>) => {
  return withCircuitBreaker(handler, options);
};

export default CircuitBreaker;
