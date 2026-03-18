import { composePlugins } from './compose';
import { markOptional } from './optional';

/**
 * Composes all plugins together.
 *
 * @param {array} plugins - all plugins to load and initialize
 * @param {object|Promise} nextConfig - direct configuration for next.js (optional)
 */
const withPlugins = ([...plugins], nextConfig = {}) => async (phase, { defaultConfig }) => {
  const resolvedNextConfig = await (typeof nextConfig === 'function' ? nextConfig(phase, { defaultConfig }) : nextConfig);

  const config = {
    ...defaultConfig,
    ...resolvedNextConfig,
  };

  return composePlugins(phase, plugins, config);
};

/**
 * Extends a base next config.
 *
 * @param {function} baseConfig - basic configuration
 */
const extend = baseConfig => ({
  withPlugins: (...params) => async (phase, nextOptions) => {
    const processedBaseConfig = await baseConfig(phase, nextOptions);

    return withPlugins(...params)(phase, {
      ...nextOptions,
      defaultConfig: processedBaseConfig,
    });
  },
});

withPlugins.optional = markOptional;
withPlugins.extend = extend;

export { withPlugins, extend, markOptional as optional };
export default withPlugins;
