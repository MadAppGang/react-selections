function ContainerAccessor(params) {
  const paddings = params.extraPadding || { left: 0 };

  const offsetLeft = () => params.offsets.left;
  
  const height = () => params.dimensions.height;

  const width = () => params.dimensions.width;

  const paddingLeft = () => paddings.left;

  return Object.freeze({
    height,
    width,
    offsetLeft,
    paddingLeft,
  });
};

export default ContainerAccessor;
