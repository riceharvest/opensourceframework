import { describe, expect, it } from 'vitest';
import * as reactVirtualized from '../source-stripped/index.jsx';

describe('@opensourceframework/react-virtualized', () => {
  it('exports core components', () => {
    expect(reactVirtualized).toHaveProperty('AutoSizer');
    expect(reactVirtualized).toHaveProperty('Grid');
    expect(reactVirtualized).toHaveProperty('List');
    expect(reactVirtualized).toHaveProperty('Table');
  });
});
