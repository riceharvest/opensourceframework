const {
  isModuleInstalled,
  detectLoaders,
  getHandledImageTypes,
  getNumOptimizationLoadersInstalled,
  appendLoaders,
} = require('../../lib/loaders');
const { getConfig } = require('../../lib/config');
const Module = require('module');
const path = require('path');

const imageminPluginPath = path.join(__dirname, '../fixtures/imagemin-plugin.js');
const optionalLoaderNames = new Set([
  'imagemin-mozjpeg',
  'imagemin-gifsicle',
  'imagemin-svgo',
  'svg-sprite-loader',
  'webp-loader',
  'lqip-loader',
  'imagemin-optipng',
  'imagemin-pngquant',
  'responsive-loader',
]);

describe('next-optimized-images/loaders', () => {
  it('detects if a module is installed', () => {
    expect(isModuleInstalled('path')).toEqual(true);
    expect(isModuleInstalled('pathalksdfjladksfj')).toEqual(false);
    expect(isModuleInstalled('./fixtures/imagemin-plugin', path.join(__dirname, '..'))).toEqual(true);
    expect(isModuleInstalled('./fixtures/missing-plugin', path.join(__dirname, '..'))).toEqual(false);
  });

  it('detects installed loaders', () => {
    const originalResolveFilename = Module._resolveFilename;
    const resolveSpy = vi.spyOn(Module, '_resolveFilename').mockImplementation(function (...args) {
      const [request] = args;

      if (optionalLoaderNames.has(request)) {
        const error = new Error(`Cannot find module '${request}'`);
        error.code = 'MODULE_NOT_FOUND';
        throw error;
      }

      return originalResolveFilename.apply(this, args);
    });

    try {
      expect(detectLoaders()).toEqual({
        jpeg: false,
        gif: false,
        svg: false,
        svgSprite: false,
        webp: false,
        png: false,
        lqip: false,
        responsive: false,
        responsiveAdapter: false,
      });
    } finally {
      resolveSpy.mockRestore();
    }
  });

  it('returns the handled image types', () => {
    expect(getHandledImageTypes(getConfig({}))).toEqual({
      jpeg: true,
      png: true,
      svg: true,
      webp: true,
      gif: true,
      ico: false,
    });

    expect(getHandledImageTypes(getConfig({ handleImages: ['jpg', 'png', 'ico'] }))).toEqual({
      jpeg: true,
      png: true,
      svg: false,
      webp: false,
      gif: false,
      ico: true,
    });

    expect(getHandledImageTypes(getConfig({ handleImages: [] }))).toEqual({
      jpeg: false,
      png: false,
      svg: false,
      webp: false,
      gif: false,
      ico: false,
    });
  });

  it('counts the number of optimization loaders', () => {
    expect(getNumOptimizationLoadersInstalled({
      jpeg: 'imagemin-jpeg',
      png: 'imagemin-png',
      svgSprite: false,
    })).toEqual(2);
  });

  it('appends loaders to the webpack config', () => {
    const webpackConfig = { module: { rules: [] } };

    appendLoaders(webpackConfig, getConfig({}), {
      jpeg: imageminPluginPath,
      webp: imageminPluginPath,
    }, false, true);

    expect(webpackConfig.module.rules).toHaveLength(2);
  });
});
