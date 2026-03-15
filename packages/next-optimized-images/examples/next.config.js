const withPlugins = require('@opensourceframework/next-compose-plugins');
const optimizedImages = require('next-optimized-images');

module.exports = withPlugins([
  optimizedImages,
]);
