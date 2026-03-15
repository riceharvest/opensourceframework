const path = require('path');

const getOptimizerLoaderPath = () => path.resolve(__dirname, 'optimized-buffer-loader.js');

module.exports = {
  getOptimizerLoaderPath,
};
