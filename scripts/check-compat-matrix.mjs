#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function formatPair({ next, react }) {
  return `Next.js ${next} / React ${react}`;
}

function formatPairs(pairs) {
  return pairs.map(formatPair).sort().join('\n');
}

function assertSamePairs(actual, expected, label) {
  const actualText = formatPairs(actual);
  const expectedText = formatPairs(expected);

  if (actualText !== expectedText) {
    throw new Error(
      [
        `${label} compatibility matrix is out of sync with README.md.`,
        '',
        'Expected:',
        expectedText,
        '',
        'Actual:',
        actualText,
      ].join('\n')
    );
  }
}

function uniquePairs(pairs) {
  return [...new Map(pairs.map((pair) => [`${pair.next}|${pair.react}`, pair])).values()];
}

const readme = await readFile(path.join(repoRoot, 'README.md'), 'utf8');
const releaseWorkflow = await readFile(
  path.join(repoRoot, '.github/workflows/release.yml'),
  'utf8'
);
const compatScript = await readFile(path.join(repoRoot, 'scripts/test-compat.mjs'), 'utf8');

const readmePairs = uniquePairs(
  [...readme.matchAll(/\*\*Next\.js ([^*]+)\*\*\s*\/\s*\*\*React ([^*]+)\*\*/g)].map(
    ([, next, react]) => ({ next, react })
  )
);

const releasePairs = uniquePairs(
  [...releaseWorkflow.matchAll(/- next-version: '([^']+)'\n\s+react-version: '([^']+)'/g)].map(
    ([, next, react]) => ({ next, react })
  )
);

const compatPairs = uniquePairs(
  [...compatScript.matchAll(/\{ next: '([^']+)', react: '([^']+)' \}/g)].map(([, next, react]) => ({
    next,
    react,
  }))
);

if (readmePairs.length === 0) {
  throw new Error('README.md compatibility matrix contains no Next.js / React pairs.');
}

assertSamePairs(releasePairs, readmePairs, '.github/workflows/release.yml');
assertSamePairs(compatPairs, readmePairs, 'scripts/test-compat.mjs');

console.log(`Compatibility matrices are in sync:\n${formatPairs(readmePairs)}`);
