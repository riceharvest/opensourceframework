/**
 * Tests for next-images package
 *
 * These tests verify the withImages() function properly configures
 * webpack to handle image files in Next.js applications.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { withImages, DEFAULT_FILE_EXTENSIONS, DEFAULT_INLINE_IMAGE_LIMIT, DEFAULT_NAME } from '../src/index';
import type { WebpackConfig, WebpackConfigContext } from '../src/types';

// Mock require.resolve to return predictable paths
vi.mock('module', () => ({
  createRequire: () => ({
    resolve: (path: string) => `resolved/${path}`,
  }),
}));

// Helper to create a mock webpack config
function createMockWebpackConfig(): WebpackConfig {
  return {
    module: {
      rules: [],
    },
  };
}

// Helper to create mock webpack context options
function createMockWebpackContext(overrides: Partial<WebpackConfigContext> = {}): WebpackConfigContext {
  return {
    isServer: false,
    defaultLoaders: {
      babel: {},
    },
    dev: false,
    buildId: 'test-build',
    ...overrides,
  };
}

describe('withImages', () => {
  describe('exports', () => {
    it('should export withImages function', () => {
      expect(withImages).toBeDefined();
      expect(typeof withImages).toBe('function');
    });

    it('should export DEFAULT_FILE_EXTENSIONS constant', () => {
      expect(DEFAULT_FILE_EXTENSIONS).toBeDefined();
      expect(Array.isArray(DEFAULT_FILE_EXTENSIONS)).toBe(true);
      expect(DEFAULT_FILE_EXTENSIONS).toContain('jpg');
      expect(DEFAULT_FILE_EXTENSIONS).toContain('png');
      expect(DEFAULT_FILE_EXTENSIONS).toContain('svg');
      expect(DEFAULT_FILE_EXTENSIONS).toContain('gif');
      expect(DEFAULT_FILE_EXTENSIONS).toContain('webp');
    });

    it('should export DEFAULT_INLINE_IMAGE_LIMIT constant', () => {
      expect(DEFAULT_INLINE_IMAGE_LIMIT).toBe(8192);
    });

    it('should export DEFAULT_NAME constant', () => {
      expect(DEFAULT_NAME).toBe('[name]-[hash].[ext]');
    });
  });

  describe('basic functionality', () => {
    it('should return a Next.js config object', () => {
      const config = withImages();
      expect(config).toBeDefined();
      expect(typeof config).toBe('object');
    });

    it('should include webpack function in returned config', () => {
      const config = withImages();
      expect(config.webpack).toBeDefined();
      expect(typeof config.webpack).toBe('function');
    });

    it('should preserve existing config options', () => {
      const config = withImages({
        assetPrefix: 'https://cdn.example.com',
        basePath: '/app',
      });
      expect(config).toBeDefined();
    });
  });

  describe('webpack configuration', () => {
    let mockConfig: WebpackConfig;
    let mockContext: WebpackConfigContext;

    beforeEach(() => {
      mockConfig = createMockWebpackConfig();
      mockContext = createMockWebpackContext();
    });

    it('should add an image rule to webpack config', () => {
      const config = withImages();
      const result = config.webpack!(mockConfig, mockContext);

      expect(result.module.rules.length).toBe(1);
      const rule = result.module.rules[0]!;
      expect(rule.test).toBeInstanceOf(RegExp);
      expect(rule.use).toBeDefined();
      expect(Array.isArray(rule.use)).toBe(true);
      expect(rule.use!.length).toBe(1);
    });

    it('should use url-loader for image files', () => {
      const config = withImages();
      const result = config.webpack!(mockConfig, mockContext);

      const rule = result.module.rules[0]!;
      const loader = rule.use![0] as { loader: string; options: Record<string, unknown> };
      expect(loader.loader).toContain('url-loader');
    });

    it('should use file-loader as fallback', () => {
      const config = withImages();
      const result = config.webpack!(mockConfig, mockContext);

      const rule = result.module.rules[0]!;
      const loader = rule.use![0] as { loader: string; options: Record<string, unknown> };
      expect(loader.options.fallback).toContain('file-loader');
    });

    it('should use default inlineImageLimit of 8192', () => {
      const config = withImages();
      const result = config.webpack!(mockConfig, mockContext);

      const rule = result.module.rules[0]!;
      const loader = rule.use![0] as { loader: string; options: Record<string, unknown> };
      expect(loader.options.limit).toBe(8192);
    });

    it('should use custom inlineImageLimit when provided', () => {
      const config = withImages({ inlineImageLimit: 16384 });
      const result = config.webpack!(mockConfig, mockContext);

      const rule = result.module.rules[0]!;
      const loader = rule.use![0] as { loader: string; options: Record<string, unknown> };
      expect(loader.options.limit).toBe(16384);
    });

    it('should disable inlining when inlineImageLimit is false', () => {
      const config = withImages({ inlineImageLimit: false });
      const result = config.webpack!(mockConfig, mockContext);

      const rule = result.module.rules[0]!;
      const loader = rule.use![0] as { loader: string; options: Record<string, unknown> };
      expect(loader.options.limit).toBe(-1);
    });

    it('should use default file extensions when not provided', () => {
      const config = withImages();
      const result = config.webpack!(mockConfig, mockContext);

      const rule = result.module.rules[0]!;
      const testRegex = rule.test as RegExp;
      
      // Test that default extensions match
      expect(testRegex.test('image.jpg')).toBe(true);
      expect(testRegex.test('image.jpeg')).toBe(true);
      expect(testRegex.test('image.png')).toBe(true);
      expect(testRegex.test('image.svg')).toBe(true);
      expect(testRegex.test('image.gif')).toBe(true);
      expect(testRegex.test('image.ico')).toBe(true);
      expect(testRegex.test('image.webp')).toBe(true);
      expect(testRegex.test('image.jp2')).toBe(true);
      expect(testRegex.test('image.avif')).toBe(true);
    });

    it('should use custom file extensions when provided', () => {
      const config = withImages({ fileExtensions: ['jpg', 'png'] });
      const result = config.webpack!(mockConfig, mockContext);

      const rule = result.module.rules[0]!;
      const testRegex = rule.test as RegExp;

      expect(testRegex.test('image.jpg')).toBe(true);
      expect(testRegex.test('image.png')).toBe(true);
      expect(testRegex.test('image.svg')).toBe(false);
      expect(testRegex.test('image.gif')).toBe(false);
    });

    it('should use default name template when not provided', () => {
      const config = withImages();
      const result = config.webpack!(mockConfig, mockContext);

      const rule = result.module.rules[0]!;
      const loader = rule.use![0] as { loader: string; options: Record<string, unknown> };
      expect(loader.options.name).toBe('[name]-[hash].[ext]');
    });

    it('should use custom name template when provided', () => {
      const config = withImages({ name: '[name].[hash:base64:8].[ext]' });
      const result = config.webpack!(mockConfig, mockContext);

      const rule = result.module.rules[0]!;
      const loader = rule.use![0] as { loader: string; options: Record<string, unknown> };
      expect(loader.options.name).toBe('[name].[hash:base64:8].[ext]');
    });

    it('should have esModule disabled by default', () => {
      const config = withImages();
      const result = config.webpack!(mockConfig, mockContext);

      const rule = result.module.rules[0]!;
      const loader = rule.use![0] as { loader: string; options: Record<string, unknown> };
      expect(loader.options.esModule).toBe(false);
    });

    it('should enable esModule when configured', () => {
      const config = withImages({ esModule: true });
      const result = config.webpack!(mockConfig, mockContext);

      const rule = result.module.rules[0]!;
      const loader = rule.use![0] as { loader: string; options: Record<string, unknown> };
      expect(loader.options.esModule).toBe(true);
    });
  });

  describe('output path configuration', () => {
    let mockConfig: WebpackConfig;
    let mockContext: WebpackConfigContext;

    beforeEach(() => {
      mockConfig = createMockWebpackConfig();
      mockContext = createMockWebpackContext();
    });

    it('should set correct output path for client build', () => {
      const config = withImages();
      const result = config.webpack!(mockConfig, { ...mockContext, isServer: false });

      const rule = result.module.rules[0]!;
      const loader = rule.use![0] as { loader: string; options: Record<string, unknown> };
      expect(loader.options.outputPath).toBe('static/images/');
    });

    it('should set correct output path for server build', () => {
      const config = withImages();
      const result = config.webpack!(mockConfig, { ...mockContext, isServer: true });

      const rule = result.module.rules[0]!;
      const loader = rule.use![0] as { loader: string; options: Record<string, unknown> };
      expect(loader.options.outputPath).toBe('../static/images/');
    });
  });

  describe('public path configuration', () => {
    let mockConfig: WebpackConfig;
    let mockContext: WebpackConfigContext;

    beforeEach(() => {
      mockConfig = createMockWebpackConfig();
      mockContext = createMockWebpackContext();
    });

    it('should use static public path by default', () => {
      const config = withImages();
      const result = config.webpack!(mockConfig, mockContext);

      const rule = result.module.rules[0]!;
      const loader = rule.use![0] as { loader: string; options: Record<string, unknown> };
      expect(loader.options.publicPath).toBe('/_next/static/images/');
    });

    it('should use assetPrefix in public path when provided', () => {
      const config = withImages({ assetPrefix: 'https://cdn.example.com' });
      const result = config.webpack!(mockConfig, mockContext);

      const rule = result.module.rules[0]!;
      const loader = rule.use![0] as { loader: string; options: Record<string, unknown> };
      expect(loader.options.publicPath).toBe('https://cdn.example.com/_next/static/images/');
    });

    it('should use basePath in public path when provided', () => {
      const config = withImages({ basePath: '/app' });
      const result = config.webpack!(mockConfig, mockContext);

      const rule = result.module.rules[0]!;
      const loader = rule.use![0] as { loader: string; options: Record<string, unknown> };
      expect(loader.options.publicPath).toBe('/app/_next/static/images/');
    });

    it('should prefer assetPrefix over basePath', () => {
      const config = withImages({ 
        assetPrefix: 'https://cdn.example.com', 
        basePath: '/app' 
      });
      const result = config.webpack!(mockConfig, mockContext);

      const rule = result.module.rules[0]!;
      const loader = rule.use![0] as { loader: string; options: Record<string, unknown> };
      expect(loader.options.publicPath).toBe('https://cdn.example.com/_next/static/images/');
    });
  });

  describe('dynamic asset prefix', () => {
    let mockConfig: WebpackConfig;
    let mockContext: WebpackConfigContext;

    beforeEach(() => {
      mockConfig = createMockWebpackConfig();
      mockContext = createMockWebpackContext();
    });

    it('should enable dynamic asset prefix when configured', () => {
      const config = withImages({ 
        dynamicAssetPrefix: true,
        assetPrefix: 'https://cdn.example.com',
      });
      const result = config.webpack!(mockConfig, mockContext);

      const rule = result.module.rules[0]!;
      const loader = rule.use![0] as { loader: string; options: Record<string, unknown> };
      
      expect(loader.options.publicPath).toBe('static/images/');
      expect(typeof loader.options.postTransformPublicPath).toBe('function');
    });

    it('should set serverRuntimeConfig when dynamicAssetPrefix is enabled', () => {
      const config = withImages({ 
        dynamicAssetPrefix: true,
        assetPrefix: 'https://cdn.example.com',
      });

      expect(config.serverRuntimeConfig).toBeDefined();
      expect((config.serverRuntimeConfig as Record<string, unknown>).nextImagesAssetPrefix).toBe('https://cdn.example.com');
    });

    it('should use basePath for serverRuntimeConfig when assetPrefix is not set', () => {
      const config = withImages({ 
        dynamicAssetPrefix: true,
        basePath: '/app',
      });

      expect((config.serverRuntimeConfig as Record<string, unknown>).nextImagesAssetPrefix).toBe('/app');
    });

    it('should generate correct postTransformPublicPath for server build', () => {
      const config = withImages({ dynamicAssetPrefix: true });
      const result = config.webpack!(mockConfig, { ...mockContext, isServer: true });

      const rule = result.module.rules[0]!;
      const loader = rule.use![0] as { loader: string; options: { postTransformPublicPath: (p: string) => string } };
      
      const transformed = loader.options.postTransformPublicPath('"test-path"');
      expect(transformed).toContain('serverRuntimeConfig.nextImagesAssetPrefix');
    });

    it('should generate correct postTransformPublicPath for client build', () => {
      const config = withImages({ dynamicAssetPrefix: true });
      const result = config.webpack!(mockConfig, { ...mockContext, isServer: false });

      const rule = result.module.rules[0]!;
      const loader = rule.use![0] as { loader: string; options: { postTransformPublicPath: (p: string) => string } };
      
      const transformed = loader.options.postTransformPublicPath('"test-path"');
      expect(transformed).toContain('__webpack_public_path__');
    });
  });

  describe('exclude option', () => {
    let mockConfig: WebpackConfig;
    let mockContext: WebpackConfigContext;

    beforeEach(() => {
      mockConfig = createMockWebpackConfig();
      mockContext = createMockWebpackContext();
    });

    it('should pass exclude option to webpack rule', () => {
      const excludePath = '/path/to/exclude';
      const config = withImages({ exclude: excludePath });
      const result = config.webpack!(mockConfig, mockContext);

      const rule = result.module.rules[0]!;
      expect(rule.exclude).toBe(excludePath);
    });

    it('should accept RegExp exclude pattern', () => {
      const excludePattern = /node_modules/;
      const config = withImages({ exclude: excludePattern });
      const result = config.webpack!(mockConfig, mockContext);

      const rule = result.module.rules[0]!;
      expect(rule.exclude).toBe(excludePattern);
    });
  });

  describe('custom webpack function', () => {
    let mockConfig: WebpackConfig;
    let mockContext: WebpackConfigContext;

    beforeEach(() => {
      mockConfig = createMockWebpackConfig();
      mockContext = createMockWebpackContext();
    });

    it('should call custom webpack function if provided', () => {
      const customWebpack = vi.fn((config) => config);
      const config = withImages({ webpack: customWebpack });
      
      config.webpack!(mockConfig, mockContext);

      expect(customWebpack).toHaveBeenCalled();
      expect(customWebpack).toHaveBeenCalledWith(mockConfig, mockContext);
    });

    it('should return result from custom webpack function', () => {
      const modifiedConfig = { ...mockConfig, custom: true };
      const config = withImages({ 
        webpack: () => modifiedConfig as WebpackConfig 
      });
      
      const result = config.webpack!(mockConfig, mockContext);

      expect(result).toHaveProperty('custom', true);
    });

    it('should apply image rules before calling custom webpack', () => {
      const config = withImages({ 
        webpack: (config) => {
          expect(config.module.rules.length).toBe(1);
          return config;
        }
      });
      
      config.webpack!(mockConfig, mockContext);
    });
  });

  describe('error handling', () => {
    let mockConfig: WebpackConfig;

    beforeEach(() => {
      mockConfig = createMockWebpackConfig();
    });

    it('should throw error when defaultLoaders is not available (Next.js < 5)', () => {
      const config = withImages();
      const oldContext = { isServer: false } as WebpackConfigContext;

      expect(() => config.webpack!(mockConfig, oldContext)).toThrow(
        'This plugin is not compatible with Next.js versions below 5.0.0'
      );
    });
  });

  describe('issuer pattern', () => {
    let mockConfig: WebpackConfig;
    let mockContext: WebpackConfigContext;

    beforeEach(() => {
      mockConfig = createMockWebpackConfig();
      mockContext = createMockWebpackContext();
    });

    it('should exclude CSS/SCSS/SASS files from issuer pattern', () => {
      const config = withImages();
      const result = config.webpack!(mockConfig, mockContext);

      const rule = result.module.rules[0]!;
      const issuerRegex = rule.issuer as RegExp;

      // Should match JS/TS files
      expect(issuerRegex.test('component.js')).toBe(true);
      expect(issuerRegex.test('component.ts')).toBe(true);
      expect(issuerRegex.test('component.tsx')).toBe(true);

      // Should NOT match CSS/SCSS/SASS files
      expect(issuerRegex.test('style.css')).toBe(false);
      expect(issuerRegex.test('style.scss')).toBe(false);
      expect(issuerRegex.test('style.sass')).toBe(false);
    });
  });

  describe('issuer pattern edge cases', () => {
    let mockConfig: WebpackConfig;
    let mockContext: WebpackConfigContext;

    beforeEach(() => {
      mockConfig = createMockWebpackConfig();
      mockContext = createMockWebpackContext();
    });

    it('should handle various file extensions in issuer pattern', () => {
      const config = withImages();
      const result = config.webpack!(mockConfig, mockContext);

      const rule = result.module.rules[0]!;
      const issuerRegex = rule.issuer as RegExp;

      // Should match various file types
      expect(issuerRegex.test('file.jsx')).toBe(true);
      expect(issuerRegex.test('file.mjs')).toBe(true);
      expect(issuerRegex.test('file.cjs')).toBe(true);
      expect(issuerRegex.test('file.json')).toBe(true);
    });
  });

  describe('serverRuntimeConfig merging', () => {
    it('should preserve existing serverRuntimeConfig when dynamicAssetPrefix is enabled', () => {
      const config = withImages({ 
        dynamicAssetPrefix: true,
        assetPrefix: 'https://cdn.example.com',
        serverRuntimeConfig: {
          existingKey: 'existingValue',
        },
      });

      expect((config.serverRuntimeConfig as Record<string, unknown>).existingKey).toBe('existingValue');
      expect((config.serverRuntimeConfig as Record<string, unknown>).nextImagesAssetPrefix).toBe('https://cdn.example.com');
    });

    it('should not modify serverRuntimeConfig when dynamicAssetPrefix is disabled', () => {
      const config = withImages({ 
        serverRuntimeConfig: {
          existingKey: 'existingValue',
        },
      });

      expect(config.serverRuntimeConfig).toEqual({ existingKey: 'existingValue' });
    });
  });
});