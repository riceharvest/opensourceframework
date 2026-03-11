import { describe, expect, it, vi } from 'vitest';
import withImages, {
  DEFAULT_FILE_EXTENSIONS,
  DEFAULT_INLINE_IMAGE_LIMIT,
  DEFAULT_NAME,
  withImages as withImagesNamed,
} from '../src/index';
import type { WebpackConfig, WebpackConfigContext } from '../src/types';

function createWebpackConfig(): WebpackConfig {
  return {
    module: {
      rules: [],
    },
  };
}

function createWebpackContext(
  overrides: Partial<WebpackConfigContext> = {}
): WebpackConfigContext {
  return {
    isServer: false,
    defaultLoaders: {
      babel: {},
    },
    ...overrides,
  };
}

describe('@opensourceframework/next-images', () => {
  it('exports the plugin as default and named export', () => {
    expect(typeof withImages).toBe('function');
    expect(withImagesNamed).toBe(withImages);
  });

  it('exports default constants', () => {
    expect(DEFAULT_INLINE_IMAGE_LIMIT).toBe(8192);
    expect(DEFAULT_NAME).toBe('[name]-[hash].[ext]');
    expect(DEFAULT_FILE_EXTENSIONS).toContain('png');
  });

  it('adds the default image loader rule for client builds', () => {
    const config = createWebpackConfig();
    const nextConfig = withImages();
    const result = nextConfig.webpack?.(config, createWebpackContext());

    expect(result).toBe(config);
    expect(config.module.rules).toHaveLength(1);

    const rule = config.module.rules[0];
    const loader = rule.use?.[0];
    const options = loader?.options as Record<string, unknown>;

    expect(rule.test.test('hero.png')).toBe(true);
    expect(rule.test.test('notes.txt')).toBe(false);
    expect(options.limit).toBe(DEFAULT_INLINE_IMAGE_LIMIT);
    expect(options.outputPath).toBe('static/images/');
    expect(options.publicPath).toBe('/_next/static/images/');
    expect(options.name).toBe(DEFAULT_NAME);
    expect(options.esModule).toBe(false);
  });

  it('uses server output paths for server builds', () => {
    const config = createWebpackConfig();
    const nextConfig = withImages();

    nextConfig.webpack?.(config, createWebpackContext({ isServer: true }));

    const rule = config.module.rules[0];
    const loader = rule.use?.[0];
    const options = loader?.options as Record<string, unknown>;

    expect(options.outputPath).toBe('../static/images/');
  });

  it('supports disabling inlining and custom file extensions', () => {
    const config = createWebpackConfig();
    const nextConfig = withImages({
      inlineImageLimit: false,
      fileExtensions: ['png', 'webp'],
      name: '[path][name].[ext]',
    });

    nextConfig.webpack?.(config, createWebpackContext());

    const rule = config.module.rules[0];
    const loader = rule.use?.[0];
    const options = loader?.options as Record<string, unknown>;

    expect(rule.test.test('photo.png')).toBe(true);
    expect(rule.test.test('photo.jpg')).toBe(false);
    expect(options.limit).toBe(-1);
    expect(options.name).toBe('[path][name].[ext]');
  });

  it('supports dynamic asset prefixes and preserves server runtime config', () => {
    const config = createWebpackConfig();
    const nextConfig = withImages({
      dynamicAssetPrefix: true,
      assetPrefix: 'https://cdn.example.com',
      serverRuntimeConfig: {
        existing: true,
      },
    });

    expect(nextConfig.serverRuntimeConfig).toEqual({
      existing: true,
      nextImagesAssetPrefix: 'https://cdn.example.com',
    });

    nextConfig.webpack?.(config, createWebpackContext({ isServer: true }));

    const rule = config.module.rules[0];
    const loader = rule.use?.[0];
    const options = loader?.options as Record<string, unknown>;

    expect(options.publicPath).toBe('/_next/static/images/');
    expect(typeof options.postTransformPublicPath).toBe('function');
    expect((options.postTransformPublicPath as (value: string) => string)('"asset.png"')).toContain(
      'nextImagesAssetPrefix'
    );
  });

  it('calls a custom webpack function if provided', () => {
    const config = createWebpackConfig();
    const webpack = vi.fn((webpackConfig: WebpackConfig) => {
      return {
        ...webpackConfig,
        custom: true,
      } as WebpackConfig;
    });
    const nextConfig = withImages({ webpack });

    const result = nextConfig.webpack?.(config, createWebpackContext());

    expect(webpack).toHaveBeenCalledOnce();
    expect(result).toMatchObject({ custom: true });
  });

  it('throws for unsupported Next.js webpack contexts', () => {
    const config = createWebpackConfig();
    const nextConfig = withImages();

    expect(() =>
      nextConfig.webpack?.(
        config,
        createWebpackContext({
          defaultLoaders: undefined as unknown as WebpackConfigContext['defaultLoaders'],
        })
      )
    ).toThrow('This plugin is not compatible with Next.js versions below 5.0.0.');
  });
});
