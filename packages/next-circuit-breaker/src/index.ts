/**
 * Circuit Breaker Pattern Implementation
 * Prevents cascading failures by failing fast when downstream services are unavailable
 * @module @opensourceframework/next-circuit-breaker
 */

/**
 * Circuit breaker states
 * @since 0.1.0
 */
export type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

/**
 * Options for configuring the circuit breaker
 * @since 0.1.0
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
 * @since 0.1.0
 */
export type AsyncFunction<TArgs extends unknown[], TResult> = (
  ...args: TArgs
) => Promise<TResult>;

/**
 * Circuit breaker state information
 * @since 0.1.0
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
 * @since 0.1.0
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

  // Track timeout ID for cleanup to prevent memory leaks
  private timeoutId?: ReturnType<typeof setTimeout>;

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
    // Validate options
    if (options.failureThreshold !== undefined && options.failureThreshold <= 0) {
      throw new Error('failureThreshold must be a positive number');
    }
    if (options.successThreshold !== undefined && options.successThreshold <= 0) {
      throw new Error('successThreshold must be a positive number');
    }
    if (options.timeout !== undefined && options.timeout <= 0) {
      throw new Error('timeout must be a positive number');
    }

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
   * @throws {Error} 'Circuit breaker is OPEN' if the circuit is open and hasn't transitioned to half-open
   * @throws Re-throws any errors from the wrapped function
   */
  async fire(...args: TArgs): Promise<TResult> {
    if (this.state === 'OPEN') {
      if (Date.now() > this.nextAttemptTime) {
        this.transitionToHalfOpen();
      } else {
        const timeUntilRetry = Math.ceil((this.nextAttemptTime - Date.now()) / 1000);
        throw new Error(`Circuit breaker is OPEN. Retry after ${timeUntilRetry} seconds.`);
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
   * @returns The current circuit state: 'CLOSED', 'OPEN', or 'HALF_OPEN'
   */
  getState(): CircuitState {
    return this.state;
  }

  /**
   * Gets detailed state information for monitoring
   * @returns Object containing current state, failure count, success count, and next attempt time
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
   * @returns true if the circuit is open, false otherwise
   */
  isOpen(): boolean {
    return this.state === 'OPEN';
  }

  /**
   * Checks if the circuit is currently closed
   * @returns true if the circuit is closed, false otherwise
   */
  isClosed(): boolean {
    return this.state === 'CLOSED';
  }

  /**
   * Checks if the circuit is currently half-open
   * @returns true if the circuit is half-open, false otherwise
   */
  isHalfOpen(): boolean {
    return this.state === 'HALF_OPEN';
  }

  /**
   * Manually opens the circuit (useful for maintenance)
   * This immediately trips the circuit without waiting for failures
   */
  trip(): void {
    this.open();
  }

  /**
   * Manually resets the circuit to closed state
   * Clears all failure/success counts and transitions to CLOSED state
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
    // Clear any existing timeout to prevent memory leaks
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => this.transitionToHalfOpen(), this.timeout);
  }

  private transitionToHalfOpen(): void {
    if (this.state === 'OPEN') {
      this.state = 'HALF_OPEN';
      this.successCount = 0;
      this.onHalfOpen?.();
    }
    // Clear the timeout ID after transition
    this.timeoutId = undefined;
  }

  /**
   * Cleans up the circuit breaker, clearing any pending timeouts.
   * Call this when the circuit breaker is no longer needed to prevent memory leaks.
   */
  destroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = undefined;
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
 * @since 0.1.0
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
 * @since 0.1.0
 */
export const withApiCircuitBreaker = <TArgs extends unknown[], TResult>(
  handler: AsyncFunction<TArgs, TResult>,
  options?: CircuitBreakerOptions
): ((...args: TArgs) => Promise<TResult>) => {
  return withCircuitBreaker(handler, options);
};

export default CircuitBreaker;
