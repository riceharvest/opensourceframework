# @opensourceframework/next-images

## 1.8.8

### Patch Changes

- Initial release of @opensourceframework/next-images - a maintained fork of the archived next-images package.

  This fork provides:
  - Continued maintenance for the original next-images package by Aref Aslani
  - Next.js 12-16 support
  - Full TypeScript support with type definitions
  - Modern build tooling (tsup, vitest)

  Note: This package is deprecated. Next.js 10+ includes a built-in Image component that provides automatic image optimization, lazy loading, and better performance. We recommend migrating to `next/image` for new projects.

## 1.8.6

### Added

- Full TypeScript support with type definitions
- Exported constants: `DEFAULT_FILE_EXTENSIONS`, `DEFAULT_INLINE_IMAGE_LIMIT`, `DEFAULT_NAME`
- Exported types: `WithImagesOptions`, `WithImagesResult`, `WebpackConfig`, `WebpackConfigContext`, `NextConfig`
- JSDoc documentation for all public APIs
- Comprehensive test suite with vitest

### Changed

- Forked from [next-images](https://github.com/twopluszero/next-images) v1.8.5
- Converted source code from JavaScript to TypeScript
- Updated package name to `@opensourceframework/next-images`
- Modernized build tooling with tsup
- Added deprecation notice recommending Next.js built-in Image component

### Fixed

- Type safety for webpack configuration
- Proper handling of `inlineImageLimit: false` option

### Migration Guide

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

---

## Historical Changelog (from original next-images)

### 1.8.5 (Original)

- Last release by original author (twopluszero)
- Added support for avif and jp2 file extensions

### 1.8.4

- Various bug fixes

### 1.8.3

- Added support for webp images

### 1.8.2

- Fixed compatibility issues with Next.js 10

### 1.8.1

- Minor bug fixes

### 1.8.0

- Added `dynamicAssetPrefix` option for runtime asset prefix resolution
- Added `esModule` option for ES modules syntax

### 1.7.0

- Added `fileExtensions` option to customize supported image types
- Added `name` option for custom file name templates

### 1.6.0

- Added `exclude` option to exclude specific paths from the loader
- Improved TypeScript support

### 1.5.0

- Added support for Next.js 9
- Improved webpack configuration merging

### 1.4.0

- Added `inlineImageLimit` option
- Improved handling of assetPrefix and basePath

### 1.3.0

- Added TypeScript type definitions
- Fixed various webpack configuration issues

### 1.2.0

- Added support for gif and ico images
- Improved documentation

### 1.1.0

- Initial stable release
- Support for jpg, jpeg, png, svg images
- Base64 inlining for small images
- CDN support with assetPrefix
