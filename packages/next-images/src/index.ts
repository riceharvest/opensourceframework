/**
 * next-images - Import images in Next.js
 *
 * A compatibility-first fork that preserves the classic next-images workflow
 * for teams that want minimal migration from the original package.
 *
 * This package allows you to import images (jpg, jpeg, png, svg, gif, ico, webp, jp2, avif)
 * in your Next.js project using webpack file-loader and url-loader.
 *
 * @packageDocumentation
 * @license MIT
 * @originalAuthor Aref Aslani (twopluszero)
 * @originalRepo https://github.com/twopluszero/next-images
 */

import type { NextConfig, WebpackConfig, WebpackConfigContext } from './types';

export type { NextConfig, WebpackConfig, WebpackConfigContext } from './types';

export interface WithImagesOptions {
  inlineImageLimit?: number | false;
  assetPrefix?: string;
  basePath?: string;
  fileExtensions?: string[];
  exclude?: RegExp | string;
  name?: string;
  esModule?: boolean;
  dynamicAssetPrefix?: boolean;
  webpack?: NextConfig['webpack'];
  serverRuntimeConfig?: Record<string, unknown>;
}

export type WithImagesResult = NextConfig & {
  serverRuntimeConfig?: Record<string, unknown>;
};

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

export const DEFAULT_INLINE_IMAGE_LIMIT = 8192;
export const DEFAULT_NAME = '[name]-[hash].[ext]';

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
    serverRuntimeConfig: dynamicAssetPrefix
      ? Object.assign({}, nextConfig.serverRuntimeConfig, {
          nextImagesAssetPrefix: assetPrefix || basePath,
        })
      : nextConfig.serverRuntimeConfig,

    webpack(config: WebpackConfig, options: WebpackConfigContext): WebpackConfig {
      const { isServer } = options;

      if (!options.defaultLoaders) {
        throw new Error(
          'This plugin is not compatible with Next.js versions below 5.0.0. ' +
            'Please upgrade Next.js to version 5.0.0 or higher. ' +
            'See: https://nextjs.org/docs/migrating'
        );
      }

      const extensionsPattern = fileExtensions.join('|');
      const testRegex = new RegExp(`\\.(${extensionsPattern})$`);
      const issuerRegex = new RegExp('\\.\\w+(?<!(s?c|sa)ss)$', 'i');

      const imageRule = {
        test: testRegex,
        issuer: issuerRegex,
        exclude: exclude,
        use: [
          {
            loader: require.resolve('url-loader'),
            options: {
              limit: inlineImageLimit === false ? -1 : inlineImageLimit,
              fallback: require.resolve('file-loader'),
              outputPath: `${isServer ? '../' : ''}static/images/`,
              ...(dynamicAssetPrefix
                ? {
                    publicPath: `${isServer ? '/_next/' : ''}static/images/`,
                    postTransformPublicPath: (p: string): string => {
                      if (isServer) {
                        return `(require("next/config").default().serverRuntimeConfig.nextImagesAssetPrefix || '') + ${p}`;
                      }
                      return `(__webpack_public_path__ || '') + ${p}`;
                    },
                  }
                : {
                    publicPath: `${assetPrefix || basePath || ''}/_next/static/images/`,
                  }),
              name: name,
              esModule: esModule,
            },
          },
        ],
      };

      config.module.rules.push(imageRule);

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  });
}

export { withImages };
export default withImages;
