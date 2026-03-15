const { getOptions: getLoaderUtilsOptions } = require('loader-utils');

const getLoaderOptions = (context) => {
  if (typeof context.getOptions === 'function') {
    return context.getOptions() || {};
  }

  return getLoaderUtilsOptions(context) || {};
};

const normalizeBuffer = (value, fallback) => {
  if (value === undefined) {
    return fallback;
  }

  return Buffer.isBuffer(value) ? value : Buffer.from(value);
};

const runPlugins = async (input, plugins) => {
  let output = input;

  for (const plugin of plugins) {
    output = normalizeBuffer(await plugin(output), output);
  }

  return output;
};

module.exports = function optimizedBufferLoader(content, map, meta) {
  const options = Object.assign({}, getLoaderOptions(this));

  if (typeof options.plugins === 'function') {
    options.plugins = options.plugins(this);
  }

  if (!Array.isArray(options.plugins) || options.plugins.length === 0) {
    return content;
  }

  const callback = this.async();

  runPlugins(content, options.plugins)
    .then((buffer) => callback(null, buffer, map, meta))
    .catch((error) => callback(error));
};

module.exports.raw = true;
