import { describe, it, expect } from 'vitest';
import {
  srOnly,
  srOnlyFocusable,
  decorative,
  disabledProps,
  statusMessageProps,
  alertMessageProps,
  createLiveRegion,
  createSkipLinkProps,
  createDisclosureProps,
  createPressedProps,
  createSelectedProps,
  createCheckedProps,
  mergeA11yProps,
  createDialogTriggerProps,
  createFormFieldProps,
  createDescribedByProps,
  createLabelledByProps,
} from '../src/index';

describe('Screen Reader Utilities', () => {
  describe('srOnly', () => {
    it('should have correct CSS properties for visually hidden content', () => {
      expect(srOnly.position).toBe('absolute');
      expect(srOnly.width).toBe('1px');
      expect(srOnly.height).toBe('1px');
      expect(srOnly.overflow).toBe('hidden');
    });
  });

  describe('srOnlyFocusable', () => {
    it('should have correct CSS properties for focusable skip links', () => {
      expect(srOnlyFocusable.position).toBe('absolute');
      expect(srOnlyFocusable.width).toBe('auto');
      expect(srOnlyFocusable.height).toBe('auto');
      expect(srOnlyFocusable.overflow).toBe('visible');
    });
  });
});

describe('ARIA Props Factories', () => {
  describe('decorative', () => {
    it('should have aria-hidden set to true', () => {
      expect(decorative['aria-hidden']).toBe('true');
    });
  });

  describe('disabledProps', () => {
    it('should have correct accessibility props for disabled state', () => {
      expect(disabledProps['aria-disabled']).toBe('true');
      expect(disabledProps.tabIndex).toBe(-1);
    });
  });

  describe('statusMessageProps', () => {
    it('should have correct props for status messages', () => {
      expect(statusMessageProps.role).toBe('status');
      expect(statusMessageProps['aria-live']).toBe('polite');
    });
  });

  describe('alertMessageProps', () => {
    it('should have correct props for alert messages', () => {
      expect(alertMessageProps.role).toBe('alert');
      expect(alertMessageProps['aria-live']).toBe('assertive');
    });
  });
});

describe('Factory Functions', () => {
  describe('createLiveRegion', () => {
    it('should create default live region props', () => {
      const props = createLiveRegion();
      expect(props['aria-live']).toBe('polite');
      expect(props['aria-atomic']).toBe('false');
      expect(props['aria-relevant']).toBe('additions');
      expect(props['aria-busy']).toBe('false');
    });

    it('should accept custom options', () => {
      const props = createLiveRegion({
        atomic: true,
        relevant: 'all',
        busy: true,
        live: 'assertive',
      });
      expect(props['aria-live']).toBe('assertive');
      expect(props['aria-atomic']).toBe('true');
      expect(props['aria-relevant']).toBe('all');
      expect(props['aria-busy']).toBe('true');
    });
  });

  describe('createSkipLinkProps', () => {
    it('should create skip link props with correct href', () => {
      const props = createSkipLinkProps('main-content');
      expect(props.href).toBe('#main-content');
      expect(props.tabIndex).toBe(0);
    });
  });

  describe('createDisclosureProps', () => {
    it('should create props for expanded state', () => {
      const props = createDisclosureProps(true, 'panel-id');
      expect(props['aria-expanded']).toBe('true');
      expect(props['aria-controls']).toBe('panel-id');
    });

    it('should create props for collapsed state', () => {
      const props = createDisclosureProps(false, 'panel-id');
      expect(props['aria-expanded']).toBe('false');
    });
  });

  describe('createPressedProps', () => {
    it('should create props for pressed state', () => {
      const props = createPressedProps(true);
      expect(props['aria-pressed']).toBe('true');
    });

    it('should create props for unpressed state', () => {
      const props = createPressedProps(false);
      expect(props['aria-pressed']).toBe('false');
    });
  });

  describe('createSelectedProps', () => {
    it('should create props for selected state', () => {
      const props = createSelectedProps(true);
      expect(props['aria-selected']).toBe('true');
    });

    it('should create props for unselected state', () => {
      const props = createSelectedProps(false);
      expect(props['aria-selected']).toBe('false');
    });
  });

  describe('createCheckedProps', () => {
    it('should create props for checked state', () => {
      const props = createCheckedProps(true);
      expect(props['aria-checked']).toBe('true');
    });

    it('should create props for unchecked state', () => {
      const props = createCheckedProps(false);
      expect(props['aria-checked']).toBe('false');
    });

    it('should create props for mixed/indeterminate state', () => {
      const props = createCheckedProps('mixed');
      expect(props['aria-checked']).toBe('mixed');
    });
  });

  describe('mergeA11yProps', () => {
    it('should merge multiple props objects', () => {
      const merged = mergeA11yProps(
        { role: 'button' },
        { 'aria-label': 'Test' }
      );
      expect(merged.role).toBe('button');
      expect(merged['aria-label']).toBe('Test');
    });

    it('should override earlier props with later ones', () => {
      const merged = mergeA11yProps(
        { 'aria-label': 'First' },
        { 'aria-label': 'Second' }
      );
      expect(merged['aria-label']).toBe('Second');
    });
  });

  describe('createDialogTriggerProps', () => {
    it('should create props for closed dialog', () => {
      const props = createDialogTriggerProps('dialog-id', false);
      expect(props['aria-haspopup']).toBe('dialog');
      expect(props['aria-controls']).toBe('dialog-id');
      expect(props['aria-expanded']).toBe('false');
    });

    it('should create props for open dialog', () => {
      const props = createDialogTriggerProps('dialog-id', true);
      expect(props['aria-expanded']).toBe('true');
    });
  });

  describe('createFormFieldProps', () => {
    it('should create props for required field', () => {
      const props = createFormFieldProps(true);
      expect(props['aria-required']).toBe('true');
      expect(props['aria-invalid']).toBeUndefined();
    });

    it('should create props for optional field', () => {
      const props = createFormFieldProps(false);
      expect(props['aria-required']).toBe('false');
    });

    it('should include invalid state', () => {
      const props = createFormFieldProps(true, true);
      expect(props['aria-invalid']).toBe('true');
    });
  });

  describe('createDescribedByProps', () => {
    it('should create aria-describedby props', () => {
      const props = createDescribedByProps('description-id');
      expect(props['aria-describedby']).toBe('description-id');
    });
  });

  describe('createLabelledByProps', () => {
    it('should create aria-labelledby props', () => {
      const props = createLabelledByProps('label-id');
      expect(props['aria-labelledby']).toBe('label-id');
    });
  });
});
