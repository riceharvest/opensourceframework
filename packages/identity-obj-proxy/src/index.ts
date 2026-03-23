/**
 * An identity object using ES6 proxies.
 * Useful for mocking CSS modules in Jest where `styles.foo` evaluates to `"foo"`.
 */
const idObj = new Proxy(
  {},
  {
    get: function getter(_target, key) {
      if (key === '__esModule') {
        return false;
      }
      return key;
    },
  }
);

export default idObj;
