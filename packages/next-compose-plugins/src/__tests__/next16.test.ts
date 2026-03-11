import { vi, describe, it, expect } from 'vitest';
import withPlugins from '../index';

describe('Next.js 16 compatibility (async config)', () => {
  it('should support async nextConfig', async () => {
    const plugin = (config) => ({ ...config, pluginApplied: true });
    const asyncConfig = Promise.resolve({ customOption: 'value' });
    
    const composed = withPlugins([plugin], asyncConfig);
    const result = await composed('phase-production-build', { defaultConfig: {} });
    
    expect(result.customOption).toBe('value');
    expect(result.pluginApplied).toBe(true);
  });

  it('should support async plugin functions', async () => {
    const asyncPlugin = async (config) => ({ ...config, asyncPluginApplied: true });
    
    const composed = withPlugins([asyncPlugin], { baseOption: 'base' });
    const result = await composed('phase-production-build', { defaultConfig: {} });
    
    expect(result.baseOption).toBe('base');
    expect(result.asyncPluginApplied).toBe(true);
  });
});
