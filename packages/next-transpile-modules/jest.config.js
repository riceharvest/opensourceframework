module.exports = {
  preset: 'jest-puppeteer',
  testPathIgnorePatterns: ['node_modules', '__apps__'],
  testRegex: '__tests__/.*\\.test\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
};
