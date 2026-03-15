//      
'no babel-plugin-flow-react-proptypes';

import {
  requestAnimationTimeout,
  cancelAnimationTimeout,
} from '../../utils/requestAnimationTimeout';
                                                       

let mountedInstances = [];
let originalBodyPointerEvents = null;
let disablePointerEventsTimeoutId = null;

const isWindow = element => element === window;

const getScrollEventTargets = element =>
  isWindow(element) ? [window, document] : [element];

function enablePointerEventsIfDisabled() {
  if (disablePointerEventsTimeoutId) {
    disablePointerEventsTimeoutId = null;

    if (document.body && originalBodyPointerEvents != null) {
      document.body.style.pointerEvents = originalBodyPointerEvents;
    }

    originalBodyPointerEvents = null;
  }
}

function enablePointerEventsAfterDelayCallback() {
  enablePointerEventsIfDisabled();
  mountedInstances.forEach(instance => instance.__resetIsScrolling());
}

function enablePointerEventsAfterDelay() {
  if (disablePointerEventsTimeoutId) {
    cancelAnimationTimeout(disablePointerEventsTimeoutId);
  }

  var maximumTimeout = 0;
  mountedInstances.forEach(instance => {
    maximumTimeout = Math.max(
      maximumTimeout,
      instance.props.scrollingResetTimeInterval,
    );
  });

  disablePointerEventsTimeoutId = requestAnimationTimeout(
    enablePointerEventsAfterDelayCallback,
    maximumTimeout,
  );
}

function onScrollWindow(event       ) {
  const currentTarget =
    event.currentTarget === document ? window : event.currentTarget;

  if (
    currentTarget === window &&
    originalBodyPointerEvents == null &&
    document.body
  ) {
    originalBodyPointerEvents = document.body.style.pointerEvents;

    document.body.style.pointerEvents = 'none';
  }
  enablePointerEventsAfterDelay();
  mountedInstances.forEach(instance => {
    if (instance.props.scrollElement === currentTarget) {
      instance.__handleWindowScrollEvent();
    }
  });
}

export function registerScrollListener(
  component                ,
  element         ,
) {
  if (
    !mountedInstances.some(instance => instance.props.scrollElement === element)
  ) {
    getScrollEventTargets(element).forEach(target => {
      target.addEventListener('scroll', onScrollWindow);
    });
  }
  mountedInstances.push(component);
}

export function unregisterScrollListener(
  component                ,
  element         ,
) {
  mountedInstances = mountedInstances.filter(
    instance => instance !== component,
  );
  if (!mountedInstances.some(instance => instance.props.scrollElement === element)) {
    getScrollEventTargets(element).forEach(target => {
      target.removeEventListener('scroll', onScrollWindow);
    });
  }

  if (!mountedInstances.length) {
    if (disablePointerEventsTimeoutId) {
      cancelAnimationTimeout(disablePointerEventsTimeoutId);
      enablePointerEventsIfDisabled();
    }
  }
}
