import * as ReactDOM from 'react-dom';

let _mountNode = null;

/**
 * Helper method for testing components that may use Portal and thus require cleanup.
 * This helper method renders components to a transient node that is destroyed after the test completes.
 * Note that rendering twice within the same test method will update the same element (rather than recreate it).
 */
export function render(markup) {
  if (!_mountNode) {
    _mountNode = document.createElement('div');

    // Unless we attach the mount-node to body, getBoundingClientRect() won't work
    document.body.appendChild(_mountNode);
  }

  return ReactDOM.render(markup, _mountNode);
}

/**
 * The render() method auto-unmounts components after each test has completed.
 * Use this method manually to test the componentWillUnmount() lifecycle method.
 */
render.unmount = function() {
  if (_mountNode) {
    ReactDOM.unmountComponentAtNode(_mountNode);

    if (_mountNode.parentNode) {
      _mountNode.parentNode.removeChild(_mountNode);
    }

    _mountNode = null;
  }
};

// Auto-cleanup after each test
if (typeof afterEach === 'function') {
  afterEach(() => {
    render.unmount();
  });
}
