function SelectionAccessor(params) {
  const x = () => params.coordinates.x;

  const y = () => params.coordinates.y;

  const height = () => params.dimensions.height;

  const width = () => params.dimensions.width;

  return Object.freeze({
    x,
    y,
    height,
    width,
  });
}

export default SelectionAccessor;
