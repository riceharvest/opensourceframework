/**
 * React Accessibility Utilities
 * Helper functions and hooks for building accessible React applications
 * @module @opensourceframework/react-a11y-utils
 */

// ============================================================================
// Types
// ============================================================================

/**
 * Standard accessibility props that can be spread onto elements
 */
export interface AccessibilityProps {
  'aria-activedescendant'?: string;
  'aria-atomic'?: 'true' | 'false';
  'aria-autocomplete'?: 'inline' | 'list' | 'both' | 'none';
  'aria-busy'?: 'true' | 'false';
  'aria-checked'?: 'true' | 'false' | 'mixed';
  'aria-colcount'?: number;
  'aria-colindex'?: number;
  'aria-colspan'?: number;
  'aria-controls'?: string;
  'aria-current'?: 'page' | 'step' | 'location' | 'date' | 'time' | 'true' | 'false';
  'aria-describedby'?: string;
  'aria-details'?: string;
  'aria-disabled'?: 'true' | 'false';
  'aria-dropeffect'?: 'copy' | 'execute' | 'link' | 'move' | 'none' | 'popup';
  'aria-errormessage'?: string;
  'aria-expanded'?: 'true' | 'false';
  'aria-flowto'?: string;
  'aria-grabbed'?: 'true' | 'false';
  'aria-haspopup'?: 'false' | 'true' | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  'aria-hidden'?: 'true' | 'false';
  'aria-invalid'?: 'true' | 'false' | 'grammar' | 'spelling';
  'aria-keyshortcuts'?: string;
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-level'?: number;
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-modal'?: 'true' | 'false';
  'aria-multiline'?: 'true' | 'false';
  'aria-multiselectable'?: 'true' | 'false';
  'aria-orientation'?: 'horizontal' | 'vertical';
  'aria-owns'?: string;
  'aria-placeholder'?: string;
  'aria-posinset'?: number;
  'aria-pressed'?: 'true' | 'false' | 'mixed';
  'aria-readonly'?: 'true' | 'false';
  'aria-relevant'?: 'additions' | 'removals' | 'text' | 'all';
  'aria-required'?: 'true' | 'false';
  'aria-roledescription'?: string;
  'aria-rowcount'?: number;
  'aria-rowindex'?: number;
  'aria-rowspan'?: number;
  'aria-selected'?: 'true' | 'false';
  'aria-setsize'?: number;
  'aria-sort'?: 'ascending' | 'descending' | 'none' | 'other';
  'aria-valuemax'?: number;
  'aria-valuemin'?: number;
  'aria-valuenow'?: number;
  'aria-valuetext'?: string;
  role?: string;
  tabIndex?: number;
}

/**
 * Props for live region elements
 */
export interface LiveRegionProps extends AccessibilityProps {
  'aria-live'?: 'off' | 'polite' | 'assertive';
  'aria-atomic'?: 'true' | 'false';
  'aria-relevant'?: 'additions' | 'removals' | 'text' | 'all';
  'aria-busy'?: 'true' | 'false';
}

/**
 * Options for creating live region props
 */
export interface LiveRegionOptions {
  /** Whether the entire region should be announced (true) or just changes (false) */
  atomic?: boolean;
  /** What types of changes are relevant */
  relevant?: 'additions' | 'removals' | 'text' | 'all';
  /** Whether the region is currently being updated */
  busy?: boolean;
  /** How assertive the announcement should be */
  live?: 'polite' | 'assertive';
}

/**
 * Props for disclosure elements (expand/collapse)
 */
export interface DisclosureProps extends AccessibilityProps {
  'aria-expanded': 'true' | 'false';
  'aria-controls': string;
}

/**
 * Props for toggle buttons with pressed state
 */
export interface PressedProps extends AccessibilityProps {
  'aria-pressed': 'true' | 'false' | 'mixed';
}

/**
 * Props for selectable elements
 */
export interface SelectedProps extends AccessibilityProps {
  'aria-selected': 'true' | 'false';
}

/**
 * Props for checkable elements
 */
export interface CheckedProps extends AccessibilityProps {
  'aria-checked': 'true' | 'false' | 'mixed';
}

/**
 * CSS Properties type for style objects
 */
