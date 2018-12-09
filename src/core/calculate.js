import { getClientY } from '../utils/events';

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
