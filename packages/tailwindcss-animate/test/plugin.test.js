// Minimal smoke test: ensure the plugin module loads without error.
try {
  require('../index.js');
  console.log('✓ @opensourceframework/tailwindcss-animate plugin loads correctly');
} catch (err) {
  console.error('✗ Failed to load plugin:', err);
  process.exit(1);
}