export type A11yCSSProperties = Record<string, string | number | undefined>;

// ============================================================================
// Screen Reader Utilities
// ============================================================================

/**
 * CSS styles for screen-reader-only content
 * Elements with these styles are visually hidden but accessible to screen readers
 *
 * @example
 * ```tsx
 * <span style={srOnly}>Skip to main content</span>
 * ```
 */
export const srOnly: A11yCSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: '0',
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  borderWidth: '0',
};

/**
 * CSS styles for making hidden content visible when focused
 * Use for skip links that should appear on focus
 *
 * @example
 * ```tsx
 * <a href="#main" style={srOnlyFocusable}>Skip to main content</a>
 * ```
 */
export const srOnlyFocusable: A11yCSSProperties = {
  position: 'absolute',
  width: 'auto',
  height: 'auto',
  padding: '1rem',
  margin: '0',
  overflow: 'visible',
  clip: 'auto',
  whiteSpace: 'normal',
};

// ============================================================================
// ARIA Props Factories
// ============================================================================

/**
 * Props for decorative elements that should be hidden from screen readers
 *
 * @example
 * ```tsx
 * <img src="decoration.png" alt="" {...decorative} />
 * ```
 */
export const decorative: AccessibilityProps = {
  'aria-hidden': 'true',
};

/**
 * Props for disabled interactive elements
 * Provides proper accessibility for disabled elements
 *
 * @example
 * ```tsx
 * <button {...disabledProps} onClick={handleClick}>Disabled</button>
 * ```
 */
export const disabledProps: AccessibilityProps = {
  'aria-disabled': 'true',
  tabIndex: -1,
};

/**
 * Props for status messages (polite announcements)
 *
 * @example
 * ```tsx
 * <div {...statusMessageProps}>Changes saved successfully</div>
 * ```
 */
export const statusMessageProps: AccessibilityProps = {
  role: 'status',
  'aria-live': 'polite',
};

/**
 * Props for alert messages (assertive announcements)
 *
 * @example
 * ```tsx
 * <div {...alertMessageProps}>Error: Please fill in all required fields</div>
 * ```
 */
export const alertMessageProps: AccessibilityProps = {
  role: 'alert',
  'aria-live': 'assertive',
};

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Creates props for live regions
 * Live regions announce changes to screen readers
 *
 * @param options - Configuration options for the live region
 * @returns Accessibility props for the live region
 *
 * @example
 * ```tsx
 * <div {...createLiveRegion({ atomic: true, live: 'polite' })}>
 *   {message}
 * </div>
 * ```
 */
export function createLiveRegion(
  options: LiveRegionOptions = {}
): LiveRegionProps {
  const {
    atomic = false,
    relevant = 'additions',
    busy = false,
    live = 'polite',
  } = options;

  return {
    'aria-live': live,
    'aria-atomic': atomic ? 'true' : 'false',
    'aria-relevant': relevant,
    'aria-busy': busy ? 'true' : 'false',
  };
}

/**
 * Creates props for skip links
 * Skip links allow keyboard users to bypass navigation
 *
 * @param targetId - The ID of the target element to skip to
 * @returns Props for the skip link element
 *
 * @example
 * ```tsx
 * <a {...createSkipLinkProps('main-content')}>Skip to main content</a>
 * // ...
 * <main id="main-content">...</main>
 * ```
 */
export function createSkipLinkProps(targetId: string): {
  href: string;
  tabIndex: number;
} {
  return {
    href: `#${targetId}`,
    tabIndex: 0,
  };
}

/**
 * Creates props for elements that expand/collapse content
 *
 * @param expanded - Whether the content is currently expanded
 * @param controlsId - The ID of the element being controlled
 * @returns Accessibility props for the disclosure trigger
 *
 * @example
 * ```tsx
 * <button {...createDisclosureProps(isOpen, 'panel-id')} onClick={toggle}>
 *   Toggle Panel
 * </button>
 * <div id="panel-id" hidden={!isOpen}>Panel content</div>
 * ```
 */
export function createDisclosureProps(
  expanded: boolean,
  controlsId: string
): DisclosureProps {
  return {
    'aria-expanded': expanded ? 'true' : 'false',
    'aria-controls': controlsId,
  };
}

