# @opensourceframework/next-images

[![npm version](https://img.shields.io/npm/v/@opensourceframework/next-images.svg)](https://www.npmjs.com/package/@opensourceframework/next-images)
[![npm downloads](https://img.shields.io/npm/dm/@opensourceframework/next-images.svg)](https://www.npmjs.com/package/@opensourceframework/next-images)
[![MIT License](https://img.shields.io/npm/l/@opensourceframework/next-images.svg)](https://github.com/opensourceframework/opensourceframework/blob/main/packages/next-images/LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/opensourceframework/opensourceframework/ci.yml?branch=main)](https://github.com/opensourceframework/opensourceframework/actions)

> Import images (jpg, jpeg, png, svg, gif, ico, webp, jp2, avif) in Next.js applications

This is a maintained fork of the original [next-images](https://github.com/twopluszero/next-images) package by [Aref Aslani (twopluszero)](https://github.com/twopluszero), with TypeScript support and continued maintenance.

> **Notice**: This package is deprecated. Next.js 10+ includes a built-in [Image component](https://nextjs.org/docs/api-reference/next/image) that provides automatic image optimization, lazy loading, and better performance. We strongly recommend migrating to `next/image` for new projects.

## Features

- Load images from local filesystem
- Load images from remote CDN (with assetPrefix)
- Inline small images as Base64 to reduce HTTP requests
- Content hash in filenames for cache busting
- Full TypeScript support
- Compatible with Next.js 12-16

## Installation

```bash
npm install @opensourceframework/next-images
```

or

```bash
yarn add @opensourceframework/next-images
```

or

```bash
pnpm add @opensourceframework/next-images
```

## Quick Start

Create or update your `next.config.js`:

```js
// next.config.js
const withImages = require('@opensourceframework/next-images');

module.exports = withImages();
```

Then import images in your components:

```jsx
// Using import
import img from './my-image.jpg';

export default function MyComponent() {
  return <img src={img} alt="My Image" />;
}
```

```jsx
// Using require
export default function MyComponent() {
  return <img src={require('./my-image.jpg')} alt="My Image" />;
}
```

## Configuration Options

### `inlineImageLimit`

Maximum file size (in bytes) for inlining images as Base64. Images smaller than this limit will be inlined as data URLs.

- **Type**: `number | false`
- **Default**: `8192` (8KB)
- **Set to `false`**: Disable inlining entirely

```js
// next.config.js
const withImages = require('@opensourceframework/next-images');

module.exports = withImages({
  inlineImageLimit: 16384, // 16KB
});
```

### `assetPrefix`

Serve images from a CDN or external domain.

```js
// next.config.js
const withImages = require('@opensourceframework/next-images');

module.exports = withImages({
  assetPrefix: 'https://cdn.example.com',
});
```

### `basePath`

Set the base path for your application.

```js
// next.config.js
const withImages = require('@opensourceframework/next-images');

module.exports = withImages({
  basePath: '/my-app',
});
```

### `dynamicAssetPrefix`

Enable dynamic asset prefix resolution at runtime. Useful when `assetPrefix` can change dynamically.

```js
// next.config.js
const withImages = require('@opensourceframework/next-images');

module.exports = withImages({
  assetPrefix: 'https://cdn.example.com',
  dynamicAssetPrefix: true,
});
```

### `fileExtensions`

Customize which file extensions to handle.

- **Type**: `string[]`
- **Default**: `["jpg", "jpeg", "png", "svg", "gif", "ico", "webp", "jp2", "avif"]`

```js
// next.config.js
const withImages = require('@opensourceframework/next-images');

module.exports = withImages({
  fileExtensions: ['jpg', 'jpeg', 'png', 'webp'],
});
```

### `exclude`

Exclude specific paths from the loader. Useful when you want to handle certain files with a different loader (e.g., `svg-react-loader`).

```js
// next.config.js
const path = require('path');
const withImages = require('@opensourceframework/next-images');

module.exports = withImages({
  exclude: path.resolve(__dirname, 'src/assets/svg'),
});
```

### `name`

Customize the output file name template.

- **Type**: `string`
- **Default**: `"[name]-[hash].[ext]"`

```js
// next.config.js
const withImages = require('@opensourceframework/next-images');

module.exports = withImages({
  name: '[name].[hash:base64:8].[ext]',
});
```

Available tokens: `[name]`, `[hash]`, `[hash:base64:N]`, `[ext]`. See [webpack/loader-utils](https://github.com/webpack/loader-utils#interpolatename) for more options.

### `esModule`

Enable ES modules syntax for the output.

- **Type**: `boolean`
- **Default**: `false`

```js
// next.config.js
const withImages = require('@opensourceframework/next-images');

module.exports = withImages({
  esModule: true,
});
```

When enabled, you need to use `.default` when using `require()`:

```jsx
// With esModule: true
<img src={require('./image.png').default} />

// import statements work as before
import img from './image.png';
```

## TypeScript Support

This package includes TypeScript type definitions. For image imports, add a reference to the types in your project:

Create `additional.d.ts`:

```ts
/// <reference types="@opensourceframework/next-images" />
```

Update `tsconfig.json`:

```json
{
  "compilerOptions": {
    // ...
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", "additional.d.ts"]
}
```

## Using with `next/image`

Next.js 10+ includes a built-in Image component that provides automatic optimization. If you want to use `next/image`, set `inlineImageLimit: false` to disable Base64 inlining:

```js
// next.config.js
const withImages = require('@opensourceframework/next-images');

module.exports = withImages({
  inlineImageLimit: false,
});
```

Then use the Image component:

```jsx
import Image from 'next/image';
import myImage from './my-image.jpg';

export default function MyComponent() {
  return (
    <Image
      src={myImage}
      alt="My Image"
      width={500}
      height={300}
    />
  );
}
```

## Combining with Other Plugins

You can combine `withImages` with other Next.js plugins:

```js
// next.config.js
const withImages = require('@opensourceframework/next-images');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(
  withImages({
    // your config here
  })
);
```

## Migration from `next-images`

If you're migrating from the original `next-images` package:

1. Update your package dependencies:

```bash
npm uninstall next-images
npm install @opensourceframework/next-images
```

2. Update your `next.config.js`:

```js
// Before
const withImages = require('next-images');

// After
const withImages = require('@opensourceframework/next-images');
```

3. Update TypeScript references:

```ts
// Before
/// <reference types="next-images" />

// After
/// <reference types="@opensourceframework/next-images" />
```

## API Reference

### `withImages(options?)`

Creates a Next.js configuration with image handling support.

**Parameters:**
- `options` (optional): Configuration options object

**Returns:**
- Modified Next.js configuration object

**Example:**

```ts
import withImages from '@opensourceframework/next-images';

const config = withImages({
  inlineImageLimit: 8192,
  fileExtensions: ['jpg', 'png', 'svg'],
  assetPrefix: 'https://cdn.example.com',
});

export default config;
```

## Why This Fork?

The original [next-images](https://github.com/twopluszero/next-images) package was last updated in April 2023 and appears to be unmaintained. This fork provides:

- Continued maintenance and bug fixes
- Full TypeScript support with type definitions
- Compatibility with Next.js 12-16
- Modern build tooling (tsup, vitest)
- Active community support

## Attribution

This package is a fork of [next-images](https://github.com/twopluszero/next-images) originally created by [Aref Aslani (twopluszero)](https://github.com/twopluszero).

Original license: MIT

## License

MIT License - see [LICENSE](./LICENSE) for details.

## Contributing

Contributions are welcome! Please read our [Contributing Guide](https://github.com/opensourceframework/opensourceframework/blob/main/CONTRIBUTING.md) for details.

## Related Projects

- [next/image](https://nextjs.org/docs/api-reference/next/image) - Built-in Next.js Image component (recommended for new projects)
- [next-optimized-images](https://github.com/cyrilwanner/next-optimized-images) - Image optimization for Next.js

## Links

- [GitHub Repository](https://github.com/opensourceframework/opensourceframework/tree/main/packages/next-images)
- [npm Package](https://www.npmjs.com/package/@opensourceframework/next-images)
- [Original Repository](https://github.com/twopluszero/next-images)
- [Issue Tracker](https://github.com/opensourceframework/opensourceframework/issues)