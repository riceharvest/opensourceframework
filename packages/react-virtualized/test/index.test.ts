import { access, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import packageJson from '../package.json';
import * as reactVirtualized from '../source-stripped/index.jsx';

describe('@opensourceframework/react-virtualized', () => {
  it('exports core components', () => {
    expect(reactVirtualized).toHaveProperty('AutoSizer');
    expect(reactVirtualized).toHaveProperty('Grid');
    expect(reactVirtualized).toHaveProperty('List');
    expect(reactVirtualized).toHaveProperty('Table');
  });

  it('ships the documented stylesheet', async () => {
    expect(packageJson.files).toContain('styles.css');
    await expect(access(join(__dirname, '..', 'styles.css'))).resolves.toBeUndefined();
  });

  it('documents the scoped package name for installation and imports', async () => {
    const readme = await readFile(join(__dirname, '..', 'README.md'), 'utf8');

    expect(readme).toContain('npm install @opensourceframework/react-virtualized');
    expect(readme).toContain("import '@opensourceframework/react-virtualized/styles.css';");
    expect(readme).not.toContain('npm install react-virtualized');
    expect(readme).not.toContain("import 'react-virtualized");
    expect(readme).not.toContain("from 'react-virtualized");
  });

  it('keeps coverage collection focused on runtime sources', async () => {
    const config = await readFile(join(__dirname, '..', 'vitest.config.mts'), 'utf8');

    expect(config).toContain("'source-stripped/**/*.example.jsx'");
    expect(config).toContain("'source-stripped/demo/**'");
    expect(config).toContain("'source-stripped/vendor/**'");
  });
});
