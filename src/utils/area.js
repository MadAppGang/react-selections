export const calculateArea = (dimensions) => {
  if (typeof dimensions !== 'object') {
    return null;
  }

  const { width, height } = dimensions;

  return (width * height) || null;
}

export const getSelectionOffsetsFrom = (point) => {
  return function getSelectionOffsets(element) {
    const { left, top } = element.getBoundingClientRect();

    return Object.freeze({
      left: left + point.x,
      top: top + point.y,
    });
  };
};


export const getSelectionOffsets = getSelectionOffsetsFrom({
  x: window.pageXOffset,
  y: window.pageYOffset,
});
