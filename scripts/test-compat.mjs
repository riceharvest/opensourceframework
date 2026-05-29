#!/usr/bin/env node

import { copyFile, mkdtemp, mkdir, readFile, rm, unlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const rootManifest = require('../package.json');
const pnpmSpec = rootManifest.packageManager?.startsWith('pnpm@')
  ? rootManifest.packageManager
  : 'pnpm';
const pnpmCommand = pnpmSpec === 'pnpm' ? 'pnpm' : 'corepack';
const pnpmArgs = (args) => (pnpmCommand === 'corepack' ? [pnpmSpec, ...args] : args);
const ciEnv = {
  ...process.env,
  CI: '1',
  NEXT_TELEMETRY_DISABLED: '1',
};

function extractTopLevelJsonArray(text) {
  for (let start = text.indexOf('['); start !== -1; start = text.indexOf('[', start + 1)) {
    const nextNonWhitespace = text.slice(start + 1).match(/\S/);
    if (nextNonWhitespace?.[0] !== '{') {
      continue;
    }

    let depth = 1;
    let inString = false;
    let escaped = false;

    for (let index = start + 1; index < text.length; index += 1) {
      const char = text[index];

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

function runPnpm(args, options = {}) {
  return run(pnpmCommand, pnpmArgs(args), options);
}

async function writeFiles(rootDir, files) {
  for (const [relativePath, contents] of Object.entries(files)) {
    const filePath = path.join(rootDir, relativePath);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, contents);
  }
}

async function buildPackage(filter) {
  await runPnpm(['--filter', filter, 'build'], {
    cwd: repoRoot,
    env: ciEnv,
  });
}

async function assertNoWorkspaceRuntimeDependencies(relativeDir) {
  const packageDir = path.join(repoRoot, relativeDir);
  const manifest = JSON.parse(await readFile(path.join(packageDir, 'package.json'), 'utf8'));
  const offenders = [];

  for (const section of ['dependencies', 'peerDependencies', 'optionalDependencies']) {
    const entries = Object.entries(manifest[section] ?? {});
    for (const [name, version] of entries) {
      if (typeof version === 'string' && version.startsWith('workspace:')) {
        offenders.push(`${section}.${name}=${version}`);
      }
    }
  }

  if (offenders.length > 0) {
    throw new Error(
      `${relativeDir} contains publish-blocking workspace protocol entries: ${offenders.join(', ')}`
    );
  }
}

async function packPackage(relativeDir, tarballDir) {
  const packageDir = path.join(repoRoot, relativeDir);
  await assertNoWorkspaceRuntimeDependencies(relativeDir);
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
  await runPnpm(['install', '--reporter', 'append-only'], {
    cwd: packageDir,
    env: ciEnv,
  });

  if (command === 'pnpm') {
    await runPnpm(args, {
      cwd: packageDir,
      env: ciEnv,
    });
    return;
  }

  await run(command, args, {
    cwd: packageDir,
    env: ciEnv,
  });
}

async function smokeNextImages(tarballPath, tempRoot, versions) {
  const fixtureDir = path.join(tempRoot, 'next-images');
  await mkdir(fixtureDir, { recursive: true });
  await writeFiles(fixtureDir, {
    'package.json': JSON.stringify(
      {
        name: 'compat-next-images',
        private: true,
        scripts: {
          build: versions.next.startsWith('16.') ? 'next build --webpack' : 'next build',
        },
        dependencies: {
          '@opensourceframework/next-images': `file:${tarballPath}`,
          next: versions.next,
          react: versions.react,
          'react-dom': versions.react,
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

async function smokeNextComposePlugins(tarballPath, tempRoot, versions) {
  const fixtureDir = path.join(tempRoot, 'next-compose-plugins');
  await mkdir(fixtureDir, { recursive: true });
  await writeFiles(fixtureDir, {
    'package.json': JSON.stringify(
      {
        name: 'compat-next-compose-plugins',
        private: true,
        dependencies: {
          '@opensourceframework/next-compose-plugins': `file:${tarballPath}`,
        },
      },
      null,
      2
    ),
    'smoke.cjs': [
      "const assert = require('node:assert/strict');",
      "const withPlugins = require('@opensourceframework/next-compose-plugins');",
      '',
      "assert.equal(typeof withPlugins, 'function');",
      "assert.equal(typeof withPlugins.optional, 'function');",
      "assert.equal(typeof withPlugins.extend, 'function');",
      '',
    ].join('\n'),
  });

  await installAndRun(fixtureDir, 'node', ['smoke.cjs']);
}

async function smokeNextOptimizedImages(tarballPath, tempRoot, versions) {
  const fixtureDir = path.join(tempRoot, 'next-optimized-images');
  await mkdir(fixtureDir, { recursive: true });
  await writeFiles(fixtureDir, {
    'package.json': JSON.stringify(
      {
        name: 'compat-next-optimized-images',
        private: true,
        scripts: {
          build: versions.next.startsWith('16.') ? 'next build --webpack' : 'next build',
        },
        dependencies: {
          '@opensourceframework/next-optimized-images': `file:${tarballPath}`,
          next: versions.next,
          react: versions.react,
          'react-dom': versions.react,
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

async function smokeNextMdx(nextMdxTarball, nextMdxTocTarball, tempRoot, versions) {
  const fixtureDir = path.join(tempRoot, 'next-mdx');
  await mkdir(fixtureDir, { recursive: true });
  await writeFiles(fixtureDir, {
    'package.json': JSON.stringify(
      {
        name: 'compat-next-mdx',
        private: true,
        dependencies: {
          '@opensourceframework/next-mdx': `file:${nextMdxTarball}`,
          '@opensourceframework/next-mdx-toc': `file:${nextMdxTocTarball}`,
          next: versions.next,
          react: versions.react,
          'react-dom': versions.react,
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

async function smokeReactVirtualized(tarballPath, tempRoot, versions) {
  const fixtureDir = path.join(tempRoot, 'react-virtualized');
  await mkdir(fixtureDir, { recursive: true });
  await writeFiles(fixtureDir, {
    'package.json': JSON.stringify(
      {
        name: 'compat-react-virtualized',
        private: true,
        dependencies: {
          '@opensourceframework/react-virtualized': `file:${tarballPath}`,
          react: versions.react,
          'react-dom': versions.react,
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

async function smokeNextSession(tarballPath, tempRoot, versions) {
  const fixtureDir = path.join(tempRoot, 'next-session');
  await mkdir(fixtureDir, { recursive: true });
  await writeFiles(fixtureDir, {
    'package.json': JSON.stringify(
      {
        name: 'compat-next-session',
        private: true,
        dependencies: {
          '@opensourceframework/next-session': `file:${tarballPath}`,
        },
      },
      null,
      2
    ),
    'smoke.cjs': [
      "const assert = require('node:assert/strict');",
      "const nextSession = require('@opensourceframework/next-session');",
      "const compat = require('@opensourceframework/next-session/lib/compat');",
      '',
      "assert.equal(typeof nextSession, 'function');",
      "assert.equal(typeof compat.expressSession, 'function');",
      "assert.equal(typeof compat.promisifyStore, 'function');",
      '',
    ].join('\n'),
  });

  await installAndRun(fixtureDir, 'node', ['smoke.cjs']);
}

async function smokeNextAuth(tarballPath, tempRoot, versions) {
  const fixtureDir = path.join(tempRoot, 'next-auth');
  await mkdir(fixtureDir, { recursive: true });
  await writeFiles(fixtureDir, {
    'package.json': JSON.stringify(
      {
        name: 'compat-next-auth',
        private: true,
        dependencies: {
          '@opensourceframework/next-auth': `file:${tarballPath}`,
        },
      },
      null,
      2
    ),
    'smoke.cjs': [
      "const assert = require('node:assert/strict');",
      "const GoogleProvider = require('@opensourceframework/next-auth/providers/google');",
      '',
      "assert.equal(typeof GoogleProvider, 'function');",
      "assert.equal(GoogleProvider({ clientId: 'id', clientSecret: 'secret' }).id, 'google');",
      '',
    ].join('\n'),
    'smoke.mjs': [
      "import assert from 'node:assert/strict';",
      "import GoogleProvider from '@opensourceframework/next-auth/providers/google';",
      '',
      "assert.equal(typeof GoogleProvider, 'function');",
      "assert.equal(GoogleProvider({ clientId: 'id', clientSecret: 'secret' }).id, 'google');",
      '',
    ].join('\n'),
  });

  await installAndRun(fixtureDir, 'node', ['smoke.cjs']);
  await installAndRun(fixtureDir, 'node', ['smoke.mjs']);
}

async function main() {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), 'osf-compat-'));
  const tarballDir = path.join(tempRoot, 'tarballs');
  await mkdir(tarballDir, { recursive: true });

  try {
    await buildPackage('@opensourceframework/next-images');
    await buildPackage('@opensourceframework/next-compose-plugins');
    await buildPackage('@opensourceframework/next-mdx');
    await buildPackage('@opensourceframework/next-mdx-toc');
    await buildPackage('@opensourceframework/next-session');
    await buildPackage('@opensourceframework/next-auth');
    await buildPackage('@opensourceframework/react-virtualized');

    const nextImagesTarball = await packPackage('packages/next-images', tarballDir);
    const nextComposePluginsTarball = await packPackage(
      'packages/next-compose-plugins',
      tarballDir
    );
    const nextMdxTarball = await packPackage('packages/next-mdx', tarballDir);
    const nextMdxTocTarball = await packPackage('packages/next-mdx-toc', tarballDir);
    const nextSessionTarball = await packPackage('packages/next-session', tarballDir);
    const nextAuthTarball = await packPackage('packages/next-auth', tarballDir);
    const nextOptimizedImagesTarball = await packPackage(
      'packages/next-optimized-images',
      tarballDir
    );
    const reactVirtualizedTarball = await packPackage('packages/react-virtualized', tarballDir);

    
    
    
    
    
    
    

    
    const versionMatrix = [
      { next: '14.2.24', react: '18.3.1' },
      { next: '15.2.0', react: '19.0.0' },
      { next: '16.1.6', react: '19.2.0' }
    ];

    for (const versions of versionMatrix) {
      console.log(`\nRunning smoke tests for Next.js ${versions.next} / React ${versions.react}...`);
      
      const versionTempRoot = path.join(tempRoot, versions.next.replace(/\./g, '-'));
      await mkdir(versionTempRoot, { recursive: true });

      await smokeNextImages(nextImagesTarball, versionTempRoot, versions);
      console.log(`[SAFE] @opensourceframework/next-images is verified safe with Next.js ${versions.next} / React ${versions.react}`);
      
      await smokeNextComposePlugins(nextComposePluginsTarball, versionTempRoot, versions);
      console.log(`[SAFE] @opensourceframework/next-compose-plugins is verified safe with Next.js ${versions.next} / React ${versions.react}`);
      
      await smokeNextOptimizedImages(nextOptimizedImagesTarball, versionTempRoot, versions);
      console.log(`[SAFE] @opensourceframework/next-optimized-images is verified safe with Next.js ${versions.next} / React ${versions.react}`);
      
      await smokeNextMdx(nextMdxTarball, nextMdxTocTarball, versionTempRoot, versions);
      console.log(`[SAFE] @opensourceframework/next-mdx is verified safe with Next.js ${versions.next} / React ${versions.react}`);
      
      await smokeNextSession(nextSessionTarball, versionTempRoot, versions);
      console.log(`[SAFE] @opensourceframework/next-session is verified safe with Next.js ${versions.next} / React ${versions.react}`);
      
      await smokeNextAuth(nextAuthTarball, versionTempRoot, versions);
      console.log(`[SAFE] @opensourceframework/next-auth is verified safe with Next.js ${versions.next} / React ${versions.react}`);
      
      await smokeReactVirtualized(reactVirtualizedTarball, versionTempRoot, versions);
      console.log(`[SAFE] @opensourceframework/react-virtualized is verified safe with Next.js ${versions.next} / React ${versions.react}`);
    }

    console.log('Compatibility smoke checks passed.');
  } finally {
    await rm(tempRoot, { recursive: true, force: true });
  }
}

await main();
