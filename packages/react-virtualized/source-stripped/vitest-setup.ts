import { vi } from 'vitest';

if (typeof window !== 'undefined') {
  window.scrollTo = vi.fn();
  
  // Mock offsetWidth/offsetHeight
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 500 });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 500 });
}
