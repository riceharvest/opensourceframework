import { afterEach, vi } from 'vitest';

if (typeof window !== 'undefined') {
  window.scrollTo = vi.fn((xOrOptions = 0, y = 0) => {
    if (typeof xOrOptions === 'object' && xOrOptions !== null) {
      window.scrollX = xOrOptions.left ?? window.scrollX;
      window.scrollY = xOrOptions.top ?? window.scrollY;
    } else {
      window.scrollX = Number(xOrOptions) || 0;
      window.scrollY = Number(y) || 0;
    }

    window.dispatchEvent(new window.Event('scroll'));
  });

  // Mock offsetWidth/offsetHeight
  Object.defineProperty(HTMLElement.prototype, 'offsetWidth', { configurable: true, value: 500 });
  Object.defineProperty(HTMLElement.prototype, 'offsetHeight', { configurable: true, value: 500 });

  // Mock scrollX/scrollY as writable
  let scrollX = 0;
  let scrollY = 0;
  Object.defineProperty(window, 'scrollX', {
    get: () => scrollX,
    set: (val) => { scrollX = val; },
    configurable: true
  });
  Object.defineProperty(window, 'scrollY', {
    get: () => scrollY,
    set: (val) => { scrollY = val; },
    configurable: true
  });

  afterEach(() => {
    window.scrollX = 0;
    window.scrollY = 0;
    document.body.style.pointerEvents = '';
    vi.clearAllMocks();
  });
}
