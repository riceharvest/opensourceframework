#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { readdir, readFile } from 'fs/promises';
import { join } from 'path';

function extractSnippet(text: string, maxLength = 200): string {
  const trimmed = text.trim().replace(/\n/g, ' ');
  return trimmed.length <= maxLength ? trimmed : trimmed.slice(0, maxLength) + '...';
}

const program = new Command();

program
  .name('docs-bot')
  .description('Documentation assistant for OpenSourceFramework')
  .version('0.0.1')
  .argument('<query>', 'Question or search query')
  .option('-r, --root <path>', 'Path to monorepo root', process.cwd())
  .action(async (query: string, options: { root: string }) => {
    const root = options.root;
    const packagesDir = join(root, 'packages');

    try {
      const entries = await readdir(packagesDir, { withFileTypes: true });
      const packages: Array<{ name: string; description: string; readmeSnippet: string }> = [];

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
              readmeSnippet = extractSnippet(readme);
            } catch {
              // No README
            }

            packages.push({
              name: pkg.name,
              description: pkg.description || '',
              readmeSnippet
            });
          } catch {
            // Not a valid package directory, skip
          }
        }
      }

      const lowerQuery = query.toLowerCase();
      const matches = packages.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.description.toLowerCase().includes(lowerQuery) ||
          p.readmeSnippet.toLowerCase().includes(lowerQuery)
      );

      if (matches.length === 0) {
        console.log(chalk.yellow('No matching packages found.'));
        return;
      }

      console.log(chalk.green(`Found ${matches.length} package(s):`));
      for (const p of matches) {
        console.log(chalk.bold.blue(`\n• ${p.name}`));
        if (p.description) console.log(chalk.gray(p.description));
        if (p.readmeSnippet) console.log(chalk.dim(p.readmeSnippet));
      }
    } catch (error: any) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program.parse();
