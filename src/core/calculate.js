import { getClientY } from '../utils/events';

const replaceSecondWith = nextArg => (arg, i) => {
  if (i !== 1) return arg;

  return nextArg;
};

export const calculateTopSideResize = (...args) => {
  const [event, selectionParameters, containerParameters] = args;

  const {
    coordinates: { x, y },
    dimensions: { width, height },
  } = selectionParameters;

  const {
    offsets: { top: containerTopBorder },
    extraPadding = { top: 0 },
  } = containerParameters;

  const innerY = y - extraPadding.top;
  const clientY = getClientY(event);
  const selectionBottomBorder = innerY + height;
  const eventYWithinContainer = clientY - containerTopBorder;
  const differenceBetweenOldBorder = innerY - eventYWithinContainer;

  let nextHeight;
  let nextY;

  const tooCloseToBottom = selectionBottomBorder - eventYWithinContainer <= 10;

  if (tooCloseToBottom) {
    return selectionParameters;
  }

  if (eventYWithinContainer <= 0) {
    nextHeight = selectionBottomBorder;
    nextY = 0;
  } else {
    nextHeight = height + differenceBetweenOldBorder;
    nextY = innerY - differenceBetweenOldBorder;
  }

  return Object.freeze({
    coordinates: { x, y: nextY + extraPadding.top },
    dimensions: { width, height: nextHeight },
  });
};

export const calculateBottomLeftSidesResize = (...args) => {
  const nextSelectionParams = calculateBottomSideResize(...args);
  const nextArgs = args.map(replaceSecondWith(nextSelectionParams));

  return calculateLeftSideResize(...nextArgs);
};

export const calculateBottomRightSidesResize = (...args) => {
  const nextSelectionParams = calculateBottomSideResize(...args);
  const nextArgs = args.map(replaceSecondWith(nextSelectionParams));

  return calculateRightSideResize(...nextArgs);
};

export const calculateTopLeftSidesResize = (...args) => {
  const nextSelectionParams = calculateTopSideResize(...args);
  const nextArgs = args.map(replaceSecondWith(nextSelectionParams));

  return calculateLeftSideResize(...nextArgs);
};

export const calculateTopRightSidesResize = (...args) => {
  const updatedSelectionParams = calculateTopSideResize(...args);
  const nextArgs = args.map(replaceSecondWith(updatedSelectionParams));

  return calculateRightSideResize(...nextArgs);
};

export const calculateDragSelection = (...args) => {
  const [event, selectionParameters, innerOffsets, containerParameters] = args;

  const {
    dimensions: {
      height, width,
    },
  } = selectionParameters;

  const {
    offsets: {
      left: containerLeftBorder,
      top: containerTopBorder
    },
    dimensions: {
      width: containerWidth,
      height: containerHeight,
    },
    extraPadding = { left: 0, top: 0 },
  } = containerParameters;

  const { clientX } = event;
  const clientY = getClientY(event);

  let x = clientX - containerLeftBorder - innerOffsets.left;
  let y = clientY - containerTopBorder - innerOffsets.top;

  y = y < 0 ? 0 : y;
  x = x < 0 ? 0 : x;

  if (x + width > containerWidth) {
    x = containerWidth - width;
  }

  if (y + height > containerHeight) {
    y = containerHeight - height;
  }

  return Object.freeze({
    x: x + extraPadding.left,
    y: y + extraPadding.top
  });
};