/**
 * Creates props for toggle buttons with pressed state
 *
 * @param pressed - Whether the button is currently pressed
 * @returns Accessibility props for the toggle button
 *
 * @example
 * ```tsx
 * <button {...createPressedProps(isActive)} onClick={toggle}>
 *   Toggle Feature
 * </button>
 * ```
 */
export function createPressedProps(pressed: boolean): PressedProps {
  return {
    'aria-pressed': pressed ? 'true' : 'false',
  };
}

/**
 * Creates props for elements with selected state
 *
 * @param selected - Whether the element is currently selected
 * @returns Accessibility props for the selectable element
 *
 * @example
 * ```tsx
 * <li {...createSelectedProps(isSelected)} role="option">
 *   Option 1
 * </li>
 * ```
 */
export function createSelectedProps(selected: boolean): SelectedProps {
  return {
    'aria-selected': selected ? 'true' : 'false',
  };
}

/**
 * Creates props for elements with checked state
 *
 * @param checked - Whether the element is checked (true), unchecked (false), or indeterminate ('mixed')
 * @returns Accessibility props for the checkable element
 *
 * @example
 * ```tsx
 * <div {...createCheckedProps(checked)} role="checkbox" tabIndex={0}>
 *   {checked ? '✓' : ''}
 * </div>
 * ```
 */
export function createCheckedProps(
  checked: boolean | 'mixed'
): CheckedProps {
  return {
    'aria-checked': typeof checked === 'string' ? checked : (checked ? 'true' : 'false'),
  };
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Combines multiple accessibility props objects
 * Later props override earlier ones for the same keys
 *
 * @param props - Array of accessibility props to merge
 * @returns Combined accessibility props
 *
 * @example
 * ```tsx
 * <div {...mergeA11yProps(statusMessageProps, { 'aria-label': 'Status' })}>
 *   {message}
 * </div>
 * ```
 */
export function mergeA11yProps(
  ...props: AccessibilityProps[]
): AccessibilityProps {
  return Object.assign({}, ...props);
}

/**
 * Creates props for a dialog/modal trigger
 *
 * @param dialogId - The ID of the dialog element
 * @param isOpen - Whether the dialog is currently open
 * @returns Accessibility props for the dialog trigger
 *
 * @example
 * ```tsx
 * <button {...createDialogTriggerProps('my-dialog', isOpen)}>
 *   Open Dialog
 * </button>
 * ```
 */
export function createDialogTriggerProps(
  dialogId: string,
  isOpen: boolean
): AccessibilityProps {
  return {
    'aria-haspopup': 'dialog',
    'aria-controls': dialogId,
    'aria-expanded': isOpen ? 'true' : 'false',
  };
}

/**
 * Creates props for a required form field
 *
 * @param required - Whether the field is required
 * @param invalid - Whether the field value is invalid
 * @returns Accessibility props for the form field
 *
 * @example
 * ```tsx
 * <input {...createFormFieldProps(true, hasError)} />
 * ```
 */
export function createFormFieldProps(
  required: boolean,
  invalid: boolean = false
): AccessibilityProps {
  const props: AccessibilityProps = {
    'aria-required': required ? 'true' : 'false',
  };
  
  if (invalid) {
    props['aria-invalid'] = 'true';
  }
  
  return props;
}

/**
 * Creates props for describing an element with another element
 *
 * @param describedById - The ID of the element that describes this element
 * @returns Accessibility props with aria-describedby
 *
 * @example
 * ```tsx
 * <input {...createDescribedByProps('error-message')} />
 * <span id="error-message">This field is required</span>
 * ```
 */
export function createDescribedByProps(
  describedById: string
): AccessibilityProps {
  return {
    'aria-describedby': describedById,
  };
}

/**
 * Creates props for labeling an element with another element
 *
 * @param labelledById - The ID of the element that labels this element
 * @returns Accessibility props with aria-labelledby
 *
 * @example
 * ```tsx
 * <div {...createLabelledByProps('panel-title')} role="region">
 *   <h2 id="panel-title">Panel Title</h2>
 *   Panel content
 * </div>
 * ```
 */
export function createLabelledByProps(
  labelledById: string
): AccessibilityProps {
  return {
    'aria-labelledby': labelledById,
  };
}
