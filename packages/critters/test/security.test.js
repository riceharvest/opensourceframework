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

import { describe, it, expect } from 'vitest';
import Critters from '../src/index.js';

/**
 * Check if HTML contains a script tag with specific content
 * @param {string} html - HTML string to check
 * @returns {boolean} - True if evil script is found
 */
function hasEvilScript(html) {
  // Check for script tag containing alert(1)
  const scriptMatch = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi);
  if (!scriptMatch) return false;
  return scriptMatch.some(script => 
    script.toLowerCase().includes('alert(1)')
  );
}

/**
 * Check if HTML contains an onload attribute with malicious content
 * @param {string} html - HTML string to check
 * @returns {boolean} - True if evil onload is found
 */
function _hasEvilOnload(html) {
  // Check for onload attributes containing alert
  const onloadMatch = html.match(/onload\s*=\s*["'][^"']*alert\([^)]*\)[^"']*["']/gi);
  return onloadMatch !== null && onloadMatch.length > 0;
}

describe('Security', () => {
  it('should not decode HTML entities', async () => {
    const critters = new Critters({});
    // Test that encoded HTML entities are NOT decoded into executable scripts
    // Input has encoded entities: &lt;script&gt; not actual <script> tags
    const html = await critters.process(`
      <html>
        <body>
          &lt;script&gt;alert(1)&lt;/script&gt;
        </body>
      </html>
    `);
    expect(hasEvilScript(html)).toBe(false);
    // Should still contain the encoded entities (not decoded to actual script tags)
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('&lt;/script&gt;');
  });

  it('should not create a new script tag from embedding linked stylesheets', async () => {
    const critters = new Critters({});
    critters.readFile = () =>
      `* { background: url('</style><script>alert(1)</script>') }`;
    const html = await critters.process(`
      <html>
        <head>
          <link rel=stylesheet href=/file.css>
        </head>
        <body>
        </body>
      </html>
    `);
    expect(hasEvilScript(html)).toBe(false);
  });

  it('should not create a new script tag from embedding additional stylesheets', async () => {
    const critters = new Critters({
      additionalStylesheets: ['/style.css']
    });
    critters.readFile = () =>
      `* { background: url('</style><script>alert(1)</script>') }`;
    const html = await critters.process(`
      <html>
        <head>
        </head>
        <body>
        </body>
      </html>
    `);
    expect(hasEvilScript(html)).toBe(false);
  });

  it('should not create a new script tag by ending </script> from href', async () => {
    const critters = new Critters({ preload: 'js' });
    critters.readFile = () => `* { background: red }`;
    const html = await critters.process(`
      <html>
        <head>
          <link rel=stylesheet href="/abc/</script><script>alert(1)</script>/style.css">
        </head>
        <body>
        </body>
      </html>
    `);
    expect(hasEvilScript(html)).toBe(false);
  });

  it('should not execute JavaScript in CSS content property', async () => {
    const critters = new Critters({});
    critters.readFile = () =>
      `body::after { content: '</style><script>alert(1)</script>'; }`;
    const html = await critters.process(`
      <html>
        <head>
          <link rel=stylesheet href=/file.css>
        </head>
        <body></body>
      </html>
    `);
    expect(hasEvilScript(html)).toBe(false);
  });

  it('should sanitize malicious media queries', async () => {
    const critters = new Critters({
      path: '/',
      preload: 'media'
    });
    critters.readFile = () => 'h1 { color: blue; }';
    const html = await critters.process(`
      <html>
        <head>
          <link rel="stylesheet" href="/style.css" media="print" onload="alert(1)">
        </head>
        <body>
          <h1>Test</h1>
        </body>
      </html>
    `);
    // Should not contain the malicious onload
    expect(html).not.toContain('alert(1)');
  });

  it('should prevent path traversal attacks', async () => {
    const critters = new Critters({ path: '/var/www' });
    const readFileCalls = [];
    critters.readFile = (filename) => {
      readFileCalls.push(filename);
      return 'h1 { color: blue; }';
    };
    
    await critters.process(`
      <html>
        <head>
          <link rel="stylesheet" href="../../../etc/passwd">
          <link rel="stylesheet" href="/../../etc/shadow">
          <link rel="stylesheet" href="/normal.css">
        </head>
        <body></body>
      </html>
    `);
    
    // Should only read files within the base path
    expect(readFileCalls).toContain('/var/www/normal.css');
    expect(readFileCalls).not.toContain('/etc/passwd');
    expect(readFileCalls).not.toContain('/etc/shadow');
  });

  it('should handle malformed HTML without crashing', async () => {
    const critters = new Critters({});
    critters.readFile = () => 'h1 { color: blue; }';
    
    // Should not throw
    const malformedHtmls = [
      '<html><head><link rel="stylesheet" href="/style.css"',
      '<html><head><style>h1 { color: blue; }</style><body>',
      '<<<html>>><<<head>>><link rel="stylesheet" href="/style.css">',
      '<html><head><link rel="stylesheet" href="javascript:alert(1)"></head></html>',
    ];
    
    for (const html of malformedHtmls) {
      await expect(critters.process(html)).resolves.toBeDefined();
    }
  });

  it('should not inject executable code via CSS url()', async () => {
    const critters = new Critters({});
    critters.readFile = () => `
      body { 
        background: url('javascript:alert(1)'); 
      }
      h1 {
        background: url("data:text/javascript,alert(1)");
      }
    `;
    const html = await critters.process(`
      <html>
        <head>
          <link rel="stylesheet" href="/style.css">
        </head>
        <body>
          <h1>Test</h1>
        </body>
      </html>
    `);
    
    // The CSS should be inlined but not execute
    expect(html).toContain('background');
    // Should not have script injection
    expect(hasEvilScript(html)).toBe(false);
  });
});
