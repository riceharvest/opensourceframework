import type { NextConfig } from 'next';

export interface PWAPluginOptions {
  disable?: boolean;
  register?: boolean;
  dest?: string;
  sw?: string;
  cacheStartUrl?: boolean;
  dynamicStartUrl?: boolean;
  dynamicStartUrlRedirect?: string;
  skipWaiting?: boolean;
  clientsClaim?: boolean;
  cleanupOutdatedCaches?: boolean;
  additionalManifestEntries?: unknown[];
  ignoreURLParametersMatching?: RegExp[];
  importScripts?: string[];
  publicExcludes?: string[];
  buildExcludes?: Array<string | RegExp>;
  modifyURLPrefix?: Record<string, string>;
  manifestTransforms?: Array<(...args: unknown[]) => unknown>;
  fallbacks?: Record<string, string>;
  cacheOnFrontEndNav?: boolean;
  reloadOnOnline?: boolean;
  scope?: string;
  customWorkerDir?: string;
  subdomainPrefix?: string;
  [key: string]: unknown;
}

declare function withPWA(pluginOptions?: PWAPluginOptions): (nextConfig?: NextConfig) => NextConfig;

export = withPWA;
