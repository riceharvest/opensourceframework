'use strict';

const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

let globbyModule,
  CleanWebpackPlugin,
  WorkboxPlugin,
  defaultCache,
  buildCustomWorker,
  buildFallbackWorker;

const getRevision = (file) => crypto.createHash('md5').update(fs.readFileSync(file)).digest('hex');

function detectTurbopack() {
  return (
    process.env.NEXT_TURBOPACK === 'true' ||
    process.env.__NEXT_TURBOPACK === 'true' ||
    process.argv.includes('--turbo')
  );
}

function lazyLoadGlobby() {
  if (!globbyModule) {
    globbyModule = require('globby');
  }
  return globbyModule;
}

module.exports =
  (pluginOptions = {}) =>
  (nextConfig = {}) => {
    const isTurbopack = detectTurbopack();

    const {
      disable = false,
      register = true,
      dest,
      sw = 'sw.js',
      cacheStartUrl = true,
      dynamicStartUrl = true,
      dynamicStartUrlRedirect,
      skipWaiting = true,
      clientsClaim = true,
      cleanupOutdatedCaches = true,
      additionalManifestEntries,
      ignoreURLParametersMatching = [],
      importScripts = [],
      publicExcludes = ['!noprecache/**/*'],
      buildExcludes = [],
      modifyURLPrefix = {},
      manifestTransforms = [],
      fallbacks = {},
      cacheOnFrontEndNav = false,
      reloadOnOnline = true,
      scope,
      customWorkerDir = 'worker',
      subdomainPrefix,
      ...workbox
    } = pluginOptions;

    if (disable) {
      console.log('> [PWA] PWA support is disabled');
      return nextConfig;
    }

    if (subdomainPrefix) {
      console.error(
        '> [PWA] subdomainPrefix is deprecated, use basePath in next.config.js instead: https://nextjs.org/docs/api-reference/next.config.js/basepath'
      );
    }

    if (isTurbopack) {
      console.log('> [PWA] Turbopack detected - generating service worker with buildId');
      console.log('> [PWA] Note: Using Turbopack-compatible PWA service worker');

      const basePath = nextConfig.basePath || '/';
      const _sw = sw.startsWith('/') ? sw : `/${sw}`;
      const _scope = path.posix.join(scope || basePath, '/');

      return {
        ...nextConfig,
        webpack(config, options) {
          const { buildId, dir } = options;
          const _dest = path.join(dir, dest || '.next');

          const swContent = `// Turbopack PWA Service Worker - ${buildId}
const CACHE_NAME = 'pwa-${buildId}';
const START_URL = '${basePath}';
const SCOPE = '${_scope}';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        START_URL
      ]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('pwa-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            if (event.request.method === 'GET') {
              cache.put(event.request, fetchResponse.clone());
            }
            return fetchResponse;
          });
        });
      }).catch(() => caches.match('/'))
    );
  }
});
`;

          const fs = require('fs');
          const swPath = path.join(_dest, _sw.replace(/^\/+/, ''));
          const swDir = path.dirname(swPath);
          
          if (!fs.existsSync(swDir)) {
            fs.mkdirSync(swDir, { recursive: true });
          }
          
          fs.writeFileSync(swPath, swContent);
          console.log(`> [PWA] Service worker generated: ${swPath}`);

          config.plugins.push(
            new (require('webpack').DefinePlugin)({
              __PWA_SW__: `'${_sw}'`,
              __PWA_SCOPE__: `'${_scope}'`,
              __PWA_ENABLE_REGISTER__: `${Boolean(register)}`,
              __PWA_START_URL__: dynamicStartUrl ? `'${basePath}'` : undefined,
              __PWA_CACHE_ON_FRONT_END_NAV__: `${Boolean(cacheOnFrontEndNav)}`,
              __PWA_RELOAD_ON_ONLINE__: `${Boolean(reloadOnOnline)}`,
            })
          );

          const registerJs = path.join(__dirname, 'register.js');
          const entry = config.entry;
          config.entry = () =>
            entry().then((entries) => {
              if (entries['main.js'] && !entries['main.js'].includes(registerJs)) {
                entries['main.js'].unshift(registerJs);
              }
              return entries;
            });

          return config;
        },
        async headers() {
          const baseHeaders = nextConfig.headers ? await nextConfig.headers() : [];
          return [
            ...(Array.isArray(baseHeaders) ? baseHeaders : []),
            {
              source: '/:path*',
              headers: [
                {
                  key: 'Link',
                  value: `<${path.join(basePath, 'manifest.json')}>; rel=manifest`,
                },
              ],
            },
          ];
        },
      };
    }

    try {
      const { CleanWebpackPlugin: CWP } = require('clean-webpack-plugin');
      const { GenerateSW, InjectManifest } = require('workbox-webpack-plugin');
      CleanWebpackPlugin = CWP;
      WorkboxPlugin = { GenerateSW, InjectManifest };
    } catch (e) {
      console.warn(
        '> [PWA] Warning: workbox-webpack-plugin not installed. Run: npm install workbox-webpack-plugin'
      );
      return nextConfig;
    }

    try {
      defaultCache = require('./cache');
      buildCustomWorker = require('./build-custom-worker');
      buildFallbackWorker = require('./build-fallback-worker');
    } catch (e) {
      console.warn('> [PWA] Warning: Could not load helper modules:', e.message);
    }

    const globby = lazyLoadGlobby();

    return Object.assign({}, nextConfig, {
      webpack(config, options) {
        const {
          webpack,
          buildId,
          dev,
          config: {
            distDir = '.next',
            pageExtensions = ['tsx', 'ts', 'jsx', 'js', 'mdx'],
            experimental = {},
          },
        } = options;

        let basePath = options.config.basePath;
        if (!basePath) basePath = '/';

        if (typeof nextConfig.webpack === 'function') {
          config = nextConfig.webpack(config, options);
        }

        if (disable) {
          options.isServer && console.log('> [PWA] PWA support is disabled');
          return config;
        }

        console.log(`> [PWA] Compile ${options.isServer ? 'server' : 'client (static)'}`);

        let { runtimeCaching = defaultCache } = pluginOptions;
        const _scope = path.posix.join(scope || basePath, '/');

        const _sw = path.posix.join(basePath, sw.startsWith('/') ? sw : `/${sw}`);
        config.plugins.push(
          new webpack.DefinePlugin({
            __PWA_SW__: `'${_sw}'`,
            __PWA_SCOPE__: `'${_scope}'`,
            __PWA_ENABLE_REGISTER__: `${Boolean(register)}`,
            __PWA_START_URL__: dynamicStartUrl ? `'${basePath}'` : undefined,
            __PWA_CACHE_ON_FRONT_END_NAV__: `${Boolean(cacheOnFrontEndNav)}`,
            __PWA_RELOAD_ON_ONLINE__: `${Boolean(reloadOnOnline)}`,
          })
        );

        const registerJs = path.join(__dirname, 'register.js');
        const entry = config.entry;
        config.entry = () =>
          entry().then((entries) => {
            if (entries['main.js'] && !entries['main.js'].includes(registerJs)) {
              entries['main.js'].unshift(registerJs);
            }
            return entries;
          });

        if (!options.isServer) {
          const _dest = path.join(options.dir, dest || distDir);
          const customWorkerScriptName = buildCustomWorker({
            id: buildId,
            basedir: options.dir,
            customWorkerDir,
            destdir: _dest,
            plugins: config.plugins.filter((plugin) => plugin instanceof webpack.DefinePlugin),
            minify: !dev,
          });

          if (!!customWorkerScriptName) {
            importScripts.unshift(customWorkerScriptName);
          }

          if (register) {
            console.log(`> [PWA] Auto register service worker with: ${path.resolve(registerJs)}`);
          } else {
            console.log(
              `> [PWA] Auto register service worker is disabled, please call following code in componentDidMount callback or useEffect hook`
            );
            console.log(`> [PWA]   window.workbox.register()`);
          }

          console.log(`> [PWA] Service worker: ${path.join(_dest, sw)}`);
          console.log(`> [PWA]   url: ${_sw}`);
          console.log(`> [PWA]   scope: ${_scope}`);

          config.plugins.push(
            new CleanWebpackPlugin({
              cleanOnceBeforeBuildPatterns: [
                path.join(_dest, 'workbox-*.js'),
                path.join(_dest, 'worker-*.js.LICENSE.txt'),
                path.join(_dest, 'workbox-*.js.map'),
                path.join(_dest, sw),
                path.join(_dest, `${sw}.map`),
              ],
            })
          );

          let manifestEntries = additionalManifestEntries;
          if (!Array.isArray(manifestEntries)) {
            manifestEntries = globby
              .sync(
                [
                  '**/*',
                  '!workbox-*.js',
                  '!workbox-*.js.map',
                  '!worker-*.js',
                  '!worker-*.js.map',
                  '!fallback-*.js',
                  '!fallback-*.js.map',
                  `!${sw.replace(/^\/+/, '')}`,
                  `!${sw.replace(/^\/+/, '')}.map`,
                  ...publicExcludes,
                ],
                {
                  cwd: 'public',
                }
              )
              .map((f) => ({
                url: path.posix.join(basePath, `/${f}`),
                revision: getRevision(`public/${f}`),
              }));
          }

          if (cacheStartUrl) {
            if (!dynamicStartUrl) {
              manifestEntries.push({
                url: basePath,
                revision: buildId,
              });
            } else if (
              typeof dynamicStartUrlRedirect === 'string' &&
              dynamicStartUrlRedirect.length > 0
            ) {
              manifestEntries.push({
                url: dynamicStartUrlRedirect,
                revision: buildId,
              });
            }
          }

          let _fallbacks = fallbacks;
          if (_fallbacks) {
            const res = buildFallbackWorker({
              id: buildId,
              fallbacks,
              basedir: options.dir,
              destdir: _dest,
              minify: !dev,
              pageExtensions,
            });

            if (res) {
              _fallbacks = res.fallbacks;
              importScripts.unshift(res.name);
              res.precaches.forEach((route) => {
                if (!manifestEntries.find((entry) => entry.url.startsWith(route))) {
                  manifestEntries.push({
                    url: route,
                    revision: buildId,
                  });
                }
              });
            } else {
              _fallbacks = undefined;
            }
          }

          const workboxCommon = {
            swDest: path.join(_dest, sw),
            additionalManifestEntries: dev ? [] : manifestEntries,
            exclude: [
              ...buildExcludes,
              ({ asset, compilation }) => {
                if (
                  asset.name.startsWith('server/') ||
                  asset.name.match(/^(build-manifest\.json|react-loadable-manifest\.json)$/)
                ) {
                  return true;
                }
                if (dev && !asset.name.startsWith('static/runtime/')) {
                  return true;
                }
                if (experimental.modern /* modern */) {
                  if (asset.name.endsWith('.module.js')) {
                    return false;
                  }
                  if (asset.name.endsWith('.js')) {
                    return true;
                  }
                }
                return false;
              },
            ],
            modifyURLPrefix: {
              ...modifyURLPrefix,
              '/_next/../public/': '/',
            },
            manifestTransforms: [
              ...manifestTransforms,
              async (manifestEntries, compilation) => {
                const manifest = manifestEntries.map((m) => {
                  m.url = m.url.replace('/_next//static/image', '/_next/static/image');
                  m.url = m.url.replace('/_next//static/media', '/_next/static/media');
                  if (m.revision === null) {
                    let key = m.url;
                    if (key.startsWith(config.output.publicPath)) {
                      key = m.url.substring(config.output.publicPath.length);
                    }
                    const assset = compilation.assetsInfo.get(key);
                    m.revision = assset ? assset.contenthash || buildId : buildId;
                  }
                  m.url = m.url.replace(/\[/g, '%5B').replace(/\]/g, '%5D');
                  return m;
                });
                return { manifest, warnings: [] };
              },
            ],
          };

          if (workbox.swSrc) {
            const swSrc = path.join(options.dir, workbox.swSrc);
            console.log(`> [PWA] Inject manifest in ${swSrc}`);
            config.plugins.push(
              new WorkboxPlugin.InjectManifest({
                ...workboxCommon,
                ...workbox,
                swSrc,
              })
            );
          } else {
            if (dev) {
              console.log(
                '> [PWA] Build in develop mode, cache and precache are mostly disabled. This means offline support is disabled, but you can continue developing other functions in service worker.'
              );

              ignoreURLParametersMatching.push(/ts/);
              runtimeCaching = [
                {
                  urlPattern: /.*/i,
                  handler: 'NetworkOnly',
                  options: {
                    cacheName: 'dev',
                  },
                },
              ];
            }

            if (dynamicStartUrl) {
              runtimeCaching.unshift({
                urlPattern: basePath,
                handler: 'NetworkFirst',
                options: {
                  cacheName: 'start-url',
                  plugins: [
                    {
                      cacheWillUpdate: async ({ request, response, event, state }) => {
                        if (response && response.type === 'opaqueredirect') {
                          return new Response(response.body, {
                            status: 200,
                            statusText: 'OK',
                            headers: response.headers,
                          });
                        }
                        return response;
                      },
                    },
                  ],
                },
              });
            }

            if (_fallbacks) {
              runtimeCaching.forEach((c) => {
                if (c.options.precacheFallback) return;
                if (
                  Array.isArray(c.options.plugins) &&
                  c.options.plugins.find((p) => 'handlerDidError' in p)
                )
                  return;
                if (!c.options.plugins) c.options.plugins = [];
                c.options.plugins.push({
                  handlerDidError: async ({ request }) => self.fallback(request),
                });
              });
            }

            config.plugins.push(
              new WorkboxPlugin.GenerateSW({
                ...workboxCommon,
                skipWaiting,
                clientsClaim,
                cleanupOutdatedCaches,
                ignoreURLParametersMatching,
                importScripts,
                ...workbox,
                runtimeCaching,
              })
            );
          }
        }

        return config;
      },
    });
  };
