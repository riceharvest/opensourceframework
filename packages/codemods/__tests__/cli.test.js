import { execFileSync } from 'child_process';
import fs from 'fs';
import os from 'os';
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

  it('passes migration paths as arguments instead of shell commands', () => {
    const binPath = path.join(__dirname, '../bin/osf-codemod.js');
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'osf-codemod-'));
    const markerPath = path.join(tmpDir, 'shell-injection-marker');
    const targetName = 'target; touch shell-injection-marker; #';
    const targetPath = path.join(tmpDir, targetName);

    fs.mkdirSync(targetPath);

    try {
      try {
        execFileSync(process.execPath, [binPath, 'next-seo', targetName], {
          cwd: tmpDir,
          encoding: 'utf8',
          stdio: 'pipe',
        });
      } catch {
        // The migration may fail because the fixture has no transformable files.
        // This assertion is about ensuring the path was never evaluated by a shell.
      }

      expect(fs.existsSync(markerPath)).toBe(false);
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  });
});
