const nextPwa = require('@opensourceframework/next-pwa');

const withPWA = nextPwa({
  dest: 'public',
  register: true,
  scope: '/',
  sw: 'service-worker.js',
  disable: false,
});

const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = withPWA(nextConfig);
