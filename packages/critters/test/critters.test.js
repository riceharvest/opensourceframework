/**
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import { describe, it, expect, vi } from 'vitest';
import Critters from '../src/index.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const trim = (s) =>
  s[0]
    .trim()
    .replace(new RegExp('^' + s[0].match(/^( {2}|\t)+/m)[0], 'gm'), '');

describe('Critters', () => {
  it('Basic Usage', async () => {
    const critters = new Critters({
      reduceInlineStyles: false,
      path: '/'
    });
    const assets = {
      '/style.css': trim`
        h1 { color: blue; }
        h2.unused { color: red; }
        p { color: purple; }
        p.unused { color: orange; }
      `
    };
    critters.readFile = (filename) => assets[filename];
    const result = await critters.process(trim`
      <html>
        <head>
          <link rel="stylesheet" href="/style.css">
        </head>
        <body>
          <h1>Hello World!</h1>
          <p>This is a paragraph</p>
        </body>
      </html>
    `);
    expect(result).toMatch('<style>h1{color:blue}p{color:purple}</style>');
    expect(result).toMatch('<link rel="stylesheet" href="/style.css">');
  });

  it('Run on HTML file', async () => {
    const critters = new Critters({
      reduceInlineStyles: false,
      path: path.join(__dirname, 'fixtures')
    });

    const html = fs.readFileSync(
      path.join(__dirname, 'fixtures/index.html'),
      'utf8'
    );

    const result = await critters.process(html);
    // Verify critical CSS is inlined
    expect(result).toContain('<style>');
    expect(result).toContain('h1{color:blue}');
    expect(result).toContain('p{color:purple}');
  });

  it('Does not encode HTML entities', async () => {
    const critters = new Critters({
      reduceInlineStyles: false,
      path: '/'
    });
    const assets = {
      '/style.css': trim`
        h1 { color: blue; }
      `
    };
    critters.readFile = (filename) => assets[filename];
    const result = await critters.process(trim`
      <html>
        <head>
          <title>$title</title>
          <link rel="stylesheet" href="/style.css">
        </head>
        <body>
          <h1>Hello World!</h1>
        </body>
      </html>
    `);
    expect(result).toMatch('<style>h1{color:blue}</style>');
    expect(result).toMatch('<link rel="stylesheet" href="/style.css">');
    expect(result).toMatch('<title>$title</title>');
  });

  it('should keep existing link tag attributes in the noscript link', async () => {
    const critters = new Critters({
      reduceInlineStyles: false,
      path: '/',
      preload: 'media'
    });
    const assets = {
      '/style.css': trim`
        h1 { color: blue; }
      `
    };
    critters.readFile = (filename) => assets[filename];
    const result = await critters.process(trim`
      <html>
        <head>
          <title>$title</title>
          <link rel="stylesheet" href="/style.css" crossorigin="anonymous" integrity="sha384-j1GsrLo96tLqzfCY+">
        </head>
        <body>
          <h1>Hello World!</h1>
        </body>
      </html>
    `);

    expect(result).toMatch('<style>h1{color:blue}</style>');
    expect(result).toMatch('crossorigin="anonymous"');
    expect(result).toMatch('integrity="sha384-j1GsrLo96tLqzfCY+"');
  });

  it('should keep existing link tag attributes', async () => {
    const critters = new Critters({
      reduceInlineStyles: false,
      path: '/'
    });
    const assets = {
      '/style.css': trim`
        h1 { color: blue; }
      `
    };
    critters.readFile = (filename) => assets[filename];
    const result = await critters.process(trim`
      <html>
        <head>
          <title>$title</title>
          <link rel="stylesheet" href="/style.css" crossorigin="anonymous" integrity="sha384-j1GsrLo96tLqzfCY+">
        </head>
        <body>
          <h1>Hello World!</h1>
        </body>
      </html>
    `);

    expect(result).toMatch('<style>h1{color:blue}</style>');
    expect(result).toMatch('crossorigin="anonymous"');
    expect(result).toMatch('integrity="sha384-j1GsrLo96tLqzfCY+"');
  });

  it('Does not decode entities in HTML document', async () => {
    const critters = new Critters({
      path: '/'
    });
    critters.readFile = () => '';
    const result = await critters.process(trim`
      <html>
        <body>
          <h1>Hello World!</h1>
        </body>
      </html>
    `);
    expect(result).toMatch('<h1>Hello World!</h1>');
  });

  it('Prevent injection via media attr', async () => {
    const critters = new Critters({
      reduceInlineStyles: false,
      path: path.join(__dirname, 'fixtures'),
      preload: 'media'
    });

    const html = fs.readFileSync(
      path.join(__dirname, 'fixtures/media-validation.html'),
      'utf8'
    );

    const result = await critters.process(html);
    // Should not contain malicious onload
    expect(result).not.toContain("alert(1)");
  });

  it('Skip invalid path', async () => {
    const consoleSpy = vi.spyOn(globalThis.console, 'warn');

    const critters = new Critters({
      reduceInlineStyles: false,
      path: path.join(__dirname, 'fixtures')
    });

    const html = fs.readFileSync(
      path.join(__dirname, 'fixtures/subpath-validation.html'),
      'utf8'
    );

    await critters.process(html);
    // Should not warn about styles.css (valid path)
    expect(consoleSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('Unable to locate stylesheet')
    );
  });

  it('should not load stylesheets outside of the base path', async () => {
    const critters = new Critters({ path: '/var/www' });
    const readFileSpy = vi.spyOn(critters, 'readFile');
    await critters.process(`
        <html>
            <head>
                <link rel=stylesheet href=/file.css>
                <link rel=stylesheet href=/../../../company-secrets/secret.css>
            </head>
            <body></body>
        </html>
    `);
    expect(readFileSpy).toHaveBeenCalledWith('/var/www/file.css');
    expect(readFileSpy).not.toHaveBeenCalledWith(
      '/company-secrets/secret.css'
    );
  });

  it('handles empty HTML gracefully', async () => {
    const critters = new Critters({ path: '/' });
    const result = await critters.process('<html><body></body></html>');
    expect(result).toContain('<html>');
    expect(result).toContain('<body>');
  });

  it('handles HTML without stylesheets', async () => {
    const critters = new Critters({ path: '/' });
    const result = await critters.process(`
      <html>
        <head>
          <title>Test</title>
        </head>
        <body>
          <h1>Hello</h1>
        </body>
      </html>
    `);
    expect(result).toContain('<title>Test</title>');
    expect(result).toContain('<h1>Hello</h1>');
  });

  it('extracts critical CSS for elements in document', async () => {
    const critters = new Critters({
      reduceInlineStyles: false,
      path: '/'
    });
    const assets = {
      '/style.css': `
        .used-class { color: red; }
        .unused-class { color: blue; }
        h1 { font-size: 20px; }
        h2 { font-size: 18px; }
      `
    };
    critters.readFile = (filename) => assets[filename];
    const result = await critters.process(`
      <html>
        <head>
          <link rel="stylesheet" href="/style.css">
        </head>
        <body>
          <h1 class="used-class">Title</h1>
        </body>
      </html>
    `);
    expect(result).toContain('.used-class{color:red}');
    expect(result).toContain('h1{font-size:20px}');
    expect(result).not.toContain('.unused-class');
    expect(result).not.toContain('h2{');
  });

  it('handles additionalStylesheets option', async () => {
    const critters = new Critters({
      path: '/',
      additionalStylesheets: ['/extra.css']
    });
    const assets = {
      '/style.css': 'h1 { color: blue; }',
      '/extra.css': 'p { color: green; }'
    };
    critters.readFile = (filename) => assets[filename];
    const result = await critters.process(`
      <html>
        <head>
          <link rel="stylesheet" href="/style.css">
        </head>
        <body>
          <h1>Title</h1>
          <p>Paragraph</p>
        </body>
      </html>
    `);
    expect(result).toContain('h1{color:blue}');
    expect(result).toContain('p{color:green}');
  });

  it('respects critters:exclude comment', async () => {
    const critters = new Critters({
      reduceInlineStyles: false,
      path: '/'
    });
    const assets = {
      '/style.css': `
        /* critters:exclude */
        .excluded { color: red; }
        .included { color: blue; }
      `
    };
    critters.readFile = (filename) => assets[filename];
    const result = await critters.process(`
      <html>
        <head>
          <link rel="stylesheet" href="/style.css">
        </head>
        <body>
          <div class="excluded"></div>
          <div class="included"></div>
        </body>
      </html>
    `);
    // critters:exclude should exclude the rule from critical CSS
    expect(result).not.toContain('.excluded{color:red}');
    expect(result).toContain('.included{color:blue}');
  });

  it('respects critters:include comment', async () => {
    const critters = new Critters({
      reduceInlineStyles: false,
      path: '/'
    });
    const assets = {
      '/style.css': `
        /* critters:include */
        .always-included { color: red; }
        .maybe-used { color: blue; }
      `
    };
    critters.readFile = (filename) => assets[filename];
    const result = await critters.process(`
      <html>
        <head>
          <link rel="stylesheet" href="/style.css">
        </head>
        <body>
        </body>
      </html>
    `);
    expect(result).toContain('.always-included{color:red}');
  });

  it('handles preload: swap option', async () => {
    const critters = new Critters({
      path: '/',
      preload: 'swap'
    });
    const assets = {
      '/style.css': 'h1 { color: blue; }'
    };
    critters.readFile = (filename) => assets[filename];
    const result = await critters.process(`
      <html>
        <head>
          <link rel="stylesheet" href="/style.css">
        </head>
        <body>
          <h1>Title</h1>
        </body>
      </html>
    `);
    expect(result).toContain('h1{color:blue}');
    // Should have preload link
    expect(result).toMatch(/rel="preload"/);
  });

  it('handles preload: js option', async () => {
    const critters = new Critters({
      path: '/',
      preload: 'js'
    });
    const assets = {
      '/style.css': 'h1 { color: blue; }'
    };
    critters.readFile = (filename) => assets[filename];
    const result = await critters.process(`
      <html>
        <head>
          <link rel="stylesheet" href="/style.css">
        </head>
        <body>
          <h1>Title</h1>
        </body>
      </html>
    `);
    expect(result).toContain('h1{color:blue}');
    // Should have JS-based loading (script tag with data-href attribute)
    expect(result).toMatch(/<script[^>]*data-href/);
  });

  it('handles pruneSource option', async () => {
    const critters = new Critters({
      path: '/',
      pruneSource: true
    });
    const assets = {
      '/style.css': `
        h1 { color: blue; }
        h2 { color: red; }
      `
    };
    critters.readFile = (filename) => assets[filename];
    const result = await critters.process(`
      <html>
        <head>
          <link rel="stylesheet" href="/style.css">
        </head>
        <body>
          <h1>Title</h1>
        </body>
      </html>
    `);
    expect(result).toContain('h1{color:blue}');
    // When pruneSource is true, non-critical CSS should be removed from the stylesheet
  });
});
