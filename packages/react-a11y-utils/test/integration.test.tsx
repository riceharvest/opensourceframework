import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
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
import React from 'react';

// Helper component to test props application
interface TestPropsComponentProps {
  children: React.ReactNode;
  [key: string]: unknown;
}

const TestPropsComponent = ({ children, ...props }: TestPropsComponentProps) => {
  return <div data-testid="test-element" {...props}>{children}</div>;
};

describe('Integration Tests', () => {
  describe('Screen Reader CSS Utilities', () => {
    it('should apply srOnly styles correctly', () => {
      const { container } = render(
        <span style={srOnly}>Screen reader text</span>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.position).toBe('absolute');
      expect(element.style.width).toBe('1px');
      expect(element.style.height).toBe('1px');
      expect(element.style.overflow).toBe('hidden');
      expect(element.style.clip).toBe('rect(0px, 0px, 0px, 0px)');
      expect(element.style.whiteSpace).toBe('nowrap');
      expect(element.style.borderWidth).toBe('0px');
    });

    it('should apply srOnlyFocusable styles correctly', () => {
      const { container } = render(
        <a style={srOnlyFocusable}>Skip link</a>
      );

      const element = container.firstChild as HTMLElement;
      expect(element.style.position).toBe('absolute');
      expect(element.style.width).toBe('auto');
      expect(element.style.height).toBe('auto');
      expect(element.style.overflow).toBe('visible');
      expect(element.style.clip).toBe('auto');
      expect(element.style.whiteSpace).toBe('normal');
    });
  });

  describe('Pre-built Props Integration', () => {
    it('should apply decorative props to hide from screen readers', () => {
      render(<TestPropsComponent {...decorative}>Decorative</TestPropsComponent>);

      const element = screen.getByTestId('test-element');
      expect(element.getAttribute('aria-hidden')).toBe('true');
    });

    it('should apply disabledProps correctly', () => {
      render(<TestPropsComponent {...disabledProps}>Disabled</TestPropsComponent>);

      const element = screen.getByTestId('test-element');
      expect(element.getAttribute('aria-disabled')).toBe('true');
      expect(element.getAttribute('tabindex')).toBe('-1');
    });

    it('should apply statusMessageProps correctly', () => {
      render(<TestPropsComponent {...statusMessageProps}>Status</TestPropsComponent>);

      const element = screen.getByTestId('test-element');
      expect(element.getAttribute('role')).toBe('status');
      expect(element.getAttribute('aria-live')).toBe('polite');
    });

    it('should apply alertMessageProps correctly', () => {
      render(<TestPropsComponent {...alertMessageProps}>Alert</TestPropsComponent>);

      const element = screen.getByTestId('test-element');
      expect(element.getAttribute('role')).toBe('alert');
      expect(element.getAttribute('aria-live')).toBe('assertive');
    });
  });

  describe('Factory Functions Integration', () => {
    describe('createLiveRegion', () => {
      it('should create live region with default options', () => {
        const props = createLiveRegion();
        render(<TestPropsComponent {...props}>Live content</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('aria-live')).toBe('polite');
        expect(element.getAttribute('aria-atomic')).toBe('false');
        expect(element.getAttribute('aria-relevant')).toBe('additions');
        expect(element.getAttribute('aria-busy')).toBe('false');
      });

      it('should create live region with custom options', () => {
        const props = createLiveRegion({
          atomic: true,
          live: 'assertive',
          relevant: 'all',
          busy: true,
        });
        render(<TestPropsComponent {...props}>Live content</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('aria-live')).toBe('assertive');
        expect(element.getAttribute('aria-atomic')).toBe('true');
        expect(element.getAttribute('aria-relevant')).toBe('all');
        expect(element.getAttribute('aria-busy')).toBe('true');
      });
    });

    describe('createSkipLinkProps', () => {
      it('should create skip link with correct href and tabIndex', () => {
        const props = createSkipLinkProps('main-content');
        render(<a {...props}>Skip to main content</a>);

        const link = screen.getByText('Skip to main content');
        expect(link.getAttribute('href')).toBe('#main-content');
        expect(link.getAttribute('tabindex')).toBe('0');
      });
    });

    describe('createDisclosureProps', () => {
      it('should create disclosure props for expanded state', () => {
        const props = createDisclosureProps(true, 'panel-1');
        render(<TestPropsComponent {...props}>Toggle</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('aria-expanded')).toBe('true');
        expect(element.getAttribute('aria-controls')).toBe('panel-1');
      });

      it('should create disclosure props for collapsed state', () => {
        const props = createDisclosureProps(false, 'panel-1');
        render(<TestPropsComponent {...props}>Toggle</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('aria-expanded')).toBe('false');
        expect(element.getAttribute('aria-controls')).toBe('panel-1');
      });
    });

    describe('createPressedProps', () => {
      it('should create pressed props for pressed state', () => {
        const props = createPressedProps(true);
        render(<TestPropsComponent {...props}>Toggle</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('aria-pressed')).toBe('true');
      });

      it('should create pressed props for unpressed state', () => {
        const props = createPressedProps(false);
        render(<TestPropsComponent {...props}>Toggle</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('aria-pressed')).toBe('false');
      });
    });

    describe('createSelectedProps', () => {
      it('should create selected props for selected state', () => {
        const props = createSelectedProps(true);
        render(<TestPropsComponent {...props}>Option</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('aria-selected')).toBe('true');
      });

      it('should create selected props for unselected state', () => {
        const props = createSelectedProps(false);
        render(<TestPropsComponent {...props}>Option</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('aria-selected')).toBe('false');
      });
    });

    describe('createCheckedProps', () => {
      it('should create checked props for checked state', () => {
        const props = createCheckedProps(true);
        render(<TestPropsComponent {...props}>Checkbox</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('aria-checked')).toBe('true');
      });

      it('should create checked props for unchecked state', () => {
        const props = createCheckedProps(false);
        render(<TestPropsComponent {...props}>Checkbox</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('aria-checked')).toBe('false');
      });

      it('should create checked props for mixed state', () => {
        const props = createCheckedProps('mixed');
        render(<TestPropsComponent {...props}>Checkbox</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('aria-checked')).toBe('mixed');
      });
    });

    describe('createDialogTriggerProps', () => {
      it('should create dialog trigger props for closed dialog', () => {
        const props = createDialogTriggerProps('my-dialog', false);
        render(<TestPropsComponent {...props}>Open Dialog</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('aria-haspopup')).toBe('dialog');
        expect(element.getAttribute('aria-controls')).toBe('my-dialog');
        expect(element.getAttribute('aria-expanded')).toBe('false');
      });

      it('should create dialog trigger props for open dialog', () => {
        const props = createDialogTriggerProps('my-dialog', true);
        render(<TestPropsComponent {...props}>Open Dialog</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('aria-haspopup')).toBe('dialog');
        expect(element.getAttribute('aria-controls')).toBe('my-dialog');
        expect(element.getAttribute('aria-expanded')).toBe('true');
      });
    });

    describe('createFormFieldProps', () => {
      it('should create form field props for required field', () => {
        const props = createFormFieldProps(true);
        render(<TestPropsComponent {...props}>Input</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('aria-required')).toBe('true');
        expect(element.getAttribute('aria-invalid')).toBeNull();
      });

      it('should create form field props for optional field', () => {
        const props = createFormFieldProps(false);
        render(<TestPropsComponent {...props}>Input</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('aria-required')).toBe('false');
        expect(element.getAttribute('aria-invalid')).toBeNull();
      });

      it('should create form field props with invalid state', () => {
        const props = createFormFieldProps(true, true);
        render(<TestPropsComponent {...props}>Input</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('aria-required')).toBe('true');
        expect(element.getAttribute('aria-invalid')).toBe('true');
      });

      it('should create form field props with invalid but not required', () => {
        const props = createFormFieldProps(false, true);
        render(<TestPropsComponent {...props}>Input</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('aria-required')).toBe('false');
        expect(element.getAttribute('aria-invalid')).toBe('true');
      });
    });

    describe('createDescribedByProps', () => {
      it('should create describedby props', () => {
        const props = createDescribedByProps('error-message');
        render(<TestPropsComponent {...props}>Input</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('aria-describedby')).toBe('error-message');
      });
    });

    describe('createLabelledByProps', () => {
      it('should create labelledby props', () => {
        const props = createLabelledByProps('label-text');
        render(<TestPropsComponent {...props}>Content</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('aria-labelledby')).toBe('label-text');
      });
    });

    describe('mergeA11yProps', () => {
      it('should merge multiple props objects', () => {
        const merged = mergeA11yProps(
          { role: 'button' },
          { 'aria-label': 'Test button' },
          { tabIndex: 0 }
        );
        render(<TestPropsComponent {...merged}>Merged</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('role')).toBe('button');
        expect(element.getAttribute('aria-label')).toBe('Test button');
        expect(element.getAttribute('tabindex')).toBe('0');
      });

      it('should override earlier props with later ones', () => {
        const merged = mergeA11yProps(
          { 'aria-label': 'First label' },
          { 'aria-label': 'Second label' }
        );
        render(<TestPropsComponent {...merged}>Merged</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element.getAttribute('aria-label')).toBe('Second label');
      });

      it('should handle empty arguments', () => {
        const merged = mergeA11yProps();
        render(<TestPropsComponent {...merged}>Empty</TestPropsComponent>);

        const element = screen.getByTestId('test-element');
        expect(element).toHaveTextContent('Empty');
      });

      it('should not mutate original props', () => {
        const original = { 'aria-label': 'Original' };
        const additional = { 'aria-label': 'Additional' };
        const merged = mergeA11yProps(original, additional);

        expect(original).toEqual({ 'aria-label': 'Original' });
        expect(merged).not.toBe(original);
      });
    });
  });

  describe('Real-World Component Examples', () => {
    describe('Accordion Component', () => {
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
          <div id={panelId} role="region" hidden={!isOpen}>
            {children}
          </div>
        </div>
      );

      it('should render accessible accordion', () => {
      render(
        <Accordion
          title="Section 1"
          isOpen={true}
          onToggle={() => {}}
          panelId="panel-1"
        >
          <p>Accordion content</p>
        </Accordion>
      );

      const button = screen.getByRole('button', { name: 'Section 1' });
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(button).toHaveAttribute('aria-controls', 'panel-1');

      const region = screen.getByRole('region');
      expect(region).toHaveAttribute('id', 'panel-1');
      expect(region).not.toHaveAttribute('hidden');
      });

      it('should render collapsed accordion', () => {
        render(
          <Accordion
            title="Section 2"
            isOpen={false}
            onToggle={() => {}}
            panelId="panel-2"
          >
            <p>Hidden content</p>
          </Accordion>
        );

        const button = screen.getByRole('button', { name: 'Section 2' });
        expect(button).toHaveAttribute('aria-expanded', 'false');
        expect(button).toHaveAttribute('aria-controls', 'panel-2');

        // The region should be hidden and not in the accessibility tree
        expect(screen.queryByRole('region')).toBeNull();
        // But the panel element should exist in the DOM with hidden attribute
        const panel = document.getElementById('panel-2');
        expect(panel).toBeInTheDocument();
        expect(panel).toHaveAttribute('hidden');
      });
    });

    describe('Toast Notification Component', () => {
      interface ToastProps {
        message: string;
        type: 'success' | 'error' | 'info';
      }

      const Toast = ({ message, type }: ToastProps) => {
        const props = type === 'error'
          ? alertMessageProps
          : createLiveRegion({ live: 'polite' });

        return (
          <div
            {...props}
            role="alert"
            data-testid="toast"
            className={`toast toast-${type}`}
          >
            {message}
          </div>
        );
      };

      it('should render error toast with assertive live region', () => {
        render(<Toast message="Error occurred" type="error" />);

        const toast = screen.getByTestId('toast');
        expect(toast).toHaveAttribute('role', 'alert');
        expect(toast).toHaveAttribute('aria-live', 'assertive');
      });

      it('should render info toast with polite live region', () => {
        render(<Toast message="Info message" type="info" />);

        const toast = screen.getByTestId('toast');
        expect(toast).toHaveAttribute('aria-live', 'polite');
        expect(toast).toHaveAttribute('aria-atomic', 'false');
      });

      it('should render success toast with polite live region', () => {
        render(<Toast message="Success!" type="success" />);

        const toast = screen.getByTestId('toast');
        expect(toast).toHaveAttribute('aria-live', 'polite');
      });
    });

    describe('Custom Checkbox Component', () => {
      const CustomCheckbox = ({
        checked,
        onChange,
        children,
      }: {
        checked: boolean | 'mixed';
        onChange: (checked: boolean) => void;
        children: React.ReactNode;
      }) => {
        const handleClick = () => {
          if (checked !== true) {
            onChange(true);
          } else {
            onChange(false);
          }
        };

        const handleKeyDown = (e: React.KeyboardEvent) => {
          if (e.key === ' ' || e.key === 'Enter') {
            handleClick();
          }
        };

        return (
          <div
            {...createCheckedProps(checked)}
            role="checkbox"
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            data-testid="custom-checkbox"
          >
            {typeof checked === 'string' ? checked : (checked ? '✓' : '')}
            {children}
          </div>
        );
      };

      it('should render checked custom checkbox', () => {
        render(<CustomCheckbox checked={true} onChange={() => {}}>Accept terms</CustomCheckbox>);

        const checkbox = screen.getByTestId('custom-checkbox');
        expect(checkbox).toHaveAttribute('role', 'checkbox');
        expect(checkbox).toHaveAttribute('tabindex', '0');
        expect(checkbox).toHaveAttribute('aria-checked', 'true');
      });

      it('should render unchecked custom checkbox', () => {
        render(<CustomCheckbox checked={false} onChange={() => {}}>Accept terms</CustomCheckbox>);

        const checkbox = screen.getByTestId('custom-checkbox');
        expect(checkbox).toHaveAttribute('aria-checked', 'false');
      });

      it('should render mixed/indeterminate custom checkbox', () => {
        render(<CustomCheckbox checked="mixed" onChange={() => {}}>Accept terms</CustomCheckbox>);

        const checkbox = screen.getByTestId('custom-checkbox');
        expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
      });
    });

    describe('Modal Dialog Component', () => {
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
            <div className="dialog-content">
              {children}
            </div>
          </div>
        );
      };

      it('should render accessible dialog when open', () => {
        render(
          <Dialog isOpen={true} onClose={() => {}} title="My Dialog">
            <p>Dialog content</p>
          </Dialog>
        );

        const dialog = screen.getByTestId('dialog');
        expect(dialog).toHaveAttribute('role', 'dialog');
        expect(dialog).toHaveAttribute('aria-modal', 'true');
        expect(dialog).toHaveAttribute('aria-labelledby', 'dialog-title');
        expect(dialog).toHaveAttribute('id', 'my-dialog');

        const closeButton = screen.getByLabelText('Close dialog');
        expect(closeButton).toHaveAttribute('aria-expanded', 'true');
        expect(closeButton).toHaveAttribute('aria-haspopup', 'dialog');
      });

      it('should return null when dialog is closed', () => {
        render(
          <Dialog isOpen={false} onClose={() => {}} title="My Dialog">
            <p>Dialog content</p>
          </Dialog>
        );

        expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
      });
    });

    describe('Form with Validation', () => {
      const FormField = ({
        label,
        error,
        required,
      }: {
        label: string;
        error?: string;
        required?: boolean;
      }) => {
        const inputId = 'form-input';
        const errorId = error ? 'error-message' : undefined;

        return (
          <div>
            <label htmlFor={inputId}>{label}</label>
            <input
              id={inputId}
              {...createFormFieldProps(required ?? false, !!error)}
              {...(errorId && createDescribedByProps(errorId))}
              data-testid="form-input"
            />
            {error && (
              <span id="errorId" role="alert" data-testid="error-message">
                {error}
              </span>
            )}
          </div>
        );
      };

      it('should render required form field', () => {
        render(<FormField label="Email" required />);

        const input = screen.getByTestId('form-input');
        expect(input).toHaveAttribute('aria-required', 'true');
        expect(input).not.toHaveAttribute('aria-invalid');
      });

      it('should render invalid form field with error', () => {
        render(<FormField label="Email" error="Email is required" required />);

        const input = screen.getByTestId('form-input');
        expect(input).toHaveAttribute('aria-required', 'true');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveAttribute('aria-describedby', 'error-message');

        const error = screen.getByTestId('error-message');
        expect(error).toHaveAttribute('role', 'alert');
      });
    });
  });
});
