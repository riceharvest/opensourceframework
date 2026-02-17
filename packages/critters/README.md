# @opensourceframework/critters

[![npm version](https://img.shields.io/npm/v/@opensourceframework/critters.svg)](https://www.npmjs.com/package/@opensourceframework/critters)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

> Inline critical CSS and lazy-load the rest for faster page loads

This is a maintained fork of the original [`critters`](https://github.com/GoogleChromeLabs/critters) package by GoogleChromeLabs.

## 📢 Why This Fork?

The original `critters` package was **archived by GoogleChromeLabs in October 2024**. This fork continues maintenance to ensure the package remains available and up-to-date for the community.

### What this fork provides:

- 🔄 **Continued Maintenance**: Ongoing updates and bug fixes
- 🔒 **Security Updates**: Prompt patches for vulnerabilities
- 🔧 **Modern Tooling**: Updated dependencies and build tools
- 🧪 **Test Coverage**: Comprehensive test suite
- 📖 **Documentation**: Improved and up-to-date documentation

## Attribution

This package is a fork of [GoogleChromeLabs/critters](https://github.com/GoogleChromeLabs/critters), originally created by:

- **Jason Miller** ([@developit](https://github.com/developit))
- **Janicklas Ralph** ([@janicklas](https://github.com/janicklas))

Original source code is Copyright 2018 Google LLC and licensed under the Apache License, Version 2.0.

## Installation

```bash
npm install @opensourceframework/critters
# or
yarn add @opensourceframework/critters
# or
pnpm add @opensourceframework/critters
```

## Usage

### Basic Usage

```javascript
import Critters from '@opensourceframework/critters';

const critters = new Critters({
  path: '/path/to/public',
  publicPath: '/'
});

const html = `
  <html>
    <head>
      <link rel="stylesheet" href="/style.css">
    </head>
    <body>
      <h1>Hello World!</h1>
    </body>
  </html>
`;

const processedHtml = await critters.process(html);
```

### With Webpack

```javascript
// webpack.config.js
const Critters = require('@opensourceframework/critters');

module.exports = {
  // ...
  plugins: [
    new Critters({
      // Options
      preload: 'swap',
      pruneSource: false,
      reduceInlineStyles: true
    })
  ]
};
```

### With Next.js

```javascript
// next.config.js
const Critters = require('@opensourceframework/critters');

module.exports = {
  webpack: (config, { dev }) => {
    if (!dev) {
      config.plugins.push(
        new Critters({
          preload: 'swap'
        })
      );
    }
    return config;
  }
};
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `path` | `string` | `process.cwd()` | Base path for resolving stylesheets |
| `publicPath` | `string` | `''` | Public URL prefix for stylesheets |
| `external` | `boolean` | `false` | Only inline styles from `additionalStylesheets` |
| `additionalStylesheets` | `string[]` | `[]` | Additional stylesheets to inline |
| `preload` | `string` | `'swap'` | Preload strategy: `'swap'`, `'media'`, `'js'`, `'js-lazy'`, `'body'`, or `'none'` |
| `noscriptFallback` | `boolean` | `true` | Add `<noscript>` fallback for preloaded stylesheets |
| `inlineThreshold` | `number` | `0` | Inline stylesheets smaller than this size (bytes) |
| `minimumExternalSize` | `number` | `0` | Minimum size for external stylesheets |
| `pruneSource` | `boolean` | `false` | Remove inlined rules from external stylesheet |
| `mergeStylesheets` | `boolean` | `true` | Merge multiple stylesheets into one |
| `additionalStylesheets` | `string[]` | `[]` | Fetch additional stylesheets not in the HTML |
| `reduceInlineStyles` | `boolean` | `true` | Reduce inline styles |
| `loadFonts` | `boolean` | `true` | Preload critical fonts |
| `logger` | `object` | `null` | Custom logger instance |

### Preload Strategies

- **`swap`** (default): Uses `<link rel="preload">` to load CSS asynchronously
- **`media`**: Uses media attribute trick to load CSS asynchronously  
- **`js`**: Uses JavaScript to load CSS asynchronously
- **`js-lazy`**: Uses JavaScript with requestAnimationFrame for lazy loading
- **`body`**: Appends stylesheet to body for async loading
- **`none`**: No preloading, just inlines critical CSS

## How It Works

Critters extracts critical CSS by:

1. Parsing the HTML document
2. Finding all linked stylesheets
3. Parsing CSS rules and matching them against DOM elements
4. Inlining only the CSS rules that apply to elements in the initial HTML
5. Lazy-loading the remaining CSS using your chosen preload strategy

### Special CSS Comments

Control which CSS gets inlined using special comments:

```css
/* critters:exclude */
.always-external { color: red; }

/* critters:include */
.always-inlined { color: blue; }

/* critters:include start */
.included-rule-1 { color: green; }
.included-rule-2 { color: yellow; }
/* critters:include end */
```

- `critters:exclude` - Never inline these rules
- `critters:include` - Always inline these rules (even if not matched)
- `critters:include start` / `critters:include end` - Include a block of rules

## Migration from `critters`

If you were using the original `critters` package, migrating is straightforward:

```diff
- import Critters from 'critters';
+ import Critters from '@opensourceframework/critters';

- const critters = new Critters(options);
+ const critters = new Critters(options);
```

The API is fully compatible with the original package. Simply replace the package name in your dependencies and imports.

## API Reference

### `new Critters(options)`

Creates a new Critters instance.

### `critters.process(html)`

Processes HTML and returns the result with inlined critical CSS.

- **Parameters:**
  - `html` (string): The HTML to process
- **Returns:** `Promise<string>` - The processed HTML

### `critters.readFile(filename)`

Reads a stylesheet file. Override this method to customize file reading.

- **Parameters:**
  - `filename` (string): The path to the stylesheet
- **Returns:** `string | undefined` - The CSS content

## Security

This package includes protections against:

- Path traversal attacks (stylesheets outside base path)
- HTML injection via CSS content
- Malicious media query injection
- Script injection via stylesheet URLs

## Contributing

We welcome contributions! Please see our [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

Apache-2.0 © Google LLC

This fork is maintained by the OpenSource Framework Contributors.

## Links

- [Original Repository](https://github.com/GoogleChromeLabs/critters)
- [Issue Tracker](https://github.com/opensourceframework/opensourceframework/issues)
- [Changelog](./CHANGELOG.md)
- [npm Package](https://www.npmjs.com/package/@opensourceframework/critters)
