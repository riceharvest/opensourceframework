const moduleExports = require('./dist/index.cjs');

const withImages = moduleExports.default || moduleExports.withImages;

module.exports = Object.assign(withImages, moduleExports, {
  default: withImages,
});
