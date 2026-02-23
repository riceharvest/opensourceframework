//      
'no babel-plugin-flow-react-proptypes';

import {
  requestAnimationTimeout,
  cancelAnimationTimeout,
} from '../../utils/requestAnimationTimeout';
                                                       

let mountedInstances = [];
let originalBodyPointerEvents = null;
let disablePointerEventsTimeoutId = null;

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

function isWindow(obj) {
  if (!obj) return false;
  return (
    obj === window ||
    obj.constructor.name === 'Window' ||
    typeof obj.scrollTo === 'function'
  );
}

function onScrollWindow(event       ) {
  const currentTargetIsWindow = isWindow(event.currentTarget);

  if (
    currentTargetIsWindow &&
    originalBodyPointerEvents == null &&
    document.body
  ) {
    originalBodyPointerEvents = document.body.style.pointerEvents;

    document.body.style.pointerEvents = 'none';
  }
  enablePointerEventsAfterDelay();
  mountedInstances.forEach(instance => {
    const scrollElement = instance.props.scrollElement;
    const isInstanceScrollElementWindow = isWindow(scrollElement);

    if (
      scrollElement === event.currentTarget ||
      (currentTargetIsWindow && isInstanceScrollElementWindow)
    ) {
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
    element.addEventListener('scroll', onScrollWindow);
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
  if (!mountedInstances.length) {
    element.removeEventListener('scroll', onScrollWindow);
    if (disablePointerEventsTimeoutId) {
      cancelAnimationTimeout(disablePointerEventsTimeoutId);
      enablePointerEventsIfDisabled();
    }
  }
}
