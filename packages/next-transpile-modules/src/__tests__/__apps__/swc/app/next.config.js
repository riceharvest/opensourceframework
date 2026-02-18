const withTM = require('./next-transpile-modules')(['shared', 'shared-ts', 'shared-ui', 'lodash-es'], { debug: true });

module.exports = withTM({
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    swcMinify: true,
    swcLoader: true,
  },
});
