#!/usr/bin/env node

const { program } = require('commander');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const { version } = require('../package.json');

program
  .name('osf-codemod')
  .description('CLI to run OpenSource Framework codemods')
  .version(version);

program
  .command('next-seo')
  .description('Update next-seo imports to @opensourceframework/next-seo')
  .argument('<path>', 'Path to run codemod on')
  .action((dir) => {
    const transformPath = path.join(__dirname, '../src/transforms/next-seo-import.ts');
    const jscodeshiftExecutable = require.resolve('.bin/jscodeshift');
    
    console.log(`Running next-seo migration on ${dir}...`);
    
    try {
      execSync(`${jscodeshiftExecutable} -t ${transformPath} ${dir} --extensions=ts,tsx,js,jsx`, {
        stdio: 'inherit'
      });
      console.log('✅ Migration complete!');
    } catch (error) {
      console.error('❌ Migration failed:', error.message);
      process.exit(1);
    }
  });

program.parse();
