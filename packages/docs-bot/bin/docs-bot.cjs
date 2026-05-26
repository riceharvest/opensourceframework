#!/usr/bin/env node

const path = require('node:path');
const fs = require('node:fs');
const { spawnSync } = require('node:child_process');

const entrypoint = path.join(__dirname, '..', 'dist', 'index.js');

if (!fs.existsSync(entrypoint)) {
  console.error(
    'The @opensourceframework/docs-bot CLI has not been built yet. Run `pnpm --filter @opensourceframework/docs-bot build` first.'
  );
  process.exit(1);
}

const result = spawnSync(process.execPath, [entrypoint, ...process.argv.slice(2)], {
  stdio: 'inherit',
});

if (result.error) {
  console.error(result.error.message);
  process.exit(1);
}

process.exit(result.status ?? 0);
