function ContainerAccessor(params) {
  const paddings = params.extraPadding || {
    left: 0,
    top: 0,
  };

  const offsetLeft = () => params.offsets.left;
  const offsetTop = () => params.offsets.top;
  
  const height = () => params.dimensions.height;

  const width = () => params.dimensions.width;

  const paddingLeft = () => paddings.left;
  const paddingTop = () => paddings.top;

  return Object.freeze({
    height,
    width,
    offsetLeft,
    offsetTop,
    paddingLeft,
    paddingTop,
  });
};

export default ContainerAccessor;
