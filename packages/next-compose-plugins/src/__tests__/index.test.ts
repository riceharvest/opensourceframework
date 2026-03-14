import { vi } from 'vitest';
import { withPlugins, extend } from '../index';

const PHASE_DEVELOPMENT_SERVER = 'phase-development-server';
const PHASE_PRODUCTION_SERVER = 'phase-production-server';

describe('next-compose-plugins', () => {
  it('extends a base config', async () => {
    const plugin1 = vi.fn((nextConfig) => ({ ...nextConfig, plugin1: true }));
    const plugin2 = vi.fn((nextConfig) => ({ ...nextConfig, plugin2: true }));
    const plugin3 = vi.fn((nextConfig) => ({ ...nextConfig, plugin3: true }));

    const baseConfig = withPlugins([plugin1, plugin2], {
      baseConfig: 'hello',
      foo: 'bar',
    });

    const extendedConfig = extend(baseConfig).withPlugins([plugin3], {
      foo: 'baz',
      extendedConfig: 'world',
    });

    expect(
      await extendedConfig(PHASE_DEVELOPMENT_SERVER, { defaultConfig: { nextConfig: 'abc' } })
    ).toEqual({
      plugin1: true,
      plugin2: true,
      plugin3: true,
      baseConfig: 'hello',
      extendedConfig: 'world',
      foo: 'baz',
      nextConfig: 'abc',
    });

    expect(plugin1).toHaveBeenCalledTimes(1);
    expect(plugin2).toHaveBeenCalledTimes(1);
    expect(plugin3).toHaveBeenCalledTimes(1);
  });

  it('passes the current phase to the extended config', async () => {
    const plugin1 = vi.fn((nextConfig) => ({ ...nextConfig, plugin1: true }));
    const plugin2 = vi.fn((nextConfig) => ({ ...nextConfig, plugin2: true }));
    const plugin3 = vi.fn((nextConfig) => ({ ...nextConfig, plugin3: true }));
    const plugin4 = vi.fn((nextConfig) => ({ ...nextConfig, plugin4: true }));

    const baseConfig = withPlugins(
      [
        [plugin1, [PHASE_DEVELOPMENT_SERVER]],
        [plugin2, [PHASE_PRODUCTION_SERVER]],
      ],
      {
        baseConfig: 'hello',
        foo: 'bar',
      }
    );

    const extendedConfig = extend(baseConfig).withPlugins(
      [
        [plugin3, [PHASE_DEVELOPMENT_SERVER]],
        [plugin4, [PHASE_PRODUCTION_SERVER]],
      ],
      { foo: 'baz', extendedConfig: 'world' }
    );

    expect(
      await extendedConfig(PHASE_PRODUCTION_SERVER, { defaultConfig: { nextConfig: 'abc' } })
    ).toEqual({
      plugin2: true,
      plugin4: true,
      baseConfig: 'hello',
      extendedConfig: 'world',
      foo: 'baz',
      nextConfig: 'abc',
    });

    expect(plugin1).toHaveBeenCalledTimes(0);
    expect(plugin2).toHaveBeenCalledTimes(1);
    expect(plugin3).toHaveBeenCalledTimes(0);
    expect(plugin4).toHaveBeenCalledTimes(1);
  });

  it('extends the webpack config', async () => {
    const plugin1 = vi.fn((nextConfig) => ({
      ...nextConfig,
      webpack: async () => {
        if (nextConfig.webpack) {
          return `changed from base ${await nextConfig.webpack()}`;
        }

        return null;
      },
    }));

    const plugin2 = vi.fn((nextConfig) => ({
      ...nextConfig,
      webpack: async () => {
        if (nextConfig.webpack) {
          return `changed from current ${await nextConfig.webpack()}`;
        }

        return null;
      },
    }));

    const baseConfig = withPlugins([plugin1]);
    const extendedConfig = extend(baseConfig).withPlugins([plugin2]);
    const result = await extendedConfig(PHASE_DEVELOPMENT_SERVER, {
      defaultConfig: {
        webpack: async () => 'webpack config',
      },
    });

    expect(await result.webpack()).toEqual('changed from current changed from base webpack config');
    expect(plugin1).toHaveBeenCalledTimes(1);
    expect(plugin2).toHaveBeenCalledTimes(1);
  });

  it('resolves phases specific configs in the next configuration', async () => {
    const baseConfig = withPlugins([], {
      baseConfig: 'hello',
      foo: 'bar',
      [PHASE_DEVELOPMENT_SERVER]: {
        foo: 'baz',
      },
      [`!${PHASE_PRODUCTION_SERVER}`]: {
        prod: false,
      },
      [`!${PHASE_DEVELOPMENT_SERVER}`]: {
        dev: false,
      },
    });

    const composed = baseConfig;
    const result = await composed(PHASE_DEVELOPMENT_SERVER, {});

    expect(result).toEqual({
      baseConfig: 'hello',
      foo: 'baz',
      prod: false,
    });
  });
});
