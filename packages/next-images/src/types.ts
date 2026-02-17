/**
 * Type definitions for next-images
 *
 * These types are compatible with Next.js 12-16
 */

/**
 * Webpack configuration object (simplified)
 */
export interface WebpackConfig {
  module: {
    rules: Array<{
      test: RegExp;
      issuer?: RegExp;
      exclude?: RegExp | string;
      use?: Array<{
        loader: string;
        options?: Record<string, unknown>;
      }>;
    }>;
  };
  [key: string]: unknown;
}

/**
 * Webpack build context options
 */
export interface WebpackContextOptions {
  /** Whether this is a server-side build */
  isServer: boolean;
  /** Whether this is a development build */
  dev?: boolean;
  /** Default loaders provided by Next.js */
  defaultLoaders?: {
    babel?: unknown;
  };
  /** Build ID */
  buildId?: string;
  /** Config object */
  config?: NextConfig;
  /** Total pages */
  totalPages?: number;
  /** Directory to output build */
  distDir?: string;
  /** Whether the build has a static export */
  hasExport?: boolean;
  /** Directory for static export */
  exportPathMap?: () => Record<string, unknown>;
}

/**
 * Webpack configuration function context
 */
export interface WebpackConfigContext extends WebpackContextOptions {
  /** Entry points */
  entry?: Record<string, string[]>;
  /** Whether this is for static export */
  isStatic?: boolean;
  /** Default loaders */
  defaultLoaders: {
    babel: unknown;
  };
}

/**
 * Next.js configuration object
 */
export interface NextConfig {
  /** Asset prefix for CDN support */
  assetPrefix?: string;
  /** Base path for the application */
  basePath?: string;
  /** Server-side runtime configuration */
  serverRuntimeConfig?: Record<string, unknown>;
  /** Public runtime configuration */
  publicRuntimeConfig?: Record<string, unknown>;
  /** Webpack configuration function */
  webpack?: (
    config: WebpackConfig,
    options: WebpackConfigContext
  ) => WebpackConfig;
  /** Experimental features */
  experimental?: Record<string, unknown>;
  /** Environment variables */
  env?: Record<string, string>;
  /** Rewrites for routing */
  rewrites?:
    | Array<{
        source: string;
        destination: string;
      }>
    | (() => Promise<Array<{ source: string; destination: string }>>);
  /** Redirects for routing */
  redirects?:
    | Array<{
        source: string;
        destination: string;
        permanent?: boolean;
      }>
    | (() => Promise<Array<{ source: string; destination: string; permanent?: boolean }>>);
  /** Headers configuration */
  headers?:
    | Array<{
        source: string;
        headers: Array<{ key: string; value: string }>;
      }>
    | (() => Promise<Array<{ source: string; headers: Array<{ key: string; value: string }> }>>);
  /** Image optimization configuration */
  images?: {
    domains?: string[];
    loader?: 'default' | 'imgix' | 'cloudinary' | 'akamai' | 'custom';
    path?: string;
    deviceSizes?: number[];
    imageSizes?: number[];
    minimumCacheTTL?: number;
    formats?: ('image/avif' | 'image/webp')[];
    dangerouslyAllowSVG?: boolean;
    contentSecurityPolicy?: string;
  };
  /** TypeScript configuration */
  typescript?: {
    ignoreBuildErrors?: boolean;
  };
  /** ESLint configuration */
  eslint?: {
    ignoreDuringBuilds?: boolean;
  };
  /** Output configuration */
  output?: 'standalone' | 'export';
  /** Other configuration options */
  [key: string]: unknown;
}