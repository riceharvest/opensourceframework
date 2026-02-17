/**
 * next-images - Import images in Next.js
 *
 * This package allows you to import images (jpg, jpeg, png, svg, gif, ico, webp, jp2, avif)
 * in your Next.js project using webpack file-loader and url-loader.
 *
 * @packageDocumentation
 *
 * @deprecated
 * This package is deprecated. Next.js 10+ includes a built-in Image component
 * that provides automatic image optimization, lazy loading, and better performance.
 * Consider migrating to next/image instead.
 * @see https://nextjs.org/docs/api-reference/next/image
 *
 * @license MIT
 * @originalAuthor Aref Aslani (twopluszero)
 * @originalRepo https://github.com/twopluszero/next-images
 */

import type { NextConfig, WebpackConfig, WebpackConfigContext } from './types';

export type { NextConfig, WebpackConfig, WebpackConfigContext } from './types';

/**
 * Configuration options for the withImages plugin
 */
export interface WithImagesOptions {
  /**
   * Maximum file size (in bytes) for inlining images as Base64.
   * Images smaller than this limit will be inlined as data URLs.
   * Set to `false` to disable inlining entirely.
   * @default 8192 (8KB)
   */
  inlineImageLimit?: number | false;

  /**
   * Asset prefix for serving images from a CDN or external domain.
   * @see https://nextjs.org/docs/api-reference/next.config.js/cdn-support-with-asset-prefix
   */
  assetPrefix?: string;

  /**
   * Base path for the application.
   * @see https://nextjs.org/docs/api-reference/next.config.js/basepath
   */
  basePath?: string;

  /**
   * File extensions to handle with this loader.
   * @default ["jpg", "jpeg", "png", "svg", "gif", "ico", "webp", "jp2", "avif"]
   */
  fileExtensions?: string[];

  /**
   * Paths to exclude from the loader.
   * Useful when you want to handle certain files with a different loader (e.g., svg-react-loader).
   */
  exclude?: RegExp | string;

  /**
   * Template for output file names.
   * @default "[name]-[hash].[ext]"
   * @see https://github.com/webpack/loader-utils#interpolatename
   */
  name?: string;

  /**
   * Enable ES modules syntax for the output.
   * When enabled, you need to use `.default` when using require().
   * @default false
   */
  esModule?: boolean;

  /**
   * Enable dynamic asset prefix resolution at runtime.
   * Useful when assetPrefix can change dynamically.
   * @default false
   */
  dynamicAssetPrefix?: boolean;

  /**
   * Custom webpack configuration function.
   * This will be merged with the image loader configuration.
   */
  webpack?: NextConfig['webpack'];

  /**
   * Server runtime configuration.
   */
  serverRuntimeConfig?: Record<string, unknown>;
}

/**
 * Result type of the withImages function - a Next.js configuration object
 */
export type WithImagesResult = NextConfig & {
  serverRuntimeConfig?: Record<string, unknown>;
};

/**
 * Default file extensions supported by the loader
 */
export const DEFAULT_FILE_EXTENSIONS = [
  'jpg',
  'jpeg',
  'png',
  'svg',
  'gif',
  'ico',
  'webp',
  'jp2',
  'avif',
] as const;

/**
 * Default inline image limit (8KB)
 */
export const DEFAULT_INLINE_IMAGE_LIMIT = 8192;

/**
 * Default output file name template
 */
export const DEFAULT_NAME = '[name]-[hash].[ext]';

/**
 * Next.js plugin for importing images in your project.
 *
 * This function wraps your Next.js configuration and adds webpack rules
 * for handling image files using url-loader (for small images) and file-loader
 * (for larger images).
 *
 * @param nextConfig - Your existing Next.js configuration options
 * @returns Modified Next.js configuration with image handling
 *
 * @example
 * ```js
 * // next.config.js
 * const withImages = require('next-images');
 *
 * module.exports = withImages();
 * ```
 *
 * @example
 * ```js
 * // With custom options
 * const withImages = require('next-images');
 *
 * module.exports = withImages({
 *   inlineImageLimit: 16384,
 *   fileExtensions: ['jpg', 'png', 'svg'],
 *   webpack(config, options) {
 *     // Additional webpack configuration
 *     return config;
 *   }
 * });
 * ```
 *
 * @deprecated
 * Consider using Next.js built-in Image component instead.
 * @see https://nextjs.org/docs/api-reference/next/image
 */
function withImages(nextConfig: WithImagesOptions = {}): WithImagesResult {
  const {
    dynamicAssetPrefix = false,
    inlineImageLimit = DEFAULT_INLINE_IMAGE_LIMIT,
    assetPrefix = '',
    basePath = '',
    fileExtensions = [...DEFAULT_FILE_EXTENSIONS],
    exclude,
    name = DEFAULT_NAME,
    esModule = false,
    ...restConfig
  } = nextConfig;

  return Object.assign({}, restConfig as NextConfig, {
    // Configure server runtime config for dynamic asset prefix
    serverRuntimeConfig: dynamicAssetPrefix
      ? Object.assign({}, nextConfig.serverRuntimeConfig, {
          nextImagesAssetPrefix: assetPrefix || basePath,
        })
      : nextConfig.serverRuntimeConfig,

    /**
     * Webpack configuration modifier
     * Adds rules for handling image files
     */
    webpack(config: WebpackConfig, options: WebpackConfigContext): WebpackConfig {
      const { isServer } = options;

      // Check for Next.js version compatibility
      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0. ' +
            'Please upgrade Next.js to version 5.0.0 or higher. ' +
            'See: https://nextjs.org/docs/migrating'
        );
      }

      // Create regex pattern for matching image file extensions
      const extensionsPattern = fileExtensions.join('|');
      const testRegex = new RegExp(`\\.(${extensionsPattern})$`);

      // Issuer pattern: Next.js already handles url() in CSS/SCSS/SASS files
      // We only want to handle images imported from JS/TS files
      const issuerRegex = new RegExp('\\.\\w+(?<!(s?c|sa)ss)$', 'i');

      // Build the webpack rule for image files
      const imageRule = {
        test: testRegex,
        issuer: issuerRegex,
        exclude: exclude,
        use: [
          {
            loader: require.resolve('url-loader'),
            options: {
              // Inline images below the limit as Base64
              limit: inlineImageLimit === false ? -1 : inlineImageLimit,
              // Use file-loader for images above the limit
              fallback: require.resolve('file-loader'),
              // Output path for image files
              outputPath: `${isServer ? '../' : ''}static/images/`,
              // Public path configuration
              ...(dynamicAssetPrefix
                ? {
                    // Dynamic public path for runtime resolution
                    publicPath: `${isServer ? '/_next/' : ''}static/images/`,
                    postTransformPublicPath: (p: string): string => {
                      if (isServer) {
                        // On server, resolve asset prefix from runtime config
                        return `(require("next/config").default().serverRuntimeConfig.nextImagesAssetPrefix || '') + ${p}`;
                      }
                      // On client, use webpack public path
                      return `(__webpack_public_path__ || '') + ${p}`;
                    },
                  }
                : {
                    // Static public path from config
                    publicPath: `${assetPrefix || basePath || ''}/_next/static/images/`,
                  }),
              // Output file name template
              name: name,
              // ES modules syntax
              esModule: esModule,
            },
          },
        ],
      };

      // Add the image rule to webpack config
      config.module.rules.push(imageRule);

      // Call user's custom webpack function if provided
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
}

export { withImages };

// Default export for CommonJS compatibility
export default withImages;