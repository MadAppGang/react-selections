import { getClientY } from './utils/events';

const replaceSecondWith = nextArg => (arg, i) => {
  if (i !== 1) return arg;

  return nextArg;
};

export const calculateRightSideResize = (...args) => {
  const [event, selectionParameters, containerParameters] = args;
  const {
    coordinates: { y, x },
    dimensions: { width, height },
  } = selectionParameters;
  const {
    offsets: { left: containerLeftBorder },
    dimensions: { width: containerWidth },
    extraPadding = { left: 0 },
  } = containerParameters;
  const innerX = x - extraPadding.left;
  const { clientX } = event;
  const boxRightBorder = innerX + width;
  const eventXWithinContainer = clientX - containerLeftBorder;
  const differenceBetweenOldBorder = eventXWithinContainer - boxRightBorder;
  let nextWidth;

  const tooCloseToLeft = eventXWithinContainer - innerX <= 10;

  if (tooCloseToLeft) return selectionParameters;

  if (eventXWithinContainer > containerWidth) {
    nextWidth = containerWidth - innerX;
  } else {
    nextWidth = width + differenceBetweenOldBorder;
  }

  return {
    dimensions: { width: nextWidth, height },
    coordinates: { x, y },
  };
};

export const calculateLeftSideResize = (...args) => {
  const [event, selectionParameters, containerParameters] = args;
  const {
    coordinates: { y, x },
    dimensions: { width, height },
  } = selectionParameters;
  const {
    offsets: { left: containerLeftBorder },
    extraPadding = { left: 0 },
  } = containerParameters;
  const innerX = x - extraPadding.left;
  const { clientX } = event;
  const boxRightBorder = innerX + width;
  const eventXWithinContainer = clientX - containerLeftBorder;
  const differenceBetweenOldBorder = eventXWithinContainer - innerX;
  let nextX;
  let nextWidth;

  const tooCloseToRight = boxRightBorder - eventXWithinContainer <= 10;

  if (tooCloseToRight) return selectionParameters;

  if (eventXWithinContainer <= 0) {
    nextX = 0;
    nextWidth = boxRightBorder;
  } else {
    nextX = innerX + differenceBetweenOldBorder;
    nextWidth = width - differenceBetweenOldBorder;
  }

  return {
    dimensions: { width: nextWidth, height },
    coordinates: { x: nextX + extraPadding.left, y },
  };
};

export const calculateBottomSideResize = (...args) => {
  const [event, selectionParameters, containerParameters] = args;
  const {
    coordinates: { x, y },
    dimensions: { width, height },
  } = selectionParameters;
  const {
    offsets: { top: containerTopBorder },
    dimensions: { height: containerHeight },
    extraPadding = { top: 0 },
  } = containerParameters;
  const innerY = y - extraPadding.top;
  const clientY = getClientY(event);
  const eventYWithinContainer = clientY - containerTopBorder;
  const boxBottomBorder = innerY + height;
  const differenceBetweenOldBorder = eventYWithinContainer - boxBottomBorder;
  let nextHeight;

  const tooCloseToTop = eventYWithinContainer - innerY <= 10;

  if (tooCloseToTop) return selectionParameters;

  if (eventYWithinContainer > containerHeight) {
    nextHeight = containerHeight - innerY;
  } else {
    nextHeight = height + differenceBetweenOldBorder;
  }

  return {
    coordinates: { x, y },
    dimensions: { height: nextHeight, width },
  };
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

  if (tooCloseToBottom) return selectionParameters;

  if (eventYWithinContainer <= 0) {
    nextHeight = selectionBottomBorder;
    nextY = 0;
  } else {
    nextHeight = height + differenceBetweenOldBorder;
    nextY = innerY - differenceBetweenOldBorder;
  }

  return {
    coordinates: { x, y: nextY + extraPadding.top },
    dimensions: { width, height: nextHeight },
  };
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

  return { x: x + extraPadding.left, y: y + extraPadding.top };
};

export const calculateRotatedVertex = (vertexCoors, centerCoors, angle) => {
  const a = -angle * (Math.PI / 180);
  const rotatedX = (centerCoors.x + ((vertexCoors.x - centerCoors.x)
    * Math.cos(a))) - ((vertexCoors.y - centerCoors.y) * Math.sin(a));
  const rotatedY = centerCoors.y + ((vertexCoors.y - centerCoors.y)
    * Math.cos(a)) + ((vertexCoors.x - centerCoors.x) * Math.sin(a));
  return { x: rotatedX, y: rotatedY };
};
