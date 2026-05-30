import { execFileSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';
import packageJson from '../package.json';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

describe('osf-codemod CLI', () => {
  it('reports the package version', () => {
    const binPath = path.join(__dirname, '../bin/osf-codemod.js');
    const output = execFileSync(process.execPath, [binPath, '--version'], {
      encoding: 'utf8',
    }).trim();

    expect(output).toBe(packageJson.version);
  });
});