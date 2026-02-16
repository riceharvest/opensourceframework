# @opensourceframework/react-a11y-utils

[![npm version](https://badge.fury.io/js/@opensourceframework%2Freact-a11y-utils.svg)](https://badge.fury.io/js/@opensourceframework%2Freact-a11y-utils)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

React accessibility utility functions and hooks for building accessible user interfaces. Provides a comprehensive set of ARIA prop factories and CSS utilities to help you build WCAG-compliant React applications.

## Features

- 🎯 **ARIA Prop Factories** - Functions to generate correct ARIA props for common patterns
- 👁️ **Screen Reader Utilities** - CSS styles for visually hidden but accessible content
- 🔧 **TypeScript Support** - Full type definitions for all ARIA attributes
- 🪶 **Zero Dependencies** - No external dependencies
- ♿ **WCAG Compliant** - Built following accessibility best practices

## Installation

```bash
npm install @opensourceframework/react-a11y-utils
# or
yarn add @opensourceframework/react-a11y-utils
# or
pnpm add @opensourceframework/react-a11y-utils
```

## Quick Start

```tsx
import {
  srOnly,
  createDisclosureProps,
  createLiveRegion,
  statusMessageProps,
} from '@opensourceframework/react-a11y-utils';

function Accordion({ title, children, isOpen, onToggle }) {
  return (
    <div>
      <button
        {...createDisclosureProps(isOpen, 'panel-1')}
        onClick={onToggle}
      >
        {title}
      </button>
      <div id="panel-1" hidden={!isOpen}>
        {children}
      </div>
    </div>
  );
}

function StatusMessage({ message }) {
  return (
    <div {...statusMessageProps}>
      {message}
    </div>
  );
}

// Screen reader only text
function SkipLink() {
  return (
    <a href="#main-content" style={srOnly} tabIndex={0}>
      Skip to main content
    </a>
  );
}
```

## API Reference

### Screen Reader Utilities

#### `srOnly`

CSS styles for screen-reader-only content. Elements are visually hidden but accessible to screen readers.

```tsx
<span style={srOnly}>This text is only visible to screen readers</span>
```

#### `srOnlyFocusable`

CSS styles for elements that should become visible when focused (e.g., skip links).

```tsx
<a href="#main" style={srOnlyFocusable}>Skip to main content</a>
```

### Pre-built Props

#### `decorative`

Props for decorative elements that should be hidden from screen readers.

```tsx
<img src="decoration.png" alt="" {...decorative} />
```

#### `disabledProps`

Props for disabled interactive elements.

```tsx
<button {...disabledProps}>Disabled Button</button>
```

#### `statusMessageProps`

Props for status messages (polite announcements).

```tsx
<div {...statusMessageProps}>Changes saved successfully</div>
```

#### `alertMessageProps`

Props for alert messages (assertive announcements).

```tsx
<div {...alertMessageProps}>Error: Please correct the form</div>
```

### Factory Functions

#### `createLiveRegion(options)`

Creates props for live regions that announce changes to screen readers.

```tsx
<div {...createLiveRegion({ atomic: true, live: 'polite' })}>
  {message}
</div>
```

**Options:**
| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `atomic` | `boolean` | `false` | Announce entire region or just changes |
| `relevant` | `'additions' \| 'removals' \| 'text' \| 'all'` | `'additions'` | What changes to announce |
| `busy` | `boolean` | `false` | Whether region is being updated |
| `live` | `'polite' \| 'assertive'` | `'polite'` | How assertive the announcement |

#### `createSkipLinkProps(targetId)`

Creates props for skip links.

```tsx
<a {...createSkipLinkProps('main-content')}>Skip to main content</a>
<main id="main-content">...</main>
```

#### `createDisclosureProps(expanded, controlsId)`

Creates props for elements that expand/collapse content.

```tsx
<button {...createDisclosureProps(isOpen, 'panel-id')} onClick={toggle}>
  Toggle
</button>
```

#### `createPressedProps(pressed)`

Creates props for toggle buttons with pressed state.

```tsx
<button {...createPressedProps(isActive)} onClick={toggle}>
  Toggle Feature
</button>
```

#### `createSelectedProps(selected)`

Creates props for elements with selected state.

```tsx
<li {...createSelectedProps(isSelected)} role="option">
  Option 1
</li>
```

#### `createCheckedProps(checked)`

Creates props for elements with checked state.

```tsx
<div {...createCheckedProps(checked)} role="checkbox" tabIndex={0}>
  {checked ? '✓' : ''}
</div>
```

#### `createDialogTriggerProps(dialogId, isOpen)`

Creates props for dialog/modal triggers.

```tsx
<button {...createDialogTriggerProps('my-dialog', isOpen)}>
  Open Dialog
</button>
```

#### `createFormFieldProps(required, invalid?)`

Creates props for form fields.

```tsx
<input {...createFormFieldProps(true, hasError)} />
```

#### `createDescribedByProps(describedById)`

Creates props for elements described by another element.

```tsx
<input {...createDescribedByProps('error-message')} />
<span id="error-message">This field is required</span>
```

#### `createLabelledByProps(labelledById)`

Creates props for elements labeled by another element.

```tsx
<div {...createLabelledByProps('panel-title')} role="region">
  <h2 id="panel-title">Panel Title</h2>
  Content
</div>
```

#### `mergeA11yProps(...props)`

Combines multiple accessibility props objects.

```tsx
<div {...mergeA11yProps(statusMessageProps, { 'aria-label': 'Status' })}>
  {message}
</div>
```

## Usage Examples

### Accordion Component

```tsx
import { createDisclosureProps } from '@opensourceframework/react-a11y-utils';

function AccordionItem({ id, title, children, isExpanded, onToggle }) {
  const panelId = `panel-${id}`;
  
  return (
    <div className="accordion-item">
      <h3>
        <button
          {...createDisclosureProps(isExpanded, panelId)}
          onClick={onToggle}
        >
          {title}
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        hidden={!isExpanded}
      >
        {children}
      </div>
    </div>
  );
}
```

### Checkbox Component

```tsx
import { createCheckedProps } from '@opensourceframework/react-a11y-utils';

function Checkbox({ checked, onChange, children }) {
  return (
    <div
      {...createCheckedProps(checked)}
      role="checkbox"
      tabIndex={0}
      onClick={() => onChange(!checked)}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          onChange(!checked);
        }
      }}
    >
      {checked ? '✓' : ''}
      {children}
    </div>
  );
}
```

### Toast Notifications

```tsx
import { createLiveRegion, alertMessageProps } from '@opensourceframework/react-a11y-utils';

function Toast({ message, type = 'info' }) {
  const props = type === 'error' 
    ? alertMessageProps 
    : createLiveRegion({ live: 'polite' });

  return (
    <div {...props} className={`toast toast-${type}`}>
      {message}
    </div>
  );
}
```

## Contributing

See [Contributing Guide](../../CONTRIBUTING.md) for details.

## License

MIT © OpenSource Framework Contributors
