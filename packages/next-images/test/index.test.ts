import { describe, expect, it } from 'vitest';
import withImages, {
  DEFAULT_FILE_EXTENSIONS,
  DEFAULT_INLINE_IMAGE_LIMIT,
  DEFAULT_NAME,
  withImages as withImagesNamed,
} from '../src/index';

describe('@opensourceframework/next-images', () => {
  it('exports the plugin as default and named export', () => {
    expect(typeof withImages).toBe('function');
    expect(withImagesNamed).toBe(withImages);
  });

  it('exports default constants', () => {
    expect(DEFAULT_INLINE_IMAGE_LIMIT).toBe(8192);
    expect(DEFAULT_NAME).toBe('[name]-[hash].[ext]');
    expect(DEFAULT_FILE_EXTENSIONS).toContain('png');
  });
});
