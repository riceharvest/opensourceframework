#!/usr/bin/env node

import { copyFile, mkdtemp, mkdir, rm, unlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ciEnv = {
  ...process.env,
  CI: '1',
  NEXT_TELEMETRY_DISABLED: '1',
};

function extractTopLevelJsonArray(text) {
  let start = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (start === -1) {
      if (char === '[') {
        start = index;
        depth = 1;
      }
      continue;
    }

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === '\\') {
        escaped = true;
      } else if (char === '"') {
        inString = false;
      }
      continue;
    }

    if (char === '"') {
      inString = true;
      continue;
    }

    if (char === '[') {
      depth += 1;
    } else if (char === ']') {
      depth -= 1;

      if (depth === 0) {
        return text.slice(start, index + 1);
      }
    }
  }

  throw new Error('Unable to parse npm pack JSON output.');
}

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd ?? repoRoot,
      env: options.env ?? process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (chunk) => {
      stdout += chunk;
    });

    child.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve({ stdout, stderr });
        return;
      }

      const message = [
        `${command} ${args.join(' ')} failed with exit code ${code}.`,
        stdout && `STDOUT:\n${stdout.trim()}`,
        stderr && `STDERR:\n${stderr.trim()}`,
      ]
        .filter(Boolean)
        .join('\n\n');

      reject(new Error(message));
    });
  });
}

async function writeFiles(rootDir, files) {
  for (const [relativePath, contents] of Object.entries(files)) {
    const filePath = path.join(rootDir, relativePath);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, contents);
  }
}

async function buildPackage(filter) {
  await run('pnpm', ['--filter', filter, 'build'], {
    cwd: repoRoot,
    env: ciEnv,
  });
}

async function packPackage(relativeDir, tarballDir) {
  const packageDir = path.join(repoRoot, relativeDir);
  const { stdout } = await run('npm', ['pack', '--json'], {
    cwd: packageDir,
    env: ciEnv,
  });
  const [packed] = JSON.parse(extractTopLevelJsonArray(stdout));
  const sourcePath = path.join(packageDir, packed.filename);
  const targetPath = path.join(tarballDir, packed.filename);
  await copyFile(sourcePath, targetPath);
  await unlink(sourcePath);
  return targetPath;
}

async function installAndRun(packageDir, command, args = []) {
  await run('pnpm', ['install', '--reporter', 'append-only'], {
    cwd: packageDir,
    env: ciEnv,
  });
  await run(command, args, {
    cwd: packageDir,
    env: ciEnv,
  });
}

async function smokeNextImages(tarballPath, tempRoot) {
  const fixtureDir = path.join(tempRoot, 'next-images');
  await mkdir(fixtureDir, { recursive: true });
  await writeFiles(fixtureDir, {
    'package.json': JSON.stringify(
      {
        name: 'compat-next-images',
        private: true,
        scripts: {
          build: 'next build --webpack',
        },
        dependencies: {
          '@opensourceframework/next-images': `file:${tarballPath}`,
          next: '16.1.6',
          react: '19.2.0',
          'react-dom': '19.2.0',
        },
      },
      null,
      2
    ),
    'next.config.js': [
      "const withImages = require('@opensourceframework/next-images');",
      '',
      "module.exports = withImages({ fileExtensions: ['svg'], inlineImageLimit: false });",
      '',
    ].join('\n'),
    'pages/index.js': [
      "import logo from '../assets/logo.svg';",
      '',
      'export default function Home() {',
      '  return <main><img src={logo} alt="logo" /></main>;',
      '}',
      '',
    ].join('\n'),
    'assets/logo.svg':
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="red"/></svg>\n',
  });

  await installAndRun(fixtureDir, 'pnpm', ['build']);
}

async function smokeNextOptimizedImages(tarballPath, tempRoot) {
  const fixtureDir = path.join(tempRoot, 'next-optimized-images');
  await mkdir(fixtureDir, { recursive: true });
  await writeFiles(fixtureDir, {
    'package.json': JSON.stringify(
      {
        name: 'compat-next-optimized-images',
        private: true,
        scripts: {
          build: 'next build --webpack',
        },
        dependencies: {
          '@opensourceframework/next-optimized-images': `file:${tarballPath}`,
          next: '16.1.6',
          react: '19.2.0',
          'react-dom': '19.2.0',
        },
      },
      null,
      2
    ),
    'next.config.js': [
      "const withOptimizedImages = require('@opensourceframework/next-optimized-images');",
      '',
      "module.exports = withOptimizedImages({ handleImages: ['svg'], inlineImageLimit: false, optimizeImages: false });",
      '',
    ].join('\n'),
    'pages/index.js': [
      "import logo from '../assets/logo.svg';",
      '',
      'export default function Home() {',
      '  return <main><img src={logo} alt="logo" /></main>;',
      '}',
      '',
    ].join('\n'),
    'assets/logo.svg':
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="4" fill="blue"/></svg>\n',
  });

  await installAndRun(fixtureDir, 'pnpm', ['build']);
}

