/// <reference types="axe-core" />
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as axe from 'axe-core';
import React from 'react';
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

// Helper to run axe-core and get results
const runAxe = async (element: HTMLElement) => {
  // @ts-expect-error - axe-core types require explicit call to run()
  return await axe.run(element);
};

// Helper component to test props application
interface TestPropsComponentProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

const TestPropsComponent = ({ children, ...props }: TestPropsComponentProps) => {
  return <div {...props}>{children}</div>;
};

describe('Accessibility Tests with axe-core', () => {
  describe('Basic ARIA Props', () => {
    it('should have no violations when using decorative props', async () => {
      const { container } = render(
        <img src="decoration.png" alt="" {...decorative} data-testid="decorative-img" />
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('should have no violations when using disabledProps', async () => {
      const { container } = render(
        <button {...disabledProps}>Disabled button</button>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('should have no violations when using statusMessageProps', async () => {
      const { container } = render(
        <div {...statusMessageProps}>Status message</div>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('should have no violations when using alertMessageProps', async () => {
      const { container } = render(
        <div {...alertMessageProps}>Alert message</div>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });
  });

  describe('Factory Functions', () => {
    it('should have no violations with createLiveRegion', async () => {
      const { container } = render(
        <div {...createLiveRegion({ live: 'polite' })}>
          Live region content
        </div>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('should have no violations with createLiveRegion assertive', async () => {
      const { container } = render(
        <div {...createLiveRegion({ live: 'assertive', atomic: true })}>
          Important alert
        </div>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('should have no violations with createDisclosureProps', async () => {
      const { container } = render(
        <div>
          <button {...createDisclosureProps(false, 'panel-1')}>
            Toggle panel
          </button>
          <div id="panel-1" hidden>
            Panel content
          </div>
        </div>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('should have no violations with createPressedProps', async () => {
      const { container } = render(
        <button {...createPressedProps(false)}>Toggle button</button>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('should have no violations with createSelectedProps', async () => {
      const { container } = render(
        <ul role="listbox" aria-label="Options">
          <li {...createSelectedProps(true)} role="option" tabIndex={0}>
            Selected option
          </li>
          <li {...createSelectedProps(false)} role="option" tabIndex={0}>
            Unselected option
          </li>
        </ul>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('should have no violations with createCheckedProps', async () => {
      const { container } = render(
        <div>
          <div {...createCheckedProps(true)} role="checkbox" tabIndex={0}>
            Checked
          </div>
          <div {...createCheckedProps(false)} role="checkbox" tabIndex={0}>
            Unchecked
          </div>
          <div {...createCheckedProps('mixed')} role="checkbox" tabIndex={0}>
            Mixed
          </div>
        </div>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('should have no violations with createDialogTriggerProps', async () => {
      const { container } = render(
        <button {...createDialogTriggerProps('dialog-1', false)}>
          Open dialog
        </button>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('should have no violations with createFormFieldProps', async () => {
      const { container } = render(
        <div>
          <label htmlFor="input-1">Email</label>
          <input
            id="input-1"
            {...createFormFieldProps(true, false)}
            type="email"
          />
        </div>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('should have no violations with createFormFieldProps invalid', async () => {
      const { container } = render(
        <div>
          <label htmlFor="input-2">Email</label>
          <input
            id="input-2"
            {...createFormFieldProps(true, true)}
            type="email"
            aria-invalid="true"
          />
          <span id="error-2" role="alert">
            Invalid email
          </span>
        </div>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('should have no violations with createDescribedByProps', async () => {
      const { container } = render(
        <div>
          <label htmlFor="input-help">Email</label>
          <input
            id="input-help"
            {...createDescribedByProps('help-text')}
            type="text"
          />
          <span id="help-text">Help text for the input</span>
        </div>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('should have no violations with createLabelledByProps', async () => {
      const { container } = render(
        <div>
          <h2 id="section-title">Section Title</h2>
          <div {...createLabelledByProps('section-title')} role="region">
            Section content
          </div>
        </div>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });
  });

  describe('mergeA11yProps', () => {
    it('should have no violations when merging props', async () => {
      const merged = mergeA11yProps(
        { role: 'button' },
        { 'aria-label': 'Close button' },
        { tabIndex: 0 }
      );

      const { container } = render(
        <button {...merged}>×</button>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('should have no violations with complex merges', async () => {
      const merged = mergeA11yProps(
        statusMessageProps,
        { 'aria-label': 'Status notification' }
      );

      const { container } = render(
        <div {...merged}>Operation completed</div>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });
  });

  describe('Screen Reader CSS Utilities', () => {
    it('should have no violations with srOnly content', async () => {
      const { container } = render(
        <div>
          <span style={srOnly}>Skip link text</span>
          <button>Main action</button>
        </div>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('should have no violations with srOnlyFocusable content', async () => {
      const { container } = render(
        <a href="#main" style={srOnlyFocusable}>Skip to main</a>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });
  });

  describe('Real-World Components', () => {
    describe('Accessible Accordion', () => {
      const Accordion = ({
        title,
        children,
        isOpen,
        onToggle,
        panelId,
      }: {
        title: string;
        children: React.ReactNode;
        isOpen: boolean;
        onToggle: () => void;
        panelId: string;
      }) => (
        <div>
          <h3>
            <button
              {...createDisclosureProps(isOpen, panelId)}
              onClick={onToggle}
              aria-controls={panelId}
            >
              {title}
            </button>
          </h3>
          <div
            id={panelId}
            role="region"
            aria-labelledby={`${panelId}-title`}
            hidden={!isOpen}
          >
            {children}
          </div>
        </div>
      );

      it('should have no violations when expanded', async () => {
        const { container } = render(
          <Accordion
            title="Section 1"
            isOpen={true}
            onToggle={() => {}}
            panelId="panel-1"
          >
            <p>Accordion content that is currently visible</p>
          </Accordion>
        );

        const results = await runAxe(container);
        expect(results.violations).toHaveLength(0);
      });

      it('should have no violations when collapsed', async () => {
        const { container } = render(
          <Accordion
            title="Section 2"
            isOpen={false}
            onToggle={() => {}}
            panelId="panel-2"
          >
            <p>Hidden content</p>
          </Accordion>
        );

        const results = await runAxe(container);
        expect(results.violations).toHaveLength(0);
      });
    });

    describe('Accessible Toast Notifications', () => {
      const Toast = ({
        message,
        type,
        autoDismiss = false,
      }: {
        message: string;
        type: 'success' | 'error' | 'info';
        autoDismiss?: boolean;
      }) => {
        const isError = type === 'error';
        const props = isError
          ? alertMessageProps
          : createLiveRegion({ live: 'polite', atomic: true });

        return (
          <div
            {...props}
            role="alert"
            aria-live={isError ? 'assertive' : 'polite'}
            data-testid="toast"
            className={`toast toast-${type}`}
          >
            {message}
          </div>
        );
      };

      it('should have no violations for error toast', async () => {
        const { container } = render(
          <Toast message="An error occurred" type="error" />
        );

        const results = await runAxe(container);
        expect(results.violations).toHaveLength(0);
      });

      it('should have no violations for success toast', async () => {
        const { container } = render(
          <Toast message="Operation successful" type="success" />
        );

        const results = await runAxe(container);
        expect(results.violations).toHaveLength(0);
      });

      it('should have no violations for info toast', async () => {
        const { container } = render(
          <Toast message="Information message" type="info" />
        );

        const results = await runAxe(container);
        expect(results.violations).toHaveLength(0);
      });
    });

    describe('Accessible Custom Checkbox', () => {
      const CustomCheckbox = ({
        checked,
        onChange,
        label,
        disabled = false,
      }: {
        checked: boolean | 'mixed';
        onChange: (checked: boolean) => void;
        label: string;
        disabled?: boolean;
      }) => {
        const handleClick = () => {
          if (!disabled && checked !== true) {
            onChange(true);
          } else if (!disabled) {
            onChange(false);
          }
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
          if ((e.key === ' ' || e.key === 'Enter') && !disabled) {
            handleClick();
          }
        };

      const checkboxProps = mergeA11yProps(
        createCheckedProps(checked),
        disabled ? disabledProps : {}
      );

        return (
          <div
            {...checkboxProps}
            role="checkbox"
            tabIndex={disabled ? -1 : 0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            aria-label={label}
            data-testid="custom-checkbox"
          >
            {typeof checked === 'string' ? checked : (checked ? '✓' : '')}
          </div>
        );
      };

      it('should have no violations when checked', async () => {
        const { container } = render(
          <CustomCheckbox checked={true} onChange={() => {}} label="Accept terms" />
        );

        const results = await runAxe(container);
        expect(results.violations).toHaveLength(0);
      });

      it('should have no violations when unchecked', async () => {
        const { container } = render(
          <CustomCheckbox checked={false} onChange={() => {}} label="Accept terms" />
        );

        const results = await runAxe(container);
        expect(results.violations).toHaveLength(0);
      });

      it('should have no violations when mixed', async () => {
        const { container } = render(
          <CustomCheckbox checked="mixed" onChange={() => {}} label="Accept terms" />
        );

        const results = await runAxe(container);
        expect(results.violations).toHaveLength(0);
      });

      it('should have no violations when disabled', async () => {
        const { container } = render(
          <CustomCheckbox checked={false} onChange={() => {}} label="Accept terms" disabled />
        );

        const results = await runAxe(container);
        expect(results.violations).toHaveLength(0);
      });
    });

    describe('Accessible Modal Dialog', () => {
      const Dialog = ({
        isOpen,
        onClose,
        title,
        children,
      }: {
        isOpen: boolean;
        onClose: () => void;
        title: string;
        children: React.ReactNode;
      }) => {
        const dialogId = 'my-dialog';
        const triggerProps = createDialogTriggerProps(dialogId, isOpen);

        if (!isOpen) return null;

        return (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-description"
            id={dialogId}
            data-testid="dialog"
          >
            <div className="dialog-header">
              <h2 id="dialog-title">{title}</h2>
              <button
                {...triggerProps}
                onClick={onClose}
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>
            <div id="dialog-description" className="dialog-content">
              {children}
            </div>
          </div>
        );
      };

      it('should have no violations when open', async () => {
        const { container } = render(
          <Dialog isOpen={true} onClose={() => {}} title="My Dialog">
            <p>This is the dialog content with important information.</p>
          </Dialog>
        );

        const results = await runAxe(container);
        expect(results.violations).toHaveLength(0);
      });

      it('should return null when closed', () => {
        const { container } = render(
          <Dialog isOpen={false} onClose={() => {}} title="My Dialog">
            <p>This should not be visible</p>
          </Dialog>
        );

        expect(container.firstChild).toBeNull();
      });
    });

    describe('Accessible Form with Validation', () => {
      const FormField = ({
        label,
        error,
        required,
        hint,
      }: {
        label: string;
        error?: string;
        required?: boolean;
        hint?: string;
      }) => {
        const inputId = 'form-input';
        const errorId = error ? 'error-message' : undefined;
        const hintId = hint ? 'hint-text' : undefined;

        return (
          <div>
            <label htmlFor={inputId}>{label}</label>
            <input
              id={inputId}
              {...createFormFieldProps(required ?? false, !!error)}
              {...(errorId && createDescribedByProps(errorId))}
              {...(hintId && createDescribedByProps(hintId))}
              data-testid="form-input"
            />
            {hint && (
              <span id={hintId} className="hint">
                {hint}
              </span>
            )}
            {error && (
              <span id={errorId} role="alert" className="error">
                {error}
              </span>
            )}
          </div>
        );
      };

      it('should have no violations for required field', async () => {
        const { container } = render(
          <FormField label="Email" required hint="We'll never share your email" />
        );

        const results = await runAxe(container);
        expect(results.violations).toHaveLength(0);
      });

      it('should have no violations for invalid field with error', async () => {
        const { container } = render(
          <FormField
            label="Email"
            error="Please enter a valid email address"
            required
          />
        );

        const results = await runAxe(container);
        expect(results.violations).toHaveLength(0);
      });

      it('should have no violations for optional field with hint', async () => {
        const { container } = render(
          <FormField
            label="Phone number"
            hint="Include country code"
          />
        );

        const results = await runAxe(container);
        expect(results.violations).toHaveLength(0);
      });
    });

    describe('Accessible Skip Link', () => {
    it('should have no violations for skip link', async () => {
      const { container } = render(
        <a {...createSkipLinkProps('main-content')}>
          Skip to main content
        </a>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('should have no violations in a page with skip link and main content', async () => {
      const { container } = render(
        <div>
          <a {...createSkipLinkProps('main')}>
            Skip to main content
          </a>
          <nav>Navigation</nav>
          <main id="main" tabIndex={-1}>
            <h1>Main Content</h1>
            <p>Page content</p>
          </main>
        </div>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });
    });
  });

  describe('Edge Cases and Advanced Patterns', () => {
    it('should have no violations with complex prop merging', async () => {
      const baseProps = createLiveRegion({ live: 'polite', atomic: true });
      const customProps = {
        'aria-label': 'Notification',
        role: 'status',
      };
      const merged = mergeA11yProps(baseProps, customProps);

      const { container } = render(
        <div {...merged}>Notification message</div>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('should have no violations with nested accessible components', async () => {
      const { container } = render(
        <div>
          <h1>Form</h1>
          <form>
            <div>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                type="text"
                required
                {...createFormFieldProps(true)}
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                required
                {...createFormFieldProps(true, true)}
                aria-describedby="email-error"
              />
              <span id="email-error" role="alert">
                Invalid email
              </span>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });

    it('should have no violations with all factory functions combined', async () => {
      const { container } = render(
        <div>
          <button
            {...mergeA11yProps(
              createPressedProps(true),
              createDialogTriggerProps('dialog-1', true),
              { 'aria-label': 'Open settings' }
            )}
          >
            Settings
          </button>
          <div
            id="dialog-1"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
            hidden
          >
            <h2 id="dialog-title">Settings</h2>
            <form>
              <div {...createFormFieldProps(true)}>
                <label>Option</label>
                <input type="checkbox" aria-checked="mixed" tabIndex={0} />
              </div>
            </form>
          </div>
        </div>
      );

      const results = await runAxe(container);
      expect(results.violations).toHaveLength(0);
    });
  });
});
