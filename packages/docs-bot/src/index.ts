#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { readdir, readFile } from 'fs/promises';
import { join, relative } from 'path';
import * as fs from 'fs';
import { homedir } from 'os';
import Fuse from 'fuse.js';

interface PackageInfo {
  name: string;
  description: string;
  readmeSnippet: string;
  sourceSnippet?: string;
  exampleSnippet?: string;
}

// Helper to recursively get all source files in a directory
async function getAllSourceFiles(dir: string, extRegex: RegExp = /\.(ts|tsx|js|jsx)$/): Promise<string[]> {
  let files: string[] = [];
  try {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        files = files.concat(await getAllSourceFiles(fullPath, extRegex));
      } else if (extRegex.test(entry.name)) {
        files.push(fullPath);
      }
    }
  } catch {
    // Ignore errors (e.g., directory doesn't exist)
  }
  return files;
}

async function scanPackages(root: string, snippetLength: number = 200): Promise<PackageInfo[]> {
  const packagesDir = join(root, 'packages');
  const entries = await readdir(packagesDir, { withFileTypes: true });
  const packages: PackageInfo[] = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const pkgPath = join(packagesDir, entry.name, 'package.json');
      try {
        const pkgContent = await readFile(pkgPath, 'utf8');
        const pkg = JSON.parse(pkgContent);
        const readmePath = join(packagesDir, entry.name, 'README.md');
        let readmeSnippet = '';
        try {
          const readme = await readFile(readmePath, 'utf8');
          const trimmed = readme.trim().replace(/\n/g, ' ');
          readmeSnippet = trimmed.length <= snippetLength ? trimmed : trimmed.slice(0, snippetLength) + '...';
        } catch {
          // No README
          void 0;
        }

        // Collect source code snippets from src directory
        let sourceSnippet = '';
        const srcDir = join(packagesDir, entry.name, 'src');
        try {
          const sourceFiles = await getAllSourceFiles(srcDir);
          const snippets: string[] = [];
          // Limit to first 5 files to avoid huge index
          for (const file of sourceFiles.slice(0, 5)) {
            try {
              const content = await readFile(file, 'utf8');
              const trimmed = content.trim().replace(/\n/g, ' ');
              const snippet = trimmed.length <= snippetLength ? trimmed : trimmed.slice(0, snippetLength) + '...';
              const relPath = relative(srcDir, file);
              snippets.push(`[${relPath}] ${snippet}`);
            } catch {
              // ignore file read errors
              void 0;
            }
          }
          sourceSnippet = snippets.join(' ... ');
        } catch {
          // No src directory or error, ignore
          void 0;
        }

        // Collect example snippets from examples directory
        let exampleSnippet = '';
        const examplesDir = join(packagesDir, entry.name, 'examples');
        try {
          const exampleFiles = await getAllSourceFiles(examplesDir);
          const snippets: string[] = [];
          // Limit to first 3 example files
          for (const file of exampleFiles.slice(0, 3)) {
            try {
              const content = await readFile(file, 'utf8');
              const trimmed = content.trim().replace(/\n/g, ' ');
              const snippet = trimmed.length <= snippetLength ? trimmed : trimmed.slice(0, snippetLength) + '...';
              const relPath = relative(examplesDir, file);
              snippets.push(`[example: ${relPath}] ${snippet}`);
            } catch {
              void 0;
            }
          }
          exampleSnippet = snippets.join(' ... ');
        } catch {
          // No examples directory or error, ignore
          void 0;
        }

        packages.push({
          name: pkg.name,
          description: pkg.description || '',
          readmeSnippet,
          sourceSnippet: sourceSnippet || undefined,
          exampleSnippet: exampleSnippet || undefined
        });
      } catch {
        // Not a valid package directory, skip
        void 0;
      }
    }
  }
  return packages;
}

function extractSnippet(text: string, maxLength = 200): string {
  const trimmed = text.trim().replace(/\n/g, ' ');
  return trimmed.length <= maxLength ? trimmed : trimmed.slice(0, maxLength) + '...';
}

