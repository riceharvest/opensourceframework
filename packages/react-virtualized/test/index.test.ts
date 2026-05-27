import { access } from 'node:fs/promises';
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
});
