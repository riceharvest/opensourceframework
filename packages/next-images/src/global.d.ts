/**
 * TypeScript declarations for image imports
 *
 * These declarations allow TypeScript to understand image imports.
 * Add `/// <reference types="@opensrc/next-images" />` to your type definition file
 * or include this package in your tsconfig.json types array.
 */

declare module '*.jpeg' {
  const value: string;
  export = value;
}

declare module '*.jpg' {
  const value: string;
  export = value;
}

declare module '*.png' {
  const value: string;
  export = value;
}

declare module '*.svg' {
  const value: string;
  export = value;
}

declare module '*.gif' {
  const value: string;
  export = value;
}

declare module '*.ico' {
  const value: string;
  export = value;
}

declare module '*.webp' {
  const value: string;
  export = value;
}

declare module '*.jp2' {
  const value: string;
  export = value;
}

declare module '*.avif' {
  const value: string;
  export = value;
}

// Additional common image formats
declare module '*.bmp' {
  const value: string;
  export = value;
}

declare module '*.tiff' {
  const value: string;
  export = value;
}

declare module '*.tif' {
  const value: string;
  export = value;
}