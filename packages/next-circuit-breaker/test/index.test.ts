import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { CircuitBreaker, withCircuitBreaker, withApiCircuitBreaker } from '../src/index';

describe('CircuitBreaker', () => {
  let breaker: CircuitBreaker<[string], string>;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('basic functionality', () => {
    it('should execute the wrapped function successfully', async () => {
      const mockFn = vi.fn().mockResolvedValue('success');
      breaker = new CircuitBreaker(mockFn);

      const result = await breaker.fire('test');

      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledWith('test');
    });

    it('should propagate errors from the wrapped function', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('test error'));
      breaker = new CircuitBreaker(mockFn);

      await expect(breaker.fire('test')).rejects.toThrow('test error');
    });

    it('should start in CLOSED state', () => {
      const mockFn = vi.fn();
      breaker = new CircuitBreaker(mockFn);

      expect(breaker.getState()).toBe('CLOSED');
      expect(breaker.isClosed()).toBe(true);
    });
  });

  describe('circuit opening', () => {
    it('should open after reaching failure threshold', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('failure'));
      breaker = new CircuitBreaker(mockFn, { failureThreshold: 2 });

      await expect(breaker.fire('test')).rejects.toThrow('failure');
      expect(breaker.getState()).toBe('CLOSED');

      await expect(breaker.fire('test')).rejects.toThrow('failure');
      expect(breaker.getState()).toBe('OPEN');
    });

    it('should fail fast when circuit is open', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('failure'));
      breaker = new CircuitBreaker(mockFn, { failureThreshold: 1 });

      await expect(breaker.fire('test')).rejects.toThrow('failure');
      expect(breaker.getState()).toBe('OPEN');

      await expect(breaker.fire('test')).rejects.toThrow('Circuit breaker is OPEN');
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('circuit half-open state', () => {
    it('should transition to half-open after timeout', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('failure'));
      breaker = new CircuitBreaker(mockFn, { failureThreshold: 1, timeout: 1000 });

      await expect(breaker.fire('test')).rejects.toThrow('failure');
      expect(breaker.getState()).toBe('OPEN');

      vi.advanceTimersByTime(1001);

      mockFn.mockResolvedValueOnce('success');
      const result = await breaker.fire('test');

      expect(result).toBe('success');
      expect(breaker.getState()).toBe('HALF_OPEN');
    });

    it('should close after success threshold in half-open state', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('failure'));
      breaker = new CircuitBreaker(mockFn, {
        failureThreshold: 1,
        successThreshold: 2,
        timeout: 1000,
      });

      await expect(breaker.fire('test')).rejects.toThrow('failure');
      expect(breaker.getState()).toBe('OPEN');

      vi.advanceTimersByTime(1001);

      mockFn.mockResolvedValue('success');
      await breaker.fire('test');
      expect(breaker.getState()).toBe('HALF_OPEN');

      await breaker.fire('test');
      expect(breaker.getState()).toBe('CLOSED');
    });
  });

  describe('callbacks', () => {
    it('should call onOpen callback when circuit opens', async () => {
      const onOpen = vi.fn();
      const mockFn = vi.fn().mockRejectedValue(new Error('failure'));
      breaker = new CircuitBreaker(mockFn, { failureThreshold: 1, onOpen });

      await expect(breaker.fire('test')).rejects.toThrow('failure');

      expect(onOpen).toHaveBeenCalled();
    });

    it('should call onClose callback when circuit closes', async () => {
      const onClose = vi.fn();
      const mockFn = vi.fn().mockRejectedValue(new Error('failure'));
      breaker = new CircuitBreaker(mockFn, {
        failureThreshold: 1,
        successThreshold: 1,
        timeout: 1000,
        onClose,
      });

      await expect(breaker.fire('test')).rejects.toThrow('failure');
      vi.advanceTimersByTime(1001);

      mockFn.mockResolvedValue('success');
      await breaker.fire('test');

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('manual controls', () => {
    it('should allow manual trip', () => {
      const mockFn = vi.fn();
      breaker = new CircuitBreaker(mockFn);

      breaker.trip();

      expect(breaker.isOpen()).toBe(true);
    });

    it('should allow manual reset', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('failure'));
      breaker = new CircuitBreaker(mockFn, { failureThreshold: 1 });

      await expect(breaker.fire('test')).rejects.toThrow('failure');
      expect(breaker.isOpen()).toBe(true);

      breaker.reset();

      expect(breaker.isClosed()).toBe(true);
    });
  });

  describe('getStats', () => {
    it('should return current state information', async () => {
      const mockFn = vi.fn().mockRejectedValue(new Error('failure'));
      breaker = new CircuitBreaker(mockFn, { failureThreshold: 3 });

      await expect(breaker.fire('test')).rejects.toThrow('failure');

      const stats = breaker.getStats();

      expect(stats.state).toBe('CLOSED');
      expect(stats.failureCount).toBe(1);
      expect(stats.successCount).toBe(0);
    });
  });
});

describe('withCircuitBreaker', () => {
  it('should wrap a function with circuit breaker', async () => {
    const mockFn = vi.fn().mockResolvedValue('success');
    const wrapped = withCircuitBreaker(mockFn);

    const result = await wrapped('test');

    expect(result).toBe('success');
    expect(mockFn).toHaveBeenCalledWith('test');
  });

  it('should accept options', async () => {
    const mockFn = vi.fn().mockRejectedValue(new Error('failure'));
    const wrapped = withCircuitBreaker(mockFn, { failureThreshold: 1 });

    await expect(wrapped('test')).rejects.toThrow('failure');
    await expect(wrapped('test')).rejects.toThrow('Circuit breaker is OPEN');
  });
});

describe('withApiCircuitBreaker', () => {
  it('should work the same as withCircuitBreaker', async () => {
    const mockFn = vi.fn().mockResolvedValue('success');
    const wrapped = withApiCircuitBreaker(mockFn);

    const result = await wrapped('test');

    expect(result).toBe('success');
  });
});