const program = new Command();

program
  .name('docs-bot')
  .description('Documentation assistant for OpenSourceFramework')
  .version('0.0.1')
  .argument('[query]', 'Question or search query (optional)')
  .option('-r, --root <path>', 'Path to monorepo root', process.cwd())
  .option('-v, --verbose', 'Show detailed results with relevance scores')
  .option('--json', 'Output results as JSON')
  .option('-l, --snippet-length <length>', 'Maximum length of README snippet in characters', parseInt, 200)
  .action(async (query: string | undefined, options: { root: string; verbose: boolean; json: boolean; snippetLength?: number }) => {
    const root = options.root;
    let packages: PackageInfo[] = [];

    // Cache handling: look for ~/.cache/docs-bot/cache.json
    const CACHE_DIR = join(homedir(), '.cache', 'docs-bot');
    const CACHE_FILE = join(CACHE_DIR, 'cache.json');
    const TTL = 60 * 60 * 1000; // 1 hour in ms

    try {
      if (fs.existsSync(CACHE_FILE)) {
        const raw = fs.readFileSync(CACHE_FILE, 'utf8');
        const cache = JSON.parse(raw);
        const now = Date.now();
        if (cache.root === root && cache.timestamp && (now - cache.timestamp) < TTL && Array.isArray(cache.packages)) {
          packages = cache.packages;
        }
      }
    } catch {
      // ignore cache errors
      void 0;
    }

    if (packages.length === 0) {
      packages = await scanPackages(root, options.snippetLength);
      // Write cache
      try {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
        const cache = { root, timestamp: Date.now(), packages };
        fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
      } catch {
        // ignore cache write errors
        void 0;
      }
    }

    try {
      let scoredMatches: Array<{ name: string; description: string; readmeSnippet: string; sourceSnippet?: string; exampleSnippet?: string; score: number; matchedIn: string[] }>;

      if (query) {
        const fuse = new Fuse(packages, {
          keys: ['name', 'description', 'readmeSnippet', 'sourceSnippet', 'exampleSnippet'],
          threshold: 0.4,
          includeScore: true,
          includeMatches: true,
        });
        const results = fuse.search(query);
        if (results.length === 0) {
          console.log(chalk.yellow('No matching packages found.'));
          return;
        }
        scoredMatches = results.map(r => {
          const p = r.item;
          // Fuse score: 0 (exact) to 1 (poor). Convert to 0-100 scale for readability, with higher = better.
          const normalizedScore = Math.round((1 - (r.score ?? 0)) * 100);
          const matchedIn: string[] = r.matches ? r.matches.map(m => m.key ?? '') : [];
          return { ...p, score: normalizedScore, matchedIn };
        });
        scoredMatches.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
      } else {
        scoredMatches = packages
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(p => ({ ...p, score: 0, matchedIn: [] }));
      }

      if (options.json) {
        console.log(JSON.stringify({
          query,
          count: scoredMatches.length,
          packages: scoredMatches.map(p => ({
            name: p.name,
            description: p.description,
            readmeSnippet: p.readmeSnippet,
            sourceSnippet: p.sourceSnippet,
            score: p.score,
            matchedIn: p.matchedIn
          }))
        }, null, 2));
      } else {
        console.log(chalk.green(`Found ${scoredMatches.length} package(s):`));
        for (const p of scoredMatches) {
          if (options.verbose) {
            console.log(chalk.bold.blue(`\n• ${p.name} (score: ${p.score})`));
            if (p.matchedIn.length > 0) {
              console.log(chalk.dim(`Matched in: ${p.matchedIn.join(', ')}`));
            }
          } else {
            console.log(chalk.bold.blue(`\n• ${p.name}`));
          }
          if (p.description) console.log(chalk.gray(p.description));
          if (p.readmeSnippet) console.log(chalk.dim(p.readmeSnippet));
          if (p.sourceSnippet) console.log(chalk.dim(p.sourceSnippet));
          if (p.exampleSnippet) console.log(chalk.dim(p.exampleSnippet));
        }
      }
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Ask command
program
  .command('ask')
  .description('Ask a question about the packages using AI')
  .argument('<question>', 'Question to ask')
  .option('-m, --model <model>', 'OpenRouter model to use', 'openrouter/auto')
  .action(async (question: string, options: { model: string }) => {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      throw new Error('Missing OPENROUTER_API_KEY environment variable');
    }

    // Use the main program's -r option (global root)
    const root = program.opts().root;
    const packages = await scanPackages(root);

    // Build context from packages
    let context = 'OpenSourceFramework packages:\n\n';
    for (const p of packages) {
      context += `- ${p.name}: ${p.description || 'No description'}\n`;
      if (p.readmeSnippet) {
        context += `  README snippet: ${p.readmeSnippet}\n`;
      }
    }

    const systemPrompt = `You are a helpful assistant for developers using OpenSourceFramework packages. Use the following package information to answer questions. Be concise and accurate. If the information is insufficient, say so.\n\n${context}`;

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://opensourceframework.com',
          'X-Title': 'docs-bot'
        },
        body: JSON.stringify({
          model: options.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: question }
          ]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const answer = data.choices?.[0]?.message?.content || 'No response received';
      console.log(answer);
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

// Compare command
program
  .command('compare')
  .description('Compare two packages')
  .argument('<pkg1>', 'First package name')
  .argument('<pkg2>', 'Second package name')
  .option('-r, --root <path>', 'Path to monorepo root', process.cwd())
  .option('--json', 'Output results as JSON')
  .action(async (pkg1, pkg2, options) => {
    const root = options.root;
    const packagesDir = join(root, 'packages');

    async function loadPkg(name: string) {
      const pkgPath = join(packagesDir, name, 'package.json');
      const readmePath = join(packagesDir, name, 'README.md');
      try {
        const pkgContent = await readFile(pkgPath, 'utf8');
        const pkg = JSON.parse(pkgContent);
        let readme = '';
        try {
          readme = await readFile(readmePath, 'utf8');
        } catch {
          // ignore read errors
          void 0;
        }
        return {
          name: pkg.name,
          version: pkg.version,
          description: pkg.description || '',
          dependencies: pkg.dependencies || {},
          devDependencies: pkg.devDependencies || {},
          peerDependencies: pkg.peerDependencies || {},
          scripts: pkg.scripts || {},
          readmeSnippet: extractSnippet(readme)
        };
      } catch {
        return null;
      }
    }

    const [a, b] = await Promise.all([loadPkg(pkg1), loadPkg(pkg2)]);

    if (!a) {
      console.log(chalk.red(`Package '${pkg1}' not found.`));
      process.exit(1);
    }
    if (!b) {
      console.log(chalk.red(`Package '${pkg2}' not found.`));
      process.exit(1);
    }

    // Compute differences
    const diffs: any = {
      pkg1: a.name,
      pkg2: b.name,
      version1: a.version,
      version2: b.version,
      description: a.description !== b.description ? { from: a.description, to: b.description } : undefined,
      dependencies: { removed: [], added: [], changed: [] as Array<{name: string, from: string, to: string}> },
      devDependencies: { removed: [], added: [], changed: [] as Array<{name: string, from: string, to: string}> },
      peerDependencies: { removed: [], added: [], changed: [] as Array<{name: string, from: string, to: string}> },
      scripts: { removed: [], added: [] }
    };

    let hasDiff = false;

    if (a.description !== b.description) hasDiff = true;

    const computeChanges = (aDeps: Record<string, string>, bDeps: Record<string, string>, section: keyof typeof diffs) => {
      const aKeys = Object.keys(aDeps);
      const bKeys = Object.keys(bDeps);
      const removed = aKeys.filter(k => !bKeys.includes(k));
      const added = bKeys.filter(k => !aKeys.includes(k));
      // Changed only for keys present in both
      const changed = aKeys.filter(k => bKeys.includes(k) && aDeps[k] !== bDeps[k]);

      if (removed.length || added.length || changed.length) hasDiff = true;

      diffs[section].removed = removed;
      diffs[section].added = added;
      changed.forEach((k: string) => {
        (diffs[section].changed as Array<{name: string, from: string, to: string}>).push({ name: k, from: aDeps[k], to: bDeps[k] });
      });
    };

    computeChanges(a.dependencies, b.dependencies, 'dependencies');
    computeChanges(a.devDependencies, b.devDependencies, 'devDependencies');
    computeChanges(a.peerDependencies, b.peerDependencies, 'peerDependencies');

    const aScripts = Object.keys(a.scripts);
    const bScripts = Object.keys(b.scripts);
    diffs.scripts.removed = aScripts.filter(k => !bScripts.includes(k));
    diffs.scripts.added = bScripts.filter(k => !aScripts.includes(k));
    if (diffs.scripts.removed.length || diffs.scripts.added.length) hasDiff = true;

    // Clean up empty sections
    if (!hasDiff) {
      diffs.dependencies.removed = [];
      diffs.dependencies.added = [];
      diffs.dependencies.changed = [];
      // similarly others...
    }

    if (options.json) {
      console.log(JSON.stringify(diffs, null, 2));
    } else {
      console.log(chalk.bold(`Comparing ${a.name} (v${a.version}) vs ${b.name} (v${b.version})`));
      let diffCount = 0;

      const printDiff = (title: string, aVal: any, bVal: any) => {
        console.log(chalk.yellow(title + ':'));
        console.log(chalk.red(`  - ${a.name}: ${JSON.stringify(aVal)}`));
        console.log(chalk.green(`  + ${b.name}: ${JSON.stringify(bVal)}`));
      };

      if (a.description !== b.description) {
        printDiff('Description', a.description, b.description);
        diffCount++;
      }

      const printSection = (title: string, removed: string[], added: string[], changed: Array<{name: string, from: string, to: string}>) => {
        if (removed.length || added.length || changed.length) {
          console.log(chalk.yellow(title + ':'));
          if (removed.length) {
            console.log(chalk.red(`  Removed from ${a.name}:`) + ' ' + removed.join(', '));
          }
          if (added.length) {
            console.log(chalk.green(`  Added in ${b.name}:`) + ' ' + added.join(', '));
          }
          if (changed.length) {
            for (const c of changed) {
              console.log(chalk.cyan(`  Changed ${c.name}:`) + ` ${c.from} -> ${c.to}`);
            }
          }
          diffCount += removed.length + added.length + changed.length;
        }
      };

      printSection('Dependencies', diffs.dependencies.removed, diffs.dependencies.added, diffs.dependencies.changed);
      printSection('Dev Dependencies', diffs.devDependencies.removed, diffs.devDependencies.added, diffs.devDependencies.changed);
      printSection('Peer Dependencies', diffs.peerDependencies.removed, diffs.peerDependencies.added, diffs.peerDependencies.changed);
      printSection('Scripts', diffs.scripts.removed, diffs.scripts.added, []);

      if (diffCount === 0) {
        console.log(chalk.green('No differences found.'));
      }
    }
  });

program
  .command('site')
  .description('Generate a static HTML site with package documentation')
  .option('-o, --output <dir>', 'Output directory', './docs-site')
  .option('-r, --root <path>', 'Path to monorepo root', process.cwd())
  .action(async (options: { output: string; root: string }) => {
    const root = options.root === process.cwd() ? program.opts().root : options.root;
    const outputDir = options.output;
    const packages = await scanPackages(root, 500); // longer snippets for site

    // Create output directory
    fs.mkdirSync(outputDir, { recursive: true });

    // Build HTML
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>OpenSourceFramework Packages</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@ highlighting.css" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; margin: 0; padding: 0; background: #f5f5f5; color: #333; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    header { background: #2c3e50; color: white; padding: 20px 0; margin-bottom: 20px; }
    header h1 { margin: 0; font-size: 2rem; }
    .search-box { margin-top: 10px; }
    .search-box input { width: 100%; max-width: 400px; padding: 10px 15px; border: none; border-radius: 4px; font-size: 1rem; }
    .package-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; margin-top: 20px; }
    .package-card { background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); padding: 20px; }
    .package-card h2 { margin-top: 0; font-size: 1.2rem; color: #2c3e50; }
    .package-card p { color: #666; font-size: 0.9rem; }
    .snippet { background: #f8f9fa; border-left: 3px solid #2c3e50; padding: 10px; margin-top: 10px; font-family: 'Courier New', monospace; font-size: 0.85rem; white-space: pre-wrap; word-wrap: break-word; }
    .footer { text-align: center; margin-top: 40px; color: #999; font-size: 0.85rem; }
  </style>
</head>
<body>
  <header>
    <div class="container">
      <h1>OpenSourceFramework Packages</h1>
      <div class="search-box">
        <input type="text" id="search" placeholder="Search packages..." autofocus />
      </div>
    </div>
  </header>
  <div class="container">
    <div class="package-grid" id="grid">
${packages.map(p => `
      <div class="package-card" data-name="${p.name.replace(/"/g, '&quot;')}" data-description="${p.description?.replace(/"/g, '&quot;') || ''}" data-snippet="${p.readmeSnippet?.replace(/"/g, '&quot;') || ''}" data-example="${p.exampleSnippet?.replace(/"/g, '&quot;') || ''}">
        <h2>${p.name}</h2>
        <p>${p.description || 'No description'}</p>
        ${p.readmeSnippet ? `<div class="snippet">${p.readmeSnippet}</div>` : ''}
        ${p.exampleSnippet ? `<div class="snippet">${p.exampleSnippet}</div>` : ''}
      </div>`).join('\n')}
    </div>
  </div>
  <div class="footer">
    Generated by docs-bot on ${new Date().toISOString()}
  </div>
  <script src="https://cdn.jsdelivr.net/npm/fuse.js@7.0.0"></script>
  <script>
    const packages = ${JSON.stringify(packages)};
    const grid = document.getElementById('grid');
    const searchInput = document.getElementById('search');

    const fuse = new Fuse(packages, {
      keys: ['name', 'description', 'readmeSnippet', 'exampleSnippet'],
      threshold: 0.4,
      includeScore: true
    });

    function renderPackages(list) {
      grid.innerHTML = list.map(p => \`<div class="package-card">
        <h2>\${p.name}</h2>
        <p>\${p.description || 'No description'}</p>
        \${p.readmeSnippet ? \`<div class="snippet">\${p.readmeSnippet}</div>\` : ''}
      </div>\`).join('\\n');
    }

    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      if (!query) {
        renderPackages(packages);
        return;
      }
      const results = fuse.search(query).map(r => r.item);
      renderPackages(results);
    });
  </script>
</body>
</html>`;

    const indexPath = join(outputDir, 'index.html');
    fs.writeFileSync(indexPath, html, 'utf8');
    console.log(`Static site generated at ${indexPath}`);
  });

// Read full README for a package
program
  .command('readme')
  .description('Display full README for a package')
  .argument('<package>', 'Package name or directory (e.g. next-seo or @opensourceframework/next-seo)')
  .option('-r, --root <path>', 'Path to monorepo root', process.cwd())
  .action(async (pkgDir: string, options: { root: string }) => {
    const root = options.root;
    const packagesDir = join(root, 'packages');
    // Allow full package name with scope, strip @opensourceframework/ if present
    const folder = pkgDir.startsWith('@opensourceframework/') ? pkgDir.slice(21) : pkgDir;
    const readmePath = join(packagesDir, folder, 'README.md');
    try {
      const readme = await readFile(readmePath, 'utf8');
      console.log(readme);
    } catch (error: any) {
      console.error(chalk.red(`Error: Could not read README for ${pkgDir}: ${error.message}`));
      process.exit(1);
    }
  });

export { program, scanPackages, extractSnippet };

// Only parse arguments when executed directly (CLI), not when imported
if (typeof require !== 'undefined' && require.main === module) {
  program.parse();
}