async function smokeNextMdx(nextMdxTarball, nextMdxTocTarball, tempRoot) {
  const fixtureDir = path.join(tempRoot, 'next-mdx');
  await mkdir(fixtureDir, { recursive: true });
  await writeFiles(fixtureDir, {
    'package.json': JSON.stringify(
      {
        name: 'compat-next-mdx',
        private: true,
        pnpm: {
          overrides: {
            '@opensourceframework/next-mdx': `file:${nextMdxTarball}`,
          },
        },
        dependencies: {
          '@opensourceframework/next-mdx': `file:${nextMdxTarball}`,
          '@opensourceframework/next-mdx-toc': `file:${nextMdxTocTarball}`,
          next: '16.1.6',
          react: '19.2.0',
          'react-dom': '19.2.0',
        },
      },
      null,
      2
    ),
    'next-mdx.config.mjs': [
      'export default {',
      '  post: {',
      "    contentPath: 'content/posts',",
      "    basePath: '/blog'",
      '  }',
      '};',
      '',
    ].join('\n'),
    'content/posts/hello.mdx': [
      '---',
      'title: Hello World',
      'date: 2026-03-11',
      '---',
      '',
      '# Heading One',
      '',
      'This is a compatibility smoke test.',
      '',
      '## Heading Two',
      '',
    ].join('\n'),
    'smoke.cjs': [
      "const assert = require('node:assert/strict');",
      "const React = require('react');",
      "const { renderToStaticMarkup } = require('react-dom/server');",
      "const { getMdxNode, getMdxPaths } = require('@opensourceframework/next-mdx/server');",
      "const { useHydrate } = require('@opensourceframework/next-mdx/client');",
      "const { getTableOfContents } = require('@opensourceframework/next-mdx-toc');",
      '',
      '(async () => {',
      "  const node = await getMdxNode('post', 'hello');",
      "  assert.equal(node.frontMatter.title, 'Hello World');",
      "  assert.equal(node.url, '/blog/hello');",
      "  const paths = await getMdxPaths('post');",
      "  assert.deepEqual(paths, [{ params: { slug: ['hello'] } }]);",
      '  const toc = await getTableOfContents(node);',
      "  assert.equal(toc.items?.[0]?.title, 'Heading One');",
      "  assert.equal(toc.items?.[0]?.items?.[0]?.title, 'Heading Two');",
      '  const html = renderToStaticMarkup(useHydrate(node));',
      '  assert.match(html, /This is a compatibility smoke test/);',
      '})().catch((error) => {',
      '  console.error(error);',
      '  process.exit(1);',
      '});',
      '',
    ].join('\n'),
  });

  await installAndRun(fixtureDir, 'node', ['smoke.cjs']);
}

async function smokeReactVirtualized(tarballPath, tempRoot) {
  const fixtureDir = path.join(tempRoot, 'react-virtualized');
  await mkdir(fixtureDir, { recursive: true });
  await writeFiles(fixtureDir, {
    'package.json': JSON.stringify(
      {
        name: 'compat-react-virtualized',
        private: true,
        dependencies: {
          '@opensourceframework/react-virtualized': `file:${tarballPath}`,
          react: '19.2.0',
          'react-dom': '19.2.0',
        },
      },
      null,
      2
    ),
    'smoke.cjs': [
      "const assert = require('node:assert/strict');",
      "const React = require('react');",
      "const { renderToStaticMarkup } = require('react-dom/server');",
      "const { List } = require('@opensourceframework/react-virtualized');",
      '',
      'const html = renderToStaticMarkup(',
      '  React.createElement(List, {',
      '    width: 200,',
      '    height: 100,',
      '    rowCount: 2,',
      '    rowHeight: 20,',
      "    rowRenderer: ({ key, index, style }) => React.createElement('div', { key, style }, `Row ${index}`),",
      '  })',
      ');',
      '',
      'assert.match(html, /Row 0/);',
      'assert.match(html, /ReactVirtualized__List/);',
      '',
    ].join('\n'),
  });

  await installAndRun(fixtureDir, 'node', ['smoke.cjs']);
}

async function main() {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'osf-compat-'));
  const tarballDir = path.join(tempRoot, 'tarballs');
  await mkdir(tarballDir, { recursive: true });

  try {
    await buildPackage('@opensourceframework/next-images');
    await buildPackage('@opensourceframework/next-mdx');
    await buildPackage('@opensourceframework/next-mdx-toc');
    await buildPackage('@opensourceframework/react-virtualized');

    const nextImagesTarball = await packPackage('packages/next-images', tarballDir);
    const nextMdxTarball = await packPackage('packages/next-mdx', tarballDir);
    const nextMdxTocTarball = await packPackage('packages/next-mdx-toc', tarballDir);
    const nextOptimizedImagesTarball = await packPackage(
      'packages/next-optimized-images',
      tarballDir
    );
    const reactVirtualizedTarball = await packPackage('packages/react-virtualized', tarballDir);

    await smokeNextImages(nextImagesTarball, tempRoot);
    await smokeNextOptimizedImages(nextOptimizedImagesTarball, tempRoot);
    await smokeNextMdx(nextMdxTarball, nextMdxTocTarball, tempRoot);
    await smokeReactVirtualized(reactVirtualizedTarball, tempRoot);

    console.log('Compatibility smoke checks passed.');
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

await main();
